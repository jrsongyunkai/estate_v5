<template>
  <div id="IlluminanceSensing">
    <div class="header" style="justify-content: end">
      <Select v-model="formInline.line" @on-change="handleNodeName" style="width: 200px" :clearable="false" :placeholder="$t('pleaseSelect')">
        <Option v-for="item in options" :key="item.nodeId" :label="item.nodeName" :value="item.nodeId"></Option>
      </Select>
      <Button class="detailsBtn ml-10" type="primary" ghost :title="$t('setting')" @click.native="handleParameter" custom-icon="icon-v5 icon-v5-xitongshezhiguanliqitashezhi"></Button>
    </div>
    <Col v-if="list.tem">
      <p class="content">{{ $t('illuminationCelsius') + ':' + (list.tem[0] ? list.tem[0] + 'Lux' : '--Lux') }}</p>
      <p class="content">{{ $t('upperLimit') + ':' + (list.tem[1] ? list.tem[1] + 'Lux' : '-- Lux') }}</p>
      <p class="content">{{ $t('lowerLimit') + ':' + (list.tem[2] ? list.tem[2] + 'Lux' : '-- Lux') }}</p>
    </Col>
    <Modal :title="$t('equipmentParameterAdjustment')" custom-class="details-dialog" :mask="false" width="1323px" v-model="equipmentFlag" @on-cancel="handleEquipmentClose">
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
        options: {},
        list: {},
      }
    },
    created() {},
    mounted() {
      this.init()
      this.$nextTick(function () {
        this.setTimer(this.queryFindByMacAndNode(), 3000)
      })
    },
    methods: {
      init() {
        this.getAddr()
      },
      async getAddr() {
        let params = { mac: this.param.mac }
        const res = await getEffectAddr(params)
        if (res.code === '0') {
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
    watch: {},
    destroyed() {
      clearTimeout(this.timerID)
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
  }

  .content {
    margin: 13px;
    padding: 13px;
  }
  .primary-icon {
    font-size: 42px;
    text-align: center;
  }

  .primary-title {
    margin: 0 0 5px;
  }

  .box-wrap {
    width: 958px;
    overflow: hidden;
  }

  .box-right {
    margin: 0 20.5px;
    display: inline-block;
    .grid-content {
      width: 908px;
      height: 183.4px;
      -webkit-border-radius: 5.85px;
      -moz-border-radius: 5.85px;
      border-radius: 5.85px;
    }
  }

  #IlluminanceSensing .details-dialog {
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
  }
</style>
