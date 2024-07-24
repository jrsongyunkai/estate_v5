<template>
  <el-table :data="tableData" maxHeight="522" border :spanMethod="spanMethod" class="table" v-bind="$attrs">
    <template v-if="level >= 1">
      <el-table-column headerAlign="center" prop="device" :label="$t('deviceMessage')">
        <template #header>
          <Checkbox :value="selectAllStatus === 'checked'" :indeterminate="selectAllStatus === 'indeterminate'" :disabled="selectAllStatus === 'disabled'" @on-change="selectAllNode"></Checkbox>
          {{ $t('deviceMessage') }}
        </template>
        <template #default="{ row }">
          <Checkbox :value="row[0].status === 'checked'" :indeterminate="row[0].status === 'indeterminate'" :disabled="row[0].disabled" @on-change="selectNode(row[0], $event)">{{ row[0].name }}（{{ row[0].mac }}）</Checkbox>
        </template>
      </el-table-column>
      <el-table-column headerAlign="center" prop="deviceLocation" :label="$t('position')">
        <template #default="{ row }">
          {{ row[0].location }}
        </template>
      </el-table-column>
      <slot name="device" />
    </template>
    <template v-if="level >= 2">
      <el-table-column headerAlign="center" prop="addr" :label="$t('lineInfo')">
        <template #default="{ row }">
          <Checkbox v-if="!row[1].hidden" :value="row[1].status === 'checked'" :indeterminate="row[1].status === 'indeterminate'" :disabled="row[1].disabled" @on-change="selectNode(row[1], $event)">{{ row[1].title }}（{{ row[0].mac }}-{{ row[1].addr.toString().padStart(2, '0') }}）</Checkbox>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <slot name="addr" />
    </template>
    <template v-if="level >= 3">
      <el-table-column headerAlign="center" prop="port" :label="$t('portInfo')">
        <template #default="{ row }">
          <Checkbox :value="row[2].status === 'checked'" :indeterminate="row[2].status === 'indeterminate'" :disabled="row[2].disabled" @on-change="selectNode(row[2], $event)">{{ row[2].name }}</Checkbox>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
  import { cloneDeep } from 'lodash'

  export default {
    props: {
      level: {
        type: Number,
        default: 1,
      },
      disabledIds: {
        type: Array,
        default: () => [],
      },
      checkDisabled: {
        type: Function,
      },
      data: {
        type: Array,
        default: () => [],
      },
      maxSelectNum: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        tableData: [],
        selectedMap: new Map(),
        selectSize: 0,
      }
    },
    computed: {
      selectAllStatus() {
        const total = this.tableData.length
        let checkedNum = 0
        let disabledNum = 0
        this.tableData.forEach(row => {
          const node = row[this.level - 1]
          if (node.disabled) {
            return disabledNum++
          }
          if (node.status === 'checked') {
            return checkedNum++
          }
        })
        return disabledNum === total ? 'disabled' : checkedNum === 0 ? 'unchecked' : total === disabledNum + checkedNum ? 'checked' : 'indeterminate'
      },
    },
    watch: {
      data: {
        handler(newValue) {
          this.tableData = this.treeListToTable(cloneDeep(newValue).map(this.preProcess))
        },
      },
      selectSize: {
        handler(newValue) {
          if (this.maxSelectNum && newValue > this.maxSelectNum) {
            this.$confirm(this.$t('mostOptionPlaceholder', { maxSelectNum: this.maxSelectNum }), this.$t('tip'), {
              showCancelButton: false,
            }).then(() => {
              Array.from(this.selectedMap)
                .slice(this.maxSelectNum)
                .forEach(([id, node]) => {
                  if (!node) this.mapDelete(id)
                  this.selectNode(node, false)
                })
            })
          }
        },
        deep: true,
      },
    },
    created() {
      this.rowSpanWM = new WeakMap()
    },
    methods: {
      selectAllNode(value) {
        this.tableData.forEach(row => {
          this.selectNode(row[this.level - 1], value)
        })
      },
      mapDelete(id) {
        if (!this.selectedMap.has(id)) return
        this.selectSize--
        this.selectedMap.delete(id)
      },
      mapSet(id, node) {
        if (this.selectedMap.has(id)) return
        this.selectSize++
        this.selectedMap.set(id, node)
      },
      mapClear() {
        this.selectSize = 0
        this.selectedMap.clear()
      },
      disableParent(node) {
        if (!node.parent) return
        const pNode = node.parent
        pNode.disabled = pNode.children.every(cNode => cNode.disabled)
        this.disableParent(pNode)
      },
      setNodeDisabled(node, disabled) {
        node.disabled = disabled
        this.disableParent(node)
      },
      checkParent(node, value) {
        if (!node.parent) return
        const pNode = node.parent
        if (value) {
          const isAllChecked = pNode.children.every(cNode => cNode.status === 'checked')
          pNode.status = isAllChecked ? 'checked' : 'indeterminate'
        } else {
          const isAllUnchecked = pNode.children.every(cNode => cNode.status === 'unchecked')
          pNode.status = isAllUnchecked ? 'unchecked' : 'indeterminate'
        }
        this.checkParent(pNode, value)
      },
      selectNode(node, value) {
        if (node.disabled) {
          return
        }
        if (!node.children) {
          node.status = value ? 'checked' : 'unchecked'
          this.checkParent(node, value)
          if (value) {
            this.mapSet(node.id, node)
          } else {
            this.mapDelete(node.id)
          }
          return
        }
        node.children.forEach(item => this.selectNode(item, value))
      },
      preProcess(deviceData) {
        deviceData.id = `${deviceData.resId}`
        deviceData.parent = null
        if (this.level > 1) {
          deviceData.children = deviceData.addrs
            ? deviceData.addrs.map(addrData => {
                addrData.id = `${deviceData.id}-${addrData.addr}`
                if (addrData.parent) {
                  addrData.parentAddrInfo = addrData.parent
                  delete addrData.parent
                }
                addrData.parent = deviceData
                if ((addrData.digitalIns || addrData.digitalOuts) && this.level > 2) {
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
            : [{ id: `${deviceData.id}-`, parent: deviceData, hidden: true }]
        }
        delete deviceData.addrs
        return deviceData
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
            if (this.selectedMap.has(tree.id)) {
              this.selectNode(tree, true)
            }
            const disabled = this.checkDisabled ? this.checkDisabled(tree) : false
            if (this.disabledIds.includes(tree.id) || disabled) {
              this.setNodeDisabled(tree, true)
            }
            leafList.push(listItem)
          }
        }
        traverse(tree, [])

        return leafList
      },
      treeListToTable(treeList) {
        return treeList.flatMap(this.treeToList)
      },
      getRowSpan(row, level) {
        const node = row[level]
        if (this.rowSpanWM.has(node)) {
          return this.rowSpanWM.get(node)
        }
        const len = this.tableData.filter(item => item[level] === node).length
        this.rowSpanWM.set(node, len)
        return len
      },
      getSpan(level, rowIndex) {
        const row = this.tableData[rowIndex]
        const preRow = this.tableData[rowIndex - 1]
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
      setSelected(ids) {
        ids.forEach(id => this.mapSet(id, null))
      },
      clearSelected() {
        this.mapClear()
      },
    },
  }
</script>

<style lang="less" scoped>
  .table {
    margin: 10px 0;
    /deep/.el-table__body tr:hover td.el-table__cell {
      background-color: #1a202e;
    }
  }
</style>
