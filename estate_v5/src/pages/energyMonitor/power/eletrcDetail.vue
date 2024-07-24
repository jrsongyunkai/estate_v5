<template>
  <div class="elec-box">
    <Col :span="24">
      <div class="search-form">
        <Form ref="form" :model="form" inline style="display: flex">
          <Col><GroupPick v-model="groupInfo" multiple ref="groupPickRef"></GroupPick></Col>
          <Col>
            <div class="dateType">
              <MKindDatePick class="ml-10" v-model="timeValue" :typeRange="typeRange" />
            </div>
          </Col>
          <Col style="margin-left: 10px">
            <FormItem>
              <Button type="primary" @click="querList">{{ $t('query') }}</Button>
            </FormItem>
            <FormItem>
              <Button type="default" @click="restList">{{ $t('reset') }}</Button>
            </FormItem>
          </Col>
        </Form>
      </div>
    </Col>
    <Col :span="24" style="background-color: #1a202e; margin-top: 10px; padding-top: 20px; border-radius: 4px">
      <span style="display: flex; justify-content: space-between">
        <Col>
          <h3 style="margin-left: 30px">
            {{ $t('electricityUsageTrend') }}
            <Tooltip placement="top" max-width="300" transfer>
              <Icon color="#007EFF" size="16" type="ios-information-circle-outline" style="margin-left: 5px" />
              <div slot="content" style="white-space: normal">
                {{ tooltipText }}
              </div>
            </Tooltip>
          </h3>
        </Col>
      </span>
      <div class="pd-left-20"><bar-charts v-if="!!thirdBarOptions.series" :options="thirdBarOptions"></bar-charts></div>
      <div class="powerStatData">
        <div class="time">{{ timer }}</div>
        <div class="content">
          <div class="contentVal" v-for="(item, index) in powerStatData" :key="index">
            <div>
              {{ `"${item.nodeName}"` }}{{ $t('electricQuantity') }}:
              <span>{{ item.powerTotal }}</span>
              kW·h
            </div>
          </div>
        </div>
      </div>
    </Col>
    <Col :span="24" style="background-color: #1a202e; margin-top: 10px; padding: 10px 15px; border-radius: 4px">
      <Tabs name="children-name" :animated="false" v-model="activeName" @on-click="getTableYear">
        <TabPane :label="powerConsumptionDatalist" name="children-name1" tab="children-name">
          <Table v-if="activeName === 'children-name1'" highlight-row style="width: 100%" ref="currentRowTable" :columns="columns" :data="dataList"></Table>
        </TabPane>
        <TabPane :label="yearpowerConsumptionDatalist" name="children-name4" tab="children-name">
          <Form :model="form" inline style="display: flex">
            <Col>
              <FormItem style="display: flex; margin-left: 20px">
                <Select transfer clearable v-model="currentBuild" :placeholder="$t('whole')" style="width: 200px">
                  <Option z-index="5" v-for="item in buildings" :key="item.value" :label="item.text" :value="item.value"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col>
              <FormItem style="display: flex">
                <Input v-model="devieceNum" clearable :placeholder="$t('powerPagePlaceholder1')" />
              </FormItem>
            </Col>
            <Col>
              <FormItem style="display: flex">
                <Select style="width: 200px" v-model="natrulYear" clearable :placeholder="$t('pleaseSelectYear')">
                  <Option v-for="item in years" :key="item.value" :label="item.value" :value="item.value"></Option>
                </Select>
              </FormItem>
            </Col>
            <FormItem>
              <Button type="primary" @click="queryYearList">{{ $t('query') }}</Button>
            </FormItem>
            <FormItem>
              <Button type="default" @click="resetYearList">{{ $t('reset') }}</Button>
            </FormItem>
            <FormItem>
              <Dropdown trigger="click" @on-click="handleCommandYear" transfer>
                <Button class="export">
                  <Icon custom="icon-v5 icon-v5-daochu2" />
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem name="exportCurrent">{{ $t('exportCurPageDevicePower') }}</DropdownItem>
                  <DropdownItem name="exportAll">{{ $t('exportAllPagesDevicePower') }}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </FormItem>
          </Form>
          <Table :columns="columnsYear" :data="yearDataTable">
            <template slot-scope="{ row }" slot="room">
              <span>{{ row.unit ? row.unit : '' }}{{ row.room ? ',' + row.room : '' }}</span>
            </template>
            <template slot-scope="{ row }" slot="status">
              <span v-if="row.statusCnString === 'NORMAL'">
                <span v-if="row.others.online === 1">
                  {{ $t('enabled') }}|
                  <span class="c-success">{{ $t('online') }}</span>
                </span>
                <span v-else-if="row.others.online === 0">
                  {{ $t('enabled') }}|
                  <span class="c-danger">{{ $t('offline') }}</span>
                </span>
                <span v-else>
                  {{ $t('enabled') }}|
                  <span class="c-info">{{ $t('disconnected') }}</span>
                </span>
              </span>
              <span v-else>{{ $t('disabled') }}</span>
            </template>
            <template slot-scope="{ row, index }" slot="operating">
              <Button type="text" style="color: #2d8cf0" @click="linePowerDetail(row.build, row.unit, row.room, row.mac, index)">{{ $t('lineDetail') }}</Button>
            </template>
          </Table>
          <Page :current="currentYearPage" :total="yearTotal" :page-size="pageYearSize" show-elevator @on-change="changeYearPage" @on-page-size-change="changeYearsize" />
        </TabPane>
        <TabPane :label="monthpowerConsumptionDatalist" name="children-name2" tab="children-name">
          <Form :model="form" inline style="display: flex">
            <Col>
              <FormItem style="display: flex; margin-left: 20px">
                <Select transfer clearable v-model="building" :placeholder="$t('whole')" style="width: 200px">
                  <Option z-index="5" v-for="item in buildings" :key="item.value" :label="item.text" :value="item.value"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col>
              <FormItem style="display: flex">
                <Input v-model="keyword" clearable :placeholder="$t('powerPagePlaceholder1')" />
              </FormItem>
            </Col>
            <Col>
              <FormItem style="display: flex">
                <Select style="width: 200px" v-model="dateYear" clearable :placeholder="$t('pleaseSelectYear')">
                  <Option v-for="item in years" :key="item.value" :label="item.value" :value="item.value"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col>
              <FormItem style="display: flex">
                <Select clearable style="width: 200px" v-model="Datemonth" :placeholder="$t('pleaseSelectMonth')">
                  <Option v-for="(item, index) in months" :key="index" :label="item.text" :value="item.value"></Option>
                </Select>
              </FormItem>
            </Col>
            <FormItem>
              <Button type="primary" @click="queryPowerList">{{ $t('query') }}</Button>
            </FormItem>
            <FormItem>
              <Button type="default" @click="resetPowerList">{{ $t('reset') }}</Button>
            </FormItem>
            <FormItem>
              <Dropdown trigger="click" @on-click="handleCommand" transfer>
                <Button class="export">
                  <Icon custom="icon-v5 icon-v5-daochu2" />
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem name="exportCurrent">{{ $t('exportCurPageDevicePower') }}</DropdownItem>
                  <DropdownItem name="exportAll">{{ $t('exportAllPagesDevicePower') }}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </FormItem>
          </Form>
          <Row style="padding: 0px 20px; background-color: #1a202e">
            <Table style="width: 100%" ref="currentRowTable" :columns="columns2" :data="naturalList">
              <template slot-scope="{ row }" slot="room">
                <span>{{ row.unit ? row.unit : '' }}{{ row.room ? ',' + row.room : '' }}</span>
              </template>
              <template slot-scope="{ row }" slot="status">
                <span v-if="row.statusCnString === 'NORMAL'">
                  <span v-if="row.others.online === 1">
                    {{ $t('enabled') }}|
                    <span class="c-success">{{ $t('online') }}</span>
                  </span>
                  <span v-else-if="row.others.online === 0">
                    {{ $t('enabled') }}|
                    <span class="c-danger">{{ $t('offline') }}</span>
                  </span>
                  <span v-else>
                    {{ $t('enabled') }}|
                    <span class="c-info">{{ $t('disconnected') }}</span>
                  </span>
                </span>
                <span v-else>{{ $t('disabled') }}</span>
              </template>
              <template slot-scope="{ row, index }" slot="operating">
                <Button type="text" style="color: #2d8cf0" @click="linePowerDetail(row.build, row.unit, row.room, row.mac, index)">{{ $t('lineDetail') }}</Button>
              </template>
            </Table>
          </Row>

          <Page :current="currentPage" :total="total" :page-size="pageSize" show-elevator show-total @on-change="changePage" @on-page-size-change="changesize" />
        </TabPane>
        <TabPane :label="monthpowerDatalist" name="children-name3" tab="children-name">
          <Form :model="form" inline style="display: flex">
            <Col style="margin-left: 20px">
              <FormItem style="display: flex">
                <Select transfer clearable v-model="build" :placeholder="$t('whole')" style="width: 200px">
                  <Option z-index="5" v-for="item in builds" :key="item.value" :label="item.text" :value="item.value"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col>
              <DateRangePicker v-model="customValue" transfer :editable="false" :clearable="false" />
            </Col>
            <Col>
              <FormItem style="display: flex; margin-left: 10px">
                <Input v-model="keywordKer" :placeholder="$t('powerPagePlaceholder1')" />
              </FormItem>
            </Col>
            <Col>
              <FormItem>
                <Button type="primary" @click="queryPowerListKer">{{ $t('query') }}</Button>
              </FormItem>
              <FormItem>
                <Button type="default" @click="resetPowerListKer">{{ $t('reset') }}</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" ghost @click="customQueryVisible = true">{{ $t('customQuery') }}</Button>
              </FormItem>
            </Col>
            <FormItem style="margin: 0 20px 0 auto">
              <Button class="export" @click="handleExportRange">
                <Icon custom="icon-v5 icon-v5-daochu2" />
              </Button>
            </FormItem>
          </Form>
          <Row style="padding: 0px 20px; background-color: #1a202e">
            <Table highlight-row style="width: 100%" ref="currentRowTable" :columns="custColumns" :data="customlList">
              <template slot-scope="{ row }" slot="room">
                <span>{{ row.unit ? row.unit : '' }}{{ row.room ? ',' + row.room : '' }}</span>
              </template>
              <template slot-scope="{ row }" slot="status">
                <span v-if="row.statusCnString === 'NORMAL'">
                  <span v-if="row.others.online === 1">
                    {{ $t('enabled') }}|
                    <span class="c-success">{{ $t('online') }}</span>
                  </span>
                  <span v-else-if="row.others.online === 0">
                    {{ $t('enabled') }}|
                    <span class="c-danger">{{ $t('offline') }}</span>
                  </span>
                  <span v-else>
                    {{ $t('enabled') }}|
                    <span class="c-info">{{ $t('disconnected') }}</span>
                  </span>
                </span>
                <span v-else>{{ $t('disabled') }}</span>
              </template>
              <template slot-scope="{ row, index }" slot="operating">
                <Button type="text" style="color: #2d8cf0" @click="linePowerDetail(row.build, row.unit, row.room, row.mac, index)">{{ $t('lineDetail') }}</Button>
              </template>
            </Table>
          </Row>
          <Page :current="customcurrentPage" :total="customTotal" :page-size="custompageSize" show-elevator @on-change="customchangePage" @on-page-size-change="customChangesize" />
        </TabPane>
        <Button class="export" v-if="activeName === 'children-name1'" @click="handleExport" slot="extra">
          <Icon custom="icon-v5 icon-v5-daochu2" />
        </Button>
      </Tabs>
    </Col>
    <Modal :title="addr" width="70%" v-model="powerDialog" :mask="false" :footer-hide="true" @on-visible-change="handleCloseAddr">
      <Row class="pickDate">
        <div class="pickDate">
          <div class="block">
            <Button :type="datePicker === 'year' ? 'primary' : 'default'" class="button" @click="handleDatePicker('year')">{{ $t('year') }}</Button>
            <Button :type="datePicker === 'month' ? 'primary' : 'default'" class="button" @click="handleDatePicker('month')">{{ $t('month') }}</Button>
            <Button :type="datePicker === 'day' ? 'primary' : 'default'" class="button" @click="handleDatePicker('day')">{{ $t('day') }}</Button>
            <Button :type="datePicker === 'hour' ? 'primary' : 'default'" class="button" @click="handleDatePicker('hour')">{{ $t('hour') }}</Button>
          </div>
          <div style="margin: 0 10px">
            <div class="block" v-show="datePicker === 'hour'">
              <el-date-picker v-model="powerHour" type="datetimerange" value-format="yyyy-MM-dd HH" format="yyyy-MM-dd HH" :clearable="false" :editable="false" popper-class="hide-minute"></el-date-picker>
            </div>
            <div class="block" v-show="datePicker === 'day'">
              <el-date-picker v-model="powerDay" type="daterange" :editable="false" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :clearable="false"></el-date-picker>
            </div>
            <div class="block" v-show="datePicker === 'month'">
              <el-date-picker v-model="powerMonth" type="monthrange" :editable="false" value-format="yyyy-MM" format="yyyy-MM" :clearable="false"></el-date-picker>
            </div>
            <div class="block" v-show="datePicker === 'year'">
              <YearRangePicker v-model="powerYear" style="display: block; width: 300px"></YearRangePicker>
            </div>
          </div>
          <Button type="primary" style="margin-right: 10px" @click="initPowerDetail">{{ $t('query') }}</Button>
          <Button @click="resetLinePower">{{ $t('reset') }}</Button>
        </div>
        <Tooltip :content="$t('export')" placement="top">
          <Button class="export">
            <Icon custom="icon-v5 icon-v5-daochu2" @click="handlePowerExport" />
          </Button>
        </Tooltip>
      </Row>
      <Table border show-summary :summary-method="handleSummary" :columns="columns3" :data="powerData" style="margin-top: 20px" :maxHeight="maxHeight" class="fix-summary-scroll">
        <template #title="{ row }">
          <span v-if="showDevice">{{ row.boxName }}（{{ row.mac }}）/</span>
          <span>{{ row.chlTitle }}（{{ row.mac }}-{{ row.addr.toString().padStart(2, '0') }}）</span>
        </template>
      </Table>
    </Modal>
    <DevicePickerModal v-model="customQueryVisible" :mask="false" :title="$t('selectQueryObject')" :confirmText="$t('nextStep')" @on-ok="customQueryNext" @on-cancel="customQueryVisible = false" :level="2" :conditions="{ lineType: 'EXCEPT_IO' }" />
  </div>
