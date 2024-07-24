import G6 from '@antv/g6'
import uuid from 'uuid/v1'
import { energyTypeMap } from '@/untils/configuration'
export default {
  props: {
    model: { type: String | Number, default: '' },
    timeValue: { type: Object, default: () => {} },
    models: { type: Array, default: () => [] },
    energyType: { type: Number, default: 1 },
  },
  data() {
    return {
      graph: null,
      openValue: 2,
      // 布局锚点配置与布局配置
      layoutMap: {
        // 左右布局
        LR: {
          defaultNode: {
            type: 'card-node',
            anchorPoints: [
              [0, 0.5],
              [1, 0.5],
            ],
          },
          layout: { type: 'compactBox', direction: 'LR', getWidth: () => 140, getHeight: () => 40, getVGap: () => 5, getHGap: () => 60 },
          defaultEdge: { type: 'cubic-horizontal', style: { stroke: '#007eff6b', lineWidth: 3 } },
        },
        // 上下布局
        TB: {
          defaultNode: {
            type: 'card-node',
            anchorPoints: [
              [0.5, 1],
              [0.5, 0],
            ],
          },
          layout: { type: 'compactBox', direction: 'TB', getWidth: () => 140, getHeight: () => 40, getVGap: () => 40, getHGap: () => 5 },
          defaultEdge: { type: 'cubic-vertical', style: { stroke: '#007eff6b', lineWidth: 3 } },
        },
      },
      direction: 'LR',
      energyTypeMap: energyTypeMap,
    }
  },
  computed: {
    energyMap() {
      return this.energyTypeMap[this.energyType - 1]
    },
  },
  methods: {
    initGraph() {
      this.graph && this.graph.destroy()
      const container = document.getElementById(this.threeDocumentId)
      const width = container.scrollWidth
      const height = container.scrollHeight || 500
      // 注册节点配置
      const { direction, threeDocumentId, isNoPowerItem } = this
      G6.registerNode('card-node', {
        drawShape(cfg, group) {
          const w = 200
          const h = 40
          const markerPoint = direction === 'TB' ? { x: 0, y: h / 2 } : { x: w / 2, y: 0 }
          const shape = group.addShape('rect', {
            attrs: { x: -w / 2, y: -h / 2, width: w, height: h, cursor: 'pointer', stroke: '#424b5f', radius: 2, fill: '#1a202e' },
            name: 'main-box',
          })
          if (!isNoPowerItem(cfg)) {
            group.addShape('text', {
              attrs: { textBaseline: 'top', cursor: 'pointer', x: -w / 2 + 8, y: -h / 2 + 6, lineHeight: h / 2, fontSize: 10, text: cfg.label || window.$t('unknown2'), fill: '#fff' },
              name: 'title',
            })
            group.addShape('text', {
              attrs: {
                textBaseline: 'top',
                x: -w / 2 + 8,
                y: -h / 2 + 24,
                cursor: 'pointer',
                lineHeight: h / 2,
                fontSize: 10,
                text: cfg.power || window.$t('moveMouseIntoViewData'),
                fill: cfg.isFail ? '#ed4014' : '#007eff',
              },
              name: `description`,
            })
          } else {
            group.addShape('text', {
              attrs: { textBaseline: 'top', cursor: 'pointer', x: -w / 2 + 8, y: -h / 2 + 16, lineHeight: h, fontSize: 10, text: cfg.label || window.$t('unknown2'), fill: '#fff' },
              name: 'title',
            })
          }
          cfg.children &&
            cfg.children.length &&
            group.addShape('marker', {
              attrs: { ...markerPoint, r: 5, cursor: 'pointer', symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse, stroke: '#007eff', lineWidth: 0.5, fill: '#007eff6b' },
              name: 'collapse-icon',
            })
          return shape
        },
        setState(name, value, item) {
          if (name === 'collapsed') {
            const marker = item.get('group').find(ele => ele.get('name') === 'collapse-icon')
            marker.attr('symbol', value ? G6.Marker.expand : G6.Marker.collapse)
          }
        },
      })
      const grid = new G6.Grid({
        img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAC6ADAAQAAAABAAAACwAAAACBvloGAAAAK0lEQVQYGWNgwAL+///Pi0WYgQmbIC6xQaKYBYdneIDiuJyOKo7DgCEZGgAvrww82DFRtwAAAABJRU5ErkJggg==',
      })
      this.graph = new G6.TreeGraph({
        container: threeDocumentId,
        width,
        height,
        minZoom: 0.2,
        maxZoom: 5,
        modes: { default: [{ type: 'drag-canvas' }, { type: 'zoom-canvas' }] },
        ...this.layoutMap[direction],
        plugins: [grid],
      })
      this.graph.on('node:click', evt => this.changeCollapsedItem(evt))
      this.graph.on('node:mouseenter', evt => this.getContentTooltip(evt))
      window.addEventListener('resize', () => {
        if (!this.graph || this.graph.get('destroyed')) return
        if (!container || !container.scrollWidth || !container.scrollHeight) return
        this.graph.changeSize(container.scrollWidth, container.scrollHeight)
      })
    },
    changeCollapsedItem(evt) {
      const item = evt.item
      const model = item.getModel()
      if (!model.children || model.children.length === 0) return
      item.getModel().collapsed = !item.getModel().collapsed
      const collapsed = item.getModel().collapsed
      this.graph.setItemState(item, 'collapsed', collapsed)
      this.graph.updateItem(item, { ...model, labelCfg: { ...model.labelCfg } })
      this.graph.layout()
    },
    handleLocTree(list = [], level = 1) {
      return list.map(it => {
        let obj = {
          ...it,
          id: `${it.provinceName}${it.cityName ? '-' + it.cityName : ''}-${it.countyName ? '-' + it.countyName : ''}`,
          label: it.countyName || it.cityName || it.provinceName,
          statType: 2,
          collapsed: this.openValue <= level,
        }
        let children = []
        if (it.boxs && Array.isArray(it.boxs) && it.boxs.length) {
          children = [
            ...it.boxs.map(v => ({
              ...v,
              collapsed: this.openValue <= level + 1,
              id: v.mac,
              label: `${v.name}(${v.mac})`,
              statType: 1,
              children:
                (v.channels &&
                  v.channels.map(k => ({
                    ...k,
                    collapsed: this.openValue <= level + 2,
                    id: `${v.mac}${k.addr}`,
                    label: `${k.name}`,
                    statType: 1,
                  }))) ||
                [],
            })),
          ]
        }
        obj.children = children.concat([...this.handleLocTree(it.childs, level + 1)])
        return obj
      })
    },
    changeRender(treeData) {
      if (!this.graph) return
      this.graph.data(treeData)
      this.graph.render()
      this.graph.fitCenter()
    },
    getGroupChildTree(list, level = 1, id = '') {
      return list.map(it => {
        let obj = { ...it, label: it.name, collapsed: this.openValue <= level, level, id: `${uuid()}`, statType: 3, nodeId: it.id }
        let children = []
        if (Array.isArray(it.boxChannelList) && it.boxChannelList.length > 0) {
          children = [
            ...it.boxChannelList.map(v => ({
              ...v,
              collapsed: this.openValue <= level + 1,
              level: level + 1,
              id: `${uuid()}`,
              label: `${v.name}(${v.mac})`,
              statType: 1,
              children:
                (v.channels &&
                  v.channels.map(k => ({
                    ...k,
                    level: level + 2,
                    collapsed: this.openValue <= level + 2,
                    id: `${uuid()}`,
                    label: `${k.name}`,
                    statType: 1,
                  }))) ||
                [],
            })),
          ]
        }
        obj.children = children.concat([...this.getGroupChildTree(it.children || [], level + 1, obj.id)])
        return obj
      })
    },
    // 限定不查询能耗的节点
    isNoPowerItem(item) {
      return this.energyType === 1 && (item.id === 'all' || item.equipmentType === 1)
    },
  },
  mounted() {
    this.initGraph()
    this.reDrawGraph()
  },
  beforeDestroy() {
    this.graph && this.graph.destroy()
    this.graph = null
  },
}
