<template>
  <div>
    <Modal v-model="checkTelModal" :mask-closable="false" :mask="true" :closable="false" width="420">
      <p slot="header" class="text-center">
        <span>{{ $t('verifyPhoneNumber') }}</span>
      </p>
      <div class="modal-content">
        <div>{{ $t('verifyTips') }}</div>
        <div class="margin-10-0"><Input v-model="tel" readonly></Input></div>
        <div class="position margin-10-0">
          <Input v-model="checkCode" :placeholder="$t('inputVerificationCodeTip')"></Input>
          <span class="pointer blue-text position-code" @click="getCode">
            <span v-if="!isSending">{{ $t('getVerificationCode') }}</span>
            <span v-else class="gray-text-disabled">{{ sec }}秒后重新获取</span>
            <!-- <Icon v-if="isSending" type="ios-loading" size="18" class="icon-load"></Icon> -->
          </span>
        </div>
        <Button type="primary" class="w100 margin-t-20" @click="confirmLogin">{{ $t('confirmVerificationLogin') }}</Button>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import { getTelCode, verifyTelCode } from '@/api/account'
  import { reg } from '@utils/reg'
  export default {
    props: {
      checkMobile: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        reallyTel: '',
        checkCode: '',
        checkTelModal: false,
        isSending: false,
        sec: 59,
        timer: null,
      }
    },
    computed: {
      tel() {
        return this.maskPhoneNumber(this.reallyTel)
      },
    },
    watch: {
      checkMobile: {
        handler(val) {
          this.reallyTel = val
        },
        deep: true,
      },
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
    methods: {
      maskPhoneNumber(phoneNumber) {
        if (!phoneNumber) return ''
        return phoneNumber.replace(reg.phoneNumber, '$1****$2')
      },
      openModal() {
        this.checkTelModal = true
      },
      hideModal() {
        this.checkTelModal = false
      },
      async getCode() {
        if (this.isSending) return this.$Message.warning(this.$t('verificationCodeTips1'))
        this.isSending = true
        await getTelCode()
        this.sendingCode()
        // this.$Message.success(this.$t('verificationCodeTips2'))
      },
      sendingCode() {
        this.sec = 59
        this.timer = setInterval(() => {
          if (this.sec === 0) {
            clearInterval(this.timer)
            this.isSending = false
            this.sec = 59
          } else {
            if (!this.isSending) {
              this.isSending = true
            }
            this.sec--
          }
        }, 1000)
      },
      async confirmLogin() {
        const res = await verifyTelCode({ code: this.checkCode })
        if (!res.success) return this.$Message.error(this.$t('verificationCodeError'))
        this.hideModal()
        if (this.timer) {
          clearInterval(this.timer)
        }
        this.$router.replace({ path: '/loading' })
      },
    },
  }
</script>

<style lang="less" scoped>
  .icon-load {
    animation: loading 1s linear infinite;
  }
  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .text-center {
    text-align: center;
  }
  .modal-content {
    margin: 10px auto;
    padding: 10px;
  }
  .margin-t-20 {
    margin-top: 20px;
  }
  .margin-10-0 {
    margin: 10px 0;
  }
  .blue-text {
    color: #2d8cf0;
  }
  .position {
    position: relative;
  }
  .w100 {
    width: 100%;
  }
  .position-code {
    position: absolute;
    right: 10px;
    top: 5px;
  }
  .gray-text-disabled {
    color: #999;
    cursor: not-allowed;
  }
</style>
