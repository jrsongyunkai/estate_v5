<template>
  <div>
    <Modal v-model="modalFlag" :title="record.title" @on-cancel="$emit('close')">
      <Form ref="formRef" label-position="right" :label-width="100" :rules="formRules" :model="formData">
        <FormItem :label="`${$t('groupType')}:`" prop="type">
          <Input v-model="formData.type" :placeholder="$t('pleaseEnter') + $t('groupType')"></Input>
        </FormItem>
        <FormItem :label="`${$t('groupDescription')}:`" prop="description">
          <Input v-model="formData.description" type="textarea" :placeholder="$t('pleaseEnter') + $t('groupDescription')"></Input>
        </FormItem>
        <FormItem :label="`${$t('state')}:`" prop="status">
          <Switch v-model="formData.status" :true-value="1" :false-value="0">
            <span slot="open">{{ $t('open1') }}</span>
            <span slot="close">{{ $t('close1') }}</span>
          </Switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="$emit('close')">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="onConfirm">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { saveBoxGroup } from '@/api/public'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {
        modalFlag: false,
        formData: { type: '', description: '', status: 1 },
        formRules: {
          type: [{ required: true, message: `${this.$t('groupTypeCannotBeEmpty')}`, trigger: 'blur' }],
        },
      }
    },
    methods: {
      async saveBoxGroup() {
        let params = { projectCode: this.$store.state.projectCode, ...this.formData }
        if (this.record.rowInfo) {
          params.id = this.record.rowInfo.id
        }
        const res = await saveBoxGroup(params)
        if (res.success) {
          this.$emit('close')
          this.callback && this.callback()
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      onConfirm() {
        this.$refs.formRef.validate(async valid => {
          if (valid) {
            this.saveBoxGroup()
          }
        })
      },
    },
    created() {
      if (this.record.rowInfo) {
        this.formData.type = this.record.rowInfo.type
        this.formData.description = this.record.rowInfo.description
        this.formData.status = this.record.rowInfo.status
      }
    },
    mounted() {
      this.modalFlag = true
    },
  }
</script>
