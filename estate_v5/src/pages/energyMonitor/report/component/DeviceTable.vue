<template>
  <div class="table">
    <div class="device-table">
      <Table v-show="deviceData.list.length" :columns="deviceColumnsLeft" :data="deviceData.list" border class="table-el" :span-method="deviceSpanMethod">
        <template slot-scope="{ row, index }" slot="checking">
          <Checkbox v-model="row.checked" :indeterminate="row.deterDevic" @on-change="getMacChange($event, index, row)">{{ row.checkIndex }}</Checkbox>
        </template>
        <template #macss="{ row }">
          <div>
            <div>{{ row.boxName || '' }}</div>
            <div v-if="row.mac">{{ '(' + row.mac + ')' }}</div>
          </div>
        </template>
        <template #lines="{ row, index }">
          <div class="device-line-style">
            <Checkbox v-model="row.lineChecked" @on-change="selectLineChange($event, index, row, row.addr)"></Checkbox>
            {{ row.addrName + getLineId(row.mac, row.addr) }}
            <span class="in-Line-all">{{ row.isGatherAddr ? $t('directInputLine') : $t('branch') }}</span>
            <span v-if="row.isMainLine" class="is-Main-line">
              <i class="icon-v5 icon-v5-xiangmuzonglu"></i>
              {{ $t('projectMainLine') }}
            </span>
          </div>
        </template>
      </Table>
      <vxe-table border show-overflow show-header-overflow ref="xTable" :data="deviceData.list" :scroll-x="{ enabled: true, gt: 1 }" :scroll-y="{ enabled: false }">
        <vxe-column :title="$t('selectAll')" width="120" fixed="left"></vxe-column>
        <template v-for="column in deviceColumns">
          <vxe-column v-if="!column.children" :key="column.key" v-bind="column" :field="column.key"></vxe-column>
          <vxe-colgroup v-else :key="column.key" :title="column.title" align="center">
            <vxe-column v-for="item in column.children" :key="item.key" v-bind="item" :field="item.key"></vxe-column>
          </vxe-colgroup>
        </template>
      </vxe-table>
    </div>
    <Page @on-change="changePageNo" show-elevator show-total :current="deviceData.pageNo" :page-size="deviceData.pageSize" :total="deviceData.total"></Page>
    <Spin size="large" fix v-if="isLoading">
      <Icon custom="icon-v5 icon-v5-loading-full" class="ivu-anim-loop" size="50" />
      <div style="margin-top: 5px">{{ $t('electricityStatsTips5') }}</div>
    </Spin>
  </div>
</template>

