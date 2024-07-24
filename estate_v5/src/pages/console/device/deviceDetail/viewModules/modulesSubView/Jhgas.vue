<template>
  <div id="jhgas">
    <div class="theader">
      <div class="left">
        <div class="bor"></div>
        <div class="title">{{ $t('realTimeParameters') }}</div>
      </div>
      <div class="right">
        <Poptip :title="$t('simInfo1')" placement="bottom" transfer-class-name="jhwaterSim" width="280" :transfer="true">
          <Button class="detailsBtn ml-10" type="primary" ghost custom-icon="icon-v5 icon-v5-ziyuanguanli-simkaguanli" :title="$t('simInfo1')"></Button>
          <div slot="content">
            <Form :label-width="120">
              <FormItem :label="$t('signalValue') + ':'">
                <div class="test">
                  <ul :style="{ width: config.width + 'px', height: config.height + 'px' }">
                    <li v-show="csq > 0"><span :class="csq >= 0 && csq <= 24 ? 'signal1' : csq >= 24 && csq <= 49 ? 'signal2' : csq >= 50 && csq <= 74 ? 'signal3' : 'signal4'"></span></li>
                    <li v-show="csq > 24"><span :class="csq >= 0 && csq <= 24 ? 'signal1' : csq >= 24 && csq <= 49 ? 'signal2' : csq >= 50 && csq <= 74 ? 'signal3' : 'signal4'"></span></li>
                    <li v-show="csq > 50"><span :class="csq >= 0 && csq <= 24 ? 'signal1' : csq >= 24 && csq <= 49 ? 'signal2' : csq >= 50 && csq <= 74 ? 'signal3' : 'signal4'"></span></li>
                    <li v-show="csq > 75"><span :class="csq >= 0 && csq <= 24 ? 'signal1' : csq >= 24 && csq <= 49 ? 'signal2' : csq >= 50 && csq <= 74 ? 'signal3' : 'signal4'"></span></li>
                  </ul>
                </div>
              </FormItem>
              <FormItem :label="$t('simId') + ':'">
                <span>{{ gasData.imsi }}</span>
              </FormItem>
              <FormItem label="ICCID:">
                <span>{{ others.iccid }}</span>
              </FormItem>
              <FormItem :label="$t('cardSell') + ':'">
                <span>{{ others.supplierName }}</span>
              </FormItem>
              <FormItem :label="$t('packageType') + ':'">
                <span>{{ others.volumePackage }}</span>
              </FormItem>
              <FormItem :label="$t('trafficUsage') + ':'">
                <span>{{ others.remainVolume }}</span>
              </FormItem>
              <FormItem :label="$t('expireDate') + ':'">
                <span>{{ others.expireDate }}</span>
              </FormItem>
            </Form>
          </div>
        </Poptip>
      </div>
    </div>
    <div class="content">
      <Form :label-width="120">
        <FormItem :label="$t('softVer') + ':'">
          <span>{{ gasData.softVer }}</span>
        </FormItem>
      </Form>
    </div>

    <div class="content">
      <Form :label-width="120">
        <FormItem :label="$t('methaneState') + ':'">
          <span :class="gasData.methaneStatus === '1' ? 'normal' : 'warn'">{{ gasData.methaneStatus === '1' ? $t('normal') : $t('alarm') }}</span>
        </FormItem>
        <FormItem :label="$t('silenceState') + ':'">
          <span :class="gasData.muteStatus === '0' ? 'abnormal' : 'normal'">{{ gasData.muteStatus === '0' ? $t('unexecuted') : $t('executed') }}</span>
        </FormItem>
        <FormItem :label="$t('valveStatus') + ':'">
          <span :class="gasData.remoteSwitchStatus === '0' ? 'abnormal' : 'normal'">{{ gasData.remoteSwitchStatus === '0' ? $t('unexecuted') : $t('executed') }}</span>
        </FormItem>
      </Form>
      <Form :label-width="300">
        <FormItem :label="$t('methaneConcentration1') + ':'">
          <span>{{ gasData.methaneValue }}%</span>
        </FormItem>
        <FormItem :label="$t('mechanicalArmStatus') + ':'">
          <span :class="gasData.manipulatorStatus === '0' ? 'abnormal' : 'normal'">{{ gasData.manipulatorStatus === '0' ? $t('unexecuted') : $t('executed') }}</span>
        </FormItem>
        <FormItem :label="$t('deviceSelfCheck') + ':'">
          <span :class="gasData.selfCheckStatus === '0' ? 'abnormal' : 'normal'">{{ gasData.selfCheckStatus === '0' ? $t('unexecuted') : $t('executed') }}</span>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      equipmentType: Number,
      mac: String,
    },
    data() {
      return {
        config: { width: 32, height: 22 },
        gasData: '',
        csq: 0,
        others: '',
      }
    },
    mounted() {
      setTimeout(() => {
        this.handlequeryBoxDetails()
      }, 1000)
    },
    methods: {
      handlequeryBoxDetails() {
        this.gasData = this.$store.state.simObj.brjData
        this.csq = Number(this.$store.state.simObj.brjData.csq)
        this.others = this.$store.state.simObj
      },
    },
    watch: {
      '$store.state.simObj': {
        handler(newVal) {
          if (newVal) {
            this.handlequeryBoxDetails()
          }
        },
      },
    },
  }
</script>
<style lang="less">
  #jhgas {
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
          margin: 0 4px;
          border-radius: 5px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;

          position: relative;
        }
      }
    }
    .content {
      display: flex;
      margin-top: 10px;
      .ivu-form-item {
        margin-bottom: 2px;
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
        color: #c93425;
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
        color: #a9172c;
      }
    }
  }
</style>
