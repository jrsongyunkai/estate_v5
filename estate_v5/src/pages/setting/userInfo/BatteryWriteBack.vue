<template>
  <div class="batter-writer-back">
    <h3>{{ $t('absoluteBatteryLevelWriteBackConfiguration') }}</h3>
    <div class="writer-disflex margin-tb-20">
      <div class="writer-disflex">
        {{ $t('automaticWriteBack') }}
        <TooltipVue :tooltipText="tooltipDevice"></TooltipVue>
        ：
      </div>
      <div>
        <RadioGroup v-model="startUse">
          <Radio :label="0">{{ $t('disabled') }}</Radio>
          <Radio :label="1">{{ $t('enabled') }}</Radio>
        </RadioGroup>
      </div>
    </div>
    <div class="h20" v-if="startUse !== 1"></div>
    <div class="writer-disflex margin-tb-20 h20" v-if="startUse === 1">
      <div class="writer-disflex">
        {{ $t('rewriteMethod') }}
        <TooltipVue :tooltipText="tooltipType"></TooltipVue>
        ：
      </div>
      <div>
        <RadioGroup v-model="WriteBackValue">
          <Radio label="1">{{ $t('progressiveWriteBack') }}</Radio>
          <Radio label="2">{{ $t('rewriteThePreviousValue') }}</Radio>
        </RadioGroup>
      </div>
    </div>
    <div class="margin-tb-20">
      <Button type="primary" style="margin-top: 150px" @click="openPsModal">{{ $t('save') }}</Button>
    </div>
    <Modal v-model="openSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSeconedPwd" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <Button type="default" @click="openSeconedPwd = false">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">
          {{ $t('confirm') }}
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { checkSecondPwd } from '@/api/public'
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import { saveAutoPowerWriteBackConfig, getAutoPowerWriteBackConfig } from '@/api/setting/projectInfo'
  export default {
    components: { PwsSeconedCheckVue },
    data() {
      return {
        tooltipType: this.$t('batteryTip1'),
        openSeconedPwd: false,
        tooltipDevice: this.$t('batteryTip2'),
        WriteBackValue: '1',
        startUse: 0,
        pwdSeconeds: '',
      }
    },
    mounted() {
      this.getConfig()
    },
    methods: {
      checkSecondePwds() {
        if (this.pwdSeconeds.length < 6) {
          this.pwdSeconeds = ''
          return this.$Message.error({
            content: this.$t('pleaseEnterComplateSubPassword'),
          })
        }
        const encry = new JSEncrypt()
        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          checkSecondPwd({ secondPwd: encry.encrypt(this.pwdSeconeds), encB64: true }).then(res => {
            if (res.success) {
              if (res.code === '0') {
                // this.$Message.success({
                //     content: '校验成功'
                // })
                this.openSeconedPwd = false
                this.saveConfig()
              }
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        })
      },
      closePwdModal() {
        this.openSeconedPwd = false
      },
      openPsModal() {
        this.pwdSeconeds = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
        } else {
          this.saveConfig()
        }
      },
      getnewPwdsVal(val) {
        this.pwdSeconeds = val
      },
      async getConfig() {
        const params = {
          projectCode: this.$store.state.projectCode,
        }
        const res = await getAutoPowerWriteBackConfig(params)
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.startUse = res.data.status
        this.WriteBackValue = res.data.type ? `${res.data.type}` : ''
      },
      async saveConfig() {
        const params = {
          projectCode: this.$store.state.projectCode,
          status: this.startUse,
          type: this.WriteBackValue,
        }
        const { success, message } = await saveAutoPowerWriteBackConfig(params)
        if (!success) {
          return this.$Message.error(message)
        }
        this.$Message.success(this.$t('savedSuccessfully'))
      },
    },
  }
</script>

<style lang="less">
  .batter-writer-back {
    background: #1a202e;
    height: 400px;
    padding: 20px;
    .writer-disflex {
      display: flex;
    }
    .h20 {
      height: 25px;
    }
    .margin-tb-20 {
      margin: 20px 50px 20px;
    }
  }
</style>