<script>
  import { getLineId } from '@/pages/multiManage/linkageScene/pro/constants'
  import { newPowerReportByBox } from '@/api/multiManage/report'
  import dayjs from 'dayjs'
  export default {
    props: {
      queryParams: { type: Object, default: () => {} },
    },
    data() {
      return {
        isLoading: false,
        deviceData: { list: [], total: 0, pageSize: 10, pageNo: 1 },
        getDataParams: {},
        deviceColumnsLeft: [
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
                    props: { indeterminate: this.indeterminate, value: this.selectAll },
                    on: { 'on-change': val => this.SelectAll(val) },
                  },
                  this.$t('selectAll')
                ),
              ])
            },
          },
          { title: this.$t('deviceMessage'), slot: 'macss', align: 'center', fixed: 'left', className: 'info-column', width: 180 },
          { title: this.$t('lineSituation'), key: 'keys', slot: 'lines', align: 'center', className: 'info-column lines-colum', fixed: 'left', width: 400 },
        ],
      }
    },
    computed: {
      deviceColumns() {
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
          { title: this.$t('deviceMessage'), align: 'center', fixed: 'left', key: 'boxName', className: 'info-column', width: 180 },
          { title: this.$t('lineSituation'), key: 'keys', align: 'center', className: 'info-column lines-colum', fixed: 'left', width: 400 },
          ...newArr,
          { title: this.$t('totalElectricityConsumption3'), align: 'center', key: 'totalPower', className: 'info-column', fixed: 'right', width: 120 },
        ]
      },
      allSelected() {
        return this.deviceData.list.filter(v => v.lineChecked).map(j => ({ resId: j.resId, addrs: j.addr }))
      },
      selectAll() {
        return this.allSelected.length === this.deviceData.list.length
      },
      indeterminate() {
        return this.allSelected.length > 0 && !this.selectAll
      },
    },
    methods: {
      getLineId,
      deviceSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === 1) {
          const preRow = this.deviceData.list[rowIndex - 1]
          const resIdLength = this.deviceData.list.filter(it => it.resId === row.resId).length
          return !preRow || row.resId !== preRow.resId ? [resIdLength, 1] : [0, 0]
        }
      },
      tableHeaderCellStyle() {
        return {
          borderBottom: '1px solid  #3d3d41 !important',
          borderRight: '1px solid #3d3d41 !important',
        }
      },
      async handleData() {
        this.isLoading = true
        let params = { ...this.queryParams, pageSize: this.deviceData.pageSize, pageNo: this.deviceData.pageNo }
        const res = await newPowerReportByBox(params)
        if (!res.success) return this.$Message.error(res.message)
        this.getDataParams = { ...params }
        this.$emit('returnGetDataParams', this.getDataParams)
        const newData = res.datas.map((v, i) => ({ ...v, checkIndex: i + 1 }))
        const titleArr = res.dynamicColumnTitles.map(item => item.title)
        this.deviceData.list = []
        this.deviceData.total = 0
        if (Array.isArray(newData) && newData.length) {
          const mapData = newData
            .map(v => {
              const chlInfoList = v.chlInfoList.map(j => ({ ...j, checkIndex: v.checkIndex, boxName: v.boxName, mac: v.mac, resId: v.resId, checked: false, deterDevic: false, lineChecked: false }))
              return chlInfoList
            })
            .flat(1)
          mapData.forEach(v => {
            if (Array.isArray(v.powerInfoList) && v.powerInfoList.length) {
              v.powerInfoList.forEach((j, i) => {
                let title = titleArr[i]
                v[`power${title}`] = j.power
                v[`topPeakPower${title}`] = j.topPeakPower
                v[`peakPower${title}`] = j.peakPower
                v[`flatPower${title}`] = j.flatPower
                v[`valleyPower${title}`] = j.valleyPower
              })
            }
          })
          this.deviceData.list = mapData
          this.deviceData.total = res.total
        }
        this.isLoading = false
      },
      SelectAll(val) {
        this.deviceData.list.forEach(item => {
          item.checked = val
          item.lineChecked = val
        })
      },
      getMacChange(val, index, row) {
        this.deviceData.list.forEach(v => {
          if (v.mac === row.mac) {
            v.lineChecked = val
            v.checked = val
            v.deterDevic = false
          }
        })
      },
      selectLineChange(val, index, row, addr) {
        this.deviceData.list[index].lineChecked = val
        const rowMac = this.deviceData.list.filter(v => v.mac === row.mac)
        const rowSelectLine = rowMac.filter(v => v.lineChecked)
        this.deviceData.list.forEach(v => {
          if (v.mac === row.mac) {
            v.checked = rowSelectLine.length > 0
            v.deterDevic = rowSelectLine.length > 0 && rowSelectLine.length < rowMac.length
          }
        })
      },
      changePageNo(e) {
        this.deviceData.pageNo = e
        this.handleData()
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
    position: relative;
    .device-table {
      position: relative;
      .table-el {
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
      }
    }
    /deep/.ivu-spin-fix {
      z-index: 100;
      background-color: #1a202e;
      color: #ffffff;
    }
    .is-Main-line {
      color: #e03c3a;
      background: rgba(224, 60, 58, 0.2);
      border-radius: 4px;
      padding: 2px 5px 0 5px;
    }
    .in-Line-all {
      color: #007eff;
      background: rgba(0, 126, 255, 0.2);
      border-radius: 4px;
      padding: 2px 5px;
      margin: 0 4px;
    }
    .device-line-style {
      display: flex;
    }
  }
</style>
