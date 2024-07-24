<template>
  <div id="maintenance">
    <div class="mainM">
      <div class="left">
        <h2>{{ isbz ? $t('editMaintenanceWorkorderInformation') : $t('newMaintenanceWorkorderInformation') }}</h2>
        <div class="inputdata">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
            <FormItem :label="$t('maintenanceDevice') + ':'" prop="mac" class="MT">
              <Input v-model="formValidate.mac" disabled :placeholder="$t('pleaseSelect')" style="width: 250px"></Input>
              &nbsp;&nbsp;
              <Button ghost type="primary" style="color: #007eff" @click="getMac">{{ $t('pleaseSelectADevice') }}</Button>
            </FormItem>

            <FormItem :label="$t('maintenanceDeviceAliases') + ':'" class="MT">
              {{ OtherName }}
            </FormItem>
            <!-- 日期选择 -->
            <FormItem prop="date" :label="$t('maintenanceDate') + ':'" class="MT">
              <DatePicker type="datetime" v-model="formValidate.date" format="yyyy-MM-dd HH:mm:ss" confirm placement="top" :placeholder="$t('pleaseSelectDate')" style="width: 350px" @on-change="getdate" :editable="false" :clearable="false"></DatePicker>
            </FormItem>

            <FormItem :label="$t('maintenanceContent')" prop="content" class="MT">
              <Input v-model="formValidate.content" type="textarea" :placeholder="$t('pleaseEnter')" :autosize="{ minRows: 2, maxRows: 5 }"></Input>
            </FormItem>

            <FormItem :label="$t('maintenanceFault')" prop="malfunctionContent" class="MT">
              <Input v-model="formValidate.malfunctionContent" type="textarea" :placeholder="$t('pleaseEnter')" :autosize="{ minRows: 2, maxRows: 5 }"></Input>
            </FormItem>
            <FormItem :label="$t('maintenanceResults')" prop="result" class="MT">
              <Input v-model="formValidate.result" type="textarea" :placeholder="$t('pleaseEnter')" :autosize="{ minRows: 2, maxRows: 5 }"></Input>
            </FormItem>

            <div style="color: #007eff; font-size: 12px; margin-left: 130px; margin-top: -20px; margin-bottom: 20px">{{ $t('workOrderTips') }}</div>
            <FormItem :label="$t('maintenanceSuggestions')" prop="suggest" class="MT">
              <Input v-model="formValidate.suggest" type="textarea" :placeholder="$t('pleaseEnter')" :autosize="{ minRows: 2, maxRows: 5 }"></Input>
            </FormItem>

            <FormItem class="MT" :label="$t('maintenanceBefore') + ':'">
              <Modal :title="$t('picShow')" v-model="visible">
                <img :src="imgUrls" v-if="visible" style="width: 100%" />
              </Modal>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :on-success="handleSuccess"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                :action="action"
                name="beforeImgFile"
                :data="beforeImgData"
                style="display: inline-block; width: 58px">
                <div style="width: 58px; height: 58px; line-height: 58px">
                  <Icon type="md-add" size="20"></Icon>
                </div>
              </Upload>

              &nbsp;
              <div class="demo-upload-list" v-show="uploadList">
                <template>
                  <img :src="uploadList ? uploadList : imgUrls" />
                  <div class="demo-upload-list-cover">
                    <!-- 获取大图 -->
                    <Icon type="ios-eye-outline" @click.native="handleView(uploadList)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                  </div>
                </template>
              </div>
              <div class="uploadTip">{{ $t('workOrderUploadRequire') }}</div>
            </FormItem>

            <FormItem class="MT" :label="$t('maintenanceAfter') + ':'">
              <Modal :title="$t('picShow')" v-model="visible1">
                <img :src="imgUrls1" v-if="visible1" style="width: 100%" />
              </Modal>
              <Upload
                ref="upload1"
                :show-upload-list="false"
                :default-file-list="defaultList1"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="2048"
                :on-format-error="handleFormatError1"
                :on-exceeded-size="handleMaxSize1"
                :on-success="handleSuccess1"
                :before-upload="handleBeforeUpload1"
                multiple
                type="drag"
                :action="action"
                name="afterImgFile"
                :data="beforeImgData1"
                style="display: inline-block; width: 58px">
                <div style="width: 58px; height: 58px; line-height: 58px">
                  <Icon type="md-add" size="20"></Icon>
                </div>
              </Upload>
              &nbsp;
              <div class="demo-upload-list" v-show="uploadList1">
                <template>
                  <img :src="uploadList1 ? uploadList1 : imgUrls1" />
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView1(uploadList1)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove1(item)"></Icon>
                  </div>
                </template>
              </div>
              <div class="uploadTip">{{ $t('workOrderUploadRequire') }}</div>
            </FormItem>

            <FormItem>
              <Button style="background: #007eff; border: none" type="primary" @click="completeInput">{{ $t('complete') }}</Button>
              &nbsp;
              <Button @click="cancel">{{ $t('cancelMaintenance') }}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <div style="background-color: rgb(9, 15, 25); float: left; width: 0.5%; height: 100%"></div>
      <div class="right">
        <Timeline class="historydata">
          <h2>{{ $t('workOrderHistory') }}</h2>
          <TimelineItem v-for="item in datas" :key="item.id" :color="item.status === 1 ? '#0DD667' : '#E03C3A'">
            <span class="time" style="margin-bottom:50px;!important">{{ item.createTime }}</span>
            <p class="content">
              {{ $t('personnel') + ':' + item.handlerName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('state') + ':' }}

              <span :style="item.status === 1 ? 'color:#0DD667' : 'color:#E03C3A'">{{ item.status === 1 ? $t('processed') : $t('notProcessed') }}</span>
            </p>
            <p class="content">{{ $t('maintenanceContent') + item.content }}</p>
            <p class="content">
              {{ $t('maintenanceResults') + item.result ? item.result : $t('nothing') }}
            </p>
          </TimelineItem>
          <h1 v-if="allNum === 0" style="font-size: 16px; color: #999">
            {{ $t('noData') }}
          </h1>
        </Timeline>
        <h4 class="btn" @click="more" v-if="allNum > 5">
          {{ $t('clickLoadMore') }}
        </h4>
      </div>
    </div>

    <Modal id="mac" :title="$t('selectDevice')" :close-on-click-modal="false" custom-class="custom-select-dialog" :before-close="handleCancel" v-model="selectFlag" width="75%">
      <div>
        <Form :model="ruleForm" ref="ruleForm" class="rule-form">
          <FormItem>
            <Row :gutter="16">
              <Col :span="4" class="left-padding-right">
                <Input v-model="ruleForm.build" :placeholder="$t('building')"></Input>
              </Col>
              <Col :span="4" class="left-padding-right ml-5">
                <Input v-model="ruleForm.unit" :placeholder="$t('unit1')"></Input>
              </Col>
              <Col :span="4" class="left-padding-right ml-5">
                <Input v-model="ruleForm.mac" :placeholder="$t('equipmentNo')"></Input>
              </Col>
              <Col :span="8">
                <Button type="primary" @click="handleSearch">{{ $t('query') }}</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
        <Table class="mt-20 device-wrap" :data="boxesData" :max-height="500" :columns="boxesColumn" @on-selection-change="handleSelectionChange">
          <template slot-scope="{ row }" slot="mac">
            <div>{{ row.mac }}</div>
            <div>{{ row.name }}</div>
          </template>
          <template slot-scope="{ row }" slot="position">
            <div>
              {{ row.build + '\xa0\xa0\xa0' + row.unit + '\xa0\xa0\xa0' + row.room }}
            </div>
          </template>

          <template slot-scope="{ row }" slot="status">
            <span v-show="row.others.online === -1" class="c-info">{{ $t('disconnected') }}</span>
            <span v-show="row.others.online === 0" class="c-danger">{{ $t('offline') }}</span>
            <span v-show="row.others.online === 1" class="c-success">{{ $t('online') }}</span>
          </template>

          <template slot-scope="{ row }" slot="operating">
            <Button style="color: #409eff" type="text" @click="handleMac(row)">{{ $t('selectDevice') }}</Button>
          </template>
        </Table>
      </div>
      <span slot="footer" style="height: 60px">
        <Row>
          <Col :span="24" class="tc">
            <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current-page.sync="currentPage" :page-size-opts="[20, 50, 100]" :page-size="20" show-elevator show-total layout="sizes, prev, pager, next" :total="total"></Page>
          </Col>
        </Row>
      </span>
    </Modal>
  </div>
