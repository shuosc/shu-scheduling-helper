export const CopyCourseIdMixin = {
  data () {
    return {
      copyCourseIdDisplayText: '复制',
      copyCourseIdDisplayTimeout: -1
    }
  },
  methods: {
    handleCourseIdCopied () {
      if (this.copyCourseIdDisplayTimeout !== -1)
        clearTimeout(this.copyCourseIdDisplayTimeout)
      this.$message.success('复制成功！');
      this.copyCourseIdDisplayText = '已复制'
      this.copyCourseIdDisplayTimeout = setTimeout(() => {
        this.copyCourseIdDisplayText = '复制'
      }, 1500);
    },
    handleCourseIdCopyError () {
      if (this.copyCourseIdDisplayTimeout !== -1)
        clearTimeout(this.copyCourseIdDisplayTimeout)
      this.$message.error('复制失败，请手动复制！');
      this.copyCourseIdDisplayText = '复制失败'
      this.copyCourseIdDisplayTimeout = setTimeout(() => {
        this.copyCourseIdDisplayText = '复制'
      }, 1500);
    },
    getCopyCourseIdDisplay () {
      return this.displayText
    }
  }
}