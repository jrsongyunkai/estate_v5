<template>
  <Poptip transfer-class-name="qrCode-poptip" :trigger="trigger" :width="width" @on-popper-show="createQrCode" @on-popper-hide="deleteQrCode" transfer>
    <slot name="action"></slot>
    <span v-if="!$slots.action" class="icon-v5 icon-v5-bhjqr8b qrCode-icon"></span>
    <div slot="content">
      <div class="header">
        <div class="title">{{ title || $t('paymentCode') }}</div>
        <span class="save-btn" v-if="!isCustomDownload" @click.stop="toImage">{{ $t('saveAs') }}</span>
        <span class="save-btn" v-else @click.stop="$emit('downloadPng', text)">{{ $t('saveAs') }}</span>
      </div>
      <div class="content">
        <div class="qrCode-box" ref="qrCode_box" style="padding: 10px">
          <div class="qrCode" ref="qrCodeRef"></div>
          <div style="width: 100%"><slot></slot></div>
        </div>
      </div>
    </div>
  </Poptip>
</template>

<script>
  import { toCanvas } from 'qrcode'
  import { toBlob } from 'html-to-image'
  export default {
    props: {
      title: { type: String, default: '' },
      text: { type: String, default: '' },
      trigger: { type: String, default: 'click' },
      width: { type: Number, default: 350 },
      isNeedBackColor: { type: Boolean, default: false },
      isCustomDownload: { type: Boolean, default: false },
    },
    data() {
      return {
        qrCode: null,
      }
    },
    methods: {
      async createQrCode() {
        if (this.qrCode) return
        this.qrCode = await toCanvas(this.text, { errorCorrectionLevel: 'H', width: 220, height: 220, margin: 2 })
        this.$refs.qrCodeRef.appendChild(this.qrCode)
      },
      downloadImage(blob) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, 'chart-download' + '.' + 'png')
        } else {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'chart-download' + '.' + 'png'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      },
      toImage() {
        let dom = this.$refs.qrCode_box
        toBlob(dom, {
          backgroundColor: this.isNeedBackColor ? '#28313f' : '#ffffff',
          style: { color: '#000' },
          skipFonts: true,
        }).then(blob => {
          this.downloadImage(blob)
        })
      },
      deleteQrCode() {
        this.qrCode = null
        this.$refs.qrCodeRef.innerHTML = ''
      },
    },
    beforeDestroy() {
      this.qrCode = null
    },
  }
</script>

<style lang="less">
  .qrCode-icon {
    color: #007eff;
    font-size: 24px;
    cursor: pointer;
    display: inline-block;
  }
  .qrCode-icon:hover {
    color: #2e8ae6;
  }
  .qrCode-poptip {
    .ivu-poptip-body {
      padding: 0;
      .header {
        display: flex;
        justify-content: center;
        position: relative;
        line-height: 36px;
        align-items: center;
        .title {
          font-size: 16px;
        }
        .save-btn {
          font-size: 14px;
          position: absolute;
          right: 10px;
          text-decoration: underline;
          color: #007eff;
          cursor: pointer;
          &:hover {
            color: #2e8ae6;
          }
        }
      }
      .content {
        border-top: 1px solid #424b5f;
        background: #28313f;
        .qrCode-box {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          .qrCode {
            width: 240px;
            height: 240px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
</style>
