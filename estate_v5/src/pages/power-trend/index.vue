<template>
  <div class="user-power">
    <div class="top-title">
      <Icon custom="icon-v5 icon-v5-backt" size="20" color="#02a7f0" @click="$router.push('/visualScreen')" />
      <span class="title-text">{{ $t('powerCurve') }}</span>
    </div>
    <div class="user-power-content">
      <div class="card search">
        <Select style="width: 200px" v-model="timeRange">
          <Option value="1">{{ $t('last24hours') }}</Option>
          <Option value="2">{{ $t('last30days') }}</Option>
          <Option value="3">{{ $t('last12months') }}</Option>
        </Select>
        <Button type="primary" class="ml-10" @click="query">{{ $t('query') }}</Button>
        <Button class="ml-10" @click="reset">{{ $t('reset') }}</Button>
      </div>
      <div class="card trend">
        <div class="trend-title">
          <div>{{ $t('powerTrend') }}</div>
          <div>
            <Button type="primary" ghost style="margin-right: 10px" v-if="viewMode === 'table'" @click="handleExport">{{ $t('export') }}</Button>
            <RadioGroup v-model="viewMode" type="button">
              <Radio label="chart"><Icon custom="icon-v5 icon-v5-qushi" size="20" /></Radio>
              <Radio label="table"><Icon custom="icon-v5 icon-v5-liebiao" size="20" /></Radio>
            </RadioGroup>
          </div>
        </div>
        <TrendChart v-show="viewMode === 'chart'" :data="chartData" :timeRange="timeRange" style="width: 100%; height: 100%; position: absolute; left: 0; top: 0" />
        <TrendTable v-show="viewMode === 'table'" :data="tableData" />
      </div>
    </div>
  </div>
</template>

<script>
  import TrendChart from './TrendChart.vue'
  import TrendTable from './TrendTable'
  import dayjs from 'dayjs'
  import qs from 'qs'

  import { powerTrend, powerTrendAggregate } from '@/api/visualScreen'

  const FORMATTER = 'YYYY-MM-DD HH:mm:ss'

  export default {
    components: {
      TrendChart,
      TrendTable,
    },
    data() {
      return {
        viewMode: 'chart',
        timeRange: '1',
        chartData: [],
        tableData: [],
      }
    },
    mounted() {
      this.query()
    },
    methods: {
      getParams() {
        const rangeMap = {
          1: {
            duration: 24,
            unit: 'hour',
          },
          2: {
            duration: 30,
            unit: 'day',
          },
          3: {
            duration: 12,
            unit: 'month',
          },
        }
        const { duration, unit } = rangeMap[this.timeRange]
        const baseTime = dayjs().startOf(unit)
        const startTime = baseTime.subtract(duration - 1, unit).format(FORMATTER)
        const endTime = baseTime.add(1, unit).format(FORMATTER)

        return {
          startTime,
          endTime,
        }
      },
      getDateList(start, end) {
        const s = typeof start === 'string' ? dayjs(start) : start
        const e = typeof end === 'string' ? dayjs(end) : end
        const dateList = []
        for (let i = s; i.isBefore(e); i = i.add(15, 'minute')) {
          dateList.push(i.format(FORMATTER))
        }
        return dateList
      },
      query() {
        this.queryChartData()
        this.queryTableData()
      },
      async queryTableData() {
        const params = this.getParams()
        const { success, message, data } = await powerTrendAggregate(params)
        if (!success) return this.$Message.error(message)
        this.tableData = data.map(item => {
          const valueStr = item.value
          return {
            time: item.time,
            value: valueStr === undefined ? null : Number(valueStr),
          }
        })
      },
      async queryChartData() {
        const params = this.getParams()
        const { success, message, data } = await powerTrend(params)
        if (!success) return this.$Message.error(message)
        const valueMap = data.reduce((acc, cur) => {
          const key = dayjs(cur.time).format(FORMATTER)
          acc[key] = cur.value
          return acc
        }, {})
        const dateList = this.getDateList(params.startTime, params.endTime)
        this.chartData = dateList.map(time => {
          const valueStr = valueMap[time]
          return {
            time,
            value: valueStr === undefined ? null : valueStr,
          }
        })
      },
      handleExport() {
        const params = this.getParams()
        this.$func.windowCountDown(`/large/screen/v5/xlsx/powerTrend/aggregate.as?${qs.stringify(params)}`)
      },
      reset() {
        this.timeRange = '1'
        this.query()
      },
    },
  }
</script>

<style lang="less" scoped>
  .top-title {
    width: 100%;
    height: 60px;
    display: flex;
    background: #1a202e;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 10px;
    box-shadow: 0px 1px 2px #090f19;
    .title-text {
      color: #fff;
      font-size: 18px;
      margin-left: 10px;
      font-weight: 600;
    }
  }
  .user-power {
    .user-power-content {
      padding: 0 10px;
    }
    .card {
      background: #1a202e;
      padding: 10px 20px;
    }
    .search {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .trend {
      height: 560px;
      position: relative;
      .trend-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 10;
      }
    }
  }
</style>
