<template>
  <div class="activation">
    <div>
      <div class="image">
        <img src="@/assets/images/settlement.png" alt="" />
      </div>
      <div class="tips">
        <div>{{ $t('instantSettlementArticle.tip1') }}</div>
        <div>{{ $t('instantSettlementArticle.tip2') }}</div>
        <div>{{ $t('instantSettlementArticle.tip3') }}</div>
        <div class="red">{{ $t('instantSettlementArticle.tip4') }}</div>
      </div>
      <div class="buttonList">
        <Button class="b-blue" @click.stop="handlefatherMethod">{{ $t('freeActivation') }}</Button>
        <!-- <a href="javascript:void(0)" @click.stop="">如何获取资质？</a> -->
      </div>
    </div>
    <Modal v-model="enable" width="1000" footer-hide class-name="activationEnable">
      <div slot="header" class="header">{{ $t('instantSettlementConsentForm') }}</div>
      <div class="content">
        <div class="preface">
          <div class="user">{{ $t('dearUser') }}</div>
          <div class="prefaceContent">
            <i style="margin-left: 40px"></i>
            {{ $t('instantSettlementArticle.section1') }}
            <div style="margin-top: 10px; font-style: italic">{{ $t('instantSettlementArticle.section2') }}</div>
            <div style="margin-top: 10px; font-style: italic">
              {{ $t('instantSettlementArticle.section3') }}
            </div>
          </div>
          <div class="term">
            <div style="margin-top: 20px">
              <div style="margin-top: 10px">
                <b>{{ $t('instantSettlementArticle.section4') }}</b>
              </div>
              <div style="margin-top: 10px">
                {{ $t('instantSettlementArticle.section5') }}
                <b>{{ $t('instantSettlementArticle.section6') }}</b>
              </div>
              <div style="margin-top: 10px">{{ $t('instantSettlementArticle.section7') }}</div>
              <div style="margin-top: 10px">{{ $t('instantSettlementArticle.section8') }}</div>
              <div style="margin-top: 10px">{{ $t('instantSettlementArticle.section9') }}</div>
              <div style="margin-top: 10px">{{ $t('instantSettlementArticle.section10') }}</div>
              <div style="margin-top: 10px">
                {{ $t('instantSettlementArticle.section11') }}
                <b>{{ $t('instantSettlementArticle.section12') }}</b>
              </div>
              <div style="margin-top: 10px">{{ $t('instantSettlementArticle.section13') }}</div>
              <div style="margin-top: 10px">
                <b>{{ $t('instantSettlementArticle.section14') }}</b>
              </div>
              <div style="margin-top: 10px">{{ $t('instantSettlementArticle.section15') }}</div>
              <div style="margin-top: 10px">{{ $t('instantSettlementArticle.section16') }}</div>
              <div style="margin-top: 10px">{{ $t('instantSettlementArticle.section17') }}</div>
              <div style="margin-top: 10px">{{ $t('signBeforeTip') }}</div>
              <div style="margin-top: 10px">{{ $t('thankYouTip') }}</div>
              <div style="margin-top: 10px">{{ $t('sincerely') }}</div>
            </div>
            <Row style="width: 100%; justify-content: flex-end; flex-direction: column; align-items: end">
              <div>{{ $t('signUserValue', { staffName: $store.state.staffName, realName: $store.state.realName }) }}</div>
              <div style="margin-top: 10px">{{ $t('signDateValue', { date: $Date().format('YYYY-MM-DD') }) }}</div>
            </Row>
          </div>
        </div>
      </div>
      <Form style="margin-top: 20px">
        <FormItem>
          <label slot="label">{{ $t('manualSignature') }}</label>
          <div>
            <vue-esign ref="esign" :width="900" :height="300" :isCrop="isCrop" :lineWidth="lineWidth" :lineColor="lineColor" :bgColor.sync="bgColor" />
          </div>
          <div class="reset" @click.stop="handleReset">{{ $t('emptyDrawingBoard') }}</div>
          <Checkbox style="margin-top: 10px" v-model="disabledSingle" :disabled="btnOptFlag">
            <span class="ml-10">
              {{ $t('instantSettlementArticle.section18') }}
              <span style="margin-left: 20px">{{ outTime !== '' ? `(${outTime}S)` : '' }}</span>
            </span>
          </Checkbox>
        </FormItem>
      </Form>
      <Row style="justify-content: flex-end">
        <Button type="primary" style="margin-right: 10px" @click.stop="handleGenerate" :disabled="btnOptFlag">{{ $t('submit') }}</Button>
        <Button type="default" @click.stop="enable = false">{{ $t('cancel') }}</Button>
      </Row>
    </Modal>
  </div>
