<template>
  <div class="WanlinSmoke">
    <div class="theader">
      <div class="left">
        <div class="bor"></div>
        <div class="title">{{ $t('realTimeParameters') }}</div>
        <span class="ml-10" style="font-size: 15px">{{ `(${$t('updateTime1')} :${wlfindObjTime} )` }}</span>
      </div>
    </div>
    <div class="content">
      <div class="contentForm">
        <Form :label-width="120">
          <FormItem :label="$t('smokeConcentration1') + ':'">
            <template v-if="wlfindObj.smokescope">
              <span>
                {{ wlfindObj.smokescope }}
                <i>%</i>
              </span>
            </template>
            <template v-else>-</template>
          </FormItem>
          <FormItem :label="$t('temperatureChangeoFFiveMinute') + ':'">
            <template v-if="wlfindObj.temperature_before || wlfindObj.temperature">
              <span>{{ wlfindObj.temperature + '℃' }}{{ $t('to') }}{{ wlfindObj.temperature_before + '℃' }}</span>
            </template>
            <template v-else>-</template>
          </FormItem>
        </Form>
        <Form :label-width="150">
          <FormItem :label="$t('batteryVoltage') + ':'">
            <template v-if="wlfindObj.Battery_Voltage">
              <span>
                {{ wlfindObj.Battery_Voltage }}
                <i>V</i>
              </span>
            </template>
            <template v-else>-</template>
          </FormItem>
          <FormItem :label="$t('signalIntensity') + ':'">
            <div class="test">
              <template v-if="wlfindObj.signal_intensity !== undefined">
                <ul :style="{ width: config.width + 'px', height: config.height + 'px' }">
                  <li v-show="wlfindObj.signal_intensity > 0">
                    <span :class="wlfindObj.signal_intensity >= 0 && wlfindObj.signal_intensity <= 24 ? 'signal1' : wlfindObj.signal_intensity >= 24 && wlfindObj.signal_intensity <= 49 ? 'signal2' : wlfindObj.signal_intensity >= 50 && wlfindObj.signal_intensity <= 74 ? 'signal3' : 'signal4'"></span>
                  </li>
                  <li v-show="wlfindObj.signal_intensity > 24">
                    <span :class="wlfindObj.signal_intensity >= 0 && wlfindObj.signal_intensity <= 24 ? 'signal1' : wlfindObj.signal_intensity >= 24 && wlfindObj.signal_intensity <= 49 ? 'signal2' : wlfindObj.signal_intensity >= 50 && wlfindObj.signal_intensity <= 74 ? 'signal3' : 'signal4'"></span>
                  </li>
                  <li v-show="wlfindObj.signal_intensity > 50">
                    <span :class="wlfindObj.signal_intensity >= 0 && wlfindObj.signal_intensity <= 24 ? 'signal1' : wlfindObj.signal_intensity >= 24 && wlfindObj.signal_intensity <= 49 ? 'signal2' : wlfindObj.signal_intensity >= 50 && wlfindObj.signal_intensity <= 74 ? 'signal3' : 'signal4'"></span>
                  </li>
                  <li v-show="wlfindObj.signal_intensity > 75">
                    <span :class="wlfindObj.signal_intensity >= 0 && wlfindObj.signal_intensity <= 24 ? 'signal1' : wlfindObj.signal_intensity >= 24 && wlfindObj.signal_intensity <= 49 ? 'signal2' : wlfindObj.signal_intensity >= 50 && wlfindObj.signal_intensity <= 74 ? 'signal3' : 'signal4'"></span>
                  </li>
                </ul>
              </template>
              <template v-else>-</template>
            </div>
          </FormItem>
        </Form>
        <Form :label-width="200">
          <FormItem :label="$t('electricQuantity') + ':'">
            <batteryIcon :quantity="wlfindObj.Battery_level" style="width: 70px"></batteryIcon>
          </FormItem>
          <FormItem :label="$t('signalQualityRSRP') + ':'">
            <template v-if="wlfindObj.signal_quality">
              <span>{{ wlfindObj.signal_quality }}</span>
            </template>
            <template v-else>-</template>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
  import { wlfindRealParam } from '@/api/public'
  import batteryIcon from '@/components/batteryIcon/index.vue'
  export default {
    components: {
      batteryIcon,
    },
    props: {
      equipmentType: Number,
      mac: String,
    },
    data() {
      return {
        wlfindObj: {},
        wlfindObjTime: '',
        config: { width: 32, height: 22 },
      }
    },
    mounted() {
      this.handlewlfindRealParam()
    },
    methods: {
      async handlewlfindRealParam() {
        let params = {
          mac: this.mac,
          projectCode: this.$store.state.projectCode,
          equipmentType: this.equipmentType,
        }
        const res = await wlfindRealParam(params)
        if (res.success) {
          this.wlfindObjTime = res.data.updateTime
          this.wlfindObj = res.data.realData
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>
<style lang="less">
  .WanlinSmoke {
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
      ul {
        display: flex;
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
    }
  }
</style>
