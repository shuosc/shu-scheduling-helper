<template>
  <div>
    <sup><strong>{{ extra.number }}</strong></sup>
    <span></span>
    <sub>{{ extra.capacity }}人</sub>
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
    line-height: 32px;
    min-width: 30px;
    height: 32px;
    text-align: center;
    white-space: nowrap;
  }

  sup {
    top: -0.875em;
    right: -1px;
    color: rgba(0, 0, 0, 0.65);
  }

  span {
    display: inline-block;
    width: 1px;
    height: 1em;
    user-select: none;
    transform: rotate(45deg);
    background: rgba(0, 0, 0, 0.2);
  }

  sub {
    bottom: -0.5em;
    color: rgba(0, 0, 0, 0.45);
  }
</style>
