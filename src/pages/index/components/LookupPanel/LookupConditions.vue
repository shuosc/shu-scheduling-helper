<template>
  <a-card class="lookup-conditions" size="small">
    <a-form ref="form" layout="inline">
      <a-form-item label="课程号">
        <a-input class="w-120px" v-model="conditions.search['course_id']" allow-clear />
      </a-form-item>
      <a-form-item label="课程名称">
        <a-input class="w-200px" v-model="conditions.search['course_name']" allow-clear />
      </a-form-item>
      <a-form-item label="学分数">
        <a-input class="w-80px" v-model="conditions.search['credit']" allow-clear />
      </a-form-item>
      <a-form-item label="教师号">
        <a-input class="w-100px" v-model="conditions.search['teacher_id']" allow-clear />
      </a-form-item>
      <a-form-item label="教师姓名">
        <a-input class="w-120px" v-model="conditions.search['teacher_name']" allow-clear />
      </a-form-item>
      <a-form-item label="上课时间">
        <a-input class="w-140px" v-model="conditions.search['class_time']" allow-clear />
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
        <a-radio-group v-model="conditions.displayOption">
          <a-radio :value="0">全部</a-radio>
          <a-radio :value="1">只显示未待选</a-radio>
          <a-radio :value="2">只显示已待选</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
  import {LookupConditionsMixin} from '../../../../mixins/LookupPanel';

  export default {
    name: 'LookupConditions',
    mixins: [LookupConditionsMixin],
  };
</script>

<style scoped>
  .lookup-conditions {
    margin: 0 16px 16px;
  }

  .w-200px {
    width: 200px;
  }

  .w-140px {
    width: 140px;
  }

  .w-120px {
    width: 120px;
  }

  .w-100px {
    width: 100px;
  }

  .w-80px {
    width: 80px;
  }
</style>
