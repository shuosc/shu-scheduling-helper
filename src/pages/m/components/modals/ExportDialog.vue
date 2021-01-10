<template>
  <div>
    <h3 class="title">
      <template v-if="activeTab === 'content'">
        导出已选课程文本
        <a-button
          icon="snippets"
          type="link"
          v-clipboard:copy="content"
          v-clipboard:error="handleCopyError"
          v-clipboard:success="handleCopied"
        >
          复制
        </a-button>
      </template>
      <template v-else>
        设置
      </template>
    </h3>
    <a-alert class="selection-export-alert" close-text="忽略" message="未选形势与政策"
             show-icon type="info" v-if="!$store.getters.currentAffairsAndStatePoliciesSelected" />
    <a-alert class="selection-export-alert" close-text="忽略" message="跨校区选课"
             show-icon type="info" v-if="$store.getters.crossCampusSelection" />
    <a-alert class="selection-export-alert" close-text="忽略" message="跨校区课程之间需要空出一个时间段，当前已选课程不满足此要求，可能无法成功选课"
             show-icon type="warning" v-if="$store.getters.crossCampusSelectionNotValidated" />
    <a-tabs class="tabs" v-model="activeTab">
      <a-tab-pane force-render key="content">
        <a-icon slot="tab" type="file-text" />
        <a-textarea
          :value="content"
          @focus="handleTextareaFocus"
          @mouseenter="handleTextareaMouseenter"
          autosize
          class="content-area"
          read-only
          ref="content"
          spellcheck="false"
        />
      </a-tab-pane>
      <a-tab-pane force-render key="setting">
        <a-icon slot="tab" type="setting" />
        <a-table
          :data-source="rows"
          :locale="{emptyText: '没有已选的课程'}"
          :pagination="false"
          :row-selection="rowSelection"
          bordered
          class="courses-table"
          size="middle"
        >
          <a-table-column data-index="course" title="选择要显示的课程">
            <template v-slot="course">
              <strong>{{ course.name }}</strong>
              <br /><small class="id-info">{{ course.id }}</small>
            </template>
          </a-table-column>
        </a-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import { ExportDialogMixin } from '../../../../mixins/ExportDialog';


  export default {
    name: 'ExportDialog',
    mixins: [ExportDialogMixin],
  };
</script>

<style scoped>
  .title {
    line-height: 32px;
    margin-bottom: 10px;
  }

  .courses-table >>> th, .courses-table >>> td {
    padding: 8px 8px !important;
  }

  .id-info {
    font-size: 12px;
    opacity: 0.6;
  }

  /*noinspection CssUnusedSymbol*/
  .tabs >>> .ant-tabs-tab .anticon {
    margin: 0;
  }

  .selection-export-alert {
    margin-bottom: 3px;
    padding-right: 44px !important;
  }
</style>
