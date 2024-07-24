<template>
  <div>
    <div class="tree">
      <!--  height="calc(100vh - 262px)" -->
      <vue-easy-tree
        ref="regionalTree"
        class="w100"
        :data="elTreeList"
        node-key="id"
        draggable
        defaultExpandAll
        renderAfterExpand
        :expandOnClickNode="false"
        highlightCurrent
        :allowDrag="allowDrag"
        :allowDrop="allowDrop"
        @node-click="selectTreeById($event.id)"
        @node-drop="setHighlight"
        :item-size="40">
        <template #default="{ data }">
          <div class="node-style" @mouseenter="changeCurrentNodeId(data)">
            <div class="tree-item" v-if="!data.isEdit">
              <div class="tree-item-text" :title="data.label">{{ data.label }}</div>
              <div class="dis-flex">
                <div v-if="data.id === 'all'"><Icon type="ios-add-circle" class="ivu-mr-8" @click.stop="addChildren(data)" /></div>
                <div v-if="currentNodeId === data.id && data.id !== 'all'">
                  <Icon type="ios-add-circle" class="ivu-mr-8" @click.stop="addNewNode(data)" />
                  <i class="icon-v5 icon-v5-bianji ivu-mr-8" v-if="data.id !== 'all'" @click.stop="editNode(data)"></i>
                  <i class="icon-v5 icon-v5-changyonggoupiaorenshanchu ivu-mr-8 red-color-regional" v-if="data.id !== 'all'" @click="deleteNode(data)"></i>
                </div>
              </div>
            </div>
            <div v-else>
              <Input type="text" v-model="addNodeInputValue" size="small" style="width: 150px" />
              <Button size="small" type="text" class="blue-color" @click="editNodeValue(data)">{{ $t('confirm') }}</Button>
              <Button size="small" type="text" class="red-color-regional" @click="cancelNode(data)">{{ $t('cancel') }}</Button>
            </div>
          </div>
        </template>
      </vue-easy-tree>
    </div>
  </div>
</template>

<script>
  import uuid from 'uuid/v1'
  import { cloneDeep } from 'lodash'
  export default {
    props: {
      regionalData: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        currentNodeId: null,
        elTreeList: [],
        addNodeInputValue: '',
      }
    },
    computed: {},
    watch: {
      regionalData: {
        handler(val) {
          const cloneData = cloneDeep(val)
          this.elTreeList = this.processData(cloneData)
        },
        deep: true,
      },
    },
    methods: {
      changeCurrentNodeId(data) {
        this.currentNodeId = data.id
      },
      setHighlight(draggingNode, dropNode, dropType) {
        this.$refs.regionalTree.setCurrentKey(this.currentNodeId)
        this.$emit('dragNode', { draggingNode, dropNode, dropType })
      },
      processData(data) {
        data.forEach(v => {
          v.isEdit = false
          if (this.notEmptyArr(v.children)) {
            this.processData(v.children)
          }
        })
        return data
      },
      notEmptyArr(arr) {
        return Array.isArray(arr) && arr.length > 0
      },
      selectTreeById(id) {
        this.currentNodeId = id
        this.$refs.regionalTree.setCurrentKey(id)
      },
      addNewNode(data) {
        this.addNodeInputValue = ''
        const newNodeData = {
          label: '',
          id: uuid(),
          isEdit: true,
          parentId: data.id,
          children: [],
        }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.unshift(newNodeData)
      },
      addChildren(data) {
        this.elTreeList[0].children.unshift({
          parentId: 0,
          isEdit: true,
          label: '',
          id: uuid(),
          children: [],
        })
        this.addNodeInputValue = ''
      },
      cancelNode(data) {
        if (!data.label) {
          this.deleteCustomNode(data.id)
          return
        }
        data.isEdit = false
      },
      deleteCustomNode(id) {
        const node = this.$refs.regionalTree.getNode(id)
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
      editNode(data) {
        console.log('🚀 ~ editNode ~ data:', data)
        data.isEdit = true
        this.addNodeInputValue = data.label
      },
      editNodeValue(data) {
        // 新增
        if (!data.label) {
          this.$emit('addNode', { ...data, addNodeInputValue: this.addNodeInputValue })
          return
        }
        // 编辑
        data.label = this.addNodeInputValue
        this.$emit('editNodeName', data)
      },
      allowDrop(_draggingNode, dropNode, _type) {
        const nodeAll = this.$refs.regionalTree.getNode('all')
        return dropNode !== nodeAll
      },
      allowDrag(node) {
        return !['all'].includes(node.data.id)
      },
      // 删除节点
      deleteNode(data) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('nodeDeleteTip'),
          onOk: () => this.$emit('emitDeleteNode', data),
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .node-style {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .tree {
    padding: 0 10px;
    margin-top: 16px;
    height: ~'calc(100vh - 400px)';
    overflow: auto;

    .dis-flex {
      display: flex;
    }
    .mar-lf-10 {
      margin: 0 10px;
    }
    .blue-color {
      color: #007eff;
    }
    .red-color-regional {
      color: #f56c6c;
    }
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
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: space-between;
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
</style>
