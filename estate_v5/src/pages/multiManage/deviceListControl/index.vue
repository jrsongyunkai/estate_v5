<template>
  <div style="margin-top: 60px">
    <Form ref="form" :model="form" inline style="background-color: #1a202e; padding-top: 20px; padding-left: 20px">
      <Row type="flex" id="buildings-form" :gutter="12">
        <Col :span="3">
          <FormItem style="width: 100%">
            <Select transfer clearable style="width: 100%" v-model="packetTypes" :placeholder="$t('selectGroupingType')" class="en-unit" @on-change="handleTypes">
              <Option v-for="item in packetList" :key="item.id" :label="item.type" :value="item.id"></Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="3">
          <FormItem style="width: 100%">
            <TreeSelect :placeholder="$t('selectGroup')" show-checkbox style="width: 100%" v-model="packetFilter" transfer multiple :data="packetFilterList" />
          </FormItem>
        </Col>

        <Col :span="3">
          <FormItem style="width: 100%">
            <Select transfer clearable v-model="building" style="width: 100%" :placeholder="$t('pleaseSelect') + $store.state.switchData.prjLocation.positionLabelA" @on-change="handleChange">
              <Option z-index="5" v-for="item in buildings" :key="item.value" :label="item.text" :value="item.value"></Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="3">
          <FormItem style="width: 100%">
            <Select transfer clearable v-model="unit" style="width: 100%" :placeholder="$t('pleaseSelect') + $store.state.switchData.prjLocation.positionLabelB" @on-change="handleUnit">
              <Option v-for="item in units" :key="item.value" :label="item.text" :value="item.value"></Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="3">
          <FormItem style="width: 100%">
            <Select transfer clearable style="width: 100%" v-model="status" :placeholder="$t('pleaseSelect') + $t('state')" @on-change="handleStatus">
              <Option v-for="item in stats" :key="item.value" :label="item.text" :value="item.value"></Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="3">
          <FormItem style="width: 100%">
            <Input
              style="width: 100%"
              v-model="form.mac"
              :placeholder="$store.state.switchData.prjLocation.positionLabelC + '/' + $t('equipmentNo')"
              :title="$store.state.switchData.prjLocation.positionLabelC + '/' + $t('equipmentNo')"
              :onkeyup="(form.mac = form.mac.replace(/[, ]/g, ''))"
              @on-keyup.enter.native="handleKeyWords" />
          </FormItem>
        </Col>
        <Col :span="3">
          <Button type="primary" style="margin-right: 10px" @click.stop="handleSearch">{{ $t('query') }}</Button>
          <Button type="default" @click.stop="handleReset">{{ $t('reset') }}</Button>
        </Col>
      </Row>
    </Form>
    <div class="content">
      <h4 style="background-color: #1a202e">
        {{ $t('deviceListControl') }}
      </h4>
      <Row style="background-color: #1a202e; height: 630px">
        <Table style="width: 100%" ref="currentRowTable" :columns="columns3" :data="dataList">
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status == '1'" class="x-success">{{ $t('online') }}</span>
            <span v-if="row.status == '0'" class="dangers">{{ $t('offline') }}</span>
            <span v-if="row.status == '-1'">
              <Tag color="#272c39">
                <span style="color: #999999">{{ $t('disconnected') }}</span>
              </Tag>
            </span>
          </template>
          <template slot-scope="{ row }" slot="operation">
            <Button type="text" style="color: #337efd" @click="listModal(row)">
              {{ $t('line') + $t('list') }}
            </Button>
          </template>
        </Table>
      </Row>
      <div style="background-color: #1a202e">
        <Page :current="currentPage" :page-size="pageSize" :total="total" show-elevator show-total @on-change="change" @on-page-size-change="Changesize"></Page>
      </div>
    </div>

    <Modal v-model="listModalFlag" footer-hide border width="630px" @on-visible-change="visibleChange">
      <div style="margin-bottom: -20px" class="Prjtitle">
        <h4 style="margin-left: 20px">{{ $t('line') + $t('list') }}</h4>
        <div class="btnList">
          <Button class="red" type="primary" @click="oneButtonClose(true)" :disabled="checkSelect.length === 0">{{ $t('oneClickOn') }}</Button>
          <Button class="green" type="primary" @click="oneButtonClose(false)" :disabled="checkSelect.length === 0">{{ $t('oneClickOff') }}</Button>
        </div>
      </div>
      <Row style="padding: 0px 20px; background-color: #1a202e">
        <Table ref="currentRowTable" style="width: 600px; margin-top: 30px" @on-selection-change="changeSelect" :columns="switchColumns" :data="switchList">
          <template slot-scope="{ row }" slot="linestatus">
            <span :class="row.oc ? 'reds' : 'greens'">{{ row.oc ? $t('closing') : $t('opening') }}</span>
          </template>
          <template slot-scope="{ row }" slot="operation">
            <Col>
              <span>
                <Button type="text" style="color: #f24e4c" @click="coloseSwith(row, true)">{{ $t('closing') }}</Button>
              </span>
              <span>
                <Button type="text" style="color: #21f27f" @click="coloseSwith(row, false)">{{ $t('opening') }}</Button>
              </span>
            </Col>
          </template>
        </Table>
      </Row>
    </Modal>
    <Modal title="" v-model="modal" :footer-hide="true" :styles="{ top: '20px', width: '300px' }">
      <br />
      <p v-for="(item, index) in opendatas" :key="index" :style="item.exeResult === 1 ? 'color:#f24e4c;text-align:center;line-height:25px' : 'color:#21f27f;text-align:center;line-height:25px'">
        {{ item.exeResult === 1 ? item.mac + '' + item.msg : item.mac + $t('submitCommand') }}
      </p>
    </Modal>
  </div>
