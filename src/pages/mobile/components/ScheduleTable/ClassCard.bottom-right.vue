<template>
  <div :style="style[theme][0]" class="class-card">
    
    
    
    <div class="extra" ref="extraRef" :style="style[theme][1]" v-if="course.lab">
      {{ course.lab }}
    </div>
    <div class="venue" ref="venueRef" :style="style[theme][1]" v-else-if="venue">
      <span class="venue-at" ref="venueAtRef">@</span>{{ $store.getters.extra(`${course.courseId}-${course.teacherId}`).venue }}
    </div>
    <div class="teacher-name-venue" ref="teacherNameVenue" :style="style[theme][1]" v-else>
      {{ course.teacherName }}
    </div>
    <div class="course-name" ref="courseName"><strong>{{ courseName }}</strong></div>
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
    align-items: flex-end;
    flex-direction: column;
    justify-content: flex-end;
    padding: 8px 6px 5px;
    user-select: none;
    text-align: right;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin: 1px;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
  }

  .course-name {
    font-size: clamp(12px, 1.2vw, 14px);
    line-height: 1.3;
    overflow: hidden;
    min-height: 1.3em;
    margin-bottom: 1px;
  }

  .teacher-name-venue {
    font-size: clamp(11px, 1.1vw, 13px);
    line-height: 1.3;
    overflow: hidden;
    min-height: 1.3em;
  }

  .venue {
    font-size: clamp(11px, 1.1vw, 13px);
    line-height: 1.25;
  }

  .venue-at {
    font-weight: bold;
  }

  .extra {
    font-size: clamp(11px, 1.1vw, 13px);
    line-height: 1.25;
  }
</style>
