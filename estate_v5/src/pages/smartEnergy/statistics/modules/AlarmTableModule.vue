<template>
  <div class="chart-box">
    <div class="header">{{ title }}</div>
    <div class="mt-10">
      <Table :columns="alertColumns" :data="alertTableData.list" :max-height="600" border>
        <template #macSlot="{ row }">{{ `${row.mac}(${row.macName})` }}</template>
        <template #progress="{ row }">
          <Progress :text-inside="true" :stroke-width="18" :show-text="false" :class="row.processStatus === 2 ? 'solved' : 'rejected'" :percent="+row.progress > 100 ? 100 : +row.progress"></Progress>
        </template>
        <template #processStatus="{ row }">
          <Button type="text" v-if="row.processStatus === 0" @click.stop="handleUrge(row.id)">{{ $t('urge') }}</Button>
          <span
            v-if="[0, 1, 2].includes(row.processStatus)"
            @click.stop="queryMaintenance(row)"
            class="pointer"
            :class="{
              'b-danger': row.processStatus === 0,
              'b-yelo': row.processStatus === 1,
              'b-success': row.processStatus === 2,
            }">
            {{ row.processStatus === 0 ? $t('notProcessed') : row.processStatus === 1 ? $t('processing') : $t('processed') }}
          </span>
        </template>
      </Table>
      <Page show-total :current="alertTableData.current" :page-size="alertTableData.pageSize" @on-change="changePage" :total="alertTableData.total" show-elevator />
    </div>
  </div>
</template>

<script>
  import { queryEnergyAlarm } from '@/api/smartEnergy/statistics'
  export default {
    props: {
      energyType: { type: Number, default: 1 },
      queryParams: { type: Object, default: () => {} },
      timeValue: { type: Object, default: () => {} },
    },
    data() {
      return {
        alertTableData: { list: [], current: 1, pageSize: 10, total: 0 },
        titleMap: [this.$t('abnormalElectricalEnergyAlarm'), this.$t('abnormalWaterEnergyAlarm'), this.$t('abnormalGasAlarm'), this.$t('abnormalHeatingAlarm')],
      }
    },
    computed: {
      title() {
        return this.titleMap[this.energyType - 1]
      },
      alertColumns() {
        let beforeColumns = [
          { title: this.$t('device'), key: 'mac', align: 'center', slot: 'macSlot', minWidth: 230 },
          { title: this.$t('eventId'), key: 'id', align: 'center', minWidth: 100 },
          { title: this.$t('place'), key: 'position', align: 'center', minWidth: 200 },
        ]
        let afterColumns = [
          { title: this.$t('alarmType'), key: 'info', align: 'center', minWidth: 150 },
          { title: this.$t('alarmTime'), key: 'dateTime', align: 'center', minWidth: 180 },
          { title: this.$t('progress'), key: 'progress', slot: 'progress', align: 'center', minWidth: 200 },
          { title: this.$t('spentTime'), key: 'passTime', align: 'center', minWidth: 150 },
          { title: this.$t('state'), key: 'processStatus', slot: 'processStatus', align: 'center', minWidth: 150 },
        ]
        return this.energyType === 1 ? [...beforeColumns, { title: this.$t('line'), key: 'addrName', align: 'center', minWidth: 150 }, ...afterColumns] : [...beforeColumns, ...afterColumns]
      },
    },
    methods: {
      changePage(e) {
        this.alertTableData.current = e
        this.queryAlarmList()
      },
      handleUrge(id) {
        this.$emit('handleUrge', id)
      },
      async queryAlarmList() {
        let params = {
          ...this.queryParams,
          energyType: this.energyType,
          projectCode: this.$store.state.projectCode,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          page: this.alertTableData.current,
          rows: this.alertTableData.pageSize,
        }
        let res = await queryEnergyAlarm(params)
        if (res.success) {
          this.alertTableData.list = res.datas
          this.alertTableData.total = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .chart-box {
    margin-top: 10px;
    background: #1a202e;
    padding: 15px;
    border-radius: 5px;
    .button-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
