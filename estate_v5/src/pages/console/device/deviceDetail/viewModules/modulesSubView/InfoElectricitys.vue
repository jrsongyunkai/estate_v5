<template>
  <div id="info">
    <div class="theader">
      <div class="left">
        <div class="bor"></div>
        <span>{{ $t('baseInfo') }}</span>
      </div>
      <div class="right" style="display: flex">
        <Button class="detailsBtn" type="primary" ghost style="margin-right: 10px" :title="$t('update')" @click="handelMeterReading"><Icon custom="icon-v5 icon-v5-banshou"></Icon></Button>
        <Upload class="upload" ref="upload" :action="uploadUrl" :name="imgData.name" :data="imgData" :on-success="handleSuccess" :before-upload="beforeUpload" @mouseover.native="flag = true" :show-upload-list="false" :format="['jpg', 'jpeg', 'png']" :max-size="2048" multiple>
          <Button class="detailsBtn" type="primary" ghost><Icon custom="icon-v5 icon-v5-upload-images"></Icon></Button>
        </Upload>
        <Poptip placement="bottom-start" trigger="hover" v-if="others.imsi" transfer>
          <Button class="detailsBtn" type="primary" ghost><Icon custom="icon-v5 icon-v5-ziyuanguanli-simkaguanli"></Icon></Button>
          <div slot="content">
            <Row style="display: flex; align-items: center">
              <Col :span="21">SIM{{ $t('information') }}</Col>
              <Col :span="3">
                <span style="color: #007eff" @click="simRefresh">{{ $t('refresh') }}</span>
              </Col>
            </Row>
            <Form :label-width="90">
              <FormItem :label="$t('simId') + ':' + '\xa0\xa0'">
                <span>{{ others.imsi }}</span>
              </FormItem>
              <FormItem :label="'ICCID' + ':' + '\xa0\xa0'">
                <span>{{ others.iccid || '-' }}</span>
              </FormItem>
              <FormItem :label="$t('cardSell') + ':' + '\xa0\xa0'">
                <span>{{ others.supplierName }}</span>
              </FormItem>
              <FormItem :label="$t('packageType') + ':' + '\xa0\xa0'">
                <span v-if="others.volumePackage">{{ others.volumePackage }}</span>
              </FormItem>
              <FormItem :label="$t('trafficUsage') + ':' + '\xa0\xa0'">
                <span v-if="others.remainVolume.indexOf('null') < 0">{{ others.remainVolume }}</span>
              </FormItem>
              <FormItem :label="$t('expireDate') + ':' + '\xa0\xa0'">
                <span v-if="others.expireDate">{{ others.expireDate }}</span>
              </FormItem>
            </Form>
          </div>
        </Poptip>
      </div>
    </div>
    <div class="content">
      <div class="avat-image" style="margin-right: 40px">
        <div v-show="picShow"><img src="@/assets/images/picloading.jpg" alt="" /></div>
        <div v-show="!picShow" class="avat">
          <Avatar fit="cover" shape="square" @mouseover.native="flag = true" @mouseout.native="flag = false" :src="url" style="width: 140px; height: 140px; border: 1px solid #485661" :preview-src-list="srcList" />
          <span v-show="onlineStatus === 1" class="c-success pa bg1">{{ $t('online') }}</span>
          <span v-show="onlineStatus === 0">
            <span class="c-danger pa bg2">{{ $t('offline') }}</span>
          </span>
          <span v-show="onlineStatus === -1" class="c-info pa bg3">{{ $t('disconnected') }}</span>
        </div>
      </div>
      <Row class="rowH">
        <Col :lg="12" :xxl="6">
          <div class="detail">
            <Poptip
              :transfer="true"
              trigger="click"
              v-model="aliasFlag"
              width="250"
              @on-popper-hide="
                aliasFlag = false
                aliasName = $store.state.aliasName
              ">
              <div class="devic point" @mouseenter="iconShow = true" @mouseleave="iconShow = false">
                <span class="c9">{{ $t('deviceAliases') }}:</span>
                <span class="num">{{ aliasName }}</span>
                <span v-show="iconShow">
                  <Icon type="md-create" />
                </span>
              </div>
              <div style="text-align: right" slot="content">
                <Button type="primary" @click="handleInfo(mac, aliasName, 'alias')" style="margin-right: 5px">{{ $t('confirm') }}</Button>
                <Button
                  style="color: #858586"
                  @click="
                    aliasName = $store.state.aliasName
                    aliasFlag = false
                  ">
                  {{ $t('cancel') }}
                </Button>
              </div>
              <div slot="title" @mouseover="aliasIndex = mac" @mouseout="aliasIndex = -1" class="pointer pRelative">
                <div class="ellipsis">
                  <Input class="input" maxlength="20" show-word-limit v-model.trim="aliasName" :placeholder="$t('enterDeviceAlias')"></Input>
                </div>
              </div>
            </Poptip>
          </div>
          <div class="detail">
            <span class="c9">{{ $t('version') }}:</span>
            <span class="ml-20 num" v-show="others.version !== undefined">{{ others.version }}</span>
          </div>
          <div class="detail">
            <span class="c9">{{ $t('equipmentNo') }}:</span>
            <span class="ml-20 num">{{ info.mac }}</span>
          </div>
          <div class="detail">
            <span class="c9">{{ $t('position') }}:</span>
            <div class="num">
              <div class="dev-position">
                <div class="text-val" v-textRoll>{{ `${info.boxAddress || ''}${info.build || ''}${info.unit || ''}${info.room || ''}` }}</div>
                <span class="icon-right"><i class="icon-v5 icon-v5-bianji" @click="editDeviceModal"></i></span>
              </div>
            </div>
          </div>
        </Col>
        <Col :lg="12" :xxl="6">
          <div class="detail">
            <Poptip
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="linkmanFlag"
              :transfer="true"
              @on-popper-hide="
                linkmanFlag = false
                linkman = info.linkman
              ">
              <div class="devic" @mouseenter="iconOneShow = true" @mouseleave="iconOneShow = false">
                <span class="c9">{{ $t('contacts') }}1:</span>
                <span class="num">{{ info.linkman !== undefined ? info.linkman : '' }}</span>
                <span v-show="iconOneShow">
                  <Icon type="md-create" />
                </span>
              </div>
              <div style="text-align: right" slot="content">
                <Button type="primary" style="margin-right: 5px" @click="handleInfo(mac, linkman, 'linkman')">{{ $t('confirm') }}</Button>
                <Button style="color: #858586" @click="linkmanFlag = false">{{ $t('cancel') }}</Button>
              </div>
              <div slot="title" @mouseover="linkmanIndex = mac" @mouseout="linkmanIndex = -1" class="pointer pRelative">
                <div class="ellipsis" :title="info.linkman">
                  <Input class="input" maxlength="20" show-word-limit v-model.trim="linkman" :placeholder="$t('pleaseEnterContact')"></Input>
                </div>
                <!-- <i slot="title" v-if="linkmanIndex === mac  || $func.checkDataType(linkman)" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-linkman' : 'unusual-linkman'"></i> -->
              </div>
            </Poptip>
          </div>
          <div class="detail">
            <Poptip
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              transfer
              v-model="linkmanTelFlag"
              @on-popper-hide="
                linkmanTelFlag = false
                linkmanTel = info.linkmanTel
              ">
              <div class="devic" @mouseenter="iconTwoShow = true" @mouseleave="iconTwoShow = false">
                <span class="c9">{{ $t('contactInformation') }}:</span>
                <span class="num">{{ info.linkmanTel }}</span>
                <span v-show="iconTwoShow">
                  <Icon type="md-create" />
                </span>
              </div>
              <div style="text-align: right" slot="content">
                <Button type="primary" @click="handleInfo(mac, linkmanTel, 'linkmanTel')" style="margin-right: 5px">{{ $t('confirm') }}</Button>
                <Button style="color: #858586" @click="linkmanTelFlag = false">{{ $t('cancel') }}</Button>
              </div>
              <div slot="title" @mouseover="linkmanTelIndex = mac" @mouseout="linkmanTelIndex = -1" class="pointer pRelative">
                <div class="ellipsis" :title="info.linkmanTel">
                  <Input class="input" maxlength="20" show-word-limit v-model="linkmanTel" :placeholder="$t('enterTelOfContacts') + '1'"></Input>
                </div>
                <i slot="title" v-if="linkmanTelIndex === mac || $func.checkDataType(info.linkmanTel)" class="el-icon-edit pointer unit-icon"></i>
              </div>
            </Poptip>
          </div>
          <div class="detail">
            <Poptip
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="linkman2Flag"
              @on-popper-hide="
                linkman2Flag = false
                linkman2 = info.linkman2
              ">
              <div class="devic" @mouseenter="iconThreeShow = true" @mouseleave="iconThreeShow = false">
                <span class="c9">{{ $t('contacts') + '2' + ':' }}</span>
                <span class="num">{{ info.linkman2 !== undefined ? info.linkman2 : '' }}</span>
                <span v-show="iconThreeShow">
                  <Icon type="md-create" />
                </span>
              </div>
              <div style="text-align: right" slot="content">
                <Button type="primary" @click="handleInfo(mac, linkman2, 'linkman2')" style="margin-right: 5px">{{ $t('confirm') }}</Button>
                <Button style="color: #858586" @click="linkman2Flag = false">{{ $t('cancel') }}</Button>
              </div>
              <div slot="title" @mouseover="linkman2Index = mac" @mouseout="linkman2Index = -1" class="pointer pRelative">
                <div class="ellipsis" style="margin-top: 0" :title="info.linkman2">
                  <Input class="input" maxlength="20" show-word-limit v-model.trim="linkman2" :placeholder="$t('pleaseEnterContact')"></Input>
                </div>
                <i slot="title" v-if="linkman2Index === mac || $func.checkDataType(linkman2)" class="el-icon-edit pointer"></i>
              </div>
            </Poptip>
          </div>
          <div class="detail">
            <Poptip
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="linkmanTel2Flag"
              @on-popper-hide="
                linkmanTel2Flag = false
                linkmanTel2 = info.linkmanTel2
              ">
              <div class="devic" @mouseenter="iconFourShow = true" @mouseleave="iconFourShow = false">
                <span class="c9">{{ $t('contactInformation') }}</span>
                <span class="num">{{ info.linkmanTel2 }}</span>
                <span v-show="iconFourShow">
                  <Icon type="md-create" />
                </span>
              </div>
              <div style="text-align: right" slot="content">
                <Button type="primary" @click="handleInfo(mac, linkmanTel2, 'linkmanTel2')" style="margin-right: 5px">{{ $t('confirm') }}</Button>
                <Button style="color: #858586" @click="linkmanTel2Flag = false">{{ $t('cancel') }}</Button>
              </div>
              <div slot="title" @mouseover="linkmanTel2Index = mac" @mouseout="linkmanTel2Index = -1" class="pointer pRelative">
                <Input class="input" maxlength="20" show-word-limit v-model="linkmanTel2" :placeholder="$t('enterTelOfContacts') + '2'"></Input>
                <i slot="title" v-if="linkmanTel2Index === mac || $func.checkDataType(info.linkmanTel2)" class="el-icon-edit pointer unit-icon"></i>
              </div>
            </Poptip>
          </div>
        </Col>
        <Col :lg="12" :xxl="6">
          <div class="detail">
            <span class="c9">{{ $t('remainingAmount1') }}:</span>
            <span class="num">{{ meterData.money || '-' + $t('yuan') }}</span>
          </div>
          <div class="detail">
            <span class="c9">{{ $t('todayElectricityConsumption') }}:</span>
            <span class="num">{{ (meterData.toDayelec || '-') + 'kW·h' }}</span>
          </div>
          <div class="detail">
            <span class="c9">{{ $t('electricityConsumptionYear') }}:</span>
            <span class="num">{{ (meterData.toYearelec || '--') + 'kW·h' }}</span>
          </div>
          <div class="detail">
            <span class="c9">{{ $t('instantaneousActivePower') }}:</span>
            <span class="num">{{ (meterData.instantaneousActivePower || '-') + 'kW' }}</span>
          </div>
        </Col>
        <Col :lg="12" :xxl="6">
          <div class="detail">
            <span class="c9">{{ $t('changeBe') }}:</span>
            <span class="num">{{ ' ' + meterData.changeBe }}</span>
          </div>
          <div class="detail">
            <span class="c9">{{ $t('toMonthelec') }}:</span>
            <span class="num">{{ (meterData.toMonthelec || '-') + 'kW·h' }}</span>
          </div>
          <div class="detail">
            <span class="c9">{{ $t('totalPowerOfUser') }}:</span>
            <span class="num" v-if="meterData.money">{{ meterData.electro + 'kW·h' }}</span>
          </div>
          <div class="detail">
            <span class="c9">{{ $t('instantaneousReactivePower') }}:</span>
            <span class="num">{{ (meterData.instantaneousReactivePower || '-') + 'kW' }}</span>
          </div>
        </Col>
      </Row>
    </div>
    <Modal v-model="deviceFlag" footer-hide width="1000" :title="$t('macPositionModify')">
      <DeviceAdress v-if="deviceFlag" :propmapValue="propmapValue" @closeFlag="closeFlag"></DeviceAdress>
    </Modal>
  </div>
