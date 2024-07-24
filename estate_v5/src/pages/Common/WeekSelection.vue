<template>
  <div>
    <Checkbox :indeterminate="isIndeterminate" v-model="checkAll" @on-change="handleCheckAllRepeatChange">{{ $t('selectAll') }}</Checkbox>
    <div style="margin: 15px 0"></div>
    <CheckboxGroup v-model="optionData" @on-change="handleCheckedWeekChange">
      <Checkbox v-for="item in weekDays" :label="item.value" :key="item.value">{{ item.label }}</Checkbox>
    </CheckboxGroup>
    <div class="mt-20 tr">
      <Button type="primary" @click="handleSave">{{ $t('confirm') }}</Button>
      <Button @click="receive">{{ $t('cancel') }}</Button>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      options: { type: Array, default: () => [] },
    },
    data() {
      return {
        isIndeterminate: true,
        checkAll: false,
        optionData: [],
        weekDays: [
          { value: '日', label: this.$t('sunday') },
          { value: '一', label: this.$t('monday') },
          { value: '二', label: this.$t('tuesday') },
          { value: '三', label: this.$t('wednesday') },
          { value: '四', label: this.$t('thursday') },
          { value: '五', label: this.$t('friday') },
          { value: '六', label: this.$t('saturday') },
        ],
      }
    },
    mounted() {
      this.optionData = this.options
    },
    methods: {
      handleCheckAllRepeatChange(val) {
        this.optionData = val ? ['日', '一', '二', '三', '四', '五', '六'] : []
        this.isIndeterminate = false
      },
      handleCheckedWeekChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.weekDays.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.weekDays.length
      },
      handleSave() {
        this.$emit('sendWeekSelection', this.optionData)
      },
      receiveWeekSelectionCancel() {
        this.$emit('sendWeekSelection', false)
      },
      receive() {
        this.$emit('receive', false)
      },
    },
  }
</script>
<style lang="less" scoped>
  .tr {
    Button {
      margin: 5px;
    }
  }
</style>
