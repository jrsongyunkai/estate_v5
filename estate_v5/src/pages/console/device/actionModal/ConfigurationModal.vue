<template>
  <Modal v-model="jhconfiguration" :title="$t('parameterConfiguration')" class-name="jhconfiguration">
    <template>
      <Form :label-width="140">
        <FormItem :label="jcconfigRow.equipmentType === 23 ? $t('waterPressureAlarmThreshold') + ':' : $t('liquidLevelAlarmThreshold') + ':'">
          <Row>
            <div style="position: relative">
              <InputNumber v-model="setParams.warnMin" :parser="value => value.replace(/[^\d]/g, '')" :max="35535"></InputNumber>
              <i style="position: absolute; right: 10px; color: #808695">{{ jcconfigRow.equipmentType === 23 ? 'Mpa' : 'mm' }}</i>
            </div>
            <span style="margin: 0 10px">{{ $t('to') }}</span>
            <div style="position: relative">
              <InputNumber v-model="setParams.warnMax" :parser="value => value.replace(/[^\d]/g, '')" :max="35535"></InputNumber>
              <i style="position: absolute; right: 10px; color: #808695">{{ jcconfigRow.equipmentType === 23 ? 'Mpa' : 'mm' }}</i>
            </div>
          </Row>
        </FormItem>
        <FormItem :label="jcconfigRow.equipmentType === 23 ? $t('waterPressureChangeRate') + ':' : $t('waterLevelChangeRate') + ':'">
          <div style="position: relative">
            <InputNumber v-model="setParams.chgRate" :parser="value => value.replace(/[^\d]/g, '')" :max="1000"></InputNumber>
            <i style="position: absolute; left: 130px; color: #808695">%</i>
          </div>
        </FormItem>
        <template v-if="jcconfigRow.equipmentType === 23">
          <FormItem :label="$t('collectionAndReportingCycle') + ':'">
            <Select v-model="setParams.period" style="width: 200px">
              <Option v-for="item in minute" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <span class="ml-10">{{ $t('minute') }}</span>
          </FormItem>
        </template>
        <template v-if="jcconfigRow.equipmentType === 24">
          <FormItem :label="$t('collectionAndReportingCycle') + ':'">
            <Select v-model="setParams.period" style="width: 200px">
              <Option v-for="item in minute" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <span class="ml-10">{{ $t('minute') }}</span>
          </FormItem>
        </template>
      </Form>
    </template>
    <div slot="footer">
      <Button type="primary" @click="handlezadsetParam">{{ $t('confirm') }}</Button>
      <Button @click="handlecancle">{{ $t('cancel') }}</Button>
    </div>
  </Modal>
</template>

<script>
  import { zadfindRealParam, zadsetParam } from '@/api/public'
  export default {
    data() {
      return {
        jhconfiguration: false,
        jcconfigRow: {},
        setParams: { period: '', warnMin: 0, warnMax: 0, chgRate: 0 },
        minute: [
          { value: '5', label: '5' },
          { value: '15', label: '15' },
          { value: '30', label: '30' },
          { value: '60', label: '60' },
        ],
      }
    },
    methods: {
      handlecancle() {
        this.jhconfiguration = false
      },
      async handlezadsetParam() {
        let parmas = {
          projectCode: this.$store.state.projectCode,
          collectPeriod: this.setParams.period,
          connectPeriod: this.setParams.period,
          equipmentType: this.jcconfigRow.equipmentType,
          warnMin: this.setParams.warnMin,
          warnMax: this.setParams.warnMax,
          chgRate: this.setParams.chgRate,
          mac: this.jcconfigRow.mac,
          deviceId: this.deviceId,
        }
        const res = await zadsetParam(parmas)
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.jhconfiguration = false
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlezadfindRealParam(row) {
        let params = { mac: row.mac, projectCode: this.$store.state.projectCode, equipmentType: row.equipmentType }
        const res = await zadfindRealParam(params)
        if (res.success) {
          this.setParams = {
            period: `${res.data.parameterData.CollectPeriod}`,
            warnMin: res.data.parameterData.WarnMin,
            warnMax: res.data.parameterData.WarnMax,
            chgRate: res.data.parameterData.ChgRate,
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      openModal(row) {
        this.jcconfigRow = row
        this.handlezadfindRealParam(row)
        this.jhconfiguration = true
      },
    },
  }
</script>

<style lang="less">
  .jhconfiguration {
    .ivu-input-suffix {
      margin-right: 10px;
    }
    input,
    .ivu-input-wrapper {
      width: 150px;
    }
    .ivu-modal-footer {
      border-color: transparent;
    }
  }
</style>
