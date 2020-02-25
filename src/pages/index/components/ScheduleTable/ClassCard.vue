<template>
  <div :class="_class" :style="style"
       @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="course-name"><strong>{{ course.courseName }}</strong></div>
    <div class="teacher-name">{{ course.teacherName }}</div>
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

  .teacher-name {
    line-height: 1.25;
    font-size: 12px;
  }
</style>
