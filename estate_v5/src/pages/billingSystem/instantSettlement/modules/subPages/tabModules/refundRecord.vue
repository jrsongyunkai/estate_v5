<template>
  <div class="tab-record-box">
    <div class="search">
      <MKindDatePick v-model="timeValue" :typeRange="[$t('year'), $t('month'), $t('day')]" />
      <Input class="ml-10" v-model="searchData.keyword" :placeholder="$t('searchOrderNoTip')" v-width="200" />
      <Select class="ml-10" v-model="status" v-if="tradeType === 1" v-width="140" :transfer="true" :placeholder="$t('state')">
        <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button class="b-blue ml-10" @click.stop="changePageNo(1)">{{ $t('query') }}</Button>
      <Button class="b-info ml-10" @click.stop="reset">{{ $t('reset') }}</Button>
      <Button class="b-blue ml-10" @click.stop="exportExcel">{{ $t('export') }}</Button>
    </div>
    <div class="table-box">
      <div class="header">
        <div class="left">{{ $t('refundRecord') }}</div>
        <div class="right">
          <RadioGroup v-model="tradeType" @on-change="changeTradeType" type="button">
            <Radio :label="1">{{ $t('onlineRefund') }}</Radio>
            <Radio :label="2">{{ $t('offlineRefund') }}</Radio>
          </RadioGroup>
        </div>
      </div>
      <RefundTable :tradeType="tradeType" :list="tableData.list"></RefundTable>
      <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
    </div>
  </div>
</template>

<script>
  import tableMixins from '../../mixins/tableMixins'
  import RefundTable from '../../components/RefundTable.vue'
  import { offlineRechargeAndRefund, offlineRechargeAndRefundExport, queryOnlineRefund, exportOnlineRefund } from '@/api/billingSystem/instantSettlement'
  import { cloneDeep } from 'lodash'
  export default {
    props: {
      record: { type: Object, default: () => {} },
    },
    components: { RefundTable },
    mixins: [tableMixins],
    data() {
      return {
        statusOptions: [
          { label: this.$t('whole'), value: '' },
          { label: this.$t('refundStatusOption.label2'), value: '2' },
          { label: this.$t('refundStatusOption.label1'), value: '1' },
          { label: this.$t('refundStatusOption.label3'), value: '3' },
          { label: this.$t('refundStatusOption.label4'), value: '4' },
        ],
        tradeType: 1,
        channel: '',
        status: '',
        searchData: { keyword: '' },
      }
    },
    inject: ['openModal'],
    computed: {
      queryParams() {
        return {
          projectCode: this.$store.state.projectCode,
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          ...this.searchData,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          accountId: this.record.accountId,
          userId: this.record.userId,
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
        const res = this.tradeType === 1 ? await exportOnlineRefund(params) : await offlineRechargeAndRefundExport(params)
        this.$func.getPostResFile(res, this.$t('refundRecord'))
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

<style lang="less" scoped>
  .tab-record-box {
    .search {
      background: var(--card-bg-color);
      display: flex;
      margin-bottom: 10px;
      padding: 10px;
    }
    .table-box {
      background: var(--card-bg-color);
      padding: 10px;
      .header {
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .left {
          font-weight: bold;
          font-size: 16px;
        }
      }
    }
  }
</style>
