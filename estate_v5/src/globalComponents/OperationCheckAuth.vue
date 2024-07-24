<template>
  <Modal v-model="openSecondPwd" :title="title" :mask-closable="false" @on-cancel="closeSecondCheck">
    <slot></slot>
    <PwsSecondCheck v-if="$store.state.setSecondPwds" :isfoucs="false" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSecondCheck>
    <div slot="footer">
      <Button type="default" @click.stop="closeSecondCheck">{{ $t('cancel') }}</Button>
      <Button type="primary" style="margin-left: 10px" @click="onConfirm">{{ $t('confirm') }}</Button>
    </div>
  </Modal>
</template>
<script>
  import PwsSecondCheck from './checkAuthModel/PwsSecondCheck.vue'
  import { checkSecondPwd } from '@/api/public'
  import { getBpk } from '@/api/account'
  import { JSEncrypt } from 'jsencrypt'
  export default {
    props: {
      action: { type: Function, default: () => {} },
      closeCallback: { type: Function, default: () => {} },
      title: { type: String, default: window.$t('validate') },
      isAlways: { type: Boolean, default: false },
    },
    components: { PwsSecondCheck },
    data() {
      return {
        openSecondPwd: false,
        newPwdsSeconed: '',
        params: {},
      }
    },
    methods: {
      openModal(row) {
        this.newPwdsSeconed = ''
        this.params = row
        if (this.isAlways || this.$store.state.setSecondPwds) {
          this.openSecondPwd = true
        } else {
          this.action(this.params)
        }
      },
      closeSecondCheck() {
        this.openSecondPwd = false
        this.$emit('closeSecondCheck')
      },
      getnewPwdsVal(val) {
        this.newPwdsSeconed = val
      },
      closePwdModal() {
        this.openSecondPwd = false
        this.closeCallback && this.closeCallback()
      },
      async checkSecondePwds() {
        if (!this.$store.state.setSecondPwds) return true
        if (this.newPwdsSeconed.length < 6) {
          this.newPwdsSeconed = ''
          this.$Message.error({ content: this.$t('pleaseEnterComplateSubPassword') })
          return false
        }
        const encry = new JSEncrypt()
        const r = await getBpk()
        this.bpk = r.data
        encry.setPublicKey(this.bpk.pubkey) // 设置公钥
        const res = await checkSecondPwd({ secondPwd: encry.encrypt(this.newPwdsSeconed), encB64: true })
        if (res.success) {
          return true
        } else {
          this.$Message.error({ content: res.message })
          return false
        }
      },
      async onConfirm() {
        let valid = await this.checkSecondePwds()
        if (valid) {
          this.openSecondPwd = false
          this.action(this.params)
        }
      },
    },
  }
</script>

<style></style>
