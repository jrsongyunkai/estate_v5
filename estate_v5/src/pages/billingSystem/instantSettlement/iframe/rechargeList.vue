<template>
  <div class="record-view">
    <div class="table-view">
      <div class="header">
        <div style="font-size: 14px">充值记录</div>
        <div style="font-size: 12px">
          <RadioGroup class="ml-10" size="small" style="font-size: 12px" v-model="tradeType" @on-change="changeTradeType" type="button">
            <Radio :label="1">线上充值</Radio>
            <Radio :label="2">线下充值</Radio>
          </RadioGroup>
        </div>
      </div>
      <div class="search-box">
        <MKindDatePick v-model="timeValue" size="small" :typeRange="['年', '月', '日']" />
        <Input v-model="searchData.keyword" class="ml-10" size="small" placeholder=" 搜索流水号/交易渠道流水号" v-width="240" />
        <Select class="ml-10" size="small" v-model="channel" v-width="140" :transfer="true" placeholder="充值渠道">
          <Option v-for="item in channelTypeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select class="ml-10" size="small" v-model="status" v-if="tradeType === 1" v-width="140" :transfer="true" placeholder="状态">
          <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button class="b-blue ml-10" size="small" @click.stop="changePageNo(1)">查询</Button>
        <Button class="b-info ml-10" size="small" @click.stop="reset">重置</Button>
        <Button class="b-blue ml-10" size="small" @click.stop="exportExcel">导出</Button>
      </div>
      <div class="table">
        <ReChargeTable :list="tableData.list" :tradeType="tradeType" :callback="search"></ReChargeTable>
        <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
      </div>
    </div>
    <component :is="modalName" :record="modalInfo" @close="modalName = null" :callback="callbackAction" />
  </div>
</template>

<script>
  import FixStyleIframe from './mixins/FixStyleIframe'
  import ReChargeTable from './component/ReChargeTable.vue'
  import TableMixins from './mixins/TableMixins'
  import { offlineRechargeAndRefund, onlineRecharge, offlineRechargeAndRefundExport, exportOnlineRecharge } from './request/api'
  import { cloneDeep } from 'lodash'
  export default {
    name: 'instant_settlement_recharge_list',
    mixins: [FixStyleIframe, TableMixins],
    components: {
      ReChargeTable,
      refundModal: () => import('./modals/refundModal.vue'),
      refundSituationModal: () => import('./modals/refundSituationModal.vue'),
    },
    data() {
      return {
        tradeType: 1,
        channel: '',
        status: '',
        searchData: { keyword: '' },
        statusOptions: [
          { label: '全部', value: '' },
          { label: '充值成功', value: '2' },
          { label: '充值失败', value: '3' },
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
          ...this.searchData,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
        }
      },
      channelTypeOptions() {
        return this.tradeType === 1
          ? [
              { label: '全部', value: '' },
              { label: '微信', value: '1' },
            ]
          : [
              { label: '全部', value: '2,5' },
              { label: '线下充值', value: '2' },
              { label: '赠送/优惠', value: '5' },
            ]
      },
    },
    methods: {
      async search() {
        const params = this.tradeType === 1 ? { ...this.queryParams, statusList: this.status, channel: this.channel } : { ...this.queryParams, bizTypeList: this.channel ? this.channel.split(',') : [2, 5] }
        const res = this.tradeType === 1 ? await onlineRecharge(params) : await offlineRechargeAndRefund(params)
        if (res.success) {
          this.resultQueryParams = cloneDeep(params)
          this.tableData.list = (res.data && res.data.list) || []
          this.tableData.total = (res.data && res.data.totalRow) || 0
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async exportExcel() {
        const params = { ...this.resultQueryParams, pageNo: 1, pageSize: 9999999 }
        this.tradeType === 1 ? await exportOnlineRecharge(params, '充值记录') : await offlineRechargeAndRefundExport(params, '充值记录')
      },
      changeTradeType() {
        this.channel = ''
        this.changePageNo(1)
      },
      reset() {
        this.timeValue = cloneDeep(this.initTimeValue)
        this.searchData = { keyword: '' }
        this.status = ''
        this.channel = ''
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
    &::-webkit-scrollbar {
      display: none;
    }
    .table-view {
      padding: 10px;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .search-box {
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
      }
    }
  }
</style>
