<template>
  <div>
    <Table :columns="receiveColumn" :data="receiveTable" @on-selection-change="getChange">
      <template #channels="{ row }">{{ noticeText(row) }}</template>
    </Table>
    <Page style="margin-top: 10px" background show-elevator @on-change="handlePage" :current="pageNo" :page-size="pageSize" :total="total" show-total></Page>
  </div>
</template>

<script>
  import { getPushObjectListPage } from '@api/setting/projectInfo.js'
  import { cloneDeep } from 'lodash'
  export default {
    props: {
      listData: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        receiveTable: [],
        selectTableData: [],
        receiveColumn: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            type: 'index',
            title: this.$t('index'),
          },
          {
            title: this.$t('reciverName'),
            key: 'name',
          },
          {
            title: this.$t('contactMethod'),
            key: 'address',
          },
          {
            title: this.$t('noticeMethod'),
            slot: 'channels',
          },
        ],
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
    },
    mounted() {
      this.selectTableData = cloneDeep(this.listData.map(v => ({ ...v, label: `${v.name}(${v.address})` })))
      this.getTableData()
    },
    methods: {
      async getTableData() {
        const res = await getPushObjectListPage({ pageNo: this.pageNo, pageSize: this.pageSize })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.total = res.total
        this.receiveTable = res.datas.map(v => ({ ...v, _checked: !!this.selectTableData.filter(j => j.id === v.id).length, label: `${v.name}(${v.address})` }))
      },
      getChange(val) {
        const ids = val.map(v => v.id)
        const noIds = this.receiveTable.filter(it => !ids.includes(it.id)).map(v => v.id)
        const selectTableDataFilter = this.selectTableData.filter(it => !ids.includes(it.id))
        this.selectTableData = [...new Set([...selectTableDataFilter, ...val])].filter(it => !noIds.includes(it.id))
      },
      handlePage(e) {
        this.pageNo = e
        this.getTableData()
      },
      noticeText(row) {
        const testConfig = {
          3: this.$t('sms'),
          6: this.$t('phone'),
          '3,6': this.$t('smsPhone'),
          '6,3': this.$t('smsPhone'),
        }
        return testConfig[row.channels]
      },
    },
  }
</script>

<style></style>