</template>
<script>
  import store from '@/store'
  import DeviceAdress from '@/pages/console/device/deviceAdress.vue'
  import { queryBoxDetails, checkMacOnlineStatus, macAlias, refreshSim } from '@/api/control/index'
  import { findBoxByMac, eleRead, queryChtqdqMeterReadingData } from '@/api/public'
  export default {
    props: {
      mac: { type: String },
      model: {
        type: String,
      },
    },
    components: {
      DeviceAdress,
    },
    data() {
      return {
        changeBeValue: 1,
        changeBeModal: false,
        meterData: {
          money: '',
          electro: '',
          toDayelec: '',
          toMonthelec: '',
          instantaneousActivePower: '',
          instantaneousReactivePower: '',
          toYearelec: '',
          changeBe: '-',
        },
        picShow: true,
        propmapValue: {},
        deviceFlag: false,
        iconFourShow: false,
        iconThreeShow: false,
        iconTwoShow: false,
        iconOneShow: false,
        iconShow: false,
        info: [],
        others: { imsi: '', iccid: '', expireDate: '', simUpdateDate: '' },
        formInline: {},
        expireDay: '',
        url: '',
        srcList: [''],
        timerID: null,
        flag: false,
        uploadUrl: '/box/icon/upload.as?v=' + new Date().getTime(),
        imgData: {
          name: 'imgFile',
          mac: '',
        },
        onlineStatus: '',
        onlineTime: '',
        input: '',
        aliasName: this.$store.state.aliasName,
        aliasFlag: false,
        aliasIndex: -1,
        linkman: '',
        linkmanFlag: false,
        linkmanIndex: -1,
        linkmanTel: '',
        linkmanTelFlag: false,
        linkmanTelIndex: -1,
        linkman2: '',
        linkman2Flag: false,
        linkman2Index: -1,
        linkmanTel2: '',
        linkmanTel2Flag: false,
        linkmanTel2Index: -1,
        imgUrls: '',
      }
    },
    created() {
      this.getDeviceAdres()
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
        this.getElectriyInit()
      })
    },
    methods: {
      init() {
        this.queryInfo()
        this.queryStatus()
      },
      async queryInfo() {
        let params = { mac: this.mac }
        this.picShow = true
        const res = await queryBoxDetails(params)
        if (res.success) {
          setTimeout(() => {
            this.picShow = false
          }, 1000)
          this.info = res.data
          this.linkman = res.data.linkman
          this.linkmanTel = res.data.linkmanTel
          this.linkman2 = res.data.linkman2
          this.linkmanTel2 = res.data.linkmanTel2
          this.imgData.mac = res.data.mac
          this.aliasName = res.data.name
          store.commit('aliasName', res.data.name)
          store.commit('customAlarm', res.data.others.customAlarm)
          store.commit('classifyLabel', res.data.others.classifyLabel)
          store.commit('sortBUR', { build: res.data.build, unit: res.data.unit, room: res.data.room, linkman: res.data.linkman, linkman2: res.data.linkman2, linkmanTel: res.data.linkmanTel, linkmanTel2: res.data.linkmanTel2 })
          this.others = {
            imsi: res.data.others.imsi,
            iccid: res.data.others.iccid,
            expireDate: res.data.others.expireDate,
            simUpdateDate: res.data.others.simUpdateDate,
            address: res.data.others.address,
            version: res.data.others.version,
            online: res.data.others.online,
            volumePackage: res.data.others.volumePackage,
            remainVolume: res.data.others.remainVolume,
            supplierName: res.data.others.supplierName,
          }
          if (this.info.equipmentType === 12) {
            if (this.others.online === 1) {
              this.url = this.info.imgUrl ? this.info.imgUrl : require('@/assets/images/emeter-online.png')
              this.srcList = [this.info.imgUrl ? this.info.imgUrl : require('@/assets/images/emeter-online.png')]
            } else {
              this.url = this.info.imgUrl ? this.info.imgUrl : require('@/assets/images/emeter-offline.png')
              this.srcList = [this.info.imgUrl ? this.info.imgUrl : require('@/assets/images/emeter-offline.png')]
            }
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getElectriyInit() {
        let params = { cid: this.mac, type: '' }
        const res = await queryChtqdqMeterReadingData(params)
        if (res.code === '0') {
          if (res.data.length > 0) {
            let dataArr = res.data
            this.meterData = {
              electro: dataArr.filter(item => item.type === 3).length && dataArr.filter(item => item.type === 3)[0].value,
              money: dataArr.filter(item => item.type === 22).length && dataArr.filter(item => item.type === 22)[0].value,
              toDayelec: dataArr.filter(item => item.type === 998).length && dataArr.filter(item => item.type === 998)[0].value,
              toMonthelec: dataArr.filter(item => item.type === 999).length && dataArr.filter(item => item.type === 999)[0].value,
              instantaneousActivePower: dataArr.filter(item => item.type === 33).length && dataArr.filter(item => item.type === 33)[0].value,
              instantaneousReactivePower: dataArr.filter(item => item.type === 34).length && dataArr.filter(item => item.type === 34)[0].value,
              toYearelec: dataArr.filter(item => item.type === 1000).length && dataArr.filter(item => item.type === 1000)[0].value,
              changeBe: dataArr.filter(item => item.type === 1001).length && dataArr.filter(item => item.type === 1001)[0].value,
            }
          } else {
            this.meterData = {
              money: '',
              electro: '',
              toDayelec: '',
              toMonthelec: '',
              instantaneousActivePower: '',
              instantaneousReactivePower: '',
              toYearelec: '',
              changeBe: '-',
            }
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      closeFlag() {
        this.deviceFlag = false
        this.getDeviceAdres()
        this.init()
      },
      getDeviceAdres() {
        let params = {
          mac: this.mac,
        }
        findBoxByMac(params).then(res => {
          if (res.success) {
            this.propmapValue = res.data
          }
        })
      },
      editDeviceModal() {
        this.deviceFlag = true
      },
      async queryStatus() {
        let params = { mac: this.mac }
        const res = await checkMacOnlineStatus(params)
        if (res.success) {
          this.onlineStatus = res.data.online
          this.onlineTime = res.data.onlineTime
        } else {
          this.$Message.error({ content: res.message })
        }
      },

      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isLt1M) {
          this.$Message.error({
            content: this.$t('exceedSize'),
          })
        }
        return isLt1M
      },
      handleSuccess(res, file) {
        if (res.success) {
          this.queryInfo()
          this.queryStatus()
        } else if (res.code === '-1') {
        } else {
          this.$Message.error({
            content: res.message,
          })
        }
      },
      async handleInfo(mac, value, type) {
        let params = { mac: mac }
        if (type === 'linkmanTel' || type === 'linkmanTel2') {
          if (!this.$func.checkPhone(value)) {
            this.$Message.error({
              content: this.$t('numberFormatError'),
            })
            return false
          }
        }
        if (type === 'alias') params.name = value
        if (type === 'linkman') params.linkman = value
        if (type === 'linkmanTel') params.linkmanTel = value
        if (type === 'linkman2') params.linkman2 = value
        if (type === 'linkmanTel2') params.linkmanTel2 = value
        const res = await macAlias(params)
        if (res.success) {
          this.$Message.success({ content: (type === 'alias' ? this.$t('EnterDevice') : '') + this.$t('modifySuccess') + '！' })
          if (type === 'alias') {
            store.commit('aliasName', value)
            this.aliasFlag = false
          } else if (type === 'linkman') {
            this.info.linkman = value
            this.linkmanFlag = false
          } else if (type === 'linkmanTel') {
            this.info.linkmanTel = value
            this.linkmanTelFlag = false
          } else if (type === 'linkman2') {
            this.info.linkman2 = value
            this.linkman2Flag = false
          } else if (type === 'linkmanTel2') {
            this.info.linkmanTel2 = value
            this.linkmanTel2Flag = false
          }
        } else {
          if (res.message) {
            this.$Message.error({ content: res.message })
          }
        }
      },
      async simRefresh() {
        try {
          let params = {
            mac: this.mac,
            imsi: this.others.imsi ? this.others.imsi : '',
          }
          const res = await refreshSim(params)
          if (res.success) {
            if (res.data) {
              this.others = {
                imsi: res.data.imsi,
                iccid: res.data.iccid,
                expireDate: res.data.expireDate,
                simUpdateDate: res.data.simUpdateData,
                volumePackage: res.data.volumePackage,
                remainVolume: res.data.remainVolume,
                supplierName: res.data.supplierName,
              }
              this.$Message.success({
                content: res.message,
              })
            } else {
              this.$Message.success({
                content: res.message,
              })
            }
          } else {
            this.$Message.error({ content: res.message })
          }
        } catch (error) {
          this.$Message.error({ content: this.$t('refreshFailed') })
        }
      },
      handelMeterReading() {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('meterReadingTips'),
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            let params = { cid: this.mac, address: this.mac, model: this.model }
            const res = await eleRead(params)
            if (res.code === '0') {
              if (res.data.status === 'SUCCESS') {
                this.$Message.success({
                  content: this.$t('submitCommand'),
                })
              } else {
                if (res.data.error_msg) {
                  this.$Message.error({ content: res.data.error_msg })
                } else {
                  this.$Message.error({ message: this.$t('meterReadingFailed') })
                }
              }
            } else {
              if (res.data.status) {
              } else {
                this.$Message.error({ content: this.$t('unknown') })
              }
            }
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('canceled') })
          },
        })
      },
    },
    destroyed() {
      clearTimeout(this.timerID)
    },
    watch: {
      $route(to, from) {
        if (from.path === '/ConfigurationList') this.queryInfo()
      },
    },
  }
