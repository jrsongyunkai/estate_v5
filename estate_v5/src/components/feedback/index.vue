<template>
  <div class="userfeedback">
    <div class="formStyle">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="left" :label-width="100">
        <FormItem :label="`${$t('title')}:`" prop="title" class="w">
          <Input v-model="formValidate.title" maxlength="20" show-word-limit :placeholder="`${$t('pleaseEnter')}`"></Input>
        </FormItem>
        <FormItem :label="`${$t('problemOverview')}:`" prop="overview" class="w">
          <Input v-model="formValidate.overview" type="textarea" :rows="4" :placeholder="`${$t('pleaseEnter')}`" maxlength="100" show-word-limit />
        </FormItem>
        <FormItem :label="`${$t('problemDescription')}:`" prop="describe">
          <i-quill v-model="formValidate.describe" :min-height="400" @on-change="handleVal" />
        </FormItem>
        <FormItem :label="`${$t('fullName')}:`" prop="name" class="w">
          <Input v-model="formValidate.name" :placeholder="`${$t('pleaseEnter')}`" />
        </FormItem>
        <FormItem :label="`${$t('contactNumber')}:`" prop="phone" class="w">
          <Input v-model="formValidate.phone" :placeholder="`${$t('pleaseEnter')}`" />
        </FormItem>
        <FormItem :label="`${$t('contactEmail')}:`" prop="email" class="w">
          <Input v-model="formValidate.email" :placeholder="`${$t('pleaseEnter')}`" />
        </FormItem>
        <FormItem :label="`${$t('accountName')}:`" prop="userName" class="w">
          <Input v-model="formValidate.userName" :placeholder="`${$t('autoComplateAccount')}`" />
        </FormItem>
        <FormItem :label="`${$t('ownProject')}:`" prop="projectName" class="w">
          <Select v-model="formValidate.projectName">
            <Option v-for="item in projectData" :value="item.projectCode" :key="item.projectCode">{{ item.projectName }}</Option>
          </Select>
        </FormItem>
        <span class="tips">{{ $t('concatMsgTips') }}</span>
        <FormItem class="btnList">
          <Button type="primary" @click="handleSubmit('formValidate')" :loading="loading">{{ $t('submit') }}</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">{{ $t('cancel') }}</Button>
        </FormItem>
      </Form>
    </div>
    <Modal v-model="receivedfeedback" title="" width="550" class="receivedfeedback">
      <div class="header">
        <Icon custom="icon-v5 icon-v5-jiekuanchulichenggong2"></Icon>
        <span>{{ $t('weHaveReceivedYourFeedback') }}</span>
      </div>
      <div class="content">{{ $t('feedbackTips') }}</div>
      <div class="btn">
        <Button @click="receivedfeedback = false">{{ $t('iKnow') }}</Button>
      </div>

      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import iQuill from '@/components/quill'
  import { feedbacksubmit } from '@/api/public'
  import { projectIndexDB } from '@/plugins/indexDB/index'
  export default {
    components: { iQuill },
    data() {
      return {
        loading: false,
        receivedfeedback: false,
        projectData: [],
        formValidate: {
          title: '',
          overview: '',
          describe: '',
          name: '',
          phone: '',
          email: '',
          userName: window.sessionStorage.getItem('staffName'),
          projectName: '',
        },
        ruleValidate: {
          title: [{ required: true, message: this.$t('pleaseEnterTitle'), trigger: 'blur' }],
          overview: [{ required: true, message: this.$t('pleaseEnterProblemOverview'), trigger: 'blur' }],
          describe: [
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, callback) => {
                const state = this.quetiononblur(value)
                if (state) {
                  return callback(new Error(this.$t('problemDescriptionMustNotEmpty')))
                } else {
                  callback()
                }
              },
            },
          ],
          name: [{ required: true, message: this.$t('pleaseEnterFullName'), trigger: 'blur' }],
          phone: [{ required: true, message: this.$t('pleaseEnterContactNumber'), trigger: 'blur' }],
          email: [
            { required: true, message: this.$t('pleaseEnterEmail'), trigger: 'blur' },
            { type: 'email', message: this.$t('pleaseEnterEmail'), trigger: 'blur' },
          ],
          userName: [{ required: true, message: this.$t('pleaseEnterAccount'), trigger: 'blur' }],
          projectName: [{ required: true, message: this.$t('pleaseOwnProject'), trigger: 'blur' }],
        },
      }
    },
    async created() {
      this.projectData = JSON.parse(await projectIndexDB.getItem('checkedProjectStr'))
    },
    mounted() {},
    methods: {
      getBase64URL(pic) {
        const blob = this.base64ImgtoFile(pic)
        const blobUrl = window.URL.createObjectURL(blob)
        return blobUrl
      },
      base64ImgtoFile(dataurl, filename = 'file') {
        // 将base64格式分割：['data:image/png;base64','XXXX']
        const arr = dataurl.split(',')
        // .*？ 表示匹配任意字符到下一个符合条件的字符 刚好匹配到：
        // image/png
        const mime = arr[0].match(/:(.*?);/)[1] // image/png
        // [image,png] 获取图片类型后缀
        const suffix = mime.split('/')[1] // png
        const bstr = atob(arr[1]) // atob() 方法用于解码使用 base-64 编码的字符串
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], `${filename}.${suffix}`, {
          type: mime,
        })
      },
      quetiononblur(value) {
        let text = this.getText(value)
        return this.isNull(text)
      },
      getText(str) {
        return str
          .replace(/<[^<p>]+>/g, '') // 将所有<p>标签 replace ''
          .replace(/<[</p>$]+>/g, '') // 将所有</p>标签 replace ''
          .replace(/&nbsp;/gi, '') // 将所有 空格 replace ''
          .replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
      },
      isNull(str) {
        if (str === '') return true
        var regu = '^[ ]+$'
        var re = new RegExp(regu)
        return re.test(str)
      },
      handleVal(item) {},
      handleSubmit(name) {
        let params = {
          title: this.formValidate.title,
          questionSummary: this.formValidate.overview,
          '`questionDetail': this.formValidate.describe,
          name: this.formValidate.name,
          telephone: this.formValidate.phone,
          email: this.formValidate.email,
          projectCode: this.formValidate.projectName,
        }
        this.loading = true
        this.$refs[name].validate(valid => {
          if (valid) {
            feedbacksubmit(params).then(res => {
              if (res.success) {
                this.receivedfeedback = true
                this.$emit('feedstatus', false)
                this.loading = false
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
          } else {
            this.$Message.error(this.$t('pleaseEnterRequirement'))
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields()
        this.$emit('feedbackchilren', false)
      },
    },
  }
</script>
<style lang="less">
  .userfeedback {
    .ivu-input {
      border-color: #797979 !important;
    }
    .formStyle {
      padding: 20px;
    }
    .w {
      width: 480px;
    }
    .ivu-select-selection {
      border-color: #797979 !important;
    }
    .tips {
      margin-left: 100px;
      color: #0e84d0;
    }
    .btnList {
      display: flex;
      justify-content: flex-end;
    }
    .ql-editor {
      min-height: 400px;
    }
    .ivu-select-dropdown-list {
      width: 378px;
    }
    .ivu-select-dropdown {
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .receivedfeedback {
    .ivu-modal-footer {
      padding: 0;
      border-top: transparent;
    }
    .ivu-modal-body {
      padding: 30px;
      .ivu-icon {
        font-size: 30px;
        color: #1afa29;
        margin-right: 10px;
      }
      .content {
        font-size: 14px;
        margin-left: 40px;
        color: #aaaaaa;
        margin-top: 10px;
      }
      .btn {
        display: flex;
        justify-content: center;
        margin-top: 30px;
        button {
          border-color: #02a7f0;
          background: rgba(2, 167, 240, 0.1);
          color: #02a7f0;
        }
      }
    }
  }
</style>
