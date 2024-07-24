<template>
  <div class="dark-el-table">
    <el-table v-bind="$attrs">
      <el-table-column prop="info" :label="$t('alarmOZriginalName')"></el-table-column>
      <el-table-column prop="cusInfo" :label="$t('customName')">
        <template #default="{ row }">
          <Input v-model="row.cusInfo" maxlength="20" show-word-limit class="cur-info-input" />
          <Button size="small" type="primary" @click="resetConfigItem(row)">{{ $t('reset') }}</Button>
        </template>
      </el-table-column>
      <el-table-column prop="policeSen" :label="$t('alarmType1')">
        <template #default="{ row }">
          <Select v-model="row.policeSen" :placeholder="$t('pleaseSelectAlarmType1')" transfer>
            <Option v-for="item in REAL_ALARM_TYPE_OPTIONS" :key="item.value" :value="item.value">{{ item.label }}</Option>
          </Select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  const REAL_ALARM_TYPE_OPTIONS = [
    {
      value: '1',
      label: window.$t('realAlarm'),
    },
    {
      value: '2',
      label: window.$t('inspectionAlarm'),
    },
    {
      value: '3',
      label: window.$t('testAlarm'),
    },
    {
      value: '4',
      label: window.$t('communicationAlarm'),
    },
    {
      value: '5',
      label: window.$t('maintenanceAlarm'),
    },
    {
      value: '6',
      label: window.$t('falseAlarm'),
    },
  ]
  export default {
    inheritAttrs: false,
    created() {
      this.REAL_ALARM_TYPE_OPTIONS = REAL_ALARM_TYPE_OPTIONS
    },
    data() {
      return {
        rawAlarmList: [],
        rawWarningList: [],
        alarmList: [],
        warningList: [],
      }
    },
    methods: {
      async resetConfigItem(item) {
        item.cusInfo = item.info
      },
    },
  }
</script>

<style lang="less" scoped>
  .dark-el-table {
    .cur-info-input {
      width: 260px;
      margin-right: 10px;
    }
  }
</style>
