<template>
  <el-image ref="elImage" class="m-image" :src="curSrc" fit="scale-down" :preview-src-list="preview ? [curSrc] : []">
    <div slot="error" class="image-slot">
      <i class="el-icon-picture-outline"></i>
    </div>
  </el-image>
</template>

<script>
  export default {
    props: {
      src: {
        type: String || Object,
        default: true,
      },
      type: {
        type: String,
        default: '',
      },
      preview: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        placeholderSrc: require('@/assets/images/img-loading.gif'),
      }
    },
    methods: {
      showPreview() {
        this.$refs.elImage.showViewer = true
      },
    },
    computed: {
      curSrc() {
        return this.src
      },
    },
  }
</script>

<style lang="less" scoped>
  .m-image {
    width: 100%;
    height: 100%;
  }
</style>
