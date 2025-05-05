<template>
  <div>
    <h3 class="title">
      备份与还原
    </h3>
    <a-card class="data-area" size="small" title="当前数据：">
      <template slot="extra">
        <a-tooltip placement="top" title="复制">
          <a-button
            :disabled="submitting"
            icon="snippets"
            size="small"
            type="link"
            v-clipboard:copy="text"
            v-clipboard:error="handleCopyError"
            v-clipboard:success="handleCopied"
          />
        </a-tooltip>
        <a-tooltip placement="top" title="保存">
          <a-button
            :disabled="submitting"
            @click="download"
            icon="save"
            size="small"
            type="link"
          />
        </a-tooltip>
      </template>
      {{ $store.state.trimester }} <code class="data-encrypted">#{{ data.encrypted }}#</code> 备份时间 {{ data.datetime }}
      注：无法跨选课周期恢复
    </a-card>
    <a-divider />
    <a-form @submit="submit" ref="form">
      <div class="restore-hint">在下方文本框粘贴含#......#的数据以还原</div>
      <a-input allow-clear class="restore-input" placeholder="粘贴在这里"
               ref="restoreEncrypted" v-model.trim="restoreEncrypted">
        <a-upload :before-upload="upload" :show-upload-list="false" slot="addonBefore">
          <a-button :disabled="submitting" class="restore-input-addon-before" icon="upload">上传...</a-button>
        </a-upload>
        <a-button :disabled="submitting || errorMsg != null || decoded == null" :loading="submitting" class="restore-input-addon-after" html-type="submit"
                  slot="addonAfter" type="primary">
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
    line-height: 32px;
    margin-bottom: 10px;
  }

  .data-area {
    font-size: 12px;
    line-height: 1.5;
    color: #607d8b;
  }

  .data-encrypted {
    word-break: break-all;
    color: #673ab7;
  }

  /*noinspection CssUnusedSymbol*/
  .restore-input >>> .ant-input-group-addon {
    padding: 0;
    border: none;
    background: none;
  }

  .restore-input-addon-before {
    margin-right: -2px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .restore-input-addon-after {
    margin-left: -1px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .restore-input-addon-before:hover, .restore-input-addon-after:hover, .restore-input >>> input:hover {
    z-index: 1;
  }

  .restore-input-addon-before:focus, .restore-input-addon-after:focus, .restore-input >>> input:focus {
    z-index: 2;
  }

  .restore-hint {
    font-size: 12px;
    margin-bottom: 10px;
    text-align: center;
  }

  .error-msg {
    font-size: 12px;
    margin-top: 10px;
    text-align: center;
    color: #f44336;
  }
</style>
