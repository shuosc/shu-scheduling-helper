<template>
  <div class="lookup-panel-wrapper">
    <LookupConditions ref="conditions" @filter="countdown(300, true)" />
    <!--suppress JSUnusedGlobalSymbols -->
    <a-table
      ref="table"
      class="table"
      :data-source="rows"
      :locale="{emptyText: '没有匹配的记录'}"
      :pagination="{showTotal: total => `${total} 条记录`}"
    >
      <a-table-column title="课程" data-index="course">
        <template v-slot="course">
          <strong>{{ course.name }}</strong>
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <a-badge class="credit-badge" :count="`${course.credit}学分`" />
          <br /><small class="id-info">{{ course.id }}</small>
        </template>
      </a-table-column>
      <a-table-column title="教师" data-index="teacher">
        <template v-slot="teacher">
          {{ teacher.name }}<br /><small class="id-info">{{ teacher.id }}</small>
        </template>
      </a-table-column>
      <a-table-column title="上课时间" data-index="class_time_info">
        <template v-slot="class_time_info">
          {{ class_time_info.row['class_time'] }}
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <template v-if="Object.keys(class_time_info.conflicts).length > 0">
            <br /><small class="conflict-info">时间冲突</small>
          </template>
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <template v-else-if="class_time_info.isSelected">
            <br />
            <small class="selected-info">
              <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
              已选
            </small>
          </template>
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <a-button
            v-else-if="class_time_info.canPreview"
            class="lookup-class-time-preview"
            type="link"
            shape="circle"
            icon="eye"
            :disabled="storageBusy"
            @mouseenter="previewClass(class_time_info.row)"
            @mouseleave="cancelPreviewClass(class_time_info.row)"
          />
        </template>
      </a-table-column>
      <a-table-column title="校区" data-index="campus" width="70px" />
      <!--suppress HtmlDeprecatedAttribute -->
      <a-table-column data-index="action" width="160px">
        <template v-slot="action">
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <a-dropdown-button
            v-if="!action.isReserved"
            type="primary"
            :disabled="storageBusy"
            @click="reserveClass(action.row, false)"
          >
            <a-icon type="plus-circle" />
            待选
            <a-menu slot="overlay">
              <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
              <a-menu-item @click="reserveClass(action.row, true, action.conflicts)">
                <template v-if="Object.keys(action.conflicts).length > 0">加入待选并选择，让我来解决冲突...</template>
                <template v-else>加入待选并选择</template>
              </a-menu-item>
            </a-menu>
          </a-dropdown-button>
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <a-dropdown-button
            v-else
            type="dashed"
            :disabled="storageBusy"
            @click="removeReservedClass(action.row)"
          >
            <a-icon type="minus-circle" />
            待选
            <a-menu slot="overlay">
              <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
              <a-menu-item v-if="action.isSelected" @click="unselectClass(action.row)">
                回到待选状态
              </a-menu-item>
              <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
              <a-menu-item v-else @click="selectClass(action.row, action.conflicts)">
                <template v-if="Object.keys(action.conflicts).length > 0">选择此待选课，让我来解决冲突...</template>
                <template v-else>选择此待选课</template>
              </a-menu-item>
            </a-menu>
          </a-dropdown-button>
        </template>
      </a-table-column>
    </a-table>
  </div>
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
  };
</script>

<style scoped>
  .lookup-panel-wrapper {
    padding-top: 16px;
  }

  /*noinspection CssUnusedSymbol*/
  .table >>> .ant-table-pagination {
    margin-left: 16px;
    margin-right: 16px;
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

  .id-info {
    font-size: 12px;
    opacity: 0.6;
  }

  .conflict-info {
    font-size: 12px;
    opacity: 0.6;
    color: #F44336;
  }

  .selected-info {
    font-size: 12px;
    color: #52c41a;
  }
</style>
