<template>
  <div class="systemBody">
    <div class="title">
      {{ $t('servicePointModificationPrompt') }}
    </div>
    <h3>{{ $t('serviceDirection') }}</h3>
    <Form ref="form" :model="form">
      <FormItem :label="$t('state')">
        <RadioGroup v-model="form.serverPointStatus">
          <Radio :label="1">{{ $t('enabled') }}</Radio>
          <Radio :label="0">{{ $t('disabled') }}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem :label="$t('newPointingType')">
        <Select :clearable="true" :disabled="form.serverPointStatus === 0" v-model="serverPoint[0]" style="width: 200px" :placeholder="$t('pleaseSelect')">
          <Option v-for="item in options" :value="item.value" :label="item.label" :key="item.value"></Option>
        </Select>
      </FormItem>
      <FormItem :label="`${$t('newDirections')}(UDP)`">
        <Input v-model="serverPoint[1]" :disabled="form.serverPointStatus === 0" :placeholder="`${($t('formatExample') + '192.168.1.1:7758', 'sample.com:7758')}`"></Input>
      </FormItem>
      <FormItem :label="`${$t('newDirections')}(HTTP)`">
        <Input v-model="serverPoint[2]" :disabled="form.serverPointStatus === 0" :placeholder="`${($t('formatExample') + '192.168.1.1:8080/data/carry', 'sample.com:8080/data/carry')}`"></Input>
      </FormItem>
      <FormItem>
        <Button size="small" @click="openPwdsModal" type="primary">{{ $t('save') }}</Button>
      </FormItem>
    </Form>
    <Modal v-model="openSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSeconedPwd" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <Button type="default" @click="openSeconedPwd = false">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <!-- <ToolModal v-if="toolMoadal" :isShow="toolMoadal" :determineText="determineText" :cancelText="cancelText" @saveConfig="delRelateConfig" @editShow="cancelDelDevice" :text="toolTipText"></ToolModal> -->
  </div>
</template>

<script>
  // id 待后端完善
  import { findProject, saveServerPoint, checkSecondPwd } from '@/api/public'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import { toolTipText } from './text'
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  export default {
    name: 'configurings',
    components: {
      PwsSeconedCheckVue,
    },
    data() {
      return {
        determineText: this.$t('yes'),
        cancelText: this.$t('no'),
        toolMoadal: false,
        toolTipText,
        bpk: null,
        values: '',
        pwdSeconeds: '',
        openSeconedPwd: false,
        form: { serverPointStatus: 0 },
        serverPoint: ['0', '', ''],
        // immediate: false,
        options: [
          {
            label: 'IP',
            value: '0',
          },
          {
            label: this.$t('domainName'),
            value: '1',
          },
        ],
        prjId: this.$store.state.switchData.prjId,
      }
    },
    created() {},
    methods: {
      cancelDelDevice() {},
      closePwdModal() {
        this.openSeconedPwd = false
      },
      getnewPwdsVal(val) {
        this.pwdSeconeds = val
      },
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
                this.handleSave()
              }
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        })
      },
      queryInfo() {
        let prjId = this.prjId
        findProject({ id: prjId })
          .then(res => {
            if (res.success) {
              this.form = res.data
              if (res.data.serverPoint) {
                this.serverPoint = res.data.serverPoint.split(',')
                if (this.serverPoint.length === 1) {
                  this.serverPoint = ['0', this.serverPoint[0], '']
                }
              }
            } else if (res.code === '-1') {
            } else {
              if (res.message) {
                this.$Message.error({
                  content: res.message,
                })
              } else {
                this.$Message.error({
                  content: this.$t('unknown'),
                })
              }
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
          .finally(() => {})
      },
      // openToolMadal() {
      //   this.toolMoadal = true
      // },
      openPwdsModal() {
        this.pwdSeconeds = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
        } else {
          this.handleSave()
        }
      },
      handleSave() {
        let params = {
          id: this.prjId,
          serverPointStatus: this.form.serverPointStatus,
        }
        if (this.form.serverPointStatus !== 0) {
          params.isDomain = this.serverPoint[0]
          params.address1 = this.serverPoint[1]
          params.address2 = this.serverPoint[2]
        }
        saveServerPoint(params)
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: res.message,
              })
              this.toolMoadal = false
            } else if (res.code === '-1') {
            } else {
              if (res.message) {
                this.$Message.error({
                  content: res.message,
                })
              } else {
                this.$Message.error({
                  content: this.$t('unknown'),
                })
              }
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
          .finally(() => {})
      },
    },
    mounted() {
      this.queryInfo()
    },
  }
</script>

<style lang="less" scoped>
  .title {
    background: rgba(121, 125, 139, 0.2);
    border: 1px solid #888b92;
    padding: 10px;
  }
  h3 {
    margin-top: 10px;
  }
</style>
