<template>
  <Row :gutter="8" class="topology-settings">
    <Col span="8">
      <div class="tree-box">
        <Row justify="space-between" align="middle" class="title">
          <Col>{{ $t('electricalTopology') }}</Col>
          <Col>
            <Button type="primary" ghost @click="saveConfig">{{ $t('save') }}</Button>
            <Button type="default" ghost @click="closeSettings" class="ml-8">{{ $t('cancel') }}</Button>
          </Col>
        </Row>
        <Row class="search" :wrap="false">
          <Input :placeholder="$t('topologyPlaceholder2')" flex="1" v-model="searchText" />
          <Button type="primary" ghost class="ml-8" @click="search">{{ $t('query') }}</Button>
          <Button type="default" ghost class="ml-8" @click="resetSearch">{{ $t('reset') }}</Button>
        </Row>
        <div class="tree">
          <vue-easy-tree
            height="calc(100vh - 262px)"
            :item-size="40"
            ref="elTree"
            :data="elTreeList"
            node-key="id"
            draggable
            defaultExpandAll
            renderAfterExpand
            :expandOnClickNode="false"
            highlightCurrent
            :filterNodeMethod="filterNodeMethod"
            :allowDrag="allowDrag"
            :allowDrop="allowDrop"
            @node-click="selectTreeById($event.id)"
            @node-drop="onNodeDrop">
            <template #default="{ data }">
              <CustomNode
                v-if="data.type === CUSTOM_NODE_TYPE"
                :readOnly="data.id === ALL"
                :name="data.name"
                :isEditing="data.isEditing"
                @addChild="addCustomNode(data)"
                @edit="data.isEditing = true"
                @saveEdit="saveEdit(data, $event)"
                @cancelEdit="cancelEdit(data)"
                @delete="deleteCustomNode(data.id)" />
              <div class="tree-item" v-else>
                <div class="tree-item-text" :title="data.name">
                  {{ data.name }}
                </div>
                <Tag type="border" color="#D9001B" class="tree-item-tag" v-if="data.mainline === 1">{{ $t('projectMainLine') }}</Tag>
              </div>
            </template>
          </vue-easy-tree>
        </div>
      </div>
    </Col>
    <Col span="16">
      <div class="graph-box">
        <div class="graph-title">{{ $t('electricalTopologyDiagram') }}</div>
        <TreeGraph :tree="selectedTree" :currentNodeId="currentNodeId" @modifyParent="modifyParent" @addChildren="addChildren" @removeSelf="removeSelf" />
      </div>
    </Col>
  </Row>
</template>

