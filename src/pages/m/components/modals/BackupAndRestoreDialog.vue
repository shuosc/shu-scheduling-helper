<template>
  <div>
    <h3 class="title">
      备份与还原
    </h3>
    <a-card class="data-area" title="当前数据：" size="small">
      <template slot="extra">
        <a-tooltip title="复制" placement="top">
          <a-button
            type="link"
            size="small"
            icon="snippets"
            :disabled="submitting"
            v-clipboard:copy="text"
            v-clipboard:success="handleCopied"
            v-clipboard:error="handleCopyError"
          />
        </a-tooltip>
        <a-tooltip title="保存" placement="top">
          <a-button
            type="link"
            size="small"
            icon="save"
            :disabled="submitting"
            @click="download"
          />
        </a-tooltip>
      </template>
      {{ $store.state.trimester }} <code class="data-encrypted">#{{ data.encrypted }}#</code> 备份时间 {{ data.datetime }}
      注：无法跨选课周期恢复
    </a-card>
    <a-divider />
    <a-form ref="form" @submit="submit">
      <div class="restore-hint">在下方文本框粘贴含#......#的数据以还原</div>
      <a-input ref="restoreEncrypted" v-model.trim="restoreEncrypted" class="restore-input"
               placeholder="粘贴在这里" allow-clear>
        <a-upload slot="addonBefore" :before-upload="upload" :show-upload-list="false">
          <a-button class="restore-input-addon-before" icon="upload" :disabled="submitting">上传...</a-button>
        </a-upload>
        <a-button slot="addonAfter" class="restore-input-addon-after" type="primary" :loading="submitting"
                  :disabled="submitting || errorMsg != null || decoded == null" html-type="submit">
          还原
        </a-button>
      </a-input>
    </a-form>
    <div class="error-msg">{{ errorMsg }}</div>
  </div>
</template>

<script>
  import {dataManagerMixin} from '../../../../mixins/common/dataManager';
  import {BackupAndRestoreDialogMixin} from '../../../../mixins/BackupAndRestoreDialog';

  export default {
    name: 'BackupAndRestoreDialog',
    mixins: [dataManagerMixin, BackupAndRestoreDialogMixin],
  };
</script>

<style scoped>
  .title {
    margin-bottom: 10px;
    line-height: 32px;
  }

  .data-area {
    line-height: 1.5;
    font-size: 12px;
    color: #607D8B;
  }

  .data-encrypted {
    word-break: break-all;
    color: #673AB7;
  }

  /*noinspection CssUnusedSymbol*/
  .restore-input >>> .ant-input-group-addon {
    background: none;
    border: none;
    padding: 0;
  }

  .restore-input-addon-before {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    margin-right: -2px;
  }

  .restore-input-addon-after {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    margin-left: -1px;
  }

  .restore-input-addon-before:hover, .restore-input-addon-after:hover, .restore-input >>> input:hover {
    z-index: 1;
  }

  .restore-input-addon-before:focus, .restore-input-addon-after:focus, .restore-input >>> input:focus {
    z-index: 2;
  }

  .restore-hint {
    margin-bottom: 10px;
    text-align: center;
    font-size: 12px;
  }

  .error-msg {
    text-align: center;
    margin-top: 10px;
    font-size: 12px;
    color: #F44336;
  }
</style>
