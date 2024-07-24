<template>
  <div class="trendInform">
    <div>
      <h3>{{ $t('thirtyDayPowerTrend') }}</h3>
      <bar-charts :options="thirdBarOptions"></bar-charts>
    </div>
    <div class="tabs">
      <Tabs value="1" @on-click="handleTabs">
        <TabPane :label="`${$t('unProcessAlarm')}(${unhandTotal})`" name="1">
          <Table :columns="unhandledColumns" :data="UnhandledData">
            <template slot-scope="{ row }" slot="typeNumber">
              <Poptip placement="top" trigger="click" v-if="row.valueDesc !== ''">
                <div slot="content">
                  {{ alarmInfo }}
                </div>
                <i class="icon-v5 icon-v5-nenghaofenxi" @click="handleValue(row.valueDesc)"></i>
              </Poptip>
            </template>
            <template slot-scope="{ row }" slot="passTime">{{ row.passTime }} {{ $t('hour2') }}</template>
            <template slot-scope="{ row }" slot="action">
              <Button type="text" v-if="row.processStatus === 0" @click="handleUrge(row.id)">{{ $t('urge') }}</Button>
              <template v-if="row.processStatus === 0">
                <span class="pointer b-danger" @click="queryMaintenance(row)">{{ $t('notProcessed') }}</span>
              </template>
              <template v-if="row.processStatus === 1">
                <span class="pointer b-yelo" @click="queryMaintenance(row)">{{ $t('processing') }}</span>
              </template>
              <template v-if="row.processStatus === 2">
                <span class="pointer b-success" @click="queryMaintenance(row)">{{ $t('processed') }}</span>
              </template>
            </template>
          </Table>
        </TabPane>
        <TabPane :label="`${$t('todayAlarmCount')} (${todayTotal})`" name="2">
          <Table :columns="unhandledColumns" :data="UnhandledData">
            <template slot-scope="{ row }" slot="typeNumber">
              <Poptip placement="top" trigger="click" v-if="row.valueDesc !== ''">
                <div slot="content">
                  {{ alarmInfo }}
                </div>
                <i class="icon-v5 icon-v5-nenghaofenxi" @click="handleValue(row.valueDesc)"></i>
              </Poptip>
            </template>
            <template slot-scope="{ row }" slot="passTime">{{ row.passTime }} {{ $t('hour2') }}</template>
            <template slot-scope="{ row }" slot="action">
              <Button type="text" v-if="row.processStatus === 0" @click="handleUrge(row.id)">{{ $t('urge') }}</Button>
              <template v-if="row.processStatus === 0">
                <span class="pointer b-danger" @click="queryMaintenance(row)">{{ $t('notProcessed') }}</span>
              </template>
              <template v-if="row.processStatus === 1">
                <span class="pointer b-yelo" @click="queryMaintenance(row)">{{ $t('processing') }}</span>
              </template>
              <template v-if="row.processStatus === 2">
                <span class="pointer b-success" @click="queryMaintenance(row)">{{ $t('processed') }}</span>
              </template>
            </template>
          </Table>
        </TabPane>
      </Tabs>
      <div class="allBtn" @click="handleallData">{{ $t('viewAll') }}>></div>
    </div>
    <div class="paging">
      <Page :total="boxorlineTotal" @on-change="handlePage" />
    </div>
    <Modal id="modal" :title="title" v-model="dialogVisible" @close="closeMaintenance">
      <maintenance-editor v-if="dialogVisible" :maintenanceBoxObj="maintenanceBoxObj" v-on:close-maintenance="closeMaintenance"></maintenance-editor>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import BarCharts from './barCharts.vue'
  import { findMaintenance, alarmUrgePush } from '@/api/control/index'
  import store from '@/store'
  import MaintenanceEditor from '../../pages/safetyMonitor/allWarn/MaintenanceEditor.vue'
  export default {
    components: {
      BarCharts,
      MaintenanceEditor,
    },
    props: {
      unhandTotal: {
        type: Number,
      },
      todayTotal: {
        type: Number,
      },
      boxorlineAlarm: {
        type: Array,
        default() {
          return []
        },
      },
      boxorlineTotal: {
        type: Number,
      },
      details: {
        type: Object,
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
        processStatus: 0,
        dialogVisible: false,
        alarmInfo: '',
        title: '',
        unhandledColumns: [
          {
            title: this.$t('eventId'),
            key: 'id',
          },
          {
            title: this.$t('alarmTime'),
            key: 'dateTime',

            align: 'center',
          },
          {
            title: this.$t('nodeLine'),
            key: 'addrName',

            align: 'center',
          },
          {
            title: this.$t('alarmType'),
            key: 'info',

            align: 'center',
          },
          {
            title: this.$t('numValue'),
            slot: 'typeNumber',
          },
          {
            title: this.$t('spentTime'),
            slot: 'passTime',
          },
          {
            title: this.$t('state'),
            slot: 'action',
            align: 'center',
          },
        ],
        UnhandledData: this.boxorlineAlarm,
        tabsStatus: '1',
        thirdBarOptions: {
          legendStatus: true,
          xAxisType: '',
          yAxisType: '',
          xAxis: [],

          series: [],
          title: {
            show: true,
            text: '',
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            formatter: '{b}<br/>' + this.$t('powerConsumption') + '：{c0}<br/>',
          },
        },
      }
    },
    mounted() {
      this.getlist()
      this.$emit('processStatus', 0)
    },
    watch: {
      boxorlineAlarm: {
        handler(newVal) {
          this.UnhandledData = newVal
        },
      },
      detailData: {
        handler(newVal) {
          this.detailData = newVal
          this.getlist()
        },
      },
    },
    methods: {
      handlePage(val) {
        this.$emit('page', val)
      },
      handleallData() {
        let mac = this.details.mac
        this.$router.push({
          name: 'Alarm',
          params: {
            projectCode: this.$store.state.projectCode,
            typeNumber: '-100',
            mac: mac,
            status: this.tabsStatus === '1' ? '0' : '',
          },
        })
      },
      closeMaintenance() {
        store.dispatch('resetMaintenanceObj')
        this.dialogVisible = false
        this.init()
      },
      handleTabs(val) {
        this.tabsStatus = val
        if (val === '1') {
          this.$emit('processStatus', 0)
        } else {
          this.$emit('processStatus', '')
        }
        // this.$parent.handleBoxOrAddrDetailAlarm()
      },
      // 用电趋势
      getlist() {
        this.thirdBar = true
        let bardata = {
          power: [],
          legend: [],
        }

        if (this.detailData.powerTrendList.length > 12) {
          this.detailData.powerTrendList.forEach((v, i) => {
            bardata.power[i] = v.afterPower
            bardata.legend[i] = v.time
          })
        } else {
          this.detailData.powerTrendList.forEach((v, i) => {
            bardata.power[i] = v.afterPower
            bardata.legend[i] = v.time + this.$t('month')
          })
        }
        this.thirdBarOptions.xAxis = {
          data: bardata.legend,
          axisLabel: {
            formatter: function (value) {
              return value.split('').join('\n')
            },
          },
        }
        // this.thirdBarOptions.xAxis.data = bardata.legend

        this.thirdBarOptions.series = {
          name: this.$t('powerTrend'),
          type: 'bar',
          barMaxWidth: '15',
          data: bardata.power,
          itemStyle: {
            emphasis: { barBorderRadius: 5 },
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                1,
                0,
                0, // 这里不同的排序会出现不同的效果   查看4 渐变规则
                [
                  { offset: 1, color: '#007EFF' }, // 红
                  // 可以加0.2等
                  { offset: 0, color: 'rgba(26, 32, 46,.2)' }, // 黑
                ]
              ),
              barBorderRadius: 0,
            },
          },
        }
        if (this.$func.isSameArray(bardata.power)) {
          this.thirdBarOptions.series.markPoint = {
            data: [
              {
                type: 'max',
                symbol: this.$func.echartsSymbolOverlap,
                symbolOffset: [0, -30],

                label: {
                  fontSize: 11,
                  align: 'center',
                  padding: [0, 5, 33, 5],

                  color: '#007eff',
                },
              },
            ],
            normal: {
              show: true,
            },
          }
        } else {
          this.thirdBarOptions.series.markPoint = {
            data: [
              {
                type: 'max',
                symbol: this.$func.echartsSymbolMax,
                symbolOffset: [0, -30],

                label: {
                  fontSize: 11,
                  align: 'center',
                  padding: [0, 5, 33, 5],

                  color: '#ff4f4f',
                },
              },
              {
                type: 'min',
                symbolOffset: [0, -30],
                symbol: this.$func.echartsSymbolMin,
                label: {
                  color: '#00ba8a',
                  fontSize: 11,
                  align: 'center',

                  padding: [0, 5, 33, 5],
                },
              },
            ],
            label: {
              normal: {
                show: true,
              },
            },
          }
        }
      },
      handleValue(obj) {
        let type = ''
        let signal = ''

        if (obj.elecType) {
          if (obj.elecType === 1) {
            type = this.$t('power')
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
            type = this.$t('illumination') + this.$t('kilowattHour')
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
        } else {
          this.alarmInfo = obj.cAlmCtn
        }
      },
      handleUrge(id) {
        alarmUrgePush({ id: id }).then(res => {
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
        findMaintenance(params).then(res => {
          if (res.success) {
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
      },
    },
  }
</script>
<style lang="less">
  .trendInform {
    margin-top: 20px;
    .tabs {
      position: relative;
      .allBtn {
        position: absolute;
        right: 20px;
        top: 10px;
        color: #03a1e7;
        cursor: pointer;
      }
      .ivu-tabs-bar {
        border-color: #fff;
      }
      .ivu-tabs-tab {
        padding: 16px 18px;
      }

      .ivu-table td {
        border-bottom: 1px solid #fff;
      }

      .ivu-tabs-content {
        // height: 300px;
        // &::-webkit-scrollbar{
        //     display: none;
        // }
      }
      .ivu-table-body {
        overflow: auto;
        height: 250px;
        scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }
        scrollbar-width: none;
      }
    }
  }
</style>
