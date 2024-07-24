<template>
  <div class="level-content">
    <div class="header">
      <div class="left"></div>
      <div class="right">
        <Button class="detailsBtn ml-10" type="primary" ghost custom-icon="icon-v5 icon-v5-xitongshezhiguanliqitashezhi" :title="$t('setting')" @click.native="handleConfiguration"></Button>
      </div>
    </div>
    <Row>
      <Col style="margin-top: 15px" v-show="alarmName.length > 0" :span="8">
        <div style="display: flex">
          {{ $t('alarmStatus') + ':' }}
          <div class="c-danger">&nbsp; &nbsp;{{ alarmName }}</div>
        </div>
      </Col>
      <Col style="margin-top: 15px">{{ `(${$t('attentionTips2')})` }}</Col>
    </Row>
    <Row style="margin-top: 10px">
      <Col :span="12" @click.native="handleSwitch(datas, 'f')" :class="datas['f-alarmInfo'] ? 'grid-content-close' : ''">
        <Col>
          <div style="margin-top: 10px"></div>
          {{ $t('liquidLevel') + ':' + (datas.F !== undefined ? datas.F + datas['f-Unit'] : '--') }}
        </Col>
        <Col>
          <div style="margin-top: 10px"></div>
          {{ $t('upperLimit') + ':' + (datas.F !== undefined ? datas.FH + datas['f-Unit'] : '--') }}
        </Col>
        <Col>
          <div style="margin-top: 10px"></div>
          {{ $t('lowerLimit') + ':' + (datas.F !== undefined ? datas.FL + datas['f-Unit'] : '--') }}
        </Col>
      </Col>
      <Col @click.native="handleSwitch(datas, 't')">
        <Col>
          <div style="margin-top: 10px"></div>
          {{ $t('temperature') + ':' + (datas.T !== undefined ? datas.T + datas['t-Unit'] : '--') }}
        </Col>
        <Col>
          <div style="margin-top: 10px"></div>
          {{ $t('upperLimit') + ':' + (datas.T !== undefined ? datas.TH + datas['t-Unit'] : '--') }}
        </Col>
        <Col>
          <div style="margin-top: 10px"></div>
          {{ $t('lowerLimit') + ':' + (datas.T !== undefined ? datas.TL + datas['t-Unit'] : '--') }}
        </Col>
      </Col>
    </Row>
    <Modal :title="$t('equipmentParameterAdjustment')" custom-class="details-dialog" :mask="false" width="800px" v-model="equipmentFlag" footer-hide @on-cancel="handleEquipmentClose">
      <HydrologicalConfiguration v-if="equipmentFlag" :equipmentNum="4"></HydrologicalConfiguration>
    </Modal>
  </div>
</template>
<script>
  import store from '@/store'
  import HydrologicalConfiguration from '@/pages/Control/HydrologicalConfiguration'
  import { queryTlinkChannelByMac } from '@/api/public'
  export default {
    components: {
      HydrologicalConfiguration,
    },
    props: {
      mac: { type: String },
    },
    data() {
      return {
        alarmName: '',
        equipmentFlag: false,
        datas: [],
        type: 'f',
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
        const res = await queryTlinkChannelByMac(params)
        if (res.success) {
          if (JSON.stringify(res.data) !== '{}') {
            this.datas = res.data
            if (res.data['f-alarmInfo'] !== '') {
              this.alarmName = res.data['f-alarmInfo']
            }
            store.commit('levelObj', this.datas)
            this.$set(this.$store.state.levelObj, 'type', this.type)
            store.commit('dateFlag', false)
          } else {
            this.datas = {}
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleSwitch(item, type) {
        if (!item.mac) return false
        this.type = type
        if (type === 't') {
          this.alarmName = item['t-alarmInfo']
        } else {
          this.alarmName = item['f-alarmInfo']
        }
        this.$set(this.$store.state.levelObj, 'type', type)
        store.commit('levelObj', item)
      },
      handleConfiguration() {
        this.equipmentFlag = true
      },
      handleEquipmentClose() {
        this.equipmentFlag = false
      },
    },
  }
</script>
<style lang="less" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  .grid-content {
    width: 431px;
    height: 183.4px;
    -webkit-border-radius: 5.85px;
    -moz-border-radius: 5.85px;
    border-radius: 5.85px;
  }

  span {
    vertical-align: middle;
    padding-left: 59px;
    font-size: 22px;
    display: inline-block;
    width: calc(100% - 194px);
  }

  .grid-content-open {
    border: 1px solid #fff;
  }
  .grid-content-close {
    // border: 1px solid #f9482e;
    color: #f9482e;
  }

  .not-allowed {
    cursor: not-allowed;
    color: #999;
  }

  .iconfont {
    cursor: not-allowed;
  }

  #level .details-dialog {
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
  }

  .el-dialog__title,
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
    font-size: 18px;
  }

  .el-dialog__header {
    padding: 14px 17px 0;
    height: 19px;
  }

  .el-dialog__body {
    color: #fff;
    padding: 0 17px;
    overflow: auto;
    overflow-y: hidden;
  }

  .el-dialog__headerbtn {
    top: 10px;
    right: 5px;
  }
</style>
