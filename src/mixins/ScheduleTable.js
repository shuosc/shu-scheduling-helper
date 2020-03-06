import html2canvas from 'html2canvas';
import {getColor, getPeriods, isMacLike} from '../utils';

export const ScheduleTableMixin = {
  data() {
    return {
      classPeriods: [
        ['8:00', '8:45'],
        ['8:55', '9:40'],
        ['10:00', '10:45'],
        ['10:55', '11:40'],
        ['12:10', '12:55'],
        ['13:05', '13:50'],
        ['14:10', '14:55'],
        ['15:05', '15:50'],
        ['16:00', '16:45'],
        ['16:55', '17:40'],
        ['18:00', '18:45'],
        ['18:55', '19:40'],
        ['19:50', '20:35'],
      ],
      venueMode: false,
      capturing: false,
      colorSeedShortcut: isMacLike ? '⇧⌘K' : 'Ctrl+Shift+K',
    };
  },
  computed: {
    rows() {
      if (this.$store.state.previewClass == null && !this.capturing) {
        return this.$store.getters.scheduleTableRows;
      } else if (this.capturing) {
        let rows = JSON.parse(JSON.stringify(this.$store.getters.scheduleTableRows));
        let flag = false;
        [4, 3, 2, 1, 0].forEach((j) => {
          [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].forEach((i) => {
            if (!flag && rows[i][j] == null && rows[i + 1][j] == null) {
              rows[i][j] = {
                qr: true,
                span: 2,
                first: true,
              };
              rows[i + 1][j] = {
                qr: true,
                span: 2,
                first: false,
              };
              flag = true;
            }
          });
        });
        return rows;
      } else {
        let rows = JSON.parse(JSON.stringify(this.$store.getters.scheduleTableRows));
        rows.forEach((row, i) => {
          row.forEach((cell, j) => {
            if (cell !== null && cell.courseId === this.$store.state.previewClass.courseId) {
              rows[i][j] = null;
            }
          });
        });
        getPeriods(this.$store.state.previewClass.classTime).forEach((period) => {
          rows[period[0]][period[1]] = {
            courseId: this.$store.state.previewClass.courseId,
            courseName: this.$store.state.previewClass.courseName,
            teacherId: this.$store.state.previewClass.teacherId,
            teacherName: this.$store.state.previewClass.teacherName,
            first: period[2],
            span: period[3],
            color: getColor(this.$store.state.previewClass.courseName, 0),
            isPreview: true,
          };
        });
        return rows;
      }
    },
  },
  methods: {
    handleClassCardClick(courseId) {
      this.$store.commit('OPEN_COURSE_ID', courseId);
      this.$emit('click');
    },
    saveImage() {
      this.capturing = true;
      const hide = this.$message.loading('正在截图...');
      this.$nextTick(() => {
        html2canvas(this.$refs.wrapper, {
          scale: 3,
          width: 480,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 480,
        }).then((canvas) => {
          canvas.toBlob((blob) => {
            this.$showSaveImageDialog(blob);
          });
        }).catch(() => {
          this.$message.error('截图失败！');
        }).finally(() => {
          this.capturing = false;
          hide();
        });
      });
    },
  },
};

export const ClassCardMixin = {
  computed: {
    style() {
      return {
        color: 'rgba(255, 255, 255, 0.95)',
        borderTopColor: `rgba(${parseInt(this.course.color.substr(1, 2), 16)}, ${parseInt(this.course.color.substr(3, 2), 16)}, ${parseInt(this.course.color.substr(5, 2), 16)}, 1.0)`,
        background: `rgba(${parseInt(this.course.color.substr(1, 2), 16)}, ${parseInt(this.course.color.substr(3, 2), 16)}, ${parseInt(this.course.color.substr(5, 2), 16)}, 0.75)`,
        opacity: this.course.isPreview ? '0.5' : '1',
      };
    },
    _class() {
      return {
        'class-card': true,
        'class-card-hover': this.isHover,
      }
    },
    isHover() {
      return this.$store.state.hoverCourseId === this.course.courseId;
    },
  },
  methods: {
    handleMouseEnter() {
      this.$store.commit('HOVER_COURSE_ID', this.course.courseId);
    },
    handleMouseLeave() {
      if (this.$store.state.hoverCourseId === this.course.courseId) {
        this.$store.commit('HOVER_COURSE_ID', null);
      }
    },
  }
};
