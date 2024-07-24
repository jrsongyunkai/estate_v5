<template>
  <div id="EastWaterMeter">
    <div class="theader">
      <div class="left">
        <div class="bor"></div>
        <div class="title">{{ $t('realTimeParameters') }}</div>
        <span class="ml-10" style="font-size: 15px">{{ `( ${$t('updateTime1')}: ${waterMeterObj.readTime ? waterMeterObj.readTime : '-'})` }}</span>
      </div>
      <div class="right">
        <Button :class="waterMeterObj.valveStatus ? 'b-gre' : 'b-dger'" @click="handleSendOrderSwitch(waterMeterObj.valveStatus)">{{ waterMeterObj.valveStatus ? $t('forcedValveClosure') : $t('forcedValveOpen') }}</Button>
      </div>
    </div>
    <div class="content">
      <div class="prompt" v-if="waterMeterObj.batteryStatus">
        <Icon color="#f59a23" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
        {{ $t('useTips1') }}
      </div>
      <div class="contentForm">
        <Form :label-width="90">
          <FormItem :label="$t('accumulatedTraffic') + ':'">
            <template v-if="waterMeterObj.amount !== undefined">
              <span>
                {{ waterMeterObj.amount }}
                <i>
                  m
                  <sup>3</sup>
                </i>
              </span>
            </template>
            <template v-else>-</template>
            <Button size="small" class="ml-10 baseBtn" @click="handleBaseStutas">{{ $t('writeTableBase') }}</Button>
          </FormItem>
          <FormItem :label="$t('valveStatus') + ':'">
            <template v-if="waterMeterObj.valveStatus !== undefined">
              <span :class="waterMeterObj.valveStatus ? 'warn' : 'normal'">{{ waterMeterObj.valveStatus ? $t('openValve') : $t('closeValve') }}</span>
            </template>
            <template v-else>-</template>
          </FormItem>
          <FormItem :label="$t('batteryVoltage') + ':'">
            <template v-if="waterMeterObj.voltage !== undefined">
              <span>{{ waterMeterObj.voltage }}V</span>
            </template>
            <template v-else>-</template>
            <template v-if="waterMeterObj.batteryStatus !== undefined">
              <span class="ml-10" :class="waterMeterObj.batteryStatus ? 'abnormal' : 'normal'">{{ waterMeterObj.batteryStatus ? $t('lowVoltage') : $t('normal') }}</span>
            </template>
            <template v-else>-</template>
          </FormItem>
        </Form>
        <Form :label-width="140">
          <FormItem :label="$t('temperature') + ':'">
            <template v-if="waterMeterObj.temperature !== undefined">
              <span>{{ waterMeterObj.temperature }}℃</span>
            </template>
            <template v-else>-</template>
          </FormItem>
          <FormItem :label="$t('strongMagneticState') + ':'">
            <template v-if="waterMeterObj.magneticStatus !== undefined">
              <span :class="waterMeterObj.magneticStatus ? 'warn' : 'normal'">{{ waterMeterObj.magneticStatus ? $t('strongMagnetic') : $t('normal') }}</span>
            </template>
            <template v-else>-</template>
          </FormItem>
        </Form>
        <Form :label-width="160">
          <FormItem :label="$t('signalValue') + ':'">
            <div class="test">
              <template v-if="waterMeterObj.signal !== undefined">
                <ul :style="{ width: config.width + 'px', height: config.height + 'px' }">
                  <li v-show="waterMeterObj.signal > 0">
                    <span :class="waterMeterObj.signal >= 0 && waterMeterObj.signal <= 24 ? 'signal1' : waterMeterObj.signal >= 24 && waterMeterObj.signal <= 49 ? 'signal2' : waterMeterObj.signal >= 50 && waterMeterObj.signal <= 74 ? 'signal3' : 'signal4'"></span>
                  </li>
                  <li v-show="waterMeterObj.signal > 24">
                    <span :class="waterMeterObj.signal >= 0 && waterMeterObj.signal <= 24 ? 'signal1' : waterMeterObj.signal >= 24 && waterMeterObj.signal <= 49 ? 'signal2' : waterMeterObj.signal >= 50 && waterMeterObj.signal <= 74 ? 'signal3' : 'signal4'"></span>
                  </li>
                  <li v-show="waterMeterObj.signal > 50">
                    <span :class="waterMeterObj.signal >= 0 && waterMeterObj.signal <= 24 ? 'signal1' : waterMeterObj.signal >= 24 && waterMeterObj.signal <= 49 ? 'signal2' : waterMeterObj.signal >= 50 && waterMeterObj.signal <= 74 ? 'signal3' : 'signal4'"></span>
                  </li>
                  <li v-show="waterMeterObj.signal > 75">
                    <span :class="waterMeterObj.signal >= 0 && waterMeterObj.signal <= 24 ? 'signal1' : waterMeterObj.signal >= 24 && waterMeterObj.signal <= 49 ? 'signal2' : waterMeterObj.signal >= 50 && waterMeterObj.signal <= 74 ? 'signal3' : 'signal4'"></span>
                  </li>
                </ul>
              </template>
              <template v-else>-</template>
            </div>
          </FormItem>
          <FormItem :label="$t('faultStatus') + ':'">
            <template v-if="waterMeterObj.faultStatus !== undefined">
              <span :class="waterMeterObj.faultStatus ? 'abnormal' : 'normal'">{{ waterMeterObj.faultStatus ? $t('fault') : $t('normal') }}</span>
            </template>
            <template v-else>-</template>
          </FormItem>
        </Form>
      </div>
    </div>
    <Modal v-model="baseStutas" :title="$t('writeTableBase')" class-name="baseconfiguration" width="450">
      <Form :label-width="80">
        <FormItem :label="$t('writeTableBase') + ':'">
          <div style="position: relative; width: 100%">
            <div style="position: relative">
              <el-input v-model="baseValue" @input="limitInput($event)"></el-input>
              <!-- <InputNumber  v-model="baseValue"  :precision="2" :active-change="false" :max="65535" :min="0"></InputNumber> -->
              <i style="position: absolute; right: 16px; top: 2px; color: #808695">
                m
                <sub style="position: absolute; top: 10px">3</sub>
              </i>
            </div>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="baseSure" @click="handleSendOrder('1')">{{ $t('confirm2') }}</Button>
        <Button @click="handlecancle" class="baseCancle">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal v-model="orderSwitch" :title="$t('actionTip')">
      <p>{{ content }}</p>
      <div slot="footer">
        <Button @click="handleSendOrder('0', waterMeterObj.valveStatus)" type="primary">{{ $t('yes') }}</Button>
        <Button @click="orderSwitch = false">{{ $t('no') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { lqfindRealParam, sendOrder } from '@/api/public'
  export default {
    props: {
      equipmentType: Number,
      mac: String,
    },
    data() {
      return {
        config: {
          width: 32,
          height: 22,
        },
        baseStutas: false,
        baseValue: 0,
        waterMeterObj: {},
        content: '',
        orderSwitch: false,
      }
    },
    mounted() {
      this.handlelqfindRealParam()
    },
    watch: {
      baseValue: {
        handler(newVal) {
          if (newVal > 65535) {
            this.baseValue = 65535
          }
        },
      },
    },
    methods: {
      limitInput(value, name) {
        this.baseValue =
          ('' + value) // 第一步：转成字符串
            // eslint-disable-next-line no-useless-escape
            .replace(/[^\d^\.]+/g, '') // 第二步：把不是数字，不是小数点的过滤掉
            .replace(/^0+(\d)/, '$1') // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
            .replace(/^\./, '0.') // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
            .match(/^\d*(\.?\d{0,2})/g)[0] || '' // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
      },
      handlelqfindRealParam() {
        let params = {
          mac: this.mac,
          projectCode: this.$store.state.projectCode,
          equipmentType: this.equipmentType,
        }
        lqfindRealParam(params).then(res => {
          if (res.success) {
            this.waterMeterObj = res.data
            this.baseValue = this.waterMeterObj.amount
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleSendOrderSwitch(value) {
        this.content = value ? this.$t('sureForceValveClose') : this.$t('sureForceValveOpen')
        this.orderSwitch = true
      },
      async handleSendOrder(type, value) {
        let params = {
          mac: this.mac,
          type: type,
          value: type === '1' ? this.baseValue : value === 0 ? '1' : '0',
        }
        const res = await sendOrder(params)
        if (res.success) {
          this.baseStutas = false
          this.orderSwitch = false
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handlecancle() {
        this.baseStutas = false
      },
      handleBaseStutas() {
        this.baseStutas = true
      },
    },
  }
</script>
<style lang="less">
  // #21f27f
  .baseconfiguration {
    .el-input__inner {
      background: transparent;
      border: 1px solid #727886;
      height: 32px;
      line-height: 32px;
      color: #fff;
    }
    .ivu-modal-footer {
      border-top: transparent;
      padding: 0px 18px 12px 0px;
      text-align: right;
    }
    .ivu-input-number-handler-wrap {
      display: none;
    }
    .ivu-input-number {
      width: 100%;
    }
    .baseSure {
      border: 1px solid #02a7f0;
      border-radius: 5px;
      color: #02a7f0;
      background: rgba(2, 167, 240, 0.1);
      padding: 2px 20px;
    }
    .baseCancle {
      border: 1px solid #aaaaaa;
      border-radius: 5px;
      color: #aaaaaa;
      background: rgba(170, 170, 170, 0.1);
      padding: 2px 20px;
    }
  }
  #EastWaterMeter {
    ul {
      display: flex;
      //   justify-content: space-around;
      overflow: hidden;
      list-style: none;
      li {
        width: 12%;
        background: rgba(0, 0, 0, 0.5);
        position: relative;
        margin-right: 2px;
        span {
          position: absolute;
          top: 0;
          left: 0;
          display: inline-block;
          width: 100%;
          height: 100%;
          border-radius: 1px;
        }
        &:nth-child(1) {
          height: 8px;
          margin-top: 14px;
        }
        &:nth-child(2) {
          height: 12px;
          margin-top: 12px;
        }
        &:nth-child(3) {
          height: 14px;
          margin-top: 10px;
        }
        &:nth-child(4) {
          height: 16px;
          margin-top: 8px;
        }
      }
    }
    .signal1 {
      background: #a9172c;
    }
    .signal2 {
      background: #d38724;
    }
    .signal3 {
      background: #02a7f0;
    }
    .signal4 {
      background: #70b603;
    }
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
    .content {
      margin-top: 10px;
      .contentForm {
        display: flex;
        margin-top: 20px;
      }
      .prompt {
        color: #f29e31;
        background: rgba(245, 154, 35, 0.2);
        padding: 5px;
        border-radius: 5px;
      }

      .ivu-form-item {
        margin-bottom: 16px;
      }
      .ivu-form-item-label {
        color: #8e9095 !important;
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
      .abnormal {
        color: #d38724;
        background: rgba(229, 115, 41, 0.2);
        padding: 2px 6px;
        font-size: 12px;
        border-radius: 3px;
      }
      .status1 {
        color: #d38724;
      }
      .status2 {
        color: #d9001b;
      }
      .open {
        padding: 2px 6px;
        color: #02a7f0;
        font-size: 12px;
        border-radius: 3px;
        background: rgba(2, 167, 240, 0.2);
      }
      .baseBtn {
        border: 1px solid #02a7f0;
        border-radius: 5px;
        color: #02a7f0;
        background: rgba(2, 167, 240, 0.1);
      }
    }
  }
</style>
