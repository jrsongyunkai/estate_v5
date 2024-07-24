<template>
  <div class="sources-content">
    <div class="header">
      <div class="left">{{ $t('energyConsumptionObjectConfiguration') }}</div>
      <div class="right">
        <Input v-width="200" v-model="keyword" :placeholder="$t('topologyPlaceholder2')" />
        <Select class="ml-10" v-model="equipmentTypes" v-width="200" transfer>
          <Option v-for="item in typeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="primary" class="ml-10" @click.stop="search">{{ $t('query') }}</Button>
        <Button type="primary" class="ml-10" ghost @click.stop="reset">{{ $t('reset') }}</Button>
      </div>
    </div>
    <div class="table-box" style="margin-top: 10px">
      <el-table :data="tableData.list">
        <el-table-column prop="deviceInfo" :label="$t('deviceMessage')">
          <template #default="{ row }">{{ row.name }}({{ row.mac }})</template>
        </el-table-column>
        <el-table-column prop="deviceLocation" :width="200" :label="$t('equipmentLocation')">
          <template #default="{ row }">{{ row.build + row.unit + row.room }}</template>
        </el-table-column>
        <el-table-column prop="deviceTypeName" :width="150" :label="$t('deviceType')">
          <template #default="{ row }">{{ getEquipmentTypeName(row.equipmentType) }}</template>
        </el-table-column>
        <el-table-column v-for="(item, index) in checkedColumn" :width="150" :key="index" headerAlign="center" :prop="item.prop" align="center">
          <template #header>
            <Checkbox :value="isAllChecked(item.prop)" :indeterminate="isSomeChecked(item.prop)" @on-change="changePageAllChecked(item.prop, $event)">{{ item.label }}</Checkbox>
          </template>
          <template #default="{ row }">
            <Checkbox v-model="row[item.prop]" true-value="1" false-value="0" @on-change="changeChecked(row, item.prop, $event)">{{ item.label }}</Checkbox>
          </template>
        </el-table-column>
      </el-table>
      <Page @on-change="handleCurrentChange" :current="tableData.current" @on-page-size-change="changePageSize" :page-size-opts="[10, 20, 50, 100, 200]" :page-size="tableData.pageSize" :total="tableData.total" show-sizer></Page>
    </div>
  </div>
</template>

<script>
  import { queryBoxes, batchSetEnergyCfg } from '@/api/public'
  import deviceClassification from '@/mixins/deviceClassification'
  import { energyTypeMap } from '@/untils/configuration'
  export default {
    mixins: [deviceClassification],
    data() {
      return {
        keyword: '',
        equipmentTypes: '',
        checkedColumn: energyTypeMap,
        tableData: { list: [], current: 1, total: 0, pageSize: 10 },
        filterLabels: [this.$t('intelligentAirSwitch'), this.$t('intelligentWaterMeter'), this.$t('smartMeter')],
      }
    },
    computed: {
      typeOptions() {
        let list = this.deviceClass.filter(it => this.filterLabels.includes(it.name))
        let allTypes = list.map(it => it.types).flat()
        return [{ label: this.$t('allType'), value: allTypes.toString() }, ...list.map(it => ({ label: it.name, value: it.types.toString() }))]
      },
      allTypes() {
        let list = this.deviceClass.filter(it => this.filterLabels.includes(it.name))
        return list.map(it => it.types).flat()
      },
    },
    methods: {
      handleCurrentChange(e) {
        this.tableData.current = e
        this.queryInit()
      },
      changePageSize(e) {
        this.tableData.current = 1
        this.tableData.pageSize = e
        this.queryInit()
      },
      getEquipmentTypeName(equipmentType) {
        return this.deviceClass.find(it => it.types.includes(equipmentType)).name
      },
      isAllChecked(key) {
        return this.tableData.list.every(item => item[key] === '1')
      },
      isSomeChecked(key) {
        return !this.isAllChecked(key) && this.tableData.list.some(item => item[key] === '1')
      },
      changeChecked(row, key, value) {
        let energyCfgList = [{ mac: row.mac, cfgData: { [key]: value } }]
        this.batchSetEnergyCfg(energyCfgList)
      },
      changePageAllChecked(key, e) {
        let value = e ? '1' : '0'
        let energyCfgList = this.tableData.list.filter(it => it[key] !== value).map(it => ({ mac: it.mac, cfgData: { [key]: value } }))
        if (energyCfgList.length > 0) this.batchSetEnergyCfg(energyCfgList)
      },
      async batchSetEnergyCfg(energyCfgList) {
        let params = { projectCode: this.$store.state.projectCode, energyCfgList }
        const res = await batchSetEnergyCfg(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('setSuccessfully') })
          this.queryInit()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      search() {
        this.tableData.current = 1
        this.queryInit()
      },
      reset() {
        this.keyword = ''
        this.equipmentTypes = this.allTypes.toString()
      },
      async queryInit() {
        let params = { pageNo: this.tableData.current, pageSize: this.tableData.pageSize, projectCode: this.$store.state.projectCode, build: '', unit: '', key: this.keyword, equipmentTypes: this.equipmentTypes }
        const res = await queryBoxes(params)
        if (res.success) {
          this.tableData.list = res.datas.map(it => {
            const { energyCfg } = it.others
            return { ...it, elec: energyCfg && energyCfg.elec, water: energyCfg && energyCfg.water, gas: energyCfg && energyCfg.gas, heating: energyCfg && energyCfg.heating }
          })
          this.tableData.total = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.equipmentTypes = this.allTypes.toString()
      this.queryInit()
    },
  }
</script>

<style lang="less" scoped>
  .sources-content {
    background: #1a202e;
    padding: 15px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      .right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
    .table-box {
      width: 100%;
    }
  }
</style>
