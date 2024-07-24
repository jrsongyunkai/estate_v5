<template>
  <div>
    <DatePicker style="width: 120px" v-model="startDate" type="date" :options="{ disabledDate: disabledStartDate }" v-bind="$attrs"></DatePicker>
    {{ $t('to') }}
    <DatePicker style="width: 120px" v-model="endDate" type="date" :options="{ disabledDate: disabledEndDate }" v-bind="$attrs"></DatePicker>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    props: {
      value: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {}
    },
    computed: {
      startDate: {
        get() {
          return this.value[0] || null
        },
        set(val) {
          this.$emit('input', [val, this.endDate])
        },
      },
      endDate: {
        get() {
          return this.value[1] || null
        },
        set(val) {
          this.$emit('input', [this.startDate, val])
        },
      },
    },
    methods: {
      handleDateChange(date) {
        console.log(date)
      },
      disabledStartDate(date) {
        return dayjs(date).isAfter(this.endDate)
      },
      disabledEndDate(date) {
        return dayjs(date).isBefore(this.startDate)
      },
    },
  }
</script>

<style lang="less" scoped></style>
