<template>
  <div class="consume-record-view">
    <div class="table-view">
      <div class="search-box">
        <MKindDatePick v-model="timeValue" size="small" :typeRange="['年', '月', '日']" />
        <LineCascader size="small" class="ml-10" v-model="searchData.macAddr" />
        <Select class="ml-10" size="small" v-model="searchData.orderStatus" v-width="140" :transfer="true" placeholder="订单状态">
          <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Input size="small" v-model="searchData.orderNo" class="ml-10" placeholder="请输入订单号" v-width="240" />
        <Input size="small" v-model="searchData.accountName" class="ml-10" placeholder="请输入账号名称" v-width="240" />
        <Button size="small" class="b-blue ml-10" @click.stop="changePageNo(1)">查询</Button>
        <Button size="small" class="b-info ml-10" @click.stop="reset">重置</Button>
        <Button size="small" class="b-blue ml-10" @click.stop="exportExcel">导出</Button>
      </div>
      <div class="table">
        <ConsumeTable :list="tableData.list" :sumData="sumData"></ConsumeTable>
        <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import LineCascader from './component/LineCascader.vue'
  import FixStyleIframe from './mixins/FixStyleIframe'
  import TableMixins from './mixins/TableMixins'
  import ConsumeTable from './component/ConsumeTable.vue'
  import { queryConsumption, exportConsumption } from './request/api'
  import { cloneDeep } from 'lodash'
  export default {
    name: 'instant_settlement_consume_list',
    components: { LineCascader, ConsumeTable },
    mixins: [FixStyleIframe, TableMixins],
    data() {
      return {
        sumData: {},
        searchData: { macAddr: [], orderNo: '', accountName: '', orderStatus: '' },
        statusOptions: [
          { label: '全部', value: '' },
          { label: '进行中', value: '1' },
          { label: '已完结', value: '2' },
          { label: '待支付', value: '3' },
          { label: '计费暂停', value: '4' },
        ],
      }
    },
    computed: {
      queryParams() {
        return {
          projectCode: this.$route.query.projectCode,
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          orderNo: this.searchData.orderNo,
          accountName: this.searchData.accountName,
          targetValue: this.searchData.macAddr.join(':'),
          orderStatus: this.searchData.orderStatus,
        }
      },
    },
    methods: {
      reset() {
        this.searchData = { macAddr: [], orderNo: '', orderStatus: '' }
        this.timeValue = cloneDeep(this.initTimeValue)
        this.changePageNo(1)
      },
      async search() {
        const res = await queryConsumption({ ...this.queryParams })
        if (res.success) {
          this.resultQueryParams = cloneDeep(this.queryParams)
          this.tableData.list = []
          if (res.datas) {
            res.datas.forEach(item => {
              if (item.periodList && item.periodList.length) {
                this.tableData.list.push(...item.periodList.map(it => ({ ...item, ...it })))
              } else {
                this.tableData.list.push(item)
              }
            })
          }
          this.sumData = res.sumData
          this.tableData.total = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async exportExcel() {
        await exportConsumption({ ...this.resultQueryParams, pageNo: 1, pageSize: 9999999 }, '消费记录')
      },
    },
    mounted() {
      this.changePageNo(1)
    },
  }
</script>
<style lang="less">
  @import url('./style.less');
</style>
<style lang="less" scoped>
  .consume-record-view {
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .table-view {
      padding: 10px;
      .search-box {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
      }
    }
  }
</style>
