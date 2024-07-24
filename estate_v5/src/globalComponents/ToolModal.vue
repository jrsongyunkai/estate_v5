<template>
  <div>
    <Modal v-model="toolModal" class-name="toolModal" width="400" :mask-closable="false" @on-visible-change="closeIsShowValue">
      <div>
        <div class="iconflex">
          <div><i class="ivu-icon ivu-icon-ios-help-circle toolicon"></i></div>
          <div>{{ text }}</div>
        </div>
      </div>
      <div class="dis-end">
        <Button type="primary" @click="saveEmit">{{ determineText }}</Button>
        <Button class="margin-15" v-show="isShowCancel" @click="cancel">{{ cancelText }}</Button>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: '',
      },
      determineText: {
        type: String,
        default: window.$t('confirm'),
      },
      cancelText: {
        type: String,
        default: window.$t('cancel'),
      },
      isShow: {
        type: Boolean,
        default: false,
      },
      isShowCancel: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        toolModal: false,
      }
    },
    mounted() {
      this.toolModal = this.isShow
    },
    methods: {
      openModal() {
        this.toolModal = true
      },
      saveEmit() {
        this.$emit('saveConfig', true)
      },
      cancel(val) {
        this.$emit('editShow', val)
        this.toolModal = false
      },
      closeIsShowValue(val) {
        if (!val) {
          this.cancel('only-close')
        }
      },
    },
  }
</script>

<style lang="less">
  .iconflex {
    display: flex;
    margin: 30px 10px 10px 10px;
  }
  .margin-15 {
    margin-left: 15px;
  }
  .dis-end {
    display: flex;
    justify-content: end;
    padding: 0 15px;
    margin-top: 10px;
  }
  .toolModal {
    .ivu-modal-header {
      border: none !important;
      padding: 14px 16px;
      line-height: 1;
    }
    .ivu-modal-footer {
      border: none !important;
      padding: 12px 18px 12px 18px;
      text-align: right;
    }
  }
  .toolicon {
    color: #ff9900;
    font-size: 20px;
  }
</style>
