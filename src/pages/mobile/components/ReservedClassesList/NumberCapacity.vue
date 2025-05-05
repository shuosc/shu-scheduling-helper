<template>
  <div>
    <strong>{{ extra.number }}</strong>
    <span>/</span>{{ extra.capacity }}人
  </div>
</template>

<script>
  export default {
    name: 'NumberCapacity',
    props: {
      classKey: {
        type: String,
      },
    },
    computed: {
      extra() {
        return this.$store.getters.extra(this.classKey);
      },
    },
  };
</script>

<style scoped>
  div {
    display: inline-block;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.45);
  }

  strong {
    color: rgba(0, 0, 0, 0.65);
  }

  span {
    user-select: none;
    color: rgba(0, 0, 0, 0.2);
  }
</style>
