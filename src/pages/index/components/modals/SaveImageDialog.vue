<template>
  <div>
    <h3>截图完成！</h3>
    <div v-viewer="viewerOption">
      <img :src="blobUrl" alt="课程表图片" />
    </div>
    <div class="input-wrapper">
      <a-input v-model="fileName" addon-before="保存文件名：" addon-after=".png" :placeholder="defaultFileName" />
    </div>
    <a-button type="primary" icon="download" @click="download">下载</a-button>
  </div>
</template>

<script>
  import saveAs from 'file-saver';

  export default {
    name: 'SaveImageDialog',
    props: {
      blob: {
        type: Blob,
      },
    },
    data() {
      return {
        blobUrl: null,
        defaultFileName: null,
        fileName: null,
      };
    },
    computed: {
      viewerOption() {
        return {
          inline: false,
          button: true,
          navbar: false,
          title: false,
          toolbar: false,
          tooltip: true,
          movable: true,
          zoomable: true,
          rotatable: false,
          scalable: false,
          transition: true,
          fullscreen: false,
          keyboard: false,
          url: this.blobUrl,
        };
      },
    },
    mounted() {
      this.blobUrl = URL.createObjectURL(this.blob);
      this.defaultFileName = `Timetable-${Math.floor(Math.random() * Math.pow(36, 4) + Math.pow(36, 4)).toString(36).toUpperCase().slice(-4)}`;
      this.fileName = this.defaultFileName;
    },
    beforeDestroy() {
      URL.revokeObjectURL(this.blobUrl);
    },
    methods: {
      download() {
        saveAs(this.blob, `${this.fileName || this.defaultFileName}.png`);
        this.$emit('ok');
      },
    },
  };
</script>

<style scoped>
  div {
    text-align: center;
  }

  h3 {
    text-align: left;
  }

  img {
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    text-align: center;
    max-height: 240px;
    max-width: 100%;
    cursor: pointer;
  }

  .input-wrapper {
    margin: 20px 0;
  }
</style>
