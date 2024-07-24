<template>
  <div v-loading="loading" :element-loading-text="$t('dealingWithItDesperately')" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.4)">
    <Row align="middle" justify="space-between">
      <div>
        <Input style="width: 200px" :placeholder="$t('topologyPlaceholder2')" v-model="search.mac" />
        <Input style="width: 200px" :placeholder="$t('topologyPlaceholder3')" v-model="search.location" class="ml-10" />
        <Select v-model="search.onlineStatus" style="width: 200px" class="ml-10" :placeholder="$t('equipmentStatus')">
          <Option v-for="item in stateOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="primary" ghost class="ml-10" @click="changePage(1)">{{ $t('query') }}</Button>
        <Button type="default" ghost class="ml-10" @click="resetSearch">{{ $t('reset') }}</Button>
      </div>
      <div>
        <Button type="primary" class="ml-10" @click.stop="getAllDevice(true)">{{ $t('selectAll') }}</Button>
        <Button type="primary" ghost class="ml-10" @click.stop="cancelSelectAll">{{ $t('unselectAll') }}</Button>
      </div>
    </Row>
    <DeviceTable ref="tableIns" @change="$emit('change', $event)" :level="level" :disabledIds="disabledIds" :checkDisabled="checkDisabled" :data="tableData.data">
      <template v-for="(item, key) in $slots" v-slot:[key]="slotProps">
        <slot :name="key" v-bind="slotProps"></slot>
      </template>
    </DeviceTable>
    <Page :current="search.pageNo" @on-change="changePage" :total="tableData.total" :showTotal="false" />
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import { pageQueryAddrCommon } from '@/api/public'
  import DeviceTable from './DeviceTable.vue'
  const defaultSearch = { mac: '', location: '', onlineStatus: null, pageNo: 1, pageSize: 10 }
  const defaultTableData = { data: [], total: 0 }

  export default {
    props: {
      level: { type: Number, default: 1 },
      conditions: { type: Object, default: () => {} },
      initialSelectedIds: { type: Array, default: () => [] },
      disabledIds: { type: Array, default: () => [] },
      checkDisabled: { type: Function },
      showPagination: { type: Boolean, default: true },
    },
    components: { DeviceTable },
    data() {
      return {
        visible: true,
        search: cloneDeep(defaultSearch),
        tableData: cloneDeep(defaultTableData),
        stateOptions: [
          { label: this.$t('online'), value: 1 },
          { label: this.$t('offline'), value: 0 },
          { label: this.$t('disconnected'), value: -1 },
        ],
        allDeviceList: [],
        hasQueryAllDevice: false,
        loading: false,
        selectedMap: new Map(),
      }
    },
    computed: {},
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.search = cloneDeep(defaultSearch)
      this.tableData = cloneDeep(defaultTableData)
      this.$refs.tableIns.clearSelected()
      this.selectedMap.clear()
    },
    methods: {
      init() {
        this.$nextTick(() => {
          this.selectedMap.clear()
          this.$refs.tableIns.setSelected(this.initialSelectedIds)
          this.query()
        })
      },
      async query() {
        const { success, message, total, datas } = await pageQueryAddrCommon({ projectCode: this.$store.state.projectCode, ...this.search, ...this.conditions })
        if (!success) {
          return this.$Message.error(message)
        }
        this.tableData.total = total
        this.tableData.data = datas
      },
      setNodeDisabled(node, disabled) {
        node.disabled = disabled
        this.disableParent(node)
      },
      disableParent(node) {
        if (!node.parent) return
        const pNode = node.parent
        pNode.disabled = pNode.children.every(cNode => cNode.disabled)
        this.disableParent(pNode)
      },
      treeToList(tree) {
        const leafList = []
        const traverse = (tree, listItem, level = 0) => {
          tree.status = 'unchecked'
          tree.disabled = false
          tree.level = level
          listItem.push(tree)
          if (tree.children) {
            tree.children.forEach(subtree => {
              traverse(subtree, [...listItem], level + 1)
            })
          } else {
            leafList.push(listItem)
          }
        }
        traverse(tree, [])
        return leafList
      },
      treeListToTable(treeList) {
        return treeList.flatMap(this.treeToList)
      },
      preProcess(deviceData) {
        deviceData.id = `${deviceData.resId}`
        deviceData.parent = null
        deviceData.children =
          deviceData.addrs && deviceData.addrs.length
            ? deviceData.addrs.map(addrData => {
                addrData.id = `${deviceData.id}-${addrData.addr}`
                if (addrData.parent) {
                  addrData.parentAddrInfo = addrData.parent
                  delete addrData.parent
                }
                addrData.parent = deviceData
                return addrData
              })
            : [{ id: `${deviceData.id}`, parent: deviceData, hidden: true }]
        delete deviceData.addrs
        return deviceData
      },
      cancelSelectAll() {
        this.$refs.tableIns.selectAllNodeChange(false)
        this.$emit('cancelAllSelect')
      },
      async getAllDevice(value) {
        if (!this.hasQueryAllDevice) {
          this.loading = true
          const { datas, success, message } = await pageQueryAddrCommon({ projectCode: this.$store.state.projectCode, pageNo: 1, pageSize: 100000, ...this.conditions })
          if (!success) {
            this.loading = false
            return this.$Message.error(message)
          }
          this.allDeviceList = datas
          this.loading = false
          this.hasQueryAllDevice = true
        }
        const list = this.treeListToTable(cloneDeep(this.allDeviceList).map(this.preProcess))
        list.forEach(row => {
          row.forEach(it => {
            it.status = value ? 'checked' : 'unchecked'
            value ? this.mapSet(it.id, it) : this.mapDelete(it.id)
          })
        })
        let selectedMapList = Array.from(this.selectedMap).map(([id, data]) => ({ id, data }))
        this.$emit('change', selectedMapList)
        this.$refs.tableIns.selectAllNodeChange(value)
      },
      mapSet(id, node) {
        if (this.selectedMap.has(id)) return
        this.selectedMap.set(id, node)
      },
      mapDelete(id) {
        if (!this.selectedMap.has(id)) return
        this.selectedMap.delete(id)
      },
      resetSearch() {
        this.search = cloneDeep(defaultSearch)
        this.query()
      },
      changePage(n) {
        this.search.pageNo = n
        this.query()
      },
    },
    watch: {
      initialSelectedIds: {
        handler(val) {
          this.$refs.tableIns.setSelectedAll(val)
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
