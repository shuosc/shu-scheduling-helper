<template>
  <div>
    <sup>{{ extra.number }}</sup>
    <span></span>
    <sub>{{ extra.capacity }}</sub>
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
    min-width: 30px;
    text-align: center;
    white-space: nowrap;
  }

  sup {
    font-size: 12px;
    top: -1em;
    right: -1px;
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
    font-size: 12px;
    bottom: -0.25em;
  }
</style>
