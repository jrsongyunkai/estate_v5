<template>
  <Poptip trigger="click" v-model="editFlag" @on-popper-show="editText = text" v-bind="$attrs">
    <span class="editable-text">
      {{ text }}
      <Icon class="edit-icon" type="md-create" />
    </span>
    <template #content>
      <Input v-model="editText" v-bind="inputProps" v-if="!inputProps.inputNumberRule"></Input>
      <Input v-model="editText" v-bind="inputProps" v-inputNumberRule="inputProps.inputNumberRule" v-else></Input>
      <div style="text-align: right; margin-top: 10px">
        <Button type="primary" style="margin-right: 5px" @click="_onConfirm">{{ $t('confirm') }}</Button>
        <Button style="color: #858586" @click="_oncCancel">{{ $t('cancel') }}</Button>
      </div>
    </template>
  </Poptip>
</template>

<script>
  export default {
    props: {
      text: String,
      inputProps: {
        type: Object,
        default: () => ({}),
      },
      onConfirm: Function,
      onCancel: Function,
    },
    data() {
      return {
        editFlag: false,
        editText: '',
        confirmLoading: false,
      }
    },
    methods: {
      openEditPop() {
        this.editText = this.text
        this.editFlag = true
      },
      async _onConfirm() {
        this.confirmLoading = true
        try {
          if (this.onConfirm) {
            await this.onConfirm(this.editText)
          }
          this.editFlag = false
        } finally {
          this.confirmLoading = false
        }
      },
      _oncCancel() {
        this.editFlag = false
        this.onCancel && this.onCancel()
      },
    },
  }
</script>

<style lang="less" scoped>
  .editable-text {
    cursor: pointer;
    .edit-icon {
      visibility: hidden;
    }
    &:hover {
      .edit-icon {
        visibility: visible;
      }
    }
  }
</style>
