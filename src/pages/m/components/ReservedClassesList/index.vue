<template>
  <a-config-provider>
    <template slot="renderEmpty">
      <div>没有其他待选项了</div>
    </template>
    <div>
      <a-empty
        v-if="reservedClassesKeys.length === 0"
        class="reserved-classes-list-empty"
        description="待选课程列表为空"
      />
      <!--suppress JSUnresolvedVariable -->
      <a-collapse v-model="openedCourseId" accordion :bordered="false">
        <template v-for="(key, index) in reservedClassesKeys">
          <a-collapse-panel
            v-if="index === reservedClassesDividers.unselectedCourse"
            :key="`${key}-divider`"
            class="list-header"
            :show-arrow="false"
            disabled
          >
            <template slot="header">
              未选课程
            </template>
          </a-collapse-panel>
          <a-collapse-panel
            v-else-if="index === reservedClassesDividers.selectedCourse"
            :key="`${key}-divider`"
            class="list-header"
            :show-arrow="false"
            disabled
          >
            <template slot="header">
              已选课程 ( <span class="credits-wrapper"><strong class="credits">{{ credits }}</strong> 学分</span> )
            </template>
          </a-collapse-panel>
          <a-collapse-panel :ref="`course-${key}`" class="course" :key="key">
            <template slot="header">
              <CourseColor :course-id="key" :course-name="reservedClasses[key].courseName" />
              <!--suppress JSUnresolvedVariable -->
              <CourseMeta :course="reservedClasses[key]" :id="key" :expanded="openedCourseId === key" />
            </template>
            <!--suppress JSUnresolvedVariable -->
            <CourseClassesList :course="reservedClasses[key]" :id="key" :expanded="openedCourseId === key" />
          </a-collapse-panel>
        </template>
      </a-collapse>
    </div>
  </a-config-provider>
</template>

<script>
  import CourseClassesList from './CourseClassesList';
  import CourseColor from './CourseColor';
  import CourseMeta from './CourseMeta';
  import {ReservedClassesListMixin} from '../../../../mixins/ReservedClassesList';

  export default {
    name: 'ReservedClassesList',
    components: {
      CourseColor,
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
  .credits-wrapper {
    color: rgba(0, 0, 0, 0.65);
  }

  .credits {
    color: rgba(0, 0, 0, 0.85);
  }

  .reserved-classes-list-empty {
    padding: 50px 0;
  }

  /*noinspection CssUnusedSymbol*/
  .list-header >>> .ant-collapse-header {
    cursor: default !important;
    user-select: none;
    padding: 12px !important;
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
