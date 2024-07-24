<template>
  <div class="neutralCount">
    <h2>{{ $t('neutral') }}</h2>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
      <Row class="mt-10" style="position: relative; margin-bottom: 10px" v-if="$store.state.localdeplyoy === 'false'">
        <FormItem :label="$t('inDomainName')" prop="identification">
          <Input :placeholder="$t('identificationString')" class="input" style="width: 200px" v-model="formValidate.identification"></Input>
          <div class="pors">.snd01.com</div>
        </FormItem>
        <p style="position: absolute; bottom: -10px">{{ $t('domainNameCharacters') }}</p>
      </Row>
      <h3>{{ $t('LandingPage') }}</h3>
      <Row class="mt-10">
        <FormItem :label="$t('title')" prop="loginPageTitle">
          <Input :placeholder="`${$t('pleaseEnter')}${$t('title')}`" v-model="formValidate.loginPageTitle" class="input" style="width: 400px"></Input>
        </FormItem>
        <FormItem :label="$t('fontSize1')" class="ml-20">
          <Input placeholder="20px" v-model="loginPageTitleSize" class="input" style="width: 100px"></Input>
        </FormItem>
        <FormItem :label="$t('fontColor')" class="ml-20">
          <ColorPicker v-model="loginPageTitleColor" />
        </FormItem>
      </Row>
      <Row style="position: relative">
        <FormItem :label="$t('companyLogo')">
          <Upload
            :show-upload-list="false"
            :action="action"
            :on-success="res => handleSuccess(res, 'loginLogo')"
            :default-file-list="defaultList"
            :before-upload="res => beforeUpload(res, 'loginLogo')"
            :on-format-error="handleFormatError"
            :format="['png']"
            :max-size="2048"
            multiple
            type="drag"
            name="beforeImgFile"
            :data="beforeImgData"
            style="display: inline-block; width: 100px; higth: 100px">
            <div v-if="formValidate.loginLogo">
              <div class="demo-upload-list">
                <img :src="formValidate.loginLogo" style="width: 100%" />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-trash-outline" @click.stop="handleRemove('1')"></Icon>
                </div>
              </div>
            </div>

            <div style="width: 100px; height: 100px; line-height: 100px" v-if="!formValidate.loginLogo">
              <Icon type="md-add" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <FormItem :label="$t('height')" class="ml-20">
          <Input placeholder="24px" class="input" style="width: 100px" v-model="loginLogoHeight"></Input>
        </FormItem>
        <FormItem :label="$t('width')" class="ml-20">
          <Input placeholder="124px" class="input" style="width: 100px" v-model="loginLogoWidth"></Input>
        </FormItem>
        <p>{{ $t('uploadPng') }}</p>
      </Row>

      <Row style="position: relative" class="mt-10">
        <FormItem :label="$t('backgroundStyleI')">
          <Upload
            :show-upload-list="false"
            :action="action"
            :on-success="res => handleSuccess(res, 'bground')"
            :default-file-list="defaultList"
            :before-upload="res => beforeUpload(res, 'bground')"
            :format="['jpg', 'png', 'jpeg']"
            :max-size="2048"
            multiple
            type="drag"
            name="beforeImgFile"
            :data="beforeImgData"
            style="display: inline-block; width: 100px; higth: 100px">
            <div v-if="formValidate.bground">
              <div class="demo-upload-list">
                <img :src="formValidate.bground" style="width: 100%" />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-trash-outline" @click.stop="handleRemove('2')"></Icon>
                </div>
              </div>
            </div>
            <div style="width: 100px; height: 100px; line-height: 100px" v-if="!formValidate.bground">
              <Icon type="md-add" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <FormItem :label="$t('presentationMode')" class="ml-20">
          <Select v-model="bgroundrepeat" style="width: 100px">
            <Option v-for="item in presentationData" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('positionX')" class="ml-20">
          <Input :placeholder="$t('pleaseEnter')" v-model="bgroundxpos" class="input" style="width: 100px"></Input>
        </FormItem>
        <FormItem :label="$t('positionY')" class="ml-20">
          <Input :placeholder="$t('pleaseEnter')" v-model="bgroundypos" class="input" style="width: 100px"></Input>
        </FormItem>
        <FormItem :label="$t('zoomMethod')" class="ml-20">
          <Select v-model="bgroundsize" style="width: 100px">
            <Option v-for="item in sizeType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('colour')" class="ml-20">
          <ColorPicker v-model="bgroundcolor" />
        </FormItem>
        <p>{{ $t('uploadJpg') }}</p>
      </Row>

      <Row style="position: relative" class="mt-10">
        <FormItem :label="$t('backgroundStyleII')">
          <Upload
            :show-upload-list="false"
            :action="action"
            :on-success="res => handleSuccess(res, 'bg2round')"
            :default-file-list="defaultList"
            :before-upload="res => beforeUpload(res, 'bg2round')"
            :format="['jpg', 'png', 'jpeg']"
            :max-size="2048"
            multiple
            type="drag"
            name="beforeImgFile"
            :data="beforeImgData"
            style="display: inline-block; width: 100px; higth: 100px">
            <div v-if="formValidate.bground2">
              <div class="demo-upload-list">
                <img :src="formValidate.bground2" style="width: 100%" />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-trash-outline" @click.stop="handleRemove('3')"></Icon>
                </div>
              </div>
            </div>
            <div style="width: 100px; height: 100px; line-height: 100px" v-if="!formValidate.bground2">
              <Icon type="md-add" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <FormItem :label="$t('presentationMode')" class="ml-20">
          <Select v-model="bg2roundrepeat" style="width: 100px">
            <Option v-for="item in presentationData" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('positionX')" class="ml-20">
          <Input :placeholder="$t('pleaseEnter')" class="input" v-model="bg2roundxpos" style="width: 100px"></Input>
        </FormItem>
        <FormItem :label="$t('positionY')" class="ml-20">
          <Input :placeholder="$t('pleaseEnter')" class="input" v-model="bg2roundypos" style="width: 100px"></Input>
        </FormItem>
        <FormItem :label="$t('zoomMethod')" class="ml-20">
          <Select v-model="bg2roundsize" style="width: 100px">
            <Option v-for="item in sizeType" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('colour')" class="ml-20">
          <ColorPicker v-model="bg2roundcolor" />
        </FormItem>
        <p></p>
        <p>{{ $t('uploadJpg') }}</p>
      </Row>

      <Row>
        <FormItem :label="$t('copyright')">
          <Input :placeholder="`${$t('pleaseEnter')}${$t('copyright')}`" class="input" style="width: 400px" v-model="copyright"></Input>
        </FormItem>
        <FormItem :label="$t('fontSize1')" class="ml-20">
          <Input placeholder="14px" class="input" style="width: 100px" v-model="copyrightSzie"></Input>
        </FormItem>
        <FormItem :label="$t('fontColor')" class="ml-20">
          <ColorPicker v-model="copyrightColor" />
        </FormItem>
      </Row>

      <Row>
        <FormItem :label="$t('record')">
          <Input :placeholder="`${$t('pleaseEnter')}${$t('record')}`" class="input" style="width: 400px" v-model="record"></Input>
        </FormItem>
        <FormItem :label="$t('fontSize1')" class="ml-20">
          <Input placeholder="14px" class="input" style="width: 100px" v-model="recordSize"></Input>
        </FormItem>
        <FormItem :label="$t('fontColor')" class="ml-20">
          <ColorPicker v-model="recordColor" />
        </FormItem>
      </Row>

      <Row>
        <FormItem :label="$t('outerChainTitle')">
          <Input :placeholder="`${$t('pleaseEnter')}${$t('outerChainTitle')}`" class="input" style="width: 200px" v-model="external"></Input>
        </FormItem>
        <FormItem :label="$t('externalLinkAddress')" class="ml-20">
          <Input placeholder="http://....." class="input" style="width: 200px" v-model="externalUrl"></Input>
        </FormItem>
        <FormItem :label="$t('fontSize1')" class="ml-20">
          <Input placeholder="14px" class="input" style="width: 100px" v-model="externalSize"></Input>
        </FormItem>
        <FormItem :label="$t('fontColor')" class="ml-20">
          <ColorPicker v-model="externalColor" />
        </FormItem>
      </Row>

      <h3>{{ $t('afterLogin') }}</h3>
      <Row>
        <FormItem :label="$t('afterLoginBigscreen')" prop="mainTitle">
          <Input :placeholder="`${$t('pleaseEnter')}${$t('title')}`" class="input" style="width: 400px" v-model="formValidate.mainTitle"></Input>
        </FormItem>
        <FormItem :label="$t('fontSize1')" class="ml-20">
          <Input placeholder="20px" class="input" style="width: 100px" v-model="mainTitleSize"></Input>
        </FormItem>
        <FormItem :label="$t('fontColor')" class="ml-20">
          <ColorPicker v-model="mainTitleColor" />
        </FormItem>
      </Row>

      <Row style="position: relative">
        <FormItem :label="$t('companyLogo')">
          <Upload
            :show-upload-list="false"
            :action="action"
            :on-success="res => handleSuccess(res, 'mainLogo')"
            :default-file-list="defaultList"
            :before-upload="beforeUpload"
            :format="['png']"
            :max-size="2048"
            multiple
            type="drag"
            name="beforeImgFile"
            :data="beforeImgData"
            style="display: inline-block; width: 100px; higth: 100px">
            <div v-if="formValidate.mainLogo">
              <div class="demo-upload-list">
                <img :src="formValidate.mainLogo" style="width: 100%" />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-trash-outline" @click.stop="handleRemove('4')"></Icon>
                </div>
              </div>
            </div>
            <div style="width: 100px; height: 100px; line-height: 100px" v-if="!formValidate.mainLogo">
              <Icon type="md-add" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <p>{{ $t('uploadPng') }}</p>
        <FormItem :label="$t('height')" class="ml-20">
          <Input placeholder="64px" class="input" style="width: 100px" v-model="mainLogoHeight"></Input>
        </FormItem>
        <FormItem :label="$t('width')" class="ml-20">
          <Input placeholder="220px" class="input" style="width: 100px" v-model="mainLogoWidth"></Input>
        </FormItem>
      </Row>
      <Row>
        <FormItem>
          <Button type="primary" @click="handleSubmit">{{ $t('save') }}</Button>
        </FormItem>
      </Row>
    </Form>
  </div>
