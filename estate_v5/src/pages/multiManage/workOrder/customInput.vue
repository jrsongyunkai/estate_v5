<template>
  <div>
    <div class="top"></div>
    <div class="mainC">
      <div class="left">
        <h2>{{ isCustomEdit ? $t('editCustomWorkOrder') : $t('newCustomWorkerOrder') }}</h2>
        <div class="inputdata">
          <Form ref="form" :model="allJson" :rules="ruleValidate" :label-width="10">
            <!-- 日期选择 -->
            <FormItem prop="date" :label="''" class="MT">
              <div class="flex">
                <customEditValue requireFlag v-model="allJson.date.label" class="label-left" />
                <DatePicker class="flex1" type="datetime" v-model="allJson.date.value" format="yyyy-MM-dd HH:mm:ss" confirm placement="top" :placeholder="$t('pleaseSelectDate')" style="width: 350px" @on-change="getdate" :editable="false"></DatePicker>
              </div>
            </FormItem>
            <FormItem :label="''" prop="content" class="MT">
              <div class="flex">
                <customEditValue requireFlag v-model="allJson.content.label" class="label-left" />
                <Input v-model="allJson.content.value" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" :placeholder="$t('pleaseEnter')"></Input>
              </div>
            </FormItem>
            <FormItem :label="''" prop="malfunctionContent" class="MT">
              <div class="flex">
                <customEditValue requireFlag v-model="allJson.malfunctionContent.label" class="label-left" />
                <Input v-model="allJson.malfunctionContent.value" type="textarea" :placeholder="$t('pleaseEnter')" :autosize="{ minRows: 2, maxRows: 5 }"></Input>
              </div>
            </FormItem>
            <FormItem :label="''" class="MT">
              <div class="flex">
                <customEditValue v-model="allJson.result.label" class="label-left" />
                <Input v-model="allJson.result.value" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" :placeholder="$t('pleaseEnter')"></Input>
              </div>
            </FormItem>
            <div style="color: #007eff; font-size: 12px; margin-left: 188px; margin-top: -20px; margin-bottom: 20px">{{ $t('workOrderTips') }}</div>
            <FormItem :label="''" class="MT">
              <div class="flex">
                <customEditValue v-model="allJson.suggest.label" class="label-left" />
                <Input v-model="allJson.suggest.value" type="textarea" :placeholder="$t('pleaseEnter')" :autosize="{ minRows: 2, maxRows: 5 }"></Input>
              </div>
            </FormItem>
            <FormItem class="MT" :label="''">
              <div class="flex">
                <customEditValue v-model="allJson.beforeImg.label" class="label-left" />
                <div>
                  <Upload
                    ref="upload"
                    :show-upload-list="false"
                    :format="['jpg', 'jpeg', 'png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :on-success="handleSuccess"
                    multiple
                    type="drag"
                    :action="action"
                    name="beforeImgFile"
                    :data="{ name: 'beforeImgFile' }"
                    style="display: inline-block; width: 58px">
                    <div style="width: 58px; height: 58px; line-height: 58px">
                      <Icon type="md-add" size="20"></Icon>
                    </div>
                  </Upload>
                  &nbsp;
                  <div class="demo-upload-list" v-show="allJson.beforeImg.value">
                    <template>
                      <img :src="allJson.beforeImg.value || ''" />
                      <div class="demo-upload-list-cover">
                        <!-- 获取大图 -->
                        <Icon type="ios-eye-outline" @click.native="handleView()"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove()"></Icon>
                      </div>
                    </template>
                  </div>
                  <div class="uploadTip">{{ $t('workOrderUploadRequire') }}</div>
                </div>
              </div>
              <Modal :title="$t('picShow')" v-model="visible">
                <img :src="allJson.beforeImg.value || ''" v-if="visible" style="width: 100%" />
              </Modal>
            </FormItem>

            <FormItem class="MT" :label="''">
              <div class="flex">
                <customEditValue v-model="allJson.afterImg.label" class="label-left" />
                <div>
                  <Upload
                    ref="upload1"
                    :show-upload-list="false"
                    :format="['jpg', 'jpeg', 'png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :on-success="handleSuccess1"
                    multiple
                    type="drag"
                    :action="action"
                    name="afterImgFile"
                    :data="{ name: 'afterImgFile' }"
                    style="display: inline-block; width: 58px">
                    <div style="width: 58px; height: 58px; line-height: 58px">
                      <Icon type="md-add" size="20"></Icon>
                    </div>
                  </Upload>
                  &nbsp;
                  <div class="demo-upload-list" v-show="allJson.afterImg.value">
                    <template>
                      <img :src="allJson.afterImg.value || ''" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView1()"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove1()"></Icon>
                      </div>
                    </template>
                  </div>
                  <div class="uploadTip">{{ $t('workOrderUploadRequire') }}</div>
                </div>
              </div>
              <Modal :title="$t('picShow')" v-model="visible1">
                <img :src="allJson.afterImg.value || ''" v-if="visible1" style="width: 100%" />
              </Modal>
            </FormItem>
            <FormItem :label="''" class="MT custom-field" v-for="(item, index) in allJson.customField" :key="item">
              <div class="flex">
                <customEditValue v-model="item.label" class="label-left" />
                <Input v-model="item.value" type="textarea" :placeholder="$t('pleaseEnter')" :autosize="{ minRows: 2, maxRows: 5 }"></Input>
              </div>
              <Button class="ml-10 del-type" type="error" ghost custom-icon="icon-v5 icon-v5-changyonggoupiaorenshanchu" @click.stop="deleteItem(index)"></Button>
            </FormItem>
            <FormItem class="submit-buttons">
              <Button @click="addCustomItem" ghost type="dashed">{{ $t('addField') }}</Button>
            </FormItem>
            <FormItem class="submit-buttons">
              <Button style="background: #007eff; border: none" type="primary" @click="submit">{{ $t('complete') }}</Button>
              &nbsp;
              <Button @click="cancel">{{ $t('cancelMaintenance') }}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <!-- <div></div> -->
      <div style="background-color: rgb(9, 15, 25); float: left; width: 0.5%; height: 100%"></div>
      <div class="right">
        <Timeline class="historydata">
          <h2>{{ $t('workOrderHistory') }}</h2>
          <TimelineItem v-for="item in datas" :key="item.id" :color="item.status === 1 ? '#0DD667' : '#E03C3A'">
            <span class="time" style="margin-bottom:50px;!important">{{ item.createTime }}</span>
            <p class="content">
              {{ $t('personnel') + ':' + item.handlerName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('state') }}：
              <span :style="item.status === 1 ? 'color:#0DD667' : 'color:#E03C3A'">{{ item.status === 1 ? $t('processed') : $t('notProcessed') }}</span>
            </p>
            <p class="content">{{ stringfyContentLabel(item.content) + ':' + stringfyContentValue(item.content) }}</p>
            <p class="content">
              {{ $t('patrolResults') + ':' + item.result ? item.result : $t('nothing') }}
            </p>
          </TimelineItem>

          <h1 v-if="allNum === 0" style="font-size: 16px; color: #999">{{ $t('noData') }}</h1>
        </Timeline>
        <h4 class="btn" @click="more" v-if="allNum > 5">
          {{ $t('clickLoadMore') }}
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
  import customEditValue from './customEditValue.vue'
  import { saveCutomWorkOrder, inquireDetail } from '@/api/multiManage/workOrder'

  const getDefaultState = () => ({
    date: {
      label: window.$t('maintenanceDate'),
      value: '',
    },
    content: {
      label: window.$t('maintenanceContent2'),
      value: '',
    },
    malfunctionContent: {
      label: window.$t('faultContent'),
      value: '',
    },
    result: {
      label: window.$t('processResult'),
      value: '',
    },
    suggest: {
      label: window.$t('suggestion'),
      value: '',
    },
    beforeImg: {
      label: window.$t('maintenanceBefore'),
      value: '',
    },
    afterImg: {
      label: window.$t('maintenanceAfter'),
      value: '',
    },
    customField: [
      {
        label: `${window.$t('customField')}1`,
        value: '',
      },
    ],
  })
  export default {
    components: {
      customEditValue,
    },
    props: {
      inpdata: {
        type: Object,
        default() {
          return {}
        },
      },
      isCustomEdit: {
        type: Boolean,
      },
    },
    data() {
      return {
        id: '',
        allNum: 0,
        datas: [],
        ruleValidate: {
          malfunctionContent: [
            {
              validator: (rule, val, callback) => {
                if (!val.value) {
                  callback(new Error(this.$t('inputCannotBeEmpty')))
                } else if (val.value.length < 5) {
                  callback(new Error(this.$t('enterAtLeast5characters')))
                } else {
                  callback()
                }
              },
              trigger: 'blur',
            },
          ],
          content: [
            {
              validator: (rule, val, callback) => {
                if (!val.value) {
                  callback(new Error(this.$t('inputCannotBeEmpty')))
                } else if (val.value.length < 5) {
                  callback(new Error(this.$t('enterAtLeast5characters')))
                } else {
                  callback()
                }
              },
              trigger: 'blur',
            },
          ],
          date: [
            {
              validator: (rule, val, callback) => {
                if (!val.value) {
                  callback(new Error(this.$t('inputCannotBeEmpty')))
                } else {
                  callback()
                }
              },
              trigger: 'blur',
            },
          ],
        },
        visible: false,
        visible1: false,
        action: `${this.$func.ctxPaths()}/maintenance/imgUrl/before/upload.as?v=` + new Date().getTime(),
        allJson: getDefaultState(),
      }
    },
    methods: {
      close() {
        this.allJson = getDefaultState()
        this.id = ''
        this.allNum = 0
        this.datas = []
        this.$emit('close')
      },
      stringfyContentLabel(content) {
        return content ? JSON.parse(content).content.label : ''
      },
      stringfyContentValue(content) {
        return content ? JSON.parse(content).content.value : ''
      },
      deleteItem(index) {
        this.allJson.customField.splice(index, 1)
      },
      addCustomItem() {
        this.allJson.customField.push({
          label: `${this.$t('customField')}${this.allJson.customField.length + 1}`,
          value: '',
        })
      },
      handleRemove() {
        this.allJson.beforeImg.value = ''
      },
      handleRemove1() {
        this.allJson.afterImg.value = ''
      },
      handleView() {
        this.visible = true
      },
      handleView1() {
        this.visible1 = true
      },
      handleSuccess(res, file) {
        if (res.success) {
          this.allJson.beforeImg.value = file.response.data
        } else if (res.code === '-1') {
        } else {
          this.$Message.error(res.message)
        }
      },
      handleSuccess1(res, file) {
        if (res.success) {
          this.allJson.afterImg.value = file.response.data
        } else if (res.code === '-1') {
        } else {
          this.$Message.error(res.message)
        }
      },
      handleFormatError() {
        this.$Message.error(this.$t('uploadError'))
      },
      handleMaxSize() {
        // 超过2M
        this.$Message.error(this.$t('imgLarger2M'))
      },
      getdate(e) {
        this.allJson.date.value = e
      },
      submit() {
        this.$refs.form.validate(async valid => {
          if (valid) {
            const params = {
              projectCode: this.$store.state.projectCode,
              content: this.allJson,
              status: this.allJson.result.value ? 1 : 0,
            }
            if (this.isCustomEdit) {
              params.id = this.id
            }
            const result = await saveCutomWorkOrder(params)
            if (result.code === '0') {
              this.close()
            }
          }
        })
      },
      cancel() {
        this.close()
      },
      HistoryData() {
        let params = {
          workOrderType: 2,
          projectCode: this.$store.state.projectCode,
          pageNo: 1,
          pageSize: this.size,
        }
        inquireDetail(params).then(res => {
          this.allNum = res.total
          this.datas = res.datas
        })
      },
      more() {
        if (this.size >= this.allNum) {
          this.$Message.error(this.$t('noMoreData'))
        } else {
          this.size += 5
          this.HistoryData(this.formValidate.mac)
        }
      },
    },
    mounted() {
      this.HistoryData()
      this.id = this.inpdata.id
      if (this.inpdata.content) {
        this.allJson = JSON.parse(this.inpdata.content)
      }
    },
  }
