<template>
  <div>
    <div>
      <h3 class="title-info">
        <span class="blue-box"></span>
        {{ $t('baseInfo') }}
      </h3>
    </div>
    <div class="base-info-form">
      <Form ref="addMainFormRef" :model="addMainForm" label-position="right" :label-width="130" :rules="ruleValidate">
        <FormItem :label="$t('maintenanceDevice') + '：'">
          <div class="dis-flex">
            <Input v-model="addMainForm.mac" :placeholder="$t('pleaseSelect')" readonly></Input>
            <Button type="primary" ghost @click="openDeviceModal" class="ml-10">{{ $t('selectDevice') }}</Button>
          </div>
        </FormItem>
        <FormItem :label="$t('line') + '：'" v-if="lineList.length > 0">
          <Select v-model="addMainForm.line" :placeholder="$t('pleaseSelectLine2')">
            <Option v-for="(item, index) in lineList" :key="index" :value="item.value" :label="item.label"></Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('expectedCompletionTime') + '：'" prop="time">
          <DatePicker type="datetime" :value="addMainForm.time" format="yyyy-MM-dd HH:mm" :placeholder="$t('selectExpectedCompletionTime')" class="w-200" @on-change="changeValue"></DatePicker>
        </FormItem>
        <FormItem :label="$t('maintenanceDetails') + '：'" prop="detail">
          <Input v-model="addMainForm.detail" type="textarea" placeholder="请输入" :rows="5"></Input>
        </FormItem>
        <FormItem :label="$t('siteImages') + '：'">
          <div class="dis-flex">
            <Upload
              ref="upload"
              :show-upload-list="false"
              :format="['jpg', 'jpeg', 'png', 'docx']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :on-success="handleSuccess"
              type="drag"
              :action="action"
              name="imgFile"
              :data="{ name: 'imgFile' }"
              class="upload-style"
              multiple>
              <div class="icon-upload-style">
                <Icon type="md-add" size="20"></Icon>
              </div>
            </Upload>
            &nbsp;
            <span v-show="addMainForm.imgUrl.length">
              <span v-for="(item, index) in addMainForm.imgUrl" :key="index" class="ml-8 demo-upload-list">
                <img :src="item.data" />
                <span class="img-list-cover">
                  <Icon type="ios-trash-outline" @click="deleteImg(addMainForm.imgUrl, index)"></Icon>
                </span>
              </span>
            </span>
          </div>

          <div class="uploadTip">{{ $t('uploadImgTip') }}</div>
        </FormItem>
        <FormItem :label="$t('enclosure') + '：'">
          <div class="file-box" v-if="fileObj.name">
            <div>
              <img :src="fileObj.img" alt="" class="img-style" />
            </div>
            <div class="file-name-box">
              <div class="mt--20 ellipsis-box">{{ fileObj.name }}</div>
              <div class="text-height">{{ fileObj.size / 1000 + 'kB' }}</div>
            </div>
            <div class="delete-icon">
              <Icon custom="icon-v5 icon-v5-lajitong" size="22" color="#E03C3A" @click="deleteFile" />
            </div>
          </div>
          <Upload :action="uploadUrl" name="File" :data="{ name: 'File' }" :before-upload="beforeUpload" :show-upload-list="false" :on-format-error="handleFormatError" :format="fileFormatList" :on-exceeded-size="handleFileMaxSize" :on-success="handleFileSuccess" :max-size="10240">
            <Button type="primary" ghost :class="fileObj.name ? 'mt-10' : ''">{{ fileObj.name ? $t('reupload') : $t('uploadFile') }}</Button>
          </Upload>
        </FormItem>
      </Form>
    </div>
    <Modal v-model="modalStatus" :title="$t('selectDevice')" width="900" class-name="selectDeviceLists" :scrollable="true">
      <Row>
        <Input v-model="selectDeviceLists.name" class="w-200" :placeholder="$t('topologyPlaceholder2')"></Input>
        <Select v-model="selectDeviceLists.deviceType" class="ml-10 w-200" :placeholder="$t('deviceType')">
          <Option v-for="item in selectDeviceLists.deviceTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="selectDeviceLists.deviceState" class="ml-10 w-200" :placeholder="$t('equipmentStatus')">
          <Option v-for="item in selectDeviceLists.deviceStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="primary" class="ml-10" @click="queryLists">{{ $t('query') }}</Button>
        <Button class="ml-10" @click="resetOption">{{ $t('reset') }}</Button>
      </Row>
      <Table :columns="selectDeviceLists.columns" :data="selectDeviceLists.data" class="mt-10">
        <template #info="{ row }">{{ `${row.name}(${row.mac})` }}</template>
        <template #state="{ row }">
          <span :class="row.onlineStats === 0 ? 'b-danger' : row.onlineStats === -1 ? 'grays-box' : 'b-success'">
            {{ row.onlineStats === 0 ? $t('offline') : row.onlineStats === -1 ? $t('disconnected') : $t('online') }}
          </span>
        </template>
        <template #action="{ row }">
          <Button type="text" @click="getDeviceValue(row)">{{ $t('select') }}</Button>
        </template>
      </Table>
      <Page :current="pageNo" @on-change="changePage" :total="totalMac" show-elevator />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import { allDeviceTypeList } from '../../linkageScene/pro/constants'
  import { pageQueryAddrCommon } from '@api/public'
  import { fileTypeList } from '../maintenanceOrder'
  import dayjs from 'dayjs'

  export default {
    data() {
      return {
        uploadUrl: '',
        fileObj: { img: '', name: '', fileUrl: '', size: '' },
        action: '/common/file/upload.as?fileType=1&urlAbsolute=true&&subDir=maintenance_new_web', // 图片上传地址
        modalStatus: false,
        addMainForm: {
          resId: '',
          mac: '',
          line: '',
          time: dayjs().add(1, 'day').format('YYYY-MM-DD 00:00'),
          detail: null,
          imgUrl: [],
        },
        lineList: [],
        selectDeviceLists: {
          name: '',
          deviceType: '',
          deviceTypeList: allDeviceTypeList,
          deviceState: '',
          deviceStateList: [
            { label: this.$t('online'), value: 1 },
            { label: this.$t('offline'), value: 0 },
            { label: this.$t('disconnected'), value: -1 },
          ],
          columns: [
            {
              title: this.$t('deviceMessage'),
              slot: 'info',
            },
            {
              title: this.$t('deviceType'),
              key: 'equipmentTypeName',
            },
            {
              title: this.$t('equipmentStatus'),
              slot: 'state',
            },
            {
              title: this.$t('position'),
              key: 'location',
            },
            {
              title: this.$t('operation'),
              slot: 'action',
            },
          ],
          data: [],
        },
        totalMac: 0,
        pageNo: 1,
        ruleValidate: {
          time: [{ required: true, message: '期望完成时间不能为空', trigger: 'change' }],
          detail: [{ required: true, message: '维保详情不能为空', trigger: 'blur' }],
        },
      }
    },
    computed: {
      fileFormatList() {
        return fileTypeList.map(v => v.type)
      },
    },
    methods: {
      queryLists() {
        this.getSelectDeviceList()
      },
      changeValue(val) {
        this.addMainForm.time = val
      },
      // 父组件调用
      validateForm() {
        this.$refs.addMainFormRef.validate()
      },
      deleteImg(list, index) {
        list.splice(index, 1)
      },
      openDeviceModal() {
        this.modalStatus = true
        this.getSelectDeviceList()
      },
      async getSelectDeviceList() {
        const { name, deviceType, deviceState } = this.selectDeviceLists
        const params = {
          projectCode: this.$store.state.projectCode,
          equipmentTypes: deviceType || 'all',
          pageSize: 10,
          pageNo: this.pageNo,
          mac: name,
          onlineStatus: deviceState,
        }
        const { datas, success, message, total } = await pageQueryAddrCommon(params)
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }
        this.totalMac = total
        this.selectDeviceLists.data = datas
      },
      changePage(e) {
        this.pageNo = e
        this.getSelectDeviceList()
      },
      getDeviceValue(row) {
        // console.log('🚀 ~ getDeviceValue ~ row:', row)
        this.lineList = row.addrs ? row.addrs.map(v => ({ label: v.title, value: v.addr })) : []
        this.addMainForm.mac = `${row.equipmentTypeName}(${row.mac})`
        this.addMainForm.resId = row.resId
        this.modalStatus = false
      },
      resetOption() {
        this.selectDeviceLists.deviceType = ''
        this.selectDeviceLists.deviceState = ''
        this.selectDeviceLists.name = ''
      },
      handleSuccess(res, file, fileList) {
        // console.log('🚀 ~ handleSuccess ~ res, file:', res, file, fileList)
        if (!res.success) return this.$Message.error(res.message)
        this.addMainForm.imgUrl.push(res)
      },
      handleFormatError(file) {
        this.$Message.error(this.$t('uploadError'))
      },
      handleMaxSize(file) {
        // 超过2M
        this.$Message.error(this.$t('uploadFileSizeTip', { size: 2 }))
      },
      handleFileMaxSize(file) {
        this.$Message.error(this.$t('uploadFileSizeTip', { size: 10 }))
      },
      beforeUpload(file) {
        const arr = file.name ? file.name.split('.') : []
        if (!arr.length) return this.$Message.error('fileFormatWrong')
        const type = arr[arr.length - 1]
        const fileType = type ? fileTypeList.find(v => v.type.includes(type)) : ''
        if (!fileType) {
          return this.$Message.error(this.$t('fileFormatWrong'))
        }
        this.uploadUrl = `/common/file/upload.as?fileType=${fileType.fileType}&&urlAbsolute=true&&subDir=maintenance_new_web`
        return Promise.resolve(true) // 确保路径设置成功后再上传文件
      },

      handleFileSuccess(res, file) {
        if (!res.success) return this.$Message.error(res.message)
        const arr = file.name ? file.name.split('.') : []
        if (!arr.length) return this.$Message.error('fileFormatWrong')
        const type = arr[arr.length - 1]
        const fileType = type ? fileTypeList.find(v => v.type.includes(type)) : ''
        this.fileObj = {
          img: fileType ? fileType.img : '',
          name: file.name,
          size: file.size,
          fileUrl: res.data,
        }
      },
      deleteFile() {
        this.fileObj.name = ''
      },
    },
  }
