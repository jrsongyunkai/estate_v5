<template>
  <div>
    <Modal v-model="isShowModel" class-name="money-pop" :title="$t('miniProgramConfiguration')" @on-cancel="$emit('close')">
      <div class="item-input-image">
        <div class="label">{{ $t('miniProgramLogo') }}</div>
        <div>
          <Upload ref="upload" :action="uploadUrl" :name="imgData.name" :data="imgData" :on-success="handleSuccess" :before-upload="beforeUpload" @mouseover.native="flag = true" :show-upload-list="false" accept=".png" :max-size="2048">
            <el-image v-if="imgUrl" style="width: 100px; height: 100px" :src="imgUrl" :preview="false"></el-image>
            <div v-else class="uploader-icon" style="width: 100px; height: 100px; line-height: 100px; text-align: center; border: 1px dashed #d9d9d9; border-radius: 6px; cursor: pointer"><i class="el-icon-plus"></i></div>
          </Upload>
          <div class="upload-tips">{{ $t('uploadPngWithLimitTip', { num: 2 }) }}</div>
        </div>
      </div>
      <div class="item-input-name">
        <div class="label">{{ $t('miniProgramName') }}</div>
        <div class="content"><Input v-model="name" maxlength="20" show-word-limit :placeholder="$t('pleaseEnter')" /></div>
      </div>
      <div slot="footer">
        <Button type="default" @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click.stop="save">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getKeyValue, saveKeyValue } from '@/api/common/index'
  export default {
    props: {
      record: { type: Object, default: () => {} },
    },
    data() {
      return {
        isShowModel: false,
        name: '',
        uploadUrl: `/common/file/upload.as?fileType=1&urlAbsolute=${true}`,
        imgData: { name: 'imgFile' },
        imgUrl: '',
      }
    },
    methods: {
      async save() {
        if (!this.imgUrl) return this.$Message.error(this.$t('pleaseUploadMiniProgramIconTip'))
        if (!this.name) return this.$Message.error(this.$t('pleaseEnterMiniProgramNameTip'))
        let params = { at: 'db', tag: 'prj', key: 'REAL_TIME_APPLET_CONFIG', value: JSON.stringify({ name: this.name, imgUrl: this.imgUrl }), ep: this.$store.state.projectCode, sec: 0 }
        const res = await saveKeyValue(params)
        if (res.success) {
          this.$Message.success(this.$t('savedSuccessfully'))
          this.$emit('close')
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleSuccess(res, file) {
        if (res.success) {
          this.imgUrl = res.data
          this.$Message.success({ content: this.$t('uploadSuccess') })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      beforeUpload(file) {
        if (file.type === 'image/png') {
          const isLt1M = file.size / 1024 / 1024 < 2
          if (!isLt1M) {
            this.$Message.error(this.$t('imgLarger2M'))
          }
          return isLt1M
        } else {
          this.$Message.error(this.$t('uploadImgFormatError'))
        }
      },
      async getAppletInfo() {
        let params = { at: 'db', tag: 'prj', key: 'REAL_TIME_APPLET_CONFIG', ep: this.$store.state.projectCode }
        const res = await getKeyValue(params)
        if (res.success) {
          if (res.data) {
            let info = JSON.parse(res.data)
            this.name = info.name
            this.imgUrl = info.imgUrl
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.isShowModel = true
      this.getAppletInfo()
    },
  }
</script>

<style lang="less">
  @import url('./style.less');
</style>
