import { getColor } from '../utils/color';
import { getAllCoursesConflictStatus, getConflicts } from '../utils/CheckConflict';

export const ReservedClassesListMixin = {
  data() {
    return {
      hideConflict: false,
    };
  },
  computed: {
    reservedClasses() {
      return this.$store.state.reservedClasses;
    },
    reservedClassesKeys() {
      let keys = Object.keys(this.reservedClasses);
      keys.sort((a, b) => {
        let tA = this.$store.state.selectedClasses.hasOwnProperty(a) ? 1 : 0,
          tB = this.$store.state.selectedClasses.hasOwnProperty(b) ? 1 : 0;
        return tA === tB ? a.localeCompare(b) : tA - tB;
      });
      return keys;
    },
    shownReservedClassesKeys() {
      return this.reservedClassesKeys.filter(key => !(this.hideConflict && this.allConflicted[key]));
    },
    reservedClassesDividers() {
      let result = {
        unselectedCourse: -1,
        selectedCourse: -1,
      };
      for (let i = 0; i < this.shownReservedClassesKeys.length; i++) {
        if (i === 0 && !this.$store.state.selectedClasses.hasOwnProperty(this.shownReservedClassesKeys[i])) {
          result.unselectedCourse = 0;
        }
        if (this.$store.state.selectedClasses.hasOwnProperty(this.shownReservedClassesKeys[i])) {
          result.selectedCourse = i;
          break;
        }
      }
      return result;
    },
    credits() {
      return this.$store.getters.credits;
    },
    allConflicted() {
      
      return getAllCoursesConflictStatus(this.reservedClassesKeys, this.$store);
    },
    openedCourseId: {
      get() {
        return this.$store.state.openedCourseId;
      },
      set(value) {
        this.$store.commit('OPEN_COURSE_ID', value);
      },
    },
  },
  methods: {
    scrollTo(courseId) {
      this.$nextTick(() => {
        setTimeout(() => {
          const element = this.$refs[`course-${courseId}`][0].$el;
          const panel = element.querySelector('.ant-collapse-content');
          const doScrollTo = () => {
            // noinspection JSUnresolvedVariable
            scrollTo({
              top: element.offsetTop + this.offset,
              behavior: 'smooth',
            });
            ['webkitTransitionEnd', 'mozTransitionEnd', 'MSTransitionEnd', 'otransitionend', 'transitionend'].forEach((value) => {
              panel.removeEventListener(value, doScrollTo);
            });
          };
          if (panel.classList.contains('ant-motion-collapse')) {
            ['webkitTransitionEnd', 'mozTransitionEnd', 'MSTransitionEnd', 'otransitionend', 'transitionend'].forEach((value) => {
              panel.addEventListener(value, doScrollTo);
            });
          } else {
            doScrollTo(element);
          }
        }, 0);
      });
    },
  },
};

export const CourseClassesListMixin = {
  data() {
    return {
      storageBusy: false,
    };
  },
  computed: {
    classesKeys() {
      let keys = Object.keys(this.course.classes).filter(key => key !== this.selectedClassKey);
      keys.sort();
      return keys;
    },
    shownClassesKeys() {
      return this.classesKeys.filter(key => !(this.hideConflict && this.isConflicted(key)));
    },
    selectedClassKey() {
      if (this.$store.state.selectedClasses.hasOwnProperty(this.id)) {
        return this.$store.state.selectedClasses[this.id].teacherId;
      } else {
        return null;
      }
    },
    conflicts() {
      let result = {};
      this.classesKeys.forEach((key) => {
        result[key] = getConflicts(this.id, key, this.$store);
      });
      return result;
    },
  },
  methods: {
    isConflicted(key) {
      return Object.keys(this.conflicts[key]).length > 0;
    },
    selectClass(key) {
      this.$store.commit('OPEN_COURSE_ID', null);
      return this.$store.dispatch('selectClass', {
        'course_id': this.id,
        'teacher_id': key,
      });
    },
    unselectClass() {
      this.$emit('unselect', this.id);
      return this.$store.dispatch('unselectClass', {
        'course_id': this.id,
        'teacher_id': this.selectedClassKey,
      });
    },
    removeReservedClass(key) {
      this.storageBusy = true;
      this.$store.dispatch('removeReservedClass', {
        'course_id': this.id,
        'teacher_id': key,
      }).then(() => {
        this.storageBusy = false;
      });
    },
    previewClass(key) {
      this.$store.commit('PREVIEW_CLASS', {
        courseId: this.id,
        courseName: this.course.courseName,
        teacherId: key,
        teacherName: this.course.classes[key].teacherName,
        classTime: this.course.classes[key].classTime,
        campus: this.course.classes[key].campus,
      });
      this.$store.commit('PREVIEW_CLASS_CONFLICTS', this.conflicts[key]);
    },
    cancelPreviewClass() {
      if (this.$store.state.previewClass !== null
        && this.$store.state.previewClass.courseId === this.id) {
        this.$store.commit('PREVIEW_CLASS', null);
      }
    },
  },
};

// 添加缺失的Mixin
export const CourseColorMixin = {
  props: {
    courseId: {
      type: String,
    },
    courseName: {
      type: String,
    },
    seed: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    style() {
      return {
        background: getColor(this.courseName || this.courseId, this.seed),
      };
    },
  },
};

export const CourseMetaMixin = {
  computed: {
    selectedClassKey() {
      if (this.$store.state.selectedClasses.hasOwnProperty(this.id)) {
        return this.$store.state.selectedClasses[this.id].teacherId;
      } else {
        return null;
      }
    },
    getCourseInfo() {
      return (courseId, showCredit = true) => {
        let result = [];
        if (showCredit && this.$store.state.reservedClasses[courseId].credit) {
          result.push(`${this.$store.state.reservedClasses[courseId].credit}学分`);
        }
        if (this.$store.state.reservedClasses[courseId].courseType) {
          result.push(this.$store.state.reservedClasses[courseId].courseType);
        }
        return result.join(' · ');
      };
    },
  },
};