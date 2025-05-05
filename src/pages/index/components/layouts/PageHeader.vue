<template>
  <a-layout-header class="page-header" ref="header">
    <a-config-provider :get-popup-container="() => $refs.header.$el">
      <a-menu :selectable="false" class="header-menu" mode="horizontal" theme="light">
        <a-menu-item class="header-title-wrapper">
          <div class="header-title-container">
            <div class="header-title">SHU排课助手</div>
            <div class="header-trimester">{{ $store.state.trimester }}</div>
          </div>
        </a-menu-item>
        <a-menu-item :disabled="!canUndo" @click="undo" class="actions-menu-item">
          <a-tooltip :title="undoTitle" placement="bottom">
            <a-icon type="undo" />
          </a-tooltip>
        </a-menu-item>
        <a-menu-item :disabled="!canRedo" @click="redo" class="actions-menu-item">
          <a-tooltip :title="redoTitle" placement="bottom">
            <a-icon type="redo" />
          </a-tooltip>
        </a-menu-item>
        <a-sub-menu class="actions-menu-item actions-menu-item-right">
          <template slot="title">
            <a-icon type="info-circle" />
            关于
          </template>
          <a-menu-item>
            <a href="https://github.com/shuosc/shu-scheduling-helper" rel="external nofollow" target="_blank">
              <a-icon type="github" />
              项目Github主页
            </a>
          </a-menu-item>
          <a-sub-menu>
            <template slot="title">
              <a-icon type="message" />
              意见反馈
            </template>
            <a-menu-item>
              <a href="https://github.com/shuosc/shu-scheduling-helper/issues" rel="external nofollow"
                 target="_blank">
                去Github提Issue
              </a>
            </a-menu-item>
            <a-menu-item>
              <a href="https://support.qq.com/products/120502" rel="external nofollow" target="_blank">
                腾讯兔小巢平台
              </a>
            </a-menu-item>
          </a-sub-menu>
        </a-sub-menu>
      </a-menu>
    </a-config-provider>
  </a-layout-header>
</template>

<script>
  import { isMacLike } from '../../../../utils/course';


  export default {
    name: 'PageHeader',
    data() {
      return {
        undoTitle: isMacLike ? '撤销 ⌘Z' : '撤销 Ctrl+Z',
        redoTitle: isMacLike ? '重做 ⇧⌘Z' : '恢复 Ctrl+Y',
      };
    },
    computed: {
      canUndo() {
        return this.$store.state.historyPos > 1;
      },
      canRedo() {
        return this.$store.state.historyPos < this.$store.state.history.length;
      },
    },
    methods: {
      undo() {
        this.$store.dispatch('undo');
      },
      redo() {
        this.$store.dispatch('redo');
      },
    },
  };
</script>

<style scoped>
  .page-header {
    position: fixed;
    z-index: 999;
    top: 0;
    right: 0;
    left: 0;
    height: 64px;
    padding: 0;
    user-select: none;
    background: white;
  }

  .header-title-wrapper {
    float: left;
    padding: 0 24px;
    white-space: nowrap;
    pointer-events: none;
  }

  .header-title-wrapper:before {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-right: 12px;
    content: " ";
    user-select: none;
    vertical-align: middle;
    background: url("../../../../assets/logo.png") no-repeat center center;
    background-size: contain;
  }

  .header-title-container {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    height: 64px;
    text-align: center;
    vertical-align: middle;
  }

  .header-title {
    font-size: 17px;
    line-height: 28px;
    height: 28px;
    margin: 0;
    letter-spacing: 1px;
  }

  .header-title small {
    font-size: 12px;
    opacity: 0.8;
  }

  .header-trimester {
    font-size: 12px;
    line-height: 20px;
    height: 20px;
    opacity: 0.6;
  }

  .header-menu {
    line-height: 63px;
  }

  .actions-menu-item {
    float: left;
    text-align: center;
  }

  .actions-menu-item-right {
    float: right;
    padding-right: 12px;
  }

  /*noinspection CssUnusedSymbol*/
  .actions-menu-item:not(.actions-menu-item-right) >>> .anticon {
    margin-right: 0;
  }

  /*noinspection CssUnusedSymbol*/
  .header-menu >>> .ant-menu-item, .header-menu >>> .ant-menu-submenu {
    border-bottom: none !important;
  }
</style>
