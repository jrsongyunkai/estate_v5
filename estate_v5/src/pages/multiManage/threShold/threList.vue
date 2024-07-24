<template>
  <div class="threListPage">
    <h3 style="margin-bottom: 20px">{{ title }}</h3>
    <template v-if="lineType === 1">
      <template v-if="!detailFlag">
        <Table :columns="threliCoulums" :data="thresholdTypeList">
          <template slot-scope="{ row }" slot="typeName">
            <span>{{ `${row.typeName}(${row.unit})` }}</span>
          </template>
          <template slot-scope="{ row }" slot="limitType">
            <span>
              <i :class="row.limitType === 1 ? 'icon-v5 icon-v5-shangxian shangxian' : row.limitType === 2 ? 'icon-v5 icon-v5-xiaxian xiaxian' : '-'"></i>
              {{ row.limitType === 1 ? $t('upperLimit') : row.limitType === 2 ? $t('lowerLimit') : '-' }}
            </span>
          </template>
          <template slot-scope="{ row, index }" slot="warning">
            <div v-if="row.canSetTypes.includes('1')" :class="{ 'show-error': row.warningError }">
              <Input v-model="row.warnThreshol" @on-change="val => warnThresholChange(val, row.id, row, index)" :class="{ editStatus: isEditWarningRows.includes(row.id) }" />
              <div v-if="row.warningError" class="error-span">{{ $t('pleaseEnterPositiveInteger') }}</div>
            </div>
            <div v-else>-</div>
          </template>
          <template slot-scope="{ row, index }" slot="alarm">
            <div v-if="row.canSetTypes.includes('2')" :class="{ 'show-error': row.alarmThreshol || row.alarmRequire }">
              <Input v-model="row.alarmThreshol" @on-change="val => alarmThresholChange(val, row.id, row, index)" :class="{ editStatus: isEditRows.includes(row.id) }" />
              <div v-if="row.alarmError" class="error-span">{{ $t('pleaseEnterPositiveInteger') }}</div>
              <div v-if="row.alarmRequire" class="error-span">{{ row.limitType === 1 ? $t('pleaseEnterVoltageUpAlarmValue') : row.limitType === 2 ? $t('pleaseEnterVoltageLowAlarmValue') : '-' }}</div>
            </div>
            <div v-else>-</div>
          </template>
        </Table>
      </template>
      <template v-if="detailFlag">
        <Table :columns="threliCoulums" :data="thresholdTypeList">
          <template slot-scope="{ row }" slot="typeName">
            <span>{{ `${row.typeName}(${row.unit})` }}</span>
          </template>
          <template slot-scope="{ row }" slot="limitType">
            <span>
              <i :class="row.limitType === 1 ? 'icon-v5 icon-v5-shangxian shangxian' : row.limitType === 2 ? 'icon-v5 icon-v5-xiaxian xiaxian' : '-'"></i>
              {{ row.limitType === 1 ? $t('upperLimit') : row.limitType === 2 ? $t('lowerLimit') : '-' }}
            </span>
          </template>
          <template slot-scope="{ row }" slot="warning">
            <span>{{ row.warnThreshol === 'null' || !row.warnThreshol ? '-' : row.warnThreshol }}</span>
          </template>
          <template slot-scope="{ row }" slot="alarm">
            <span>{{ row.alarmThreshol === 'null' || !row.alarmThreshol ? '-' : row.alarmThreshol }}</span>
          </template>
        </Table>
      </template>
    </template>
    <template v-if="lineType === 2">
      <template v-if="!detailFlag">
        <Table :columns="threliCoulumsNew" :data="thresholdTypeListNew">
          <template slot-scope="{ row, index }" slot="alertThresholdRange">
            <div style="display: flex; align-items: center">
              <InputNumber v-model="row.warnThresholList[0]" @on-change="val => warnThresholListChange(val, row, index)" class="warn" />
              <span style="margin: 0 10px">——</span>
              <InputNumber v-model="row.warnThresholList[1]" @on-change="val => warnThresholListChange(val, row, index)" class="warn" />
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="alertType">
            <Select :transfer="true" v-model="row.warnCustomId" :clearable="true" @on-change="handleCustomSelect(row, index, 'warn')" :not-found-text="$t('selectCustomAlarmNoDataTip')" style="width: 200px">
              <Option v-for="item in customName" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </template>
          <template slot-scope="{ row, index }" slot="alarmThresholdRange">
            <div style="display: flex; align-items: center">
              <InputNumber v-model="row.alarmThresholList[0]" @on-change="val => alarmThresholListChange(val, row, index)" class="warn" />
              <span style="margin: 0 10px">——</span>
              <InputNumber v-model="row.alarmThresholList[1]" @on-change="val => alarmThresholListChange(val, row, index)" class="warn" />
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="alarmTpye">
            <Select :transfer="true" v-model="row.alarmCustomId" :clearable="true" @on-change="handleCustomSelect(row, index, 'alarm')" :not-found-text="$t('selectCustomAlarmNoDataTip')" style="width: 200px">
              <Option v-for="item in customName" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </template>
        </Table>
      </template>
      <template v-else>
        <Table :columns="threliCoulumsNew" :data="thresholdTypeListNew">
          <template slot-scope="{ row }" slot="alertThresholdRange">
            <div style="display: flex; align-items: center">
              <span>{{ row.warnThresholList[0] }}</span>
              <span>-</span>
              <span>{{ row.warnThresholList[1] }}</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="alertType">
            <span>{{ row.alarmCustomId }}</span>
          </template>
          <template slot-scope="{ row }" slot="alarmThresholdRange">
            <div style="display: flex; align-items: center">
              <span>{{ row.alarmThresholList[0] }}</span>
              <span>-</span>
              <span>{{ row.alarmThresholList[1] }}</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="alarmTpye">
            <span>{{ row.warnCustomId }}</span>
          </template>
        </Table>
      </template>
    </template>
  </div>
