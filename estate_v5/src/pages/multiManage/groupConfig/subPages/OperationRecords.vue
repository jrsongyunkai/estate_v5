<template>
  <div class="operation-records">
    <BackTopTitle :title="$t('operationRecordsTips', { name: record.name })" @close="$emit('close')"></BackTopTitle>
    <div class="operation-records-view-content">
      <div class="content-table">
        <div class="table-title">{{ $t('operationRecords') }}</div>
        <Table :columns="columns" :data="tableData.list" row-key="id">
          <template #addSlot="{ row }">
            <TagsAutoTableCell :tagList="row.addList || []" />
          </template>
          <template #delSlot="{ row }">
            <TagsAutoTableCell :tagList="row.removeList || []" />
          </template>
        </Table>
        <Page :total="tableData.total" :page-size="tableData.pageSize" @on-change="changePageNo" :current="tableData.pageNo" show-total show-elevator />
      </div>
    </div>
  </div>
</template>
<script>
  import BackTopTitle from '../component/BackTopTitle.vue'
  import TagsAutoTableCell from '@/pages/billingSystem/component/TagsAutoTableCell.vue'
  import { boxGroupPageQueryLog } from '@/api/multiManage/groupConfig'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    components: { BackTopTitle, TagsAutoTableCell },
    data() {
      return {
        columns: [
          { title: this.$t('operatingTime'), key: 'operateTime', width: 180 },
          { title: this.$t('operator'), key: 'staffName', width: 150 },
          { title: this.$t('addDeviceDetails'), slot: 'addSlot', minWidth: 300 },
          { title: this.$t('deleteDeviceDetails'), slot: 'delSlot', minWidth: 300 },
        ],
        tableData: { list: [], pageSize: 10, pageNo: 1, total: 0 },
      }
    },
    methods: {
      changePageNo(e) {
        this.tableData.pageNo = e
        this.getData()
      },
      getTagList(list) {
        let addList = []
        list.forEach(device => {
          if (device.addrInfos.length) {
            device.addrInfos.forEach(addr => {
              addList.push({ label: `${device.name}(${device.mac})/${addr.name}(${device.mac}-${addr.addr.toString().padStart(2, 0)})` })
            })
          } else {
            addList.push({ label: `${device.name}(${device.mac})` })
          }
        })
        return addList
      },
      async getData() {
        const res = await boxGroupPageQueryLog({ pageNo: this.tableData.pageNo, pageSize: this.tableData.pageSize, nodeId: this.record.id })
        if (res.success) {
          this.tableData.list =
            res.datas.map(it => {
              return { ...it, addList: this.getTagList(it.addList), removeList: this.getTagList(it.removeList) }
            }) || []
          this.tableData.total = res.total || 0
        } else {
          this.$Message.error(res.message)
        }
      },
    },
    mounted() {
      this.getData()
    },
  }
</script>

<style lang="less" scoped>
  .operation-records {
    &-view-content {
      padding: 10px;
      max-height: calc(~'100vh - 168px');
      overflow: auto;
      .content-table {
        background: #1a202e;
        padding: 15px;
        .table-title {
          line-height: 30px;
          padding-bottom: 10px;
        }
      }
    }
  }
</style>
