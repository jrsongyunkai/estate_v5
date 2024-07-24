<template>
  <div class="configuration-structure" v-resize="resize">
    <Tabs value="structure" :animated="false">
      <TabPane :label="$t('structure')" name="structure">
        <div class="tree-content">
          <vue-easy-tree ref="deviceTree" :height="`${treeHeight}px`" :default-expanded-keys="expandedKeys" :expand-on-click-node="false" :data="treeData" node-key="id" @node-expand="nodeExpand" @node-collapse="nodeCollapse" @current-change="currentChange">
            <div class="custom-tree-node" slot-scope="{ data }">
              <span>
                <Icon :custom="`icon-v5 ${data.icon}`" :class="`tree-icon ${treeSelectNodeId.includes(data.id) ? 'active' : ''}`"></Icon>
                <span :class="treeSelectNodeId.includes(data.id) ? 'active' : ''">
                  {{ `${data.title || ''} ${data.id}` }}
                </span>
                <Icon style="margin: 0px 5px" custom="icon-v5 icon-v5-fuzhi" @click.stop="copyId(data.id)"></Icon>
                <Icon @click.stop="view(data, data.visible !== false)" :class="`slot-checkbox ${treeSelectNodeId.includes(data.id) ? 'active' : ''}`" :custom="`icon-v5 ${data.visible !== false ? 'icon-v5-preview' : 'icon-v5-preview-close'}`"></Icon>
              </span>
            </div>
          </vue-easy-tree>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import { iconMap, LineType, nameIconMap } from '../util/process'
  import { cloneDeep } from 'lodash'
  export default {
    data() {
      return {
        treeSelectNodeId: [],
        treeData: [],
        treeHeight: 0,
        expandedKeys: [],
      }
    },
    methods: {
      resize(el) {
        const { height } = el.getBoundingClientRect()
        this.treeHeight = Math.max(height - 50, 0)
      },
      processTitle(v) {
        if (v.name === 'combine' && v.children && v.children.length === 1) {
          return 'svg'
        }
        if (v.name === 'combine') {
          return this.$t('combination')
        }
        if (v.name === 'line') {
          return (LineType[v.lineName] && LineType[v.lineName].text) || this.$t('pencil')
        }
        if (v.image) {
          return this.$t('img')
        }
        if (nameIconMap[v.name]) {
          return nameIconMap[v.name].title || this.$t('unknown2')
        }
        return iconMap[v.graphicID] && iconMap[v.graphicID].title
      },
      processIcon(v) {
        if (v.name === 'combine' && v.children && v.children.length === 1) {
          return 'icon-v5-pic-down'
        }
        if (v.name === 'combine') {
          return 'icon-v5-folder-close'
        }
        if (v.name === 'line') {
          return (LineType[v.lineName] && LineType[v.lineName].icon) || 'icon-v5-line2'
        }
        if (nameIconMap[v.name]) {
          return nameIconMap[v.name].icon
        }
        return (iconMap[v.graphicID] && iconMap[v.graphicID].icon) || 'icon-v5-tupian'
      },
      getSvgChildren(data, childrenCodes, container) {
        const childrenData = data.filter(v => childrenCodes.includes(v.id))
        if (childrenData.length) {
          container.push(...childrenData)
          childrenData.forEach(v => {
            if (v.children && v.children.length) {
              this.getSvgChildren(data, v.children, container)
            }
          })
        }
      },
      processPens(pens) {
        const result = pens.map(v => ({ ...v, title: this.processTitle(v), icon: this.processIcon(v) }))
        return result
          .map(v => {
            if (v.name === 'combine' && v.children.length > 1) {
              v.children = (v.children && v.children.map(item => result.find(j => item === j.id))) || []
            }
            // 处理svg显隐
            if (v.name === 'combine' && v.children.length === 1) {
              const arr = []
              this.getSvgChildren(result, v.children, arr)
              v.meta = arr
              delete v.children
            }
            return v
          })
          .filter(v => !v.parentId)
      },
      onSelect(pens, pen) {
        const pen1 = window.meta2d.findOne(pen.id)
        window.meta2d.active([pen1])
        window.meta2d.render()
      },
      view(data, visible) {
        if (data.name === 'combine') {
          if (data.children && data.children.length) {
            data.children.forEach(element => {
              window.meta2d.setValue({ id: element.id, visible: !visible })
            })
          }
          if (data && data.meta) {
            data.meta.forEach(element => {
              if (element.name === 'combine' && element.children.length) {
                element.children.forEach(item => {
                  window.meta2d.setValue({ id: item.id, visible: !visible })
                })
              }
              window.meta2d.setValue({ id: element.id, visible: !visible })
            })
          }
        }
        window.meta2d.setValue({ id: data.id, visible: !visible })
        this.updateTree()
      },
      updateTree() {
        this.treeData = this.processPens(cloneDeep(window.meta2d.store.data.pens))
      },
      copyId(id) {
        this.$Copy({ text: id })
      },
      currentChange(data, node) {
        const pen1 = window.meta2d.findOne(data.id)
        window.meta2d.active([pen1])
        window.meta2d.render()
      },
      nodeExpand(data) {
        this.expandedKeys.push(data.id)
      },
      nodeCollapse(data) {
        let index = this.expandedKeys.findIndex(item => item === data.id)
        this.expandedKeys.splice(index, 1)
      },
    },
    mounted() {
      window.meta2d.on('update', this.updateTree)
    },
    watch: {
      '$store.state.diagram.activePenIds': {
        handler(value) {
          this.treeSelectNodeId = []
          value.forEach(it => {
            let pensInfo = window.meta2d.findOne(it)
            if (pensInfo.name === 'combine') {
              this.treeSelectNodeId.push(...[it, ...pensInfo.children])
            } else {
              this.treeSelectNodeId.push(it)
            }
          })
          this.updateTree()
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .configuration-structure {
    background: #1a202e;
    width: 100%;
    height: 100%;
    /deep/.ivu-tabs {
      height: 100%;
      .ivu-tabs-nav {
        margin-left: 16px;
      }
      // .ivu-tabs-nav-wrap {
      //   border-bottom: 1px solid #424b5f;
      // }
      .ivu-tabs-content {
        height: calc(~'100% - 40px');
        overflow: auto;
      }
    }
    /deep/.ivu-tabs-tabpane {
      padding: 0px;
    }
    /deep/.ivu-tabs-bar {
      margin-bottom: 12px;
    }
  }
  .tree-content {
    height: calc(~'100% - 95px');
    overflow: auto;
    width: 100%;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      width: 0px;
    }
    .active {
      color: #007eff;
    }
    .ivu-tree-title {
      width: 100%;
    }
    .tree-icon {
      display: inline-block;
      margin-right: 8px;
      font-size: 20px;
    }
    /deep/.el-tree {
      background: none;
      color: #fff;
      .custom-tree-node {
        width: calc(~'100% - 24px');
      }
    }
    /deep/.el-tree-node,
    /deep/.el-tree-node:hover {
      background: none;
    }
    /deep/.el-tree-node:focus > .el-tree-node__content,
    /deep/.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content,
    /deep/.el-tree-node__content:hover {
      background: none;
      color: #2d8cf0;
    }
    /deep/.is-focusable {
      background: none;
    }
    /deep/.ivu-tree ul li {
      margin: 2px 0;
      line-height: 30px;
    }
    /deep/.ivu-tree .ivu-tree-empty {
      text-align: center;
    }
    /deep/ .ivu-tree-title-selected,
    /deep/ .ivu-tree-title-selected:hover {
      background-color: #2d8cf0;
    }
  }
</style>
