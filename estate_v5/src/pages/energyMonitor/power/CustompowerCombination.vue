<template>
  <div>
    <Row>
      <Col span="24" style="background-color: #1a202e; padding-top: 20px; padding-left: 20px">
        <Form inline :model="formInline" style="display: flex">
          <Col>
            <FormItem style="display: flex">
              <Select transfer v-model="formInline.year" :placeholder="$t('pleaseSelectYear')" :clearable="true" style="width: 200px">
                <Option z-index="5" v-for="item in years" :key="item.value" :label="item.value" :value="item.value"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col>
            <FormItem style="display: flex">
              <Select transfer :clearable="true" v-model="formInline.month" :placeholder="$t('pleaseSelectMonth')" style="width: 200px">
                <Option z-index="5" v-for="item in months" :key="item.value" :label="item.text" :value="item.value"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col :span="8">
            <FormItem>
              <Button type="primary" @click="queryPowerList">{{ $t('query') }}</Button>
            </FormItem>
            <FormItem>
              <Button @click="handleReset">{{ $t('reset') }}</Button>
            </FormItem>
            <FormItem>
              <Dropdown trigger="click" @on-click="handleCommand">
                <Button class="export">
                  <Icon custom="icon-v5 icon-v5-daochu2" />
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem name="current">{{ $t('exportCurPageDevicePower') }}</DropdownItem>
                  <DropdownItem name="all">{{ $t('exportAllPagesDevicePower') }}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </FormItem>
          </Col>
        </Form>
      </Col>
    </Row>
    <Row style="padding: 10px; background-color: #1a202e; margin-top: 10px">
      <Col :span="23">
        <h4 style="margin-left: 10px">{{ $t('customGroupList') }}</h4>
      </Col>
      <Col :span="1">
        <Button type="primary" style="margin-left: -10px" @click="handleAddEdit">{{ $t('add') }}</Button>
      </Col>
    </Row>
    <div style="padding: 5px 15px; background-color: #1a202e">
      <Table style="width: 100%" ref="currentRowTable" :columns="custEleColumns" :data="customElelList">
        <template slot-scope="{ row }" slot="name">
          <span @click="handleViewGroup(row.name, row.id)">{{ row.name }}</span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <span style="display: flex">
            <Button style="color: #007eff" type="text" @click="handleViewGroup(row.name, row.id)">{{ $t('lineDetail') }}</Button>
            <Button style="color: #007eff" type="text" @click="handleAddEdit(row)">{{ $t('edit') }}</Button>
            <Button style="color: #e03c3a" type="text" @click="handleDelGroup(row.id)">{{ $t('remove') }}</Button>
          </span>
        </template>
      </Table>
      <Page :current="currentPage" :total="total" :page-size="pageSize" show-elevator show-total @on-change="changePage" @on-page-size-change="changesize" />
    </div>
    <Modal :title="groupName" width="40%" v-model="groupDialog" :mask="false" :footer-hide="true" @on-visible-change="handleCloseAddr">
      <Row class="pickDate">
        <Col>
          <Button type="primary" @click="handleSelectDevice">{{ $t('selectDevice') }}</Button>
        </Col>
        <Col style="display: flex">
          <div style="margin: 0 10px">
            <div class="block" v-show="datePicker === 'month'">
              <DatePicker v-model="powerMonth" type="month" :editable="false" value-format="yyyy-MM" @on-change="handlePowerTypePicker($event, 2)" :clearable="false"></DatePicker>
            </div>
            <div class="block" v-show="datePicker === 'hour'">
              <DatePicker v-model="powerHour" :editable="false" type="datetime" value-format="yyyy-MM-dd HH" format="yyyy-MM-dd HH" @on-change="handlePowerTypePicker($event, 3)" :clearable="false"></DatePicker>
            </div>
            <div class="block" v-show="datePicker === 'day'">
              <DatePicker v-model="powerDay" type="date" :editable="false" value-format="yyyy-MM-dd" @on-change="handlePowerTypePicker($event, 1)" :clearable="false"></DatePicker>
            </div>
          </div>
          <div class="block">
            <Button :type="datePicker === 'hour' ? 'success' : 'info'" class="button" @click="handleDatePicker('hour', 3)">{{ $t('hour') }}</Button>
            <Button :type="datePicker === 'day' ? 'success' : 'info'" class="button" @click="handleDatePicker('day', 1)">{{ $t('day') }}</Button>
            <Button :type="datePicker === 'month' ? 'success' : 'info'" class="button" @click="handleDatePicker('month', 2)">{{ $t('month') }}</Button>
          </div>
          <Tooltip :content="$t('export')" placement="top">
            <Button type="primary" ghost @click="handlePowerExport">
              <i class="icon-v5 icon-v5-daochu1"></i>
            </Button>
          </Tooltip>
        </Col>
      </Row>
      <Table :columns="columns4" :data="groupData" style="margin-top: 20px">
        <template slot-scope="{ row, index }" slot="operating">
          <Button type="text" @click="handleDelGroupLine(row.id, index)">
            <span style="color: #ff5b59">{{ $t('remove') }}</span>
          </Button>
        </template>
      </Table>
    </Modal>
    <Modal :title="formTitle" v-model="dialogVisible" @on-visible-change="formTitleClose">
      <Form :model="groupsForm" :label-width="80">
        <FormItem style="display: flex" :label="$t('name')">
          <Input v-model="groupsForm.name" :placeholder="$t('pleaseInputName')" />
        </FormItem>
        <FormItem style="display: flex" :label="$t('description')">
          <Input v-model="groupsForm.remark" autocomplete="off" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" v-show="formTitle === $t('editGroup')" @click="handleDetails">{{ $t('detail') }}</Button>
        <Button type="primary" @click="handleSceneCancel">{{ $t('cancel') }}</Button>
        <Button type="primary" @click="handleSceneSave">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('addDeviceLine')" v-model="addDeviceVisible" footer-hide :width="1200" :mask="false" @on-visible-change="handleClose">
      <Form :model="ruleForm" ref="ruleForm" class="rule-form" inline @submit.native.prevent>
        <FormItem>
          <Col class="left-padding-right">
            <Input v-model="ruleForm.mac" :placeholder="$t('equipmentNo')"></Input>
          </Col>
        </FormItem>
        <FormItem>
          <Col>
            <Button type="primary" @click="handleQuery">{{ $t('query') }}</Button>
          </Col>
        </FormItem>
      </Form>

      <Table :data="macLineData" :columns="columnTable" @on-selection-change="chiose">
        <template slot-scope="{ row }" slot="deviceNo">
          <div>{{ row.mac }}</div>
          <div>{{ row.name }}</div>
        </template>
        <template slot-scope="{ row }" slot="state">
          <span v-if="row.others.online === -1" style="color: #909399">{{ $t('disconnected') }}</span>
          <span v-else-if="row.others.online === 0" style="color: #f56c6c">{{ $t('offline') }}</span>
          <span v-else style="color: #21f27f">{{ $t('online') }}</span>
        </template>
        <template slot-scope="{ row }" slot="operating">
          <Button type="text" style="color: #409eff" @click="handleLine(row.mac)">{{ $t('selectLine') }}</Button>
        </template>
      </Table>
      <Page :current="currentLinePage" @on-change="changePages" :total="lineTotal" show-elevator show-total />
    </Modal>
    <Modal :title="$t('channelList')" v-model="lineListVisible" footer-hide @on-visible-change="checkedClose">
      <Row>
        <CheckboxGroup v-model="checkedAddr" @on-change="handleCheckedCitiesChange">
          <Checkbox v-for="(v, f) in addrData" :ref="`disable-${v.title}`" :label="v.addr" :key="f">
            {{ v.title }}
            <span v-if="v.gatherAddr === '-1'" class="c-warning">(D)</span>
          </Checkbox>
        </CheckboxGroup>
      </Row>
      <Row>
        <Col :span="17"></Col>
        <Col>
          <Button style="float: right" class="mr-20" @click="lineListVisible = false">{{ $t('back') }}</Button>
        </Col>
        <Col>
          <Button style="margin-left: 10px" :disabled="checkedAddr.length === 0" type="primary" @click="handleAddrSave">{{ $t('save') }}</Button>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import { queryGroup, chnlDetails, delDetail, pageBoxsSelect, queryChnlSelect, saveDetail, delGroup, addrEditGroup } from '@/api/public'
  import dayjs from 'dayjs'
  const typeConfig = { 1: 'YYYY-MM-DD', 2: 'YYYY-MM', 3: 'YYYY-MM-DD HH' }
  export default {
    name: 'Custompower',
    data() {
      return {
        columnTable: [
          { title: this.$t('equipmentNo'), slot: 'deviceNo' },
          { title: this.$t('place'), key: 'location' },
          { title: this.$t('state'), slot: 'state' },
          { title: this.$t('operation'), slot: 'operating', align: 'center' },
        ],
        formTitle: this.$t('createGroup'),
        groupsForm: { name: '', remark: '', id: '' },
        name: '',
        dialogVisible: false,
        columns4: [
          { title: this.$t('equipmentNo'), key: 'mac' },
          { title: this.$t('line'), key: 'addrTitles' },
          { title: this.$t('electricQuantity2'), key: 'power' },
          { title: this.$t('operation'), slot: 'operating' },
        ],
        groupId: '',
        groupData: [],
        groupName: '',
        groupDialog: false,
        powerDay: this.$func.getNowFormatDate(),
        powerHour: this.$func.formatDate('yyyy-MM-dd HH', new Date()),
        powerMonth: this.$func.getCurrentYearMonth(),
        dateType: 3,
        date: '',
        datePicker: 'hour',
        custEleColumns: [
          { title: this.$t('groupName'), slot: 'name' },
          { title: this.$t('description'), key: 'remark' },
          { title: this.$t('electricityStats'), key: 'statsPower' },
          { title: this.$t('operation'), slot: 'action', width: 220, align: 'center' },
        ],
        customElelList: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        formInline: { year: '', month: '' },
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
        years: [{ value: new Date().getFullYear() }, { value: new Date().getFullYear() - 1 }, { value: new Date().getFullYear() - 2 }],
        ruleForm: { mac: '' },
        addDeviceVisible: false,
        addrData: [],
        addrMac: '',
        addrList: [],
        checkedAddr: [],
        lineListVisible: false,
        lineTotal: 0,
        macLineData: [],
        pageLineSize: 20,
        currentLinePage: 1,
      }
    },
    created() {
      this.init()
    },
    methods: {
      handleReset() {
        this.formInline.year = ''
        this.formInline.month = ''
      },
      init() {
        this.formInline.year = this.years[0].value
        this.formInline.month = String(new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1))
        this.queryPowerList()
      },
      handleClose(val) {
        if (!val) {
          this.ruleForm.mac = ''
        }
      },
      checkedClose(val) {
        if (!val) {
          this.checkedAddr = []
          this.addrList = []
        }
      },
      formTitleClose(val) {
        if (!val) {
          this.groupsForm.name = ''
          this.groupsForm.remark = ''
        }
      },
      handleCheckedCitiesChange(val) {
        this.addrList = []
        if (val.length === 0) return
        if (val[0].gatherAddr === '-1') {
          for (let j = 0; j < val.length; j++) {
            for (let i = 0; i < this.addrData.length; i++) {
              if (this.addrData[i].gatherAddr === val[j].addr.toString()) {
                this.$refs[`disable-${this.addrData[i].title}`][0].disabled = true
              }
            }
          }
        } else {
          for (let j = 0; j < val.length; j++) {
            for (let i = 0; i < this.addrData.length; i++) {
              if (this.addrData[i].addr.toString() === val[j].gatherAddr) {
                this.$refs[`disable-${this.addrData[i].title}`][0].disabled = true
              }
            }
          }
        }
        if (val.length > 1) {
          for (let i = 0; i < val.length; i++) {
            for (let j = 0; j < this.addrData.length; j++) {
              if (this.addrData[j].addr.toString() === val[i].gatherAddr || val[i].addr.toString() === this.addrData[j].gatherAddr) {
                this.$refs[`disable-${this.addrData[j].title}`][0].disabled = true
              }
            }
          }
        }
        val.forEach(v => {
          this.addrList.push(v)
        })
      },
      async handleAddrSave(flag) {
        if (this.checkedAddr.length === 0) return
        let params = { groupId: this.groupId, mac: this.addrMac, addrs: this.checkedAddr.toString() }
        const res = await saveDetail(params)
        if (res.success) {
          this.checkedClose()
          this.addDeviceVisible = false
          this.handleGroupChnlDetails()
          this.lineListVisible = false
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleQuery() {
        this.currentLinePage = 1
        this.querySelectDevice()
      },
      chiose(e) {},
      async handleLine(mac) {
        this.addrData = []
        this.addrMac = mac
        this.lineListVisible = true
        const res = await queryChnlSelect({ mac })
        if (res.success) {
          this.addrData = res.data || []
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleCommand(command) {
        if (command === 'current') {
          this.$func.windowCountDown('/stats-group/export.as?projectCode=' + this.$store.state.projectCode + '&year=' + this.formInline.year + '&month=' + this.formInline.month + '&pageSize=' + this.pageSize + '&pageNo=' + this.currentPage)
        }
        if (command === 'all') {
          this.$func.windowCountDown('/stats-group/export.as?projectCode=' + this.$store.state.projectCode + '&year=' + this.formInline.year + '&month=' + this.formInline.month + '&pageSize=' + this.pageSize + '&pageNo=' + this.currentPage + '&exportType=exportAll')
        }
      },
      handleCloseAddr() {
        this.datePicker = 'hour'
        this.dateType = 3
        this.powerHour = this.$func.formatDate('yyyy-MM-dd HH', new Date())
        this.powerDay = this.$func.getNowFormatDate()
        this.powerMonth = this.$func.getCurrentYearMonth()
        this.date = this.powerHour
      },
      handlePowerExport() {
        this.date = this.date ? this.date : this.$func.formatDate('yyyy-MM-dd HH', new Date())
        this.$func.windowCountDown('/stats-group/export/chnlDetails.as?projectCode=' + this.$store.state.projectCode + '&groupId=' + this.groupId + '&oqp1=' + this.$store.state.projectName + '&dateType=' + this.dateType + '&date=' + this.date)
      },
      async handleDelGroupLine(id) {
        let params = { groupDetailId: id }
        const res = await delDetail(params)
        if (res.success) {
          this.handleGroupChnlDetails()
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleDatePicker(val, type) {
        this.dateType = type
        const valueConfig = { day: 'powerDay', month: 'powerMonth', hour: 'powerHour' }
        this[valueConfig[val]] = dayjs(new Date()).format(typeConfig[type])
        this.date = dayjs(this[valueConfig[val]]).format(typeConfig[type])
        this.datePicker = val
        this.handleGroupChnlDetails()
      },
      handlePowerTypePicker(val, type) {
        this.dateType = type
        this.date = dayjs(val).format(typeConfig[type])
        this.handleGroupChnlDetails()
      },
      handleSelectDevice() {
        this.addDeviceVisible = true
        this.querySelectDevice()
      },
      async querySelectDevice() {
        let params = {
          projectCode: this.$store.state.projectCode,
          key: this.ruleForm.mac,
          pageNo: this.currentLinePage,
          pageSize: 10,
          nodeId: '',
        }
        const res = await pageBoxsSelect(params)
        if (res.success) {
          this.macLineData = res.datas
          this.macLineData.forEach(item => {
            item.location = item.build + ',' + item.unit + ',' + item.room
          })
          this.lineTotal = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryPowerList() {
        if (!this.formInline.year) {
          this.$Message.error({ content: this.$t('pleaseSelectYear') })
          return false
        }
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          year: this.formInline.year ? this.formInline.year : new Date().getFullYear(),
          month: this.formInline.month ? this.formInline.month : '01',
          projectCode: this.$store.state.projectCode,
        }
        const res = await queryGroup(params)
        if (res.success) {
          this.customElelList = res.datas.map(item => ({ ...item, statsPower: item.others.statsPower }))
          this.total = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleViewGroup(name, id) {
        this.groupDialog = true
        this.groupId = id
        // '分组名：{groupName}的线路电量明细'
        this.groupName = this.$t('powerPageCombineTitle', { groupName: name })
        this.handleGroupChnlDetails()
      },
      async handleGroupChnlDetails() {
        this.groupData = []
        let params = { dateType: this.dateType, date: this.date ? this.date : this.$func.formatDate('yyyy-MM-dd HH', new Date()), groupId: this.groupId }
        const res = await chnlDetails(params)
        if (res.success) {
          this.groupData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleAddEdit(obj) {
        this.dialogVisible = true
        if (obj.id) {
          this.formTitle = this.$t('editGroup')
          this.groupsForm.id = obj.id
          this.groupsForm.name = obj.name
          this.groupsForm.remark = obj.remark
          this.name = obj.name
          this.groupId = obj.id
        } else {
          this.groupsForm.id = ''
          this.groupsForm.name = ''
          this.groupsForm.remark = ''
          this.formTitle = this.$t('createGroup')
        }
      },
      handleDetails() {
        this.dialogVisible = false
        this.groupDialog = true
        this.handleViewGroup(this.name, this.groupId)
      },
      handleSceneCancel() {
        this.dialogVisible = false
        this.groupsForm.name = ''
        this.groupsForm.remark = ''
      },
      async handleSceneSave() {
        if (this.groupsForm.name === '') {
          this.$Message.error({ content: this.$t('enterGroupName') })
          return false
        }
        let params = { name: this.groupsForm.name, remark: this.groupsForm.remark, groupId: this.groupsForm.id, projectCode: this.$store.state.projectCode }
        const res = await addrEditGroup(params)
        if (res.success) {
          this.handleSceneCancel()
          this.queryPowerList()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleDelGroup(id) {
        let params = { groupId: id }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmRemoveGroup'),
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            const res = await delGroup(params)
            if (res.success) {
              this.queryPowerList()
            } else {
              this.$Message.error({ content: res.message })
            }
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('cancelRemove') })
          },
        })
      },
      changePage(val) {
        this.currentPage = val
        this.queryPowerList()
      },
      changePages(e) {
        this.currentLinePage = e
        this.querySelectDevice()
      },
      changesize(val) {
        this.pageSize = val
        this.queryPowerList()
      },
    },
  }
</script>

<style lang="less" scoped>
  .custom-power {
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
  .button {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 0 8px;
    margin-right: 10px;
  }
  .pickDate {
    display: flex;
    justify-content: space-between;
  }
</style>
