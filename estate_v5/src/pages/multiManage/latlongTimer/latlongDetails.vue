<template>
  <div class="edit-add-lalong">
    <div class="dis-flx">
      <div class="pointer posi-relation margin-bm20" @click="backLalongList">
        <span class="posiFixd">
          <span class="icon-v5 icon-v5-xiangzuo" />
          {{ $t('back') }}
        </span>
      </div>
    </div>
    <div>
      <div style="position: relative">
        <div style="height: 50px; width: 100%; background: #1a202e; position: absolute; top: -5px"></div>
      </div>
      <Tabs v-model="tabName" style="margin-top: 25px" :animated="false" @on-click="getTabChange">
        <TabPane :label="$t('latLngTimerDetail')" name="tab1">
          <div class="info-style">
            <h3>{{ $t('baseInfo') }}</h3>
            <div>
              <div class="dis-flx mar-10" v-for="(item, index) in baseInfo" :key="index">
                <div class="text-right flex-1">{{ item.label }}：</div>
                <div class="flex-10">{{ item.value }}</div>
              </div>
            </div>
          </div>

          <div class="mart-10">
            <div id="deveiceSelect" class="bgColor">
              <div class="margin-bm">
                <h3>{{ $t('deviceObject') }}</h3>
              </div>

              <Table :columns="macLineColumns" :data="currentPageData" maxHeight="400" border class="table-add-list" :span-method="spanMethod">
                <template #deviceName="{ row }">
                  {{ row.deviceName }}
                </template>
                <template #ports="{ row }">
                  <Tag v-for="(item, index) in row.ports" :key="index" :closable="false" @on-close="deleteTagPort(item, row)">
                    <span>{{ item.name }}</span>
                  </Tag>
                </template>
                <template #lines="{ row }">
                  <Tag v-for="(item, i) in row.configs" :key="i" :closable="false" @on-close="deleteTagLine(item, row)">
                    <span>{{ item.title }}</span>
                  </Tag>
                </template>
                <template #deveceAdrres="{ row }">{{ row.deviceInfo.location }}</template>
                <template #lalongs="{ row }">{{ `${row.deviceInfo.longitude}/${row.deviceInfo.latitude}` }}</template>
              </Table>
              <Col :span="24" class="mt-5">
                <Page @on-change="changCurrentPage" :current="PageNo" :total="totalList" show-elevator show-total></Page>
              </Col>
            </div>
            <div id="excuteConfig" class="bgColor mart-10 h-100">
              <h3>{{ $t('actionConfig') }}</h3>
              <div class="dis-flx">
                <div class="w80">{{ $t('action') }}：</div>
                <div>{{ actionName }}</div>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane :label="$t('commandHistory')" name="tab2">
          <div class="dis-flx search-head">
            <DatePicker type="daterange" v-model="selectTime" transfer :placeholder="$t('pleaseSelectDate')" class="mar-10" style="width: 250px"></DatePicker>
            <Input v-model="searchMac" :placeholder="$t('enterDeviceNo')" class="mar-10" style="width: 250px"></Input>
            <Button class="b-blue mar-10" @click="queryList">{{ $t('query') }}</Button>
            <Button style="margin-left: 10px" class="mar-10" @click="reset">{{ $t('reset') }}</Button>
          </div>
          <Table :columns="historyColumns" :data="historyData" class="mart-10">
            <template #paramDesc="{ row }">
              <div style="white-space: pre-line">{{ row.paramDesc }}</div>
            </template>
            <template #stage="{ row }">
              <span>
                {{ textReturn(row.stage) }}
              </span>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button style="color: #409eff" type="text" @click="handleView(row)">{{ $t('view') }}</Button>
              <Button v-if="row.stage === 9" style="color: #d9001b" type="text" @click="handleRetry(row)">{{ $t('retry') }}</Button>
            </template>
          </Table>
          <Col :span="24" class="mt-5">
            <Col class="tc mt-5">
              <Col class="tr mart-10">
                <Button @click="handleCurrentChange('home')">{{ $t('home') }}</Button>
                <Button @click="handleCurrentChange('prev')" :disabled="currentPage === 1" class="marl-r">{{ $t('prev') }}</Button>
                <Button @click="handleCurrentChange('next')" :disabled="historyData.length < 10">{{ $t('next') }}</Button>
              </Col>
            </Col>
          </Col>
        </TabPane>
      </Tabs>
      <Modal v-model="commandViewFlag" :title="$t('commandDetailRecord')" custom-class="custom-select-Modal" width="1323px">
        <Table class="device-wrap mt-10" :data="viewData" :columns="viewcolumns" style="width: 100%">
          <template slot-scope="{ row }" slot="responseDesc">
            <span>{{ textReturn(row.stage) }}</span>
          </template>
          <template slot-scope="{ row }" slot="stage">
            <span v-if="[0, 1, 2, 3].includes(row.stage)">{{ $t('normal') }}</span>
            <span v-else style="white-space: pre-line">{{ row.responseDesc }}</span>
          </template>
        </Table>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import { getConfigInfo, getDeviceSnapshotList } from '@/api/multiManage/latlongTimer'
  import { sortBy } from 'lodash'
  import { cmdFeedBack, cmdQueryHistory, retryCmdFeedback } from '@/api/common'
  import dayjs from 'dayjs'
  import { weekConfig } from '@/untils/weekMap'
  export default {
    props: {
      rowPropData: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        currentPage: 1,
        prevId: [''],
        lastId: '',
        commandViewFlag: false,
        viewData: [],
        viewcolumns: [
          {
            title: this.$t('time'),
            key: 'stageTime',
            align: 'center',
          },
          {
            title: this.$t('commandPhase'),
            slot: 'responseDesc',
            align: 'center',
          },
          {
            title: this.$t('resultDescription'),
            slot: 'stage',
            align: 'center',
          },
        ],
        historyPageNo: 1,
        historyTotal: 0,
        historyColumns: [
          {
            title: this.$t('position'),
            key: 'location',
            align: 'center',
          },
          {
            title: this.$t('equipmentNo'),
            key: 'mac',
            align: 'center',
          },
          {
            title: this.$t('launchTime'),
            key: 'createTime',
            align: 'center',
          },

          {
            title: this.$t('commandDescription'),
            slot: 'paramDesc',
            align: 'center',
          },
          {
            title: this.$t('currentExecutionState'),
            slot: 'stage',
            align: 'center',
          },
          {
            title: this.$t('detail2'),
            slot: 'action',
            width: 150,
            align: 'center',
          },
        ],
        historyData: [],
        selectTime: [dayjs().subtract(1, 'week').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        searchMac: '',
        actionName: '',
        baseInfo: [],
        tabName: 'tab1',
        currentPageData: [],
        stepArr: [
          { title: this.$t('baseInfo'), step: 'one' },
          { title: this.$t('deviceSelection'), step: 'two' },
          { title: this.$t('actionConfig'), step: 'three' },
        ],
        deviceType: 1,
        latlongAction: '',
        PageNo: 1,
        totalList: 0,
        pageSize: 10,
        weekLists: [
          { value: '1', title: this.$t('monday'), checked: false },
          { value: '2', title: this.$t('tuesday'), checked: false },
          { value: '3', title: this.$t('wednesday'), checked: false },
          { value: '4', title: this.$t('thursday'), checked: false },
          { value: '5', title: this.$t('friday'), checked: false },
          { value: '6', title: this.$t('saturday'), checked: false },
          { value: '7', title: this.$t('sunday'), checked: false },
        ],
        resData: {},
      }
    },
    computed: {
      macLineColumns() {
        let macLineColumns = []
        const type = this.deviceType
        const lines = +type === 5 ? { title: this.$t('line'), key: 'addrName' } : { title: this.$t('line'), slot: 'lines' }
        macLineColumns = [
          {
            title: this.$t('configDevice'),
            key: 'deviceName',
          },

          {
            title: this.$t('equipmentLocation'),
            slot: 'deveceAdrres',
          },
          {
            title: this.$t('latLng'),
            slot: 'lalongs',
          },
        ]
        macLineColumns.splice(1, 0, lines)
        const itemTwo = { title: this.$t('port'), slot: 'ports' }
        if (+type === 5) {
          macLineColumns.splice(2, 0, itemTwo)
        }
        return macLineColumns
      },
    },
    created() {},
    async mounted() {
      if (this.rowPropData.isHistroy) {
        this.tabName = 'tab2'
        await this.queryHistoryList()
      }
      await this.getBaseInfo()
      await this.getDeviceList()
    },
    methods: {
      textReturn(val) {
        const textConfig = {
          0: this.$t('launch'),
          1: this.$t('issued'),
          2: this.$t('deviceReceivedCommand'),
          3: this.$t('initiateQuery'),
          4: this.$t('receiveResultResponse'),
          9: this.$t('abnormal'),
        }
        return textConfig[val]
      },
      handleCurrentChange(e) {
        if (e === 'home') {
          this.prevId = ['']
          this.lastId = ''
          this.currentPage = 1
        } else if (e === 'prev') {
          if (this.currentPage !== 1) {
            this.currentPage -= 1
            this.prevId.pop()
            this.lastId = this.prevId[this.prevId.length - 1]
          } else {
            return false
          }
        } else if (e === 'next') {
          this.currentPage += 1
          this.prevId.push(this.historyData[this.historyData.length - 1].id)
        }
        this.queryHistoryList()
      },
      queryList() {
        this.lastId = ''
        this.queryHistoryList()
      },
      async handleView(row) {
        this.commandViewFlag = true
        let params = {
          feedBackId: row.id,
        }
        const res = await cmdQueryHistory(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.viewData = res.data
      },
      async handleRetry(row) {
        let params = {
          feedBackId: row.id,
        }
        const res = await retryCmdFeedback(params)
        if (!res.success) {
          this.$Message.error({
            content: res.message,
          })
        }
        this.$Message.success({
          content: res.message,
        })
        this.queryHistoryList()
      },
      reset() {
        this.selectTime = [dayjs().subtract(1, 'week').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
        this.searchMac = ''
      },
      async queryHistoryList() {
        let params = {
          lastId: this.lastId,
          pageSize: 10,
          operateAt: 10,
          mac: this.searchMac,
          projectCode: this.$store.state.projectCode,
          operateParam: this.rowPropData.configId || '',
          startTime: dayjs(this.selectTime[0]).format('YYYY-MM-DD'),
          endTime: dayjs(this.selectTime[1]).format('YYYY-MM-DD'),
        }
        const res = await cmdFeedBack(params)
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.historyData = res.data
        if (res.data.length > 0 && res.data.length === 10) {
          this.lastId = res.data[9].id
        } else {
          this.lastId = ''
        }
      },
      async getBaseInfo() {
        const res = await getConfigInfo({ configId: this.rowPropData.configId })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        const info = res.data
        this.resData = res.data
        this.deviceType = info.lineType
        const weekValue =
          info.weekday &&
          info.weekday
            .split('')
            .map(v => weekConfig[v])
            .join('、')
        const timeDelay = info.time ? `${Math.abs(info.time)}${this.$t('sec')}` : ''
        this.actionName = info.actionName
        this.baseInfo = [
          { label: this.$t('latLngTimerName'), value: info.name },
          { label: this.$t('executionMode'), value: info.modelName },
          { label: this.$t('repeat'), value: weekValue },
          { label: this.$t('time'), value: info.typeDesc + timeDelay },
          { label: this.$t('monitorDuration'), value: info.monitorTime ? `${info.monitorTime}${this.$t('sec')}` : '' },
          { label: this.$t('configuringObjectType'), value: info.lineType === 1 ? this.$t('breaker') : '808' },
        ]
      },
      spanMethod({ row, column, rowIndex }) {
        if (column.key === 'deviceName' || column.slot === 'lalongs' || column.slot === 'deveceAdrres') {
          const preRow = this.currentPageData[rowIndex - 1]
          const resIdLength = this.currentPageData.filter(it => it.resId === row.resId).length
          return !preRow || row.resId !== preRow.resId ? [resIdLength, 1] : [0, 0]
        }
      },
      async getDeviceList() {
        const res = await getDeviceSnapshotList({
          configId: this.rowPropData.configId,
          pageNo: this.PageNo,
          pageSize: 10,
          sync: true,
        })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.currentPageData = this.handleTableData(sortBy(res.datas, ['mac']))
        this.totalList = res.total
      },
      handleTableData(data) {
        let list = []
        if (+this.resData.lineType === 1) {
          for (let index = 0; index < data.length; index++) {
            const it = data[index]
            list.push({ ...it, deviceInfo: it, deviceName: it.title })
          }
        } else {
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            list.push(
              ...item.configs.map(it => {
                let ports = []
                if (it.digitalIns) {
                  ports.push(...it.digitalIns.map(v => ({ ...v, type: 'in' })))
                }
                if (it.digitalOuts) {
                  ports.push(...it.digitalOuts.map(v => ({ ...v, type: 'out' })))
                }
                return {
                  ...it,
                  resId: item.resId,
                  mac: item.mac,
                  addrName: it.title,
                  deviceName: item.title,
                  ports,
                  deviceInfo: item,
                }
              })
            )
          }
        }
        return list
      },
      getTabChange(val) {
        if (val === 'tab2') {
          this.queryHistoryList()
        }
      },
      openAddModal() {},
      changCurrentPage(e) {
        this.PageNo = e
        this.getDeviceList()
      },

      backLalongList() {
        this.$emit('lalongShow', '1')
      },
    },
    beforeDestroy() {},
  }
</script>

<style lang="less" scoped>
  .table-add-list {
    /deep/.ivu-table-cell {
      padding-left: 10px;
      padding-top: 10px;
      padding-right: 10px;
      padding-bottom: 10px;
    }
  }
  .search-head {
    background: #1a202e;
    border-radius: 5px;
    padding: 10px;
  }
  .marl-r {
    margin: 0 10px;
  }
  .info-style {
    background: #1a202e;
    border-radius: 5px;
    margin-top: 20px;
    padding: 20px;
  }
  .dis-flx {
    display: flex;
  }
  .text-right {
    text-align: right;
    color: #999;
  }
  .mar-10 {
    margin: 10px;
  }
  .flex-1 {
    flex: 1;
  }
  .flex-10 {
    flex: 8;
  }
  .posi-relation {
    position: relative;
  }
  .posiFixd {
    position: fixed;
  }
  .edit-add-lalong {
    .h-100 {
      height: 100px;
    }
    .w80 {
      width: 100px;
      text-align: right;
      margin: 0 10px 0 30px;
    }
    .w-300 {
      width: 200px;
    }
    .toolStyle {
      display: inline-block;
      margin-left: -5px;
    }
    .suffix-classs {
      font-style: normal;
    }
    .dis-flx {
      display: flex;
    }
    .margin-bm {
      margin-bottom: 10px;
    }
    .margin-bm20 {
      margin-bottom: 20px;
    }
    .mart-10 {
      margin-top: 10px;
    }
    .marl-10 {
      margin-left: 10px;
    }
    .marR-20 {
      margin-right: 20px;
    }
    .h-300 {
      height: 300px;
    }
    .bgColor {
      background: #1a202e;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 10px;
      color: #c7c9cc;
    }
  }
</style>
