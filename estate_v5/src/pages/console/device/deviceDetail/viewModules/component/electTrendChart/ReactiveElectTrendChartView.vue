<template>
  <div class="mo-item">
    <div class="header">
      <div class="left-title">
        <div class="bor"></div>
        <div>{{ $t('reactiveEnergy') }}</div>
      </div>
      <div class="right-box">
        <RadioGroup class="ml-5" v-model="model" type="button">
          <Radio label="echart"><Icon custom="icon-v5 icon-v5-qushi" size="20" /></Radio>
          <Radio label="table"><Icon custom="icon-v5 icon-v5-liebiao" size="20" /></Radio>
        </RadioGroup>
        <Button type="primary" ghost v-if="model === 'table'" class="ml-5" @click.stop="$emit('exportExcel', 2)">{{ $t('export') }}</Button>
      </div>
    </div>
    <div class="content">
      <ElectTrendChart v-if="model === 'echart'" :options="electTrendData"></ElectTrendChart>
      <div v-else>
        <Table border class="device-wrap-electTrend" :data="tableData" :maxHeight="500" :row-class-name="rowClassName" :columns="electColumnsList" style="width: 100%" :span-method="handleSpan">
          <template #valueSlot="{ row, index, column }">
            <span v-if="index % 3 === 0">{{ column._index === 1 ? `${row.meterQE1}｜${getRateRow(row, 'meterQE1')}` : `${row.meterQE2}｜${getRateRow(row, 'meterQE2')}` }}</span>
            <span v-if="index % 3 === 1">
              {{
                column._index === 1
                  ? `${row.meterQEq1}｜${getRateRow(row, 'meterQEq1')}`
                  : column._index === 4
                  ? `${row.meterQEq2}｜${getRateRow(row, 'meterQEq2')}`
                  : column._index === 7
                  ? `${row.meterQEq3}｜${getRateRow(row, 'meterQEq3')}`
                  : column._index === 10
                  ? `${row.meterQEq4}｜${getRateRow(row, 'meterQEq4')}`
                  : ''
              }}
            </span>
            <span v-if="index % 3 === 2">{{ `${row[column.key]}｜${getRateRow(row, column.key)}` }}</span>
          </template>
        </Table>
        <div style="margin-top: 10px"><Page @on-change="handleCurrentChange" :current="pageNo" :page-size="pageSize" :total="total"></Page></div>
      </div>
    </div>
  </div>
</template>

