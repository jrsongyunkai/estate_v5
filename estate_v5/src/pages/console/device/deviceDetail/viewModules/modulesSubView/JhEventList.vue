<template>
  <div class="record-list">
    <template v-if="equipmentType === 23 || equipmentType === 24">
      <div class="mo-item">
        <div class="theader">
          <div class="left">
            <div class="bor"></div>
            <span>{{ $t('eventList') }}</span>
          </div>
          <div class="right-Record">
            <Button type="primary" ghost @click.stop="handleMoreAlarm">{{ $t('viewAll') }}</Button>
          </div>
        </div>
        <div>
          <Table :data="alarmData" height="300" :columns="alarmcolumns" style="width: 100%; margin-top: 10px">
            <template slot-scope="{ row }" slot="progress">
              <div v-if="row.others.valueDescribe.classify === -100">{{ row.others.progress }}%</div>
              <div v-else>-</div>
            </template>
            <template slot-scope="{ row }" slot="passTime">
              <div v-if="row.others.valueDescribe.classify === -100">{{ row.others.passTime }}{{ $t('hour2') }}</div>
              <div v-else>-</div>
            </template>
            <template slot-scope="{ row }" slot="processStatus">
              <Button type="text" v-if="row.processStatus === 0" @click="handleUrge(row.id)">{{ $t('urge') }}</Button>
              <span class="pointer" @click="queryMaintenance(row)" :class="row.processStatus === 0 ? 'c-danger' : 'c-success'">{{ row.processStatus === 0 ? $t('notProcessed') : $t('processed') }}</span>
            </template>
          </Table>
        </div>
      </div>
      <div class="mo-item">
        <div class="theader">
          <div class="left">
            <div class="bor"></div>
            <span>{{ $t('operationRecords') }}</span>
          </div>
          <div class="right-Record">
            <Button type="primary" ghost @click.stop="handleMore">{{ $t('viewAll') }}</Button>
          </div>
        </div>
        <div>
          <Table :data="operateData" height="300" :columns="operatecolumns" style="width: 100%; margin-top: 10px">
            <template slot-scope="{ row }" slot="staffName">
              <div>{{ row.operateParams.operator }}</div>
            </template>
            <template slot-scope="{ row }" slot="warm">
              <div>{{ row.operateParams.content.params.WarnMin }}-{{ row.operateParams.content.params.WarnMax }}</div>
            </template>
            <template slot-scope="{ row }" slot="ChgRate">
              <div v-if="row.operateParams.content.params.ChgRate">{{ row.operateParams.content.params.ChgRate }}%</div>
              <div v-else>-</div>
            </template>
            <template slot-scope="{ row }" slot="period">
              <div v-if="row.operateParams.content.params.CollectPeriod">{{ row.operateParams.content.params.CollectPeriod }}</div>
              <div v-else>-</div>
            </template>
            <template slot="result">
              <div>-</div>
            </template>
          </Table>
        </div>
      </div>
    </template>
    <template v-if="equipmentType === 25">
      <div class="theader">
        <div class="left">
          <div class="bor"></div>
          <span>{{ $t('alarmList1') }}</span>
        </div>
        <div class="right-Record">
          <Button type="primary" ghost @click.stop="handleMoreAlarm">{{ $t('viewAll') }}</Button>
        </div>
      </div>
      <div>
        <Table :data="alarmData" height="300" :columns="alarmcolumns" style="width: 100%; margin-top: 10px">
          <template slot-scope="{ row }" slot="address">
            <div>{{ row.others.address }}</div>
          </template>
          <template slot-scope="{ row }" slot="progress">
            <Progress :text-inside="true" :stroke-width="18" :show-text="false" :class="row.processStatus === 2 ? 'solved' : 'rejected'" :percent="100" v-if="row.others.progress > 100"></Progress>
            <Progress :text-inside="true" :stroke-width="18" :show-text="false" :class="row.processStatus === 2 ? 'solved' : 'rejected'" :percent="row.others.progress"></Progress>
          </template>
          <template slot-scope="{ row }" slot="passTime">
            <div>{{ row.others.passTime }}{{ $t('hours') }}</div>
          </template>
          <template slot-scope="{ row }" slot="processStatus">
            <Button type="text" v-if="row.processStatus === 0" @click="handleUrge(row.id)">{{ $t('urge') }}</Button>
            <span class="pointer" @click="queryMaintenance(row)" :class="row.processStatus === 0 ? 'c-danger' : 'c-success'">{{ row.processStatus === 0 ? $t('notProcessed') : $t('processed') }}</span>
          </template>
        </Table>
      </div>
    </template>
    <template v-if="equipmentType === 30">
      <div class="theader">
        <div class="left">
          <div class="bor"></div>
          <span>{{ $t('parameterReporting') }}</span>
        </div>
        <div class="right-Record">
          <Button type="primary" ghost @click.stop="handleMoreAlarm">{{ $t('viewAll') }}</Button>
        </div>
      </div>
      <div>
        <Table :data="noteData.list" height="300" :columns="notecolumns" style="width: 100%; margin-top: 10px">
          <template slot-scope="{ row }" slot="value1">{{ row.value.split('|')[0] }}</template>
          <template slot-scope="{ row }" slot="value2">{{ row.value.split('|')[1] }}</template>
          <template slot-scope="{ row }" slot="value3">{{ row.value.split('|')[2] }}</template>
        </Table>
      </div>
    </template>
    <template>
      <template v-if="[28, 29, 41, 42, 44].includes(equipmentType)">
        <div class="theader">
          <div class="left">
            <div class="bor"></div>
            <span>{{ $t('eventList') }}</span>
          </div>
          <div class="right-Record">
            <Button type="primary" ghost @click.stop="handleMoreAlarm">{{ $t('viewAll') }}</Button>
          </div>
        </div>
        <div>
          <Table :data="alarmData" height="300" :columns="alarmcolumns" style="width: 100%; margin-top: 10px">
            <template slot-scope="{ row }" slot="valueDescribe">
              <Poptip :content="alarmInfo">
                <i class="icon-v5 icon-v5-View" v-show="row.others.valueDescribe !== '' && JSON.stringify(row.valueDescribe) !== '{}' && row.others.valueDescribe.elecType" @click="handleValue(row.others.valueDescribe, row)"></i>
              </Poptip>
            </template>
            <template slot-scope="{ row }" slot="progress">
              <Progress :text-inside="true" :stroke-width="18" :show-text="false" :class="row.processStatus === 2 ? 'solved' : 'rejected'" :percent="100" v-if="row.others.progress > 100"></Progress>
              <Progress :text-inside="true" :stroke-width="18" :show-text="false" :class="row.processStatus === 2 ? 'solved' : 'rejected'" :percent="row.others.progress"></Progress>
            </template>
            <template slot-scope="{ row }" slot="passTime">
              <div>{{ row.others.passTime }}{{ $t('hours') }}</div>
            </template>
            <template slot-scope="{ row }" slot="processStatus">
              <Button type="text" v-if="row.processStatus === 0" @click="handleUrge(row.id)">{{ $t('urge') }}</Button>
              <span class="pointer" @click="queryMaintenance(row)" :class="row.processStatus === 0 ? 'c-danger' : 'c-success'">{{ row.processStatus === 0 ? $t('notProcessed') : $t('processed') }}</span>
            </template>
          </Table>
        </div>
      </template>
      <template v-if="showSpecialHistory.includes(equipmentType)">
        <div class="theader">
          <div class="left">
            <div class="bor"></div>
            <span>{{ $t('operationRecords') }}</span>
          </div>
          <div class="right-Record">
            <Button type="primary" ghost @click.stop="handleMore">{{ $t('viewAll') }}</Button>
          </div>
        </div>
        <div>
          <Table :data="operateData" height="300" :columns="operatecolumns" style="width: 100%; margin-top: 10px">
            <template slot-scope="{ row }" slot="value">
              <div v-if="equipmentType === 40">{{ row.operateParams }}</div>
              <div v-if="equipmentType === 41">{{ LXActionTypeConfig[row.others.type] }}</div>
              <div v-else-if="equipmentType === 42">{{ HMActionTypeConfig[row.operateParams.executionActionType] }}</div>
              <div v-else style="position: relative">
                {{ row.operateParams.type === 0 ? (row.operateParams.value === 0 ? $t('forcedValveClosure') : $t('forcedValveOpen')) : $t('writeTableBase') + '：' + row.operateParams.value + ' m' }}
                <i v-if="row.operateParams.type !== 0" style="position: absolute; top: -4px">3</i>
              </div>
            </template>
            <template slot-scope="{ row }" slot="actionType_desc">
              <div>{{ row.others.source === 1 ? $t('linkage') : $t('manual') }}</div>
            </template>
            <template slot-scope="{ row }" slot="oprType">
              <div>{{ row.others.oprType }}</div>
            </template>
            <template slot-scope="{ row }" slot="result">
              <div v-if="[40].includes(equipmentType)">{{ row.operateResult === '0' ? $t('successfullyIssued') : row.operateResult === '1' ? $t('distributionFailed') : row.operateResult === '2' ? $t('executionSuccessful') : row.operateResult }}</div>
              <!-- 海曼烟感和朗鑫烟感 equipmentType 用remark -->
              <div v-else-if="[41, 42].includes(equipmentType)">{{ row.remark }}</div>
              <div v-else>{{ row.operateResult === '0' ? $t('successfullyIssued') : row.operateResult === '1' ? $t('distributionFailed') : row.operateResult === '2' ? $t('executionSuccessful') : $t('executionFailed') }}</div>
            </template>
            <template slot-scope="{ row }" slot="remark">
              <div>{{ row.remark === '' ? '-' : row.remark }}</div>
            </template>
          </Table>
        </div>
      </template>
      <template v-if="[40].includes(equipmentType)">
        <div class="theader">
          <div class="left">
            <div class="bor"></div>
            <span>{{ $t('operationRecords') }}</span>
          </div>
          <div class="right-Record">
            <Button type="primary" ghost @click.stop="handleMore">{{ $t('viewAll') }}</Button>
          </div>
        </div>
        <div>
          <Table :data="operateData" height="300" :columns="operatecolumns" style="width: 100%; margin-top: 10px">
            <template slot-scope="{ row }" slot="value">
              {{ row.operateParams }}
            </template>
            <template slot-scope="{ row }" slot="result">
              <div>{{ row.operateResult === '0' ? $t('successfullyIssued') : row.operateResult === '1' ? $t('distributionFailed') : row.operateResult === '2' ? $t('executionSuccessful') : row.operateResult }}</div>
            </template>
          </Table>
        </div>
      </template>
    </template>
    <div v-if="equipmentType === 33">
      <div class="theader">
        <div class="left">
          <div class="bor"></div>
          <span>{{ $t('operationRecords') }}</span>
        </div>
        <div class="right-Record">
          <Button type="primary" ghost @click.stop="openviewAll">{{ $t('viewAll') }}</Button>
        </div>
      </div>
      <div>
        <Table :data="airDisnfectorDataList" height="300" :columns="airDisnfectorColumns">
          <template #operateAt="{ row }">
            {{ row.operateAt === 1 ? row.operateParam : row.operateAt === 11 ? $t('linkage') : '' }}
          </template>
          <template #type="{ row }">
            {{ row.isObj ? labelText(row.paramDesc.cmdType) : row.paramDesc }}
          </template>
          <template #detail="{ row }">
            {{ detailLabel(row.paramDesc.cmdType, row.paramDesc.value1, row.paramDesc.value2) }}
          </template>
        </Table>
      </div>
    </div>
    <Modal id="modal" :title="$t('maintenanceEdit')" v-model="dialogVisible" @close="closeMaintenance">
      <maintenance-editor v-if="dialogVisible" v-on:close-maintenance="closeMaintenance" :maintenanceBoxObj="maintenanceBoxObj" @hanleAlarm="hanleClickAlarm"></maintenance-editor>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import MaintenanceEditor from '@/pages/safetyMonitor/allWarn/MaintenanceEditor.vue'
  import { queryOperateLog } from '@/api/index.js'
  import { queryAlarmByBox, chtqdqWaterMeterParameter } from '@/api/public'
  import { alarmUrgePush, findMaintenance } from '@/api/control/index'
  import { operationLogThirdDevice } from '@/api/console/device'
  import { labelText, detailLabel, isJSON } from '@/pages/console/device/mockList'
  import store from '@/store'
  import { getColumns, getAlarmColumns } from './meshConf'
  const LXActionTypeConfig = {
    1: window.$t('remoteMute'),
    2: window.$t('parameterConfiguration'),
    3: window.$t('parameterConfiguration'),
  }
  const HMActionTypeConfig = {
    0: window.$t('unknown2'),
    1: window.$t('silencing'),
    2: window.$t('parameterDistribution'),
  }
  export default {
    components: {
      MaintenanceEditor,
    },
    props: {
      mac: { type: String },
      equipmentType: Number,
    },
    data() {
      return {
        LXActionTypeConfig,
        HMActionTypeConfig,
        showSpecialHistory: [28, 30, 40, 41, 42, 44], // 这些设备equipmentType 显示的操作记录为同一个表格
        noteData: { list: [], total: 0, current: 1, pageSize: 10 },
        airDisnfectorDataList: [],
        airDisnfectorColumns: [
          { title: this.$t('operator'), slot: 'operateAt' },
          { title: this.$t('time'), key: 'createTime' },
          { title: this.$t('executionActionType'), slot: 'type' },
          { title: this.$t('remark'), slot: 'detail' },
        ],
        notecolumns: [
          { title: this.$t('reportingTime'), key: 'acqTime' },
          { title: this.$t('totalUsage'), slot: 'value1' },
          { title: this.$t('settlementCycleUsage'), slot: 'value2' },
          { title: this.$t('remainingAmount'), slot: 'value3' },
        ],
        alarmInfo: '',
        dialogVisible: false,
        eventData: [
          { id: '32838', time: '2023-12-12 12:12:12', type: this.$t('liquidLevelStatus'), detail: this.$t('highLiquidLevelAlarm') },
          { id: '32838', time: '2023-12-12 12:12:12', type: this.$t('liquidLevelStatus'), detail: this.$t('highLiquidLevelAlarm') },
          { id: '32838', time: '2023-12-12 12:12:12', type: this.$t('liquidLevelStatus'), detail: this.$t('highLiquidLevelAlarm') },
          { id: '32838', time: '2023-12-12 12:12:12', type: this.$t('liquidLevelStatus'), detail: this.$t('highLiquidLevelAlarm') },
          { id: '32838', time: '2023-12-12 12:12:12', type: this.$t('liquidLevelStatus'), detail: this.$t('highLiquidLevelAlarm') },
        ],
        eventcolumns: [
          { title: this.$t('eventId'), key: 'id' },
          { title: this.$t('time'), key: 'time' },
          { title: this.$t('eventType'), key: 'type' },
          { title: this.$t('eventInfo'), key: 'detail' },
        ],
        operateData: [],
        operatecolumns: [],
        alarmData: [],
        alarmcolumns: [],
      }
    },
    mounted() {
      if ([23, 24, 28, 30, 40, 41, 42, 44].includes(this.equipmentType)) {
        this.handlequeryOperateLog()
      }
      if (this.equipmentType === 33) {
        this.getAirDisnfectorList()
      }
      this.handlequeryAlarmByBox()
      //
      if (getColumns[this.equipmentType]) {
        this.operatecolumns = getColumns[this.equipmentType]
      }
      if (getAlarmColumns[this.equipmentType]) {
        this.alarmcolumns = getAlarmColumns[this.equipmentType]
      }
      if (this.equipmentType === 30) {
        this.handlechtqdqWaterMeterParameter()
      }
    },
    methods: {
      detailLabel,
      labelText,
      openviewAll() {
        this.$router.push({ name: 'AirDisinfectioOperationLog', params: { mac: this.mac } })
      },
      async handlechtqdqWaterMeterParameter() {
        let params = { pageNum: this.noteData.current, pageSize: this.noteData.pageSize, order: 'desc', startTime: this.$Date().format('YYYY-MM') + '-' + '01', endTime: this.$Date().format('YYYY-MM-DD'), mac: this.mac }
        const res = await chtqdqWaterMeterParameter(params)
        if (res.success) {
          this.noteData.list = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getAirDisnfectorList() {
        const params = { projectCode: this.$store.state.projectCode, mac: this.mac }
        const res = await operationLogThirdDevice(params)
        if (!res.success) {
          return this.$Message.error({ content: res.message })
        }
        this.airDisnfectorDataList = res.data.map(v => ({ ...v, paramDesc: isJSON(v.paramDesc) ? JSON.parse(v.paramDesc) : v.paramDesc, isObj: isJSON(v.paramDesc) }))
      },
      handleValue(obj, row) {
        let type = ''
        let signal = ''
        if (obj.elecType === 1) {
          type = this.$t('watt')
        } else if (obj.elecType === 2) {
          type = this.$t('current')
        } else if (obj.elecType === 3) {
          type = this.$t('leakage')
        } else if (obj.elecType === 4) {
          type = this.$t('temperature')
        } else if (obj.elecType === 5) {
          type = this.$t('voltage')
        } else if (obj.elecType === 8) {
          type = this.$t('lightningCurrent')
        } else if (obj.elecType === 9) {
          signal = this.$t('signal')
          type = this.$t('voltage')
        } else if (obj.elecType === 10) {
          type = this.$t('humidity')
        } else if (obj.elecType === 11) {
          type = this.$t('concentration')
        } else if (obj.elecType === 12) {
          type = this.$t('illuminationCelsius')
        } else if (obj.elecType === 14) {
          type = this.$t('waterQuantity')
        } else if (obj.elecType === 20) {
          type = this.$t('electricQuantity')
        }
        if (obj.elecType === 9) {
          this.alarmInfo = [`${type}(${obj.unit1}): ${obj.value1},\xa0${signal}(${obj.unit2}): ${obj.value2}`]
        } else if (obj.elecType === 8) {
          this.alarmInfo = [
            `${type}(${obj.unit}): ${obj.value} ${obj.elecType === 8 ? '' : obj.threshold ? '(' + this.$t('threshold') + ':' + obj.threshold + ')' : ''}`,
            `${obj.groundWire !== undefined ? this.$t('groundState') + ': ' + (obj.groundWire === 0 ? this.$t('normal') : this.$t('abnormal')) : ''}`,
            `${obj.spd !== undefined ? 'SPD: ' + (obj.spd === 0 ? this.$t('normal') : this.$t('abnormal')) : ''}`,
            `${obj.occurTime ? this.$t('surgeTime') + ': ' + (obj.occurTime ? obj.occurTime : '') : ''}`,
          ]
        } else if (obj.elecType === 10) {
          this.alarmInfo = `${type}: ${obj.value}${obj.unit + 'RH'} ${obj.threshold ? '(' + this.$t('threshold') + ':' + obj.threshold + ')' : ''}`
        } else if (obj.elecType === 11) {
          this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${obj.threshold ? '(' + this.$t('threshold') + ':' + obj.threshold + ')' : ''}`
        } else if (obj.elecType === 12) {
          this.alarmInfo = `${type}: ${obj.value + 'Lux'} ${obj.threshold ? '(' + this.$t('threshold') + ':' + obj.threshold + ')' : ''}`
        } else if (obj.elecType === 14) {
          this.alarmInfo = `${type}: ${obj.value1 + obj.unit1}`
        } else if (obj.elecType === 20) {
          this.alarmInfo = `${type}: ${obj.value + obj.unit}`
        } else if (obj.triggerType) {
          this.alarmInfo = `${this.$t('alarmValue')} :${obj.triggerValue}`
        } else {
          this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${obj.threshold ? '(' + this.$t('threshold') + ':' + obj.threshold + ')' : ''}`
        }
      },
      hanleClickAlarm() {
        this.$emit('clickAlarm')
      },
      closeMaintenance() {
        this.handlequeryAlarmByBox()
        store.dispatch('resetMaintenanceObj')
        this.dialogVisible = false
      },
      async queryMaintenance(obj) {
        let params = { mac: obj.mac, alarmId: obj.id, id: '' }
        const res = await findMaintenance(params)
        if (res.success) {
          store.commit('maintenanceObj', res.data)
          store.commit('alarmId', obj.id)
          this.maintenanceBoxObj = obj
          if (!this.maintenanceBoxObj.equipmentType) this.maintenanceBoxObj.equipmentType = this.equipmentType
          this.dialogVisible = true
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleUrge(id) {
        const res = await alarmUrgePush({ id: id })
        if (res.code === '0') {
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleMoreAlarm() {
        store.commit('detailsFlagMore', false)
        if (this.equipmentType === 30) {
          store.commit('parameterMac', this.mac)
          this.$router.push({ name: 'TuoqParameter' })
        } else {
          this.$router.push({ name: 'Alarm', params: { projectCode: this.$store.state.projectCode, mac: this.mac, typeNumber: '-100', status: '', oqp2: '' } })
        }
      },
      handleMore() {
        store.commit('detailsFlagMore', false)
        this.$router.push({ name: 'Logs', params: { projectCode: this.$store.state.projectCode, mac: this.mac } })
      },
      async handlequeryOperateLog() {
        //  28 30 41 42 44 设备的equipmentType
        const categoryList = {
          28: 7, // 值为不同类型设备 后端所需要的category，具体对应问后端
          30: 8,
          40: 2,
          41: 9,
          42: 10,
        }
        let params = {
          pageNo: 1,
          pageSize: 10,
          order: 'desc',
          startTime: this.$Date().format('YYYY-MM') + '-' + '01',
          endTime: this.$Date().format('YYYY-MM-DD'),
          mac: this.mac,
          staffId: '',
          includeOperateParams: 'yes',
          category: categoryList[this.equipmentType] || 5,
        }
        const res = await queryOperateLog(params)
        if (res.success) {
          if (res.datas) {
            res.datas.forEach(val => {
              val.operateParams = this.equipmentType === 40 ? val.operateParams : JSON.parse(val.operateParams)
            })
            this.operateData = res.datas
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlequeryAlarmByBox() {
        // 23 24 28 29 41 42 44 设备的equipmentType
        const typeNumbersConfig = {
          23: '2043,2044,2045,2046,2047,2048,9004',
          24: '2040,2041,2042,9004',
          28: '2056,2057,2058',
          29: '2016,2047,9001,2002,9003,9004',
        }
        const typeNumbers = [41, 42, 44].includes(this.equipmentType) ? '' : typeNumbersConfig[this.equipmentType] || '2023'
        let params = {
          mac: this.mac,
          typeNumbers,
          limit: '10',
        }
        const res = await queryAlarmByBox(params)
        if (res.success) {
          this.alarmData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .record-list {
    /deep/ .ivu-progress-inner-text {
      width: 40px;
    }
    .mo-item {
      background: #1a202e;
      margin-bottom: 10px;
      padding: 0px 15px;
    }
  }
</style>
