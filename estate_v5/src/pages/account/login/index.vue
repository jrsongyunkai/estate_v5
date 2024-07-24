<template>
  <div style="height: 100%; min-width: 1250px; min-height: 800px" :style="backgroundStyle[0].styleItem">
    <div class="page-account" :style="backgroundStyle[1].styleItem">
      <!-- <div class="page-account-text" :class="{ 'letter-spacing-9': locale === 'zh-CN' }" v-if="extend === 'Notspecial'">{{ $t('slogan') }}</div> -->
      <div v-if="showI18n" class="page-account-header">
        <div class="project">
          <div style="display: flex; align-items: center">
            <img :src="loginObj.loginPageLogo && loginObj.loginPageLogo.imageUrl" alt="" :style="imgSyle" />
            <span :style="spanStyle">{{ loginObj.loginPageTitle && loginObj.loginPageTitle.text }}</span>
          </div>
          <div class="setText" v-if="extend === 'Notspecial'">{{ $t('dunwuSystem') }}1.0</div>
        </div>
        <div class="links" style="margin-left: 100px">
          <a :href="loginObj.loginPageExternalLink && loginObj.loginPageExternalLink.url" target="_blank" style="white-space: nowrap; text-decoration: none" :style="aHerfStyle">{{ loginObj.loginPageExternalLink && loginObj.loginPageExternalLink.text }}</a>
        </div>
        <i-header-i18n />
      </div>
      <Row style="height: 100%">
        <Col span="10" />
        <Col span="14" v-if="forgotPassWord === 'regular'">
          <div class="page-account-container">
            <div class="login" v-show="LoginType">
              <div class="login-title">
                <div class="logon">{{ $t('login') }}</div>
                <div class="rdcode" @click="handleShowLoginType" v-if="extend === 'Notspecial'">
                  <img src="../../../assets/images/rdcode.png" alt="" />
                </div>
              </div>
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="margin-top: 10px">
                <FormItem prop="user">
                  <Input name="loginName" v-model="formValidate.user" :placeholder="$t('account')" />
                </FormItem>
                <FormItem prop="password" :style="checkCodeAreaShow ? 'margin-bottom:24px' : 'margin-bottom:12px'">
                  <Input type="password" name="password" v-model="formValidate.password" enter-to-submit :placeholder="$t('password')" :readonly="readonly" ref="password" />
                </FormItem>
                <div class="forgot" @click="handleforgotPassWord('forgot')">{{ $t('forgotPassword') }}</div>
                <FormItem v-if="checkCodeAreaShow" style="margin-bottom: 0px">
                  <div style="display: flex; margin-top: 20px">
                    <Input class="us" name="loginName" v-model="formValidate.code" style="margin-right: 10px" />
                    <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                      <img id="imgIdentifyingCode" :src="identifyingCode" style="height: 33px; width: 100px; cursor: pointer" :alt="$t('clickChange')" :title="$t('clickChange')" />
                    </div>
                  </div>
                </FormItem>
                <div class="subBnt">
                  <Button v-if="extend === 'Notspecial'" class="V5Btn" @click="handleSubmit('2', 'formValidate')">{{ $t('loginDunwuSystem') }}</Button>
                  <Button v-if="extend === 'special'" class="V5Btn" @click="handleSubmit('2', 'formValidate')">{{ $t('loginSystem') }}</Button>
                  <img src="../../../assets/images/new.png" alt="" />
                </div>
                <div v-if="extend === 'Notspecial'" class="V3Btn" style="margin-top: 20px; text-decoration: underline" @click="handleSubmit('1', 'formValidate')">{{ $t('loginDunwuSystemV2021') }}</div>
              </Form>
              <Row class="checkGround">
                <Col>
                  <Checkbox v-model="rememberPass">{{ $t('rememberPassword') }}</Checkbox>
                </Col>
                <Col>
                  <Checkbox v-model="autoLogin">{{ $t('automaticLogon') }}</Checkbox>
                </Col>
              </Row>
              <Row class="loginMethod" v-if="extend === 'Notspecial'">
                <Col class="methodIcon">
                  <a @click="handleWxqrCold('qq')">
                    <img src="../../../assets/images/qqpic.png" alt="" />
                  </a>
                </Col>
                <Col class="methodIcon">
                  <img src="../../../assets/images/wxpic.png" alt="" @click="handleWxqrCold('wx')" />
                </Col>
              </Row>
              <Row class="agreement" v-if="extend === 'Notspecial'">
                <span>{{ $t('loginIsAgree') }}</span>
                <a href="https://app.snd02.com/upload/docs/privacyProtection_pc_v5.html" target="_blank">{{ $t('privacyPolicy') }}</a>
                <span>{{ $t('and') }}</span>
                <a href="https://app.snd02.com/upload/docs/RegistrationAgreement_pc_v5.html" target="_blank">{{ $t('userAgreement') }}</a>
              </Row>
            </div>
            <div class="login" v-show="!LoginType">
              <div class="rdcode" @click="handleShowLoginType">
                <img src="../../../assets/images/computer.png" alt="" />
              </div>
              <div class="login-title">
                <div class="logon">{{ $t('login') }}</div>
              </div>
              <Row class="apprdcode">
                <db-loading :loading="loading"></db-loading>
                <img :src="`data:image/png;base64,${baseQrcode}`" alt="" />
              </Row>
              <Row class="tip">
                <span>{{ $t('loginAppTips') }}</span>
              </Row>
              <Row class="agreement">
                <span>{{ $t('loginIsAgree') }}</span>
                <a href="https://app.snd02.com/upload/docs/privacyProtection_pc_v5.html" target="_blank">{{ $t('privacyPolicy') }}</a>
                <span>{{ $t('and') }}</span>
                <a href="https://app.snd02.com/upload/docs/RegistrationAgreement_pc_v5.html" target="_blank">{{ $t('userAgreement') }}</a>
              </Row>
            </div>
          </div>
        </Col>
        <Col v-if="forgotPassWord === 'forgot'" span="14">
          <div class="page-account-container">
            <div class="forgotContent" v-show="LoginType">
              <div class="forgot-title">
                <div class="logon">{{ $t('forgotPassword') }}</div>
                <div class="forgotBack" @click="handleforgotPassWord('regular')">{{ $t('backLogin') }}</div>
              </div>
              <template v-if="newPasswordStatus">
                <Form ref="formValidate" :model="formValidateforgot" style="margin-top: 10px">
                  <div class="title">
                    <span>{{ $t('accountName') }}</span>
                    <FormItem prop="user"><Input v-model="formValidateforgot.user" /></FormItem>
                  </div>
                  <div class="title">
                    <span>{{ $t('phoneNumber') }}</span>
                    <FormItem prop="password"><Input v-model="formValidateforgot.password" /></FormItem>
                  </div>
                  <div class="title">
                    <span>{{ $t('imageCaptcha') }}</span>
                    <FormItem style="margin-bottom: 0px">
                      <div style="display: flex">
                        <Input class="us" name="loginName" v-model="formValidateforgot.picCode" style="margin-right: 10px" />
                        <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                          <img id="imgIdentifyingCode" :src="identifyingCode" style="height: 33px; width: 100px; cursor: pointer" :alt="$t('clickChange')" :title="$t('clickChange')" />
                        </div>
                      </div>
                    </FormItem>
                  </div>
                  <div class="title validate-code">
                    <span>{{ $t('messageCaptcha') }}</span>
                    <div class="form-item-box">
                      <FormItem prop="password" class="left"><Input v-model="formValidateforgot.code" /></FormItem>
                      <Button class="verification right" @click="handlecheckCode" :disabled="btnOptFlag">{{ codeBtnText }}</Button>
                    </div>
                    <!-- <Row :gutter="16">
                      <Col span="15">
                      </Col>
                      <Col span="9">
                      </Col>
                    </Row> -->
                  </div>
                  <Button class="next" type="primary" @click="handlecheckNamePhoneMatch">{{ $t('nextStep') }}</Button>
                </Form>
              </template>
              <template v-else>
                <Form ref="formValidate" :model="formValidateforgot" style="margin-top: 10px">
                  <div class="title">
                    <span>{{ $t('newPassword') }}</span>
                    <FormItem>
                      <Input type="password" password v-model="formValidateforgot.newpassWord" />
                    </FormItem>
                  </div>
                  <div class="title">
                    <span>{{ $t('confirmPassword') }}</span>
                    <FormItem>
                      <Input type="password" password v-model="formValidateforgot.confirmWord" />
                    </FormItem>
                  </div>
                </Form>
                <Button class="next" type="primary" @click="handleresetPwdByPhone">{{ $t('confirmModify') }}</Button>
              </template>
            </div>
          </div>
        </Col>
        <Col v-if="forgotPassWord === 'isBind'" span="14">
          <div class="page-account-container">
            <div class="forgotContent" v-show="LoginType">
              <div class="forgot-title">
                <div class="logon">{{ $t('bindAccount') }}</div>
                <div class="forgotBack" @click="handleforgotPassWord('regular')">{{ $t('backLogin') }}</div>
              </div>
              <div class="tips">
                <i class="icon-v5 icon-v5-weiwancheng"></i>
                <span>{{ $t('noAccountTip') }}</span>
              </div>
              <Form ref="formValidate" :model="formValidateBinding" :rules="ruleValidateBinding" style="margin-top: 10px">
                <div class="title">
                  <span>{{ $t('accountName') }}</span>
                  <FormItem prop="user"><Input :placeholder="$t('inputAccountTip')" v-model="formValidateBinding.user" /></FormItem>
                </div>
                <div class="title">
                  <span>{{ $t('accountPassword') }}</span>
                  <FormItem prop="password"><Input :placeholder="$t('inputPasswordTip')" type="password" password v-model="formValidateBinding.password" /></FormItem>
                </div>
                <FormItem v-if="checkCodeAreaShow" style="margin-top: 30px">
                  <div style="display: flex">
                    <Input class="us" name="loginName" v-model="formValidateBinding.code" style="margin-right: 10px" />
                    <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                      <img id="imgIdentifyingCode" :src="identifyingCode" style="height: 33px; width: 100px; cursor: pointer" :alt="$t('clickChange')" :title="$t('clickChange')" />
                    </div>
                  </div>
                </FormItem>
                <Button class="next" type="primary" @click="handleSubmitBind">{{ $t('login') }}</Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
      <!-- <Row class="proAppClass" v-if="extend === 'Notspecial'">
        <Col class="proImg"><img src="@/assets/images/proApp.png" alt="" /></Col>
      </Row> -->
      <Row class="proAppClass" v-if="extend === 'Notspecial'">
        <Col class="proImg"><img src="@/assets/images/proApp.png" alt="" /></Col>
        <div class="pro-app-text">{{ $t('downLoadAPP') }}</div>
      </Row>
      <i-copyright :loginObj="loginObj" />
    </div>
    <Modal v-model="wxqrcode" class-name="iframeContent" :title="$t('weChatLogin')" width="360">
      <div class="frambox">
        <iframe id="fram_box" sandbox="allow-scripts allow-top-navigation allow-same-origin" :src="weixinUrl" frameborder="0" width="100%" height="400px" scrolling="auto"></iframe>
      </div>
      <div style="text-align: center; margin-top: 10px">{{ $t('weChatLoginTip') }}</div>
      <div slot="footer"></div>
    </Modal>
    <checkTelModal :checkMobile="checkMobile" ref="checkTelModalRef"></checkTelModal>
  </div>
