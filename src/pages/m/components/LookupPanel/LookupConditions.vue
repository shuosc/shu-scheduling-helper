<template>
  <div>
    <a-form class="conditions-wrapper" layout="vertical" ref="form">
      <a-form-item :validate-status="regexpValidateStatus['course_id']">
        <a-input allow-clear v-model="conditions.search['course_id']">
          <span class="label" slot="prefix">课程号：</span>
        </a-input>
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['course_name']">
        <a-input :placeholder="placeholder['course_name']" allow-clear v-model="conditions.search['course_name']">
          <span class="label" slot="prefix">课程名称：</span>
        </a-input>
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['credit']">
        <a-input :placeholder="placeholder['credit']" allow-clear v-model="conditions.search['credit']">
          <span class="label" slot="prefix">学分数：</span>
        </a-input>
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['teacher_id']">
        <a-input allow-clear v-model="conditions.search['teacher_id']">
          <span class="label" slot="prefix">教师号：</span>
        </a-input>
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['teacher_name']">
        <a-input :placeholder="placeholder['teacher_name']" allow-clear v-model="conditions.search['teacher_name']">
          <span class="label" slot="prefix">教师姓名：</span>
        </a-input>
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['class_time']">
        <a-input :placeholder="placeholder['class_time']" allow-clear v-model="conditions.search['class_time']">
          <span class="label" slot="prefix">上课时间：</span>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-auto-complete :data-source="$store.state.allClassesExtraDistinctDate" allow-clear v-model="conditions.date">
          <a-input allow-clear placeholder="(新)">
            <span class="label" slot="prefix">上课日期：</span>
          </a-input>
        </a-auto-complete>
      </a-form-item>
      <a-row>
        <a-col :xs="11">
          <a-form-item label="校区">
            <a-select v-model="conditions.search['campus']">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="宝山">宝山</a-select-option>
              <a-select-option value="嘉定">嘉定</a-select-option>
              <a-select-option value="延长">延长</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="{offset: 2, span: 11}">
          <a-form-item label="筛除时间冲突选项">
            <a-switch checked-children="是" un-checked-children="否" v-model="conditions.filterConflicts" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="容量至少剩余">
        <a-input-number :max="9999" :min="0" class="w-80px" placeholder="不限" v-model.number="conditions.number" />
      </a-form-item>
      <a-form-item label="显示选项">
        <a-radio-group button-style="solid" v-model="conditions.displayOption">
          <a-radio-button :value="0">全部</a-radio-button>
          <a-radio-button :value="1">未待选</a-radio-button>
          <a-radio-button :value="2">已待选</a-radio-button>
        </a-radio-group>
        <a-button :class="{'more-options': true, 'more-options-activated': moreOptionActivated}"
                  @click="moreOptionsVisible = true"
                  type="link">
          更多选项...
        </a-button>
      </a-form-item>
    </a-form>
    <a-modal :footer="null" destroy-on-hide v-model="moreOptionsVisible">
      <h3 class="modal-title">更多课程检索选项</h3>
      <a-form class="modal-form" ref="modalForm" type="vertical">
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
            <!--suppress JSUnusedLocalSymbols -->
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
              <a-select-option :value="100">只显示前20页</a-select-option>
            </a-select>
          </a-form-item>
        </a-config-provider>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import { LookupConditionsMixin } from '../../../../mixins/LookupPanel';


  export default {
    name: 'LookupConditions',
    mixins: [LookupConditionsMixin],
  };
</script>

<style scoped>
  .conditions-wrapper {
    padding: 16px 16px 0;
  }

  .w-80px {
    width: 80px;
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
    width: 70px;
    user-select: none;
    text-align: justify;
    text-align-last: justify;
    white-space: nowrap;
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
