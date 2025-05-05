<template>
  <a-layout-content class="page-content">
    <a-spin :spinning="!$store.state.loaded" size="large" tip="正在加载…">
      <a-tabs class="content-tabs" type="card" v-model="activeTab">
        <a-tab-pane key="schedule_table" tab="课表" v-if="showScheduleTable">
          <ScheduleTable @click="handleClassCardClick" />
        </a-tab-pane>
        <a-tab-pane :tab="`待选(${reservedClassesCount})`" key="reserved">
          <ReservedClassesList ref="reservedClassesList" />
        </a-tab-pane>
        <a-tab-pane key="lookup" tab="课程检索">
          <LookupPanel />
        </a-tab-pane>
        <div slot="tabBarExtraContent">
          <div class="credits-wrapper" title="已选学分">
            <strong class="credits">{{ $store.getters.credits }}</strong> 学分
          </div>
          <a-dropdown-button @click="quickInputting" class="tabs-actions">
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
            </a-menu>
          </a-dropdown-button>
        </div>
      </a-tabs>
      <div class="content-footer">
        <div class="copyright">
          Copyright &copy; {{ new Date().getFullYear() }} <a href="https://github.com/shuosc"
                                                             target="_blank">上海大学开源社区</a>.
          基于 <a href="https://github.com/shuosc/shu-scheduling-helper/blob/main/LICENSE"
                target="_blank">GPL-3.0-or-later</a> 开源
        </div>
        <div>
          数据来源: <a href="http://www.xk.shu.edu.cn/" target="_blank">上海大学网上选课系统</a> 版权归上海大学所有
        </div>
        <div>
          <a href="https://beian.miit.gov.cn" target="_blank">沪ICP备19044115号-1</a>
        </div>
        <a-button class="alternate-to-desktop" href="/mobile.html" icon="mobile" type="link">
          切换到移动版
        </a-button>
      </div>
      <a-back-top class="back-top" />
    </a-spin>
    <a-modal :footer="null" :width="400" destroy-on-close v-model="exportDialogVisible">
      <ExportDialog />
    </a-modal>
    <a-modal :footer="null" :width="480" destroy-on-close v-model="backupAndRestoreDialogVisible">
      <BackupAndRestoreDialog @ok="backupAndRestoreDialogVisible = false" />
    </a-modal>
    <a-modal :footer="null" :width="520" destroy-on-close v-model="colorSeedDialogVisible">
      <ColorSeedDialog @ok="colorSeedDialogVisible = false" />
    </a-modal>
    <a-modal :footer="null" destroy-on-close v-model="saveImageDialogVisible">
      <SaveImageDialog :blob="imageBlob" @ok="saveImageDialogVisible = false" />
    </a-modal>
  </a-layout-content>
</template>

<script>
import Vue from 'vue';
import LookupPanel from '../LookupPanel';
import BackupAndRestoreDialog from '../modals/BackupAndRestoreDialog';
import ColorSeedDialog from '../modals/ColorSeedDialog';
import ExportDialog from '../modals/ExportDialog';
import SaveImageDialog from '../modals/SaveImageDialog';
import ReservedClassesList from '../ReservedClassesList';
import ScheduleTable from '../ScheduleTable';


export default {
  name: 'PageContent',
  components: {
    BackupAndRestoreDialog,
    ColorSeedDialog,
    ExportDialog,
    LookupPanel,
    ReservedClassesList,
    ScheduleTable,
    SaveImageDialog,
  },
  props: {
    showScheduleTable: {
      type: Boolean,
    },
  },
  data() {
    return {
      activeTab: 'reserved',
      quickInputtingWindow: null,
      exportDialogVisible: false,
      backupAndRestoreDialogVisible: false,
      colorSeedDialogVisible: false,
      saveImageDialogVisible: false,
      imageBlob: null,
    };
  },
  computed: {
    reservedClassesCount() {
      return Object.keys(this.$store.state.reservedClasses).length;
    },
    trimester() {
      return this.$store.state.trimester;
    },
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
    Vue.prototype.$showColorSeedDialog = () => {
      this.colorSeedDialogVisible = true;
    };
    Vue.prototype.$showSaveImageDialog = (blob) => {
      this.imageBlob = blob;
      this.saveImageDialogVisible = true;
    };
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
  margin: 64px 0 0 480px;
  padding: 8px;
  transition: all 0.2s ease;
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
  font-size: 12px;
  line-height: 2;
  padding: 32px 8px;
  text-align: center;
}

.content-footer a {
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.45);
}

.content-footer a:hover {
  color: rgba(0, 0, 0, 0.35);
}

.copyright:before {
  display: block;
  height: 24px;
  margin: 0 0 8px;
  content: " ";
  transition: opacity 0.2s, filter 0.2s;
  opacity: 0.6;
  background: url("../../../../assets/shuosc-logo-64px.png") center center no-repeat no-repeat;
  background-size: 24px 24px;
  filter: grayscale(0.4);
}

.copyright:hover:before {
  opacity: 0.8;
  filter: grayscale(0.2);
}

.alternate-to-desktop {
  margin-top: 16px;
}

.back-top {
  right: 20px;
  bottom: 20px;
}

.credits-wrapper {
  line-height: 32px;
  display: inline-block;
  height: 32px;
  margin-right: 12px;
  vertical-align: top;
  color: rgba(0, 0, 0, 0.45);
}

.credits {
  color: rgba(0, 0, 0, 0.65);
}

/*noinspection CssUnusedSymbol*/
.content-tabs >>> .ant-tabs-content {
  margin-top: -16px;
}

/*noinspection CssUnusedSymbol*/
.content-tabs >>> .ant-tabs-content > .ant-tabs-tabpane {
  padding: 0;
  background: white;
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

.content-alert {
  margin-bottom: 8px;
}
</style>
