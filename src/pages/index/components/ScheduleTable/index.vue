<template>
  <div ref="wrapper" :class="{'schedule-table-wrapper': true, 'schedule-table-wrapper-capturing': capturing}">
    <a-config-provider :get-popup-container="() => $refs.setting" :auto-insert-space-in-button="false">
      <table class="schedule-table">
        <thead>
        <tr>
          <td class="header-setting">
            <div ref="setting" :class="{ setting: true, 'setting-show': venueMode }">
              <!--<a-button :type="venueMode ? 'primary' : null" size="small" shape="circle" icon="camera"-->
              <!--@click="saveImage" />-->
              <!--{{ ' ' }}-->
              <a-dropdown v-if="!venueMode">
                <a-button shape="circle" size="small" icon="setting" />
                <a-menu slot="overlay">
                  <a-menu-item @click="venueMode = true">
                    <a-icon type="bank" />
                    显示上课地点
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item @click="$showColorSeedDialog">
                    <a-icon type="experiment" />
                    色彩随机种子 {{ colorSeedShortcut }}
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
              <a-button v-else type="danger" size="small" shape="round" @click="venueMode = false">复原</a-button>
            </div>
            <div v-show="capturing" class="brand">
              <img src="../../../../assets/logo.png" alt="Logo" />
              {{ $store.getters.credits }} 学分
            </div>
          </td>
          <th class="header-period">&nbsp;</th>
          <th class="header-week" v-for="week in ['一', '二', '三', '四', '五']" :key="week">{{ week }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <th>{{ index + 1 }}</th>
          <td class="class-period">
            <p>{{ classPeriods[index][0] }}</p>
            <p>- {{ classPeriods[index][1] }}</p>
          </td>
          <template v-for="(course, index2) in row">
            <td v-if="course == null || course.first" :key="index2" :rowspan="course != null ? course.span : 1">
              <ClassCard :course="course" v-if="course != null && !course.qr" :venue="venueMode" :capturing="capturing"
                         @click.native="handleClassCardClick(course.courseId)" />
              <QrCard v-if="course != null && course.qr" />
            </td>
          </template>
        </tr>
        </tbody>
      </table>
    </a-config-provider>
    <div class="no-period-class-card-wrapper" v-if="capturing && noPeriodClasses.length > 0">
      <NoPeriodClassCard v-for="(course, index) in noPeriodClasses" :course="course" :key="index" :venue="venueMode"
                         :capturing="capturing" />
    </div>
  </div>
</template>

<script>
  import ClassCard from './ClassCard';
  import NoPeriodClassCard from './NoPeriodClassCard';
  import QrCard from './QrCard';
  import {ScheduleTableMixin} from '../../../../mixins/ScheduleTable';

  export default {
    name: 'ScheduleTable',
    components: {
      NoPeriodClassCard,
      QrCard,
      ClassCard,
    },
    mixins: [ScheduleTableMixin],
  };
</script>

<style scoped>
  /*noinspection CssUnusedSymbol*/
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
    transition: all 0.2s;
    white-space: nowrap;
    position: absolute;
    text-align: left;
    opacity: 0;
    left: 2px;
    top: 2px;
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
    color: rgba(0, 0, 0, 0.45);
    white-space: nowrap;
    position: absolute;
    line-height: 18px;
    font-size: 12px;
    display: block;
    width: 100%;
    top: 3px;
    left: 0;
  }

  .brand img {
    height: 18px;
    width: 18px;
  }

  .no-period-class-card-wrapper {
    margin: 8px -4px 0 0;
    text-align: center;
  }
</style>