</template>
<script>
  import { upload } from '@/api/public'
  import { activeRtSettlement, checkRtSettlement } from '@/api/billingSystem/instantSettlement'
  export default {
    data() {
      return {
        enable: false,
        lineWidth: 4,
        lineColor: '#fff',
        bgColor: '#303642',
        resultImg: '',
        isCrop: false,
        disabledSingle: false,
        btnOptFlag: false,
        timer: null,
        outTime: 10,
        uploadUrl: '/common/file/upload.as?fileType=1',
        imgData: { name: 'imgFile' },
      }
    },
    methods: {
      async handleActivate(url) {
        let params = { projectCode: this.$store.state.projectCode, signImgUrl: url }
        const res = await activeRtSettlement(params)
        if (res.success) {
          this.enable = false
          this.$emit('ActivationStatus', false)
          this.$Message.success({ content: this.$t('submittedSuccessfully') })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlefatherMethod() {
        let params = { projectCode: this.$store.state.projectCode, isThrowError: true }
        const res = await checkRtSettlement(params)
        if (res.success) {
          this.enable = true
          this.outTime = 10
          this.btnOptFlag = true
          if (!this.timer) {
            this.timer = setInterval(() => {
              this.outTime = this.outTime - 1
              if (this.outTime < 0) {
                clearInterval(this.timer)
                this.timer = false
                this.outTime = ''
                this.btnOptFlag = false
              }
            }, 1000)
          }
        } else {
          this.$message.error(res.message)
        }
      },
      handleReset() {
        this.$refs['esign'].reset()
        this.$nextTick(() => {
          this.bgColor = '#303642'
        })
      },
      async handleGenerate() {
        if (this.disabledSingle) {
          try {
            this.resultImg = await this.$refs.esign.generate()
            const blobs = this.base64toBlob(this.resultImg, 'image/png')
            const formData = new FormData()
            formData.append('name', this.imgData.name)
            formData.append('imgFile', blobs, 'png')
            const res = await upload(formData)
            this.handleActivate(res.data)
          } catch (error) {
            return this.$Message.error({ content: this.$t('noSignTip') })
          }
        } else {
          this.$Message.error({ content: this.$t('instantSettlementArticle.noAgreeTip') })
        }
      },
      base64toBlob(base64, type) {
        const bstr = atob(base64.substring(base64.indexOf(',') + 1))
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type })
      },
    },
  }
</script>
<style lang="less" scoped>
  .activation {
    height: calc(~'100vh - 144px');
    background: #1a202e;
    display: flex;
    padding-left: 200px;
    padding-top: 140px;
    overflow: hidden;
    .image {
      width: 300px;
      img {
        width: 100%;
      }
    }
    .tips {
      margin-top: 50px;
      .red {
        color: #d9001b;
        font-weight: 700;
      }
    }
    .buttonList {
      margin-top: 50px;
      a {
        text-decoration: underline;
        margin-left: 20px;
      }
    }
  }
</style>
<style lang="less">
  .activationEnable {
    color: #ddd;
    .ivu-modal-body {
      height: 75vh;
      overflow: auto;
      padding: 0px 40px 10px 40px;
    }
    .header {
      text-align: center;
      font-size: 20px;
      margin-top: 20px;
    }
    .ivu-modal-header {
      border-bottom: transparent;
    }
    .ivu-modal-footer {
      border-color: transparent;
    }
    .ivu-form-item-label {
      float: none;
    }
    .ivu-form-item-content {
      margin-top: 10px;
    }
    .reset {
      cursor: pointer;
      color: #007eff;
      text-decoration: underline;
    }
    .content {
      position: relative;
      .timer {
        position: absolute;
        top: -32px;
        right: 0;
        font-size: 16px;
      }
      .preface {
        margin-top: 30px;
        .user {
          font-size: 16px;
        }
        .prefaceContent {
          margin-top: 20px;
          font-style: 12px;
        }
        .term {
          margin-top: 20px;
          .termtitle {
            margin-top: 20px;
            font-size: 20px;
          }
        }
      }
    }
  }
</style>