</template>
<script>
  import { queryBoxes, getBuildings, getGroupType, getGroupTree, getEffectAddr, changeStatus } from '@/api/public'
  export default {
    name: 'multiManage-deviceListControl',
    data() {
      return {
        dataList: [],
        switchList: [],
        switchColumns: [
          { type: 'selection', width: 80, align: 'center', title: this.$t('selectAll') },
          { type: 'index', width: 80, title: this.$t('index'), align: 'center' },
          { title: this.$t('lineName'), key: 'title', align: 'center', width: 120 },
          { title: this.$t('state'), slot: 'linestatus', align: 'center', width: 80 },
          { title: this.$t('operation'), slot: 'operation', align: 'center' },
        ],
        columns3: [
          { key: 'number', title: this.$t('index'), width: 100, align: 'center' },
          { title: this.$t('equipmentNo'), key: 'mac' },
          { title: this.$t('deviceAliases'), key: 'name' },
          { title: this.$t('position'), key: 'address' },
          { title: this.$t('lineNos'), key: 'lineNum' },
          { title: this.$t('state'), slot: 'status' },
          { title: this.$t('operation'), slot: 'operation' },
        ],
        listModalFlag: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        form: { mac: '' },
        packetTypes: '',
        packetList: [],
        packetFilter: [],
        packetFilterList: [],
        buildings: [],
        building: '',
        units: [],
        unit: '',
        status: '',
        checkSelect: [],
        stats: [
          { value: '', text: this.$t('all') },
          { value: '1', text: this.$t('online') },
          { value: '0', text: this.$t('offline') },
          { value: '-1', text: this.$t('disconnected') },
        ],
        modal: false,
        opendatas: [],
      }
    },
    created() {
      this.init()
    },
    mounted() {
      this.queryList()
      this.getGroupTypes()
    },
    methods: {
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      queryList() {
        this.loading = true
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize, // 24,
          projectCode: this.$store.state.projectCode, // 'P00000000012',
          build: this.building,
          unit: this.unit,
          status: this.status,
          key: this.form.mac,
          equipmentTypes: 1, // 只是智能空开表
          nodeId: this.packetFilter ? this.packetFilter.join() : this.packetFilte,
        }
        if (localStorage.getItem('dblLineObj')) {
          this.handleModifyMacRate(localStorage.getItem('dblLineObj'), false)
          localStorage.setItem('dblLineObj', '')
        }
        this.$nextTick(function () {
          queryBoxes(params)
            .then(res => {
              if (res.success) {
                this.dataList = res.datas.map(item => ({
                  ...item,
                  lineNum: item.others.countAddr ? item.others.countAddr : 0,
                  address: item.build + item.unit + item.room,
                  status: item.others.online,
                }))
                for (let i = 0; i < this.dataList.length; i++) {
                  this.dataList[i].number = i + 1 + (this.currentPage - 1) * this.pageSize
                }
                this.total = res.total
              } else if (res.code === '-1') {
              } else {
                this.$Message.error({ content: res.message })
              }
            })
            .catch(err => {
              if (err) {
                this.$Message.error({ content: this.$t('unknown') })
              }
            })
        })
      },
      getGroupTrees() {
        if (!this.packetTypes) {
          this.$Message.error({ content: this.$t('selectGroupingType') })
        } else {
          getGroupTree({ groupId: this.packetTypes })
            .then(res => {
              if (res.code === '0') {
                let resData = this.getTree(res.data)
                this.packetFilterList = this.cloneTree(resData)
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
      // 递归遍历数组为树状结构
      getTree(tree = []) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.value = item.id
            obj.parentId = item.parentId
            obj.title = item.name
            // 其他你想要添加的属性
            obj.expand = true
            obj.selected = false
            obj.checked = false
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },

      cloneTree(score, parentId = 0) {
        let tree = []
        score.map(item => {
          if (item.parentId === parentId) {
            item.children = this.cloneTree(score, item.id)
            tree.push(item)
          }
        })

        return tree
      },
      getGroupTypes() {
        let params = {
          projectCode: this.$store.state.projectCode, // 'P00000000012'
        }
        getGroupType(params)
          .then(res => {
            if (res.success) {
              this.packetList = res && res.data
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({ content: res.message })
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({ content: this.$t('unknown') })
            }
          })
      },
      handleChange(val) {
        this.build = val
        this.pageNo = 1
        this.getBuilding()
      },
      init() {
        this.flag = true
        this.getBuilding()
      },
      getBuilding() {
        let all = this.$t('all')
        let params = {
          projectCode: this.$store.state.projectCode, //  'P00000000012'
          equipmentTypes: '1',
          build: this.build,
        }
        this.$nextTick(() => {
          getBuildings(params)
            .then(res => {
              if (res.success) {
                if (params.build && params.build !== '') {
                  this.units = [{ text: all, value: '' }].concat(res.data)
                  this.unit = ''
                } else {
                  this.buildings = [{ text: all, value: '' }].concat(res.data)
                  this.units = []
                  this.unit = ''
                }
                this.queryList()
              } else if (res.code === '-1') {
              } else {
                this.$Message.error({ content: res.message })
              }
            })
            .catch(err => {
              if (err) {
                this.$Message.error({ content: this.$t('unknown') })
              }
            })
        })
      },
      handleReset() {
        this.unit = ''
        this.status = ''
        this.form.mac = ''
        this.packetTypes = ''
        this.packetFilter = ''
        this.building = ''
        this.pageNo = 1
        this.currentPage = 1
        this.queryList()
      },
      handleUnit(val) {
        this.unit = val
        this.pageNo = 1
        this.queryList()
      },
      handleStatus(val) {
        this.pageNo = 1
        this.status = val
        this.queryList()
      },
      handleSearch() {
        this.currentPage = 1
        if (this.packetTypes && this.packetFilter.length === 0) {
          this.$Message.error({ content: this.$t('selectGroup') })
          return false
        } else {
          this.pageNo = 1
          this.queryList()
        }
      },
      handleKeyWords(event) {
        this.form.mac = event.target.value
        this.pageNo = 1
        this.queryList()
      },
      change(val) {
        this.currentPage = val
        this.queryList()
      },
      Changesize(val) {
        this.pageSize = val
        this.queryList()
      },
      listModal(val) {
        this.listModalFlag = true
        this.getAddrs(val)
      },
      getAddrs(val) {
        let params = { mac: val.mac }
        getEffectAddr(params)
          .then(res => {
            if (res.success) {
              this.switchList = res.datas
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({ content: res.message })
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({ content: this.$t('unknown') })
            }
          })
      },
      coloseSwith(val, type, lineList) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmYouWant') + (type ? this.$t('closing') : this.$t('opening')) + '?',
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: () => {
            let _param = [{ mac: val.mac, addrOptInfos: [{ onOrOff: type, addrs: [val.addr] }] }]
            _param = JSON.stringify(_param)
            changeStatus(_param)
              .then(res => {
                if (res.success) {
                  if (res.code === '0') {
                    this.$Message.success({ content: this.$t('submitCommand') })
                  }
                } else if (res.code === '-1') {
                } else {
                  this.$Message.error({ content: res.data[0].mac + res.data[0].msg })
                }
              })
              .catch(err => {
                if (err) {
                  this.$Message.error({ content: this.$t('unknown') })
                }
              })
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('canceled') })
          },
        })
      },
      changeSelect(val) {
        this.checkSelect = val
      },
      oneButtonClose(type) {
        if (this.checkSelect.length > 0) {
          this.switcherCtlEvent(type)
        }
      },
      switcherCtlEvent(type) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmYouWant') + (type ? this.$t('closing') : this.$t('opening')) + '?',
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: () => {
            let arr = this.checkSelect
            let str = []
            arr.forEach(item => {
              str.push({ mac: item.mac, addrOptInfos: [{ onOrOff: type, addrs: [item.addr] }] })
            })
            str = JSON.stringify(str)
            changeStatus(str).then(res => {
              this.modal = true
              if (res.code === 0) {
                this.$Message.success(this.$t('submitCommand'))
              } else {
                this.opendatas = res.data
              }
            })
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('canceled') })
          },
        })
      },
      visibleChange(e) {
        if (!e) this.checkSelect = []
      },
    },
  }
</script>

<style lang="less" scoped>
  .btnList {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
  }
  .greens {
    color: #21f27f;
    background: rgba(0, 186, 138, 0.15);
    padding: 3px;
  }
  .reds {
    color: #f24e4c;
    background: rgba(255, 79, 79, 0.15);
    padding: 3px;
  }
  .grays {
    color: #1a202e;
    background: #1a202e;
  }
  .red {
    background: rgba(242, 78, 76, 0.1);
    color: #f24e4c;
    border: 1px solid #f24e4c;
  }
  .green {
    color: #21f27f;
    border: 1px solid #21f27f;
    background: rgba(33, 242, 127, 0.1);
    margin-left: 20px;
  }
  .dangers {
    background: rgba(255, 79, 79, 0.15) !important;
    color: #f56c6c !important;
    width: 40px;
    height: 22px;
    padding: 2px 5px;
  }
  .content {
    margin-top: 10px;
    padding: 20px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    h4 {
      margin-bottom: 20px;
    }
  }
</style>
