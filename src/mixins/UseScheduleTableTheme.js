export const UseScheduleTableThemeMixin = {
  data () {
    return {
      ScheduleTableTheme: 1,
      ScheduleTableThemeText: '糖果'
    }
  },
  created () {
    let check = () => {
      if (!this.$store.state.loaded) setTimeout(check, 500)
      this.ScheduleTableTheme = this.$store.state.useScheduleTableTheme;
    }
    setTimeout(check, 500)
  },
  watch: {
    ScheduleTableTheme: {
      handler (newVal) {
        this.ScheduleTableThemeText = newVal === 1 ? '糖果' : '经典';
      },
      immediate: true
    }
  },
  methods: {
    handleChangeScheduleTableTheme () {
      this.ScheduleTableTheme = (this.ScheduleTableTheme + 1) % 2
      this.$store.dispatch('setUseScheduleTableTheme', this.ScheduleTableTheme)
    }
  }
}