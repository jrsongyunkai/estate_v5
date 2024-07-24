<template>
  <div class="trend-chart">
    <div class="header">
      <div class="left">
        <div class="bor"></div>
        <div class="ml-5">{{ $t('dataTrends') }}</div>
      </div>
      <div class="right">
        <Select v-model="lineNode" style="width: 150px; margin-right: 10px" v-if="[18].includes(deviceInfo.equipmentType)" @on-select="changeNode">
          <Option v-for="item in options" :value="item.nodeId" :key="item.nodeId">{{ item.nodeName }}</Option>
        </Select>
        <DatePicker v-if="deviceInfo.equipmentType === 16" :value="value1" :editable="false" type="daterange" format="yyyy-MM-dd" @on-change="handleDateRangeChange" :clearable="false" transfer style="width: 220px"></DatePicker>
        <DatePicker
          v-else
          style="width: 135px"
          :value="value"
          :type="showDateMonth.includes(deviceInfo.equipmentType) ? 'month' : 'date'"
          @on-change="handleDateChange"
          :disabled="$store.state.dateFlag"
          :editable="false"
          :format="showDateMonth.includes(deviceInfo.equipmentType) ? 'yyyy-MM' : 'yyyy-MM-dd'"
          :placeholder="$t('pleaseSelectDate')"
          :clearable="false"
          transfer></DatePicker>
      </div>
    </div>
    <div class="content">
      <LineChart :options="stralsund" v-if="deviceInfo.equipmentType === 3"></LineChart>
      <LineChart :options="level" v-if="[4].includes(deviceInfo.equipmentType)"></LineChart>
      <LineChart :options="pressure" v-if="[5, 31].includes(deviceInfo.equipmentType)"></LineChart>
      <LineChart :options="flammableGas" v-if="[6, 7].includes(deviceInfo.equipmentType)"></LineChart>
      <LineChart :options="watermoreChart" v-if="deviceInfo.equipmentType === 18"></LineChart>
      <LineChart :options="temperatureSensor" v-if="deviceInfo.equipmentType === 14"></LineChart>
      <LineChart :options="IntelligentWaterMeter" v-if="deviceInfo.equipmentType === 15"></LineChart>
      <div class="chart-group">
        <LineChart v-if="[2, 8].includes(deviceInfo.equipmentType)" :options="residualCurrent"></LineChart>
        <LineChart :options="smokeAlarm" v-if="gasLineChart.includes(deviceInfo.equipmentType)"></LineChart>
        <LineChart :options="combustibleGas" v-if="concentrationLineChart.includes(deviceInfo.equipmentType)"></LineChart>
        <LineChart :options="smokeVoltage" v-if="deviceInfo.equipmentType === 10"></LineChart>
        <template v-if="deviceInfo.equipmentType === 11">
          <LineChart :options="temperatureSensor"></LineChart>
          <LineChart :options="humiditySensor"></LineChart>
        </template>
        <template v-if="deviceInfo.equipmentType === 22">
          <LineChart :options="lightVoltage"></LineChart>
          <LineChart :options="lightCurrnet"></LineChart>
          <LineChart :options="lightPower"></LineChart>
          <LineChart :options="lightListCharts"></LineChart>
        </template>
        <template v-if="[23, 24].includes(deviceInfo.equipmentType)">
          <div>
            <AirTrends :options="JhWaterpressureData"></AirTrends>
            <div style="margin-top: -20px; margin-left: 20px">
              <div class="timer">
                {{ `${$t('atTime', { time: value })}${preData.preName}` }}
              </div>
              <div class="number">
                <div class="max">
                  {{ `${$t('stay')}${preData.preMaxTime}${$t('maximumReached')}` }}
                  <span class="maxnum">{{ preData.preMax }}{{ deviceInfo.equipmentType === 23 ? 'Mpa' : 'mm' }}</span>
                </div>
                <div class="min">
                  {{ `${$t('stay')}${preData.preMinTime}${$t('minimumReached')}` }}
                  <span class="jhminnum">{{ preData.preMin }}{{ deviceInfo.equipmentType === 23 ? 'Mpa' : 'mm' }}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <AirTrends :options="JhtemperaturelData"></AirTrends>
            <div style="margin-top: -20px; margin-left: 20px">
              <div class="timer">
                {{ `${$t('atTime', { time: value })}${tempData.preName}` }}
              </div>
              <div class="number">
                <div class="max">
                  {{ `${$t('stay')}${tempData.tempMaxTime}${$t('maximumReached')}` }}
                  <span class="maxnum">{{ tempData.tempMax }}°C</span>
                </div>
                <div class="min">
                  {{ `${$t('stay')}${tempData.tempMinTime}${$t('minimumReached')}` }}
                  <span class="jhminnum">{{ tempData.tempMin }}°C</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <TrendChartForAirRemoteControl ref="trendChartForAirRemoteControl" v-if="deviceInfo.equipmentType === 21" :timeValue="value"></TrendChartForAirRemoteControl>
      <LineChartForSmartMeter v-if="deviceInfo.equipmentType === 12" :timeValue="value"></LineChartForSmartMeter>
      <div class="mantunsci" v-if="deviceInfo.equipmentType === 25">
        <AirTrends :options="JhgasData"></AirTrends>
        <div style="margin-top: -20px; margin-left: 20px; display: flex">
          <div class="timer">{{ `${$t('atTime', { time: value }) + $t('methaneConcentration1')}` }}</div>
          <div class="number">
            <div class="max">
              {{ `${$t('stay')}${(seriesData.JhgasSummary && seriesData.JhgasSummary.methaneValueMaxValueTime) || '-'}${$t('maximumReached')}` }}
              <span class="maxnum">{{ (seriesData.JhgasSummary && seriesData.JhgasSummary.methaneValueMaxValue) || '-' }}%</span>
            </div>
            <div class="min">
              {{ `${$t('stay')}${(seriesData.JhgasSummary && seriesData.JhgasSummary.methaneValueMinValueTime) || '-'}${$t('minimumReached')}` }}
              <span class="jhminnum">{{ (seriesData.JhgasSummary && seriesData.JhgasSummary.methaneValueMinValue) || '' }}%</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 朗鑫烟感设备数据趋势 -->
      <div class="mantunsci" v-if="[41].includes(deviceInfo.equipmentType)">
        <AirTrends :options="LxSmokeData"></AirTrends>
        <div style="margin-top: -20px; margin-left: 20px; display: flex">
          <div class="timer">{{ $t('smokeConcentrationTpl1', { value }) }}</div>
          <div class="number">
            <div class="max">
              {{ $t('maxTpl1', { value: (seriesData.LXLimitValue && seriesData.LXLimitValue.maxValueTime) || '-' }) }}
              <span class="maxnum">{{ seriesData.LXLimitValue && seriesData.LXLimitValue.maxValue === 0 ? 0 : seriesData.LXLimitValue.maxValue || '' }}%</span>
            </div>
            <div class="min">
              {{ $t('minTip1', { value: (seriesData.LXLimitValue && seriesData.LXLimitValue.minValueTime) || '-' }) }}
              <span class="jhminnum">{{ seriesData.LXLimitValue && seriesData.LXLimitValue.minValue === 0 ? 0 : seriesData.LXLimitValue.minValue || '' }}%</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 海曼烟感对接 -->
      <div class="mantunsci" v-if="[42].includes(deviceInfo.equipmentType)">
        <AirTrends :options="HMSmokeData"></AirTrends>
        <div style="margin-top: -20px; margin-left: 20px; display: flex">
          <div class="timer">{{ $t('smokeConcentrationTpl1', { value: splitValue(value) }) }}</div>
          <div class="number">
            <div class="max">
              {{ $t('maxTpl1', { value: (seriesData.HMLimitValue && seriesData.HMLimitValue.maxValueTime) || '-' }) }}
              <span class="maxnum">{{ seriesData.HMLimitValue && seriesData.HMLimitValue.maxValue === 0 ? 0 : seriesData.HMLimitValue.maxValue || '-' }}dB/m</span>
            </div>
            <div class="min">
              {{ $t('minTip1', { value: (seriesData.HMLimitValue && seriesData.HMLimitValue.minValueTime) || '-' }) }}
              <span class="jhminnum">{{ seriesData.HMLimitValue && seriesData.HMLimitValue.minValue === 0 ? 0 : seriesData.HMLimitValue.minValue || '-' }}dB/m</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mantunsci" v-if="deviceInfo.equipmentType === 28">
        <AirTrends :options="EastWaterMeterData"></AirTrends>
        <div style="margin-top: -20px; margin-left: 20px; display: flex">
          <div class="timer">
            {{ $t('accumulatedtrafficTpl1', { value: splitValue(value) }) }}
            <span>
              <i>{{ seriesData.max }}</i>
              -
              <i>{{ seriesData.min }}</i>
              =
              <i>
                {{ +seriesData.max - +seriesData.min }}m
                <sup>3</sup>
              </i>
            </span>
          </div>
        </div>
      </div>
      <div class="mantunsci" v-if="deviceInfo.equipmentType === 29">
        <AirTrends :options="WanlinSmokeData"></AirTrends>
        <div style="margin-top: -20px; margin-left: 20px; display: flex">
          <div class="timer">{{ $t('smokeConcentrationTpl1', { value: splitValue(value) }) }}</div>
          <div class="number">
            <div class="max">
              <span>{{ `${$t('stay')}${WanmaxPoint.time ? WanmaxPoint.time : '-'}${$t('maximumReached')}` }}</span>
              <span class="maxnum">{{ WanmaxPoint.value ? WanmaxPoint.value : '-' }}%</span>
            </div>
            <div class="min">
              <span>{{ `${$t('stay')}${WanminPoint.time ? WanminPoint.time : '-'}${$t('minimumReached')}` }}</span>
              <span class="jhminnum">{{ WanminPoint.value ? WanminPoint.value : '-' }}%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mantunsci" v-if="deviceInfo.equipmentType === 30">
        <LineChart :options="tqwaterMeterData"></LineChart>
        <div style="margin-top: -20px; margin-left: 20px; display: flex">
          <div class="timer">{{ `${this.value.split('-')[0]}-${this.value.split('-')[1]}${$t('totalWaterConsumption1')}` }}</div>
          <div>
            <span style="color: #129af0">{{ seriesData.maxConsumption || '' }}</span>
            <i style="margin: 0 10px">-</i>
            <span style="color: #129af0">{{ seriesData.minConsumption || '' }}</span>
            <i style="margin: 0 10px">=</i>
            <span style="color: #129af0">
              {{ seriesData.maxConsumption ? +seriesData.maxConsumption - +seriesData.minConsumption : '-' }}
              <i>
                m
                <sup>3</sup>
              </i>
            </span>
          </div>
        </div>
      </div>
      <LineChart :options="flowWater" v-if="deviceInfo.equipmentType === 32"></LineChart>
    </div>
  </div>
