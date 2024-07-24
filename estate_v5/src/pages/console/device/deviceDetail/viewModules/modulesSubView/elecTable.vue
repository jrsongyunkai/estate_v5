<template>
  <div>
    <div class="header" style="display: flex; width: 100%; justify-content: space-between">
      <div style="display: flex; align-items: center">
        <div class="bor"></div>
        <h4>{{ $t('electricityConsumptionReport') }}</h4>
      </div>
      <Row class="dateGroups">
        <div class="dateBtn" v-for="(item, index) in dateArr" :key="index" :class="{ active: isActive === index }" @click="SelectDateType(index)">{{ item }}</div>
        <Col class="monthDates">
          <DatePicker :type="dateType" :placeholder="placeStart" class="w100" transfer @on-change="dateStartPicker" v-model="Startdays"></DatePicker>
          -
          <DatePicker :type="dateType" :placeholder="placeEnd" class="w100" transfer @on-change="dateStartPicker" v-model="Enddays"></DatePicker>
        </Col>
        <Col>
          <Button type="primary" ghost class="detailsBtn ml-10" custom-icon="icon-v5 icon-v5-daochu1" @click="handlePowerExport"></Button>
        </Col>
      </Row>
    </div>
    <div style="padding-bottom: 20px; margin-top: 20px">
      <Table :columns="isYear" :data="elecTableData" border></Table>
    </div>
  </div>
</template>

