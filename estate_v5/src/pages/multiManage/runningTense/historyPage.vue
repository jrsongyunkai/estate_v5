<template>
  <div class="historyPage">
    <span class="back pointer" @click="back">
      <span class="icon-v5 icon-v5-xiangzuo"></span>
      {{ $t('back') }}
    </span>
    <div class="dis-flex bg-head">
      <Input v-model="macInput" :placeholder="$t('pleaseEnterDeviceNameOrId')" class="w200"></Input>
      <DatePicker type="daterange" v-model="selectTime" transfer :placeholder="$t('pleaseSelectDate')" class="w200 mar-0-10"></DatePicker>
      <Button type="primary" class="mar-0-10" @click="queryList">{{ $t('query') }}</Button>
      <Button @click="reset">{{ $t('reset') }}</Button>
      <Button class="outputs" @click="exportTable">
        <Icon custom="icon-v5 icon-v5-daochu2" size="18" />
      </Button>
    </div>
    <div class="bg-head">
      <h3>{{ $t('alarmList') }}</h3>
      <Table :columns="alarmListColumns" :data="alarmListData">
        <template #addrs="{ row }">
          <div>{{ [0, '0'].includes(row.addr) ? '-' : row.title + getLineId(row.mac, row.addr) }}</div>
        </template>
        <template #digital="{ row }">
          <div>{{ row.digital || '-' }}</div>
        </template>
        <template #actionType="{ row }">
          <div>{{ ['', '0', 0].includes(row.actionType) ? $t('nothing') : row.actionType }}</div>
        </template>
        <template #judgeLogic="{ row }">
          {{ row.judgeLogic || '-' }}
        </template>
        <template #triggerRule="{ row }">
          {{ row.triggerRule || '-' }}
        </template>
      </Table>
      <Page @on-change="changPage" :current="PageNo" :total="alarmListTotal" show-elevator show-total></Page>
    </div>
  </div>
</template>

<script>
  import { historyClomns } from './getDay'
  import { tenseDeviceAlarmList } from '@/api/public'
  import { getLineId } from '../linkageScene/pro/constants'
  import dayjs from 'dayjs'
  import qs from 'qs'
  export default {
    data() {
      return {
        macInput: '',
        alarmListTotal: 0,
        selectTime: [dayjs().subtract(1, 'week').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        PageNo: 1,
        alarmListData: [],
      }
    },
    computed: {
      alarmListColumns() {
        let alarmColumns = historyClomns()
        alarmColumns.splice(
          2,
          0,
          { title: this.$t('line'), slot: 'addrs' },
          {
            title: this.$t('port'),
            slot: 'digital',
          }
        )
        return alarmColumns
      },
    },
    mounted() {
      this.queryList()
    },
    methods: {
      getLineId,
      changPage(e) {
        this.PageNo = e
        this.queryList()
      },
      exportTable() {
        const queryString = qs.stringify({
          projectCode: this.$store.state.projectCode,
          pageNo: this.PageNo,
          pageSize: 10,
          configId: '',
          mac: this.macInput,
          startTime: this.selectTime[0] ? dayjs(this.selectTime[0]).format('YYYY-MM-DD') : '',
          endTime: this.selectTime[1] ? dayjs(this.selectTime[1]).format('YYYY-MM-DD') : '',
        })
        this.$func.windowCountDown(`/boxAbnormal/alarm/list/export.as?${queryString}`)
      },
      async queryList() {
        const params = {
          projectCode: this.$store.state.projectCode,
          pageNo: this.PageNo,
          pageSize: 10,
          configId: '',
          mac: this.macInput,
          startTime: this.selectTime[0] ? dayjs(this.selectTime[0]).format('YYYY-MM-DD') : '',
          endTime: this.selectTime[1] ? dayjs(this.selectTime[1]).format('YYYY-MM-DD') : '',
        }
        const res = await tenseDeviceAlarmList(params)
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.alarmListData = res.datas
        this.alarmListTotal = res.total
      },
      reset() {
        this.macInput = ''
        this.selectTime = [dayjs().subtract(1, 'week').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
      },
      back() {
        this.$emit('tenseShow', '1')
      },
    },
  }
</script>

<style lang="less">
  .historyPage {
    .outputs {
      border: 1px solid #007eff;
      padding: 3px;
      color: #007eff;
      margin-left: 10px;
      width: 36px;
      height: 32px;
      background-color: rgba(0, 126, 255, 0.1);
      border-radius: 5px;
    }

    .w200 {
      width: 200px;
    }
    .mar-0-10 {
      margin: 0 10px;
    }
    .bg-head {
      background: #1a202e;
      padding: 10px;
      margin: 10px 0;
    }
    .dis-flex {
      display: flex;
    }
  }
</style>
