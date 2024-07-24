<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column prop="foundation" label="计费阶梯（基于电量）（kW·h）" width="300" v-if="columns.includes('foundation')">
        <template #default="{ row, $index }">
          <div v-if="disabled">{{ `【${row.pwrLevelFrom} 至 ${row.pwrLevelTo}）` }}</div>
          <div v-else>
            <Input v-model="row.pwrLevelFrom" :disabled="row.disabled1" v-inputNumberRule="'TwoDecimal'" placeholder="请输入" style="width: 100px" @on-change="handleStartValue($index, row.pwrLevelFrom)" />
            <span style="margin: 0 10px">至</span>
            <Input v-model="row.pwrLevelTo" placeholder="请输入" :disabled="row.disabled2" style="width: 100px" @on-change="handleEndValue($index, row.pwrLevelTo)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="pointed" label="尖时电价（元）" minWidth="200" v-if="columns.includes('pointed')">
        <template #default="{ row, $index }">
          <span v-if="disabled">{{ row.topPeakPrice }}</span>
          <Input v-else v-model="tableData[$index].topPeakPrice" placeholder="请输入" style="width: 180px" v-inputNumberRule="'FourDecimal'" />
        </template>
      </el-table-column>
      <el-table-column prop="peak" label="峰时电价（元）" minWidth="200" v-if="columns.includes('peak')">
        <template #default="{ row, $index }">
          <span v-if="disabled">{{ row.peakPrice }}</span>
          <Input v-else v-model="tableData[$index].peakPrice" placeholder="请输入" style="width: 180px" v-inputNumberRule="'FourDecimal'" />
        </template>
      </el-table-column>
      <el-table-column prop="flat" label="平时电价（元）" minWidth="200" v-if="columns.includes('flat')">
        <template #default="{ row, $index }">
          <span v-if="disabled">{{ row.flatPrice }}</span>
          <Input v-else v-model="tableData[$index].flatPrice" placeholder="请输入" style="width: 180px" v-inputNumberRule="'FourDecimal'" />
        </template>
      </el-table-column>
      <el-table-column prop="valley" label="谷时电价（元）" minWidth="200" v-if="columns.includes('valley')">
        <template #default="{ row, $index }">
          <span v-if="disabled">{{ row.valleyPrice }}</span>
          <Input v-else v-model="tableData[$index].valleyPrice" placeholder="请输入" style="width: 180px" v-inputNumberRule="'FourDecimal'" />
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" align="center" width="200" v-if="columns.includes('action')">
        <template #default="{ row, $index }">
          <Button class="c-danger" type="text" @click="handleDeletePriceStep(row, $index)">删除</Button>
        </template>
      </el-table-column>
    </el-table>
    <Button v-if="!disabled" long class="b-blue" @click="handleAddStep" style="margin-top: 20px">添加阶梯</Button>
  </div>
</template>

<script>
  export default {
    props: {
      disabled: { type: Boolean, default: false },
      value: { type: Array, default: () => [] },
    },
    data() {
      return {
        tableData: [],
        columnsArray: ['foundation', 'pointed', 'peak', 'flat', 'valley'],
        optionsTimer: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() + 24 * 60 * 60 * 1000 - 86400000
          },
        },
        postIndex: 0,
        validStartTime: '',
      }
    },
    computed: {
      columns() {
        return this.disabled ? this.columnsArray : [...this.columnsArray, 'action']
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
          // 线上删除
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
