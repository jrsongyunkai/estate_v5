<template>
  <div class="flex">
    <span v-if="!isEdit" :class="{ requireSymblo: requireFlag }">{{ value }}:</span>
    <Input v-model="text" v-else v-width="100" />
    <span class="op-icon" @click="handle">
      <Icon :type="isEdit ? 'md-checkmark' : 'md-create'" />
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      value: { type: String, default: '' },
      requireFlag: { type: Boolean, default: false },
    },
    data() {
      return {
        text: '',
        isEdit: false,
      }
    },
    methods: {
      handle() {
        if (this.isEdit) {
          this.changeValue()
        }
        this.isEdit = !this.isEdit
      },
      changeValue() {
        this.$emit('input', this.text)
      },
    },
    mounted() {
      this.text = this.value
    },
    watch: {
      value(val) {
        this.text = val
      },
    },
  }
</script>

<style lang="less" scoped>
  .requireSymblo:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 14px;
    color: #ed4014;
  }
  .op-icon {
    margin-left: 8px;
    color: #007eff;
  }
</style>
