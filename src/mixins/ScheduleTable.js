import html2canvas from 'html2canvas';
import { getPeriods, isMacLike } from '../utils/course';
import { getColor } from '../utils/color';
import { 
  adjustAllTextElements, 
  getCourseNameParts, 
  shortenCourseNameParts 
} from '../utils/AdjustTextSize';


export const ScheduleTableMixin = {
  data() {
    return {
      classPeriods: [
        ['8:00', '8:45'],
        ['8:55', '9:40'],
        ['10:00', '10:45'],
        ['10:55', '11:40'],
        ['13:00', '13:45'],
        ['13:55', '14:40'],
        ['15:00', '15:45'],
        ['15:55', '16:40'],
        ['18:00', '18:45'],
        ['18:55', '19:40'],
        ['20:00', '20:45'],
        ['20:55', '21:40'],
      ],
      venueMode: false,
      capturing: false,
      colorSeedShortcut: isMacLike ? '⇧⌘K' : 'Ctrl+Shift+K',
    };
  },
  computed: {
    rows() {
      if (this.$store.state.previewClass == null) {
        return this.$store.getters.scheduleTableRows;
      } else {
        let rows = JSON.parse(JSON.stringify(this.$store.getters.scheduleTableRows));

        rows.forEach((row, i) => {
          row.forEach((cellCourses, j) => {
            rows[i][j] = cellCourses.filter(cell => 
              cell === null || 
              (cell.courseId !== this.$store.state.previewClass.courseId && 
               !this.$store.state.previewClassConflicts.hasOwnProperty(cell.courseId))
            );
          });
        });
        getPeriods(this.$store.state.previewClass.classTime).forEach((period) => {
          const previewCourse = {
            courseId: this.$store.state.previewClass.courseId,
            courseName: this.$store.state.previewClass.courseName,
            teacherId: this.$store.state.previewClass.teacherId,
            teacherName: this.$store.state.previewClass.teacherName,
            first: period[2],
            span: period[3],
            color: getColor(this.$store.state.previewClass.courseName, 0),
            isPreview: true,
            fortnight: period[4] ? period[4] + '周' : null,
            lab: period[5],
            clipPathMode: period[4] === '单' ? 'top-left' : 
                         period[4] === '双' ? 'bottom-right' : 'full',
          };
          
          // 检查是否可以与现有课程共存（单双周交替）
          const existingCourses = rows[period[0]][period[1]];
          if (existingCourses.length === 0) {
            rows[period[0]][period[1]].push(previewCourse);
          } 
          else if (existingCourses.length === 1) {
            const existingCourse = existingCourses[0];
            
            if ((previewCourse.fortnight === '单周' && existingCourse.fortnight === '双周') ||
                (previewCourse.fortnight === '双周' && existingCourse.fortnight === '单周')) {
              rows[period[0]][period[1]].push(previewCourse);
            } else {
              rows[period[0]][period[1]] = [previewCourse];
            }
          } else {
            rows[period[0]][period[1]] = [previewCourse];
          }
        });
        
        return rows;
      }
    },
    noPeriodClasses() {
      let keys = Object.keys(this.$store.state.selectedClasses);
      keys = keys.filter((courseId) => {
        let teacherId = this.$store.state.selectedClasses[courseId].teacherId;
        return getPeriods(this.$store.state.reservedClasses[courseId].classes[teacherId].classTime).length === 0;
      });
      return keys.map((courseId) => {
        let teacherId = this.$store.state.selectedClasses[courseId].teacherId;
        return {
          courseId,
          teacherId,
          courseName: this.$store.state.reservedClasses[courseId].courseName,
          teacherName: this.$store.state.reservedClasses[courseId].classes[teacherId].teacherName,
          color: this.$store.state.selectedClasses[courseId].themeColor,
        };
      });
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
        setTimeout(() => {
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
        }, 0);
      });
    },
  },
};

