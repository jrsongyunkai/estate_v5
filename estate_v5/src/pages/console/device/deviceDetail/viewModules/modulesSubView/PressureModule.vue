<template>
  <div id="pressure">
    <div class="header">
      <div></div>
      <div class="right">
        <Button class="detailsBtn ml-10" type="primary" ghost custom-icon="icon-v5 icon-v5-xitongshezhiguanliqitashezhi" @click.native="handleConfiguration" :title="$t('setting')"></Button>
      </div>
    </div>
    <Col style="margin-top: 15px" :span="24" class="attention" v-show="alarmName !== ''">
      {{ $t('alarmStatus') + ':' }}
      <span class="c-danger">{{ alarmName }}</span>
      <span>{{ $t('attentionTips3') }}</span>
    </Col>
    <Col class="box-wrap">
      <Row>
        <Col :span="12" @click.native="handleSwitch(datas, 'f')" class="pointer grid-content grid-content-open" :class="datas['f-alarmInfo'] ? 'grid-content-close' : ''">
          <span>
            <p style="margin-top: 20px">
              {{ $t('pressure') + ':' + (datas.F !== undefined ? datas.F + datas['f-Unit'] : '--') }}
            </p>
            <p style="margin-top: 20px">
              {{ $t('upperLimit') + ':' + (datas.FH !== undefined ? datas.FH + datas['f-Unit'] : '--') }}
            </p>
            <p style="margin-top: 20px">
              {{ $t('lowerLimit') + ':' + (datas.FL !== undefined ? datas.FL + datas['f-Unit'] : '--') }}
            </p>
          </span>
        </Col>
        <Col @click.native="handleSwitch(datas, 't')" class="pointer grid-content grid-content-open" :class="datas['t-alarmInfo'] ? 'grid-content-close' : ''">
          <span>
            <p style="margin-top: 20px">
              {{ $t('temperature') + ':' + (datas.T !== undefined ? datas.T + datas['t-Unit'] : '--') }}
            </p>
            <p style="margin-top: 20px">
              {{ $t('upperLimit') + ':' + (datas.TH !== undefined ? datas.TH + datas['t-Unit'] : '--') }}
            </p>
            <p style="margin-top: 20px">
              {{ $t('lowerLimit') + ':' + (datas.TL !== undefined ? datas.TL + datas['t-Unit'] : '--') }}
            </p>
          </span>
        </Col>
      </Row>
    </Col>
    <Modal :title="$t('equipmentParameterAdjustment')" custom-class="details-dialog" :mask="false" width="800px" height="700px" v-model="equipmentFlag" footer-hide @on-cancel="handleEquipmentClose">
      <HydrologicalConfiguration v-if="equipmentFlag" :equipmentNum="5"></HydrologicalConfiguration>
    </Modal>
  </div>
</template>
<script>
  import store from '@/store'
  import HydrologicalConfiguration from '@/pages/Control/HydrologicalConfiguration.vue'
  import { queryTlinkChannelByMac } from '@/api/public'
  export default {
    props: { mac: { type: String } },
    data() {
      return { alarmName: '', datas: [], type: 'f', equipmentFlag: false, timerID: null }
    },
    components: {
      HydrologicalConfiguration,
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
            store.commit('pressureObj', this.datas)
            this.$set(this.$store.state.pressureObj, 'type', this.type)
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
        this.$set(this.$store.state.pressureObj, 'type', type)
        store.commit('pressureObj', item)
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
    i {
      padding-left: 50px;
      display: inline-block;
      line-height: 183.4px;
      font-size: 80px;
      vertical-align: middle;
    }
  }

  .not-allowed {
    cursor: not-allowed;
    color: #999;
    .iconfont {
      cursor: not-allowed;
    }
  }

  #pressure .details-dialog {
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
  }
</style>
