<template>
  <div class="group-pick">
    <Select transfer v-model="formData.groupId" clearable style="width: 200px" :placeholder="$t('selectGroupingType')" class="en-unit" @on-select="pickType">
      <Option v-for="item in packetList" :key="item.id" :label="item.type" :value="item.id"></Option>
    </Select>
    <TreeSelect class="ml-10" :max-tag-count="2" style="width: 250px" v-model="formData.groupNodeId" :placeholder="$t('selectGroup')" :multiple="multiple" show-checkbox transfer :data="packetFilterList" />
  </div>
</template>

<script>
  import { getGroupType, getGroupTree } from '@/api/public'
  import { cloneDeep } from 'lodash'
  export default {
    props: {
      multiple: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        packetList: [],
        packetFilterList: [],
        formData: {
          groupId: null,
          groupNodeId: null,
        },
      }
    },
    created() {
      this.getGroupTypes()
    },
    mounted() {
      this.formData = cloneDeep({ groupId: null, groupNodeId: null, ...this.value })
    },
    methods: {
      async getGroupTypes() {
        let params = { projectCode: this.$store.state.projectCode }
        const res = await getGroupType(params)
        if (res.success) {
          this.packetList = res && res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      // 递归遍历数组为树状结构
      getTree(tree = []) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.value = item.id
            obj.parentId = item.parentId
            obj.title = item.name
            // 其他你想要添加的属性
            obj.expand = true
            obj.selected = false
            obj.checked = false
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },
      cloneTree(score, parentId = 0) {
        let tree = []
        score.map(item => {
          if (item.parentId === parentId) {
            // 递归寻找
            item.children = this.cloneTree(score, item.id)
            tree.push(item)
          }
        })
        return tree
      },
      async getGroupTrees() {
        const res = await getGroupTree({ groupId: this.formData.groupId })
        if (res.success) {
          let resData = this.getTree(res.data)
          this.packetFilterList = this.cloneTree(resData)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      pickType() {
        this.packetFilterList = []
        this.formData.groupNodeId = null
      },
      resetValue() {
        this.formData = {
          groupId: null,
          groupNodeId: null,
        }
      },
    },
    watch: {
      'formData.groupId': {
        handler(value) {
          if (value) {
            this.getGroupTrees()
          }
        },
        deep: true,
      },
      formData: {
        handler(value) {
          this.$emit('input', value)
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .group-pick {
    display: flex;
    width: 100%;
    align-items: center;
    /deep/.ivu-select-selection > div {
      display: flex;
      overflow-x: auto;
      max-width: 300px;
    }
  }
</style>
