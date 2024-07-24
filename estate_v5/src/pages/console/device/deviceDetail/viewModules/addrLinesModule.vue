<template>
  <div class="lines-table">
    <Row class="lines-box-top" type="flex" justify="space-between">
      <Col>
        <h3>{{ $t('channelList') }}</h3>
      </Col>
      <Col>
        <Button style="margin-left: 8px" type="primary" @click="handleInstructions">{{ $t('commandHistory') }}</Button>
        <Button style="margin-left: 15px" :class="channels.length === 0 ? 'grays' : 'greens'" v-if="equipmentType === 1" :disabled="channels.length === 0" @click="handleChannelsOC(false)">{{ $t('oneButtonOff') }}</Button>
        <Button style="margin-left: 15px" :class="channels.length === 0 ? 'grays' : 'reds'" v-if="equipmentType === 1" :disabled="channels.length === 0" @click="handleChannelsOC(true)">{{ $t('oneButtonOn') }}</Button>
      </Col>
    </Row>
    <Table ref="currentRowTable" :columns="custColumns8" max-height="610" :data="channelsData" @on-row-dblclick="handleDblClick" @on-selection-change="handleSelectionChange" @on-select-cancel="handleCancel" @on-select="handlEselet">
      <template slot-scope="{ row, index }" slot="select">
        <span style="font-size: 20px">
          <Switch v-model="row.checkValue" @on-change="handleResetState(row, index)" />
        </span>
      </template>
      <template slot-scope="{ row, index }" slot="lineName">
        <Poptip placement="top" transfer trigger="click" :ref="`popover-${index}`" @on-popper-show="handleShow" @on-popper-hide="handleHide">
          <div>{{ row.title }}</div>
          <div class="poptip" slot="content">
            <Input type="text" :placeholder="$t('content')" v-model.trim="channelsData[index].title" maxlength="10"></Input>
            <div style="text-align: right; margin: 5px 0 0">
              <Button type="primary" size="small" @click="handleEdit(index, row, channelsData[index].title)">{{ $t('confirm') }}</Button>
              <Button type="primary" class="ml-10" size="small" @click="closeEditPopover(index)">{{ $t('cancel') }}</Button>
            </div>
          </div>
        </Poptip>
      </template>
      <template slot-scope="{ row }" slot="temperature">
        <div class="allLine">
          {{ row.gT > -60 ? $t('mainRoad') + ':' + row.gT : '' }}
          <i class="icon-v5 icon-v5-jieruguanli" :title="$t('missedProbe')" v-show="row.gT <= -38"></i>
        </div>
        <div v-show="row.lineType === '180' || row.lineType === '380'" class="split-line">
          <span class="line">
            A:{{ row.aT > -60 ? row.aT : '' }}
            <i class="icon-v5 icon-v5-jieruguanli" :title="$t('missedProbe')" v-show="row.bT <= -38"></i>
          </span>

          <span class="line">
            B:{{ row.bT > -60 ? row.bT : '' }}
            <i class="icon-v5 icon-v5-jieruguanli" :title="$t('missedProbe')" v-show="row.cT <= -38"></i>
          </span>

          <span class="line">
            C:{{ row.cT > -60 ? row.cT : '' }}
            <i class="icon-v5 icon-v5-jieruguanli" :title="$t('missedProbe')" v-show="row.cT <= -38"></i>
          </span>
        </div>
      </template>
      <template slot-scope="{ row }" slot="ampere">
        <div class="allLine">{{ $t('mainRoad') + ':' + row.gA }}</div>
        <div v-show="row.lineType === '180' || row.lineType === '380'" class="split-line">
          <span class="line">A:{{ row.aA }}</span>
          <span class="line">B:{{ row.bA }}</span>
          <span class="line">C:{{ row.cA }}</span>
        </div>
      </template>
      <template slot-scope="{ row }" slot="volt">
        <div class="allLine">
          {{ $t('mainRoad') + ':' + row.gV }}
        </div>
        <div v-show="row.lineType === '180' || row.lineType === '380'" class="split-line">
          <span class="line">A:{{ row.aV }}</span>
          <span class="line">B:{{ row.bV }}</span>
          <span class="line">C:{{ row.cV }}</span>
        </div>
      </template>
      <template slot-scope="{ row }" slot="watt">
        <div class="allLine">
          {{ $t('mainRoad') + ':' + row.gW }}
        </div>
        <div v-show="row.lineType === '180' || row.lineType === '380'" class="split-line">
          <span class="line">A:{{ row.aW }}</span>
          <span class="line">B:{{ row.bW }}</span>
          <span class="line">C:{{ row.cW }}</span>
        </div>
      </template>
      <template slot-scope="{ row }" slot="status">
        <span v-show="!row.oc" class="dangers-text">{{ $t('broken') }}</span>
        <span v-show="row.oc" class="normals-text">{{ $t('passed') }}</span>
      </template>
      <template slot-scope="{ row }" slot="operating" v-if="equipmentType === 1">
        <span>
          <span class="verticallyCentered" v-if="row.enableNetCtrl && row.isSupportOc">
            <Button type="text" :style="row.others.online !== 1 || row.localLock ? 'color:#4c3a37' : 'color: #f24e4c'" v-show="row.others.online !== 1" :disabled="row.others.online !== 1 || row.localLock">{{ $t('closing') }}</Button>
            <span v-if="row.others.online === 1">
              <Button type="text" v-if="row.oc || (!row.oc && row.localLock)" :disabled="true">{{ $t('closing') }}</Button>
              <Button type="text" style="color: #f24e4c" v-else @click="switcherCtlEvent(row.mac, row.addr, true)">{{ $t('closing') }}</Button>
            </span>
            <Button type="text" :style="row.others.online !== 1 || row.localLock ? 'color:#4c3a37' : 'color: #21f27f'" v-show="row.others.online !== 1" :disabled="row.others.online !== 1 || row.localLock">{{ $t('opening') }}</Button>
            <span v-if="row.others.online === 1">
              <Button type="text" v-if="!row.oc || (row.oc && row.localLock)" :disabled="true">{{ $t('opening') }}</Button>
              <Button type="text" style="color: #21f27f" v-else @click="switcherCtlEvent(row.mac, row.addr, false)">{{ $t('opening') }}</Button>
            </span>
          </span>
          <span class="verticallyCentered" v-if="!row.enableNetCtrl && row.isSupportOc">
            <Button type="text" style="color: #007eff" @click="handleUnlock(row)" :disabled="row.localLock">{{ $t('unlock') }}</Button>
          </span>
          <span class="verticallyCentered" v-if="subItemFlag">
            <Button type="text" style="color: #007eff" @click="handlesetUp(row)">{{ $t('setSubItems') }}</Button>
          </span>
          <span>
            <Button type="text" class="restore-button" @click="openRestoeModal(row)">{{ $t('restoreFactorySettings') }}</Button>
          </span>
        </span>
      </template>
    </Table>
    <Modal :title="$t('instructionHistory')" :mask="false" closable :transfer="false" footer-hide v-if="instructionsFlag" v-model="instructionsFlag" width="1323px">
      <CommandFeedback :classFlag="true" :instructionsData="instructionsData" :operateAt="2"></CommandFeedback>
    </Modal>
    <Modal :title="$t('setSubItems')" :mask="false" v-model="setupFlag" @on-ok="submitInformation" @on-cancel="handleInformationClose">
      <Form :model="subItemForm" ref="informationForm">
        <FormItem :label="$t('subItemType') + ':'"></FormItem>
        <Select v-model="subItemForm.type" clearable style="width: 100%">
          <Option v-for="item in subItemOptions" :key="item.id" :label="item.CategoryName" :value="item.id"></Option>
        </Select>
      </Form>
    </Modal>
    <Modal :title="$t('restoreFactorySettings')" v-model="restoreSettingModal" :mask-closable="false">
      <div class="tool-style">
        <Icon type="ios-alert" />
        {{ toolTipText }}
      </div>
      <div class="mar-t-10">
        <span>{{ $t('restoreContent') }}：</span>
        <span>
          <RadioGroup v-model="selectRestore">
            <Radio label="1">{{ $t('onlyForDevices') }}</Radio>
            <!-- <Radio label="2">包含设备平台数据<TooltipVue class="dis-inline" :tooltipText="tooltipDevice"></TooltipVue></Radio>  -->
          </RadioGroup>
        </span>
      </div>
      <div slot="footer">
        <Button type="default" @click="restoreSettingModal = false">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="saveReStoreSetting">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal v-model="dblFlag" title="" :mask="false" custom-class="dbl-custom">
      <span class="dbl-title">{{ $t('watt') }}</span>
      <div class="dbl-detail" :class="{ isThreePhase: !threePhaseDetail }">
        <span>{{ threePhase.gW }}</span>
        <div v-if="threePhaseDetail" class="dbl-split-line" style="overflow: hidden">
          <span>A:{{ threePhase.aW }}</span>
          <span>B:{{ threePhase.bW }}</span>
          <span>C:{{ threePhase.cW }}</span>
        </div>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="callActionDo"></OperationCheckAuth>
    <BatchOcAlarmTips ref="batchOcAlarmTips" @commitOK="handleChannelsOcPost" />
  </div>
