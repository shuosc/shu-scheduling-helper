<template>
  <div :class="{ 'course-meta': true, 'course-meta-all-conflicted': allConflicted }">
    <a-badge :count="`${course.credit}学分`" class="credit-badge" />
    <NumberCapacity :class-key="`${id}-${selectedClassKey}`" class="number-capacity" slot="actions"
                    v-if="selectedClassKey !== null && !expanded" />
    <span class="course-name">{{ course.courseName }}</span>{{ ' ' }}
    <small class="course-id">({{ id }})</small>
    <a :href="getLinkHref(id)" :title="getLinkTitle(course, id)"
       @click.stop="showCourseIntroduction($event, getLinkHref(id))" class="course-intro-link"
       rel="external nofollow" target="_blank">简介</a>
    <template v-if="selectedClassKey !== null && !expanded">
      <br />
      <span class="teacher-name">{{ course.classes[selectedClassKey].teacherName }}</span>
      <small class="teacher-id">({{ selectedClassKey }})</small>
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
  import { introductionOpenerMixin } from '../../../../mixins/common/introductionOpener';
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
    mixins: [introductionOpenerMixin, CourseMetaMixin],
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

  .number-capacity {
    float: right;
    margin-right: 8px;
  }

  .course-name, .course-id, .teacher-name, .teacher-id, .selected-info, .credit-badge, .number-capacity {
    transition: opacity 0.2s;
  }

  .course-intro-link {
    font-size: 12px;
    position: absolute;
    z-index: 10;
    margin: 1px 5px 0;
    padding: 0 5px;
    user-select: none;
    transition: all 0.2s;
    text-decoration: none;
    opacity: 0;
    background: rgba(255, 255, 255, 0.75);
    box-shadow: 0 2px 4px white;
    backdrop-filter: blur(5px);
  }

  .course-intro-link:hover {
    font-weight: bold;
    color: #64b5f6;
  }

  .course-intro-link:focus {
    opacity: 1;
  }

  .course-intro-link:active {
    color: #1976d2;
  }
</style>
