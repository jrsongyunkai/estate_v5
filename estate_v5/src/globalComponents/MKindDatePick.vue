<template>
  <div class="kind-pick-date">
    <RadioGroup :value="levelRange" :size="size" @on-change="changeLevel" type="button">
      <Radio v-for="item in typeOptions" :key="item.label" :label="item.label">{{ typeRangeFormatter(item.name) }}</Radio>
    </RadioGroup>
    <div class="pick-input-box">
      <el-date-picker
        v-if="['year', 'month', 'week', 'date'].includes(levelRange)"
        :key="levelRange"
        popper-class="m-date-pop"
        ref="dateValueRef"
        :clearable="false"
        :editable="false"
        :format="dateSetting.format"
        :value-format="dateSetting.valueFormat"
        :value="dateValue"
        :placeholder="dateSetting.placeholder"
        :type="levelRange"
        append-to-body
        :picker-options="pickerOptions"
        @input="changeDateValue"></el-date-picker>
      <SingleQuarter v-if="levelRange === 'quarter'" :value="dateValue" :isHasfilter="false" @input="getSingleQuarter" :canSelectList="[]" language="zh" :status="'single'"></SingleQuarter>
    </div>
    <div class="comparison-box ml-10" v-if="isComparison">
      <span>{{ $t('comparisonTime') }}</span>
      <div class="pick-input-box">
        <el-date-picker
          popper-class="m-date-pop"
          ref="comparisonRef"
          :key="levelRange"
          v-if="['year', 'month', 'week', 'date'].includes(levelRange)"
          :clearable="false"
          :editable="false"
          :format="dateSetting.format"
          :value-format="dateSetting.valueFormat"
          :value="dateValueComparison"
          :placeholder="dateSetting.placeholder"
          :type="levelRange"
          append-to-body
          :picker-options="pickerOptions"
          @input="changeDateValueComparison"></el-date-picker>
        <SingleQuarter v-if="levelRange === 'quarter'" :value="dateValueComparison" @input="getSingleQuarterComparison" :isHasfilter="false" :canSelectList="[]" language="zh" :status="'single'"></SingleQuarter>
      </div>
    </div>
  </div>
