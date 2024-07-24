<template>
  <Modal width="1000" class="device-picker" @on-visible-change="onVisibleChange" v-bind="$attrs" v-on="$listeners">
    <Row align="middle" v-if="showSearch">
      <Input style="width: 200px" :placeholder="$t('topologyPlaceholder2')" v-model="search.mac" />
      <Input style="width: 200px" :placeholder="$t('topologyPlaceholder3')" v-model="search.location" class="ml-12" />
      <Select v-model="search.onlineStatus" style="width: 200px" class="ml-12" :placeholder="$t('equipmentStatus')">
        <Option v-for="item in ONLINE_STATS_OPTIONS" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button type="primary" ghost class="ml-12" @click="query">{{ $t('query') }}</Button>
      <Button type="default" ghost class="ml-12" @click="resetSearch">{{ $t('reset') }}</Button>
    </Row>
    <DeviceTable ref="tableIns" :maxSelectNum="maxSelectNum" :level="level" :disabledIds="disabledIds" :checkDisabled="checkDisabled" :data="tableData.data">
      <template v-for="(item, key) in $slots" v-slot:[key]="slotProps">
        <slot :name="key" v-bind="slotProps"></slot>
      </template>
    </DeviceTable>
    <Page :current="search.pageNo" @on-change="changePage" :total="tableData.total" :showTotal="false" v-if="showSearch" />
    <template #footer>
      <Button type="primary" @click="onConfirm">{{ confirmText }}</Button>
      <Button type="primary" ghost @click="$emit('on-cancel')">{{ cancelText }}</Button>
    </template>
  </Modal>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import { pageQueryAddrCommon } from '@api/public'

  const ONLINE_STATS_OPTIONS = [
    { label: window.$t('online'), value: 1 },
    { label: window.$t('offline'), value: 0 },
    { label: window.$t('disconnected'), value: -1 },
  ]

  const defaultSearch = {
    mac: '',
    location: '',
    onlineStatus: null,
    pageNo: 1,
    pageSize: 10,
  }
  const defaultTableData = {
    data: [],
    total: 0,
  }

  export default {
    props: {
      level: {
        type: Number,
        default: 1,
      },
      conditions: {
        type: Object,
        default: () => {},
      },
      initialSelectedIds: {
        type: Array,
        default: () => [],
      },
      disabledIds: {
        type: Array,
        default: () => [],
      },
      checkDisabled: {
        type: Function,
      },
      confirmText: {
        type: String,
        default: window.$t('confirm2'),
      },
      cancelText: {
        type: String,
        default: window.$t('cancel'),
      },
      showSearch: {
        type: Boolean,
        default: true,
      },
      showPagination: {
        type: Boolean,
        default: true,
      },
      maxSelectNum: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        visible: true,
        search: cloneDeep(defaultSearch),
        tableData: cloneDeep(defaultTableData),
      }
    },
    created() {
      this.ONLINE_STATS_OPTIONS = ONLINE_STATS_OPTIONS
    },
    methods: {
      async query() {
        const { success, message, total, datas } = await pageQueryAddrCommon({
          projectCode: this.$store.state.projectCode,
          ...this.search,
          ...this.conditions,
        })
        if (!success) {
          return this.$Message.error(message)
        }
        this.tableData.total = total
        this.tableData.data = datas
      },
      resetSearch() {
        this.search = cloneDeep(defaultSearch)
        this.query()
      },
      changePage(n) {
        this.search.pageNo = n
        this.query()
      },
      onVisibleChange(visible) {
        if (visible) {
          this.$refs.tableIns.setSelected(this.initialSelectedIds)
          this.query()
        } else {
          this.search = cloneDeep(defaultSearch)
          this.tableData = cloneDeep(defaultTableData)
          this.$refs.tableIns.clearSelected()
        }
      },
      onConfirm() {
        const selectedMap = this.$refs.tableIns.selectedMap
        if (selectedMap.size === 0) {
          return this.$Message.error(this.$t('selectedNotNull'))
        }
        this.$emit(
          'on-ok',
          Array.from(selectedMap).map(([id, data]) => ({ id, data }))
        )
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
