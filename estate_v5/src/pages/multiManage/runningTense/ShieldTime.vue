<template>
  <div>
    <div class="shieldPage">
      <span class="back pointer" @click="back">
        <span class="icon-v5 icon-v5-xiangzuo"></span>
      </span>
      <span>{{ $t('blockTimePeriod') }}</span>
    </div>
    <div class="mt-10 shieldPage">
      <div class="title-between mtb-10">
        <div>{{ $t('blockTimePerioList') }}</div>
        <Button type="primary" ghost @click="openAddTime">{{ $t('addBlockingTimePeriod') }}</Button>
      </div>
      <Table :columns="shieldColumns" :data="shieldData">
        <template #time="{ row }">
          <div>
            {{ `${row.invalidDate} ${row.startTime}${$t('to')}${row.invalidDate} ${row.endTime}` }}
          </div>
        </template>
        <template #status="{ row }">
          <span :class="getStatusClass(row.status)">{{ row.statusDesc }}</span>
        </template>
        <template #action="{ row }">
          <div v-if="row.status === 0">
            <Button type="text" class="blueC" @click="openEditModal(row)">{{ $t('edit') }}</Button>
            <Button type="text" class="redC" @click="openDelModal(row)">{{ $t('delete') }}</Button>
          </div>
        </template>
      </Table>
      <Page show-total :current="pageNo" @on-change="changePage" :page-size="pageSize" :total="shieldTotal" show-elevator />
    </div>
    <Modal :title="addEditTitle" v-model="shieldTimeModal" :mask-closable="false" :mask="false">
      <div>
        <div style="margin: 10px 0">
          {{ $t('blockDate') }}：
          <DatePicker type="date" :placeholder="$t('pleaseSelectDate')" v-model="shieldDate" :options="disableOption" style="width: 200px"></DatePicker>
        </div>
        <div>
          {{ $t('blockTimePeriod') }}：
          <TimePicker type="time" :placeholder="$t('pleaseSelectTime')" v-model="startTime" :disabled-hours="disabledStartHours" format="HH:mm" style="width: 168px"></TimePicker>
          {{ $t('to') }}
          <TimePicker type="time" :placeholder="$t('pleaseSelectTime')" v-model="endTime" format="HH:mm" :disabled-hours="disabledHours" :disabled-minutes="disabledMinutes" style="width: 168px"></TimePicker>
        </div>
      </div>
      <div slot="footer">
        <div>
          <Button type="default" @click="shieldTimeModal = false">{{ $t('cancel') }}</Button>
          <Button type="primary" style="margin-left: 10px" @click="saveShieldTime">{{ $t('confirm') }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { invalidTimeList, saveInvalidTime, delInvalidTime } from '@api/multiManage/runningTense'
  import dayjs from 'dayjs'
  export default {
    props: {
      rowItem: Object,
    },
    data() {
      return {
        startTime: '',
        endTime: '',
        shieldDate: dayjs().format('YYYY-MM-DD'),
        disableOption: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 24 * 60 * 60 * 1000
          },
        },
        shieldTimeModal: false,
        shieldData: [],
        shieldColumns: [
          { title: this.$t('timePeriodRange'), slot: 'time' },
          { title: this.$t('maskingStatus'), slot: 'status' },
          { title: this.$t('configPeople'), key: 'staffName' },
          { title: this.$t('configTime'), key: 'createTime' },
          { title: this.$t('operation'), slot: 'action' },
        ],
        pageSize: 10,
        pageNo: 1,
        shieldTotal: 0,
        isEditTitle: false,
        rowData: {},
      }
    },
    mounted() {
      this.getList()
    },
    computed: {
      addEditTitle() {
        return `${this.isEditTitle ? this.$t('edit') : this.$t('add1')}${this.$t('blockTimePeriod')}`
      },
      disabledStartHours() {
        if (dayjs(this.shieldDate).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) {
          const getHour = dayjs().hour()
          let arr = []
          for (let i = 0; i < +getHour; i++) {
            arr.push(i)
          }
          return arr
        } else {
          return []
        }
      },
      disabledHours() {
        const startArr = this.startTime.split(':')
        let arr = []
        for (let i = 0; i < +startArr[0]; i++) {
          arr.push(i)
        }
        return arr
      },
      disabledMinutes() {
        const startArr = this.startTime.split(':')
        const endArr = this.endTime.split(':')
        if (startArr[0] === endArr[0]) {
          const minutes = +startArr[1]
          let arr = []
          for (let i = 0; i < minutes; i++) {
            arr.push(i)
          }
          return arr
        } else {
          return []
        }
      },
    },
    methods: {
      async getList() {
        let params = {
          projectCode: this.$store.state.projectCode,
          configId: this.rowItem.configId,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        }
        const res = await invalidTimeList(params)
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.shieldData = res.datas
        this.shieldTotal = res.total
      },
      getStatusClass(val) {
        const config = {
          0: 'waitClass',
          1: 'executeIngClass',
          2: 'alrightClass',
        }
        return config[val]
      },
      openAddTime() {
        this.isEditTitle = false
        this.openModal()
        this.startTime = ''
        this.endTime = ''
      },
      openModal() {
        this.shieldTimeModal = true
      },
      openEditModal(row) {
        this.isEditTitle = true
        this.openModal()
        this.rowData = row
        this.startTime = row.startTime
        this.endTime = row.endTime
        this.shieldDate = row.invalidDate
      },
      async saveShieldTime() {
        if (!this.shieldDate || !this.startTime || !this.endTime) {
          return this.$Message.error(this.$t('pleaseCompleteBlockingPeriod'))
        }
        let params = {
          id: this.isEditTitle ? this.rowData.id : 0,
          projectCode: this.$store.state.projectCode,
          configId: this.rowItem.configId,
          invalidDate: dayjs(this.shieldDate).format('YYYY-MM-DD'),
          startTime: this.startTime,
          endTime: this.endTime,
        }
        const res = await saveInvalidTime(params)
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.shieldTimeModal = false
        this.getList()
      },
      openDelModal(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: '<p>' + this.$t('confirmDelete') + '</p>',
          onOk: async () => {
            let params = {
              id: row.id,
              projectCode: this.$store.state.projectCode,
              configId: this.rowItem.configId,
            }
            const res = await delInvalidTime(params)
            if (!res.success) {
              return this.$Message.error({
                content: res.message,
              })
            }
            this.getList()
            this.$Message.success({
              content: this.$t('deleteSuccessful'),
            })
          },
        })
      },
      changePage(e) {
        this.pageNo = e
        this.getList()
      },
      back() {
        this.$emit('tenseShow', '1')
      },
    },
  }
</script>

<style lang="less" scoped>
  .mtb-10 {
    margin: 10px 0;
  }
  .title-between {
    display: flex;
    justify-content: space-between;
  }
  .mt-10 {
    margin-top: 10px;
  }
  .alrightClass {
    background: rgba(0, 126, 255, 0.1);
    color: #007eff;
    padding: 2px 3px;
  }
  .executeIngClass {
    background: #443630;
    color: #e6a23c;
    padding: 2px 3px;
  }
  .waitClass {
    background: #154d58;
    color: #00ffff;
    padding: 2px 3px;
  }
  .shieldPage {
    background: #1a202e;
    padding: 10px;
  }
  .blueC {
    color: #007eff;
  }
  .redC {
    color: #e03c3a;
  }
</style>
