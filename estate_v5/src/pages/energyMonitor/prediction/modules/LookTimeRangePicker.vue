<template>
  <div>
    <div v-if="timeType === '1'">
      <DatePicker type="datetime" style="width: 180px" ref="startDate" class="time-picker" :value="startTime" format="yyyy-MM-dd HH" :placeholder="$t('pleaseSelectTheStartTime')" @on-change="setStartTime" :options="optionsStartDate" @on-open-change="dataHourStart" :clearable="false"></DatePicker>
      <span style="padding: 0px 5px">-</span>
      <DatePicker type="datetime" style="width: 180px" ref="endTimeRef" class="time-picker" :value="endTime" format="yyyy-MM-dd HH" :placeholder="$t('pleaseSelectTheEndTime')" @on-change="setEndTime" :options="optionsDate" @on-open-change="dataHourEnd" :clearable="false"></DatePicker>
    </div>
    <div v-if="timeType === '2'">
      <DatePicker type="date" style="width: 180px" :value="startTime" format="yyyy-MM-dd" :placeholder="$t('pleaseSelectTheStartDate')" @on-change="setStartTime" :options="optionsStartDate" :clearable="false"></DatePicker>
      <span style="padding: 0px 5px">-</span>
      <DatePicker type="date" style="width: 180px" :value="endTime" format="yyyy-MM-dd" :placeholder="$t('pleaseSelectTheEndDate')" @on-change="setEndTime" :options="optionsDate" :clearable="false"></DatePicker>
    </div>
    <div v-if="timeType === '3'">
      <DatePicker type="month" :value="startTime" :placeholder="$t('pleaseSelectTheStartingMonth')" format="yyyy-MM" style="width: 180px" :options="optionsStartDate" @on-change="setStartTime"></DatePicker>
      <span style="padding: 0px 5px">-</span>
      <DatePicker type="month" :value="endTime" :placeholder="$t('pleaseSelectTheEndMonth')" :options="optionsDate" format="yyyy-MM" style="width: 180px" @on-change="setEndTime"></DatePicker>
    </div>
    <div v-if="timeType === '4'">
      <DatePicker type="year" :value="startTime" :placeholder="$t('pleaseSelectTheStartingYear')" format="yyyy" style="width: 180px" :options="optionsStartDate" @on-change="setStartTime"></DatePicker>
      <span style="padding: 0px 5px">-</span>
      <DatePicker type="year" :value="endTime" :placeholder="$t('pleaseSelectTheEndYear')" :options="optionsDate" format="yyyy" style="width: 180px" @on-change="setEndTime"></DatePicker>
    </div>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  export default {
    props: {
      timeType: {
        type: String,
        default: '1',
      },
      value: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        startTime: '',
        endTime: '',
        yearValue: '',
        timeTypeMap: {
          1: 'hour',
          2: 'day',
          3: 'month',
          4: 'year',
        },
        optionsStartDate: {
          disabledDate(date) {
            return date && date.valueOf() > dayjs().valueOf()
          },
        },
      }
    },
    computed: {
      optionsDate() {
        const startTime = this.startTime
        const timeType = this.timeType
        const selectionMode = this.$refs.endTimeRef && this.$refs.endTimeRef.selectionMode
        return {
          disabledDate(date) {
            if (timeType === '1') {
              if (selectionMode === 'date') {
                let hours = startTime.split(' ')[1]
                return date.valueOf() > dayjs().valueOf() || date.valueOf() > dayjs(`${startTime}:00:00`).add(365, 'day').subtract(hours, 'hour').valueOf() || date.valueOf() < dayjs(`${startTime}:00:00`).subtract(hours, 'hour').valueOf()
              } else {
                return date.valueOf() > dayjs().subtract(1, 'hour').valueOf() || date.valueOf() > dayjs(`${startTime}:00:00`).add(365, 'day').valueOf() || date.valueOf() < dayjs(`${startTime}:00:00`).valueOf() || date.valueOf() < dayjs(`${startTime}:00:00`).endOf('hour').valueOf()
              }
            }
            if (timeType === '2') return date.valueOf() > dayjs().valueOf() || date.valueOf() > dayjs(startTime).add(3, 'year').valueOf() || date.valueOf() <= dayjs(startTime).valueOf()
            if (timeType === '3') return date.valueOf() > dayjs().valueOf() || date.valueOf() > dayjs(startTime).add(3, 'year').valueOf() || date.valueOf() <= dayjs(startTime).valueOf()
            if (timeType === '4') return date.valueOf() > dayjs().valueOf() || date.valueOf() > dayjs(startTime).add(2, 'year').valueOf() || date.valueOf() <= dayjs(startTime).valueOf()
          },
        }
      },
    },
    methods: {
      dataHourStart(e) {
        if (!this.startTime && e) {
          this.startTime = dayjs().format('YYYY-MM-DD 00')
          this.endTime = ''
        }
      },
      dataHourEnd(e) {
        if (!this.endTime && e) {
          this.endTime = dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH')
          this.$emit('input', [dayjs(this.startTime).startOf(this.timeTypeMap[this.timeType]).format('YYYY-MM-DD HH:mm:ss'), dayjs(this.endTime).endOf(this.timeTypeMap[this.timeType]).format('YYYY-MM-DD HH:mm:ss')])
        }
      },
      setStartTime(e) {
        this.startTime = e.replace('时段', '')
        this.endTime = ''
      },
      setEndTime(e) {
        this.endTime = e.replace('时段', '')
        this.$emit('input', [dayjs(this.startTime).startOf(this.timeTypeMap[this.timeType]).format('YYYY-MM-DD HH:mm:ss'), dayjs(this.endTime).endOf(this.timeTypeMap[this.timeType]).format('YYYY-MM-DD HH:mm:ss')])
      },
    },
    watch: {
      timeType: {
        handler() {
          this.startTime = ''
          this.endTime = ''
          this.$emit('input', [])
        },
        deep: true,
      },
    },
    mounted() {
      this.startTime = this.value[0] || ''
      this.endTime = this.value[1] || ''
    },
  }
</script>
<style lang="less" scoped>
  .time-picker {
    width: 100px;
    /deep/.ivu-time-picker-cells-list {
      width: 100%;
      display: none;
      overflow: auto;
      &:first-child {
        display: block;
      }
      .ivu-time-picker-cells-cell {
        padding-left: 0;
        text-align: center;
      }
    }
  }
</style>
