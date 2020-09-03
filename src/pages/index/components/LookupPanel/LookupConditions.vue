<template>
  <a-card class="lookup-conditions" size="small">
    <a-form layout="inline" ref="form">
      <a-form-item :validate-status="regexpValidateStatus['course_id']" label="课程号">
        <a-input allow-clear class="w-120px" v-model="conditions.search['course_id']" />
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['course_name']" label="课程名称">
        <a-input :placeholder="placeholder['course_name']" allow-clear class="w-200px"
                 v-model="conditions.search['course_name']" />
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['credit']" label="学分数">
        <a-input :placeholder="placeholder['credit']" allow-clear class="w-80px"
                 v-model="conditions.search['credit']" />
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['teacher_id']" label="教师号">
        <a-input allow-clear class="w-100px" v-model="conditions.search['teacher_id']" />
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['teacher_name']" label="教师姓名">
        <a-input :placeholder="placeholder['teacher_name']" allow-clear class="w-120px"
                 v-model="conditions.search['teacher_name']" />
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['class_time']" label="上课时间">
        <a-input :placeholder="placeholder['class_time']" allow-clear class="w-140px"
                 v-model="conditions.search['class_time']" />
      </a-form-item>
      <a-form-item label="上课日期">
        <a-auto-complete :data-source="$store.state.allClassesExtraDistinctDate" allow-clear class="w-200px"
                         placeholder="(新)" v-model="conditions.date" />
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
        <a-switch checked-children="是" un-checked-children="否" v-model="conditions.filterConflicts" />
      </a-form-item>
      <a-form-item label="容量至少剩余">
        <a-input-number :max="9999" :min="0" class="w-80px" placeholder="不限" v-model.number="conditions.number" />
      </a-form-item>
      <a-form-item label="显示选项">
        <a-radio-group v-model="conditions.displayOption">
          <a-radio :value="0">全部</a-radio>
          <a-radio :value="1">只显示未待选</a-radio>
          <a-radio :value="2">只显示已待选</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item>
        <a-button :class="{'more-options': true, 'more-options-activated': moreOptionActivated}"
                  @click="moreOptionsVisible = true"
                  size="small" type="link">
          更多选项...
        </a-button>
      </a-form-item>
    </a-form>
    <a-modal :footer="null" destroy-on-hide v-model="moreOptionsVisible">
      <h3 class="modal-title">更多课程检索选项</h3>
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol" class="modal-form" ref="modalForm">
        <a-form-item help="作用范围：课程号、课程名称、学分数、教师号、教师姓名、上课时间。" label="正则表达式模式">
          <a-switch checked-children="开" un-checked-children="关" v-model="conditions.regexpMode" />
        </a-form-item>
        <a-form-item label="选课限制(AND)">
          <div>
            <a-tag color="orange">限制人数</a-tag>
            <a-radio-group :options="limitationOptions" class="options"
                           v-model="conditions.filterLimitations['xian_zhi_ren_shu']" />
          </div>
          <div>
            <a-tag color="red">禁止选课</a-tag>
            <a-radio-group :options="limitationOptions" class="options"
                           v-model="conditions.filterLimitations['jin_zhi_xuan_ke']" />
          </div>
          <div>
            <a-tag color="blue">禁止退课</a-tag>
            <a-radio-group :options="limitationOptions" class="options"
                           v-model="conditions.filterLimitations['jin_zhi_tui_ke']" />
          </div>
          <div>
            <a-tag>地点不开</a-tag>
            <a-radio-group :options="limitationOptions" class="options" v-model="conditions.filterVenue" />
          </div>
        </a-form-item>
        <a-config-provider :get-popup-container="() => $refs.sortBy.$el">
          <a-form-item label="排序依据" ref="sortBy">
            <a-select
              :default-value="`${index}+de`" :key="`${index}`"
              :options="options"
              @change="changeSortBy"
              v-for="(options, index) in sortByOptionsList"
            />
          </a-form-item>
        </a-config-provider>
        <a-config-provider :get-popup-container="() => $refs.limitRows.$el">
          <a-form-item help="限制页数可加快筛选速度，参考设备性能来选择。" label="筛选页数" ref="limitRows">
            <a-select v-model="conditions.limitRows">
              <a-select-option :value="0">不限</a-select-option>
              <a-select-option :value="100">只显示前10页</a-select-option>
            </a-select>
          </a-form-item>
        </a-config-provider>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
  import { LookupConditionsMixin } from '../../../../mixins/LookupPanel';


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

  .w-180px {
    width: 180px;
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
  .modal-form >>> .ant-form-explain {
    font-size: 12px;
  }

  /*noinspection CssUnusedSymbol*/
  .more-options-activated {
    font-weight: bold;
  }
</style>
