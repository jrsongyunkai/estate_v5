<template>
  <div :class="classes">
    <div :class="[prefixCls + '-list']" ref="hours">
      <ul :class="[prefixCls + '-ul']">
        <li :class="getCellCls(item)" v-for="item in hoursList" v-show="!item.hide" @click="handleClick('hours', item)">{{ formatTime(item.text) }}</li>
      </ul>
    </div>
    <div :class="[prefixCls + '-list']" ref="minutes">
      <ul :class="[prefixCls + '-ul']">
        <li :class="getCellCls(item)" v-for="item in minutesList" v-show="!item.hide" @click="handleClick('minutes', item)">{{ formatTime(item.text) }}</li>
      </ul>
    </div>
    <div :class="[prefixCls + '-list']" v-show="showSeconds" ref="seconds">
      <ul :class="[prefixCls + '-ul']">
        <li :class="getCellCls(item)" v-for="item in secondsList" v-show="!item.hide" @click="handleClick('seconds', item)">{{ formatTime(item.text) }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  import Options from '../time-mixins'
  import { deepCopy, scrollTop, firstUpperCase } from '../assist'

  const prefixCls = 'ivu-time-picker-cells'
  const timeParts = ['hours', 'minutes', 'seconds']

  export default {
    name: 'TimeSpinner',
    mixins: [Options],
    props: {
      hours: {
        type: [Number, String],
        default: NaN,
      },
      minutes: {
        type: [Number, String],
        default: NaN,
      },
      seconds: {
        type: [Number, String],
        default: NaN,
      },
      showSeconds: {
        type: Boolean,
        default: true,
      },
      steps: {
        type: Array,
        default: () => [],
      },
      isCustomEnd: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        spinerSteps: [1, 1, 1].map((one, i) => Math.abs(this.steps[i]) || one),
        prefixCls: prefixCls,
        compiled: false,
        focusedColumn: -1, // which column inside the picker
        focusedTime: [0, 0, 0], // the values array into [hh, mm, ss]
      }
    },
    computed: {
      classes() {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-with-seconds`]: this.showSeconds,
          },
        ]
      },
      hoursList() {
        let hours = []
        const step = this.spinerSteps[0]
        const focusedHour = this.focusedColumn === 0 && this.focusedTime[0]
        const hour_tmpl = {
          text: 0,
          selected: false,
          disabled: false,
          hide: false,
        }
        const have24Hour = this.isCustomEnd ? 24 : 23
        for (let i = 0; i <= have24Hour; i += step) {
          const hour = deepCopy(hour_tmpl)
          hour.text = i
          hour.focused = i === focusedHour

          if (this.disabledHours.length && this.disabledHours.indexOf(i) > -1) {
            hour.disabled = true
            if (this.hideDisabledOptions) hour.hide = true
          }
          let selectHour = this.hours
          if (this.isCustomEnd) {
            selectHour = this.f1(this.hours, this.minutes)[0]
          }
          if (selectHour === i) hour.selected = true

          hours.push(hour)
        }

        return hours
      },
      minutesList() {
        let minutes = []
        const step = this.spinerSteps[1]
        const focusedMinute = this.focusedColumn === 1 && this.focusedTime[1]
        const minute_tmpl = {
          text: 0,
          selected: false,
          disabled: false,
          hide: false,
        }

        for (let i = 0; i < 60; i += step) {
          const minute = deepCopy(minute_tmpl)
          minute.text = i
          minute.focused = i === focusedMinute

          if (this.disabledMinutes.length && this.disabledMinutes.indexOf(i) > -1) {
            minute.disabled = true
            if (this.hideDisabledOptions) minute.hide = true
          }
          let m = this.minutes
          if (this.isCustomEnd) {
            const temp = this.f1(this.hours, this.minutes)
            m = temp[1]
            const h = temp[0]
            if (h === 0 && i === 0) {
              minute.disabled = true
            }
            if (h === 24 && i !== 0) {
              minute.disabled = true
            }
          }
          if (m === i) minute.selected = true
          minutes.push(minute)
        }

        return minutes
      },
      secondsList() {
        let seconds = []
        const step = this.spinerSteps[2]
        const focusedMinute = this.focusedColumn === 2 && this.focusedTime[2]
        const second_tmpl = {
          text: 0,
          selected: false,
          disabled: false,
          hide: false,
        }

        for (let i = 0; i < 60; i += step) {
          const second = deepCopy(second_tmpl)
          second.text = i
          second.focused = i === focusedMinute

          if (this.disabledSeconds.length && this.disabledSeconds.indexOf(i) > -1) {
            second.disabled = true
            if (this.hideDisabledOptions) second.hide = true
          }
          if (this.seconds === i) second.selected = true
          seconds.push(second)
        }

        return seconds
      },
    },
    methods: {
      getCellCls(cell) {
        return [
          `${prefixCls}-cell`,
          {
            [`${prefixCls}-cell-selected`]: cell.selected,
            [`${prefixCls}-cell-focused`]: cell.focused,
            [`${prefixCls}-cell-disabled`]: cell.disabled,
          },
        ]
      },
      chooseValue(values) {
        const changes = timeParts.reduce((obj, part, i) => {
          const value = values[i]
          if (this[part] === value) return obj
          return {
            ...obj,
            [part]: value,
          }
        }, {})
        if (Object.keys(changes).length > 0) {
          this.emitChange(changes)
        }
      },
      handleClick(type, cell) {
        if (cell.disabled) return
        if (this.isCustomEnd) {
          let hour
          let minute
          if (type === 'hours') {
            hour = cell.text
            minute = this.minutes
          }
          if (type === 'minutes') {
            hour = this.hours
            minute = cell.text
          }
          const [hours, minutes] = this.f2(hour, minute)

          this.emitChange({
            hours,
            minutes,
          })
        } else {
          const data = { [type]: cell.text }
          this.emitChange(data)
        }
      },

      emitChange(changes) {
        this.$emit('on-change', changes)
        this.$emit('on-pick-click')
      },
      scroll(type, index) {
        const from = this.$refs[type].scrollTop
        const to = 24 * this.getScrollIndex(type, index)
        scrollTop(this.$refs[type], from, to, 500)
      },
      getScrollIndex(type, index) {
        const Type = firstUpperCase(type)
        const disabled = this[`disabled${Type}`]
        if (disabled.length && this.hideDisabledOptions) {
          let _count = 0
          disabled.forEach(item => (item <= index ? _count++ : ''))
          index -= _count
        }
        return index
      },
      updateScroll() {
        this.$nextTick(() => {
          timeParts.forEach(type => {
            this.$refs[type].scrollTop = 24 * this[`${type}List`].findIndex(obj => obj.text == this[type])
          })
        })
      },
      formatTime(text) {
        return text < 10 ? '0' + text : text
      },
      updateFocusedTime(col, time) {
        this.focusedColumn = col
        this.focusedTime = time.slice()
      },
      f1(h, m) {
        m++
        if (m === 60) {
          m = 0
          h++
        }
        return [h, m]
      },
      f2(h, m) {
        if (h === 24) {
          return [23, 59]
        }
        m--
        if (m < 0) {
          m = 59
          h--
        }

        return [h, m]
      },
    },
    watch: {
      hours: {
        handler(val) {
          if (!this.compiled) return
          let result = val
          if (this.isCustomEnd) {
            result = this.f1(val, this.minutes)[0]
          }
          this.scroll(
            'hours',
            this.hoursList.findIndex(obj => obj.text == result)
          )
        },
        deep: true,
      },
      minutes(val) {
        if (!this.compiled) return
        let result = val
        if (this.isCustomEnd) {
          result = this.f1(this.hours, val)[1]
        }
        this.scroll(
          'minutes',
          this.minutesList.findIndex(obj => obj.text == result)
        )
      },
      seconds(val) {
        if (!this.compiled) return
        this.scroll(
          'seconds',
          this.secondsList.findIndex(obj => obj.text == val)
        )
      },
      focusedTime(updated, old) {
        timeParts.forEach((part, i) => {
          if (updated[i] === old[i] || typeof updated[i] === 'undefined') return
          const valueIndex = this[`${part}List`].findIndex(obj => obj.text === updated[i])
          this.scroll(part, valueIndex)
        })
      },
    },
    mounted() {
      this.$nextTick(() => (this.compiled = true))
    },
  }
</script>
