<template>
  <a-locale-provider :locale="zh_CN">
    <a-layout>
      <PageHeader />
      <PageSider @collapse="handleCollapse" @click="handleClassCardClick" />
      <PageContent ref="content" :show-schedule-table="collapsed" />
    </a-layout>
  </a-locale-provider>
</template>

<script>
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import PageHeader from './components/layouts/PageHeader';
  import PageSider from './components/layouts/PageSider';
  import PageContent from './components/layouts/PageContent';
  import {dataManagerMixin} from '../../mixins/common/dataManager';
  import {isMacLike} from '../../utils';

  export default {
    name: 'app',
    components: {
      PageContent,
      PageSider,
      PageHeader,
    },
    mixins: [dataManagerMixin],
    data() {
      return {
        zh_CN,
        collapsed: false,
      };
    },
    created() {
      this.$message.config({
        top: '11px',
        maxCount: 1,
      });
      this.updateData();
      addEventListener('storage', this.handleStorage);
      addEventListener('keydown', this.handleKeydown);
    },
    beforeDestroy() {
      removeEventListener('storage', this.handleStorage);
      removeEventListener('keydown', this.handleKeydown);
    },
    methods: {
      handleClassCardClick() {
        this.$refs.content.activeTab = 'reserved';
        this.$refs.content.$refs['reservedClassesList'].scrollTo(this.$store.state.openedCourseId);
      },
      handleStorage() {
        let oldTrimester = this.$store.state.trimester;
        this.$store.dispatch('updateFromStorage').then(() => {
          if (this.$store.state.trimester !== oldTrimester) {
            location.reload();
          }
        });
        this.$destroyAll();
        this.$refs.content.exportDialogVisible = false;
        this.$refs.content.backupAndRestoreDialogVisible = false;
        this.$refs.content.colorSeedDialogVisible = false;
      },
      handleKeydown(event) {
        if (this.$store.state.loaded) {
          let ctrl = isMacLike ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
          let shift = event.shiftKey;
          let alt = event.altKey;
          let key = event.key.toLowerCase();
          let isInput = false;
          let targetTagName = event.target.tagName.toLowerCase();
          if (targetTagName === 'textarea') {
            isInput = true;
          } else if (targetTagName === 'input') {
            if (['text', 'password', 'number', 'email', 'tel', 'url', 'search', 'date', 'datetime', 'datetime-local',
              'time', 'month', 'week'].indexOf(event.target.getAttribute('type').toLowerCase()) >= 0) {
              isInput = true;
            }
          }
          if (ctrl && !alt && ((shift && (event.code === 'KeyZ' || key === 'z')) || (!shift && (event.code === 'KeyY' || key === 'y')))) {
            if (!isInput) {
              event.preventDefault();
              this.$store.dispatch('redo');
            }
          } else if (ctrl && !alt && !shift && (event.code === 'KeyS' || key === 's')) {
            event.preventDefault();
            this.$message.info('所有内容已自动保存！');
          } else if (ctrl && !alt && !shift && (event.code === 'KeyZ' || key === 'z')) {
            if (!isInput) {
              event.preventDefault();
              this.$store.dispatch('undo');
            }
          } else if (ctrl && !alt && shift && (event.code === 'KeyK' || key === 'k')) {
            event.preventDefault();
            this.$refs.content.colorSeedDialogVisible = true;
          }
        }
      },
      handleCollapse(collapsed) {
        this.collapsed = collapsed;
      },
    },
  };
</script>

<style>
  /*noinspection CssUnusedSymbol*/
  button.ant-btn {
    overflow: hidden;
  }

  /*noinspection CssUnusedSymbol*/
  .page-sider.ant-layout-sider-collapsed + .page-content {
    margin-left: 0 !important;
  }

  /*noinspection CssUnusedSymbol*/
  .page-sider.ant-layout-sider-collapsed + .page-content .lookup-class-time-preview {
    display: none;
  }

  /*noinspection CssUnusedSymbol*/
  .conflict-list-hint {
    font-size: 12px;
  }

  /*noinspection CssUnusedSymbol*/
  .conflict-list-class-meta {
    font-size: 14px;
    margin: 16px 0 0;
  }

  /*noinspection CssUnusedSymbol*/
  .conflict-solving-list-class-meta-wrapper {
    margin: 8px 0 0 !important;
    font-size: 14px;
  }

  /*noinspection CssUnusedSymbol*/
  .conflict-list-class-meta-time {
    font-size: 12px;
    color: rgba(0, 0, 0, .45);
  }
</style>
