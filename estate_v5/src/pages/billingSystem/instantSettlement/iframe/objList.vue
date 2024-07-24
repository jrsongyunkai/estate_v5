<template>
  <div class="obj-page">
    <div class="search">
      <div>
        <LineCascader size="small" v-model="searchData.macAddr" />
        <Select class="ml-10" size="small" v-model="searchData.status" style="width: 200px" :transfer="true" placeholder="当前状态">
          <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <DatePicker format="yyyy-MM-dd HH:mm:ss" size="small" :value="[searchData.startTime, searchData.endTime]" transfer type="datetimerange" placement="bottom-end" :placeholder="'添加时间（区间）'" @on-change="handleTimer" style="width: 300px" class="ml-10"></DatePicker>
        <Button class="b-blue ml-10" size="small" @click="changePageNo(1)">查询</Button>
        <Button class="b-info ml-10" size="small" @click="reset">重置</Button>
        <Button class="b-blue ml-10" size="small" @click="exportExcel">导出</Button>
      </div>
    </div>
    <div class="content">
      <div class="table">
        <Table :columns="columns" border :data="tableData.list" style="margin-top: 10px">
          <template #device="{ row }">{{ `${row.macName}（${row.mac}）` }}</template>
          <template #addr="{ row }">{{ `${row.addrName}（${row.mac}-${row.addr.toString().padStart(2, '0')}）` }}</template>
          <template #status="{ row }">
            <span v-if="row.status === 2" class="status error">{{ row.statusDesc }}</span>
            <span v-else-if="row.status === 1" class="status success">{{ row.statusDesc }}</span>
            <span v-else-if="row.status === 0" class="status disabled">{{ row.statusDesc }}</span>
            <span v-else-if="row.status === 3" class="status disabled">{{ row.statusDesc }}</span>
            <span v-else-if="row.status === 4" class="status warn">{{ row.statusDesc }}</span>
            <span v-else class="status disabled">{{ row.statusDesc }}</span>
          </template>
          <template #dailyAvgUsageRate="{ row }">{{ row.dailyAvgUsageRate }}%</template>
          <template #rtsSupervisorList="{ row }">
            <TagsAutoTableCell v-if="row.rtsSupervisorList.length" :tagList="row.rtsSupervisorList"></TagsAutoTableCell>
          </template>
          <template #userPayCode="{ row }">
            <QRCodeCell :text="createQrCodeText(row)" trigger="hover">
              <div style="text-align: center">
                <div>{{ `${row.macName}（${row.mac}）` }}</div>
                <div>{{ `${row.addrName}（${row.mac}-${row.addr.toString().padStart(2, '0')}）` }}</div>
              </div>
            </QRCodeCell>
          </template>
        </Table>
        <Page :page-size="tableData.pageSize" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import LineCascader from './component/LineCascader.vue'
  import FixStyleIframe from './mixins/FixStyleIframe'
  import TableMixins from './mixins/TableMixins'
  import { queryTimeSettlementObjPage } from './request/api'
  import QRCodeCell from '@/pages/billingSystem/component/QRCodeCell.vue'
  import TagsAutoTableCell from '@/pages/billingSystem/component/TagsAutoTableCell.vue'
  import qs from 'qs'
  import { createQrCodeText } from '../common'
  export default {
    name: 'instant_settlement_obj_list',
    components: { LineCascader, QRCodeCell, TagsAutoTableCell },
    mixins: [FixStyleIframe, TableMixins],
    data() {
      return {
        statusOptions: [
          { label: '全部', value: '' },
          { label: '使用中', value: '2' },
          { label: '空闲', value: '1' },
          { label: '禁用中', value: '0' },
          { label: '节点离线', value: '3' },
          { label: '节点移除', value: '4' },
        ],
        searchData: { macAddr: [], status: '', startTime: '', endTime: '' },
        columns: [
          { title: '设备', slot: 'device' },
          { title: '线路', slot: 'addr' },
          { title: '当前状态', key: 'status', slot: 'status' },
          { title: '添加时间', key: 'createTime' },
          { title: '计费模式', key: 'feeStandardTypeDesc' },
          { title: '计费类型', key: 'chargeTypeDesc' },
          { title: '使用总时长（h）', key: 'useDuration' },
          { title: '日平均使用率', key: 'dailyAvgUsageRate', slot: 'dailyAvgUsageRate' },
          { title: '总消费金额（元）', key: 'orderAmount' },
          { title: '监收人', slot: 'rtsSupervisorList', width: 220 },
          { title: '用户缴费码', slot: 'userPayCode' },
        ],
      }
    },
    computed: {
      queryParams() {
        return {
          projectCode: this.$route.query.projectCode,
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          resId: this.searchData.macAddr[0],
          addr: this.searchData.macAddr[1],
          startDate: this.searchData.startTime || undefined,
          endDate: this.searchData.endTime || undefined,
          status: this.searchData.status || undefined,
        }
      },
    },
    methods: {
      createQrCodeText: createQrCodeText,
      handleTimer(e) {
        this.searchData.startTime = e[0]
        this.searchData.endTime = e[1]
      },
      async exportExcel() {
        this.$func.windowCountDown(`${this.$func.ctxPaths().replace('v5.', 'es.')}/realTimeSettlement/exportOrderOverView.as?${qs.stringify(this.queryParams)}`)
      },
      async search() {
        const res = await queryTimeSettlementObjPage(this.queryParams)
        if (res.success) {
          this.tableData.list = (res.data && res.data.datas && res.data.datas.map(it => ({ ...it, rtsSupervisorList: it.rtsSupervisorList.map(it => ({ ...it, label: `${it.userName}(${it.phone})` })) }))) || []
          this.tableData.total = res.data.total || 0
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      reset() {
        this.searchData = { macAddr: [], status: '', startTime: '', endTime: '' }
        this.changePageNo(1)
      },
    },
    mounted() {
      window.parent.postMessage({ action: 'loadOverDetail' }, '*')
      this.changePageNo(1)
    },
  }
</script>
<style lang="less">
  @import url('./style.less');
</style>
<style lang="less" scoped>
  .obj-page {
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .search {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      border-radius: 4px;
    }
    .content {
      width: 100%;
      padding: 0 10px;
      border-radius: 4px;
      background: #fff;
    }
  }
</style>
