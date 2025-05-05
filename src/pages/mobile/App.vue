<template>
  <a-config-provider :locale="zh_CN">
    <div>
      <a-tabs v-model="activeTab" class="main-tabs" @change="handleActiveTabChanged">
        <a-tab-pane key="scheduleTable" tab="课表">
          <ScheduleTable @click="handleClassCardClick" />
        </a-tab-pane>
        <a-tab-pane key="reserved" tab="待选">
          <ReservedClassesList ref="reservedClassesList" />
        </a-tab-pane>
        <a-tab-pane key="lookup" tab="检索">
          <LookupPanel />
        </a-tab-pane>
      </a-tabs>
      <div class="content-actions">
        <a-button :disabled="!canUndo" icon="undo" type="link" @click="undo" />
        <a-dropdown placement="bottomCenter">
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
              色彩随机种子...
            </a-menu-item>
          </a-menu>
          <a-button type="link">
            更多功能
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-button :disabled="!canRedo" icon="redo" type="link" @click="redo" />
        <a-modal v-model="exportDialogVisible" :footer="null" :width="400" destroy-on-close>
          <ExportDialog />
        </a-modal>
        <a-modal v-model="backupAndRestoreDialogVisible" :footer="null" :width="480" destroy-on-close>
          <BackupAndRestoreDialog @ok="backupAndRestoreDialogVisible = false" />
        </a-modal>
        <a-modal v-model="colorSeedDialogVisible" :footer="null" :width="520" destroy-on-close>
          <ColorSeedDialog @ok="colorSeedDialogVisible = false" />
        </a-modal>
      </div>
      <div class="content-footer">
        <h3 class="product-name">
          SHU排课助手<br />
          <small>{{ $store.state.trimester }}</small>
        </h3>
        <div class="about-wrapper">
          <a-dropdown placement="topCenter">
            <a-menu slot="overlay" class="about-menu">
              <template slot="title">
                <a-icon type="info-circle" />
                关于
              </template>
              <a-menu-item>
                <a href="https://github.com/shuosc/shu-scheduling-helper" rel="external nofollow"
                   target="_blank">
                  <a-icon type="github" />
                  项目Github主页
                </a>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item>
                <a href="https://github.com/shuosc/shu-scheduling-helper/issues" rel="external nofollow"
                   target="_blank">
                  <a-icon type="exclamation-circle" />
                  去Github提Issue
                </a>
              </a-menu-item>
              <a-menu-item>
                <a href="https://support.qq.com/products/120502" rel="external nofollow" target="_blank">
                  <a-icon type="message" />
                  腾讯兔小巢平台
                </a>
              </a-menu-item>
            </a-menu>
            <a-button icon="info-circle" type="link">
              关于
            </a-button>
          </a-dropdown>
        </div>
        <div class="copyright">
          Copyright &copy; {{ new Date().getFullYear() }} <a href="https://github.com/shuosc"
                                                             target="_blank">上海大学开源社区</a><br />
          基于 <a href="https://github.com/shuosc/shu-scheduling-helper/blob/main/LICENSE"
                target="_blank">GPL-3.0-or-later</a> 开源
        </div>
        <div>
          数据来源:
          <a href="http://www.xk.shu.edu.cn/" target="_blank">上海大学网上选课系统</a> 版权归上海大学所有
        </div>
        <div>
          <a class="beian" href="https://beian.miit.gov.cn" target="_blank">沪ICP备19044115号-1</a>
        </div>
        <a-button class="alternate-to-desktop" href="/index.html" icon="laptop" type="link">
          切换到电脑版
        </a-button>
      </div>
      <a-back-top v-show="false" ref="backTop" />
    </div>
  </a-config-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import { dataManagerMixin } from '../../mixins/common/dataManager';
import LookupPanel from './components/LookupPanel';
import BackupAndRestoreDialog from './components/modals/BackupAndRestoreDialog';
import ColorSeedDialog from './components/modals/ColorSeedDialog';
import ExportDialog from './components/modals/ExportDialog';
import ReservedClassesList from './components/ReservedClassesList';
import ScheduleTable from './components/ScheduleTable';


