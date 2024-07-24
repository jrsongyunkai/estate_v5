<template>
  <div class="tree-graph" ref="treeGraphDom">
    <div class="zoom-tool">
      <Button type="primary" ghost custom-icon="icon-v5 icon-v5-refresh" @click="resetZoom" />
    </div>
    <DevicePickerModal v-model="addChildrenModal" :title="$t('addElecChildNode')" @on-ok="onAddChildrenConfirm" @on-cancel="addChildrenModal = false" :level="2" :conditions="{ isTopology: true, lineType: 'EXCEPT_IO' }" :disabledIds="disabledIds">
      <template #addr>
        <el-table-column prop="addr_parent" :label="$t('currentParentNode')" headerAlign="center" align="center">
          <template #default="{ row }">
            {{ getParentInfo(row) }}
          </template>
        </el-table-column>
      </template>
    </DevicePickerModal>
    <ParentAddrModal v-model="modifyParentModal" :title="$t('modifyElecParentNode')" @on-ok="onModifyParentConfirm" @on-cancel="modifyParentModal = false" :conditions="{ lineType: 'EXCEPT_IO' }" :disabledIds="disabledIds" />
  </div>
</template>

<script>
  import { registerEdge, registerNode, TreeGraph, Util } from '@antv/g6'
  import { debounce } from 'lodash'
  import ParentAddrModal from './ParentAddrModal'

  const iconModifyParent = require('@/assets/svg/icon-modify-parent.svg')
  const iconAddChildren = require('@/assets/svg/icon-add-children.svg')
  const iconRemoveSelf = require('@/assets/svg/icon-remove-self.svg')

  const fittingString = (str, maxWidth, fontSize) => {
    let currentWidth = 0
    let res = str
    const pattern = new RegExp('[\u4E00-\u9FA5]+') // distinguish the Chinese characters and letters
    str.split('').forEach((letter, i) => {
      if (currentWidth > maxWidth) return
      if (pattern.test(letter)) {
        // Chinese characters
        currentWidth += fontSize
      } else {
        // get the width of single letter according to the fontSize
        currentWidth += Util.getLetterWidth(letter, fontSize)
      }
      if (currentWidth > maxWidth) {
        res = `${str.substr(0, i)}\n${str.substr(i)}`
      }
    })
    return res
  }

  const NODE_WIDTH = 600
  const NODE_HEIGHT = 60

  export default {
    components: {
      ParentAddrModal,
    },
    props: {
      tree: Object,
      currentNodeId: String,
    },
    data() {
      return {
        addChildrenModal: false,
        modifyParentModal: false,
        waitingNodeId: null,
        disabledIds: [],
      }
    },
    methods: {
      prepare() {
        registerEdge('flow-line', {
          draw(cfg, group) {
            const { startPoint, endPoint, style } = cfg
            const shape = group.addShape('path', {
              attrs: {
                stroke: style.stroke,
                endArrow: style.endArrow,
                path: [
                  ['M', startPoint.x, startPoint.y],
                  ['L', startPoint.x, (startPoint.y + endPoint.y) / 2],
                  ['L', endPoint.x, (startPoint.y + endPoint.y) / 2],
                  ['L', endPoint.x, endPoint.y],
                ],
              },
            })

            return shape
          },
        })
        registerNode(
          'real-node',
          {
            draw(cfg, group) {
              const styles = this.getShapeStyle(cfg)
              const w = styles.width
              const h = styles.height

              const { labelCfg = {} } = cfg

              const keyShape = group.addShape('rect', {
                attrs: {
                  ...styles,
                  x: -w / 2,
                  y: -h / 2,
                },
              })
              const TAG_TEXT = window.$t('projectMainLine')
              const TAG_TEXT_SIZE = 12
              const TAG_TEXT_GAP = 10
              group.addShape('text', {
                attrs: {
                  ...labelCfg.style,
                  text: fittingString(cfg.name, NODE_WIDTH - 2 * (TAG_TEXT_SIZE * TAG_TEXT.length + 2 * TAG_TEXT_GAP), labelCfg.style.fontSize),
                },
              })
              if (cfg.mainline === 1) {
                group.addShape('text', {
                  attrs: {
                    text: TAG_TEXT,
                    fill: '#d9001b',
                    textAlign: 'right',
                    textBaseline: 'middle',
                    fontSize: TAG_TEXT_SIZE,
                    x: w / 2 - TAG_TEXT_GAP,
                  },
                })
              }
              group.addShape('image', {
                attrs: {
                  width: 28,
                  height: 28,
                  x: -14,
                  y: -h / 2 - 14,
                  cursor: 'pointer',
                  img: iconModifyParent,
                },
                name: 'modifyParent',
              })
              group.addShape('image', {
                attrs: {
                  width: 28,
                  height: 28,
                  x: -14,
                  y: h / 2 - 14,
                  cursor: 'pointer',
                  img: iconAddChildren,
                },
                name: 'addChildren',
              })
              if (cfg.depth !== 0) {
                group.addShape('image', {
                  attrs: {
                    width: 20,
                    height: 20,
                    x: w / 2 - 10,
                    y: -h / 2 - 10,
                    cursor: 'pointer',
                    img: iconRemoveSelf,
                  },
                  name: 'removeSelf',
                })
              }

              return keyShape
            },
            update: undefined,
          },
          'rect'
        )
        registerNode(
          'custom-node',
          {
            draw(cfg, group) {
              const styles = this.getShapeStyle(cfg)
              const w = styles.width
              const h = styles.height
              const { labelCfg = {} } = cfg

              const keyShape = group.addShape('rect', {
                attrs: {
                  ...styles,
                  stroke: '#f59a23',
                  radius: 4,
                  x: -w / 2,
                  y: -h / 2,
                },
              })

              group.addShape('text', {
                attrs: {
                  ...labelCfg.style,
                  text: cfg.name,
                },
              })
              group.addShape('image', {
                attrs: {
                  width: 28,
                  height: 28,
                  x: -14,
                  y: h / 2 - 14,
                  cursor: 'pointer',
                  img: iconAddChildren,
                },
                name: 'addChildrenForCustomNode',
              })

              return keyShape
            },
            update: undefined,
          },
          'rect'
        )
      },
      init() {
        this.prepare()
        this.graph = new TreeGraph({
          container: this.$refs.treeGraphDom,
          linkCenter: true,
          modes: {
            default: ['drag-canvas', 'zoom-canvas'],
          },
          layout: {
            type: 'compactBox',
            direction: 'TB',
            getId: function getId(d) {
              return d.id
            },
            getHeight: function getHeight() {
              return NODE_HEIGHT
            },
            getWidth: function getWidth() {
              return NODE_WIDTH
            },
            getVGap: function getVGap() {
              return 40
            },
            getHGap: function getHGap() {
              return 70
            },
          },
          defaultNode: {
            type: 'real-node',
            size: [NODE_WIDTH, NODE_HEIGHT],
            style: {
              fill: '#1a202e',
              stroke: '#797979',
              radius: 4,
            },
            labelCfg: {
              style: {
                fill: '#fff',
                fontSize: 14,
                textAlign: 'center',
                textBaseline: 'middle',
              },
            },
          },
          defaultEdge: {
            type: 'flow-line',
            style: {
              stroke: '#797979',
            },
          },
          nodeStateStyles: {
            current: {
              stroke: '#02A7F0',
            },
          },
        })
        this.render()
        this.registerEvents()
      },
      render() {
        if (!this.graph) return
        if (this.tree === null) {
          return this.graph.clear()
        }
        this.graph.data(this.tree)
        this.graph.render()
        this.graph.fitView(20)
        this.setCurrent()
      },
      resetZoom() {
        this.graph.fitView(20)
      },
      setCurrent() {
        if (this.currentNodeId === null || !this.graph) return
        const nodes = this.graph.getNodes()
        nodes.forEach(item => {
          this.graph.setItemState(item, 'current', this.currentNodeId === item.get('id'))
        })
      },
      resize() {
        debounce(() => {
          const dom = this.$refs.treeGraphDom
          if (!dom) return
          this.graph.changeSize(dom.clientWidth, dom.clientHeight)
          this.graph.fitView(20)
        })()
      },
      getAllParentNodeId(node, arr = []) {
        const parent = node.get('parent')
        if (parent) {
          arr.push(parent.get('id'))
          this.getAllParentNodeId(parent, arr)
        }
        return arr
      },
      getAllChildrenNodeId(node, arr = []) {
        const children = node.get('children')
        if (children) {
          children.forEach(item => {
            arr.push(item.get('id'))
            this.getAllChildrenNodeId(item, arr)
          })
        }

        return arr
      },
      modifyParent(e) {
        const node = e.item
        this.waitingNodeId = node.get('id')
        // 禁用所有后代节点
        this.disabledIds = [this.waitingNodeId, ...this.getAllChildrenNodeId(node)]
        this.modifyParentModal = true
      },
      onModifyParentConfirm(parentId) {
        this.$emit('modifyParent', this.waitingNodeId, parentId)
        this.modifyParentModal = false
      },
      addChildren(e) {
        const node = e.item
        this.waitingNodeId = node.get('id')
        // 禁用所有父节点
        this.disabledIds = [this.waitingNodeId, ...this.getAllParentNodeId(node)]
        this.addChildrenModal = true
      },
      onAddChildrenConfirm(children) {
        const childrenIds = children.map(item => item.id)
        this.$emit('addChildren', childrenIds, this.waitingNodeId)
        this.addChildrenModal = false
      },
      removeSelf(e) {
        this.waitingNodeId = e.item.get('id')
        this.$Modal.confirm({
          render: h => {
            return h(
              'Row',
              {
                props: {
                  wrap: false,
                },
              },
              [
                [
                  h('Icon', {
                    props: {
                      custom: 'icon-v5 icon-v5-weiwancheng',
                    },
                    style: {
                      fontSize: '20px',
                      color: 'rgb(245, 154, 35)',
                      marginRight: '10px',
                    },
                  }),
                  h('span', {}, this.$t('topologyTips3')),
                ],
              ]
            )
          },
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: () => {
            this.$emit('removeSelf', this.waitingNodeId)
          },
        })
      },
      addChildrenForCustomNode(e) {
        const node = e.item
        this.waitingNodeId = node.get('id')
        this.addChildrenModal = true
      },
      registerEvents() {
        window.addEventListener('resize', this.resize)
        this.graph.on('modifyParent:click', this.modifyParent)
        this.graph.on('addChildren:click', this.addChildren)
        this.graph.on('removeSelf:click', this.removeSelf)
        this.graph.on('addChildrenForCustomNode:click', this.addChildrenForCustomNode)
      },
      unregisterEvents() {
        window.removeEventListener('resize', this.resize)
        this.graph.off('modifyParent:click', this.modifyParent)
        this.graph.off('addChildren:click', this.addChildren)
        this.graph.off('removeSelf:click', this.removeSelf)
        this.graph.off('addChildrenForCustomNode:click', this.addChildrenForCustomNode)
      },
      getParentInfo(row) {
        const { parentAddrInfo } = row[1]
        return parentAddrInfo ? `${parentAddrInfo.name}/${parentAddrInfo.title}` : '-'
      },
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      if (!this.graph) return
      this.unregisterEvents()
      this.graph.destroy()
    },
    watch: {
      tree: {
        handler() {
          this.render()
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .tree-graph {
    width: 100%;
    height: 100%;
    position: relative;
    .zoom-tool {
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
</style>
