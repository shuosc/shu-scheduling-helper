import {getColor, getPeriods} from '../utils';

export const ReservedClassesListMixin = {
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
    reservedClassesDividers() {
      let result = {
        unselectedCourse: -1,
        selectedCourse: -1,
      };
      for (let i = 0; i < this.reservedClassesKeys.length; i++) {
        if (i === 0 && !this.$store.state.selectedClasses.hasOwnProperty(this.reservedClassesKeys[i])) {
          result.unselectedCourse = 0;
        }
        if (this.$store.state.selectedClasses.hasOwnProperty(this.reservedClassesKeys[i])) {
          result.selectedCourse = i;
          break;
        }
      }
      return result;
    },
    credits() {
      return this.$store.getters.credits;
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
              behavior: 'smooth'
            });
            ['webkitTransitionEnd', 'mozTransitionEnd', 'MSTransitionEnd', 'otransitionend', 'transitionend'].forEach((value) => {
              panel.removeEventListener(value, doScrollTo);
            })
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
        let courseConflicts = {};
        getPeriods(this.$store.state.reservedClasses[this.id].classes[key].classTime).forEach((period) => {
          let cell = this.$store.getters.scheduleTableRows[period[0]][period[1]];
          if (cell !== null && cell.courseId !== this.id) {
            courseConflicts[cell.courseId] = true;
          }
        });
        result[key] = courseConflicts;
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
      if (!this.isConflicted(key)) {
        this.$store.commit('PREVIEW_CLASS', {
          courseId: this.id,
          courseName: this.course.courseName,
          teacherId: key,
          teacherName: this.course.classes[key].teacherName,
          classTime: this.course.classes[key].classTime,
        });
      }
    },
    cancelPreviewClass(key) {
      if (this.$store.state.previewClass !== null
        && this.$store.state.previewClass.courseId === this.id
        && this.$store.state.previewClass.teacherId === key) {
        this.$store.commit('PREVIEW_CLASS', null);
      }
    },
    conflictsSolving(key) {
      this.showConflictsSolvingDialog({
        course_id: this.id,
        course_name: this.course.courseName,
        teacher_id: key,
        teacher_name: this.course.classes[key].teacherName,
        class_time: this.course.classes[key].classTime,
      }, this.conflicts[key]);
    },
  },
};

export const CourseColorMixin = {
  computed: {
    style() {
      if (this.$store.state.selectedClasses.hasOwnProperty(this.courseId)) {
        return {
          background: this.$store.state.selectedClasses[this.courseId].themeColor,
        };
      } else {
        return {
          background: getColor(this.courseName, this.seed),
        };
      }
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
    allConflicted() {
      if (this.selectedClassKey != null) {
        return false;
      }
      let flag = true;
      for (let teacherId in this.$store.state.reservedClasses[this.id].classes) {
        if (this.$store.state.reservedClasses[this.id].classes.hasOwnProperty(teacherId)) {
          let isConflicted = false;
          getPeriods(this.$store.state.reservedClasses[this.id].classes[teacherId].classTime).forEach((period) => {
            if (!isConflicted) {
              let cell = this.$store.getters.scheduleTableRows[period[0]][period[1]];
              if (cell !== null && cell.courseId !== this.id) {
                isConflicted = true;
              }
            }
          });
          if (!isConflicted) {
            flag = false;
            break;
          }
        }
      }
      return flag;
    }
  },
};