</template>
<script>
  import dayjs from 'dayjs'
  import SingleQuarter from './datePickModel/SingleQuarter.vue'
  import 'dayjs/locale/zh-cn'
  const weekOfYear = require('dayjs/plugin/weekOfYear')
  const advancedFormat = require('dayjs/plugin/advancedFormat')
  const quarterOfYear = require('dayjs/plugin/quarterOfYear')
  dayjs.extend(quarterOfYear)
  dayjs.extend(advancedFormat)
  dayjs.extend(weekOfYear)
  dayjs.locale('zh-cn')
  export default {
    components: { SingleQuarter },
    props: {
      value: {
        type: Object,
        default: () => {},
      },
      isComparison: {
        type: Boolean,
        default: false,
      },
      typeRange: {
        type: Array,
        default: () => [this.$t('year'), this.$t('season'), this.$t('month'), this.$t('week'), this.$t('day')],
      },
      typeRangeFormatter: {
        type: Function,
        default: name => name,
      },
      levelRangeMap: {
        type: Object,
        default: () => ({ date: 2, month: 3, year: 4, week: 5, quarter: 6 }),
      },
      size: {
        type: String,
        default: 'default',
      },
    },
    data() {
      return {
        valueSetting: { levelRange: 'month', timeType: 3, dateValue: '', dataRange: [] },
        dateValue: '',
        levelRange: 'month',
        dateValueComparison: '',
        dateTypeOptions: [
          { name: this.$t('year'), label: 'year', format: 'yyyy', valueFormat: 'yyyy-MM-dd', placeholder: this.$t('pleaseSelectYear'), DayjsValueFormat: 'YYYY' },
          { name: this.$t('season'), label: 'quarter', format: 'yyyy-QQ', valueFormat: 'YYYY-QQ', placeholder: this.$t('pleaseSelectSeason'), DayjsValueFormat: 'YYYY-Q' },
          { name: this.$t('month'), label: 'month', format: 'yyyy-MM', valueFormat: 'yyyy-MM-dd', placeholder: this.$t('pleaseSelectMonth'), DayjsValueFormat: 'YYYY-MM' },
          { name: this.$t('week'), label: 'week', format: `yyyy${this.$t('section')}WW${this.$t('week')}`, valueFormat: 'yyyy-MM-dd', placeholder: this.$t('pleaseSelectWeek'), DayjsValueFormat: `YYYY  ${this.$t('section')}ww${this.$t('week')}` },
          { name: this.$t('day'), label: 'date', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd', placeholder: this.$t('pleaseSelectDate'), DayjsValueFormat: 'YYYY-MM-DD' },
        ],
        quarterToMonthMap: {
          Q1: { startMonth: '01', endMonth: '03' },
          Q2: { startMonth: '04', endMonth: '06' },
          Q3: { startMonth: '07', endMonth: '09' },
          Q4: { startMonth: '10', endMonth: '12' },
        },
        pickerOptions: {
          firstDayOfWeek: 1,
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
        },
      }
    },
    computed: {
      dateSetting() {
        return this.dateTypeOptions.find(it => it.label === this.levelRange)
      },
      typeOptions() {
        return this.typeRange.map(name => this.dateTypeOptions.find(it => it.name === name))
      },
    },
    methods: {
      getSingleQuarter(value) {
        let quarter = value ? value.split('-')[1] : ''
        let year = value ? value.split('-')[0] : ''
        let dayObj = value ? this.quarterToMonthMap[quarter] : null
        let startTime = dayObj ? `${year}-${dayObj.startMonth}-01` : null
        let endTime = dayObj ? `${year}-${dayObj.endMonth}-01` : null
        this.valueSetting = JSON.parse(
          JSON.stringify({
            ...this.valueSetting,
            levelRange: this.levelRange,
            timeType: this.levelRangeMap[this.levelRange],
            dateValue: value,
            dateValueText: `${year}-${quarter}`,
            dataRange: dayObj ? [dayjs(startTime).startOf('month').format('YYYY-MM-DD HH:mm:ss'), dayjs(endTime).endOf('month').format('YYYY-MM-DD HH:mm:ss')] : ['', ''],
          })
        )
      },
      getSingleQuarterComparison(value) {
        let quarter = value ? value.split('-')[1] : ''
        let year = value ? value.split('-')[0] : ''
        let dayObj = value ? this.quarterToMonthMap[quarter] : null
        let startTime = dayObj ? `${year}-${dayObj.startMonth}-01` : null
        let endTime = dayObj ? `${year}-${dayObj.endMonth}-01` : null
        this.valueSetting = JSON.parse(
          JSON.stringify({
            ...this.valueSetting,
            levelRange: this.levelRange,
            timeType: this.levelRangeMap[this.levelRange],
            dateValueComparison: value,
            dateValueComparisonText: `${year}-${quarter}`,
            dataRangeComparison: dayObj ? [dayjs(startTime).startOf('month').format('YYYY-MM-DD HH:mm:ss'), dayjs(endTime).endOf('month').format('YYYY-MM-DD HH:mm:ss')] : ['', ''],
          })
        )
      },
      changeLevel(value) {
        this.levelRange = value
        if (value === 'quarter') {
          this.dateValue = `${dayjs().format('YYYY')}-Q${dayjs().quarter()}`
          this.getSingleQuarter(this.dateValue)
          if (this.isComparison) {
            this.dateValueComparison = ''
            this.getSingleQuarterComparison(this.dateValueComparison)
          }
        } else {
          this.dateValue = dayjs().format('YYYY-MM-DD')
          this.setDateValue(this.dateValue)
          if (this.isComparison) {
            this.dateValueComparison = ''
            this.setDateValueComparison(this.dateValueComparison)
          }
        }
      },
      setDateValue(date) {
        this.valueSetting = JSON.parse(
          JSON.stringify({
            ...this.valueSetting,
            levelRange: this.levelRange,
            timeType: this.levelRangeMap[this.levelRange],
            dateValue: date,
            dateValueText: this.returnDateValueText(date),
            dataRange: date ? [dayjs(date).startOf(this.levelRange).format('YYYY-MM-DD HH:mm:ss'), dayjs(date).endOf(this.levelRange).format('YYYY-MM-DD HH:mm:ss')] : ['', ''],
          })
        )
      },
      setDateValueComparison(date) {
        if (this.isComparison) {
          this.valueSetting = JSON.parse(
            JSON.stringify({
              ...this.valueSetting,
              levelRange: this.levelRange,
              timeType: this.levelRangeMap[this.levelRange],
              dateValueComparison: date,
              dateValueComparisonText: this.returnDateValueText(date),
              dataRangeComparison: date ? [dayjs(date).startOf(this.levelRange).format('YYYY-MM-DD HH:mm:ss'), dayjs(date).endOf(this.levelRange).format('YYYY-MM-DD HH:mm:ss')] : ['', ''],
            })
          )
        }
      },
      returnDateValueText(date) {
        if (this.levelRange !== 'quarter' && date) {
          return dayjs(date).format(this.dateSetting.DayjsValueFormat)
        } else {
          return date
        }
      },
      changeDateValue(data) {
        this.dateValue = data
        this.setDateValue(data)
      },
      changeDateValueComparison(data) {
        this.dateValueComparison = data
        this.setDateValueComparison(data)
      },
    },
    mounted() {
      this.valueSetting = JSON.parse(JSON.stringify({ ...this.valueSetting, ...this.value }))
      this.levelRange = this.valueSetting.levelRange
      this.$nextTick(() => {
        this.dateValue = this.valueSetting.dateValue
        if (this.isComparison) {
          this.dateValueComparison = this.value.dateValueComparison
        }
      })
    },
    watch: {
      valueSetting: {
        handler(value) {
          this.$emit('input', value)
        },
        deep: true,
      },
      value: {
        handler(value) {
          this.levelRange = value.levelRange
          this.$nextTick(() => {
            this.dateValue = value.dateValue
            if (this.isComparison) {
              this.dateValueComparison = value.dateValueComparison
            }
          })
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .kind-pick-date {
    display: flex;
    align-items: center;
    .ivu-radio-group-button .ivu-radio-wrapper:first-child {
      border-left: 1px solid #3d3d41;
    }
    /deep/.ivu-radio-group {
      display: flex;
    }
    .pick-input-box {
      position: relative;
      flex: 1;
      width: 240px;
      margin-left: 10px;
      height: 32px;
      /deep/.el-input {
        height: 32px;
        width: 100%;
      }
    }
    .comparison-box {
      display: flex;
      align-items: center;
    }
    /deep/.el-input__inner {
      background-color: #1a202e;
      border: 1px solid #3d3d41;
    }
  }
</style>
<style lang="less">
  .m-date-pop {
    background: #1a202e;
    margin: 0px;
    margin-top: 2px !important;
    border: none;
    // .el-picker-panel__icon-btn {
    //   color: #5a5a5a;
    // }
    .popper__arrow {
      display: none;
    }
  }
  .el-month-table td .cell,
  .el-year-table td .cell {
    color: #fff;
  }
  .el-date-table td.disabled div {
    background: unset;
    color: #62666f;
  }
  .el-month-table td.disabled .cell {
    background: unset;
    color: #62666f;
  }
  .el-year-table td.disabled .cell {
    background: unset;
    color: #62666f;
  }
  .el-month-table td.current:not(.disabled) .cell {
    background: #409eff;
    color: #fff;
  }
  .el-year-table td.current:not(.disabled) .cell {
    background: #409eff;
    color: #fff;
    border-radius: 30px;
  }
  .el-picker-panel__content .el-date-table .el-date-table__row:not(.current) td.available:not(.today) span {
    color: #fff;
  }
  .el-date-table.is-week-mode .el-date-table__row:hover td.available:not(.today) div span {
    color: #62666f;
  }
  .el-date-table.is-week-mode .el-date-table__row.current div span {
    color: #62666f;
  }
</style>
