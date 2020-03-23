<template>
  <div>
    <a-form ref="form" class="conditions-wrapper" layout="vertical">
      <a-form-item :validate-status="regexpValidateStatus['course_id']">
        <a-input v-model="conditions.search['course_id']" allow-clear>
          <span class="label" slot="prefix">课程号：</span>
        </a-input>
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['course_name']">
        <a-input v-model="conditions.search['course_name']" allow-clear :placeholder="placeholder['course_name']">
          <span class="label" slot="prefix">课程名称：</span>
        </a-input>
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['credit']">
        <a-input v-model="conditions.search['credit']" allow-clear :placeholder="placeholder['credit']">
          <span class="label" slot="prefix">学分数：</span>
        </a-input>
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['teacher_id']">
        <a-input v-model="conditions.search['teacher_id']" allow-clear>
          <span class="label" slot="prefix">教师号：</span>
        </a-input>
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['teacher_name']">
        <a-input v-model="conditions.search['teacher_name']" allow-clear :placeholder="placeholder['teacher_name']">
          <span class="label" slot="prefix">教师姓名：</span>
        </a-input>
      </a-form-item>
      <a-form-item :validate-status="regexpValidateStatus['class_time']">
        <a-input v-model="conditions.search['class_time']" allow-clear :placeholder="placeholder['class_time']">
          <span class="label" slot="prefix">上课时间：</span>
        </a-input>
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
            <a-switch v-model="conditions.filterConflicts" checked-children="是" un-checked-children="否" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="容量至少剩余">
        <a-input-number class="w-80px" v-model.number="conditions.number" placeholder="不限" :min="0" :max="9999" />
      </a-form-item>
      <a-form-item label="显示选项">
        <a-radio-group v-model="conditions.displayOption" button-style="solid">
          <a-radio-button :value="0">全部</a-radio-button>
          <a-radio-button :value="1">未待选</a-radio-button>
          <a-radio-button :value="2">已待选</a-radio-button>
        </a-radio-group>
        <a-button :class="{'more-options': true, 'more-options-activated': moreOptionActivated}" type="link"
                  @click="moreOptionsVisible = true">
          更多选项...
        </a-button>
      </a-form-item>
    </a-form>
    <a-modal v-model="moreOptionsVisible" :footer="null" destroy-on-hide>
      <h3 class="modal-title">更多课程检索选项</h3>
      <a-form type="vertical" ref="modalForm" class="modal-form">
        <a-form-item label="正则表达式模式" help="作用范围：课程号、课程名称、学分数、教师号、教师姓名、上课时间。">
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
            <!--suppress JSUnusedLocalSymbols -->
            <a-select
              v-for="(options, index) in sortByOptionsList" :key="`${index}`"
              :options="options"
              :default-value="`${index}+de`"
              @change="changeSortBy"
            />
          </a-form-item>
        </a-config-provider>
        <a-config-provider :get-popup-container="() => $refs.limitRows.$el">
          <a-form-item ref="limitRows" label="筛选页数" help="限制页数可加快筛选速度，参考设备性能来选择。">
            <a-select v-model="conditions.limitRows">
              <a-select-option :value="0">不限</a-select-option>
              <a-select-option :value="100">只显示前10页</a-select-option>
            </a-select>
          </a-form-item>
        </a-config-provider>
      </a-form>
    </a-modal>
  </div>
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
    text-align-last: justify;
    white-space: nowrap;
    text-align: justify;
    user-select: none;
    width: 70px;
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
