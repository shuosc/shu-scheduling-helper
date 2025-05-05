<template>
  <div>
    <h3 class="title">
      色彩随机种子
      <small>
        <a-icon type="experiment" />
      </small>
      <a-button @click="reset" class="reset" type="link" v-if="originalValue !== 2">重置</a-button>
    </h3>
    <p class="hint">
      请输入0<span> ~ </span>9<span>,</span>999<span>,</span>999<span>,</span>999之间的整数：<br />
      <small>课程配色 = 色彩列表 [
        <a-tooltip placement="top" title="一种常用的非加密哈希函数">
          <a href="https://baike.baidu.com/item/Murmur%E5%93%88%E5%B8%8C" target="_blank">Murmur3</a>
        </a-tooltip>
        ( 课程名, <strong>色彩随机种子</strong> +
        <a-tooltip placement="top" title="在这里是避免相邻颜色冲突，由程序自动加入的随机数值">
          <a href="https://baike.baidu.com/item/Nonce" target="_blank">Nonce</a>
        </a-tooltip>
        ) <abbr title="取余运算符">Mod</abbr> 色彩数 ]</small>
    </p>
    <a-form @submit="submit">
      <a-form-item :validate-status="status">
        <a-input :disabled="submitting" :placeholder="`${originalValue}`" @change="validate" auto-focus class="input" maxlength="10"
                 ref="input" size="large" v-model.trim="value" />
      </a-form-item>
      <div class="submit-wrapper">
        <a-button :disabled="status !== 'success' || submitting" :loading="submitting" html-type="submit"
                  type="primary">
          确定
        </a-button>
        <a-button :disabled="submitting" @click="useRandomNumber" class="random" icon="thunderbolt" type="link">
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
    line-height: 32px;
    margin-bottom: 10px;
  }

  .input {
    width: 100%;
  }

  .submit-wrapper {
    margin-top: 10px;
    text-align: center;
  }

  .hint span {
    user-select: none;
  }

  .random, .reset {
    margin-left: 10px;
  }
</style>
