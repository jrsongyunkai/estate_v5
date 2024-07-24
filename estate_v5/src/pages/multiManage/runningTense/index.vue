<template>
  <div class="tense">
    <template v-if="tenseShow === '1'">
      <div class="tab-bgc">
        <Tabs v-model="tabName">
          <TabPane :label="$t('configurationList')" name="name1"></TabPane>
          <TabPane :label="$t('statusOverview')" name="name2"></TabPane>
        </Tabs>
      </div>
      <div v-if="tabName === 'name1'">
        <div class="tense_header">
          <Select v-model="executionMode" class="query-select" :placeholder="$t('pleaseSelectExecuteMode')" :clearable="true">
            <Option v-for="item in executionModeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="deviceType" class="query-select" :placeholder="$t('selectedExecuteObjectType')" :clearable="true">
            <Option v-for="item in deviceTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <DatePicker v-model="executionTime" @on-change="handleTimeVal" type="daterange" placement="bottom-end" :placeholder="$t('seclectCreateDate')" class="query-select"></DatePicker>
          <div class="buttonList">
            <Button type="primary" style="margin-right: 10px" @click="handleTenselist('1')">{{ $t('query') }}</Button>
            <Button @click="handleReset">{{ $t('reset') }}</Button>
          </div>
        </div>
        <div class="tense_list">
          <div class="tense_listHeader">
            <h4>{{ $t('ruleList') }}</h4>
            <div>
              <Button type="primary" @click="handleHistory">{{ $t('alarmHistory') }}</Button>
              <Button type="primary" class="margin-l" @click="handlePageShow('3', 'add')">{{ $t('addNewRule') }}</Button>
            </div>
          </div>
          <Table :columns="tenseColumns" :data="tenseData">
            <template slot-scope="{ row }" slot="status">
              <Switch v-model="row.status" @on-change="handleModifyStatus(row)" />
            </template>
            <template slot-scope="{ row }" slot="action">
              <div class="tableBtn">
                <span type="text" class="btnColor" @click="handlePageShow('2', '', row)">{{ $t('view') }}</span>
                <span type="text" class="btnColor" @click="handlePageShow('3', 'edit', row)">{{ $t('edit') }}</span>
                <span type="text" class="btnColor" @click="handlePageShow('5', '', row)">{{ $t('blockTimePeriod') }}</span>
                <span type="text" class="btnColor" @click="handlePageShow('2', '2', row)">{{ $t('alarmHistory') }}</span>

                <span type="text" class="delColor" @click="openPwdsModal(row)">{{ $t('delete') }}</span>
              </div>
            </template>
          </Table>
          <Page :total="total" @on-change="handleDevicePage" show-total />
        </div>
      </div>
      <div v-if="tabName === 'name2'">
        <StatusOverview :isOpen="isOpen" @changeIsOpen="changeIsOpen"></StatusOverview>
      </div>
    </template>
    <template v-if="tenseShow === '2'">
      <Detail @tenseShow="handletenseShow" :type="type" :rowItem="rowItem" />
    </template>
    <template v-if="tenseShow === '3'">
      <AddPage @tenseShow="handletenseShow" :rowItem="rowItem" :type="type" />
    </template>
    <template v-if="tenseShow === '4'">
      <historyPage @tenseShow="handletenseShow"></historyPage>
    </template>
    <template v-if="tenseShow === '5'">
      <ShieldTime :rowItem="rowItem" @tenseShow="handletenseShow"></ShieldTime>
    </template>
    <Modal v-model="openSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSeconedPwd" :isfoucs="false" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <div>
          <Button type="default" @click="openSeconedPwd = false">{{ $t('cancel') }}</Button>
          <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
        </div>
      </div>
    </Modal>
    <Modal :title="$t('tip')" v-model="promptModal" width="420px" :mask="false" :close-on-click-modal="false">
      <Row>
        <Col class="pd-20">
          <div class="el-message-box__status el-icon-warning"></div>
        </Col>
        <Col class="ml-30">
          <div class="el-message-box__message">
            {{ textMessageBox }}
          </div>
        </Col>
      </Row>
      <div slot="footer" class="disbtween-button">
        <Col>
          <Checkbox v-model="deletePlat">{{ $t('forceDeletePlatformRecord') }}</Checkbox>
        </Col>
        <Col>
          <Button @click="promptModal = false">{{ $t('cancel') }}</Button>
          <Button class="b-blue" @click="handleOk">{{ $t('save') }}</Button>
        </Col>
      </div>
    </Modal>
  </div>
