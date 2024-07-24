<template>
  <div class="tab-record-box">
    <div class="table-box">
      <div class="header">
        <div class="left">
          <MKindDatePick v-model="timeValue" size="small" :typeRange="['年', '月', '日']" />
          <Input v-model="searchData.keyword" class="ml-10" size="small" placeholder="搜索流水号/交易渠道流水号" v-width="200" />
          <Select class="ml-10" v-model="status" size="small" v-if="tradeType === 1" v-width="140" :transfer="true" placeholder="状态">
            <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button class="b-blue ml-10" size="small" @click.stop="changePageNo(1)">查询</Button>
          <Button class="b-info ml-10" size="small" @click.stop="reset">重置</Button>
          <Button class="b-blue ml-10" size="small" @click.stop="exportExcel">导出</Button>
        </div>
        <div class="right">
          <RadioGroup v-model="tradeType" size="small" style="font-size: 12px" @on-change="changeTradeType" type="button">
            <Radio :label="1">线上退费</Radio>
            <Radio :label="2">线下退费</Radio>
          </RadioGroup>
        </div>
      </div>
      <RefundTable :tradeType="tradeType" :list="tableData.list"></RefundTable>
      <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
    </div>
    <component :is="modalName" :record="modalInfo" @close="modalName = null" :callback="callbackAction" />
  </div>
</template>

<script>
  import FixStyleIframe from './mixins/FixStyleIframe'
  import TableMixins from './mixins/TableMixins'
  import RefundTable from './component/RefundTable.vue'
  import { offlineRechargeAndRefund, offlineRechargeAndRefundExport, queryOnlineRefund, exportOnlineRefund } from './request/api'
  import { cloneDeep } from 'lodash'
  export default {
    name: 'instant_settlement_user_refund_list',
    mixins: [FixStyleIframe, TableMixins],
    components: { RefundTable, refundSituationModal: () => import('./modals/refundSituationModal.vue') },
    data() {
      return {
        statusOptions: [
          { label: '全部', value: '' },
          { label: '已退费', value: '2' },
          { label: '退费中', value: '1' },
          { label: '退款失败', value: '3' },
          { label: '退款关闭', value: '4' },
        ],
        tradeType: 1,
        searchData: { keyword: '' },
        channel: '',
        status: '',
      }
    },
    provide() {
      return { openModal: this.openModal }
    },
    computed: {
      queryParams() {
        return {
          projectCode: this.$route.query.projectCode,
          accountId: this.$route.query.accountId,
          userId: this.$route.query.userId,
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          ...this.searchData,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
        }
      },
    },
    methods: {
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
      reset() {
        this.channel = ''
        this.status = ''
        this.searchData = { keyword: '' }
        this.timeValue = cloneDeep(this.initTimeValue)
        this.changePageNo(1)
      },
      async exportExcel() {
        const params = { ...this.resultQueryParams, pageSize: 9999999, pageNo: 1 }
        this.tradeType === 1 ? await exportOnlineRefund(params, '退费记录') : await offlineRechargeAndRefundExport(params, '退费记录')
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
  .tab-record-box {
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .table-box {
      padding: 10px;
      .header {
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .left {
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
