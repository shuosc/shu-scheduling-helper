<template>
  <div class="lookup-panel-wrapper">
    <LookupConditions @filter="countdown(300, true)" ref="conditions" />
    <!--suppress JSUnusedGlobalSymbols -->
    <a-table
      :custom-row="customRow"
      :data-source="rows"
      :locale="{emptyText: '没有匹配的记录'}"
      :pagination="{position: 'both', showTotal: total => `${total} 条记录`}"
      class="table"
      ref="table"
    >
      <a-table-column data-index="number" title="人数">
        <template v-slot="number">
          <NumberCapacity :class-key="number.key" />
        </template>
      </a-table-column>
      <a-table-column data-index="course" title="课程">
        <template v-slot="course">
          <a :href="getLinkHref(course.id)" :title="getLinkTitle(course)"
             @click="showCourseIntroduction($event, getLinkHref(course.id))" class="course-intro-link"
             rel="external nofollow" target="_blank">
            <strong>{{ course.name }}</strong>
          </a>
          <a-badge :count="`${course.credit}学分`" class="credit-badge" />
          <br />
          <small class="id-info">{{ course.id }}</small>
        </template>
      </a-table-column>
      <a-table-column data-index="teacher" title="教师">
        <template v-slot="teacher">
          {{ teacher.name }}<br /><small class="id-info teacher-id-info">{{ teacher.id }}</small>
        </template>
      </a-table-column>
      <a-table-column data-index="class_time_info" title="上课时间">
        <template v-slot="class_time_info">
          {{ class_time_info.row['class_time'] }}
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <a-icon class="previewing" type="eye" v-if="!class_time_info.isSelected && class_time_info.canPreview" />
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <template v-if="Object.keys(class_time_info.conflicts).length > 0">
            <br /><small class="conflict-info">时间冲突</small>
          </template>
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <template v-else-if="class_time_info.isSelected">
            <br />
            <small class="selected-info">
              <a-icon theme="twoTone" two-tone-color="#52c41a" type="check-circle" />
              已选
            </small>
          </template>
          <br
            v-if="($store.getters.extra(class_time_info.key).date && $store.getters.extra(class_time_info.key).date !== '不开') || $store.getters.extra(class_time_info.key).limitations.length > 0" />
          <a-tag
            class="limitation-tag"
            key="date"
            v-if="$store.getters.extra(class_time_info.key).date && $store.getters.extra(class_time_info.key).date !== '不开'"
          >
            <a-icon type="calendar" />
            <a-divider type="vertical" />
            <span>{{ $store.getters.extra(class_time_info.key).date }}</span>
          </a-tag>
          <a-tag
            :color="getLimitationColor(limitation)"
            :key="index"
            class="limitation-tag"
            v-for="(limitation, index) in $store.getters.extra(class_time_info.key).limitations"
          >
            {{ limitation }}
          </a-tag>
        </template>
      </a-table-column>
      <a-table-column data-index="venue" title="地点">
        <template v-slot="venue">
          {{ venue.campus }}<br />
          <small class="detail-venue">{{ $store.getters.extra(venue.key).venue }}</small>
        </template>
      </a-table-column>
      <!--suppress HtmlDeprecatedAttribute -->
      <a-table-column data-index="action" width="160px">
        <div class="about-data-wrapper" slot="title">
          <a-popover placement="leftBottom">
            <div class="about-data" slot="content">
              人数等所有数据<strong>【非实时】</strong>，视情况可能存在高达数日的误差，仅供参考。<br />
              更新时间：
              <a-tag>
                <a-icon type="clock-circle" />
                <a-divider type="vertical" />
                <span>{{ new Date($store.state.allClassesExtraUpdateTime).toLocaleString() }}</span>
              </a-tag>
              数据HASH：
              <a-tag>
                <a-icon type="tag" />
                <a-divider type="vertical" />
                <span>{{ $store.state.allClassesHash }}</span>
              </a-tag>
            </div>
            <a-button icon="info-circle" size="small" type="link">说明</a-button>
          </a-popover>
        </div>
        <template v-slot="action">
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <a-dropdown-button
            :disabled="storageBusy"
            @click="reserveClass(action.row, false)"
            type="primary"
            v-if="!action.isReserved"
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
            :disabled="storageBusy"
            @click="removeReservedClass(action.row)"
            type="dashed"
            v-else
          >
            <a-icon type="minus-circle" />
            待选
            <a-menu slot="overlay">
              <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
              <a-menu-item @click="unselectClass(action.row)" v-if="action.isSelected">
                回到待选状态
              </a-menu-item>
              <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
              <a-menu-item @click="selectClass(action.row, action.conflicts)" v-else>
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
  import { conflictSolvingMixin } from '../../../../mixins/common/conflictsSolver';
  import { introductionOpenerMixin } from '../../../../mixins/common/introductionOpener';
  import { LookupPanelMixin } from '../../../../mixins/LookupPanel';
  import LookupConditions from './LookupConditions';
  import NumberCapacity from './NumberCapacity';


  export default {
    name: 'LookupPanel',
    components: {
      NumberCapacity,
      LookupConditions,
    },
    mixins: [introductionOpenerMixin, conflictSolvingMixin, LookupPanelMixin],
  };
