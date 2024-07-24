<template>
  <div id="record-list">
    <div class="theader">
      <div class="left">
        <div class="bor"></div>
        <span>{{ $t('alarmList1') }}</span>
      </div>
      <div class="right">
        <Button v-if="equipmentType === 27" type="primary" ghost @click="resfreshData">{{ $t('refresh') }}</Button>
        <Button class="ml-10" type="primary" @click="handleMore" ghost>{{ $t('viewAll') }}</Button>
      </div>
    </div>
    <Col ref="box" style="overflow: hidden">
      <Table v-if="![26, 27].includes(equipmentType)" :data="tableData" height="200" :columns="columns" style="width: 100%; margin-top: 10px">
        <template slot-scope="{ row }" slot="others.address">
          <span class="pointer">{{ row.others.address }}</span>
        </template>
        <template slot-scope="{ row }" slot="valueDescribe">
          <Poptip :content="alarmInfo">
            <i class="icon-v5 icon-v5-View" v-show="row.others.valueDescribe !== '' && JSON.stringify(row.valueDescribe) !== '{}' && row.others.valueDescribe.elecType" @click="handleValue(row.others.valueDescribe, row)"></i>
          </Poptip>
        </template>
        <template slot-scope="{ row }" slot="others.progress">
          <Progress :text-inside="true" :stroke-width="18" :show-text="false" :class="row.processStatus === 2 ? 'solved' : 'rejected'" :percent="100" v-if="row.others.progress > 100"></Progress>
          <Progress :text-inside="true" :stroke-width="18" :show-text="false" :class="row.processStatus === 2 ? 'solved' : 'rejected'" :percent="row.others.progress"></Progress>
        </template>
        <template slot-scope="{ row }" slot="others.passTime">
          <span :class="row.passTime === '48' ? 'danger-text' : 'warning-text'">{{ row.others.passTime + $t('hours') }}</span>
        </template>
        <template slot-scope="{ row }" slot="processStatus">
          <Button type="text" v-if="row.processStatus === 0" @click="handleUrge(row.id)">{{ $t('urge') }}</Button>
          <span class="pointer" @click="queryMaintenance(row)" :class="row.processStatus === 0 ? 'c-danger' : row.processStatus === 1 ? 'c-warning' : 'c-success'">{{ row.processStatus === 0 ? $t('notProcessed') : row.processStatus === 1 ? $t('processing') : $t('processed') }}</span>
        </template>
      </Table>
      <Table v-if="[26, 27].includes(equipmentType)" :data="hostOrInfomData" :columns="isHostOrInfomation">
        <template slot-scope="{ row }" slot="addRess">{{ row.others.address }}</template>
        <template slot-scope="{ row }" slot="retunrnLoad">
          <div>{{ row.others.valueDescribe.from === 'loop' ? row.others.valueDescribe.loopName : '' }}</div>
          <!--row.others.valueDescribe.slaveDeviceTypeDesc+'ID('+ +')' -->
          <div>{{ row.others.valueDescribe.from === 'slaveDevice' ? row.others.valueDescribe.slaveDeviceId : '' }}</div>
        </template>
        <template slot-scope="{ row }" slot="alarmValue">{{ row.others.valueDescribe.from === 'slaveDevice' ? row.others.valueDescribe.value + '%LEL' : '-' }}</template>
        <template slot-scope="{ row }" slot="returnType">{{ row.others.valueDescribe.slaveDeviceTypeDesc || '-' }}</template>
        <template slot-scope="{ row }" slot="alarmType">{{ row.others.info }}</template>
        <template slot-scope="{ row }" slot="passTimes">{{ row.others.passTime }}</template>
        <template slot-scope="{ row }" slot="alarmFrom">{{ row.others.valueDescribe.alarmSource }}</template>
        <template slot-scope="{ row }" slot="proAdress">
          <span v-if="row.others.valueDescribe.utSystemType">
            {{
              row.others.valueDescribe.utSystemType +
              '(' +
              row.others.valueDescribe.utSystemAddr +
              ')' +
              (row.others.valueDescribe.utComponentType ? '/' + row.others.valueDescribe.utComponentType : '') +
              (row.others.valueDescribe.utComponentAddr ? '(' + row.others.valueDescribe.utComponentAddr + ')' : '')
            }}
          </span>
        </template>
        <template slot-scope="{ row }" slot="proGress">
          <Progress :text-inside="true" :stroke-width="18" :show-text="false" :class="row.processStatus === 2 ? 'solved' : 'rejected'" :percent="100" v-if="row.others.progress > 100"></Progress>
          <Progress :text-inside="true" :stroke-width="18" :show-text="false" :class="row.processStatus === 2 ? 'solved' : 'rejected'" :percent="row.others.progress"></Progress>
        </template>
        <template slot-scope="{ row }" slot="processStatus">
          <Button type="text" v-if="row.processStatus === 0" @click="handleUrge(row.id)">{{ $t('urge') }}</Button>
          <span class="pointer" @click="queryMaintenance(row)" :class="row.processStatus === 0 ? 'c-danger' : row.processStatus === 1 ? 'c-warning' : 'c-success'">{{ row.processStatus === 0 ? $t('notProcessed') : row.processStatus === 1 ? $t('processing') : $t('processed') }}</span>
        </template>
      </Table>
    </Col>
    <Modal id="modal" :title="$t('editMaintenance')" v-model="dialogVisible" @close="closeMaintenance">
      <maintenance-editor v-if="dialogVisible" v-on:close-maintenance="closeMaintenance" :maintenanceBoxObj="maintenanceBoxObj" @hanleAlarm="hanleClickAlarm"></maintenance-editor>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import store from '@/store'
  import MaintenanceEditor from '@/pages/safetyMonitor/allWarn/MaintenanceEditor.vue'
  import { queryAlarmByBox, findMaintenance, alarmUrgePush } from '@/api/control/index'
  export default {
    props: {
      mac: { type: String },
      equipmentType: { type: Number },
    },
    data() {
      return {
        hostOrInfomData: [],
        tableData: [],
        alarmInfo: '',
        page: 1,
        loadMore: true,
        dialogVisible: false,
        maintenanceBoxObj: {},
        columns: [
          { title: this.$t('eventId'), key: 'id', align: 'center' },
          { title: this.$t('place'), slot: 'others.address', align: 'center' },
          { title: this.$t('alarmTime'), key: 'dateTime', align: 'center' },
          { title: this.$t('nodeLine'), key: 'node', align: 'center' },
          { title: this.$t('alarmType'), key: 'info', align: 'center' },
          { title: this.$t('numValue'), slot: 'valueDescribe', align: 'center' },
          { title: this.$t('progress'), slot: 'others.progress', align: 'center' },
          { title: this.$t('spentTime'), slot: 'others.passTime', align: 'center' },
          { title: this.$t('state'), slot: 'processStatus', width: 200, align: 'center' },
        ],
      }
    },
    mounted() {
      if (this.equipmentType === 26) {
        this.getAlarmList()
      } else if (this.equipmentType === 27) {
        this.getInfoList()
      } else {
        this.init()
      }
    },
    computed: {
      isHostOrInfomation() {
        let hostType = this.equipmentType
        let isHostOrInfomation = []
        if (hostType === 26) {
          isHostOrInfomation = [
            { title: this.$t('eventId'), key: 'autoId', align: 'center' },
            { title: this.$t('alarmTime'), key: 'dateTime', align: 'center' },
            { title: this.$t('place'), slot: 'addRess', align: 'center' },
            { title: this.$t('fromDeviceIdLoop'), slot: 'retunrnLoad', align: 'center' },
            { title: this.$t('deviceType'), slot: 'returnType', align: 'center' },
            { title: this.$t('alarmValue'), slot: 'alarmValue', align: 'center' },
            { title: this.$t('alarmType'), slot: 'alarmType', align: 'center' },
            { title: this.$t('progress'), slot: 'proGress', align: 'center' },
            { title: this.$t('spentTime'), slot: 'passTimes', align: 'center' },
            { title: this.$t('state'), slot: 'processStatus', width: 200, align: 'center' },
          ]
        } else if (hostType === 27) {
          isHostOrInfomation = [
            { title: this.$t('eventId'), key: 'id', align: 'center' },
            { title: this.$t('place'), slot: 'addRess', align: 'center' },
            { title: this.$t('alarmTime'), key: 'dateTime', align: 'center' },
            { title: this.$t('alarmSource'), slot: 'alarmFrom', align: 'center' },
            { title: this.$t('systemAddress1'), slot: 'proAdress', align: 'center' },
            { title: this.$t('alarmType'), slot: 'alarmType', align: 'center' },
            { title: this.$t('progress'), slot: 'proGress', align: 'center' },
            { title: this.$t('spentTime'), slot: 'passTimes', align: 'center' },
            { title: this.$t('state'), slot: 'processStatus', width: 200, align: 'center' },
          ]
        }
        return isHostOrInfomation
      },
    },
    methods: {
      resfreshData() {
        this.getInfoList()
        this.$Message.success({ content: this.$t('refreshSuccessful') })
      },
      init() {
        if (this.$route.path === '/ConfigurationList') return false
        this.queryAlarm(false)
      },
      async queryAlarm(flag) {
        let params = { limit: 10, typeNumbers: '', mac: this.mac }
        const res = await queryAlarmByBox(params)
        if (res.success) {
          if (flag) {
            if (res.datas.length === 0) {
              this.loadMore = false
              return false
            } else {
              this.loadMore = true
            }
            this.tableData = this.tableData.concat(res.datas)
          } else {
            this.tableData = res.data
            this.loadMore = true
          }
        } else {
          this.$Message.error({ message: res.message })
        }
      },
      listenDistance() {
        let that = this
        const selectWrap = document.querySelector('#record-list .el-table__body-wrapper')
        if (selectWrap) {
          selectWrap.addEventListener('scroll', function () {
            const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
            if (scrollDistance === 0 && that.loadMore) {
              setTimeout(() => {
                that.page += 1
                that.queryAlarm(true)
                that.loadMore = false
              }, 1000)
            }
          })
        }
      },
      handleValue(obj, row) {
        let type = ''
        let signal = ''
        if (obj.elecType === 1) {
          type = this.$t('power') + '(W)'
        } else if (obj.elecType === 2) {
          type = this.$t('current') + '(A)'
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
          this.alarmInfo = `${this.$t('proportion1')} : ${obj.value}${obj.unit}${obj.threshold ? '(' + this.$t('threshold') + ':' + obj.threshold + obj.unit + ')' : ''}`
        } else if (obj.elecType === 21) {
          this.alarmInfo = `${this.$t('proportion1')}: ${obj.value}${obj.unit}${obj.threshold ? '(' + this.$t('threshold') + ':' + obj.threshold + obj.unit + ')' : ''}`
        } else if (obj.triggerType) {
          this.alarmInfo = `${this.$t('alarmValue')}:${obj.triggerValue}`
        } else {
          this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${obj.threshold ? '(' + this.$t('threshold') + ':' + obj.threshold + ')' : ''}`
        }
      },
      async getAlarmList() {
        let params = { limit: 10, typeNumbers: '2021,2022', mac: this.mac }
        const res = await queryAlarmByBox(params)
        if (res.success) {
          this.hostOrInfomData = res.data
        }
      },
      async getInfoList() {
        let params = { limit: 10, typeNumbers: '2010,2011,2012,2013,2014,2015,2016', mac: this.mac }
        const res = await queryAlarmByBox(params)
        if (res.success) {
          this.hostOrInfomData = res.data
        }
      },
      handleMore() {
        store.commit('detailsFlagMore', false)
        this.$router.push({
          name: 'Alarm',
          params: { projectCode: this.$store.state.projectCode, mac: this.mac, typeNumber: '-100', status: '', oqp2: '' },
        })
      },
      hanleClickAlarm() {
        this.$emit('clickAlarm')
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
      closeMaintenance() {
        store.dispatch('resetMaintenanceObj')
        this.dialogVisible = false
        if (this.equipmentType === 26) {
          this.getAlarmList()
        } else if (this.equipmentType === 27) {
          this.getInfoList()
        } else {
          this.init()
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
    },
    watch: {
      $route: 'init',
    },
    components: {
      MaintenanceEditor,
    },
  }
</script>
<style lang="less" scoped>
  /deep/.ivu-progress-inner-text {
    width: 40px;
  }
  .icon-gengduo {
    vertical-align: middle;
  }
  /deep/.ivu-modal-footer {
    padding: 0;
  }
</style>
