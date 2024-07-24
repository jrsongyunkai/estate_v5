<template>
  <div class="loadManagement">
    <div class="tabsCount" v-if="newsAdd === 1">
      <Tabs @on-click="handletabCount">
        <TabPane v-for="item in TypeList" :key="item.type" :label="item.name">
          <Row class="section">
            <Col class="type">
              <Select v-model="packetTypes" @on-change="handleTypes" style="width: 200px" :placeholder="$t('selectGroupingType')" :clearable="true">
                <Option v-for="item in packetList" :value="item.id" :key="item.id" :label="item.type"></Option>
              </Select>
            </Col>
            <Col class="type">
              <TreeSelect :placeholder="$t('selectGroup')" multiple style="width: 200px" show-checkbox v-model="packetFilter" transfer :data="packetFilterList" />
            </Col>
            <Col class="type">
              <Input class="short-input" :placeholder="$t('searchForLoadNameOrLocationOrLine')" clearable v-model="shortInput"></Input>
            </Col>
            <Button type="primary" style="margin-left: 10px; background: #007eff" @click="handleonSubmit">{{ $t('query') }}</Button>
            <Button style="margin: 0 10px" @click="handleReset">{{ $t('reset') }}</Button>
            <div class="export" @click="handleExport">
              <Tooltip :content="$t('export')">
                <Icon custom="icon-v5 icon-v5-daochu2" size="20" style="margin-left: 10px" />
              </Tooltip>
            </div>
          </Row>
          <div class="tableCount">
            <div class="header">
              <h4>{{ $t('loadList') }}</h4>
              <Button type="primary" @click="addNews(2)">{{ $t('addLoad') }}</Button>
            </div>
            <div class="count">
              <Table :columns="columns" :data="data">
                <template slot-scope="{ row }" slot="mac">{{ row.macName }}{{ `(${row.mac})` }}</template>
                <template slot-scope="{ row }" slot="power">{{ row.workPowerMin }}-{{ row.workPowerMax }}</template>
                <template slot-scope="{ row }" slot="voltage">{{ row.workVoltageMin }}-{{ row.workVoltageMax }}</template>
                <template slot-scope="{ row }" slot="action">
                  <span class="pointer" style="color: #007eff; margin: 0 5px" @click="handleQueryDetail(row.id)">{{ $t('view') }}</span>
                  <span class="pointer" style="color: #007eff; margin: 0 5px" @click="hanleEdit(row.id)">{{ $t('edit') }}</span>
                  <Poptip confirm :transfer="true" :title="$t('deleteConfirmTip')" @on-ok="handleDelete(row.id)">
                    <span class="pointer" style="color: #ff5722; margin: 0 5px">{{ $t('delete') }}</span>
                  </Poptip>
                </template>
              </Table>
            </div>
            <Page show-total :current="currentPage" @on-change="changePage" @on-page-size-change="changesize" :total="total" show-elevator />
          </div>
        </TabPane>
      </Tabs>
    </div>
    <div class="newsCount" v-if="newsAdd === 2">
      <h3>{{ $t('baseInfo') }}</h3>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150" class="formValidate">
        <FormItem :label="$t('ns_loadConfig.label1')" prop="imgUrl">
          <Upload
            :show-upload-list="false"
            :default-file-list="defaultList"
            :format="['jpg', 'jpeg', 'png']"
            :max-size="2048"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            multiple
            type="drag"
            :action="action"
            name="beforeImgFile"
            :data="beforeImgData"
            style="display: inline-block; width: 200px; higth: 200px">
            <div v-if="formValidate.imageUrl">
              <div class="demo-upload-list" v-if="demoImg1 === true">
                <img :src="formValidate.imageUrl" style="width: 100%" />
              </div>
            </div>
            <div style="width: 200px; height: 100px; line-height: 100px" v-if="!formValidate.imageUrl">
              <Icon type="md-add" size="20"></Icon>
            </div>
          </Upload>
          <div style="color: #999999">{{ $t('ns_loadConfig.tip1') }}</div>
        </FormItem>
        <FormItem :label="$t('ns_loadConfig.label2')" prop="names">
          <Input :placeholder="$t('pleaseEnterLoadName')" style="width: 400px" v-model="formValidate.names"></Input>
        </FormItem>
        <FormItem :label="$t('ns_loadConfig.label3')">
          <Input :placeholder="$t('ns_loadConfig.tip3')" style="width: 400px" prop="brandName" v-model="formValidate.brandName"></Input>
        </FormItem>
        <FormItem :label="$t('ns_loadConfig.label4')" prop="typeLsit">
          <Select :placeholder="$t('ns_loadConfig.tip4')" style="width: 400px" v-model="formValidate.typeLsit">
            <Option v-for="item in TypeLists" :key="item.type" :value="item.type">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('ns_loadConfig.label5')" prop="macInput">
          <div style="display: flex">
            <Button class="export" style="margin-right: 20px" @click="handleAddr">{{ $t('selectLine') }}</Button>
            <Input :placeholder="$t('ns_loadConfig.tip5')" style="width: 310px" disabled v-model="formValidate.macInput"></Input>
          </div>
        </FormItem>
        <FormItem :label="$t('position')" prop="location">
          <Input :placeholder="$t('pleaseEnterLocationInformation')" style="width: 400px" v-model="formValidate.location"></Input>
        </FormItem>
        <FormItem :label="$t('ns_loadConfig.label6')" prop="Radio">
          <RadioGroup v-model="formValidate.Radio">
            <Radio label="1">{{ $t('yes') }}</Radio>
            <Radio label="0">{{ $t('no') }}</Radio>
          </RadioGroup>
        </FormItem>
        <h3 style="margin: 40px 0">{{ $t('ns_loadConfig.title1') }}</h3>
        <FormItem :label="$t('ns_loadConfig.label7')" prop="Ratedpower">
          <Input :placeholder="$t('ns_loadConfig.tip7')" style="width: 400px" v-model="formValidate.Ratedpower"></Input>
        </FormItem>
        <FormItem :label="$t('ns_loadConfig.label8')" prop="MinOperatingpower">
          <Row>
            <Col>
              <Input :placeholder="$t('minValue')" v-model="formValidate.MinOperatingpower" style="width: 168px"></Input>
            </Col>
            <Col span="1" style="text-align: center">{{ $t('to') }}</Col>
            <Col>
              <FormItem prop="MaxOperatingpower">
                <Input :placeholder="$t('maxValue')" v-model="formValidate.MaxOperatingpower" style="width: 168px"></Input>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('ns_loadConfig.label9')" prop="Factorpower">
          <Input placeholder="0-1" style="width: 400px" v-model="formValidate.Factorpower"></Input>
        </FormItem>
        <FormItem :label="$t('ns_loadConfig.label10')" prop="MinVoltagepower">
          <Row>
            <Col>
              <Input :placeholder="$t('minValue')" style="width: 168px" v-model="formValidate.MinVoltagepower"></Input>
            </Col>
            <Col span="1" style="text-align: center">{{ $t('to') }}</Col>
            <Col>
              <FormItem prop="MaxVoltagepower">
                <Input :placeholder="$t('maxValue')" style="width: 168px" v-model="formValidate.MaxVoltagepower"></Input>
              </FormItem>
            </Col>
          </Row>
        </FormItem>

        <FormItem style="text-align: right">
          <Button style="margin-right: 20px" @click="addNews(1)">{{ $t('cancel') }}</Button>
          <Button type="primary" @click="handleAdd('formValidate')">{{ $t('save') }}</Button>
        </FormItem>
      </Form>
    </div>
    <div class="detCount" v-if="newsAdd === 3">
      <div class="back" @click="addNews(1)">
        <i class="icon-v5 icon-v5-xiangzuo"></i>
        {{ $t('back') }}
      </div>
      <Row style="margin-top: 10px">
        <Col class="bacg" :span="14">
          <Col :span="6" class="bcimg"><img :src="detailData.imgUrl" alt="" /></Col>
          <Col style="width: 400px" class="wp">
            <Form :label-width="130">
              <FormItem :label="`${$t('ns_loadConfig.label2')}:`">
                <span>{{ detailData.name }}</span>
              </FormItem>
              <FormItem :label="`${$t('associatedDevice')}:`">
                <span>{{ detailData.macName + `(${detailData.mac})` }}</span>
              </FormItem>
              <FormItem :label="`${$t('position')}:`">
                <span>{{ detailData.location }}</span>
              </FormItem>
              <FormItem :label="`${$t('ns_loadConfig.label6')}:`">
                <span>{{ detailData.isKey === 0 ? $t('no') : $t('yes') }}</span>
              </FormItem>
            </Form>
          </Col>
          <Col style="width: 400px" class="wp">
            <Form :label-width="130">
              <FormItem :label="`${$t('type')}:`">
                <span>{{ detailData.typeName }}</span>
              </FormItem>
              <FormItem :label="`${$t('ns_loadConfig.label5')}:`">
                <span>{{ detailData.addrName }}</span>
              </FormItem>
            </Form>
          </Col>
        </Col>
        <Col :span="10" style="display: flex; background: #1a202e">
          <Col :span="12" style="border-left: 10px solid #090f19; border-right: 10px solid #090f19">
            <div class="Rightbox wp">
              <div class="Vbox" style="display: flex">
                <div class="imgBox">
                  <i class="icon-v5 icon-v5-edinggongshuai"></i>
                </div>
                <div class="count">
                  <div class="num">{{ detailData.ratedPower }} w</div>
                  <div class="type">{{ $t('ratedPower') }}</div>
                </div>
              </div>
            </div>
            <div class="Rightbox wp" style="margin-top: 10px; border-top: 10px solid #090f19">
              <div class="Vbox" style="display: flex">
                <div class="imgBox">
                  <i class="icon-v5 icon-v5-gongzuodianya"></i>
                </div>
                <div class="count">
                  <div class="num">{{ detailData.workVoltageMin }}v~{{ detailData.workVoltageMax }}v</div>
                  <div class="type">{{ $t('ratedWorkingVoltage') }}</div>
                </div>
              </div>
            </div>
          </Col>
          <Col :span="12">
            <div class="Rightbox wp">
              <div class="Vbox" style="display: flex">
                <div class="imgBox">
                  <i class="icon-v5 icon-v5-gongzuogongshuaifanwei"></i>
                </div>
                <div class="count">
                  <div class="num">{{ detailData.workPowerMin }}w~{{ detailData.workPowerMax }}w</div>
                  <div class="type">{{ $t('ns_loadConfig.label8') }}</div>
                </div>
              </div>
            </div>
            <div class="Rightbox wp" style="margin-top: 10px; border-top: 10px solid #090f19">
              <div class="Vbox" style="display: flex">
                <div class="imgBox">
                  <i class="icon-v5 icon-v5-gongshuaiyinshu"></i>
                </div>
                <div class="count">
                  <div class="num">{{ detailData.powerFactor }}</div>
                  <div class="type">{{ $t('ns_loadConfig.label9') }}</div>
                </div>
              </div>
            </div>
          </Col>
        </Col>
      </Row>
      <Row style="margin-top: 10px; background: #1a202e" class="data">
        <Col class="header">
          <Col class="left">
            <span class="icon"></span>
            <span class="name">{{ $t('operationalDataSituation') }}</span>
          </Col>
          <Col class="right">
            <DatePicker @on-change="handleDetailTimes" type="date" placement="bottom-end" :value="days" style="width: 200px"></DatePicker>
            <Button type="primary" @click="hanldeTrand(ids)">{{ $t('query') }}</Button>
          </Col>
        </Col>
      </Row>
      <div class="statuscount">
        <div class="header">{{ $t('switchCondition') }}</div>
        <OpecoStatus :options="statusData" />
        <template v-if="detailData.isKey === 0 ? false : true">
          <div class="header">{{ $t('powerConsumption') }}</div>
          <loadArea :options="powerData" />
        </template>
      </div>
    </div>
    <Modal :title="$t('selectLine')" v-model="addr" width="30%" append-to-body>
      <Row class="addrBox">
        <Col :span="12" style="border-right: 1px solid #28313f">
          <div class="header">{{ $t('selectDeviceAndLine') }}</div>
          <div class="search">
            <Input :placeholder="$t('enterDeviceNo')" v-model="mac" style="margin-right: 5px" />
            <Button type="primary" @click="handleSearch">{{ $t('query') }}</Button>
          </div>
          <div class="tree">
            <Menu :theme="theme2" @on-select="handleTress" :open-names="['1']">
              <Submenu name="1" class="loadMune">
                <template slot="title">{{ $t('intelligentAirSwitch') }}</template>
                <MenuItem :name="`${item.mac}:${item.resId}`" v-for="item in macData" :key="item.id">{{ item.name }}{{ `(${item.mac})` }}</MenuItem>
              </Submenu>
            </Menu>
          </div>
        </Col>
        <Col :span="12">
          <div class="header">{{ $t('selectLine') }}</div>
          <RadioGroup v-model="checkAllGroup" class="grop">
            <Radio v-for="item in lines" :key="item.addr" :label="`${item.title}:${item.addr}`" style="margin: 10px; width: 100%">
              <span>{{ item.title }}</span>
            </Radio>
          </RadioGroup>
        </Col>
      </Row>
      <div slot="footer">
        <Button @click="handleSummit">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('loadPowerReminder')" v-model="reminder" width="30%" append-to-body>
      <span>{{ $t('loadPowerReminderTip') }}</span>
      <div slot="footer">
        <Button class="b-dger" @click="Continueadding">{{ $t('continueToAdd') }}</Button>
        <Button class="b-blue" @click="hanldeUnadd">{{ $t('cancelAdd') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import OpecoStatus from '../../Common/OpecoStatus.vue'
  import loadArea from '../../Common/loadArea.vue'
  import { getGroupType, getGroupTree, queryTypeList, saveLoad, queryDetail, loadDelete, queryList, queryBoxes, queryChannels, trand } from '@/api/public'
  export default {
    name: 'multiManage-loadManagement',
    components: { OpecoStatus, loadArea },
    data() {
      return {
        packetTypes: '',
        packetList: [],
        packetFilter: [],
        packetFilterList: [],
        newsAdd: 1,
        deTails: false,
        reminder: false,
        TypeLists: '',
        theme2: 'dark',
        statusData: { time: [], data: [] },
        currentPage: 1,
        pageSize: 10,
        total: 0,
        powerData: { title: { show: false }, xAxis: [], series: [], yAxis: [] },
        columns: [
          { type: 'index', title: this.$t('index'), width: 100, align: 'center' },
          { title: this.$t('ns_loadConfig.label2'), key: 'name' },
          { title: this.$t('ns_loadConfig.label4'), key: 'typeName' },
          { title: this.$t('associatedDevice'), slot: 'mac', width: 160 },
          { title: this.$t('ns_loadConfig.label5'), key: 'addrName', width: 160 },
          { title: this.$t('position'), key: 'location' },
          { title: this.$t('ratedPower') + '(W)', key: 'ratedPower', width: 160 },
          { title: this.$t('ns_loadConfig.label8') + '(W)', slot: 'power', width: 160 },
          { title: this.$t('ns_loadConfig.label9'), key: 'powerFactor', width: 160 },
          { title: this.$t('ratedWorkingVoltage') + '(W)', slot: 'voltage', width: 220 },
          { title: this.$t('operation'), slot: 'action', align: 'center' },
        ],
        data: [],
        demoImg1: true,
        formValidate: { imgUrl: '', names: '', brandName: '', Ratedpower: '', MinOperatingpower: '', MaxOperatingpower: '', Factorpower: '', MinVoltagepower: '', MaxVoltagepower: '', imageUrl: '', Radio: '1', typeLsit: '', macInput: '', location: '' },
        ruleValidate: {
          imgUrl: [
            {
              required: true,
              type: 'object',
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!value) {
                  return callback(new Error(this.$t('imageCannotBeEmpty')))
                } else {
                  callback()
                }
              },
            },
          ],
          names: [{ required: true, message: this.$t('pleaseEnterLoadName'), trigger: 'blur' }],
          typeLsit: [{ required: true, message: this.$t('ns_loadConfig.tip4'), trigger: 'change', type: 'number' }],
          macInput: [{ min: 14, required: true, message: this.$t('ns_loadConfig.tip5'), trigger: 'blur' }],
          location: [{ required: true, message: this.$t('pleaseEnterLocationInformation'), trigger: 'blur' }],
          Radio: [{ required: true, message: this.$t('ns_loadConfig.tip6'), trigger: 'change' }],
          Ratedpower: [{ required: true, message: this.$t('ns_loadConfig.tip7'), trigger: 'blur', pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g }],
          Factorpower: [{ required: true, message: this.$t('pleaseEnterCorrectPowerFactor'), trigger: 'blur', pattern: /^(0.\d+|0|1)?$/g }],
          MinOperatingpower: [{ required: true, message: this.$t('ns_loadConfig.tip8'), trigger: 'blur', pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g }],
          MaxOperatingpower: [{ required: true, message: this.$t('ns_loadConfig.tip9'), trigger: 'blur', pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g }],
          MinVoltagepower: [{ required: true, message: this.$t('ns_loadConfig.tip10'), trigger: 'blur', pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g }],
          MaxVoltagepower: [{ required: true, message: this.$t('ns_loadConfig.tip11'), trigger: 'blur', pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g }],
        },
        defaultList: [],
        TypeList: '',
        tagType: 0,
        addr: false,
        checkAllGroup: '',
        mac: '',
        resId: '',
        macData: [],
        lines: [],
        checkedLines: [],
        checkedAddr: [],
        newCheck: '',
        macVal: '',
        lineVal: null,
        addrVal: null,
        checkPower: true,
        action: `${this.$func.ctxPaths()}/maintenance/imgUrl/before/upload.as?v=` + new Date().getTime(),
        beforeImgData: { name: 'beforeImgFile' },
        detailData: '',
        shortInput: '',
        detailTimes: { startTime: this.$Date().format('YYYY-MM-DD'), endTime: this.$Date().format('YYYY-MM-DD') },
        days: this.$Date().format('YYYY-MM-DD'),
        ids: '',
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getGroupTypes()
        this.hanldeQueryTypeList()
        this.handleQueryList()
      },
      handleonSubmit() {
        if (this.packetTypes && this.packetFilter.length === 0) {
          this.$Message.error({ content: this.$t('selectGroup') })
          return false
        } else {
          this.init()
        }
      },
      handleSuccess(res, file) {
        this.demoImg1 = true
        if (res.success) {
          this.formValidate.imgUrl = res.data
        } else if (res.code === '-1') {
        } else {
          this.$Message.error(res.message)
        }
      },
      // 图片大小判断
      beforeUpload(file) {
        this.formValidate.imageUrl = URL.createObjectURL(file)
        this.srcList = [this.formValidate.imageUrl]
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isLt1M) {
          this.$Message.error(this.$t('exceedSize'))
        }
        return isLt1M
      },
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      getGroupTypes() {
        let params = { projectCode: this.$store.state.projectCode }
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
      getGroupTrees() {
        getGroupTree({ groupId: this.packetTypes })
          .then(res => {
            if (res.code === '0') {
              this.packNewlist = res.data
              let resData = this.getTree(res.data)
              this.packetFilterList = this.cloneTree(resData)
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.this.$t('unknown'),
              })
            }
          })
      },
      unique(arr) {
        return Array.from(new Set(arr))
      },
      getListid(val) {
        val.map(itm => {
          this.packNewlist.map(item => {
            if (JSON.stringify(item).toLowerCase().indexOf(itm) > -1) {
              this.newArr.push(item.id)
            }
            return this.newArr
          })
        })
        this.packetFilter = this.unique(this.newArr)
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
            obj.expand = true
            obj.selected = false
            obj.checked = false
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },
      addNews(val) {
        if (val === 1) {
          this.newsAdd = 1
        } else if (val === 2) {
          this.formValidate = {
            imgUrl: '',
            names: '',
            brandName: '',
            Ratedpower: '',
            MinOperatingpower: '',
            MaxOperatingpower: '',
            Factorpower: '',
            MinVoltagepower: '',
            MaxVoltagepower: '',
            imageUrl: '',
            Radio: '1',
            typeLsit: '',
            macInput: '',
            location: '',
          }
          this.newsAdd = 2
          this.hanldeTypeList()
        }
      },
      hanldeQueryTypeList() {
        queryTypeList().then(res => {
          if (this.newsAdd === 2) {
            this.TypeList = res.data
          } else {
            this.TypeList = [
              { name: this.$t('allLoads'), type: '0' },
              { name: this.$t('capacitiveLoad'), type: '1' },
              { name: this.$t('resistiveLoad'), type: '2' },
              { name: this.$t('inductiveLoad'), type: '3' },
            ]
          }
        })
      },
      hanldeTypeList() {
        queryTypeList().then(res => {
          this.TypeLists = res.data
        })
      },
      handletabCount(data) {
        this.tagType = data
        this.currentPage = 1
        this.handleQueryList()
      },
      handleQueryList() {
        let params = {
          projectCode: this.$store.state.projectCode,
          type: this.tagType,
          nodeIds: this.packetFilter ? this.packetFilter.join() : this.packetFilter,
          keyword: this.shortInput,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        }
        queryList(params).then(res => {
          this.data = res.datas
          this.total = res.total
        })
      },
      handleDelete(id) {
        let params = {
          projectCode: this.$store.state.projectCode,
          id: id,
        }
        loadDelete(params).then(res => {
          this.handleQueryList()
        })
      },
      handleAddr() {
        this.addr = true
        this.queryList()
      },
      queryList(mac) {
        let params = {
          pageNo: '1',
          pageSize: 10000,
          projectCode: this.$store.state.projectCode,
          equipmentTypes: '1,2',
        }
        if (mac) params.key = mac
        queryBoxes(params).then(res => {
          if (res.success) {
            this.macData = res.datas
          } else if (res.code === '-1') {
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleSearch() {
        this.queryList(this.mac)
      },

      handleChannels(val) {
        queryChannels({ mac: val }).then(res => {
          if (res.success) {
            this.lines = res.datas
            this.checkedLines = res.datas.map(item => {
              return item.title
            })
          } else if (res.code === '-1') {
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleTress(data) {
        var datas = ''
        this.checkAllGroup = ''
        datas = data.split(':')
        this.lines = []
        this.macVal = datas[0]
        this.resId = datas[1]
        this.handleChannels(this.macVal)
      },
      handleSummit() {
        if (this.checkAllGroup !== '') {
          var data = ''
          this.lineVal = []
          this.addrVal = ''
          data = this.checkAllGroup.split(':')
          this.lineVal.push(data[0])
          this.addrVal = data[1]
          this.formValidate.macInput = this.macVal + `[${this.lineVal}]`
          this.addr = false
        } else {
          this.addr = true
          this.$Message.error({ content: this.$t('pleaseSelectLine2') })
        }
      },

      hanldeUnadd() {
        this.reminder = false
      },
      handleAdd(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            let params = {
              id: this.formValidate.id === undefined ? '' : this.formValidate.id,
              projectCode: this.$store.state.projectCode,
              name: this.formValidate.names,
              brand: this.formValidate.brandName,
              type: this.formValidate.typeLsit,
              isKey: this.formValidate.Radio,
              resId: this.resId === '' ? this.formValidate.resId : this.resId,
              mac: this.macVal === '' ? this.formValidate.mac : this.macVal,
              addr: this.addrVal === null ? this.formValidate.addr : this.addrVal,
              location: this.formValidate.location,
              imgUrl: this.formValidate.imgUrl,
              ratedPower: this.formValidate.Ratedpower,
              workPowerMin: this.formValidate.MinOperatingpower,
              workPowerMax: this.formValidate.MaxOperatingpower,
              powerFactor: this.formValidate.Factorpower,
              workVoltageMin: this.formValidate.MinVoltagepower,
              workVoltageMax: this.formValidate.MaxVoltagepower,
              checkPower: this.checkPower,
            }
            saveLoad(params).then(res => {
              if (res.code === '0') {
                if (res.data.load_power_exceed !== true) {
                  this.addNews(1)
                  this.init()
                } else {
                  this.reminder = true
                }
              } else {
                this.$Message.error({ content: res.message })
              }
            })
          } else {
            this.$Message.error(this.$t('pleaseEnterRequiredParameters'))
          }
        })
      },
      Continueadding() {
        let params = {
          id: this.formValidate.id,
          projectCode: this.$store.state.projectCode,
          name: this.formValidate.names,
          brand: this.formValidate.brandName,
          type: this.formValidate.typeLsit,
          isKey: this.formValidate.Radio,
          resId: this.resId === '' ? this.formValidate.resId : this.resId,
          mac: this.macVal === '' ? this.formValidate.mac : this.macVal,
          addr: this.addrVal === null ? this.formValidate.addr : this.addrVal,
          location: this.formValidate.location,
          imgUrl: this.formValidate.imgUrl,
          ratedPower: this.formValidate.Ratedpower,
          workPowerMin: this.formValidate.MinOperatingpower,
          workPowerMax: this.formValidate.MaxOperatingpower,
          powerFactor: this.formValidate.Factorpower,
          workVoltageMin: this.formValidate.MinVoltagepower,
          workVoltageMax: this.formValidate.MaxVoltagepower,
          checkPower: false,
        }
        saveLoad(params).then(res => {
          if (res.code === '0') {
            if (res.data.load_power_exceed !== true) {
              this.reminder = false
              this.addNews(1)
              this.init()
            }
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleQueryDetail(id) {
        this.ids = id
        let params = { projectCode: this.$store.state.projectCode, id: id }
        queryDetail(params).then(res => {
          this.newsAdd = 3
          this.hanldeTrand(id)
          this.detailData = res.data
        })
      },
      hanldeTrand(id) {
        let params = {
          projectCode: this.$store.state.projectCode,
          id: id,
          startTime: this.detailTimes.startTime,
          endTime: this.detailTimes.endTime,
        }
        trand(params).then(res => {
          var data = res.data
          var main = []
          this.statusData = { time: [], data: [] }
          data.xAxis.forEach(val => {
            this.statusData.time.push(val)
          })
          data.ocList.forEach(val => {
            this.statusData.data.push(val)
          })
          data.powerList.forEach(val => {
            main.push(val)
          })
          this.powerData.xAxis = []
          this.powerData.series = []
          this.powerData.xAxis = this.statusData.time
          this.powerData.yAxis.name = this.$t('leakageKwh')
          this.powerData.series[0] = {
            name: this.$t('leakageKwh'),
            type: 'line',
            data: main,
            itemStyle: { color: '#007EFF' },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                  { offset: 1, color: 'rgba(3, 115, 230, 0.3)' },
                ],
                global: false,
              },
            },
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 4,
            smooth: true,
          }
        })
      },

      hanleEdit(id) {
        this.hanldeTypeList()
        let params = { projectCode: this.$store.state.projectCode, id: id }
        queryDetail(params).then(res => {
          this.newsAdd = 2
          this.detailData = res.data
          this.formValidate.addr = this.detailData.addr
          this.formValidate = {
            id: id,
            names: this.detailData.name,
            brandName: this.detailData.brand,
            Ratedpower: this.detailData.ratedPower,
            MinOperatingpower: this.detailData.workPowerMin,
            MaxOperatingpower: this.detailData.workPowerMax,
            Factorpower: this.detailData.powerFactor,
            MinVoltagepower: this.detailData.workVoltageMin,
            MaxVoltagepower: this.detailData.workVoltageMax,
            imageUrl: this.detailData.imgUrl,
            imgUrl: this.detailData.imgUrl,
            Radio: String(this.detailData.isKey),
            typeLsit: this.detailData.type,
            macInput: this.detailData.mac + `[${this.detailData.addrName}]`,
            location: this.detailData.location,
            resId: this.detailData.resId,
            mac: this.detailData.mac,
            addr: this.detailData.addr,
          }
          this.ruleValidate = {
            names: [{ required: true, message: this.$t('pleaseEnterLoadName'), trigger: 'blur' }],
            typeLsit: [{ required: true, message: this.$t('ns_loadConfig.tip4'), trigger: 'change', type: 'number' }],
            macInput: [{ required: true, message: this.$t('ns_loadConfig.tip5'), trigger: 'blur' }],
            location: [{ required: true, message: this.$t('positionInformation'), trigger: 'blur' }],
            Radio: [{ required: true, message: this.$t('ns_loadConfig.tip6'), trigger: 'change' }],
            Ratedpower: [{ required: true, message: this.$t('ns_loadConfig.tip7'), trigger: 'blur', pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g }],
            Factorpower: [{ required: true, message: this.$t('pleaseEnterCorrectPowerFactor'), trigger: 'blur', pattern: /^(0.\d+|0|1)?$/g }],
            MinOperatingpower: [{ required: true, message: this.$t('ns_loadConfig.tip8'), trigger: 'blur', pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g }],
            MaxOperatingpower: [{ required: true, message: this.$t('ns_loadConfig.tip9'), trigger: 'blur', pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g }],
            MinVoltagepower: [{ required: true, message: this.$t('ns_loadConfig.tip10'), trigger: 'blur', pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g }],
            MaxVoltagepower: [{ required: true, message: this.$t('ns_loadConfig.tip11'), trigger: 'blur', pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g }],
          }
        })
      },
      handleReset() {
        this.packetTypes = ''
        this.packetFilter = []
        this.shortInput = ''
        this.init()
      },
      handleExport() {
        this.$func.windowCountDown('/load/xls/exportList.as?&projectCode=' + this.$store.state.projectCode + '&type=' + this.tagType + '&nodeIds=' + this.packetFilter + '&keyword=' + this.shortInput)
      },
      changePage(e) {
        this.currentPage = e

        this.handleQueryList()
      },
      changesize(e) {
        this.pageSize = e
        this.handleQueryList()
      },
      handleDetailTimes(val) {
        this.detailTimes = { startTime: val, endTime: val }
      },
    },
  }
</script>
<style lang="less" scoped>
  .loadManagement {
    .section {
      background: #1a202e;
      padding: 20px;
      .type {
        margin-right: 10px;
      }
    }
    /deep/.ivu-tabs-nav-scroll {
      background: #1a202e;
      padding: 10px;
    }

    .export {
      background: rgba(0, 126, 255, 0.1);
      border: 1px solid #007eff;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      .ivu-icon {
        color: #007eff;
        margin: 0 !important;
      }
    }
    .tableCount {
      margin-top: 10px;
      padding: 20px;
      background: #1a202e;
      .header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        font-size: 16px;
      }
    }
    .newsCount {
      background: #1a202e;
      padding: 20px;
      .formValidate {
        margin-top: 20px;
        overflow: auto;
        height: 900px;
        &::-webkit-scrollbar {
          display: none;
        }
        scrollbar-width: none;
      }
    }
    /deep/.ivu-form-item-label {
      text-align: left;
    }
    .detCount {
      .back {
        cursor: pointer;
      }
      .bacg {
        background: #1a202e;
        display: flex;
        padding: 20px;
        /deep/.ivu-form-item-label {
          text-align: right;
          color: #818183;
        }
        .bcimg {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          max-width: 200px;
          img {
            width: 100%;
          }
        }
      }
    }
    .Rightbox {
      background: #1a202e;
      padding: 30px;
      .Vbox {
        margin-top: 5px;
        .imgBox {
          width: 60px;
          height: 60px;
          background: rgba(0, 126, 255, 0.2);
          border-radius: 10px;
          text-align: center;
          line-height: 60px;
          .icon-v5 {
            color: #007eff;
            font-size: 40px;
          }
        }
        .count {
          margin-left: 20px;
          .num {
            font-size: 26px;
            font-family: PingFang SC;
            font-weight: 500;
          }
          .type {
          }
        }
      }
    }
    .data {
      .header {
        padding: 10px;
        width: 100%;
        border-bottom: 1px solid #393e4a;
        margin: 0 10px;
        display: flex;
        justify-content: space-between;

        .left {
          display: flex;
          align-items: center;
          .icon {
            display: block;
            width: 2px;
            height: 14px;
            background: #007eff;
            margin-right: 10px;
          }
          .name {
          }
        }
        .right {
          display: flex;
          .datepick {
            display: flex;
            align-items: center;
            .date {
              border: 1px solid #393e4a;
              padding: 5px 10px;
              margin-right: 5px;
              border-radius: 5px;
              color: #666666;
              cursor: pointer;
            }
          }
          .inputVal {
            margin-right: 10px;
            .input {
            }
          }
          Button {
            margin-left: 10px;
          }
        }
      }
    }
  }
  .addrBox {
    border: 1px solid #28313f;
    .header {
      background: #28313f;
      padding: 10px;
    }
    .search {
      padding: 10px;
      display: flex;
      input {
      }
    }
    .tree {
    }
  }
  .loadMune {
    height: 300px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  /deep/.ivu-menu {
    width: 100% !important;
  }

  /deep/.ivu-menu-submenu-title {
    background: #262c3b !important;
    width: 100%;
    padding: 10px;
  }
  /deep/.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active {
    background: transparent !important;
    color: #007eff;
  }
  /deep/.ivu-menu-item {
    padding-left: 10px !important;
  }
  /deep/.ivu-icon {
    right: 0px;
  }
  /deep/.ivu-menu-item-active {
    background: none !important;
  }
  .ivu-checkbox-group {
    display: flex;
    flex-direction: column;
    padding: 10px;
  }
  .ivu-checkbox-group-item {
    margin-bottom: 10px;
  }
  /deep/.ivu-checkbox {
    margin-right: 10px;
  }
  /deep/.ivu-modal-footer {
    border: none;
  }
  .statuscount {
    background: #1a202e;
    padding: 20px;
    .header {
      font-size: 16px;
      font-weight: 700;
    }
  }
  .grop {
    height: 350px;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  /deep/.ivu-icon {
    right: 8px;
  }
</style>
