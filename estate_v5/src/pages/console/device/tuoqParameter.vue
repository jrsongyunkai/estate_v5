<template>
  <div class="tqparameter">
    <div class="header">
      <Breadcrumb>
        <BreadcrumbItem class="pointer" style="color: #7b7b7b" @click.native="$router.push('/console/device')">{{ $t('back') }}</BreadcrumbItem>
        <BreadcrumbItem>{{ $t('parameterReporting') }}</BreadcrumbItem>
      </Breadcrumb>
      <Row class="search">
        <DatePicker type="daterange" placement="bottom-end" :placeholder="$t('pleaseSelect')" style="width: 200px" v-model="timer" @on-change="handleTimer"></DatePicker>
        <Button type="primary" class="ml-10" @click="handlechtqdqWaterMeterParameter">{{ $t('query') }}</Button>
        <Button class="ml-10" @click="clear">{{ $t('reset') }}</Button>
        <Button class="ml-10" type="primary" ghost @click="downloadExcel">{{ $t('export') }}</Button>
      </Row>
    </div>
    <div class="table">
      <Table :data="noteData" height="1000" :columns="notecolumns" style="width: 100%; margin-top: 10px">
        <template slot-scope="{ row }" slot="value1">{{ row.value.split('|')[0] }}</template>
        <template slot-scope="{ row }" slot="value2">{{ row.value.split('|')[1] }}</template>
        <template slot-scope="{ row }" slot="value3">{{ row.value.split('|')[2] }}</template>
      </Table>
      <Page :current="currentPage" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changesize" :total="total" />
    </div>
  </div>
</template>
<script>
  import { chtqdqWaterMeterParameter } from '@/api/public'
  import qs from 'qs'
  export default {
    data() {
      return {
        currentPage: 1,
        total: 0,
        page: 1,
        pageSize: 20,
        timer: [this.$Date().format('YYYY-MM') + '-' + '01', this.$Date().format('YYYY-MM-DD')],
        pathUrl: '',
        noteData: [],
        notecolumns: [
          { title: this.$t('reportingTime'), key: 'acqTime' },
          { title: this.$t('totalUsage'), slot: 'value1' },
          { title: this.$t('settlementCycleUsage'), slot: 'value2' },
          { title: this.$t('remainingAmount'), slot: 'value3' },
        ],
      }
    },
    mounted() {
      this.handlechtqdqWaterMeterParameter()
    },
    methods: {
      clear() {
        this.timer = []
      },
      handleTimer(val) {
        this.timer = val
      },
      async handlechtqdqWaterMeterParameter() {
        let params = {
          pageNum: this.page,
          pageSize: this.pageSize,
          order: 'desc',
          startTime: this.timer[0],
          endTime: this.timer[1],
          mac: this.$store.state.parameterMac,
        }
        const res = await chtqdqWaterMeterParameter(params)
        if (res.success) {
          this.noteData = res.data
          if (res.data.length === this.pageSize) {
            this.total = this.page * this.pageSize + 1
          } else {
            this.total = (this.page - 1) * this.pageSize + res.data.length
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changePage(val) {
        this.page = val
        this.handlechtqdqWaterMeterParameter()
      },
      changesize(val) {
        this.pageSize = val
        this.handlechtqdqWaterMeterParameter()
      },
      downloadExcel() {
        const params = {
          startTime: this.timer[0],
          endTime: this.timer[1],
          mac: this.$store.state.parameterMac,
        }
        this.$func.windowCountDown(`/chtqdq/exportChtqdqWaterMeterReadingDataHistory.as?${qs.stringify(params)}`)
      },
    },
  }
</script>
<style lang="less">
  .tqparameter {
    padding: 10px;
    .search {
      margin-top: 10px;
      padding: 10px;
      background: #1a202e;
    }
    .table {
      margin-top: 10px;
      padding: 10px;
      background: #1a202e;
    }
  }
</style>
