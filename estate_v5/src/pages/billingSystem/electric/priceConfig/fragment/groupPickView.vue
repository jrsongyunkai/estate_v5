<template>
  <div class="pick-lines" v-resize="setOpShow">
    <div class="top-lines-box" v-if="groupList.length" :style="{ maxHeight: isOpen ? '10000px' : '100px' }">
      <div class="list-tag" ref="listView">
        <Tag v-for="(item, index) in groupList" :key="index" :closable="!disabled" @on-close="deleteItem(index)" class="tag-item" size="medium">
          {{ `${item.typeName}/${item.nodeName}` }}
        </Tag>
      </div>
    </div>
    <div class="op-more">
      <span>共选择{{ groupList.length }}个分组</span>
      <span v-if="opShow" class="op-button" @click.stop="changeHeight">{{ isOpen ? '收起' : '展开全部' }}</span>
    </div>
    <div class="bottom-button" v-if="!disabled">
      <Button @click.stop="addGroupModal" type="dashed" ghost>添加对象</Button>
      <Button v-if="groupList.length > 0" class="ml-10" @click.stop="clearAll" type="error" ghost>全部清空</Button>
    </div>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash'
  export default {
    props: {
      value: { type: Array, default: () => [] },
      disabled: { type: Boolean, default: false },
    },
    data() {
      return {
        groupList: [],
        isOpen: false,
        opShow: false,
      }
    },
    inject: ['openModal'],
    computed: {
      disabledGroupIds() {
        return this.groupList.map(it => it.nodeId)
      },
    },
    methods: {
      addGroupModal() {
        let initialSelectedIds = this.groupList.map(it => it.nodeId)
        this.openModal('PickGroupModal', { initialSelectedIds, disabledIds: this.disabledGroupIds.filter(it => !initialSelectedIds.includes(it)) }, this.selectGroupList)
      },
      selectGroupList(e) {
        let groupList = cloneDeep(this.groupList)
        this.groupList = e.map(it => {
          let obj = { nodeId: it.id }
          if (it.data) {
            obj = { ...obj, nodeName: it.data && it.data.name, groupTypeId: it.data && it.data.parent.id, typeName: it.data && it.data.parent.type }
          } else {
            let info = groupList.find(item => item.nodeId === it.id)
            obj = { ...info }
          }
          return obj
        })
      },
      clearAll() {
        this.groupList = []
      },
      deleteItem(index) {
        this.groupList.splice(index, 1)
      },
      changeHeight() {
        this.isOpen = !this.isOpen
      },
      setOpShow() {
        this.opShow = this.$refs.listView && this.$refs.listView.offsetHeight > 100
      },
    },
    mounted() {
      this.groupList = this.value
    },
    watch: {
      groupList: {
        handler(val) {
          this.$emit('input', val)
          this.$nextTick(() => {
            this.setOpShow()
          })
        },
        deep: true,
      },
      value: {
        handler(val, oldVal) {
          this.groupList = val
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .pick-lines {
    width: 100%;
    .top-lines-box {
      overflow: hidden;
    }
    .list-tag {
      margin-bottom: 5px;
      .tag-item {
        margin-bottom: 3px;
      }
    }
    .op-more {
      display: flex;
      justify-content: space-between;
      height: 30px;
      align-items: center;
      margin-bottom: 10px;
      .op-button {
        color: #007eff;
        cursor: pointer;
      }
    }
    .bottom-button {
      display: flex;
      .ml-10 {
        margin-left: 10px;
      }
    }
  }
</style>
