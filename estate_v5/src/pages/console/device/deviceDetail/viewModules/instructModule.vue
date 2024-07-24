<template>
  <div class="instruct-box">
    <div class="mo-item">
      <div class="header">
        <div class="left">
          <div class="bor"></div>
          <div>{{ $t('commandHistory') }}</div>
        </div>
        <div class="right">
          <DatePicker :editable="false" v-model="value1" :clearable="false" type="daterange"></DatePicker>
          <Button type="primary" class="ml-5" @click="searchList">{{ $t('query') }}</Button>
        </div>
      </div>
      <div class="content">
        <Table class="device-wrap" :data="tableData" :columns="columns" style="width: 100%">
          <template slot-scope="{ row }" slot="paramDesc">
            <div style="white-space: pre-line">{{ row.paramDesc }}</div>
          </template>
          <template slot-scope="{ row }" slot="stage">
            <span>
              {{ row.stage === 0 ? $t('launched') : row.stage === 1 ? $t('issued') : row.stage === 2 ? $t('deviceReceivedCommand') : row.stage === 3 ? $t('initiateQuery') : row.stage === 4 ? $t('receiveResultResponse') : $t('abnormal') }}
            </span>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button style="color: #409eff" type="text" @click="handleView(row)">{{ $t('view') }}</Button>
          </template>
        </Table>
        <div class="page-table">
          <Button @click="handleCurrentChange('home')">{{ $t('home') }}</Button>
          <Button class="ml-5" @click="handleCurrentChange('prev')" :disabled="pageIndex === 0">{{ $t('prev') }}</Button>
          <Button class="ml-5" @click="handleCurrentChange('next')" :disabled="!lastIds[pageIndex + 1]">{{ $t('next') }}</Button>
        </div>
      </div>
    </div>
    <Modal v-model="commandViewFlag" :title="$t('commandDetailRecord')" footer-hide custom-class="custom-select-Modal" scrollable width="1323px">
      <div class="mt-10">
        <Table :data="viewData" :columns="viewcolumns" max-height="600">
          <template slot-scope="{ row }" slot="responseDesc">
            <span v-if="row.stage === 0">{{ $t('launched') }}</span>
            <span v-else-if="row.stage === 1">{{ $t('issued') }}</span>
            <span v-else-if="row.stage === 2">{{ $t('deviceReceivedCommand') }}</span>
            <span v-else-if="row.stage === 3">{{ $t('initiateQuery') }}</span>
            <span v-else-if="row.stage === 4">{{ $t('receiveResultResponse') }}</span>
            <span v-else-if="row.stage === 9">{{ $t('abnormal') }}</span>
          </template>
          <template slot-scope="{ row }" slot="stage">
            <span v-if="[0, 1, 2, 3].includes(row.stage)">{{ $t('normal') }}</span>
            <span v-else style="white-space: pre-line">{{ row.responseDesc }}</span>
          </template>
        </Table>
      </div>
    </Modal>
  </div>
</template>

<script>
  import LinesSelectView from './modulesSubView/LinesSelectView.vue'
  import { cmdFeedBack, cmdQueryHistory } from '@/api/common'
  export default {
    components: {
      LinesSelectView,
    },
    inject: ['rowDeviceInfo'],
    data() {
      return {
        deviceInfo: this.rowDeviceInfo,
        tableData: [],
        columns: [
          { title: this.$t('position'), key: 'location', align: 'center' },
          { title: this.$t('equipmentNo'), key: 'mac', align: 'center' },
          { title: this.$t('launchTime'), key: 'createTime', align: 'center' },
          { title: this.$t('instructionDescription'), slot: 'paramDesc', align: 'center' },
          { title: this.$t('currentExecuteStatus'), slot: 'stage', align: 'center' },
          { title: this.$t('detail2'), slot: 'action', width: 150, align: 'center' },
        ],
        value1: [this.$func.formatDate('yyyy-MM-dd HH:mm:ss', new Date() - 86400000 * 7), this.$func.getNowFormatDateTime()],
        pageSize: 10,
        commandViewFlag: false,
        viewData: [],
        viewcolumns: [
          { title: this.$t('time'), key: 'stageTime', align: 'center' },
          { title: this.$t('commandPhase'), slot: 'responseDesc', align: 'center' },
          { title: this.$t('resultDescription'), slot: 'stage', align: 'center' },
        ],
        lastIds: [null],
        pageIndex: 0,
      }
    },
    methods: {
      searchList() {
        this.pageIndex = 0
        this.queryList()
      },
      async queryList() {
        let params = {
          lastId: this.lastIds[this.pageIndex],
          pageSize: this.pageSize,
          operateAt: 1,
          mac: this.deviceInfo.mac,
          projectCode: this.$store.state.projectCode,
          operateParam: this.deviceInfo.sceneId,
          startTime: this.value1 ? this.$func.formatDate('yyyy-MM-dd', this.value1[0]) : '',
          endTime: this.value1 ? this.$func.formatDate('yyyy-MM-dd', this.value1[1]) : '',
        }
        const res = await cmdFeedBack(params)
        if (res.success) {
          this.total = res.total
          this.tableData = res.data
          if (res.data.length > 0 && res.data.length === this.pageSize) {
            this.lastIds[this.pageIndex + 1] = res.data[res.data.length - 1].id
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleCurrentChange(e) {
        if (e === 'home') {
          this.lastIds = [null]
          this.pageIndex = 0
        } else if (e === 'prev') {
          this.pageIndex--
        } else if (e === 'next') {
          this.pageIndex++
        }
        this.queryList()
      },
      async handleView(row) {
        const res = await cmdQueryHistory({ feedBackId: row.id })
        if (res.success) {
          this.commandViewFlag = true
          this.viewData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.searchList()
    },
  }
</script>
<style lang="less" scoped>
  .instruct-box {
    display: flex;
    height: 100%;
    .mo-item {
      width: 100%;
      height: 100%;
      background: #1a202e;
      margin-bottom: 10px;
      padding: 0px 15px;
      .header {
        height: 50px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #5e626c;
        margin-top: 0 !important;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          font-size: 14px;
          width: auto;
        }
        .right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .ml-5 {
            margin-left: 5px;
          }
        }
      }
      .content {
        width: 100%;
        padding: 10px;
        height: calc(~'100% - 50px');
        overflow: auto;
        scrollbar-width: none;
        &::-webkit-scrollbar {
          height: 0px;
          width: 0px;
        }
        .page-table {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 10px;
          margin-top: 10px;
          .ml-5 {
            margin-left: 5px;
          }
        }
      }
    }
  }
</style>
