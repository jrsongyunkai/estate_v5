<template>
  <div class="table">
    <div v-show="showModel === 'table'">
      <div class="table-topology" id="tableReport">
        <Table border :columns="topologyColumnsLeft" v-show="topologyTableData.list.length" :data="topologyTableData.list" :span-method="objectSpanMethod" ref="tableRef" class="elec-table">
          <template slot-scope="{ row, index }" slot="checking">
            <div v-if="row.mac">
              <Checkbox v-model="topologyTableData.list[index].checked" :indeterminate="row.deterDevic" @on-change="getDeviceChange($event, row.mac, row, index)">{{ row.checkIndex }}</Checkbox>
            </div>
            <div v-else></div>
          </template>
          <template slot-scope="{ row }" slot="macss">
            <div>
              <div>{{ row.boxName || '' }}</div>
              <div v-if="row.mac">{{ `(${row.mac})` }}</div>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="lines">
            <div style="display: flex; justify-content: space-between" v-if="row.addr">
              <div style="display: flex">
                <div><Checkbox v-model="topologyTableData.list[index].lineChecked" @on-change="getLineChange($event, topologyTableData.list[index].mac, index, topologyTableData.list[index])"></Checkbox></div>
                <span class="circle-line" v-if="isDrawLine" :id="`badge${row.ttId}`">
                  <span><Badge status="default" :style="{ 'margin-left': `${row.level * 40}px` }" /></span>
                </span>
              </div>
              <div>
                {{ row.addrName + '(' + row.mac + '-' + `${row.addr}`.padStart(2, '0') + ')' }}
                <span class="status-sum-line">{{ row.gatherAddr ? $t('directInputLine') : $t('branch') }}</span>
                <span v-if="row.mainLine" class="status-sum-line-name">
                  <i class="icon-v5 icon-v5-xiangmuzonglu"></i>
                  {{ $t('projectMainLine') }}
                </span>
                <span v-if="row.status === 0" class="status-no-work">{{ $t('abnormal') }}</span>
              </div>
            </div>
            <div v-else style="text-align: right">
              <span style="margin-left: 5px">{{ row.addrName }}</span>
              <!-- TODO 这种依赖接口返回文字的条件处理方式 -->
              <Tooltip placement="top" v-if="row.addrName.includes('合计')" max-width="300" transfer>
                <Icon color="#007EFF" size="16" type="ios-information-circle-outline" style="margin-left: 5px" />
                <div slot="content" style="white-space: normal">
                  <div>{{ proAlltext }}</div>
                </div>
              </Tooltip>
            </div>
          </template>
          <template slot-scope="{ row }" slot="allTotal">{{ row.totalPower || '-' }}</template>
        </Table>
        <vxe-table border show-overflow show-header-overflow ref="xTable" :data="topologyTableData.list" :scroll-x="{ enabled: true, gt: 1 }" :scroll-y="{ enabled: false }">
          <vxe-column :title="$t('selectAll')" width="120" fixed="left"></vxe-column>
          <template v-for="column in topologyColumns">
            <vxe-column v-if="!column.children" :key="column.key" v-bind="column" :field="column.key"></vxe-column>
            <vxe-colgroup v-else :key="column.key" :title="column.title" align="center">
              <vxe-column v-for="item in column.children" :key="item.key" v-bind="item" :field="item.key"></vxe-column>
            </vxe-colgroup>
          </template>
        </vxe-table>
      </div>
      <div class="table-page">
        <span class="page-sum">{{ $t('numberOfTopology', { number: topologyTableData.allNum }) }}</span>
        <Page :current="topologyTableData.pageNo" @on-change="changePageNo" :total="topologyTableData.total" :page-size-opts="[1, 3, 5, 10]" show-sizer @on-page-size-change="changePageSize" />
      </div>
    </div>
    <BarTrendChartView v-if="showModel === 'echart'" :key="chartViewKey" :xAxisData="timeSpanList" :powerList="prjMainPowerList" />
    <Spin size="large" fix v-if="isLoading">
      <Icon custom="icon-v5 icon-v5-loading-full" class="ivu-anim-loop" size="50" />
      <div style="margin-top: 5px">{{ $t('electricityStatsTips5') }}</div>
    </Spin>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import { powerReport } from '@/api/public'
  import { cloneDeep } from 'lodash'
  import { processLevel, processData, drawLine, processAdress, getBadgeAdres } from '../mockData'
  import drawLineMixin from './drawLine'
  import BarTrendChartView from './BarTrendChartView.vue'
  export default {
    props: {
      queryParams: { type: Object, default: () => {} },
      showModel: { type: String, default: 'table' },
    },
    components: { BarTrendChartView },
    mixins: [drawLineMixin],
    data() {
      return {
        proAlltext: this.$t('totalTopologyTips'),
        checkAlles: false,
        checkValue: false,
        topologyColumnsLeft: [
          {
            slot: 'checking',
            width: 120,
            align: 'center',
            fixed: 'left',
            className: 'info-column',
            renderHeader: h => {
              return h('span', { style: { marginLeft: '20px' } }, [
                h(
                  'Checkbox',
                  {
                    props: { indeterminate: this.checkAlles, value: this.checkValue },
                    on: {
                      'on-change': val => {
                        this.changeValue(val)
                      },
                    },
                  },
                  this.$t('selectAll')
                ),
              ])
            },
          },
          { title: this.$t('deviceMessage'), slot: 'macss', align: 'center', fixed: 'left', className: 'info-column', width: 200 },
          { title: this.$t('lineSituation'), key: 'keys', slot: 'lines', align: 'center', className: 'info-column lines-colum', fixed: 'left', width: 560 },
        ],
        topologyTableData: { list: [], total: 0, pageNo: 1, pageSize: 10, allNum: 0 },
        getDataParams: {},
        isLoading: false,
        timeSpanList: [],
        prjMainPowerList: [],
        chartViewKey: Math.random(),
      }
    },
    computed: {
      topologyColumns() {
        const { startTime, endTime, statsType } = this.getDataParams
        let tableTitle = (statsType && this.getAllDate(startTime, endTime, statsType)) || []
        let newArr = tableTitle.map(title => ({
          title: `${title}${this.$t('electricQuantity')}(KW·h)`,
          align: 'center',
          key: `sum${title}`,
          children: [
            { title: this.$t('sharp2'), key: `topPeakPower${title}`, align: 'center', width: 120 },
            { title: this.$t('peak2'), key: `peakPower${title}`, align: 'center', width: 120 },
            { title: this.$t('shoulder'), key: `flatPower${title}`, align: 'center', width: 120 },
            { title: this.$t('valley2'), key: `valleyPower${title}`, align: 'center', width: 120 },
            { title: this.$t('total'), key: `power${title}`, align: 'center', width: 120 },
          ],
        }))
        return [
          { title: this.$t('deviceMessage'), align: 'center', fixed: 'left', key: 'boxName', className: 'info-column', width: 200 },
          { title: this.$t('lineSituation'), key: 'keys', align: 'center', className: 'info-column lines-colum', fixed: 'left', width: 560 },
          ...newArr,
          { title: this.$t('totalElectricityConsumption3'), align: 'center', key: 'totalPower', className: 'info-column', fixed: 'right', width: 120 },
        ]
      },
      mergeCells() {
        let list = []
        this.topologyTableData.list.forEach((row, index) => {
          if (row.macrow) {
            list.push({ row: index, col: 0, rowspan: row.macrow, colspan: 1 })
            list.push({ row: index, col: 1, rowspan: row.macrow, colspan: 1 })
          }
        })
        return list
      },
      isSelected() {
        let isSelected = this.topologyTableData.list.filter(item => item.lineChecked || item.checked)
        return Array.isArray(isSelected) && isSelected.length > 0
      },
      allSelected() {
        return this.topologyTableData.list.filter(item => (item.lineChecked || item.checked) && item.ttId).map(item => ({ ptIds: item.ids, ttIds: item.ttId }))
      },
      isDrawLine() {
        return !this.getDataParams.mac && !this.getDataParams.nodeId
      },
    },
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        // 合并单元格
        if (columnIndex === 0 && column.fixed !== 'right') {
          if (row.macrow) {
            return { rowspan: row.macrow, colspan: 1 }
          } else {
            return { rowspan: 0, colspan: 0 }
          }
        }
        if (columnIndex === 1) {
          if (row.macrow) {
            return { rowspan: row.macrow, colspan: 1 }
          } else {
            return { rowspan: 0, colspan: 0 }
          }
        }
      },
      getAllDate(start, end, statsType) {
        const mapTypes = {
          2: { format: 'YYYY-MM-DD', unit: 'day' },
          3: { format: 'YYYY-MM', unit: 'month' },
          4: { format: 'YYYY', unit: 'year' },
        }
        const startDate = dayjs(start)
        const endDate = dayjs(end)
        const datesArray = []
        let currentDate = startDate
        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, mapTypes[statsType].unit)) {
          datesArray.push(currentDate.format(mapTypes[statsType].format))
          currentDate = currentDate.add(1, mapTypes[statsType].unit)
        }
        return datesArray
      },
      getDeviceChange(val, mac, row, index) {
        this.topologyTableData.list[index].deterDevic = false
        this.topologyTableData.list.forEach((item, i) => {
          if (item.mac === mac && i > index && i < row.macrow + index + 1) {
            item.lineChecked = val
            item.deterDevic = false
          }
        })
        let checedLength = this.topologyTableData.list.filter((item, i) => item.checked && item.macrow).length
        let allmacLength = []
        this.topologyTableData.list.forEach((item, i) => {
          if (item.macrow && !item.addr && i !== this.topologyTableData.list.length - 1) {
            allmacLength.push(i)
          }
        })
        if (checedLength !== allmacLength.length && checedLength !== 0) {
          this.checkAlles = true
        } else if (checedLength === 0) {
          this.checkAlles = false
          this.checkValue = false
        } else if (checedLength === allmacLength.length && checedLength !== 0) {
          this.checkAlles = false
          this.checkValue = true
        }
      },
      getLineChange(val, mac, index, row) {
        let macIndex
        this.topologyTableData.list.forEach((item, i) => {
          if (item.mac === mac && i < index && i >= index - item.macrow) {
            macIndex = i
          }
        })
        let checedLength = this.topologyTableData.list.filter((item, i) => item.lineChecked && item.mac === mac && item.addr && i > macIndex && i < this.topologyTableData.list[macIndex].macrow + macIndex).length
        let macLength = this.topologyTableData.list.filter((item, i) => i > macIndex && i < this.topologyTableData.list[macIndex].macrow + macIndex && item.mac === mac && item.addr).length
        if (checedLength === macLength && checedLength !== 0) {
          this.topologyTableData.list.forEach((item, i) => {
            if (item.mac === mac && item.macrow && i < index && i >= index - item.macrow) {
              item.checked = true
              item.deterDevic = false
            }
          })
        } else if (checedLength !== macLength && checedLength !== 0) {
          this.topologyTableData.list.forEach((item, i) => {
            if (item.mac === mac && item.macrow && i < index && i >= index - item.macrow) {
              item.deterDevic = true
              item.checked = false
            }
          })
        } else if (checedLength === 0) {
          this.topologyTableData.list.forEach((item, i) => {
            if (item.mac === mac && item.macrow && i < index && i >= index - item.macrow) {
              item.deterDevic = false
              item.checked = false
            }
          })
        }
        this.checkValue = this.topologyTableData.list.every(item => item.checked && item.lineChecked)
        let allLength = this.topologyTableData.list.filter(item => item.checked || item.lineChecked).length
        if (!this.checkValue && allLength) {
          this.checkAlles = true
        } else if (allLength === 0) {
          this.checkAlles = false
        }
      },
      changeValue(val) {
        this.checkAlles = false
        this.checkValue = val
        this.topologyTableData.list.forEach(item => {
          item.checked = val
          item.lineChecked = val
        })
      },
      async handleData() {
        this.isLoading = true
        this.clearDrawLine()
        this.topologyTableData.list = []
        let params = { ...this.queryParams, pageSize: this.topologyTableData.pageSize, pageNo: this.topologyTableData.pageNo }
        const res = await powerReport(params)
        if (res.success) {
          this.getDataParams = cloneDeep(params)
          this.$emit('returnGetDataParams', this.getDataParams)
          const dataList = res.datas
          this.topologyTableData.total = res.total
          this.topologyTableData.allNum = dataList.filter(item => item.others.detailVos.length !== 0).length
          if (Array.isArray(dataList) && dataList.length) {
            let pushArr = cloneDeep(dataList)
            let titleArr = res.dynamicColumnTitles.map(item => item.title)
            let prjMainPowerDataVos = res.prjMainPower.dataVos
            pushArr.forEach(item => {
              item.others.detailVos.forEach((v, i) => {
                v['ids'] = item.id
                if (i === item.others.detailVos.length - 1) {
                  v.addrPowers.push({ ...item.others.topologyDetail, mac: '', ids: item.id })
                }
              })
            })
            let newDataes = pushArr
              .map(item => item.others.detailVos)
              .flat()
              .map(itm => ({
                // TODO 这种依赖接口返回文字的条件处理方式
                addrPowers: itm.addrPowers.map(v => ({ ...v, mac: v.addrName.includes('叶子节点电量之和') ? '' : itm.mac, boxName: v.addrName.includes('叶子节点电量之和') ? '' : itm.boxName, ids: itm.ids })),
              }))
              .map(item => item.addrPowers)
              .flat()
            let newData = newDataes.map(item => ({ ...item, deterDevic: false, checked: false, lineChecked: false, keys: item.addrName }))
            let arr = processLevel(newData)
            let mockArr = Array.isArray(arr) && arr.length && processData(arr, 'mac')
            let couts = 0
            mockArr.forEach(item => {
              if (item.macrow && item.mac) {
                couts++
                item['checkIndex'] = couts
              }
              let timeArr = []
              if (Array.isArray(item.dataVos) && item.dataVos.length) {
                item.dataVos.forEach((v, i) => {
                  let titleName = titleArr[i]
                  item[`power${titleName}`] = v.value1
                  item[`deviaTion${titleName}`] = v.value2
                  item[`topPeakPower${titleName}`] = v.topPeakPower
                  item[`peakPower${titleName}`] = v.peakPower
                  item[`flatPower${titleName}`] = v.flatPower
                  item[`valleyPower${titleName}`] = v.valleyPower
                  timeArr.push(titleName)
                })
              }
            })
            prjMainPowerDataVos.forEach((v, i) => {
              let titleName = titleArr[i]
              v[`power${titleName}`] = v.value1
              v[`deviaTion${titleName}`] = v.value2
              v[`topPeakPower${titleName}`] = v.topPeakPower
              v[`peakPower${titleName}`] = v.peakPower
              v[`flatPower${titleName}`] = v.flatPower
              v[`valleyPower${titleName}`] = v.valleyPower
            })
            let sumObj = prjMainPowerDataVos.reduce((sum, item) => {
              return Object.assign(sum, item)
            }, {})
            mockArr.push({ ...sumObj, macrow: 1, addrName: res.prjMainPower.addrName, totalPower: res.prjMainPower.totalPower })
            this.topologyTableData.list = mockArr
          }
          this.timeSpanList = res.dynamicColumnTitles.map(item => item.title)
          this.prjMainPowerList = cloneDeep(res.prjMainPower.dataVos)
          // 添加划线元素
          this.$nextTick(() => {
            if (this.isDrawLine) {
              const tableRef = document.getElementsByClassName('ivu-table-fixed-body')[0].getBoundingClientRect()
              const tableRefOffset = processAdress(tableRef)
              const newAdress = this.topologyTableData.list.map((item, index) => {
                const id = `badge${item.ttId}`
                const badgeRef = document.getElementById(id)
                if (!item.addr) return { ...item, point: '' }
                const badgeRefRect = badgeRef.getBoundingClientRect()
                const point = getBadgeAdres(tableRefOffset, badgeRefRect, item.level * 40)
                return { ...item, point, domId: id }
              })
              drawLine(newAdress)
              this.changeLinStyle()
            }
            this.isLoading = false
          })
          this.chartViewKey = Math.random()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      // 先清除划线元素
      clearDrawLine() {
        const doms = [
          ...Array.from(document.getElementsByClassName('w-line')),
          ...Array.from(document.getElementsByClassName('h-line')),
          ...Array.from(document.getElementsByClassName('line-point')),
          ...Array.from(document.getElementsByClassName('arrow-point')),
          ...Array.from(document.getElementsByClassName('h-line-dashed')),
          ...Array.from(document.getElementsByClassName('w-line-dashed')),
        ]
        doms.forEach(v => {
          v.parentNode && v.parentNode.removeChild(v)
        })
      },
      changePageNo(e) {
        this.topologyTableData.pageNo = e
        this.handleData()
      },
      changePageSize(e) {
        this.topologyTableData.pageSize = e
        this.handleData()
      },
    },
    watch: {
      allSelected: {
        handler(val) {
          this.$emit('selectChange', val)
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .table {
    margin-top: 10px;
    position: relative;
    .table-topology {
      position: relative;
      .elec-table {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
        overflow: unset;
        /deep/.ivu-table td.info-column {
          background-color: #29303e;
          color: #fff;
        }
        /deep/.ivu-table-fixed-header thead tr th {
          padding: 36px 0px;
        }
        /deep/.ivu-table-border:after {
          display: none;
        }
        /deep/ .ivu-table td.lines-colum {
          box-shadow: inset -2px 0px 3px rgba(212, 206, 206, 0.1);
        }
        /deep/ .ivu-checkbox-inner {
          border-color: #999999;
        }
      }
    }
    .status-no-work {
      color: #f59a23;
      background: rgb(76, 60, 44);
      border-radius: 4px;
      padding: 2px 5px;
      margin-left: 10px;
    }
    .status-sum-line-name {
      color: #e03c3a;
      background: rgba(224, 60, 58, 0.2);
      border-radius: 4px;
      padding: 2px 5px;
    }
    .status-sum-line {
      color: #007eff;
      background: rgba(0, 126, 255, 0.2);
      border-radius: 4px;
      padding: 2px 5px;
      margin-right: 4px;
    }
    .table-page {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .page-sum {
        margin-right: 15px;
      }
    }
    /deep/.ivu-spin-fix {
      z-index: 100;
      background-color: #1a202e;
      color: #ffffff;
    }
  }
</style>

<style lang="less">
  .elec-table {
    .ivu-table-fixed-body {
      position: relative !important;
    }
  }
  .loading {
    .load {
      margin: 50px auto;
      text-align: center;
    }
  }
  .ivu-table-fixed {
    margin-bottom: 10px !important;
    height: auto !important;
  }
  .ivu-table-fixed-right {
    margin-bottom: 10px !important;
    height: auto !important;
  }
  .h-line {
    width: 1px;
    background: #999999;
    position: absolute;
    z-index: 100;
  }
  .w-line {
    height: 1px;
    background: #999999;
    position: absolute;
    z-index: 100;
  }
  .h-line-dashed {
    width: 1px;
    background-image: url('../../../../assets/images/dash.png');
    position: absolute;
    z-index: 100;
  }
  .w-line-dashed {
    height: 1px;
    background-image: url('../../../../assets/images/wdash.png');
    position: absolute;
    z-index: 100;
  }
  .line-point {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: #999999;
    position: absolute;
    z-index: 100;
    opacity: 0;
  }
  .ivu-badge-status-dot {
    width: 8px;
    height: 8px;
    background: #999999;
  }
  .arrow-point {
    color: #999999;
    position: absolute;
    z-index: 100;
    background: unset !important;
    transform: scale(0.6);
  }
  .reportPage {
    .mar-b {
      margin-bottom: 15px;
      text-align: right;
    }
    .w100 {
      width: 100px;
    }
  }
  // 设置表格样式
  table.special_table {
    border-collapse: collapse;
    table-layout: fixed;
  }
  .special_table th,
  .special_table td {
    // border: 1px solid #3d3d41;
    padding: 14px 0;
    min-width: 0;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    font-size: 14px;
    color: #fff;
    /* border: none; */
    // border-bottom: 1px solid #1a202e;
    text-align: center;
    border-collapse: collapse;
    /*关键代码*/
    &::before {
      content: ' ';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: #5e656f;
      transform: scaleY(0.5);
    }
    &::after {
      content: ' ';
      position: absolute;
      right: 0;
      top: 0;
      width: 1px;
      height: 100%;
      background-color: #5e656f;
      transform: scaleX(0.5);
    }
  }

  .special_table tbody tr:nth-child(2n-1) {
    background-color: #1a202e;
  }
  .special_table th {
    font-weight: bold;
  }

  .special_table thead {
    color: #fff;
    font-weight: 500;
  }

  .special_table th {
    background-color: #1a202e;
    color: #fff;
    border-collapse: collapse;
  }

  .special_table thead tr {
    background-color: #1a202e;
  }

  .special_table thead tr td {
    color: #fff;
    font-weight: bold;
  }
  .special_table tr {
    background-color: #1a202e;
    color: #fff;
    border-collapse: collapse;
  }

  .special_table tr:hover {
    transition: background-color 0.25s ease;
  }

  .special_table tbody tr:hover {
    background: #1a202e;
  }
  .special_table tbody tr td:first-child {
    min-width: 200px !important;
  }
  .special_table .overflowTitle {
    padding: 0 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    white-space: nowrap;
  }
  .special_table .el-button--mini.is-round span {
    font-size: 12px !important;
  }

  .fixRight thead td:first-child {
    position: sticky;
    left: 0px;
    z-index: 10;
  }
  .fixRight tbody td:first-child {
    position: sticky;
    right: 0px;
    background-color: #29303e;
  }
  .fixRight thead td:nth-child(2) {
    position: sticky;
    left: 200px;
    z-index: 10;
  }
  .fixRight tbody td:nth-child(2) {
    position: sticky;
    right: 0px;
    background-color: #29303e;
  }
  .fixRight thead td:nth-child(3) {
    position: sticky;
    left: 300px;
    z-index: 10;
    box-shadow: 8px 4px 8px #151925;
  }
  .fixRight tbody td:nth-child(3) {
    position: sticky;
    right: 0px;
    background-color: #29303e;
    box-shadow: 8px 4px 8px #151925;
  }
  .fixRight thead td:last-child {
    position: sticky;
    right: 0px;
    box-shadow: -8px 4px 8px #151925;
  }
  .fixRight tbody td:last-child {
    position: sticky;
    right: 0px;
    background-color: #29303e;
    box-shadow: -8px 4px 8px #151925;
  }
  .fixRight tbody tr:nth-child(odd) td:last-child {
    background-color: #29303e;
  }
  .fixRight thead td:first-child {
    position: sticky;
    left: 0px;
  }
  .fixRight tbody td:first-child {
    position: sticky;
    left: 0px;
    background-color: #29303e;
    z-index: 10;
  }
  .fixRight tbody tr:nth-child(odd) td:first-child {
    background-color: #29303e;
  }
  .fixRight thead td:nth-child(2) {
    position: sticky;
    left: 200px;
  }
  .fixRight tbody td:nth-child(2) {
    position: sticky;
    left: 200px;
    background-color: #29303e;
    z-index: 10;
  }
  .fixRight tbody tr:nth-child(odd) td:nth-child(2) {
    background-color: #29303e;
  }
  .fixRight thead td:nth-child(3) {
    position: sticky;
    left: 300px;
  }
  .fixRight tbody td:nth-child(3) {
    position: sticky;
    left: 300px;
    background-color: #29303e;
    z-index: 10;
  }
</style>
