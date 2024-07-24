<template>
  <div class="tab-record-content">
    <div class="search">
      <MKindDatePick v-model="timeValue" :typeRange="[$t('year'), $t('month'), $t('day')]" />
      <LineCascader class="ml-10" v-model="searchData.macAddr" />
      <Select class="ml-10" v-model="searchData.orderStatus" v-width="140" :transfer="true" :placeholder="$t('orderState')">
        <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Input v-model="searchData.orderNo" class="ml-10" :placeholder="$t('pleaseEnterOrderNo')" v-width="240" />
      <Button class="b-blue ml-10" @click.stop="changePageNo(1)">{{ $t('query') }}</Button>
      <Button class="b-info ml-10" @click.stop="reset">{{ $t('reset') }}</Button>
      <Button class="b-blue ml-10" @click.stop="exportExcel">{{ $t('export') }}</Button>
    </div>
    <div class="table">
      <ConsumeTable :list="tableData.list" isUser :sumData="sumData" @refresh="search"></ConsumeTable>
      <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
    </div>
  </div>
</template>

<script>
  import LineCascader from '@/pages/billingSystem/component/LineCascader.vue'
  import ConsumeTable from '../../components/ConsumeTable.vue'
  import tableMixins from '../../mixins/tableMixins'
  import { queryConsumption, exportConsumption } from '@/api/billingSystem/instantSettlement'
  import { cloneDeep } from 'lodash'
  export default {
    props: {
      record: { type: Object, default: () => {} },
    },
    components: { LineCascader, ConsumeTable },
    mixins: [tableMixins],
    data() {
      return {
        statusOptions: [
          { label: this.$t('whole'), value: '' },
          { label: this.$t('inProgress'), value: '1' },
          { label: this.$t('completed'), value: '2' },
          { label: this.$t('toBePaid'), value: '3' },
          { label: this.$t('billingSuspended'), value: '4' },
        ],
        sumData: {},
        searchData: { macAddr: [], orderNo: '', orderStatus: '' },
      }
    },
    computed: {
      queryParams() {
        return {
          projectCode: this.$store.state.projectCode,
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          orderNo: this.searchData.orderNo,
          targetValue: this.searchData.macAddr.join(':'),
          orderStatus: this.searchData.orderStatus,
          accountId: this.record.accountId,
          userId: this.record.userId,
        }
      },
    },
    methods: {
      async exportExcel() {
        const res = await exportConsumption({ ...this.resultQueryParams, pageSize: 9999999, pageNo: 1 })
        this.$func.getPostResFile(res, this.$t('personalConsumptionRecords'))
      },
      reset() {
        this.searchData = { macAddr: [], orderNo: '', orderStatus: '' }
        this.timeValue = cloneDeep(this.initTimeValue)
        this.changePageNo(1)
      },
      async search() {
        const res = await queryConsumption(this.queryParams)
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
          this.tableData.total = res.total || 0
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.changePageNo(1)
    },
  }
</script>

<style lang="less" scoped>
  .tab-record-content {
    background: var(--card-bg-color);
    padding: 15px;
    .search {
      display: flex;
      margin-bottom: 10px;
    }
  }
</style>