</script>

<style lang="less" scoped>
  .ellipsis-box {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .file-name-box {
    width: 60%;
  }
  .upload-style {
    display: inline-block;
    width: 58px;
  }
  .icon-upload-style {
    width: 58px;
    height: 58px;
    line-height: 58px;
  }
  .mt--20 {
    margin-top: -20px;
  }
  .img-box-58 {
    width: 58px;
    height: 58px;
    display: inline-block;
  }
  .mt-10 {
    margin-top: 10px;
  }
  .w-200 {
    width: 200px;
  }
  .dis-flex {
    display: flex;
  }
  .base-info-form {
    width: 500px;
    margin: 20px auto;
  }
  .ml-10 {
    margin-left: 10px;
  }
  .uploadTip {
    color: #007eff;
  }
  .file-box {
    display: flex;
    height: 80px;
    background: #28303e;
    width: 100%;
    align-items: center;
  }
  .text-height {
    line-height: 16px;
    height: 16px;
    color: #999;
  }
  .img-style {
    width: 25px;
    height: 25px;
    margin: 0 15px;
  }
  .delete-icon {
    flex: 1;
    text-align: right;
    padding-right: 20px;
  }
  .title-info {
    margin: 20px;
    display: flex;
    color: #0372e5;
  }
  .blue-box {
    display: inline-block;
    width: 2px;
    height: 18px;
    margin-right: 8px;
    margin-top: 3px;
    background: #0372e5;
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
  .img-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .demo-upload-list:hover .img-list-cover {
    display: block;
  }
  .img-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
