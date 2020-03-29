<template>
  <div class="lookup-panel-wrapper">
    <LookupConditions ref="conditions" @filter="countdown(300, true)" />
    <!--suppress JSUnusedGlobalSymbols -->
    <a-table
      ref="table"
      class="table"
      :data-source="rows"
      :locale="{emptyText: '没有匹配的记录'}"
      :pagination="{position: 'both', showTotal: total => `${total} 条记录`}"
      :scroll="{x: 480}"
      :custom-row="customRow"
    >
      <a-table-column title="人数" data-index="number">
        <template v-slot="number">
          <NumberCapacity :class-key="number.key" />
        </template>
      </a-table-column>
      <a-table-column title="课程" data-index="course">
        <template v-slot="course">
          <a class="course-intro-link" :title="getLinkTitle(course)" target="_blank" rel="external nofollow"
             :href="getLinkHref(course.id)" @click="showCourseIntroduction($event, getLinkHref(course.id))">
            <strong>{{ course.name }}</strong>
          </a>
          <a-badge class="credit-badge" :count="`${course.credit}学分`" />
          <br />
          <small class="id-info">{{ course.id }}</small>
        </template>
      </a-table-column>
      <a-table-column title="教师" data-index="teacher">
        <template v-slot="teacher">
          {{ teacher.name }}<br /><small class="id-info teacher-id-info">{{ teacher.id }}</small>
        </template>
      </a-table-column>
      <a-table-column title="上课时间" data-index="class_time_info">
        <template v-slot="class_time_info">
          {{ class_time_info.row['class_time'] }}
          <!--suppress JSUnresolvedVariable, ES6ModulesDependencies -->
          <a-icon v-if="!class_time_info.isSelected && class_time_info.canPreview" class="previewing" type="eye" />
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
          <br v-if="$store.getters.extra(class_time_info.key).limitations.length > 0" />
          <a-tag
            v-for="(limitation, index) in $store.getters.extra(class_time_info.key).limitations"
            class="limitation-tag"
            :color="getLimitationColor(limitation)"
            :key="index"
          >
            {{ limitation }}
          </a-tag>
        </template>
      </a-table-column>
      <a-table-column title="地点" data-index="venue">
        <template v-slot="venue">
          {{ venue.campus }}<br />
          <small class="detail-venue">{{ $store.getters.extra(venue.key).venue }}</small>
        </template>
      </a-table-column>
      <!--suppress HtmlDeprecatedAttribute -->
      <a-table-column data-index="action" width="160px">
        <div slot="title" class="about-data-wrapper">
          <a-popover placement="leftBottom">
            <div slot="content" class="about-data">
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
            <a-button size="small" type="link" icon="info-circle">说明</a-button>
          </a-popover>
        </div>
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
  import NumberCapacity from './NumberCapacity';
  import {conflictSolvingMixin} from '../../../../mixins/common/conflictsSolver';
  import {LookupPanelMixin} from '../../../../mixins/LookupPanel';
  import {introductionOpenerMixin} from '../../../../mixins/common/introductionOpener';

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
    margin-left: 16px;
    margin-right: 16px;
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
    margin-left: 7px;
    top: -1px;
  }

  /*noinspection CssUnusedSymbol*/
  .credit-badge >>> .ant-badge-count {
    box-shadow: 0 0 0 1px #d9d9d9 inset;
    color: rgba(0, 0, 0, 0.65);
    background: white;
  }

  .id-info {
    color: rgba(0, 0, 0, 0.35);
    font-size: 12px;
  }

  .teacher-id-info {
    display: inline-block;
    width: 60px;
  }

  .conflict-info {
    display: inline-block;
    padding-bottom: 2px;
    font-size: 12px;
    color: rgba(244, 67, 54, 0.8);
  }

  .selected-info {
    display: inline-block;
    padding-bottom: 2px;
    font-size: 12px;
    color: #52c41a;
  }

  .limitation-tag {
    margin-top: 2px;
  }

  .detail-venue {
    color: rgba(0, 0, 0, 0.35);
    text-overflow: ellipsis;
    vertical-align: middle;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    font-size: 12px;
    width: 60px;
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
    border-bottom: 1px solid transparent;
    color: rgba(0, 0, 0, 0.65);
    text-decoration: none;
    padding-bottom: 2px;
    line-height: 24px;
  }

  /*noinspection CssUnusedSymbol*/
  .course-intro-link:focus, .table >>> .ant-table-row:hover .course-intro-link {
    border-bottom: 1px dotted rgba(0, 0, 0, 0.35);
  }

  .course-intro-link:hover {
    color: #64B5F6;
  }

  .course-intro-link:active {
    color: #1976D2;
  }

  .previewing {
    margin: 5px 0 0 5px;
    position: absolute;
    font-size: 12px;
    color: #64B5F6;
    display: none;
  }

  .table >>> .ant-table-row:hover .previewing {
    display: inline;
  }
</style>
