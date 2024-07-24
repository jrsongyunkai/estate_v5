<template>
  <div id="stralsund">
    <div class="header">
      <Button class="detailsBtn ml-10" type="primary" ghost :disabled="orderFlag" @click.native="handleReset" custom-icon="icon-v5 icon-v5-qingchu" :title="$t('clear')"></Button>
      <Button class="detailsBtn ml-10" type="primary" ghost :disabled="orderFlag" :title="$t('trip')" custom-icon="icon-v5 icon-v5-guanlianduankai" @click.native="handleTrip"></Button>
      <Button class="detailsBtn ml-10" type="primary" ghost :disabled="orderFlag" :title="$t('query')" custom-icon="icon-v5 icon-v5-chaxun" @click.native="handleQuery"></Button>
      <Button class="detailsBtn ml-10" type="primary" ghost :title="$t('setting')" custom-icon="icon-v5 icon-v5-xitongshezhiguanliqitashezhi" @click.native="handleConfiguration"></Button>
    </div>
    <Row>
      <Col :span="24" class="attention" v-show="alarmName !== ''">
        {{ $t('alarmStatus') + ':' }}
        <span class="c-danger">{{ alarmName }}</span>
        {{ $t('attentionTips1') }}
      </Col>
      <Col class="box-wrap" style="margin-top: 30px">
        <Row>
          <span style="margin-bottom: 10px" v-for="(item, index) in datas" :key="index" class="box-right" @click="handleSwitch(item, index)">
            <Col @click="handleSwitch(item, index)" class="pointer" :class="item.alarmValue === 0 ? 'grid-content grid-content-open' : 'grid-content grid-content-close'">
              <span :class="item.loopType === 32 || item.loopType === 33 || item.loopType === 34 || item.loopType === 35 ? 'empty' : ''">
                <span v-show="item.loopType === 0" :title="$t('smokeLoop') + item.loopAddr">{{ $t('smokeLoop') + item.loopAddr }}：</span>
                <span v-show="item.loopType === 1" :title="$t('voltLoop') + item.loopAddr">{{ $t('voltLoop') + item.loopAddr }}：</span>
                <span v-show="item.loopType === 2">{{ $t('leakageLoop') + item.loopAddr }}：</span>
                <span v-show="item.loopType === 8" :title="$t('ampereLoop') + item.loopAddr">{{ $t('ampereLoop') + item.loopAddr }}：</span>
                <span v-show="item.loopType === 4" :title="$t('temperatureLoop') + item.loopAddr">{{ $t('temperatureLoop') + item.loopAddr }}：</span>
                <span v-show="item.loopType === 17" :title="$t('pressureLoop') + item.loopAddr">{{ $t('pressureLoop') + item.loopAddr }}：</span>
                <span v-show="item.loopType === 18" :title="$t('levelLoop') + item.loopAddr">{{ $t('levelLoop') + item.loopAddr }}：</span>
                <span v-show="item.loopType === 32" :title="$t('ratedCurrent')">{{ $t('ratedCurrent') + ':' }}</span>
                <span v-show="item.loopType === 33" :title="$t('electriDegree')">{{ $t('electriDegree') + ':' }}</span>
                <span v-show="item.loopType === 34" :title="$t('activePower')">{{ $t('activePower') + ':' }}</span>
                <span v-show="item.loopType === 35" :title="$t('powerFactor')">{{ $t('powerFactor') + ':' }}</span>
                <span v-show="item.loopType === 40" :title="$t('battery') + $t('electricityLoop') + item.loopAddr">{{ $t('battery') + $t('electricityLoop') + item.loopAddr }}：</span>
                <span v-show="item.loopType === 41" :title="$t('signalLoop') + item.loopAddr">{{ $t('signalLoop') + item.loopAddr }}：</span>
                <span v-if="item.loopType === 0">{{ item.alarmValue === 0 ? $t('normal') : $t('abnormal') }}</span>
                <span v-else-if="item.loopType === 32 || item.loopType === 33 || item.loopType === 34 || item.loopType === 35">{{ item.detectValue + item.others.unit }}</span>
                <span v-else style="width: 50px">{{ item.detectValue + '/' + item.tripUpperLimit + item.others.unit }}</span>
              </span>
            </Col>
          </span>
        </Row>
      </Col>
    </Row>
    <Modal :title="$t('equipmentParameterAdjustment')" v-model="equipmentFlag" width="800px">
      <StralsundConfiguration v-if="equipmentFlag"></StralsundConfiguration>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import store from '@/store/index'
  import StralsundConfiguration from '@/pages/Control/StralsundConfiguration'
  import { queryNorChannelByMac, strlStatusQuery, strlAlarmReset, strlTripOut } from '@/api/control'
  export default {
    components: {
      StralsundConfiguration,
    },
    props: {
      param: { type: Object, default: () => {} },
    },
    data() {
      return {
        datas: [],
        alarmName: '',
        orderFlag: false,
        equipmentFlag: false,
        index: 0,
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.queryNorChannel()
      },
      async queryNorChannel() {
        let params = { mac: this.param.mac }
        const res = await queryNorChannelByMac(params)
        if (res.success) {
          if (res.data.length > 0) {
            this.datas = res.data
            if (res.data[this.index].others.alarmName) {
              this.alarmName = res.data[this.index].others.alarmName
            } else {
              this.alarmName = ''
            }
            store.commit('stralsundObj', res.data[this.index])
            store.commit('dateFlag', false)
          } else {
            store.commit('dateFlag', true)
            store.commit('stralsundObj', [])
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleSwitch(item, index) {
        this.index = index
        if (item.others.alarmName) this.alarmName = item.others.alarmName
        store.commit('stralsundObj', item)
      },
      async handleReset() {
        if (this.orderFlag) return false
        let params = { mac: this.param.mac, cmd: 'STRL_ALARM_RESET' }
        const res = await strlAlarmReset(params)
        if (res.success) {
          if (res.code === '0') {
            this.$Message.success({ content: this.$t('submitCommand') })
            this.queryNorChannel()
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleQuery() {
        if (this.orderFlag) return false
        let params = { mac: this.param.mac, cmd: 'STRL_STATUS_QUERY' }
        const res = strlStatusQuery(params)
        if (res.success) {
          if (res.code === '0') {
            this.$Message.success({ content: this.$t('submitCommand') })
            this.queryNorChannel()
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleTrip() {
        if (this.orderFlag) return false
        let params = { mac: this.param.mac, cmd: 'STRL_TRIP_OUT' }
        this.$Modal.confirm({
          content: this.$t('tripWarning'),
          onOk: async () => {
            const res = await strlTripOut(params)
            if (res.success) {
              if (res.code === '0') {
                this.$Message.success({ content: this.$t('submitCommand') })
              }
            } else {
              this.$Message.error({ content: res.message })
            }
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('canceled') })
          },
        })
        return false
      },
      handleConfiguration() {
        if (this.$store.state.stralsundObj.dataCategory === undefined) {
          this.$Message.error({ content: this.$t('unavailable') })
          return false
        }
        store.commit('systemFlag', 'StralsundConfiguration')
        this.equipmentFlag = true
      },
      handleEquipmentClose() {
        this.equipmentFlag = false
      },
    },
  }
</script>
<style lang="less" scoped>
  #stralsund {
    .primary-wrap {
      padding: 2px;
      border: 1px solid #fff;
      border-radius: 5px;
    }
    .header {
      height: 35px;
      border-bottom: 1px solid #5e626c;
      display: flex;
      width: 100%;
      justify-content: flex-end;
    }
    .box {
      padding-left: 17px;
      width: 292px;
      height: 282px;
      margin-right: 20px;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      .tc {
        .primary-icon {
          font-size: 42px;
          text-align: center;
        }
        .primary-title {
          margin: 0 0 5px;
        }
      }
    }
    .box-wrap {
      width: 958px;
      overflow: hidden;
      .grid-content {
        width: 194px;
      }
      .box-right {
        span {
          vertical-align: middle;
          margin-left: 16px;
          display: inline-block;
        }
        .empty {
          display: block !important;
          margin: 0 !important;
          padding-top: 10px;
          max-width: 100% !important;
          text-align: center;
        }
      }
      .box-right {
        &:nth-child(1) {
          margin-top: 0;
        }
        &:nth-child(2) {
          margin-top: 0;
        }
        &:nth-child(3) {
          margin-top: 0;
        }
        &:nth-child(4) {
          margin-top: 0;
        }
      }
    }
  }
  /deep/.ivu-modal-footer {
    border-color: transparent;
  }
</style>
