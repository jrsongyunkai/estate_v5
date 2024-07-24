<template>
  <div class="mnConfiguration">
    <Row class="select-list">
      <ELPCascader v-if="targetType === 2" filterable :options="$store.state.charginMacList" v-model="macLine" style="width: 250px" :transfer="true" :placeholder="$t('pleaseSelectDeviceLine2')" class="ml-10">
        <template slot-scope="{ data }">
          <div class="el-cascader-label-content">
            <Tooltip placement="left" :disabled="data.label.length < 8" transfer transfer-class-name="el-cascader-label-tips">
              <div class="label-text-content">{{ data.label }}</div>
              <template #content>
                <div>{{ data.label }}</div>
              </template>
            </Tooltip>
          </div>
        </template>
      </ELPCascader>
      <Select transfer v-if="targetType === 3" style="width: 150px" v-model="packetTypes" clearable :placeholder="$t('selectGroupingType')" class="en-unit" @on-change="handleTypes">
        <Option v-for="item in $store.state.packetList" :key="item.id" :label="item.type" :value="item.id"></Option>
      </Select>
      <TreeSelect v-if="targetType === 3" :placeholder="$t('selectGroup')" style="width: 150px; margin-left: 10px" multiple show-checkbox v-model="packetFilter" transfer :data="packetFilterList" />
      <Select v-model="electricityUser" style="width: 200px" :placeholder="$t('electricityUser')" class="ml-10">
        <Option v-for="item in electricityUserList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="supervisor" style="width: 200px" :placeholder="$t('supervisor')" class="ml-10">
        <Option v-for="item in supervisorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button class="b-blue ml-10" @click="currentpage(1)">{{ $t('query') }}</Button>
      <Button class="b-info ml-10" @click="reset">{{ $t('reset') }}</Button>
    </Row>
    <div class="systemlist">
      <Row style="justify-content: space-between; margin-bottom: 10px">
        <h3>{{ $t('configurationList') }}</h3>
        <div>
          <Button class="b-blue" @click="handleUserList('1')">{{ $t('listOfSupervisors') }}</Button>
          <Button class="b-blue ml-10" @click="handleUserList('2')">{{ $t('listOfElectricityUsers') }}</Button>
        </div>
      </Row>
      <Table :columns="systemColumns" :data="systemData">
        <template slot-scope="{ row }" slot="macName">
          <div :class="row.targetRemain === 'true' ? '' : 'c-danger'">
            <div>{{ `${row.boxName}(${row.mac})` }}</div>
            <span>
              <i v-if="row.targetRemain === 'false'">({{ $t('removed') }})</i>
            </span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="addrNames">
          <div :class="row.targetRemain === 'true' ? '' : 'c-danger'">
            <div>{{ `${row.addrName}(${row.mac + '-' + String(row.addr).padStart(2, '0')})` }}</div>
            <span>
              <i v-if="row.targetRemain === 'false'">({{ $t('removed') }})</i>
            </span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="groupName">
          <div :class="row.targetRemain === 'true' ? '' : 'c-danger'">{{ `${row.groupName}(${row.nodeName})` }}</div>
        </template>
        <template slot-scope="{ row }" slot="ydr">
          <TagsAutoTableCell v-if="row.electricityUserList && row.electricityUserList.length" :tagList="row.electricityUserList" :returnLabel="item => `${item.name}(${item.telephone})`"></TagsAutoTableCell>
          <div v-else>-</div>
        </template>
        <template slot-scope="{ row }" slot="jsr">
          <TagsAutoTableCell v-if="row.paymentNotifierList && row.paymentNotifierList.length" :tagList="row.paymentNotifierList" :returnLabel="item => `${item.name}(${item.telephone})`"></TagsAutoTableCell>
          <div v-else>-</div>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button class="text-btn-primary" type="text" size="small" @click="handleUsermanage('1', row)">{{ $t('supervisorManagement') }}</Button>
          <Button class="text-btn-primary" type="text" size="small" @click="handleUsermanage('2', row)">{{ $t('electricityUserManagement') }}</Button>
        </template>
      </Table>
      <Page :page-size="pageSizeList" @on-change="currentpage" :current="PageNoList" :total="TotalList" show-elevator show-total></Page>
    </div>
    <Modal v-model="ydrUsermanage" :title="$t('electricityUserManagement')" class-name="recharge" width="600">
      <Table :columns="usermanageColumns" :data="ydrusermanageData" @on-selection-change="selectList"></Table>
      <Page show-total :current="pageElec" @on-change="changeElecPage" :total="totalElecTables" show-elevator />
      <div slot="footer">
        <Button class="b-blue" @click="setYdrs">{{ $t('confirm') }}</Button>
        <Button @click="ydrUsermanage = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal v-model="jsrUsermanage" :title="$t('supervisorManagement')" class-name="recharge" width="600">
      <Table :columns="usermanageColumns" :data="jsrUsermanageData" @on-selection-change="selectListjsr"></Table>
      <Page show-total :current="pageUser" @on-change="changeUserPage" :total="totalUserTables" show-elevator />
      <div slot="footer">
        <Button class="b-blue" @click="setJsrs">{{ $t('confirm') }}</Button>
        <Button @click="jsrUsermanage = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { getTree } from './statementList'
  import TagsAutoTableCell from '@/pages/billingSystem/component/TagsAutoTableCell.vue'
  import { queryNotifyConfList4Chn, getGroupNodeQueryCondition, queryNotifyConfList4Grp, queryPaymentNotifierList, queryElectricityUserList, queryNotifyConfList4Prj, configPaymentNotifier, configElectricityUser } from '@/api/public'
  export default {
    components: { TagsAutoTableCell },
    data() {
      return {
        pageSizeList: 10,
        PageNoList: 1,
        TotalList: 0,
        pageElec: 1,
        totalElecTables: 0,
        totalUserTables: 0,
        pageUser: 1,
        packetFilterList: [],
        packetFilter: [],
        packetTypes: '',
        macLine: [],
        targetType: '',
        mac: '',
        periodBalance: '',
        supervisorList: [],
        supervisor: '',
        electricityUserList: [],
        electricityUser: '',
        usermanageColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: this.$t('fullName'), key: 'name', width: 120 },
          { title: this.$t('phone'), key: 'telephone', width: 140 },
          { title: this.$t('mailbox'), key: 'email' },
        ],
        systemData: [],
        ydrUsermanage: false,
        ydrusermanageData: [],
        jsrUsermanage: false,
        jsrUsermanageData: [],
        setItem: null,
        ydrSelectList: [],
        jsrSelectList: [],
      }
    },
    computed: {
      systemColumns() {
        let columns = [
          { title: this.$t('supervisor'), slot: 'jsr' },
          { title: this.$t('electricityUser'), slot: 'ydr' },
          { title: this.$t('operation'), slot: 'action', align: 'center', width: 260, fixed: 'right' },
        ]
        if (this.targetType === 1) {
          return [{ title: this.$t('projectName'), key: 'projectName' }, ...columns]
        } else if (this.targetType === 2) {
          return [{ title: this.$t('device'), slot: 'macName' }, { title: this.$t('line'), slot: 'addrNames' }, ...columns]
        } else {
          return [{ title: this.$t('groupInfo'), slot: 'groupName', tree: true }, ...columns]
        }
      },
    },
    created() {
      this.targetType = this.$store.state.billingTarget
      this.queryList()
      this.getPaymentNotifierList()
      this.getElectricityUserList()
    },
    methods: {
      queryList() {
        if (this.targetType === 1) {
          this.getProjectConfigList()
        } else if (this.targetType === 2) {
          this.getDevicConfigList()
        } else if (this.targetType === 3) {
          this.getGroupConfigList()
        }
      },
      currentpage(e) {
        this.PageNoList = e
        this.queryList()
      },
      async changeElecPage(e) {
        this.pageElec = e
        let params = { projectCode: this.$store.state.projectCode, keyword: '', pageNo: this.pageElec, pageSize: 10 }
        const res = await queryElectricityUserList(params)
        if (res.success) {
          let phonesElec = this.setItem.paymentNotifierList.map(it => it.id)
          this.ydrusermanageData = res.datas.map(v => ({ ...v, label: v.name, value: v.id })).map(it => ({ ...it, _checked: phonesElec.includes(it.id) }))
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async changeUserPage(e) {
        // 监收人弹窗分页
        this.pageUser = e
        let params = { projectCode: this.$store.state.projectCode, keyword: '', pageNo: this.pageUser, pageSize: 10 }
        const res = await queryPaymentNotifierList(params)
        if (res.success) {
          let phonesPage = this.setItem.paymentNotifierList.map(it => it.id)
          this.jsrUsermanageData = res.datas.map(v => ({ ...v, label: v.name, value: v.id })).map(it => ({ ...it, _checked: phonesPage.includes(it.id) }))
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleUsermanage(type, item) {
        this.setItem = item
        type === '1' ? (this.jsrUsermanage = true) : (this.ydrUsermanage = true)
        let params = { projectCode: this.$store.state.projectCode, keyword: '', pageNo: 1, pageSize: 10 }
        if (type === '1') {
          const res = await queryPaymentNotifierList(params)
          if (res.success) {
            let phones = item.paymentNotifierList.map(it => it.id)
            this.jsrUsermanageData = res.datas.map(v => ({ ...v, label: v.name, value: v.id })).map(it => ({ ...it, _checked: phones.includes(it.id) }))
            this.jsrSelectList = this.jsrUsermanageData.filter(v => v._checked)
            this.totalUserTables = res.total
          } else {
            this.$Message.error({ content: res.message })
          }
        } else {
          const res = await queryElectricityUserList(params)
          if (res.success) {
            let phones = item.electricityUserList.map(it => it.id)
            this.ydrusermanageData = res.datas.map(v => ({ ...v, label: v.name, value: v.id })).map(it => ({ ...it, _checked: phones.includes(it.id) }))
            this.ydrSelectList = this.ydrusermanageData.filter(v => v._checked)
            this.totalElecTables = res.total
          } else {
            this.$Message.error({ content: res.message })
          }
        }
      },
      async getPaymentNotifierList() {
        let params = { projectCode: this.$store.state.projectCode, keyword: '', pageNo: 1, pageSize: 10000 }
        const res = await queryPaymentNotifierList(params)
        if (res.success) {
          this.supervisorList = res.datas.map(v => ({ ...v, label: v.name, value: v.id }))
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getElectricityUserList() {
        let params = { projectCode: this.$store.state.projectCode, keyword: '', pageNo: 1, pageSize: 10000 }
        const res = await queryElectricityUserList(params)
        if (res.success) {
          this.electricityUserList = res.datas.map(v => ({ ...v, label: v.name, value: v.id }))
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleTypes(val) {
        if (!val) return
        let parmas = { projectCode: this.$store.state.projectCode, groupId: val }
        const res = await getGroupNodeQueryCondition(parmas)
        if (res.success) {
          this.packetFilterList = getTree(res.data)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getProjectConfigList() {
        let params = { projectCode: this.$store.state.projectCode, nid: this.supervisor, uid: this.electricityUser }
        const res = await queryNotifyConfList4Prj(params)
        if (res.success) {
          this.systemData = [res.data]
          this.TotalList = 1
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getDevicConfigList() {
        let params = { projectCode: this.$store.state.projectCode, resId: this.macLine[0] || '', addr: this.macLine[1] || '', nid: this.supervisor, uid: this.electricityUser, pageNo: this.PageNoList, pageSize: this.pageSizeList }
        const res = await queryNotifyConfList4Chn(params)
        if (res.success) {
          this.systemData = res.datas
          this.TotalList = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getGroupConfigList() {
        let params = {
          projectCode: this.$store.state.projectCode,
          nodeIdList: this.packetFilter.join(',') || '',
          nid: this.supervisor,
          uid: this.electricityUser,
          pageNo: this.PageNoList,
          pageSize: this.pageSizeList,
        }
        const res = await queryNotifyConfList4Grp(params)
        if (res.success) {
          this.systemData = res.datas
          this.TotalList = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      selectList(list) {
        this.ydrSelectList = list
      },
      selectListjsr(list) {
        this.jsrSelectList = list
      },
      handleUserList(type) {
        if (type === '1') {
          this.$emit('supervisorList', 'supervisorList')
        } else {
          this.$emit('electricityList', 'electricityList')
        }
      },
      async setYdrs() {
        let params = { confId: this.setItem.confId, projectCode: this.$store.state.projectCode, electricityUserIds: this.ydrSelectList.map(v => v.id).join(',') }
        const res = await configElectricityUser(params)
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.ydrUsermanage = false
          this.queryList()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async setJsrs() {
        let params = { confId: this.setItem.confId, projectCode: this.$store.state.projectCode, paymentNotifierIds: this.jsrSelectList.map(v => v.id).join(',') }
        const res = await configPaymentNotifier(params)
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.jsrUsermanage = false
          this.queryList()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      reset() {
        this.mac = ''
        this.electricityUser = ''
        this.supervisor = ''
        this.packetFilter = []
        this.macLine = []
      },
    },
    mounted() {},
  }
</script>
<style lang="less">
  .mnConfiguration {
    .systemlist {
      background: #1a202e;
      padding: 20px;
      margin-top: 10px;
    }
  }
</style>
