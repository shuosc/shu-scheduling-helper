<template>
  <div :class="{ 'course-meta': true, 'course-meta-all-conflicted': allConflicted }">
    <a-badge :count="`${course.credit}学分`" class="credit-badge" />
    <span class="course-name">{{ course.courseName }}</span>{{ ' ' }}
    <small>({{ id }})</small>
    <template v-if="selectedClassKey !== null && !expanded">
      <br />
      {{ course.classes[selectedClassKey].teacherName }}
      <small>({{ selectedClassKey }})</small>
      <a-divider type="vertical" />
      <small>
        <NumberCapacity :class-key="`${id}-${selectedClassKey}`" class="number-capacity" slot="actions" />
      </small>
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
      <br
        v-if="($store.getters.extra(`${id}-${selectedClassKey}`).date && $store.getters.extra(`${id}-${selectedClassKey}`).date !== '不开') || $store.getters.extra(`${id}-${selectedClassKey}`).limitations.length > 0" />
      <a-tag
        class="limitation-tag"
        key="date"
        v-if="$store.getters.extra(`${id}-${selectedClassKey}`).date && $store.getters.extra(`${id}-${selectedClassKey}`).date !== '不开'"
      >
        <a-icon type="calendar" />
        <a-divider type="vertical" />
        <span>{{ $store.getters.extra(`${id}-${selectedClassKey}`).date }}</span>
      </a-tag>
      <a-tag
        :key="index"
        class="limitation-tag"
        v-for="(limitation, index) in $store.getters.extra(`${id}-${selectedClassKey}`).limitations"
      >
        {{ limitation }}
      </a-tag>
    </template>
  </div>
</template>

<script>
  import { CourseMetaMixin } from '../../../../mixins/ReservedClassesList';
  import NumberCapacity from './NumberCapacity';


  export default {
    name: 'CourseMeta',
    components: { NumberCapacity },
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
    padding-left: 16px;
    vertical-align: top;
    white-space: normal;
  }

  /*noinspection CssUnusedSymbol*/
  .course-meta-all-conflicted {
    color: #90a4ae;
  }

  /*noinspection CssUnusedSymbol*/
  .course-meta-all-conflicted .course-name {
    font-weight: bold;
    font-style: italic;
    margin-right: 1px;
  }

  .all-conflicted-icon {
    margin-left: 10px;
    color: #ffc107;
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
    color: rgba(0, 0, 0, 0.65);
    background: white;
    box-shadow: 0 0 0 1px #d9d9d9 inset;
  }

  .limitation-tag {
    margin-top: 2px;
  }
</style>
