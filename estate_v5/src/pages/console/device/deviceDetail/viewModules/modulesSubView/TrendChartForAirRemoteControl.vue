<template>
  <div class="air-content">
    <div>
      <AirTrends :options="airTemperature"></AirTrends>
      <div style="margin-top: -20px; margin-left: 20px" v-if="tmpEnvironTrend.tmpMax && tmpEnvironTrend.tmpMin">
        <div class="timer">{{ $t('atTime', { time: timeValue }) }}</div>
        <div class="number">
          <div class="max">
            {{ `${$t('indoorTemperature') + $t('stay')} ${tmpEnvironTrend.tmpMaxTime && tmpEnvironTrend.tmpMaxTime.split(' ')[1]}${$t('maximumReached')}` }}
            <span class="maxnum">{{ `${tmpEnvironTrend.tmpMax}°C` }}</span>
          </div>
          <div class="min">
            {{ `${$t('stay')} ${tmpEnvironTrend.tmpMinTime && tmpEnvironTrend.tmpMinTime.split(' ')[1]}${$t('minimumReached')}` }}
            <span class="minnum">{{ `${tmpEnvironTrend.tmpMin}°C` }}</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <AirTrends :options="airHumidity"></AirTrends>
      <div style="margin-top: -20px; margin-left: 20px" v-if="humEnvironTrend.humMin && humEnvironTrend.humMax">
        <div class="timer">{{ $t('atTime', { time: timeValue }) }}</div>
        <div class="number">
          <div class="max">
            {{ `${$t('indoorHumidity') + $t('stay')}${humEnvironTrend.humMaxTime && humEnvironTrend.humMaxTime.split(' ')[1]}${$t('maximumReached')}` }}
            <span class="maxnum">{{ `${humEnvironTrend.humMax}%` }}</span>
          </div>
          <div class="min">
            {{ ` ${$t('stay')}${humEnvironTrend.humMinTime && humEnvironTrend.humMinTime.split(' ')[1]}${$t('minimumReached')}` }}
            <span class="minnum">{{ `${humEnvironTrend.humMin}%` }}</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="air-current">
        <div class="Airnum">
          <span style="margin-right: 20px" v-for="(item, index) in $store.state.showAir.split(',')" :key="index" :class="item === '1' ? 'spanMar' : ''">
            <i :class="item === '1' ? 'ac1' : 'ac2'"></i>
            {{ `${$t('airConditioning')}${item}` }}
          </span>
        </div>
        <AirTrends :options="aircurrent"></AirTrends>
        <div style="margin-top: -20px; margin-left: 20px" v-if="curStatusTrend[0]">
          <div class="timer">{{ $t('atTime', { time: timeValue }) }}{{ $t('currentValue') }}</div>
          <div class="number" v-for="(item, index) in curStatusTrend" :key="index">
            <div class="max">
              {{ `${$t('airConditioning')}${index + 1}${$t('stay')}${item.curMaxTime && item.curMaxTime.split(' ')[1]} ${$t('maximumReached')}` }}
              <span class="maxnum">{{ `${item.curMax}A` }}</span>
            </div>
            <div class="min">
              {{ `${$t('airConditioning')}${index + 1}${$t('stay')}${item.curMinTime && item.curMinTime.split(' ')[1]} ${$t('minimumReached')}` }}
              <span class="minnum">{{ `${item.curMin}A` }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div style="position: relative">
        <h3 style="position: absolute; top: 10px; left: 10px">{{ $t('alarmOutputStatus') }}</h3>
        <AirOpenClose :options="curStatusTrendAiroptions"></AirOpenClose>
        <div style="margin-top: -20px; margin-left: 20px" v-if="alarmEnvironTrend.totalAlarmSec">
          <div class="timer">{{ $t('atTime', { time: timeValue }) }}</div>
          <div class="number">
            <div class="max">
              {{ $t('common') }}
              <span class="maxnum">{{ $t('alarm') }}</span>
              {{ $t('totalDuration') }}{{ $func.getTime(alarmEnvironTrend.totalAlarmSec) }}
            </div>
          </div>
          <div class="number">
            <div class="min">
              {{ $t('common') }}
              <span class="minnum">{{ $t('normal') }}</span>
              {{ $t('totalDuration') }}{{ $func.getTime(alarmEnvironTrend.totalNormalSec) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-for="(item, index) in runStatusTrendAiroptions.series" :key="index">
      <div style="position: relative">
        <h3 style="position: absolute; top: 10px; left: 10px">{{ `${$t('airConditioning')}` + item.air + `${$t('state')}` }}</h3>
        <AirStatus :options="item"></AirStatus>
        <div style="margin-top: -20px; margin-left: 20px">
          <div class="timer">{{ `${$t('atTime', { time: timeValue })}${$t('airConditioning')}${item.air}` }}</div>
          <Row>
            <div class="number">
              <div class="max">
                {{ $t('common') }}
                <span class="negative">{{ $t('refrigeration') }}</span>
                {{ item.coldCount }}{{ $t('times') }} {{ $t('totalDuration') + $func.getTime(item.coldSec) }}
              </div>
            </div>
            <div class="number">
              <div class="min">
                {{ $t('common') }}
                <span class="unkown">{{ $t('unknown2') }}</span>
                {{ item.unknownCount }}{{ $t('times') }} {{ $t('totalDuration') + $func.getTime(item.unknownSec) }}
              </div>
            </div>
          </Row>
          <Row>
            <div class="number">
              <div class="max">
                {{ $t('common') }}
                <span class="positive">{{ $t('Heating') }}</span>
                {{ item.hotCount }}{{ $t('times') }} {{ $t('totalDuration') + $func.getTime(item.hotSec) }}
              </div>
            </div>
            <div class="number">
              <div class="min">
                {{ $t('common') }}
                <span class="stop">{{ $t('stop') }}</span>
                {{ item.stopCount }}{{ $t('times') }} {{ $t('totalDuration') + $func.getTime(item.stopSec) }}
              </div>
            </div>
          </Row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AirTrends from '../common/AirTrends.vue'
  import AirOpenClose from '../common/AirOpenClose.vue'
  import AirStatus from '../common/AirStatus.vue'
  import { runEnvironTrend, runStatusTrend } from '@/api/public'
  export default {
    inject: ['rowDeviceInfo'],
    components: { AirTrends, AirOpenClose, AirStatus },
    props: {
      timeValue: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        deviceInfo: this.rowDeviceInfo,
        runStatusTrendAiroptions: { series: [] },
        seriesData: {},
        tmpEnvironTrend: {},
        humEnvironTrend: {},
        curStatusTrend: [],
        alarmEnvironTrend: { trends: [] },
        aircurrent: {
          title: { show: true, text: this.$t('CurrentA') },
          xAxis: [],
          series: [
            {
              name: this.$t('airConditioning') + '1',
              type: 'line',
              data: [],
              itemStyle: { color: '#007EFF' },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(0, 126, 255, 1)' },
                    { offset: 1, color: 'rgba(0, 126, 255, 0)' },
                  ],
                  global: false,
                },
              },
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 4,
              smooth: true,
            },
            {
              name: this.$t('airConditioning') + '2',
              type: 'line',
              data: [],
              itemStyle: { color: '#0DD667' },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(13, 214, 103, 1)' },
                    { offset: 1, color: 'rgba(13, 214, 103, 0)' },
                  ],
                  global: false,
                },
              },
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 4,
              smooth: true,
            },
          ],
          yAxis: [],
        },
      }
    },
    computed: {
      airTemperature() {
        let xAxisData = []
        let datas = []
        if (Array.isArray(this.tmpEnvironTrend.trends) && this.tmpEnvironTrend.trends.length > 0) {
          xAxisData = this.tmpEnvironTrend.trends.map(val => val.time.split(' ')[1])
          datas = this.tmpEnvironTrend.trends.map(val => val.value)
        }
        return {
          title: { show: true, text: this.$t('IndoorTemperature') },
          xAxis: xAxisData,
          series: [
            {
              name: this.$t('indoorTemperature'),
              type: 'line',
              data: datas,
              itemStyle: { color: '#007EFF' },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(0, 126, 255, 1)' },
                    { offset: 1, color: 'rgba(0, 126, 255, 0)' },
                  ],
                  global: false,
                },
              },
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 4,
              smooth: true,
            },
          ],
          yAxis: [],
        }
      },
      airHumidity() {
        let xAxisData = []
        let datas = []
        if (Array.isArray(this.humEnvironTrend.trends) && this.humEnvironTrend.trends.length > 0) {
          xAxisData = this.humEnvironTrend.trends.map(val => val.time.split(' ')[1])
          datas = this.humEnvironTrend.trends.map(val => val.value)
        }
        return {
          title: { show: true, text: this.$t('IndoorHumidity') },
          xAxis: xAxisData,
          series: [
            {
              name: this.$t('indoorHumidity'),
              type: 'line',
              data: datas,
              itemStyle: { color: '#007EFF' },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(0, 126, 255, 1)' },
                    { offset: 1, color: 'rgba(0, 126, 255, 0)' },
                  ],
                  global: false,
                },
              },
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 4,
              smooth: true,
            },
          ],
          yAxis: [],
        }
      },
      curStatusTrendAiroptions() {
        return {
          data: this.alarmEnvironTrend.trends.map(it => (it.count === 0 ? 100 : 101)),
          time: this.alarmEnvironTrend.trends.map(it => it.time.split(' ')[1]),
        }
      },
    },
    methods: {
      async handlerunEnvironTrend() {
        let params = { projectCode: this.$store.state.projectCode, mac: this.deviceInfo.mac, time: this.timeValue }
        const res = await runEnvironTrend(params)
        if (res.success) {
          this.seriesData = res.data
          this.tmpEnvironTrend = res.data.tmpEnvironTrend
          this.humEnvironTrend = res.data.humEnvironTrend
          this.alarmEnvironTrend = res.data.alarmEnvironTrend
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlerunStatusTrend() {
        let params = { projectCode: this.$store.state.projectCode, mac: this.deviceInfo.mac, time: this.timeValue }
        const res = await runStatusTrend(params)
        if (res.success) {
          this.curStatusTrend = res.data.map(it => it.curStatusTrend)
          this.aircurrent.xAxis = []
          this.aircurrent.series[0].data = []
          this.aircurrent.series[1].data = []
          this.runStatusTrend = res.data.map(it => it.runStatusTrend)
          this.runStatusTrendAiroptions.series = []
          let showAirSplit = this.$store.state.showAir.split(',')
          this.runStatusTrend.forEach((it, i) => {
            it['air'] = res.data[i].air
          })
          this.curStatusTrend.forEach((val, ind) => {
            val.trends.forEach(vas => {
              if (ind === 0) {
                this.aircurrent.xAxis.push(vas.time.split(' ')[1])
              }
              if (showAirSplit.length === 2) {
                this.aircurrent.series[ind].data.push(vas.value)
              } else {
                if (ind === showAirSplit[0] - 1) {
                  this.aircurrent.series[ind].data.push(vas.value)
                }
              }
            })
          })
          this.runStatusTrend.forEach((val, ind) => {
            showAirSplit.forEach(item => {
              if (item === String(val.air)) {
                this.runStatusTrendAiroptions.series.push({
                  data: [],
                  time: [],
                  coldCount: val.coldCount,
                  air: val.air,
                  coldSec: val.coldSec,
                  hotCount: val.hotCount,
                  hotSec: val.hotSec,
                  stopCount: val.stopCount,
                  stopSec: val.stopSec,
                  unknownCount: val.unknownCount,
                  unknownSec: val.unknownSec,
                })
              }
            })
          })
          this.runStatusTrend[0].trends.forEach((val, ind) => {
            this.runStatusTrendAiroptions.series[0].time.push(val.time.split(' ')[1])
            this.runStatusTrendAiroptions.series[0].data.push(val.type === 0 ? 102 : val.type === 1 ? 101 : val.type === 2 ? 100 : 103)
          })
          this.runStatusTrend[1].trends.forEach((val, ind) => {
            this.runStatusTrendAiroptions.series[1].time.push(val.time.split(' ')[1])
            this.runStatusTrendAiroptions.series[1].data.push(val.type === 0 ? 102 : val.type === 1 ? 101 : val.type === 2 ? 100 : 103)
          })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      init() {
        this.handlerunEnvironTrend()
        this.handlerunStatusTrend()
      },
    },
    mounted() {
      this.init()
    },
    watch: {
      timeValue: {
        handler() {
          this.init()
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .air-content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    & > div {
      width: 50%;
      margin-bottom: 20px;
      .air-current {
        position: relative;
        .Airnum {
          position: absolute;
          top: 20px;
          right: 20px;
        }
        .spanMar {
          margin-right: 50px;
        }
        .ac1 {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #007eff;
          display: inline-block;
          margin-right: 5px;
        }
        .ac2 {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #0dd667;
          display: inline-block;
          margin-right: 5px;
        }
      }
      .timer {
        white-space: nowrap;
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
