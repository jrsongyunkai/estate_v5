<template>
  <div class="correction">
    <template v-if="pageType === 'index'">
      <div class="back" @click="back">
        <span class="icon-v5 icon-v5-xiangzuo"></span>
        {{ $t('back') }}
      </div>
      <Tabs :value="isCurTabs">
        <TabPane :label="$t('devicePower')" name="name1">
          <div class="content">
            <Row style="margin-bottom: 10px">
              <Input :placeholder="$t('enterDeviceNo')" style="width: 200px" v-model="mac"></Input>
              <Button class="b-blue ml-10" @click="handelSearch">{{ $t('query') }}</Button>
              <Button class="b-info ml-10" @click="reset">{{ $t('reset') }}</Button>
            </Row>
            <Table :columns="correctionColumns" :data="data5" :span-method="handleSpan" height="500">
              <template #info="{ row }">{{ row.info || row.boxName + '(' + row.mac + ')' }}</template>
              <template #addrInfo="{ row }">{{ `${row.addrName}(${row.mac}-${String(row.addr).padStart(2, '0')})` }}</template>
              <template slot-scope="{ row }" slot="correct">
                <template v-if="row.edit">
                  <Select v-model="row.model" style="width: 50px">
                    <Option v-for="item in modelType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <InputNumber :max="1000" :min="minNumber(row.model)" v-model="row.numFactor" style="width: 150px" class="ml-10" :formatter="value => Math.floor(value * 1000) / 1000" :parser="value => value"></InputNumber>
                </template>
                <template v-else>
                  <span v-if="row.model">{{ row.model === '1' ? $t('plus') : $t('multiply') }}{{ row.factor }}</span>
                </template>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <template v-if="row.edit">
                  <Button type="text" class="c-primary" @click="handleSaveTableinfo(row, index)">{{ $t('save') }}</Button>
                  <Button type="text" class="c-danger" @click="handleAdjust(row, '1')">{{ $t('cancel') }}</Button>
                </template>
                <template v-else>
                  <Button type="text" class="c-primary" @click="handleAdjust(row)">{{ $t('adjustFactor') }}</Button>
                  <Button type="text" class="c-primary ml-10" @click="handleButtonType('his', row, '1')">{{ $t('historyElectricityRecalculation') }}</Button>
                  <Button type="text" class="c-primary ml-10" @click="handleButtonLog(row, 1)">{{ $t('fixedLog') }}</Button>
                </template>
              </template>
            </Table>
            <div style="margin-top: 10px; display: flex; justify-content: right">
              <span style="margin: 15px 10px 0 0">{{ $t('currentPageTotal', { total: totalTable }) }}</span>
              <Page class="page" :total="totalPage" :page-size="10" @on-change="changePage" :current="1" show-elevator />
            </div>
          </div>
        </TabPane>
        <TabPane :label="$t('groupPower')" name="name2">
          <div class="content">
            <Row style="margin-bottom: 10px">
              <Select v-model="ground" style="width: 200px" :placeholder="$t('switchGroupType')" @on-change="chageTableData">
                <Option v-for="item in groundType" :value="item.id" :key="item.id">{{ item.type }}</Option>
              </Select>
            </Row>
            <Table :columns="groupColumns" :data="groupData" row-key="nodeId">
              <template slot-scope="{ row }" slot="correct">
                <template v-if="row.edit">
                  <Select v-model="row.model" style="width: 50px">
                    <Option v-for="item in modelType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <InputNumber :max="1000" :min="minNumber(row.model)" v-model="row.numFactor" style="width: 150px" class="ml-10" :formatter="value => Math.floor(value * 1000) / 1000" :parser="value => value"></InputNumber>
                </template>
                <template v-else>
                  <span>{{ row.calType === '1' ? $t('plus') : $t('multiply') }}{{ row.factor }}</span>
                </template>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <template v-if="row.edit">
                  <Button type="text" class="c-primary" @click="handleSaveGroupTable(row, index)">{{ $t('save') }}</Button>
                  <Button type="text" class="c-danger" @click="handleAdjust(row, '2')">{{ $t('cancel') }}</Button>
                </template>
                <template v-else>
                  <Button type="text" class="c-primary" @click="handleAdjust(row)">{{ $t('adjustFactor') }}</Button>
                  <Button type="text" class="c-primary ml-10" @click="handleButtonType('his', row, '2')">{{ $t('historyElectricityRecalculation') }}</Button>
                  <Button type="text" class="c-primary ml-10" @click="handleButtonLog(row, 2)">{{ $t('fixedLog') }}</Button>
                </template>
              </template>
            </Table>
          </div>
        </TabPane>
        <TabPane :label="$t('projectPower')" name="name3">
          <div class="content">
            <Table :columns="projectColumns" :data="projectData">
              <template slot-scope="{ row }" slot="correctes">
                <template v-if="row.edit">
                  <Select v-model="row.model" style="width: 50px" transfer>
                    <Option v-for="item in modelType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <InputNumber :max="1000" :min="minNumber(row.model)" v-model="row.numFactor" :formatter="value => Math.floor(value * 1000) / 1000" :parser="value => value" style="width: 150px" class="ml-10"></InputNumber>
                </template>
                <template v-else>
                  <span>{{ row.calType === 1 ? $t('plus') : $t('multiply') }}{{ row.factor }}</span>
                </template>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <template v-if="row.edit">
                  <Button type="text" class="c-primary" @click="handleSaveProjectTable(row, index)">{{ $t('save') }}</Button>
                  <Button type="text" class="c-danger" @click="handleAdjust(row, '3')">{{ $t('cancel') }}</Button>
                </template>
                <template v-else>
                  <Button type="text" class="c-primary" @click="handleAdjust(row)">{{ $t('adjustFactor') }}</Button>
                  <Button type="text" class="c-primary ml-10" @click="handleButtonType('his', row, '3')">{{ $t('historyElectricityRecalculation') }}</Button>
                  <Button type="text" class="c-primary ml-10" @click="handleButtonLog(row, 3)">{{ $t('fixedLog') }}</Button>
                </template>
              </template>
            </Table>
          </div>
        </TabPane>
      </Tabs>
    </template>
    <template v-if="pageType === 'histore'">
      <div class="back" @click="backIndex">
        <span class="icon-v5 icon-v5-xiangzuo"></span>
        {{ $t('back') }}
      </div>
      <div class="content">
        <Form :label-width="100" label-position="left">
          <FormItem :label="$t('correctionObject')">
            <span v-if="timeType === '1'">{{ historeRow.boxName + '(' + historeRow.mac + ')' }}/{{ historeRow.addrName + '(' + historeRow.mac + '-' + historeRow.addr + ')' }}</span>
            <span v-if="timeType === '2'">{{ historeRow.nodeName }}</span>
            <span v-if="timeType === '3'">{{ historeRow.projectName }}</span>
          </FormItem>
          <FormItem :label="$t('correctionPowerType')">
            <Select v-model="histore.correction" style="width: 200px" :placeholder="$t('switchGroupType')" @on-change="getTypeChange">
              <Option v-for="item in correctionType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('correctionTimePeriod')">
            <DatePicker v-if="histore.correction === '2'" :options="options3" type="date" :placeholder="$t('pleaseSelectTimePeriod')" style="width: 200px" v-model="histore.timer" @on-change="getTimeChange"></DatePicker>
            <DatePicker v-if="histore.correction === '1'" type="datetime" format="yyyy-MM-dd HH" :options="options5" :placeholder="$t('pleaseSelectTimePeriod')" :editable="false" style="width: 200px" v-model="histore.timer" @on-change="getTimeChange"></DatePicker>
            <DatePicker v-if="histore.correction === '3'" type="month" :options="options4" :placeholder="$t('pleaseSelectTimePeriod')" style="width: 200px" v-model="histore.timer" @on-change="getTimeChange"></DatePicker>
          </FormItem>
          <FormItem :label="$t('electricityOriginalValue')">
            <span>{{ histore.numElectr + 'kW·h' }}</span>
          </FormItem>
          <FormItem>
            <Select v-model="histore.model" style="width: 100px" :disabled="isDisabled">
              <Option v-for="item in modelType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <InputNumber :disabled="isDisabled" :max="999999" :min="minNumber(histore.model)" :step="1" style="width: 150px" v-model="histore.modelNum" class="ml-10" :formatter="value => Math.floor(value * 1000) / 1000" :parser="value => value"></InputNumber>
          </FormItem>
          <FormItem :abel="$t('electricityCorrectionValue')">
            <span style="font-size: 25px">{{ caculaterValueCpt + 'kW·h' }}</span>
          </FormItem>
          <FormItem :label="$t('electricityDecompositionRecalculation')" v-if="timeType === '1'">
            <Tooltip placement="top" max-width="470">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('electricityStatsTips1') }}</div>
            </Tooltip>
            :
            <Switch v-model="histore.switch" class="ml-10" />
          </FormItem>
        </Form>
        <Row>
          <Button class="b-blue" @click="handleHissave" :disabled="isDisabled">{{ $t('save') }}</Button>
          <Button class="b-info ml-10" @click="backIndex">{{ $t('cancel') }}</Button>
        </Row>
      </div>
    </template>
    <template v-if="pageType === 'log'">
      <div class="back" @click="pageType = 'index'">
        <span class="icon-v5 icon-v5-xiangzuo"></span>
        {{ $t('back') }}
      </div>
      <Tabs :value="logListName">
        <TabPane :label="$t('electricityCorrectionFactorLog')" name="name1">
          <div class="content">
            <Table :columns="correctLogColumns" :data="correctLogData">
              <template slot-scope="{ row }" slot="operateTimes">
                {{ row.operateTime }}
              </template>
              <template slot-scope="{ row }" slot="corrects">
                <span>{{ row.operateParams && (row.operateParams.calType === '1' ? $t('plus') : row.operateParams.calType === '2' ? $t('multiply') : '') }}{{ row.operateParams && row.operateParams.factor }}</span>
              </template>
            </Table>
            <Page show-total :current="currntePage" @on-change="changeactionPage" :total="corrtctTotal" show-elevator />
          </div>
        </TabPane>
        <TabPane :label="$t('historyElectricityRecalculationLog')" name="name2">
          <div class="content">
            <Table :columns="hisLogColumns" :data="hisLogData">
              <template slot-scope="{ row }" slot="corectsTime">
                {{ row.operateParams.statsType === '1' ? row.operateParams.time : row.operateParams.statsType === '2' ? row.operateParams.time.substr(0, 10) : row.operateParams.statsType === '3' ? row.operateParams.time.substr(0, 7) : '' }}
              </template>
              <template slot-scope="{ row }" slot="correctType">{{ row.operateParams && (row.operateParams.statsType === '1' ? $t('hour2') : row.operateParams.statsType === '2' ? $t('day') : row.operateParams.statsType === '3' ? $t('month') : '') }}</template>
              <template slot-scope="{ row }" slot="correct">{{ row.operateParams && row.operateParams.correctFactor }}</template>
              <template slot-scope="{ row }" slot="rerun">{{ row.operateParams && (row.operateParams.decompose === 'false' ? $t('close') : row.operateParams.decompose === 'true' ? $t('open') : '') }}</template>
            </Table>
            <Page show-total :current="pageNum" @on-change="changeaPages" :total="hisTotal" show-elevator />
          </div>
        </TabPane>
      </Tabs>
    </template>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex'
  import { getCorrectFactor4Chn, getGroupType, powerOperateLog, getCorrectFactor4Prj, configCorrectFactor, getCorrectFactor4Grp, findPower4ReCalc, reCalcPower } from '@/api/public'
  import dayjs from 'dayjs'
  export default {
    data() {
      return {
        pageNum: 1,
        hisTotal: 0,
        elecDeviceProjectRow: '',
        elecDeviceProjectType: '',
        currntePage: 1,
        corrtctTotal: 0,
        isDisabled: false,
        options3: {
          disabledDate(date) {
            return date && (date.valueOf() > Date.now() - 24 * 60 * 60 * 1000 || date.valueOf() < Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
          },
        },
        options4: {
          disabledDate(date) {
            let dates = new Date()
            return date && (date.valueOf() > Date.now() + (new Date(dates.getFullYear(), dates.getMonth() + 1, 0).getDate() - dates.getDate()) * 24 * 60 * 60 * 1000 || date.valueOf() < Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
          },
        },
        options5: {
          disabledDate(date) {
            return date && (date.valueOf() > Date.now() - 1 * 60 * 60 * 1000 || date.valueOf() < Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
          },
        },
        timeType: '',
        totalTable: '',
        totalPage: 0,
        pageNo: 1,
        logListName: '',
        mac: '',
        isCurTabs: '',
        isCurElecConfig: 2,
        histore: {
          switch: false,
          model: '2',
          modelNum: 1,
          correction: '',
          timer: '',
          numElectr: 0,
        },
        correctionType: [],
        ground: '',
        groundType: [],
        groupData: [],
        groupColumns: [
          { title: this.$t('groupInfo'), key: 'nodeName', tree: true },
          { title: this.$t('currentFactor'), slot: 'correct' },
          { title: this.$t('operation'), slot: 'action' },
        ],
        projectColumns: [
          { title: this.$t('projectInfo'), key: 'projectName' },
          { title: this.$t('currentFactor'), slot: 'correctes' },
          { title: this.$t('operation'), slot: 'action' },
        ],
        projectData: [],
        modelType: [
          { value: '1', label: this.$t('plus') },
          { value: '2', label: this.$t('multiply') },
        ],
        hisLogColumns: [
          { title: this.$t('operatingTime'), key: 'operateTime' },
          { title: this.$t('operator'), key: 'staffName' },
          { title: this.$t('correctionPowerType'), slot: 'correctType' },
          { title: this.$t('correctionTime'), slot: 'corectsTime' },
          { title: this.$t('correctionFactor'), slot: 'correct' },
          { title: this.$t('electricityDecompositionRecalculation'), slot: 'rerun' },
        ],
        hisLogData: [],
        correctLogColumns: [
          { title: this.$t('correctionTime'), slot: 'operateTimes' },
          { title: this.$t('corrector'), key: 'staffName' },
          { title: this.$t('correctionFactor'), slot: 'corrects' },
        ],
        correctLogData: [],
        correctionColumns: [
          { title: this.$t('deviceMessage'), slot: 'info' },
          { title: this.$t('lineInfo'), slot: 'addrInfo' },
          { title: this.$t('electricityCorrectionFactor'), slot: 'correct' },
          { title: this.$t('operation'), slot: 'action', width: 400, align: 'center' },
        ],
        correctionData: [],
        data5: [],
        pageType: 'index',
        circuits: [],
        historeRow: {},
      }
    },
    computed: {
      // ...mapGetters('billing', [
      //     'getCorrectLogData'
      // ]),
      caculaterValueCpt() {
        if (this.isDisabled) {
          return '-'
        } else {
          if (this.histore.model === '1') {
            if (this.histore.numElectr + this.histore.modelNum < 0) {
              return 0
            } else {
              return (this.histore.numElectr + this.histore.modelNum).toFixed(3)
            }
          } else if (this.histore.model === '2') {
            return (this.histore.numElectr * this.histore.modelNum).toFixed(3)
          }
        }
      },
      minNumber() {
        return function (val) {
          let minNumber = 0
          if (val === '1') {
            minNumber = -99999999
            return minNumber
          } else if (val === '2') {
            return 0
          }
        }
      },
    },
    created() {
      this.getTabsShow()
    },
    mounted() {},
    methods: {
      ...mapMutations('billing', ['saveCorrectLog']),
      getChanege(val) {
        val = val.toFixed(3)
      },
      changeaPages(e) {
        this.pageNum = e
        let params
        if (this.elecDeviceProjectType === 1) {
          // elecDeviceProjectRow
          params = {
            projectCode: this.$store.state.projectCode,
            targetValue: `${this.elecDeviceProjectRow.resId}:${this.elecDeviceProjectRow.addr}`,
          }
        } else if (this.elecDeviceProjectType === 2) {
          // 分组电量
          params = {
            projectCode: this.$store.state.projectCode,
            targetValue: this.elecDeviceProjectRow.nodeId,
          }
        } else if (this.elecDeviceProjectType === 3) {
          // 项目电量
          params = {
            projectCode: this.$store.state.projectCode,
            targetValue: this.$store.state.projectCode,
          }
        }
        params.pageNo = this.pageNum
        params.pageSize = 20
        this.getPowerLogList({ ...params, actionType: 24 }, 24)
      },
      changeactionPage(e) {
        this.currntePage = e
        let params
        if (this.elecDeviceProjectType === 1) {
          // elecDeviceProjectRow
          params = {
            projectCode: this.$store.state.projectCode,
            targetValue: `${this.elecDeviceProjectRow.resId}:${this.elecDeviceProjectRow.addr}`,
          }
        } else if (this.elecDeviceProjectType === 2) {
          // 分组电量
          params = {
            projectCode: this.$store.state.projectCode,
            targetValue: this.elecDeviceProjectRow.nodeId,
          }
        } else if (this.elecDeviceProjectType === 3) {
          // 项目电量
          params = {
            projectCode: this.$store.state.projectCode,
            targetValue: this.$store.state.projectCode,
          }
        }
        params.pageNo = this.currntePage
        params.pageSize = 20
        this.getPowerLogList({ ...params, actionType: 23 }, 23)
      },
      changePage(page) {
        this.pageNo = page
        this.getDeviceFactorList()
      },
      getTypeChange(val) {
        if (`${val}` === '1') {
          this.histore.timer = dayjs(new Date().getTime() - 60 * 60 * 1000).format('YYYY-MM-DD HH')
        }
        this.getTypePowerReCalc(this.historeRow, this.timeType, this.histore.correction)
      },
      getTimeChange() {
        this.getTypePowerReCalc(this.historeRow, this.timeType, this.histore.correction)
      },
      handelSearch() {
        this.getDeviceFactorList()
      },
      reset() {
        this.mac = ''
      },
      backIndex() {
        this.pageType = 'index'
        this.isCurTabs = `name${this.timeType}`
      },
      handleHissave() {
        if (!this.histore.model) {
          return this.$Message.error({
            content: this.$t('electricityStatsTips2'),
          })
        }
        this.$Modal.confirm({
          render: h => {
            return h('div', {}, [
              [
                h('Icon', {
                  props: {
                    custom: 'icon-v5 icon-v5-weiwancheng',
                  },
                  style: {
                    fontSize: '20px',
                    color: 'red',
                    marginRight: '10px',
                  },
                }),
                h(
                  'span',
                  {
                    style: {
                      fontSize: '16px',
                    },
                  },
                  this.$t('electricityStatsTips3')
                ),
              ],
            ])
          },
          onOk: () => {
            this.saveReCalculaterPower()
          },
          onCancel: () => {},
        })
      },
      chageTableData(val) {
        this.getGroupFactorList()
      },
      saveReCalculaterPower() {
        let statsType = this.histore.correction
        let parmars = {
          projectCode: this.$store.state.projectCode,
          billingTarget: this.timeType === '1' ? 2 : this.timeType === '2' ? 3 : this.timeType === '3' ? 1 : '',
          targetValue: this.timeType === '1' ? `${this.historeRow.resId}:${this.historeRow.addr}` : this.timeType === '2' ? `${this.historeRow.nodeId}` : this.timeType === '3' ? this.$store.state.projectCode : '',
          statsType,
          time: dayjs(this.histore.timer).format('YYYY-MM-DD HH'),
          decompose: this.histore.switch,
          originalPower: this.histore.numElectr,
          correctPower: this.caculaterValueCpt,
          correctFactor: `${this.histore.model === '1' ? this.$t('plus') : this.histore.model === '2' ? this.$t('multiply') : ''}${this.histore.modelNum}`,
        }
        reCalcPower(parmars).then(res => {
          if (res.success) {
            this.$Modal.remove()
            this.$Message.success({
              content: this.$t('recalculationSuccess'),
            })
            this.backIndex()
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleButtonType(pageType, row, type) {
        this.timeType = type
        this.historeRow = row
        if (pageType === 'his') {
          this.pageType = 'histore'
        }
        if (type === '1') {
          this.correctionType = [
            { value: '1', label: this.$t('hour2') },
            { value: '2', label: this.$t('day1') },
            { value: '3', label: this.$t('month') },
          ]
        } else {
          this.correctionType = [{ value: '2', label: this.$t('day1') }]
        }
        this.histore.correction = '2'
        this.histore.model = '2'
        this.histore.modelNum = 0
        this.histore.timer = dayjs(new Date().getTime() - 86400 * 1000).format('YYYY-MM-DD')
        this.getTypePowerReCalc(row, type, this.histore.correction)
      },
      getTypePowerReCalc(row, type, statsType) {
        let params = {
          projectCode: this.$store.state.projectCode,
          billingTarget: type === '1' ? 2 : type === '2' ? 3 : type === '3' ? 1 : '',
          targetValue: type === '1' ? `${row.resId}:${row.addr}` : type === '2' ? `${row.nodeId}` : type === '3' ? this.$store.state.projectCode : '',
          statsType,
          time: dayjs(this.histore.timer).format('YYYY-MM-DD HH'),
        }
        findPower4ReCalc(params).then(res => {
          if (res.success) {
            this.isDisabled = false
            this.histore.model = `${res.data.calcType}`
            this.histore.modelNum = res.data.factor
            this.histore.numElectr = res.data.originalPower
          } else {
            this.histore.numElectr = '-'
            this.isDisabled = true
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleButtonLog(row, type) {
        this.pageType = 'log'
        this.logListName = 'name1'
        this.elecDeviceProjectType = type
        this.elecDeviceProjectRow = row
        let params
        if (type === 1) {
          // 设备电量
          params = {
            projectCode: this.$store.state.projectCode,
            targetValue: `${row.resId}:${row.addr}`,
          }
        } else if (type === 2) {
          // 分组电量
          params = {
            projectCode: this.$store.state.projectCode,
            targetValue: row.nodeId,
          }
        } else if (type === 3) {
          // 项目电量
          params = {
            projectCode: this.$store.state.projectCode,
            targetValue: this.$store.state.projectCode,
          }
        }
        params.pageNo = 1
        params.pageSize = 20

        this.getPowerLogList({ ...params, actionType: 23 }, 23)
        this.getPowerLogList({ ...params, actionType: 24 }, 24)
      },

      getPowerLogList(params, type) {
        powerOperateLog(params).then(res => {
          if (res.success) {
            if (type === 24) {
              this.hisLogData = res.datas.map(v => ({
                ...v,
                operateParams: JSON.parse(v.operateParams) || {},
                time: JSON.parse(v.operateParams).time || '',
                statsType: JSON.parse(v.operateParams).statsType || '',
              }))
              this.hisTotal = res.total
            } else if (type === 23) {
              this.correctLogData = res.datas.map(v => ({
                ...v,
                operateParams: JSON.parse(v.operateParams) || {},
              }))
              this.corrtctTotal = res.total
            }
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleSaveTableinfo(row, index) {
        if (!row.model || !row.numFactor) {
          return this.$Message.error({
            content: this.$t('electricityStatsTips4'),
          })
        }
        let params = {
          projectCode: this.$store.state.projectCode,
          billingTarget: 2,
          calType: row.model,
          resId: row.resId,
          addr: row.addr,
          factor: row.numFactor,
        }
        configCorrectFactor(params).then(res => {
          if (res.success) {
            row.edit = false
            this.$Message.success({
              content: this.$t('adjustSuccess'),
            })
            this.getDeviceFactorList()
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleSaveGroupTable(row, index) {
        if (!row.model || !row.numFactor) {
          return this.$Message.error({
            content: this.$t('pleaseInputCorrectionFactor'),
          })
        }
        let params = {
          projectCode: this.$store.state.projectCode,
          billingTarget: 3,
          calType: row.model,
          nodeId: row.nodeId,
          factor: row.numFactor,
        }
        configCorrectFactor(params).then(res => {
          if (res.success) {
            row.edit = false
            this.$Message.success({
              content: this.$t('adjustSuccess'),
            })
            this.getGroupFactorList()
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleSaveProjectTable(row, index) {
        if (!row.model || !row.numFactor) {
          return this.$Message.error({
            content: this.$t('pleaseInputCorrectionFactor'),
          })
        }
        let params = {
          projectCode: this.$store.state.projectCode,
          billingTarget: 1,
          calType: row.model,
          factor: row.numFactor,
        }

        configCorrectFactor(params).then(res => {
          if (res.success) {
            row.edit = false
            this.$Message.success({
              content: this.$t('adjustSuccess'),
            })
            this.getProjectFactorList()
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleAdjust(row, type) {
        row.edit = !row.edit
        if (type) {
          if (type === '1') {
            this.getDeviceFactorList()
          } else if (type === '2') {
            this.getGroupFactorList()
          } else if (type === '3') {
            this.getProjectFactorList()
          }
        }
      },
      handleSpan({ row, column, rowIndex, columnIndex }) {
        // 合并第二列,这里columnIndex==1 根据具体业务要在前端写死
        if (columnIndex === 0) {
          // 计算合并的行数列数
          let x = row.mergeCol === 0 ? 0 : row.mergeCol
          let y = row.mergeCol === 0 ? 0 : 1
          return [x, y]
        }
      },
      getTabsShow() {
        this.isCurTabs = 'name1'
        this.getProjectFactorList()
        this.getDeviceFactorList()
        this.getGroupTypes()
      },
      getGroupTypes() {
        let params = {
          projectCode: this.$store.state.projectCode,
        }
        getGroupType(params)
          .then(res => {
            if (res.success) {
              this.groundType = res && res.data
              this.ground = this.groundType && this.groundType.length && this.groundType[0].id
              if (this.ground) {
                this.getGroupFactorList()
              }
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      getTree(tree = []) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj = {
              ...item,
              // _showChildren: false,
              model: `${item.calType}`,
              edit: false,
              numFactor: +item.factor,
            }
            // 其他你想要添加的属性
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },
      getGroupFactorList() {
        getCorrectFactor4Grp({
          projectCode: this.$store.state.projectCode,
          groupId: this.ground,
        }).then(res => {
          if (res.success) {
            //  this.groupData = res.data.map(v => ({ ...v, model: `${v.calType}`, edit: false, numFactor: +v.factor }))
            let newArr = res.data.map(item => ({
              ...item,
              _showChildren: true,
              model: `${item.calType}`,
              edit: false,
              numFactor: +item.factor,
              children: item.children ? item.children : [],
            }))
            this.groupData = this.getTree(newArr)
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      getProjectFactorList() {
        getCorrectFactor4Prj({ projectCode: this.$store.state.projectCode }).then(res => {
          if (res.success) {
            this.projectData = [res.data].map(v => ({
              ...v,
              model: `${v.calType}`,
              edit: '',
              numFactor: +v.factor,
            }))
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      getDeviceFactorList() {
        let params = {
          projectCode: this.$store.state.projectCode,
          mac: this.mac,
          pageNo: this.pageNo,
          pageSize: 10,
        }
        getCorrectFactor4Chn(params).then(res => {
          if (res.success) {
            let processData = res.datas
              .filter(j => j.addrFactorList.length)
              .map(v => ({
                ...v,
                addrList: (v.addrFactorList.length && v.addrFactorList.map(val => ({ ...val, model: `${val.calType}`, numFactor: +val.factor, boxName: v.boxName, mac: v.mac, resId: v.resId, info: `${v.boxName}(${v.mac})`, edit: false }))) || [],
              }))
              .map(j => j.addrList)
              .flat(1)
            let isLen = res.datas.filter(v => !v.addrFactorList.length).length === res.datas.length

            if (isLen) {
              this.data5 = []
              this.totalPage = 0
              this.totalTable = 0
            } else {
              this.totalPage = res.total
              this.totalTable = res.datas.filter(v => v.addrFactorList.length).length
              this.assembleData(processData)
            }
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      assembleData(data) {
        let names = []
        // 筛选出不重复的 name值,将其放到 names数组中
        data.forEach(e => {
          if (!names.includes(e.info)) {
            names.push(e.info)
          }
        })
        let nameNums = []
        // 将names数组中的 name值设置默认合并0个单元格,放到 nameNums中
        names.forEach(e => {
          nameNums.push({ info: e, num: 0 })
        })
        // 计算每种 name值所在行需要合并的单元格数
        data.forEach(e => {
          nameNums.forEach(n => {
            if (e.info === n.info) {
              n.num++
            }
          })
        })

        // 将计算后的合并单元格数整合到 data中
        data.forEach(e => {
          nameNums.forEach(n => {
            if (e.info === n.info) {
              if (names.includes(e.info)) {
                e.mergeCol = +n.num
                // 删除已经设置过的值(防止被合并的单元格进到这个 if 语句中)
                names.splice(names.indexOf(n.info), 1)
              } else {
                // 被合并的单元格设置为 0
                e.mergeCol = 0
              }
            }
          })
        })
        // 将整理后的数据交给表格渲染
        this.data5 = data
      },
      back() {
        this.$emit('report', 'report')
      },
    },
  }
</script>
<style lang="less">
  .correction {
    .back {
      font-size: 16px;
      cursor: pointer;
      margin-bottom: 10px;
    }
    .ivu-tabs-bar {
      background: #1a202e;
      padding: 10px 20px 5px 20px;
      border-radius: 5px;
      margin-bottom: 10px;
    }
    .ivu-tabs-nav-scroll {
      border-bottom: 2px solid #797979;
    }
    .content {
      background: #1a202e;
      padding: 20px;
      border-radius: 5px;
    }
  }
</style>
