<template>
  <div>
    <DevicePickerModal title="添加配置对象" :maxSelectNum="maxSelectNum" :level="2" v-model="showPickLineModal" @on-ok="onModifyParentConfirm" :conditions="{ lineType: 'EXCEPT_IO' }" @on-cancel="$emit('close')" :disabledIds="disabledIds" :initialSelectedIds="initialSelectedIds" />
  </div>
</template>

<script>
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {
        maxSelectNum: 1000,
        showPickLineModal: false,
      }
    },
    computed: {
      initialSelectedIds() {
        return (this.record && this.record.initialSelectedIds) || []
      },
      disabledIds() {
        return (this.record && this.record.disabledIds) || []
      },
    },
    methods: {
      onModifyParentConfirm(e) {
        if (e.length > this.maxSelectNum) return this.$Message.error(`所选择对象不能超过${this.maxSelectNum}个`)
        this.callback && this.callback(e)
        this.$emit('close')
      },
    },
    mounted() {
      this.showPickLineModal = true
    },
  }
</script>

<style></style>
