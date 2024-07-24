<template>
  <div id="overview">
    <Breadcrumb separator-class="el-icon-arrow-right">
      <BreadcrumbItem class="pointer" @click.native="$router.push('/visualScreen')">{{ $t('back') }}</BreadcrumbItem>
      <BreadcrumbItem>{{ $t('projectOverview') }}</BreadcrumbItem>
    </Breadcrumb>
    <div class="tableContent">
      <div class="ivu-row">
        <div v-if="foldPull" class="left-group-model">
          <div class="tableH">
            <div class="group-class" v-if="foldPull">
              <div class="icon-v5 pointer mr10" :class="foldPull ? 'icon-v5-shouqi-01-copy' : 'icon-v5-shouqi2-01'" @click="foldPull = !foldPull"></div>
              <Menu mode="horizontal" class="ml-10" @on-select="changeGroupModel" :active-name="groupModel">
                <MenuItem name="address">{{ $t('positionStructureTree') }}</MenuItem>
                <Submenu name="other">
                  <span slot="title" :class="{ active: groupClassName }">{{ groupClassName || $t('pleaseSelect') }}</span>
                  <MenuItem v-for="it in groupModels" :name="it.id" :key="it.id">{{ it.groupName }}</MenuItem>
                </Submenu>
              </Menu>
            </div>
            <div v-if="foldPull" class="icon-v5 mr10 pointer icon-v5-shezhi" @click="showModelGroupList"></div>
          </div>
          <div class="tree-box-bottom">
            <vue-easy-tree
              height="calc(100vh - 170px)"
              ref="TreeProject"
              class="TreeView"
              v-if="groupModel === 'address'"
              default-expand-all
              highlight-current
              node-key="nodeId"
              key="address"
              :expand-on-click-node="false"
              :current-node-key="projectInfo.nodeId"
              :data="addressTreeData"
              @node-click="selectAddressTreeItem">
              <div class="custom-tree-node" v-textRoll slot-scope="{ data }">
                {{ data.label }}
              </div>
            </vue-easy-tree>
            <vue-easy-tree :key="groupModel" height="calc(100vh - 170px)" class="TreeView" v-else :data="groupClassTreeData" :indent="10" highlight-current default-expand-all node-key="nodeId" :current-node-key="projectInfo.nodeId" :expand-on-click-node="false" @node-click="selectCustomTreeItem">
              <div class="custom-tree-node" slot-scope="{ data }">
                <div class="label-title" v-textRoll :title="data.label">
                  {{ data.label }}
                </div>
                <div class="handle-button" v-if="!data.projectCode">
                  <Button type="text" style="color: #2d8cf0" @click.stop="addGroupItemChildren(data)"><Icon type="md-add-circle" /></Button>
                  <Button type="text" style="color: #2d8cf0" @click.stop="editGroupItemChildren(data)" v-if="data.parentId !== 0"><Icon type="ios-create" /></Button>
                  <Button type="text" style="color: #ed4014" @click.stop="delGroupItemChildren(data)" v-if="data.parentId !== 0"><Icon type="ios-trash" /></Button>
                </div>
              </div>
            </vue-easy-tree>
          </div>
        </div>
        <div class="right-project-table-box" :style="{ width: foldPull ? 'calc(100% - 400px)' : '100%' }">
          <div class="project-table-list" v-if="!showProjectDetail">
            <Row class="header">
              <Col class="df">
                <Form :inline="true" label-width="auto" :model="form" class="demo-form-inline hForm" @submit.native.prevent>
                  <div class="flex-form">
                    <div v-if="!foldPull" class="icon-v5 pointer mr10" :class="foldPull ? 'icon-v5-shouqi-01-copy' : 'icon-v5-shouqi2-01'" @click="foldPull = !foldPull"></div>
                    <FormItem :label="$t('projectName')">
                      <Select :clearable="true" @on-change="handleKeyword" filterable v-model="overviewDatas.queryParams.projectName" :placeholder="$t('enterProjectName')" style="width: 200px">
                        <Option v-for="item in projectNames" :key="item.projectCode" :label="item.projectName" :value="item.projectName"></Option>
                      </Select>
                    </FormItem>
                    <FormItem class="ml-10" :label="$t('projectAddress')">
                      <Input v-model="overviewDatas.queryParams.address" style="width: 200px" :placeholder="$t('enterProjectAddress')"></Input>
                    </FormItem>
                    <Button type="primary" class="ml-10" @click="queryOverview">{{ $t('query') }}</Button>
                    <Button class="ml-10" @click="handleReset">{{ $t('reset') }}</Button>
                  </div>
                  <div>
                    <FormItem>
                      <div class="export">
                        <Dropdown placement="bottom" @on-click="handleCommand">
                          <a href="javascript:void(0)">
                            <Icon custom="icon-v5 icon-v5-daochu2" size="20" class="buts" />
                          </a>
                          <DropdownMenu slot="list">
                            <DropdownItem name="current">{{ $t('exportCurrent') }}</DropdownItem>
                            <DropdownItem name="all">{{ $t('exportAll') }}</DropdownItem>
                            <DropdownItem name="device">{{ $t('exportProjectElectricity') }}</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </FormItem>
                  </div>
                </Form>
              </Col>
            </Row>
            <Table :data="overviewDatas.list" :columns="columns" :max-height="tableHeight">
              <template slot-scope="{ row }" slot="name">
                <div style="width: 100%; overflow: hidden">
                  <div v-textRoll class="pointer" @click="handleSelect(row)">{{ row.name }}</div>
                </div>
              </template>
              <template slot-scope="{ row }" slot="address">
                <div style="width: 100%; overflow: hidden">
                  <div v-textRoll class="pointer">{{ row.others.address }}</div>
                </div>
              </template>
              <template slot-scope="{ row }" slot="prjContact">
                <div class="text-center">{{ row.prjManager || row.linkMan2 || row.linkMan3 }}</div>
                <div class="text-center">{{ row.prjTel || row.linkTel2 || row.linkTel3 }}</div>
              </template>
              <template slot-scope="{ row }" slot="totalBoxNum">
                <span class="pointer" @click="handleDevices(row, '')">{{ row.others.totalBoxNum }}</span>
              </template>
              <template slot-scope="{ row }" slot="online">
                <span class="pointer" @click="handleDevices(row, '1')">{{ row.others.totalBoxOnlineNum }}</span>
              </template>
              <template slot-scope="{ row }" slot="boxOnlineRate">
                <span class="pointer">{{ row.others.boxOnlineRate }}</span>
              </template>
              <template slot-scope="{ row }" slot="totalAlarmNum">
                <span class="pointer" @click="handleAlarm(row, '')">{{ row.others.totalAlarmNum }}</span>
              </template>
              <template slot-scope="{ row }" slot="alarmProcessedNum">
                <span class="pointer" @click="handleAlarm(row, '2')">{{ row.others.alarmProcessedNum }}</span>
              </template>

              <template slot-scope="{ row }" slot="alarmProcessedRate">
                <span class="pointer">{{ row.others.alarmProcessedRate }}</span>
              </template>

              <template slot-scope="{ row }" slot="alarmUnprocessedNum">
                <span class="pointer" @click="handleAlarm(row, '0')">{{ row.others.alarmUnprocessedNum }}</span>
              </template>

              <template slot-scope="{ row }" slot="maintainNum">
                <span class="pointer" @click="handleMore(row)">{{ row.others.maintainNum }}</span>
              </template>
              <template slot-scope="{ row }" slot="yesterdayPower">
                <span class="pointer">{{ row.others.yesterdayPower }}</span>
              </template>
              <template slot-scope="{ row }" slot="thisMonthPower">
                <span class="pointer">{{ row.others.thisMonthPower }}</span>
              </template>
            </Table>
            <div class="block tc mt-10" style="padding: 20px; padding-top: 0px">
              <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current="overviewDatas.pageNo" :page-size-opts="[10, 20, 50, 100, 500]" :page-size="overviewDatas.pageSize" :total="overviewDatas.total" show-sizer show-elevator show-total></Page>
            </div>
          </div>
          <div v-else class="project-info-box">
            <project-info :projectInfo="projectInfo">
              <template #foldBtn>
                <div v-if="!foldPull" class="icon-v5 pointer mr10" :class="foldPull ? 'icon-v5-shouqi-01-copy' : 'icon-v5-shouqi2-01'" @click="foldPull = !foldPull"></div>
              </template>
            </project-info>
          </div>
        </div>
      </div>
    </div>

    <Modal v-model="exportRangeFlags" :title="$t('exportProjectElectricityStatistical')" footer-hide>
      <Row>
        <Col :span="3">
          <Button :type="monthColor" shape="circle" @click="getMonthValue">{{ $t('month') }}</Button>
        </Col>
        <Col :span="3">
          <Button :type="yearColor" shape="circle" @click="getYearValue">{{ $t('year') }}</Button>
        </Col>
        <Col :span="8" v-if="!dateValue">
          <DatePicker type="year" format="yyyy" v-model="valueYear" :placeholder="$t('plsSelectYear')"></DatePicker>
        </Col>
        <Col :span="8" v-if="dateValue">
          <DatePicker type="month" format="yyyy-MM" v-model="valueMonth" :placeholder="$t('plsSelectMonth')"></DatePicker>
        </Col>
        <Col :span="5" style="margin-left: 10px">
          <Button type="primary" @click="handleExportRange">{{ $t('export') }}</Button>
        </Col>
      </Row>
    </Modal>

    <Modal v-model="projectVisible" :title="$t('projectStructureTreeConfiguration')" width="1200px" class="projectVisible">
      <Row>
        <Col :span="7" class="left">
          <div class="leftTreeView">
            <Tree :expand="true" :data="customData" @on-select-change="handleNodeCustom" :render="renderContent" ref="tree"></Tree>
          </div>
          <Button class="ButtonAdd" style="padding: 0" type="text" @click="append('1', nodeData)">{{ $t('addProjectGroup') }}</Button>
        </Col>
        <Col :span="17" class="right">
          <Row class="header">
            <div>
              <Input v-model="treeKeyWrod" @keyup.enter.native="handleSearch" style="width: 260px" :placeholder="$t('projectNameOrProjectNo')" />
              <Button type="primary" class="ml-10" @click="handleSearch">{{ $t('query') }}</Button>
            </div>
            <div>
              <Button type="primary" :disabled="!treeGroupId" class="ml-10" @click="handleConfiguration">{{ $t('configuration') }}</Button>
            </div>
          </Row>
          <Table height="600px" class="overviewTable" :data="groupData" :columns="groupColumns">
            <template slot-scope="{ row }" slot="action">
              <span class="pointer c-primary" @click="handleRemove(row)">{{ $t('remove') }}</span>
            </template>
          </Table>
          <Page show-total :current="current" @on-change="changePages" :total="total" show-elevator />
        </Col>
      </Row>
    </Modal>

    <Modal class="configurationVisible" v-model="configurationVisible" :title="$t('groupConfigurationTitle', { name: nodeCustomName })" @on-ok="queryOverview" @on-cancel="handleCloseConfiguration">
      <Transfer :data="transferData" :target-keys="targetKeys" :render-format="render" @on-change="handleChange"></Transfer>
    </Modal>
    <Modal v-model="groupClassVisible" :title="$t('groupManage')" width="800" footer-hide>
      <Table max-height="500" class="overviewTable" :data="groupModelsTable" :columns="groupClassColumns">
        <template #groupName="{ row }">
          <span v-if="!row.isEdit">{{ row.groupName }}</span>
          <Input v-if="row.isEdit" v-model="row.groupName" />
        </template>
        <template #handleSlot="{ row, index }">
          <div style="display: flex; justify-content: center">
            <Button type="primary" v-if="row.isEdit" ghost size="small" @click.stop="saveGroupItem(row, index)">{{ $t('save') }}</Button>
            <Button type="primary" v-if="!row.isEdit" ghost size="small" @click.stop="editGroupItem(row, index)">{{ $t('edit') }}</Button>
            <Button type="error" size="small" class="ml-10" ghost @click.stop="delGroupItem(row, index)">{{ $t('delete') }}</Button>
          </div>
        </template>
      </Table>
      <Button type="primary" style="margin-top: 10px" ghost long @click.stop="addGroupItem">{{ $t('addGroup') }}</Button>
    </Modal>

    <Modal v-model="addGroupItemChildrenVisible" class-name="add-group-node-model" :title="groupNodeFormData.nodeId ? $t('editChildNode') : $t('addChildNode')" width="1200px" footer-hide>
      <div class="add-project-node">
        <Form :model="groupNodeFormData">
          <FormItem :label="$t('nodeName')">
            <Input v-model="groupNodeFormData.nodeName" style="width: 300px" :placeholder="$t('enterNodeName')"></Input>
          </FormItem>
        </Form>
        <div class="select-project">
          <div class="left-box">
            <div class="title mb-10">{{ $t('unselectedProject') }}</div>
            <div class="search-form mt-10">
              <Form :model="projectData.queryParams" class="hForm" @submit.native.prevent>
                <FormItem :label="$t('projectName')">
                  <Input v-model="projectData.queryParams.projectName" style="width: 300px" :placeholder="$t('enterProjectName')"></Input>
                  <Button type="primary" class="ml-10" @click.stop="queryProjectList">{{ $t('query') }}</Button>
                  <Button class="ml-10" @click="queryReset">{{ $t('reset') }}</Button>
                </FormItem>
              </Form>
            </div>
            <Table :data="projectDataComputed" class="can-select-table" :columns="projectColumns" :max-height="480" @on-selection-change="changSelectProject">
              <!-- <template #selectBox="{ row }">
                <div @click="selectThis(row)">
                  <Checkbox v-model="row._checked" :disabled="row._disabled">
                    {{ row.tableListIndex }}
                  </Checkbox>
                </div>
              </template> -->
            </Table>
            <!-- <Page show-total :current="projectData.pageNo" @on-change="changeProjectPages" :total="projectData.total" show-elevator /> -->
          </div>
          <div class="center-box">
            <div>
              <div>
                <Button type="text" :disabled="!selectProjectTemp.length" @click.stop="pushSelectRight">
                  <Icon custom="icon-v5 icon-v5-youyi-01" size="30" class="buts" />
                </Button>
              </div>
              <div class="mt-10">
                <Button type="text" :disabled="!selectBackProjectTemp.length" @click.stop="delSelectRight">
                  <Icon custom="icon-v5 icon-v5-zuoyi-01" size="30" class="buts" />
                </Button>
              </div>
            </div>
          </div>
          <div class="right-box">
            <div class="title">{{ $t('selectedProject') }}</div>
            <Table :data="selectProjectData" :columns="selectProjectColumns" :max-height="564" @on-selection-change="backSelectProject"></Table>
          </div>
        </div>
        <div class="footer-box">
          <Button @click.stop="saveProjectGroupChildren" type="primary" ghost>{{ $t('confirm') }}</Button>
          <Button @click.stop="addGroupItemChildrenVisible = false" class="ml-10">{{ $t('cancel') }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  import store from '@/store'
  import {
    saveProjectGroupTreeNode,
    addProjectGroupTreeNode,
    removeProjectGroupTreeNode,
    loadProjectGroupTree,
    removeStaffProjectGroup,
    addStaffProjectGroup,
    loadAllLocationTree,
    saveProjectGroupTree,
    getStaffProjectGroupList,
    getLeftTreeView,
    queryProjectDetails,
    loadTree,
    saveProjectGroup,
    delProjectGroup,
    pageRsOfProject,
    pageProject4SelectOfGroup,
    saveProjectOfGroup,
    queryGroupProjectNodes,
  } from '@/api/visualScreen/index'
  import projectInfo from './projectOverview/projectInfo.vue'
  import { projectIndexDB } from '@/plugins/indexDB/index'
  export default {
    components: {
      projectInfo,
    },
    data() {
      return {
        current: 1,
        valueYear: this.$Date().format('YYYY'),
        valueMonth: this.$Date().format('YYYYMMDD'),
        dateValue: true,
        monthColor: 'success',
        yearColor: 'default',
        exportRangeFlags: false,
        groupData: [],
        groupColumns: [
          { title: this.$t('projectCode'), key: 'prjCode', width: 150, align: 'center' },
          { title: this.$t('projectName'), key: 'prjName', align: 'center' },
          { title: this.$t('currentGroup'), key: 'groupName', align: 'center' },
          { title: this.$t('operation'), slot: 'action', align: 'center' },
        ],
        arrData: [],
        leftArrData: [],
        treeData: [],
        nodeTreeData: [],
        customData: [],
        nodeData: [],
        defaultProps: { children: 'children', label: 'label' },
        form: {
          projectName: '',
          projectCode: this.$store.state.projectCode,
          mac: '',
        },
        groupId: '',
        loading: false,
        overviewDatas: {
          list: [],
          total: 0,
          pageNo: 1,
          pageSize: 10,
          queryParams: { projectName: '', provinceId: '', cityId: '', countyId: '', projectCodeList: null, address: '' },
        },
        projectNames: [],
        dialogVisible: false,
        longitude: '',
        latitude: '',
        currentPage: 1,
        firstCurrentPage: 1,
        secondCurrentPage: 1,
        pageSize: 10,
        total: 0,
        timerID: null,
        foldFlag: false,
        projectVisible: false,
        configurationVisible: false,
        flag_index: -1,
        customTotal: 0,
        treeGroupId: '',
        treeKeyWrod: '',
        configurationVal: '',
        configurationData: [],
        configurationTotal: '',
        multipleSelection: '',
        nodeCustomName: '',
        columns: [
          { title: this.$t('projectName'), slot: 'name', minWidth: 200, align: 'center' },
          { title: this.$t('createdTime'), key: 'createTime', align: 'center', minWidth: 200 },
          { title: this.$t('place'), slot: 'address', align: 'center', width: 240 },
          { title: this.$t('projectContact'), slot: 'prjContact', width: 150, align: 'center' },
          { title: this.$t('totalDevice'), slot: 'totalBoxNum', align: 'center', minWidth: 120 },
          { title: this.$t('numOfOnlineDevice'), slot: 'online', align: 'center', minWidth: 120 },
          { title: this.$t('onlineRate'), slot: 'boxOnlineRate', align: 'center', minWidth: 120 },
          { title: this.$t('numberOfAlarmsInThisMonth'), slot: 'totalAlarmNum', align: 'center', minWidth: 120 },
          { title: this.$t('alarmProcessedNum'), slot: 'alarmProcessedNum', align: 'center', minWidth: 120 },
          { title: this.$t('alarmProcessedRate'), slot: 'alarmProcessedRate', align: 'center', minWidth: 120 },
          { title: this.$t('alarmNotProcessedNum'), slot: 'totalAlarmNum', align: 'center', minWidth: 120 },
          { title: this.$t('maintenanceRecords'), slot: 'maintainNum', align: 'center', minWidth: 120 },
          { title: this.$t('yesterdayElectricity'), slot: 'yesterdayPower', align: 'center', minWidth: 120 },
          { title: this.$t('electricityMonth') + '(kW·h)', slot: 'thisMonthPower', align: 'center', minWidth: 150 },
        ],
        foldPull: true,
        transferData: [],
        targetKeys: [],
        disData: '',
        groupModels: [],
        groupModel: +window.sessionStorage.getItem('view-project-source-type') || 'address',
        addressTreeData: [],
        groupModelsTable: [],
        tableHeight: 500,
        groupClassVisible: false,
        groupClassColumns: [
          { title: this.$t('createdTime'), key: 'createTime', width: 200, align: 'center' },
          { title: this.$t('groupName'), slot: 'groupName', align: 'center' },
          { title: this.$t('operation'), slot: 'handleSlot', width: 200, align: 'center' },
        ],
        groupClassTreeData: [],
        addGroupItemChildrenVisible: false,
        groupNodeFormData: { nodeName: '', parentId: '', type: 'dir', leaf: false, groupId: '', nodeId: null },
        projectColumns: [
          { type: 'selection', width: 60, align: 'center' },
          // { title: '', width: 60, align: 'center', slot: 'selectBox' },
          { title: this.$t('projectName'), key: 'name', align: 'center' },
          { title: this.$t('createdTime'), key: 'createTime', align: 'center' },
        ],
        selectProjectColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: this.$t('projectName'), key: 'name', align: 'center' },
        ],
        projectData: { list: [], total: 0, pageSize: 10000, pageNo: 1, queryParams: { projectName: '', projectCode: '' } },
        selectProjectData: [],
        selectProjectTemp: [],
        selectBackProjectTemp: [],
        showProjectDetail: false,
        projectInfo: {},
        canPickProjectCode: [],
        seed: 0,
      }
    },
    computed: {
      groupClassName() {
        let obj = this.groupModels.find(it => it.id === this.groupModel)
        return (obj && obj.groupName) || ''
      },
      projectDataComputed() {
        return this.projectData.list.map(it => {
          let hasSelect = this.selectProjectData.find(item => it.code === item.code)
          let canSelect = this.canPickProjectCode.includes(it.code)
          return { ...it, _disabled: !canSelect || !!hasSelect, _checked: !!hasSelect }
        })
      },
    },
    async created() {
      this.projectNames = JSON.parse(await projectIndexDB.getItem('checkedProjectStr')) || []
    },
    mounted() {
      this.init()
      this.handleGetLeftTree()
      this.getProjectGroupList()
      this.initAllLocation()
      this.tableHeight = document.body.clientHeight - 230
    },
    methods: {
      changeGroupModel(e) {
        this.groupModel = e
      },
      changePages(e) {
        let params = { pageNo: e, params: { groupId: this.treeGroupId, keyword: this.treeKeyWrod } }
        this.handleSelectOfGroup(params)
      },
      async getProjectGroupList() {
        let res = await getStaffProjectGroupList()
        if (res.success) {
          this.groupModels = [...res.data]
          this.groupModelsTable = [...res.data.map(it => ({ ...it, isEdit: false }))]
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleLocTree(list = []) {
        return list.map(it => {
          let obj = { ...it, nodeId: this.seed++, label: it.name, value: it.id, title: it.name, expand: true }
          if (it.childs && Array.isArray(it.childs)) {
            obj.children = [...this.handleLocTree(it.childs)]
          }
          if (it.projects && Array.isArray(it.projects) && it.projects.length) {
            obj.children = [...it.projects.map(it => ({ ...it, nodeId: it.projectCode, label: it.projectName, title: it.projectName }))]
          }
          return obj
        })
      },
      async initAllLocation() {
        let res = await loadAllLocationTree()
        if (res.success) {
          this.addressTreeData = [{ title: this.$t('whole'), nodeId: 'all', label: this.$t('whole'), expand: true, children: [...this.handleLocTree(res.data.locTree)] }]
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      showModelGroupList() {
        this.groupClassVisible = true
        this.getProjectGroupList()
      },
      selectAddressTreeItem(data, node, self) {
        if (data.projectCode) {
          this.showProjectDetail = true
          this.projectInfo = data
        } else {
          this.showProjectDetail = false
          this.overviewDatas.queryParams.provinceId = ''
          this.overviewDatas.queryParams.cityId = ''
          this.overviewDatas.queryParams.countyId = ''
          this.overviewDatas.queryParams.projectName = ''
          this.overviewDatas.queryParams.projectCodeList = null
          this.overviewDatas.queryParams.address = ''
          this.overviewDatas.pageNo = 1
          this.overviewDatas.queryParams.provinceId = data.type === 'province' ? data.id : ''
          this.overviewDatas.queryParams.cityId = data.type === 'city' ? data.id : ''
          this.overviewDatas.queryParams.countyId = data.type === 'county' ? data.id : ''
          this.queryOverview()
        }
      },
      addGroupItemChildren(data) {
        this.groupNodeFormData.nodeName = ''
        this.groupNodeFormData.nodeId = null
        this.groupNodeFormData.parentId = data.nodeId
        this.groupNodeFormData.type = 'dir'
        this.groupNodeFormData.leaf = false
        this.groupNodeFormData.groupId = this.groupModel
        this.addGroupItemChildrenVisible = true
        this.selectProjectData = []
        this.selectProjectTemp = []
        this.selectBackProjectTemp = []
        this.canPickProjectCode = [...this.groupClassTreeData[0].projects.map(it => it.projectCode)]
        this.queryProjectList()
      },
      editGroupItemChildren(data) {
        this.groupNodeFormData.nodeName = data.nodeName
        this.groupNodeFormData.nodeId = data.nodeId
        this.groupNodeFormData.parentId = data.parentId
        this.groupNodeFormData.groupId = this.groupModel
        this.groupNodeFormData.type = data.nodeType
        this.groupNodeFormData.leaf = data.leaf
        this.addGroupItemChildrenVisible = true
        this.selectProjectTemp = []
        this.selectBackProjectTemp = []
        this.selectProjectData = [...data.projects.filter(it => it.leaf).map(it => ({ name: it.nodeName, code: it.projectCode, createTime: it.createTime }))]
        this.canPickProjectCode = [...this.selectProjectData.map(it => it.code), ...this.groupClassTreeData[0].projects.map(it => it.projectCode)]
        this.queryProjectList()
      },
      editGroupItem(row, index) {
        this.groupModelsTable[index].isEdit = true
      },
      saveGroupItem(row, index) {
        if (!row.groupName) {
          return this.$Message.error({ content: this.$t('enterGroupName') })
        }
        if (
          this.groupModelsTable
            .filter((it, i) => i !== index)
            .map(it => it.groupName)
            .includes(row.groupName)
        ) {
          return this.$Message.error({ content: this.$t('groupNamesCannotBeDuplicated') })
        }
        if (row.id) {
          saveProjectGroupTree({ groupId: row.id, groupName: row.groupName }).then(res => {
            if (res.success) {
              this.getProjectGroupList()
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        } else {
          addStaffProjectGroup({ groupName: row.groupName }).then(res => {
            if (res.success) {
              this.getProjectGroupList()
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        }
      },
      addGroupItem() {
        this.groupModelsTable.push({ id: null, groupName: '', createTime: '-', isEdit: true })
      },
      delGroupItem(row, index) {
        if (row.id) {
          this.$Modal.confirm({
            title: this.$t('tip'),
            content: this.$t('deleteGroupTip'),
            onOk: () => {
              removeStaffProjectGroup({ ...row }).then(res => {
                if (res.success) {
                  this.getProjectGroupList()
                } else {
                  this.$Message.error({ content: res.message })
                }
              })
            },
          })
        } else {
          this.groupModelsTable.splice(index, 1)
        }
      },
      handleGroupTree(list = []) {
        return {
          children: list.map(it => {
            let obj = { ...it, label: it.nodeName, title: it.nodeName, ...this.handleGroupTree(it.children) }
            return obj
          }),
          projects: list.filter(it => it.leaf),
        }
      },
      async getProjectGroupTree(groupId) {
        let res = await loadProjectGroupTree({ groupId })
        if (res.success) {
          this.groupClassTreeData = [{ ...res.data, label: res.data.nodeName, title: res.data.nodeName, ...this.handleGroupTree(res.data.children) }]
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changeProjectPages(e) {
        this.projectData.pageNo = e
        this.queryProjectList()
      },
      getChildrenProjectCode(childrenList, projectCodes = []) {
        childrenList.forEach(it => {
          projectCodes = [...projectCodes, ...it.projects]
          if (it.children && it.children.length > 0) {
            projectCodes = [...projectCodes, ...this.getChildrenProjectCode(it.children)]
          }
        })
        return projectCodes
      },
      selectCustomTreeItem(data, node, self) {
        if (data.projectCode) {
          this.showProjectDetail = true
          this.projectInfo = data
        } else {
          this.showProjectDetail = false
          this.overviewDatas.queryParams.cityId = ''
          this.overviewDatas.queryParams.provinceId = ''
          this.overviewDatas.queryParams.projectName = ''
          this.overviewDatas.queryParams.countyId = ''
          this.overviewDatas.queryParams.address = ''
          this.overviewDatas.pageNo = 1
          if (data.parentId === 0) {
            this.overviewDatas.queryParams.projectCodeList = null
          } else {
            this.overviewDatas.queryParams.projectCodeList = this.getChildrenProjectCode([data]).map(it => it.projectCode)
          }
          this.queryOverview()
        }
      },
      queryReset() {
        this.projectData.queryParams.projectName = ''
        this.queryProjectList()
      },
      changSelectProject(e) {
        let eArr = e.filter(it => !it._checked && !it._disabled)
        this.selectProjectTemp = JSON.parse(JSON.stringify(eArr))
      },
      backSelectProject(e) {
        this.selectBackProjectTemp = JSON.parse(JSON.stringify(e))
      },
      pushSelectRight() {
        if (this.selectProjectTemp.length) {
          this.selectProjectTemp.forEach(it => {
            if (!this.selectProjectData.find(item => item.code === it.code)) {
              this.selectProjectData.push(JSON.parse(JSON.stringify(it)))
            }
          })
          this.selectProjectTemp = []
        } else {
          this.$Message.error({ content: this.$t('pleaseSelectProject') })
        }
      },
      delSelectRight() {
        if (this.selectBackProjectTemp.length) {
          this.selectBackProjectTemp.forEach(it => {
            let findIndex = this.selectProjectData.findIndex(item => item.code === it.code)
            if (findIndex > -1) {
              this.selectProjectData.splice(findIndex, 1)
            }
          })
          this.selectBackProjectTemp = []
        } else {
          this.$Message.error({ content: this.$t('pleaseSelectProjectForRemove') })
        }
      },
      saveProjectGroupChildren() {
        if (!this.groupNodeFormData.nodeName) {
          this.$Message.error({ content: this.$t('enterNodeName') })
          return
        }
        if (!this.groupNodeFormData.nodeId) {
          // 新增
          let params = {
            ...this.groupNodeFormData,
            children: this.selectProjectData.map(it => {
              return { nodeName: it.name, projectCode: it.code, type: 'prj', leaf: true, groupId: this.groupNodeFormData.groupId }
            }),
          }
          addProjectGroupTreeNode(params).then(res => {
            if (res.success) {
              this.getProjectGroupTree(this.groupNodeFormData.groupId)
              this.$Message.success({ content: res.message })
              this.addGroupItemChildrenVisible = false
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        } else {
          // 编辑
          let params = {
            ...this.groupNodeFormData,
            children: this.selectProjectData.map(it => {
              return { nodeName: it.name, projectCode: it.code, type: 'prj', leaf: true, groupId: this.groupNodeFormData.groupId }
            }),
          }
          saveProjectGroupTreeNode(params).then(res => {
            if (res.success) {
              this.getProjectGroupTree(this.groupNodeFormData.groupId)
              this.$Message.success({ content: res.message })
              this.addGroupItemChildrenVisible = false
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        }
      },
      delGroupItemChildren(data) {
        let { nodeId, groupId, parentId, nodeName, type, leaf } = data
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('deleteNodeTip'),
          onOk: () => {
            removeProjectGroupTreeNode({ nodeId, groupId, parentId, nodeName, type, leaf }).then(res => {
              if (res.success) {
                this.getProjectGroupTree(this.groupModel)
              } else {
                this.$Message.error({ content: res.message })
              }
            })
          },
        })
      },
      renderContent(h, { root, node, data }) {
        return h(
          'span',
          {
            style: { display: 'inline-block', width: '100%' },
            on: {
              click: e => {
                this.disData = node.node
              },
            },
          },
          [
            h('span', [
              h('span', data.title),
              h('div', { style: { display: data.flag ? 'inline-block' : 'none', width: '100%' } }, [
                h('Icon', {
                  props: { type: 'md-add' },
                  style: { marginLeft: '32px', marginRight: '8px' },
                  on: {
                    click: () => {
                      this.append('2', data)
                    },
                  },
                }),
                h('Icon', {
                  props: { custom: 'icon-v5 icon-v5-xiugai' },
                  style: { marginRight: '8px' },
                  on: {
                    click: () => {
                      this.rename(node, data)
                    },
                  },
                }),
                h('Icon', {
                  props: { custom: 'icon-v5 icon-v5-changyonggoupiaorenshanchu' },
                  style: { marginRight: '8px' },
                  on: {
                    click: () => {
                      this.deletes(data)
                    },
                  },
                }),
              ]),
            ]),
          ]
        )
      },
      rename(node, data) {
        this.$Modal.confirm({
          render: h => {
            return h('div', [
              h('div', {
                domProps: { innerHTML: this.$t('tip') },
                style: { marginBottom: '15px' },
              }),
              h('div', {
                domProps: { innerHTML: this.$t('pleaseEnterCustomName') },
                style: { marginBottom: '15px' },
              }),
              h('Input', {
                props: { value: data.title, autofocus: true },
                on: {
                  input: val => {
                    this.value = val
                  },
                },
              }),
            ])
          },
          onOk: () => {
            saveProjectGroup({ id: data.id, name: this.value }).then(res => {
              if (res.code === '0') {
                this.$Message.success({ content: res.message })
              } else {
                this.$Message.error({ content: res.message })
              }
              this.handleGetLeftTree()
              this.handleLoadTree()
            })
          },
        })
      },
      async handleGetLeftTree() {
        let res = await getLeftTreeView()
        if (res.success) {
          this.leftArrData = res.data
          this.treeData = this.arraytoTree(res.data)
        } else if (res.code === '-1') {
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleCommand(command) {
        if (command === 'current') {
          this.$func.windowCountDown(
            '/project/main/v3/xls/exportProjectDetails.as?projectCode=' +
              this.form.projectCode +
              '&provinceId=' +
              (this.$store.state.provinceId ? this.$store.state.provinceId : '') +
              '&cityId=' +
              (this.$store.state.cityId ? this.$store.state.cityId : '') +
              '&countyId=' +
              (this.$store.state.countyId ? this.$store.state.countyId : '') +
              '&mac=' +
              this.form.mac +
              '&pageSize=' +
              this.pageSize +
              '&pageNo=' +
              this.currentPage +
              '&exportType=exportCurrent'
          )
        } else if (command === 'device') {
          this.exportRangeFlags = true
        } else {
          this.$func.windowCountDown(
            '/project/main/v3/xls/exportProjectDetails.as?projectCode=' +
              this.form.projectCode +
              '&provinceId=' +
              (this.$store.state.provinceId ? this.$store.state.provinceId : '') +
              '&cityId=' +
              (this.$store.state.cityId ? this.$store.state.cityId : '') +
              '&countyId=' +
              (this.$store.state.countyId ? this.$store.state.countyId : '') +
              '&mac=' +
              this.form.mac +
              '&pageSize=' +
              this.pageSize +
              '&pageNo=' +
              this.currentPage +
              '&exportType='
          )
        }
      },
      getMonthValue() {
        this.dateValue = true
        this.monthColor = 'success'
        this.yearColor = 'default'
      },
      getYearValue() {
        this.dateValue = false
        this.monthColor = 'default'
        this.yearColor = 'success'
      },
      handleExportRange() {
        const valueYears = this.$Date(this.valueYear).format('YYYY')
        const valueMonths = this.$Date(this.valueMonth).format('YYYYMM')
        if (this.dateValue) {
          this.$func.windowCountDown('/project/main/v5/xls/userPrjPowerStats.as?startYm=' + valueMonths + '&endYm=' + valueMonths)
        } else if (!this.dateValue) {
          this.$func.windowCountDown('/project/main/v5/xls/userPrjPowerStats.as?startYm=' + valueYears + '01' + '&endYm=' + valueYears + '12')
        }
      },
      arraytoTree(arr) {
        let dataArray = []
        arr.forEach(item => {
          let parentId = item.parentId
          if (parentId === 0) {
            let objTemp = { floorNo: item.floorNo, id: item.id, title: item.name, parentId: parentId, sortNo: item.sortNo, flag: false, expand: true }
            dataArray.push(objTemp)
          }
        })
        return this.childrenTree(arr, dataArray)
      },
      childrenTree(arr, dataArray) {
        if (dataArray !== []) {
          for (let j = 0; j < dataArray.length; j++) {
            let dataArrayItem = dataArray[j]
            let childrenArr = []
            let Id = dataArrayItem.id
            for (let i = 0; i < arr.length; i++) {
              let Arr = arr[i]
              if (Arr.parentId === Id) {
                let childTemp = { floorNo: Arr.floorNo, id: Arr.id, title: Arr.name, parentId: Arr.parentId, sortNo: Arr.sortNo, flag: false, expand: true }
                childrenArr.push(childTemp)
              }
            }
            dataArrayItem.children = childrenArr
            if (childrenArr.length > 0) {
              this.childrenTree(arr, childrenArr)
            }
          }
        } else {
          dataArray = arr
        }
        return dataArray
      },
      init() {
        this.queryOverview()
      },
      handleNodeCustom(data, node) {
        this.groupId = data[0].id
        this.treeGroupId = data[0].id
        this.queryOverview()
        let params = {
          pageNo: 1,
          params: {
            groupId: this.treeGroupId,
            keyword: this.treeKeyWrod,
          },
        }
        this.handleSelectOfGroup(params)
      },
      queryOverview() {
        this.loading = true
        let queryProjectRequest = JSON.parse(JSON.stringify(this.overviewDatas.queryParams))
        delete queryProjectRequest.projectCodeList
        let params = {
          pageNo: this.overviewDatas.pageNo,
          pageSize: this.overviewDatas.pageSize,
          queryProjectRequest,
          projectCodeList: this.overviewDatas.queryParams.projectCodeList,
        }
        queryProjectDetails(params).then(res => {
          if (res.success) {
            this.overviewDatas.list = res.datas
            this.overviewDatas.total = res.total
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      async queryProjectList() {
        this.loading = true
        let params = {
          // queryProjectRequest: {
          //   ...this.projectData.queryParams,
          // },
          params: {
            groupId: this.groupModel,
            projectName: this.projectData.queryParams.projectName,
          },
          pageNo: this.projectData.pageNo,
          pageSize: this.projectData.pageSize,
        }
        let res = await queryGroupProjectNodes(params)
        if (res.success) {
          this.projectData.list = res.datas.map(it => ({ ...it, name: it.nodeName, code: it.projectCode }))
          this.projectData.total = res.total
          this.setClickDisabledIssue()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      setClickDisabledIssue() {
        this.$nextTick(() => {
          let that = this
          let nodeChickList = document.querySelectorAll('.add-group-node-model .can-select-table .ivu-table-tbody .ivu-table-cell label.ivu-checkbox-wrapper-disabled')
          for (let index = 0; index < nodeChickList.length; index++) {
            const element = nodeChickList[index]
            element.onclick = e => {
              if (e.currentTarget.classList.contains('ivu-checkbox-wrapper-disabled') && !e.currentTarget.classList.contains('ivu-checkbox-wrapper-checked')) {
                that.$Message.error({ content: this.$t('selectNodeTip') })
              }
            }
          }
        })
      },
      handleDevices(obj, state) {
        this.$router.push(`/deviceList?projectCode=${obj.code}&status=${state}`)
      },
      handleAlarm(obj, state) {
        this.$router.push({
          name: 'Alarm',
          params: { projectCode: obj.code, typeNumber: '-100', status: state },
        })
      },
      handleSelect(obj) {
        var path = '/console/project'
        let objs = { projectCode: obj.code, fullName: obj.name }
        this.$func.switchToProject(objs, path)
      },
      handleCurrentChange(val) {
        this.overviewDatas.pageNo = val
        this.queryOverview()
      },
      handleSizeChange(val) {
        this.overviewDatas.pageNo = 1
        this.overviewDatas.pageSize = val
        this.queryOverview()
      },
      handleMore(obj) {
        store.commit('mac', '')
        this.$router.push({
          name: 'MaintenanceRecords',
          params: { projectCode: obj.code },
        })
      },
      handleKeyword(val) {
        if (val) {
          let findObj = this.projectNames.find(item => item.projectName === val)
          this.form.projectCode = findObj.projectCode
        } else {
          this.form.projectCode = ''
        }
      },
      handleLoadTree() {
        loadTree().then(res => {
          if (res.success) {
            this.customData = this.arraytoTree(res.data)
            this.arrData = res.data
          } else if (res.code === '-1') {
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleCloseConfiguration() {
        this.handleLoadTree()
        this.handleSearch()
        this.configurationVisible = false
        this.projectVisible = true
      },
      async handleSelectOfGroup(params) {
        let res = await pageRsOfProject(params)
        if (res.success) {
          this.groupData = res.datas
          this.customTotal = res.total
        } else if (res.code === '-1') {
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleSearch() {
        let params = {
          pageNo: 1,
          params: { groupId: this.treeGroupId, keyword: this.treeKeyWrod },
        }
        this.firstCurrentPage = 1
        this.handleSelectOfGroup(params)
      },
      handleConfiguration() {
        this.projectVisible = false
        let params = { params: { groupId: this.treeGroupId }, pageSize: 10000 }
        this.handlePageProject4SelectOfGroup(params)
        this.configurationVal = ''
        this.configurationVisible = true
        setTimeout(() => {
          this.getMockData()
          this.getTargetKeys()
        }, 500)
      },
      async handlePageProject4SelectOfGroup(params) {
        let res = await pageProject4SelectOfGroup(params)
        if (res.success) {
          this.configurationData = res.datas
          this.configurationTotal = res.total
        } else if (res.code === '-1') {
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      getMockData() {
        this.transferData = this.configurationData.map((val, inx) => ({
          key: inx.toString(),
          label: val.name,
          others: val.others.assign,
          code: val.code,
        }))
        this.configurationData.map((val, inx) => {
          if (val.others.assign === 'Y') {
            this.targetKeys.push({
              key: inx.toString(),
              label: val.name,
              others: val.others.assign,
              code: val.code,
            })
          }
        })
      },
      getTargetKeys() {
        this.targetKeys = this.transferData.filter(item => item.others === 'Y').map(item => item.key)
      },
      render(item) {
        return `<span title="${item.label}">${item.label}</span>`
      },
      handleChange(newTargetKeys, direction, moveKeys) {
        this.targetKeys = newTargetKeys
        let code = []
        if (direction === 'right') {
          this.targetKeys.map(v => {
            this.transferData.map(u => {
              if (v === u.key) {
                code.push(u.code)
              }
            })
          })
          this.handleOperation('add', code)
        } else {
          moveKeys.map(v => {
            this.transferData.map(u => {
              if (v === u.key) {
                code.push(u.code)
              }
            })
          })
          this.handleOperation('del', code)
        }
      },
      handleOperation(val, code) {
        let params = { projectCodes: code.toString(), groupId: this.treeGroupId, oper: val }
        saveProjectOfGroup(params).then(res => {
          if (res.code === '0') {
            this.$Message.success({ content: res.message })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      append(num, data) {
        let arr = []
        let params = {}
        if (num === '2') {
          this.arrData.filter(item => {
            if (item.parentId === data.id) return arr.push(item)
          })
          params = {
            floorNo: data.floorNo + 1,
            parentId: data.id,
            name: `new group${arr.length + 1}`,
            sortNo: arr.length + 1,
          }
          data['expand'] = true
        } else {
          this.arrData.filter(item => {
            if (item.parentId === 0) return arr.push(item)
          })
          params = {
            floorNo: 2,
            parentId: 0,
            name: `new group${arr.length + 1}`,
            sortNo: arr.length + 1,
          }
        }
        saveProjectGroup(params).then(res => {
          if (res.code === '0') {
            this.handleGetLeftTree()
            this.handleLoadTree()
            this.$Message.success({ content: this.$t('addSuccess') })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      deletes(data) {
        delProjectGroup({ groupId: data.id }).then(res => {
          if (res.code === '0') {
            this.$Message.success({ content: res.message })
          } else {
            this.$Message.error({ content: res.message })
          }
          this.handleGetLeftTree()
          this.handleLoadTree()
        })
      },
      handleReset() {
        this.overviewDatas.queryParams.projectName = ''
        this.overviewDatas.queryParams.address = ''
        this.queryOverview()
      },
      handleConfigurationSelect(val) {
        this.multipleSelection = val
      },
      handleRemove(row) {
        let params = { projectCodes: row.prjCode, groupId: row.id, oper: 'del' }
        saveProjectOfGroup(params).then(res => {
          if (res.success) {
            this.handleSelectOfGroup()
            this.$Message.success({
              content: res.message,
            })
            this.handleSearch()
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      setTimer(fn, delay) {
        let _this = this
        function timer() {
          _this.timerID = setTimeout(function () {
            timer()
            fn()
          }, delay)
        }
        timer()
      },
    },
    destroyed() {
      clearTimeout(this.timerID)
    },
    watch: {
      '$store.state.location': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.queryOverview()
          }
        },
        deep: true,
      },
      disData: {
        handler(newVal, oldVal) {
          if (newVal) {
            newVal.flag = true
          }
          if (oldVal !== newVal) {
            oldVal.flag = false
          }
        },
      },
      groupModel: {
        handler(v) {
          if (v !== 'address') {
            this.getProjectGroupTree(v)
          }
        },
        deep: true,
        immediate: true,
      },
    },
  }
</script>
<style lang="less">
  #overview {
    padding: 20px;
    width: 100vw;
    height: 100vh;
    .text-center {
      text-align: center;
    }
    .df {
      width: 100%;
      margin-bottom: 10px;
    }
    .icon-v5 {
      font-size: 20px;
    }
    .header {
      background: #1a202e;
      .hForm {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .flex-form {
          display: flex;
          align-items: center;
          .ml-10 {
            margin-left: 10px;
          }
        }
        .ivu-form-item {
          margin: 0;
        }
      }
    }
    .tableContent {
      margin-top: 20px;
      background: #1a202e;
      padding: 0px 10px;
      height: calc(~'100vh - 90px');
      border-radius: 5px;
      > .ivu-row {
        height: 100%;
        display: flex;
        width: 100%;
        .left-group-model {
          border-right: 1px solid #999;
          padding: 0 10px;
          padding-top: 20px;
          height: 100%;
          width: 400px;
          .tableH {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #999;
            justify-content: space-between;
            .group-class {
              display: flex;
              .ivu-menu-horizontal {
                height: 30px;
                line-height: 30px;
              }
              .ivu-menu-light {
                background: none;
                display: flex;
                > .ivu-menu-item,
                .ivu-menu-submenu {
                  padding: 0px 10px;
                  .ivu-menu-submenu-title .active,
                  .ivu-menu-submenu-title .active + .ivu-icon {
                    color: #2d8cf0;
                  }
                }
              }
              .ivu-menu-horizontal.ivu-menu-light:after {
                display: none;
              }
            }
          }
          .tree-box-bottom {
            // height: calc(~'100% - 42px');
            overflow: auto;
            .vue-recycle-scroller {
              scrollbar-width: none;
              &::-webkit-scrollbar {
                display: none;
              }
            }
            .TreeView {
              background: none;
              color: #fff;
              .custom-tree-node {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: calc(~'100% - 24px');
                position: relative;
                .label-title {
                  max-width: 100%;
                }
                .handle-button {
                  position: absolute;
                  right: 10px;
                  display: none;
                  .ivu-btn {
                    padding: 0 5px;
                    margin: 0 0px;
                    outline: none;
                    box-shadow: none;
                    height: 100%;
                  }
                }
              }
              .el-tree-node__content:hover,
              .el-tree-node:focus > .el-tree-node__content {
                background: #007eff30;
                color: #007eff;
              }
              .el-tree-node__content:hover {
                .custom-tree-node {
                  .label-title {
                    max-width: calc(~'100% - 90px');
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                }
                .handle-button {
                  display: block;
                }
              }
            }
          }
        }
        .right-project-table-box {
          padding: 0 10px;
          padding-top: 20px;
          height: 100%;
          width: calc(~'100% - 400px');
          .project-info-box {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .ivu-select .ivu-select-dropdown {
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
      .ivu-select-item {
        text-align: left;
      }
    }
    .ivu-tree-title-selected,
    .ivu-tree-title-selected:hover,
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background: rgba(26, 32, 46, 0.5) !important;
      color: #007eff !important;
    }
    .ivu-tree-title:hover {
      background: rgba(26, 32, 46, 0.5) !important;
      color: #007eff !important;
    }
  }
  .projectVisible {
    .ivu-table {
      overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .ButtonAdd {
      width: 316px;
      height: 36px;
      background: rgba(0, 126, 255, 0.1);
      border: 1px solid #007eff;
      border-radius: 5px;
      color: #007eff;
    }
    .ivu-icon-ios-arrow-forward:before {
      content: '\F11F';
    }
    .leftTreeView {
      height: 600px;
      overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .left {
      padding: 16px;
      border-right: 1px solid #4c505c;
      position: relative;
    }
    .right {
      padding: 16px;
    }
    .ivu-modal-body {
      padding: 0;
    }
    .ivu-tree-title-selected,
    .ivu-tree-title-selected:hover {
      background: rgba(26, 32, 46, 0.5) !important;
      color: #007eff !important;
    }
    .ivu-tree-title:hover {
      background: rgba(26, 32, 46, 0.5) !important;
      color: #007eff !important;
    }
    .header {
      margin-bottom: 10px;
      justify-content: space-between;
    }
  }
  .configurationVisible {
    .ivu-transfer-list {
      width: 210px;
    }
  }
  .add-group-node-model {
    .ivu-modal-body {
      padding-bottom: 0px;
      .ivu-theme-dark .ivu-checkbox-disabled .ivu-checkbox-inner,
      .ivu-checkbox-disabled .ivu-checkbox-inner {
        background-color: #28282b;
        border-color: #3d3d41;
      }
      .ivu-checkbox-disabled .ivu-checkbox-input {
        display: none;
      }
    }
    .add-project-node {
      position: relative;
      overflow: auto;
      .select-project {
        display: flex;
        .left-box {
          flex: 1;
          .title {
            font-size: 16px;
          }
        }
        .center-box {
          width: 70px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }
        .right-box {
          flex: 1;
          .title {
            font-size: 16px;
          }
        }
        .search-form {
          margin-bottom: 10px;
          .ivu-form-item {
            margin: 0;
          }
        }
      }

      .footer-box {
        width: 100%;
        bottom: 0px;
        left: 0px;
        height: 50px;
        display: flex;
        justify-content: flex-end;
        padding: 0 20px;
        align-items: center;
      }
    }
  }
</style>
