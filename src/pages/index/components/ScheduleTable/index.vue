<template>
  <div :class="{'schedule-table-wrapper': true, 'schedule-table-wrapper-capturing': capturing}" ref="wrapper">
    <a-config-provider :auto-insert-space-in-button="false" :get-popup-container="() => $refs.setting">
      <table class="schedule-table">
        <thead>
        <tr>
          <td class="header-setting">
            <div :class="{ setting: true, 'setting-show': venueMode }" ref="setting">
              <a-dropdown v-if="!venueMode">
                <a-button icon="setting" shape="circle" size="small" />
                <a-menu slot="overlay">
                  <a-menu-item @click="venueMode = true">
                    <a-icon type="bank" />
                    显示上课地点
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item @click="$showColorSeedDialog">
                    <a-icon type="experiment" />
                    色彩随机种子... {{ colorSeedShortcut }}
                  </a-menu-item>
                  <a-menu-item @click="handleChangeScheduleTableTheme">
                    <a-icon type="tags" />
                    切换课表主题 ({{ ScheduleTableThemeText }})
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <a-button @click="venueMode = false" shape="round" size="small" type="primary" v-else>复原</a-button>
              {{ ' ' }}
              <a-button @click="saveImage" icon="camera" shape="circle" size="small" />
            </div>
            <div class="brand" v-show="capturing">
              <img alt="Logo" src="../../../../assets/shuosc-logo-128px.png" />
              <img alt="Logo" src="../../../../assets/logo.png" />
              <span>{{ $store.getters.credits }} 学分</span>
            </div>
          </td>
          <th class="header-period">&nbsp;</th>
          <th :key="week" class="header-week" v-for="week in ['一', '二', '三', '四', '五']">{{ week }}</th>
        </tr>
        </thead>
        <tbody>
        <tr :key="index" v-for="(row, index) in rows">
          <th>{{ index + 1 }}</th>
          <td class="class-period">
            <p>{{ classPeriods[index][0] }}</p>
            <p>- {{ classPeriods[index][1] }}</p>
          </td>
          <template v-for="(courses, index2) in row">
            <td :key="index2" :rowspan="courses.length > 0 && courses[0] != null ? courses[0].span : 1" 
                v-if="courses.length === 0 || (courses.length > 0 && courses[0] != null && courses[0].first)">
              <div class="course-stack" v-if="courses.length > 0">
                <template v-for="(course, courseIndex) in courses">
                  <ClassCard
                    v-if="course != null && !course.qr"
                    :key="courseIndex"
                    :theme="ScheduleTableTheme" 
                    :capturing="capturing" 
                    :course="course" 
                    :venue="venueMode"
                    @click.native="handleClassCardClick(course.courseId)" />
                </template>
              </div>
            </td>
          </template>
        </tr>
        </tbody>
      </table>
    </a-config-provider>
    <div class="no-period-class-card-wrapper" v-if="capturing && noPeriodClasses.length > 0">
      <NoPeriodClassCard :capturing="capturing" :course="course" :key="index" :venue="venueMode"
                         v-for="(course, index) in noPeriodClasses" />
    </div>
  </div>
</template>

<script>
  import { ScheduleTableMixin } from '../../../../mixins/ScheduleTable';
  import { UseScheduleTableThemeMixin } from '../../../../mixins/common/useScheduleTableTheme'
  import ClassCard from './ClassCard.vue';
  import NoPeriodClassCard from './NoPeriodClassCard';
  // import QrCard from './QrCard';


  export default {
    name: 'ScheduleTable',
    components: {
      NoPeriodClassCard,
      // QrCard,
      ClassCard,
    },
    mixins: [ScheduleTableMixin, UseScheduleTableThemeMixin],
  };
</script>

<style scoped>
  /*noinspection CssUnusedSymbol*/
  .schedule-table-wrapper {
    padding: 8px;
  }

  .schedule-table {
    font-size: 13px;
    width: 100%;
    margin: 0;
    padding: 0;
    table-layout: fixed;
    border-collapse: collapse;
    text-align: center;
  }

  .schedule-table thead tr {
    height: 32px;
  }

  .schedule-table tbody tr {
    height: 48px;
  }

  .schedule-table tbody tr:nth-child(odd) {
    background: rgba(0, 0, 0, 0.025);
  }

  .schedule-table th {
    user-select: none;
  }

  .schedule-table td {
    position: relative;
  }

  .class-period p {
    margin: 0;
  }

  .class-period p:first-child {
    padding-right: 1em;
    color: rgba(0, 0, 0, 0.65);
  }

  .class-period p:last-child {
    padding-left: 1em;
    color: rgba(0, 0, 0, 0.35);
  }

  .header-setting {
    position: relative;
    width: 28px;
  }

  .header-period {
    width: 72px;
  }

  .header-week {
    width: 20%;
  }

  /*noinspection CssUnusedSymbol*/
  .setting {
    position: absolute;
    top: 2px;
    left: 2px;
    transition: all 0.2s;
    text-align: left;
    white-space: nowrap;
    opacity: 0;
  }

  /*noinspection CssUnusedSymbol*/
  .setting-show {
    opacity: 1;
  }

  /*noinspection CssUnusedSymbol*/
  .schedule-table-wrapper:hover .setting {
    opacity: 1;
  }

  /*noinspection CssUnusedSymbol*/
  .schedule-table-wrapper-capturing {
    position: absolute;
    overflow: visible;
    width: 480px;
  }

  /*noinspection CssUnusedSymbol*/
  .schedule-table-wrapper-capturing .setting {
    display: none;
  }

  .brand {
    font-size: 12px;
    line-height: 18px;
    position: absolute;
    top: 3px;
    left: 0;
    display: block;
    width: 100%;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.45);
  }

  .brand img {
    width: 18px;
    height: 18px;
    margin: 0 0 0 4px;
  }

  .brand span {
    margin: 0 0 0 6px;
  }

  .no-period-class-card-wrapper {
    margin: 8px -4px 0 0;
    text-align: center;
  }
</style>
