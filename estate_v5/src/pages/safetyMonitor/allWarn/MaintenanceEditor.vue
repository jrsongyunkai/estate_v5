<template>
  <div class="Maintenance">
    <Form :model="form" ref="form" :label-width="100" :rules="rules">
      <Row>
        <Col span="24">
          <FormItem :label="$t('ownProject')">
            {{ $store.state.maintenanceObj ? $store.state.maintenanceObj.projectName : $store.state.prjName }}
          </FormItem>
          <FormItem :label="$t('equipmentNo') + ':'">
            {{ $store.state.maintenanceObj.mac ? $store.state.maintenanceObj.mac : this.$store.state.mac }}
          </FormItem>
          <FormItem :label="$t('deviceAliases') + ':'">
            <Col span="12">
              {{ $store.state.maintenanceObj.boxName ? $store.state.maintenanceObj.boxName : $store.state.aliasName }}
            </Col>
            <Col span="12">
              <span class="datetime">
                <span>{{ $t('maintenanceTime') }}</span>
                <DatePicker :value="form.maintenanceTime" @on-change="form.maintenanceTime = $event" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" :editable="false" :placeholder="$t('pleaseSelectDateTime')" :clearable="false" style="width: 200px"></DatePicker>
              </span>
            </Col>
          </FormItem>

          <FormItem :label="$t('maintenanceContent')" prop="maintenanceContent">
            <Input v-model="form.maintenanceContent" type="textarea" :rows="4" prop="maintenanceContent" />
          </FormItem>
          <FormItem :label="$t('maintenanceFault')" prop="malfunctionContent">
            <Input v-model="form.malfunctionContent" type="textarea" :rows="4" prop="malfunctionContent" />
          </FormItem>
          <div>
            <FormItem :label="$t('maintenanceResults')" style="margin-bottom: 0">
              <Input v-model="form.handledResult" type="textarea" :rows="4" />
            </FormItem>

            <div class="title">
              <div class="w100"></div>
              {{ $t('maintenanceTips') }}
            </div>
          </div>

          <FormItem :label="$t('maintenanceSuggestions')">
            <Input v-model="form.suggest" type="textarea" :rows="4" />
          </FormItem>
          <FormItem :label="$t('maintenancePicture')">
            <Row style="justify-content: space-between; width: 100%">
              <Col span="12" style="display: flex">
                <span>{{ $t('maintenanceBefore') + ':' }}</span>
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
                  style="display: inline-block; width: 58px">
                  <div style="width: 58px; height: 58px; line-height: 58px">
                    <Icon type="md-add" size="20"></Icon>
                  </div>
                </Upload>
              </Col>

              <Col span="12" style="display: flex">
                <span>{{ $t('maintenanceAfter') + ':' }}</span>
                <Upload
                  :show-upload-list="false"
                  :default-file-list="afterSrcList"
                  :format="['jpg', 'jpeg', 'png']"
                  :max-size="2048"
                  :on-success="handleAfterSuccess"
                  :before-upload="AfterUpload"
                  multiple
                  type="drag"
                  :action="afterUploadUrl"
                  name="afterImgFile"
                  :data="afterImgData"
                  style="display: inline-block; width: 58px">
                  <div style="width: 58px; height: 58px; line-height: 58px">
                    <Icon type="md-add" size="20"></Icon>
                  </div>
                </Upload>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row style="width: 100%">
              <Col :span="12" v-if="imageUrl">
                <div class="demo-upload-list" v-if="demoImg1 === true">
                  <el-image style="width: 100px; height: 100px" :src="imageUrl" :preview-src-list="srcList"></el-image>
                  <Icon type="ios-close" class="deleImag" @click.native="handleRemove('1')"></Icon>
                </div>
              </Col>
              <Col :span="12" v-if="afterImageUrl">
                <div class="demo-upload-list" v-if="demoImg2 === true">
                  <el-image style="width: 100px; height: 100px" :src="afterImageUrl" :preview-src-list="afterSrcList"></el-image>

                  <Icon type="ios-close" class="deleImag" @click.native="handleRemove('2')"></Icon>
                </div>
              </Col>
            </Row>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem class="footer">
            <Button type="primary" @click="submitForm('form')">{{ $t('confirm') }}</Button>
            <Button plain @click="cancelForm">{{ $t('cancel') }}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
  import store from '@/store'
  import { updateMaintenance, modifyBoxsChnlClearAlarm, modifyBoxsChnlRemoteMute } from '@/api/safetyMonitor/allWarn'
  import dayjs from 'dayjs'

  export default {
    props: {
      maintenanceObj: {
        type: [Object, Array],
        default() {
          return []
        },
      },
    },
    watch: {},
    data() {
      return {
        mute: false,
        reset: false,
        defaultList: [],
        imgUrls: '',
        uploadList: [],
        demoImg1: true,
        demoImg2: true,
        form: {
          maintenanceContent: this.$store.state.maintenanceObj.maintenanceContent ? this.$store.state.maintenanceObj.maintenanceContent : '',
          malfunctionContent: this.$store.state.maintenanceObj.malfunctionContent ? this.$store.state.maintenanceObj.malfunctionContent : '',
          handledResult: this.$store.state.maintenanceObj.handledResult ? this.$store.state.maintenanceObj.handledResult : '',
          suggest: this.$store.state.maintenanceObj.suggest ? this.$store.state.maintenanceObj.suggest : '',
          maintenanceTime: this.$store.state.maintenanceObj.maintenanceTime ? `${this.$store.state.maintenanceObj.maintenanceTime}` : `${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
          imgUrls: this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';') : [],
        },
        rules: {
          maintenanceContent: [{ required: true, message: this.$t('maintenancePlscontents'), trigger: 'blur' }],
          malfunctionContent: [{ required: true, message: this.$t('maintenancePlsfault'), trigger: 'blur' }],
        },
        action: `${this.$func.ctxPaths()}/maintenance/imgUrl/before/upload.as?v=` + new Date().getTime(),
        beforeImgData: { name: 'beforeImgFile' },
        afterImgData: { name: 'afterImgFile' },
        uploadUrl: '/maintenance/imgUrl/before/upload.as?v=' + new Date().getTime(),
        afterUploadUrl: '/maintenance/imgUrl/after/upload.as?v=' + new Date().getTime(),
        imageUrl: this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[0] : '',
        srcList: [this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[0] : ''],
        afterImageUrl: this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[1] : '',
        afterSrcList: [this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[1] : ''],
      }
    },
    methods: {
      handleAlarm() {
        this.$emit('hanleAlarm')
      },
      submitForm(formName) {
        let params = this.form
        params.projectCode = this.$store.state.maintenanceObj.projectCode ? this.$store.state.maintenanceObj.projectCode : this.$store.state.projectCode
        params.mac = this.$store.state.maintenanceObj.mac ? this.$store.state.maintenanceObj.mac : this.$store.state.mac
        params.id = this.$store.state.maintenanceObj.id ? this.$store.state.maintenanceObj.id : ''
        params.alarmId = this.$store.state.alarmId ? this.$store.state.alarmId : ''

        this.$refs[formName].validate(valid => {
          if (valid) {
            params.imgUrls = params.imgUrls.join(';')
            if (this.mute) {
              this.handleControl('REMOTE_MUTE')
            }
            if (this.reset) {
              this.handleControl('CLEAR_ALARM')
            }
            updateMaintenance(params)
              .then(res => {
                if (res.success) {
                  this.$Message.success({
                    content: res.message,
                  })
                  this.cancelForm()
                  this.handleAlarm()
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
                  this.cancelForm()
                }
              })
              .finally(() => {})
          } else {
            return false
          }
        })
      },
      handleControl(cmd) {
        let params = {
          macs: this.maintenanceBoxObj.mac,
          cmd: cmd,
          nodeNo: this.maintenanceBoxObj.chnlAddr ? this.maintenanceBoxObj.chnlAddr : this.maintenanceBoxObj.addr ? this.maintenanceBoxObj.addr : this.maintenanceBoxObj.channelAddr,
        }
        if (cmd === 'CLEAR_ALARM' && this.reset) {
          modifyBoxsChnlClearAlarm(params)
            .then(res => {
              if (res.success) {
                this.$Message.success({
                  content: this.$t('submitCommand'),
                })
              } else if (res.code === '-1') {
              } else {
                this.$Message.error({
                  content: res.data[0].errorMsg,
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
        } else if (cmd === 'REMOTE_MUTE' && this.mute) {
          modifyBoxsChnlRemoteMute(params)
            .then(res => {
              if (res.success) {
                this.$Message.success({
                  content: this.$t('submitCommand'),
                })
              } else if (res.code === '-1') {
              } else {
                this.$Message.error({
                  content: res.data[0].errorMsg,
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
        }
      },
      // 取消
      cancelForm() {
        store.dispatch('resetMaintenanceObj')
        this.$emit('close-maintenance')
      },
      handleSuccess(res) {
        this.demoImg1 = true
        if (res.success) {
          this.form.imgUrls[1] = this.form.imgUrls[1] === undefined ? (this.form.imgUrls[1] = '') : this.form.imgUrls[1]
          this.form.imgUrls[0] = res.data
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
      // 图片大小判断
      beforeUpload(file) {
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
          this.imageUrl = URL.createObjectURL(file)
          this.srcList = [this.imageUrl]
          const isLt1M = file.size / 1024 / 1024 < 1
          if (!isLt1M) {
            this.$Message.error(this.$t('imgLarger1M'))
          }
          return isLt1M
        } else {
          this.$Message.error(this.$t('uploadError'))
        }
      },
      AfterUpload(file) {
        this.afterImageUrl = URL.createObjectURL(file)
        this.demoImg2 = true
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isLt1M) {
          this.$Message.error(this.$t('imgLarger1M'))
        }
        return isLt1M
      },
      handleAfterSuccess(response, file, fileList) {
        if (response.success) {
          this.form.imgUrls[0] = this.form.imgUrls[0] === undefined ? (this.form.imgUrls[0] = '') : this.form.imgUrls[0]
          this.form.imgUrls[1] = response.data
          this.afterSrcList = [this.afterImageUrl]
        } else if (response.code === '-1') {
        } else {
          this.$Message.error({ content: response.message })
        }
      },
      // 返回报错

      handleView(name) {
        this.imgName = name
        this.visible = true
      },
      handleRemove(file) {
        if (file === '1') {
          this.demoImg1 = false

          this.form.imgUrls[0] = ''
        } else if (file === '2') {
          this.demoImg2 = false
          this.form.imgUrls[1] = ''
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .Maintenance {
    max-height: 70vh;
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      height: 0px;
      width: 0px;
    }
    .title {
      display: flex;
      color: #bcbcbc;
      margin-bottom: 20px;
    }
    span {
      margin-right: 10px;
    }
    .footer {
      background-color: #1a202e;
      display: flex;
      justify-content: flex-end;
      button {
        margin: 0 10px;
      }
    }
    .demo-upload-list {
      display: inline-block;
      width: 100px;
      height: 100px;
      text-align: center;
      line-height: 60px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
      margin: 0px 4px;
    }
    .demo-upload-list img {
      width: 100%;
      height: 100%;
    }
    .deleImag {
      z-index: 999;
      position: absolute;
      top: 0px;
      right: 0px;
      font-size: 20px;
      display: inline;
      cursor: pointer;
    }
  }
  .w100 {
    width: 100px;
    height: 10px;
  }
</style>
