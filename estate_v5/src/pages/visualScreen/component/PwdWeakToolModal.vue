<template>
  <div>
    <Modal :title="$t('pwdNotEnoughSafe')" v-model="pwdEditModal" :styles="{ top: '35%' }">
      <div class="content-margin">
        <Alert show-icon>{{ $t('pwdTips3') }}</Alert>
        <div class="content-item">
          <span>{{ $t('oldPwd') }}</span>
          <Input v-model="oldPassword" :placeholder="$t('pleaseInputLoginPwd')" name="dd" autocomplete="new-password" type="password" password class="w380"></Input>
        </div>
        <div class="content-item">
          <span>{{ $t('newPwd') }}</span>
          <Input v-model="password" :placeholder="$t('enterNewPwd')" name="cc" autocomplete="new-password" type="password" password class="w380"></Input>
        </div>
        <div class="red-text" v-if="isShowTip">{{ $t('pwdRule1') }}</div>
        <div class="content-item">
          <span>{{ $t('confirmNewPwd') }}</span>
          <Input v-model="confirmPassword" :placeholder="$t('enterNewPwd')" name="dd" autocomplete="new-password" type="password" password class="w380"></Input>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveNewPwd">{{ $t('confirm2') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getBpk } from '@/api/account'
  import { chgPwd } from '@/api/public'
  import { JSEncrypt } from 'jsencrypt'
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        password: '',
        confirmPassword: '',
        pwdEditModal: false,
        bpk: null,
        isShowTip: false,
        oldPassword: '',
      }
    },
    computed: {
      ...mapState('loginInfo', ['loginPassword']),
    },
    methods: {
      showPwdToolModal() {
        this.password = ''
        this.confirmPassword = ''
        this.pwdEditModal = true
      },

      hidePwdToolModal() {
        this.pwdEditModal = false
      },
      async saveNewPwd() {
        if (!this.oldPassword || this.oldPassword !== this.loginPassword) return this.$Message.error(this.$t('enterRightOldpassword'))
        if (!this.password) return this.$Message.error(this.$t('pwdWeakNotEnough'))
        if (this.password && this.password !== this.confirmPassword) return this.$Message.error(this.$t('enteredpasswordsDiffer'))
        const encrypt = new JSEncrypt()
        const res = await getBpk()
        this.bpk = res.data
        encrypt.setPublicKey(this.bpk.pubkey) // 设置公钥
        const newPassword = encrypt.encrypt(this.password)
        const oldPassword = encrypt.encrypt(this.oldPassword)
        const params = { oriPwd: oldPassword, newPwd: newPassword, encB64: true }
        const response = await chgPwd(params)
        if (!response.success) {
          this.isShowTip = true
          return this.$Message.error(response.message)
        }
        this.isShowTip = false
        this.$Message.success(this.$t('updatePwdSuccess'))
        this.hidePwdToolModal()
      },
    },
  }
</script>

<style lang="less" scoped>
  .content-margin {
    margin: 0 auto;
    .ivu-alert {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    /deep/.ivu-alert-icon {
      top: 45%;
      transform: translateY(-50%);
    }
  }
  .red-text {
    color: red;
    font-size: 12px;
    text-align: right;

    margin-right: 13px;
  }
  .content-item {
    display: flex;
    justify-content: right;
    align-items: center;
    margin-top: 20px;
  }
  .w380 {
    width: 380px;
    margin-left: 10px;
  }
</style>
