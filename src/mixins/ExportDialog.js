export const ExportDialogMixin = {
  data() {
    return {
      exportDateTime: '',
      courseInfos: {},
      courseIds: [],
      selectedCourseIds: [],
      rows: [],
      activeTab: 'content',
    };
  },
  computed: {
    content() {
      let result = `~ SHU排课助手\n~ https://xk2.zkllab.com/\n~ ${this.exportDateTime}`;
      if (this.selectedCourseIds.length > 0) {
        this.selectedCourseIds.forEach((courseInfosId, index) => {
          result += `\n\n${index + 1}.\n${this.courseInfos[courseInfosId]}`;
        });
      } else {
        result += '\n\n未选择要导出的数据';
      }
      return result;
    },
    rowSelection() {
      return {
        columnWidth: 37,
        selectedRowKeys: this.selectedCourseIds,
        onChange: this.handleSelectChange,
      };
    },
  },
  watch: {
    activeTab(value) {
      if (value === 'content') {
        this.$nextTick(() => {
          // noinspection JSUnresolvedFunction
          this.$refs.content.$el.focus();
        });
      }
    },
  },
  created() {
    this.exportDateTime = new Date().toLocaleString();
    let courseIds = Object.keys(this.$store.state.selectedClasses);
    courseIds.sort();
    courseIds.forEach((courseId) => {
      const teacherId = this.$store.state.selectedClasses[courseId].teacherId;
      const courseName = this.$store.state.reservedClasses[courseId].courseName;
      const teacherName = this.$store.state.reservedClasses[courseId].classes[teacherId].teacherName;
      const classTime = this.$store.state.reservedClasses[courseId].classes[teacherId].classTime;
      this.courseInfos[courseId] = `${courseId}, ${teacherId}\n${courseName}, ${teacherName}\n${classTime}`;
      this.courseIds.push(courseId);
      this.selectedCourseIds.push(courseId);
      this.rows.push({
        key: courseId,
        course: {
          name: courseName,
          id: courseId,
        },
      });
    });
  },
  mounted() {
    // noinspection JSUnresolvedFunction
    this.$refs.content.$el.focus();
  },
  methods: {
    handleTextareaFocus(event) {
      event.target.select();
    },
    handleTextareaMouseenter(event) {
      event.target.focus();
    },
    handleCopied() {
      this.$message.success('复制成功！');
      // noinspection JSUnresolvedFunction
      this.$refs.content.$el.focus();
    },
    handleCopyError() {
      this.$message.error('复制失败，请手动复制！');
      // noinspection JSUnresolvedFunction
      this.$refs.content.$el.focus();
    },
    handleSelectChange(ids) {
      this.selectedCourseIds = ids;
    },
  },
};
