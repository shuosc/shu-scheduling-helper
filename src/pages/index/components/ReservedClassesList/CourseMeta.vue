<template>
  <div :class="{ 'course-meta': true, 'course-meta-all-conflicted': allConflicted }">
    <a-badge class="credit-badge" :count="`${course.credit}学分`" />
    <NumberCapacity v-if="selectedClassKey !== null && !expanded" slot="actions" class="number-capacity"
                    :class-key="`${id}-${selectedClassKey}`" />
    <span class="course-name">{{ course.courseName }}</span>{{ ' ' }}
    <small class="course-id">({{ id }})</small>
    <a class="course-intro-link" :title="getLinkTitle(course, id)" target="_blank" rel="external nofollow"
       :href="getLinkHref(id)" @click.stop="showCourseIntroduction($event, getLinkHref(id))">简介</a>
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
      <br v-if="$store.getters.extra(`${id}-${selectedClassKey}`).limitations.length > 0" />
      <a-tag
        v-for="(limitation, index) in $store.getters.extra(`${id}-${selectedClassKey}`).limitations"
        class="limitation-tag"
        :key="index"
      >
        {{ limitation }}
      </a-tag>
    </template>
  </div>
</template>

<script>
  import {CourseMetaMixin} from '../../../../mixins/ReservedClassesList';
  import {introductionOpenerMixin} from '../../../../mixins/common/introductionOpener';
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
    mixins: [introductionOpenerMixin, CourseMetaMixin],
  };
</script>

<style scoped>
  /*noinspection CssUnusedSymbol*/
  .course-meta {
    white-space: normal;
    vertical-align: top;
    padding-left: 16px;
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
    box-shadow: 0 0 0 1px #d9d9d9 inset;
    color: rgba(0, 0, 0, 0.65);
    background: white;
  }

  .limitation-tag {
    margin-top: 2px;
  }

  .number-capacity {
    margin-right: 8px;
    float: right;
  }

  .course-name, .course-id, .teacher-name, .teacher-id, .selected-info, .credit-badge, .number-capacity {
    transition: opacity 0.2s;
  }

  .course-intro-link {
    background: rgba(255, 255, 255, 0.75);
    box-shadow: 0 2px 4px white;
    backdrop-filter: blur(5px);
    text-decoration: none;
    transition: all 0.2s;
    position: absolute;
    user-select: none;
    margin: 1px 5px 0;
    font-size: 12px;
    padding: 0 5px;
    z-index: 10;
    opacity: 0;
  }

  .course-intro-link:hover {
    font-weight: bold;
    color: #64B5F6;
  }

  .course-intro-link:focus {
    opacity: 1;
  }

  .course-intro-link:active {
    color: #1976D2;
  }
</style>
