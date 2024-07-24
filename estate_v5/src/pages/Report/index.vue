<template>
  <div class="report">
    <Breadcrumb separator-class="el-icon-arrow-right">
      <BreadcrumbItem class="pointer" @click.native="$router.push(pathUrl)">{{ $t('back') }}</BreadcrumbItem>
      <BreadcrumbItem>{{ $t('electricityStatistics') }}</BreadcrumbItem>
    </Breadcrumb>
    <Row class="conditionList">
      <Col class="ml-10">
        <MKindDatePick class="ml-10" v-model="timeValue" :typeRange="typeRange" :typeRangeFormatter="name => `${name}${$t('reportForm')}`" />
      </Col>
      <Col class="ml-10">
        <Select v-model="selectedProject" style="min-width: 200px" multiple :placeholder="`${$t('pleaseSelectProject')}`">
          <Option v-for="item in projectList" :value="item.projectCode" :key="item.projectCode">{{ item.projectName }}</Option>
        </Select>
      </Col>
      <Col>
        <Button type="primary" class="ml-10" @click="query">{{ $t('query') }}</Button>
        <Button class="ml-10" @click="reset">{{ $t('reset') }}</Button>
      </Col>
      <Col class="export">
        <Tooltip :content="$t('export')">
          <Icon custom="icon-v5 icon-v5-daochu2" @click="handleExport" />
        </Tooltip>
      </Col>
    </Row>
    <div class="charts">
      <div class="chart bar-chart">
        <div class="chart-title">{{ $t('projectElectricityData') }}</div>
        <BarChart :data="chartData" style="height: 360px" />
      </div>
      <div class="chart pie-chart">
        <div class="chart-title">{{ $t('projectElectricityDistribution') }}</div>
        <PieChart :data="chartData" style="height: 320px" />
      </div>
    </div>
    <div class="conditionCount">
      <div class="title">
        {{ $t('electricityStatistics') }}
      </div>
      <div style="margin-top: 10px">
        <div style="position: relative; overflow: auto; height: calc(100vh - 560px)">
          <vxe-table
            border
            show-overflow
            show-header-overflow
            ref="xTable"
            :data="tableData"
            :scroll-x="{ enabled: true, gt: 1, scrollToLeftOnChange: true }"
            :scroll-y="{ enabled: true, gt: 1, scrollToTopOnChange: true }"
            auto-resize
            minHeight="10px"
            maxHeight="100%"
            show-footer
            :footer-method="footerMethod"
            show-footer-overflow="title">
            <template v-for="column in columns">
              <vxe-column v-if="!column.children" :key="column.key" v-bind="column" :field="column.key"></vxe-column>
              <vxe-colgroup v-else :key="column.key + 1" v-bind="column" align="center">
                <vxe-column v-for="item in column.children" :key="item.key" v-bind="item" :field="item.key">
                  <template #header>
                    <div>{{ item.title }}</div>
                    <div>{{ item.unit }}</div>
                  </template>
                </vxe-column>
              </vxe-colgroup>
            </template>
          </vxe-table>
          <!-- <Page @on-change="handleCurrentChange" :current="pageNo" :page-size="pageSize" :total="rawData.length"></Page> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { userPrjPowerStatsNew } from '@/api/report'
  import dayjs from 'dayjs'
  import customParseFormat from 'dayjs/plugin/customParseFormat'
  import BarChart from './BarChart'
  import PieChart from './PieChart'
  import { projectIndexDB } from '@/plugins/indexDB/index'
  import qs from 'qs'

  dayjs.extend(customParseFormat)

  const UNIT_MAP = {
    year: 'month',
    quarter: 'month',
    month: 'day',
    week: 'day',
    date: 'hour',
  }

  const FORMATTER_MAP = {
    month: 'YYYY-MM',
    day: 'YYYY-MM-DD',
    hour: `YYYY-MM-DD HH${window.$t('hour')}`,
  }

  export default {
    components: {
      BarChart,
      PieChart,
    },
    data() {
      return {
        pathUrl: '',
        timeValue: {
          levelRange: 'month',
          timeType: 3,
          dateValue: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          dataRange: [dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
        },
        projectList: [],
        selectedProject: [],
        columns: [],
        rawData: [],
        pageSize: 10,
        pageNo: 1,
      }
    },
    computed: {
      typeRange() {
        return this.$store.state.isOpenPrjGrpHourPowerStat ? [this.$t('day'), this.$t('week'), this.$t('month'), this.$t('season'), this.$t('year')] : [this.$t('week'), this.$t('month'), this.$t('season'), this.$t('year')]
      },
      chartTitle() {
        const formatter = FORMATTER_MAP[UNIT_MAP[this.timeValue.levelRange]]
        const start = dayjs(this.timeValue.dataRange[0]).format(formatter)
        const end = dayjs(this.timeValue.dataRange[1]).format(formatter)
        return this.$t('chartTitle', { start, end })
      },
      chartData() {
        // 2-7是当前时间尖峰平谷,总数,总碳排
        return this.rawData.slice(0, -1).map(item => [item.code, item.name, ...item.totalDataList])
      },
      tableData() {
        return this.rawData.slice(0, -1)
      },
      params() {
        return {
          projectCodes: this.selectedProject.join(','),
          dateType: this.timeValue.timeType,
          startYmd: dayjs(this.timeValue.dataRange[0]).format('YYYYMMDD'),
          endYmd: dayjs(this.timeValue.dataRange[1]).format('YYYYMMDD'),
        }
      },
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.pathUrl = from.fullPath
      })
    },
    async mounted() {
      this.projectList = JSON.parse(await projectIndexDB.getItem('checkedProjectStr')) // 取值时转为对象
      this.initTimeValue()
      this.query()
    },
    methods: {
      initTimeValue() {
        const timeValue =
          this.$route.params.type === 'yearReport'
            ? {
                levelRange: 'year',
                timeType: 4,
                dateValue: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                dataRange: [dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss')],
              }
            : {
                levelRange: 'month',
                timeType: 3,
                dateValue: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                dataRange: [dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
              }
        this.timeValue = timeValue
      },
      generateColumns(dateList) {
        const dateColumns = dateList.map((date, idx) => {
          const dataN = `[${idx}]`
          return {
            title: date,
            key: date,
            align: 'center',
            children: [
              { title: this.$t('sharpHourElectricityConsumption'), unit: '（kW·h）', key: `dateDataList${dataN}[0]`, align: 'center', minWidth: 120 },
              { title: this.$t('peakHourElectricityConsumption'), unit: '（kW·h）', key: `dateDataList${dataN}[1]`, align: 'center', minWidth: 120 },
              { title: this.$t('regularElectricityConsumption'), unit: '（kW·h）', key: `dateDataList${dataN}[2]`, align: 'center', minWidth: 120 },
              { title: this.$t('electricityConsumptionDuringValleyHours'), unit: '（kW·h）', key: `dateDataList${dataN}[3]`, align: 'center', minWidth: 120 },
              { title: this.$t('totalElectricityConsumption'), unit: '（kW·h）', key: `dateDataList${dataN}[4]`, align: 'center', minWidth: 120 },
              { title: this.$t('carbonEmission'), unit: '（kgCO₂）', key: `dateDataList${dataN}[5]`, align: 'center', minWidth: 120 },
            ],
          }
        })
        return [
          {
            title: this.$t('projectName'),
            align: 'center',
            fixed: 'left',
            key: 'name',
            width: 300,
          },
          ...dateColumns,
          {
            title: this.$t('total'),
            align: 'center',
            fixed: 'right',
            key: 'total',
            children: [
              { title: this.$t('sharpHourElectricityConsumption'), unit: '（kW·h）', key: 'totalDataList[0]', align: 'center', minWidth: 120 },
              { title: this.$t('peakHourElectricityConsumption'), unit: '（kW·h）', key: 'totalDataList[1]', align: 'center', minWidth: 120 },
              { title: this.$t('regularElectricityConsumption'), unit: '（kW·h）', key: 'totalDataList[2]', align: 'center', minWidth: 120 },
              { title: this.$t('electricityConsumptionDuringValleyHours'), unit: '（kW·h）', key: 'totalDataList[3]', align: 'center', minWidth: 120 },
              { title: this.$t('totalElectricityConsumption'), unit: '（kW·h）', key: 'totalDataList[4]', align: 'center', minWidth: 120 },
              { title: this.$t('carbonEmission'), unit: '（kgCO₂）', key: 'totalDataList[5]', align: 'center', minWidth: 120 },
            ],
          },
        ]
      },
      async query() {
        const { success, message, dateDescList, dataList } = await userPrjPowerStatsNew(this.params)
        if (!success) return this.$Message.error(message)
        this.columns = []
        await this.$nextTick()
        this.columns = this.generateColumns(dateDescList)
        this.rawData = dataList
      },
      reset() {
        this.pageNo = 1
        this.selectedProject = []
        this.initTimeValue()
        this.query()
      },
      handleCurrentChange(val) {
        this.pageNo = val
      },
      handleExport() {
        this.$func.windowCountDown(`/project/main/v5/xls/userPrjPowerStatsNew.as?${qs.stringify(this.params)}`)
      },
      footerMethod() {
        const totalData = this.rawData.at(-1)
        return [[this.$t('total')].concat(totalData.dateDataList.flat(), totalData.totalDataList)]
      },
    },
  }
</script>
<style lang="less" scoped>
  .report {
    padding: 10px;
  }
  .Active {
    border: 1px solid #007eff;
    background: rgba(0, 127, 255, 0.2);
    color: #007eff;
  }
  .conditionList {
    background: #1a202e;
    padding: 10px 20px;
    margin: 10px 0;
    .export {
      background: rgba(0, 126, 255, 0.1);
      border: 1px solid #007eff;
      border-radius: 5px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      .ivu-icon {
        color: #007eff;
        margin: 0 !important;
      }
    }
  }
  .conditionCount {
    background: #1a202e;
    padding: 20px;
  }
  /deep/.ivu-select-dropdown {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .charts {
    margin-bottom: 10px;
    display: flex;
    .chart {
      background: #1a202e;
    }
    .chart-title {
      padding: 10px;
      font-size: 14px;
      line-height: 20px;
    }
    .bar-chart {
      flex: 1;
      margin-right: 10px;
      overflow: hidden;
      position: relative;
      .chart-title {
        position: absolute;
        z-index: 1;
        left: 0;
        top: 0;
      }
    }
    .pie-chart {
      width: 25%;
      min-width: 480px;
    }
  }
</style>
