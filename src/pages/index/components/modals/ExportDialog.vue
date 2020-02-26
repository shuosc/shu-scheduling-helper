<template>
  <div>
    <h3 class="title">
      <template v-if="activeTab === 'content'">
        导出已选课程文本
        <a-button
          type="link"
          icon="snippets"
          v-clipboard:copy="content"
          v-clipboard:success="handleCopied"
          v-clipboard:error="handleCopyError"
        >
          复制
        </a-button>
      </template>
      <template v-else>
        设置
      </template>
    </h3>
    <a-alert v-if="!$store.getters.currentAffairsAndStatePoliciesSelected" class="casp-alert" message="未选形势与政策"
             type="info" close-text="忽略" show-icon />
    <a-tabs class="tabs" v-model="activeTab" tab-position="left" type="card" size="small">
      <a-tab-pane key="content" force-render>
        <a-icon slot="tab" type="file-text" />
        <a-textarea
          ref="content"
          class="content-area"
          :value="content"
          :autosize="{ minRows: 8, maxRows: 11.5 }"
          read-only
          spellcheck="false"
          @mouseenter="handleTextareaMouseenter"
          @focus="handleTextareaFocus"
        />
      </a-tab-pane>
      <a-tab-pane key="setting" force-render>
        <a-icon slot="tab" type="setting" />
        <a-table
          class="courses-table"
          :data-source="rows"
          :row-selection="rowSelection"
          :pagination="false"
          size="middle"
          :scroll="{ y: 240 }"
          :locale="{emptyText: '没有已选的课程'}"
          bordered
        >
          <a-table-column title="选择要显示的课程" data-index="course">
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
  import {ExportDialogMixin} from '../../../../mixins/ExportDialog';

  export default {
    name: 'ExportDialog',
    mixins: [ExportDialogMixin],
  };
</script>

<style scoped>
  .title {
    margin-bottom: 10px;
    line-height: 32px;
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

  .casp-alert {
    margin-bottom: 20px;
  }
</style>
