import { getColorSeed } from '../utils/color';

export const ColorSeedDialogMixin = {
  data() {
    return {
      value: getColorSeed(),
      originalValue: getColorSeed(),
      status: 'success',
      submitting: false,
    };
  },
  mounted() {
    const inputEl = this.$refs.input.$el;
    // noinspection JSUnresolvedFunction
    inputEl.focus();
    // noinspection JSUnresolvedFunction
    inputEl.select();
  },
  methods: {
    submit(event) {
      if (event != null) {
        event.preventDefault();
      }
      if (/^[0-9]{1,10}$/.test(this.value)) {
        this.submitting = true;
        this.$emit('ok');
        this.$store.dispatch('setColorSeed', parseInt(this.value)).then(() => {
          this.submitting = false;
        });
      }
      return false;
    },
    validate() {
      this.status = /^[0-9]{1,10}$/.test(this.value) ? 'success' : 'error';
    },
    useRandomNumber() {
      this.value = Math.floor(Math.random() * 99999).toString();
      this.submit();
      this.$message.success(`已将“${this.value}”设置为色彩随机种子。`);
    },
    reset() {
      this.value = '2';
      this.submit();
      this.$message.success(`已将“2”设置为色彩随机种子。`);
    },
  },
};
