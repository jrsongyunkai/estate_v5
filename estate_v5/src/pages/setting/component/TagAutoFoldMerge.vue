<template>
  <div class="table-cell-tags" ref="cellTags">
    <div class="tags-box" ref="tagsBox">
      <Button v-if="isEdit" type="primary" size="small" ghost @click.stop="handleAddAlarm" class="choice">{{ $t('add') }}</Button>
      <Tag v-for="tag in typeNumbers" :key="tag.typeNumber" :closable="isEdit" :name="tag.alarmInfo" :disable-transitions="false">
        <span>{{ tag.alarmInfo }}</span>
      </Tag>
      <Tag v-for="(item, ids) in customTypeNumbers" :key="`list-${ids}`" :closable="isEdit" :name="item.alarmInfo" :disable-transitions="false">
        <span>{{ item.alarmInfo }}</span>
      </Tag>
    </div>
    <div class="tags-box-list">
      <Button type="primary" v-if="isEdit" size="small" ghost @click.stop="handleAddAlarm" class="choice">{{ $t('add') }}</Button>
      <template v-for="(tag, idx) in typeNumbers">
        <Tag :key="tag.typeNumber" :closable="isEdit" :name="tag.alarmInfo" v-if="idx < overIndex || !showPip" :disable-transitions="false" @on-close="handleTypesClose(idx, 'typeNumbers')">
          <span>{{ tag.alarmInfo }}</span>
        </Tag>
      </template>
      <template v-for="(item, ids) in customTypeNumbers">
        <Tag :key="`list-${ids}`" :closable="isEdit" :name="item.alarmInfo" v-if="ids + typeNumbers.length < overIndex || !showPip" :disable-transitions="false" @on-close="handleTypesClose(ids, 'customTypeNumbers')">
          <span>{{ item.alarmInfo }}</span>
        </Tag>
      </template>
    </div>
    <Tooltip v-if="showPip && moreLength > 0" transfer transfer-class-name="table-tag-tips">
      <Tag class="more-tip">+{{ moreLength }}</Tag>
      <template #content>
        <div class="title-tips">{{ $t('allSelected') }}（{{ sumLength }}）</div>
        <div class="tips-content-table-tag">
          <Tag v-for="(tag, idx) in typeNumbers" :key="tag.typeNumber" :closable="isEdit" :name="tag.alarmInfo" :disable-transitions="false" @on-close="handleTypesClose(idx, 'typeNumbers')">
            <span>{{ tag.alarmInfo }}</span>
          </Tag>
          <Tag v-for="(item, ids) in customTypeNumbers" :key="`list-${ids}`" :closable="isEdit" :name="item.alarmInfo" :disable-transitions="false" @on-close="handleTypesClose(ids, 'customTypeNumbers')">
            <span>{{ item.alarmInfo }}</span>
          </Tag>
        </div>
      </template>
    </Tooltip>
  </div>
</template>

<script>
  export default {
    props: {
      typeNumbers: { type: Array, default: () => [] },
      customTypeNumbers: { type: Array, default: () => [] },
      isEdit: { type: Boolean, default: false },
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
        return this.typeNumbers.length + this.customTypeNumbers.length - this.overIndex
      },
      sumLength() {
        return this.typeNumbers.length + this.customTypeNumbers.length
      },
    },
    methods: {
      handleAddAlarm() {
        this.$emit('handleAddAlarm')
      },
      handleTypesClose(idx, type) {
        this.$emit('handleTypesClose', idx, type)
      },
      handleWidthSpan() {
        let offsetWidth = this.$refs.cellTags.offsetWidth
        let width = this.$refs.tagsBox.offsetWidth
        this.showPip = width > offsetWidth - 30
        let moveLeft = 0
        for (let index = 0; index < this.$refs.tagsBox.children.length; index++) {
          const element = this.$refs.tagsBox.children[index]
          moveLeft += element.offsetWidth + 4
          if (moveLeft > offsetWidth - 30) {
            this.overIndex = index - 1
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
  .table-cell-tags {
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
  .title-tips {
    line-height: 30px;
    font-size: 16px;
    width: 100%;
  }
  .tips-content-table-tag {
    display: flex;
    flex-wrap: wrap;
    min-width: 500px;
    .ivu-tag {
      height: 34px;
      line-height: 34px;
    }
  }
</style>
<style lang="less">
  .table-tag-tips {
    .ivu-tooltip-inner {
      max-width: 1000px;
      background: #1a202e;
      box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.7);
    }
  }
</style>
