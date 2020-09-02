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
    this.promiseWorker = new PromiseWorker(new Worker('../workers/filter.js', { type: 'module' }));
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
            if (this.$refs.hasOwnProperty('table')) {
              this.$refs.table.$children[0].sPagination.current = 1;
            } else if (this.$refs.hasOwnProperty('list')) {
              this.$refs.list.paginationCurrent = 1;
            }
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
        allClassesExtra: this.$store.state.allClassesExtra,
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
        this.$store.commit('PREVIEW_CLASS_CONFLICTS', row['class_time_info'].conflicts);
      }
    },
    cancelPreviewClass(row) {
      if (this.$store.state.previewClass !== null
        && this.$store.state.previewClass.courseId === row['course_id']
        && this.$store.state.previewClass.teacherId === row['teacher_id']) {
        this.$store.commit('PREVIEW_CLASS', null);
      }
    },
    getLimitationColor(limitation) {
      switch (limitation) {
        case '禁止选课':
          return 'red';
        case '禁止退课':
          return 'blue';
        case '限制人数':
          return 'orange';
        default:
          return null;
      }
    },
    customRow(row) {
      // noinspection JSUnusedGlobalSymbols
      return {
        on: {
          mouseenter: () => {
            if (!row['class_time_info'].isSelected && row['class_time_info'].canPreview) {
              this.previewClass(row);
            }
          },
          mouseleave: () => {
            this.cancelPreviewClass(row);
          },
        },
      };
    },
  },
};

// noinspection JSUnusedGlobalSymbols
export const LookupConditionsMixin = {
  data() {
    return {
      conditions: {
        search: {
          'course_id': '',
          'course_name': '',
          'credit': '',
          'teacher_id': '',
          'teacher_name': '',
          'class_time': '',
          'campus': '',
        },
        filterLimitations: {
          'xian_zhi_ren_shu': 'default',
          'jin_zhi_xuan_ke': 'default',
          'jin_zhi_tui_ke': 'default',
        },
        filterVenue: 'default',
        filterConflicts: false,
        displayOption: 0,
        number: '',
        date: '',
        regexpMode: false,
        sortBy: ['+de'],
        limitRows: 0,
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 17, offset: 1 },
      limitationOptions: [
        { label: '默认', value: 'default' },
        { label: '排除', value: 'exclude' },
        { label: '仅保留', value: 'include' },
      ],
      sortByOptionsList: [[
        { label: '首要依据：默认', value: '0+de' },
        { label: '学分数升序', value: '0+cr' },
        { label: '学分数降序', value: '0-cr' },
        { label: '容量人数差升序', value: '0+cn' },
        { label: '容量人数差降序', value: '0-cn' },
        { label: '人数容量比升序', value: '0+nc' },
        { label: '人数容量比降序', value: '0-nc' },
        { label: '选课人数升序', value: '0+nu' },
        { label: '选课人数降序', value: '0-nu' },
        { label: '总容量升序', value: '0+ca' },
        { label: '总容量降序', value: '0-ca' },
      ]],
      moreOptionsVisible: false,
      moreOptionActivated: false,
    };
  },
  computed: {
    placeholder() {
      let result = {
        'course_name': null,
        'credit': null,
        'teacher_name': null,
        'class_time': null,
      };
      if (this.$store.state.allCoursesMap.hasOwnProperty(this.conditions.search['course_id'])) {
        const row = this.$store.state.allCoursesMap[this.conditions.search['course_id']];
        result['course_name'] = row['course_name'];
        result['credit'] = row['credit'];
        if (this.$store.state.allClassesMap.hasOwnProperty(`${this.conditions.search['course_id']}-${this.conditions.search['teacher_id']}`)) {
          const row2 = this.$store.state.allClassesMap[`${this.conditions.search['course_id']}-${this.conditions.search['teacher_id']}`];
          result['teacher_name'] = row2['teacher_name'];
          result['class_time'] = row2['class_time'];
        }
      }
      return result;
    },
    regexpValidateStatus() {
      let result = {
        'course_id': null,
        'course_name': null,
        'credit': null,
        'teacher_id': null,
        'teacher_name': null,
        'class_time': null,
      };
      if (!this.conditions.regexpMode) {
        return result;
      }
      for (let name in result) {
        if (result.hasOwnProperty(name)) {
          try {
            new RegExp(this.conditions.search[name], 'i');
          } catch (e) {
            result[name] = 'error';
          }
        }
      }
      return result;
    },
  },
  watch: {
    conditions: {
      handler() {
        if (this.conditions.number === '0' || this.conditions.number === 0 || parseInt(this.conditions.number) === 0) {
          this.conditions.number = '';
        }
        this.$emit('filter');
      },
      deep: true,
    },
    moreOptionsVisible() {
      // noinspection JSUnusedGlobalSymbols
      this.moreOptionActivated = Object.values(this.conditions.filterLimitations).filter((value) => value !== 'default').length !== 0
        || this.conditions.filterVenue !== 'default'
        || this.conditions.regexpMode
        || this.conditions.limitRows > 0
        || this.conditions.sortBy.length > 1;
    },
  },
  methods: {
    changeSortBy(indexValue) {
      const parts = indexValue.split(/[+-]/), value = /[+-]\S{2}$/.exec(indexValue)[0];
      const index = parseInt(parts[0]), name = parts[1];
      // noinspection JSUnresolvedVariable
      this.sortByOptionsList.splice(index + 1);
      this.conditions.sortBy.splice(index);
      this.conditions.sortBy.push(value);
      let flags = {};
      this.conditions.sortBy.forEach((value) => {
        flags[value.slice(1)] = true;
      });
      flags.de = false;
      if (flags.cn || flags.nc) {
        flags.cn = true;
        flags.nc = true;
      }
      if ([flags.cn, flags.nc, flags.ca, flags.nu].filter(value1 => value1).length >= 3) {
        flags.cn = true;
        flags.nc = true;
        flags.ca = true;
        flags.nu = true;
      }
      if (name !== 'de') {
        // noinspection JSUnresolvedVariable
        let options = JSON.parse(JSON.stringify(this.sortByOptionsList[this.sortByOptionsList.length - 1])).filter((option) => {
          return !flags[option.value.slice(-2)];
        });
        options.forEach((option, _index) => {
          options[_index].value = `${index + 1}${option.value.slice(-3)}`;
        });
        options[0].label = `第${['二', '三', '四', '五', '六', '七', '八', '九', '十'][index]}依据：默认`;
        this.$nextTick(() => {
          // noinspection JSUnresolvedVariable
          this.sortByOptionsList.push(options);
          this.conditions.sortBy.push('+de');
        });
      }
    },
  },
};
