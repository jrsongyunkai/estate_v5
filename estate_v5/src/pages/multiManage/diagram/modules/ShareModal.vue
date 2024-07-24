<template>
  <Modal v-model="openModalShow" :title="$t('share')" width="800px" :mask-closable="false" footer-hide>
    <div class="share">
      <span>{{ $t('sharingAddress') }}:</span>
      <span class="url-text">{{ shareUrl }}</span>
      <a class="copy" href="javascript:void(0)" @click.stop="copy">{{ $t('copy') }}</a>
    </div>
  </Modal>
</template>

<script>
  export default {
    props: {
      sketchInfo: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        openModalShow: false,
      }
    },
    computed: {
      shareUrl() {
        return `${window.location.origin}/sketch?code=${this.sketchInfo && this.sketchInfo.code}`
      },
    },
    methods: {
      openModal() {
        this.openModalShow = true
      },
      copy() {
        this.$Copy({ text: this.shareUrl })
      },
    },
  }
</script>

<style lang="less">
  .share {
    display: flex;
    line-height: 50px;
    font-size: 14px;
    .url-text {
      font-weight: 600;
      margin-right: 40px;
    }
  }
</style>
