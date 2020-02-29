import PromiseWorker from 'promise-worker';

export const LookupPanelMixin = {
  data() {
    return {
      promiseWorker: null,
      rows: [],
      storageBusy: false,
      timer: null,
    };
  },
  mounted() {
    this.promiseWorker = new PromiseWorker(new Worker('../workers/filter.js', {type: 'module'}));
    this.filter(this.$refs.conditions.conditions).then((rows) => {
      this.rows = rows;
    });
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
        this.filter(this.$refs.conditions.conditions).then((rows) => {
          this.rows = rows;
          this.storageBusy = false;
          if (toPageOne) {
            this.$refs.table.$children[0].sPagination.current = 1;
          }
        });
      }, delay);
    },
    filter(conditions) {
      return this.promiseWorker.postMessage({
        allClasses: this.$store.state.allClasses,
        reservedClasses: this.$store.state.reservedClasses,
        selectedClasses: this.$store.state.selectedClasses,
        scheduleTableRows: this.$store.getters.scheduleTableRows,
        conditions,
      });
    },
    reserveClass(data, select, conflicts) {
      if (select && Object.keys(conflicts).length > 0) {
        this.storageBusy = true;
        this.$store.dispatch('reserveClass', data).then(() => {
          this.showConflictsSolvingDialog(data, conflicts);
        });
      } else {
        this.storageBusy = true;
        this.$store.dispatch(select ? 'reserveClassThenSelect' : 'reserveClass', data);
      }
    },
    removeReservedClass(data) {
      this.storageBusy = true;
      this.$store.dispatch('removeReservedClass', data);
    },
    selectClass(data, conflicts) {
      if (Object.keys(conflicts).length > 0) {
        this.showConflictsSolvingDialog(data, conflicts);
      } else {
        this.storageBusy = true;
        this.$store.dispatch('selectClass', data);
      }
    },
    unselectClass(data) {
      this.storageBusy = true;
      this.$store.dispatch('unselectClass', data);
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
