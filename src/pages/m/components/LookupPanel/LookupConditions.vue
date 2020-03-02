<template>
  <a-form ref="form" class="conditions-wrapper" layout="vertical">
    <a-form-item>
      <a-input v-model="conditions.search['course_id']" allow-clear>
        <span class="label" slot="prefix">课程号：</span>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model="conditions.search['course_name']" allow-clear>
        <span class="label" slot="prefix">课程名称：</span>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model="conditions.search['credit']" allow-clear>
        <span class="label" slot="prefix">学分数：</span>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model="conditions.search['teacher_id']" allow-clear>
        <span class="label" slot="prefix">教师号：</span>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model="conditions.search['teacher_name']" allow-clear>
        <span class="label" slot="prefix">教师姓名：</span>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model="conditions.search['class_time']" allow-clear>
        <span class="label" slot="prefix">上课时间：</span>
      </a-input>
    </a-form-item>
    <a-form-item label="校区">
      <a-select v-model="conditions.search['campus']">
        <a-select-option value="">全部</a-select-option>
        <a-select-option value="宝山">宝山</a-select-option>
        <a-select-option value="嘉定">嘉定</a-select-option>
        <a-select-option value="延长">延长</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="筛除时间冲突选项">
      <a-switch v-model="conditions.filterConflicts" checked-children="是" un-checked-children="否" />
    </a-form-item>
    <a-form-item label="容量至少剩余">
      <a-input-number class="w-80px" v-model.number="conditions.number" placeholder="不限" :min="0" :max="9999" />
    </a-form-item>
    <a-form-item label="显示选项">
      <a-radio-group v-model="conditions.displayOption" button-style="solid">
        <a-radio-button :value="0">全部</a-radio-button>
        <a-radio-button :value="1">未待选</a-radio-button>
        <a-radio-button :value="2">已待选</a-radio-button>
      </a-radio-group>
    </a-form-item>
  </a-form>
</template>

<script>
  import {LookupConditionsMixin} from '../../../../mixins/LookupPanel';

  export default {
    name: 'LookupConditions',
    mixins: [LookupConditionsMixin],
  };
</script>

<style scoped>
  .conditions-wrapper {
    padding: 16px 16px 0;
  }

  /*noinspection CssUnusedSymbol*/
  .ant-form-item {
    margin-bottom: 0;
  }

  /*noinspection CssUnusedSymbol*/
  .ant-input-affix-wrapper >>> .ant-input {
    padding-left: 84px !important;
  }

  /*noinspection CssUnusedSymbol*/
  .ant-input-affix-wrapper >>> .ant-input-prefix {
    pointer-events: none;
  }

  .label {
    text-align-last: justify;
    white-space: nowrap;
    text-align: justify;
    user-select: none;
    width: 70px;
  }
</style>
