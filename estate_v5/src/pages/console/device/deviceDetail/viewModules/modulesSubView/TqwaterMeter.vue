<template>
  <div class="tqWatermeter">
    <div class="theader">
      <div class="left">
        <div class="bor"></div>
        <div class="title">{{ $t('realTimeParameters') }}</div>
      </div>
      <div class="right">
        <Button class="b-blue" @click="handlechtqdqwaterRead">{{ $t('meterReading') }}</Button>
        <Button class="ml-10 b-blue" @click="handlechtqdqreset">{{ $t('clearZero') }}</Button>
        <Button class="ml-10 b-gre" @click="handlechtqdqwaterValveOnOrOff('On')">{{ $t('openValve') }}</Button>
        <Button class="ml-10 b-dger" @click="handlechtqdqwaterValveOnOrOff('Off')">{{ $t('closeValve') }}</Button>
      </div>
    </div>
    <div class="content">
      <div class="contentForm">
        <Form :label-width="180">
          <Row>
            <Col :lg="12" :xxl="8">
              <FormItem :label="$t('totalUsage1') + ':'">
                <span class="value">{{ realParam.totalConsumption ? realParam.totalConsumption : '-' }}</span>
              </FormItem>
            </Col>
            <Col :lg="12" :xxl="8">
              <FormItem :label="$t('settlementCycleUsage1') + ':'">
                <span class="value">{{ realParam.billingCycleUsage ? realParam.billingCycleUsage : '-' }}</span>
              </FormItem>
            </Col>
            <Col :lg="12" :xxl="8">
              <FormItem :label="$t('valveStatus') + ':'">
                <span class="value" :class="realParam.valveStatus ? (realParam.valveStatus === 'Off' ? 'warn' : 'normal') : ''">{{ realParam.valveStatus ? (realParam.valveStatus === 'Off' ? 'OFF' : 'ON') : '-' }}</span>
              </FormItem>
            </Col>
            <Col :lg="12" :xxl="8">
              <FormItem :label="$t('totalRecharge') + ':'">
                <span class="value">{{ realParam.totalTopUp ? realParam.totalTopUp : '-' }}</span>
              </FormItem>
            </Col>
            <Col :lg="12" :xxl="8">
              <FormItem :label="$t('remainingAmount1') + ':'">
                <span class="value">{{ realParam.balance ? realParam.balance : '-' }}</span>
              </FormItem>
            </Col>
            <Col :lg="12" :xxl="8">
              <FormItem :label="$t('voltage') + ':'">
                <span class="value">{{ realParam.voltage ? realParam.voltage : '-' }}</span>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
  import { tqWaterMeterRealParam, chtqdqwaterRead, chtqdqwaterValveOnOrOff, chtqdqreset } from '@/api/public'
  export default {
    props: {
      equipmentType: Number,
      mac: String,
    },
    data() {
      return {
        realParam: {},
        openValueStatus: '',
      }
    },
    mounted() {
      this.handletqWaterMeterRealParam()
    },
    methods: {
      handlechtqdqwaterRead() {
        let params = { cid: this.mac, address: this.mac, model: '17501' }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: '<div>' + this.$t('surePerformMeterReading') + '？</div>',
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            const res = await chtqdqwaterRead(params)
            if (res.success) {
              this.$Message.success({ content: res.message })
            } else {
              this.$Message.error({ content: res.message })
            }
          },
        })
      },
      handlechtqdqwaterValveOnOrOff(type) {
        let params = { cid: this.mac, address: this.mac, type: type === 'Off' ? '53' : '43' }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: `<div>${this.$t('sureExecute')} ${type === 'Off' ? this.$t('closeValve') : this.$t('openValve')}？</div>`,
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            const res = await chtqdqwaterValveOnOrOff(params)
            if (res.success) {
              this.$Message.success({ content: res.message })
            } else {
              this.$Message.error({ content: res.message })
            }
          },
        })
      },
      handlechtqdqreset() {
        let params = { cid: this.mac, address: this.mac }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: `<div>${this.$t('areYouSureYouWantToPerformZeroing')}</div>`,
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            const res = await chtqdqreset(params)
            if (res.success) {
              this.$Message.success({ content: res.message })
            } else {
              this.$Message.error({ content: res.message })
            }
          },
        })
      },
      async handletqWaterMeterRealParam() {
        let params = { cid: this.mac, types: '42' }
        const res = await tqWaterMeterRealParam(params)
        if (res.success) {
          this.realParam = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>
<style lang="less">
  .tqWatermeter {
    .theader {
      .theader {
        display: flex;
        align-items: center;
        padding-bottom: 10px;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        border-bottom: 1px solid #5e626c;
        .right {
          Button {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            position: relative;
          }
        }
      }
    }
    .content {
      margin-top: 10px;
      .contentForm {
        display: flex;
        margin-top: 20px;
      }
      .ivu-form-item {
        margin-bottom: 16px;
      }
      .ivu-form-item-label {
        color: #8e9095 !important;
      }
      .value {
        white-space: nowrap;
      }
      .normal {
        background: rgba(112, 182, 3, 0.2);
        padding: 2px 6px;
        font-size: 12px;
        border-radius: 3px;
        color: #70b603;
      }
      .warn {
        color: #d9001b;
        background: rgba(216, 53, 36, 0.2);
        padding: 2px 6px;
        font-size: 12px;
        border-radius: 3px;
      }
    }
  }
</style>
