<template>
  <a-config-provider>
    <template slot="renderEmpty">
      <div>没有匹配的记录</div>
    </template>
    <div class="lookup-panel-wrapper">
      <LookupConditions @filter="countdown(300, true)" ref="conditions" />
      <a-divider />
      <a-list
        :data-source="rows"
        :locale="{emptyText: '没有匹配的记录'}"
        :pagination="pagination"
        item-layout="vertical"
        ref="list"
      >
        <!--suppress JSUnresolvedVariable -->
        <a-list-item slot="renderItem" slot-scope="course">
          <h3>
            {{ course['course_name'] }} <small>({{ course['course_id'] }})</small>
            <a-badge :count="`${course.credit}学分`" class="credit-badge" />
          </h3>
          <h4>{{ course['teacher_name'] }} <small>({{ course['teacher_id'] }})</small></h4>
          <div class="course-info">
            {{ course['class_time'] }}
            <a-divider type="vertical" />
            {{ $store.getters.extra(`${course['course_id']}-${course['teacher_id']}`).number }}/{{
            $store.getters.extra(`${course['course_id']}-${course['teacher_id']}`).capacity }}人
            <br />
            {{ course['campus'] }}
            <a-divider type="vertical" />
            {{ $store.getters.extra(`${course['course_id']}-${course['teacher_id']}`).venue }}
            <br
              v-if="($store.getters.extra(`${course['course_id']}-${course['teacher_id']}`).date && $store.getters.extra(`${course['course_id']}-${course['teacher_id']}`).date !== '不开') || $store.getters.extra(`${course['course_id']}-${course['teacher_id']}`).limitations.length > 0" />
            <a-tag
              class="limitation-tag"
              key="date"
              v-if="$store.getters.extra(`${course['course_id']}-${course['teacher_id']}`).date && $store.getters.extra(`${course['course_id']}-${course['teacher_id']}`).date !== '不开'"
            >
              <a-icon type="calendar" />
              <a-divider type="vertical" />
              <span>{{ $store.getters.extra(`${course['course_id']}-${course['teacher_id']}`).date }}</span>
            </a-tag>
            <a-tag
              :color="getLimitationColor(limitation)"
              :key="index"
              class="limitation-tag"
              v-for="(limitation, index) in $store.getters.extra(`${course['course_id']}-${course['teacher_id']}`).limitations"
            >
              {{ limitation }}
            </a-tag>
          </div>
          <!--suppress JSUnresolvedVariable -->
          <a-button-group slot="actions" v-if="!course['action'].isReserved">
            <!--suppress JSUnresolvedVariable -->
            <a-button
              :disabled="storageBusy"
              @click="reserveClass(course['action'].row, false)"
              type="primary"
            >
              <a-icon type="plus-circle" />
              待选
            </a-button>
            <!--suppress JSUnresolvedVariable -->
            <a-button
              :disabled="storageBusy"
              @click="reserveClass(course['action'].row, true, course['action'].conflicts)"
            >
              加待选并选择
            </a-button>
          </a-button-group>
          <!--suppress JSUnresolvedVariable -->
          <a-button-group slot="actions" v-else>
            <!--suppress JSUnresolvedVariable -->
            <a-button
              :disabled="storageBusy"
              @click="removeReservedClass(course['action'].row)"
              type="dashed"
            >
              <a-icon type="minus-circle" />
              待选
            </a-button>
            <!--suppress JSUnresolvedVariable -->
            <a-button
              :disabled="storageBusy"
              @click="unselectClass(course['action'].row)"
              v-if="course['action'].isSelected"
            >
              回到待选状态
            </a-button>
            <!--suppress JSUnresolvedVariable -->
            <a-button
              :disabled="storageBusy"
              @click="selectClass(course['action'].row, course['action'].conflicts)"
              v-else
            >
              选择此待选课
            </a-button>
          </a-button-group>
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <div class="conflict-info" slot="actions" v-if="Object.keys(course['class_time_info'].conflicts).length > 0">
            时间冲突
          </div>
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <div class="selected-info" slot="actions" v-else-if="course['class_time_info'].isSelected">
            <a-icon theme="twoTone" two-tone-color="#52c41a" type="check-circle" />
            已选
          </div>
        </a-list-item>
      </a-list>
      <div class="total">共{{ rows.length }}条记录</div>
      <a-divider />
      <div class="about-data">
        人数等所有数据<strong>【非实时】</strong>，<br />视情况可能存在高达数日的误差，仅供参考。<br />
        更新时间：
        <a-tag>
          <a-icon type="clock-circle" />
          <a-divider type="vertical" />
          <span>{{ new Date($store.state.allClassesExtraUpdateTime).toLocaleString() }}</span>
        </a-tag>
        <br />
        数据HASH：
        <a-tag>
          <a-icon type="tag" />
          <a-divider type="vertical" />
          <span>{{ $store.state.allClassesHash }}</span>
        </a-tag>
      </div>
    </div>
  </a-config-provider>
</template>

<script>
  import { conflictSolvingMixin } from '../../../../mixins/common/conflictsSolver';
  import { LookupPanelMixin } from '../../../../mixins/LookupPanel';
  import LookupConditions from './LookupConditions';


  export default {
    name: 'LookupPanel',
    components: {
      LookupConditions,
    },
    mixins: [conflictSolvingMixin, LookupPanelMixin],
    data() {
      return {
        pagination: {
          position: 'both',
          pageSize: 5,
          simple: true,
          hideOnSinglePage: true,
        },
      };
    },
  };
</script>

<style scoped>
  .total {
    margin-top: 8px;
    margin-bottom: 24px;
    text-align: center;
  }

  .conflict-info {
    font-size: 12px;
    margin-top: 6px;
    color: rgba(244, 67, 54, 0.8);
  }

  .selected-info {
    font-size: 12px;
    margin-top: 6px;
    color: #52c41a;
  }

  .credit-badge {
    margin-left: 7px;
  }

  /*noinspection CssUnusedSymbol*/
  .credit-badge >>> .ant-badge-count {
    color: rgba(0, 0, 0, 0.65);
    background: white;
    box-shadow: 0 0 0 1px #d9d9d9 inset;
  }

  /*noinspection CssUnusedSymbol*/
  .ant-list-item {
    padding: 16px;
  }

  /*noinspection CssUnusedSymbol*/
  .ant-list >>> .ant-list-pagination {
    /*margin-bottom: 24px;*/
    text-align: center;
  }

  .limitation-tag {
    margin-top: 6px;
  }

  .course-info {
    line-height: 1.8;
  }

  h3 {
    font-size: 17px;
    margin-bottom: 0;
  }

  h4 {
    font-size: 15px;
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.65);
  }

  .about-data {
    line-height: 2;
    margin-bottom: 32px;
    padding: 0 16px;
    text-align: center;
  }
</style>
