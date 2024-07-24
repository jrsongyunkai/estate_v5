<template>
  <vue-easy-tree ref="treeRef" :height="treeHeight" :class="{ 'location-strict': strictMode }" v-loading="loading" node-key="id" :indent="10" highlight-current :expand-on-click-node="false" :data="locationTree" default-expand-all :filter-node-method="filterNode" @current-change="currentChange">
    <div class="custom-tree-node" v-textRoll slot-scope="{ data }" :class="{ disabled: !!data.disabled }">
      {{ data.label }}
    </div>
  </vue-easy-tree>
</template>

<script>
  import { smartEnergyLocationTree } from '@/api/common/index'
  import TreeDevice from '../mixins/TreeDevice'
  export default {
    mixins: [TreeDevice],
    inject: ['strictMode', 'treeHeight'],
    data() {
      return {
        locationTree: [],
        currentKey: '',
      }
    },
    created() {
      this.getLocationTree()
    },
    methods: {
      currentChange(data) {
        if (data.disabled) {
          this.$refs.treeRef.setCurrentKey(this.currentKey)
          return
        }
        this.currentKey = data.id
        this.$emit('currentChange', data)
      },
      handleLocTree(list = []) {
        return list.map(it => {
          let obj = {
            ...it,
            id: `${it.provinceName}${it.cityName ? '-' + it.cityName : ''}-${it.countyName ? '-' + it.countyName : ''}`,
            label: it.countyName || it.cityName || it.provinceName,
            keyword: it.countyName || it.cityName || it.provinceName,
            statType: 2,
          }
          if (it.childs && Array.isArray(it.childs)) {
            obj.children = [...this.handleLocTree(it.childs)]
          }
          if (it.boxs && Array.isArray(it.boxs) && it.boxs.length) {
            obj.children = [...it.boxs.map(it => ({ ...it, disabled: this.strictMode, id: it.mac, label: `${it.name}(${it.mac})`, keyword: `${it.build}${it.unit}${it.room}${it.name}${it.mac}`, statType: 1 }))]
          }
          return obj
        })
      },
      async getLocationTree() {
        let res = await smartEnergyLocationTree({ projectCode: this.$store.state.projectCode, energyType: this.energyType })
        this.loading = false
        if (res.success) {
          this.locationTree = [
            {
              id: 'all',
              label: this.$store.state.prjName,
              keyword: this.$store.state.prjName,
              statType: 2,
              children: [...this.handleLocTree(res.data.locTree), ...res.data.noLocBoxList.map(it => ({ ...it, disabled: this.strictMode, id: it.mac, label: `${it.name}(${it.mac})`, keyword: `${it.build}${it.unit}${it.room}${it.name}${it.mac}`, statType: 1 }))],
            },
          ]
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .location-strict {
    /deep/.el-tree-node__content > .disabled {
      color: #999;
      cursor: not-allowed;
    }
  }
</style>