export const ClassCardMixin = {
  data() {
    return {
      courseNameParts: this.getCourseNameParts(),
      timer: null,
    };
  },
  computed: {
    clipPath() {
      const offset = 2;
      const minHeight = 18;
      const mode = this.course.clipPathMode;
      
      switch (mode) {
        case 'top-left':
          return `polygon(0 0, 100% 0, 100% ${minHeight}px, 0 calc(100% - ${minHeight + offset}px))`;
        case 'bottom-right':
          return `polygon(0 100%, 0 calc(100% - ${minHeight}px), 100% ${minHeight + offset}px, 100% 100%)`;
        case 'full':
        default:
          return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
      }
    },
    style () {
      const defaultColor = '#888888'; // Default gray color
      
      
      const color = (() => {
        const courseColor = this.course?.color;
        const isValidColor = courseColor && typeof courseColor === 'string' && courseColor.startsWith('#') && courseColor.length === 7;
        
        if (isValidColor) {
          return courseColor;
        } else if (this.course?.courseName) {
          return getColor(this.course.courseName, 0);
        } else {
          return defaultColor;
        }
      })();
      
      return {
        'classic': [
          {
            color: 'rgba(255, 255, 255, 0.95)',
            borderColor: `rgba(${parseInt(color.substr(1, 2), 16)}, ${parseInt(color.substr(3, 2), 16)}, ${parseInt(color.substr(5, 2), 16)}, 1.0)`, 
            background: `rgba(${parseInt(color.substr(1, 2), 16)}, ${parseInt(color.substr(3, 2), 16)}, ${parseInt(color.substr(5, 2), 16)}, 0.75)`,
            opacity: this.course?.isPreview ? '0.5' : '1',
            padding: '4px 5px 5px',
            'border-top-width': '3px',
            'border-top-style': 'solid',
            'border-radius': '2px',
            'clip-path': this.clipPath,
            'background-clip': 'padding-box',
          },
          {
            color: 'rgba(255, 255, 255, 0.85)',
          },
        ],
        'candy': [
          {
            color: `rgba(${parseInt(color.substr(1, 2), 16)}, ${parseInt(color.substr(3, 2), 16)}, ${parseInt(color.substr(5, 2), 16)}, 1.0)`,
            background: `rgba(${parseInt(color.substr(1, 2), 16)}, ${parseInt(color.substr(3, 2), 16)}, ${parseInt(color.substr(5, 2), 16)}, 0.3)`,
            opacity: this.course?.isPreview ? '0.5' : '1',
            padding: '8px 6px 5px',
            'border-radius': '8px',
            margin: '1px',
            'clip-path':  this.clipPath,
            'background-clip': 'padding-box',
          },
          {
            color: `rgba(${parseInt(color.substr(1, 2), 16)}, ${parseInt(color.substr(3, 2), 16)}, ${parseInt(color.substr(5, 2), 16)}, 0.8)`,
          },
        ]
      }
    },
    _class() {
      return {
        'class-card': true,
        'class-card-hover': this.isHover,
      };
    },
    isHover() {
      if (this.capturing) {
        return false;
      }
      return this.$store.state.hoverCourseId === this.course.courseId;
    },
    courseName() {
      return this.courseNameParts.join('');
    },
  },
  watch: {
    course: {
      handler() {
        this.doShortenCourseName();
      },
      deep: true,
    },
  },
  mounted() {
    this.doShortenCourseName();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    getCourseNameParts() {
      return getCourseNameParts(this.course.courseName);
    },
    handleResize() {
      if (this.timer !== null) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(async () => {
        await this.doShortenCourseName();
        clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          await this.doShortenCourseName();
          await this.adjustAllTextElements();
        }, 500);
      }, 0);
    },
    async doShortenCourseName() {
      this.courseNameParts = this.getCourseNameParts();
      await this.$nextTick();
      const lastLength = [0, 0];
      while (Math.max(21, this.$refs.courseName.clientHeight) !== Math.max(21, this.$refs.courseName.scrollHeight)) {
        this.shortenCourseNameParts();
        lastLength.push(this.courseName.length);
        lastLength.shift();
        if (lastLength[0] === lastLength[1]) {
          break;
        }
        await this.$nextTick();
      }
      await this.adjustAllTextElements();
    },

    async adjustAllTextElements() {
      await this.$nextTick();
      const elements = [
        this.$refs.courseName,
        this.$refs.teacherNameVenue,
        this.$refs.venueRef,
        this.$refs.venueAtRef,
        this.$refs.extraRef
      ].filter(Boolean);
      
      await adjustAllTextElements(this, elements, this.course, this.$el);
    },
  
    shortenCourseNameParts() {
      this.courseNameParts = shortenCourseNameParts(this.courseNameParts);
    },
    handleMouseEnter() {
      this.$store.commit('HOVER_COURSE_ID', this.course.courseId);
    },
    handleMouseLeave() {
      if (this.$store.state.hoverCourseId === this.course.courseId) {
        this.$store.commit('HOVER_COURSE_ID', null);
      }
    },
  },
}
