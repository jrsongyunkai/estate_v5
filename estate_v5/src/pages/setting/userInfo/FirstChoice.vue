<template>
  <div id="first-choice" class="mt-20">
    <Row class="alarm-sound-tip" v-show="showTip">
      <Col :span="22">
        <span>
          <i class="icon-v5 icon-v5-xiaoxi"></i>
          {{ $t('firstChoiceTips') }}
        </span>
      </Col>
      <!-- <Col :span="1" style="padding-left:90px"> <Icon type="md-close" @click="showTip=false" /></Col> -->
    </Row>
    <Row style="padding: 10px; display: flex; justify-content: space-between">
      <Col style="display: flex">
        <Col>
          <Input style="width: 154px" v-model="projectName" :placeholder="$t('pleaseEnter') + $t('projectName')"></Input>
        </Col>
        <Col style="margin-left: 10px">
          <Button type="primary" @click="queryPreference">{{ $t('query') }}</Button>
        </Col>
      </Col>

      <Col style="margin-left: 10px">
        <Button type="primary" @click="handleAddProject">{{ $t('add') }}</Button>
      </Col>
    </Row>
    <Table :data="data" height="550" :columns="columnsDatas">
      <template #projectNameList="{ row, index }">
        <!-- <Button v-if="row.isEdit" type="primary" size="small" ghost @click="addProject(row, index)" class="choice">{{ $t('system.add') }}</Button>
        <Tag v-for="(item, idx) in row.projectList" :key="idx" :closable="row.isEdit" @on-close="closeProjectTag(idx, index)">
          <span>
            <Tooltip :content="item.projectName" placement="top" transfer>
              {{ item.projectName.substr(0, 4) + '...' }}
            </Tooltip>
          </span>
        </Tag> -->
        <TagAutoMergeSingleArray :isEdit="row.isEdit" :key="row.projectList.length" @handleAddAlarm="addProject(row, index)" @handleTypesClose="idx => closeProjectTag(idx, index)" :typeNumbers="row.projectList"></TagAutoMergeSingleArray>
      </template>
      <template #attitude="{ row, index }">
        <TagAutoFoldMerge :isEdit="row.isEdit" @handleAddAlarm="handleAddAlarm(row.typeNumbers, index, row.customTypeNumbers, row)" @handleTypesClose="(idx, type) => handleTypesClose(index, idx, type)" :typeNumbers="row.typeNumbers" :customTypeNumbers="row.customTypeNumbers"></TagAutoFoldMerge>
      </template>
      <template slot-scope="{ row }" slot="frequence">
        <div v-if="!row.isEdit">{{ row.frequence }}</div>
        <Input size="small" v-if="row.isEdit && row.acceptType === 1" v-model.number.trim="row.frequence" @input="handleFrequence" :placeholder="$t('pleaseEnter')"></Input>
      </template>
      <template slot-scope="{ row }" slot="acceptType">
        <div v-if="!row.isEdit">{{ row.acceptType === 1 ? $t('receive') : $t('unReceive') }}</div>
        <Switch v-if="row.isEdit" v-model="row.acceptType" :true-value="1" :false-value="2">
          <span slot="open">{{ $t('open1') }}</span>
          <span slot="close">{{ $t('close1') }}</span>
        </Switch>
      </template>
      <template slot-scope="{ row, index }" slot="operation">
        <Button v-if="row.isEdit" type="text" size="small" @click="handleSave(row)">
          <span style="color: #007eff">{{ $t('save') }}</span>
        </Button>
        <Button v-if="!row.isEdit" type="text" size="small" @click="handleEdit(index, true, 'edit')">
          <span style="color: #007eff">{{ $t('edit') }}</span>
        </Button>
        <Button v-if="!row.isEdit" type="text" size="small" @click="handleDel(row, index)">
          <span style="color: #ff5b59">{{ $t('remove') }}</span>
        </Button>
        <Button v-if="row.isEdit" type="text" size="small" @click="handleEdit(index, false, 'cancel')">
          <span style="color: #ff5b59">{{ $t('cancel') }}</span>
        </Button>
      </template>
    </Table>
    <Page style="margin-top: 20px" background show-elevator @on-change="handlePage" :current="pageNo" :page-size="pageSize" :total="total" show-total></Page>
    <Modal :mask="false" :title="$t('alarmTypeSelection')" v-model="flag" width="1000" @on-cancel="flag = false" @on-ok="handleSaveTypes">
      <AlarmTreeList ref="alarmListRef" :checkedAlarm="checkedAlarm" :projectList="projectList" :key="alarmKey" :disabledAlarm="disabledAlarm"></AlarmTreeList>
    </Modal>
    <Modal v-model="modalNotice" :title="$t('tip')" @on-ok="removeOk" @on-cancel="removeCancel">
      <p>{{ $t('confirmDeleteConfig') }}</p>
    </Modal>
    <Modal v-model="projectTableModal" :title="$t('addProject')" @on-cancel="projectTableModal = false" :mask="false" :mask-closable="false" @on-ok="saveProjectSelected">
      <ProjectTable :prjList="prjList" v-if="projectTableModal" ref="ProjectTableRef"></ProjectTable>
    </Modal>
    <Modal v-model="projectsFlag" :title="$t('projectSelect')" @on-cancel="projectsFlag = false" :mask="false" :mask-closable="false" @on-ok="handleCloseProjects">
      <ProjectTable v-if="projectsFlag" ref="addTableRef"></ProjectTable>
    </Modal>
  </div>