</script>

<style lang="less" scoped>
  /deep/.ivu-form-item-error-tip {
    margin-bottom: 12px;
    margin-left: 180px;
  }
  .custom-field {
    position: relative;
    .del-type {
      position: absolute;
      top: 0;
      right: -45px;
      z-index: 1;
    }
  }
  .submit-buttons {
    margin-left: 180px;
  }
  .flex {
    display: flex;
    .label-left {
      width: 170px;
      flex: none;
      justify-content: end;
      margin-right: 10px;
    }
    .flex1 {
      flex: 1;
    }
  }
  .uploadTip {
    color: #007eff;
  }
  .top {
    margin-top: 50px;
    float: right;
    margin-right: 10px;
  }

  .icon {
    font-size: 10px;
    // margin: 25px;
    // margin-bottom: -20px;
    width: 10px;
    height: 10px;
    // background-color: #fff!important;
    z-index: 555;
    background-color: rgb(9, 15, 25);
  }
  .mainC {
    width: 100%;
    height: calc(~'100vh - 160px');
    float: right;
    margin-top: -40px;
    background-color: #1a202e;
    .left {
      float: left;
      width: 45%;
      height: 100%;
      overflow: hidden;
      overflow: auto;
      // margin-top: 25px;
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
      float: left;
      width: 50%;
      height: 700px;
      // margin-left: 0.5%;
      .historydata {
        // width: 100%;
        // background-color: #28313F ;
        height: 650px;
        overflow: auto;
        margin-left: 20px;
      }

      p {
        // background-color: rgb(9, 15, 25);
        background-color: #1a202e;
      }
      h2 {
        width: 100%;
        // height: 120px;
        margin-bottom: -20px;
        // line-height: 120px;
        line-height: 86px;
        font-size: 18px;
        font-family: PingFangSC-Regular;
        font-weight: Regular;
      }
      .btn {
        font-size: 16px;
        color: #145fff;
        margin-left: 250px;
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
    font-size: 14px;
    font-weight: bold;
    margin-top: 10px;
  }
  .content {
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
    // background-color: #fff;
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
</style>
