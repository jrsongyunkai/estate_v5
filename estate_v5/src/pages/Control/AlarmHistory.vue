<template>
  <div>
    <div v-if="loadingShow">
      <div class="loading">
        <div class="load">
          <Icon custom="icon-v5 icon-v5-loading-full" class="ivu-anim-loop" size="50" />
        </div>
      </div>
    </div>
    <div v-else id="alarms">
      <Row :gutter="20" style="margin: 0; padding: 20px">
        <Col style="width: 100%">
          <Row type="flex" justify="space-between">
            <Breadcrumb separator-class="el-icon-arrow-right">
              <BreadcrumbItem class="pointer" @click.native="$router.push({ path: '/Alarm' })" style="color: #7b7b7b">
                {{ $t('back') }}
              </BreadcrumbItem>
              <BreadcrumbItem>{{ $t('alramWarnList') }}</BreadcrumbItem>
              <span>{{ $t('historyData') }}</span>
            </Breadcrumb>
          </Row>

          <Row class="alarms_typeList">
            <Col :span="24">
              <Form :inline="true" :model="quantityForm" class="demo-form-inline" @submit.native.prevent>
                <FormItem class="fl">
                  <span class="ml-20 fs-18" v-if="alarmData.currentMonthAlarmNum">
                    {{ $t('numberOfAlarmsInThisMonth') + '：' + alarmData.currentMonthAlarmNum }}
                  </span>
                  <span class="ml-20 fs-18" v-if="alarmData.lastMonthAlarmNum">
                    {{ $t('numberOfAlarmsInLastMonth') + '：' + alarmData.lastMonthAlarmNum }}
                  </span>
                  <span class="ml-20 fs-18" v-if="alarmData.totalAlarmNum">
                    {{ $t('cumulativeNumberOfAlarms') + '：' + alarmData.totalAlarmNum }}
                  </span>
                </FormItem>
                <Select v-model="project" multiple style="width: 300px; margin: 0 10px" :max-tag-count="1">
                  <Option v-for="item in projectData" :value="item.projectCode" :key="item.projectCode">{{ item.projectName }}</Option>
                </Select>
                <FormItem>
                  <span v-if="$store.state.toPath !== '/Home' && $store.state.toPath !== ''" class="mr-20 fw"></span>
                  <span class="block">
                    <DatePicker :clearable="false" :disabled="jobFlag" :options="options3" v-model="quantityForm.month" value-format="yyyy-MM-dd" type="daterange" :editable="false" :separator="$t('to')" @on-change="handleChangeDate"></DatePicker>
                  </span>
                </FormItem>
                <FormItem>
                  <Input :disabled="jobFlag" v-model="quantityForm.mac" :onkeyup="(quantityForm.mac = quantityForm.mac.replace(/[, ]/g, ''))" @keyup.enter.native="queryQuantity" :placeholder="$t('enterDeviceNo')"></Input>
                </FormItem>
                <FormItem>
                  <Select :clearable="true" v-model="quantityForm.addr" :disabled="jobFlag" v-width="140" :placeholder="$t('lineMacCode')">
                    <Option v-for="it in addrOptions" :key="it.value" :label="it.label" :value="it.value"></Option>
                  </Select>
                </FormItem>

                <FormItem>
                  <Input v-model="quantityForm.jobNumber" :onkeyup="(quantityForm.jobNumber = quantityForm.jobNumber.replace(/[^\d]/g, ''))" @keyup.enter.native="queryQuantity" :placeholder="$t('enterJobNumber')"></Input>
                </FormItem>
                <FormItem style="width: 250px">
                  <Select :max-tag-count="2" :clearable="true" v-model="quantityForm.type" :disabled="jobFlag" @change="handleChange" @visible-change="handleFocus" multiple multiple-limit="3" :placeholder="$t('alarmType')">
                    <Option v-for="item in alarmTypes" :key="item.typeNumber" :label="item.info" :value="item.typeNumber" :disabled="item.disabled"></Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Select :clearable="true" v-model="quantityForm.oqp1" :disabled="jobFlag" class="w-100" :placeholder="$t('state')">
                    <Option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"></Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="queryQuantity">{{ $t('query') }}</Button>
                </FormItem>
                <FormItem>
                  <Button @click="handleReset">{{ $t('reset') }}</Button>
                </FormItem>
                <FormItem>
                  <Dropdown trigger="click" @on-click="handleCommand">
                    <Button>
                      {{ $t('export') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </Button>
                    <DropdownMenu slot="list">
                      <DropdownItem name="current">{{ $t('currentPageData') }}</DropdownItem>
                      <DropdownItem name="all">{{ $t('allData') }}</DropdownItem>
                      <DropdownItem name="statistics">{{ $t('alarmClassification') }}</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
      <div style="padding: 0 30px">
        <Table :data="quantityData" :columns="columns" @on-selection-change="handleSelectionChange">
          <template slot-scope="{ row }" slot="mac">
            <span @click="handleSwitch(row)" class="pointer">{{ row.mac }}</span>
          </template>
          <template slot-scope="{ row }" slot="macname">
            <div>{{ row.name }}</div>
          </template>
          <template slot-scope="{ row }" slot="projectName">
            <span @click="handleSwitch(row, 'project')" class="pointer">{{ row.projectName }}</span>
          </template>
          <template slot-scope="{ row }" slot="value">
            <Poptip placement="top" trigger="click">
              <div slot="content">
                {{ alarmInfo }}
              </div>
              <i class="icon-v5 icon-v5-nenghaofenxi" v-show="row.valueDescribe !== '' && JSON.stringify(row.valueDescribe) !== '{}' && row.valueDescribe.elecType" @click="handleValue(row.valueDescribe)"></i>
            </Poptip>
          </template>
          <template slot-scope="{ row }" slot="action">
            <!-- <Button
          type="text"
          v-if="row.processStatus === 0"
          @click="handleUrge(row.id)"
          >{{$t('urge')}}</Button
        > -->
            <template v-if="row.processStatus === 0">
              <span class="pointer b-danger">{{ $t('notProcessed') }}</span>
              <!--  @click="queryMaintenance(row)" -->
            </template>
            <template v-if="row.processStatus === 1">
              <span class="pointer b-yelo">{{ $t('processing') }}</span>
              <!-- @click="queryMaintenance(row)"  -->
            </template>
            <template v-if="row.processStatus === 2">
              <span class="pointer b-success">{{ $t('processed') }}</span>
              <!-- @click="queryMaintenance(row)"  -->
            </template>
          </template>
        </Table>
      </div>

      <div class="page tc mt-10">
        <Button :disabled="ids.length === 0" @click="handleBatchEdit(ids)">{{ $t('statusProcessed') }}</Button>
        <Button-group>
          <Button @click="handlePage('home')">{{ $t('home') }}</Button>
          <Button icon="el-icon-arrow-left" :disabled="page.length < 1" @click="handlePage('prev')">{{ $t('prev') }}</Button>
          <Button @click="handlePage('next')" :disabled="quantityData.length < quantityPageSize">
            {{ $t('next') }}
            <i class="el-icon-arrow-right el-icon--right"></i>
          </Button>
        </Button-group>
      </div>
      <Modal id="modal" :title="title" v-model="dialogVisible" @close="closeMaintenance">
        <maintenance-editor v-if="dialogVisible" :maintenanceBoxObj="maintenanceBoxObj" v-on:close-maintenance="closeMaintenance"></maintenance-editor>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  import MaintenanceEditor from '../safetyMonitor/allWarn/MaintenanceEditor.vue'
  import {
    // queryAlarmListOfPageById,
    queryHistoryAlarmListOfPage,
    findMaintenance,
    // switchHover,
    alarmHandling,
    alarmHistoryStatisticalNumber,
    // alarmUrgePush,
    alarmHistoryurge4Push,
    queryAlarmForConfig,
  } from '@/api/control/index'
  import qs from 'qs'
  import dayjs from 'dayjs'
  import { projectIndexDB } from '@/plugins/indexDB/index'
  export default {
    data() {
      return {
        projectData: [],
        project: [],
        options3: {
          disabledDate(date) {
            return date && date.valueOf() > dayjs(dayjs().subtract(7, 'month').endOf('month').format('YYYY-MM-DD')).valueOf()
          },
        },
        pathUrl: '',
        loadingShow: true,
        quantityType: '',
        quantityForm: {
          mac: this.$route.params.mac === undefined ? '' : this.$route.params.mac,
          jobNumber: '',
          type: '',
          oqp1: this.$route.params.status === undefined ? '' : this.$route.params.status,
          month: this.$route.params.type === '1' ? [dayjs().subtract(7, 'month').format('YYYY-MM-DD'), dayjs().subtract(7, 'month').endOf('month').format('YYYY-MM-DD')] : [dayjs().subtract(7, 'month').format('YYYY-MM') + '-01', dayjs().subtract(7, 'month').endOf('month').format('YYYY-MM-DD')],
          lastId: '',
          addr: null,
        },
        exportId: 0,
        page: [],
        prevId: '',
        quantityData: [],
        alarmData: [],
        quantityPageSize: 20,
        alarmInfo: [],
        title: '',
        status: [
          { value: '', label: this.$t('whole') },
          { value: '0', label: this.$t('notProcessed') },
          { value: '1', label: this.$t('processing') },
          { value: '2', label: this.$t('processed') },
        ],
        alarmTypes: [],
        ids: [],
        alarmHistory: {},
        maintenanceBoxObj: {},
        dialogVisible: false,
        jobFlag: false,
        columns: [
          { type: 'selection', width: 55, align: 'center' },
          { title: this.$t('eventId'), key: 'id', align: 'center' },
          { title: this.$t('equipmentNo'), slot: 'mac', align: 'center' },
          { title: this.$t('deviceAliases'), slot: 'macname', align: 'center' },
          { title: this.$t('project'), slot: 'projectName', align: 'center' },
          { title: this.$t('position'), key: 'address', align: 'center' },
          { title: this.$t('line'), key: 'channel', align: 'center' },
          { title: this.$t('alarmOrwarningType'), key: 'info', align: 'center' },
          { title: this.$t('time'), key: 'time', align: 'center', sortable: true },
          { title: this.$t('numValue'), slot: 'value', align: 'center' },
          { title: this.$t('state'), slot: 'action', width: 150, align: 'center' },
        ],
        addrOptions: [...new Array(31).fill(undefined).map((it, index) => ({ label: (index + 1).toString().padStart(2, '0'), value: index + 1 }))],
      }
    },
    async created() {
      this.projectData = JSON.parse(await projectIndexDB.getItem('checkedProjectStr'))
    },
    mounted() {
      this.init()
      this.queryConfig()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.fullPath === '/') {
          vm.pathUrl = 'visualScreen'
        } else if (from.fullPath === '/Alarm') {
          vm.pathUrl = 'Alarm'
        } else {
          vm.pathUrl = from.fullPath
        }
      })
    },
    methods: {
      init() {
        this.quantityForm.jobNumber = ''
        if (this.$route.params.typeNumber !== undefined) {
          this.quantityForm.type = this.$route.params.typeNumber.split(',')
        }
        // function getNextDate (date, day) {
        //     var dd = new Date(date);
        //     dd.setDate(dd.getDate() + day);
        //     var y = dd.getFullYear();
        //     var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;
        //     var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
        //     return y + '-' + m + '-' + d;
        // };
        // let yestorday = getNextDate(this.$Date().format('YYYY-MM-DD'), -1)
        // if (this.$route.params.type === '-1') {
        //    this.quantityForm.month = [yestorday, yestorday]
        // }
        this.queryAlarm()
        this.queryAlarmHistoryStatisticalNumber()
      },
      queryConfig() {
        queryAlarmForConfig({})
          .then(res => {
            this.alarmTypes = res.data.alarms.concat(res.data.warns)
            this.alarmTypes.unshift({ typeNumber: '-100', info: this.$t('allAlarm') }, { typeNumber: '-200', info: this.$t('allWarn') })
            if (this.$route.query.projectCode) {
              this.quantityForm.type = this.$route.query.status
            }
            this.loadingShow = false
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      queryQuantity() {
        this.page = []
        this.quantityForm.lastId = ''
        this.queryAlarm()
      },
      queryAlarm() {
        let params = {}
        let projectCode = ''
        if (this.$route.params.projectCode) {
          projectCode = this.$route.params.projectCode
        } else if (this.$store.state.projectCode) {
          projectCode = this.$store.state.projectCode
        } else if (this.project.length > 0) {
          projectCode = `${this.project}`
        } else {
          projectCode = ''
        }
        if (this.jobFlag) {
          params = {
            provinceId: this.$store.state.provinceId,
            cityId: this.$store.state.cityId,
            countryId: this.$store.state.countyId,
            lastId: this.quantityForm.lastId,
            rows: this.quantityPageSize,
            projectCode: projectCode,
            typeNumbers: this.quantityForm.type ? this.quantityForm.type.join(',') : '',
            mac: this.quantityForm.mac ? this.quantityForm.mac : this.$route.params.mac,
            addr: this.quantityForm.addr ? this.quantityForm.addr : this.$route.params.addr,
            jobNumber: this.quantityForm.jobNumber ? this.quantityForm.jobNumber : '',
            oqp1: this.quantityForm.oqp1,
            startTime: this.quantityForm.month[0],
            endTime: this.quantityForm.month[1],
          }
        } else {
          params = {
            provinceId: this.$store.state.provinceId,
            cityId: this.$store.state.cityId,
            countryId: this.$store.state.countyId,
            lastId: this.quantityForm.lastId,
            rows: this.quantityPageSize,
            projectCode: projectCode,
            typeNumbers: this.quantityForm.type ? this.quantityForm.type.join(',') : '',
            mac: this.quantityForm.mac ? this.quantityForm.mac : this.$route.params.mac,
            addr: this.quantityForm.addr ? this.quantityForm.addr : this.$route.params.addr,
            jobNumber: this.quantityForm.jobNumber ? this.quantityForm.jobNumber : '',
            oqp1: this.quantityForm.oqp1,
            startTime: this.quantityForm.month[0],
            endTime: this.quantityForm.month[1],
          }
        }
        if (this.$func.checkDateThreeMonths(params.startTime, params.endTime) === 'false') {
          this.$Message.error({
            content: this.$t('limitThreeMonths'),
          })
          return false
        }
        queryHistoryAlarmListOfPage(params)
          .then(res => {
            if (res.success) {
              this.quantityData = res.data
              if (res.data.length > 0) {
                this.quantityForm.lastId = res.lastId
                this.prevId = res.data[0].id + 1
                this.exportId = res.data[0].id
              } else {
                this.quantityForm.lastId = res.lastId
                this.exportId = 0
              }
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
      },
      handleChange(val) {
        this.alarmTypes.forEach(v => {
          if (val.indexOf('-100') > -1) {
            if (
              v.typeNumber === '1' ||
              v.typeNumber === '2' ||
              v.typeNumber === '3' ||
              v.typeNumber === '4' ||
              v.typeNumber === '5' ||
              v.typeNumber === '6' ||
              v.typeNumber === '7' ||
              v.typeNumber === '8' ||
              v.typeNumber === '11' ||
              v.typeNumber === '17' ||
              v.typeNumber === '18' ||
              v.typeNumber === '19' ||
              v.typeNumber === '53' ||
              v.typeNumber === '54' ||
              v.typeNumber === '56' ||
              v.typeNumber === '57' ||
              v.typeNumber === '62' ||
              v.typeNumber === '63' ||
              v.typeNumber === '1001' ||
              v.typeNumber === '1002' ||
              v.typeNumber === '1005' ||
              v.typeNumber === '2002' ||
              v.typeNumber === '2003' ||
              v.typeNumber === '2004' ||
              v.typeNumber === '2006' ||
              v.typeNumber === '9000' ||
              v.typeNumber === '9001'
            ) {
              v.disabled = true
            }
          } else {
            if (
              v.typeNumber === '1' ||
              v.typeNumber === '2' ||
              v.typeNumber === '3' ||
              v.typeNumber === '4' ||
              v.typeNumber === '5' ||
              v.typeNumber === '6' ||
              v.typeNumber === '7' ||
              v.typeNumber === '8' ||
              v.typeNumber === '11' ||
              v.typeNumber === '17' ||
              v.typeNumber === '18' ||
              v.typeNumber === '19' ||
              v.typeNumber === '53' ||
              v.typeNumber === '54' ||
              v.typeNumber === '56' ||
              v.typeNumber === '57' ||
              v.typeNumber === '62' ||
              v.typeNumber === '63' ||
              v.typeNumber === '1001' ||
              v.typeNumber === '1002' ||
              v.typeNumber === '1005' ||
              v.typeNumber === '2002' ||
              v.typeNumber === '2003' ||
              v.typeNumber === '2004' ||
              v.typeNumber === '2006' ||
              v.typeNumber === '9000' ||
              v.typeNumber === '9001'
            ) {
              v.disabled = false
            }
          }
          if (val.indexOf('-200') > -1) {
            if (
              v.typeNumber === '9' ||
              v.typeNumber === '10' ||
              v.typeNumber === '12' ||
              v.typeNumber === '13' ||
              v.typeNumber === '14' ||
              v.typeNumber === '15' ||
              v.typeNumber === '16' ||
              v.typeNumber === '55' ||
              v.typeNumber === '58' ||
              v.typeNumber === '1003' ||
              v.typeNumber === '1004' ||
              v.typeNumber === '1006'
            ) {
              v.disabled = true
            }
          } else {
            if (
              v.typeNumber === '9' ||
              v.typeNumber === '10' ||
              v.typeNumber === '12' ||
              v.typeNumber === '13' ||
              v.typeNumber === '14' ||
              v.typeNumber === '15' ||
              v.typeNumber === '16' ||
              v.typeNumber === '55' ||
              v.typeNumber === '58' ||
              v.typeNumber === '1003' ||
              v.typeNumber === '1004' ||
              v.typeNumber === '1006'
            ) {
              v.disabled = false
            }
          }
        })
        let arr = ['1', '2', '3', '4', '5', '6', '7', '8', '11', '17', '18', '19', '53', '54', '56', '57', '62', '63', '1001', '1002', '1005', '2002', '2003', '2004', '2006', '9000', '9001']
        if (val.indexOf('-100') > -1) {
          arr.forEach(item => {
            val.forEach((items, index) => {
              if (items === item) {
                val.splice(index, 1)
              }
            })
          })
        }
        let arr1 = ['9', '10', '12', '13', '14', '15', '16', '55', '58', '1003', '1004', '1006']
        if (val.indexOf('-200') > -1) {
          arr1.forEach(item => {
            val.forEach((items, index) => {
              if (items === item) {
                val.splice(index, 1)
              }
            })
          })
        }
      },
      handleFocus() {
        this.alarmTypes.forEach(v => {
          if (this.quantityForm.type.indexOf('-100') > -1) {
            if (
              v.typeNumber === '1' ||
              v.typeNumber === '2' ||
              v.typeNumber === '3' ||
              v.typeNumber === '4' ||
              v.typeNumber === '5' ||
              v.typeNumber === '6' ||
              v.typeNumber === '7' ||
              v.typeNumber === '8' ||
              v.typeNumber === '11' ||
              v.typeNumber === '17' ||
              v.typeNumber === '18' ||
              v.typeNumber === '19' ||
              v.typeNumber === '53' ||
              v.typeNumber === '54' ||
              v.typeNumber === '56' ||
              v.typeNumber === '57' ||
              v.typeNumber === '62' ||
              v.typeNumber === '63' ||
              v.typeNumber === '1001' ||
              v.typeNumber === '1002' ||
              v.typeNumber === '1005' ||
              v.typeNumber === '2002' ||
              v.typeNumber === '2003' ||
              v.typeNumber === '2004' ||
              v.typeNumber === '2006' ||
              v.typeNumber === '9000' ||
              v.typeNumber === '9001'
            ) {
              v.disabled = true
            }
          } else {
            if (
              v.typeNumber === '1' ||
              v.typeNumber === '2' ||
              v.typeNumber === '3' ||
              v.typeNumber === '4' ||
              v.typeNumber === '5' ||
              v.typeNumber === '6' ||
              v.typeNumber === '7' ||
              v.typeNumber === '8' ||
              v.typeNumber === '11' ||
              v.typeNumber === '17' ||
              v.typeNumber === '18' ||
              v.typeNumber === '19' ||
              v.typeNumber === '53' ||
              v.typeNumber === '54' ||
              v.typeNumber === '56' ||
              v.typeNumber === '57' ||
              v.typeNumber === '62' ||
              v.typeNumber === '63' ||
              v.typeNumber === '1001' ||
              v.typeNumber === '1002' ||
              v.typeNumber === '1005' ||
              v.typeNumber === '2002' ||
              v.typeNumber === '2003' ||
              v.typeNumber === '2004' ||
              v.typeNumber === '2006' ||
              v.typeNumber === '9000' ||
              v.typeNumber === '9001'
            ) {
              v.disabled = false
            }
          }
          if (this.quantityForm.type.indexOf('-200') > -1) {
            if (
              v.typeNumber === '9' ||
              v.typeNumber === '10' ||
              v.typeNumber === '12' ||
              v.typeNumber === '13' ||
              v.typeNumber === '14' ||
              v.typeNumber === '15' ||
              v.typeNumber === '16' ||
              v.typeNumber === '55' ||
              v.typeNumber === '58' ||
              v.typeNumber === '1003' ||
              v.typeNumber === '1004' ||
              v.typeNumber === '1006'
            ) {
              v.disabled = true
            }
          } else {
            if (
              v.typeNumber === '9' ||
              v.typeNumber === '10' ||
              v.typeNumber === '12' ||
              v.typeNumber === '13' ||
              v.typeNumber === '14' ||
              v.typeNumber === '15' ||
              v.typeNumber === '16' ||
              v.typeNumber === '55' ||
              v.typeNumber === '58' ||
              v.typeNumber === '1003' ||
              v.typeNumber === '1004' ||
              v.typeNumber === '1006'
            ) {
              v.disabled = false
            }
          }
        })
      },
      queryAlarmHistoryStatisticalNumber() {
        let params = this.alarmHistory
        alarmHistoryStatisticalNumber(params)
          .then(res => {
            if (res.data) {
              this.alarmData = res.data
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

      handleValue(obj) {
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
        }
        if (obj.elecType === 9) {
          this.alarmInfo = [`${type}(${obj.unit1}): ${obj.value1},\xa0${signal}(${obj.unit2}): ${obj.value2}`]
        } else if (obj.elecType === 8) {
          this.alarmInfo = [
            `${type}(${obj.unit}): ${obj.value} ${obj.elecType === 8 ? '' : '(' + this.$t('threshold') + ':' + obj.threshold + ')'}`,
            `${obj.groundWire !== undefined ? this.$t('groundState') + ': ' + (obj.groundWire === 0 ? this.$t('normal') : this.$t('abnormal')) : ''}`,
            `${obj.spd !== undefined ? 'SPD: ' + (obj.spd === 0 ? this.$t('normal') : this.$t('abnormal')) : ''}`,
            `${obj.occurTime ? this.$t('surgeTime') + ': ' + (obj.occurTime ? obj.occurTime : '') : ''}`,
          ]
        } else if (obj.elecType === 10) {
          this.alarmInfo = `${type}: ${obj.value}${obj.unit + 'RH'} ${'(' + this.$t('threshold') + ':' + obj.threshold + ')'}`
        } else if (obj.elecType === 11) {
          this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${'(' + this.$t('threshold') + ':' + obj.threshold + ')'}`
        } else if (obj.elecType === 12) {
          this.alarmInfo = `${type}: ${obj.value + 'Lux'} ${'(' + this.$t('threshold') + ':' + obj.threshold + ')'}`
        } else if (obj.elecType === 14) {
          this.alarmInfo = `${type}: ${obj.value1 + obj.unit1}`
        } else {
          this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${'(' + this.$t('threshold') + ':' + obj.threshold + ')'}`
        }
      },
      handleReset() {
        this.quantityForm.month = []
        this.quantityForm.mac = ''
        this.quantityForm.addr = null
        this.quantityForm.jobNumber = ''
        this.quantityForm.type = ''
        this.quantityForm.oqp1 = ''
      },
      handleChangeDate(item) {
        this.page = []
        this.quantityForm.lastId = ''
        this.quantityForm.month = item
      },
      handlePage(e) {
        if (e === 'home') {
          this.quantityForm.lastId = ''
          this.page = []
        } else if (e === 'prev') {
          this.quantityForm.lastId = this.page.pop()
        } else if (e === 'next') {
          this.page.push(this.prevId)
        }
        store.commit('quantityPage', this.page)
        this.queryAlarm()
      },
      handleSizeChange(val) {
        this.page = []
        this.quantityForm.lastId = ''
        this.quantityPageSize = val
        store.commit('quantityPageSize', val)
        this.queryAlarm()
      },
      queryMaintenance(obj) {
        if (obj.processStatus === 0) {
          this.title = this.$t('createWorkOrder')
        } else if (obj.processStatus === 1) {
          this.title = this.$t('editWorkOrder')
        } else {
          this.title = this.$t('workOrderDetails')
        }
        let params = {
          mac: obj.mac,
          alarmId: obj.id,
          id: '',
        }
        findMaintenance(params)
          .then(res => {
            if (res.success) {
              if (this.page.length === 0) {
                this.quantityForm.lastId = ''
              } else {
                this.quantityForm.lastId = this.prevId
              }
              store.commit('maintenanceObj', res.data)
              store.commit('alarmId', obj.id)
              this.maintenanceBoxObj = obj
              this.dialogVisible = true
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
          .catch(res => {
            this.$Message.error({
              content: this.$t('unknown'),
            })
          })
      },
      handleCommand(command) {
        if (this.$func.checkDateThreeMonths(this.quantityForm.month[0], this.quantityForm.month[1]) === 'false') {
          this.$Message.error({
            content: this.$t('limitThreeMonths'),
          })
          return false
        }
        if (command === 'statistics') {
          const params = {
            oqp1: this.quantityForm.month[0],
            oqp2: this.quantityForm.month[1],
            mac: this.quantityForm.mac,
            jobNumber: this.quantityForm.jobNumber,
            typeNumbers: `${this.quantityForm.type}`,
            processStatus: this.quantityForm.oqp1,
            startTime: this.quantityForm.month[0],
            endTime: this.quantityForm.month[1],
          }
          if (this.quantityForm.addr) params.addr = this.quantityForm.addr
          this.$func.windowCountDown(`/project/main/v2/xls/es/statisticalOfBoxAlarmClassified.as?${qs.stringify(params)}`)
        } else {
          let projectCode = ''
          if (this.$route.params.projectCode) {
            projectCode = this.$route.params.projectCode
          } else if (this.$store.state.projectCode) {
            projectCode = this.$store.state.projectCode
          } else if (this.project.length > 0) {
            projectCode = `${this.project}`
          } else {
            projectCode = ''
          }
          let exportType = command === 'current' ? 'exportCurrent' : ''
          let params = {
            projectCode: projectCode,
            provinceId: this.$store.state.provinceId ? this.$store.state.provinceId : '',
            cityId: this.$store.state.cityId ? this.$store.state.cityId : '',
            countyId: this.$store.state.countyId ? this.$store.state.countyId : '',
            mac: this.quantityForm.mac,
            typeNumbers: `${this.quantityForm.type}`,
            lastId: this.exportId,
            rows: this.quantityPageSize,
            oqp1: this.quantityForm.oqp1 ? this.quantityForm.oqp1 : '',
            startTime: String(this.quantityForm.month[0]),
            endTime: String(this.quantityForm.month[1]),
            exportType,
          }
          if (this.quantityForm.addr) params.addr = this.quantityForm.addr
          this.$func.windowCountDown(`/alarm/history/xls/exportAlarmListOfPage.as?${qs.stringify(params)}`)
        }
      },

      handleSwitch(obj, type) {
        var path = '/console/device'
        if (type !== 'project') {
          store.commit('equipmentType', obj.equipmentType)
          store.commit('overviewMac', obj.mac)
        } else {
          store.commit('equipmentType', 1)
          store.commit('overviewMac', '')
        }
        this.$func.switchToProject(obj, path)
      },
      handleSelectionChange(val) {
        this.ids = []
        val.forEach(item => {
          this.ids.push(item.id)
        })
      },
      handleBatchEdit(ids) {
        alarmHandling({ id: ids.join(','), isSolve: 1 })
          .then(res => {
            if (res.success) {
              this.quantityForm.lastId = ''
              this.$Message.success({
                content: res.message,
              })
              this.queryAlarm()
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
      },
      closeMaintenance() {
        store.dispatch('resetMaintenanceObj')
        this.dialogVisible = false
        this.init()
      },
      handleUrge(id) {
        alarmHistoryurge4Push({ id: id }).then(res => {
          if (res.code === '0') {
            this.$Message.success({
              content: res.message,
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
    },
    watch: {
      '$store.state.location': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.queryAlarm()
          }
        },
        deep: true,
      },
      $route: {
        handler(to, from) {
          if (to.path === '/Alarm') {
            if (from.path === '/Home') {
              this.quantityForm.jobNumber = ''
              this.alarmHistory = {}
            } else if (from.path === '/InnerMain/Overview') {
              this.alarmHistory = {
                projectCode: this.$route.params.projectCode,
              }
            }
            if (from.path === '/MaintenanceBox') return false
            this.quantityForm.lastId = ''
            this.quantityForm.oqp1 = this.$route.params.status
            this.quantityForm.jobNumber = ''
            this.quantityForm.mac = this.$route.params.mac ? this.$route.params.mac : ''
            if (this.$route.params.type === '2') {
              // this.quantityForm.month = [
              //     this.$func.formatDate(
              //         'yyyy-MM-dd',
              //         new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              //     ),
              //     this.$func.getNowFormatDate()
              // ];
            } else {
              if (this.$route.params.oqp2 === 2) {
                // this.quantityForm.month = [
                //     this.$route.params.oqp2 === 2
                //         ? this.$func.formatDate(
                //             'yyyy-MM-dd',
                //             new Date(
                //                 new Date().getFullYear(),
                //                 new Date().getMonth(),
                //                 1
                //             )
                //         )
                //         : this.$func.getNowFormatDate(),
                //     this.$func.getNowFormatDate()
                // ];
              } else {
                // this.quantityForm.month = [
                //     this.$func.getNowFormatDate(),
                //     this.$func.getNowFormatDate()
                // ];
              }
            }
            this.queryAlarm()
            this.queryAlarmHistoryStatisticalNumber()
          }
        },
      },
      '$route.params.typeNumber': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.quantityForm.type = newVal.split(',')
            this.queryAlarm()
          }
        },
        deep: true,
      },
      'quantityForm.jobNumber': {
        handler(newVal, oldVal) {
          if (newVal.length > 0) {
            this.jobFlag = true
          } else {
            this.jobFlag = false
          }
        },
        deep: true,
      },
    },
    components: {
      MaintenanceEditor,
    },
  }
</script>
<style lang="less" scoped>
  /deep/.ivu-dropdown-item {
    width: 150px;
  }

  .alarms_typeList {
    width: 100%;
    background: #1c202c;
    padding: 10px;
    margin-top: 10px;
    .ivu-form-item {
      margin-bottom: 0;
    }
  }
  .page {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    button {
      margin-right: 20px;
    }
  }
  /deep/.ivu-select-dropdown-list {
    text-align: left;
    width: 100px;
  }
  /deep/.ivu-modal-footer {
    border: none;
  }
  .title {
    padding: 5px;
    border: 1px solid #73757a;
    color: #73757a;
    margin: 10px 0;
  }
  .loading {
    background: url('../../assets/images/loading.png') no-repeat;
    .load {
      margin: 50px auto;
      text-align: center;
    }
  }
</style>
