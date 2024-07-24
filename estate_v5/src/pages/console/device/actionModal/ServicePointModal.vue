<template>
  <div>
    <Modal :title="$t('servicePoint')" v-model="orientationVisible" :mask="false" :mask-closable="false">
      <Form :model="orientationForm" style="padding-left: 60px">
        <FormItem style="display: flex">
          <span>{{ $t('newPointingType') + ':' }}</span>
          <Select transfer clearable v-model="orientationForm.isDomain" :placeholder="$t('pleaseSelect')" style="width: 150px; margin-left: 10px" @input="handleInput('isDomain', orientationForm.mac, orientationForm.isDomain)">
            <Option z-index="5" v-for="item in option" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem style="display: flex">
          <span style="margin-left: 25px">{{ $t('newDirections') }}:</span>
          <Input style="width: 205px; margin-left: 10px" type="text" v-model="orientationForm.ipOrDomain" @input="handleInput('ipOrDomain', orientationForm.mac, orientationForm.ipOrDomain)" />
        </FormItem>
        <FormItem style="display: flex">
          <span>{{ $t('newPortPointing') }}:</span>
          <Input style="width: 205px; margin-left: 10px" v-model="orientationForm.port" @input="handleInput('port', orientationForm.mac, orientationForm.port)" />
        </FormItem>
        <FormItem style="display: flex">
          <span style="margin-left: 14px">{{ $t('serviceEntrance') }}:</span>
          <Input style="width: 205px; margin-left: 10px" :placeholder="$t('formatExampleC')" v-model="orientationForm.dealEntry" @input="handleInput('dealEntry', orientationForm.mac, orientationForm.dealEntry)" />
        </FormItem>
        <FormItem style="margin-left: 330px"></FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="orientationVisible = false">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="openPwdsModal">{{ $t('send') }}</Button>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="handleSave" :closeCallback="closeAuthCallback"></OperationCheckAuth>
    <ToolModal v-if="toolMoadal" :isShow="toolMoadal" @saveConfig="checkSave" @editShow="toolMoadal = false" :text="toolText"></ToolModal>
    <ToolModal v-if="modalShow" :isShow="modalShow" :determineText="determineText" :cancelText="cancelText" @saveConfig="delSpecificRelate" @editShow="closeSpeicModal" :text="SpecificRelateText"></ToolModal>
  </div>
</template>
<script>
  import { checkingSpecificRelateConfig, deleteSpecificRelateConfig } from '@/api/console/device'
  import { remotectrl } from '@/api/public'
  export default {
    data() {
      return {
        determineText: this.$t('yes'),
        cancelText: this.$t('no'),
        SpecificRelateText: this.$t('SpecificRelateTextTip'),
        toolText: this.$t('serviceTips'),
        orientationVisible: false,
        orientationForm: { _SPECIAL_FLAG: 'INR_CHK_ONR', cmd: 'SETSERVERPOINT_DA', mac: '', isDomain: '0', ipOrDomain: '', port: '', dealEntry: '' },
        option: [
          { label: 'IP', value: '0' },
          { label: this.$t('domainName'), value: '1' },
        ],
        toolMoadal: false,
        modalShow: false,
      }
    },
    methods: {
      handleInput(key, index, value) {
        sessionStorage.setItem(key + '-' + index, value)
        this.orientationForm[key] = value
      },
      openModel(row) {
        if (row.others.online === 1) {
          this.orientationVisible = true
          this.orientationForm.mac = row.mac
          this.orientationForm.isDomain = sessionStorage.getItem('isDomain-' + row.mac) ? sessionStorage.getItem('isDomain-' + row.mac) : '0'
          this.orientationForm.ipOrDomain = sessionStorage.getItem('ipOrDomain-' + row.mac) ? sessionStorage.getItem('ipOrDomain-' + row.mac) : ''
          this.orientationForm.port = sessionStorage.getItem('port-' + row.mac) ? sessionStorage.getItem('port-' + row.mac) : ''
          this.orientationForm.dealEntry = sessionStorage.getItem('dealEntry-' + row.mac) ? sessionStorage.getItem('dealEntry-' + row.mac) : ''
        } else {
          this.$Message.error({ content: this.$t('deviceNotOnline') })
        }
      },
      openPwdsModal() {
        this.$refs.operationCheckAuth.openModal()
      },
      handleSave() {
        this.toolMoadal = true
      },
      async checkSave() {
        this.toolMoadal = false
        let parmas = { projectCode: this.$store.state.projectCode, mac: this.orientationForm.mac }
        const res = await checkingSpecificRelateConfig(parmas)
        if (!res.success) return this.$Message.error({ content: res.message })
        if (res.data.hasConfig) {
          this.modalShow = true
        } else {
          this.saveRemotectrl()
        }
      },
      async saveRemotectrl() {
        let params = {
          _SPECIAL_FLAG: this.orientationForm._SPECIAL_FLAG,
          cmd: this.orientationForm.cmd,
          mac: JSON.stringify([this.orientationForm.mac]),
          isDomain: JSON.stringify([this.orientationForm.isDomain]),
          ipOrDomain: JSON.stringify([this.orientationForm.ipOrDomain]),
          port: JSON.stringify([this.orientationForm.port]),
          dealEntry: JSON.stringify([this.orientationForm.dealEntry]),
        }
        const resData = await remotectrl(params)
        if (!resData.success) {
          return this.$Message.error({ content: resData.message })
        }
        this.orientationVisible = false
        this.$Message.success({ content: this.$t('submitCommand') })
      },
      async delSpecificRelate() {
        let parmas = {
          projectCode: this.$store.state.projectCode,
          mac: this.orientationForm.mac,
          locatedIn: 'all',
        }
        const resDatas = await deleteSpecificRelateConfig(parmas)
        if (!resDatas.success) return this.$Message.error({ content: resDatas.message })
        this.modalShow = false
        this.saveRemotectrl()
      },
      closeSpeicModal(val) {
        this.modalShow = false
        if (val === 'only-close') return
        this.saveRemotectrl()
      },
      closeAuthCallback() {
        if (this.orientationVisible) {
          this.orientationVisible = false
        }
      },
    },
  }
</script>

<style></style>
