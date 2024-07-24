<template>
  <div>
    <div>
      <Input :placeholder="$t('enterAreaName')" v-model.trim="regionName" @on-enter="search" class="search" clearable>
        <Icon type="ios-search" slot="prefix" @click="search" />
      </Input>
    </div>
    <div class="tree-box">
      <vue-easy-tree
        ref="reTree"
        :data="treeData"
        class="demo-tree-render topology"
        node-key="id"
        showCheckbox
        highlightCurrent
        defaultExpandAll
        renderAfterExpand
        :expandOnClickNode="false"
        :filterNodeMethod="filterNodeMethod"
        @check="nodeCheckedChange"
        @current-change="currentChange"></vue-easy-tree>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      regionalData: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        regionName: '',
        treeData: [], // { title: '全部资产', expand: true, selected: true, children: [] }
        selectedAll: false,
      }
    },
    mounted() {},
    methods: {
      filterNodeMethod(value, data) {
        if (!value) return true
        return data.label.includes(value)
      },
      nodeCheckedChange(data, key) {
        this.$emit('emitTree', { data, key })
      },
      currentChange(data, node) {
        this.$refs.reTree.setChecked(data.id, true, true)
        const key = { checkedKeys: this.$refs.reTree.getCheckedKeys() }
        this.$emit('emitTree', { data, key })
      },
      search() {
        this.$refs.reTree.filter(this.regionName)
      },
    },
    watch: {
      regionalData: {
        handler(newVal) {
          this.treeData = newVal
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .tree-box {
    /deep/.el-tree {
      background: transparent;
      color: rgba(255, 255, 255, 0.65);
    }
    /deep/.el-tree-node__content {
      height: 30px;
    }
    /deep/.el-checkbox.is-disabled {
      display: none;
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
</style>