</template>

<script>
  import { inquireDetail, pushinput } from '@/api/multiManage/workOrder'
  import { queryBoxes } from '@/api/multiManage/batchConfig'
  export default {
    data() {
      return {
        allNum: 0,
        formValidate: {
          content: '',
          result: '',
          mac: '',
          malfunctionContent: '',
          suggest: '',
          date: this.$Date().format('YYYY-MM-DD HH:mm'),
        },
        changeName: false,
        ruleValidate: {
          malfunctionContent: [
            {
              // 为空的时候
              required: true,
              message: this.$t('inputCannotBeEmpty'), // 提示文字
              trigger: 'blur', // 失去焦点
            },
            {
              // 最少输入的数据
              type: 'string',
              min: 5,
              message: this.$t('enterAtLeast5characters'),
              trigger: 'blur',
            },
          ],
          content: [
            {
              // 为空的时候
              required: true,
              message: this.$t('inputCannotBeEmpty'), // 提示文字
              trigger: 'blur', // 失去焦点
            },
            {
              // 最少输入的数据
              type: 'string',
              min: 5,
              message: this.$t('enterAtLeast5characters'),
              trigger: 'blur',
            },
          ],
          date: [
            {
              required: true,
              type: 'date',
              message: this.$t('pleaseEnterDate'),
              trigger: 'change',
            },
            {
              // 为空的时候
              required: true,
              type: 'date',
              message: this.$t('pleaseSelectDate'), // 提示文字
              trigger: 'blur', // 失去焦点
            },
          ],
          mac: [
            {
              // 为空的时候
              required: true,
              message: this.$t('inputCannotBeEmpty'), // 提示文字
              trigger: 'blur', // 失去焦点
            },
          ],
        },
        beforeImgData: { name: 'beforeImgFile' },
        date: '',
        action: `${this.$func.ctxPaths()}/maintenance/imgUrl/before/upload.as?v=` + new Date().getTime(),
        defaultList: [],
        visible: false,
        uploadList: '',
        datas: [],
        form: {
          imgUrls: [],
        },
        srcList: '',
        imgUrls: '',

        beforeImgData1: { name: 'afterImgFile' },
        date1: '',
        defaultList1: [],
        visible1: false,
        uploadList1: '',
        datas1: [],
        form1: {
          imgUrls: [],
        },
        srcList1: '',
        imgUrls1: '',
        ruleForm: {
          mac: '',
          build: '',
          unit: '',
        },
        boxesColumn: [
          {
            title: this.$t('equipmentNo'),
            slot: 'mac',
            align: 'center',
          },
          {
            title: this.$t('position'),
            slot: 'position',
            align: 'center',
          },
          {
            title: this.$t('state'),
            slot: 'status',
            align: 'center',
          },
          {
            title: this.$t('operation'),
            slot: 'operating',
            align: 'center',
          },
        ],
        selectFlag: false,
        devices: [],
        boxesData: [],
        currentPage: 1,
        pageSize: 20,
        total: 0,
        OtherName: this.$t('pleaseSelectDeviceNo'),
        size: 5,
        id: '',
        selectData: [],
      }
    },
    methods: {
      handleView(name) {
        this.imgUrls = name
        this.visible = true
      },
      handleRemove() {
        this.uploadList = ''
      },
      handleSuccess(res, file) {
        this.uploadList = file.response.data // { imgUrl: this.imgUrls, imgUrls: file.response.data }
        if (res.success) {
          this.form.imgUrls[0] = res.data
          this.form.imgUrls[1] = this.form.imgUrls[1] === undefined ? (this.form.imgUrls[1] = '') : this.form.imgUrls[1]
        } else if (res.code === '-1') {
        } else {
          this.$Message.error(res.message)
        }
      },
      handleFormatError(file) {
        this.$Message.error(this.$t('uploadError'))
      },
      handleMaxSize(file) {
        // 超过2M
        this.$Message.error(this.$t('imgLarger2M'))
      },
      handleBeforeUpload(file) {
        this.imgUrls = URL.createObjectURL(file)
        // const check = this.uploadList.length < 3;
        // if (!check) {
        //     this.$Notice.warning({
        //         title: '上传图片不能多于3张'
        //     });
        // }
        // return check;
      },
      handleView1(name) {
        this.visible1 = true
      },
      handleRemove1(file) {
        this.uploadList1 = ''
        // const fileList = this.$refs.upload1.fileList;
        // this.uploadList1.splice(fileList.indexOf(file), 1);
      },
      handleSuccess1(res, file) {
        this.uploadList1 = file.response.data // .push({ imgUrl: this.imgUrls1, imgUrls: file.response.data })
        if (res.success) {
          this.form1.imgUrls[0] = res.data
          this.form1.imgUrls[1] = this.form1.imgUrls[1] === undefined ? (this.form1.imgUrls[1] = '') : this.form1.imgUrls[1]
          // this.srcList = [this.imageUrl]
        } else if (res.code === '-1') {
        } else {
          this.$Message.error(res.message)
        }
      },
      handleFormatError1(file) {
        this.$Message.error(this.$t('uploadError'))
      },
      handleMaxSize1(file) {
        // 超过2M
        this.$Message.error(this.$t('imgLarger2M'))
      },
      handleBeforeUpload1(file) {
        this.imgUrls1 = URL.createObjectURL(file)
        // const check = this.uploadList.length < 3;
        // if (!check) {
        //     this.$Notice.warning({
        //         title: '上传图片不能多于3张'
        //     });
        // }
        // return check;
      },
      cancel() {
        this.id = ''
        this.uploadList = ''
        this.uploadList1 = ''
        this.OtherName = this.$t('pleaseSelectDeviceNo')
        this.datas = []
        this.allNum = 0
        this.formValidate = {
          content: '',
          result: '',
          mac: '',
          malfunctionContent: '',
          suggest: '',
          date: this.$Date().format('YYYY-MM-DD HH:mm:ss'),
        }
        this.$emit('close')
        // this.$refs['formValidate'].resetFields();
      },
      completeInput() {
        this.date === '' ? (this.date = this.$Date().format('YYYY-MM-DD')) : (this.date = this.date)
        // let urlArr = [];
        // let urlArr1 = [];
        //
        // this.uploadList.forEach((item) => {
        //     // this.urlArr = item.imgUrl
        //     urlArr.push(item.imgUrls);
        // });
        // this.uploadList1.forEach((item) => {
        //     // this.urlArr = item.imgUrl
        //     urlArr1.push(item.imgUrls);
        // });

        let imgUrls = this.uploadList + ';' + this.uploadList1 // JSON.stringify(urlArr) + ';' + JSON.stringify(urlArr1);
        let params = {
          maintenanceContent: this.formValidate.content,
          malfunctionContent: this.formValidate.malfunctionContent,
          handledResult: this.formValidate.result,
          suggest: this.formValidate.suggest,
          maintenanceTime: this.date,
          imgUrls,
          projectCode: this.$store.state.projectCode,
          mac: this.formValidate.mac,
          id: this.id,
          alarmId: '',
        }
        if (params.mac === '') {
          this.$Message.error(this.$t('pleaseSelectMaintenanceDeviceNo'))
        }
        if (params.maintenanceContent === '') {
          this.$Message.error(this.$t('maintenanceContentCannotEmpty'))
        }
        if (params.maintenanceTime === '') {
          this.$Message.error(this.$t('maintenanceDateCannotEmpty'))
        }
        if (params.malfunctionContent === '') {
          this.$Message.error(this.$t('faultContentCannotEmpty'))
        }
        if (params.maintenanceContent.length < 5) {
          this.$Message.error(this.$t('enterAtLeast5wordsForMaintenance'))
        }
        if (params.malfunctionContent.length < 5) {
          this.$Message.error(this.$t('enterAtLeast5wordsForFaultContent'))
        }
        if (params.mac !== '' && params.maintenanceContent !== '' && params.maintenanceTime !== '' && params.malfunctionContent !== '' && params.maintenanceContent.length >= 5 && params.malfunctionContent.length >= 5) {
          pushinput(params).then(res => {
            if (res.success) {
              this.$Message.success(res.message)
              this.cancel()
            } else {
              this.$Message.error(res.message)
              this.cancel()
            }
          })
        }
      },
      getdate(e) {
        this.date = e
      },
      handleSelectionChange(val) {
        if (val.length === 0) {
          this.selectionFalg = true
        } else {
          this.selectionFalg = false
        }
        this.selectData = val
      },
      handleMac(row) {
        this.formValidate.mac = row.mac
        this.OtherName = row.name
        this.selectFlag = false
        this.HistoryData(row.mac)
      },
      getMac() {
        this.queryList()
        this.selectFlag = true
      },
      handleCancel() {
        this.ruleForm = { mac: '', build: '', unit: '' }
        this.currentPage = 1
        this.selectFlag = false
      },
      handleSearch() {
        this.currentPage = 1
        this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
      },
      async queryList(build, unit, mac) {
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          projectCode: this.$store.state.projectCode,
        }
        if (build) params.build = build
        if (unit) params.unit = unit
        if (mac) params.key = mac
        const res = await queryBoxes(params)
        if (res.success) {
          this.total = res.total
          this.boxesData = res.datas
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleCurrentChange(val) {
        if (this.selectData.length > 0) {
          this.$Modal.warning({
            title: this.$t('tip'),
            content: this.$t('confirmSaveCurrentSelectedDeivce'),
            onOk: () => {
              if (this.devices.length > 0) {
                this.devices.forEach(item => {
                  this.selectData = this.selectData.filter(keyItem => keyItem.mac !== item.mac)
                })
                this.devices = this.devices.concat(this.selectData)
              } else {
                this.devices = this.selectData
              }
              this.$Message.success({ coontent: this.$t('savedSuccessfully') })
              this.currentPage = val
              this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
            },
            onCancel: () => {
              this.$Message.info({
                coontent: this.$t('cancelSave'),
              })
              this.currentPage = val
              this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
            },
          })
        } else {
          this.currentPage = val
          this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
        }
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
      },
      async HistoryData(mac) {
        let params = { workOrderType: 1, mac, pageNo: 1, pageSize: this.size }
        const res = await inquireDetail(params)
        this.allNum = res.total
        this.datas = res.datas
      },
      more() {
        if (this.size >= this.allNum) {
          this.$Message.error(this.$t('noMoreData'))
        } else {
          this.size += 5
          this.HistoryData(this.formValidate.mac)
        }
      },
      init(newVal) {
        this.formValidate = newVal
        this.formValidate.date = newVal.handleTime
        this.date = newVal.createTime
        this.id = newVal.id
        this.changeName = true
        this.OtherName = newVal.macName
        this.HistoryData(newVal.mac)
        this.OtherName = newVal.macName
        if (newVal.imgUrls === '' || newVal.imgUrls === undefined) {
          return false
        } else {
          let arr = newVal.imgUrls.split(';')
          this.uploadList = arr[0]
          this.uploadList1 = arr[1]
        }
      },
    },
    mounted() {
      // this.uploadList = this.$refs.upload.fileList;
      // this.uploadList1 = this.$refs.upload1.fileList;;
      // this.HistoryData()
      if (this.isbz) {
        this.init(this.inpdata)
      }
    },
    watch: {
      inpdata: {
        handler(newVal, oldVal) {
          if (newVal && this.isbz) {
            this.formValidate = newVal
            this.formValidate.date = newVal.handleTime
            this.date = newVal.createTime
            this.id = newVal.id
            this.changeName = true
            this.OtherName = newVal.macName
            this.HistoryData(newVal.mac)
            this.OtherName = newVal.macName
            if (newVal.imgUrls === '' || newVal.imgUrls === undefined) {
              return false
            } else {
              let arr = newVal.imgUrls.split(';')
              this.uploadList = arr[0]
              this.uploadList1 = arr[1]
            }
          }
        },
        deep: true,
      },
      isbz: {
        handler(newVal) {
          this.isbz = newVal
        },
      },
    },
    props: {
      inpdata: { type: Object, default: () => {} },
      isbz: { type: Boolean, default: () => {} },
    },
  }
</script>

<style lang="less" scoped>
  .uploadTip {
    color: #007eff;
    font-size: 12px;
  }
  #maintenance {
    .ivu-timeline-item-head-custom {
      width: 0px !important;
    }
    .ivu-timeline-item-tail {
      margin-left: 16px;
    }

    .icon {
      font-size: 20px;
      margin: 25px;
      margin-bottom: -20px;
      // background-color: #fff!important;
      z-index: 555;
      background-color: rgb(9, 15, 25);
    }
    .top {
      margin-top: 50px;
      float: right;
      margin-right: 10px;
    }
    .mainM {
      width: 100%;
      // margin-top: -40px;
      display: flex;
      .left {
        width: 50%;
        background-color: #1a202e;
        h2 {
          margin-top: 20px;
          margin-left: 20px;
          font-size: 18px;
          font-family: PingFangSC-Regular;
          font-weight: Regular;
        }
        .inputdata {
          width: 500px;
          // margin-left: 100px;
          margin-top: 20px;
        }
        .MT {
          margin-top: 10px;
        }
      }
      .right {
        width: 50%;
        // height: 750px;
        // margin-top: -40px;
        background-color: #1a202e;
        .historydata {
          // width: 100%;
          // background-color: #28313F ;
          height: 650px;
          overflow: auto;
          margin-left: 20px;
        }
        h2 {
          width: 100%;
          // height: 120px;
          margin-bottom: -20px;
          line-height: 86px;
          font-size: 18px;
          font-family: PingFangSC-Regular;
          font-weight: Regular;
        }
        .btn {
          margin-left: 250px;
          font-size: 16px;
          color: #145fff;
          cursor: pointer;
        }
      }
    }
    .demo-upload-list {
      display: inline-block;
      width: 60px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
      margin-right: 4px;
    }
    .demo-upload-list img {
      width: 100%;
      height: 100%;
    }
    .demo-upload-list-cover {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover {
      display: block;
    }
    .demo-upload-list-cover i {
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
    }
    .time {
      // background: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      font-weight: bold;
    }
    .content {
      // background-color: red;
      //  background-color: rgb(9, 15, 25);
      padding-left: 5px;
    }

    .ivu-timeline-item-content {
      padding: 5px 21px 13px 41px;
      font-size: 14px;
      position: relative;
      top: -3px;
    }
    .ivu-timeline-item-head {
      width: 30px;
      height: 30px;
      background-color: #fff;
      border-radius: 50%;
      border: 1px solid transparent;
      position: absolute;
    }
    /deep/::-webkit-scrollbar {
      width: 6px; //竖轴宽度
      height: 6px; //横轴宽度
      // background-color: rgba(99, 110, 246, 0.5);
    }

    /* 滚动槽 */
    /deep/::-webkit-scrollbar-track {
      border-radius: 10px;
    }

    /deep/::-webkit-scrollbar-thumb {
      background-color: #1a202e;
    }
  }
</style>
