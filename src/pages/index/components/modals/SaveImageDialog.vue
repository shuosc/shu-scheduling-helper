<template>
  <div>
    <h3>截图完成！<small class="subtitle">当前截图功能不稳定，如遇图片异常，请再试几次。</small></h3>
    <div v-viewer="viewerOption">
      <img :src="blobUrl" alt="课程表图片" />
    </div>
    <div class="input-wrapper">
      <a-input :placeholder="defaultFileName" addon-after=".png" addon-before="保存文件名：" v-model="fileName" />
    </div>
    <a-button @click="download" icon="download" type="primary">下载</a-button>
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
      this.defaultFileName = `课表截图 - ${new Date().toLocaleString()}`;
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
    margin-bottom: 12px;
  }

  .subtitle {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.35);
  }

  img {
    max-width: 100%;
    max-height: 240px;
    cursor: pointer;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .input-wrapper {
    margin: 20px 0;
  }
</style>