</template>

<script>
  import ProjectSelect from '../../Common/ProjectSelect.vue'
  import AlarmTreeList from './AlarmTreeList.vue'
  import TagAutoFoldMerge from '../component/TagAutoFoldMerge.vue'
  import {
    preferences,
    // updatePoPup,
    prjAlarmConfigSave,
    prjAlarmConfigDel,
  } from '@/api/public'
  import ProjectTable from '../component/projectTable.vue'
  import TagAutoMergeSingleArray from '../component/TagAutoMergeSingleArray.vue'
  export default {
    name: 'firstchoice',
    components: { ProjectSelect, AlarmTreeList, ProjectTable, TagAutoFoldMerge, TagAutoMergeSingleArray },
    data() {
      return {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        prjList: [],
        projectTableModal: false,
        projectList: [],
        alarmKey: null,
        checkedAlarm: [],
        checkedListsCustoms: [],
        listsCustom: [],
        checkAllCustom: false,
        showTip: true,
        origin: '',
        checkedOptions: [],
        columnsDatas: [
          { title: this.$t('project'), slot: 'projectNameList', align: 'left' },
          { title: this.$t('alarmType'), slot: 'attitude', align: 'left' },
          { title: this.$t('frequencyLimit'), slot: 'frequence', width: 150 },
          { title: this.$t('receivingStatus'), slot: 'acceptType', width: 100 },
          { title: this.$t('operation'), slot: 'operation', width: 130, align: 'center' },
        ],
        statusSwitch: false,
        modalNotice: false,
        index: 0,
        projectsFlag: false,
        projectLists: [],
        data: [],
        page: [],
        length: 0,
        lastId: 0,
        projectName: '',
        alarmTypeList: [],
        flag: false,
        rowMessage: {},
        values: [],
        tableIndex: null,
        alarmIndex: null,
        disabledAlarm: [],
      }
    },
    created() {},
    mounted() {
      this.init()
    },

    methods: {
      init() {
        this.queryPreference()
      },
      saveProjectSelected() {
        this.data[this.tableIndex].projectList = this.$refs.ProjectTableRef.selectTableData
      },
      closeProjectTag(idx, index) {
        this.data[index].projectList.splice(idx, 1)
      },
      handleAddProject() {
        if (this.total === this.data.length - 1) {
          return this.$Message.error({
            content: this.$t('saveAdd'),
          })
        }
        this.projectsFlag = true
      },
      async queryPreference() {
        this.data = []
        let params = {
          keyword: this.projectName,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
        }
        const res = await preferences(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.data = res.datas.map(item => ({ ...item, isEdit: false }))

        this.total = res.total
      },
      isNotEmptyArray(arr = []) {
        return Array.isArray(arr) && arr.length > 0
      },
      addProject(row, index) {
        this.tableIndex = index
        this.prjList = row.projectList
        if (!!row.typeNumbers.length || !!row.customTypeNumbers.length) {
          this.$Modal.confirm({
            title: this.$t('tip'),
            content: this.$t('selectProjectTip'),
            onOk: () => {
              this.data[index].typeNumbers = []
              this.data[index].customTypeNumbers = []
              this.projectTableModal = true
            },
          })
        } else {
          this.projectTableModal = true
        }
      },
      getDisableList(row, index) {
        const filterTable = this.data.filter((v, i) => i !== index)
        const disableArr = row.projectList.map(item => {
          const filterArr = filterTable.filter(v => v.projectList.map(j => j.projectCode).includes(item.projectCode))
          const typeNumber = filterArr
            .map(v => v.typeNumbers.concat(v.customTypeNumbers))
            .flat(1)
            .map(j => j.typeNumber)
          return typeNumber
        })
        return disableArr.flat(1)
      },
      handleAddAlarm(typeNumbers = [], index, listCustom = [], row) {
        if (!this.isNotEmptyArray(row.projectList)) {
          return this.$Message.error(this.$t('pleaseSelectProject1'))
        }
        this.alarmIndex = index
        this.checkedAlarm = typeNumbers.concat(listCustom).map(v => v.typeNumber)
        this.projectList = row.projectList.map(v => v.projectCode)
        this.disabledAlarm = this.getDisableList(row, index)
        this.alarmKey = Math.random()
        this.flag = true
      },
      handleTypesClose(index, idx, type) {
        this.data[index][type].splice(idx, 1)
      },
      handleCustomClose(index, idx) {
        this.data[index].customTypeNumbers.splice(idx, 1)
      },
      handleFrequence(val) {
        if (val < 0 || val > 2592000) {
          this.$Message.error({
            content: this.$t('range') + '0 ~ 2592000',
          })
        } else {
          if (val === '') {
            this.$Message.error({
              content: this.$t('required'),
            })
          }
        }
      },
      handleEdit(index, val, type) {
        this.data[index].isEdit = val
        if (type === 'cancel') {
          this.queryPreference()
        }
      },
      async handleSave(row) {
        const checkConfig = {
          customTypeNumbers: item => (!!item.typeNumbers && !!item.typeNumbers.length) || (!!row.customTypeNumbers && !!row.customTypeNumbers.length),
          typeNumbers: item => (!!item.typeNumbers && !!item.typeNumbers.length) || (!!row.customTypeNumbers && !!row.customTypeNumbers.length),
          frequence: item => !!item.frequence,
          projectList: item => !!item.projectList && !!item.projectList.length,
        }
        let checkArr = []

        for (let key in row) {
          if (checkConfig.hasOwnProperty(key)) {
            checkArr.push(checkConfig[key](row))
          }
        }
        if (checkArr.some(v => !v)) {
          return this.$Message.error({
            content: this.$t('optionTip'),
          })
        }
        if (row.frequence < 0 || row.frequence > 2592000) {
          return this.$Message.error({
            content: this.$t('range') + '0 ~ 2592000',
          })
        }
        const params = {
          typeNumbers: row.typeNumbers.map(v => v.typeNumber).join(','),
          customTypeNumbers: row.customTypeNumbers.length > 0 ? row.customTypeNumbers.map(item => item.typeNumber).join(',') : '',
          frequence: row.frequence,
          acceptType: row.acceptType,
          projectList: row.projectList.map(v => ({ projectCode: v.projectCode, projectName: v.projectName })),
          configId: row.configId || '',
        }
        const res = await prjAlarmConfigSave(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.$Message.success({
          content: res.message,
        })
        this.queryPreference()
      },
      handleDel(row, index) {
        if (!row.configId) {
          this.data.splice(index, 1)
        } else {
          this.modalNotice = true
          this.rowMessage = row
        }
      },
      async removeOk() {
        const res = await prjAlarmConfigDel({
          configId: this.rowMessage.configId,
        })
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.$Message.success({
          content: res.message,
        })
        this.queryPreference()
      },
      removeCancel() {
        this.modalNotice = false
        this.$Message.info({
          content: this.$t('cancelDelete'),
        })
      },
      handlePage(e) {
        this.pageNo = e
        this.queryPreference()
      },
      handleSaveTypes() {
        // checkedListsCustoms
        const checkedList = this.$refs.alarmListRef.checkedList
        this.data[this.alarmIndex].typeNumbers = checkedList.filter(v => !v.projectCode).map(j => ({ ...j, alarmInfo: j.info }))
        const customList = checkedList.filter(v => !!v.projectCode)
        this.data[this.alarmIndex].customTypeNumbers = customList.length > 0 ? customList.map(v => ({ ...v, alarmInfo: v.info })) : []
      },
      handleCloseProjects() {
        this.projectsFlag = false
        this.data.unshift({
          isEdit: true,
          acceptType: 1,
          projectList: this.$refs.addTableRef.selectTableData,
          frequence: 60,
          typeNumbers: [],
          id: null,
          customTypeNumbers: [],
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .alarm-sound-tip {
    font-size: 14px;
    padding: 5px;
    margin-left: 10px;
    border: 1px solid;
    background: #1a202e;
    color: #999999;
  }
  .pds {
    padding-bottom: 5px;
  }
  .pd-10 {
    padding: 10px;
  }
  .mt-15 {
    margin-top: 15px;
  }
  .mt {
    margin-top: 10px;
  }
  .checkbox-group {
    display: flex;
    margin-top: 5px;
  }
  .center-checkbox {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #999999;
  }
  .choice {
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007eff;
    border-radius: 5px;
    color: #007eff;
    height: 34px;
    line-height: 34px;
    cursor: pointer;
    padding: 0 10px;
    margin-right: 16px;
    display: inline-block;
  }
  .ivu-tag {
    height: 34px;
    line-height: 34px;
  }
</style>