<script>
  import { queryChtqdqMeterReadingDataStastic } from '@/api/public'
  import dayjs from 'dayjs'
  export default {
    props: {
      mac: { type: String, default: '' },
    },
    data() {
      return {
        property: 'value',
        monthOrYear: this.$t('month'),
        elecColumnsTable: [],
        dateArr: [this.$t('thisMonth'), this.$t('year')],
        isActive: 0,
        Startdays: this.$func.getpreTherrYearMonth(),
        Enddays: this.$func.getCurrentYearMonth(),
        placeEnd: this.$t('endMonth'),
        placeStart: this.$t('startMonth'),
        datetypeShow: 'month',
        dateType: 'month',
        elecTableData: [],
      }
    },
    created() {
      this.getListData()
    },
    mounted() {},
    computed: {
      isYear() {
        let isYear = []
        let arrIndex = [
          {
            title: '',
            key: 'time',
            fixed: 'left',
            align: 'center',
            width: 200,
            renderHeader: (h, params) => {
              return h('div', { style: { width: '100px', height: '50px', display: 'flex', 'flex-direction': 'column' } }, [
                h('strong', { style: { 'margin-bottom': '10px', 'margin-left': '40px' } }, this.$t('powerConsumption')),
                h('strong', { style: { 'margin-right': '40px' } }, this.monthOrYear),
                h('strong', { style: { position: 'absolute', transform: 'rotate(15deg) translateY(14px) translateX(5px)', color: '#999999', left: '0px', top: '0px' } }, '____________________________'),
              ])
            },
          },
        ]
        for (let i = 0; i < (this.datetypeShow === 'month' ? 31 : 12); i++) {
          arrIndex.push({
            title: `${(i > 8 ? i + 1 : '0' + (i + 1)) + (this.datetypeShow === 'month' ? this.$t('Number1') : this.$t('month'))}(kW·h)`,
            align: 'center',
            width: 200,
            key: `${i > 9 ? i : '0' + i}`,
            render: (h, params) => {
              return h('div', [
                h('div', params.row.list[i].energy || '-'),
                h('div', { style: { display: 'flex', justifyContent: 'space-between' } }, [
                  h('span', [
                    h('div', this.$t('YoY')),
                    h(
                      'div',
                      params.row.list[i].corr && params.row.list[i].corr !== '-'
                        ? [h('Icon', { props: { size: 16, type: params.row.list[i].corr > 0 ? 'md-arrow-up' : 'md-arrow-down' }, style: { color: params.row.list[i].corr > 0 ? 'red' : 'green' } }, ''), h('span', params.row.list[i].corr + '%')]
                        : '-'
                    ),
                  ]),
                  h('span', [
                    h('div', this.$t('monthOnMonthRatio1')),
                    h(
                      'div',
                      params.row.list[i].prev && params.row.list[i].prev !== '-'
                        ? [h('Icon', { props: { size: 16, type: params.row.list[i].prev > 0 ? 'md-arrow-up' : 'md-arrow-down' }, style: { color: params.row.list[i].prev > 0 ? 'red' : 'green' } }, ''), h('span', params.row.list[i].prev + '%')]
                        : '-'
                    ),
                  ]),
                ]),
              ])
            },
          })
        }
        isYear = [...arrIndex, { title: this.$t('total') + '(kW·h)', key: 'total', fixed: 'right', align: 'center', width: 200 }]
        return isYear
      },
      startDay() {
        return this.datetypeShow === 'month' ? dayjs(this.Startdays).format('YYYY-MM') : dayjs(this.Startdays).format('YYYY')
      },
      endDay() {
        return this.datetypeShow === 'month' ? dayjs(this.Enddays).format('YYYY-MM') : dayjs(this.Enddays).format('YYYY')
      },
    },
    methods: {
      handlePowerExport() {
        this.$func.windowCountDown('/chtqdq/xls/exportChtqdqMeterReadingDataStastic.as?' + '&mac=' + this.mac + '&startDate=' + this.startDay + '&endDate=' + this.endDay)
      },
      SelectDateType(v) {
        this.isActive = v
        switch (v) {
          case 0:
            this.datetypeShow = 'month'
            this.monthOrYear = this.$t('month1')
            this.dateType = 'month'
            this.placeStart = this.$t('startMonth')
            this.placeEnd = this.$t('endMonth')
            this.statsTpye = '3'
            break
          default:
            this.monthOrYear = this.$t('year1')
            this.datetypeShow = 'year'
            this.dateType = 'year'
            this.placeStart = this.$t('startYear')
            this.placeEnd = this.$t('endYear')
            this.statsTpye = '4'
            this.Startdays = dayjs(this.Startdays).format('YYYY')
            this.Enddays = dayjs(this.Enddays).format('YYYY')
        }
        this.getListData()
      },
      checkYear(start, end) {
        return new Date(end).getTime() - new Date(start).getTime() >= 366 * 24 * 60 * 60 * 1000
      },
      checkClosethreeYear(val) {
        return new Date(val).getFullYear() <= new Date().getFullYear() && new Date(val).getFullYear() >= new Date().getFullYear() - 2
      },
      dateStartPicker(val) {
        if (this.datetypeShow === 'month' && this.checkYear(this.Startdays, this.Enddays)) {
          return this.$Message.error({ content: this.$t('timeMoreThanYear') })
        } else if (this.datetypeShow !== 'month' && (!this.checkClosethreeYear(this.Startdays) || !this.checkClosethreeYear(this.Enddays))) {
          return this.$Message.error({ content: this.$t('timeMoreThanThreeYear') })
        }
        this.getListData()
      },
      getListData() {
        let parmars = { mac: this.mac, startDate: this.datetypeShow === 'month' ? dayjs(this.Startdays).format('YYYY-MM') : dayjs(this.Startdays).format('YYYY'), endDate: this.datetypeShow === 'month' ? dayjs(this.Enddays).format('YYYY-MM') : dayjs(this.Enddays).format('YYYY') }
        queryChtqdqMeterReadingDataStastic(parmars).then(res => {
          if (res.success) {
            let mockDatas = res.data
            if (this.datetypeShow === 'month') {
              mockDatas.forEach(item => {
                for (let i = 0; i < 31; i++) {
                  if (i > item.list.length - 1) {
                    item.list.push({ date: '', corr: null, prev: null, energy: '' })
                  }
                }
              })
            } else {
              mockDatas.forEach(item => {
                for (let i = 0; i < 12; i++) {
                  if (i > item.list.length - 1) {
                    item.list.push({ date: '', corr: null, prev: null, energy: '' })
                  }
                }
              })
            }
            this.elecTableData = mockDatas
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
    },
  }
</script>

<style lang="less">
  .ivu-table-fixed {
    margin-bottom: 10px !important;
    height: auto !important;
  }
  .ivu-table-fixed-right {
    margin-bottom: 10px !important;
    height: auto !important;
  }
  .dateGroups {
    align-items: center;
    .dateBtn {
      padding: 0 8px;
      height: 30px;
      background: #1a202e;
      border: 1px solid #535b6c;
      border-radius: 5px;
      line-height: 30px;
      text-align: center;
      font-size: 12px;
      color: #666666;
      cursor: pointer;
      margin-right: 5px;
    }
    .active {
      background: rgba(0, 126, 255, 0.2);
      border: 1px solid #007eff;
      color: #007eff;
    }
  }
  .monthDates {
    background: #1a202e;
    border: 1px solid #535b6c;
    border-radius: 5px;
    height: 30px;
    input {
      height: 28px;
    }
    .ivu-icon-ios-calendar-outline:before {
      content: '';
    }
    .ivu-input {
      border-color: transparent;
      padding: 0;
      text-align: center;
    }
    .ivu-input-suffix {
      width: 0;
      right: 20px;
    }
  }
  .w100 {
    width: 100px;
  }
</style>
