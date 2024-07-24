<template>
  <div class="info-box">
    <div class="theader">
      <div class="left">
        <div class="bor"></div>
        <span>{{ $t('realTimeParameters') }}</span>
      </div>
      <div class="right"></div>
    </div>
    <div class="content">
      <Row v-if="info">
        <Col span="12">
          <div class="item-col">
            <span>{{ $t('instantaneousFlowVelocityWaterPipes') }}:</span>
            <span>{{ info.speed || '-' }}m/s</span>
          </div>
          <div class="item-col">
            <span>{{ $t('positiveCumulativeValue') }}:</span>
            <span>{{ `${info.forwardTotal > 0 ? '+' : ''}${info.forwardTotal}` || '-' }}m³</span>
          </div>
          <div class="item-col">
            <span>{{ $t('accumulatedWaterConsumption') }}:</span>
            <span>{{ info.fullTotal || '-' }}m³</span>
          </div>
        </Col>
        <Col span="12">
          <div class="item-col">
            <span>{{ $t('instantaneousFlowRateWaterPipes') }}:</span>
            <span>{{ info.flow || '-' }}m³/h</span>
          </div>
          <div class="item-col">
            <span>{{ $t('reverseCumulativValue') }}:</span>
            <span>{{ `${info.reverseTotal > 0 ? '-' : ''}${info.reverseTotal} ` || '-' }}m³</span>
          </div>
        </Col>
      </Row>
    </div>
    <Modal :title="$t('abnormalFlowVelocityThreshold')" width="400" v-model="thresholdFlag" class="thresholdModal">
      <Form :model="thresholdFormData" :label-width="100">
        <FormItem :label="$t('flowRateAlarmUpperLimit') + ':'">
          <InputNumber class="number-value none-handler-wrap" :min="0" v-model="thresholdFormData.alarm" />
          <span class="unit">m/s</span>
        </FormItem>
        <FormItem :label="$t('flowRateAlarmUpperLimit') + ':'">
          <InputNumber class="number-value none-handler-wrap" :min="0" v-model="thresholdFormData.warn" />
          <span class="unit">m/s</span>
        </FormItem>
        <FormItem style="margin-left: 330px"></FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" style="mr-10" @click="submitThresholdForm">{{ $t('confirm') }}</Button>
        <Button type="default" @click="thresholdFlag = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { dingzhidaFlowInfo, flowAttributeQuery, flowAttributeSave } from '@/api/control/index'
  export default {
    props: {
      param: { type: Object, default: () => {} },
    },
    data() {
      return {
        others: {},
        info: {},
        thresholdFlag: false,
        thresholdFormData: { item: {}, alarm: 0, warn: 0 },
      }
    },
    methods: {
      showModel() {
        this.setflowAttribute(this.param)
      },
      async queryInfo() {
        let res = await dingzhidaFlowInfo({ mac: this.param.mac })
        if (res.success) {
          this.info = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async setflowAttribute(row) {
        this.thresholdFormData.item = row
        let res = await flowAttributeQuery({ mac: row.mac })
        if (res.success) {
          this.thresholdFlag = true
          this.thresholdFormData.alarm = (res.data && res.data.flowAlarm.alarm) || 0
          this.thresholdFormData.warn = (res.data && res.data.flowAlarm.warn) || 0
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async submitThresholdForm() {
        let res = await flowAttributeSave({ mac: this.thresholdFormData.item.mac, flowAlarm: { alarm: this.thresholdFormData.alarm, warn: this.thresholdFormData.warn } })
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.thresholdFlag = false
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.queryInfo()
    },
  }
</script>

<style lang="less" scoped>
  .info-box {
    .right-button {
      display: flex;
      align-items: center;
      span.btn {
        display: inline-block;
        height: 32px;
        padding: 0 7px;
      }
    }
    .content {
      padding: 20px;
      .item-col {
        height: 40px;
        display: flex;
        align-items: center;
        span:first-of-type {
          color: #aaa;
          display: inline-block;
          text-align: right;
          width: 120px;
          padding-right: 5px;
        }
      }
    }
  }
</style>
