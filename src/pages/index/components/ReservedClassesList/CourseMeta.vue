<template>
  <div :class="{ 'course-meta': true, 'course-meta-all-conflicted': allConflicted }">
    <a-badge class="credit-badge" :count="`${course.credit}学分`" />
    <span class="course-meta-inner"><span
      class="course-name">{{ course.courseName }}</span> <small>({{ id }})</small>
    <template v-if="selectedClassKey !== null && !expanded">
      <br />
      {{ course.classes[selectedClassKey].teacherName }}
      <small>({{ selectedClassKey }})</small>
      <a-divider type="vertical" />
      <small class="selected-info">
        {{ course.classes[selectedClassKey].classTime }}
      </small>
      <a-divider type="vertical" />
      <small class="selected-info">
        {{ course.classes[selectedClassKey].campus }}
      </small>
    </template></span>
  </div>
</template>

<script>
  import {CourseMetaMixin} from '../../../../mixins/ReservedClassesList';

  export default {
    name: 'CourseMeta',
    props: {
      course: {
        type: Object,
      },
      id: {
        type: String,
      },
      expanded: {
        type: Boolean,
      },
      allConflicted: {
        type: Boolean,
      },
    },
    mixins: [CourseMetaMixin],
  };
</script>

<style scoped>
  /*noinspection CssUnusedSymbol*/
  .course-meta {
    white-space: normal;
    vertical-align: top;
    padding-left: 16px;
  }

  .course-meta-inner {
    transform-origin: left 50%;
    display: inline-block;
    transition: all 0.2s;
  }

  /*noinspection CssUnusedSymbol*/
  .course-meta-all-conflicted {
    color: #90A4AE;
  }

  /*noinspection CssUnusedSymbol*/
  .course-meta-all-conflicted .course-name {
    font-style: italic;
    margin-right: 1px;
    font-weight: bold;
  }

  .all-conflicted-icon {
    margin-left: 10px;
    color: #FFC107;
  }

  .credit-badge {
    float: right;
    margin: 0 0 3px 5px;
  }

  .selected-info {
    color: rgba(0, 0, 0, 0.45);
  }

  /*noinspection CssUnusedSymbol*/
  .credit-badge >>> .ant-badge-count {
    background: white;
    color: #999999;
    box-shadow: 0 0 0 1px #d9d9d9 inset;
  }
</style>
