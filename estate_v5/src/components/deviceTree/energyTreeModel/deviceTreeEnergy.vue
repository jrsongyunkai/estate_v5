<template>
  <vue-easy-tree ref="treeRef" :height="treeHeight" v-loading="loading" node-key="id" :data="deviceTree" :indent="10" default-expand-all highlight-current :filter-node-method="filterNode" :expand-on-click-node="false" @current-change="currentChange">
    <div class="custom-tree-node" v-textRoll slot-scope="{ data }">
      {{ data.label }}
    </div>
  </vue-easy-tree>
</template>
<script>
  import { smartEnergyDeviceList } from '@/api/common/index'
  import TreeDevice from '../mixins/TreeDevice'
  export default {
    mixins: [TreeDevice],
    inject: ['strictMode', 'treeHeight'],
    data() {
      return {
        deviceTree: [],
      }
    },
    created() {
      this.getEnergyDevice()
    },
    methods: {
      currentChange(data) {
        this.$emit('currentChange', data)
      },
      async getEnergyDevice() {
        let res = await smartEnergyDeviceList({ projectCode: this.$store.state.projectCode, energyType: this.energyType })
        this.loading = false
        if (res.success) {
          this.deviceTree = [
            {
              label: this.$t('allDevice'),
              id: 'all',
              statType: 1,
              dataSources: this.$t('deviceDimension'),
              keyword: this.$t('allDevice'),
              children:
                res.data && res.data.length > 0
                  ? [
                      ...res.data.map(it => ({
                        ...it,
                        label: `${it.name}(${it.mac})`,
                        id: it.mac,
                        name: `${it.name}(${it.mac})`,
                        statType: 1,
                        dataSources: this.$t('deviceDimension'),
                        keyword: `${it.build}${it.unit}${it.room}${it.name}${it.mac}`,
                        children:
                          (it.channels &&
                            it.channels.map(k => ({
                              ...k,
                              label: `${k.name}`,
                              id: `${it.mac}_${k.addr}`,
                              disabled: this.strictMode,
                              keyword: `${it.build}${it.unit}${it.room}${it.name}${it.mac}/${k.name}`,
                              statType: 1,
                            }))) ||
                          [],
                      })),
                    ]
                  : [],
            },
          ]
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {},
  }
</script>
