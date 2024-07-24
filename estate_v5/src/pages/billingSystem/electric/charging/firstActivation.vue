<template>
  <div class="activation">
    <div class="image">
      <img src="@/assets/images/jifei.png" alt="" />
    </div>
    <div class="tips">
      <div>{{ $t('settlementAndPaymentAgreement.tip1') }}</div>
      <div>{{ $t('settlementAndPaymentAgreement.tip2') }}</div>
      <div>{{ $t('settlementAndPaymentAgreement.tip3') }}</div>
      <div style="color: #cd0025">{{ $t('settlementAndPaymentAgreement.tip4') }}</div>
    </div>
    <div class="buttonList">
      <Button class="b-blue" @click="handlefatherMethod">{{ $t('freeActivation') }}</Button>
    </div>

    <Modal v-model="enable" width="1000" class-name="activationEnable">
      <div slot="header" class="header">{{ $t('settlementAndPaymentAgreement.title') }}</div>
      <div class="content">
        <div class="preface">
          <div class="user">{{ $t('dearUser') }}</div>
          <div class="prefaceContent">
            <i style="margin-left: 40px"></i>
            {{ $t('settlementAndPaymentAgreement.section1') }}
            <div style="margin-top: 10px; font-style: italic">{{ $t('instantSettlementArticle.section2') }}</div>
            <div style="margin-top: 10px; font-style: italic">{{ $t('settlementAndPaymentAgreement.section2') }}</div>
          </div>
          <div class="term">
            <div style="margin-top: 20px">
              <div style="margin-top: 10px" class="fontweigt">{{ $t('settlementAndPaymentAgreement.section3') }}</div>
              <div style="margin-top: 10px">
                {{ $t('settlementAndPaymentAgreement.section4') }}
                <span class="fontweigt">{{ $t('settlementAndPaymentAgreement.section5') }}</span>
              </div>
              <div style="margin-top: 10px">{{ $t('instantSettlementArticle.section7') }}</div>
              <div style="margin-top: 10px">{{ $t('settlementAndPaymentAgreement.section6') }}</div>
              <div style="margin-top: 10px">{{ $t('settlementAndPaymentAgreement.section7') }}</div>
              <div style="margin-top: 10px">{{ $t('settlementAndPaymentAgreement.section8') }}</div>
              <div style="margin-top: 10px">{{ $t('settlementAndPaymentAgreement.section9') }}</div>
              <div style="margin-top: 10px" class="fontweigt">{{ $t('settlementAndPaymentAgreement.section10') }}</div>
              <div style="margin-top: 10px">{{ $t('settlementAndPaymentAgreement.section11') }}</div>
              <div style="margin-top: 10px">{{ $t('settlementAndPaymentAgreement.section12') }}</div>
              <div style="margin-top: 10px">{{ $t('settlementAndPaymentAgreement.section13') }}</div>
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
            <vue-esign ref="esign" :width="1200" :height="300" :isCrop="isCrop" :lineWidth="lineWidth" :lineColor="lineColor" :bgColor.sync="bgColor" />
          </div>
          <div class="reset" @click="handleReset">{{ $t('emptyDrawingBoard') }}</div>
          <Checkbox style="margin-top: 10px" v-model="disabledSingle" :disabled="btnOptFlag">
            <span class="ml-10">
              {{ $t('instantSettlementArticle.section18') }}
              <span style="margin-left: 20px">{{ outTime !== '' ? `(${outTime}S)` : '' }}</span>
            </span>
          </Checkbox>
        </FormItem>
      </Form>
      <Row style="justify-content: flex-end">
        <Button type="primary" style="margin-right: 10px" @click="handleGenerate" :disabled="btnOptFlag">{{ $t('submit') }}</Button>
        <Button type="default" @click="enable = false">{{ $t('cancel') }}</Button>
      </Row>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import { upload, billingActivate } from '@/api/public'

  export default {
    props: {
      billingCheckStatus: {
        type: Boolean,
      },
      firstActivationStatus: {
        type: String,
      },
    },
    data() {
      return {
        enable: false,
        lineWidth: 6,
        lineColor: '#fff',
        bgColor: '#303642',
        resultImg: '',
        isCrop: false,
        disabledSingle: false,
        btnOptFlag: false,
        timer: null,
        outTime: 5,
        uploadUrl: '/common/file/upload.as?fileType=1',
        imgData: { name: 'imgFile' },
      }
    },
    mounted() {},
    methods: {
      async handlebillingActivate(url) {
        let params = { projectCode: this.$store.state.projectCode, signImgUrl: url }
        const res = await billingActivate(params)
        if (res.success) {
          this.enable = false
          this.$emit('ActivationStatus', false)
          this.$Message.success({ content: this.$t('submittedSuccessfully') })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handlefatherMethod() {
        // this.enable = true
        this.$parent.handlebillingCheck(true)
        setTimeout(() => {
          if (this.firstActivationStatus === 'false') {
            this.enable = true
            this.handleEnable()
          }
        }, 1000)
      },
      handleEnable() {
        if (!this.billingCheckStatus) {
          this.btnOptFlag = true // 禁用发送验证码按钮
          this.outTime = 5
          if (!this.timer) {
            this.timer = setInterval(() => {
              this.outTime = this.outTime - 1
              if (this.outTime < 0) {
                // 倒计时结束，重置时间器clearInterval(this.timer)
                clearInterval(this.timer)
                this.outTime = ''
                this.timer = false
                this.btnOptFlag = false
              }
            }, 1000)
            // 每秒执行一次
          }
        }
      },
      handleReset() {
        this.$refs['esign'].reset() // 清空画布
        setTimeout(() => {
          this.bgColor = '#303642'
        }, 500)
      },
      handleGenerate() {
        if (this.disabledSingle) {
          this.$refs['esign']
            .generate()
            .then(res => {
              this.resultImg = res // 得到了签字生成的base64图片
            })
            .catch(err => {
              //  没有签名，点击生成图片时调用
              if (err) {
                this.$Message.error({ content: this.$t('noSignTip') })
              }
            })
          setTimeout(() => {
            const blobs = this.base64toBlob(this.resultImg, 'image/png')
            const formData = new FormData()
            formData.append('name', this.imgData.name)
            formData.append('imgFile', blobs, 'png')
            upload(formData).then(res => {
              this.handlebillingActivate(res.data)
            })
          }, 500)
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
<style lang="less">
  .fontweigt {
    font-weight: 700;
    color: #fff;
  }
  .activationEnable {
    color: #ddd;
    .ivu-modal-body {
      height: 720px;
      overflow: auto;
      padding: 0px 40px 40px 40px;
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
  .activation {
    padding: 200px;
    background: #1a202e;
    .image {
      width: 300px;
      img {
        width: 100%;
      }
    }
    .tips {
      margin-top: 50px;
      i {
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