</template>

<script>
  import BarCharts from './ElectricityTrendCharts.vue'
  import { getBuildings, queryPower, queryTimeRangePowerOfProject } from '@/api/public'
  import { queryChannelPowerByTimeRange, powerTrendNew, powerStatByGroupNew, powerDataNew } from '@api/energyMonitor/power'
  import dayjs from 'dayjs'
  import { roundPrecision } from '@utils/math'
  import { groupBy, get } from 'lodash/fp'
  import qs from 'qs'
  import { defaultTimeValue } from './constants'
  const datePickerConfigMap = {
    hour: {
      key: 'powerHour',
      type: 1,
      getDefault() {
        return [dayjs().subtract(7, 'day').add(1, 'hour').format('YYYY-MM-DD HH'), dayjs().format('YYYY-MM-DD HH')]
      },
      validate(value) {
        const [startTime, endTime] = value || []
        if (!startTime || !endTime) {
          return { isValid: false, message: window.$t('powerPageErrorMessage1') }
        }
        if (dayjs(endTime).diff(dayjs(startTime), 'day') >= 7) {
          return { isValid: false, message: window.$t('powerPageErrorMessage2') }
        }
        return {
          isValid: true,
        }
      },
    },
    day: {
      key: 'powerDay',
      type: 2,
      getDefault() {
        return [dayjs().subtract(1, 'month').add(1, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
      },
      validate(value) {
        const [startTime, endTime] = value || []
        if (!startTime || !endTime) {
          return { isValid: false, message: window.$t('powerPageErrorMessage1') }
        }
        if (dayjs(endTime).diff(dayjs(startTime), 'month') >= 1) {
          return { isValid: false, message: window.$t('powerPageErrorMessage3') }
        }
        return {
          isValid: true,
        }
      },
    },
    month: {
      key: 'powerMonth',
      type: 3,
      getDefault() {
        return [dayjs().subtract(1, 'year').add(1, 'month').format('YYYY-MM'), dayjs().format('YYYY-MM')]
      },
      validate(value) {
        const [startTime, endTime] = value || []
        if (!startTime || !endTime) {
          return { isValid: false, message: window.$t('powerPageErrorMessage1') }
        }
        if (dayjs(endTime).diff(dayjs(startTime), 'year') >= 1) {
          return { isValid: false, message: window.$t('powerPageErrorMessage4') }
        }
        return {
          isValid: true,
        }
      },
    },
    year: {
      key: 'powerYear',
      type: 4,
      getDefault() {
        return [dayjs().subtract(3, 'year').add(1, 'year').format('YYYY'), dayjs().format('YYYY')]
      },
      validate(value) {
        const [startTime, endTime] = value || []
        if (!startTime || !endTime) {
          return { isValid: false, message: window.$t('powerPageErrorMessage1') }
        }
        if (dayjs(endTime).diff(dayjs(startTime), 'year') >= 3) {
          return { isValid: false, message: window.$t('powerPageErrorMessage5') }
        }
        return {
          isValid: true,
        }
      },
    },
  }
  const dateTypeConfig = {
    2: window.$t('hour'),
    3: window.$t('day'),
    4: window.$t('month'),
    5: window.$t('day'),
    6: window.$t('month'),
  }
  export default {
    name: 'eletrcDetail',
    components: { BarCharts },
    data() {
      return {
        groupInfo: { groupId: '', groupNodeId: '' },

        timeValue: defaultTimeValue(),
        activeName: 'children-name1',
        maxHeight: window.innerHeight * 0.7,
        showDevice: false,
        customQueryVisible: false,
        macAddrList: [],
        tooltipText: this.$t('powerPageTips2'),
        ConsumptionDatalistText: this.$t('powerPageTips3'),
        powerConsumptionDatalist: h => {
          return h('div', [
            h('span', { style: { marginLeft: '5px' } }, this.$t('powerDataList')),
            h(
              'Tooltip',
              {
                props: { placement: 'top', maxWidth: '300', transfer: true },
              },
              [
                h('Icon', {
                  props: { color: '#007EFF', size: '16', type: 'ios-information-circle-outline' },
                  style: { marginLeft: '5px' },
                }),
                h('div', { slot: 'content', style: { whiteSpace: 'normal' } }, this.ConsumptionDatalistText),
              ]
            ),
          ])
        },
        powerConsumptionDataText: this.$t('powerPageTips4'),
        yearpowerConsumptionDatalist: h => {
          return h('div', [
            h('span', { style: { marginLeft: '5px' } }, this.$t('yearpowerConsumptionDatalist')),
            h(
              'Tooltip',
              {
                props: { placement: 'top', maxWidth: '300', transfer: true },
              },
              [
                h('Icon', {
                  props: { color: '#007EFF', size: '16', type: 'ios-information-circle-outline' },
                  style: { marginLeft: '5px' },
                }),
                h('div', { slot: 'content', style: { whiteSpace: 'normal' } }, this.powerConsumptionDataText),
              ]
            ),
          ])
        },
        monthpowerConsumptionText: this.$t('powerPageTips5'),
        monthpowerConsumptionDatalist: h => {
          return h('div', [
            h('span', { style: { marginLeft: '5px' } }, this.$t('monthpowerConsumptionDatalist')),
            h(
              'Tooltip',
              {
                props: { placement: 'top', maxWidth: '300', transfer: true },
              },
              [
                h('Icon', {
                  props: { color: '#007EFF', size: '16', type: 'ios-information-circle-outline' },
                  style: { marginLeft: '5px' },
                }),
                h('div', { slot: 'content', style: { whiteSpace: 'normal' } }, this.monthpowerConsumptionText),
              ]
            ),
          ])
        },
        monthpowerText: this.$t('powerPageTips6'),
        monthpowerDatalist: h => {
          return h('div', [
            h('span', this.$t('monthpowerDatalist')),
            h('Tooltip', { props: { placement: 'top', maxWidth: '300', transfer: true } }, [
              h('Icon', {
                props: { color: '#007EFF', size: '16', type: 'ios-information-circle-outline' },
                style: { marginLeft: '5px' },
              }),
              h('div', { slot: 'content', style: { whiteSpace: 'normal' } }, this.monthpowerText),
            ]),
          ])
        },
        currentYearPage: 1,
        pageYearSize: 10,
        yearTotal: 0,
        yearDataTable: [],
        columnsYear: [
          { title: this.$t('deviceAliases'), key: 'name', width: 200 },
          { title: this.$t('equipmentNo'), key: 'mac', width: 200 },
          { title: this.$t('room'), slot: 'room' },
          { title: `${new Date().getFullYear() + this.$t('yearElec')}`, key: 'electricity', width: 150 },
          { title: `${new Date().getFullYear() - 1 + this.$t('yearElec')}`, key: 'preElectricity', width: 150 },
          { title: this.$t('comparison'), key: 'ratio' },
          { title: this.$t('contacts'), key: 'linkman' },
          { title: this.$t('contactNumber'), key: 'linkmanTel' },
          { title: this.$t('state'), slot: 'status' },
          { title: this.$t('operation'), slot: 'operating', fixed: 'right', align: 'center' },
        ],
        currentBuild: '',
        devieceNum: '',
        natrulYear: new Date().getFullYear(),
        dateYear: new Date().getFullYear(),
        Datemonth: new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`,
        custColumns: [
          { title: this.$t('deviceAliases'), key: 'name', width: 200 },
          { title: this.$t('equipmentNo'), key: 'mac', width: 200 },
          { title: this.$t('room'), slot: 'room' },
          { title: this.$t('customDate'), key: 'electricity' },
          { title: this.$t('naturalDate'), key: 'preElectricity' },
          { title: this.$t('comparison'), key: 'ratio' },
          { title: this.$t('contacts'), key: 'linkman' },
          { title: this.$t('contactNumber'), key: 'linkmanTel' },
          { title: this.$t('state'), slot: 'status' },
          { title: this.$t('operation'), slot: 'operating', align: 'center', fixed: 'right' },
        ],
        customlList: [],
        build: '',
        builds: [],
        customValue: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()],
        keywordKer: '',
        columns3: [],
        powerData: [],
        // yyyy-MM-dd HH
        powerHour: datePickerConfigMap.hour.getDefault(),
        // yyyy-MM-dd
        powerDay: datePickerConfigMap.day.getDefault(),
        // yyyy-MM
        powerMonth: datePickerConfigMap.month.getDefault(),
        // yyyy
        powerYear: datePickerConfigMap.year.getDefault(),
        datePicker: 'hour',
        addr: '',
        mac: '',
        powerDialog: false,
        customcurrentPage: 1,
        customTotal: 0,
        custompageSize: 10,
        currentPage: 1,
        total: 0,
        pageNo: 1,
        pageSize: 10,
        building: '',
        buildings: [],
        keyword: '',
        columns2: [
          { title: this.$t('deviceAliases'), key: 'name', width: 200 },
          { title: this.$t('equipmentNo'), key: 'mac', width: 200 },
          { title: this.$t('room'), slot: 'room' },
          { title: this.$t('powerThisMonth'), key: 'electricity' },
          { title: this.$t('powerLastMonth'), key: 'preElectricity' },
          { title: this.$t('comparison'), key: 'ratio' },
          { title: this.$t('contacts'), key: 'linkman' },
          { title: this.$t('contactNumber'), key: 'linkmanTel' },
          { title: this.$t('state'), slot: 'status' },
          { title: this.$t('operation'), slot: 'operating', fixed: 'right', align: 'center' },
        ],
        naturalList: [],
        columns: [
          { type: 'index', width: 80, align: 'center', title: this.$t('index') },
          { title: this.$t('time'), key: 'timeDesc' },
          { title: `${this.$t('sharpPower')}(kW·h)`, key: 'powerTopPeak' },
          { title: `${this.$t('peakPower')}(kW·h)`, key: 'powerPeak' },
          { title: `${this.$t('shoulderPower')}(kW·h)`, key: 'powerFlat' },
          { title: `${this.$t('valleyPower')}(kW·h)`, key: 'powerValley' },
          { title: `${this.$t('totalElectricityConsumption1')}(kW·h)`, key: 'powerTotal' },
          // { title: this.$t('page.table.curPower'), key: 'curPower' },
          { title: `${this.$t('yearOnYearPower')}(kW·h)`, key: 'samePower' },
          { title: this.$t('yearOnYearRatio'), key: 'sameRatio' },
          { title: `${this.$t('yearOnYearDiff')}(kW·h)`, key: 'sameDifference' },
          { title: `${this.$t('monthOnMonthPower')}(kW·h)`, key: 'ringPower' },
          { title: this.$t('monthOnMonthRatio'), key: 'ringRatio' },
          { title: `${this.$t('monthOnMonthDiff')}(kW·h)`, key: 'ringDifference' },
        ],
        timer: '',
        dataList: [],
        types: '',
        form: {},
        treeList: [],
        packetList: [],
        packetTypes: '',
        packetFilter: [],
        packetFilterList: [],
        year: new Date().getFullYear(),
        years: [
          { text: new Date().getFullYear() + this.$t('year'), value: new Date().getFullYear() },
          { text: new Date().getFullYear() - 1 + this.$t('year'), value: new Date().getFullYear() - 1 },
          { text: new Date().getFullYear() - 2 + this.$t('year'), value: new Date().getFullYear() - 2 },
        ],
        month: this.$Date().format('YYYY-MM'),
        months: [
          { text: this.$t('January'), value: '01' },
          { text: this.$t('February'), value: '02' },
          { text: this.$t('March'), value: '03' },
          { text: this.$t('April'), value: '04' },
          { text: this.$t('May'), value: '05' },
          { text: this.$t('June'), value: '06' },
          { text: this.$t('July'), value: '07' },
          { text: this.$t('August'), value: '08' },
          { text: this.$t('September'), value: '09' },
          { text: this.$t('October'), value: '10' },
          { text: this.$t('November'), value: '11' },
          { text: this.$t('December'), value: '12' },
        ],
        thirdBarOptions: {},
        powerStatData: [],
        isActive: 0,
      }
    },
    created() {},
    mounted() {
      this.init()
    },
    computed: {
      date() {
        return this[datePickerConfigMap[this.datePicker].key]
      },
      typeRange() {
        return this.$store.state.isOpenPrjGrpHourPowerStat ? [this.$t('day'), this.$t('week'), this.$t('month'), this.$t('season'), this.$t('year')] : [this.$t('week'), this.$t('month'), this.$t('season'), this.$t('year')]
      },
    },
    methods: {
      customQueryNext(addrList) {
        const getMac = get(['data', 'parent', 'mac'])
        const getAddr = get(['data', 'addr'])
        const groupMap = groupBy(getMac, addrList)
        this.addr = this.$t('customQueryLineDetail')
        this.macAddrList = Object.keys(groupMap).map(mac => {
          const addrStr = groupMap[mac].map(getAddr).join(',')
          return `${mac}:${addrStr}`
        })
        this.customQueryVisible = false
        this.powerDialog = true
        this.showDevice = true
        this.initPowerDetail()
      },
      init() {
        this.initBars()
        this.getElecDetailList()
        this.initBuilding()
      },
      async handlepowerStatByGroup(params) {
        const res = await powerStatByGroupNew(params)
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.powerStatData = res.data.map(val => ({ ...val, nodeName: val.nodeName, powerTotal: val.powerTotal }))
        if (this.powerStatData.length > 0) {
          this.timer = this.timeValue.dateValue
        }
      },
      handleExport() {
        let params = {
          projectCode: this.$store.state.projectCode,
          statsType: this.timeValue.timeType,
          startYmd: dayjs(this.timeValue.dataRange[0]).format('YYYYMMDD'),
          endYmd: dayjs(this.$func.getEndTime(this.timeValue.dataRange[1])).format('YYYYMMDD'),
          nodeId: this.groupInfo.groupNodeId && !!this.groupInfo.groupNodeId.length ? this.groupInfo.groupNodeId.join(',') : '',
        }
        const paramsStr = `/energy/manage/v5/xls/powerDataNew.as?${qs.stringify(params)}`
        this.$func.windowCountDown(paramsStr)
      },
      resetPowerList() {
        this.building = ''
        this.dateYear = ''
        this.Datemonth = ''
        this.keyword = ''
        this.queryList()
      },
      queryPowerListKer() {
        this.customcurrentPage = this.pageNo = 1
        if (this.customValue[0] === '' || this.customValue[1] === '') {
          this.$Message.error({ content: this.$t('pleaseSelectTime') })
          return false
        }
        this.queryListKer()
      },
      resetPowerListKer() {
        this.build = ''
        this.keywordKer = ''
        this.customValue = [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date()]
        this.queryListKer()
      },
      async getTableYear(val) {
        if (val === 'children-name4') {
          let params = {
            pageNo: this.currentYearPage,
            pageSize: this.pageYearSize,
            type: 'MAC',
            params: {
              projectCode: this.$store.state.projectCode,
              month: '00',
              build: this.currentBuild,
              year: this.natrulYear ? this.natrulYear : new Date().getFullYear(),
              mac: this.devieceNum,
              name: this.devieceNum,
            },
          }
          queryPower(params)
            .then(res => {
              if (res.success) {
                this.yearDataTable = res.datas.map(item => ({
                  ...item,
                  electricity: item.others.electricity,
                  preElectricity: item.others.preElectricity,
                  ratio: item.others.ratio,
                }))
                this.yearTotal = res.total
                this.columnsYear[3].title = `${this.natrulYear}${this.$t('powerConsumption2')}`
                this.columnsYear[4].title = `${this.natrulYear - 1}${this.$t('powerConsumption2')}`
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
        }
      },
      changeYearPage(val) {
        this.currentYearPage = val
        this.getTableYear('children-name4')
      },
      changeYearsize(val) {
        this.pageYearSize = val
        this.getTableYear('children-name4')
      },
      queryYearList() {
        // 查询自然年列表
        if (!this.natrulYear) {
          this.$Message.error({ content: this.$t('pleaseSelectYear') })
          return false
        }
        this.currentYearPage = 1
        this.getTableYear('children-name4')
      },
      resetYearList() {
        this.currentBuild = ''
        this.devieceNum = ''
        this.natrulYear = new Date().getFullYear()
        this.getTableYear('children-name4')
        // 重置自然年表单
      },
      handleCommandYear(val) {
        // 导出自然年列表
        if (val === 'exportAll') {
          this.$func.windowCountDown(
            '/project/main/v2/xls/powerStats.as?projectCode=' +
              this.$store.state.projectCode +
              '&mac=' +
              this.devieceNum +
              '&build=' +
              this.currentBuild +
              '&year=' +
              (this.natrulYear ? this.natrulYear : new Date().getFullYear()) +
              '&month=' +
              '00' +
              '&projectName=' +
              this.$store.state.projectName +
              '&currentPage=0'
          )
        } else if (val === 'exportCurrent') {
          this.$func.windowCountDown(
            '/project/main/v2/xls/powerStats.as?projectCode=' +
              this.$store.state.projectCode +
              '&mac=' +
              this.devieceNum +
              '&build=' +
              this.currentBuild +
              '&year=' +
              (this.natrulYear ? this.natrulYear : new Date().getFullYear()) +
              '&month=' +
              '00' +
              '&projectName=' +
              this.$store.state.projectName +
              '&currentPage=' +
              this.currentYearPage +
              '&pageSize=' +
              this.yearDataTable.length
          )
        }
      },
      handleExportRange() {
        if (new Date(this.customValue[0]).getTime() >= new Date(this.$func.getNowFormatDate()).getTime() || new Date(this.customValue[1]).getTime() >= new Date(this.$func.getNowFormatDate()).getTime()) {
          this.$Message.error({ content: this.$t('powerPageErrorMessage6') })
          return false
        }
        if (this.$func.checkDateOneMonth(this.customValue[0], this.customValue[1]) === 'true') {
          this.$func.windowCountDown(
            this.$func.ctxPaths() + '/project/main/v3/xls/powerDetailByTimeRange.as?projectCode=' + this.$store.state.projectCode + '&mac=' + this.keywordKer + '&oqp1=' + this.$func.formatDate('yyyy-MM-dd', this.customValue[0]) + '&oqp2=' + this.$func.formatDate('yyyy-MM-dd', this.customValue[1])
          )
        } else {
          this.$Message.error({ content: this.$t('powerPageErrorMessage7') })
        }
      },
      changePage(val) {
        this.currentPage = val
        // 调用相关list接口
        this.queryList()
      },
      customchangePage(val) {
        this.customcurrentPage = val
        this.queryListKer()
      },
      customChangesize(val) {
        this.custompageSize = val
        this.queryListKer()
      },
      handleCommand(command) {
        if (command === 'exportAll') {
          this.$func.windowCountDown('/project/main/v2/xls/powerStats.as?projectCode=' + this.$store.state.projectCode + '&mac=' + this.keyword + '&build=' + this.building + '&year=' + this.dateYear + '&month=' + this.Datemonth + '&projectName=' + this.$store.state.projectName + '&currentPage=0')
        } else if (command === 'exportCurrent') {
          this.$func.windowCountDown(
            '/project/main/v2/xls/powerStats.as?projectCode=' +
              this.$store.state.projectCode +
              '&mac=' +
              this.keyword +
              '&build=' +
              this.building +
              '&year=' +
              this.dateYear +
              '&month=' +
              this.Datemonth +
              '&projectName=' +
              this.$store.state.projectName +
              '&currentPage=' +
              this.currentPage +
              '&pageSize=' +
              this.naturalList.length
          )
        }
      },
      async queryListKer() {
        if (this.$func.getDaysBetween(this.customValue[0], this.customValue[1]) > 30) {
          this.$Message.error({ content: this.$t('powerPageErrorMessage8') })
          return false
        }
        let v = this.customValue[0]
        let i = this.customValue[1]
        let params = {
          pageNo: this.customcurrentPage,
          pageSize: this.custompageSize,
          type: 'MAC',
          params: {
            projectCode: this.$store.state.projectCode,
            startTime: this.$func.formatDate('yyyy-MM-dd', v),
            endTime: this.$func.formatDate('yyyy-MM-dd', i),
            build: this.build,
            mac: this.keywordKer,
            name: this.keywordKer,
          },
        }
        const res = await queryTimeRangePowerOfProject(params)
        if (res.success) {
          let days = this.$func.getDaysBetween(v, i) + 1
          let preMonth = new Date(v - days * 24 * 60 * 60 * 1000).getMonth() + 1 < 10 ? '0' + (new Date(v - days * 24 * 60 * 60 * 1000).getMonth() + 1) : new Date(v - days * 24 * 60 * 60 * 1000).getMonth() + 1
          let preDay = new Date(v - days * 24 * 60 * 60 * 1000).getDate() < 10 ? '0' + new Date(v - days * 24 * 60 * 60 * 1000).getDate() : new Date(v - days * 24 * 60 * 60 * 1000).getDate()
          let preStartDate = new Date(v - days * 24 * 60 * 60 * 1000).getFullYear() + '-' + preMonth + '-' + preDay
          let endMonth = new Date(v - 24 * 60 * 60 * 1000).getMonth() + 1 < 10 ? '0' + (new Date(v - 24 * 60 * 60 * 1000).getMonth() + 1) : new Date(v - 24 * 60 * 60 * 1000).getMonth() + 1
          let endDates = new Date(v - 24 * 60 * 60 * 1000).getDate() < 10 ? '0' + new Date(v - 24 * 60 * 60 * 1000).getDate() : new Date(v - 24 * 60 * 60 * 1000).getDate()
          let preEndDate = new Date(v - 24 * 60 * 60 * 1000).getFullYear() + '-' + endMonth + '-' + endDates

          this.custColumns[2].title = this.$t('room')
          let startDate = this.$func.formatDate('yyyy-MM-dd', v)
          let endDate = this.$func.formatDate('yyyy-MM-dd', i)
          this.custColumns[3].title = this.$t('timeRangeValue', { startTime: startDate, endTime: endDate })
          this.custColumns[4].title = this.$t('timeRangeValue', { startTime: preStartDate, endTime: preEndDate })
          this.customlList = res.datas.map(item => ({
            ...item,
            electricity: item.others.electricity,
            preElectricity: item.others.preElectricity,
            ratio: item.others.ratio,
          }))
          this.customTotal = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryList() {
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          type: 'MAC',
          params: {
            projectCode: this.$store.state.projectCode,
            month: this.Datemonth ? this.Datemonth : '01',
            build: this.building,
            year: this.dateYear || new Date().getFullYear(),
            mac: this.keyword,
            name: this.keyword,
          },
        }
        const res = await queryPower(params)
        if (res.success) {
          this.naturalList = res.datas.map(item => ({
            ...item,
            electricity: item.others.electricity,
            preElectricity: item.others.preElectricity,
            ratio: item.others.ratio,
          }))
          this.total = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      linePowerDetail(build, unit, room, mac, index) {
        this.mac = mac
        this.powerDialog = true
        if (build) {
          unit = ',' + unit
        }
        if (unit) {
          room = ',' + room
        }
        this.addr = this.$t('addressLinePower', { address: build + unit + room })
        this.macAddrList = [mac]
        this.initPowerDetail()
      },
      handleCloseAddr(val) {
        if (!val) {
          this.datePicker = 'hour'
          this.powerHour = datePickerConfigMap.hour.getDefault()
          this.powerDay = datePickerConfigMap.day.getDefault()
          this.powerMonth = datePickerConfigMap.month.getDefault()
          this.powerYear = datePickerConfigMap.year.getDefault()
          this.macAddrList = []
          this.showDevice = false
        }
      },
      handleDatePicker(val) {
        this.datePicker = val
      },
      handleSummary({ columns, data }) {
        return columns.reduce((sums, { key }, index) => {
          if (index === 0) {
            sums[key] = { key, value: this.$t('total') }
          } else {
            const values = data.map(item => item[key])
            const total = values.reduce((total, v) => {
              total += v
              return total
            }, 0)
            sums[key] = { key, value: roundPrecision(total, 3) }
          }
          return sums
        }, {})
      },
      wrapItem(keys, item) {
        const { total, ...rest } = keys.reduce(
          (ret, key) => {
            const n = roundPrecision(item[key] || 0, 3)
            ret[key] = n
            ret.total += n
            return ret
          },
          { ...item, total: 0 }
        )
        return {
          ...rest,
          total: roundPrecision(total, 3),
        }
      },
      async initPowerDetail() {
        this.powerData = []
        const { isValid, message } = datePickerConfigMap[this.datePicker].validate(this.date)
        if (!isValid) return this.$Message.error(message)
        const [startTime, endTime] = this.date
        const params = { dateType: datePickerConfigMap[this.datePicker].type, startTime, endTime, macAddrList: this.macAddrList }
        const { success, message: errMsg, data } = await queryChannelPowerByTimeRange(params)
        if (!success) {
          return this.$Message.error(errMsg)
        }
        this.powerData = data.bodyList.map(item => {
          return this.wrapItem(data.headerList, item)
        })
        this.columns3 = [
          { title: this.$t('lineInfo'), slot: 'title', width: 200, align: 'center', fixed: 'left' },
          ...data.headerList.map(key => {
            return { title: `${key}（kW·h）`, key, minWidth: 200, align: 'center' }
          }),
          { title: `${this.$t('total')}（kW·h）`, key: 'total', width: 200, align: 'center', fixed: 'right' },
        ]
      },
      resetLinePower() {
        const { key, getDefault } = datePickerConfigMap[this.datePicker]
        this[key] = getDefault()
        this.initPowerDetail()
      },
      queryPowerList() {
        this.currentPage = this.pageNo = 1
        this.queryList()
      },
      handlePowerExport() {
        const [startTime, endTime] = this.date
        const queryString = qs.stringify({
          dateType: datePickerConfigMap[this.datePicker].type,
          startTime,
          endTime,
          macAddrList: this.macAddrList,
        })
        this.$func.windowCountDown(`/energy/power030/export/channelPowerByTimeRange.as?${queryString}`)
      },

      changesize(val) {
        this.pageSize = val
        this.queryList()
      },
      initBuilding() {
        let that = this
        let params = {
          projectCode: this.$store.state.projectCode,
        }
        getBuildings(params)
          .then(res => {
            if (res.success) {
              that.buildings = [{ text: this.$t('whole'), value: '' }].concat(res.data)
              that.builds = [{ text: this.$t('whole'), value: '' }].concat(res.data)
              this.queryList()
              this.queryListKer()
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
      async getDetailElec(params) {
        // powerDataNew
        const res = await powerDataNew(params)
        if (!res.success) {
          return this.$Message.error({ content: res.message })
        }
        this.dataList = res.data
      },
      getElecDetailList() {
        let params = {
          projectCode: this.$store.state.projectCode,
          statsType: this.timeValue.timeType,
          startYmd: dayjs(this.timeValue.dataRange[0]).format('YYYYMMDD'),
          endYmd: dayjs(this.$func.getEndTime(this.timeValue.dataRange[1])).format('YYYYMMDD'),
          nodeId: '',
        }
        this.getDetailElec(params)
      },
      async getlist(params) {
        const res = await powerTrendNew(params)

        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.thirdBarOptions = {}
        this.thirdBarOptions.xAxis = res.data.map(v => `${v.time}`.padStart(2, '0') + dateTypeConfig[this.timeValue.timeType])
        let powerObj = {
          powerFlat: [],
          powerPeak: [],
          powerTotal: [],
          powerValley: [],
          powerTopPeak: [],
        }
        for (let key in powerObj) {
          powerObj[key] = res.data.map(v => (v[key] === '-' ? null : +v[key]))
        }

        this.thirdBarOptions.series = [
          {
            name: this.$t('sharpHourElectricityConsumption'),
            type: 'bar',
            barWidth: '100%',
            stack: 'Search Engine',
            emphasis: {
              focus: 'series',
            },
            data: powerObj.powerTopPeak,
          },
          {
            name: this.$t('peakHourElectricityConsumption'),
            type: 'bar',
            stack: 'Search Engine',
            emphasis: {
              focus: 'series',
            },
            data: powerObj.powerPeak,
          },
          {
            name: this.$t('regularElectricityConsumption'),
            type: 'bar',
            stack: 'Search Engine',
            emphasis: {
              focus: 'series',
            },
            data: powerObj.powerFlat,
          },
          {
            name: this.$t('electricityConsumptionDuringValleyHours'),
            type: 'bar',
            stack: 'Search Engine',
            emphasis: {
              focus: 'series',
            },
            data: powerObj.powerValley,
          },
        ]
      },
      initBars() {
        let params = {
          projectCode: this.$store.state.projectCode,
          statsType: this.timeValue.timeType,
          startYmd: dayjs(this.timeValue.dataRange[0]).format('YYYYMMDD'),
          endYmd: dayjs(this.$func.getEndTime(this.timeValue.dataRange[1])).format('YYYYMMDD'),
          nodeId: '',
        }
        this.getlist(params)
        this.handlepowerStatByGroup(params)
      },
      querList() {
        let params = {
          projectCode: this.$store.state.projectCode,
          statsType: this.timeValue.timeType,
          startYmd: dayjs(this.timeValue.dataRange[0]).format('YYYYMMDD'),
          endYmd: dayjs(this.$func.getEndTime(this.timeValue.dataRange[1])).format('YYYYMMDD'),
          nodeId: this.groupInfo.groupNodeId && !!this.groupInfo.groupNodeId.length ? this.groupInfo.groupNodeId.join(',') : '',
        }
        this.getlist(params)
        this.getDetailElec(params)
        this.handlepowerStatByGroup(params)
      },
      restList() {
        this.timeValue = defaultTimeValue()
        this.$refs.groupPickRef.resetValue()
        this.timer = ''
        this.powerStatData = []
      },
    },
  }
</script>

<style lang="less" scoped>
  .pd-left-20 {
    padding-left: 20px;
  }
  .elec-box {
    height: calc(~'100vh - 212px');
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .search-form {
      background-color: #1a202e;
      padding-top: 10px;
      padding-left: 15px;
      border-radius: 4px;
      /deep/.ivu-form-item {
        margin-bottom: 10px;
      }
    }
  }
  .export-position {
    display: flex;
    justify-content: right;
    margin-bottom: 10px;
  }
  .actives {
    color: #007eff;
    border: 1px solid #007eff;
    background: rgba(0, 126, 255, 0.1);
    border-radius: 5px;
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
    i {
      font-size: 22px;
    }
  }
  .button {
    height: 30px;
    border: 1px soild #3c3c40 !important;
    padding: 0 8px;
    margin-right: 10px;
  }
  .active {
    width: 10px;
    height: 10px;
    margin-top: 3px;
    margin-right: 5px;
    margin-left: 25px;
    background: #007eff;
  }
  .pickDate {
    display: flex;
    justify-content: space-between;
    /deep/.el-date-editor {
      width: 300px;
    }
  }
  .powerStatData {
    display: flex;
    padding: 20px 20px 20px 50px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    .time {
      margin-right: 10px;
      display: flex;
      align-items: center;
    }
    .content {
      .contentVal {
        span {
          color: #0474ec;
          font-size: 16px;
        }
      }
    }
  }
</style>
