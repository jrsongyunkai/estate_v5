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
      <span>{{ $t('selectedGroupTotalValue', { num: groupList.length }) }}</span>
      <span v-if="opShow" class="op-button" @click.stop="changeHeight">{{ isOpen ? $t('collapse') : $t('expandAll') }}</span>
    </div>
    <div class="bottom-button" v-if="!disabled">
      <Button @click.stop="addGroupModal" type="dashed" ghost>{{ $t('addObject') }}</Button>
      <Button v-if="groupList.length > 0" class="ml-10" @click.stop="clearAll" ghost type="error">{{ $t('clearAll') }}</Button>
    </div>
  </div>
</template>

<script>
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
    methods: {
      addGroupModal() {
        this.$emit('openPickGroupModal')
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
