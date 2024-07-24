<template>
  <div>
    <Row align="middle">
      <Input style="width: 200px" :placeholder="$t('topologyPlaceholder2')" v-model="search.mac" />
      <Input style="width: 200px" :placeholder="$t('topologyPlaceholder3')" v-model="search.location" class="ml-10" />
      <Select v-model="search.onlineStatus" style="width: 200px" class="ml-10" :placeholder="$t('equipmentStatus')">
        <Option v-for="item in stateOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button type="primary" ghost class="ml-10" @click.stop="query">{{ $t('query') }}</Button>
      <Button type="default" ghost class="ml-10" @click="resetSearch">{{ $t('reset') }}</Button>
    </Row>
    <el-table style="margin-top: 10px" :data="deviceListTemp" border>
      <el-table-column :label="$t('deviceMessage')">
        <template #default="{ row }">{{ `${row.boxName}（${row.mac}）` }}</template>
      </el-table-column>
      <el-table-column :label="$t('line')">
        <template #default="{ row }">
          <TagsAutoTableCell :tagList="row.addrList" :returnLabel="row => row.title" :closable="false" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('equipmentLocation')">
        <template #default="{ row }">{{ row.boxAddress }}</template>
      </el-table-column>
    </el-table>
    <Page :current="search.pageNo" @on-change="changePage" :total="deviceListFilter.length" :showTotal="true" />
  </div>
</template>
<script>
  import TagsAutoTableCell from '@/pages/billingSystem/component/TagsAutoTableCell.vue'
  import { cloneDeep } from 'lodash'
  const defaultSearch = { mac: '', location: '', onlineStatus: null, pageNo: 1, pageSize: 10 }
  export default {
    props: {
      level: { type: Number, default: 1 },
      deviceList: { type: Array, default: () => [] },
    },
    components: { TagsAutoTableCell },
    data() {
      return {
        visible: true,
        search: cloneDeep(defaultSearch),
        stateOptions: [
          { label: this.$t('online'), value: 1 },
          { label: this.$t('offline'), value: 0 },
          { label: this.$t('disconnected'), value: -1 },
        ],
        deviceListFilter: [],
      }
    },
    computed: {
      deviceListTemp() {
        const start = (this.search.pageNo - 1) * this.search.pageSize
        const end = start + this.search.pageSize
        return this.deviceListFilter.slice(start, end)
      },
    },
    mounted() {
      this.resetSearch()
    },
    methods: {
      query() {
        this.search.pageNo = 1
        let list = cloneDeep(this.deviceList)
        if (this.search.mac) {
          list = list.filter(item => item.boxName.indexOf(this.search.mac) > -1 || item.mac.indexOf(this.search.mac) > -1)
        }
        if (this.search.location) {
          list = list.filter(item => item.boxAddress.indexOf(this.search.location) > -1)
        }
        if (this.search.onlineStatus !== null) {
          list = list.filter(item => item.onlineStatus === this.search.onlineStatus)
        }
        this.deviceListFilter = list
      },
      resetSearch() {
        this.search = cloneDeep(defaultSearch)
        this.search.pageNo = 1
        this.deviceListFilter = cloneDeep(this.deviceList)
      },
      changePage(n) {
        this.search.pageNo = n
      },
    },
    watch: {
      deviceList: {
        handler() {
          this.resetSearch()
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .device-picker {
    .ml-12 {
      margin-left: 12px;
    }
    /deep/.ivu-modal-body {
      padding-bottom: 0;
    }
    /deep/.ivu-modal-footer {
      border-color: transparent;
    }
  }
</style>
