<template>
  <div class="table-tags" ref="cellTags">
    <div class="tags-box" ref="tagsBox">
      <Tag v-for="(tag, index) in tagList" :key="index" :closable="false" :name="tag.label" :disable-transitions="false">
        <span>{{ (returnLabel && returnLabel(tag)) || tag.label }}</span>
      </Tag>
    </div>
    <div class="tags-box-list">
      <template v-for="(tag, idx) in tagList">
        <Tag :key="idx" :closable="false" :name="tag.label" v-if="idx < overIndex || !showPip" :disable-transitions="false" @on-close="handleTypesClose(idx)">
          <span>{{ (returnLabel && returnLabel(tag)) || tag.label }}</span>
        </Tag>
      </template>
    </div>
    <Tooltip v-if="showPip && moreLength > 0" transfer transfer-class-name="table-tag-tips">
      <Tag class="more-tip">+{{ moreLength }}</Tag>
      <template #content>
        <div class="title-head-tips">{{ $t('all') }}（{{ sumLength }}）</div>
        <div class="content-tag">
          <Tag v-for="(tag, idx) in tagList" :key="idx" :closable="false" :name="tag.label" :disable-transitions="false" @on-close="handleTypesClose(idx)">
            <span>{{ (returnLabel && returnLabel(tag)) || tag.label }}</span>
          </Tag>
        </div>
      </template>
    </Tooltip>
  </div>
</template>

<script>
  export default {
    props: {
      tagList: { type: Array, default: () => [] },
      returnLabel: { type: Function, default: () => {} },
    },
    data() {
      return {
        resizeObserver: null,
        showPip: false,
        overIndex: 0,
      }
    },
    computed: {
      moreLength() {
        return this.tagList.length - this.overIndex
      },
      sumLength() {
        return this.tagList.length
      },
    },
    methods: {
      handleAddList() {
        this.$emit('handleAddList')
      },
      handleTypesClose(idx) {
        this.$emit('handleTypesClose', idx)
      },
      handleWidthSpan() {
        let offsetWidth = this.$refs.cellTags.offsetWidth
        let width = this.$refs.tagsBox.offsetWidth
        this.showPip = width > offsetWidth
        let moveLeft = 0
        for (let index = 0; index < this.$refs.tagsBox.children.length; index++) {
          const element = this.$refs.tagsBox.children[index]
          moveLeft += element.offsetWidth + 4
          if (moveLeft > offsetWidth) {
            this.overIndex = index
            break
          }
        }
      },
    },
    mounted() {
      this.resizeObserver = new ResizeObserver(this.handleWidthSpan)
      this.resizeObserver.observe(this.$refs.tagsBox)
      this.resizeObserver.observe(this.$refs.cellTags)
    },
    beforeDestroy() {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    },
  }
</script>

<style lang="less" scoped>
  .table-tags {
    width: 100%;
    overflow: hidden;
    display: flex;
    // position: relative;
    .tags-box {
      display: inline-block;
      white-space: nowrap;
      width: fit-content;
      height: 0px;
      overflow-y: hidden;
      position: absolute;
      z-index: -1;
    }
    .tags-box-list {
      display: inline-block;
      white-space: nowrap;
      width: fit-content;
    }
    /deep/.ivu-tooltip {
      display: inline-block;
    }
    .choice {
      background: rgba(0, 126, 255, 0.1);
      border: 1px solid #007eff;
      border-radius: 5px;
      color: #007eff;
      height: 34px;
      line-height: 34px;
      cursor: pointer;
      padding: 0 10px;
      margin-right: 4px;
      display: inline-block;
    }
    .ivu-tag {
      height: 34px;
      line-height: 34px;
    }
  }
  .title-head-tips {
    line-height: 30px;
    font-size: 16px;
    width: 100%;
  }
  .content-tag {
    display: flex;
    flex-wrap: wrap;
    min-width: 500px;
    .ivu-tag {
      height: 34px;
      line-height: 34px;
    }
  }
</style>
