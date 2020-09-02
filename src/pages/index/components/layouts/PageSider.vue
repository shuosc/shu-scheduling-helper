<template>
  <a-layout-sider
    :trigger="null"
    @collapse="handleCollapse"
    breakpoint="lg"
    class="page-sider"
    collapsed-width="0"
    theme="light"
    width="480px"
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
    top: 64px;
    bottom: 0;
    left: 0;
    overflow: hidden;
  }

  .page-sider:hover {
    overflow-y: auto;
  }
</style>
