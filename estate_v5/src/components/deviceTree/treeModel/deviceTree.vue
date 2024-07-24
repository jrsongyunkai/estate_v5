<template>
  <vue-easy-tree ref="treeRef" :height="treeHeight" v-loading="loading" :indent="10" :data="deviceTree" node-key="value" highlight-current :default-expanded-keys="['all']" :filter-node-method="filterNode" :expand-on-click-node="false" @current-change="currentChange">
    <div class="custom-tree-node" v-textRoll slot-scope="{ data }">
      {{ data.label }}
    </div>
  </vue-easy-tree>
</template>

<script>
  import { queryDeviceDimensionTree } from '@/api/public'
  import TreeDevice from '../mixins/TreeDevice'
  export default {
    inject: ['treeHeight'],
    mixins: [TreeDevice],
    data() {
      return {
        deviceTree: [],
      }
    },
    created() {
      this.getDeviceTree()
    },
    methods: {
      handlerDeviceTree(list, level = 1) {
        return list.map(it => {
          let obj = {
            ...it,
            level: level,
            value: level === 1 ? `${it.name}(${it.mac})${level}` : `${it.name}${level}`,
            label: level === 1 ? `${it.name}(${it.mac})` : `${it.name}`,
            statType: 1,
            dataSources: this.$t('deviceDimension'),
            keyword: `${it.name}${it.mac}`,
          }
          if (Array.isArray(it.childs)) {
            obj.children = this.handlerDeviceTree(it.childs, level + 1)
          } else if (Object.keys(it.childs).length > 0) {
            obj.children = [{ ...it.childs, label: it.childs.name, value: it.childs.name, keyword: it.childs.name }]
          }
          return obj
        })
      },
      // 全量设备数据
      async getDeviceTree() {
        let res = await queryDeviceDimensionTree({ projectCode: this.$store.state.projectCode, mac: null, addr: null })
        this.loading = false
        if (res.success) {
          this.deviceTree = [
            {
              label: this.$t('allDevice'),
              value: 'all',
              dataSources: this.$t('deviceDimension'),
              statType: 1,
              keyword: this.$t('allDevice'),
              expand: true,
              children: res.data && res.data.length > 0 ? [...this.handlerDeviceTree(res.data)] : [],
            },
          ]
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      currentChange(data) {
        this.$emit('currentChange', data)
      },
    },
  }
</script>
