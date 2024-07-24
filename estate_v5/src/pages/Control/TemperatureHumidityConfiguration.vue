<template>
  <div id="TemperatureHumidityConfiguration">
    <Row :gutter="20" style="margin: 0; padding: 20px">
      <Col :span="7" class="mb-20">
        <div class="ellipsis">
          <span class="label normal-label">{{ $t('equipmentNo') }}：</span>
          <span :title="temperatureHumList.mac">{{ temperatureHumList.mac }}</span>
        </div>
      </Col>
      <Col :span="7" class="mb-20">
        <div>
          <Poptip placement="top" width="250" v-model="aliasFlag" transfer @on-popper-hide="temperatureHumList.name = $store.state.aliasName">
            <div slot="content">
              <Input size="small" maxlength="20" show-word-limit v-model.trim="temperatureHumList.name" :placeholder="$t('enterDeviceAlias')"></Input>
              <div style="text-align: right; margin: 5px 0 0">
                <Button type="primary" size="small" style="margin-right: 10px" @click="handleAlias(temperatureHumList.mac, temperatureHumList.name)">{{ $t('confirm') }}</Button>
                <Button
                  size="small"
                  type="default"
                  @click="
                    temperatureHumList.name = $store.state.aliasName
                    aliasFlag = false
                  ">
                  {{ $t('cancel') }}
                </Button>
              </div>
            </div>
            <div @mouseover="aliasIndex = temperatureHumList.mac" @mouseout="aliasIndex = -1" class="pointer pRelative">
              <div class="ellipsis" :class="aliasFlag ? 'dashed' : ''" :title="temperatureHumList.name">
                <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('deviceAliases') }}:</span>
                <span>{{ temperatureHumList.name }}</span>
              </div>
              <i v-if="permission === 'true' && aliasIndex === temperatureHumList.mac" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"></i>
            </div>
          </Poptip>
        </div>
      </Col>
      <Col :span="24">
        <span class="fs-14">{{ $t('alarmThresholdSetting') }}：</span>
        <Button type="text" ref="refreshBtn" @click="handleTemperatureHumList(temperatureHumList.mac, temperatureHumList.name)" :disabled="disabledFlag"><i class="icon-v5 icon-v5-shuaxin"></i></Button>
        <Table :data="TemHumList" :columns="columns1" @on-cell-click="handleCell">
          <template slot-scope="{ row }" slot="nodeEnable">
            <Select v-model="row.alarmEnables" clearable transfer class="w100" @on-change="handleOpenClose">
              <Option v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</Option>
            </Select>
          </template>
          <template slot-scope="{ row, index }" slot="temUpper">
            <Poptip placement="top" width="250" transfer v-model="temUpperM" :ref="`temUpper-popover-${index}`">
              <div slot="content">
                <Input :maxlength="20" type="number" :max="300" show-word-limit v-model="row.temUpper" :placeholder="$t('enterContent')"></Input>
                <div class="tr mt-5">
                  <Button type="primary" style="margin-right: 10px" :disabled="disabledRefresh" size="small" @click="handleNodeAttr(temperatureHumList.mac, row, 'temUpper', row.temUpper)">{{ $t('confirm') }}</Button>
                  <Button size="small" type="default" @click="handleClosePopover('temUpper')">{{ $t('cancel') }}</Button>
                </div>
              </div>
              <span class="pointer">{{ row.temUpper ? row.temUpper : '-' }}</span>
            </Poptip>
          </template>
          <template slot-scope="{ row, index }" slot="temLower">
            <Poptip transfer placement="top" width="250" v-model="temUpperL" :ref="`temLower-popover-${index}`">
              <div slot="content">
                <InputNumber v-model="row.temLower" :placeholder="$t('enterContent')"></InputNumber>
                <div class="tr mt-5">
                  <Button type="primary" style="margin-right: 10px" size="small" :disabled="disabledRefresh" @click="handleNodeAttr(temperatureHumList.mac, row, 'temLower', row.temLower)">{{ $t('confirm') }}</Button>
                  <Button type="default" size="small" @click="handleClosePopover('temLower')">{{ $t('cancel') }}</Button>
                </div>
              </div>
              <span class="pointer">{{ row.temLower ? row.temLower : '-' }}</span>
            </Poptip>
          </template>
          <template v-if="equipmentNum === 11" slot-scope="{ row, index }" slot="humUpper">
            <Poptip placement="top" width="250" v-model="temUpperH" :ref="`humUpper-popover-${index}`" transfer>
              <div slot="content">
                <InputNumber v-model="row.humUpper" :placeholder="$t('enterContent')"></InputNumber>
                <div class="tr mt-5">
                  <Button type="primary" style="margin-right: 10px" size="small" :disabled="disabledRefresh" @click="handleNodeAttr(temperatureHumList.mac, row, 'humUpper', row.humUpper)">{{ $t('confirm') }}</Button>
                  <Button size="small" type="default" @click="handleClosePopover('humUpper')">{{ $t('cancel') }}</Button>
                </div>
              </div>
              <span class="pointer">{{ row.humUpper ? row.humUpper : '-' }}</span>
            </Poptip>
          </template>
          <template v-if="equipmentNum === 11" slot-scope="{ row, index }" slot="humLower">
            <Poptip transfer placement="top" width="250" v-model="temUpperS" :ref="`humLower-popover-${index}`">
              <div slot="content">
                <InputNumber v-model="row.humLower" :placeholder="$t('enterContent')"></InputNumber>
                <div class="tr mt-5">
                  <Button type="primary" style="margin-right: 10px" size="small" :disabled="disabledRefresh" @click="handleNodeAttr(temperatureHumList.mac, row, 'humLower', row.humLower)">{{ $t('confirm') }}</Button>
                  <Button size="small" type="default" @click="handleClosePopover('humLower')">{{ $t('cancel') }}</Button>
                </div>
              </div>
              <span class="pointer">{{ row.humLower ? row.humLower : '-' }}</span>
            </Poptip>
          </template>
        </Table>
      </Col>
    </Row>
  </div>
