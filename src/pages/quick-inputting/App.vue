<template>
  <a-locale-provider :locale="zh_CN">
    <div class="quick-inputting-list">
      <a-config-provider>
        <template slot="renderEmpty">
          <a-empty description="没有已选的课程" />
        </template>
        <a-list :data-source="selectedClassesList" item-layout="vertical">
          <!--suppress CommaExpressionJS -->
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta>
              <div slot="title">
                <a-badge :count="`${item.credit}学分`" class="credit-badge" />
                {{ item.courseName }}
              </div>
              <div slot="description">
                <div class="class-info">
                  {{ item.classTime }}
                  <a-divider type="vertical" />
                  {{ item.teacherName }}
                </div>
                <div @mouseenter="handleInputWrapperMouseenter" class="input-wrapper">
                  <a-input
                    @copy="handleKeyboardCopied"
                    @focus="handleInputFocus"
                    addon-before="课程号"
                    read-only
                    v-model="item.courseId"
                  >
                    <a-tooltip placement="topRight" slot="addonAfter" title="复制课程号">
                      <a-button
                        class="btn-clipboard"
                        icon="snippets"
                        v-clipboard:copy="item.courseId"
                        v-clipboard:error="handleCopyError"
                        v-clipboard:success="handleCopied"
                      />
                    </a-tooltip>
                  </a-input>
                </div>
                <div @mouseenter="handleInputWrapperMouseenter" class="input-wrapper">
                  <a-input
                    @copy="handleKeyboardCopied"
                    @focus="handleInputFocus"
                    addon-before="教师号"
                    read-only
                    v-model="item.teacherId"
                  >
                    <a-tooltip placement="bottomRight" slot="addonAfter" title="复制教师号">
                      <a-button
                        class="btn-clipboard"
                        icon="snippets"
                        v-clipboard:copy="item.teacherId"
                        v-clipboard:error="handleCopyError"
                        v-clipboard:success="handleCopied"
                      />
                    </a-tooltip>
                  </a-input>
                </div>
              </div>
              <a-avatar slot="avatar">{{ index + 1 }}</a-avatar>
            </a-list-item-meta>
          </a-list-item>
          <!--suppress CommaExpressionJS -->
          <div class="header" slot="header">
            <h3>
              <a-icon type="rocket" />
              快捷选课 <small class="quick-input-trimester">{{ $store.state.trimester }}</small>
            </h3>
            <a-popconfirm @confirm="back" placement="bottom" title="关闭选课窗口并退出快捷选课？">
              <a-button size="small" type="link">返回</a-button>
            </a-popconfirm>
            <a-alert class="casp-alert" close-text="忽略"
                     message="未选形势与政策" show-icon type="info" v-if="!$store.getters.currentAffairsAndStatePoliciesSelected" />
          </div>
        </a-list>
      </a-config-provider>
    </div>
  </a-locale-provider>
</template>

<script>
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';

  let w = null;
  export default {
    name: 'app',
    data() {
      return {
        zh_CN,
        timer: null,
      };
    },
    computed: {
      selectedClassesList() {
        let result = [];
        let courseIds = Object.keys(this.$store.state.selectedClasses);
        courseIds.sort();
        courseIds.forEach((courseId) => {
          let teacherId = this.$store.state.selectedClasses[courseId].teacherId;
          result.push({
            courseId: courseId,
            teacherId: teacherId,
            credit: this.$store.state.reservedClasses[courseId].credit,
            courseName: this.$store.state.reservedClasses[courseId].courseName,
            teacherName: this.$store.state.reservedClasses[courseId].classes[teacherId].teacherName,
            classTime: this.$store.state.reservedClasses[courseId].classes[teacherId].classTime,
          });
        });
        return result;
      },
    },
    created() {
      this.$message.config({
        top: '44px',
        maxCount: 1,
      });
      const hide = this.$message.loading('正在获取数据...', 0);
      this.$store.dispatch('updateFromStorage').then(() => {
        hide();
        this.showDialog();
      });
      addEventListener('storage', this.handleStorage);
      addEventListener('unload', this.closeWindow);
    },
    beforeDestroy() {
      removeEventListener('storage', this.handleStorage);
      removeEventListener('unload', this.closeWindow);
    },
    methods: {
      showDialog() {
        clearInterval(this.timer);
        this.$destroyAll();
        if (outerHeight === screen.height && outerWidth === screen.width) {
          this.$error({
            title: '请退出全屏',
            content: '快捷选课在全屏模式下不可用。',
            keyboard: false,
            maskClosable: false,
            okText: '关闭',
            onOk: () => {
              this.back();
            },
          });
        } else {
          if (w === null) {
            this.$confirm({
              title: '打开选课网站窗口？',
              cancelText: '退出快捷选课',
              content: this.$store.state.trimester,
              keyboard: false,
              maskClosable: false,
              okText: '确定...',
              onOk: () => {
                if (w === null) {
                  this.openWindow();
                }
              },
              onCancel: () => {
                this.back();
              },
            });
          }
        }
      },
      openWindow() {
        w = open(this.$store.state.backend, 'xk-backend', `left=${window.outerWidth},top=0,width=${window.screen.availWidth - window.outerWidth},height=${window.screen.availHeight}`);
        this.timer = setInterval(() => {
          if (w.closed) {
            w = null;
            this.showDialog();
          }
        }, 500);
      },
      closeWindow() {
        if (w !== null) {
          w.close();
        }
      },
      back() {
        this.closeWindow();
        close();
      },
      handleStorage() {
        this.$store.dispatch('updateFromStorage');
        this.showDialog();
      },
      handleInputWrapperMouseenter(event) {
        const input = event.target.querySelector('input');
        input.focus();
      },
      handleInputFocus(event) {
        event.target.select();
      },
      handleCopied(event) {
        const h = this.$createElement;
        this.$message.success(['“', h('code', event.text), '” 已复制！']);
      },
      handleKeyboardCopied(event) {
        event.target.select();
        event.target.focus();
        const h = this.$createElement;
        this.$message.success(['“', h('code', event.target.value), '” 已复制！']);
      },
      handleCopyError() {
        this.$message.error('复制失败，请手动复制！');
      },
    },
  };
</script>

<style scoped>
  .header {
    padding: 0 32px 0 16px;
    text-align: center;
  }

  .quick-input-trimester {
    color: rgba(0, 0, 0, 0.45);
  }

  .class-info {
    font-size: 12px;
  }

  .input-wrapper {
    margin-top: 8px;
  }

  .btn-clipboard {
    overflow: hidden;
    margin: -1px -12px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  /*noinspection CssUnusedSymbol*/
  .ant-list-item-meta-title {
    font-size: 15px !important;
    margin-bottom: 0 !important;
  }

  /*noinspection CssUnusedSymbol*/
  .ant-list-item {
    padding: 16px 32px 16px 16px;
  }

  .credit-badge {
    float: right;
    margin-left: 3px;
  }

  /*noinspection CssUnusedSymbol*/
  .credit-badge >>> .ant-badge-count {
    color: rgba(0, 0, 0, 0.65);
    background: white;
    box-shadow: 0 0 0 1px #d9d9d9 inset;
  }

  .casp-alert {
    margin-top: 10px;
    text-align: left;
  }
</style>
