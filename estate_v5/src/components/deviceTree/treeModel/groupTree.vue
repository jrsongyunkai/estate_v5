<template>
  <vue-easy-tree
    ref="treeRef"
    :height="treeHeight"
    v-loading="loading"
    :class="{ 'group-strict': strictMode }"
    :indent="10"
    :data="groupTree"
    node-key="id"
    :default-expanded-keys="expandedKeys"
    highlight-current
    :filter-node-method="filterNode"
    :expand-on-click-node="false"
    @current-change="currentChange">
    <div class="custom-tree-node" v-textRoll slot-scope="{ data }" :class="{ disabled: !!data.disabled }">
      {{ data.label }}
    </div>
  </vue-easy-tree>
</template>
<script>
  import { queryBoxGroupTreeAll } from '@/api/public'
  import TreeDevice from '../mixins/TreeDevice'
  export default {
    props: {
      groupTypeID: { type: String, require: true, default: '' },
      keyWord: { type: String, default: '' },
      isDefFirstGroup: { type: Boolean, default: false },
    },
    mixins: [TreeDevice],
    inject: ['strictMode', 'treeHeight'],
    data() {
      return {
        groupTree: [],
        expandedKeys: [],
        currentKey: '',
      }
    },
    mounted() {
      this.getGroupTreeData()
    },
    methods: {
      changChildrenId(list) {
        return list.map(it => {
          let obj = { ...it, statType: it.mac ? 1 : 3, disabled: this.strictMode ? !!it.mac : false, label: it.name, keyword: it.name, children: [] }
          if (it.mac) {
            obj.children = [...it.children.map(it => ({ ...it, label: `${it.name}`, keyword: `${it.name}${it.mac}`, disabled: this.strictMode ? !!it.mac : false, statType: 1 }))]
          } else if (!it.mac && Array.isArray(it.children)) {
            obj.nodeId = it.id
            obj.children = this.changChildrenId(it.children)
          }
          return obj
        })
      },
      getListNodeIds(arr, nodeIds = []) {
        arr.forEach(it => {
          if (it.nodeId) {
            nodeIds.push(it.nodeId)
          }
          if (it.children && it.nodeId && !it.mac) {
            this.getListNodeIds(it.children, nodeIds)
          }
        })
        return nodeIds
      },
      async getGroupTreeData() {
        let res = await queryBoxGroupTreeAll({ projectCode: this.$store.state.projectCode, groupId: Number(this.groupTypeID), untilMacAddr: true })
        this.loading = false
        if (res.success) {
          let list = res.data && res.data.length > 0 ? JSON.parse(JSON.stringify(res.data)) : []
          this.groupTree = this.changChildrenId(list)
          this.expandedKeys = this.getListNodeIds(this.groupTree)
          if (this.isDefFirstGroup && this.groupTree.length > 0) {
            this.$nextTick(() => {
              this.currentChange(this.groupTree[0])
              this.$refs.treeRef.setCurrentKey(this.groupTree[0].nodeId)
            })
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      currentChange(data) {
        if (data.disabled) {
          this.$refs.treeRef.setCurrentKey(this.currentKey)
          return
        }
        this.currentKey = data.nodeId
        this.$emit('currentChange', data)
      },
    },
  }
</script>
<style lang="less" scoped>
  .group-strict {
    /deep/.el-tree-node__content > .disabled {
      color: #999;
      cursor: not-allowed;
    }
  }
</style>
