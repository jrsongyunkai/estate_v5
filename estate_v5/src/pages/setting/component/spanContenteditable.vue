<template>
  <span @click="$emit('click', $event)" class="contenteditable" contenteditable="true" @focus="onFocus" @blur="onBlur" @keydown="onKeyDown" @input="update" v-html="valueText"></span>
</template>

<script>
  export default {
    props: {
      value: { type: String, default: '' },
    },
    data() {
      return {
        focusIn: false,
        valueText: '',
        startOffset: 0,
        endOffset: 0,
      }
    },
    created() {
      this.valueText = this.value
    },
    computed: {
      localValue: {
        get: function () {
          return this.value
        },
        set: function (newValue) {
          this.$emit('input', newValue)
        },
      },
    },
    methods: {
      onFocus() {
        this.focusIn = true
        this.$emit('focus')
      },
      update(e) {
        this.localValue = e.target.innerText
      },
      onBlur() {
        this.focusIn = false
        this.$emit('blur')
      },
      onKeyDown(e) {
        if (e.code === 'Backspace') {
          let isFirst = this.isCursorAtBeginning()
          if (isFirst) {
            e.preventDefault()
            this.$emit('delete')
          }
        }
      },
      isCursorAtBeginning() {
        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          return range.startOffset === 0 && range.endOffset === 0
        }
        return false
      },
    },
    watch: {
      localValue(newVal) {
        if (!this.focusIn) {
          this.valueText = newVal
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .contenteditable {
    display: inline-block;
    padding: 0px 3px;
    &:focus {
      outline: none;
    }
  }
</style>
