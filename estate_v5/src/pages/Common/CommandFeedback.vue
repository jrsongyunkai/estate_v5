<template>
  <div id="CommandFeedback">
    <Row>
      <Col class="date" v-if="classFlag" :span="24">
        <Col class="left-padding-right ml-5">
          <DatePicker :editable="false" v-model="value1" :clearable="false" type="daterange"></DatePicker>
        </Col>
        <Col :span="4" class="left-padding-right ml-10" v-if="allInstructions">
          <Input v-model="allInstructionsMac" clearable :placeholder="$t('enterDeviceNo')"></Input>
        </Col>
        <Col :span="4" class="left-padding-right ml-5">
          <Button type="primary" @click="searchList">{{ $t('query') }}</Button>
        </Col>
      </Col>
      <Col class="mt-5" :span="24">
        <div>
          <Table :class="classFlag ? 'device-wrap' : ''" :data="tableData" :columns="columns" style="width: 100%">
            <template slot-scope="{ row }" slot="paramDesc">
              <div style="white-space: pre-line">{{ row.paramDesc }}</div>
            </template>
            <template slot-scope="{ row }" slot="stage">
              <span>
                {{ row.stage === 0 ? $t('launch') : row.stage === 1 ? $t('issued') : row.stage === 2 ? $t('deviceReceivedCommand') : row.stage === 3 ? $t('initiateQuery') : row.stage === 4 ? $t('receiveResultResponse') : $t('abnormal') }}
              </span>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button style="color: #409eff" type="text" @click="handleView(row)">{{ $t('view') }}</Button>
            </template>
          </Table>
        </div>
      </Col>
      <Col class="tc mt-5">
        <Col class="tr">
          <Button @click="handleCurrentChange('home')">{{ $t('home') }}</Button>
          <Button @click="handleCurrentChange('prev')" :disabled="lastId < 1">{{ $t('prev') }}</Button>
          <Button @click="handleCurrentChange('next')" :disabled="lastId < 10">{{ $t('next') }}</Button>
        </Col>
      </Col>
      <Modal v-model="commandViewFlag" :title="$t('commandDetailRecord')" custom-class="custom-select-Modal" width="1323px">
        <Table class="device-wrap mt-10" :data="viewData" :columns="viewcolumns" style="width: 100%">
          <template slot-scope="{ row }" slot="responseDesc">
            <span v-if="row.stage === 0">{{ $t('launched') }}</span>
            <span v-else-if="row.stage === 1">{{ $t('issued') }}</span>
            <span v-else-if="row.stage === 2">{{ $t('deviceReceivedCommand') }}</span>
            <span v-else-if="row.stage === 3">{{ $t('initiateQuery') }}</span>
            <span v-else-if="row.stage === 4">{{ $t('receiveResultResponse') }}</span>
            <span v-else-if="row.stage === 9">{{ $t('abnormal') }}</span>
          </template>
          <template slot-scope="{ row }" slot="stage">
            <span v-if="row.stage === 0">{{ $t('normal') }}</span>
            <span v-else-if="row.stage === 1">{{ $t('normal') }}</span>
            <span v-else-if="row.stage === 2">{{ $t('normal') }}</span>
            <span v-else-if="row.stage === 3">{{ $t('normal') }}</span>
            <span v-else style="white-space: pre-line">{{ row.responseDesc }}</span>
          </template>
        </Table>
        <div slot="footer"></div>
      </Modal>
    </Row>
  </div>
</template>

<script>
  import { cmdFeedBack, cmdQueryHistory } from '../../api/common'
  export default {
    components: {},
    props: {
      instructionsData: {
        type: [Object, Array],
        default() {
          return {}
        },
      },
      operateAt: {
        type: Number,
      },
      classFlag: {
        type: Boolean,
      },
      allInstructions: {
        type: Boolean,
      },
      feedbackTime: {
        type: Array,
      },
    },
    data() {
      return {
        tableData: [],
        columns: [
          { title: this.$t('position'), key: 'location', align: 'center' },
          { title: this.$t('equipmentNo'), key: 'mac', align: 'center' },
          { title: this.$t('launchTime'), key: 'createTime', align: 'center' },
          { title: this.$t('commandDescription'), slot: 'paramDesc', align: 'center' },
          { title: this.$t('currentExecutionState'), slot: 'stage', align: 'center' },
          { title: this.$t('detail2'), slot: 'action', width: 150, align: 'center' },
        ],
        viewData: [],
        viewcolumns: [
          { title: this.$t('time'), key: 'stageTime', align: 'center' },
          { title: this.$t('commandPhase'), slot: 'responseDesc', align: 'center' },
          { title: this.$t('resultDescription'), slot: 'stage', align: 'center' },
        ],
        commandViewFlag: false,
        allInstructionsMac: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        lastId: '',
        prevId: [''],
        value1: '',
      }
    },
    created() {},
    mounted() {
      this.value1 = this.feedbackTime ? this.feedbackTime : [this.$func.formatDate('yyyy-MM-dd HH:mm:ss', new Date() - 86400000 * 7), this.$func.getNowFormatDateTime()]
      this.init()
    },
    methods: {
      init() {
        this.queryList()
      },
      searchList() {
        if (this.allInstructions) {
          this.instructionsData.mac = this.allInstructionsMac
        }
        this.lastId = ''
        this.queryList()
      },
      async queryList() {
        let params = {
          lastId: this.lastId,
          pageSize: this.pageSize,
          operateAt: this.operateAt,
          mac: this.instructionsData.mac,
          projectCode: this.instructionsData.projectCode,
          operateParam: this.operateAt === 4 ? this.instructionsData.autoId : this.instructionsData.sceneId,
          startTime: this.value1 ? this.$func.formatDate('yyyy-MM-dd', this.value1[0]) : '',
          endTime: this.value1 ? this.$func.formatDate('yyyy-MM-dd', this.value1[1]) : '',
        }
        const res = await cmdFeedBack(params)
        if (res.success) {
          this.total = res.total
          this.tableData = res.data
          if (res.data.length > 0 && res.data.length === this.pageSize) {
            this.lastId = res.data[res.data.length - 1].id
          } else {
            this.lastId = ''
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.prevId = ['']
        this.lastId = ''
        this.currentPage = 1
        this.queryList()
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
          this.prevId.push(this.tableData[this.tableData.length - 1].id)
        }
        this.queryList()
      },
      async handleView(row) {
        this.commandViewFlag = true
        let params = { feedBackId: row.id }
        const res = await cmdQueryHistory(params)
        if (res.success) {
          this.viewData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleFeedBackList() {
        this.lastId = ''
        this.queryList()
      },
    },
    watch: {
      feedbackTime: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.value1 = newVal
          }
          if (newVal === null) {
            this.value1 = ''
          }
        },
      },
    },
  }
</script>

<style lang="less" scoped>
  .device-wrap {
    border: none;
    color: #606266;
  }
  #CommandFeedback {
    Button {
      margin-left: 10px;
    }
    .ivu-row {
      .date {
        margin-bottom: 10px;
        display: flex;
      }
      .tc {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        margin-top: 20px;
        .tl {
          text-align: center;
          button {
            margin: 0;
          }
        }
      }
    }
  }
</style>
