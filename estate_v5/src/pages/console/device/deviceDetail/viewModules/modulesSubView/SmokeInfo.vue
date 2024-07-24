<template>
  <div id="smoke">
    <div class="header" style="width: 120%">
      <Col :span="18"></Col>
      <Col :class="orderFlag ? 'not-allowed' : ''" @click.native="handleReset">
        <Icon color="#0372e5" style="border: 1px solid; padding: 3px; border-radius: 5px" type="md-refresh" size="20" />
      </Col>
      <Col :class="datas.length > 0 ? '' : 'not-allowed'" @click.native="handleConfiguration">
        <Icon color="#0372e5" style="border: 1px solid; padding: 3px; border-radius: 5px; margin-left: 5px" custom="icon-v5 icon-v5-xitongshezhiguanliqitashezhi" size="20" />
      </Col>
    </div>
    <Col :span="24" class="attention" v-show="alarmName !== ''">
      {{ $t('alarmStatus') + ':' }}
      <span class="c-danger">{{ alarmName }}</span>
      {{ `(${$t('attentionTips1')})` }}
    </Col>
    <Row class="box-wrap">
      <Col :span="12">
        <span v-if="datas.length > 0">
          <p>{{ $t('signalIntensity') + ':' + (datas[0] ? Math.abs(datas[0].others.RSRP) : '__') }}%</p>
        </span>
      </Col>
      <Col>
        <span v-for="(item, index) in datas" :key="index">
          <Col @click="handleSwitch(item)" class="pointer grid-content" :class="item.others.alarmFlag ? 'grid-content-close' : 'grid-content-open'">
            <p>{{ $t('electricQuantity') + ':' + item.others.Level + (item.others.unit ? ' ' + item.others.unit : ' %') }}</p>
          </Col>
        </span>
      </Col>
    </Row>
    <Modal :title="$t('equipmentParameterAdjustment')" custom-class="details-dialog" :mask="false" width="800px" footer-hide v-model="equipmentFlag" @on-cancel="handleEquipmentClose">
      <SmokeConfiguration v-if="equipmentFlag"></SmokeConfiguration>
    </Modal>
  </div>
</template>
<script>
  import store from '@/store'
  import SmokeConfiguration from '@/pages/Control/SmokeConfiguration'
  import { queryForsafeChannelByMac, forsafeDeviceCommand } from '@/api/public'
  export default {
    props: {
      mac: { type: String },
    },
    data() {
      return {
        alarmName: '',
        datas: [],
        equipmentFlag: false,
        orderFlag: false,
        timer: null,
        timerID: null,
      }
    },
    created() {
      this.init()
    },
    activated() {
      this.queryNorChannel()
    },
    methods: {
      init() {
        this.queryNorChannel()
      },
      async queryNorChannel() {
        let params = { mac: this.mac }
        const res = await queryForsafeChannelByMac(params)
        if (res.success) {
          this.datas = res.data
          if (res.data.length > 0) {
            if (res.data[0].others.alarmName) {
              this.alarmName = res.data[0].others.alarmName
            }
            store.commit('smokeObj', res.data[0])
            store.commit('dateFlag', false)
          } else {
            store.commit('dateFlag', true)
            store.commit('smokeObj', [])
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleSwitch(item) {
        if (item.others.alarmName) this.alarmName = item.others.alarmName
        store.commit('smokeObj', item)
      },
      async handleReset() {
        if (this.orderFlag) return false
        let params = { mac: this.mac, cmd: 'FORSAFE_FIRERST', equipmentType: 6, data: 1 }
        const res = await forsafeDeviceCommand(params)
        if (res.success) {
          if (res.code === '0') {
            this.$Mssage.success({ content: this.$t('submitCommand') })
            this.queryNorChannel()
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleConfiguration() {
        if (this.datas.length > 0) {
          this.equipmentFlag = true
        }
      },
      handleEquipmentClose() {
        this.equipmentFlag = false
      },
    },
    components: {
      SmokeConfiguration,
    },
  }
</script>
<style lang="less" scoped>
  .box {
    padding-left: 17px;
    width: 292px;
    height: 191px;
    margin-right: 20px;
    margin-bottom: 20px;
    border-right: 2px solid #fff;
  }

  .primary-wrap {
    width: 95.5px;
    margin-bottom: 25px;
    border: 1px solid #fff;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }

  .primary-icon {
    font-size: 42px;
    text-align: center;
  }

  .primary-title {
    margin: 0 0 5px;
  }

  .attention {
    margin-bottom: 20px;
  }

  .box-wrap {
    margin: 30px;
  }

  .not-allowed {
    cursor: not-allowed;
    color: #999;
    .iconfont {
      cursor: not-allowed;
    }
  }

  .icon-yangan1 {
    font-size: 64px !important;
  }
  .header {
    height: 43px;
    border-bottom: 1px solid #5e626c;
  }
</style>
