<template>
  <div>
    <div class="alarm-heads">
      <div class="left ds-flx">
        <div class="mart"></div>
        <div class="title">{{ $t('realTimeParameters') }}</div>
      </div>
      <div class="right">
        <Poptip placement="bottom-start" width="250" trigger="hover" transfer>
          <div slot="content" style="padding: 10px">
            <div style="display: flex; justify-content: space-between">
              <div>{{ $t('SIMinfo') }}</div>
              <span style="color: #007eff" class="pointer" @click="init('refresh')">{{ $t('refresh') }}</span>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div style="color: #999999; text-align: right; flex: 1">{{ $t('signalValue') }}:</div>
              <div style="flex: 2; margin-left: 10px">
                <div style="display: flex" v-if="brjData.csq">
                  <div class="dis-clomn" v-for="item in signalOne" :key="'dis' + item * Math.random() * 100">
                    <div :class="signalOne.length === 1 ? 'ones-boxs re-one' : signalOne.length === 2 ? 'ones-boxs or-two' : signalOne.length === 3 ? 'ones-boxs bl-three' : signalOne.length === 4 ? 'ones-boxs gr' : ''" v-for="value in item" :key="'ones' + value * Math.random() * 10"></div>
                  </div>
                </div>
              </div>
            </div>
            <div style="display: flex">
              <div style="color: #999999; text-align: right; flex: 1">{{ $t('simId') }}：</div>
              <div style="flex: 2">{{ others.imsi || '' }}</div>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div style="color: #999999; text-align: right; flex: 1">ICCID：</div>
              <div style="flex: 2">{{ others.iccid || '-' }}</div>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div style="color: #999999; text-align: right; flex: 1">{{ $t('cardSell') }}：</div>
              <div style="flex: 2">{{ others.supplierName || '-' }}</div>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div style="color: #999999; text-align: right; flex: 1">{{ $t('packageType') }}：</div>
              <div style="flex: 2">{{ others.volumePackage || '-' }}</div>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div style="color: #999999; text-align: right; flex: 1">{{ $t('trafficUsage') }}：</div>
              <div style="flex: 2">{{ others.remainVolume || '-' }}</div>
            </div>
            <div style="display: flex; margin: 10px 0">
              <div style="color: #999999; text-align: right; flex: 1">{{ $t('expireDate') }}：</div>
              <div style="flex: 2">{{ others.expireDate || '-' }}</div>
            </div>
          </div>
          <Button type="primary" class="detailsBtn">
            <Icon color="#2d8cf0" custom="icon-v5 icon-v5-ziyuanguanli-simkaguanli"></Icon>
          </Button>
        </Poptip>
      </div>
    </div>
    <div style="margin-top: 30px; margin-left: 20px">
      <span style="color: #999999">{{ $t('softVer') }}：</span>
      <span>{{ brjData.softVer || '' }}</span>
    </div>
    <div style="display: flex; width: 500px; flex-wrap: wrap">
      <div style="flex: 1; padding-left: 22px; width: calc((100% - 60px) / 2); min-width: calc((100% - 60px) / 2); max-width: calc((100% - 60px) / 2)" v-for="(item, index) in arrBrjReturn" :key="index">
        <div style="margin-top: 20px">
          <span class="gray-title">{{ $t('loop') }}{{ index + 1 }}:</span>
          <span class="b-warning" style="padding-left: 5px" v-if="item === '0'">{{ $t('fault') }}</span>
          <span class="x-success" v-if="item === '1'">{{ $t('normal') }}</span>
          <span class="alarm-red" v-if="item === '2'">{{ $t('underreporting') }}</span>
          <span class="alarm-red" v-if="item === '3'">{{ $t('upReporting') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { cartInfo, queryBoxDetails } from '@/api/public'
  export default {
    props: {
      mac: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        comboType: '',
        useGprs: '',
        msisdn: '',
        totalGprs: '',
        icCid: '',
        dueDate: '',
        arrBrjReturn: [],
        brjData: {},
        others: {
          imsi: '-',
          iccid: '-',
          expireDate: '-',
          simUpdateDate: '-',
          address: '-',
          version: '-',
          online: '-',
          volumePackage: '-',
          remainVolume: '-',
          supplierName: '-',
          softVer: '-',
        },
      }
    },
    created() {
      this.init()
    },
    methods: {
      async getCarInfo(val) {
        let param = { mac: this.mac }
        const res = await cartInfo(param)
        if (res.success) {
          this.msisdn = res.data.msisdn
          this.comboType = res.data.comboType
          this.useGprs = res.data.useGprs
          this.totalGprs = res.data.totalGprs
          this.dueDate = res.data.dueDate
          if (val === 'refresh') {
            this.$Message.success({ content: this.$t('refreshSuccessful') })
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async init(val) {
        let params = { mac: this.mac }
        const res = await queryBoxDetails(params)
        if (res.success) {
          this.others = {
            imsi: res.data.others.brjData.imsi || res.data.others.imsi || '-',
            iccid: res.data.others.iccid || '-',
            expireDate: res.data.others.expireDate || '-',
            simUpdateDate: res.data.others.simUpdateDate || '-',
            address: res.data.others.address || '-',
            version: res.data.others.version || '-',
            online: res.data.others.online || '-',
            volumePackage: res.data.others.volumePackage || '-',
            remainVolume: res.data.others.remainVolume || '-',
            supplierName: res.data.others.supplierName || '-',
            softVer: res.data.others.softVer || '-',
          }
          this.brjData = res.data.others.brjData
          let arrBrj = this.brjData.loopAlarmStatus.split('')
          this.arrBrjReturn = arrBrj
          if (val === 'refresh') {
            this.$Message.success({ content: this.$t('refreshSuccessful') })
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    computed: {
      signalOne() {
        let signalOne = []
        if (Number(this.brjData.csq) < 25 && Number(this.brjData.csq) > 0) {
          signalOne = [2]
        } else if (Number(this.brjData.csq) < 50 && Number(this.brjData.csq) > 24) {
          signalOne = [2, 3]
        } else if (Number(this.brjData.csq) < 75 && Number(this.brjData.csq) > 49) {
          signalOne = [2, 3, 4]
        } else if (Number(this.brjData.csq) < 101 && Number(this.brjData.csq) > 74) {
          signalOne = [2, 3, 4, 5]
        }
        return signalOne
      },
    },
  }
</script>

<style lang="less">
  .dis-clomn {
    display: flex;
    flex-direction: column-reverse;
    padding-bottom: 4px;
    width: 4px;
    height: 20px;
    margin: 0 1px;
  }
  .ones-boxs {
    width: 4px;
    height: 3px;
  }
  .gr {
    background: green;
  }
  .bl-three {
    background: blue;
  }
  .or-two {
    background: orange;
  }
  .re-one {
    background: red;
  }
  .alarm-heads {
    display: flex;
    margin-top: 3px;
    justify-content: space-between;
    border-bottom: 1px solid #5e626c;
    padding-top: 2px;
    padding-bottom: 8px;
    .ds-flx {
      display: flex;
      padding-top: 5px;
    }
    .mart {
      margin: 5px 10px 5px 0px;
      width: 2px;
      height: 14px;
      background: #0372e5;
    }
  }
  .gray-title {
    color: #999999;
  }
</style>
