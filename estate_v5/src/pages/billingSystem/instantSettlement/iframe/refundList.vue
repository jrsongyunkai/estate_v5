<template>
  <div class="record-view">
    <div class="header" style="margin-top: 10px; font-size: 14px">退费记录</div>
    <div class="table-box">
      <div class="header">
        <div class="left">
          <div class="search-view">
            <MKindDatePick size="small" v-model="timeValue" :typeRange="['年', '月', '日']" />
            <Input size="small" v-model="searchData.keyword" class="ml-10" placeholder="搜索流水号/交易渠道流水号" v-width="200" />
            <Select class="ml-10" size="small" v-if="tradeType === 1" v-model="status" v-width="140" :transfer="true" placeholder="状态">
              <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button class="b-blue ml-10" size="small" @click.stop="changePageNo(1)">查询</Button>
            <Button class="b-info ml-10" size="small" @click.stop="reset">重置</Button>
            <Button class="b-blue ml-10" size="small" @click.stop="exportExcel">导出</Button>
          </div>
        </div>
        <div class="right">
          <RadioGroup style="font-size: 12px" v-model="tradeType" @on-change="changeTradeType" size="small" type="button">
            <Radio :label="1">线上退费</Radio>
            <Radio :label="2">线下退费</Radio>
          </RadioGroup>
        </div>
      </div>
      <RefundTable :list="tableData.list" :tradeType="tradeType"></RefundTable>
      <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
    </div>
    <component :is="modalName" :record="modalInfo" @close="modalName = null" :callback="callbackAction" />
  </div>
</template>

<script>
  import FixStyleIframe from './mixins/FixStyleIframe'
  import TableMixins from './mixins/TableMixins'
  import { offlineRechargeAndRefund, offlineRechargeAndRefundExport, queryOnlineRefund, exportOnlineRefund } from './request/api'
  import RefundTable from './component/RefundTable.vue'
  import { cloneDeep } from 'lodash'
  export default {
    name: 'instant_settlement_refund_list',
    components: { RefundTable, refundSituationModal: () => import('./modals/refundSituationModal.vue') },
    mixins: [FixStyleIframe, TableMixins],
    data() {
      return {
        options: [],
        tradeType: 1,
        channel: '',
        status: '',
        searchData: { keyword: '' },
        statusOptions: [
          { label: '全部', value: '' },
          { label: '退费成功', value: '2' },
          { label: '退费中', value: '1' },
          { label: '退费失败', value: '3' },
          { label: '退费关闭', value: '4' },
        ],
      }
    },
    provide() {
      return { openModal: this.openModal }
    },
    computed: {
      queryParams() {
        return {
          projectCode: this.$route.query.projectCode,
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          timeType: this.timeValue.timeType,
          ...this.searchData,
        }
      },
    },
    methods: {
      reset() {
        this.timeValue = cloneDeep(this.initTimeValue)
        this.status = ''
        this.channel = ''
        this.searchData = { keyword: '' }
        this.changePageNo(1)
      },
      async exportExcel() {
        let params = { ...this.resultQueryParams, pageNo: 1, pageSize: 9999999 }
        this.tradeType === 1 ? await exportOnlineRefund(params, '退费记录') : await offlineRechargeAndRefundExport(params, '退费记录')
      },
      async search() {
        const params = this.tradeType === 1 ? { ...this.queryParams, status: this.status, channel: this.channel } : { ...this.queryParams, bizTypeList: [4, 9] }
        const res = this.tradeType === 1 ? await queryOnlineRefund(params) : await offlineRechargeAndRefund(params)
        if (res.success) {
          this.resultQueryParams = cloneDeep(params)
          this.tableData.list = (res.data && res.data.list) || []
          this.tableData.total = (res.data && res.data.totalRow) || 0
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changeTradeType() {
        this.changePageNo(1)
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
  .record-view {
    overflow: auto;
    scrollbar-width: none;
    padding: 0px 10px;
    &::-webkit-scrollbar {
      display: none;
    }
    .table-box {
      margin-top: 10px;
      .header {
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .left {
          .search-view {
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
</style>
