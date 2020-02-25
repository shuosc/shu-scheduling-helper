<template>
  <a-config-provider>
    <template slot="renderEmpty">
      <div>没有匹配的记录</div>
    </template>
    <div class="lookup-panel-wrapper">
      <LookupConditions ref="conditions" @filter="countdown(300)" />
      <a-divider />
      <a-list
        item-layout="vertical"
        :data-source="rows"
        :pagination="pagination"
        :locale="{emptyText: '没有匹配的记录'}"
      >
        <!--suppress JSUnresolvedVariable -->
        <a-list-item slot="renderItem" slot-scope="course">
          <h3>
            {{ course['course_name'] }} <small>({{ course['course_id'] }})</small>
            <a-badge class="credit-badge" :count="`${course.credit}学分`" />
          </h3>
          <div>
            {{ course['class_time'] }}
            <a-divider type="vertical" />
            {{ course['teacher_name'] }} <small>({{ course['teacher_id'] }})</small>
            <a-divider type="vertical" />
            {{ course['campus'] }}
          </div>
          <!--suppress JSUnresolvedVariable -->
          <a-button-group slot="actions" v-if="!course['action'].isReserved">
            <!--suppress JSUnresolvedVariable -->
            <a-button
              type="primary"
              :disabled="storageBusy"
              @click="reserveClass(course['action'].row, false)"
            >
              <a-icon type="plus-circle" />
              待选
            </a-button>
            <!--suppress JSUnresolvedVariable -->
            <a-button
              :disabled="storageBusy"
              @click="reserveClass(course['action'].row, true, course['action'].conflicts)"
            >
              加入待选并选择
            </a-button>
          </a-button-group>
          <!--suppress JSUnresolvedVariable -->
          <a-button-group slot="actions" v-else>
            <!--suppress JSUnresolvedVariable -->
            <a-button
              type="dashed"
              :disabled="storageBusy"
              @click="removeReservedClass(course['action'].row)"
            >
              <a-icon type="minus-circle" />
              待选
            </a-button>
            <!--suppress JSUnresolvedVariable -->
            <a-button
              v-if="course['action'].isSelected"
              :disabled="storageBusy"
              @click="unselectClass(course['action'].row)"
            >
              回到待选状态
            </a-button>
            <!--suppress JSUnresolvedVariable -->
            <a-button
              v-else
              :disabled="storageBusy"
              @click="selectClass(course['action'].row, course['action'].conflicts)"
            >
              选择此待选课
            </a-button>
          </a-button-group>
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <div slot="actions" class="conflict-info" v-if="Object.keys(course['class_time_info'].conflicts).length > 0">
            时间冲突
          </div>
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <div slot="actions" class="selected-info" v-else-if="course['class_time_info'].isSelected">
            <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            已选
          </div>
        </a-list-item>
      </a-list>
      <div class="total">共{{ rows.length }}条记录</div>
    </div>
  </a-config-provider>
</template>

<script>
  import LookupConditions from './LookupConditions';
  import {conflictSolvingMixin} from '../../../../mixins/common/conflictsSolver';
  import {LookupPanelMixin} from '../../../../mixins/LookupPanel';

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
    margin-top: 6px;
    font-size: 12px;
    color: rgba(255, 0, 0, 0.6);
  }

  .selected-info {
    margin-top: 6px;
    font-size: 12px;
    color: #52c41a;
  }

  .credit-badge {
    margin-left: 7px;
  }

  /*noinspection CssUnusedSymbol*/
  .credit-badge >>> .ant-badge-count {
    background: white;
    color: #999999;
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
</style>
