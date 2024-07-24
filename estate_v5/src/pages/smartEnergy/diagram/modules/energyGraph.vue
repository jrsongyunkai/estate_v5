<template>
  <div class="graph-box">
    <HeaderControl v-model="openValue" :graph="graph" @changeDirection="changeDirection" />
    <div class="three-flow" id="three-chart"></div>
  </div>
</template>

<script>
  import { queryEnergyGraph } from '@/api/smartEnergy/statistics'
  import { smartEnergyLocationTree, smartEnergyDeviceGroupTree } from '@/api/common/index'
  import HeaderControl from './HeaderControl.vue'
  import graphMixins from '../mixins/graphMixins'
  export default {
    mixins: [graphMixins],
    components: { HeaderControl },
    data() {
      return {
        localTreeData: [],
        groupTreeData: [],
        threeDocumentId: 'three-chart',
      }
    },
    methods: {
      getModelParams(model) {
        return {
          energyType: this.energyType,
          projectCode: this.$store.state.projectCode,
          mac: model.mac ? model.mac : null,
          addr: model.addr ? model.addr : null,
          groupId: ['location'].includes(this.model) ? null : +this.model,
          nodeId: +model.nodeId || null,
          statType: model.statType,
          timeType: this.timeValue.timeType,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          provinceName: model.provinceName || null,
          cityName: model.cityName || null,
          countyName: model.countyName || null,
        }
      },
      async getContentTooltip(evt) {
        const item = evt.item
        const model = item.getModel()
        if (!model.hasRequire && this.graph && !this.isNoPowerItem(model)) {
          const itemTarget = this.graph.findById(model.id)
          let params = this.getModelParams(model)
          const res = await queryEnergyGraph(params)
          const updateModel = { ...model, power: res.success ? `${this.energyMap.name}${res.data}（${this.energyMap.unit}）` : `${res.message}`, isFail: !res.success, hasRequire: true }
          this.graph.updateItem(itemTarget, updateModel)
          this.graph.refreshItem(itemTarget)
        }
      },
      // 按照地理位置
      async setLocalTreeData() {
        let res = await smartEnergyLocationTree({ projectCode: this.$store.state.projectCode, energyType: this.energyType })
        if (res.success) {
          this.localTreeData = res.data
          this.changeLevelLocalRenderTree()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changeLevelLocalRenderTree() {
        let treeData = {
          id: 'all',
          label: this.energyMap.label,
          collapsed: this.openValue <= 0,
          statType: 2,
          level: 0,
          children: [
            ...this.handleLocTree(this.localTreeData.locTree),
            // ...this.localTreeData.noLocBoxList.map(it => ({
            //   ...it,
            //   id: uuid(),
            //   statType: 2,
            //   label: `${it.name}(${it.mac})`,
            //   collapsed: this.openValue <= 1,
            // })),
          ],
        }
        this.changeRender(treeData)
      },
      async setGroupTreeData() {
        let res = await smartEnergyDeviceGroupTree({ projectCode: this.$store.state.projectCode, groupId: Number(this.model), energyType: this.energyType })
        if (res.success) {
          this.groupTreeData = res.data && res.data.length > 0 ? JSON.parse(JSON.stringify(res.data)) : []
          this.changeLevelGroupRenderTree()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changeLevelGroupRenderTree() {
        const treeData = {
          id: 'all',
          groupId: Number(this.model),
          label: this.models.find(it => it.value === this.model).label,
          collapsed: this.openValue <= 0,
          statType: 3,
          level: 0,
          children: this.getGroupChildTree(this.groupTreeData),
        }
        this.changeRender(treeData)
      },
      changeDirection(e) {
        this.direction = e
        this.initGraph()
        if (this.model === 'location') {
          this.changeLevelLocalRenderTree()
        } else {
          this.changeLevelGroupRenderTree()
        }
      },
      reDrawGraph() {
        if (this.model === 'location') {
          this.setLocalTreeData()
        } else {
          this.setGroupTreeData()
        }
      },
    },
    mounted() {
      this.initGraph()
      this.reDrawGraph()
    },
    watch: {
      openValue: {
        handler() {
          if (this.model === 'location') {
            this.changeLevelLocalRenderTree()
          } else {
            this.changeLevelGroupRenderTree()
          }
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less" scoped>
  .graph-box {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    .three-flow {
      height: calc(~'100%');
      width: 100%;
    }
  }
</style>
