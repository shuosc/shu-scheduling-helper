<template>
  <div :class="{ 'course-meta': true, 'course-meta-all-conflicted': allConflicted }">
    <a-badge class="credit-badge" :count="`${course.credit}学分`" />
    <NumberCapacity v-if="selectedClassKey !== null && !expanded" slot="actions" class="number-capacity"
                    :class-key="`${id}-${selectedClassKey}`" />
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
      <a-divider type="vertical" />
      <small class="selected-info">
        {{ $store.getters.extra(`${id}-${selectedClassKey}`).venue }}
      </small>
      <br v-if="$store.getters.extra(`${id}-${selectedClassKey}`).limitations.length > 0" />
      <a-tag
        v-for="(limitation, index) in $store.getters.extra(`${id}-${selectedClassKey}`).limitations"
        class="limitation-tag"
        :key="index"
      >
        {{ limitation }}
      </a-tag>
    </template></span>
  </div>
</template>

<script>
  import {CourseMetaMixin} from '../../../../mixins/ReservedClassesList';
  import NumberCapacity from './NumberCapacity';

  export default {
    name: 'CourseMeta',
    components: {NumberCapacity},
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

  .limitation-tag {
    margin-top: 2px;
  }

  .number-capacity {
    float: right;
    margin-right: 8px;
  }
</style>
