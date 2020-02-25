<template>
  <div class="schedule-table-wrapper">
    <table class="schedule-table">
      <thead>
      <tr>
        <th class="header-number">&nbsp;</th>
        <th class="header-week" v-for="week in ['一', '二', '三', '四', '五']" :key="week">{{ week }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <th>{{ index + 1 }}</th>
        <template v-for="(course, index2) in row">
          <td v-if="course === null || course.first" :key="index2" :rowspan="course !== null ? course.span : 1">
            <ClassCard :course="course" v-if="course !== null" @click.native="handleClassCardClick(course.courseId)" />
          </td>
        </template>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import ClassCard from './ClassCard';
  import {ScheduleTableMixin} from '../../../../mixins/ScheduleTable';

  export default {
    name: 'ScheduleTable',
    components: {
      ClassCard,
    },
    mixins: [ScheduleTableMixin],
  };
</script>

<style scoped>
  .schedule-table-wrapper {
    padding: 8px;
  }

  .schedule-table {
    margin: 0;
    padding: 0;
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
    text-align: center;
    font-size: 13px;
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
</style>