</script>
<style lang="less" scoped>
  .ivu-form-item {
    margin-bottom: 0px;
  }
  /deep/.ivu-form-item-label {
    color: #8e9095 !important;
  }
  .theader {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    border-bottom: 1px solid #5e626c;
    span {
      height: 32px;
      line-height: 32px;
    }
    .bor {
      width: 2px;
      height: 14px;
      background: #0372e5;
      margin-right: 10px;
    }
  }
  .content {
    padding: 20px;
    display: flex;
    .avat-image {
      width: 140px;
      margin-right: 10px;
    }
    .rowH {
      width: calc(~'100% - 150px');
    }
    .title {
      border: 1px solid #fff;
      padding: 4px 16px;
    }
    /deep/.avat {
      width: 140px;
      position: relative;
      .pa {
        position: absolute;
        right: 0;
        font-size: 12px;
        font-family: PingFang SC;
        padding: 2px 4px;
        margin: 5px;
      }
      .bg1 {
        background: rgba(14, 209, 101, 0.3);
      }
      .bg2 {
        background: rgba(242, 78, 76, 0.3);
      }
      .bg3 {
        background: rgba(153, 153, 153, 0.3);
      }
    }
    .detail {
      padding-bottom: 20px;
      width: 100%;
      display: flex;
      .dev-position {
        width: 100%;
        display: flex;
        .text-val {
          max-width: 200px;
        }
        .icon-right {
          flex-shrink: 0;
          padding: 0px;
          padding-left: 5px;
        }
      }
      .c9 {
        white-space: nowrap;
        flex-shrink: 0;
        margin-right: 5px;
      }
      .num {
        width: 100%;
        color: #fff;
      }
    }
  }
</style>
