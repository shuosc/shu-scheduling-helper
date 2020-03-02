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
    white-space: nowrap;
    text-align: center;
    line-height: 32px;
    min-width: 30px;
    height: 32px;
  }

  sup {
    color: rgba(0, 0, 0, 0.65);
    top: -0.875em;
    right: -1px;
  }

  span {
    background: rgba(0, 0, 0, 0.2);
    transform: rotate(45deg);
    display: inline-block;
    user-select: none;
    height: 1em;
    width: 1px;
  }

  sub {
    color: rgba(0, 0, 0, 0.45);
    bottom: -0.5em;
  }
</style>