</template>
<script>
  import iCopyright from '@/components/copyright'
  import { mapActions, mapMutations, mapState } from 'vuex'
  import mixins from '../mixins'
  import { JSEncrypt } from 'jsencrypt'
  import store from '@/store/index'
  import { clearCache } from '@/untils/cache'
  import { getBpk, getindividual } from '@/api/account'
  import { getScanLoginQrCode, checkScanCodeLogin, getBindStatusByCode, bindSystemAccout, modifyBindThirdAccout, identify3, resetPwdByPhone, checkNamePhoneMatch } from '@/api/public'
  import checkTelModal from './checkTelModal.vue'
  export default {
    mixins: [mixins],
    components: { iCopyright, checkTelModal },
    data() {
      return {
        btnOptFlag: false,
        codeBtnText: this.$t('getVerificationCode'),
        outTime: 60, // 设置发送验证码倒计时时间
        timer: null,
        isBind: false,
        ctxPaths: this.$func.ctxPaths(),
        weixinUrl: '',
        qqUrl: '',
        loading: false,
        forgotPassWord: 'regular',
        autoLogin: false,
        rememberPass: false,
        LoginType: true,
        randomStr: new Date().getTime(),
        checkCodeAreaShow: false,
        loginObj: {},
        formValidate: { user: '', password: '', code: '' },
        formValidateforgot: { user: '', password: '', picCode: '', code: '', newpassWord: '', confirmWord: '' },
        formValidateBinding: { user: '', password: '', code: '' },
        edition: 'ESTATE_V5_SPECIAL',
        extend: 'special',
        ruleValidate: {
          user: [{ required: true, message: this.$t('accountEmptyTip'), trigger: 'blur' }],
          password: [{ required: true, message: this.$t('passwordEmptyTip'), trigger: 'blur' }],
        },
        ruleValidateBinding: {
          user: [{ required: true, message: this.$t('accountEmptyTip'), trigger: 'blur' }],
          password: [{ required: true, message: this.$t('passwordEmptyTip'), trigger: 'blur' }],
        },
        identifyingCode: `${'/portal/getCode.as?randomStr=' + this.randomStr}`,
        baseQrcode: '',
        uuId: '',
        wxqrcode: false,
        openId: '',
        newPasswordStatus: true,
        readonly: true,
        checkMobile: '',
      }
    },
    destroyed() {
      window.clearInterval(this.timer)
    },
    created() {
      if (this.$route.query && this.$route.query.lang) {
        this.setPageLang(this.$route.query.lang)
      } else if (!window.sessionStorage.getItem('localeSwitch')) {
        let lang = navigator.systemLanguage ? navigator.systemLanguage : navigator.language
        lang = lang && lang.substr(0, 2) === 'en' ? 'en-US' : 'zh-CN'
        this.setPageLang(lang)
      }
    },
    mounted() {
      setTimeout(() => {
        this.removeReadonly()
      }, 400)
      clearCache()
      this.initBpk()
      this.handleindividual()
      const autoLogins = window.localStorage.getItem('autoLogin') || ''
      if (autoLogins) {
        this.autoLogin = true
        const user = window.localStorage.getItem('autoLoginUserName')
        const password = window.localStorage.getItem('autoLoginPassword')
        this.formValidate.user = user
        this.formValidate.password = password
        this.handleSubmit('2', 'formValidate')
      } else {
        this.autoLogin = false
        const passWords = window.localStorage.getItem('password') || ''
        const userNames = window.localStorage.getItem('userName') || ''
        if (userNames && passWords) {
          this.rememberPass = true
          this.formValidate.user = userNames
          this.formValidate.password = passWords
        }
      }
      // let domain = this.$func.ctxPaths()
      // let domainStatus = domain.includes('sndtest') || domain.includes('localhost')
      // let dunsysStatus = domain.includes('dunsys')
      if (window.location.href.includes('loginPage')) {
        this.handlegetBindStatusByCode()
      } else if (window.location.href.includes('setting')) {
        this.handlemodifyBindThirdAccout()
      }

      if (window.localStorage.getItem('password') !== '' && window.localStorage.getItem('password') !== undefined && window.localStorage.getItem('password') !== null) {
        this.formValidate.password = '******'
      }
      if (window.localStorage.getItem('password') === '') {
        this.formValidate.password = ''
      }
      if (window.localStorage.getItem('userName') !== '') {
        this.formValidate.user = window.localStorage.getItem('userName')
      }
      if (window.localStorage.getItem('rememberPass') === 'true') {
        this.rememberPass = true
      }
      if (window.localStorage.getItem('rememberPass') === 'false') {
        this.rememberPass = false
        setTimeout(() => {
          this.formValidate.password = ''
        }, 500)
      }

      // 锁，目的是把浏览器用户中不是64位的缓存的加以修改为64
      if (!this.isBase64(window.localStorage.getItem('password'))) {
        window.localStorage.setItem('password', '')
        this.formValidate.password = ''
      }
    },
    methods: {
      ...mapActions('admin/account', ['login']),
      ...mapActions('admin/i18n', ['setLocale']),
      ...mapMutations('loginInfo', ['setPwdWeak', 'setPwdExpire', 'setLoginPassword']),
      removeReadonly() {
        this.readonly = false
      },
      setPageLang(lang) {
        this.setLocale({ locale: lang, vm: this })
        store.commit('locale', lang)
        this.$func.setCookie('lang', lang)
      },
      isBase64(str) {
        if (str === '' || str.trim() === '') {
          return false
        }
        try {
          return window.btoa(window.atob(str)) === str
        } catch (err) {
          return false
        }
      },
      handleresetPwdByPhone() {
        const encry = new JSEncrypt()
        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          if (this.formValidateforgot.confirmWord === this.formValidateforgot.newpassWord) {
            let params = {
              loginName: this.formValidateforgot.user,
              phone: this.formValidateforgot.password,
              newPwd: encry.encrypt(this.formValidateforgot.confirmWord),
            }
            this.handleResetPwd(params)
          } else {
            this.$Message.error({ content: this.$t('passwordNoSame') })
          }
        })
      },
      handleResetPwd(params) {
        resetPwdByPhone(params).then(res => {
          if (res.success) {
            this.forgotPassWord = 'regular'
            this.$Message.success({ content: res.message })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handlecheckNamePhoneMatch() {
        if (this.formValidateforgot.user === '') {
          this.$Message.error(this.$t('inputAccountTip'))
        } else if (this.formValidateforgot.password === '') {
          this.$Message.error(this.$t('inputPhoneTip'))
        } else if (this.formValidateforgot.code === '') {
          this.$Message.error(this.$t('inputVerificationCodeTip'))
        } else {
          let params = {
            loginName: this.formValidateforgot.user,
            phone: this.formValidateforgot.password,
            code: this.formValidateforgot.code,
          }
          checkNamePhoneMatch(params).then(res => {
            if (res.success) {
              this.newPasswordStatus = false
            } else {
              this.getIdentifyingCode(true)
              this.$Message.error({ content: res.message })
            }
          })
        }
      },

      handlecheckCode() {
        let params = {
          phone: this.formValidateforgot.password,
          checkCode: this.formValidateforgot.picCode,
        }
        identify3(params).then(res => {
          if (res.success) {
            this.btnOptFlag = true // 禁用发送验证码按钮
            if (!this.timer) {
              this.timer = setInterval(() => {
                this.codeBtnText = this.$t('resendTips', { duration: this.outTime })
                this.outTime = this.outTime - 1
                if (this.outTime < 0) {
                  // 倒计时结束，重置时间器clearInterval(this.timer)
                  clearInterval(this.timer)
                  this.codeBtnText = this.$t('getVerificationCode')
                  this.outTime = 60
                  this.timer = false
                  this.btnOptFlag = false
                }
              }, 1000)
              // 每秒执行一次
            }
            this.$Message.success({ content: res.message })
          } else {
            this.getIdentifyingCode(true)
            this.$Message.error({ content: res.message })
          }
        })
      },
      handlemodifyBindThirdAccout() {
        let url = window.location.href // 获取地址栏路径
        let temp1 = url.split('?') // 对url地址进行分割
        let pram = temp1[1]
        let keyValue = pram.split('&')
        let obj = {}
        for (let i = 0; i < keyValue.length; i++) {
          // 循环分割挂过后的地址
          let item = keyValue[i].split('=')
          let key = item[0]
          let value = item[1]
          obj[key] = value
        }
        if (window.location.href.includes('dsys')) {
          let newState = ''
          if (obj.state.includes('settingQq')) {
            newState = 'settingQq'
          } else {
            newState = 'settingWx'
          }
          window.location.href = `https://v5.dunsys.com/login?code=${obj.code}&state=${newState}`
        } else {
          let params = {
            type: obj.state.includes('settingQq') ? 3 : 2,
            code: obj.code,
            edition: 'ESTATE_V5',
          }
          let domain = this.$func.ctxPaths()
          let domainStatus = domain.includes('sndtest') || domain.includes('localhost')
          let dunsysStatus = domain.includes('dunsys')
          if (obj.state.includes('settingQq')) {
            params.redirectUri = domainStatus ? 'https://v5.sndtest.com/login' : dunsysStatus ? 'https://v5.snd02.com/login' : `${domain}/login`
          }
          modifyBindThirdAccout(params).then(res => {
            if (!res.success) {
              this.$Message.error({ content: res.message })
            }
            this.$router.push({ path: '/settingConfig' })
          })
        }
      },
      handlegetBindStatusByCode() {
        let url = window.location.href // 获取地址栏路径
        let temp1 = url.split('?') // 对url地址进行分割
        let pram = temp1[1]
        let keyValue = pram.split('&')
        let obj = {}
        for (let i = 0; i < keyValue.length; i++) {
          // 循环分割挂过后的地址
          let item = keyValue[i].split('=')
          let key = item[0]
          let value = item[1]
          obj[key] = value
        }
        store.commit('BindStatus', obj.state.includes('qqlogin') ? 3 : 2)
        if (window.location.href.includes('dsys')) {
          let newState = ''
          if (obj.state.includes('wxlogin')) {
            newState = 'wxloginPage'
          } else {
            newState = 'qqloginPage'
          }
          window.location.href = `https://v5.dunsys.com/login?code=${obj.code}&state=${newState}`
        } else {
          let params = {
            type: obj.state.includes('qqlogin') ? 3 : 2,
            code: obj.code,
            edition: 'ESTATE_V5',
          }
          let domain = this.$func.ctxPaths()
          let domainStatus = domain.includes('sndtest') || domain.includes('localhost')
          let dunsysStatus = domain.includes('dunsys')

          if (this.$store.state.BindStatus === 3) {
            params.redirectUri = domainStatus ? 'https://v5.sndtest.com/login' : dunsysStatus ? 'https://v5.snd02.com/login' : `${domain}/login`
          }
          getBindStatusByCode(params).then(res => {
            if (res.success) {
              this.isBind = res.data.isBind
              if (this.isBind) {
                this.$router.replace({ path: '/loading' })
              } else {
                this.forgotPassWord = res.data.isBind ? '' : 'isBind'
                this.openId = res.data.openId
              }
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        }
      },
      handleSubmitBind() {
        const encry = new JSEncrypt()
        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          let params = {
            type: this.$store.state.BindStatus,
            openId: this.openId,
            edition: 'ESTATE_V5',
            loginName: this.formValidateBinding.user,
            password: encry.encrypt(this.formValidateBinding.password),
            checkCode: this.formValidateBinding.code,
          }
          this.handleBindingLogin(params)
        })
      },
      handleBindingLogin(params) {
        bindSystemAccout(params).then(res => {
          if (res.success) {
            this.$router.replace({ path: '/loading' })
          } else {
            this.$Message.error(res.message)
            this.checkCodeAreaShow = true // 显示验证码
            this.getIdentifyingCode(true) // 获取验证码图片地址
            this.handleGetCaptcha()
          }
        })
      },

      handleWxqrCold(type) {
        let domain = this.$func.ctxPaths()
        // 判断是否为测试和本地环境
        let domainStatus = domain.includes('sndtest') || domain.includes('localhost')
        // 判断是否为另一个生产环境域名
        let dunsysStatus = domain.includes('dunsys')
        if (type === 'wx') {
          // 微信登录需要显示二维码弹框
          this.wxqrcode = true
          // 此处域名要对应上后端申请的域名，如需添加新的域名需要后端配合申请(坤哥)
          const wxTargetUrl = domainStatus ? 'https://v5.sndtest.com/login' : dunsysStatus ? 'https://v5.snd02.com/login' : `${domain}/login`
          // 域名对应的appid
          const wxAppId = domainStatus ? 'wx9526dc5865cba6d1' : 'wx734ffddc688b6fed'
          const dunsys = domain.includes('dunsys') ? 'dsys' : ''
          // 微信登录生成的二维码信息，扫码调起微信
          this.weixinUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${wxAppId}&redirect_uri=${wxTargetUrl}&response_type=code&scope=snsapi_login&state=wxloginPage${dunsys}#wechat_redirect`
        } else {
          // qq的做法类似微信，不过更简单，点击跳转到qqUrl这个连接进行输入QQ账号密码，然后回调到即可
          const qqBaseUrl = domainStatus ? 'https://v5.sndtest.com/login' : dunsysStatus ? 'https://v5.snd02.com/login' : `${domain}/login`
          const qqAppId = domainStatus ? '102047597' : '102050828'
          const dunsys = domain.includes('dunsys') ? 'dsys' : ''
          this.qqUrl = `https://graph.qq.com/oauth2.0/authorize?client_id=${qqAppId}&response_type=code&redirect_uri=${qqBaseUrl}&state=qqloginPage${dunsys}`
          window.location.href = this.qqUrl
        }
      },
      handleforgotPassWord(type) {
        this.forgotPassWord = type
        this.newPasswordStatus = true
        this.formValidateforgot.user = ''
        this.formValidateforgot.password = ''
        this.formValidateforgot.picCode = ''
        this.formValidateforgot.code = ''
        setTimeout(() => {
          if (type === 'forgot') {
            this.getIdentifyingCode(true)
          }
        }, 500)
      },
      handleGetCaptcha() {
        this.randomStr = new Date().getTime()
      },
      handlegetScanLoginQrCode() {
        getScanLoginQrCode({}).then(res => {
          if (res.success) {
            this.baseQrcode = res.data.qrCode
            this.uuId = res.data.uuid
            this.timer = window.setInterval(() => {
              setTimeout(this.handlecheckScanCodeLogin(), 0)
              // 每三分钟执行 6000*10 * 3
            }, 2000)
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handlecheckScanCodeLogin() {
        let params = { uuid: this.uuId }
        checkScanCodeLogin(params).then(res => {
          if (res.data.status === '2') {
            this.loading = true
            setTimeout(() => {
              window.clearInterval(this.timer)
              this.$router.replace({ path: '/loading' })
              this.loading = false
            }, 3000)
          }
        })
      },
      // 登录页面个性化
      handleindividual() {
        let params = { edition: 'ESTATE_V5_SPECIAL' }
        let server = window.location.host.toLowerCase()
        if (server.indexOf('snd01.com') !== -1 || server.indexOf('snd02.com') !== -1 || server.indexOf('dunsys.com') !== -1 || server.indexOf('sndtest.com') !== -1) {
          let splitItems = server.split('.')
          if (splitItems.length === 3 && splitItems[0].length >= 6) {
            params.IDENTITY = splitItems[0]
            params.edition = 'ESTATE_V5_SPECIAL'
            this.edition = 'ESTATE_V5_SPECIAL'
            this.extend = 'special'
          } else {
            params.edition = 'ESTATE_V5'
            this.edition = 'ESTATE_V5'
            this.extend = 'Notspecial'
          }
        }
        getindividual(params).then(r => {
          if (r.success) {
            this.loginObj = r.data
            store.commit('individual', r.data)
          } else {
            this.$Message.error({ content: r.message })
          }
        })
      },
      handleShowLoginType() {
        this.LoginType = !this.LoginType
        if (!this.LoginType) {
          this.handlegetScanLoginQrCode()
        } else {
          window.clearInterval(this.timer)
        }
      },
      initBpk() {
        getBpk().then(r => {
          this.bpk = r.data
        })
      },
      handleSubmit(val, name) {
        // --------------------------------此上为自动登录
        if (!this.$refs[name]) {
          getBpk().then(r => {
            const encry = new JSEncrypt()
            this.bpk = r.data
            encry.setPublicKey(this.bpk.pubkey) // 设置公钥
            window.localStorage.setItem('userName', this.formValidate.user)
            window.localStorage.setItem('rememberPass', this.rememberPass)
            let newpassWord = ''
            if (this.rememberPass) {
              if (window.localStorage.getItem('password')) {
                newpassWord = window.localStorage.getItem('password')
              } else {
                newpassWord = encry.encrypt(this.formValidate.password)
                window.localStorage.setItem('password', newpassWord)
              }
            } else {
              window.localStorage.setItem('rememberPass', false)
            }
            if (this.formValidate.password === '******') {
              newpassWord = window.localStorage.getItem('password')
            } else {
              newpassWord = encry.encrypt(this.formValidate.password)
              window.localStorage.setItem('password', newpassWord)
            }
            if (window.localStorage.getItem('password')) {
              newpassWord = window.localStorage.getItem('password')
            } else {
              newpassWord = encry.encrypt(this.formValidate.password)
            }
            if (this.autoLogin) {
              window.localStorage.setItem('autoLogin', 'autoLogin')
              window.localStorage.setItem('autoLoginPassword', newpassWord)
              window.localStorage.setItem('autoLoginUserName', this.formValidate.user)
            } else {
              window.localStorage.setItem('autoLogin', '')
              window.localStorage.setItem('autoLoginPassword', '')
              window.localStorage.setItem('autoLoginUserName', '')
            }
            if (val === '2') {
              this.login({
                edition: this.edition,
                loginName: this.formValidate.user,
                password: newpassWord, // 对数据进行加密
                checkCode: this.formValidate.code,
              }).then(r => {
                if (r.code === '0') {
                  this.$router.replace({ path: '/loading' })
                } else {
                  this.$Message.error(r.message)
                  this.checkCodeAreaShow = true // 显示验证码
                  this.getIdentifyingCode(true) // 获取验证码图片地址
                  this.handleGetCaptcha()
                }
                // 重定向对象不存在则返回顶层路径
              })
            } else {
              this.login({
                edition: 'ESTATE_V3',
                loginName: this.formValidate.user,
                password: newpassWord,
                checkCode: this.formValidate.code,
                authLoginFlag: 'V3',
              }).then(r => {
                if (r.code === '0') {
                  if (window.location.host === 'v5.sndtest.com' || window.location.host.indexOf('localhost') > -1) {
                    window.location.href = 'https://v3.sndtest.com/portal/valid/token.as?accessToken=' + r.data.accessToken
                  } else {
                    window.location.href = 'https://v3.snd02.com/portal/valid/token.as?accessToken=' + r.data.accessToken
                  }
                } else {
                  this.checkCodeAreaShow = true
                  this.getIdentifyingCode(true)
                  this.handleGetCaptcha()
                  this.$Message.error(r.message)
                }
              })
            }
          })

          // ----------------------------------------以上为自动登录代码
        } else {
          this.$refs[name].validate(valid => {
            if (valid) {
              getBpk().then(r => {
                const encry = new JSEncrypt()
                this.bpk = r.data
                encry.setPublicKey(this.bpk.pubkey) // 设置公钥
                window.localStorage.setItem('userName', this.formValidate.user)
                window.localStorage.setItem('rememberPass', this.rememberPass)

                let newpassWord = ''
                if (this.rememberPass) {
                  if (window.localStorage.getItem('password')) {
                    newpassWord = window.localStorage.getItem('password')
                  } else {
                    newpassWord = encry.encrypt(this.formValidate.password)
                    window.localStorage.setItem('password', newpassWord)
                  }
                } else {
                  window.localStorage.setItem('rememberPass', false)
                }
                if (this.formValidate.password === '******') {
                  newpassWord = window.localStorage.getItem('password')
                } else {
                  newpassWord = encry.encrypt(this.formValidate.password)
                  window.localStorage.setItem('password', newpassWord)
                }
                if (window.localStorage.getItem('password')) {
                  newpassWord = window.localStorage.getItem('password')
                } else {
                  newpassWord = encry.encrypt(this.formValidate.password)
                }

                if (this.autoLogin) {
                  window.localStorage.setItem('autoLogin', 'autoLogin')
                  window.localStorage.setItem('autoLoginPassword', newpassWord)
                  window.localStorage.setItem('autoLoginUserName', this.formValidate.user)
                } else {
                  window.localStorage.setItem('autoLogin', '')
                  window.localStorage.setItem('autoLoginPassword', '')
                  window.localStorage.setItem('autoLoginUserName', '')
                }

                if (val === '2') {
                  this.login({
                    edition: this.edition,
                    loginName: this.formValidate.user,
                    password: newpassWord, // 对数据进行加密
                    checkCode: this.formValidate.code,
                  }).then(r => {
                    // console.log('🚀 ~ handleSubmit ~ !this.$refs[name]:', r)
                    // debugger
                    if (r.code === '0') {
                      this.setLoginPassword(this.formValidate.password)
                      this.setPwdWeak(r.data.pwdWeak)
                      this.setPwdExpire(r.data.pwdExpire)
                      if (r.data.halfLogin && r.data.halfLoginFlag === 'SMS_CODE_VERIFY') {
                        this.checkMobile = r.data.mobile
                        this.$refs.checkTelModalRef.openModal()
                      } else {
                        this.$router.replace({ path: '/loading' })
                      }
                    } else {
                      this.$Message.error(r.message)
                      this.checkCodeAreaShow = true // 显示验证码
                      this.getIdentifyingCode(true) // 获取验证码图片地址
                      this.handleGetCaptcha()
                    }
                    // 重定向对象不存在则返回顶层路径
                  })
                } else {
                  this.login({
                    edition: 'ESTATE_V3',
                    loginName: this.formValidate.user,
                    password: newpassWord,
                    checkCode: this.formValidate.code,
                    authLoginFlag: 'V3',
                  }).then(r => {
                    if (r.code === '0') {
                      if (window.location.host === 'v5.sndtest.com' || window.location.host.indexOf('localhost') > -1) {
                        window.location.href = 'https://v3.sndtest.com/portal/valid/token.as?accessToken=' + r.data.accessToken
                      } else {
                        window.location.href = 'https://v3.snd02.com/portal/valid/token.as?accessToken=' + r.data.accessToken
                      }
                    } else {
                      this.checkCodeAreaShow = true
                      this.getIdentifyingCode(true)
                      this.handleGetCaptcha()
                      this.$Message.error(r.message)
                    }
                  })
                }
              })
            } else {
              if (!this.formValidate.user) {
                this.$Message.error(this.$t('inputAccountTip'))
              }
              if (!this.formValidate.password) {
                this.$Message.error(this.$t('inputPasswordTip'))
              }
            }
          })
        }
      },
      getIdentifyingCode(bRefresh) {
        if (bRefresh) {
          this.identifyingCode = `${'/portal/getCode.as?randomStr=' + this.randomStr}`
        }
      },
      processUrl(url) {
        if (url === '/static/img/v5-special-bg.png' || url === '/static/img/loginBp.png') {
          if (this.locale === 'zh-CN') {
            return url
          }
          const strArr = url.split('.')
          return `${strArr[0]}EN.png`
        }
        return url
      },
    },
    computed: {
      ...mapState('admin/i18n', ['locale']),
      backgroundStyle() {
        if (this.loginObj.loginPageBgImg && Array.isArray(this.loginObj.loginPageBgImg) && this.loginObj.loginPageBgImg.length) {
          const loginPageBgImg = this.loginObj.loginPageBgImg
          const styleArr = loginPageBgImg.map((v, index) => {
            const isForeground = index === 1
            const defaultColor = isForeground ? 'transparent' : '#0a1015'
            const retunStyle = v.url === ''
            const styleBack = { background: v.color || defaultColor }
            const styleBackImg = {
              backgroundImage: `url(${this.processUrl(v.url) || ''}?${Date.now()})`,
              backgroundRepeat: v.repeat || 'no-repeat',
              backgroundSize: v.size || '',
              backgroundPosition: `${v.xpos || '40%'} ${v.ypos || 'center'}`,
            }
            const styleItem = retunStyle ? styleBack : styleBackImg
            console.log(styleBackImg.backgroundImage)
            return {
              styleItem,
            }
          })
          return styleArr
        } else {
          return [{ styleItem: {} }, { styleItem: {} }]
        }
      },
      imgSyle() {
        if (this.loginObj.loginPageLogo) {
          const loginPageLogo = this.loginObj.loginPageLogo
          return { height: loginPageLogo.height, width: loginPageLogo.width }
        } else {
          return { height: 'auto', width: '80px' }
        }
      },
      spanStyle() {
        if (this.loginObj.loginPageTitle) {
          const loginPageTitle = this.loginObj.loginPageTitle
          return { color: loginPageTitle.color, fontSize: loginPageTitle.size }
        } else {
          return { color: '#fff', fontSize: '20px' }
        }
      },
      aHerfStyle() {
        if (this.loginObj.loginPageExternalLink) {
          const loginPageExternalLink = this.loginObj.loginPageExternalLink
          return { color: loginPageExternalLink.color, fontSize: loginPageExternalLink.size }
        } else {
          return { color: '#2878ff', fontSize: '14px' }
        }
      },
    },
    watch: {
      identifyingCode: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.handleGetCaptcha()
          }
        },
      },
    },
  }
</script>
<style lang="less">
  .iframeContent {
    .ivu-modal-footer {
      border-color: transparent !important;
    }
    #fram_box {
      position: relative;
      top: -53px;
    }
    .frambox {
      height: 284px;
      overflow: hidden;
      margin: 0 auto;
    }
  }
  .page-account-text {
    position: fixed;
    left: 24%;
    top: 71%;
    font-size: 30px;
    color: rgb(50, 225, 231);
    z-index: 2;
    text-align: center;
    width: 20%;
    white-space: nowrap;
  }
  .letter-spacing-9 {
    letter-spacing: 9px;
  }
  .page-account-container {
    .forgotContent {
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
      padding: 20px;
      text-align: left;
      position: relative;
      .tips {
        color: #02a7f0;
        background: rgba(2, 167, 240, 0.1);
        padding: 6px;
        display: flex;
        align-items: center;
        margin: 20px 0;
        i {
          margin: 0 5px;
        }
      }
      .next {
        width: 100%;
        margin-top: 20px;
        background: #02a7f0;
      }
      .ivu-form-item {
        // margin-bottom: 0;
        input {
          border-color: #333333 !important;
        }
      }
      .title {
        color: #333333;
        // margin-top: 24px;

        span {
          display: inline-block;
          margin-bottom: 4px;
        }
        .verification {
          border: 1px solid #02a7f0;
          color: #02a7f0;
          background: rgba(2, 167, 240, 0.1);
          line-height: 32px;
        }
      }

      .forgot-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .logon {
          font-size: 22px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #333333;
        }
        .forgotBack {
          font-size: 14px;
          color: #02a7f0;
          cursor: pointer;
        }
      }
    }
    .login {
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
      padding: 0 24px 24px 24px;
      text-align: left;
      position: relative;
      .rdcode {
        position: absolute;
        top: 12px;
        right: 16px;

        width: 60px;
        cursor: pointer;
        img {
          width: 100%;
        }
      }

      .login-title {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        .logon {
          font-size: 22px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #333333;
        }
      }
    }
    .forgot {
      font-size: 14px;
      color: #02a7f0;
      cursor: pointer;
      text-align: right;
      height: 32px;
      width: 100%;
      line-height: 32px;
    }
    .validate-code {
      .form-item-box {
        display: flex;
        .left {
          flex: 1;
          margin-right: 10px;
        }
        .right {
          flex: none;
        }
      }
    }
    .checkGround {
      margin-top: 20px;
      color: #333333;
      justify-content: space-between;
    }
    .loginMethod {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      .methodIcon {
        width: 30px;
        margin: 0 16px;
        cursor: pointer;
        img {
          width: 100%;
        }
      }
    }
    .agreement {
      color: #999;
      display: flex;
      justify-content: center;
      margin-top: 20px;
      span {
        margin: 0 5px;
      }
      a {
        text-decoration: none;
        border-bottom: 1px solid transparent;
        color: #999;
      }
      a:hover {
        border-bottom: 1px solid #999;
      }
    }
    .tip {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      span {
        width: 210px;
        color: #333333;
        text-align: center;
      }
    }
    .apprdcode {
      // width: 140px;
      justify-content: center;
      img {
        width: 140px;
      }
    }
  }

  .us {
    margin-bottom: 24px;
  }
  .vertical {
    height: 20px;
    width: 1px;
    background: #fff;
    margin-left: 10px;
  }
  .setText {
    font-size: 14px;
    color: #fff;
    background: rgba(118, 165, 241, 0.2);
    border: 1px solid #fff;
    padding: 3px 10px;
    border-radius: 20px;
    margin-left: 10px;
    height: 24px;
    white-space: nowrap;
    line-height: 17px;
  }
  .V5Btn {
    width: 100%;
    color: #fff;
    background-color: #2d8cf0;
    border-color: #2d8cf0;
    height: 40px;
    padding: 0 15px;
    font-size: 16px;
    border-radius: 4px;
    &:hover {
      color: #fff;
      background: rgba(45, 140, 240, 0.9);
    }
  }
  .V3Btn {
    width: 100%;
    color: #2d8cf0;
    height: 40px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }
  .subBnt {
    position: relative;
    // margin-top: 56px;
    img {
      position: absolute;
      right: 0;
      top: 0;
    }
    .ivu-btn-default {
      background-color: #2d8cf0;
      border-color: #2d8cf0;
    }
  }
  .proAppClass {
    width: 100%;
    justify-content: center;
    margin-bottom: 20px;
    .proImg {
      width: 110px;
      img {
        width: 100%;
      }
    }
    .pro-app-text {
      width: 100%;
      flex: none;
      color: #87f0f8;
      text-align: center;
      margin-top: 4px;
    }
  }
</style>
