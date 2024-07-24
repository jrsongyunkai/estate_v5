<template>
  <vue-easy-tree :indent="10" ref="treeRef" :height="treeHeight" v-loading="loading" :class="{ 'location-strict': strictMode }" highlight-current node-key="keyword" :expand-on-click-node="false" :data="locationTree" :filter-node-method="filterNode" default-expand-all @current-change="currentChange">
    <div class="custom-tree-node" v-textRoll slot-scope="{ data }" :class="{ disabled: !!data.disabled }">
      {{ data.label }}
    </div>
  </vue-easy-tree>
</template>

<script>
  import { queryLocationTreeAll } from '@/api/public'
  import TreeDevice from '../mixins/TreeDevice'
  export default {
    props: {
      keyWord: { type: String, default: '' },
    },
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
        this.currentKey = data.keyword
        this.$emit('currentChange', data)
      },
      handleLocTree(list = []) {
        return list.map(it => {
          let obj = {
            ...it,
            label: it.name || it.macName || it.countyName || it.cityName || it.provinceName,
            keyword: `${it.name || ''}${it.macName || ''}${it.mac || ''}${it.countyName || ''}${it.cityName || ''}${it.provinceName || ''}`,
            statType: it.mac ? 1 : 2,
            disabled: this.strictMode ? !!it.mac : false,
          }
          if (it.childs && Array.isArray(it.childs)) {
            obj.children = [...this.handleLocTree(it.childs)]
          }
          return obj
        })
      },
      async getLocationTree() {
        let res = await queryLocationTreeAll({ projectCode: this.$store.state.projectCode })
        this.loading = false
        if (res.success) {
          this.locationTree = [
            {
              label: this.$store.state.prjName,
              projectCode: this.$store.state.projectCode,
              statType: 2,
              keyword: this.$store.state.projectCode,
              children: res.data && res.data.length > 0 ? [...this.handleLocTree(res.data)] : [],
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
<style lang="less" scoped>
  .location-strict {
    /deep/.el-tree-node__content > .disabled {
      color: #999;
      cursor: not-allowed;
    }
  }
</style>
