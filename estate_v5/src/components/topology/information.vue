<template>
  <div class="information">
    <template v-if="state === 1">
      <div class="formContent">
        <Form :label-width="120" class="formData">
          <FormItem :label="`${$t('name')}:`">
            <Poptip :transfer="true" trigger="click" v-model="aliasFlag" width="250" @on-popper-hide="aliasFlag = false">
              <div class="devic point" @mouseenter="iconShow = true" @mouseleave="iconShow = false">
                <span class="name">{{ floorName }}</span>
                <span v-show="iconShow"><Icon type="md-create" /></span>
              </div>
              <div style="text-align: right" slot="content">
                <Button type="primary" @click="handleUpdateFloor(detailData.build, detailData.unit, detailData.room, floorName)" style="margin-right: 5px">{{ $t('confirm') }}</Button>
                <Button style="color: #858586" @click="aliasFlag = false">{{ $t('cancel') }}</Button>
              </div>
              <div slot="title" class="pointer pRelative">
                <div class="ellipsis">
                  <Input class="input" maxlength="20" show-word-limit v-model.trim="floorName" :placeholder="$t('pleaseInputName')"></Input>
                </div>
              </div>
            </Poptip>
          </FormItem>
          <FormItem :label="`${$t('currentElectricityConsumptionTotal')}:`">
            <div class="electricity">
              {{ detailData.curMonPower }}
              <span>kW·h</span>
            </div>
          </FormItem>
          <FormItem :label="`${$t('currentMonthAlarmCount')}:`">
            <div class="alarms">{{ detailData.curMonAlarm }}</div>
          </FormItem>
        </Form>
        <Form :label-width="120" class="formData">
          <FormItem :label="`${$t('numberOfOpeningLines')}:`">
            <div class="opening">{{ detailData.openChnlCount }}</div>
          </FormItem>
          <FormItem :label="`${$t('numberOfClosingLines')}:`">
            <div class="closing">{{ detailData.closeChnlCount }}</div>
          </FormItem>
        </Form>
      </div>
    </template>
    <template v-if="state === 2">
      <div class="formContent">
        <Form :label-width="100" class="formData">
          <FormItem :label="`${$t('deviceAliases')}:`">
            <Poptip :transfer="true" trigger="click" v-model="aliasFlag" width="250" @on-popper-hide="aliasFlag = false">
              <div class="devic point" @mouseenter="iconShow = true" @mouseleave="iconShow = false">
                <span class="name">{{ detailData.boxDetailVo.boxName }}</span>
                <span v-show="iconShow"><Icon type="md-create" /></span>
              </div>
              <div style="text-align: right" slot="content">
                <Button type="primary" @click="handleInfo(detailData.boxDetailVo.mac, detailData.boxDetailVo.boxName, 'alias')" style="margin-right: 5px">{{ $t('confirm') }}</Button>
                <Button style="color: #858586" @click="aliasFlag = false">{{ $t('cancel') }}</Button>
              </div>
              <div slot="title" class="pointer pRelative">
                <div class="ellipsis">
                  <Input class="input" maxlength="20" show-word-limit v-model.trim="detailData.boxDetailVo.boxName" :placeholder="$t('enterDeviceAlias')"></Input>
                </div>
              </div>
            </Poptip>
          </FormItem>
          <FormItem :label="`${$t('equipmentNo')}:`">
            {{ detailData.boxDetailVo.mac }}
          </FormItem>
          <FormItem :label="`${$t('contacts')}1:`">
            {{ detailData.boxDetailVo.linkMan1 }}
          </FormItem>
          <FormItem :label="`${$t('contacts')}2:`">
            {{ detailData.boxDetailVo.linkMan2 }}
          </FormItem>
          <FormItem :label="`${$t('position')}:`">
            {{ updateLocationStr }}
            <i class="icon-v5 icon-v5-bianji" style="margin-left: 10px" @click="editDeviceModal"></i>
          </FormItem>
        </Form>
        <Form :label-width="120" class="formData">
          <FormItem :label="`${$t('version')}:`">
            {{ detailData.boxDetailVo.version }}
          </FormItem>
          <br />
          <br />
          <FormItem :label="`${$t('contactMethod')}:`">{{ detailData.boxDetailVo.linkTel1 }}</FormItem>
          <FormItem :label="`${$t('contactMethod')}:`">{{ detailData.boxDetailVo.linkTel2 }}</FormItem>
        </Form>
      </div>
    </template>
    <template v-if="state === 3">
      <div class="formContent">
        <Form :label-width="100" class="formData">
          <FormItem :label="`${$t('lineName')}:`">
            <Poptip :transfer="true" trigger="click" v-model="aliasFlag" width="250" @on-popper-hide="aliasFlag = false">
              <div class="devic point" @mouseenter="iconShow = true" @mouseleave="iconShow = false">
                <span class="name">{{ detailData.addrDetailVo.addrName }}</span>
                <span v-show="iconShow"><Icon type="md-create" /></span>
              </div>

              <div style="text-align: right" slot="content">
                <Button type="primary" @click="handleupdateNodeTitle(detailData.addrDetailVo.mac, detailData.addrDetailVo.addr, detailData.addrDetailVo.addrName)" style="margin-right: 5px">{{ $t('confirm') }}</Button>
                <Button style="color: #858586" @click="aliasFlag = false">{{ $t('cancel') }}</Button>
              </div>
              <div slot="title" class="pointer pRelative">
                <div class="ellipsis">
                  <Input class="input" maxlength="20" show-word-limit v-model.trim="detailData.addrDetailVo.addrName" :placeholder="$t('enterDeviceAlias')"></Input>
                </div>
              </div>
            </Poptip>
          </FormItem>
          <FormItem :label="`${$t('model')}:`">
            {{ detailData.addrDetailVo.model }}
          </FormItem>
          <FormItem :label="`${$t('totalPower')}:`">{{ detailData.addrDetailVo.gwp }}W</FormItem>
          <FormItem :label="`${$t('current')}:`">
            {{ detailData.addrDetailVo.ga }}
          </FormItem>
          <FormItem :label="`${$t('bodyTemperature')}:`">{{ detailData.addrDetailVo.gt }}°C</FormItem>
        </Form>
        <Form :label-width="120" class="formData">
          <FormItem :label="`${$t('wiringMethod')}:`">
            {{ detailData.addrDetailVo.wiringMode }}
          </FormItem>
          <FormItem :label="`${$t('addrCode')}:`">
            {{ detailData.addrDetailVo.addr }}
          </FormItem>
          <FormItem :label="`${$t('residualCurrent')}:`">{{ detailData.addrDetailVo.gld }}mA</FormItem>
          <FormItem :label="`${$t('voltage')}:`">{{ detailData.addrDetailVo.gv }}V</FormItem>
          <FormItem :label="`${$t('ambientTemperature')}:`">{{ detailData.addrDetailVo.tmpE }}°C</FormItem>
        </Form>
      </div>
    </template>
    <template v-if="state === 4">
      <div class="formContent">
        <Form :label-width="100" class="formData">
          <FormItem :label="`${$t('switchQuantityName')}:`">
            {{ detailData.digitalIn ? detailData.digitalIn.name : detailData.digitalOut ? detailData.digitalOut.name : detailData.analogIn.org.name }}
          </FormItem>
        </Form>
      </div>
    </template>
    <Modal v-model="deviceFlag" footer-hide width="1000" :title="$t('macPositionModify')"><DeviceAdress v-if="deviceFlag" :propmapValue="propmapValue" @closeFlag="closeFlag" @updateLocation="updateLocation"></DeviceAdress></Modal>
  </div>