</template>
<script>
  import { queryAlarmForConfig } from '@/api/public'
  export default {
    props: {
      lineType: { type: Number },
      title: { type: String, default: '' },
      thresholdTypeList: { type: Array, default: () => [] },
      thresholdTypeListNew: { type: Array, default: () => [] },
      edit: { default: () => {} },
      detailFlag: { type: Boolean, default: false },
    },
    data() {
      return {
        customName: [],
        oldwarnThreshol: '',
        newwarnThreshol: '',
        wacthData: true,
        threliCoulumsNew: [
          { title: this.$t('port'), key: 'typeName', width: 150 },
          { title: this.$t('alertThresholdRange'), slot: 'alertThresholdRange', width: 300 },
          { title: this.$t('alertType'), slot: 'alertType' },
          { title: this.$t('alarmThresholdRange'), slot: 'alarmThresholdRange', width: 300 },
          { title: this.$t('alarmType'), slot: 'alarmTpye' },
        ],
        threliCoulums: [
          { title: this.$t('paramsType'), slot: 'typeName' },
          { title: this.$t('upperLowerlimit'), slot: 'limitType' },
          { title: this.$t('warningValue'), key: 'warning', slot: 'warning' },
          { title: this.$t('alarmValue'), key: 'alarm', slot: 'alarm' },
        ],
        threList: [{ type: this.$t('CurrentA') }],
        isEditRows: [],
        isEditWarningRows: [],
      }
    },
    mounted() {
      if (this.edit) {
        this.handleCustom()
      }
    },
    methods: {
      handleCustomSelect(row, index, type) {
        if (type === 'warn') {
          this.thresholdTypeListNew[index].warnCustomId = row.warnCustomId
        } else {
          this.thresholdTypeListNew[index].alarmCustomId = row.alarmCustomId
        }
      },
      handleCustom() {
        let params = {
          projectCodes: this.$store.state.projectCode,
        }
        queryAlarmForConfig(params).then(res => {
          this.customName = []
          res.data.customs.map(val => {
            val.alarms.map(v => {
              this.customName.push({ value: v.id, label: v.name })
            })
          })
          if (this.detailFlag) {
            this.customName.find(val => {
              this.thresholdTypeListNew.find(item => {
                if (val.value === item.warnCustomId) {
                  item.alarmCustomId = val.label
                  item.warnCustomId = val.label
                } else {
                  item.warnCustomId = ''
                  item.alarmCustomId = ''
                }
              })
            })
          }
        })
      },
      warnThresholChange(val, id, row, index) {
        this.isEditWarningRows.push(id)
        this.isEditWarningRows = [...new Set(this.isEditWarningRows)]
        const warningError = val.target.value ? !/^[0-9]+$/.test(val.target.value) : false
        this.thresholdTypeList.splice(index, 1, { ...this.thresholdTypeList[index], warnThreshol: val.target.value, warningError })
      },
      warnThresholListChange(val, row, index) {
        this.thresholdTypeListNew[index].warnThresholList = row.warnThresholList
      },
      alarmThresholListChange(val, row, index) {
        this.thresholdTypeListNew[index].alarmThresholList = row.alarmThresholList
      },
      alarmThresholChange(val, id, row, index) {
        this.isEditRows.push(id)
        this.isEditRows = [...new Set(this.isEditRows)]
        const alarmError = val.target.value ? !/^[0-9]+$/.test(val.target.value) : false
        this.thresholdTypeList.splice(index, 1, { ...this.thresholdTypeList[index], alarmThreshol: val.target.value, alarmError })
        if (Number(row.type) === 2) {
          const arr = []
          this.thresholdTypeList.forEach((v, i) => {
            if (Number(v.type) === 2) {
              arr.push({ ...v, index: i })
            }
          })
          const a1 = arr[0]
          const a2 = arr[1]
          if ((a1.alarmThreshol && !a2.alarmThreshol) || (!a1.alarmThreshol && a2.alarmThreshol)) {
            const curIndex = a1.alarmThreshol ? a2.index : a1.index
            this.thresholdTypeList.splice(curIndex, 1, { ...this.thresholdTypeList[curIndex], alarmRequire: true })
          } else {
            this.thresholdTypeList.splice(a1.index, 1, { ...this.thresholdTypeList[a1.index], alarmRequire: false })
            this.thresholdTypeList.splice(a2.index, 1, { ...this.thresholdTypeList[a2.index], alarmRequire: false })
          }
        }
      },
    },
    watch: {},
  }
</script>
<style lang="less">
  .threListPage {
    .ivu-input {
      border-color: #555b6a;
    }
    .shangxian {
      color: #007aff;
    }
    .xiaxian {
      color: #74ffff;
    }
    .editStatus {
      .ivu-input {
        color: red;
      }
    }
    .show-error {
      padding: 10px 0;
      .error-span {
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        width: 100%;
        margin-top: 7px;
        color: #e03c3a;
      }
    }
  }
</style>
