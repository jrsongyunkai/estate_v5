<template>
  <div :class="[prefixCls + '-confirm']" @keydown.tab.capture="handleTab">
    <Button :class="timeClasses" size="small" type="text" :disabled="timeDisabled" v-if="showTime" @click="handleToggleTime">
      {{ labels.time }}
    </Button>
    <Button size="small" @click.native="handleClear" @keydown.enter.native="handleClear">
      {{ labels.clear }}
    </Button>
    <Button size="small" type="primary" @click.native="handleSuccess" @keydown.enter.native="handleSuccess">
      {{ labels.ok }}
    </Button>
  </div>
</template>
<script>
  import Emitter from './emitter'

  const prefixCls = 'ivu-picker'

  export default {
    mixins: [Emitter],

    props: {
      showTime: false,
      isTime: false,
      timeDisabled: false,
    },
    data() {
      return {
        prefixCls: prefixCls,
      }
    },
    computed: {
      timeClasses() {
        return `${prefixCls}-confirm-time`
      },
      labels() {
        const labels = ['time', 'clear', 'ok']
        const values = [this.isTime ? this.$t('selectDate') : this.$t('selectTime'), this.$t('empty'), this.$t('confirm')]
        return labels.reduce((obj, key, i) => {
          obj[key] = values[i]
          return obj
        }, {})
      },
    },
    methods: {
      handleClear() {
        this.$emit('on-pick-clear')
      },
      handleSuccess() {
        this.$emit('on-pick-success')
      },
      handleToggleTime() {
        if (this.timeDisabled) return
        this.$emit('on-pick-toggle-time')
        this.dispatch('CalendarPicker', 'focus-input')
        this.dispatch('CalendarPicker', 'update-popper')
      },
      handleTab(e) {
        const tabbables = [...this.$el.children]
        const expectedFocus = tabbables[e.shiftKey ? 'shift' : 'pop']()

        if (document.activeElement === expectedFocus) {
          e.preventDefault()
          e.stopPropagation()
          this.dispatch('CalendarPicker', 'focus-input')
        }
      },
    },
  }
</script>
