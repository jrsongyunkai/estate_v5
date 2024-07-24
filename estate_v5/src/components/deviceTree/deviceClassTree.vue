<template>
  <div class="tree-box" :class="{ fold: isFold }">
    <div class="top-menus">
      <div class="left">{{ $t('valueDeviceType') }}</div>
      <div class="pointer icon-v5 icon-v5-shouqi-01-copy" v-if="isChangeFold" @click.stop="$emit('fold')"></div>
    </div>
    <div class="tree-content">
      <vue-easy-tree :height="treeHeight" @check="handleCheckChange" v-loading="loading" node-key="id" :data="treeData" show-checkbox :indent="10" default-expand-all highlight-current :expand-on-click-node="false" :check-on-click-node="true">
        <div class="custom-tree-node" v-textRoll slot-scope="{ data }">
          {{ data.label }}
        </div>
      </vue-easy-tree>
    </div>
  </div>
</template>

<script>
  import { getProjectEquipmentType } from '@/api/common/index'
  export default {
    props: {
      isFold: { type: Boolean, default: false },
      isChangeFold: { type: Boolean, default: true },
      treeHeight: { type: String, default: 'calc(100vh - 258px)' },
    },
    data() {
      return {
        treeData: [],
        checkedKeys: [],
        notIds: ['all', 'elecEnergy', 'waterEnergy', 'gasEnergy', 'heatEnergy'],
        loading: true,
      }
    },
    methods: {
      getOption(it) {
        return { id: it.type, type: it.type, label: it.name.replace('曼顿', '') }
      },
      async queryDeviceClassTree() {
        const res = await getProjectEquipmentType({ projectCode: this.$store.state.projectCode })
        this.loading = false
        if (res.success) {
          const { elec, water, gas, heating } = res.data
          let children = []
          if (elec && elec.length) {
            children.push({ id: 'elecEnergy', label: this.$t('electricEnergy'), children: (elec && elec.map(this.getOption)) || [] })
          }
          if (water && water.length) {
            children.push({ id: 'waterEnergy', label: this.$t('hydroenergy'), children: (water && water.map(this.getOption)) || [] })
          }
          if (gas && gas.length) {
            children.push({ id: 'gasEnergy', label: this.$t('pneumaticEnergy'), children: (gas && gas.map(this.getOption)) || [] })
          }
          if (heating && heating.length) {
            children.push({ id: 'heatEnergy', label: this.$t('heatEnergy'), children: (heating && heating.map(this.getOption)) || [] })
          }
          this.treeData = [{ label: this.$t('allType'), id: 'all', children }]
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleCheckChange(data, { checkedKeys }) {
        this.checkedKeys = checkedKeys.filter(it => !this.notIds.includes(it))
      },
    },
    created() {
      this.queryDeviceClassTree()
    },
    watch: {
      checkedKeys: {
        handler(value, oldValue) {
          if (JSON.stringify(value) === JSON.stringify(oldValue)) return
          this.$emit('changeCheckedKeys', value)
        },
        deep: true,
      },
    },
    mounted() {},
  }
</script>

<style lang="less" scoped>
  @import './style.less';
  .tree-content {
    height: calc(~'100% - 21px') !important;
  }
</style>
