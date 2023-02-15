<template>
  <a-config-provider>
    <template slot="renderEmpty">
      <div>没有其他待选项了</div>
    </template>
    <div>
      <a-empty
        class="reserved-classes-list-empty"
        description="待选课程列表为空"
        v-if="reservedClassesKeys.length === 0"
      />
      <!--suppress JSUnresolvedVariable -->
      <a-collapse :bordered="false" accordion class="reserved-classes-list" v-model="openedCourseId">
        <template v-for="(key, index) in shownReservedClassesKeys">
          <a-collapse-panel
            :key="`${key}-divider`"
            :show-arrow="false"
            class="list-header"
            disabled
            v-if="index === reservedClassesDividers.unselectedCourse"
          >
            <template slot="header">
              未选课程
              <a-checkbox class="hide-conflict" v-model="hideConflict">隐藏时间冲突选项</a-checkbox>
            </template>
          </a-collapse-panel>
          <a-collapse-panel
            :key="`${key}-divider`"
            :show-arrow="false"
            class="list-header"
            disabled
            v-if="index === reservedClassesDividers.selectedCourse"
          >
            <template slot="header">
              已选课程 ( <span class="credits-wrapper"><strong class="credits">{{ credits }}</strong> 学分</span> )
              <a-checkbox class="hide-conflict" v-if="reservedClassesDividers.unselectedCourse < 0"
                          v-model="hideConflict">隐藏时间冲突选项
              </a-checkbox>
            </template>
          </a-collapse-panel>
          <a-collapse-panel :key="key" :ref="`course-${key}`" class="course">
            <template slot="header">
              <!--suppress JSUnresolvedVariable -->
              <CourseMeta :all-conflicted="allConflicted[key]" :course="reservedClasses[key]"
                          :expanded="openedCourseId === key"
                          :id="key" />
            </template>
            <!--suppress JSUnresolvedVariable -->
            <CourseClassesList :course="reservedClasses[key]" :expanded="openedCourseId === key" :id="key"
                               @unselect="scrollTo" />
          </a-collapse-panel>
        </template>
      </a-collapse>
    </div>
  </a-config-provider>
</template>

<script>
  import { ReservedClassesListMixin } from '../../../../mixins/ReservedClassesList';
  import CourseClassesList from './CourseClassesList';
  import CourseMeta from './CourseMeta';


  export default {
    name: 'ReservedClassesList',
    components: {
      CourseMeta,
      CourseClassesList,
    },
    mixins: [ReservedClassesListMixin],
    data() {
      return {
        offset: -44,
      };
    },
  };
</script>

<style scoped>
  .reserved-classes-list {
    background: white;
  }

  .credits-wrapper {
    color: rgba(0, 0, 0, 0.65);
  }

  .credits {
    color: rgba(0, 0, 0, 0.85);
  }

  .reserved-classes-list-empty {
    padding: 50px 0;
  }

  .hide-conflict {
    float: right;
  }

  /*noinspection CssUnusedSymbol*/
  .list-header >>> .ant-collapse-header {
    padding: 12px !important;
    cursor: default !important;
    user-select: none;
  }

  /*noinspection CssUnusedSymbol*/
  .course >>> .ant-collapse-header {
    overflow: hidden;
    padding-right: 12px !important;
  }

  /*noinspection CssUnusedSymbol*/
  .ant-collapse-item:last-of-type {
    border-bottom: none;
  }
</style>
