<template>
  <div id="abnormalStateConfig">
    <Tag v-if="show" @on-close="handleClose" closable class="tab" color="primary">
      <Icon color="#999" type="md-chatboxes" />
      <span style="color: #999999">{{ $t('explanation') + '：' + $t('controlRules') }}&nbsp;</span>
    </Tag>
    <br />
    <div class="BlockLabnor">
      <div style="margin-left: 20px; float: left">
        <Select v-model="packetTypes" @on-change="handleTypes" style="width: 200px" :placeholder="$t('selectGroupingType')" :clearable="true">
          <Option v-for="item in packetList" :value="item.id" :key="item.id" :label="item.type"></Option>
        </Select>
      </div>
      <div class="" style="margin-left: 10px; float: left">
        <TreeSelect :placeholder="$t('selectGroup')" multiple show-checkbox style="width: 200px" v-model="packetFilter" transfer :data="packetFilterList" />
      </div>
      <Button class="btn1" @click="search" type="primary">{{ $t('query') }}</Button>
      <Button class="btn" @click="result">{{ $t('reset') }}</Button>
    </div>
    <!-- <br /> -->
    <div style="background: #1a202e; margin-top: -20px; padding: 20px; padding-top: 20px">
      <div class="explanation">
        <h4>{{ $t('explanation') + $t('list') }}</h4>
        <Button class="put" type="primary" @click="addRule">{{ $t('addNewRule') }}</Button>
      </div>

      <br />
      <Table class="table" style="margin-top: 0" ref="currentRowTable" :columns="columns1" :data="data1" :disabled-hover="true" :height="520">
        <template slot="action" slot-scope="{ row, index }">
          <Button type="text" style="color: #007eff" @click="compile(row, index)">{{ $t('edit') }}</Button>
          <Button type="text" style="color: #f24e4c" @click="openPwdsModal(row.id, index)">{{ $t('delete') }}</Button>
        </template>
        <template slot="line" slot-scope="{ row, index }">
          <div class="add" style="margin-top: 10px">
            <button class="adds" @click="add(row)">{{ $t('add') }}</button>
          </div>
          <!-- <span>{{row.line[0].chnlnames}}</span> -->
          <div class="tags">
            <Tag v-for="item in row.line" :key="item.id" :name="item.id" @on-close="handleClose2(item.id, index)" closable size="large" type="border" style="height: 100%">
              <span>{{ item.mac }} &nbsp;&nbsp; {{ item.chnlnames }}</span>
              <!-- <i style="border-left: 1px solid #fff;padding-left:5px" >X</i> -->
            </Tag>
          </div>
        </template>

        <template slot="people" slot-scope="{ row }">
          <Tag v-for="item in row.people" :key="item.tel + item.name" :name="item.tel + item.name" size="large" type="border" class="tag">{{ item.name }} &nbsp;&nbsp; {{ item.tel }}</Tag>
          <!-- <div  v-for="item in row.people"  :key="item">
            {{ item.name + item.tel }}
          </div> -->
        </template>
        <template slot="status" slot-scope="{ row }">
          <!-- <Button v-if="row.state === 1" ghost type="success"> 有效 </Button>
          <Button v-else type="error" ghost> 无效 </Button> -->
          <p :style="row.status !== 1 ? 'color:#F24E4C;background:rgba(242, 78, 76,.1);width:54px;text-align: center;height:20px' : 'color:#0DD667;background:rgba(13, 214, 103,.1);width:54px;text-align: center;height:20px'">
            {{ row.status === 1 ? $t('valid') : $t('invalid') }}
          </p>
        </template>
      </Table>
      <Page show-total :current="page" @on-change="changePage" @on-page-size-change="changesize" :total="total" show-elevator style="margin-top: 10px" />
    </div>
    <Modal v-model="forTipShow" :title="$t('tip')" width="800">
      <div v-for="item in forTipData" :key="item">
        <div style="font-size: 16px; margin-bottom: 10px">【{{ item.projectName }}】</div>
        <div style="margin-left: 20px">
          <div v-for="(val, index) in item.resultList" :key="index" style="margin-bottom: 5px">
            <span>{{ val.errTime }}</span>
            <span style="color: #606266; font-weight: 700">{{ val.onBur }}</span>
            <span>{{ '(' + val.mac + ')' }}</span>
            <span style="color: #606266; font-weight: 700">{{ val.chnlName }}</span>
            <span style="color: #f57272">{{ val.errDesc }}</span>
            <span>{{ val.linkInfo }}</span>
          </div>
        </div>
      </div>
      <div style="color: #2d8cf0; margin-left: 20px; cursor: pointer" @click="handleSeeAll">{{ $t('viewAll') }}</div>
    </Modal>
    <div id="width">
      <Modal v-model="flag" title="1111" width="700" :footer-hide="true">
        <div slot="header" class="head">{{ formValidate.id ? $t('editRule') : $t('addNewRule') }}</div>
        <br />
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" id="width" inline>
          <FormItem :label="$t('ruleName')" prop="ruleName">
            <Input v-model="formValidate.ruleName" :placeholder="$t('pleaseEnter') + $t('ruleName')" style="width: 400px"></Input>
          </FormItem>
          <br />
          <FormItem :label="$t('ruleLogic')">
            <TimePicker format="HH:mm" :placeholder="$t('anyTime')" :editable="false" style="width: 220px" v-model="formValidate.actTime"></TimePicker>
          </FormItem>
          <FormItem :label="$t('shouldBeInThe')" class="slt1" style="margin-left: -40px">
            <Select :clearable="true" v-model="model2" @on-select="changelist" style="width: 120px">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <!-- <br /> -->

          <FormItem :label="$t('contacts') + ' 1'" prop="linkMan1">
            <Input v-model="formValidate.linkMan1" :placeholder="$t('contacts') + ' 1'" style="width: 120px"></Input>
          </FormItem>
          <FormItem prop="linkTel1" class="inp1" style="margin-left: -120px">
            <Input v-model="formValidate.linkTel1" :placeholder="$t('phone') + ' 1'" style="width: 270px"></Input>
          </FormItem>

          <FormItem label="" prop="linkMan2">
            <Input v-model="formValidate.linkMan2" :label="$t('contacts') + ' 2'" style="width: 120px"></Input>
          </FormItem>
          <FormItem prop="linkTel2" style="margin-left: -120px">
            <Input v-model="formValidate.linkTel2" :placeholder="$t('phone') + ' 2'" style="width: 270px"></Input>
          </FormItem>
          <FormItem label="" prop="linkMan3">
            <Input v-model="formValidate.linkMan3" :label="$t('contacts') + '3'" style="width: 120px"></Input>
          </FormItem>
          <FormItem prop="linkTel3" style="margin-left: -120px">
            <Input v-model="formValidate.linkTel3" :placeholder="$t('phone') + ' 3'" style="width: 270px"></Input>
          </FormItem>
          <br />
          <FormItem :label="$t('state')">
            <Select :clearable="true" v-model="model3" @on-select="changestate" style="width: 220px">
              <Option v-for="item in cityLists" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <br />
          <FormItem class="formLast">
            <Button type="primary" @click="handleSubmit('formValidate')">{{ $t('save') }}</Button>
            <Button style="margin-left: 8px" @click="cencle">{{ $t('cancel') }}</Button>
          </FormItem>
          <br />
          <br />
          <br />
        </Form>
        <div style="position: relative; bottom: 264px; left: 57px; width: 60px">{{ $t('contacts') + '2' }}</div>
        <div style="position: relative; bottom: 227px; left: 57px; width: 60px">{{ $t('contacts') + '3' }}</div>
      </Modal>
      <Modal v-model="flag2" width="1200" :title="$t('addDeviceLine')">
        <other />
        <br />
        <br />
        <div slot="footer"></div>
      </Modal>
    </div>
    <Modal v-model="openSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSeconedPwd" :isfoucs="false" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <div>
          <Button type="default" @click="openSeconedPwd = false">{{ $t('cancel') }}</Button>
          <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  import { groupingList, tree } from '@/api/safetyMonitor/public'
  import { getGroupType, getGroupTree, forTip, checkSecondPwd } from '@/api/public'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import store from '@/store'
  import { deStatuscan, delDeStatuscanConfDetail, delDeStatuscanConf, saveDeStatuscanConf } from '@/api/multiManage/abnormalStateConfig'
  import other from './other.vue'
  export default {
    name: 'multiManage-abnormalStateConfig',
    data() {
      return {
        bpk: null,
        newPwdsSeconed: '',
        openSeconedPwd: false,
        rowDatas: '',
        rowIndex: '',
        forTipShow: false,
        islinkMan2: false,
        islinkMan3: false,
        show: true,
        model1: '',
        cityList1: [],
        cityList2: [],
        value: '',
        value1: '',
        columns1: [
          {
            title: this.$t('ruleName'),
            key: 'ruleName',
            // align: 'center'
          },
          {
            title: this.$t('deviceLine'),
            // align: 'center',
            width: '500',
            slot: 'line',
          },
          {
            title: this.$t('ruleLogic'),
            key: 'rule',
            // align: 'center'
          },
          {
            title: this.$t('contacts'),
            // align: 'center',
            slot: 'people',
          },
          {
            title: this.$t('state'),
            align: 'center',
            width: '100',
            slot: 'status',
          },
          {
            title: this.$t('operation'),
            slot: 'action',
            width: '180',
            align: 'center',
          },
        ],
        data1: [],
        page: 1,
        total: 0,
        parmas: {
          projectCode: this.$store.state.projectCode,
          pageNo: 1,
          pageSize: 10,
          nodeId: '',
        },
        flag: false,
        formValidate: {},
        ruleValidate: {
          ruleName: [
            {
              required: true,
              message: this.$t('cannotBeEmpty'),
              trigger: 'blur',
            },
          ],
          linkMan1: [
            {
              required: true,
              message: this.$t('cannotBeEmpty'),
              trigger: 'blur',
            },
          ],
          linkTel1: [
            {
              required: true,
              message: this.$t('cannotBeEmpty'),
              trigger: 'blur',
            },
          ],
          linkMan2: [
            {
              required: true,
              message: this.$t('cannotBeEmpty'),
              trigger: 'blur',
            },
          ],
          linkTel2: [
            {
              required: true,
              message: this.$t('cannotBeEmpty'),
              trigger: 'blur',
            },
          ],
          linkMan3: [
            {
              required: true,
              message: this.$t('cannotBeEmpty'),
              trigger: 'blur',
            },
          ],
          linkTel3: [
            {
              required: true,
              message: this.$t('cannotBeEmpty'),
              trigger: 'blur',
            },
          ],
        },
        cityList: [
          {
            value: '0',
            label: this.$t('opening'),
          },
          {
            value: '1',
            label: this.$t('closing'),
          },
        ],
        cityLists: [
          {
            value: 1,
            label: this.$t('valid'),
          },
          {
            value: 0,
            label: this.$t('invalid'),
          },
        ],
        model2: '',
        model3: '',
        id: null,
        data: [],
        flag2: false,
        packetTypes: '',
        packetList: [],
        packetFilter: [],
        packetFilterList: [],
        forTipData: [],
      }
    },
    mounted() {
      this.timer = window.setInterval(() => {
        setTimeout(() => {
          this.handleForTip()
        }, 0)
      }, 15000)
    },
    destroyed() {
      window.clearInterval(this.timer)
    },
    methods: {
      openPwdsModal(id, index) {
        this.newPwdsSeconed = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
          this.rowDatas = id
          this.rowIndex = index
        } else {
          this.deleteList(id, index)
        }
      },
      closePwdModal() {
        this.openSeconedPwd = false
      },
      getnewPwdsVal(val) {
        this.newPwdsSeconed = val
      },
      checkSecondePwds() {
        if (this.newPwdsSeconed.length < 6) {
          this.newPwdsSeconed = ''
          return this.$Message.error({
            content: this.$t('pleaseEnterComplateSubPassword'),
          })
        }
        const encry = new JSEncrypt()
        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          checkSecondPwd({ secondPwd: encry.encrypt(this.newPwdsSeconed), encB64: true }).then(res => {
            if (res.success) {
              if (res.code === '0') {
                // this.$Message.success({
                //     content: '校验成功'
                // })
                this.openSeconedPwd = false
                this.deleteList(this.rowDatas, this.rowIndex)
              }
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        })
      },
      closePwds() {
        this.openSeconedPwd = false
        this.$Message.info({
          content: this.$t('cancelDelete'),
        })
      },
      init() {
        //
        deStatuscan(this.parmas).then(res => {
          this.data = res.datas
          this.total = res.total
          this.page = res.page
          this.data1 = []
          this.List = null
          res.datas.forEach(item => {
            let str = item.cpValue === '0' ? this.$t('opening') : this.$t('closing')
            let people = [
              { name: item.linkMan1, tel: item.linkTel1 },
              { name: item.linkMan2, tel: item.linkTel2 },
              { name: item.linkMan3, tel: item.linkTel3 },
            ]
            for (let i = 0; i < people.length; i++) {
              if (people[i].name === '') {
                people.splice(i, 1)
                i--
              }
            }
            this.List = item.others.confDetailList
            this.data1.push({
              ruleName: item.ruleName,
              rule: item.actTime + this.$t('shouldBeInThe') + str + this.$t('state'),
              line: this.List,
              people,
              status: item.status,
              id: item.id,
            })
          })
        })
      },
      handleForTip() {
        let params = {
          projectCode: this.$store.state.projectCode,
        }
        forTip(params).then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.forTipShow = true
              this.forTipData = res.data
            }
          }
        })
      },
      handleSeeAll() {
        this.$router.push({ path: '/safetyMonitor/abnormalState' })
      },
      distinct(arr, key) {
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            if (arr[i][key] === arr[j][key]) {
              arr.splice(j, 1)
              j = j - 1
            }
          }
        }
        return arr
      },

      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      handleClose() {
        this.show = false
      },
      groupingType(e) {
        //
        if (e !== undefined) this.changeType(e)
      },
      changeType(nodeId) {
        this.$nextTick(() => {
          tree({ nodeId }).then(res => {
            // 使用递归
            function sys(arr, parentId) {
              let data2 = []
              if (arr.length !== 0) {
                // 经过一系列过滤去筛选，如果后面筛选出来的数组为空，就结束递归
                let pArr = res.data.filter(value => {
                  // 筛选出满足条件的
                  return value.parentId === parentId
                })
                let mArr = arr.filter(value => {
                  // 筛选出不满足条件的 剩下的就是之前筛选出来的子集
                  return value.parentId !== parentId
                })
                pArr.forEach((value, i) => {
                  let arr = {}
                  arr.title = value.name
                  arr.value = value.id
                  arr.children = sys(mArr, value.id)
                  data2.push(arr)
                })
                return data2
              } else {
                return false
              }
            }
            this.cityList2 = sys(res.data, 0)
          })
        })
      },
      getdata() {
        groupingList({ projectCode: this.$store.state.projectCode }).then(res => {
          if (res.data) {
            this.cityList1 = res.data
            for (let i = 0; i < res.data.length; i++) {
              this.cityList1[i].value = res.data[i].id
            }
          }

          //
        })
      },
      isError(value, flag) {
        if (value) this[flag] = false
        // false 就是不显示
        else this[flag] = true
      },
      groupingChoise(e) {
        // 分组筛选完之后，就传给父级进行应用，根据这个ID发请求
        // 分组筛选
        let str = ''
        e.forEach(item => {
          str += item + ','
        })
        str = str.substr(0, str.length - 1)
        this.parmas.nodeId = str
      },
      result() {
        this.value1 = ''
        this.model1 = ''
        this.parmas.nodeId = ''
        this.cityList2 = []
        this.packetTypes = ''
        this.packetFilter = []
        this.init()
      },
      getGroupTypes() {
        let params = {
          projectCode: this.$store.state.projectCode, // 'P00000000012'
        }
        getGroupType(params)
          .then(res => {
            //
            if (res.success) {
              this.packetList = res && res.data
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
                content: this.$t('unknown'),
              })
            }
          })
      },
      cloneTree(score, parentId = 0) {
        let tree = []
        score.map(item => {
          if (item.parentId === parentId) {
            // 递归寻找
            item.children = this.cloneTree(score, item.id)
            tree.push(item)
          }
        })

        return tree
      },
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
      cencle(value) {
        this.flag = false
        this.model2 = ''
        this.model3 = ''
        this.$refs['formValidate'].resetFields()
        // this.$refs[value].resetFields();
      },
      search() {
        if (this.packetTypes && this.packetFilter.length === 0) {
          this.$Message.error({ content: this.$t('selectGroup') })
          return false
        } else {
          let str = ''
          if (this.packetFilter.length !== 0) {
            this.packetFilter.forEach(item => {
              str += item + ','
            })
            str = str.substr(0, str.length - 1)
          }
          this.parmas.pageNo = 1
          this.parmas.nodeId = str
          this.init()
        }
      },
      changePage(e) {
        this.parmas.pageNo = e
        this.init()
      },
      changesize(e) {
        this.parmas.pageSize = e
        this.init()
      },
      handleClose2(id, index) {
        delDeStatuscanConfDetail({ id }).then(res => {
          if (res.success) {
            this.$Message.success(this.$t('deleteSuccessful'))
            this.data1[index].line.forEach((item, i) => {
              if (item.id === id) {
                this.data1[index].line.splice(i, 1)
                //
              }
            })
          } else if (res.code === '-1') {
          } else {
            this.$Message.error(this.$t('deleteFailed'))
          }
        })

        //
      },
      addRule() {
        this.flag = true
        this.formValidate = {
          actTime: this.$Date().format('HH:mm'),
          cpType: 1,
          cpValue: '0',
          linkMan1: '',
          linkMan2: '',
          linkMan3: '',
          linkTel1: '',
          linkTel2: '',
          linkTel3: '',
          others: { confDetailList: [] },
          ruleName: '',
          status: 1,
        }
      },
      compile(row, index) {
        this.formValidate = this.data[index]
        this.model2 = this.data[index].cpValue
        this.model3 = this.data[index].status
        this.flag = true
      },
      deleteList(id, index) {
        delDeStatuscanConf({ id: id }).then(res => {
          if (res.success) {
            this.$Message.success({ content: this.$t('deleteSuccessful'), top: '100px' })
            this.data1.splice(index, 1)
            this.init()
          } else if (res.code === '-1') {
          } else {
            this.$Message.error(this.$t('deleteFailed'))
          }
        })
      },
      changestate(e) {
        this.formValidate.status = e.value
      },
      changelist(e) {
        this.formValidate.cpType = e.value
      },
      handleSubmit(name) {
        this.ruleValidate = {
          ruleName: [
            {
              required: true,
              message: this.$t('cannotBeEmpty'),
              trigger: 'blur',
            },
          ],
          linkMan1: [
            {
              required: true,
              message: this.$t('cannotBeEmpty'),
              trigger: 'blur',
            },
          ],
          linkTel1: [
            {
              required: true,
              message: this.$t('cannotBeEmpty'),
              trigger: 'blur',
            },
          ],
        }

        this.$nextTick(() => {
          this.$refs[name].validate(valid => {
            if (valid) {
              this.formValidate.projectCode = this.$store.state.projectCode
              // 正则检验 /^1([358][0-9]|4[579]|66|7[0135678]|9[8])/
              let reg = /^1([3589][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/

              let flag = reg.test(this.formValidate.linkTel1)
              this.formValidate.cpValue = this.model2
              if (flag) {
                saveDeStatuscanConf(this.formValidate).then(res => {
                  if (res.success) {
                    this.$Message.success({
                      content: this.$t('savedSuccessfully'),
                    })
                    this.cencle()
                    this.init()
                  } else if (res.code === '-1') {
                  } else {
                    this.$Message.error(res.message)
                  }
                })
              } else {
                this.$Message.error(this.$t('pleaseEnterCorrectPhoneNumber'))
              }
            } else {
              this.$Message.error(this.$t('requiredContent'))
            }
          })
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      add(row) {
        // :style="'line-height:'row.line.length"
        //
        this.flag2 = true
        store.commit('ruleId', row)
        // store.commit('ruleId', row)
      },
      saveSuccess() {
        this.flag2 = false
        this.init()
      },
    },
    created() {
      this.init()
      this.getGroupTypes()
    },
    components: {
      other,
      PwsSeconedCheckVue,
    },
    watch: {
      data1: {
        handler(newVal, oldVal) {
          this.data1 = newVal
        },
        deep: true,
      },
      ruleValidate: {
        handler(newVal, oldVal) {
          this.ruleValidate = newVal
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less" scoped>
  .ivu-tag-size-large {
    padding: 0 8px;
  }
  .explanation {
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    font-size: 16px;
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  #abnormalStateConfig {
    margin-top: -20px;
    .tab {
      width: 100%;
      height: 42px;
      line-height: 42px;
      border: 1px solid #999;
      font-size: 15px;
      margin-bottom: 10px;
      margin-top: 20px;
      .ivu-icon-ios-close {
        float: right;
        line-height: 42px;
        margin-right: 20px;
      }
    }
    .BlockLabnor {
      margin-bottom: 30px;
      width: 100%;
      margin-left: 0;
      background: #1a202e;
      height: 55px;
      line-height: 55px;

      // background-color: #fff;
      .btn1 {
        height: 32px;
        color: #fff;
        line-height: 20px;
        // margin-right: 20px;
        // margin-top: 10px;
        // float: right;
        border: none;
        margin-left: 10px;
        background-color: #007eff;
      }
      .btn {
        height: 32px;
        color: #fff;
        line-height: 20px;
        margin-left: 10px;
        background-color: #1a202e;
        // border: 1px solid #fff;
        // margin-right: 20px;
        // margin-top: 10px;
        // float: right;
      }
    }
    h2 {
      float: left;
      margin-top: -10px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
    .put {
      height: 32px;
      background-color: #007eff;
    }
    .table {
      margin-top: 30px;

      ::-webkit-scrollbar {
        width: 5px;
        // background-color: #fff;
      }

      :hover ::-webkit-scrollbar-track-piece {
        /*鼠标移动上去再显示滚动条*/
        // background-color: #fff;
        /* 滚动条的背景颜色 */
        border-radius: 6px;
        /* 滚动条的圆角宽度 */
      }

      :hover::-webkit-scrollbar-thumb:vertical {
        background-color: #ccc;
        border-radius: 6px;
        // outline: 2px solid #fff;
        outline-offset: -2px;
        // border: 2px solid #fff;
      }
      .add {
        width: 50px;
        .adds {
          width: 100%;
          height: 32px;
          line-height: 100%;
          background: rgba(0, 126, 255, 0.1);
          border: 1px solid #007eff;
          border-radius: 5px;
          color: #007eff;
          cursor: pointer;
        }
      }

      .tags {
        margin-top: 10px;
        margin-bottom: 3px;
        .tag {
          line-height: 100%;

          font-size: 12px;
        }
        .text {
          float: left;
          max-width: 287px;
          overflow: auto;
        }
        .ivu-tag-border.ivu-tag-closable .ivu-icon-ios-close {
          z-index: 5;
          left: 8px;
        }
      }
    }
    .head {
      font-family: 'PingFangSC-Regular';
      color: #999;
      font-size: 18px;
      margin-left: 30px;
      // border-bottom: 1px solid #fff;
    }
    .ivu-tag-border {
      height: 32px;
      line-height: 32px;
      border: 1px solid #999;
      color: #fff;
      // background: #fff !important;
      position: relative;
    }
    .ivu-modal-content .ivu-modal-header {
      border-bottom: 1px solid #fff;
    }
    #ban {
      width: 45%;
      float: left;
    }
    #width {
      width: 700px;

      .inp {
        width: 270px;
        margin-left: -120px;
      }
      .inp1 {
        .ivu-form-item-error-tip {
          margin-left: -120px;
        }
      }
      .tem {
        width: 120px;
      }
      .slt {
        width: 220px;
      }
      .slt1 {
        margin-left: -40px;
      }
      .slts {
        width: 70px;
      }
    }
    .formLast {
      float: left;
    }
  }
</style>
