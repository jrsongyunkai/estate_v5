<!--富文本编辑器-->
<template>
  <div class="RichTextEditor-Wrap">
    <quill-editor :content="content" :options="editorOption" class="ql-editor" ref="myQuillEditor" @change="onEditorChange($event)"></quill-editor>
    <Row>
      <Button class="b-blue" @click="videoDialog.show = true">{{ $t('uploadVideo') }}</Button>
      <!-- 图片上传组件辅助-->
      <Upload :show-file-list="false" :name="imgData.name" :multiple="false" :data="imgData" :action="uploadImgConfig.uploadUrl" :before-upload="onBeforeUpload" :on-success="onSuccess" :show-upload-list="false" :on-error="onError" :file-list="fileList">
        <!--<i class="el-icon-upload"></i>-->
        <!--<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
        <!--<div class="el-upload__tip" slot="tip">最多只能上传两个附件</div>-->
        <Button ref="myinput" class="ml-10 b-blue">{{ $t('uploadImg') }}</Button>
      </Upload>
    </Row>
    <!--视频上传-->
    <div>
      <Modal :close-on-click-modal="false" width="50%" style="margin-top: 1px" :title="$t('videoUpload')" v-model="videoDialog.show" append-to-body>
        <Tabs v-model="videoDialog.activeName">
          <TabPane :label="$t('addVideoLink')" name="first">
            <Input v-model="videoDialog.videoLink" :placeholder="$t('pleaseEnterVideoLink')" clearable></Input>
          </TabPane>
          <TabPane :label="$t('localVideoUpload')" name="second">
            <Upload style="text-align: center" drag :action="uploadVideoConfig.uploadUrl" accept="video/*" :name="uploadVideoConfig.name" :before-upload="onBeforeUploadVideo" :on-success="onSuccessVideo" :on-error="onErrorVideo" :multiple="false">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                {{ $t('fileDragTip') }}
                <em>{{ $t('clickToUpload') }}</em>
              </div>
              <div class="el-upload__tip" slot="tip">{{ $t('videoUploadSizeTip', { size: uploadVideoConfig.maxSize }) }}</div>
            </Upload>
          </TabPane>
        </Tabs>
        <div slot="footer">
          <Button type="primary" @click="addVideoLink(videoDialog.videoLink)">{{ $t('confirm') }}</Button>
          <Button @click="videoDialog.show = false">{{ $t('cancel') }}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor, Quill } from 'vue-quill-editor'
  import Video from './video'
  // 设置title
  import { addQuillTitle } from './options'
  Quill.register(Video, true)

  // 工具栏
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ align: [] }],
    [{ clean: window.$t('cancel') }], // remove formatting button
    // ['image', 'video']
  ]
  export default {
    name: 'RichTextEditor',
    model: {
      prop: 'content',
      event: 'change',
    },
    components: {
      quillEditor,
    },
    props: {
      content: {
        // 返回的html片段
        type: String,
        default: '',
      },
      uploadImgConfig: {
        // 图片上传配置 - 若不配置则使用quillEditor默认方式，即base64方式
        type: Object,
        default() {
          return {
            uploadUrl: `/common/file/upload.as?fileType=1&urlAbsolute=${true}`, // 图片上传地址
            maxSize: 2, // 图片上传大小限制，默认不超过2M
            name: 'imgFile', // 图片上传字段
          }
        },
      },
      uploadVideoConfig: {
        // 视频上传配置
        type: Object,
        default() {
          return {
            uploadUrl: `/common/file/upload.as?fileType=3&urlAbsolute=${true}`, // 上传地址
            maxSize: 10, // 图片上传大小限制，默认不超过2M
            name: 'file1', // 图片上传字段
          }
        },
      },
    },
    data() {
      let _self = this
      return {
        uploadUrl: '/box/icon/upload.as?v=' + new Date().getTime(),
        imgData: {
          name: 'imgFile',
        },
        editorOption: {
          placeholder: '',
          theme: 'snow', // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions, // 工具栏
              handlers: {
                video: function (value) {
                  _self.videoDialog.show = true
                },
              },
            },
          },
        },

        // 图片上传变量
        fileList: [],

        // 视频上传变量
        videoDialog: {
          show: false,
          videoLink: '',
          activeName: 'first',
        },
      }
    },
    mounted() {
      // 初始给编辑器设置title
      addQuillTitle()

      let toolbar = this.$refs['myQuillEditor'].quill.getModule('toolbar')
      // 是否开启图片上传到服务器功能
      if (this.uploadImgConfig.uploadUrl) {
        toolbar.addHandler('image', this.addImageHandler)
      }
    },
    methods: {
      // 文本编辑
      onEditorChange({ quill, html, text }) {
        this.$emit('update:content', html)
        this.$emit('change', html)
      },

      // --------- 图片上传相关 start ---------

      addImageHandler(value) {
        if (value) {
          // 触发input框选择图片文件
          this.$refs['myinput'].click()
        } else {
          this.quill.format('image', false)
        }
      },
      // 把已经上传的图片显示回富文本编辑框中
      uploadSuccess(imgurl) {
        let quill = this.$refs['myQuillEditor'].quill
        let range = quill.getSelection()
        let index = 0
        if (range == null) {
          index = 0
        } else {
          index = range.index // 获取光标所在位置
        }
        // 插入

        quill.insertEmbed(index, 'image', imgurl) // imgurl是服务器返回的图片链接地址
        // 调整光标到最后
        quill.setSelection(index + 1)
      },
      // el-文件上传组件
      onBeforeUpload(file) {
        let acceptArr = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']
        const isIMAGE = acceptArr.includes(file.type)
        const isLt1M = file.size / 1024 / 1024 < this.uploadImgConfig.maxSize

        if (!isIMAGE) {
          this.$Message.error(this.$t('onlyInsertImg'))
        }
        if (!isLt1M) {
          this.$Message.error(this.$t('fileUploadSizeTip', { size: this.uploadImgConfig.maxSize }))
        }
        return isLt1M && isIMAGE
      },
      // 文件上传成功时的钩子
      onSuccess(response, file, fileList) {
        // ---- 注意这部分需要改为对应的返回格式
        if (response.code === '0') {
          this.uploadSuccess(response.data)
        } else {
          this.$Message.error(this.$t('uploadFail'))
        }
      },
      // 文件上传失败时的钩子
      onError(file, fileList) {
        this.$Message.error(this.$t('uploadFail'))
      },

      // --------- 图片上传相关 end ---------

      // --------- 视频上传相关 start ---------

      addVideoLink(videoLink) {
        if (!videoLink) return this.$Message.error(this.$t('pleaseEnterVideoLink'))
        this.videoDialog.show = false
        let quill = this.$refs['myQuillEditor'].quill
        let range = quill.getSelection()
        let index = 0
        if (range == null) {
          index = 0
        } else {
          index = range.index
        }
        // 插入

        quill.insertEmbed(index, 'video', videoLink)
        // 调整光标到最后
        quill.setSelection(index + 1)
      },

      // el-文件上传组件
      onBeforeUploadVideo(file) {
        let acceptArr = ['video/mp4']
        const isVideo = acceptArr.includes(file.type)
        const isLt1M = file.size / 1024 / 1024 < this.uploadVideoConfig.maxSize
        if (!isVideo) {
          this.$Message.error(this.$t('onlyUploadMp4'))
        }
        if (!isLt1M) {
          this.$Message.error(this.$t('videoUploadSizeTip', { size: this.uploadVideoConfig.maxSize }))
        }
        return isLt1M && isVideo
      },
      // 文件上传成功时的钩子
      onSuccessVideo(response, file, fileList) {
        // ---- 注意这部分需要改为对应的返回格式
        if (response.code === '0') {
          this.addVideoLink(response.data)
        } else {
          this.$Message.error(this.$t('uploadFail'))
        }
      },
      // 文件上传失败时的钩子
      onErrorVideo(file, fileList) {
        this.$Message.error(this.$t('uploadFail'))
      },

      // --------- 视频上传相关 end ---------
    },
  }
</script>
<style lang="less">
  .RichTextEditor-Wrap {
    .ql-container {
      height: 300px;
      overflow: auto;
    }
    .ql-editor {
      padding: 0;
    }
    .ql-tooltip {
      left: 5px !important;
    }
    .ql-video {
      width: 500px;
    }
  }
</style>
