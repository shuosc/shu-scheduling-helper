<template>
  <div class="schedule-table-wrapper">
    <table class="schedule-table">
      <thead>
      <tr>
        <th class="header-number">&nbsp;</th>
        <th :key="week" class="header-week" v-for="week in ['一', '二', '三', '四', '五']">{{ week }}</th>
      </tr>
      </thead>
      <tbody>
      <tr :key="index" v-for="(row, index) in rows">
        <th>{{ index + 1 }}</th>
        <template v-for="(course, index2) in row">
          <td :key="index2" :rowspan="course !== null ? course.span : 1" v-if="course === null || course.first">
            <ClassCard :theme="ScheduleTableTheme" :course="course" :venue="venueMode" @click.native="handleClassCardClick(course.courseId)"
                       v-if="course !== null" />
          </td>
        </template>
      </tr>
      </tbody>
    </table>
    <div class="show-venue-wrapper">
      <a-checkbox v-model="venueMode">显示上课地点</a-checkbox>
      <a-button @click="handleChangeScheduleTableTheme">切换课表主题 ({{ ScheduleTableThemeText }})</a-button>
    </div>
  </div>
</template>

<script>
  import ClassCard from './ClassCard';
  import { ScheduleTableMixin } from '../../../../mixins/ScheduleTable';
  import { UseScheduleTableThemeMixin } from '../../../../mixins/common/useScheduleTableTheme';

  export default {
    name: 'ScheduleTable',
    components: {
      ClassCard,
    },
    mixins: [ScheduleTableMixin, UseScheduleTableThemeMixin],
  };
</script>

<style scoped>
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

  .schedule-table td {
    position: relative;
  }

  .header-number {
    width: 36px;
  }

  .header-week {
    width: 20%;
  }

  .show-venue-wrapper {
    margin-top: 6px;
    padding: 8px 0;
    text-align: center;
  }
</style>
