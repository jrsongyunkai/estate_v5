<template>
  <div id="TemperatureHumiditySensor">
    <div class="Temperature-header">
      <div class="fr">
        <Select v-model="formInline.line" @on-change="handleNodeName" style="width: 200px" :clearable="false" popper-class="auto-complete" :placeholder="$t('pleaseSelect')">
          <Option v-for="item in options" :key="item.nodeId" :label="item.nodeName" :value="item.nodeId"></Option>
        </Select>
        <Button class="detailsBtn ml-10" type="primary" ghost :title="$t('setting')" @click.native="handleParameter" custom-icon="icon-v5 icon-v5-xitongshezhiguanliqitashezhi"></Button>
      </div>
    </div>
    <Row class="rowheight" style="margin-top: 30px">
      <Col :span="12">
        <p v-if="list.tem">{{ $t('temperature') }}： {{ list.tem[0] ? list.tem[0] + '℃' : '-- ℃' || '-- ℃' }}</p>
      </Col>
      <Col :span="12">
        <p v-if="list.hum">{{ $t('humidity') }}： {{ list.hum[0] ? list.hum[0] + '%RH' : '-- %RH' }}</p>
      </Col>
    </Row>
    <Row class="rowheight">
      <Col :span="12">
        <p v-if="list.tem">
          {{ $t('upperLimit') + '：' + (list.tem[1] ? list.tem[1] + '℃' : '-- ℃') }}
        </p>
      </Col>
      <Col :span="12">
        <p v-if="list.hum">
          {{ $t('upperLimit') + '：' + (list.hum[1] ? list.hum[1] + '%RH' : '-- %RH') }}
        </p>
      </Col>
    </Row>
    <Row class="rowheight">
      <Col :span="12">
        <p v-if="list.tem">
          {{ $t('lowerLimit') + '：' + (list.tem[2] ? list.tem[2] + '℃' : '-- ℃') }}
        </p>
      </Col>
      <Col :span="12">
        <p v-if="list.hum">
          {{ $t('lowerLimit') + '：' + (list.hum[2] ? list.hum[2] + '%RH' : '-- %RH') }}
        </p>
      </Col>
    </Row>
    <Modal :title="$t('equipmentParameterAdjustment')" custom-class="details-dialog" :mask="false" width="1323px" footer-hide v-model="equipmentFlag" @on-cancel="handleEquipmentClose">
      <TemperatureHumidityConfiguration v-if="equipmentFlag" :online="online" :equipmentNum="param.equipmentType"></TemperatureHumidityConfiguration>
    </Modal>
  </div>
</template>

<script>
  import store from '@/store'
  import TemperatureHumidityConfiguration from '@/pages/Control/TemperatureHumidityConfiguration'
  import { getEffectAddr, findByMacAndNode } from '@/api/public'
  export default {
    props: {
      param: { type: Object },
      online: { type: Number },
    },
    components: {
      TemperatureHumidityConfiguration,
    },
    data() {
      return {
        equipmentFlag: false,
        formInline: { line: '' },
        options: [],
        list: { hum: '', tem: '' },
      }
    },
    created() {},
    mounted() {
      this.init()
      if (this.options.length !== 0) {
        this.$nextTick(function () {
          this.setTimer(this.queryFindByMacAndNode, 3000)
        })
      }
    },
    methods: {
      init() {
        this.getAddr()
      },
      async getAddr() {
        let params = { mac: this.param.mac }
        const res = await getEffectAddr(params)
        if (res.success) {
          if (res.datas.length > 0) {
            this.formInline.line = res.datas[0].nodeName
            this.options = res.datas
            let val = res.datas[0].nodeId
            store.commit('nodeId', res.datas[0].nodeId)
            this.handleNodeName(val)
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleNodeName(val) {
        let params = { mac: this.param.mac, nodeId: val }
        const res = await findByMacAndNode(params)
        if (res.success) {
          this.list = res.data
          store.commit('nodeId', val)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryFindByMacAndNode() {
        let params = { mac: this.param.mac, nodeId: this.$store.state.nodeId }
        const res = await findByMacAndNode(params)
        if (res.success) {
          this.list = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleParameter() {
        this.equipmentFlag = true
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
      clearTimeout(this.timerID)
    },
  }
</script>

<style lang="less">
  .positive {
    color: #f24e4c;
  }
  .negative {
    color: #007eff;
  }
  .unkown {
    color: #faa553;
  }
  .stop {
    color: #999;
  }
  .ivu-poptip-body {
    padding: 0;
  }
  .poptipButon {
    width: 120px;
    height: 36px;
    background: rgba(0, 126, 255, 0.1) !important;
    border: 1px solid #007eff !important;
    border-radius: 5px;
    color: #007eff !important;
    margin: 0 0px 10px 10px;
  }
  .airpoptipContent {
    .list {
      display: flex;
      flex-wrap: wrap;
    }
    .footer {
      border-top: 2px solid #383d49;
      margin-top: 10px;
      height: 48px;
      line-height: 48px;
    }
  }
  #TemperatureHumiditySensor {
    .Temperature-header {
      height: 43px;
      border-bottom: 1px solid #5e626c;
    }
    .box {
      padding-left: 17px;
      width: 292px;
      height: 191px;
      margin-right: 20px;
      margin-bottom: 20px;
    }

    .primary-wrap {
      width: 95.5px;
      margin-bottom: 25px;
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
      width: 958px;
      overflow: hidden;
    }

    .box-right {
      span {
        vertical-align: middle;
        font-size: 22px;
        display: inline-block;
        width: calc(100% - 194px);
      }
      .zh-span {
        padding-left: 59px;
      }

      .en-span {
        padding-left: 30px;
      }

      .grid-content-unavailable {
        border: 1px solid #999;
        color: #999;
      }

      .grid-content-open {
        border: 1px solid #fff;
      }
    }

    .custom-input {
      .el-input__inner {
        margin-top: -6px;
        background-color: #0c1e32;
        color: #fff;
        font-size: 14px;
        text-align: center;
        border: none;
      }
      .el-input--mini .el-input__icon {
        line-height: 22px;
      }
    }
    .rowheight {
      height: 50px;
    }
    #TemperatureHumiditySensor .details-dialog {
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
    .fr {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
