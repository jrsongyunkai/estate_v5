<template>
  <div id="flammableGas">
    <Row class="theader">
      <div>
        <Button class="detailsBtn ml-10" :title="$t('clear')" @click.native="handleReset">
          <Icon color="#0372e5" custom="icon-v5 icon-v5-qingchu" size="16" />
        </Button>
        <Button class="detailsBtn ml-10" :title="$t('setting')" :class="datas.length > 0 ? '' : 'not-allowed'" @click.native="handleConfiguration">
          <Icon :class="datas.length > 0 ? '' : 'not-allowed'" @click.native="handleConfiguration" color="#0372e5" custom="icon-v5 icon-v5-xitongshezhiguanliqitashezhi" size="16" />
        </Button>
      </div>
    </Row>
    <Col :span="24" style="margin-top: 30px" class="attention" v-show="alarmName !== ''">
      {{ $t('alarmStatus') + ':' }}
      <span class="c-danger">{{ alarmName }}</span>
      {{ `(${$t('attentionTips1')})` }}
    </Col>
    <Row class="box-wrap">
      <Col :span="6" v-for="(item, index) in datas" :key="index" class="pointer grid-content" @click="handleSwitch(item)" :class="item.others.alarmFlag ? 'grid-content-close' : 'grid-content-open'">
        <span class="zh-span" @click="handleSwitch(item)">
          {{ $t('concentration') + ':' + item.others.Concn + (item.others.unit ? ' ' + item.others.unit : ' %') }}
        </span>
      </Col>
      <Col class="pointer grid-content-unavailable" v-if="datas.length > 0">
        <span class="zh-span">{{ $t('signalIntensity') + ':' + datas[0] ? Math.abs(datas[0].others.RSRP) : '__' }}%</span>
      </Col>
    </Row>
    <Modal :title="$t('equipmentParameterAdjustment')" :mask="false" width="800px" v-model="equipmentFlag" @on-cancel="handleEquipmentClose">
      <FlammableGasConfiguration v-if="equipmentFlag"></FlammableGasConfiguration>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /* global  */
  import store from '@/store'
  import FlammableGasConfiguration from '@/pages/Control/FlammableGasConfiguration'
  import { queryForsafeChannelByMac, forsafeDeviceCommand } from '@/api/public'
  export default {
    props: {
      mac: {
        type: String,
      },
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
    deactivated() {
      clearTimeout(this.timer)
      clearTimeout(this.timerID)
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
            store.commit('flammableGasObj', res.data[0])
            store.commit('dateFlag', false)
          } else {
            store.commit('dateFlag', true)
            store.commit('flammableGasObj', [])
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleSwitch(item) {
        if (item.others.alarmName) this.alarmName = item.others.alarmName
        store.commit('flammableGasObj', item)
      },
      async handleReset() {
        if (this.orderFlag) return false
        let params = { mac: this.mac, cmd: 'FORSAFE_FIRERST', equipmentType: 7, data: 1 }
        const res = await forsafeDeviceCommand(params)
        if (res.success) {
          if (res.code === '0') {
            this.$Message.success({ content: this.$t('submitCommand') })
            this.queryNorChannel()
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      liftRestrictions() {
        this.timer = setTimeout(() => {
          this.orderFlag = false
        }, 3e3)
      },
      handleConfiguration() {
        if (this.datas.length > 0) {
          this.equipmentFlag = true
        }
      },
      handleEquipmentClose() {
        this.equipmentFlag = false
      },
      setTimer(fn, delay) {
        let _this = this
        function timer() {
          _this.timerID = setTimeout(function () {
            timer()
            fn()
          }, delay)
        }
        timer()
      },
    },
    destroyed() {
      clearTimeout(this.timer)
      clearTimeout(this.timerID)
    },
    components: {
      FlammableGasConfiguration,
    },
  }
</script>
<style lang="less" scoped>
  #flammableGas .theader {
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    border-bottom: 1px solid #5e626c;
    justify-content: end;
    .ivu-btn {
      padding: 0 10px;
    }
  }
  .box {
    padding-left: 17px;
    width: 292px;
    height: 191px;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .primary-wrap {
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
    margin-top: 30px;
  }

  .box-wrap {
    margin-top: 30px;
    width: 958px;
    overflow: hidden;
  }

  .box-right {
    margin: 0 20.5px;
    display: inline-block;
    .grid-content {
      -webkit-border-radius: 5.85px;
      -moz-border-radius: 5.85px;
      border-radius: 5.85px;
    }
    .grid-content-unavailable {
      color: #999;
    }

    .grid-content-close {
      color: #f9482e;
    }
  }

  .not-allowed {
    cursor: not-allowed;
    color: #999;
    .iconfont {
      cursor: not-allowed;
    }
  }

  .flammableGas-header {
    border-bottom: 1px solid #5e626c;
  }
  #flammableGas .details-dialog {
    background-color: #0c1e32;
    position: absolute;
    top: 96px;
    left: 50%;
    margin-left: -661.5px;
    bottom: 0;
    margin-top: 0 !important;
    max-height: calc(100% - 116px);
    max-width: calc(100% - 20px);
    min-width: 1323px;
    display: flex;
    flex-direction: column;
    border: 1px solid #fff;
    .el-dialog__title,
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
      font-size: 18px;
    }
  }
  /deep/.ivu-modal-footer {
    padding: 0;
  }
</style>
