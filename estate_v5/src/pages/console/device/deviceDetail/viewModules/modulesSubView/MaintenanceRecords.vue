<template>
  <div id="maintenance">
    <div class="theader" v-if="$route.path !== '/MaintenanceRecords'">
      <div class="left">
        <div class="bor"></div>
        <span>{{ $t('maintenanceRecords') }}</span>
      </div>
      <div class="right">
        <Button type="primary" ghost @click.stop="handleMaintenance">{{ $t('addMaintenance') }}</Button>
        <Button class="ml-10" type="primary" @click.stop="handleMore" ghost>{{ $t('viewAll') }}</Button>
      </div>
    </div>
    <Row :gutter="20" :style="$route.path !== '/MaintenanceRecords' ? { margin: 0 } : { margin: 0, padding: '20px' }">
      <Col style="width: 100%">
        <Breadcrumb separator-class="el-icon-arrow-right" v-if="$route.path === '/MaintenanceRecords'">
          <BreadcrumbItem class="pointer" @click.native="$router.push(pathUrl)">{{ $t('back') }}</BreadcrumbItem>
          <BreadcrumbItem>{{ $t('maintenanceRecords') }}</BreadcrumbItem>
        </Breadcrumb>
        <Col class="tr mt-20">
          <Form v-if="$route.path === '/MaintenanceRecords'" :inline="true" size="small" :model="maintenance" class="demo-form-inline tr" @submit.native.prevent>
            <FormItem>
              <RadioGroup v-model="dateRadio" @on-change="handleDatePicker">
                <Radio :label="$t('day')"></Radio>
                <Radio :label="$t('month')"></Radio>
              </RadioGroup>
              <span class="block" v-show="dateRadio === $t('day')">
                <DatePicker v-model="maintenance.day" type="date" :editable="false" value-format="yyyy-MM-dd" :clearable="false"></DatePicker>
              </span>
              <span class="block" v-show="dateRadio === $t('month')">
                <DatePicker v-model="maintenance.month" value-format="yyyy-MM" type="month" :editable="false" :clearable="false"></DatePicker>
              </span>
            </FormItem>
            <FormItem>
              <Input v-model="maintenance.mac" @keyup.enter.native="handleQueryRecords" :placeholder="$t('enterDeviceNo')"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleQueryRecords">{{ $t('query') }}</Button>
            </FormItem>
          </Form>
        </Col>
      </Col>
      <Table :data="tableData" :height="$route.path === '/MaintenanceRecords' ? powerTableHeight : 200" style="width: 100%; margin-top: 10px" class="recodTable" :columns="columns">
        <template slot-scope="{ row }" slot="projectName">
          <span v-if="$store.state.systemFlag !== '/MaintenanceRecords'">
            {{ row.projectName }}
          </span>
        </template>
        <template slot-scope="{ row }" slot="mac">
          <span v-if="$store.state.systemFlag !== '/MaintenanceRecords'">
            {{ row.mac }}
          </span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <span class="pointer" @click="handleView(row)">{{ $t('view') }}</span>
        </template>
      </Table>
      <div class="block tc mt-10">
        <Page
          v-if="$route.path === '/MaintenanceRecords'"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSize"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          show-elevator
          show-total
          layout="total, sizes, prev, pager, next"
          :total="total"></Page>
      </div>
    </Row>
    <Modal :title="$t('maintenanceEdit')" id="modal" v-model="dialogVisible" @close="closeMaintenance">
      <MaintenanceEditor v-if="dialogVisible" :maintenanceBoxObj="maintenanceBoxObj" v-on:close-maintenance="closeMaintenance"></MaintenanceEditor>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import store from '@/store'
  import MaintenanceEditor from '@/pages/safetyMonitor/allWarn/MaintenanceEditor.vue'
  import { listMaintenance, findMaintenance } from '@/api/control/index'
  export default {
    props: {
      mac: {
        type: String,
      },
      equipmentType: {
        type: Number,
      },
    },
    data() {
      return {
        dateRadio: this.$t('day'),
        maintenance: {
          mac: this.$store.state.mac,
          day: this.$func.getNowFormatDate(),
          month: this.$func.getCurrentYearMonth(),
        },
        dialogVisible: false,
        maintenanceBoxObj: {},
        tableData: [],
        currentPage: 1,
        total: 1,
        pageSize: this.$route.path === '/MaintenanceRecords' ? 20 : 10,
        powerTableHeight: this.$store.state.powerTableHeight,
        columns: [
          { title: this.$t('projectName'), slot: 'projectName', width: 100, align: 'center' },
          { title: this.$t('equipmentNo'), slot: 'mac', align: 'center' },
          { title: this.$t('place'), key: 'addres', align: 'center' },
          { title: this.$t('maintenanceTime'), key: 'maintenanceTime', align: 'center' },
          { title: this.$t('personnel'), key: 'handlerName', align: 'center' },
          { title: this.$t('contactNumber'), key: 'telephone', align: 'center' },
          { title: this.$t('processingContent'), key: 'handledResult', align: 'center' },
          { title: this.$t('operation'), slot: 'action', width: 150, align: 'center' },
        ],
        pathUrl: '',
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.pathUrl = from.fullPath
      })
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.queryRecords()
      },
      async queryRecords() {
        let params = {
          projectCode: this.$route.params.projectCode ? this.$route.params.projectCode : this.$store.state.projectCode,
          mac: this.maintenance.mac,
          dateType: this.dateRadio === this.$t('day') ? '1' : '2',
          date: this.dateRadio === this.$t('day') ? this.maintenance.day : this.maintenance.month,
          page: this.currentPage,
          rows: this.pageSize,
        }
        const res = await listMaintenance(params)
        if (res.success) {
          this.tableData = res.datas
          this.total = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleMore() {
        store.commit('detailsFlagMore', false)
        this.$router.push({
          name: 'MaintenanceRecords',
          params: { projectCode: '' },
        })
      },
      handleDatePicker(val) {
        if (val === this.$t('day')) {
          // 日
          this.dateRadio = this.$t('day')
        } else {
          // 月
          this.dateType = this.$t('month')
        }
        this.queryRecords()
      },
      handleMaintenance() {
        store.commit('maintenanceObj', '')
        store.commit('alarmId', '')
        this.dialogVisible = true
      },
      async handleView(obj) {
        let params = {
          mac: obj.mac,
          alarmId: '',
          id: obj.id,
        }
        const res = await findMaintenance(params)
        if (res.success) {
          store.commit('maintenanceObj', res.data)
          this.maintenanceBoxObj = obj
          if (!this.maintenanceBoxObj.equipmentType) this.maintenanceBoxObj.equipmentType = this.equipmentType
          this.dialogVisible = true
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.queryRecords()
      },
      handleSize(val) {
        this.currentPage = 1
        this.pageSize = val
        this.queryRecords()
      },
      handleQueryRecords() {
        this.currentPage = 1
        this.queryRecords()
      },
      closeMaintenance() {
        store.dispatch('resetMaintenanceObj')
        this.queryRecords()
        this.dialogVisible = false
      },
    },
    watch: {
      $route(to, from) {
        if (from.path === '/MaintenanceBox') this.queryRecords()
      },
    },
    components: {
      MaintenanceEditor,
    },
  }
</script>
<style lang="less" scoped>
  #maintenance {
    margin-top: 10px;
    .bnt {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      padding: 8px;
      margin: 0 5px;
    }
    .block {
      width: 100%;
      margin-top: 10px;
    }
  }
  /deep/.ivu-modal-footer {
    padding: 0;
  }
  .recodTable {
    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }
  }
</style>