</template>

<script>
  import store from '@/store'
  import { queryParamByMac, macAlias, updateParam, refreshParam, updateAlarmEnable } from '@/api/public'
  export default {
    components: {},
    props: {
      online: { type: Number },
      equipmentNum: { type: Number },
    },
    data() {
      return {
        temUpperM: false,
        temUpperL: false,
        temUpperH: false,
        temUpperS: false,
        columns1: [
          { title: this.$t('nodeName'), key: 'nodeName' },
          { title: this.$t('nodeEnable'), slot: 'nodeEnable' },
          { title: this.equipmentNum === 11 ? `${this.$t('temperatureLimit')}(℃)` : `${this.$t('upperLimitOfIllumination')}(Lux)`, slot: 'temUpper' },
          { title: this.equipmentNum === 11 ? `${this.$t('lowerTemperatureLimit')}(℃)` : `${this.$t('lowerLimitOfIllumination')}(Lux)`, slot: 'temLower' },
          { title: this.equipmentNum === 11 ? `${this.$t('humidityAlarmUpperLimit')}(%RH)` : '', slot: 'humUpper' },
          { title: this.equipmentNum === 11 ? `${this.$t('lowerLimitOfHumidityAlarm')}(%RH)` : '', slot: 'humLower' },
        ],
        temperatureHumList: {
          mac: this.$store.state.mac,
          name: this.$store.state.aliasName,
          build: this.$store.state.sortBUR.build,
          unit: this.$store.state.sortBUR.unit,
          room: this.$store.state.sortBUR.room,
        },
        disabledRefresh: false,
        disabledFlag: false,
        aliasFlag: false,
        aliasIndex: -1,
        buildFlag: false,
        buildIndex: -1,
        unitFlag: false,
        unitIndex: -1,
        roomFlag: false,
        roomIndex: -1,
        index: 0,
        variable: '',
        TemHumList: [],
        TemHumName: '',
        permission: '', // config.authority.BOX_ATTR_MODIFY,
        taer: false,
        options: [
          { value: '1', label: this.$t('open1') },
          { value: '2', label: this.$t('close1') },
        ],
      }
    },
    created() {},
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.queryTemHumList()
        this.handleTemperatureHumList()
      },
      async queryTemHumList() {
        let params = { mac: this.temperatureHumList.mac }
        const res = await queryParamByMac(params)
        if (res.code === '0') {
          this.TemHumList = res.data.map((item, index) => ({ ...item, index, alarmEnables: item.alarmEnable ? '1' : '2' }))
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlerefresh() {
        this.disabledRefresh = true
        let parmas = { mac: this.temperatureHumList.mac }
        const res = await refreshParam(parmas)
        if (!res.success) {
          this.$Message.error({ content: res.message })
        }
      },
      handleCell(row, column, cell, event) {
        if (column.property === 'nodeName' || column.property === 'nodeEnable') {
          return false
        }
        this.index = `${column.property}-popover-${row.index}`
        this.variable = row[column.property]
      },
      handleClosePopover(val) {
        this.index = 0
        this.variable = ''
        if (val === 'temUpper') {
          this.temUpperM = false
        } else if (val === 'temLower') {
          this.temUpperL = false
        } else if (val === 'humUpper') {
          this.temUpperH = false
        } else {
          this.temUpperS = false
        }
      },
      handleTemperatureHumList(mac, name) {
        this.handlerefresh()
        this.disabledFlag = true
        let timer = setTimeout(() => {
          this.disabledFlag = false
          if (this.variable.length > 0) this.disabledRefresh = false
          this.queryTemHumList()
          clearTimeout(timer)
        }, 1000)
      },
      async handleOpenClose(row) {
        let params = { mac: this.temperatureHumList.mac, alarmEnable: row === '1' ? 'open' : 'false', nodeId: row.nodeId }
        const res = await updateAlarmEnable(params)
        if (res.success) {
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleAlias(mac, name) {
        const res = await macAlias({ mac: mac, name: name })
        if (res.success) {
          this.$Message.success({ content: this.$t('deviceAliasesModifySuccess') })
          store.commit('aliasName', name)
          this.aliasFlag = false
          this.aliasIndex = -1
          this.temperatureHumList.name = name
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleSort(mac, build, unit, room, type) {
        let params = { mac: mac }
        if (type === 'build') {
          params.build = build
        } else if (type === 'unit') {
          params.unit = unit
        } else if (type === 'room') {
          params.room = room
        }
        const res = await macAlias(params)
        if (res.success) {
          this.$Message.success({
            message: this.$t('modifySuccess1'),
          })
          store.commit('sortBUR', {
            build: this.temperatureHumList.build,
            unit: this.temperatureHumList.unit,
            room: this.temperatureHumList.room,
          })
          if (type === 'build') {
            this.buildFlag = false
            this.buildIndex = -1
            this.temperatureHumList.build = build
          } else if (type === 'unit') {
            this.unitFlag = false
            this.unitIndex = -1
            this.temperatureHumList.unit = unit
          } else if (type === 'room') {
            this.roomFlag = false
            this.roomIndex = -1
            this.temperatureHumList.room = room
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleNodeAttr(mac, row, val, item) {
        if (this.online === 0) return this.$Message.error({ content: this.$t('deviceOfflineTip', { mac }) })
        if (val === 'temUpper') {
          if (this.equipmentNum === 14 && this.variable > 200000) {
            this.$Message.error({ content: this.$t('theUpperLimitOfIlluminationCannotExceed200000Lux') })
            return
          } else if (this.equipmentNum === 11 && row.temUpper > 300) {
            this.$Message.error({ content: this.$t('theUpperTemperatureLimitCannotExceed300') })
            return
          }
          if (row.temUpper <= row.temLower) {
            this.$Message.error({ content: this.$t('upLimitValNotLowThanLowLimitVal') })
            return
          }
        } else if (val === 'temLower') {
          if (+row.temLower < -40) {
            this.$Message.error({ content: this.$t('theLowerTemperatureLimitCannotBeLowerThan40') })
            return
          }

          if (+row.temLower >= +row.temUpper) {
            this.$Message.error({ content: this.$t('lowLimitValNotHighThanUplimitVal') + '131' })
            return
          }
        } else if (val === 'humUpper') {
          if (+row.humUpper > 100) {
            this.$Message.error({ content: this.$t('theUpperLimitOfHumidityCannotExceed100RH') })
            return
          }
          if (+row.humUpper <= +row.humLower) {
            this.$Message.error({ content: this.$t('upLimitValNotLowThanLowLimitVal') })
            return
          }
        } else if (val === 'humLower') {
          if (+row.humLower < 0) {
            this.$Message.error({ content: this.$t('theLowerLimitOfHumidityCannotBeLowerThan0RH') })
            return
          }
          if (+row.humLower >= +row.humUpper) {
            this.$Message.error({ content: this.$t('lowLimitValNotHighThanUplimitVal') })
            return
          }
        }
        let params = { mac: mac, nodeId: row.nodeId, paramName: val, value: item }
        this.disabledFlag = true
        const res = await updateParam(params)
        this.aliasColu = false
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.handleClosePopover()
        } else {
          this.$Message.error({ content: res.message })
        }
        let timer = setTimeout(() => {
          this.disabledFlag = false
          clearTimeout(timer)
        }, 5000)
      },
    },
    watch: {
      variable: {
        handler(newVal, oldVal) {
          if (newVal === '') {
            this.disabledRefresh = true
          } else {
            this.disabledRefresh = false
          }
        },
      },
    },
  }
</script>

<style lang="less" scoped>
  /deep/ .el-col {
    padding: 0 !important;
  }
  .pRelative {
    position: relative;
    i {
      position: absolute;
      top: 12px;
    }
    .normal-icon {
      left: 75px;
    }
    .unusual-icon {
      left: 120px;
    }
    .unit-icon {
      left: -12px;
    }
  }
  .label {
    display: inline-block;
    width: 130px;
    text-align: right;
  }
  .normal-label {
    width: 85px;
  }
  .ellipsis {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dashed {
    box-sizing: border-box;
    border-bottom: 1px dashed #303a5e;
  }

  .enable {
    height: 40px;
    line-height: 40px;
  }

  /deep/ .el-table__expand-icon {
    color: #fff;
  }

  .iconfont-grey {
    color: #909399 !important;
  }

  .iconfont-loading {
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-direction: normal;
    animation-fill-mode: none;
    animation-play-state: running;
    animation-name: rotating;
    display: inline-block;
  }

  .w100 {
    width: 100px;
  }
  .mt-5 {
    margin-top: 5px;
  }
</style>
