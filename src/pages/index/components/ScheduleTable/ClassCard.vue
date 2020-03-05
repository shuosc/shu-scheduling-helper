<template>
  <div :class="_class" :style="style"
       @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
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
      },
    },
    mixins: [ClassCardMixin],
  };
</script>

<style scoped>
  /*noinspection CssUnusedSymbol*/
  .class-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-top-style: solid;
    border-top-width: 3px;
    padding: 4px 5px 5px;
    transition: all 0.2s;
    border-radius: 2px;
    position: absolute;
    user-select: none;
    line-height: 1.35;
    text-align: left;
    overflow: hidden;
    cursor: pointer;
    bottom: 1px;
    right: 1px;
    left: 1px;
    top: 1px;
  }

  /*noinspection CssUnusedSymbol*/
  .class-card.class-card-hover {
    opacity: 0.75 !important;
  }

  @media screen and (min-resolution: 2dppx) {
    /*noinspection CssUnusedSymbol*/
    .class-card.class-card-hover {
      transform: scale3d(0.95, 0.95, 1);
    }
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
    color: white;
    font-weight: bold;
  }
</style>
