<template>
  <div>
    <div v-if="timeType === '1'">
      <DatePicker
        type="datetime"
        style="width: 180px"
        ref="startTimeHours"
        class="time-picker"
        :value="startTime"
        format="yyyy-MM-dd HH"
        :placeholder="$t('pleaseSelectTheStartTime')"
        @on-change="setStartTime"
        :options="optionsStartDate"
        @on-open-change="dataHourStart"
        :clearable="false"></DatePicker>
      <span style="padding: 0px 5px">-</span>
      <DatePicker type="datetime" style="width: 180px" ref="endTimeRef" class="time-picker" :value="endTime" format="yyyy-MM-dd HH" :placeholder="$t('pleaseSelectTheEndTime')" @on-change="setEndTime" :options="optionsDate" :clearable="false" @on-open-change="dataHourEnd"></DatePicker>
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
      timeType: { type: String, default: '1' },
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
        isHoursOpen: false,
      }
    },
    computed: {
      optionsStartDate() {
        const selectionMode = this.$refs.startTimeHours && this.$refs.startTimeHours.selectionMode
        const timeType = this.timeType
        const isHoursOpen = this.isHoursOpen
        return {
          disabledDate(date) {
            if (timeType === '1') {
              if (selectionMode === 'date' && isHoursOpen) {
                return date.valueOf() < dayjs().subtract(1, 'day').valueOf() || date.valueOf() > dayjs().add(7, 'day').valueOf()
              } else {
                return date.valueOf() < dayjs().subtract(1, 'hour').valueOf() || date.valueOf() > dayjs().add(7, 'day').valueOf()
              }
            }
            if (timeType === '2') return date.valueOf() < dayjs().subtract(1, 'day').valueOf() || date.valueOf() > dayjs().add(1, 'year').valueOf()
            if (timeType === '3') return date.valueOf() < dayjs().subtract(1, 'month').valueOf() || date.valueOf() > dayjs().add(1, 'year').valueOf()
            if (timeType === '4') return date.valueOf() < dayjs().subtract(1, 'year').valueOf() || date.valueOf() > dayjs().add(5, 'year').valueOf()
          },
        }
      },
      optionsDate() {
        const startTime = this.startTime
        const timeType = this.timeType
        const selectionMode = this.$refs.endTimeRef && this.$refs.endTimeRef.selectionMode
        return {
          disabledDate(date) {
            if (timeType === '1') {
              if (selectionMode === 'date') {
                let hours = startTime.split(' ')[1]
                return date.valueOf() > dayjs(`${startTime}:00:00`).add(24, 'hour').valueOf() || date.valueOf() < dayjs(`${startTime}:00:00`).subtract(hours, 'hour').valueOf() || date.valueOf() > dayjs().add(7, 'day').valueOf()
              } else {
                return date.valueOf() > dayjs(`${startTime}:00:00`).add(24, 'hour').valueOf() || date.valueOf() < dayjs(`${startTime}:00:00`).valueOf() || date.valueOf() > dayjs().add(7, 'day').valueOf()
              }
            }
            if (timeType === '2') return date.valueOf() < dayjs().valueOf() || date.valueOf() > dayjs(startTime).add(31, 'day').valueOf() || date.valueOf() < dayjs(startTime).valueOf() || date.valueOf() > dayjs().add(1, 'year').valueOf()
            if (timeType === '3') return date.valueOf() < dayjs().subtract(1, 'month').valueOf() || date.valueOf() > dayjs(startTime).add(12, 'month').valueOf() || date.valueOf() < dayjs(startTime).valueOf() || date.valueOf() > dayjs().add(1, 'year').valueOf()
            if (timeType === '4') return date.valueOf() < dayjs().valueOf() || date.valueOf() > dayjs(startTime).add(2, 'year').valueOf() || date.valueOf() < dayjs(startTime).valueOf() || date.valueOf() > dayjs().add(5, 'year').valueOf()
          },
        }
      },
    },
    methods: {
      setStartTime(e) {
        this.startTime = e.replace('时段', '')
        this.endTime = ''
      },
      setEndTime(e) {
        this.endTime = e.replace('时段', '')
        this.$emit('input', [dayjs(this.startTime).startOf(this.timeTypeMap[this.timeType]).format('YYYY-MM-DD HH:mm:ss'), dayjs(this.endTime).endOf(this.timeTypeMap[this.timeType]).format('YYYY-MM-DD HH:mm:ss')])
      },
      dataHourStart(v) {
        this.isHoursOpen = v
        if (v && !this.startTime) {
          this.startTime = dayjs().format('YYYY-MM-DD HH')
          this.endTime = ''
        }
      },
      dataHourEnd(v) {
        if (v && !this.endTime) {
          this.endTime = dayjs(this.startTime).add(1, 'hour').format('YYYY-MM-DD HH')
          this.$emit('input', [dayjs(this.startTime).startOf(this.timeTypeMap[this.timeType]).format('YYYY-MM-DD HH:mm:ss'), dayjs(this.endTime).endOf(this.timeTypeMap[this.timeType]).format('YYYY-MM-DD HH:mm:ss')])
        }
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
