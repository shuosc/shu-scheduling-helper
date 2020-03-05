<template>
  <div class="qr-card">
    <img src="../../../../assets/qr.png" alt="qr" /><br />
    排课助手
  </div>
</template>

<script>
  export default {
    name: 'QrCard',
  }
</script>

<style scoped>
  .qr-card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.45);
    border-radius: 2px;
    text-align: center;
    position: absolute;
    overflow: hidden;
    font-size: 12px;
    padding: 2px;
    bottom: 7px;
    right: 7px;
    left: 7px;
  }

  img {
    width: 100%;
  }
</style>
