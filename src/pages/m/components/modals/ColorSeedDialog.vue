<template>
  <div>
    <h3 class="title">
      色彩随机种子
      <small>
        <a-icon type="experiment" />
      </small>
    </h3>
    <p class="hint">
      请输入0<span> ~ </span>9<span>,</span>999<span>,</span>999<span>,</span>999之间的整数：<br />
      <small>课程配色 = 色彩列表 [
        <a-tooltip title="一种常用的非加密哈希函数" placement="top">
          <a href="https://baike.baidu.com/item/Murmur%E5%93%88%E5%B8%8C" target="_blank">Murmur3</a>
        </a-tooltip>
        ( 课程名, <strong>色彩随机种子</strong> +
        <a-tooltip title="在这里是避免相邻颜色冲突，由程序自动加入的随机数值" placement="top">
          <a href="https://baike.baidu.com/item/Nonce" target="_blank">Nonce</a>
        </a-tooltip>
        ) <abbr title="取余运算符">Mod</abbr> 色彩数 ]</small>
    </p>
    <a-form @submit="submit">
      <a-form-item :validate-status="status">
        <a-input v-model.trim="value" ref="input" class="input" size="large" maxlength="10" auto-focus
                 :placeholder="`${originalValue}`" :disabled="submitting" @change="validate" />
      </a-form-item>
      <div class="submit-wrapper">
        <a-button type="primary" html-type="submit" :disabled="status !== 'success' || submitting"
                  :loading="submitting">
          确定
        </a-button>
        <a-button type="link" class="random" icon="thunderbolt" :disabled="submitting" @click="useRandomNumber">
          使用随机数
        </a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
  import {ColorSeedDialogMixin} from '../../../../mixins/ColorSeedDialog';

  export default {
    name: 'ColorSeedDialog',
    mixins: [ColorSeedDialogMixin],
  };
</script>

<style scoped>
  .title {
    margin-bottom: 10px;
    line-height: 32px;
  }

  .input {
    width: 100%;
  }

  .submit-wrapper {
    text-align: center;
    margin-top: 10px;
  }

  .hint span {
    user-select: none;
  }

  .random {
    margin-left: 10px;
  }
</style>