<script>
  import { queryTopologyTree, saveTopologyTree } from '@api/console/topology'
  import { Util } from '@antv/g6'
  import TreeGraph from './TreeGraph.vue'
  import Tag from './Tag.vue'
  import { cloneDeep } from 'lodash'
  import uuid from 'uuid/v1'
  import CustomNode from './CustomNode.vue'

  const UNKNOWN_NODE_ERROR = window.$t('topologyTips2')
  const ALL = 'all'
  const FREE = 'free'
  const BLACKLIST_ID = [ALL, FREE]

  export default {
    components: {
      TreeGraph,
      Tag,
      CustomNode,
    },
    data() {
      return {
        searchText: '',
        elTreeList: [],
        currentNodeId: null,
        selectedTree: null,
      }
    },
    watch: {
      elTreeList: {
        handler() {
          this.onChange()
        },
        deep: true,
      },
      currentNodeId() {
        this.onChange()
      },
    },
    created() {
      this.ALL = ALL
      this.CUSTOM_NODE_TYPE = 'custom-node'
    },
    mounted() {
      this.getConfig()
    },
    methods: {
      onChange() {
        if (!this.currentNodeId) {
          this.selectedTree = null
          return
        }
        const node = this.$refs.elTree.getNode(this.currentNodeId)
        const root = this.getTreeRootData(node)
        this.selectedTree = root ? cloneDeep(root) : null
      },
      async getConfig() {
        const { success, message, data } = await queryTopologyTree({
          projectCode: this.$store.state.projectCode,
        })
        if (!success) {
          return this.$Message.error(message)
        }
        const { freeList = [], treeList = [] } = data
        const wrapTree = tree => {
          if (tree.custom) {
            tree.id = uuid()
            tree.type = this.CUSTOM_NODE_TYPE
            tree.isEditing = false
          } else {
            const {
              resId,
              addr,
              others: { name, title, mac },
            } = tree
            tree.id = `${resId}-${addr}`
            tree.name = `${name}（${mac}）/${title}（${mac}-${addr.toString().padStart(2, '0')}）`
          }

          return true
        }
        treeList.forEach(tree => {
          Util.traverseTree(tree, wrapTree)
        })
        freeList.forEach(tree => {
          Util.traverseTree(tree, wrapTree)
        })
        let children = treeList
        // 有游离节点时才显示未归类线路
        if (freeList.length > 0) {
          children = treeList.concat({
            id: FREE,
            name: this.$t('unallocatedLine'),
            children: freeList,
          })
        }
        this.elTreeList = [
          {
            id: ALL,
            type: this.CUSTOM_NODE_TYPE,
            name: 'ALL',
            children,
          },
        ]
      },
      filterNodeMethod(value, data) {
        if (!value) return true
        return data.name.includes(value)
      },
      allowDrag(node) {
        return !BLACKLIST_ID.includes(node.data.id) && !node.data.isEditing
      },
      allowDrop(draggingNode, dropNode, type) {
        const nodeAll = this.$refs.elTree.getNode(ALL)
        const nodeFree = this.$refs.elTree.getNode(FREE)
        if (dropNode === nodeAll) {
          return false
        }
        const draggingNodeType = draggingNode.data.type

        if (draggingNodeType === this.CUSTOM_NODE_TYPE) {
          if (dropNode === nodeFree && type === 'next') {
            return false
          }
          const parentNodeType = type === 'inner' ? dropNode.data.type : dropNode.parent.data.type
          return parentNodeType === this.CUSTOM_NODE_TYPE
        } else {
          return dropNode !== nodeFree && !nodeFree.contains(dropNode)
        }
      },
      search() {
        this.$refs.elTree.filter(this.searchText)
      },
      resetSearch() {
        this.searchText = ''
        this.search()
      },
      async saveConfig() {
        const { success, message } = await saveTopologyTree({
          projectCode: this.$store.state.projectCode,
          treeList: this.elTreeList[0].children.filter(tree => tree.id !== FREE),
        })
        if (!success) {
          return this.$Message.error(message)
        }
        this.closeSettings()
      },
      getTreeRootNode(node) {
        if (!node.parent) {
          return null
        }
        if (BLACKLIST_ID.includes(node.parent.data.id)) {
          return node
        }
        return this.getTreeRootNode(node.parent)
      },
      getTreeRootData(node) {
        const root = this.getTreeRootNode(node)
        if (!root) return null
        return root.data
      },
      setHighlight() {
        this.$refs.elTree.setCurrentKey(this.currentNodeId)
      },
      onNodeDrop(nodeCopy) {
        this.setHighlight()
        if (!this.currentNodeId) return
        const currentNode = this.$refs.elTree.getNode(this.currentNodeId)
        const dropNode = this.$refs.elTree.getNode(nodeCopy.data.id)
        const currentRoot = this.getTreeRootNode(currentNode)
        if (currentRoot && currentRoot.contains(dropNode)) {
          this.onChange()
        }
      },
      selectTreeById(id) {
        if (!BLACKLIST_ID.includes(id)) {
          this.currentNodeId = id
        }
        this.setHighlight()
      },
      /**
       * @param {*} sourceId
       * @param {*} targetId
       * @param {'append'|'insertBefore'|'insertAfter'} [action=append]
       */
      move(sourceId, targetId, action = 'append') {
        const sourceNode = this.$refs.elTree.getNode(sourceId)
        const targetNode = targetId && this.$refs.elTree.getNode(targetId)
        // 如果待移动节点等于或者包含目标节点，不移动
        if (sourceId === targetId || sourceNode.contains(targetNode)) {
          return
        }
        this.$refs.elTree.remove(sourceNode)
        switch (action) {
          case 'append':
            this.$refs.elTree.append(sourceNode.data, targetNode)
            break
          case 'insertBefore':
            this.$refs.elTree.insertBefore(sourceNode.data, targetNode)
            break
          case 'insertAfter':
            this.$refs.elTree.insertAfter(sourceNode.data, targetNode)
            break
        }
        this.setHighlight()
      },
      modifyParent(id, parentId) {
        if (this.$refs.elTree.getNode(parentId) === null) {
          return this.$Message.error(UNKNOWN_NODE_ERROR)
        }
        this.move(id, parentId)
        // 如果是父节点是游离节点需要移除到游离分组外
        if (this.isFreeNode(parentId)) {
          this.move(parentId, FREE, 'insertBefore')
        }
      },
      addChildren(children, parentId) {
        const hasNull = children.some(id => this.$refs.elTree.getNode(id) === null)
        if (hasNull) {
          return this.$Message.error(UNKNOWN_NODE_ERROR)
        }
        children.forEach(id => {
          this.move(id, parentId)
        })
        // 如果是父节点是游离节点需要移除到游离分组外
        if (this.isFreeNode(parentId)) {
          this.move(parentId, FREE, 'insertBefore')
        }
      },
      removeSelf(id) {
        this.move(id, FREE, 'insertBefore')
      },
      addCustomNode(data) {
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        const newNodeData = {
          name: '',
          custom: true,
          id: uuid(),
          type: this.CUSTOM_NODE_TYPE,
          isEditing: true,
        }
        data.children.unshift(newNodeData)
      },
      saveEdit(data, text) {
        if (!text) {
          this.$Message.error(this.$t('nodeNameNotEmpty'))
          return
        }
        data.name = text
        data.isEditing = false
      },
      cancelEdit(data) {
        if (!data.name) {
          this.deleteCustomNode(data.id)
          return
        }
        data.isEditing = false
      },
      deleteCustomNode(id) {
        const node = this.$refs.elTree.getNode(id)
        if (!node.isLeaf) {
          this.$Message.error(this.$t('deleteTip1'))
          return
        }
        const children = node.parent.data.children || parent.data
        const index = children.findIndex(d => d.id === id)
        children.splice(index, 1)
        if (id === this.currentNodeId) {
          this.selectTreeById(null)
        }
      },
      isFreeNode(id) {
        const node = this.$refs.elTree.getNode(id)
        const nodeFree = this.$refs.elTree.getNode('free')
        return nodeFree && nodeFree.contains(node)
      },
      closeSettings() {
        this.$emit('close-settings')
      },
    },
  }
