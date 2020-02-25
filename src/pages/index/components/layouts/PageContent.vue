<template>
  <a-layout-content class="page-content">
    <a-spin size="large" tip="正在加载…" :spinning="!$store.state.loaded">
      <a-tabs v-model="activeTab" class="content-tabs" type="card">
        <a-tab-pane v-if="showScheduleTable" tab="课表" key="schedule_table">
          <ScheduleTable @click="handleClassCardClick" />
        </a-tab-pane>
        <a-tab-pane :tab="`待选(${reservedClassesCount})`" key="reserved">
          <ReservedClassesList ref="reservedClassesList" />
        </a-tab-pane>
        <a-tab-pane tab="课程检索" key="lookup">
          <LookupPanel />
        </a-tab-pane>
        <a-dropdown-button slot="tabBarExtraContent" class="tabs-actions" @click="quickInputting">
          <a-icon type="rocket" />
          快捷选课...
          <a-menu slot="overlay">
            <a-menu-item @click="exportDialogVisible = true">
              <a-icon type="export" />
              导出已选课程文本...
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="backupAndRestoreDialogVisible = true">
              <a-icon type="database" />
              备份与还原...
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="colorSeedDialogVisible = true">
              <a-icon type="experiment" />
              色彩随机种子... {{ colorSeedShortcut }}
            </a-menu-item>
          </a-menu>
        </a-dropdown-button>
      </a-tabs>
      <div class="content-footer">
        <div>
          Copyright &copy; {{ new Date().getFullYear() }} <a href="https://github.com/ZKLlab" target="_blank">ZKLlab</a>.
          All Rights Reserved.
        </div>
        <div>
          数据来源: <a href="http://www.xk.shu.edu.cn/" target="_blank">上海大学网上选课系统</a> 版权归上海大学所有
        </div>
        <div>
          <a class="beian" href="http://www.beian.miit.gov.cn" target="_blank">沪ICP备17002314号-1</a>
          <a class="beian mps-beian" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010302000519"
             target="_blank">粤公网安备 44010302000519号</a>
        </div>
        <a-button class="alternate-to-desktop" href="/m.html" type="link" icon="mobile">
          切换到移动版
        </a-button>
      </div>
      <a-back-top class="back-top" />
    </a-spin>
    <a-modal v-model="exportDialogVisible" :title="null" :width="400" :footer="null" destroy-on-close>
      <ExportDialog />
    </a-modal>
    <a-modal v-model="backupAndRestoreDialogVisible" :title="null" :width="480" :footer="null" destroy-on-close>
      <BackupAndRestoreDialog @ok="backupAndRestoreDialogVisible = false" />
    </a-modal>
    <a-modal v-model="colorSeedDialogVisible" :title="null" :width="520" :footer="null" destroy-on-close>
      <ColorSeedDialog @ok="colorSeedDialogVisible = false" />
    </a-modal>
  </a-layout-content>
</template>

<script>
  import LookupPanel from '../LookupPanel';
  import ReservedClassesList from '../ReservedClassesList';
  import ScheduleTable from '../ScheduleTable';
  import ExportDialog from '../modals/ExportDialog';
  import BackupAndRestoreDialog from '../modals/BackupAndRestoreDialog';
  import ColorSeedDialog from '../modals/ColorSeedDialog';
  import {isMacLike} from '../../../../utils';

  export default {
    name: 'PageContent',
    components: {
      BackupAndRestoreDialog,
      ColorSeedDialog,
      ExportDialog,
      LookupPanel,
      ReservedClassesList,
      ScheduleTable,
    },
    props: {
      showScheduleTable: {
        type: Boolean,
      }
    },
    data() {
      return {
        activeTab: 'reserved',
        quickInputtingWindow: null,
        exportDialogVisible: false,
        backupAndRestoreDialogVisible: false,
        colorSeedDialogVisible: false,
        colorSeedShortcut: isMacLike ? '⇧⌘K' : 'Ctrl+Shift+K',
      };
    },
    computed: {
      reservedClassesCount() {
        return Object.keys(this.$store.state.reservedClasses).length;
      },
      trimester() {
        return this.$store.state.trimester;
      }
    },
    watch: {
      showScheduleTable() {
        if (!this.showScheduleTable && this.activeTab === 'schedule_table') {
          this.activeTab = this.reservedClassesCount > 0 ? 'reserved' : 'lookup';
        }
      },
    },
    created() {
      addEventListener('unload', this.closeQuickInputting);
    },
    beforeDestroy() {
      removeEventListener('unload', this.closeQuickInputting);
    },
    methods: {
      handleClassCardClick() {
        this.activeTab = 'reserved';
        this.$refs.reservedClassesList.scrollTo(this.$store.state.openedCourseId);
      },
      quickInputting() {
        this.quickInputtingWindow = open('/quick-inputting.html', 'quick-inputting', `left=0,top=0,width=300,height=${window.screen.availHeight}`);
      },
      closeQuickInputting() {
        if (this.quickInputtingWindow !== null && !this.quickInputtingWindow.closed) {
          this.quickInputtingWindow.dispatchEvent(new Event('unload'));
          this.quickInputtingWindow.close();
        }
      },
    },
  };
</script>

<style scoped>
  .page-content {
    min-height: calc(100vh - 64px);
    transition: all 0.2s ease;
    margin: 64px 0 0 480px;
    padding: 8px;
  }

  /*noinspection CssUnusedSymbol*/
  .page-content >>> .ant-spin-container::after {
    background-color: #f0f2f5;
  }

  .tabs-actions {
    position: relative;
    top: -4px;
  }

  .content-footer {
    text-align: center;
    line-height: 2;
    font-size: 12px;
    padding: 32px 8px;
  }

  .content-footer a {
    color: rgba(0, 0, 0, 0.45);
    white-space: nowrap;
  }

  .content-footer a:hover {
    color: rgba(0, 0, 0, 0.35);
  }

  .beian {
    margin: 0 10px;
  }

  .mps-beian:before {
    background: url("../../../../assets/mps.png") no-repeat center center;
    vertical-align: text-bottom;
    background-size: contain;
    transition: opacity 0.2s;
    display: inline-block;
    margin-right: 5px;
    content: " ";
    opacity: 0.8;
    height: 16px;
    width: 16px;
  }

  .mps-beian:hover:before {
    opacity: 0.7;
  }

  .alternate-to-desktop {
    margin-top: 16px;
  }

  .back-top {
    bottom: 20px;
    right: 20px;
  }

  /*noinspection CssUnusedSymbol*/
  .content-tabs >>> .ant-tabs-content {
    margin-top: -16px;
  }

  /*noinspection CssUnusedSymbol*/
  .content-tabs >>> .ant-tabs-content > .ant-tabs-tabpane {
    background: white;
    padding: 0;
  }

  /*noinspection CssUnusedSymbol*/
  .content-tabs >>> .ant-tabs-bar {
    border-color: white !important;
  }

  /*noinspection CssUnusedSymbol*/
  .content-tabs >>> .ant-tabs-bar .ant-tabs-tab {
    border-color: transparent !important;
    background: transparent !important;
  }

  /*noinspection CssUnusedSymbol*/
  .content-tabs >>> .ant-tabs-bar .ant-tabs-tab-active {
    border-color: white !important;
    background: white !important;
  }

  /*noinspection CssUnusedSymbol*/
  .content-tabs >>> .ant-tabs-nav {
    user-select: none;
  }
</style>
