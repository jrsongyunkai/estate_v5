<template>
  <Row>
    <Col class="mantunsci" :span="12">
      <LineChart :options="smartMeterVoltage"></LineChart>
    </Col>
    <Col class="mantunsci" :span="12">
      <LineChart :options="smartMeterAmpere"></LineChart>
    </Col>
    <Col class="mantunsci" :span="12">
      <!-- 有功电能 -->
      <div style="position: absolute; right: 60px; top: 10px">
        <span style="margin-right: 15px">
          <Icon type="md-radio-button-off" color="#0498da" />
          {{ $t('positiveElectricalEnergy') }}
        </span>
        <span>
          <Icon type="md-radio-button-off" color="#63a007" />
          {{ $t('reverseEnergy') }}
        </span>
      </div>
      <div style="position: absolute; left: 25px; top: 35px">
        <span style="color: #999999">{{ $t('unit') }}:kW·h</span>
      </div>
      <LineChart :options="instantaneousActivePower"></LineChart>
    </Col>
    <!-- 无功功电能 -->
    <Col class="mantunsci" :span="12">
      <div style="position: absolute; right: 60px; top: 10px">
        <span style="margin-right: 15px">
          <Icon type="md-radio-button-off" color="#0498da" />
          {{ $t('positiveElectricalEnergy') }}
        </span>
        <span>
          <Icon type="md-radio-button-off" color="#63a007" />
          {{ $t('reverseEnergy') }}
        </span>
      </div>
      <div style="position: absolute; left: 25px; top: 35px">
        <span style="color: #999999">{{ $t('unit') }}:kW·h</span>
      </div>
      <LineChart :options="instantaneousReactivePower"></LineChart>
    </Col>
  </Row>
</template>

<script>
  import { queryChtqdqMeterReadingDataHistory } from '@/api/public'
  import LineChart from '../common/LineChart.vue'
  export default {
    components: { LineChart },
    inject: ['rowDeviceInfo'],
    props: {
      timeValue: { type: String, default: '' },
    },
    data() {
      return {
        deviceInfo: this.rowDeviceInfo,
        xAxisData: [],
        seriesData: {},
      }
    },
    computed: {
      instantaneousReactivePower() {
        return {
          xAxis: this.xAxisData,
          series: [
            { name: this.$t('positiveReactivePower'), type: 'line', data: this.seriesData.prEng || [], color: '#e062ea', lineStyle: { color: '#0498da' }, smooth: true },
            { name: this.$t('reverseReactivePower'), type: 'line', data: this.seriesData.nrEng || [], color: '#e062ea', lineStyle: { color: '#63a007' }, smooth: true },
          ],
          title: { show: true, text: this.$t('reactiveEnergy') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      instantaneousActivePower() {
        return {
          xAxis: this.xAxisData,
          series: [
            { name: this.$t('positiveActivePower'), type: 'line', data: this.seriesData.paEng || [], color: '#e062ea', lineStyle: { color: '#0498da' }, smooth: true },
            { name: this.$t('reverseActivePower'), type: 'line', data: this.seriesData.naEng || [], color: '#e062ea', lineStyle: { color: '#63a007' }, smooth: true },
          ],
          title: { show: true, text: this.$t('powerElectricalEnergy') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      smartMeterVoltage() {
        return {
          xAxis: this.xAxisData,
          series: [
            { name: this.$t('voltage'), type: 'line', data: this.seriesData.lstGV || [], color: '#e062ea', lineStyle: { color: '#e062ae' }, smooth: true },
            { name: 'A' + this.$t('phase') + this.$t('voltage'), type: 'line', data: this.seriesData.volA || [], color: '#71e1e4', lineStyle: { color: '#71e1e4' }, smooth: true },
            { name: 'B' + this.$t('phase') + this.$t('voltage'), type: 'line', data: this.seriesData.volB || [], color: '#ffdb5c', lineStyle: { color: '#ffdb5c' }, smooth: true },
            { name: 'C' + this.$t('phase') + this.$t('voltage'), type: 'line', data: this.seriesData.volC || [], color: '#c23531', lineStyle: { color: '#c23531' }, smooth: true },
          ],
          title: { show: true, text: this.$t('volt') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
      smartMeterAmpere() {
        return {
          xAxis: this.xAxisData,
          series: [
            { name: this.$t('temperature'), type: 'line', data: this.seriesData.lstGT || [], color: '#e062ea', lineStyle: { color: '#e062ae' }, smooth: true },
            { name: 'A' + this.$t('phase') + this.$t('current'), type: 'line', data: this.seriesData.curA || [], color: '#71e1e4', lineStyle: { color: '#71e1e4' }, smooth: true },
            { name: 'B' + this.$t('phase') + this.$t('current'), type: 'line', data: this.seriesData.curB || [], color: '#ffdb5c', lineStyle: { color: '#ffdb5c' }, smooth: true },
            { name: 'C' + this.$t('phase') + this.$t('current'), type: 'line', data: this.seriesData.curC || [], color: '#c23531', lineStyle: { color: '#c23531' }, smooth: true },
          ],
          title: { show: true, text: this.$t('current') },
          legendDisplay: false,
          splitLine: true,
          time: true,
        }
      },
    },
    methods: {
      async queryChtqdqMeterReadingData() {
        let params = { mac: this.deviceInfo.mac, time: this.timeValue }
        const res = await queryChtqdqMeterReadingDataHistory(params)
        if (res.success) {
          let xAxis = []
          if (JSON.stringify(res.data) !== '{}') {
            xAxis = res.data.timeList.map(str => str.split(' ')[1])
          }
          this.xAxisData = xAxis
          this.seriesData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.queryChtqdqMeterReadingData()
    },
    watch: {
      timeValue: {
        handler() {
          this.queryChtqdqMeterReadingData()
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .mantunsci {
    height: 300px;
  }
</style>
