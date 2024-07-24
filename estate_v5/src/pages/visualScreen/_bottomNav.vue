<template>
  <div id="content_bottom">
    <div class="content_left">
      <div style="display: flex; align-items: center">
        <Row class="img_row">
          <Col span="12" class="img_row_col tl">
            <i class="img_row_art ml-10">{{ $t('realTimealarmList') }}</i>
          </Col>
          <Col span="12" class="img_row_col tr">
            <CheckboxGroup v-model="filterType" @on-change="handleFilterType">
              <Checkbox :label="$t('includeAlert')">
                <i ref="re" class="c-default">{{ $t('includeAlert') }}</i>
              </Checkbox>
              <Checkbox :label="$t('onlyofflineAlarmsareDisplayed')">
                <i ref="rf" class="c-default">{{ $t('onlyofflineAlarmsareDisplayed') }}</i>
              </Checkbox>
            </CheckboxGroup>
          </Col>
        </Row>
      </div>
      <div class="qm-table">
        <div class="regional_table">
          <div class="regional_table">
            <el-table :data="tableData" max-height="220px">
              <el-table-column prop="project" label="" width="25">
                <span style="width: 20px"></span>
              </el-table-column>
              <el-table-column prop="project" :label="$t('project')">
                <template #default="{ row }">
                  <div class="scroll_box pointer" v-textRoll @click="handleSwitch(row, 'project')">{{ row.projectName }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="address" :label="$t('place')">
                <template #default="{ row }">
                  <div class="scroll_box pointer project" v-textRoll @click="handleAddress(row)">
                    {{ row.address }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="mac" :label="$t('equipmentNo')">
                <template #default="{ row }">
                  <div @click="handleDetails(row)" v-textRoll class="pointer c-primary" style="color: #2e72eb">
                    {{ row.mac }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="channelTitle" :label="$t('line')"></el-table-column>
              <el-table-column prop="info" :label="$t('alarmType')">
                <template #default="{ row }">
                  <div v-textRoll>{{ row.info }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="stage" :label="$t('state')">
                <template #default="{ row }">
                  <span class="pointer" :class="styleText('1', row.stage)" @click="queryMaintenance(row)">{{ styleText('2', row.stage) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <Modal id="modal" :title="title" v-model="dialogVisible">
      <maintenance-editor v-if="dialogVisible" :maintenanceBoxObj="maintenanceBoxObj" v-on:close-maintenance="closeMaintenance"></maintenance-editor>
      <div slot="footer"></div>
    </Modal>
    <Modal :title="$t('alarmDetails')" id="detailsV" v-model="detailsVisible">
      <Row>
        <Col :span="24">
          <Form :model="form" class="ml-20" label-position="right">
            <FormItem :label="$t('project') + ':'" prop="projectName" :label-width="110">{{ form.projectName }}</FormItem>
          </Form>
        </Col>
        <Col :span="12">
          <Form :model="form" class="ml-20" label-position="right">
            <FormItem :label="$t('eventId') + ':'" prop="id" :label-width="110">{{ form.id }}</FormItem>
            <FormItem :label="$t('deviceAliases') + ':'" prop="macName" :label-width="110">{{ form.macName }}</FormItem>
            <FormItem :label="$t('equipmentStatus') + ':'" prop="onlineStatus" :label-width="110">
              <span :class="form.onlineStatus === 1 ? 'c-success' : form.onlineStatus === 0 ? 'c-danger' : 'c-info'">
                {{ form.onlineStatus === 1 ? $t('online') : form.onlineStatus === 0 ? $t('offline') : $t('disconnected') }}
                <span class="fs-12" v-if="form.offLineTime">{{ '(' + form.offLineTime + ')' }}</span>
              </span>
            </FormItem>
            <FormItem :label="$t('contactNumber') + ':'" prop="linkmanTel" :label-width="110">{{ form.linkmanTel }}</FormItem>
            <FormItem :label="$t('alertAlarmType') + ':'" prop="info" :label-width="110">{{ form.info }}</FormItem>
            <FormItem :label="$t('lineStatus') + ':'" :label-width="110">
              <span v-if="typeof form.oc !== 'undefined'" :class="form.oc ? 'c-success' : 'c-danger'">{{ form.oc ? $t('passed') : $t('broken') }}</span>
            </FormItem>
            <FormItem :label="$t('alarmHandedStatus') + ':'" :label-width="110">
              <span :class="form.stage === 0 ? 'b-danger' : form.stage === 1 ? 'b-info' : 'b-success'">{{ form.stage === 0 ? $t('notProcessed') : form.stage === 1 ? $t('processing') : $t('processed') }}</span>
            </FormItem>
          </Form>
        </Col>
        <Col :span="12">
          <Form :model="form" label-position="right">
            <FormItem :label="$t('place') + ':'" prop="porjectAddress" :label-width="110">
              <div class="no_wrap" :title="form.projectAddress">{{ form.projectAddress }}</div>
            </FormItem>
            <FormItem :label="$t('equipmentNo') + ':'" prop="mac" :label-width="110">{{ form.mac }}</FormItem>
            <FormItem :label="$t('contacts') + ':'" prop="linkman" :label-width="110">{{ form.linkman }}</FormItem>
            <FormItem :label="$t('alarmTime') + ':'" prop="time" :label-width="110">{{ form.time }}</FormItem>
            <FormItem :label="$t('line') + ':'" prop="channelTitle" :label-width="110">{{ form.channelTitle }}</FormItem>
            <!-- 报警值 -->
            <FormItem :label="$t('alarmValue') + ':'" :label-width="110">
              <span class="bgk" v-if="!!decribeType">{{ decribeType }}</span>
              <span class="textcor" v-if="!!typeValue">{{ typeValue }}</span>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import '@/styles/pages/visualScreen.less'
  import store from '@/store'
  import MaintenanceEditor from '../safetyMonitor/allWarn/MaintenanceEditor.vue'
  import screenPie from './charts/BotPie.vue'
  import { realtimeAlarm, findMaintenance } from '@/api/visualScreen/index.js'
  export default {
    components: {
      pie: screenPie,
      MaintenanceEditor,
    },
    data() {
      return {
        decribeType: '',
        typeValue: '',
        warningFlag: false,
        alarmFlag: false,
        dialogVisible: false,
        detailsVisible: false,
        filterTypeParam: '-100',
        title: '',
        filterType: [],
        checked: true,
        form: {},
        electricData: [],
        pieOptions: { legend: [], series: [] },
        tableData: [],
        columnTable: [
          { title: ' ', slot: 'projectimg', width: 40, align: 'rigth' },
          { title: this.$t('project'), slot: 'project' },
          { title: this.$t('place'), slot: 'address', align: 'center' },
          { title: this.$t('equipmentNo'), slot: 'mac', align: 'center' },
          { title: this.$t('line'), key: 'channelTitle', align: 'center' },
          { title: this.$t('alarmType'), slot: 'info', align: 'center', width: 100 },
          { title: this.$t('alarmTime'), slot: 'time', align: 'center' },
          { title: this.$t('state'), slot: 'stage', align: 'center' },
        ],
        detailsTable: [],
      }
    },
    created() {},
    mounted() {
      this.initQueryRealtimeAlarm()
      this.getlunxunData()
    },
    destroyed() {
      window.clearInterval(this.timer)
    },
    methods: {
      styleText(type, val) {
        const typeVal = type === '1'
        const styleTextConfig = {
          0: typeVal ? 'danger-text' : this.$t('notProcessed'),
          1: typeVal ? 'yelo-text' : this.$t('processing'),
          2: typeVal ? 'green-text' : this.$t('processed'),
        }
        return styleTextConfig[val]
      },
      getlunxunData() {
        this.timer = window.setInterval(() => {
          this.initQueryRealtimeAlarm()
        }, 60000)
      },
      initQueryRealtimeAlarm() {
        let params = {
          typeNumbers: this.filterTypeParam,
        }
        realtimeAlarm(params).then(res => {
          this.tableData = res.data
        })
      },
      async queryMaintenance(obj) {
        if (obj.stage === 0) {
          this.title = this.$t('createWorkOrder')
        } else if (obj.stage === 1) {
          this.title = this.$t('editWorkOrder')
        } else {
          this.title = this.$t('workOrderDetails')
        }
        let params = { mac: obj.mac, alarmId: obj.id, id: '' }
        const res = await findMaintenance(params)
        if (res.success) {
          store.commit('maintenanceObj', res.data)
          store.commit('alarmId', obj.id)
          this.maintenanceBoxObj = obj
          this.dialogVisible = true
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      closeMaintenance() {
        store.dispatch('resetMaintenanceObj')
        this.dialogVisible = false
        this.initQueryRealtimeAlarm()
      },
      handleSwitch(obj, type) {
        var path = '/console/project'
        store.commit('overviewMac', '')
        this.$func.switchToProject(obj, path)
      },
      handleAddress(obj, type) {
        var path = '/console/device'
        store.commit('overviewMac', '')
        store.commit('equipmentType', 1)
        this.$func.switchToProject(obj, path)
      },
      handleFilterType(val) {
        this.tableData = []
        if (val.length > 0) {
          if (val.length === 1 && val[0] === this.$t('includeAlert')) {
            this.$refs.re.style = 'color:#409EFF'
            this.filterTypeParam = '-100,-200'
          } else {
            this.$refs.rf.style = 'color:#409EFF'
            this.filterTypeParam = 1002
          }
        } else {
          this.$refs.re.style = 'color:#fff'
          this.$refs.rf.style = 'color:#fff'
          this.filterTypeParam = -100
        }
        this.initQueryRealtimeAlarm()
      },
      handleDetails(row) {
        this.form = row
        let valuesTpe = { ...row.valueDescribe }
        this.typeValue = Object.keys(valuesTpe).length > 0 ? `${row.valueDescribe.value}${row.valueDescribe.unit}${row.valueDescribe.threshold && '(' + this.$t('threshold') + ':' + row.valueDescribe.threshold + row.valueDescribe.unit + ')'}` : ''
        let typeArr = [
          this.$t('power'),
          this.$t('current'),
          this.$t('leakage'),
          this.$t('temperature'),
          this.$t('voltage'),
          this.$t('pressure'),
          this.$t('liquidLevel'),
          this.$t('surgeCurrent'),
          this.$t('signalAndVoltage'),
          this.$t('humidity'),
          this.$t('concentration'),
          this.$t('illumination'),
          this.$t('switchStatus'),
          this.$t('waterQuantity'),
          this.$t('electricQuantity'),
        ]
        typeArr.forEach((item, index) => {
          if (row.elecType === index + 1) {
            this.decribeType = item
          }
        })
        this.detailsVisible = true
      },
      headerCellClassName({ column, columnIndex }) {
        return 'col-blue'
      },
      rowClassName({ row, rowIndex }) {
        return 'row-green'
      },
      cellClassName({ row, rowIndex, column, columnIndex }) {
        return 'col-red'
      },
    },
    watch: {},
  }
</script>

<style lang="less" scoped>
  #content_bottom {
    width: 100%;
    display: flex;
    justify-content: space-between;
    z-index: 999;
    height: 100%;
    scrollbar-width: none;
    ::-webkit-scrollbar {
      display: none;
    }
    .danger-text {
      color: #e6307b;
    }
    .yelo-text {
      color: #e8ea2a;
    }
    .green-text {
      color: #52ffe2;
    }
    .regional_table /deep/ .el-table,
    .regional_table /deep/ .el-table__expanded-cell {
      background-color: transparent;
      color: #99b3c8;
    }
    /* 表格内背景颜色 */
    .regional_table /deep/ .el-table th {
      background-color: rgba(28, 59, 104, 0.5);
      color: #99b3c8;
      border-bottom: none;
    }
    .regional_table /deep/ .el-table::before {
      background-color: transparent;
    }
    .regional_table /deep/ .el-table thead {
      pointer-events: none;
    }
    .regional_table /deep/ .el-table tr {
      background-color: transparent;
      border-bottom: none;
      &:hover {
        background: url('../../assets/images/alarmTableHover.png') center/cover no-repeat;
        background-size: 100% 100%;
        //linear-gradient(to right, rgba(255, 255, 255, 0), rgba(16, 40, 72, 0.8), rgba(255, 255, 255, 0));
        //
      }
    }
    .regional_table /deep/ .el-table td {
      background-color: transparent;
      border-bottom: none;
      //表格字体颜色
      color: #99b3c8;
    }
    .content_left {
      width: 100%;
      position: relative;
      background: url('../../assets/images/bgc5@2x.png') no-repeat;
      background-size: 100% 100%;
      height: 100%;
      padding: 10px 20px;
      img {
        width: 100%;
      }
      .img_row {
        width: 100%;
        background-size: 100% 100%;
        height: 35px;
        display: flex;
        align-items: center;
        .img_row_col {
          width: 100%;
          .img_row_art {
            font-weight: 400;
            font-size: 16px;
            color: #73afec;
          }
        }
      }
    }
    .content_right {
      position: relative;
      right: 0;
      background: url('../../assets/images/bgcr.png') no-repeat;
      background-size: 100% 100%;
      height: 100%;
      padding: 20px;
      .img_row {
        width: 100%;
        background: url('../../assets/images/border.gif') no-repeat;
        background-size: 100% 100%;
        height: 35px;
        display: flex;
        align-items: center;
        .img_row_col {
          width: 100%;
          .img_row_art {
            // font-style:italic;
            // font-family: 'SimHei';
            font-weight: 600;
            font-size: 14px;
            // text-shadow: 5px 5px 5px black, 0px 0px 2px black; // 没错这里设置了两个 shadow
            color: white;
          }
        }
      }
    }
  }
  // .scroll_box{
  //      width:100px;
  //   }
  /deep/.ivu-modal-footer {
    padding: 0;
  }
  .c-default {
    color: #99b3c8;
  }
  .c-default :hover {
    color: #409eff;
  }
  .c-success {
    background-color: rgba(0, 186, 138, 0.15);
    padding: 5px 7px;
    border-radius: 5px;
    color: #00ba8a !important;
  }
  .ml-30 {
    margin-left: 30px;
  }
  .bgk {
    padding: 2px 8px;
    color: #c74841;
    border-radius: 5px;
    background-color: rgba(255, 91, 89, 0.2);
  }
  .textcor {
    color: #c74841;
  }
  .tx {
    text-align: center;
    color: #fff;
  }
  .alarm,
  .warn {
    width: 30px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border-radius: 50%;
    margin-top: -16px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    padding: 8px;
    margin-right: 10px;
  }

  .alarm {
    background: #f56c6c;
  }

  .warn {
    background: #e6a23c;
  }
  .ivu-table-cell {
    white-space: nowrap;
  }
  /deep/.ivu-table-cell:first-child {
    padding: 0;
    margin-right: 10px;
  }
  /deep/.ivu-table-overflowY {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  /deep/.ivu-table-cell {
    white-space: nowrap;
  }
  .tablist {
    span {
      margin-right: 10px;
      width: 30px;
    }
  }
  /deep/ .ivu-modal-header-inner {
    color: #d0f1f7;
  }
  /deep/ .ivu-form-item-label {
    color: rgb(128, 150, 159) !important;
  }
  /deep/ .ivu-form-item-content {
    color: #d0f1f7 !important;
  }
  @media only screen and (min-width: 1024px) {
    .content_left {
      width: 75%;
    }
    .content_right {
      width: 25%;
    }
  }
  @media only screen and (min-width: 1366px) {
    .content_left {
      width: 77%;
    }
    .content_right {
      width: 23%;
    }
  }
  @media only screen and (min-width: 1920px) {
    .content_left {
      width: 80.5%;
    }
    .content_right {
      width: 19.5%;
    }
  }
</style>
