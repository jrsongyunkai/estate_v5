<template>
  <div class="money-input">
    <Input v-model="integer" v-inputNumberRule="'Integer'" v-width="150" :placeholder="$t('pleaseEnter')" ref="ref0" @on-change="onIntegerChange" />
    <div class="drop"></div>
    <Input maxlength="1" v-inputNumberRule="'Integer'" v-width="60" :value="decimal1" ref="ref1" @on-keydown="decimal1Change" />
    <Input :min="0" :max="9" v-inputNumberRule="'Integer'" v-width="60" :value="decimal2" ref="ref2" style="margin-left: 10px" @on-keydown="decimal2Change" />
    <span class="ml-10">{{ $t('yuan') }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      value: Number,
    },
    computed: {
      integer: {
        get() {
          return this.deserialize(this.value)[0]
        },
        set(integer) {
          this.$emit('input', this.serialize(integer, this.decimal1, this.decimal2))
        },
      },
      decimal1: {
        get() {
          return this.deserialize(this.value)[1]
        },
        set(decimal1) {
          this.$emit('input', this.serialize(this.integer, decimal1, this.decimal2))
        },
      },
      decimal2: {
        get() {
          return this.deserialize(this.value)[2]
        },
        set(decimal2) {
          this.$emit('input', this.serialize(this.integer, this.decimal1, decimal2))
        },
      },
    },
    methods: {
      decimal1Change(e) {
        e.preventDefault()
        if (e.code === 'Backspace') this.decimal1 = '0'
        if (e.code === 'ArrowLeft') {
          this.moveTo(0)
        }
        if (e.code === 'ArrowRight') {
          this.moveTo(2)
        }
        if (!/\d/.test(e.key)) return
        this.decimal1 = e.key
        this.$nextTick(() => {
          this.moveTo(2)
        })
      },
      decimal2Change(e) {
        e.preventDefault()
        if (e.code === 'ArrowLeft') {
          this.moveTo(1)
        }
        if (e.code === 'Backspace') this.decimal2 = '0'
        if (!/\d/.test(e.key)) return
        this.decimal2 = e.key
      },
      deserialize(n = 0) {
        const [integer, decimal = ''] = n
          .toString()
          .split('.')
          .filter(item => item !== '.')
        const [decimal1 = '0', decimal2 = '0'] = decimal.split('')
        return [integer, decimal1, decimal2]
      },
      serialize(integer, decimal1 = 0, decimal2 = 0) {
        return Number(`${Number(integer)}.${Number(decimal1)}${Number(decimal2)}`)
      },
      onIntegerChange(e) {
        if (e.data === '.') {
          this.moveTo(1)
        }
      },
      moveTo(idx) {
        this.$refs[`ref${idx}`].$el.querySelector('input').focus()
      },
    },
  }
</script>

<style lang="less" scoped>
  .money-input {
    display: flex;
    align-items: center;
    .drop {
      width: 5px;
      height: 5px;
      border-radius: 5px;
      background: #fff;
      margin: 20px 5px 0 5px;
    }
  }
</style>
