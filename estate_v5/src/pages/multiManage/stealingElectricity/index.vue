<template>
  <div class="stealingElectricity">
    <template v-if="pageStutas === 'index'">
      <div class="queryContent bgcolor">
        <DatePicker type="daterange" format="yyyy-MM-dd" :placeholder="$t('plsEcraTimer')" style="width: 200px" v-model="date" @on-change="handleSelectDate"></DatePicker>
        <Button type="primary" class="ml-10" @click="handleElecStealingconfiglist('1')">{{ $t('query') }}</Button>
        <Button class="ml-10" @click="reset">{{ $t('reset') }}</Button>
      </div>
      <div class="dataContent bgcolor">
        <div class="header">
          <h4 style="font-size: 16px">{{ $t('electricityTheftMonitoringConfigurationList') }}</h4>
          <div class="buttonList">
            <Button type="primary" @click="queryClickType('addNew', 'add', 0)">
              {{ $t('addConfig') }}
            </Button>
            <Button type="primary" @click="conflictDetection" class="ml-10">
              {{ $t('conflictDetection') }}
            </Button>
          </div>
        </div>
        <Table :columns="sEcolumns" :data="sEdata">
          <template slot-scope="{ row }" slot="cObject">
            <div style="display: flex">
              <Tooltip placement="top" min-width="300" transfer transfer-class-name="stealing">
                <div class="sEaddrBoxs sEspan" :title="row.deviceInfoList[0].name">
                  <span>{{ row.deviceInfoList[0].name }}</span>
                  <span style="margin-left: 10px">{{ `(${row.deviceInfoList[0].mac})` }}</span>
                  <i style="margin: 0 5px">:</i>
                  <span v-for="(item, index) in row.deviceInfoList[0].addrTitleList" :key="index">
                    {{ item.title }}
                  </span>
                </div>
                <div slot="content" style="white-space: normal">
                  <div>
                    <span>{{ row.deviceInfoList[0].name }}</span>
                    <span style="margin-left: 10px">{{ `(${row.deviceInfoList[0].mac})` }}</span>
                    <i style="margin: 0 5px">:</i>
                    <span v-for="(item, index) in row.deviceInfoList[0].addrTitleList" :key="index">
                      {{ item.title }}
                    </span>
                  </div>
                </div>
              </Tooltip>

              <Tooltip placement="top" min-width="300" transfer transfer-class-name="stealingElectricityIndex">
                <div class="sEaddrBoxs ml-10" v-if="row.deviceInfoList.length > 1">{{ `+${row.deviceInfoList.length - 1}` }}</div>
                <div slot="content" style="white-space: normal">
                  <div style="display: flex; flex-wrap: wrap">
                    <div class="sEaddrBoxs" v-for="(item, index) in row.deviceInfoList" :key="index" v-show="item.index !== 0">
                      <span>{{ item.name }}</span>
                      <span style="margin-left: 10px">{{ `(${item.mac})` }}</span>
                      <i style="margin: 0 5px">:</i>
                      <span v-for="(items, index) in item.addrTitleList" :key="index">
                        {{ items.title }}
                      </span>
                    </div>
                  </div>
                </div>
              </Tooltip>
            </div>
          </template>
          <template slot-scope="{ row }" slot="status">
            <Switch v-model="row.status" @on-change="handleElecStealingstatusmodify(row)" />
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button type="text" style="color: #007eff" @click="queryClickType('detail', '', row.confId)">{{ $t('view') }}</Button>
            <Button type="text" style="color: #007eff" @click="queryClickType('addNew', 'edit', row.confId)">{{ $t('edit') }}</Button>
            <Button type="text" style="color: #ff5722" @click="openPwdsModal(row)">{{ $t('delete') }}</Button>
          </template>
        </Table>
        <Page :total="total" @on-change="handleDevicePage" show-total />
      </div>
    </template>
    <template v-if="pageStutas === 'detail'">
      <Details @back="queryClickType" :confId="confId" />
    </template>
    <template v-if="pageStutas === 'addNew'">
      <AddNew @back="queryClickType" :tpyeState="tpyeState" :confId="confId" />
    </template>
    <Modal v-model="conflict" :title="$t('conflictDetection')" width="1230" id="seConflict">
      <div :class="conflictData.length > 0 ? 'headerror' : 'headsucces'">
        <template v-if="conflictData.length > 0">
          <Icon custom="icon-v5 icon-v5-weiwancheng"></Icon>
          <span class="ml-10">{{ $t('theftMonitoringConfigConflict') }}</span>
        </template>
        <template v-else>
          <span class="ml-10" v-if="conflictData.length <= 0">{{ $t('noTheftMonitoringConfigConflict') }}</span>
        </template>
      </div>

      <Table :columns="conflictColumns" :data="conflictData">
        <template slot-scope="{ row }" slot="conflict">
          <div style="display: flex">
            <div style="color: #007eff">{{ row.confName1 }}</div>
            <img src="../../../assets/images/组 25.png" alt="" />
            <div style="color: #007eff">{{ row.confName2 }}</div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="macName">
          <div>{{ row.macName + `(${row.mac})` }}</div>
        </template>
        <template slot-scope="{ row }" slot="timer">
          <div style="display: flex">
            <div class="sEaddrBoxs">
              <span>{{ row.obj[0].name }}</span>
            </div>
            <Tooltip placement="top" max-width="180" transfer transfer-class-name="conflictTime">
              <div class="sEaddrBoxs ml-10" v-if="row.obj.length > 1">{{ `+${row.obj.length - 1}` }}</div>
              <div slot="content" style="white-space: normal">
                <div style="display: flex; flex-wrap: wrap">
                  <div class="sEaddrBoxs" v-for="(item, index) in row.obj" :key="index" v-show="item.index !== 0">
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </div>
            </Tooltip>
          </div>
        </template>
      </Table>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="openSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSeconedPwd" :isfoucs="false" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <Button type="default" @click="openSeconedPwd = false">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  import Details from './detail.vue'
  import AddNew from './addNew.vue'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import { elecStealingconfiglist, checkSecondPwd, elecStealingstatusmodify, elecStealingconfigdel, elecStealingconflictCheck } from '@/api/public'
  export default {
    name: 'multiManage-stealingElectricity',
    components: {
      Details,
      AddNew,
      PwsSeconedCheckVue,
    },
    data() {
      return {
        bpk: null,
        newPwdsSeconed: '',
        rowDatas: {},
        openSeconedPwd: false,
        total: 0,
        pageNo: '1',
        tpyeState: 'edit',
        pageStutas: 'index',
        switchStatus: false,
        date: '',
        sEcolumns: [
          {
            title: this.$t('name'),
            key: 'name',
          },
          {
            title: this.$t('description'),
            key: 'remark',
          },
          {
            title: this.$t('configurationObject'),
            slot: 'cObject',
            width: 500,
            align: 'left',
          },
          {
            title: this.$t('state'),
            slot: 'status',
            width: 100,
          },
          {
            title: this.$t('createdTime'),
            key: 'createTime',
          },
          {
            title: this.$t('operation'),
            slot: 'action',
            width: 300,
          },
        ],
        sEdata: [],
        conflictColumns: [
          {
            title: this.$t('index'),
            key: 'num',
            width: 100,
          },
          {
            title: this.$t('conflictConfig'),
            slot: 'conflict',
            width: 400,
          },
          {
            title: this.$t('deviceName'),
            slot: 'macName',
          },
          {
            title: this.$t('line'),
            key: 'addrTitle',
            width: 100,
          },
          {
            title: this.$t('timeSpan'),
            slot: 'timer',
          },
        ],
        conflictData: [],
        conflict: false,
        confId: '',
      }
    },
    mounted() {
      this.handleElecStealingconfiglist('1')
    },
    methods: {
      openPwdsModal(row) {
        this.newPwdsSeconed = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
          this.rowDatas = row
        } else {
          this.handleElecStealingconfigdels(row)
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
                this.handleElecStealingconfigdel(this.rowDatas)
              }
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        })
      },
      reset() {
        this.date = ''
      },
      handleElecStealingconfigdels(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmDelete'),
          onOk: () => {
            let params = {
              projectCode: this.$store.state.projectCode,
              confId: row.confId,
            }
            elecStealingconfigdel(params).then(res => {
              if (res.success) {
                this.handleElecStealingconfiglist(this.pageNo)
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
      handleElecStealingconfigdel(row) {
        let params = {
          projectCode: this.$store.state.projectCode,
          confId: row.confId,
        }
        elecStealingconfigdel(params).then(res => {
          if (res.success) {
            this.handleElecStealingconfiglist(this.pageNo)
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
        this.handleElecStealingconfiglist(this.pageNo)
      },
      handleElecStealingstatusmodify(row) {
        let params = {
          projectCode: this.$store.state.projectCode,
          confId: row.confId,
          status: row.status ? 1 : 0,
        }
        elecStealingstatusmodify(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: this.$t('changeStateSuccess'),
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      conflictDetection() {
        let params = {
          projectCode: this.$store.state.projectCode,
        }
        elecStealingconflictCheck(params).then(res => {
          if (res.success) {
            this.conflict = true
            res.data.forEach((val, index) => {
              val['num'] = index + 1
              val.status = val.status === 1
              val['obj'] = []
              val.conflictTimeList.forEach((vals, ind) => {
                val['obj'].push({
                  name: vals,
                  index: ind,
                })
              })
            })
            this.conflictData = res.data
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      switchChange(status) {
        this.switchStatus = status
      },
      queryClickType(type, types, confId) {
        this.pageStutas = type
        this.tpyeState = types
        this.confId = confId
      },
      handleSelectDate(date) {
        this.date = date
      },
      handleElecStealingconfiglist(page) {
        let params = {
          projectCode: this.$store.state.projectCode,
          createTimeFrom: this.date[0],
          createTimeTo: this.date[1],
          pageNo: page,
          pageSize: '10',
        }

        elecStealingconfiglist(params).then(res => {
          if (res.success) {
            this.total = res.total
            res.datas.forEach(element => {
              element.status = element.status === 1
              element.deviceInfoList.forEach((val, index) => {
                val['index'] = index
              })
            })
            this.sEdata = res.datas
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      // updateEllipsis(container, label) {
      //     if (container.scrollWidth > container.offsetWidth) {
      //         var text = getText(label);
      //         //此处重要，利用container的实际宽度和显示宽度的比例计算出文字显示的个数，然后，截取出来并在末位加上...
      //         var len = container.offsetWidth / container.scrollWidth * text.length;
      //         setText(label, text.substring(0, Math.floor(len) - 1) + "...");
      //         label.title = text;
      //     } else {
      //         if (label.title != "") {
      //             setText(label, label.title);
      //             label.title = "";
      //         }
      //     }
      // }

      // init() {
      //     var div1 = document.getElementById("div1");
      //     var lab1 = document.getElementById("lab1");
      //     updateEllipsis(div1, lab1);
      // }
    },
  }
</script>
<style lang="less">
  .stealingElectricityIndex {
    .ivu-tooltip-inner {
      background-color: #1a202e;
      border: 1px solid #535b6c;
      box-shadow: 0px 0px 46px 0px #060b17;
      border-radius: 4px;
      min-width: 200px;
      max-width: 300px !important;
      .sEaddrBoxs {
        margin-bottom: 5px;
      }
    }
  }
  .stealing {
    .ivu-tooltip-inner {
      max-width: none;
      max-width: none;
    }
  }

  .conflictTime {
  }
  #seConflict {
    .ivu-modal-footer {
      padding: 0;
      border-color: transparent;
    }
    .headerror {
      display: flex;
      align-items: center;
      font-size: 14px;
      padding: 10px;
      color: #e03c3a;
      background: rgba(224, 60, 58, 0.05);
      border: 1px solid #e03c3a;
      margin-bottom: 20px;
    }
    .headsucces {
      display: flex;
      align-items: center;
      font-size: 14px;
      padding: 10px;
      color: #21f27f;
      background: rgba(33, 242, 127, 0.05);
      border: 1px solid #21f27f;
      margin-bottom: 20px;
    }
  }
  .sEaddrBoxs {
    background: #1a202e;
    border: 1px solid #535b6c;
    border-radius: 4px;
    min-width: 35px;
    padding: 2px 8px;
  }
  .sEspan {
    max-width: 400px;
    overflow: hidden; /*内容会被修剪，并且其余内容是不可见的*/
    text-overflow: ellipsis; /*显示省略符号来代表被修剪的文本。*/
    white-space: nowrap; /*文本不换行*/
  }
  .stealingElectricity {
    .bgcolor {
      background: #1a202e;
      padding: 20px;
    }
    .queryContent {
    }
    .dataContent {
      margin-top: 10px;
      .header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
    }
  }
</style>