export default {
  name: 'app',
  components: {
    BackupAndRestoreDialog,
    ColorSeedDialog,
    ExportDialog,
    LookupPanel,
    ReservedClassesList,
    ScheduleTable,
  },
  mixins: [dataManagerMixin],
  data() {
    return {
      zh_CN,
      activeTab: 'reserved',
      exportDialogVisible: false,
      backupAndRestoreDialogVisible: false,
      colorSeedDialogVisible: false,
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
  created() {
    this.$message.config({
      top: '57px',
      maxCount: 1,
    });
    this.updateData();
    addEventListener('storage', this.handleStorage);
    setInterval(() => {
      this.$store.dispatch('updateAllClassesExtra').then((update) => {
        if (update) {
          this.updateData();
        }
      });
    }, 600000);
  },
  beforeDestroy() {
    removeEventListener('storage', this.handleStorage);
  },
  methods: {
    handleClassCardClick() {
      this.activeTab = 'reserved';
      this.$refs.reservedClassesList.scrollTo(this.$store.state.openedCourseId);
    },
    handleStorage() {
      this.$store.dispatch('updateFromStorage');
      this.$destroyAll();
    },
    handleCollapse(collapsed) {
      this.collapsed = collapsed;
    },
    handleActiveTabChanged() {
      this.$refs.backTop.scrollToTop();
    },
    undo() {
      this.$store.dispatch('undo');
    },
    redo() {
      this.$store.dispatch('redo');
    },
  },
};
</script>

<style>
body {
  background: #f0f2f5 !important;
  height: unset !important;
}

/*noinspection CssUnusedSymbol*/
button.ant-btn {
  overflow: hidden;
}

/*noinspection CssUnusedSymbol*/
.page-sider.ant-layout-sider-collapsed + .page-content {
  margin: 64px 0 0 0 !important;
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
  font-size: 14px;
  margin: 8px 0 0 !important;
}

/*noinspection CssUnusedSymbol*/
.conflict-list-class-meta-time {
  font-size: 12px;
  color: rgba(0, 0, 0, .45);
}

/*noinspection CssUnusedSymbol*/
.conflict-list-class-meta-campus {
  font-size: 12px;
  font-weight: bold;
  color: #1890ff;
}

.content-actions {
  padding: 8px;
  text-align: center;
}

.content-footer {
  font-size: 12px;
  line-height: 2;
  padding: 8px 8px 32px;
  text-align: center;
}

.content-footer a {
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.45);
}

.content-footer a:hover {
  color: rgba(0, 0, 0, 0.35);
}

.product-name:after {
  display: block;
  height: 32px;
  margin: 4px 0 12px;
  content: " ";
  user-select: none;
  vertical-align: middle;
  background: url("../../assets/logo.png") no-repeat center center;
  background-size: contain;
}

.copyright:before {
  display: block;
  height: 24px;
  margin: 0 0 8px;
  content: " ";
  opacity: 0.6;
  background: url("../../assets/shuosc-logo-64px.png") center center no-repeat no-repeat;
  background-size: 24px 24px;
  filter: grayscale(0.4);
}

.alternate-to-desktop {
  margin-top: 16px;
}

.about-wrapper {
  margin-bottom: 10px;
}

/*noinspection CssUnusedSymbol*/
.about-menu .anticon {
  margin-right: 8px !important;
}

/*noinspection CssUnusedSymbol*/
.main-tabs .ant-tabs-bar {
  position: fixed;
  z-index: 99;
  top: 0;
  right: 0;
  left: 0;
  margin-bottom: 0 !important;
  background: white;
}

/*noinspection CssUnusedSymbol*/
.main-tabs .ant-tabs-nav-scroll {
  text-align: center;
}

/*noinspection CssUnusedSymbol*/
.main-tabs.ant-tabs {
  background: white;
}

/*!*noinspection CssUnusedSymbol*!
.main-tabs .ant-tabs-content {
  margin-top: 44px !important;
}*/

.main-alert {
  margin-top: 44px !important;
}
</style>