</template>
<script>
  import { getConfigByLoginUser, saveConfig } from '@/api/public'
  export default {
    data() {
      return {
        colorData: '#fff',
        defaultList: [],
        presentationData: [
          {
            value: 'repeat',
            label: this.$t('repeat1'),
          },
          {
            value: 'no-repeat',
            label: this.$t('noRepeat'),
          },
        ],
        sizeType: [
          {
            value: 'inherit',
            label: this.$t('normal'),
          },
          {
            value: '100%',
            label: this.$t('stretching'),
          },
        ],
        mode: '',
        action: `${this.$func.ctxPaths()}/config/special/logo/upload.as?v=` + new Date().getTime(),
        beforeImgData: { name: 'beforeImgFile' },
        formValidate: {
          loginLogo: '',
          serverLoginlogo: '',
          mainLogo: '',
          serverMainogo: '',
          bground: '',
          serverBground: '',
          bground2: '',
          serverBground2: '',

          identification: '',
          loginPageTitle: '',
          mainTitle: '',
        },
        ruleValidate: {
          loginPageTitle: [{ required: true, message: ' ', trigger: 'blur' }],
          identification: [{ required: true, message: ' ', trigger: 'blur' }],
          mainTitle: [{ required: true, message: ' ', trigger: 'blur' }],
        },
        neutralVal: '',

        loginPageTitleSize: '',
        loginPageTitleColor: '',
        loginLogoHeight: '',
        loginLogoWidth: '',
        bgroundHeight: '',
        bgroundWidth: '',

        bgroundcolor: '',
        bgroundrepeat: '',
        bgroundxpos: '',
        bgroundypos: '',
        bgroundsize: '',

        bg2roundcolor: '',
        bg2roundrepeat: '',
        bg2roundxpos: '',
        bg2roundypos: '',
        bg2roundsize: '',

        copyright: '',
        copyrightSzie: '',
        copyrightColor: '',

        record: '',
        recordSize: '',
        recordColor: '',

        external: '',
        externalUrl: '',
        externalSize: '',
        externalColor: '',

        mainTitleSize: '',
        mainTitleColor: '',

        mainLogoHeight: '',
        mainLogoWidth: '',
      }
    },
    mounted() {
      this.handelegetConfigByLoginUser()
    },
    methods: {
      handleSubmit() {
        const reg = /^[A-Za-z0-9_]+$/
        if (this.formValidate.loginPageTitle === '' || this.formValidate.mainTitle === '') {
          this.$Message.error({
            content: this.$t('titleNotEmpty'),
          })
        } else if (this.formValidate.identification === '' || this.formValidate.identification === undefined || this.formValidate.identification === null) {
          this.$Message.error({
            content: this.$t('theDomainNameRecognitionStringCannotBeEmpty'),
          })
        } else if (reg.test(this.formValidate.identification) !== true) {
          this.$Message.error({
            content: this.$t('domainNameIdentificationStringMustBeLettersAndNumbers'),
          })
        } else {
          this.hanleSaveConfig()
        }
      },
      handelegetConfigByLoginUser() {
        getConfigByLoginUser({}).then(res => {
          const configValue = res.data.configValue
          this.neutralVal = res.data.edition
          this.formValidate.identification = res.data.identity
          this.formValidate.loginPageTitle = configValue.loginPageTitle.text
          this.loginPageTitleSize = configValue.loginPageTitle.size
          this.loginPageTitleColor = configValue.loginPageTitle.color

          this.formValidate.loginLogo = configValue.loginPageLogo.imageUrl
          this.formValidate.serverLoginlogo = configValue.loginPageLogo.imageUrl
          this.loginLogoHeight = configValue.loginPageLogo.height
          this.loginLogoWidth = configValue.loginPageLogo.width

          this.formValidate.bground = configValue.loginPageBgImg[0].url
          this.formValidate.serverBground = configValue.loginPageBgImg[0].url
          this.bgroundcolor = configValue.loginPageBgImg[0].color
          this.bgroundrepeat = configValue.loginPageBgImg[0].repeat
          this.bgroundxpos = configValue.loginPageBgImg[0].xpos
          this.bgroundypos = configValue.loginPageBgImg[0].ypos
          this.bgroundsize = configValue.loginPageBgImg[0].size

          this.formValidate.bground2 = configValue.loginPageBgImg[1].url
          this.formValidate.serverBground2 = configValue.loginPageBgImg[1].url
          this.bg2roundcolor = configValue.loginPageBgImg[1].color
          this.bg2roundrepeat = configValue.loginPageBgImg[1].repeat
          this.bg2roundxpos = configValue.loginPageBgImg[1].xpos
          this.bg2roundypos = configValue.loginPageBgImg[1].ypos
          this.bg2roundsize = configValue.loginPageBgImg[1].size

          this.copyright = configValue.loginPageCopyRight.text
          this.copyrightSzie = configValue.loginPageCopyRight.size
          this.copyrightColor = configValue.loginPageCopyRight.color

          this.record = configValue.loginPageIcpNumber.text
          this.recordSize = configValue.loginPageIcpNumber.size
          this.recordColor = configValue.loginPageIcpNumber.color

          this.external = configValue.loginPageExternalLink.text
          this.externalUrl = configValue.loginPageExternalLink.url
          this.externalSize = configValue.loginPageExternalLink.size
          this.externalColor = configValue.loginPageExternalLink.color

          this.formValidate.mainTitle = configValue.mainPageTitle.text
          this.mainTitleSize = configValue.mainPageTitle.size
          this.mainTitleColor = configValue.mainPageTitle.color

          this.formValidate.serverMainogo = configValue.mainPageLogo.imageUrl
          this.formValidate.mainLogo = configValue.mainPageLogo.imageUrl
          this.mainLogoHeight = configValue.mainPageLogo.height
          this.mainLogoWidth = configValue.mainPageLogo.width
        })
      },
      hanleSaveConfig() {
        const configValue = {
          loginPageTitle: {
            text: this.formValidate.loginPageTitle,
            size: this.loginPageTitleSize,
            color: this.loginPageTitleColor,
          },
          loginPageLogo: {
            imageUrl: this.formValidate.serverLoginlogo,
            width: this.loginLogoWidth,
            height: this.loginLogoHeight,
          },
          loginPageBgImg: [
            {
              url: this.formValidate.serverBground,
              color: this.bgroundcolor,
              repeat: this.bgroundrepeat,
              xpos: this.bgroundxpos,
              ypos: this.bgroundypos,
              size: this.bgroundsize,
            },
            {
              url: this.formValidate.serverBground2,
              color: this.bg2roundcolor,
              repeat: this.bg2roundrepeat,
              xpos: this.bg2roundxpos,
              ypos: this.bg2roundypos,
              size: this.bg2roundsize,
            },
          ],
          loginPageCopyRight: {
            text: this.copyright,
            size: this.copyrightSzie,
            color: this.copyrightColor,
          },
          loginPageIcpNumber: {
            text: this.record,
            size: this.recordSize,
            color: this.recordColor,
          },
          loginPageExternalLink: {
            text: this.external,
            url: this.externalUrl,
            size: this.externalSize,
            color: this.externalColor,
          },
          mainPageTitle: {
            text: this.formValidate.mainTitle,
            size: this.mainTitleSize,
            color: this.mainTitleColor,
          },
          mainPageLogo: {
            imageUrl: this.formValidate.serverMainogo,
            width: this.mainLogoWidth,
            height: this.mainLogoHeight,
          },
        }

        let params = {
          identity: this.formValidate.identification,
          configValue: JSON.stringify(configValue),
        }
        saveConfig(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: this.$t('savedSuccessfully'),
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleSuccess(res, val) {
        if (res.success) {
          if (val === 'loginLogo') {
            this.formValidate.serverLoginlogo = res.data
          } else if (val === 'bground') {
            this.formValidate.serverBground = res.data
          } else if (val === 'bg2round') {
            this.formValidate.serverBground2 = res.data
          } else {
            this.formValidate.serverMainogo = res.data
          }
        } else if (res.code === '-1') {
        } else {
          this.$Message.error(res.message)
        }
      },
      beforeUpload(file, val) {
        const isLt1M = file.size / 1024 / 1024 < 1
        if (isLt1M) {
          if (val === 'loginLogo') {
            if (file.type === 'image/png') {
              this.formValidate.loginLogo = URL.createObjectURL(file)
            } else {
              this.$Message.error(this.$t('uploadImgFormatError'))
            }
          } else if (val === 'bground') {
            if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
              if (file.name.includes('jfif')) {
                this.$Message.error(this.$t('uploadImgFormatError'))
              } else {
                this.formValidate.bground = URL.createObjectURL(file)
              }
            } else {
              this.$Message.error(this.$t('uploadImgFormatError'))
            }
          } else if (val === 'bg2round') {
            if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
              if (file.name.includes('jfif')) {
                this.$Message.error(this.$t('uploadImgFormatError'))
              } else {
                this.formValidate.bground2 = URL.createObjectURL(file)
              }
            } else {
              this.$Message.error(this.$t('uploadImgFormatError'))
            }
          } else {
            if (file.type === 'image/png') {
              this.formValidate.mainLogo = URL.createObjectURL(file)
            } else {
              this.$Message.error(this.$t('uploadImgFormatError'))
            }
          }
          this.srcList = [this.formValidate.loginLogo]
        } else if (!isLt1M) {
          this.$Message.error(this.$t('exceedSize'))
        }
        return isLt1M
      },
      handleRemove(file) {
        if (file === '1') {
          this.formValidate.loginLogo = ''
          this.formValidate.serverLoginlogo = ''
        } else if (file === '2') {
          this.formValidate.bground = ''
          this.formValidate.serverBground = ''
        } else if (file === '3') {
          this.formValidate.bground2 = ''
          this.formValidate.serverBground2 = ''
        } else {
          this.formValidate.mainLogo = ''
          this.formValidate.serverMainogo = ''
        }
      },
      handleFormatError(file) {},
    },
  }
</script>
<style lang="less" scoped>
  .pors {
    position: absolute;
    right: -110px;
    top: 40px;
    font-size: 20px;
    color: #98989e;
  }
  .ml-20 {
    margin-left: 20px;
  }
  .mt-20 {
    margin-top: 20px;
  }
  .mt-10 {
    margin-top: 10px;
  }
  /deep/.ivu-input {
    border-color: #535b6c !important;
    border-radius: 5px;
  }
  p {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #007eff;
    line-height: 28px;
    position: absolute;
    bottom: 0px;
  }
  .ivu-form-item {
    margin-bottom: 20px;
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
</style>
