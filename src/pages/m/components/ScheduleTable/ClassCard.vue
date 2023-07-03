<template>
  <div :style="style[theme][0]" class="class-card">
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
        default: false,
      },
      capturing: {
        type: Boolean,
        default: false,
      },
      theme: {
        type: String,
      }
    },
    mixins: [ClassCardMixin],
  };
</script>

<style scoped>
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
    padding: 8px 6px 5px;
    user-select: none;
    text-align: left;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin: 1px;
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
