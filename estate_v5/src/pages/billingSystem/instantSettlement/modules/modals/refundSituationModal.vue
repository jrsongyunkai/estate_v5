<template>
  <div>
    <Modal v-model="isShowModel" :title="$t('refundSituation')" class-name="tripping-modal" width="500" @on-cancel="$emit('close')">
      <Steps :current="situationCurrent" :status="situationStatus">
        <template v-if="refundNum">
          <Step :title="$t('requestRefund')" :content="refundNum.refundCreateTime"></Step>
          <template v-if="refundNum.status === 1">
            <Step :title="$t('refundProcessing')" :content="refundNum.refundCompletedTime"></Step>
          </template>
          <template v-if="refundNum.status !== 1">
            <Step :title="refundNum.status === 2 ? this.$t('refundSuccessful2') : $t('refundException')" :content="refundNum.refundCompletedTime"></Step>
          </template>
        </template>
      </Steps>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  export default {
    props: {
      record: { type: Object, default: () => {} },
    },
    data() {
      return {
        isShowModel: false,
        situationCurrent: 0,
        situationStatus: 'process',
        refundNum: null,
      }
    },
    methods: {
      getRefundStatus() {
        this.situationStatus = 'wait'
        this.refundNum = this.record
        setTimeout(() => {
          this.situationCurrent = 1
          if (this.refundNum.status === 2) {
            this.situationStatus = 'finish'
          }
          if (this.refundNum.status === 3 || this.refundNum.status === 4) {
            this.situationStatus = 'error'
          }
        }, 500)
      },
    },
    mounted() {
      this.isShowModel = true
      this.getRefundStatus()
    },
  }
</script>

<style lang="less">
  .tripping-modal {
    .ivu-steps-icon.ivu-icon {
      border-radius: 32px;
      font-size: 40px !important;
    }
    .ivu-steps-item {
      position: relative;
    }
    .ivu-steps-status-error,
    .ivu-steps-status-wait,
    .ivu-steps-status-finish {
      width: 100px;
    }

    .ivu-steps-head {
      padding-left: 30px !important;
      margin-left: 0px;
    }

    .ivu-steps-title {
      position: absolute;
      width: 100px;
      top: 100px;
      left: -58px;
      color: #fff !important;
    }
    .ivu-steps-status-process,
    .ivu-steps-status-wait {
      .ivu-steps-head-inner {
        background-color: rgba(2, 167, 240, 0.2) !important;
        border: 1px solid #02a7f0 !important;
        span {
          color: #02a7f0 !important;
        }
      }
    }
    .ivu-steps-tail {
      left: 10px !important;
    }
    .ivu-steps-content {
      position: absolute;
      text-align: center;
      padding-left: 0px;
      width: 100px;
      left: -76px;
      top: 40px;
      font-size: 14px;
      margin-top: 10px;
    }

    .ivu-steps-status-finish {
      .ivu-steps-content {
        color: #02a7f0 !important;
      }
    }
    .ivu-steps-status-error {
      color: #d9001b !important;
    }
    .ivu-steps-head-inner {
      width: 40px;
      height: 40px;
      line-height: 40px;
      background-color: transparent !important;
    }
    .ivu-icon-ios-checkmark {
      background-color: rgba(2, 167, 240, 0.2);
    }
    .ivu-steps {
      height: 150px;
    }
    .detail {
      .ivu-form-item-label {
        color: #7f7f7f;
      }
      .ivu-form-item {
        margin-bottom: 12px;
      }
    }
    .drop {
      width: 5px;
      height: 5px;
      border-radius: 5px;
      background: #fff;
      margin: 20px 5px 0px 5px;
    }
    .alarmprompt {
      color: #d9001b;
      background: rgba(207, 17, 40, 0.2);
      padding: 5px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .prompt {
      color: #f29e31;
      background: rgba(245, 154, 35, 0.2);
      padding: 5px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .ivu-modal-body {
      padding: 16px 16px 0px 16px;
    }
    .ivu-modal-footer {
      padding: 0px 18px 12px 18px;
      border-color: transparent;
    }
  }
</style>