</template>
<script>
  import Detail from './detail.vue'
  import { generateBoxAbnormalId, statisticStatus } from '@api/multiManage/runningTense'
  import AddPage from './addPage.vue'
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  import { tenselist, tenseModifyStatus, tenseListdel, checkSecondPwd } from '@/api/public'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import historyPage from './historyPage.vue'
  import { tenseColumns } from './getDay'
  import StatusOverview from './statusOverview.vue'
  import ShieldTime from './ShieldTime.vue'

  export default {
    name: 'multiManage-runningTense',
    components: {
      Detail,
      PwsSeconedCheckVue,
      AddPage,
      historyPage,
      StatusOverview,
      ShieldTime,
    },
    data() {
      return {
        isOpen: null,
        tabName: 'name1',
        deviceType: '',
        deviceTypeList: [
          { value: 1, label: this.$t('breaker') },
          { value: 2, label: 'TC-808' },
          { value: 3, label: this.$t('gateway') },
        ],
        deletePlat: false,
        textMessageBox: this.$t('deleteRuntimeState'),
        promptModal: false,
        bpk: null,
        newPwdsSeconed: '',
        openSeconedPwd: false,
        rowDatas: {},
        type: '1',
        tenseShow: '1',
        switch1: false,
        executionTime: [],
        executionModeList: [
          {
            value: '1',
            label: this.$t('executeAtEdge'),
          },
          {
            value: '2',
            label: this.$t('executeInCloud'),
          },
        ],
        executionMode: 0,
        executionType: '',
        tenseColumns,
        tenseData: [],
        total: 0,
        pageNo: '1',
        rowItem: {},
      }
    },
    mounted() {
      this.handleTenselist('1')
      // console.log(this.$route.params.executeConfigId, 'executeConfigId');
      if (this.$route.params.executeConfigId) {
        let obj = { configId: this.$route.params.executeConfigId }
        this.handlePageShow('2', '', obj)
      }
      this.getStatus()
    },
    methods: {
      changeIsOpen(val) {
        this.isOpen = val
      },
      async getStatus() {
        const res = await statisticStatus({ projectCode: this.$store.state.projectCode })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.isOpen = res.data
      },
      handleHistory() {
        this.tenseShow = '4'
      },
      handleOk() {
        this.newPwdsSeconed = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
        } else {
          this.handleDel(this.rowDatas)
          this.promptModal = false
        }
      },
      openPwdsModal(row) {
        this.rowDatas = row
        if (row.model === 1) {
          this.promptModal = true
        } else {
          this.newPwdsSeconed = ''
          let data = this.$store.state.setSecondPwds
          if (data) {
            this.openSeconedPwd = true
          } else {
            this.handleDels(row)
          }
        }
      },
      closePwdModal() {
        this.openSeconedPwd = false
      },
      getnewPwdsVal(val) {
        this.newPwdsSeconed = val
      },
      checkSecondePwds() {
        if (this.newPwdsSeconed.length < 6) {
          this.newPwdsSeconed = ''
          return this.$Message.error({
            content: this.$t('pleaseEnterComplateSubPassword'),
          })
        }
        const encry = new JSEncrypt()
        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          checkSecondPwd({ secondPwd: encry.encrypt(this.newPwdsSeconed), encB64: true }).then(res => {
            if (res.success) {
              if (res.code === '0') {
                // this.$Message.success({
                //     content: '校验成功'
                // })
                this.openSeconedPwd = false
                if (this.promptModal) {
                  this.promptModal = false
                }
                this.handleDel(this.rowDatas)
              }
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        })
      },
      closePwds() {
        this.openSeconedPwd = false
        this.$Message.info({
          content: this.$t('cancelDelete'),
        })
      },
      handleDels(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: '<p>' + this.$t('sureDelete') + '</p>',
          onOk: () => {
            let params = {
              configId: row.configId,
            }
            tenseListdel(params).then(res => {
              if (res.success) {
                this.handleTenselist(this.pageNo)
                this.$Message.success({
                  content: this.$t('deleteSuccessful'),
                })
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
          },
        })
      },
      handleDel(row) {
        let params = {
          configId: row.configId,
          forceDel: this.deletePlat,
        }
        tenseListdel(params).then(res => {
          if (res.success) {
            this.handleTenselist(this.pageNo)
            this.$Message.success({
              content: this.$t('deleteSuccessful'),
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleDevicePage(val) {
        this.pageNo = val
        this.handleTenselist(this.pageNo)
      },
      handleModifyStatus(row) {
        let params = {
          configId: row.configId,
          status: row.status ? 1 : 0,
        }
        tenseModifyStatus(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: this.$t('successfullyStatus'),
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleTenselist(page) {
        let params = {
          projectCode: this.$store.state.projectCode,
          model: this.executionMode,
          startTime: this.executionTime[0],
          endTime: this.executionTime[1],
          type: this.deviceType,
          pageNo: page,
          pageSize: '10',
        }
        tenselist(params).then(res => {
          if (res.success) {
            this.total = res.total
            this.tenseData = res.datas
            this.tenseData.forEach(val => {
              val.status = val.status !== 0
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleTimeVal(val) {
        this.executionTime = val
      },
      async handlePageShow(val, type, row) {
        if (type === '2' && row.model === 1) {
          return this.$Message.warning(this.$t('notSupportViewAlarmHistory'))
        }

        if (type === 'add') {
          const res = await generateBoxAbnormalId()
          if (!res.success) {
            return this.$Message.error({
              content: res.message,
            })
          }
          this.rowItem = {
            configId: res.data.configId,
            isAdd: true,
          }
        } else {
          this.rowItem = { ...row, isAdd: false }
        }
        this.tenseShow = val
        this.type = type
      },
      handletenseShow(val) {
        this.tenseShow = val
        this.handleTenselist('1')
      },
      handleReset() {
        this.executionMode = 0
        this.executionTime = []
        this.deviceType = ''
        this.handleTenselist('1')
      },
    },
  }
</script>
<style lang="less">
  .tab-bgc {
    background: #1a202e;
    padding: 10px 10px 0 10px;
  }
  .disbtween-button {
    display: flex;
    justify-content: space-between;
  }
  .margin-l {
    margin-left: 10px;
  }
  .query-select {
    width: 200px;
    margin-right: 10px;
  }
  .pd-20 {
    padding-top: 20px;
    margin-left: 10px;
  }
  .ml-30 {
    margin-left: 30px;
  }
  .tense {
    // padding: 10px;
    .tense_header {
      margin-top: 10px;
      display: flex;
      padding: 10px;
      background: #1a202e;
    }
    .tense_list {
      background: #1a202e;
      margin: 10px 0;
      padding: 10px;
      .tense_listHeader {
        padding: 10px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        font-size: 16px;
        align-items: center;
        display: flex;
        justify-content: space-between;
      }
    }
    .tableBtn {
      span {
        cursor: pointer;
        margin: 0 5px;
      }
      .btnColor {
        color: #0692d2;
      }
      .delColor {
        color: #bc051e;
      }
    }
  }
</style>
