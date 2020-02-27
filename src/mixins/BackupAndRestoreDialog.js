import pako from 'pako';
import saveAs from 'file-saver';
import CryptoJS from 'crypto-js';

export const BackupAndRestoreDialogMixin = {
  data() {
    return {
      restoreEncrypted: '',
      errorMsg: null,
      decoded: null,
      submitting: false,
    };
  },
  computed: {
    key() {
      return CryptoJS.SHA1(
        this.$store.state.trimester,
      ).toString();
    },
    dataString() {
      let str = `${this.$store.state.allClassesHash}:${this.$store.getters.currentData}`;
      return `${CryptoJS.SHA1(str).toString().substr(0, 8)}:${str}`;
    },
    data() {
      let wa = CryptoJS.lib.WordArray;
      wa.init(pako.deflate(this.dataString));
      return {
        datetime: new Date().toLocaleString(),
        encrypted: CryptoJS.AES.encrypt(wa, this.key).toString(),
      };
    },
    text() {
      return `${this.$store.state.trimester} #${this.data.encrypted}# 备份时间 ${this.data.datetime}`;
    },
  },
  watch: {
    restoreEncrypted() {
      if (this.restoreEncrypted !== '') {
        let extracted = null;
        const re = /#([A-za-z0-9+/=]+?)#/g;
        let reResult = re.exec(this.restoreEncrypted);
        while (reResult != null) {
          if (extracted == null) {
            extracted = reResult[1];
          } else {
            this.errorMsg = '上传/粘贴了多段#......#格式的数据，请只保留一个。';
            this.decoded = null;
            return;
          }
          reResult = re.exec(this.restoreEncrypted);
        }
        if (extracted == null) {
          if (/^[A-za-z0-9+/=]+$/.test(this.restoreEncrypted)) {
            extracted = this.restoreEncrypted;
          } else {
            this.errorMsg = '上传/粘贴的数据格式有误。';
            this.decoded = null;
            return;
          }
        }
        try {
          const wa = CryptoJS.AES.decrypt(
            extracted,
            this.key,
          );
          // noinspection ALL
          const result = pako.inflate(Uint8Array.from(Buffer.from(wa.toString(CryptoJS.enc.Hex), 'hex')), {to: 'string'});
          if (!/^[0-9a-f]{8}:[0-9a-f]{8}:/.test(result)) {
            this.errorMsg = '数据不完整，请检查并重新上传/粘贴。';
            this.decoded = null;
          } else if (CryptoJS.SHA1(result.substr(9)).toString().substr(0, 8) !== result.substr(0, 8)) {
            this.errorMsg = '数据不完整，请检查并重新上传/粘贴。';
            this.decoded = null;
          } else if (result === this.dataString) {
            this.errorMsg = '上传/粘贴的是当前的数据！';
            this.decoded = null;
          } else {
            this.errorMsg = null;
            this.decoded = result.substr(9);
          }
        } catch (e) {
          this.errorMsg = '上传/粘贴的数据无效，或者不是同一学期的数据。';
          this.decoded = null;
        }
      } else {
        this.errorMsg = null;
        this.decoded = null;
      }
    },
  },
  methods: {
    submit(event) {
      if (event != null) {
        event.preventDefault();
      }
      if (!this.submitting && this.errorMsg == null && this.decoded != null) {
        this.submitting = true;
        (async () => {
          const trimester = this.$store.state.trimester;
          const data = await this.$store.dispatch('checkUpdateAllClasses');
          if (trimester !== this.$store.state.trimester) {
            await this.$store.dispatch('updateAllClasses', data);
            // noinspection ES6MissingAwait
            this.$message.info('学期信息变更，无法恢复备份的数据！');
            return;
          } else if (data != null) {
            await this.$store.dispatch('updateAllClasses', data);
          }
          const currentData = this.$store.getters.currentData;
          let changeList = await this.$store.dispatch('updateFromBackup', this.decoded);
          if (changeList.length > 0) {
            this.showChangeList(changeList);
          }
          if (currentData === this.$store.getters.currentData) {
            // noinspection ES6MissingAwait
            this.$message.info('已从备份中恢复，但数据没有发生改变。');
          } else {
            // noinspection ES6MissingAwait
            this.$message.success('已从备份中恢复，你可以撤销此操作。');
          }
        })().then(() => {
          this.$emit('ok');
        }).catch(() => {
          this.$message.error('恢复备份的时候出现了问题，请检查网络连接后重试。');
        }).finally(() => {
          this.submitting = false;
        });
      }
      return false;
    },
    upload(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (event) => {
          this.restoreEncrypted = event.target.result;
          this.$nextTick(() => {
            this.submit();
            reject();
          });
        };
        reader.readAsText(file);
      });
    },
    download() {
      // noinspection JSCheckFunctionSignatures
      const blob = new Blob([this.data.encrypted], {type: 'text/plain;charset=utf-8'});
      saveAs(blob, `${this.data.datetime}-${this.$store.state.trimester}-排课备份.txt`);
    },
    handleCopied() {
      this.$message.success('复制成功！');
      // noinspection JSUnresolvedFunction
      this.$refs.restoreEncrypted.$el.focus();
    },
    handleCopyError() {
      this.$message.error('复制失败，请手动复制！');
      // noinspection JSUnresolvedFunction
      this.$refs.restoreEncrypted.$el.focus();
    },
  },
};
