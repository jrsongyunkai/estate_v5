<template>
  <div class="userList-page">
    <div class="table-col">
      <div class="search-box">
        <Input v-model="keyword" placeholder="请输入用户信息" v-width="250" />
        <Select class="ml-10" v-model="userType" v-width="200" :transfer="true" placeholder="账号状态">
          <Option v-for="item in accountStatusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button class="b-blue ml-10" @click.stop="changePageNo(1)">查询</Button>
        <Button class="b-info ml-10" @click.stop="reset">重置</Button>
        <Button class="b-info ml-10" @click.stop="exportExcel">导出</Button>
      </div>
      <div>
        <Table :columns="columns" border :data="tableData.list" size="small" :span-method="spanMethod">
          <template #userType="{ row }">{{ row.userType === 1 ? '临时用户' : row.userType === 2 ? '注册用户' : row.userType === 0 ? '初始用户' : row.userType === -1 ? '已注销' : '' }}</template>
        </Table>
        <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import FixStyleIframe from './mixins/FixStyleIframe'
  import { queryUserAllPage, exportUserAllPage } from './request/api'
  import TableMixins from './mixins/TableMixins'
  import { cloneDeep } from 'lodash'
  export default {
    name: 'instant_settlement_user_page',
    mixins: [FixStyleIframe, TableMixins],
    data() {
      return {
        keyword: '',
        userType: null,
        columns: [
          { title: '用户信息', key: 'username', isMerge: true },
          { title: '账号状态', key: 'userType', slot: 'userType', isMerge: true },
          { title: '最近一次活跃时间', key: 'lastOrderTime', isMerge: true },
          { title: '项目', key: 'projectName', isMerge: false },
          { title: '账户余额（元）', key: 'accountAmount', isMerge: false },
          { title: '总消费金额（元）', key: 'payAmount', isMerge: false },
          { title: '订单数', key: 'orderAmount', isMerge: false },
          { title: '用电量（kW·h）', key: 'power', isMerge: false },
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
        const res = await queryUserAllPage(this.queryParams)
        this.resultQueryParams = cloneDeep(this.queryParams)
        if (res.success) {
          this.tableData.list = []
          if (res.datas) {
            res.datas.forEach(item => {
              if (item.userProjectStatsList && item.userProjectStatsList.length) {
                this.tableData.list.push(...item.userProjectStatsList.map(it => ({ ...item, ...it })))
              } else {
                this.tableData.list.push(item)
              }
            })
          }
          this.tableData.total = res.total || 0
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async exportExcel() {
        await exportUserAllPage({ ...this.resultQueryParams, pageNo: 1, pageSize: 9999999 }, '用户列表')
      },
      getSpan(rowIndex) {
        const row = this.tableData.list[rowIndex]
        const preRow = this.tableData.list[rowIndex - 1]
        const rowSpan = this.tableData.list.filter(item => item.userId === row['userId']).length
        if (!preRow || row['userId'] !== preRow['userId']) {
          return [rowSpan, 1]
        } else {
          return [0, 0]
        }
      },
      spanMethod({ column, rowIndex }) {
        if (column.isMerge) {
          return this.getSpan(rowIndex)
        }
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
