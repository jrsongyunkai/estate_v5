<template>
  <div>
    <Modal :title="$t('batchImport')" v-model="isShowModel" width="500" @on-cancel="$emit('close')">
      <Row style="justify-content: space-between; margin-bottom: 10px">
        <span>{{ $t('fileImport') }}</span>
        <div style="color: #02a7f0" class="pointer" @click.stop="downLoadMode">
          <Icon type="md-cloud-download" style="font-size: 16px" />
          {{ $t('templateDownload') }}
        </div>
      </Row>
      <Upload multiple type="drag" :format="['xlsx', 'xls']" :data="fileData" :name="fileData.name" :show-upload-list="false" :action="actionUrl" :before-upload="onBeforeUpload" :on-error="onError" accept=".xlsx,.xls" :on-success="(res, file, fileList) => onSuccessPerson(res, file, fileList)">
        <div style="padding: 60px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>{{ $t('importFileActionTip') }}</p>
        </div>
      </Upload>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import { importSupervisor } from '@/api/billingSystem/instantSettlement'
  export default {
    props: {
      callback: { type: Function, default: null },
    },
    data() {
      return {
        isShowModel: false,
        fileData: { name: 'excelName' },
        actionUrl: '/common/file/upload.as?fileType=4&&urlAbsolute=false&subDir=rts_supervisor',
      }
    },
    methods: {
      downLoadMode() {
        this.$func.windowCountDown('/common/tpl/download.as?type=rts_supervisor_template')
      },
      onBeforeUpload(file) {
        const fileExt = file.name.split('.').pop().toLocaleLowerCase()
        let isXlsx = fileExt === 'xlsx' || fileExt === 'xls'
        if (!isXlsx) {
          this.$Message.error(this.$t('uploadFileTypeTip', { fileType: 'excel' }))
          return false
        }
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isLt1M) {
          this.$Message.error(this.$t('uploadFileSizeTip', { size: 1 }))
          return false
        }
        return isLt1M && isXlsx
      },
      onError() {
        this.$Message.error({ content: this.$t('uploadFileFailTip') })
      },
      onSuccessPerson(res) {
        if (res.success) {
          this.importSupervisor(res.data)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async importSupervisor(absPath) {
        const res = await importSupervisor({ absPath, projectCode: this.$store.state.projectCode })
        if (res.success) {
          this.callback && this.callback()
          this.$emit('close')
          if (res.data.length > 0) {
            this.$Message.error({ content: this.$t('importFailNumberValue', { num: res.data }) })
          } else {
            this.$Message.success({ content: res.message })
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.isShowModel = true
    },
  }
</script>