</template>
<script>
  import DeviceAdress from '../../pages/console/device/deviceAdress.vue'
  import store from '@/store'
  import { updateNodeTitle, updateFloor } from '@/api/public'
  import { macAlias } from '@/api/control/index'
  export default {
    components: {
      DeviceAdress,
    },
    props: {
      state: {
        type: Number,
        default() {
          return {}
        },
      },
      detailData: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        iconShow: false,
        aliasFlag: false,
        deviceFlag: false,
        propmapValue: '',
        floorName: '',
        updateLocationStr: '',
      }
    },
    mounted() {
      this.propmapValue = this.detailData.boxDetailVo
      setTimeout(() => {
        if (this.propmapValue.build && this.propmapValue.unit && this.propmapValue.room) {
          this.updateLocationStr = this.propmapValue.build + this.propmapValue.unit + this.propmapValue.room
        }
      }, 400)
    },
    methods: {
      updateLocation(val) {
        this.updateLocationStr = val.buildValue + val.unitValue + val.roomValue
        this.detailData.boxDetailVo.buildValue = val.buildValue
        this.detailData.boxDetailVo.unit = val.unitValue
        this.detailData.boxDetailVo.room = val.roomValue
      },
      editDeviceModal() {
        this.deviceFlag = true
      },
      closeFlag() {
        this.deviceFlag = false
      },
      // 修改设备名称
      handleInfo(mac, value, type) {
        let params = {
          mac: mac,
        }
        if (type === 'linkmanTel' || type === 'linkmanTel2') {
          if (!this.$func.checkPhone(value)) {
            this.$Message.error({
              content: this.$t('numberFormatError'),
            })
            return false
          }
        }
        if (type === 'alias') params.name = value
        macAlias(params)
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: (type === 'alias' ? this.$t('deviceAliases') : '') + this.$t('modifySuccess') + '！',
              })
              if (type === 'alias') {
                store.commit('aliasName', value)
                this.aliasFlag = false
              }
            } else if (res.code === '-1') {
            } else {
              if (res.message) {
                this.$Message.error({
                  content: res.message,
                })
              } else {
                this.$Message.error({
                  content: this.$t('unknown'),
                })
              }
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      // 修改楼栋单元房号
      handleUpdateFloor(build, unit, room, floorName) {
        let params = {
          projectCode: this.$store.state.projectCode,
          build: build || '',
          unit: unit || '',
          room: room || '',
          floorType: this.floorType,
          floorName: floorName,
        }
        updateFloor(params).then(res => {
          if (res.success) {
            this.$Message.success(res.message)
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      // 修改线路名称
      handleupdateNodeTitle(mac, addr, title) {
        let params = {
          mac: mac,
          nodeNo: addr,
          title: title,
        }
        updateNodeTitle(params).then(res => {
          if (res.success) {
            this.aliasFlag = false
            this.$Message.success(res.message)
          } else {
            this.$Message.error(res.message)
          }
        })
      },
    },
    watch: {
      state: {
        handler(newVal) {},
      },
      detailData: {
        handler(newVal) {
          if (newVal.unit === undefined && newVal.room === undefined) {
            this.floorType = 1
            this.floorName = newVal.build
          } else if (newVal.unit !== undefined && newVal.room === undefined) {
            this.floorType = 2
            this.floorName = newVal.unit
          } else if (newVal.unit !== undefined && newVal.room !== undefined) {
            this.floorType = 3
            this.floorName = newVal.room
          }
          this.propmapValue = newVal.boxDetailVo
          this.updateLocationStr = this.propmapValue.build + this.propmapValue.unit + this.propmapValue.room
        },
      },
    },
  }
</script>
<style lang="less">
  .information {
    width: 100%;
    .ivu-form-item {
      margin-bottom: 0px;
    }
    .ivu-form-item-label {
      color: #a7a8ac;
    }
    .formContent {
      width: 100%;
      display: flex;
      margin-left: 30px;
      .formData {
        width: 100%;
        .name {
        }
        .electricity {
          color: #068ecb;
        }
        .alarms {
          color: #8d0c22;
        }
        .opening {
          color: #8adf08;
        }
        .closing {
          color: #8d0c22;
        }
      }
    }
  }
</style>