</template>

<script>
  import LineChart from '../common/LineChart.vue'
  import AirTrends from '../common/AirTrends.vue'
  import { norChannelHistory, queryForsafeChnllHistory, queryHuaxuChnlHistory, dingzhidaFlowThrend, runStatusTrend, HMrunStatusTrend } from '@/api/control/index'
  import { getEffectAddr, queryTlinkChnlHistory, querySmokeHistory, zadrunStatusTrend, chtqdqWaterMeterHistory, queryRenkeChnlHistory, wlrunStatusTrend, getTrendData, historicalDatathirdDevice, lqrunStatusTrend } from '@/api/public'
  import dayjs from 'dayjs'
  export default {
    components: {
      LineChart,
      AirTrends,
      LineChartForSmartMeter: () => import('./LineChartForSmartMeter.vue'),
      TrendChartForAirRemoteControl: () => import('./TrendChartForAirRemoteControl.vue'),
    },
    inject: ['rowDeviceInfo'],
    data() {
      return {
        deviceInfo: this.rowDeviceInfo,
        value: [6, 7, 29].includes(this.rowDeviceInfo.equipmentType) ? this.$func.getCurrentYearMonth() : [15].includes(this.rowDeviceInfo.equipmentType) ? this.$func.formatDate('yyyy-MM-dd', new Date(new Date().setDate(new Date().getDate() - 1))) : this.$func.getNowFormatDate(),
        value1: [this.$func.formatDate('yyyy-MM-dd', new Date(new Date().setDate(new Date().getDate() - 7))), this.$func.formatDate('yyyy-MM-dd', new Date(new Date().setDate(new Date().getDate() - 1)))],
        xAxisData: [],
        seriesData: {},
        loopTypeNameMap: {
          0: this.$t('smoke1'),
          1: this.$t('volt'),
          2: this.$t('leakage1'),
          4: this.$t('temperature'),
          8: this.$t('current'),
          17: this.$t('pressure'),
          18: this.$t('liquidLevel'),
          32: this.$t('ratedCurrent'),
          33: this.$t('electriDegree'),
          34: this.$t('activePower'),
          35: this.$t('powerFactor'),
          40: this.$t('batteryElectricity'),
          41: this.$t('signal'),
        },
        lineNode: '',
        options: [],
        preData: {},
        WanmaxPoint: {},
        WanminPoint: {},
        showDateMonth: [6, 7, 28, 29, 30, 32, 42, 45], // 展示月份搜索的设备equipmentType
        gasLineChart: [10, 13, 45], // 展示信号强度图表的设备equipmentType
        concentrationLineChart: [13, 45], // 展示浓度图表的设备equipmentType
      }
    },
    computed: {
      stralsund() {
        const loopType = this.$store.state.stralsundObj.loopType
        const loopAddr = this.$store.state.stralsundObj.loopAddr
        const textName = this.loopTypeNameMap[loopType] ? `${this.loopTypeNameMap[loopType]}${this.$t('loop')}` : loopAddr
        return { xAxis: this.xAxisData, series: [{ type: 'line', data: this.seriesData[loopAddr] || [], name: textName }], title: { show: true, text: textName }, legendDisplay: false, splitLine: true, time: true }
      },
      level() {
        const type = this.deviceInfo.equipmentType === 4 ? this.$store.state.levelObj.type : this.$store.state.pressureObj.type
        const textName = type === 'f' ? this.$t('liquidLevel') : this.$t('temperature')
        return { xAxis: this.xAxisData, series: [{ type: 'line', data: type === 'f' ? this.seriesData['f-yAxis'] : this.seriesData['t-yAxis'], name: textName }], title: { show: true, text: textName }, legendDisplay: false, splitLine: true, time: true }
      },
      flammableGas() {
        const nameText = this.deviceInfo.equipmentType === 7 ? this.$t('concentration') : this.$t('electricQuantity')
        return {
          xAxis: this.seriesData.timeAxis,
          series: [{ type: 'line', name: nameText, data: this.seriesData.yAxis || [] }],
          title: { show: true, text: nameText },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      smokeAlarm() {
        return {
          xAxis: this.xAxisData,
          series: [{ type: 'line', name: this.$t('signalIntensity'), data: this.seriesData.signalList || [] }],
          title: { show: true, text: this.$t('signalIntensity') + `${this.deviceInfo.equipmentType === 45 ? '(dbm)' : '(%)'}` },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      combustibleGas() {
        return {
          xAxis: this.xAxisData,
          series: [{ type: 'line', name: this.$t('concentration'), data: this.seriesData.concentrationList || [] }],
          title: { show: true, text: this.$t('concentration') + `${this.deviceInfo.equipmentType === 45 ? '(ppm)' : '(%)'}` },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      smokeVoltage() {
        return { xAxis: this.xAxisData, series: [{ type: 'line', name: this.$t('voltage'), data: this.seriesData.voltageList || [] }], title: { show: true, text: this.$t('voltage') }, legendDisplay: false, splitLine: true, time: true }
      },
      WanlinSmokeData() {
        let xAxisData = []
        let datas = []
        if (Array.isArray(this.seriesData.smokeScopeTrend) && this.seriesData.smokeScopeTrend) {
          xAxisData = this.seriesData.smokeScopeTrend.map(it => it.time.split(' ')[0])
          datas = this.seriesData.smokeScopeTrend.map(it => it.value)
        }
        return {
          title: { show: true, text: this.$t('smokeConcentration') },
          xAxis: xAxisData,
          series: [{ name: this.$t('smokeConcentration1'), type: 'line', data: datas, itemStyle: { color: '#049ee4' }, showSymbol: true, symbol: 'circle', symbolSize: 4, smooth: true }],
          yAxis: [],
        }
      },
      JhgasData() {
        let xAxisData = []
        let datas = []
        if (Array.isArray(this.seriesData.trendList) && this.seriesData.trendList.length > 0) {
          xAxisData = this.seriesData.trendList.map(val => val.time.split(' ')[1])
          datas = this.seriesData.trendList.map(val => val.methaneValue)
        }
        return { title: { show: true, text: this.$t('methaneConcentration') }, xAxis: xAxisData, series: [{ name: this.$t('methaneConcentration1'), type: 'line', data: datas, itemStyle: { color: '#049ee4' }, showSymbol: true, symbol: 'circle', symbolSize: 4, smooth: true }], yAxis: [] }
      },
      LxSmokeData() {
        let datas = []
        if (Array.isArray(this.seriesData.smokeData) && this.seriesData.smokeData.length > 0) {
          datas = this.seriesData.smokeData
        }
        return { title: { show: true, text: this.$t('smokeConcentration') }, xAxis: this.xAxisData, series: [{ name: this.$t('smokeConcentration1'), type: 'line', data: datas, itemStyle: { color: '#049ee4' }, showSymbol: true, symbol: 'circle', symbolSize: 4, smooth: true }], yAxis: [] }
      },
      HMSmokeData() {
        let datas = []
        if (Array.isArray(this.seriesData.smokeData) && this.seriesData.smokeData.length > 0) {
          datas = this.seriesData.smokeData
        }
        return {
          title: { show: true, text: `${this.$t('smokeConcentration1')}（dB/m）` },
          xAxis: this.xAxisData,
          series: [{ name: this.$t('smokeConcentration1'), type: 'line', data: datas, itemStyle: { color: '#049ee4' }, showSymbol: true, symbol: 'circle', symbolSize: 4, smooth: true }],
          yAxis: [],
        }
      },
      watermoreChart() {
        return {
          xAxis: this.xAxisData,
          series: [{ name: this.$t('unitConversion'), type: 'line', data: this.seriesData.humList || [], smooth: true }],
          title: { show: true, text: this.$t('unitConversion') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      temperatureSensor() {
        const name = this.deviceInfo.equipmentType === 11 ? this.$t('temperature') : `${this.$t('illuminationCelsius')}`
        const text = this.deviceInfo.equipmentType === 11 ? this.$t('temperature') : `${this.$t('illuminationCelsius')}(Lux)`
        return { xAxis: this.xAxisData, series: [{ name, type: 'line', data: this.seriesData.temList || [], smooth: true }], title: { show: true, text }, legendDisplay: false, splitLine: true, time: true }
      },
      humiditySensor() {
        return {
          xAxis: this.xAxisData,
          series: [{ name: this.$t('humidity'), type: 'line', data: this.seriesData.humList || [], smooth: true }],
          title: { show: true, text: this.$t('humidity') + '(%RH)' },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      lightVoltage() {
        return {
          xAxis: this.xAxisData,
          series: [{ name: this.$t('voltage'), type: 'line', data: this.seriesData.volList || [], color: '#007EFF', lineStyle: { color: '#007EFF' }, smooth: true }],
          title: { show: true, text: this.$t('voltage') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      lightCurrnet() {
        return {
          xAxis: this.xAxisData,
          series: [{ name: this.$t('current'), type: 'line', data: this.seriesData.curList || [], color: '#11DE69', lineStyle: { color: '#11DE69' }, smooth: true }],
          title: { show: true, text: this.$t('ampere') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      lightPower() {
        return {
          xAxis: this.xAxisData,
          series: [{ name: this.$t('watt1'), type: 'line', data: this.seriesData.powerList || [], color: '#A275FF', lineStyle: { color: '#A275FF' }, smooth: true, showAllSymbol: true, symbolSize: 2 }],
          title: { show: true, text: this.$t('watt1') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      lightListCharts() {
        return {
          xAxis: this.xAxisData,
          series: [{ name: this.$t('brightness'), type: 'line', data: this.seriesData.lightList || [], color: '#FEA854', lineStyle: { color: '#FEA854' }, smooth: true, showAllSymbol: true, symbolSize: 2 }],
          title: { show: true, text: this.$t('brightness') + '(%)' },
          grid: 40,
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      EastWaterMeterData() {
        let xAxisData = []
        let datas = []
        if (Array.isArray(this.seriesData.flowTrends) && this.seriesData.flowTrends.length > 0) {
          xAxisData = this.seriesData.flowTrends.map(val => val.time)
          datas = this.seriesData.flowTrends.map(val => val.value)
        }
        return {
          title: { show: true, text: this.$t('accumulatedTraffic') },
          xAxis: xAxisData,
          series: [{ name: this.$t('accumulatedTraffic1'), type: 'line', data: datas, itemStyle: { color: '#049ee4' }, showSymbol: true, symbol: 'circle', symbolSize: 4, smooth: true }],
          yAxis: [],
        }
      },
      tqwaterMeterData() {
        let consumption = []
        let xAxisData = []
        if (Array.isArray(this.seriesData.runStatusTrend) && this.seriesData.runStatusTrend.length > 0) {
          xAxisData = this.seriesData.runStatusTrend.map(val => {
            return val.time ? val.time.split('-')[1] + '-' + val.time.split('-')[2] : ''
          })
          consumption = this.seriesData.runStatusTrend.map(val => val.TotalConsumption)
        }
        return {
          xAxis: xAxisData,
          series: [{ name: this.$t('totalUsage1'), type: 'line', data: consumption, color: '#02a7f0', lineStyle: { color: '#02a7f0' }, smooth: true }],
          title: { show: true, text: this.$t('totalUsage') },
          legendDisplay: false,
          splitLine: true,
          time: true,
          equipmentType: 30,
        }
      },
      IntelligentWaterMeter() {
        return {
          xAxis: this.xAxisData,
          series: [{ name: this.$t('waterConsumption2'), type: 'line', data: this.seriesData.waterVolumeList || [], color: '#e062ea', lineStyle: { color: '#e062ae' }, smooth: true }],
          title: { show: true, text: this.$t('ton') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      JhWaterpressureData() {
        let xAxisData = []
        let datas = []
        const { pressureTrends } = this.seriesData
        if (Array.isArray(pressureTrends) && pressureTrends.length > 0) {
          xAxisData = pressureTrends.map(val => val.time.split(' ')[1])
          datas = pressureTrends.map(val => val.value)
        }
        return {
          title: { show: true, text: this.deviceInfo.equipmentType === 23 ? this.$t('waterPressureValue') : this.$t('liquidLevelValue') },
          xAxis: xAxisData,
          series: [{ name: this.deviceInfo.equipmentType === 23 ? this.$t('waterPressureValue1') : this.$t('liquidLevelValue1'), type: 'line', data: datas, itemStyle: { color: '#049ee4' }, showSymbol: true, symbol: 'circle', symbolSize: 4, smooth: true }],
          yAxis: [],
        }
      },
      JhtemperaturelData() {
        let xAxisData = []
        let datas = []
        if (Array.isArray(this.seriesData.temperatureTrends) && this.seriesData.temperatureTrends.length > 0) {
          xAxisData = this.seriesData.temperatureTrends.map(val => val.time.split(' ')[1])
          datas = this.seriesData.temperatureTrends.map(val => val.value)
        }
        return {
          title: { show: true, text: this.$t('environmentalTemperature') },
          xAxis: xAxisData,
          series: [{ name: this.$t('environmentalTemperatureValue'), type: 'line', data: datas, itemStyle: { color: '#049ee4' }, showSymbol: true, symbol: 'circle', symbolSize: 4, smooth: true }],
          yAxis: [],
        }
      },
      flowWater() {
        return {
          xAxis: this.xAxisData,
          series: [{ name: this.$t('waterConsumptionTrend1'), type: 'line', data: this.seriesData.flowWater || [], itemStyle: { color: '#049ee4' }, showSymbol: true, symbol: 'circle', symbolSize: 4, smooth: true }],
          title: { show: true, text: this.$t('waterConsumptionTrend1') },
          splitLine: true,
          time: true,
        }
      },
      pressure() {
        let series = [{ type: 'line', data: this.seriesData['t-yAxis'], name: this.$t('temperature') }]
        let titleName = this.$t('temperature')
        if (this.$store.state.pressureObj.type === 'f') {
          series = [{ type: 'line', data: this.seriesData['f-yAxis'], name: this.$t('pressure') }]
          titleName = this.$t('pressure')
        }
        return { xAxis: this.xAxisData, series: series, title: { show: true, text: titleName }, grid: 40, legendDisplay: false, splitLine: true, time: true }
      },
    },
    methods: {
      splitValue(value) {
        return `${value.split('-')[0]}-${value.split('-')[1]}`
      },
      handleDateRangeChange(val) {
        this.value1 = val
        this.init()
      },
      handleDateChange(val) {
        this.value = val
        this.init()
      },
      async queryStralsund() {
        if (this.$store.state.stralsundObj.length === 0) return false
        let params = {
          mac: this.$store.state.stralsundObj.mac,
          dataCategory: this.$store.state.stralsundObj.dataCategory,
          loopType: this.$store.state.stralsundObj.loopType,
          loopAddr: this.$store.state.stralsundObj.loopAddr,
          startTime: this.value,
          endTime: this.value,
        }
        const res = await norChannelHistory(params)
        if (res.success) {
          this.xAxisData = res.data.xAxis.map(str => str.split(' ')[1])
          this.seriesData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryTlinkChnlHistory() {
        const params = { mac: this.deviceInfo.mac, time: this.value }
        const res = await queryTlinkChnlHistory(params)
        if (res.success) {
          if (res.data) {
            this.xAxisData = (res.data.timeAxis && res.data.timeAxis.map(str => str.split(' ')[1])) || []
            this.seriesData = res.data
          } else {
            this.xAxisData = []
            this.seriesData = { 'f-yAxis': [], 't-yAxis': [] }
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryFlammableGas() {
        const msgType = this.deviceInfo.equipmentType === 7 ? this.$store.state.flammableGasObj.msgType : this.$store.state.smokeObj.msgType
        if (!msgType) return
        const params = { mac: this.deviceInfo.mac, msgType, yearMonth: this.value }
        const res = await queryForsafeChnllHistory(params)
        if (res.success) {
          this.seriesData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async querysmokeAlarm() {
        let params = { mac: this.deviceInfo.mac, time: this.value }
        const res = await querySmokeHistory(params)
        if (res.success) {
          this.xAxisData = (res.data && res.data.timeList && res.data.timeList.map(str => str.split(' ')[1])) || []
          this.seriesData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlewlrunStatusTrend() {
        let params = { mac: this.deviceInfo.mac, projectCode: this.$store.state.projectCode, equipmentType: this.deviceInfo.equipmentType, time: this.value + '-01' }
        const res = await wlrunStatusTrend(params)
        if (res.success) {
          this.seriesData = res.data
          this.WanmaxPoint = res.data.maxPoint
          this.WanminPoint = res.data.minPoint
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlegetTrendData() {
        let params = { ymd: this.value, mac: this.deviceInfo.mac, addr: '0' }
        const res = await getTrendData(params)
        if (res.success) {
          this.seriesData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getAddr() {
        const res = await getEffectAddr({ mac: this.deviceInfo.mac })
        if (res.success) {
          this.options = res.datas
          this.lineNode = res.datas.length && res.datas[0].nodeId
          if ([11, 14, 18].includes(this.deviceInfo.equipmentType)) {
            this.queryRenkeChnl()
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changeNode(node) {
        this.lineNode = node.value
        this.queryRenkeChnl()
      },
      async queryRenkeChnl(nodeId = '') {
        let params = { mac: this.deviceInfo.mac, nodeId: nodeId || this.lineNode, time: this.value }
        const res = await queryRenkeChnlHistory(params)
        if (res.success) {
          this.xAxisData = (res.data && res.data.timeList && res.data.timeList.map(str => str.split(' ')[1])) || []
          this.seriesData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlehistoricalData() {
        let dateString = this.value
        const today = new Date(dateString)
        const finalDate = new Date(today)
        const torromarow = finalDate.setDate(today.getDate() + 1)
        const newTorrow = dayjs(torromarow).format('YYYY-MM-DD')
        let params = { mac: this.deviceInfo.mac, date: this.value + '/' + newTorrow }
        const res = await historicalDatathirdDevice(params)
        if (res.success) {
          this.xAxisData = res.data.dateList.map(item => item.substr(10))
          this.seriesData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlelqrunStatusTrend() {
        let length = this.value.split('-').length
        let params = { mac: this.deviceInfo.mac, projectCode: this.$store.state.projectCode, equipmentType: this.deviceInfo.equipmentType, time: length < 3 ? this.value + '-01' : this.value }
        const res = await lqrunStatusTrend(params)
        if (res.success) {
          this.seriesData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlechtqdqWaterMeterHistory() {
        let params = { mac: this.deviceInfo.mac, mouth: this.value.split('-')[0] + '-' + this.value.split('-')[1] + '-' + '01' }
        const res = await chtqdqWaterMeterHistory(params)
        if (res.success) {
          this.seriesData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryHuaxuChnl() {
        const res = await queryHuaxuChnlHistory({ mac: this.deviceInfo.mac, time: this.value })
        if (res.success) {
          this.xAxisData = (res.data && res.data.timeList && res.data.timeList.map(str => str.split(' ')[1])) || []
          this.seriesData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlezadrunStatusTrend() {
        let params = { mac: this.deviceInfo.mac, projectCode: this.$store.state.projectCode, equipmentType: this.deviceInfo.equipmentType, time: this.value }
        const res = await zadrunStatusTrend(params)
        if (res.success) {
          this.seriesData = res.data
          this.preData = { preMax: res.data.preMax, preMaxTime: res.data.preMaxTime, preMin: res.data.preMin, preMinTime: res.data.preMinTime, preName: this.deviceInfo.equipmentType === 23 ? this.$t('waterPressureValue1') : this.$t('liquidLevelValue1') }
          this.tempData = { tempMax: res.data.tempMax, tempMaxTime: res.data.tempMaxTime, tempMin: res.data.tempMin, tempMinTime: res.data.tempMinTime, preName: this.$t('ambientTemperature') }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleGetFlowWater() {
        let params = { mac: this.deviceInfo.mac, startTime: dayjs(this.value).startOf('month').format('YYYY-MM-DD'), endTime: dayjs(this.value).endOf('month').format('YYYY-MM-DD') }
        let res = await dingzhidaFlowThrend(params)
        if (res.success) {
          this.xAxisData = (res.data && res.data.map(val => val.date)) || []
          this.seriesData.flowWater = (res.data && res.data.map(val => val.fullTotal)) || []
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleGetLxSmokeChart() {
        let params = { mac: this.deviceInfo.mac, time: dayjs(this.value).format('YYYY-MM-DD'), projectCode: this.$store.state.projectCode, equipmentType: 41 }
        let res = await runStatusTrend(params)
        if (res.success) {
          const { timeArr, valueArr, maxValue, minValue, maxValueTime, minValueTime } = res.data
          this.xAxisData = timeArr || []
          this.seriesData.smokeData = valueArr || []
          this.seriesData.LXLimitValue = { maxValue, minValue, maxValueTime, minValueTime }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleHMSmokeChart() {
        let params = { mac: this.deviceInfo.mac, time: dayjs(this.value).format('YYYY-MM-DD'), projectCode: this.$store.state.projectCode, equipmentType: 42 }
        let res = await HMrunStatusTrend(params)
        if (res.success) {
          const { timeArr, valueArr, maxValue, minValue, maxValueTime, minValueTime } = res.data
          this.xAxisData = timeArr || []
          this.seriesData.smokeData = valueArr.map(val => (val === 0 ? 0 : val || '-')) || []
          this.seriesData.HMLimitValue = { maxValue, minValue, maxValueTime, minValueTime }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleHMGasChart() {
        let params = { mac: this.deviceInfo.mac, time: dayjs(this.value).format('YYYY-MM-DD'), projectCode: this.$store.state.projectCode, equipmentType: 45 }
        let res = await HMrunStatusTrend(params)
        if (res.success) {
          const { timeArr, gasArr, signalStrengthArr } = res.data
          this.xAxisData = timeArr || []
          this.seriesData.signalList = signalStrengthArr.map(val => (val === 0 ? 0 : val || '-')) || []
          this.seriesData.concentrationList = gasArr.map(val => (val === 0 ? 0 : val || '-')) || []
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      refreshInit() {
        this.$refs.trendChartForAirRemoteControl.init()
      },
      init() {
        let equipmentType = this.deviceInfo.equipmentType
        if ([3].includes(equipmentType)) {
          this.queryStralsund()
        } else if ([4, 5, 31].includes(equipmentType)) {
          this.queryTlinkChnlHistory()
        } else if ([6, 7].includes(equipmentType)) {
          this.queryFlammableGas()
        } else if ([10, 13].includes(equipmentType)) {
          this.querysmokeAlarm()
        } else if ([11, 14, 18].includes(equipmentType)) {
          this.getAddr()
        } else if (equipmentType === 15) {
          this.queryHuaxuChnl()
        } else if (equipmentType === 21) {
        } else if (equipmentType === 22) {
          this.handlehistoricalData()
        } else if ([23, 24].includes(equipmentType)) {
          this.handlezadrunStatusTrend()
        } else if (equipmentType === 25) {
          this.handlegetTrendData()
        } else if (equipmentType === 28) {
          this.handlelqrunStatusTrend()
        } else if (equipmentType === 29) {
          this.handlewlrunStatusTrend()
        } else if (equipmentType === 30) {
          this.handlechtqdqWaterMeterHistory()
        } else if (equipmentType === 32) {
          this.handleGetFlowWater()
        } else if (equipmentType === 41) {
          this.handleGetLxSmokeChart()
        } else if (equipmentType === 42) {
          this.handleHMSmokeChart()
        } else if (equipmentType === 45) {
          this.handleHMGasChart()
        }
      },
    },
    mounted() {
      //  [1,2,3,4,5,6,7,8,10,11,12,13,14,15,16, 18,19,21,22,25,28,29,30,32]
      this.init()
    },
    watch: {
      '$store.state.stralsundObj': {
        handler() {
          this.queryStralsund()
        },
        deep: true,
      },
      '$store.state.flammableGasObj': {
        handler() {
          this.queryFlammableGas()
        },
        deep: true,
      },
      '$store.state.nodeId': {
        handler(newVal, oldVal) {
          if (newVal || oldVal) this.queryRenkeChnl(newVal)
        },
      },
      '$store.state.smokeObj': {
        handler(newVal, oldVal) {
          if (newVal.mac || oldVal.mac) this.queryFlammableGas()
        },
      },
    },
  }
</script>

<style lang="less" scoped>
  .trend-chart {
    width: 100%;
    .ml-5 {
      margin-left: 5px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      border-bottom: 1px solid #5e626c;
      margin-top: 0 !important;
      .left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      .right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
    .content {
      padding: 15px;
      .chart-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        & > div {
          width: calc(~'50% - 5px');
        }
      }
      .mantunsci {
        width: 100%;
      }
      .timer {
        i {
          color: #0ea7f0;
        }
      }
      .number {
        display: flex;
        margin-left: 50px;
        .max {
          margin-right: 30px;
          min-width: 250px;
          .maxnum {
            color: #f24e4c;
          }
        }
        .min {
          min-width: 250px;
          .minnum {
            color: #0dd667;
          }
          .jhminnum {
            color: #13cae5;
          }
        }
      }
    }
  }
</style>
