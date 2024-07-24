<template>
  <vue-easy-tree ref="treeRef" :class="{ 'group-strict': strictMode }" v-loading="loading" :height="treeHeight" :indent="10" highlight-current :expand-on-click-node="false" node-key="uuid" :data="groupTree" default-expand-all :filter-node-method="filterNode" @current-change="currentChange">
    <div class="custom-tree-node" v-textRoll slot-scope="{ data }" :class="{ disabled: !!data.disabled }">
      {{ data.label }}
    </div>
  </vue-easy-tree>
</template>

<script>
  import { smartEnergyDeviceGroupTree } from '@/api/common/index'
  import TreeDevice from '../mixins/TreeDevice'
  import uuid from 'uuid/v1'
  export default {
    props: {
      keyWord: { type: String, default: '' },
      groupTypeID: { type: String, require: true, default: '' },
      energyType: { type: Number, default: 1 },
    },
    mixins: [TreeDevice],
    inject: ['strictMode', 'treeHeight'],
    data() {
      return {
        groupTree: [],
        currentKey: '',
      }
    },
    created() {
      this.getGroupTree()
    },
    methods: {
      currentChange(data) {
        if (data.disabled) {
          this.$refs.treeRef.setCurrentKey(this.currentKey)
          return
        }
        this.currentKey = data.uuid
        this.$emit('currentChange', data)
      },
      changChildrenId(list, key = '') {
        return list.map(it => {
          let obj = { ...it, nodeId: it.id, statType: 3, label: it.name, keyword: `${key}/${it.name}`, uuid: uuid() }
          let children = []
          if (Array.isArray(it.boxChannelList) && it.boxChannelList.length > 0) {
            children = [
              ...it.boxChannelList.map(v => ({
                ...v,
                disabled: this.strictMode,
                label: `${v.name}(${v.mac})`,
                keyword: `${key}/${v.build}${v.unit}${v.room}${v.name}${v.mac}`,
                uuid: uuid(),
                statType: 3,
                children:
                  (v.channels &&
                    v.channels.map(k => ({
                      ...k,
                      label: `${k.name}`,
                      disabled: this.strictMode,
                      keyword: `${key}/${v.name}${v.mac}${k.name}`,
                      uuid: uuid(),
                      statType: 3,
                    }))) ||
                  [],
              })),
            ]
          }
          obj.children = children.concat([...this.changChildrenId(it.children || [], obj.keyword)])
          return obj
        })
      },
      async getGroupTree() {
        let res = await smartEnergyDeviceGroupTree({ projectCode: this.$store.state.projectCode, energyType: this.energyType, groupId: Number(this.groupTypeID) })
        this.loading = false
        if (res.success) {
          let list = res.data ? JSON.parse(JSON.stringify(res.data)) : []
          this.groupTree = [
            {
              label: this.$t('allGroup'),
              keyword: this.$t('allGroup'),
              uuid: uuid(),
              statType: 3,
              groupId: Number(this.groupTypeID),
              children: [...this.changChildrenId(list, this.$t('allGroup'))],
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
  .group-strict {
    /deep/.el-tree-node__content > .disabled {
      color: #999;
      cursor: not-allowed;
    }
  }
</style>
