export const UseScheduleTableThemeMixin = {
  data () {
    return {
      ScheduleTableTheme: 'candy',
    }
  },
  computed: {
    ScheduleTableThemeText () {
      const t = this.ScheduleTableTheme
      switch (t) {
        case 'candy':
          return '糖果';
        case 'classic':
          return '经典';
        default:
          return '<unknown>'
      }
    }
  },
  created () {
    let check = () => {
      if (!this.$store.state.loaded) setTimeout(check, 500)
      this.ScheduleTableTheme = this.$store.state.useScheduleTableTheme;
    }
    setTimeout(check, 500)
  },
  methods: {
    handleChangeScheduleTableTheme () {
      this.ScheduleTableTheme = this.ScheduleTableTheme === 'candy' ? 'classic' : 'candy'
      this.$store.dispatch('setUseScheduleTableTheme', this.ScheduleTableTheme)
    }
  }
}