<template>
  <div>
    <GroupPickModal v-model="showGroupPick" :maxSelectNum="maxSelectNum" @on-cancel="$emit('close')" :disabledIds="disabledIds" :initialSelectedIds="initialSelectedIds" @on-ok="selectGroupList" />
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
        showGroupPick: false,
        maxSelectNum: 1000,
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
      selectGroupList(e) {
        if (e.length > this.maxSelectNum) return this.$Message.error(`所选择对象不能超过${this.maxSelectNum}个`)
        this.callback && this.callback(e)
        this.$emit('close')
      },
    },
    mounted() {
      this.showGroupPick = true
    },
  }
</script>

<style></style>
