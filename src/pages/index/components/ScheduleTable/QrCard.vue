<template>
  <div class="qr-card">
    <img alt="qr" src="../../../../assets/qr.png" /><br />
    排课助手
  </div>
</template>

<script>
  export default {
    name: 'QrCard',
  };
</script>

<style scoped>
  .qr-card {
    font-size: 12px;
    position: absolute;
    right: 7px;
    bottom: 7px;
    left: 7px;
    overflow: hidden;
    padding: 2px;
    text-align: center;
    color: rgba(0, 0, 0, 0.45);
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  img {
    width: 100%;
  }
</style>
