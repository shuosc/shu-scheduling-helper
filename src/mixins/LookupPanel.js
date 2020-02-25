import {getPeriods} from '../utils';

export const LookupPanelMixin = {
  data() {
    return {
      rows: [],
      storageBusy: false,
      timer: null,
    };
  },
  mounted() {
    this.filter(this.$refs.conditions.conditions);
  },
  watch: {
    '$store.state.allClasses'() {
      this.countdown(0, false); // 避免重复执行筛选
    },
    '$store.state.selectedClasses'() {
      this.countdown(0, false); // 避免重复执行筛选
    },
    '$store.state.reservedClasses'() {
      this.countdown(0, false); // 避免重复执行筛选
    },
  },
  beforeDestroy() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    countdown(delay, toPageOne) {
      this.storageBusy = true;
      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.filter(this.$refs.conditions.conditions);
        if (toPageOne) {
          this.$refs.table.$children[0].sPagination.current = 1;
        }
        this.storageBusy = false;
      }, delay);
    },
    filter(conditions) {
      this.rows = [];
      let conditionsRegExp = {};
      for (let condition in conditions.search) {
        if (conditions.search.hasOwnProperty(condition)) {
          conditionsRegExp[condition] = this.concatRegExp(conditions.search[condition].split(/\s+/))
        }
      }
      this.$store.state.allClasses.forEach((row) => {
        for (let condition in conditionsRegExp) {
          if (conditionsRegExp.hasOwnProperty(condition)) {
            if (!conditionsRegExp[condition].test(row[condition])) {
              return;
            }
          }
        }
        let newRow = Object.assign({}, row);
        newRow['course'] = {
          id: newRow['course_id'],
          name: newRow['course_name'],
          credit: newRow['credit'],
        };
        newRow['teacher'] = {
          id: newRow['teacher_id'],
          name: newRow['teacher_name'],
        };
        newRow['class_time_info'] = {
          row: row,
          isSelected: this.isSelected(row),
          canPreview: getPeriods(newRow['class_time']).length > 0,
          conflicts: this.getConflicts(newRow['course_id'], newRow['class_time']),
        };
        newRow['action'] = {
          row: row,
          isReserved: this.isReserved(row),
          isSelected: newRow['class_time_info'].isSelected,
          conflicts: newRow['class_time_info'].conflicts,
        };
        newRow['key'] = `${newRow['course_id']}-${newRow['teacher_id']}`;
        if ((!conditions.filterConflicts || Object.keys(newRow['class_time_info'].conflicts).length === 0)
          && (conditions.displayOption !== 1 || !newRow['action'].isReserved)
          && (conditions.displayOption !== 2 || newRow['action'].isReserved)) {
          this.rows.push(newRow);
        }
      });
    },
    concatRegExp(parts) {
      parts.forEach((part, index) => {
        parts[index] = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      });
      return new RegExp(parts.join('.*'), 'i');
    },
    isReserved(data) {
      if (this.$store.state.reservedClasses.hasOwnProperty(data['course_id'])) {
        if (this.$store.state.reservedClasses[data['course_id']].classes.hasOwnProperty(data['teacher_id'])) {
          return true;
        }
      }
      return false;
    },
    isSelected(data) {
      if (this.$store.state.selectedClasses.hasOwnProperty(data['course_id'])) {
        if (this.$store.state.selectedClasses[data['course_id']].teacherId === data['teacher_id']) {
          return true;
        }
      }
      return false;
    },
    reserveClass(data, select, conflicts) {
      if (select && Object.keys(conflicts).length > 0) {
        this.storageBusy = true;
        this.$store.dispatch('reserveClass', data).then(() => {
          this.storageBusy = false;
          this.showConflictsSolvingDialog(data, conflicts);
        });
      } else {
        this.storageBusy = true;
        this.$store.dispatch(select ? 'reserveClassThenSelect' : 'reserveClass', data).then(() => {
          this.storageBusy = false;
        });
      }
    },
    removeReservedClass(data) {
      this.storageBusy = true;
      this.$store.dispatch('removeReservedClass', data).then(() => {
        this.storageBusy = false;
      });
    },
    selectClass(data, conflicts) {
      if (Object.keys(conflicts).length > 0) {
        this.showConflictsSolvingDialog(data, conflicts);
      } else {
        this.storageBusy = true;
        this.$store.dispatch('selectClass', data).then(() => {
          this.storageBusy = false;
        });
      }
    },
    unselectClass(data) {
      this.storageBusy = true;
      this.$store.dispatch('unselectClass', data).then(() => {
        this.storageBusy = false;
      });
    },
    getConflicts(courseId, classTime) {
      let courseConflicts = {};
      getPeriods(classTime).forEach((period) => {
        let targetCell = this.$store.getters.scheduleTableRows[period[0]][period[1]];
        if (targetCell !== null && targetCell.courseId !== courseId) {
          courseConflicts[targetCell.courseId] = true;
        }
      });
      return courseConflicts;
    },
    previewClass(row) {
      if (!this.storageBusy) {
        this.$store.commit('PREVIEW_CLASS', {
          courseId: row['course_id'],
          courseName: row['course_name'],
          teacherId: row['teacher_id'],
          teacherName: row['teacher_name'],
          classTime: row['class_time'],
        });
      }
    },
    cancelPreviewClass(row) {
      if (this.$store.state.previewClass !== null
        && this.$store.state.previewClass.courseId === row['course_id']
        && this.$store.state.previewClass.teacherId === row['teacher_id']) {
        this.$store.commit('PREVIEW_CLASS', null);
      }
    },
  },
};

export const LookupConditionsMixin = {
  data() {
    return {
      conditions: {
        search: {
          course_id: '',
          course_name: '',
          credit: '',
          teacher_id: '',
          teacher_name: '',
          class_time: '',
          campus: '',
        },
        filterConflicts: false,
        displayOption: 0,
      },
    };
  },
  watch: {
    conditions: {
      handler() {
        this.$emit('filter');
      },
      deep: true,
    },
  },
};
