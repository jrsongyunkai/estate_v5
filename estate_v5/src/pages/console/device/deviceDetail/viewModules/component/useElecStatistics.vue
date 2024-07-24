<template>
  <div>
    <div class="dis-flexs">
      <div style="flex: 2">
        <div class="bor-bottom" style="margin-bottom: 35px">
          <div class="blue-right"></div>
          <div>{{ $t('electricityConsumptionStatistics') }}</div>
        </div>
        <div class="elec-texts">
          <div>{{ $t('dailyElectricityConsumption') }}</div>
          <div>
            <span class="weight-text">{{ dayConsumption }}</span>
            <span>kW·h</span>
          </div>
        </div>
        <div class="elec-texts">
          <div>{{ $t('monthElectricityConsumption') }}</div>
          <div>
            <span class="weight-text">{{ monthConsumption }}</span>
            <span>kW·h</span>
          </div>
        </div>
        <div class="elec-texts">
          <div>{{ $t('allElectricityConsumption') }}</div>
          <div>
            <span class="weight-text">{{ totalConsumption }}</span>
            <span>kW·h</span>
          </div>
        </div>
      </div>
      <div style="flex: 7; margin-left: 50px">
        <div class="bor-bottom">
          <div class="blue-right"></div>
          <div>{{ $t('electricityUsageDetails') }}</div>
        </div>
        <LineChart :options="elecData"></LineChart>
      </div>
    </div>
  </div>
</template>

<script>
  import LineChart from '../common/LineChart.vue'
  import { electricStatistics, monthlyElectricityConsumption } from '@/api/public'
  export default {
    props: {
      mac: {
        type: String,
        default: '',
      },
    },
    components: {
      LineChart,
    },
    data() {
      return {
        totalConsumption: '',
        monthConsumption: '',
        dayConsumption: '',
        elecData: {
          xAxis: [],
          series: [],
          title: { show: true, text: this.$t('monthElectricityConsumption') + '（kW·h）' },
          grid: 40,
          legendDisplay: false,
          splitLine: true,
          time: true,
        },
      }
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        const res = await electricStatistics({ mac: this.mac })
        if (res.success) {
          this.dayConsumption = res.data.dayConsumption
          this.monthConsumption = res.data.monthConsumption
          this.totalConsumption = res.data.totalConsumption
        } else {
          this.$Message.error({ content: res.message })
        }
        monthlyElectricityConsumption({ mac: this.mac }).then(res => {
          if (res.success) {
            this.elecData.xAxis = res.data.date.map(item => (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) + '-' + (item > 9 ? item : '0' + item) : new Date().getMonth() + 1 + '-' + (item > 9 ? item : '0' + item)))
            this.elecData.series = [{ type: 'line', name: this.$t('electricityUsageDetails'), data: res.data.value, color: '#007EFF', lineStyle: { color: '#007EFF' } }]
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
    },
  }
</script>

<style lang="less">
  .dis-flexs {
    display: flex;
  }
  .blue-right {
    width: 2px;
    height: 14px;
    margin-top: 5px;
    margin-right: 10px;
    background: #007eff;
  }
  .bor-bottom {
    border-bottom: 1px solid #474c57;
    padding-bottom: 10px;

    display: flex;
    padding-top: 10px;
    font-size: 16px;
  }
  .elec-texts {
    margin-top: 10px;
    background: #28313f;
    display: flex;
    justify-content: space-between;
    padding: 15px;
    border-radius: 4px;
  }
  .weight-text {
    font-size: 16px;
    font-weight: 500;
    margin-right: 10px;
  }
</style>