</template>

<script>
  import { queryChannels, disableSelection, abnormalSwitchUnlock, changeStatus2, updateNodeTitle, queryPageAuth, getChannelCategory, addChannelCategory, restoreFactorySetting } from '@/api/public'
  import { isAlarmStatus } from '@/api/control'
  import CommandFeedback from '@/pages/Common/CommandFeedback.vue'
  import BatchOcAlarmTips from './common/BatchOcAlarmTips.vue'
  import { retry } from '@utils/common'
  export default {
    components: { CommandFeedback, BatchOcAlarmTips },
    inject: ['rowDeviceInfo'],
    data() {
      return {
        deviceInfo: this.rowDeviceInfo,
        mac: this.rowDeviceInfo.mac,
        equipmentType: this.rowDeviceInfo.equipmentType,
        custColumns8: [
          { type: 'selection', width: 60, align: 'center', fixed: 'left' },
          { title: this.$t('checkStatus1'), width: 130, slot: 'select', fixed: 'left' },
          { title: this.$t('lineName'), slot: 'lineName', width: 130, fixed: 'left' },
          { title: this.$t('wiringMethod'), key: 'gatherTitle', width: 150, fixed: 'left' },
          { title: this.$t('model'), key: 'clearModel', width: 150 },
          { title: this.$t('addrCode'), key: 'addr', width: 150, align: 'center' },
          { title: this.$t('leakageCurrentmA'), key: 'gLd', width: 180 },
          { title: this.$t('temperature1'), slot: 'temperature', width: 220 },
          { title: this.$t('ampere'), slot: 'ampere', width: 220 },
          { title: this.$t('volt'), slot: 'volt', width: 220 },
          { title: this.$t('watt1'), slot: 'watt', width: 220 },
          { title: this.$t('powerFactor'), key: 'gPF', width: 125 },
          { title: this.$t('state'), slot: 'status', width: 150 },
          { title: this.$t('operation'), align: 'center', slot: 'operating', width: 240, fixed: 'right' },
        ],
        channelsData: [],
        pageNo: 1,
        channelsPageSize: 10,
        channels: [],
        titles: [],
        dblFlag: false,
        setTimer: null,
        subItemFlag: false,
        enableNetCtrls: [],
        instructionsFlag: false,
        instructionsData: {},
        subItemOptions: [],
        subItemForm: { type: '' },
        channel: null,
        channelAddr: null,
        setupFlag: false,
        cancelRetry: null,
        toolTipText: this.$t('toolTipText3'),
        tooltipDevice: this.$t('toolTipText4'),
        restoreSettingModal: false,
        selectRestore: '1',
        rowAddr: null,
        threePhaseDetail: false,
        threePhase: { gW: '', aW: '', bW: '', cW: '' },
      }
    },
    methods: {
      async queryChannels() {
        let params = { pageNo: this.pageNo, pageSize: this.channelsPageSize, mac: this.deviceInfo.mac }
        let res = await queryChannels(params)
        if (res.success) {
          this.channelsData = res.datas.map(item => ({
            ...item,
            _checked: false,
            checkValue: !item.disableSelectState,
            _disabled: item.disableSelectState || !item.isSupportOc,
          }))
          this.channels = this.channelsData.filter(item => item._checked).map(item => ({ addr: item.addr, mac: item.mac })) || []
          if (this.dblFlag) {
            this.threePhase = res.datas.find(v => v.addr === this.dblAddr)
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleDblClick(row, index) {
        if (row.title === this.$t('watt')) {
          this.dblFlag = true
          this.threePhase = { ...row }
          this.dblAddr = row.addr
          this.threePhaseDetail = row.lineType === '380' || row.lineType === '180'
        }
      },
      handleSelectionChange(val) {
        if (val.length === 0) {
          if (!this.setTimer) {
            this.setTimer = setInterval(() => {
              this.queryChannels()
            }, 10000)
          }
        } else {
          clearInterval(this.setTimer)
          this.setTimer = null
        }
        const _valList = val.filter(item => item.others.online === 1 && (item.lineType === '220' || item.lineType === '380'))
        this.channels = _valList.map(item => ({ addr: item.addr, mac: item.mac }))
        this.titles = _valList.map(item => item.title)
        this.enableNetCtrls = _valList.map(item => item.enableNetCtrl)
      },
      handleCancel(selection, row) {
        this.channelsData.forEach(item => {
          if (item.addr === row.addr) {
            item._checked = false
          }
        })
      },
      handlEselet(selection, row) {
        this.channelsData.forEach(item => {
          if (item.addr === row.addr) {
            item._checked = true
          }
        })
      },
      handleResetState(row, index) {
        this.channelsData[index].disableSelectState = !row.checkValue
        this.channelsData[index]._disabled = !row.checkValue
        let addrs = this.channelsData.filter(item => item.disableSelectState).map(item => item.addr)
        let params = { mac: row.mac, addrs: addrs ? addrs.join(',') : '' }
        disableSelection(params).then(res => {
          if (res.success) {
            if (res.code === '0') {
              if (!row.checkValue) {
                this.$Message.success({ content: this.$t('noCheckStatus') })
              } else {
                this.$Message.success({ content: this.$t('settingCheckedStatus') })
              }
            }
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleUnlock(row) {
        if (!row.enableNetCtrl && row.localLock) {
          this.$Message.error({ content: this.$t('toolTipText5') })
        }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('toolTipText6'),
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            let params = { cmd: 'ABNORMAL_SWITCH_UNLOCK', mac: row.mac, addr: row.addr }
            const res = await abnormalSwitchUnlock(params)
            if (res.success) {
              this.$Message.success({ content: res.message })
            } else {
              this.$Message.error({ content: res.message })
            }
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('canceled') })
          },
        })
      },
      openRestoeModal(row) {
        this.rowAddr = row.addr
        this.restoreSettingModal = true
        this.isRestoreSetVal = 'lineRestoreSetVal'
      },
      saveReStoreSetting() {
        this.$refs.operationCheckAuth.openModal()
      },
      // $t('restoreFactorySettings')
      callActionDo() {
        if (this.isRestoreSetVal === 'RestoreSetVal') {
          this.saveSetReSore('mac')
        } else if (this.isRestoreSetVal === 'lineRestoreSetVal') {
          this.saveSetReSore('line')
        }
      },
      async saveSetReSore(type) {
        let params = { mac: this.mac, containPlatData: this.selectRestore === '2', nnos: type === 'line' ? this.rowAddr : 0 }
        const res = await restoreFactorySetting(params)
        if (!res.success) {
          return this.$Message.error({ content: res.message })
        }
        this.rowAddr = null
        this.$Message.success({ content: this.$t('commandForSuccess') })
        this.restoreSettingModal = false
      },
      async switcherCtlEvent(mac, addr, opr) {
        let params = [{ mac: mac, addrOptInfos: [{ onOrOff: opr, addrs: [addr] }] }]
        const result = await isAlarmStatus(params)
        if (result.success) {
          let tips = opr ? this.$t('toolTipText7') : this.$t('toolTipText8')
          this.$Modal.confirm({
            title: this.$t('tip'),
            content: result.data && result.data.length ? tips : opr ? this.$t('toolTipText9') : this.$t('toolTipText10'),
            onOk: async () => {
              const res = await changeStatus2(JSON.stringify(params))
              if (res.code === '0') {
                this.$Message.success(this.$t('submitCommand'))
                this.cancelRetry && this.cancelRetry()
                this.cancelRetry = retry(this.queryChannels, 2, 2000, false)
              } else {
                this.$Message.error(res.data[0].mac + res.data[0].msg)
              }
            },
            onCancel: () => {
              this.$Message.info({ content: this.$t('canceled') })
            },
          })
        } else {
          this.$Message.error({ content: result.message })
        }
      },
      // 批量分合闸操作
      async handleChannelsOC(type) {
        const params = [{ mac: this.mac, addrOptInfos: [{ onOrOff: type, addrs: this.channels.map(item => item.addr) }] }]
        const res = await isAlarmStatus(params)
        if (res.success) {
          if (res.data.length > 0) {
            this.$refs.batchOcAlarmTips.openModal(res.data, type, params)
          } else {
            this.$Modal.confirm({
              title: this.$t('tip'),
              content: type ? this.$t('toolTipText11') : this.$t('toolTipText12'),
              onOk: () => {
                this.handleChannelsOcPost(params)
              },
              onCancel: () => {
                this.$Message.info({ content: this.$t('canceled') })
              },
            })
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleChannelsOcPost(params) {
        const res = await changeStatus2(JSON.stringify(params))
        if (res.code === '0') {
          this.cancelRetry && this.cancelRetry()
          this.cancelRetry = retry(this.queryChannels, 2, 2000, false)
          this.$Message.success(this.$t('submitCommand'))
        } else {
          this.opendatas = res.data
        }
      },
      handleInstructions() {
        this.instructionsData = { mac: this.mac, projectCode: this.$store.state.projectCode }
        this.instructionsFlag = true
      },
      async handleEdit(index, e, title) {
        let res = await updateNodeTitle({ mac: e.mac, nodeNo: e.addr, title: title })
        if (res.success) {
          this.$Message.success({ content: this.$t('submitCommand') })
          document.body.dispatchEvent(new Event('mousedown', { bubbles: true, cancelable: true }))
          this.cancelRetry && this.cancelRetry()
          this.cancelRetry = retry(this.queryChannels, 0, 3000, false)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      closeEditPopover(index) {
        document.body.dispatchEvent(new Event('mousedown', { bubbles: true, cancelable: true }))
        this.queryChannels()
      },
      handleShow() {
        clearInterval(this.setTimer)
      },
      async handlesetUp(row) {
        this.subItemForm.type = ''
        this.channel = row
        this.channelAddr = row.addr
        clearInterval(this.setTimer)
        this.setupFlag = true
        const res = await getChannelCategory()
        if (res.data.code === '0') {
          this.subItemOptions = res.data.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryTreePageAuth() {
        let params = { resKeys: 'AUTH_PROJECT_USE,AUTH_PROJECT_USE', operKeys: 'ENERGY_AREA,ENERGY_CATEGORY' }
        const res = await queryPageAuth(params)
        if (res.success) {
          this.bandFlag = res.data[0].result
          this.subItemFlag = res.data[1].result
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleHide() {
        if (this.channelsData.filter(item => item._checked).length === 0) {
          this.setTimer = null
          this.setTimer = setInterval(() => {
            this.queryChannels()
          }, 10000)
        }
      },
      async submitInformation() {
        if (!this.subItemForm.type) return this.$Message.error({ content: this.$t('selectSubItem') })
        if (this.channel.gatherAddr === '-1') {
          this.$Modal.confirm({
            title: this.$t('tip'),
            content: this.$t('toolTipText13'),
            okText: this.$t('confirm'),
            cancelText: this.$t('cancel'),
            onOk: async () => {
              let params = { categoryId: this.subItemForm.type, channelAddr: this.channelAddr, resId: this.deviceInfo.resId }
              const res = await addChannelCategory(params)
              if (res.success) {
                this.$Message.success({ content: res.message })
                this.setupFlag = false
                this.queryChannels()
              } else {
                this.$Message.error({ content: res.message })
              }
            },
            onCancel: () => {
              this.$Message.info({ content: this.$t('canceled') })
            },
          })
        } else {
          let params = { categoryId: this.subItemForm.type, channelAddr: this.channelAddr, resId: this.deviceInfo.resId }
          const res = await addChannelCategory(params)
          if (res.success) {
            this.$Message.success({ content: res.message })
            this.setupFlag = false
            this.queryChannels()
          } else {
            this.$Message.error({ content: res.message })
          }
        }
      },
      handleInformationClose() {
        this.subItemForm.type = ''
        this.setupFlag = false
      },
    },
    mounted() {
      this.queryTreePageAuth()
      this.queryChannels()
    },
    destroyed() {
      this.setTimer && clearInterval(this.setTimer)
      this.cancelRetry && this.cancelRetry()
    },
  }
</script>
<style lang="less" scoped>
  .lines-table {
    padding: 0 15px;
    background: #1a202e;
    padding-bottom: 15px;
    .lines-box-top {
      height: 50px;
      align-items: center;
    }
    .allLine {
      border: 1px solid #414959;
      text-align: center;
      border-radius: 5px;
      height: 28px;
      padding: 5px 30px;
      color: #999999;
    }
    .line {
      text-align: center;
      border: 1px solid #414959;
      width: 100%;
      border-radius: 5px;
      padding: 2px 8px;
      color: #999999;
      flex: 1;
    }
    .grid-content {
      background-color: #1a202e;
      margin-top: 10px;
      border-radius: 5px;
      display: flex;
    }
    .split-line {
      display: flex;
    }
    .verticallyCentered {
      display: inline-block;
      vertical-align: middle;
    }
    .grays {
      background: #1a202e;
    }
    .reds {
      background: rgba(242, 78, 76, 0.1);
      color: #f24e4c;
      border: 1px solid #f24e4c;
    }
    .greens {
      color: #21f27f;
      border: 1px solid #21f27f;
      background: rgba(33, 242, 127, 0.1);
    }
  }
</style>
