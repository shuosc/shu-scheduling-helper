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
    color: rgba(0, 0, 0, 0.45);
    display: inline-block;
    white-space: nowrap;
  }

  strong {
    color: rgba(0, 0, 0, 0.65);
  }

  span {
    color: rgba(0, 0, 0, 0.2);
    user-select: none;
  }
</style>
