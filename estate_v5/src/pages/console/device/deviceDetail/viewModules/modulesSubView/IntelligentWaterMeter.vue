<template>
  <div id="IntelligentWaterMeter" style="width: 100%">
    <div class="header">
      <span style="color: gray; margin-left: 0px; float: left">{{ $t('currentIs') }}</span>
      <span>
        <span v-if="state === '0'" style="color: green; border: 1px solid; border-radius: 5px; text-align: center; font-size: 12px; width: 42px; height: 32px; line-height: 32px; padding-top: 0px; float: left">{{ $t('openValve') }}</span>
        <span v-if="state === '1'" style="color: red; border: 1px solid; border-radius: 5px; text-align: center; font-size: 12px; width: 42px; height: 32px; line-height: 32px; padding-top: 0px; float: left">{{ $t('closeValve') }}</span>
        <span v-if="state === '2'" style="color: orange; border: 1px solid; border-radius: 5px; text-align: center; font-size: 12px; width: 42px; height: 32px; line-height: 32px; padding-top: 0px; float: left">{{ $t('fault') }}</span>
      </span>
      <div style="margin-left: 10px" :class="state === '1' ? 'primary-wrap pointer' : 'box-grey primary-wrap pointer'">
        <Col :class="state === '2' ? 'disable tc' : 'tc'">
          <Icon v-if="state === '1'" @click="handelMeterReading('1')" class="icon-v5 icon-v5-hezha" size="25" color="#F24E4C" style="border: 1px solid; border-radius: 5px; width: 42px; height: 32px; line-height: 32px" />
          <Icon v-else class="icon-v5 icon-v5-hezha" size="25" color="gray" style="border: 1px solid; border-radius: 5px; width: 42px; height: 32px; line-height: 32px" />
        </Col>
      </div>
      <div style="margin-left: 10px" :class="state === '0' ? 'primary-wrap pointer' : 'box-grey primary-wrap pointer'">
        <Col :class="state === '2' ? 'disable tc' : 'tc'">
          <Icon v-if="state === '0'" @click="handelMeterReading('0')" class="icon-v5 icon-v5-fenzha" size="25" color="#21F27F" style="border: 1px solid; border-radius: 5px; width: 42px; height: 32px; line-height: 32px" />
          <Icon v-else class="icon-v5 icon-v5-fenzha" size="25" color="gray" style="border: 1px solid; border-radius: 5px; width: 42px; height: 32px; line-height: 32px" />
        </Col>
      </div>
      <div class="primary-wrap pointer" style="margin-left: 5px">
        <Col class="tc">
          <Icon @click="handleRefresh" type="md-refresh" size="25" color="#007EFF" style="border: 1px solid; border-radius: 5px; width: 42px; height: 32px; line-height: 32px" />
        </Col>
      </div>
    </div>
    <Col :span="24" class="attention" v-show="alarmName">
      {{ $t('alarmStatus') + ':' }}
      <span class="c-danger">{{ alarmName }}</span>
      {{ $t('smokeAttention') + alarmName + ',' + $t('smokeSecondAttention') }}
    </Col>
    <Col>
      <div style="margin-top: 30px">
        <span>{{ $t('accumulatedWaterConsumption') + ':' }}</span>
        <span>{{ (water ? water : '--') + $t('ton') }}</span>
      </div>
    </Col>
  </div>
</template>

<script>
  /* global  */
  import { findHuaxuChannelByMac, valveControl } from '@/api/public'
  export default {
    components: {},
    props: {
      param: {
        type: Object,
      },
    },
    data() {
      return {
        alarmName: '',
        water: '',
        state: '',
        fullscreenLoading: false,
        timer: null,
        timerID: null,
      }
    },
    created() {
      this.init()
    },
    activated() {
      this.queryFindHuaxuChannelByMac()
    },
    deactivated() {
      clearTimeout(this.timer)
      clearTimeout(this.timerID)
    },
    methods: {
      init() {
        this.queryFindHuaxuChannelByMac()
      },
      async queryFindHuaxuChannelByMac() {
        const res = await findHuaxuChannelByMac({ mac: this.param.mac })
        if (res.success) {
          this.alarmName = res.data.alarmName
          this.water = res.data.currentQuantity
          this.state = res.data.valveState
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleRefresh() {
        this.fullscreenLoading = true
        findHuaxuChannelByMac({ mac: this.param.mac })
          .then(res => {
            if (res.success) {
              this.alarmName = res.data.alarmName
              this.water = res.data.currentQuantity
              this.state = res.data.valveState
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
          .finally(() => {
            setTimeout(() => {
              this.fullscreenLoading = false
            }, 200)
          })
      },
      handelMeterReading(val) {
        if (this.state === '2') return false
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: val === '0' ? this.$t('unknown') + this.$t('closeValve') : this.$t('openValve'),
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: () => {
            let params = { mac: this.param.mac, command: val }
            valveControl(params)
              .then(res => {
                if (res.success) {
                  this.$Message.success({
                    content: res.message,
                  })
                  this.queryFindHuaxuChannelByMac()
                } else if (res.code === '-1') {
                } else {
                  this.$Message.error({ content: res.message })
                }
              })
              .catch(err => {
                if (err) {
                  this.$Message.error({ content: this.$t('unknown') })
                }
              })
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('canceled') })
          },
        })
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
    watch: {},
  }
</script>

<style lang="less" scoped>
  .box {
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    display: inline-block;
    margin-right: 35px;
    i {
      float: left;
      margin: 0 10px;
      font-size: 40px;
      line-height: 70px;
    }
  }

  .primary-wrap {
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    display: inline-block;
    .primary-icon {
      font-size: 42px;
      text-align: center;
    }

    .primary-title {
      margin: 0 0 5px;
    }
  }

  .box-border {
    height: 90px;
    margin: 0 20px;
    display: inline-block;
  }

  .block {
    display: inline-block;
    font-size: 28px;
  }

  .disable:hover {
    cursor: not-allowed;
  }

  .box-grey {
    color: #999;
  }

  .attention {
    margin-bottom: 20px;
  }
</style>
