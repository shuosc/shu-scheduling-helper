<template>
  <div class="class-card" :style="style">
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
    name: 'ClassCard',
    props: {
      course: {
        type: Object,
      },
      venue: {
        type: Boolean,
        default: false,
      },
      capturing: {
        type: Boolean,
        default: false,
      },
    },
    mixins: [ClassCardMixin],
  };
</script>

<style scoped>
  .class-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-top-style: solid;
    border-top-width: 3px;
    padding: 4px 5px 5px;
    border-radius: 2px;
    position: absolute;
    user-select: none;
    line-height: 1.35;
    text-align: left;
    overflow: hidden;
    bottom: 1px;
    right: 1px;
    left: 1px;
    top: 1px;
  }

  .course-name {
    margin-bottom: 1px;
    line-height: 1.25;
    font-size: 13px;
  }

  .teacher-name-venue {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.25;
    font-size: 12px;
  }

  .venue {
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.25;
    font-size: 12px;
  }

  .venue-at {
    font-weight: bold;
    color: white;
  }
</style>
