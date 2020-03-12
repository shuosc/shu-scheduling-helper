<template>
  <a-card class="lookup-conditions" size="small">
    <a-form ref="form" layout="inline">
      <a-form-item label="课程号">
        <a-input class="w-120px" v-model="conditions.search['course_id']" allow-clear />
      </a-form-item>
      <a-form-item label="课程名称">
        <a-input class="w-200px" v-model="conditions.search['course_name']" allow-clear
                 :placeholder="placeholder['course_name']" />
      </a-form-item>
      <a-form-item label="学分数">
        <a-input class="w-80px" v-model="conditions.search['credit']" allow-clear
                 :placeholder="placeholder['credit']" />
      </a-form-item>
      <a-form-item label="教师号">
        <a-input class="w-100px" v-model="conditions.search['teacher_id']" allow-clear />
      </a-form-item>
      <a-form-item label="教师姓名">
        <a-input class="w-120px" v-model="conditions.search['teacher_name']" allow-clear
                 :placeholder="placeholder['teacher_name']" />
      </a-form-item>
      <a-form-item label="上课时间">
        <a-input class="w-140px" v-model="conditions.search['class_time']" allow-clear
                 :placeholder="placeholder['class_time']" />
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
      <a-form-item>
        <a-button :class="{'more-options': true, 'more-options-activated': moreOptionActivated}" type="link"
                  size="small" @click="moreOptionsVisible = true">
          更多选项...
        </a-button>
      </a-form-item>
    </a-form>
    <a-modal v-model="moreOptionsVisible" :footer="null" destroy-on-hide>
      <h3 class="modal-title">更多课程检索选项</h3>
      <a-form ref="modalForm" class="modal-form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="正则表达式模式" validate-messages="123">
          <a-switch v-model="conditions.regexpMode" checked-children="开" un-checked-children="关" />
        </a-form-item>
        <a-form-item label="选课限制(AND)">
          <div>
            <a-tag color="orange">限制人数</a-tag>
            <a-radio-group class="options" :options="limitationOptions"
                           v-model="conditions.filterLimitations['xian_zhi_ren_shu']" />
          </div>
          <div>
            <a-tag color="red">禁止选课</a-tag>
            <a-radio-group class="options" :options="limitationOptions"
                           v-model="conditions.filterLimitations['jin_zhi_xuan_ke']" />
          </div>
          <div>
            <a-tag color="blue">禁止退课</a-tag>
            <a-radio-group class="options" :options="limitationOptions"
                           v-model="conditions.filterLimitations['jin_zhi_tui_ke']" />
          </div>
          <div>
            <a-tag>地点不开</a-tag>
            <a-radio-group class="options" :options="limitationOptions" v-model="conditions.filterVenue" />
          </div>
        </a-form-item>
        <a-config-provider :get-popup-container="() => $refs.sortBy.$el">
          <a-form-item ref="sortBy" label="排序依据">
            <a-select
              v-for="(options, index) in sortByOptionsList" :key="`${index}`"
              :options="options"
              :default-value="`${index}+de`"
              @change="changeSortBy"
            />
          </a-form-item>
        </a-config-provider>
      </a-form>
    </a-modal>
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

  @media screen and (max-width: 575px) {
    .w-200px, .w-140px, .w-120px, .w-100px, .w-80px {
      width: 100%;
    }
  }

  .options {
    margin-left: 15px;
  }

  .modal-title {
    margin-bottom: 18px;
  }

  /*noinspection CssUnusedSymbol*/
  .modal-form >>> .ant-form-item {
    margin-bottom: 12px;
  }

  /*noinspection CssUnusedSymbol*/
  .more-options-activated {
    font-weight: bold;
  }
</style>
