<template>
  <div class="tpl-editor-container">
    <div class="textarea" id="textarea-input" @click.stop="focusEnd">
      <template v-for="(item, index) in list">
        <Tag :key="index" closable @on-close="deleteTag(index)" v-if="item.type === 'tag'" contenteditable="false">{{ alarmFieldMap[item.value] }}</Tag>
        <spanContenteditable :key="index" v-if="item.type === 'text'" :class="{ list: !item.value }" @focus="onFocus(index)" @blur="onblur(index)" v-model="item.value" @delete="deleteTag(index - 1)" @click.stop.prevent></spanContenteditable>
      </template>
    </div>
    <span class="bytes-len">{{ bytes }}/100</span>
    <Select class="add-field" @on-select="selectChanges">
      <Option v-for="item in alarmFields" :value="item.value" :key="item.label" :placeholder="$t('addField')">{{ item.label }}</Option>
    </Select>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import { cloneDeep } from 'lodash/fp'
  import spanContenteditable from '../component/spanContenteditable.vue'
  export default {
    name: 'TplEditor',
    props: {
      content: { type: Array, default: () => [] },
    },
    components: { spanContenteditable },
    data() {
      return {
        list: [{ type: 'text', value: '' }],
        activeIndex: 0,
        startOffset: 0,
        endOffset: 0,
      }
    },
    computed: {
      ...mapState('alarmSound', ['alarmFields']),
      ...mapGetters('alarmSound', ['alarmFieldMap']),
      bytes() {
        const newArr = [...this.list]
        const textLen = newArr
          .filter(v => v.type === 'text' && v.value)
          .map(v => v.value)
          .reduce((pre, cur) => {
            pre += cur
            return pre
          }, '').length
        const tagLen = newArr.filter(v => v.type === 'tag').length * 5
        return textLen + tagLen
      },
      template() {
        return this.list.filter(it => it.value)
      },
    },
    watch: {
      content: {
        handler(val) {
          let newArr = []
          let list = val && val.length ? val.filter(it => it.value) : []
          for (let index = 0; index < list.length; index++) {
            const it = list[index]
            const prev = list[index - 1]
            if (it.type === 'tag' && (!prev || prev.type === 'tag')) {
              newArr.push({ type: 'text', value: '' })
            }
            newArr.push(it)
          }
          if (!newArr.at(-1) || newArr.at(-1).type === 'tag') {
            newArr.push({ type: 'text', value: '' })
          }
          this.list = []
          this.$nextTick(() => {
            this.list = cloneDeep(newArr)
          })
        },
        deep: true,
      },
    },
    methods: {
      selectChanges(option) {
        let innerItem = { type: 'tag', value: option.value }
        const preTextNode = { type: 'text', value: this.list[this.activeIndex].value.slice(0, this.startOffset) }
        const nextTextNode = { type: 'text', value: this.list[this.activeIndex].value.slice(this.endOffset) }
        this.list.splice(this.activeIndex, 1, preTextNode, innerItem, nextTextNode)
        this.$nextTick(() => {
          let el = document.getElementById('textarea-input').children[this.activeIndex + 2]
          this.setCursorPosition(el, 0)
        })
      },
      onFocus(index) {
        this.activeIndex = index
      },
      deleteTag(idx) {
        const cur = this.list[idx]
        if (!cur || cur.type !== 'tag') return
        const pre = this.list.at(idx - 1)
        const next = this.list.at(idx + 1)
        this.list.splice(idx - 1, 3, { type: 'text', value: pre.value + next.value })
        this.$nextTick(() => {
          let el = document.getElementById('textarea-input').children[idx - 1]
          this.setCursorPosition(el.childNodes[0] || el, pre.value.length, el)
        })
      },
      onblur() {
        // 记录光标的位置 并且记录当前操作的对象的索引
        let sel = window.getSelection()
        let getRangeAt = sel.getRangeAt(0)
        this.startOffset = getRangeAt.startOffset
        this.endOffset = getRangeAt.endOffset
      },
      setCursorPosition(node, index, el = node) {
        const range = document.createRange()
        const sel = window.getSelection()
        range.setStart(node, index)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
        el.focus()
      },
      focusEnd() {
        document.querySelector('.contenteditable:last-child').focus()
      },
    },
  }
</script>

<style lang="less" scoped>
  .tpl-editor-container {
    position: relative;
    .textarea {
      width: 100%;
      min-height: 200px;
      border-radius: 4px;
      border: 1px solid #3d3d41;
      padding: 10px;
      font-size: 16px;
      line-height: 42px;
    }
    .add-field {
      position: absolute;
      bottom: 16px;
      right: 16px;
      width: 200px;
    }
    .bytes-len {
      position: absolute;
      bottom: 16px;
      right: 230px;
      font-size: 14px;
      color: #999;
    }
  }
</style>
