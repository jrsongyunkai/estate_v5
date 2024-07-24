<template>
  <Modal width="800" class="device-picker" @on-visible-change="onVisibleChange" v-bind="$attrs" v-on="$listeners">
    <Row align="middle" v-if="showSearch">
      <Input style="width: 200px" :placeholder="$t('enterGroupName')" v-model="search.keyword" />
      <Button type="primary" ghost class="ml-12" @click="query">{{ $t('query') }}</Button>
      <Button type="default" ghost class="ml-12" @click="resetSearch">{{ $t('reset') }}</Button>
    </Row>
    <el-table :data="tableData" maxHeight="522" border :spanMethod="spanMethod" class="table mt-10" v-bind="$attrs">
      <template>
        <el-table-column headerAlign="center" prop="type" :label="$t('groupType')">
          <template #header>
            <Checkbox :value="selectAllStatus === 'checked'" :indeterminate="selectAllStatus === 'indeterminate'" :disabled="selectAllStatus === 'disabled'" @on-change="selectAllNode"></Checkbox>
            {{ $t('groupType') }}
          </template>
          <template #default="{ row }">
            <Checkbox :value="row[0].status === 'checked'" :indeterminate="row[0].status === 'indeterminate'" :disabled="row[0].disabled" @on-change="selectNode(row[0], $event)">{{ row[0].type }}</Checkbox>
          </template>
        </el-table-column>
        <template>
          <el-table-column headerAlign="center" prop="group" :label="$t('groupInfo')">
            <template #default="{ row }">
              <Checkbox :value="row[1].status === 'checked'" :indeterminate="row[1].status === 'indeterminate'" :disabled="row[1].disabled" @on-change="selectNode(row[1], $event)">{{ row[1].name }}</Checkbox>
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
    <Page :current="search.pageNo" @on-change="changePage" :total="total" :showTotal="false" v-if="showSearch" />
    <template #footer>
      <Button type="primary" @click="onConfirm">{{ confirmText }}</Button>
      <Button type="primary" ghost @click="$emit('on-cancel')">{{ cancelText }}</Button>
    </template>
  </Modal>
</template>

<script>
  import { pageBoxGroupNode } from '@/api/multiManage/groupConfig'
  import { cloneDeep } from 'lodash'
  const defaultSearch = {
    keyword: '',
    pageNo: 1,
    pageSize: 10,
  }
  export default {
    props: {
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
      maxSelectNum: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        tableData: [],
        total: 0,
        search: cloneDeep(defaultSearch),
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
          const node = row[0]
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
    created() {
      this.rowSpanWM = new WeakMap()
    },
    methods: {
      mapSet(id, node) {
        if (this.selectedMap.has(id)) return
        this.selectSize++
        this.selectedMap.set(id, node)
      },
      mapDelete(id) {
        if (!this.selectedMap.has(id)) return
        this.selectSize--
        this.selectedMap.delete(id)
      },
      mapClear() {
        this.selectSize = 0
        this.selectedMap.clear()
      },
      selectAllNode(value) {
        this.tableData.forEach(row => {
          this.selectNode(row[0], value)
        })
      },
      preProcess(group) {
        group.parent = null
        if (group.nodes) {
          group.children = group.nodes.map(node => {
            node.parent = group
            return node
          })
        }
        delete group.nodes
        return group
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
      treeToList(tree) {
        let leafList = []
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
      resetSearch() {
        this.search = cloneDeep(defaultSearch)
        this.query()
      },
      setSelected(ids) {
        ids.forEach(id => this.mapSet(id, null))
      },
      async query() {
        const params = { ...this.conditions, ...this.search, projectCode: this.$store.state.projectCode }
        const res = await pageBoxGroupNode(params)
        if (res.success) {
          this.tableData = this.treeListToTable(res.datas.map(this.preProcess))
          this.total = res.total
        } else {
          this.$message.error(res.message)
        }
      },
      changePage(n) {
        this.search.pageNo = n
        this.query()
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
        if (column.property.startsWith('type')) {
          return this.getSpan(0, rowIndex)
        }
      },
      clearSelected() {
        this.mapClear()
      },
      onVisibleChange(visible) {
        if (visible) {
          this.setSelected(this.initialSelectedIds)
          this.query()
        } else {
          this.search = cloneDeep(defaultSearch)
          this.tableData = []
          this.clearSelected()
        }
      },
      onConfirm() {
        if (this.selectedMap.size === 0) {
          return this.$Message.error(this.$t('selectedNotNull'))
        }
        this.$emit(
          'on-ok',
          Array.from(this.selectedMap).map(([id, data]) => ({ id, data }))
        )
      },
    },
    watch: {
      selectSize: {
        handler(newValue) {
          if (this.maxSelectNum && newValue > this.maxSelectNum) {
            this.$confirm(this.$t('mostOptionPlaceholder', { maxSelectNum: this.maxSelectNum }), this.$t('tip'), { showCancelButton: false }).then(() => {
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
