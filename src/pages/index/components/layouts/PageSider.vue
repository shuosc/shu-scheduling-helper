<template>
  <a-layout-sider
    class="page-sider"
    width="480px"
    theme="light"
    breakpoint="lg"
    collapsed-width="0"
    :trigger="null"
    @collapse="handleCollapse"
  >
    <ScheduleTable @click="$emit('click')" />
  </a-layout-sider>
</template>

<script>
  import ScheduleTable from '../ScheduleTable';

  export default {
    name: 'PageSider',
    components: {
      ScheduleTable,
    },
    methods: {
      handleCollapse(collapsed) {
        this.$emit('collapse', collapsed);
      },
    },
  };
</script>

<style scoped>
  .page-sider {
    position: fixed;
    overflow: auto;
    top: 64px;
    bottom: 0;
    left: 0;
  }
</style>
