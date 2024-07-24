<template>
  <Modal width="1000" class="device-picker" @on-visible-change="onVisibleChange" v-bind="$attrs" v-on="$listeners">
    <Row align="middle">
      <Input style="width: 200px" :placeholder="$t('topologyPlaceholder2')" v-model="search.mac" />
      <Input style="width: 200px" :placeholder="$t('topologyPlaceholder3')" v-model="search.location" class="ml-12" />
      <Button type="primary" ghost class="ml-12" @click="query">{{ $t('query') }}</Button>
      <Button type="default" ghost class="ml-12" @click="resetSearch">{{ $t('reset') }}</Button>
    </Row>
    <el-table :data="tableData.data" maxHeight="522" border :spanMethod="spanMethod" class="table">
      <el-table-column headerAlign="center" prop="device" :label="$t('deviceMessage')">
        <template #default="{ row }">{{ row[0].name }}（{{ row[0].mac }}）</template>
      </el-table-column>
      <el-table-column headerAlign="center" prop="deviceLocation" :label="$t('position')">
        <template #default="{ row }">
          {{ row[0].location }}
        </template>
      </el-table-column>
      <el-table-column headerAlign="center" prop="addr" :label="$t('lineInfo')">
        <template #default="{ row }">
          <RadioGroup v-model="selectedId">
            <Radio :label="row[1].id" :disabled="disabledIds.includes(row[1].id)">{{ row[1].title }}（{{ row[0].mac }}-{{ row[1].addr.toString().padStart(2, '0') }}）</Radio>
          </RadioGroup>
        </template>
      </el-table-column>
    </el-table>
    <Page :current="search.pageNo" @on-change="changePage" :total="tableData.total" :showTotal="false" />
    <template #footer>
      <Button type="primary" @click="onConfirm">{{ $t('confirm') }}</Button>
      <Button type="primary" ghost @click="$emit('on-cancel')">{{ $t('cancel') }}</Button>
    </template>
  </Modal>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import { pageQueryAddrCommon } from '@api/public'

  const defaultSearch = {
    mac: '',
    location: '',
    pageNo: 1,
    pageSize: 10,
  }
  const defaultTableData = {
    data: [],
    total: 0,
  }

  export default {
    props: {
      conditions: {
        type: Object,
        default: () => {},
      },
      initialSelectedId: String,
      disabledIds: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        visible: true,
        search: cloneDeep(defaultSearch),
        tableData: cloneDeep(defaultTableData),
        selectedId: '',
      }
    },
    created() {
      this.rowSpanWM = new WeakMap()
    },
    methods: {
      preProcess(deviceData) {
        deviceData.id = `${deviceData.resId}`
        deviceData.parent = null
        if (deviceData.addrs) {
          deviceData.children = deviceData.addrs.map(addrData => {
            addrData.id = `${deviceData.id}-${addrData.addr}`
            addrData.parent = deviceData
            if (addrData.digitalIns || addrData.digitalOuts) {
              const portsWithType = (parent, type, ports = []) =>
                ports.map(port => {
                  return {
                    id: `${parent.id}-${type}-${port.index}`,
                    parent,
                    type,
                    ...port,
                  }
                })
              addrData.children = portsWithType(addrData, 'in', addrData.digitalIns).concat(portsWithType(addrData, 'out', addrData.digitalOuts))
              delete addrData.digitalIns
              delete addrData.digitalOuts
            }
            return addrData
          })
        }
        delete deviceData.addrs
        return deviceData
      },
      treeToList(tree) {
        var leafList = []
        const traverse = (tree, listItem, level = 0) => {
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
        this.tableData.data = this.treeListToTable(datas.map(this.preProcess))
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
          this.query()
          this.selectedId = this.initialSelectedId
        } else {
          this.search = cloneDeep(defaultSearch)
          this.tableData = cloneDeep(defaultTableData)
        }
      },
      onConfirm() {
        if (!this.selectedId) {
          return this.$Message.error(this.$t('pleaseSelectLine2'))
        }
        this.$emit('on-ok', this.selectedId)
      },
      getRowSpan(row, level) {
        const node = row[level]
        if (this.rowSpanWM.has(node)) {
          return this.rowSpanWM.get(node)
        }
        const len = this.tableData.data.filter(item => item[level] === node).length
        this.rowSpanWM.set(node, len)
        return len
      },
      getSpan(level, rowIndex) {
        const row = this.tableData.data[rowIndex]
        const preRow = this.tableData.data[rowIndex - 1]
        const rowSpan = this.getRowSpan(row, level)
        if (!preRow || row[level] !== preRow[level]) {
          return [rowSpan, 1]
        } else {
          return [0, 0]
        }
      },
      spanMethod({ column, rowIndex }) {
        if (column.property.startsWith('device')) {
          return this.getSpan(0, rowIndex)
        }
        if (column.property.startsWith('addr')) {
          return this.getSpan(1, rowIndex)
        }
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
    .table {
      margin: 10px 0;
      /deep/.el-table__body tr:hover td.el-table__cell {
        background-color: #1a202e;
      }
    }
  }
</style>
