<template>
  <div>
    <Modal :title="$t('complete')" v-model="completeModal" @on-visible-change="cancelValid($event, 'completeFormRef')">
      <Form ref="completeFormRef" :model="completeForm" :rules="completeRule" label-position="right" :label-width="110">
        <FormItem :label="$t('completeStatus') + '：'" prop="status">
          <Select v-model="completeForm.status" :placeholder="$t('selectCategory')">
            <Option v-for="(item, index) in completeList" :key="index" :value="item.value" :label="item.label"></Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('completeDetails') + '：'" prop="detail">
          <Input v-model="completeForm.detail" type="textarea" :placeholder="$t('pleaseEnter')"></Input>
          <div class="dis-flex">
            <div v-for="(item, index) in detailTextList" :key="index" class="pointer text-style" @click="addDetailText(item)">{{ item.text }}</div>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="completeModal = false">{{ $t('cancel') }}</Button>
        <Button type="primary" @click="saveConfig('completeFormRef', 4)">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('examine')" v-model="reviewModal" @on-visible-change="cancelValid($event, 'reviewFormRef')">
      <Form ref="reviewFormRef" :model="reviewForm" :rules="reviewRule" label-position="right" :label-width="110">
        <FormItem :label="$t('reviewComments') + '：'" prop="view">
          <RadioGroup v-model="reviewForm.view" type="button">
            <Radio :label="1">{{ $t('adopt') }}</Radio>
            <Radio :label="2">{{ $t('reject') }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="$t('examineInfo') + '：'" prop="detail">
          <Input v-model="reviewForm.detail" type="textarea" :placeholder="$t('pleaseEnter')" :rows="5"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="reviewModal = false">{{ $t('cancel') }}</Button>
        <Button type="primary" @click="saveConfig('reviewFormRef', 2)">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('checkAcceptance')" v-model="acceptanceModal" @on-visible-change="cancelValid($event, 'acceptanceFormRef')">
      <Form ref="acceptanceFormRef" :model="acceptanceForm" :rules="acceptanceRule" label-position="right" :label-width="110">
        <FormItem :label="$t('checkAcceptanceInfo') + '：'" prop="view">
          <RadioGroup v-model="acceptanceForm.view" type="button">
            <Radio :label="1">{{ $t('adopt') }}</Radio>
            <Radio :label="2">{{ $t('reject') }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="$t('checkAcceptanceDetails') + '：'" prop="detail">
          <Input v-model="acceptanceForm.detail" type="textarea" :placeholder="$t('pleaseEnter')" :rows="5"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="acceptanceModal = false">{{ $t('cancel') }}</Button>
        <Button type="primary" @click="saveConfig('acceptanceFormRef', 5)">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('revoke')" v-model="revokeModal">
      <Form ref="revokeRef" :model="revokeForm" label-position="right" :label-width="110">
        <FormItem :label="$t('revocationReason') + '：'" prop="detail">
          <Input v-model="revokeForm.detail" type="textarea" :placeholder="$t('pleaseEnter')" :rows="5"></Input>
          <div class="dis-flex">
            <div v-for="(item, index) in revokeTextList" :key="index" class="pointer text-style" @click="addRevokeText(item)">{{ item.text }}</div>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="revokeModal = false">{{ $t('cancel') }}</Button>
        <Button type="primary" @click="revokeConfig(7)">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('handle')" v-model="processModal" @on-visible-change="cancelValid($event, 'processFormRef')">
      <Form ref="processFormRef" :model="processForm" :rules="processFormRule" label-position="right" :label-width="110">
        <FormItem :label="$t('handleInfo') + '：'" prop="detail">
          <Input v-model="processForm.detail" type="textarea" :placeholder="$t('pleaseEnter')" :rows="5"></Input>
          <div class="dis-flex">
            <div v-for="(item, index) in detailTextList" :key="index" class="pointer text-style" @click="addProcessText(item)">{{ item.text }}</div>
          </div>
        </FormItem>
        <FormItem :label="$t('processingBeforeImg') + '：'">
          <Upload
            ref="beforeUpload"
            :show-upload-list="false"
            :format="['jpg', 'jpeg', 'png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :on-success="handleSuccess"
            type="drag"
            :action="action"
            name="imgFile"
            :data="{ name: 'imgFile' }"
            class="upload-style">
            <div class="icon-upload-style">
              <Icon type="md-add" size="20"></Icon>
            </div>
          </Upload>
          &nbsp;
          <span v-show="!!beforeImg.length">
            <span v-for="(item, index) in beforeImg" :key="index" class="ml-8 demo-upload-list">
              <img :src="item.data" />
              <span class="img-list-cover">
                <Icon type="ios-trash-outline" @click="deleteImg(beforeImg, index)"></Icon>
              </span>
            </span>
          </span>
          <div class="uploadTip">{{ $t('workOrderUploadRequire') }}</div>
        </FormItem>
        <FormItem :label="$t('processingAfterImg') + '：'">
          <Upload
            ref="afterUpload"
            :show-upload-list="false"
            :format="['jpg', 'jpeg', 'png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :on-success="handleAfterSuccess"
            type="drag"
            :action="action"
            name="imgFile"
            :data="{ name: 'imgFile' }"
            class="upload-style">
            <div class="icon-upload-style">
              <Icon type="md-add" size="20"></Icon>
            </div>
          </Upload>
          &nbsp;
          <span v-show="!!afterImg.length">
            <span v-for="(item, index) in afterImg" :key="index" class="ml-8 demo-upload-list">
              <img :src="item.data" />
              <span class="img-list-cover">
                <Icon type="ios-trash-outline" @click="deleteImg(afterImg, index)"></Icon>
              </span>
            </span>
          </span>
          <div class="uploadTip">{{ $t('workOrderUploadRequire') }}</div>
        </FormItem>
        <FormItem :label="$t('enclosure') + '：'">
          <div class="file-box" v-if="fileObj.name">
            <div>
              <img :src="fileObj.img" alt="" class="img-style" />
            </div>
            <div>
              <div class="mt--20">{{ fileObj.name }}</div>
              <div class="text-height">{{ fileObj.size / 1000 + 'kB' }}</div>
            </div>
            <div class="delete-icon">
              <Icon custom="icon-v5 icon-v5-lajitong" size="22" color="#E03C3A" @click="deleteFile" />
            </div>
          </div>
          <Upload v-else :action="uploadUrl" :before-upload="beforeUpload" :show-upload-list="false" name="File" :data="{ name: 'File' }" :on-format-error="handleFormatError" :format="fileFormatList" :max-size="10240" :on-exceeded-size="handleFileMaxSize" :on-success="handleFileSuccess">
            <Button type="primary" ghost>{{ $t('selectFile') }}</Button>
          </Upload>
          <div class="uploadTip">{{ $t('fileTip1') }}</div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="processModal = false" :max-size="10240">{{ $t('cancel') }}</Button>
        <Button type="primary" @click="saveConfig('processFormRef', 3)">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { fileTypeList } from './maintenanceOrder'
  export default {
    data() {
      return {
        action: `/common/file/upload.as?fileType=1&urlAbsolute=true&&subDir=maintenance_new_web`, // 图片上传地址
        uploadUrl: '',
        visible: false,
        fileUrl: '',
        beforeImg: [],
        afterImg: [],
        processFormRule: {
          detail: [{ required: true, message: this.$t('handleInfoIsNotEmpty'), trigger: 'change' }],
        },
        processForm: {
          detail: '',
        },
        processModal: false,
        revokeModal: false,
        acceptanceModal: false,
        revokeForm: {
          detail: null,
        },
        reviewModal: false,
        completeModal: false,
        revokeTextList: [{ text: this.$t('falseAlarm') }, { text: this.$t('repeat') }],
        completeList: [
          { value: 1, label: this.$t('rectified') },
          { value: 2, label: this.$t('ignore') },
          { value: 3, label: this.$t('falseAlarm') },
          { value: 4, label: this.$t('repeat') },
          { value: 5, label: this.$t('delayHandle') },
        ],
        completeForm: {
          status: null,
          detail: null,
        },
        completeRule: {
          status: [{ required: true, type: 'number', message: this.$t('completionStatusCannotEmpty'), trigger: 'change' }],
          detail: [{ required: true, message: this.$t('completionInfoCannotEmpty'), trigger: 'change' }],
        },
        reviewForm: {
          view: 1,
          detail: null,
        },
        reviewRule: {
          view: [{ required: true, type: 'number', message: this.$t('reviewCommentsCannotEmpty'), trigger: 'blur' }],
          detail: [{ required: true, message: this.$t('examineInfoCannotEmpty'), trigger: 'blur' }],
        },
        acceptanceForm: {
          view: 1,
          detail: null,
        },
        acceptanceRule: {
          view: [{ required: true, type: 'number', message: this.$t('reviewCommentsCannotEmpty'), trigger: 'blur' }],
          detail: [{ required: true, message: this.$t('checkAcceptanceDetailsCannotEmpty'), trigger: 'change' }],
        },
        detailTextList: [{ text: this.$t('processed') }, { text: this.$t('Confirmed') }, { text: this.$t('verified') }, { text: this.$t('recorded') }, { text: this.$t('noObjection') }],
        rowData: null,
        fileObj: { img: '', name: '', fileUrl: '', size: '' },
      }
    },
    computed: {
      fileFormatList() {
        return fileTypeList.map(v => v.type)
      },
    },
    methods: {
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
      deleteImg(list, index) {
        list.splice(index, 1)
      },

      addDetailText(item) {
        if (this.completeForm.detail && this.completeForm.detail.includes(item.text)) return
        this.completeForm.detail = (this.completeForm.detail || '') + item.text
      },
      // 父组件调用
      openCompleteModal(row) {
        this.rowData = row
        this.$refs.completeFormRef.resetFields()
        this.completeForm.detail = ''
        this.completeModal = true
      },
      closeModal(type) {
        const typeConfig = {
          4: 'completeModal',
          2: 'reviewModal',
          5: 'acceptanceModal',
          7: 'revokeModal',
          3: 'processModal',
        }
        this[typeConfig[type]] = false
      },
      openReviewModal(row) {
        this.rowData = row
        this.reviewForm.detail = ''
        this.reviewModal = true
      },
      openAcceptanceModal(row) {
        this.$refs.acceptanceFormRef.resetFields()
        this.rowData = row
        this.acceptanceForm.detail = ''
        this.acceptanceModal = true
      },
      openRevokeModal(row) {
        this.rowData = row
        this.revokeForm.detail = ''
        this.revokeModal = true
      },
      openProcessModal(row) {
        this.$refs.processFormRef.resetFields()
        this.rowData = row
        this.processForm.detail = ''
        this.beforeImg = []
        this.afterImg = []
        this.fileUrl = ''
        this.processModal = true
      },
      addRevokeText(item) {
        if (this.revokeForm.detail && this.revokeForm.detail.includes(item.text)) return
        this.revokeForm.detail = (this.revokeForm.detail || '') + item.text
      },
      addProcessText(item) {
        if (this.processForm.detail && this.processForm.detail.includes(item.text)) return
        this.processForm.detail = (this.processForm.detail || '') + item.text
      },
      saveConfig(name, type) {
        this.$refs[name].validate(valid => {
          // console.log('🚀 ~ saveConfig ~ valid:', valid)
          if (valid) {
            const detailConfig = {
              4: this.completeForm.detail,
              2: this.reviewForm.detail,
              5: this.acceptanceForm.detail,
              3: this.processForm.detail,
            }
            const statusConfig = {
              4: this.completeForm.status,
              2: this.reviewForm.view,
              5: this.acceptanceForm.view,
              3: '',
            }
            const imgConfig = {
              3: [this.beforeImg, this.afterImg, this.fileUrl, this.fileObj.name],
              4: [],
              5: [],
              2: [],
            }
            this.$emit('saveCompleteModal', { detail: detailConfig[type], status: statusConfig[type], img: imgConfig[type], id: this.rowData.id, type })
          }
        })
      },
      revokeConfig(type) {
        if (!this.revokeForm.detail) {
          return this.$Message.error(this.$t('pleaseFillReasonRevocation'))
        }
        this.$emit('saveCompleteModal', { detail: this.revokeForm.detail, status: '', id: this.rowData.id, type })
      },
      cancelValid(val, name) {
        if (!val) {
          this.$refs[name].resetFields()
        }
      },
      handleSuccess(res, file, fileList) {
        // console.log('🚀 ~ handleSuccess ~ res, file, fileList:', res, file, fileList)
        if (!res.success) return this.$Message.error(res.message)
        this.beforeImg.push(res)
      },
      handleFormatError(file) {
        this.$Message.error(this.$t('uploadError'))
      },
      handleMaxSize(file) {
        // 超过2M
        this.$Message.error(this.$t('imgLarger2M'))
      },
      handleFileMaxSize(file) {
        this.$Message.error(this.$t('uploadFileSizeTip', { size: 10 }))
      },
      handleAfterSuccess(res, file, fileList) {
        if (!res.success) return this.$Message.error(res.message)
        this.afterImg.push(res)
      },
      deleteFile() {
        this.fileObj.name = ''
        this.fileUrl = ''
      },
      handleFileSuccess(res, file) {
        if (!res.success) return this.$Message.error(res.message)
        const type = file.name ? file.name.split('.')[1] : ''
        const fileType = type ? fileTypeList.find(v => v.type.includes(type)) : ''
        this.fileObj = {
          img: fileType ? fileType.img : '',
          name: file.name,
          size: file.size,
          fileUrl: res.data,
        }

        this.fileUrl = res.data
      },
    },
  }
</script>

<style lang="less" scoped>
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
  .ml-8 {
    margin-left: 8px;
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
  .dis-flex {
    display: flex;
  }
  .text-style {
    color: #999;
    background: #2c313d;
    padding: 1px 10px;
    margin: 5px;
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
  .uploadTip {
    color: #007eff;
  }
</style>