<script>
  import ElectTrendChart from '../../common/ElectTrendChart.vue'
  import useElectTrendMixin from '../../mixins/useElectTrendMixin'
  import dayjs from 'dayjs'
  export default {
    components: { ElectTrendChart },
    mixins: [useElectTrendMixin],
    data() {
      return {
        echartItem: {
          type: 'bar',
          emphasis: { focus: 'self' },
          encode: {
            x: 1, // 表示维度 1 映射到 x 轴。
            y: 0, // 表示维度 0 映射到 x 轴。
            tooltip: [1, 2], // 表示维度 0,1 会在 tooltip 中显示。
          },
        },
      }
    },
    computed: {
      electColumnsList() {
        const commonSet = { align: 'center', minWidth: 200, slot: 'valueSlot' }
        return [
          { title: this.$t('collectionTime'), key: 'createTime', align: 'center', width: 200, fixed: 'left', className: 'column-time' },
          {
            title: this.$t('combinedReactiveElectricProportionOne'),
            key: 'meterQE1',
            align: 'center',
            children: [
              {
                title: this.$t('firstQuadrantProportion'),
                key: 'meterQEq1',
                align: 'center',
                children: [
                  { title: this.$t('A-firstQuadrantProportion'), key: 'meterQAEq1', ...commonSet },
                  { title: this.$t('B-firstQuadrantProportion'), key: 'meterQBEq1', ...commonSet },
                  { title: this.$t('C-firstQuadrantProportion'), key: 'meterQCEq1', ...commonSet },
                ],
              },
              {
                title: this.$t('secondQuadrantProportion'),
                key: 'meterQEq2',
                align: 'center',
                children: [
                  { title: this.$t('A-secondQuadrantProportion'), key: 'meterQAEq2', ...commonSet },
                  { title: this.$t('B-secondQuadrantProportion'), key: 'meterQBEq2', ...commonSet },
                  { title: this.$t('C-secondQuadrantProportion'), key: 'meterQCEq2', ...commonSet },
                ],
              },
            ],
          },
          {
            title: this.$t('combinedReactiveElectricProportionTwo'),
            key: 'meterQE2',
            align: 'center',
            children: [
              {
                title: this.$t('thirdQuadrantProportion'),
                key: 'meterQEq3',
                align: 'center',
                children: [
                  { title: this.$t('A-thirdQuadrantProportion'), key: 'meterQAEq3', ...commonSet },
                  { title: this.$t('B-thirdQuadrantProportion'), key: 'meterQBEq3', ...commonSet },
                  { title: this.$t('C-thirdQuadrantProportion'), key: 'meterQCEq3', ...commonSet },
                ],
              },
              {
                title: this.$t('fourthQuadrantProportion'),
                key: 'meterQEq4',
                align: 'center',
                children: [
                  { title: this.$t('A-fourthQuadrantProportion'), key: 'meterQAEq4', ...commonSet },
                  { title: this.$t('B-fourthQuadrantProportion'), key: 'meterQBEq4', ...commonSet },
                  { title: this.$t('C-fourthQuadrantProportion'), key: 'meterQCEq4', ...commonSet },
                ],
              },
            ],
          },
        ]
      },
      electTrendData() {
        const meterQE1List = this.electDataList.map(it => this.getDataSetRow(it, 'meterQE1'))
        const meterQE2List = this.electDataList.map(it => this.getDataSetRow(it, 'meterQE2'))
        const emptyLabels = this.electDataList.map(it => [dayjs(it.createTime).format('HH:mm'), 0, 0])
        const meterTopSumList = this.electDataList.map(it => this.getSumRow(it))
        const meterCenterSumList = this.electDataList.map(it => this.getCenterSumRow(it))
        return {
          xAxisUnitName: this.$t('unitKVARH'),
          unit: 'kvar·h',
          yAxisData: this.electDataList.map(it => dayjs(it.createTime).format('HH:mm')),
          seriesData: [
            { name: this.$t('A-phaseFirstQuadrant'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQAEq1')) },
            { name: this.$t('B-phaseFirstQuadrant'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQBEq1')) },
            { name: this.$t('C-phaseFirstQuadrant'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQCEq1')) },
            { name: this.$t('firstQuadrant'), stack: 'center', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQEq1')) },
            { name: this.$t('A-phaseSecondQuadrant'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQAEq2')) },
            { name: this.$t('B-phaseSecondQuadrant'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQBEq2')) },
            { name: this.$t('C-phaseSecondQuadrant'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQCEq2')) },
            { name: this.$t('secondQuadrant'), stack: 'center', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQEq2')) },
            { name: this.$t('A-phaseThirdQuadrant'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQAEq3')) },
            { name: this.$t('B-phaseThirdQuadrant'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQBEq3')) },
            { name: this.$t('C-phaseThirdQuadrant'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQCEq3')) },
            { name: this.$t('thirdQuadrant'), stack: 'center', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQEq3')) },
            { name: this.$t('A-phaseFourthQuadrant'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQAEq4')) },
            { name: this.$t('B-phaseFourthQuadrant'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQBEq4')) },
            { name: this.$t('C-phaseFourthQuadrant'), stack: 'top', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQCEq4')) },
            { name: this.$t('fourthQuadrant'), stack: 'center', ...this.echartItem, data: this.electDataList.map(it => this.getDataSetRow(it, 'meterQEq4')) },
            { name: this.$t('combinedPowerElectricalEnergyOne'), stack: 'bottom', ...this.echartItem, data: meterQE1List },
            { name: this.$t('combinedPowerElectricalEnergyTwo'), stack: 'bottom', ...this.echartItem, data: meterQE2List },
            {
              name: 'label',
              stack: 'top',
              ...this.echartItem,
              emphasis: { focus: 'none' },
              label: { show: true, color: '#fff', precision: 1, position: 'right', formatter: params => +meterTopSumList[params.dataIndex].toFixed(3) },
              data: emptyLabels,
              tooltip: { show: false },
            },
            {
              name: 'label',
              stack: 'center',
              ...this.echartItem,
              emphasis: { focus: 'none' },
              label: { show: true, color: '#fff', precision: 1, position: 'right', formatter: params => +meterCenterSumList[params.dataIndex].toFixed(3) },
              data: emptyLabels,
              tooltip: { show: false },
            },
            {
              name: 'label',
              stack: 'bottom',
              ...this.echartItem,
              emphasis: { focus: 'none' },
              label: { show: true, color: '#fff', precision: 1, position: 'right', formatter: params => +meterQE1List[params.dataIndex][1] + +meterQE2List[params.dataIndex][1] },
              data: emptyLabels,
              tooltip: { show: false },
            },
          ],
        }
      },
    },
    methods: {
      handleSpan({ rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          return rowIndex % 3 === 0 ? [3, 1] : [0, 0]
        }
        if (rowIndex % 3 === 0) {
          return columnIndex === 1 || columnIndex === 7 ? [1, 6] : [0, 0]
        }
        if (rowIndex % 3 === 1) {
          return [1, 4, 7, 10].includes(columnIndex) ? [1, 3] : [0, 0]
        }
      },
      rowClassName(row, index) {
        if (Math.floor(index / 3) % 2 === 0) {
          return index % 3 === 0 ? 'row-first row-odd' : 'row-odd'
        } else {
          return index % 3 === 0 ? 'row-first row-even' : 'row-even'
        }
      },
      getCenterSumRow(row) {
        return +row.meterQEq1 + +row.meterQEq2 + +row.meterQEq3 + +row.meterQEq4
      },
      getSumRow(row) {
        let sum = 0
        let keys = ['meterQAEq1', 'meterQBEq1', 'meterQCEq1', 'meterQAEq2', 'meterQBEq2', 'meterQCEq2', 'meterQAEq3', 'meterQBEq3', 'meterQCEq3', 'meterQAEq4', 'meterQBEq4', 'meterQCEq4']
        for (let index = 0; index < keys.length; index++) {
          const key = keys[index]
          sum += +row[key]
        }
        return sum
      },
      getRateRow(row, key = 'meterQAEq1') {
        let sum = ['meterQE1', 'meterQE2'].includes(key) ? +row.meterQE1 + +row.meterQE2 : ['meterQEq1', 'meterQEq2', 'meterQEq3', 'meterQEq4'].includes(key) ? +row.meterQEq1 + +row.meterQEq2 + +row.meterQEq3 + +row.meterQEq4 : this.getSumRow(row)
        let rate = `${sum ? ((+row[key] / sum) * 100).toFixed(2) : '-'}%`
        return rate
      },
      getDataSetRow(it, key = 'meterPAEp') {
        let rate = this.getRateRow(it, key)
        return [dayjs(it.createTime).format('HH:mm'), it[key] || 0, rate]
      },
    },
    mounted() {},
  }
</script>
