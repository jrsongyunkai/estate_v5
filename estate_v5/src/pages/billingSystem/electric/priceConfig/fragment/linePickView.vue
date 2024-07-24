<template>
  <div class="pick-lines" v-resize="setOpShow">
    <div class="top-lines-box" ref="topLines" v-if="lines.length" :style="{ maxHeight: isOpen ? '10000px' : '100px' }">
      <div class="list-tag" ref="listView">
        <Tag v-for="(item, index) in lines" :key="index" :closable="!disabled" @on-close="deleteItem(index)" class="tag-item" size="medium">{{ `${item.macName}/${item.addrName}` }}</Tag>
      </div>
    </div>
    <div class="op-more">
      <span>共选择{{ lines.length }}条线路</span>
      <span v-if="opShow" class="op-button" @click.stop="changeHeight">{{ isOpen ? '收起' : '展开全部' }}</span>
    </div>
    <div class="bottom-button" v-if="!disabled">
      <Button @click.stop="addLinesModal" type="dashed" ghost>添加对象</Button>
      <Button v-if="lines.length > 0" class="ml-10" @click.stop="clearAll" type="error" ghost>全部清空</Button>
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
    inject: ['openModal'],
    data() {
      return {
        lines: [],
        isOpen: false,
        opShow: false,
      }
    },
    computed: {
      disabledIdList() {
        return this.lines.map(it => it.id)
      },
    },
    methods: {
      addLinesModal() {
        let initialSelectedIds = this.lines.map(it => it.id)
        this.openModal('PickLineModal', { initialSelectedIds, disabledIds: this.disabledIdList.filter(it => !initialSelectedIds.includes(it)) }, this.onModifyParentConfirm)
      },
      onModifyParentConfirm(e) {
        let addrList = cloneDeep(this.lines)
        this.lines = e.map(it => {
          let obj = { id: it.id }
          if (!it.data) {
            let info = addrList.find(item => item.id === it.id)
            obj = { ...info }
          } else {
            obj = { ...obj, resId: it.data && it.data.resId, addr: it.data && it.data.addr, addrName: it.data && it.data.title, macName: it.data && it.data.parent.name }
          }
          return obj
        })
      },
      deleteItem(index) {
        this.lines.splice(index, 1)
      },
      clearAll() {
        this.lines = []
      },
      changeHeight() {
        this.isOpen = !this.isOpen
      },
      setOpShow() {
        this.opShow = this.$refs.listView && this.$refs.listView.offsetHeight > 100
      },
    },
    mounted() {
      this.lines = this.value
    },
    watch: {
      lines: {
        handler(val) {
          this.$emit('input', val)
          this.$nextTick(() => {
            this.setOpShow()
          })
        },
        deep: true,
      },
      value: {
        handler(val) {
          this.lines = val
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
      overflow: hidden;
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
