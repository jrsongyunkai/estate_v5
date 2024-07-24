<template>
  <div class="threDetails">
    <div class="back" @click="handleBack">
      <Icon custom="icon-v5 icon-v5-xiangzuo" class="go-back" />
      {{ $t('back') }}
    </div>
    <div class="information content">
      <header>
        {{ $t('baseInfo') }}
        <div class="btn">
          <Button type="primary" @click="handleeditPage">{{ $t('edit') }}</Button>
          <Button class="ml-10 b-danger" @click="openPwdsModal">{{ $t('delete') }}</Button>
        </div>
      </header>
      <Form label-position="right" :label-width="100">
        <FormItem :label="`${$t('name')}:`">
          <span>{{ detailsData.name }}</span>
        </FormItem>
        <FormItem :label="`${$t('description')}:`">
          <span>{{ detailsData.remark }}</span>
        </FormItem>
        <FormItem :label="`${$t('mode')}:`">
          <span>{{ detailsData.model === 0 ? $t('allModes') : detailsData.model === 1 ? $t('simpleMode') : $t('timeSlotMode') }}</span>
        </FormItem>
        <FormItem :label="`${$t('state')}:`">
          <Switch :disabled="disabled" v-model="switch1" />
        </FormItem>
      </Form>
    </div>
    <div class="tableContent content">
      <header>{{ $t('equipmentline') }}</header>
      <Table :columns="columns" :data="macLinedata">
        <template slot-scope="{ row }" slot="addrs">
          <Tag v-for="item in row.title" :key="item">{{ item }}</Tag>
        </template>
      </Table>
      <Page show-total :current="currentPage" @on-change="changePage" @on-page-size-change="changesize" :total="total" show-elevator />
    </div>
    <template v-if="model === '1'">
      <div class="content">
        <threList :thresholdTypeList="thresholdTypeList" :title="title" :detailFlag="detailFlag" :lineType="detailsData.lineType" :thresholdTypeListNew="data1" />
      </div>
    </template>
    <template v-if="model === '2' && detailsData.lineType !== 2">
      <div class="content">
        <header>{{ $t('cyclePeriod') }}</header>
        <Form label-position="right" :label-width="100">
          <FormItem :label="$t('calendar') + ':'" v-if="detailsData.loopType !== 1 && detailsData.loopType !== 2">
            <span>{{ detailsData.calendarTypeDesc }}</span>
          </FormItem>
          <FormItem :label="$t('loopMode') + ':'">
            <span>{{ detailsData.cycleDesc }}</span>
          </FormItem>
        </Form>
      </div>
      <div class="content" v-if="model === '2'">
        <header>{{ $t('thresholdPeriod') }}</header>
        <Table :columns="columns1" :data="data1" :span-method="handleSpan">
          <template slot-scope="{ row }" slot="subType">
            <span>{{ row.subType }}</span>
          </template>
          <template slot-scope="{ row }" slot="timer">
            <span v-if="row.startTime !== ''">{{ row.startTime }}-{{ row.endTime }}</span>
            <span v-else>{{ $t('defaultTimePeriod') }}</span>
          </template>
          <template slot-scope="{ row }" slot="warnThreshol">
            <span>{{ row.warnThreshol }}</span>
          </template>
          <template slot-scope="{ row }" slot="warnAction">
            <span v-if="row.canSetTypes === ''" :style="row.warnAction === 1 ? 'color:#0DD667' : row.warnAction === 2 ? 'color:#E03C3A' : ''">{{ row.warnAction === 1 ? $t('opening') : row.warnAction === 2 ? $t('closing') : $t('nothing') }}</span>
            <span v-else>-</span>
          </template>
          <template slot-scope="{ row }" slot="warnStatus">
            <span v-if="row.canSetTypes === ''">{{ row.warnStatus === 1 ? $t('no') : $t('yes') }}</span>
            <span v-else>-</span>
          </template>
          <template slot-scope="{ row }" slot="alarmThreshol">
            <span>{{ row.alarmThreshol }}</span>
          </template>
          <template slot-scope="{ row }" slot="alarmAction">
            <span v-if="row.canSetTypes === ''" :style="row.alarmAction === 1 ? 'color:#0DD667' : row.alarmAction === 2 ? 'color:#E03C3A' : ''">{{ row.alarmAction === 1 ? $t('opening') : row.alarmAction === 2 ? $t('closing') : $t('nothing') }}</span>
            <span v-else>-</span>
          </template>
          <template slot-scope="{ row }" slot="alarmStatus">
            <span v-if="row.canSetTypes === ''">{{ row.alarmStatus === 1 ? $t('no') : $t('yes') }}</span>
            <span v-else>-</span>
          </template>
          <template slot-scope="{ row }" slot="browse">
            <span style="color: #047fff; cursor: pointer" @click="hanldeEdit(row)">{{ $t('preview') }}</span>
          </template>
        </Table>
      </div>
    </template>
    <template v-if="model === '2' && detailsData.lineType === 2">
      <div class="content">
        <header>{{ $t('cyclePeriod') }}</header>
        <Form label-position="right" :label-width="100">
          <FormItem :label="$t('calendar') + ':'" v-if="detailsData.loopType !== 1 && detailsData.loopType !== 2">
            <span>{{ detailsData.calendarTypeDesc }}</span>
          </FormItem>
          <FormItem :label="$t('loopMode') + ':'">
            <span>{{ detailsData.cycleDesc }}</span>
          </FormItem>
        </Form>
      </div>
      <div class="content">
        <Table :columns="threliCoulumsNew" :data="data1" :span-method="handleSpan">
          <template slot-scope="{ row }" slot="subType">
            <span>{{ row.subType }}</span>
          </template>
          <template slot-scope="{ row }" slot="alertThresholdRange">
            <div style="display: flex; align-items: center">
              <span>{{ row.warnThresholList[0] }}</span>
              <span>-</span>
              <span>{{ row.warnThresholList[1] }}</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="time">
            <span v-if="row.startTime !== ''">{{ row.startTime }}-{{ row.endTime }}</span>
            <span v-else>{{ $t('defaultTimePeriod') }}</span>
          </template>
          <template slot-scope="{ row }" slot="alertType">
            <span>{{ row.warnCustomId }}</span>
          </template>
          <template slot-scope="{ row }" slot="alarmThresholdRange">
            <div style="display: flex; align-items: center">
              <span>{{ row.alarmThresholList[0] }}</span>
              <span>-</span>
              <span>{{ row.alarmThresholList[1] }}</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="alarmTpye">
            <span>{{ row.warnCustomId }}</span>
          </template>
          <template slot-scope="{ row }" slot="browse">
            <span style="color: #047fff; cursor: pointer" @click="hanldeEdit(row)">{{ $t('preview') }}</span>
          </template>
        </Table>
      </div>
    </template>
    <Modal v-model="modal" :title="Modaltitle" class="threDeital" :width="600" footer-hide>
      <div style="width: 600px; height: 316px; display: flex">
        <div style="width: 300px; height: 316px; flex: none" v-if="modal">
          <TimeBars :options="timeData" :porea="porea"></TimeBars>
        </div>
        <div style="flex: 1" class="flex-center">
          <div>
            <div class="flex-center" v-for="(item, index) in rowModalData" :key="index">
              <div class="bor" :style="`background:${colors[index % colors.length]}`"></div>
              <div style="display: flex; margin: 10px 0">
                <span style="margin-right: 10px">{{ $t('earlyWarning') }}:{{ detailsData.lineType === 2 ? `${item.warnThresholList[0]}-${item.warnThresholList[1]}` : item.warnThreshol }}</span>
                <span>{{ $t('alarm') }}:{{ detailsData.lineType === 2 ? `${item.alarmThresholList[0]}-${item.alarmThresholList[1]}` : item.alarmThreshol }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  import threList from './threList.vue'
  import TimeBars from './timerPie.vue'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  import { thresholdGetBaseInfo, checkSecondPwd, thresholdDeviceList, thresholdTypeList4Simple, thresholdDel, thresholdEditList, queryAlarmForConfig, thresholdTypeList4Time } from '@/api/public'
  export default {
    props: {
      configId: { type: Number, default: 0 },
      model: { type: String, default: '' },
    },
    components: {
      threList,
      PwsSeconedCheckVue,
      TimeBars,
    },
    data() {
      return {
        bpk: null,
        openSeconedPwd: false,
        newPwdsSeconed: '',
        threliCoulumsNew: [
          { title: this.$t('thresholdType'), slot: 'subType', width: 150 },
          { title: this.$t('timeSpan'), slot: 'time', width: 200 },
          { title: this.$t('alertRange'), slot: 'alertThresholdRange', width: 300 },
          { title: this.$t('warningAction'), slot: 'alertType' },
          { title: this.$t('alarmRange'), slot: 'alarmThresholdRange', width: 300 },
          { title: this.$t('alarmAction'), slot: 'alarmTpye' },
          { title: this.$t('preview'), slot: 'browse' },
        ],
        visible: false,
        modal: false,
        total: 0,
        pageSize: 10,
        currentPage: 1,
        detailsData: '',
        title: this.$t('thresholdParameters'),
        detailFlag: true,
        colors: [
          'rgba(17, 165, 88,.8)',
          'rgba(7, 101, 199,.8)',
          'rgba(171, 53, 55,.8)',
          'rgba(255, 168, 84, 0.8)',
          'rgba(255, 242, 74, 0.8)',
          'rgba(249, 158, 77, 0.8)',
          'rgba(244, 107, 67, 0.8)',
          'rgba(238, 33, 45, 0.8)',
          'rgba(213, 24, 63, 0.8)',
          'rgba(162, 206, 89, 0.8)',
          'rgba(10, 185, 155, 0.8)',
          'rgba(217, 226, 241, 0.8)',
          'rgba(0, 187, 242, 0.8)',
          'rgba(0, 213, 221,.8)',
          'rgba(218, 0, 232,.8)',
          'rgba(234, 84, 32,.8)',
          'rgba(106, 110, 119, 0.8)',
          'rgba(16, 130, 255, 0.8)',
          'rgba(255, 185, 43, 0.8)',
          'rgba(214, 60, 60, 0.8)',
          'rgba(233, 100, 100, 0.8)',
          'rgba(51, 149, 255, 0.8)',
          'rgba(0, 186, 128, 0.8)',
          'rgba(0, 206, 142, 0.8)',
          'rgba(26, 200, 157, 0.8)',
        ],
        columns: [
          { title: this.$t('configDevice'), key: 'name' },
          { title: this.$t('equipmentNo'), key: 'mac' },
          { title: this.$t('line'), slot: 'addrs' },
        ],
        macLinedata: [],
        columns1: [
          { title: this.$t('configurationNo'), slot: 'subType' },
          { title: this.$t('timeSpan'), slot: 'timer' },
          { title: this.$t('warningValue'), slot: 'warnThreshol' },
          { title: this.$t('warningAction'), slot: 'warnAction' },
          { title: this.$t('isItAlarm'), slot: 'warnStatus' },
          { title: this.$t('alarmValue'), slot: 'alarmThreshol' },
          { title: this.$t('alarmAction'), slot: 'alarmAction' },
          { title: this.$t('isItAlarm'), slot: 'alarmStatus' },
          { title: this.$t('preview'), slot: 'browse' },
        ],
        resData: [],
        data1: [],
        disabled: true,
        switch1: false,
        thresholdTypeList: [],
        typlelist: [],
        timeData: [],
        indx: [],
        Modaltitle: '',
        rowModalData: [],
        thresholdTypeListNew: [],
        customName: [],
        porea: {
          pmAM: [
            { position: 'absolute', top: '45%', left: '25%' },
            { position: 'absolute', top: '45%', left: '65%' },
          ],
        },
      }
    },
    mounted() {
      // 这里 this.resData即为后台返回的数据
      this.handleDetails()
      this.handleDetailsdevice()
      this.handleConfigurethreShold()
      this.handleTypeList()
      setTimeout(() => {
        this.handleCustom()
      }, 500)
    },
    methods: {
      handleCustom() {
        let params = { projectCodes: this.$store.state.projectCode }
        queryAlarmForConfig(params).then(res => {
          this.customName = []
          let arr = []
          res.data.customs.map(val => {
            val.alarms.map(v => {
              this.customName.push({ value: v.id, label: v.name })
            })
          })
          this.customName.find(val => {
            arr.push(val.label)
            setTimeout(() => {
              this.data1.map(item => {
                if (val.value === item.warnCustomId) {
                  if (this.detailsData.lineType === 2) {
                    item.warnCustomId = arr[0]
                    item.alarmCustomId = arr[1]
                  } else {
                    item.warnCustomId = val.label
                    item.alarmCustomId = val.label
                  }
                }
              })
            }, 500)
          })
        })
      },
      handleConfigurethreShold() {
        let params = { configId: this.configId }
        thresholdTypeList4Simple(params).then(res => {
          if (res.success) {
            this.thresholdTypeList = res.data
          } else {
            this.$Message.error(this.$t('unknown'))
          }
        })
      },
      handleTypeList() {
        let params = { configId: this.configId }
        thresholdTypeList4Time(params).then(res => {
          this.typlelist = res.data
          this.handlethresholdEditList(this.typlelist)
        })
      },

      handlethresholdEditList(typlelist) {
        let params = {
          configId: this.configId,
          type: this.detailsData.lineType === 2 ? '8' : '',
          subTypeList: this.detailsData.lineType === 2 ? '801,802' : '',
        }
        thresholdEditList(params).then(res => {
          res.data.forEach(item => {
            typlelist.map(items => {
              items.childs.map(vals => {
                if (vals.type === item.subType) {
                  item.subType = vals.typeName
                  item.warnThreshol = item.warnThreshol === undefined ? '-' : item.warnThreshol + ' ' + vals.unit
                  item.alarmThreshol = item.alarmThreshol === undefined ? '-' : item.alarmThreshol + ' ' + vals.unit
                  this.assembleData(res.data)
                }
              })
            })
          })
        })
      },
      handleBack() {
        this.$emit('toback', 'threIndex')
      },
      handleSpan({ row, column, rowIndex, columnIndex }) {
        if (this.detailsData.lineType === 2) {
          if (columnIndex === 6) {
            // 计算合并的行数列数
            let x = row.mergeColumn === 6 ? 6 : row.mergeColumn
            let y = row.mergeColumn === 6 ? 6 : 1
            return [x, y]
          }
        } else {
          if (columnIndex === 8) {
            // 计算合并的行数列数
            let x = row.mergeColumn === 8 ? 8 : row.mergeColumn
            let y = row.mergeColumn === 8 ? 8 : 1
            return [x, y]
          }
        }
      },
      assembleData(data) {
        let names = []
        let datas = []
        // 筛选出不重复的 name值,将其放到 names数组中
        data.forEach(e => {
          if (!names.includes(e.subType)) {
            if (e.subType !== undefined) {
              names.push(e.subType)
            }
          }
        })
        data.forEach(e => {
          datas.push(e.date)
        })
        let nameNums = []
        // 将names数组中的 name值设置默认合并0个单元格,放到 nameNums中
        names.forEach(e => {
          nameNums.push({ subType: e, num: 0 })
        })
        // 计算每种 name值所在行需要合并的单元格数
        data.forEach(e => {
          nameNums.forEach(n => {
            if (e.subType === n.subType) {
              n.num++
            }
          })
        })
        // 将计算后的合并单元格数整合到 data中

        data.forEach(e => {
          nameNums.forEach(n => {
            if (e.subType === n.subType) {
              if (names.includes(e.subType)) {
                e.mergeColumn = n.num
                // 删除已经设置过的值(防止被合并的单元格进到这个 if 语句中)
                names.splice(names.indexOf(n.subType), 1)
              } else {
                // 被合并的单元格设置为 0
                e.mergeColumn = 0
              }
            }
          })
        })
        // 将整理后的数据交给表格渲染
        setTimeout(() => {
          this.data1 = data.sort((a, b) => {
            return a.subType > b.subType ? 1 : -1
          })
        }, 500)
      },

      hanldeEdit(val) {
        this.modal = true
        this.Modaltitle = val.subType + this.$t('thresholdTimeSlotPreview')
        let arr = []
        this.rowModalData = []
        const dates = this.data1
          .filter(v => v.subType === val.subType)
          .map(v => {
            arr.push([v.startTime, v.endTime])
            this.rowModalData.push(v)
          })
        this.canvansShow(arr)
        return dates
      },

      canvansShow(arr) {
        let timedatas = []

        for (let i = 0; i < 1440; i++) {
          timedatas[i] = 0
        }

        let canvasList = []
        for (let i = 0; i < arr.length; i++) {
          canvasList[i] = []
          canvasList[i].push(...this.newMintesFunction(arr[i]))
        }
        timedatas.forEach((item, index) => {
          if (item === 0) {
            timedatas[index] = 1
          }
          canvasList.map((val, ind) => {
            val.map((v, i) => {
              if (index === i) {
                timedatas[v] = ind + 1
              }
            })
          })
        })
        this.timeData = timedatas
        this.timeNull = timedatas.some(val => {
          if (val === 0) {
            return true
          }
        })
      },
      newMintesFunction(arr = [], type) {
        if (arr) {
          let a = +arr[0].substr(0, 2)
          let b = +arr[1].substr(0, 2)
          let c = +arr[0].substr(3, 2)
          let d = +arr[1].substr(3, 2)
          if (a - b === 0 && d - c === 0) {
            return []
          }
          let num = (d - c).toFixed(0)
          let g = b - a
          if (a === 0 && g === 0 && d - c > 0) {
            let f = Number(c)
            let newINdex = [f]
            for (let i = 0; i < num; i++) {
              f += 1
              newINdex.push(f)
            }
            return newINdex
          }
          if (g === 0 && d - c > 0 && a > 0) {
            let f = Number(a * 60) + Number(c)
            let newINdex = [f]
            for (let i = 0; i < num; i++) {
              f += 1
              newINdex.push(f)
            }
            return newINdex
          }
          if (a > 0 && g > 0) {
            let f = Number(a * 60) + Number(c)
            let newINdex = [f]
            let timef = (b - a) * 60 + (d - c)
            for (let i = 0; i < timef; i++) {
              f += 1
              newINdex.push(f)
            }
            return newINdex
          }

          if (a === 0 && g > 0) {
            let f = 0 + Number(c)
            let newINdex = [f]
            let timef = +(b * 60) + (d - c)
            for (let i = 0; i < timef; i++) {
              f += 1
              newINdex.push(f)
            }
            return newINdex
          }
        } else {
          return []
        }
      },
      handleDetails() {
        this.threShow = 'threDetails'
        let params = {
          configId: this.configId,
        }
        thresholdGetBaseInfo(params).then(res => {
          this.detailsData = res.data
          this.switch1 = this.detailsData.status !== 1
        })
      },
      async handleDetailsdevice() {
        let params = {
          configId: this.configId,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        }
        const res = await thresholdDeviceList(params)
        if (res.success) {
          this.total = res.total
          let arr = res.datas
          arr.map(vals => {
            vals.title = vals.title.split(',')
          })
          this.macLinedata = arr
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changePage(e) {
        this.currentPage = e
        this.handleDetailsdevice()
      },
      changesize(e) {
        this.pageSize = e
        this.handleDetailsdevice()
      },
      handleeditPage() {
        this.$emit('threShow', 'threAdd')
        this.$emit('detailsData', this.detailsData)
      },
      okDel() {
        this.visible = true
        let params = { configId: this.detailsData.configId }
        thresholdDel(params).then(res => {
          if (res.success) {
            this.$Message.success(this.$t('deleteSuccessful'))
            this.$emit('toback', 'threIndex')
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handledelDetails() {
        this.$Modal.confirm({
          title: this.$t('deleteConfirmTip'),
          onOk: () => {
            this.okDel()
          },
          onCancel: () => {
            this.$Message.info(this.$t('cancelDelete'))
          },
        })
      },
      openPwdsModal(row) {
        this.newPwdsSeconed = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
        } else {
          this.handledelDetails()
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
          return this.$Message.error({ content: this.$t('pleaseEnterComplateSubPassword') })
        }
        const encry = new JSEncrypt()
        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          checkSecondPwd({ secondPwd: encry.encrypt(this.newPwdsSeconed), encB64: true }).then(res => {
            if (res.success) {
              if (res.code === '0') {
                this.openSeconedPwd = false
                this.okDel()
              }
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        })
      },
    },
    deactivated() {
      this.handleBack()
    },
  }
</script>
<style lang="less">
  .threDetails {
    .back {
      cursor: pointer;
    }
    .information {
      header {
        display: flex;
        justify-content: space-between;
      }
    }
    .ivu-form-item-label {
      color: #999999 !important;
    }
    .tableContent {
    }
    .content {
      background: #1a202e;
      padding: 20px;
      margin-top: 10px;
      header {
        margin-bottom: 20px;
        font-size: 16px;
      }
    }
  }

  .threDeital {
    ::-webkit-scrollbar {
      display: none !important;
    }
    .ivu-modal-body {
      overflow: auto;
    }
    .bor {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .flex-center {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .go-back {
    display: inline-block;
    margin-right: 5px;
  }
</style>
