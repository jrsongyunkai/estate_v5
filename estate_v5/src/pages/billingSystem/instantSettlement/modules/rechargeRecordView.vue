<template>
  <div class="record-view">
    <div class="search-view">
      <MKindDatePick v-model="timeValue" :typeRange="[$t('year'), $t('month'), $t('day')]" />
      <Button class="b-blue ml-10" @click.stop="queryPageData">{{ $t('query') }}</Button>
      <Button class="b-info ml-10" @click.stop="resetData">{{ $t('reset') }}</Button>
    </div>
    <Row class="top-col" :wrap="false" :gutter="10">
      <Col :span="6" v-for="item in overviewList" :key="item.label" class="item">
        <div class="card-content">
          <div class="lf-pic">
            <img :src="item.image" alt="" />
          </div>
          <div class="rg-info">
            <div class="info-content">
              <div class="label" v-textRoll>{{ item.label }}</div>
              <div class="value">
                {{ item.prefix || '' }}
                <MCountUp :end="item.value" :decimals="item.decimals || 0" />
              </div>
              <div class="trend" v-if="item.hasYq">
                <MTrend type="yoy" :value="item.yoy" />
                <MTrend type="qoq" style="margin-left: 5px" :value="item.qoq" />
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <div class="table-view">
      <div class="header">{{ $t('rechargeRecords') }}</div>
      <div class="search-box">
        <div class="left">
          <Input v-model="searchData.keyword" :placeholder="$t('searchOrderNoTip')" v-width="240" />
          <Select class="ml-10" v-model="channel" v-width="140" :transfer="true" :placeholder="$t('rechargeChannels')">
            <Option v-for="item in channelTypeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select class="ml-10" v-model="status" v-if="tradeType === 1" v-width="140" :transfer="true" :placeholder="$t('state')">
            <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button class="b-blue ml-10" @click.stop="changePageNo(1)">{{ $t('query') }}</Button>
          <Button class="b-info ml-10" @click.stop="reset">{{ $t('reset') }}</Button>
          <Button class="b-blue ml-10" @click.stop="exportExcel">{{ $t('export') }}</Button>
        </div>
        <div>
          <RadioGroup class="ml-10" v-model="tradeType" @on-change="changeTradeType" type="button">
            <Radio :label="1">{{ $t('onlineRecharge') }}</Radio>
            <Radio :label="2">{{ $t('offlineRecharge') }}</Radio>
          </RadioGroup>
        </div>
      </div>
      <div class="table">
        <ReChargeTable :list="tableData.list" :tradeType="tradeType" :callback="search"></ReChargeTable>
        <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import { offlineRechargeAndRefund, offlineRechargeAndRefundExport, rechargeOverview, exportOnlineRecharge, onlineRecharge } from '@/api/billingSystem/instantSettlement'
  import tableMixins from './mixins/tableMixins'
  import ReChargeTable from './components/ReChargeTable.vue'
  import { cloneDeep } from 'lodash'
  export default {
    mixins: [tableMixins],
    components: { ReChargeTable },
    data() {
      return {
        statusOptions: [
          { label: this.$t('whole'), value: '' },
          { label: this.$t('rechargedSuccessfully'), value: '2' },
          { label: this.$t('rechargeFailed'), value: '3' },
        ],
        searchData: { keyword: '' },
        channel: '',
        status: '',
        overviewData: null,
        tradeType: 1,
      }
    },
    inject: ['openModal'],
    computed: {
      overviewList() {
        let { total, online, offline, give } = this.overviewData || { total: null, online: null, offline: null, give: null }
        return [
          { label: this.$t('ns_rechargeOverView.label1'), value: 0, prefix: '¥', decimals: 2, image: '/static/img/instantSettlement/ddzl.png', hasYq: true, yoy: 0, qoq: 0, ...total },
          { label: this.$t('ns_rechargeOverView.label2'), value: 0, prefix: '¥', decimals: 2, image: '/static/img/instantSettlement/recharge.png', hasYq: true, yoy: 0, qoq: 0, ...online },
          { label: this.$t('ns_rechargeOverView.label3'), value: 0, prefix: '¥', decimals: 2, image: '/static/img/instantSettlement/wallet.png', hasYq: true, yoy: 0, qoq: 0, ...offline },
          { label: this.$t('ns_rechargeOverView.label4'), value: 0, prefix: '¥', decimals: 2, image: '/static/img/instantSettlement/gift.png', hasYq: true, yoy: 0, qoq: 0, ...give },
        ]
      },
      queryParams() {
        return {
          projectCode: this.$store.state.projectCode,
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
              { label: this.$t('whole'), value: '' },
              { label: this.$t('weChatPay'), value: '1' },
            ]
          : [
              { label: this.$t('whole'), value: '2,5' },
              { label: this.$t('offlineRecharge'), value: '2' },
              { label: this.$t('giftsOrDiscounts'), value: '5' },
            ]
      },
    },
    methods: {
      resetData() {
        this.timeValue = cloneDeep(this.initTimeValue)
        this.queryPageData()
      },
      queryPageData() {
        this.queryRechargeOverview()
        this.changePageNo(1)
      },
      async exportExcel() {
        const params = { ...this.resultQueryParams, pageSize: 9999999, pageNo: 1 }
        const res = this.tradeType === 1 ? await exportOnlineRecharge(params) : await offlineRechargeAndRefundExport(params)
        this.$func.getPostResFile(res, this.$t('rechargeRecords'))
      },
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
      async queryRechargeOverview() {
        let params = {
          projectCode: this.$store.state.projectCode,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          timeType: this.timeValue.timeType,
        }
        const res = await rechargeOverview(params)
        if (res.success) {
          this.overviewData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changeTradeType(e) {
        this.channel = ''
        this.changePageNo(1)
      },
      reset() {
        this.searchData = { keyword: '' }
        this.status = ''
        this.channel = ''
        this.changePageNo(1)
      },
    },
    mounted() {
      this.queryPageData()
    },
  }
</script>

<style lang="less" scoped>
  .record-view {
    height: calc(~'100vh - 201px');
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .search-view {
      display: flex;
      padding: 10px;
      background: var(--card-bg-color);
    }
    .top-col {
      padding: 0px;
      overflow: auto;
      margin-top: 10px;
      .item {
        min-width: 260px;
        .card-content {
          padding: 10px;
          background: var(--card-bg-color);
          display: flex;
          .lf-pic {
            width: 70px;
            height: 70px;
            margin-right: 5px;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .rg-info {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: start;
            overflow: hidden;
            height: 70px;
            .info-content {
              width: 100%;
              overflow: hidden;
              .label {
                font-size: 12px;
                width: 100%;
              }
              .value {
                font-size: 14px;
                line-height: 30px;
              }
              .trend {
                font-size: 12px;
                display: flex;
              }
            }
          }
        }
      }
    }
    .table-view {
      margin-top: 10px;
      background: var(--card-bg-color);
      padding: 10px;
      .search-box {
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        .left {
          display: flex;
        }
        /deep/.ivu-radio-group {
          display: flex;
        }
      }
    }
  }
</style>
