<template>
  <div class="userList-page">
    <div class="table-col">
      <div class="search-box">
        <Input v-model="keyword" size="small" placeholder="请输入用户信息" v-width="250" />
        <Select class="ml-10" size="small" v-model="userType" v-width="200" :transfer="true" placeholder="账号状态">
          <Option v-for="item in accountStatusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button class="b-blue ml-10" size="small" @click.stop="changePageNo(1)">查询</Button>
        <Button class="b-info ml-10" size="small" @click.stop="reset">重置</Button>
      </div>
      <div>
        <Table :columns="columns" border :data="tableData.list" size="small">
          <template #userType="{ row }">{{ row.userType === 1 ? '临时用户' : row.userType === 2 ? '注册用户' : row.userType === 0 ? '初始用户' : row.userType === -1 ? '已注销' : '' }}</template>
          <template #action="{ row }">
            <Button type="text" size="small" :disabled="[-1, 0].includes(row.userType)" class="text-btn-primary" @click.stop="openModal('offLineRechargeModal', row, search)">线下充值</Button>
            <Button type="text" size="small" :disabled="[-1, 0].includes(row.userType)" class="text-btn-primary" @click.stop="openModal('offLineRefundModal', row, search)">线下退费</Button>
            <Button type="text" size="small" :disabled="[-1, 0].includes(row.userType)" class="text-btn-primary" @click.stop="openModal('giftDiscountsModal', row, search)">赠送/优惠</Button>
            <Button type="text" size="small" :disabled="row.userType === 0" class="text-btn-primary" @click.stop="openFlowRecord(row)">流水记录</Button>
          </template>
        </Table>
        <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
      </div>
    </div>
    <component :is="modalName" :record="modalInfo" @close="modalName = null" :callback="callbackAction" />
  </div>
</template>

<script>
  import FixStyleIframe from './mixins/FixStyleIframe'
  import { queryUserPage } from './request/api'
  import TableMixins from './mixins/TableMixins'
  export default {
    name: 'instant_settlement_user_list',
    components: {
      refundModal: () => import('./modals/refundModal.vue'),
      offLineRechargeModal: () => import('./modals/offLineRechargeModal.vue'),
      offLineRefundModal: () => import('./modals/offLineRefundModal.vue'),
      giftDiscountsModal: () => import('./modals/giftDiscountsModal.vue'),
    },
    mixins: [FixStyleIframe, TableMixins],
    data() {
      return {
        keyword: '',
        userType: null,
        columns: [
          { title: '用户信息', key: 'username' },
          { title: '账号状态', key: 'userType', slot: 'userType' },
          { title: '最近一次活跃时间', key: 'lastOrderTime' },
          { title: '账户余额（元）', key: 'currentAmount' },
          { title: '总消费金额（元）', key: 'totalPayAmount' },
          { title: '总订单数', key: 'totalOrder' },
          { title: '总用电量（kW·h）', key: 'totalPower' },
          { title: '订单平均消费金额（元）', key: 'avgOrderAmount' },
          { title: '订单平均用电量（kW·h）', key: 'avgOrderPower' },
          { title: '操作', slot: 'action', fixed: 'right', align: 'center', width: 300 },
        ],
        accountStatusOptions: [
          { label: '全部用户', value: null },
          { label: '初始用户', value: 0 },
          { label: '注册用户', value: 2 },
          { label: '临时用户', value: 1 },
          { label: '已注销', value: -1 },
        ],
      }
    },
    computed: {
      queryParams() {
        return {
          projectCode: this.$route.query.projectCode,
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          keyword: this.keyword,
          userType: this.userType,
        }
      },
    },
    methods: {
      reset() {
        this.keyword = ''
        this.userType = null
        this.changePageNo(1)
      },
      async search() {
        const res = await queryUserPage(this.queryParams)
        if (res.success) {
          this.tableData.list = res.datas || []
          this.tableData.total = res.total || 0
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      openFlowRecord(row) {
        window.parent.postMessage({ action: 'flowRecord', record: { ...row, projectCode: this.$route.query.projectCode } }, '*')
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
  .userList-page {
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .table-col {
      padding: 0px 10px;
      margin-top: 10px;
      background: var(--card-bg-color);
      .header {
        font-size: 16px;
        margin-bottom: 10px;
      }
      .search-box {
        display: flex;
        margin-bottom: 10px;
        align-items: center;
      }
    }
  }
</style>
