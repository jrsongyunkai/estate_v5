<template>
  <Modal v-model="electricySmoothModal" :title="$t('hourlyPowerSmoothing')" width="700">
    <div>
      <span>{{ $t('smoothing') }}:</span>
      <Switch v-model="smoothSwitch" />
    </div>
    <div style="display: flex; margin: 15px 0">
      <span>
        {{ $t('autoSilentProcess') }}
        <Tooltip placement="top" max-width="250" :content="autoTreatment"><Icon type="ios-information-circle-outline" color="#007EFF"></Icon></Tooltip>
      </span>
      :
      <RadioGroup v-model="handingTreatment" style="margin-left: 20px">
        <Radio label="consumption">{{ $t('last30avgg') }}</Radio>
        <Radio label="customValue">{{ $t('customValue') }}</Radio>
        <Radio label="abnormalPercentage">{{ $t('percentageOfAnomalies') }}</Radio>
      </RadioGroup>
    </div>
    <div v-if="handingTreatment === 'customValue'">
      <span>
        {{ $t('customValue') }}
        <Tooltip placement="top" max-width="250" :content="customText"><Icon type="ios-information-circle-outline" color="#007EFF"></Icon></Tooltip>
        :
      </span>
      <Input v-model="electricityCustom" type="number" class="myiput" style="width: 200px; margin-left: 10px" :placeholder="$t('pleaseEnter')" />
      <span style="position: relative">
        <i style="position: absolute; left: -40px; top: -2px">kW·h</i>
      </span>
    </div>
    <div v-if="handingTreatment === 'abnormalPercentage'">
      <span>
        {{ $t('percentage') }}
        <Tooltip placement="top" max-width="250" :content="abnormalPercentageText">
          <Icon type="ios-information-circle-outline" color="#007EFF"></Icon>
        </Tooltip>
        :
      </span>
      <Input style="width: 200px" class="ml-10 myiput" v-model="percentageAbnomal" type="number" @on-keydown="onKeydown" :placeholder="$t('pleaseEnter')" />
      <span style="position: relative">
        <i style="position: absolute; left: -20px; top: -2px">%</i>
      </span>
    </div>
    <div slot="footer">
      <Button class="b-blue" @click="savePowerSmoothConfig">{{ $t('confirm') }}</Button>
      <Button @click="electricySmoothModal = false">{{ $t('cancel') }}</Button>
    </div>
  </Modal>
</template>

<script>
  import { findPowerSmoothHandleConf, savePowerSmoothHandleConf } from '@/api/public'
  export default {
    data() {
      return {
        electricySmoothModal: false,
        smoothSwitch: false,
        handingTreatment: 'consumption',
        electricityCustom: '',
        percentageAbnomal: '',
        abnormalPercentageText: this.$t('abnormalPercentageText'),
        customText: this.$t('automaticEntryText'),
        autoTreatment: this.$t('autoSilentText'),
      }
    },
    methods: {
      async openModel() {
        this.electricySmoothModal = true
        const res = await findPowerSmoothHandleConf({ projectCode: this.$store.state.projectCode })
        if (res.success) {
          this.smoothSwitch = res.data.status === 1
          this.handingTreatment = res.data.type === 1 ? 'consumption' : res.data.type === 2 ? 'customValue' : res.data.type === 3 ? 'abnormalPercentage' : ''
          if (res.data.type === 2) {
            this.electricityCustom = +res.data.value
          } else if (res.data.type === 3) {
            this.percentageAbnomal = +res.data.value
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async savePowerSmoothConfig() {
        let parms = {
          projectCode: this.$store.state.projectCode,
          type: this.handingTreatment === 'consumption' ? '1' : this.handingTreatment === 'customValue' ? '2' : this.handingTreatment === 'abnormalPercentage' ? '3' : '',
          value: this.handingTreatment === 'consumption' ? '' : this.handingTreatment === 'customValue' ? this.electricityCustom : this.handingTreatment === 'abnormalPercentage' ? this.percentageAbnomal : '',
          status: this.smoothSwitch ? '1' : '0',
        }
        const res = await savePowerSmoothHandleConf(parms)
        if (res.success) {
          this.$Message.success({ content: this.$t('savedSuccessfully') })
          this.electricySmoothModal = false
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>

<style></style>
