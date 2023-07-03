<template>
  <div :class="_class" :style="style[theme][0]" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="course-name" ref="courseName"><strong>{{ courseName }}</strong></div>
    <div class="teacher-name-venue" :style="style[theme][1]" v-if="!venue">
      {{ course.teacherName }}
    </div>
    <div class="venue" :style="style[theme][1]" v-else>
      <span class="venue-at">@</span>{{ $store.getters.extra(`${course.courseId}-${course.teacherId}`).venue }}
    </div>
    <div class="extra" :style="style[theme][1]" v-if="course.fortnight || course.lab">
      {{ course.fortnight }} {{ course.lab }}
    </div>
  </div>
</template>

<script>
  import { ClassCardMixin } from '../../../../mixins/ScheduleTable';
  
  export default {
    name: 'ClassCard',
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
      theme: {
        type: String,
      }
    },
    mixins: [ClassCardMixin],
  };
</script>

<style scoped>
  /*noinspection CssUnusedSymbol*/
  .class-card {
    line-height: 1.35;
    position: absolute;
    top: 1px;
    right: 1px;
    bottom: 1px;
    left: 1px;
    display: flex;
    overflow: hidden;
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-start;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s;
    text-align: left;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
    font-size: 13px;
    line-height: 17px;
    overflow: hidden;
    min-height: 17px;
    margin-bottom: 1px;
  }

  .teacher-name-venue {
    font-size: 12px;
    line-height: 16px;
    overflow: hidden;
    min-height: 16px;
  }

  .venue {
    font-size: 12px;
    line-height: 1.25;
  }

  .venue-at {
    font-weight: bold;
  }

  .extra {
      font-size: 12px;
      line-height: 1.25;
  }
</style>
