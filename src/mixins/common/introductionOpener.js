import {isMacLike} from '../../utils/course';

export const introductionOpenerMixin = {
  methods: {
    getLinkHref(id) {
      return `${this.$store.state.backend}/DataQuery/QueryCourseIntro?courseNo=${id}`;
    },
    getLinkTitle(course, id) {
      let modifiedName = (course.name || course.courseName).replace('《', '〈').replace('》', '〉');
      return `点击查看《${modifiedName}》(${course.id || id}) 的课程简介\n[按住${isMacLike ? '⌘' : 'Ctrl'}点击，可在新标签页打开]`;
    },
    showCourseIntroduction(event, href) {
      if (isMacLike ? event.metaKey : event.ctrlKey) {
        return true;
      }
      if (this.$store.state.showIntroductionNotification) {
        this.$notification.info({
          key: 'introduction',
          message: '弹出窗口需要登录？打开的是选课系统首页？',
          description: '如有上述情况，请确认选课系统登录状态，关闭弹出的窗口，然后【重新点击链接】。',
          duration: 0,
          btn: (h) => {
            return h('a-button', {
              props: {
                type: 'link',
                size: 'small',
              },
              on: {
                click: () => {
                  this.$store.commit('IGNORE_INTRODUCTION_NOTIFICATION');
                  this.$notification.close('introduction');
                },
              },
            }, '本次不再提示');
          },
          style: {
            width: '440px',
            marginLeft: `${384 - 440}px`,
          },
        });
      }
      event.preventDefault();
      let top = (window.screen.availHeight - 480) / 2;
      open(href, 'course-introduction', `left=32,top=${top},width=640,height=480`);
      return false;
    },
  },
};
