<template>
  <div class="chart-group-list">
    <div style="width: 100%" v-if="configuruationFlag">
      <!-- 漏电流 -->
      <Lines :options="leakageCurrentData"></Lines>
      <!-- <LineChart :options="residualCurrent" :onGetEchartsInstance="onGetEchartsInstance"></LineChart> -->
      <!-- 温度 -->
      <div class="temperature-chart" v-if="configuruationFlag">
        <Select class="select-option" v-model="selectTem" multiple style="width: 200px" :max-tag-count="1" placement="bottom" transfer>
          <Option v-for="item in selecTemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Lines :options="temperatureData"></Lines>
      </div>
      <!-- 电压 -->
      <LineChart :options="voltageData" :onGetEchartsInstance="onGetEchartsInstance"></LineChart>
      <!-- 电流 -->
      <Lines :options="currentData"></Lines>
      <!-- 功率 -->
      <Lines :options="powerData"></Lines>
      <!-- 功率因数 -->
      <Lines :options="powerFactorData"></Lines>
    </div>
    <Row style="width: 100%" v-else>
      <!-- 开关输入量图表 -->
      <Col v-for="(item, index) in enterList" :key="`${index}index`" :span="12" class="mantunsci" style="margin: 10px 0">
        <div style="position: relative">
          <span style="position: absolute; left: 30px; top: 20px; color: #dddddd; font-size: 16px">{{ item.name }}</span>
        </div>
        <OpenCloseImitate v-if="item" :options="item.options" :onGetEchartsInstance="onGetEchartsInstance"></OpenCloseImitate>
        <div style="margin-top: -20px; margin-left: 20px">
          <div>{{ $t('stay') }}{{ item.date }}{{ $t('in') }}{{ item.name }}</div>
          <Row style="margin-left: 15px">
            <Col :span="6">
              {{ $t('common') }}
              <span style="color: #f24e4c">OFF</span>
              <span style="margin-left: 5px">{{ item.offCount }}</span>
              {{ $t('second') }}
            </Col>
            <Col :span="16">
              <span>{{ $t('totalDuration') }}{{ parseInt(item.offDuration / 60) }}{{ $t('hours') }}{{ item.offDuration % 60 }}{{ $t('minute1') }}</span>
            </Col>
          </Row>
          <Row style="margin-left: 15px">
            <Col :span="6">
              {{ $t('common') }}
              <span style="color: #0dd667">ON</span>
              <span style="margin-left: 5px">{{ item.onCount }}</span>
              {{ $t('second') }}
            </Col>
            <Col :span="16">
              <span>{{ $t('totalDuration') }}{{ parseInt(item.onDuration / 60) }}{{ $t('hours') }}{{ item.onDuration % 60 }}{{ $t('minute1') }}</span>
            </Col>
          </Row>
        </div>
      </Col>
      <!--开关输出量图表  -->
      <Col v-for="itm in putoutList" :key="`${itm + (Math.random() * 1000).toFixed(2)}inde`" :span="12" class="mantunsci" style="margin: 10px 0">
        <div style="position: relative">
          <span style="position: absolute; left: 30px; top: 20px; color: #dddddd; font-size: 16px">{{ itm.name }}</span>
        </div>
        <OpenCloseImitate v-if="itm" :options="itm.options" :onGetEchartsInstance="onGetEchartsInstance"></OpenCloseImitate>
        <div style="margin-top: -30px; margin-left: 20px">
          <div>{{ $t('stay') }}{{ itm.date }}{{ $t('in') }}{{ itm.name }}</div>
          <Row style="margin-left: 15px">
            <Col :span="6">
              {{ $t('common') }}
              <span style="color: #f24e4c">OFF</span>
              <span style="margin-left: 5px">{{ itm.offCount }}</span>
              {{ $t('second') }}
            </Col>
            <Col :span="16">
              <span>{{ $t('totalDuration') }}{{ parseInt(itm.offDuration / 60) }}{{ $t('hours') }}{{ itm.offDuration % 60 }}{{ $t('minute1') }}</span>
            </Col>
          </Row>
          <Row style="margin-left: 15px">
            <Col :span="6">
              {{ $t('common') }}
              <span style="color: #0dd667">ON</span>
              <span style="margin-left: 5px">{{ itm.onCount }}</span>
              {{ $t('second') }}
            </Col>
            <Col :span="16">
              <span>{{ $t('totalDuration') }}{{ parseInt(itm.onDuration / 60) }}{{ $t('hours') }}{{ itm.onDuration % 60 }}{{ $t('minute1') }}</span>
            </Col>
          </Row>
        </div>
      </Col>
      <!--analogList 808模拟量图表  -->
      <Col v-for="(item, index) in analogList" :key="index" :span="12" style="margin-top: 20px" class="mantunsci">
        <div style="position: relative">
          <div style="position: absolute; right: 0; top: 0">
            <span style="margin-right: 20px">
              <span style="margin-right: 5px" class="box-Lan"></span>
              {{ $t('acquisition') }}{{ item.org.unit }}
            </span>
            <span style="margin-right: 20px">
              <span style="margin-right: 5px" class="box-Red"></span>
              {{ $t('displayValue') }}{{ item.ext.convertUnit }}
            </span>
          </div>
        </div>
        <TcEquipmentLine :options="item.options" ref="residuals" :title="item.org.name" :onGetEchartsInstance="onGetEchartsInstance"></TcEquipmentLine>
        <div style="margin-left: 40px">
          <div>{{ $t('stay') }}{{ item.org.date }}{{ $t('in') }}{{ item.org.name }}</div>
          <div>
            <Row style="margin-left: 10px">
              <Col :span="14">
                {{ $t('acquisition') + $t('stay') }}{{ item.org.max === 0 && item.org.min === 0 ? maxTime[0].substr(10) : item.org.maxOfTime }}{{ $t('maximumReached') }}
                <span style="color: #f24e4c; margin-left: 5px">{{ item.org.max + item.org.unit }}</span>
              </Col>
              <Col :span="10">
                {{ $t('stay') }}{{ item.org.max === 0 && item.org.min === 0 ? maxTime[1].substr(10) : item.org.minOfTime }}{{ $t('minimumReached') }}
                <span style="color: #0dd667">{{ item.org.min + item.org.unit }}</span>
              </Col>
            </Row>
            <Row style="margin-left: 10px">
              <Col :span="14">
                {{ $t('displayValue') + $t('stay') }}{{ item.ext.max === 0 && item.ext.min === 0 ? maxTime[0].substr(10) : item.ext.maxOfTime ? item.ext.maxOfTime : maxTime[0].substr(10) }}{{ $t('maximumReached') }}
                <span style="color: #f24e4c; margin-left: 1px">{{ item.ext.max + item.ext.convertUnit }}</span>
              </Col>
              <Col :span="10">
                {{ $t('stay') }}{{ item.ext.max === 0 && item.ext.min === 0 ? maxTime[1].substr(10) : item.ext.minOfTime }}{{ $t('minimumReached') }}
                <span style="color: #0dd667">{{ item.ext.min + item.ext.convertUnit }}</span>
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import LineChart from '../common/LineChart.vue'
  import Lines from '../common/Lines.vue'
  import TcEquipmentLine from '../common/TcEquipMentLine.vue'
  import OpenCloseImitate from '../common/OpenCloseImitate.vue'
  import { channelHistory } from '@/api/control/index'
  import { instantPowerHistory } from '@/api/console/device.js'
  export default {
    components: { LineChart, Lines, OpenCloseImitate, TcEquipmentLine },
    props: {
      configuruationFlag: {
        type: Boolean,
        default: false,
      },
      addrInfo: {
        type: Object,
        default: () => {},
      },
      dateRange: {
        type: Array,
        default: () => [],
      },
    },
    inject: ['rowDeviceInfo'],
    data() {
      return {
        isInstantPowerPriority: null,
        deviceInfo: this.rowDeviceInfo,
        dataSeriesMap: {
          lstGT: [],
          lstPSDT: [],
          lstPXDT: [],
          lstNSDT: [],
          lstNXDT: [],
          lstASDT: [],
          lstAXDT: [],
          lstBSDT: [],
          lstBXDT: [],
          lstCSDT: [],
          lstCXDT: [],
          ocList: [],
          lstGLd: [],
          lstGV: null,
          lstAV: null,
          lstBV: null,
          lstCV: null,
          lstGA: null,
          lstAA: null,
          lstBA: null,
          lstCA: null,
          lstGW: null,
          lstAT: null,
          lstAW: null,
          lstBW: null,
          lstCW: null,
          lstGPF: null,
          lstAPF: null,
          lstBPF: null,
          lstCPF: null,
        },
        selecTemList: [{ value: 1, label: this.$t('bodyTemperature') }],
        selectTem: [1],
        xAxisData: [],
        lineChartSeriesParams: {
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbolSize: 2,
          markPoint: {
            data: [
              { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], symbolSize: [65, 50], label: { fontSize: 11, align: 'center', padding: [0, 5, 33, 5], color: '#ff4f4f' } },
              { type: 'min', symbolOffset: [0, -30], symbol: this.$func.echartsSymbolMin, label: { color: '#00ba8a', fontSize: 11, align: 'center', padding: [0, 5, 33, 5] } },
            ],
            label: { normal: { show: true } },
          },
        },
        analogList: [],
        enterList: [],
        putoutList: [],
        maxTime: [],
        newPowerData: {
          lstGW: null,
          lstAW: null,
          lstBW: null,
          lstCW: null,
          lstGPF: null,
          lstAPF: null,
          lstBPF: null,
          lstCPF: null,
        },
        newXAxisData: [],
      }
    },
    computed: {
      // 剩余电流
      residualCurrent() {
        return {
          xAxis: this.xAxisData,
          series: [
            { name: `${this.$t('remaining')}${this.$t('mampere')}`, data: this.dataSeriesMap.lstGLd, ...this.lineChartSeriesParams, markPoint: null },
            { name: this.$t('state'), data: this.dataSeriesMap.ocList, color: '#909399', ...this.lineChartSeriesParams, markPoint: [], smooth: false, showAllSymbol: false, symbolSize: 0, lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' } },
          ],
          title: { show: true, text: this.$t('surplusAmpere') },
          legendDisplay: false,
          splitLine: true,
          time: true,
          height: '300px',
        }
      },
      temperatureData() {
        const newTemSeriesList = [
          { data: this.dataSeriesMap.lstGT, name: `${this.$t('deviceBody')}${this.$t('temperature')}(℃)`, color: '#455DDC', lineStyle: { color: '#455DDC' }, ...this.lineChartSeriesParams, markPoint: null },
          { data: this.dataSeriesMap.lstPSDT, name: this.$t('phaselineterminalTem'), color: '#F24E4C', lineStyle: { color: '#F24E4C' }, ...this.lineChartSeriesParams, markPoint: null },
          { data: this.dataSeriesMap.lstPXDT, name: this.$t('PhaselineterbottomTem'), color: '#F24E4C', lineStyle: { color: '#F24E4C' }, ...this.lineChartSeriesParams, markPoint: null },
          { data: this.dataSeriesMap.lstNSDT, name: this.$t('zerolinetertopTem'), color: '#2E95FF', lineStyle: { color: '#2E95FF' }, ...this.lineChartSeriesParams, markPoint: null },
          { data: this.dataSeriesMap.lstNXDT, name: this.$t('zerolineterbottomTem'), color: '#2E95FF', lineStyle: { color: '#2E95FF' }, ...this.lineChartSeriesParams, markPoint: null },
          { data: this.dataSeriesMap.lstASDT, name: this.$t('alinetertopTem'), color: ' #FFA854', lineStyle: { color: ' #FFA854' }, ...this.lineChartSeriesParams, markPoint: null },
          { data: this.dataSeriesMap.lstAXDT, name: this.$t('alineterbototmTem'), color: '#FFA854', lineStyle: { color: '#FFA854' }, ...this.lineChartSeriesParams, markPoint: null },
          { data: this.dataSeriesMap.lstBSDT, name: this.$t('blinetertopTem'), color: '#21F27F', lineStyle: { color: '#21F27F' }, ...this.lineChartSeriesParams, markPoint: null },
          { data: this.dataSeriesMap.lstBXDT, name: this.$t('blineterbotomTem'), color: '#21F27F', lineStyle: { color: '#21F27F' }, ...this.lineChartSeriesParams, markPoint: null },
          { data: this.dataSeriesMap.lstCSDT, name: this.$t('clinetertopTem'), color: '#F24E4C', lineStyle: { color: '#F24E4C' }, ...this.lineChartSeriesParams, markPoint: null },
          { data: this.dataSeriesMap.lstCXDT, name: this.$t('clineterbottomTem'), color: '#F24E4C', lineStyle: { color: '#F24E4C' }, ...this.lineChartSeriesParams, markPoint: null },
          { data: this.dataSeriesMap.ocList, name: this.$t('state'), color: '#909399', lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }, ...this.lineChartSeriesParams, smooth: false, symbolSize: 0, markPoint: null },
        ]
        return {
          xAxis: this.xAxisData,
          series: newTemSeriesList.filter((item, index) => this.selectTem.indexOf(index + 1) > -1),
          title: { show: true, text: this.$t('temperature1') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      // 电压
      voltageData() {
        const textName = `${this.$t('phase')}${this.$t('voltage')}`
        return {
          xAxis: this.xAxisData,
          series: this.dataSeriesMap.lstGV
            ? this.dataSeriesMap.lstAV
              ? [
                  { name: this.$t('voltage'), data: this.dataSeriesMap.lstGV, color: '#455DDC', lineStyle: { color: '#455DDC' }, ...this.lineChartSeriesParams, markPoint: null },
                  { name: `A${textName}`, data: this.dataSeriesMap.lstAV, color: '#FFA854', lineStyle: { color: '#FFA854' }, ...this.lineChartSeriesParams, markPoint: null },
                  { name: `B${textName}`, data: this.dataSeriesMap.lstBV, color: '#21F27F', lineStyle: { color: '#21F27F' }, ...this.lineChartSeriesParams, markPoint: null },
                  { name: `C${textName}`, data: this.dataSeriesMap.lstCV, color: '#F24E4C', lineStyle: { color: '#F24E4C' }, ...this.lineChartSeriesParams, markPoint: null },
                  { name: this.$t('state'), data: this.dataSeriesMap.ocList, color: '#909399', lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }, ...this.lineChartSeriesParams, smooth: false, symbolSize: 0, markPoint: null },
                ]
              : [
                  { name: this.$t('voltage'), data: this.dataSeriesMap.lstGV, color: '#455DDC', lineStyle: { color: '#455DDC' }, ...this.lineChartSeriesParams, markPoint: null },
                  { name: this.$t('state'), data: this.dataSeriesMap.ocList, color: '#909399', lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }, ...this.lineChartSeriesParams, smooth: false, symbolSize: 0, markPoint: null },
                ]
            : [],
          title: { show: true, text: this.$t('voltage') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      // 电流
      currentData() {
        const textName = this.$t('phase') + this.$t('ampere')
        return {
          xAxis: this.xAxisData,
          series: this.dataSeriesMap.lstGA
            ? this.dataSeriesMap.lstAA
              ? [
                  { name: this.$t('ampere'), data: this.dataSeriesMap.lstGA, color: '#e062ea', lineStyle: { color: '#e062ae' }, ...this.lineChartSeriesParams, markPoint: null },
                  { name: `A${textName}`, data: this.dataSeriesMap.lstAA, color: '#71e1e4', lineStyle: { color: '#71e1e4' }, ...this.lineChartSeriesParams, markPoint: null },
                  { name: `B${textName}`, data: this.dataSeriesMap.lstBA, color: '#ffdb5c', lineStyle: { color: '#ffdb5c' }, ...this.lineChartSeriesParams, markPoint: null },
                  { name: `C${textName}`, data: this.dataSeriesMap.lstCA, color: '#c23531', lineStyle: { color: '#c23531' }, ...this.lineChartSeriesParams, markPoint: null },
                ]
              : [
                  { name: this.$t('current'), data: this.dataSeriesMap.lstGA, color: '#455DDC', lineStyle: { color: '#455DDC' }, ...this.lineChartSeriesParams },
                  { name: this.$t('state'), data: this.dataSeriesMap.ocList, color: '#909399', lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }, ...this.lineChartSeriesParams, smooth: false, symbolSize: 0, markPoint: null },
                ]
            : [],
          title: { show: true, text: this.$t('ampere') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      // 功率
      powerData() {
        const textName = `${this.$t('phase')}${this.$t('watt')}`
        const titleName = this.$t('watt1')
        const xAxisPower = this.isInstantPowerPriority ? this.newXAxisData : this.xAxisData
        const seriesPower = this.isInstantPowerPriority ? this.newPowerData : this.dataSeriesMap
        return {
          xAxis: xAxisPower,
          series: seriesPower.lstGW
            ? seriesPower.lstAW
              ? [
                  { name: titleName, data: seriesPower.lstGW, color: '#455DDC', lineStyle: { color: '#455DDC' }, ...this.lineChartSeriesParams, markPoint: null },
                  { name: `A${textName}`, data: seriesPower.lstAW, color: '#FFA854', lineStyle: { color: '#FFA854' }, ...this.lineChartSeriesParams, markPoint: null },
                  { name: `B${textName}`, data: seriesPower.lstBW, color: '#21F27F', lineStyle: { color: '#21F27F' }, ...this.lineChartSeriesParams, markPoint: null },
                  { name: `C${textName}`, data: seriesPower.lstCW, color: '#F24E4C', lineStyle: { color: '#F24E4C' }, ...this.lineChartSeriesParams, markPoint: null },
                ]
              : [{ name: titleName, data: seriesPower.lstGW, color: '#455DDC', lineStyle: { color: '#455DDC' }, ...this.lineChartSeriesParams, markPoint: null }]
            : [],
          title: { show: true, text: titleName },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      powerFactorData() {
        const textName = `${this.$t('phase')}${this.$t('combinedPowerFactor')}`
        return {
          xAxis: this.xAxisData,
          series: this.dataSeriesMap.lstGPF
            ? this.dataSeriesMap.lstAPF
              ? [
                  { name: this.$t('combinedPowerFactor'), data: this.dataSeriesMap.lstGPF, color: '#455DDC', lineStyle: { color: '#455DDC' }, ...this.lineChartSeriesParams, markPoint: [] },
                  { name: `A${textName}`, data: this.dataSeriesMap.lstAPF, color: '#FFA854', lineStyle: { color: '#FFA854' }, ...this.lineChartSeriesParams, markPoint: [] },
                  { name: `B${textName}`, data: this.dataSeriesMap.lstBPF, color: '#21F27F', lineStyle: { color: '#21F27F' }, ...this.lineChartSeriesParams, markPoint: [] },
                  { name: `C${textName}`, data: this.dataSeriesMap.lstCPF, color: '#F24E4C', lineStyle: { color: '#F24E4C' }, ...this.lineChartSeriesParams, markPoint: [] },
                ]
              : [{ name: this.$t('ns_loadConfig.label9'), data: this.dataSeriesMap.lstGPF, color: '#71e1e4', lineStyle: { color: '#71e1e4' }, ...this.lineChartSeriesParams, markPoint: [] }]
            : [],
          title: { show: true, text: this.dataSeriesMap.lstAPF ? this.$t('combinedPowerFactor') : this.$t('ns_loadConfig.label9') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      leakageCurrentData() {
        return {
          xAxis: this.xAxisData,
          series: this.dataSeriesMap.lstGLd ? [{ name: this.$t('leakageCurrentmA'), data: this.dataSeriesMap.lstGLd, ...this.lineChartSeriesParams, markPoint: null }] : [],
          title: { show: true, text: this.$t('leakage') + '(mA)' },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
    },
    mounted() {
      this.isInstantPowerPriority = window.sessionStorage.getItem('isInstantPowerPriority')
    },
    methods: {
      async queryChannelHistory() {
        const params = { mac: this.deviceInfo.mac, addr: this.addrInfo.addr, startTime: this.dateRange[0] || '', endTime: this.dateRange[1] || '' }
        const res = await channelHistory(params)
        if (res.success) {
          this.maxTime = res.data.xAxis
          let xAxis = res.data.xAxis.map(str => str.split(' ')[1])
          this.xAxisData = xAxis
          if (res.data.lineType === 'IO') {
            if (Array.isArray(res.data.analogIns) && res.data.analogIns.length > 0 && Object.keys(res.data.analogIns[0]).length > 0) {
              this.analogList = res.data.analogIns.map((item, index) => {
                return {
                  ...item,
                  options: {
                    xAxis: xAxis,
                    series: [
                      { name: `${this.$t('analogInput')}${index}${this.$t('acquisition')}`, type: 'line', data: item.org.list, smooth: true, color: '#007EFF', showAllSymbol: true, symbolSize: 2 },
                      { name: `${this.$t('analogInput')}${index}${this.$t('displayValue')}`, type: 'line', data: item.ext.list, smooth: true, color: '#0DD667', showAllSymbol: true, symbolSize: 2 },
                    ],
                    title: { show: true, text: '' },
                    legendDisplay: false,
                    splitLine: true,
                    time: true,
                  },
                }
              })
            } else {
              this.analogList = []
            }
            this.enterList = res.data.digitalIns.map(item => {
              return { ...item, options: { time: [...xAxis], data: [...item.list] } }
            })
            this.putoutList = res.data.digitalOuts.map(item => {
              return { ...item, options: { time: [...xAxis], data: [...item.list] } }
            })
          } else {
            this.getselecTemList(res.data.switchType)
            const keys = Object.keys(this.dataSeriesMap)
            for (const key of keys) {
              this.dataSeriesMap[key] = res.data[key] || null
            }
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      onGetEchartsInstance() {},
      async getNewPowerHistoryData() {
        const params = { mac: this.deviceInfo.mac, addr: this.addrInfo.addr, startTime: this.dateRange[0] || '', endTime: this.dateRange[1] || '' }
        const res = await instantPowerHistory(params)
        if (!res.success) {
          return this.$Message.error({ content: res.message })
        }
        this.newXAxisData = res.data.xAxis.map(str => str.split(' ')[1])
        const keys = Object.keys(this.newPowerData)
        for (const key of keys) {
          this.newPowerData[key] = res.data[key] || null
        }
      },
      getselecTemList(val) {
        if (val === 1) {
          this.selecTemList = [
            { value: 1, label: this.$t('bodyTemperature') },
            { value: 2, label: this.$t('Phaselineterminal') },
            { value: 3, label: this.$t('Phaselineterbottom') },
          ]
        } else if (val === 2) {
          this.selecTemList = [
            { value: 1, label: this.$t('bodyTemperature') },
            { value: 2, label: this.$t('Phaselineterminal') },
            { value: 3, label: this.$t('Phaselineterbottom') },
            { value: 4, label: this.$t('zerolinetertop') },
            { value: 5, label: this.$t('zerolineterbottom') },
          ]
        } else if (val === 3) {
          this.selecTemList = [
            { value: 1, label: this.$t('bodyTemperature') },
            { value: 6, label: 'A' + this.$t('Phaselineterminal') },
            { value: 7, label: 'A' + this.$t('Phaselineterbottom') },
            { value: 8, label: this.$t('Blinetertop') },
            { value: 9, label: this.$t('Blineterbotom') },
            { value: 10, label: this.$t('Clinetertop') },
            { value: 11, label: this.$t('Clineterbottom') },
          ]
        } else if (val === 4) {
          this.selecTemList = [
            { value: 1, label: this.$t('bodyTemperature') },
            { value: 6, label: 'A' + this.$t('Phaselineterminal') },
            { value: 7, label: 'A' + this.$t('Phaselineterbottom') },
            { value: 8, label: this.$t('Blinetertop') },
            { value: 9, label: this.$t('Blineterbotom') },
            { value: 10, label: this.$t('Clinetertop') },
            { value: 11, label: this.$t('Clineterbottom') },
            { value: 4, label: this.$t('zerolinetertop') },
            { value: 5, label: this.$t('zerolineterbottom') },
          ]
        }
      },
    },
    watch: {
      dateRange: {
        handler(val) {
          if (val.length > 0) {
            this.queryChannelHistory()
            this.getNewPowerHistoryData()
          }
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .chart-group-list {
    width: 100%;
    .temperature-chart {
      position: relative;
      width: 100%;
      .select-option {
        position: absolute;
        top: 10px;
        right: 0;
        z-index: 1;
      }
    }
  }
</style>