</script>

<style scoped>
  .table >>> td {
    position: relative;
  }

  .lookup-panel-wrapper {
    padding-top: 16px;
  }

  /*noinspection CssUnusedSymbol*/
  .table >>> .ant-table-pagination {
    margin-right: 16px;
    margin-left: 16px;
  }

  .table >>> .ant-table-thead th {
    white-space: nowrap;
  }

  /*noinspection CssUnusedSymbol*/
  .table >>> .ant-table-thead th, .table >>> .ant-table-row td {
    padding: 12px;
  }

  /*noinspection CssUnusedSymbol*/
  .table >>> .ant-table-thead th:first-child, .table >>> .ant-table-row td:first-child {
    padding-left: 16px;
  }

  .credit-badge {
    position: relative;
    top: -1px;
    margin-left: 7px;
  }

  /*noinspection CssUnusedSymbol*/
  .credit-badge >>> .ant-badge-count {
    color: rgba(0, 0, 0, 0.65);
    background: white;
    box-shadow: 0 0 0 1px #d9d9d9 inset;
  }

  .id-info {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.35);
  }

  .teacher-id-info {
    display: inline-block;
    width: 60px;
  }

  .conflict-info {
    font-size: 12px;
    display: inline-block;
    padding-bottom: 2px;
    color: rgba(244, 67, 54, 0.8);
  }

  .selected-info {
    font-size: 12px;
    display: inline-block;
    padding-bottom: 2px;
    color: #52c41a;
  }

  .limitation-tag {
    margin-top: 2px;
  }

  .detail-venue {
    font-size: 12px;
    display: inline-block;
    overflow: hidden;
    width: 60px;
    vertical-align: middle;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgba(0, 0, 0, 0.35);
  }

  /*noinspection CssUnusedSymbol*/
  .table >>> .ant-table-row:hover .detail-venue {
    white-space: inherit;
  }

  /*noinspection CssUnusedSymbol*/
  .table >>> .ant-pagination.ant-table-pagination:first-child {
    margin-top: 0;
  }

  .about-data-wrapper {
    text-align: right;
  }

  .about-data {
    line-height: 2;
  }

  .course-intro-link {
    line-height: 24px;
    padding-bottom: 2px;
    text-decoration: none;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid transparent;
  }

  /*noinspection CssUnusedSymbol*/
  .course-intro-link:focus, .table >>> .ant-table-row:hover .course-intro-link {
    border-bottom: 1px dotted rgba(0, 0, 0, 0.35);
  }

  .course-intro-link:hover {
    color: #64b5f6;
  }

  .course-intro-link:active {
    color: #1976d2;
  }

  .previewing {
    font-size: 12px;
    position: absolute;
    display: none;
    margin: 5px 0 0 5px;
    color: #64b5f6;
  }

  .table >>> .ant-table-row:hover .previewing {
    display: inline;
  }
</style>
