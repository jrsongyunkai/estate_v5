<template>
  <div>
    <el-table :data="tableData">
      <el-table-column prop="foundation" :label="`${$t('billingLadderBasedElectricity')}(kW·h)`" width="300" v-if="columns.includes('foundation')">
        <template #default="{ row, $index }">
          <div v-if="disabled">{{ `[${$t('timeRangeValue', { startTime: row.pwrLevelFrom, endTime: row.pwrLevelTo })})` }}</div>
          <div v-else>
            <Input v-model="row.pwrLevelFrom" :disabled="row.disabled1" v-inputNumberRule="'TwoDecimal'" :placeholder="$t('pleaseEnter')" style="width: 100px" @on-change="handleStartValue($index, row.pwrLevelFrom)" />
            <span style="margin: 0 10px">{{ $t('to') }}</span>
            <Input v-model="row.pwrLevelTo" :placeholder="$t('pleaseEnter')" :disabled="row.disabled2" style="width: 100px" @on-change="handleEndValue($index, row.pwrLevelTo)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="pointed" :label="$t('sharpeLectricityPrice')" minWidth="200" v-if="columns.includes('pointed')">
        <template #default="{ row, $index }">
          <span v-if="disabled">{{ row.topPeakPrice }}</span>
          <Input v-else v-model="tableData[$index].topPeakPrice" :placeholder="$t('pleaseEnter')" style="width: 180px" v-inputNumberRule="'FourDecimal'" />
        </template>
      </el-table-column>
      <el-table-column prop="peak" :label="$t('peakLectricityPrice')" minWidth="200" v-if="columns.includes('peak')">
        <template #default="{ row, $index }">
          <span v-if="disabled">{{ row.peakPrice }}</span>
          <Input v-else v-model="tableData[$index].peakPrice" :placeholder="$t('pleaseEnter')" style="width: 180px" v-inputNumberRule="'FourDecimal'" />
        </template>
      </el-table-column>
      <el-table-column prop="flat" :label="$t('performanceLectricityPrice')" minWidth="200" v-if="columns.includes('flat')">
        <template #default="{ row, $index }">
          <span v-if="disabled">{{ row.flatPrice }}</span>
          <Input v-else v-model="tableData[$index].flatPrice" :placeholder="$t('pleaseEnter')" style="width: 180px" v-inputNumberRule="'FourDecimal'" />
        </template>
      </el-table-column>
      <el-table-column prop="valley" :label="$t('valleyLectricityPrice')" minWidth="200" v-if="columns.includes('valley')">
        <template #default="{ row, $index }">
          <span v-if="disabled">{{ row.valleyPrice }}</span>
          <Input v-else v-model="tableData[$index].valleyPrice" :placeholder="$t('pleaseEnter')" style="width: 180px" v-inputNumberRule="'FourDecimal'" />
        </template>
      </el-table-column>
      <el-table-column prop="action" :label="$t('operation')" width="200" v-if="columns.includes('action')">
        <template #default="{ row, $index }">
          <Button class="c-danger" type="text" @click="handleDeletePriceStep(row, $index)">{{ $t('delete') }}</Button>
        </template>
      </el-table-column>
    </el-table>
    <Button v-if="!disabled" class="b-blue" @click="handleAddStep" style="margin-top: 20px">{{ $t('addLadder') }}</Button>
  </div>
</template>

<script>
  import UseCommonMixin from './UseCommonMixin'
  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Array,
        default: () => [],
      },
    },
    mixins: [UseCommonMixin],
    data() {
      return {
        tableData: [],
        columnsArray: ['foundation', 'pointed', 'peak', 'flat', 'valley'],
      }
    },
    computed: {
      columns() {
        const hasPointed = this.$store.state.configPowerCycle.topTimeValue.length > 0
        const hasPeak = this.$store.state.configPowerCycle.timeValue.length > 0
        const hasFlat = this.$store.state.configPowerCycle.centerTimeValue.length > 0
        const hasValley = this.$store.state.configPowerCycle.bottomTimeValue.length > 0
        if (hasValley && hasFlat && hasPeak && hasPointed) {
          return this.disabled ? this.columnsArray : [...this.columnsArray, 'action']
        }
        let allColumns = this.disabled ? this.columnsArray : [...this.columnsArray, 'action']
        if (!hasPointed) allColumns = allColumns.filter(item => item !== 'pointed')
        if (!hasPeak) allColumns = allColumns.filter(item => item !== 'peak')
        if (!hasFlat) allColumns = allColumns.filter(item => item !== 'flat')
        if (!hasValley) allColumns = allColumns.filter(item => item !== 'valley')
        return allColumns
      },
    },
    methods: {
      handleStartValue(index, val) {
        this.tableData[index].pwrLevelFrom = val
        if (index > 0) this.tableData[index - 1].pwrLevelTo = val
      },
      handleEndValue(index, val) {
        this.tableData[index].pwrLevelTo = val
        if (this.tableData[index + 1]) this.tableData[index + 1].pwrLevelFrom = val
      },
      handleAddStep() {
        let lastIndex = this.tableData.length - 1
        this.tableData = [
          ...this.tableData.map(val => ({ ...val, disabled2: false })),
          {
            disabled1: false,
            disabled2: true,
            pwrLevelFrom: lastIndex < 0 ? '0' : '',
            pwrLevelTo: '+∞',
            topPeakPrice: '',
            peakPrice: '',
            flatPrice: '',
            valleyPrice: '',
            id: '',
            del: false,
            configPowerCycle: this.$store.state.configPowerCycle,
          },
        ]
        if (lastIndex > -1) this.tableData[lastIndex].pwrLevelTo = ''
        if (lastIndex > 0) this.tableData[lastIndex].pwrLevelFrom = this.tableData[lastIndex - 1].pwrLevelTo
      },
      handleDeletePriceStep(item, index, type) {
        if (item.id) {
          this.deletePriceStepModal({ projectCode: this.$store.state.projectCode, priceId: item.id }, () => {
            this.$emit('refreshData')
          })
        } else {
          this.tableData.splice(index, '1')
          this.tableData[index - 1].pwrLevelTo = '+∞'
          this.tableData[index - 1].disabled2 = true
        }
      },
    },
    mounted() {
      this.tableData = this.value.map(it => ({ ...it }))
    },
    watch: {
      value: {
        handler(val, oldVal) {
          if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
            this.tableData = val.map(it => ({ ...it }))
          }
        },
        deep: true,
      },
      tableData: {
        handler(val) {
          this.$emit('input', val)
        },
        deep: true,
      },
    },
  }
</script>
