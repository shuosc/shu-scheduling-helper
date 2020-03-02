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
    white-space: nowrap;
    text-align: center;
    min-width: 30px;
  }

  sup {
    right: -1px;
    top: -1em;
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
    bottom: -0.25em;
  }
</style>
