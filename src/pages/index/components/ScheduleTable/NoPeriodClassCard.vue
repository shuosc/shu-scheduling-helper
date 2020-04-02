<template>
  <div :style="style" class="class-card">
    <div class="course-name"><strong>{{ course.courseName }}</strong></div>
    <div class="teacher-name-venue" v-if="!venue">
      {{ course.teacherName }}
    </div>
    <div class="venue" v-else>
      <span class="venue-at">@</span>{{ $store.getters.extra(`${course.courseId}-${course.teacherId}`).venue }}
    </div>
  </div>
</template>

<script>
  import {ClassCardMixin} from '../../../../mixins/ScheduleTable';

  export default {
    name: 'NoPeriodClassCard',
    props: {
      course: {
        type: Object,
      },
      venue: {
        type: Boolean,
      },
      capturing: {
        type: Boolean,
      },
    },
    mixins: [ClassCardMixin],
  };
</script>

<style scoped>
  .class-card {
    font-size: 13px;
    line-height: 1.35;
    display: inline-block;
    margin: 0 4px 4px 0;
    padding: 4px 6px;
    user-select: none;
    border-left-width: 3px;
    border-left-style: solid;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .course-name {
    font-size: 13px;
    display: inline-block;
    margin-right: 5px;
  }

  .teacher-name-venue {
    font-size: 12px;
    display: inline-block;
    color: rgba(255, 255, 255, 0.85);
  }

  .venue {
    font-size: 12px;
    display: inline-block;
    color: rgba(255, 255, 255, 0.85);
  }

  .venue-at {
    font-weight: bold;
    color: white;
  }
</style>
