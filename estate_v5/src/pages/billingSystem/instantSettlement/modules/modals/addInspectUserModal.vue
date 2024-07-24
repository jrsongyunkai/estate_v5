<template>
  <div>
    <Modal v-model="isShowModel" :width="650" class-name="money-pop" :title="$t('addOrEditSupervisor')" @on-cancel="$emit('close')">
      <Form ref="formValidate" :model="formData" label-position="right" :label-width="100" :rules="formRules">
        <FormItem prop="userType" :label="$t('accountSource')">
          <RadioGroup v-model="formData.userType" @on-change="changeUserType" type="button">
            <Radio :label="1">{{ $t('usersWithinTheProject') }}</Radio>
            <Radio :label="2">{{ $t('offProjectUsers') }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="staffId" v-if="formData.userType === 1" :label="$t('accountName')">
          <div style="display: flex; align-items: center">
            <Input v-model="userName" :placeholder="$t('pleaseEnterAccountNameForRetrieval')" />
            <Button type="primary" class="ml-10" @click.stop="queryName">{{ $t('query') }}</Button>
          </div>
        </FormItem>
        <FormItem prop="userName" :label="$t('fullName')">
          <Input v-model="formData.userName" :disabled="formData.userType === 1" :placeholder="$t('pleaseEnter')" />
        </FormItem>
        <FormItem prop="phone" :label="$t('contactNumber')">
          <Input v-model="formData.phone" :disabled="formData.userType === 1" :placeholder="$t('pleaseEnter')" />
        </FormItem>
        <FormItem prop="email" :label="$t('mailbox')">
          <Input v-model="formData.email" :placeholder="$t('pleaseEnter')" />
        </FormItem>
        <FormItem prop="remark" :label="$t('remark')">
          <Input v-model="formData.remark" maxlength="100" show-word-limit type="textarea" :placeholder="$t('pleaseEnter')" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click.stop="save">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { findStaffByName } from '@/api/public'
  import { saveSupervisor, updateSupervisor } from '@/api/billingSystem/instantSettlement'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: null },
    },
    data() {
      return {
        isShowModel: false,
        formRules: {
          userName: [{ required: true, message: this.$t('pleaseEnterFullName'), trigger: 'change' }],
          phone: [
            { required: true, message: this.$t('pleaseEnterContactNumber'), trigger: 'change' },
            { pattern: /^1[3456789]\d{9}$/, message: this.$t('enterTheCorrectPhoneNumber'), trigger: 'blur' },
          ],
        },
        userName: '',
        formData: { projectCode: this.$store.state.projectCode, userType: 1, staffId: '', userName: '', phone: '', email: '', remark: '' },
      }
    },
    methods: {
      changeUserType(e) {
        if (e === '2') {
          this.formData.staffId = null
        }
      },
      async save() {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            this.postData()
          }
        })
      },
      async postData() {
        let res = null
        if (this.record) {
          res = await updateSupervisor({ ...this.formData, id: this.record.id })
        } else {
          res = await saveSupervisor(this.formData)
        }
        if (res.success) {
          this.$Message.success(this.$t('actionSuccess'))
          this.$emit('close')
          this.callback && this.callback()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryName() {
        if (!this.userName) return this.$Message.error({ content: this.$t('pleaseEnterAccountName') })
        const res = await findStaffByName({ projectCode: this.$store.state.projectCode, loginName: this.userName })
        if (res.success) {
          let resData = res.data
          if (Object.keys(resData).length > 0) {
            this.formData.userName = resData.realName
            this.formData.phone = resData.telephone
            this.formData.email = resData.email
            this.formData.staffId = resData.staffId
          } else {
            this.$Message.error({ content: this.$t('noAccountInfoTip') })
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.isShowModel = true
      if (this.record) {
        let { userName, phone, email, staffId, userType, remark } = this.record
        this.formData = { userName, phone, email, staffId, userType, remark }
      }
    },
  }
</script>

<style lang="less">
  @import url('./style.less');
</style>