</script>

<style lang="less" scoped>
  .topology-settings {
    @bg-color: #1a202e;
    .ml-8 {
      margin-left: 8px;
    }
    .tree-box {
      background-color: @bg-color;
      // height: 100%;
      padding: 10px;
      .title {
        margin-bottom: 20px;
      }
      .search {
        padding: 0 10px;
      }
      .tree {
        padding: 0 10px;
        margin-top: 16px;
        height: ~'calc(100vh - 262px)';
        overflow: auto;
        /deep/.vue-recycle-scroller {
          scrollbar-width: none;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        /deep/.el-tree {
          background: transparent;
          color: rgba(255, 255, 255, 0.65);
        }
        /deep/.el-tree-node__content {
          height: 30px;
        }
        .tree-item {
          flex-grow: 1;
          display: flex;
          align-items: center;
          overflow: hidden;
          .tree-item-text {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .tree-item-tag {
            flex-shrink: 0;
            margin-left: 12px;
          }
        }
      }
      /deep/.el-tree--highlight-current {
        .el-tree-node:focus > .el-tree-node__content {
          background: transparent;
        }
        .el-tree-node.is-current > .el-tree-node__content,
        .el-tree-node .el-tree-node__content:hover {
          background: rgba(2, 167, 240, 0.1);
          color: #02a7f0;
        }
      }
    }
    .graph-box {
      background-color: @bg-color;
      height: ~'calc(100vh - 142px)';
      padding: 10px;
      position: relative;
      .graph-title {
        position: absolute;
        left: 10;
        top: 10;
        font-size: 14px;
        line-height: 32px;
      }
    }
  }
</style>
