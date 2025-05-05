<template>
  <div :style="style" class="class-card">
    <div class="course-name" ref="courseName"><strong>{{ course.courseName }}</strong></div>
    <div class="venue" ref="venueRef" v-if="!venue">
      <span class="venue-at" ref="venueAtRef">@</span>{{ $store.getters.extra(`${course.courseId}-${course.teacherId}`).venue }}
    </div>
    <div class="teacher-name-venue" ref="teacherNameVenue" v-else>
      {{ course.teacherName }}
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
  font-size: clamp(12px, 1.2vw, 14px);
  line-height: 1.35;
  display: flex; 
  flex-direction: column; 
  align-items: flex-end; 
  justify-content: flex-end; 
  margin: 0 4px 4px 0;
  padding: 4px 6px;
  user-select: none;
  border-left-width: 3px;
  border-left-style: solid;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.course-name {
  font-size: clamp(12px, 1.2vw, 14px);
}

.teacher-name-venue {
  font-size: clamp(11px, 1.1vw, 13px);
  color: rgba(255, 255, 255, 0.85);
}

.venue {
  font-size: clamp(11px, 1.1vw, 13px);
  color: rgba(255, 255, 255, 0.85);
}

.venue-at {
  font-weight: bold;
  color: white;
}
</style>
