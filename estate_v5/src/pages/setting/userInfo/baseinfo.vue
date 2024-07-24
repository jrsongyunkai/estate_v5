<template>
  <div>
    <h2>{{ $t('basicInformation') }}</h2>
    <Form ref="datas" :model="datas" :rules="rules" label-position="top" class="ivu-mt">
      <Row type="flex">
        <Col v-bind="grid1">
          <FormItem :label="$t('avatar')" style="padding-left: 20px" prop="avatar">
            <el-image style="width: 100px; height: 100px" :src="url" :preview-src-list="[url]"></el-image>
            <Upload ref="upload" :action="uploadUrl" :name="imgData.name" :data="imgData" :on-success="handleSuccess" :before-upload="beforeUpload" @mouseover.native="flag = true" :show-upload-list="false" :format="['jpg', 'jpeg', 'png']" :max-size="2048" multiple>
              <Button class="Button">{{ $t('uploadImg') }}</Button>
            </Upload>
          </FormItem>
        </Col>
        <Col v-bind="grid2">
          <FormItem :label="$t('loginSysAccount')" prop="accont">
            <Input disabled v-model="datas.accont" />
          </FormItem>
          <FormItem :label="$t('loginSysPwd')" prop="password">
            <div style="display: flex">
              <Input type="password" style="width: 50%" v-model="ciphertext" />
              <Button type="text" style="margin-left: 20px; color: #1890ff" @click="updatePassword">{{ $t('modify') }}</Button>
            </div>
          </FormItem>
          <FormItem :label="$t('subPassword')" prop="seconedpassword">
            <div style="position: relative">
              <div style="position: absolute; top: -32px; left: 50px">
                <TooltipVue :tooltipText="secPassText"></TooltipVue>
              </div>
            </div>
            <div style="display: flex">
              <Input :type="isPassword" :class="isCheckSecond ? 'warn-inputs' : ''" style="width: 50%" disabled v-model="secondWords" />
              <Button v-if="isSettings" type="text" style="margin-left: 20px; color: #1890ff" @click="openSecondPassword">{{ $t('setting') }}</Button>
              <Button v-if="!isSettings" type="text" style="margin-left: 20px; color: #1890ff" @click="openFindPassword">{{ $t('find') }}</Button>
              <Button v-if="!isSettings" type="text" style="margin-left: 20px; color: #1890ff" @click="openModifySecondPassword">{{ $t('modify') }}</Button>
              <Button v-if="!isSettings" type="text" style="margin-left: 20px; color: #f24e4c" @click="stopModifySecondPassword">{{ $t('disabled') }}</Button>
            </div>
          </FormItem>
          <FormItem :label="$t('realName')" prop="realName">
            <Input v-model="datas.realName" :placeholder="$t('pleaseInputName')" />
          </FormItem>
          <FormItem :label="$t('phoneNum')" type="number" prop="phoneNumber">
            <Row style="justify-content: space-between">
              <Input disabled v-model="datas.phoneNumber" maxlength="11" :placeholder="$t('pleaseInputPhoneNum')" style="width: 89%" />
              <Button class="b-blue" style="width: 68px" @click="handlePhonebinding">{{ $t('changeBind') }}</Button>
            </Row>
          </FormItem>
          <FormItem :label="$t('fixedTelephone')" prop="fixPhone">
            <div style="display: flex">
              <Input v-model="datas.fixPhone" maxlength="4" style="width: 20%" />
              <Input v-model="datas.lastPhone" maxlength="8" style="width: 60%; margin-left: 20px" />
            </div>
          </FormItem>
          <FormItem :label="$t('emailAddr')" prop="mail">
            <Input v-model="datas.mail" />
          </FormItem>
          <template v-if="this.$store.state.extend === 'Notspecial'">
            <FormItem :label="$t('bindQQ')">
              <Row>
                <Input v-model="datas.qqnum" :class="!datas.isBindQQ ? 'thirdParty' : ''" style="width: 78%" />
                <Button class="b-blue ml-10" style="width: 68px" @click="handleThirdparty('3')" v-if="!datas.isBindQQ">{{ $t('bind') }}</Button>
                <Button class="b-blue ml-10" style="width: 68px" @click="handleThirdparty('3')" v-if="datas.isBindQQ">{{ $t('changeBind') }}</Button>
                <Button class="b-blue ml-10" style="width: 68px" @click="handleUnbindingShow('3')" v-if="datas.isBindQQ">{{ $t('unbind') }}</Button>
              </Row>
            </FormItem>
            <FormItem :label="$t('bindWechat')">
              <Row>
                <Input v-model="datas.wxnum" :class="!datas.isBindQQ ? 'thirdParty' : ''" style="width: 78%" />
                <Button class="b-blue ml-10" style="width: 68px" @click="handleThirdparty('2')" v-if="!datas.isBindWx">{{ $t('bind') }}</Button>
                <Button class="b-blue ml-10" style="width: 68px" @click="handleThirdparty('2')" v-if="datas.isBindWx">{{ $t('changeBind') }}</Button>
                <Button class="b-blue ml-10" style="width: 68px" @click="handleUnbindingShow('2')" v-if="datas.isBindWx">{{ $t('unbind') }}</Button>
              </Row>
            </FormItem>
          </template>
          <FormItem>
            <Button type="primary" @click="handleSubmit('datas')">{{ $t('save') }}</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Modal v-model="phoneBinding" :title="$t('changeBindNum')" class-name="settingBind">
      <template v-if="phoneStatus">
        <Form :label-width="85">
          <div style="position: relative">
            <FormItem :label="$t('originalNumber')">
              <Input v-model="datas.phoneNumber" disabled></Input>
            </FormItem>
            <span style="position: absolute; right: 0; top: 40px; color: #078ecc; cursor: pointer" @click="handleNewPhone">{{ $t('phoneNumberIsNoUse') }}</span>
          </div>
          <FormItem :label="$t('imageCaptcha')" style="margin-top: 40px">
            <div style="display: flex">
              <Input class="us" name="loginName" v-model="datas.piccode" style="margin-right: 10px" :placeholder="$t('inputVerificationCodeTip')" />
              <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                <img id="imgIdentifyingCode" :src="identifyingCode" style="height: 33px; width: 100px; cursor: pointer" :alt="$t('clickChange')" :title="$t('clickChange')" />
              </div>
            </div>
          </FormItem>
          <FormItem :label="$t('verificationCode')">
            <Row style="width: 100%">
              <Input v-model="datas.code" :placeholder="$t('inputVerificationCodeTip')" style="width: 66%"></Input>
              <Button class="ml-10 b-blue" @click="sendCode('1')" style="width: 31%">{{ codeBtnText }}</Button>
            </Row>
          </FormItem>
        </Form>
      </template>
      <template v-else>
        <Form :label-width="85">
          <div style="position: relative">
            <FormItem :label="$t('newNum')">
              <Input v-model="datas.newphoneNumber" :placeholder="$t('pleaseInputBindPhoneNum')"></Input>
            </FormItem>
            <span style="position: absolute; right: 0; top: 40px; color: #078ecc; cursor: pointer" @click="handleNewPhone">{{ $t('phoneNumberIsNoUse') }}</span>
          </div>
          <FormItem :label="$t('imageCaptcha')" style="margin-top: 40px">
            <div style="display: flex">
              <Input class="us" name="loginName" v-model="datas.piccode2" style="margin-right: 10px" :placeholder="$t('inputVerificationCodeTip')" />
              <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                <img id="imgIdentifyingCode" :src="identifyingCode" style="height: 33px; width: 100px; cursor: pointer" :alt="$t('clickChange')" :title="$t('clickChange')" />
              </div>
            </div>
          </FormItem>
          <FormItem :label="$t('verificationCode')" style="margin-top: 40px">
            <Row style="width: 100%">
              <Input v-model="datas.newcode" :placeholder="$t('inputVerificationCodeTip')" style="width: 66%"></Input>
              <Button class="ml-10 b-blue" @click="sendCode('2')" style="width: 31%" :disabled="btnOptFlag2">{{ codeBtnText2 }}</Button>
            </Row>
          </FormItem>
        </Form>
      </template>
      <div slot="footer">
        <Button class="b-blue" @click="handlePhoneStatus">{{ phoneStatus ? $t('nextStep') : $t('confirm2') }}</Button>
        <Button class="ml-10" @click="handlecancle">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal v-model="newPhoneStatus" :title="$t('changeBindNum')" class-name="settingBind">
      <template v-if="phoneStatusNew">
        <Form :label-width="85">
          <div style="position: relative">
            <FormItem :label="$t('loginPwd')">
              <Input v-model="datas.checkpassword" type="password" :placeholder="$t('pleaseInputLoginPwd')"></Input>
            </FormItem>
          </div>
        </Form>
      </template>
      <template v-else>
        <Form :label-width="85">
          <div style="position: relative">
            <FormItem :label="$t('newNum')">
              <Input v-model="datas.newcheckphone" :placeholder="$t('pleaseInputBindPhoneNum')"></Input>
            </FormItem>
          </div>
          <FormItem :label="$t('imageCaptcha')" style="margin-top: 40px">
            <div style="display: flex">
              <Input class="us" name="loginName" v-model="datas.checkPasswordPiccode" style="margin-right: 10px" :placeholder="$t('inputVerificationCodeTip')" />
              <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                <img id="imgIdentifyingCode" :src="identifyingCode" style="height: 33px; width: 100px; cursor: pointer" :alt="$t('clickChange')" :title="$t('clickChange')" />
              </div>
            </div>
          </FormItem>
          <FormItem :label="$t('verificationCode')" style="margin-top: 40px">
            <Row style="width: 100%">
              <Input v-model="datas.checkPasswordcode" :placeholder="$t('inputVerificationCodeTip')" style="width: 66%"></Input>
              <Button class="ml-10 b-blue" @click="sendCode('3')" style="width: 31%" :disabled="btnOptFlag3">{{ codeBtnText3 }}</Button>
            </Row>
          </FormItem>
        </Form>
      </template>
      <div slot="footer">
        <Button class="b-blue" @click="handlePasswordVerifiers">{{ phoneStatusNew ? $t('nextStep') : $t('confirm2') }}</Button>
        <Button class="ml-10" @click="handlecancle">{{ $t('cancel') }}</Button>
      </div>
    </Modal>

    <Modal v-model="unbinding" :title="$t('unbindQQWechat')" class-name="settingBind">
      <Form :label-width="80">
        <FormItem :label="$t('loginPwd')">
          <Input v-model="datas.currPwd" type="password" :placeholder="$t('pleaseInputYourLoginPwdValidateIdentity')" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="b-blue" @click="handleUnbinding">{{ $t('confirm2') }}</Button>
        <Button class="ml-10" @click="handlecancle">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal v-model="wxCodeShow" class-name="iframeContent" :title="$t('wechatBind')" width="360">
      <div class="frambox">
        <iframe id="fram_box" sandbox="allow-scripts allow-top-navigation allow-same-origin" :src="weixinUrl" frameborder="0" width="100%" height="400px" scrolling="auto"></iframe>
      </div>
      <div style="text-align: center; margin-top: 10px">{{ $t('wechatBindDunSys') }}</div>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="passwordDisabled" :title="$t('modifyPwd')" @on-ok="updatePass">
      <Form :label-width="80">
        <FormItem :label="$t('oldPwd')">
          <Input v-model="datas.oldPsw" type="password" :placeholder="$t('oldPwd')" />
        </FormItem>
        <FormItem :label="$t('newPwd')">
          <Input v-model="datas.nwePsw" type="password" :placeholder="$t('pwdRule1')" />
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="openInput" :title="$t('setSubPwd')">
      <div style="display: flex">
        <div class="right-position-text">{{ $t('loginPwd') }}</div>
        <Input type="password" v-model="loginPwds" :placeholder="$t('pleaseInputLoginPwd')" style="width: 250px"></Input>
      </div>
      <div v-if="openInput">
        <PassWordInputs :textPwd="textPwthree" :isDisabled="true" style="margin: 10px 0"></PassWordInputs>
        <PassWordInputs :value="firstpassword" :textPwd="textPwdone" :isFoucs="true" @getPwd="getPwdFirstValue" style="margin: 10px 0"></PassWordInputs>
        <PassWordInputs :textPwd="textPwtwo" @getPwd="getPwdSeconedValue" style="margin: 10px 0"></PassWordInputs>
      </div>
      <div slot="footer">
        <Button class="b-blue" @click="setSeconedPwd">{{ $t('confirm2') }}</Button>
        <Button class="ml-10" @click="openInput = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('modifySubPwd')" v-model="modifySecondModal">
      <div style="display: flex">
        <div class="right-position-text">{{ $t('loginPwd') }}</div>
        <Input type="password" v-model="setloginPwds" :placeholder="$t('pleaseInputLoginPwd')" style="width: 250px"></Input>
      </div>
      <div v-if="modifySecondModal">
        <PassWordInputs :textPwd="textPwthree" @getPwd="getPwdSixthValue" style="margin-top: 10px"></PassWordInputs>
        <div class="pointer forgetpwds" @click="closeModify">{{ $t('forgetSubPassword') }}</div>
        <PassWordInputs :textPwd="textPwdone" @getPwd="getPwdThirdValue"></PassWordInputs>
        <PassWordInputs :textPwd="textPwtwo" @getPwd="getPwdFourthValue" style="margin-top: 16px"></PassWordInputs>
      </div>
      <div slot="footer">
        <Button class="b-blue" @click="modifySeconedPwd">{{ $t('confirm2') }}</Button>
        <Button class="ml-10" @click="modifySecondModal = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('findSubPwd')" v-model="findModifyModal" width="580">
      <div style="display: flex">
        <div class="right-position-text">{{ $t('phoneNumber') }}</div>
        <Input v-model="datas.phoneNumber" :placeholder="$t('pleaseInputLoginPwd')" style="width: 262px" disabled></Input>
      </div>
      <div style="display: flex; margin-top: 10px">
        <div class="right-position-text">{{ $t('imageCaptcha') }}</div>
        <Input class="us" type="text" v-model="datas.piccode" style="margin-right: 10px; width: 265px" :placeholder="$t('inputVerificationCodeTip')" />
        <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
          <img id="imgIdentifyingCode" :src="identifyingCode" style="height: 33px; width: 130px; cursor: pointer" :alt="$t('clickChange')" :title="$t('clickChange')" />
        </div>
      </div>
      <div style="display: flex">
        <div class="right-position-text">{{ $t('verificationCode') }}</div>
        <Input v-model="datas.code" :placeholder="$t('inputVerificationCodeTip')" style="width: 265px"></Input>
        <Button class="ml-10 b-blue" @click="sendCode('1')" style="width: 130px; padding-right: 10px">{{ codeBtnText }}</Button>
      </div>
      <PassWordInputs :textPwd="textPwdone" @getPwd="getPwdEightValue" style="margin-top: 10px"></PassWordInputs>
      <PassWordInputs :textPwd="textPwtwo" @getPwd="getPwdNightValue" style="margin-top: 10px"></PassWordInputs>
      <div slot="footer">
        <Button class="b-blue" @click="findSeconedPwd">{{ $t('confirm2') }}</Button>
        <Button class="ml-10" @click="findModifyModal = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('deactivateSecondaryPassword')" v-model="stopSecondModal">
      <Row class="pwds-base-tip">
        <Col :span="22">
          <span>
            <i class="icon-v5 icon-v5-xiaoxi"></i>
            {{ toolTips }}
          </span>
        </Col>
      </Row>
      <div v-if="stopSecondModal">
        <PassWordInputs :textPwd="textPwthree" @getPwd="getPwdForgetValue" style="margin-top: 10px"></PassWordInputs>
      </div>
      <div slot="footer">
        <Button class="b-blue" @click="stopSeconedPwd">{{ $t('confirm2') }}</Button>
        <Button class="ml-10" @click="stopSecondModal = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { hasSetSecondPwd, stopSecondPwd, findBackSecondPwd, updateSecondPwd, findStaffInfo, updateStaffInfo, chgPwd, identify3, unbindThirdAccout, chgPhoneByOldPhone, forgotcheckCode, checkLoginPwd, chgPhoneByPwd } from '@/api/public'
  import store from '@/store/index'
  import { getBpk } from '@/api/account'
  import PassWordInputs from '../../Common/PassWordInput.vue'
  import { JSEncrypt } from 'jsencrypt'
  export default {
    name: 'baseinfo',
    components: { PassWordInputs },
    data() {
      return {
        toolTips: this.$t('subPwdTip'),
        stopSecondModal: false,
        pwdsForget: '',
        pwdEightValue: '',
        pwdNightValue: '',
        originalPwds: '',
        tenPwds: '',
        elevenPwds: '',
        findModifyModal: false,
        setloginPwds: '',
        modifySecondModal: false,
        firstpassword: '',
        firstsecondedPwd: '',
        seconedSecondedPwd: '',
        loginPwds: '',
        textPwdone: this.$t('newSubPwd'),
        textPwtwo: this.$t('confirmNewSubPwd'),
        textPwthree: this.$t('originSubPwd'),
        isSettings: false,
        isPassword: 'text',
        isCheckSecond: false,
        password: '',
        lengthInput: 6,
        openInput: false,
        secPassText: this.$t('subPwdConfirmSelfHandle'),
        secondWords: '',
        ciphertext: '******',
        phoneStatusNew: true,
        passwordDisabled: false,
        phoneStatus: true,
        verifiersStatus: true,
        url: require('../../../assets/images/user.png'),
        grid1: {
          xl: { span: 12, order: 2 },
          lg: { span: 24, order: 1 },
          md: { span: 24, order: 1 },
          sm: { span: 24, order: 1 },
          xs: { span: 24, order: 1 },
        },
        grid2: {
          xl: { span: 12, order: 1 },
          lg: { span: 24, order: 2 },
          md: { span: 24, order: 2 },
          sm: { span: 24, order: 2 },
          xs: { span: 24, order: 2 },
        },
        uploadUrl: `/common/file/upload.as?fileType=1&urlAbsolute=${true}`,
        imgData: {
          name: 'imgFile',
        },
        datas: {
          nwePsw: '',
          oldPsw: '',
          piccode: '',
          accont: '',
          avatar: 'https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar',
          realName: '',
          password: this.$store.state.password, // 待登录页将登录密码存在vuex中
          mail: '',
          phoneNumber: '',
          fixPhone: '',
          lastPhone: '',
          code: '',
          newphoneNumber: '',
          piccode2: '',
          newcode: '',
          qqnum: '',
          wxnum: '',
          isBindQQ: false,
          isBindWx: false,
          currPwd: '',
          checkpassword: '',
          newcheckphone: '',
          checkPasswordPiccode: '',
          checkPasswordcode: '',
        },
        oldPassword: '',
        rules: {
          name: [
            {
              message: this.$t('pleaseInputName'),
              trigger: 'blur',
            },
          ],
          password: [{ message: this.$t('pleaseInputName'), trigger: 'blur' }],
          mail: [
            { message: this.$t('pleaseEnter') + this.$t('emailAddr'), trigger: 'blur' },
            {
              // required: true,
              type: 'email',
              message: this.$t('pleaseEnterEmailAddr'),
              trigger: 'blur',
            },
          ],
          phoneNumber: [
            {
              message: this.$t('pleaseInputPhoneNum'),
              trigger: 'blur',
            },
          ],
          // fixPhone: [
          //     {
          //         pattern: /^(\d{4})$/,

          //         message: this.$t('placeholder.pleaseEnterFixedTelephone'),
          //         trigger: 'change'
          //     }
          // ],
          lastPhone: [
            {
              pattern: /^(\d{6-8})$/,

              message: this.$t('pleaseEnterFixedTelephone'),
              trigger: 'change',
            },
            { max: 8, message: this.$t('pleaseEnterFixedTelephone') },
          ],
        },
        phoneBinding: false,
        btnOptFlag: false,
        codeBtnText: this.$t('getVerificationCode'),
        btnOptFlag2: false,
        codeBtnText2: this.$t('getVerificationCode'),
        btnOptFlag3: false,
        codeBtnText3: this.$t('getVerificationCode'),
        outTime: 60, // 设置发送验证码倒计时时间
        timer: null,
        outTime2: 60, // 设置发送验证码倒计时时间
        timer2: null,
        outTime3: 60, // 设置发送验证码倒计时时间
        timer3: null,
        randomStr: new Date().getTime(),
        identifyingCode: `${'/portal/getCode.as?randomStr=' + this.randomStr}`,
        message: '',
        // 正则校验手机号格式
        telnum: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
        unbinding: false,
        unbindingType: '',
        weixinUrl: '',
        qqUrl: '',
        wxCodeShow: false,
        newPhoneStatus: false,
      }
    },
    created() {
      this.checkIsSetSecondPwd()
      this.handlePassword()
    },
    mounted() {
      let domain = this.$func.ctxPaths()
      let domainStatus = domain.includes('sndtest') || domain.includes('localhost')
      // console.log('domainStatus', domainStatus)
      let dunsysStatus = domain.includes('dunsys')
      // console.log('dunsysStatus', dunsysStatus)
      const wxTargetUrl = domainStatus ? 'https://v5.sndtest.com/login' : dunsysStatus ? 'https://v5.snd02.com/login' : `${domain}/login`
      // console.log('wxTargetUrl', wxTargetUrl)
      const qqBaseUrl = domainStatus ? 'https://v5.sndtest.com/login' : dunsysStatus ? 'https://v5.snd02.com/login' : `${domain}/login`
      // console.log('qqBaseUrl', qqBaseUrl)
      const wxAppId = domainStatus ? 'wx9526dc5865cba6d1' : 'wx734ffddc688b6fed'
      // console.log('wxAppId', wxAppId)
      const qqAppId = domainStatus ? '102047597' : '102050828'
      // console.log('qqAppId', qqAppId)
      const dunsys = domain.includes('dunsys') ? 'dsys' : ''
      // console.log('dunsys', qqAppId)
      this.weixinUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${wxAppId}&redirect_uri=${wxTargetUrl}&response_type=code&scope=snsapi_login&state=settingWx${dunsys}#wechat_redirect`
      this.qqUrl = `https://graph.qq.com/oauth2.0/authorize?client_id=${qqAppId}&response_type=code&redirect_uri=${qqBaseUrl}&state=settingQq${dunsys}`
      // console.log('weixinUrl', this.weixinUrl)
      // console.log('qqUrl', this.qqUrl)
      window.addEventListener('popstate', this.popstate, false)
    },

    methods: {
      stopModifySecondPassword() {
        this.stopSecondModal = true
      },
      stopSeconedPwd() {
        if (this.pwdsForget.length < 6) {
          return this.$Message.error({
            content: this.$t('pleaseInput6DigitSubPwd'),
          })
        }
        const encry = new JSEncrypt()

        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          stopSecondPwd({ secondPwd: encry.encrypt(this.pwdsForget), encB64: true }).then(res => {
            if (res.success) {
              this.stopSecondModal = false
              this.$Message.success({
                content: this.$t('deactivatedSuccessfully'),
              })
              this.checkIsSetSecondPwd()
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        })
      },
      getPwdForgetValue(val) {
        this.pwdsForget = val
      },
      findSeconedPwd() {
        if (!this.datas.piccode || !this.datas.code) {
          return this.$Message.error({
            content: this.$t('inputVerificationCodeTip'),
          })
        }
        if (this.pwdEightValue !== this.pwdNightValue) {
          return this.$Message.error({
            content: this.$t('pwdTp3'),
          })
        }
        if (this.pwdNightValue.length < 6 || this.pwdEightValue.length < 6) {
          return this.$Message.error({
            content: this.$t('pleaseInput6DigitSubPwd'),
          })
        }
        const encry = new JSEncrypt()

        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          let params = {
            newSecondPwd: encry.encrypt(this.pwdEightValue),
            checkCode: this.datas.piccode,
            smsCode: this.datas.code,
            phone: this.datas.phoneNumber,
            encB64: true,
          }
          findBackSecondPwd(params).then(res => {
            if (res.success) {
              this.findModifyModal = false
              this.$Message.success({
                content: this.$t('findSuccess'),
              })
            } else {
              this.getIdentifyingCode(true)
              this.$Message.error({
                content: res.message,
              })
            }
          })
        })
      },
      getPwdEightValue(val) {
        this.pwdEightValue = val
      },
      getPwdNightValue(val) {
        this.pwdNightValue = val
      },

      closeModify() {
        this.modifySecondModal = false
        this.findModifyModal = true
        this.getIdentifyingCode(true)
        this.datas.piccode = ''
        this.datas.code = ''
      },
      openFindPassword() {
        this.findModifyModal = true
        this.getIdentifyingCode(true)
        this.datas.piccode = ''
        this.datas.code = ''
      },
      getPwdThirdValue(val) {
        this.tenPwds = val
        // console.log(val)
      },
      getPwdSixthValue(val) {
        this.originalPwds = val
      },
      getPwdFourthValue(val) {
        this.elevenPwds = val
      },
      modifySeconedPwd(val) {
        if (!this.setloginPwds) {
          return this.$Message.error({
            content: this.$t('pleaseInputLoginPwd'),
          })
        }
        if (this.tenPwds !== this.elevenPwds) {
          return this.$Message.error({
            content: this.$t('subPwd2'),
          })
        }
        if (this.tenPwds.length < 6 || this.elevenPwds < 6) {
          return this.$Message.error({
            content: this.$t('pleaseReinput6DigitNewSubPwd'),
          })
        }
        const encry = new JSEncrypt()

        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          updateSecondPwd({
            originSecondPwd: encry.encrypt(this.originalPwds),
            newSecondPwd: encry.encrypt(this.tenPwds),
            loginPwd: encry.encrypt(this.setloginPwds),
            encB64: true,
          }).then(res => {
            if (res.success) {
              this.modifySecondModal = false
              this.$Message.success({
                content: this.$t('modifySuccess'),
              })
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        })
      },
      openModifySecondPassword() {
        this.modifySecondModal = true
        this.setloginPwds = ''
      },
      getPwdFirstValue(val) {
        // console.log(val);
        this.firstsecondedPwd = val
      },
      getPwdSeconedValue(val) {
        this.seconedSecondedPwd = val
      },
      setSeconedPwd() {
        if (!this.loginPwds) {
          return this.$Message.error({
            content: this.$t('pleaseInputLoginPwd'),
          })
        }
        if (this.firstsecondedPwd !== this.seconedSecondedPwd) {
          return this.$Message.error({
            content: this.$t('pwdTp3'),
          })
        }
        if (this.seconedSecondedPwd.length < 6 || this.firstsecondedPwd.length < 6) {
          return this.$Message.error({
            content: this.$t('pleaseInput6DigitSubPwd'),
          })
        }
        const encry = new JSEncrypt()

        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          updateSecondPwd({
            newSecondPwd: encry.encrypt(this.firstsecondedPwd),
            loginPwd: encry.encrypt(this.loginPwds),
            encB64: true,
          }).then(res => {
            if (res.success) {
              this.openInput = false
              this.$Message.success({
                content: this.$t('setSuccessfully'),
              })
              this.checkIsSetSecondPwd()
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        })
      },
      checkIsSetSecondPwd() {
        hasSetSecondPwd().then(res => {
          if (res.success) {
            if (res.data === 0) {
              this.isSettings = true
              this.isCheckSecond = true
              this.isPassword = 'text'
              this.secondWords = this.$t('unset')
              store.commit('setSecondPwds', false)
            } else if (res.data === 1) {
              this.isSettings = false
              this.isPassword = 'password'
              this.isCheckSecond = false
              this.secondWords = '******'
              store.commit('setSecondPwds', true)
            }
          }
        })
      },
      openSecondPassword() {
        this.openInput = true
        this.loginPwds = ''
      },
      handleNewPhone() {
        this.newPhoneStatus = true
        this.phoneBinding = false
      },
      handleThirdparty(type) {
        if (type === '3') {
          window.location.href = this.qqUrl
        } else {
          this.wxCodeShow = true
        }
      },
      handleUnbindingShow(type) {
        this.unbinding = true
        this.unbindingType = type
      },
      handleUnbinding() {
        if (this.datas.currPwd !== '' && this.datas.currPwd !== undefined) {
          this.$Modal.confirm({
            title: '',
            content: this.unbindingType === '3' ? this.$t('unBindQQTip') : this.$t('unbindWechatTip'),
            onOk: () => {
              let params = {
                currPwd: this.datas.currPwd,
                type: this.unbindingType,
              }
              unbindThirdAccout(params).then(res => {
                if (res.success) {
                  this.unbinding = false
                  this.handlePassword()
                  this.$Message.success({
                    content: this.$t('unbindSuccess'),
                  })
                } else {
                  this.$Message.error({
                    content: res.message,
                  })
                }
              })
            },
          })
        } else {
          this.$Message.error({
            content: this.$t('passwordEmptyTip'),
          })
        }
      },
      handleidentify(type) {
        let params = {
          phone: type === '1' ? this.datas.phoneNumber : type === '2' ? this.datas.newphoneNumber : this.datas.newcheckphone,
          checkCode: type === '1' ? this.datas.piccode : type === '2' ? this.datas.piccode2 : this.datas.checkPasswordPiccode,
        }

        identify3(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: res.message,
            })
            if (type === '1') {
              this.btnOptFlag = true // 禁用发送验证码按钮
              if (!this.timer) {
                this.timer = setInterval(() => {
                  this.codeBtnText = this.$t('validateCodeTip', { time: this.outTime })
                  this.outTime = this.outTime - 1
                  if (this.outTime < 0) {
                    clearInterval(this.timer)
                    this.codeBtnText = this.$t('getVerificationCode')
                    this.outTime = 60
                    this.timer = false
                    this.btnOptFlag = false
                  }
                }, 1000)
                // 每秒执行一次
              }
            } else if (type === '2') {
              this.btnOptFlag2 = true
              if (!this.timer2) {
                this.timer2 = setInterval(() => {
                  this.codeBtnText2 = this.$t('validateCodeTip', { time: this.outTime2 })
                  this.outTime2 = this.outTime2 - 1
                  if (this.outTime2 < 0) {
                    clearInterval(this.timer)
                    this.codeBtnText2 = this.$t('getVerificationCode')
                    this.outTime2 = 60
                    this.timer2 = false
                    this.btnOptFlag2 = false
                  }
                }, 1000)
                // 每秒执行一次
              }
            } else if (type === '3') {
              this.btnOptFlag3 = true
              if (!this.timer3) {
                this.timer3 = setInterval(() => {
                  this.codeBtnText3 = this.$t('validateCodeTip', { time: this.outTime3 })
                  this.outTime3 = this.outTime3 - 1
                  if (this.outTime3 < 0) {
                    // 倒计时结束，重置时间器clearInterval(this.timer)
                    clearInterval(this.timer3)
                    this.codeBtnText3 = this.$t('getVerificationCode')
                    this.outTime3 = 60
                    this.timer3 = false
                    this.btnOptFlag3 = false
                  }
                }, 1000)
                // 每秒执行一次
              }
            }
          } else {
            this.getIdentifyingCode(true)
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleGetCaptcha() {
        this.randomStr = new Date().getTime()
      },
      getIdentifyingCode(bRefresh) {
        if (bRefresh) {
          this.identifyingCode = `${'/portal/getCode.as?randomStr=' + this.randomStr}`
        }
      },
      handlePhoneStatus() {
        this.datas.piccode2 = ''

        if (this.phoneStatus) {
          if (this.datas.code === '') {
            this.$Message.error({
              content: this.$t('inputVerificationCodeTip'),
            })
          } else {
            let params = {
              phone: this.datas.phoneNumber,
              code: this.datas.code,
            }
            forgotcheckCode(params).then(res => {
              if (res.success) {
                this.getIdentifyingCode(true)
                this.phoneStatus = false
              } else {
                this.getIdentifyingCode(true)
                this.$Message.error({
                  content: res.message,
                })
              }
            })
          }
        } else {
          if (this.datas.newphoneNumber === '' || this.datas.newphoneNumber === undefined) {
            this.$Message.error({
              content: this.$t('pleaseInputNewPhoneNum'),
            })
          } else if (this.datas.newcode === '' || this.datas.newcode === undefined) {
            this.$Message.error({
              content: this.$t('inputVerificationCodeTip'),
            })
          } else {
            let params = {
              oldPhone: this.datas.phoneNumber,
              newPhone: this.datas.newphoneNumber,
              code: this.datas.newcode,
            }
            chgPhoneByOldPhone(params).then(res => {
              if (res.success) {
                this.handlePassword()
                this.$Message.success({
                  content: res.message,
                })
                this.phoneBinding = false
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
          }
        }
      },
      handleCheckLoginPwd(params) {
        checkLoginPwd(params).then(res => {
          if (res.success) {
            this.phoneStatusNew = false
            this.getIdentifyingCode(true)
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handlechgPhoneByPwd(params) {
        chgPhoneByPwd(params).then(res => {
          if (res.success) {
            this.newPhoneStatus = false
            this.handlePassword()
            this.$Message.success({
              content: res.message,
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handlePasswordVerifiers() {
        const encry = new JSEncrypt()
        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          if (this.phoneStatusNew) {
            if (this.datas.checkpassword === '' || this.datas.checkpassword === undefined) {
              this.$Message.error({
                content: this.$t('pleaseInputPwd'),
              })
            } else {
              let params = {
                pwd: encry.encrypt(this.datas.checkpassword),
              }
              this.handleCheckLoginPwd(params)
            }
          } else {
            if (this.datas.newcheckphone === '' || this.datas.newcheckphone === undefined) {
              this.$Message.error({
                content: this.$t('pleaseInputNewPhoneNum1'),
              })
            } else if (this.datas.checkPasswordcode === '' || this.datas.checkPasswordcode === undefined) {
              this.$Message.error({
                content: this.$t('inputVerificationCodeTip'),
              })
            } else {
              let params = {
                pwd: encry.encrypt(this.datas.checkpassword),
                newPhone: this.datas.newcheckphone,
                code: this.datas.checkPasswordcode,
              }
              this.handlechgPhoneByPwd(params)
            }
          }
        })
      },
      handlecancle() {
        this.unbinding = false
        this.phoneBinding = false
        this.newPhoneStatus = false
      },
      handlePhonebinding() {
        this.phoneStatus = true
        this.phoneBinding = true
        this.getIdentifyingCode(true)
        this.datas.piccode = ''
        this.datas.code = ''
      },
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
          this.$Message.error(this.$t('uploadImgFormatError'))
        }
      },
      handleSuccess(res, file) {
        if (res.success) {
          this.url = res.data
          this.$Message.success({
            content: this.$t('uploadSuccess'),
          })
        } else if (res.code === '-1') {
        } else {
          this.$Message.error(res.message)
        }
      },
      sendCode(type) {
        this.outTime = 60
        this.timer = null

        if (type === '1') {
          if (this.datas.piccode === '') {
            return this.$Message.error({
              content: this.$t('pleaseEnterTheGraphicVerificationCode'),
            })
          } else if (this.datas.phoneNumber === '') {
            return this.$Message.error({
              content: this.$t('inputPhoneTip'),
            })
          } else if (!this.telnum.test(this.datas.phoneNumber)) {
            return this.$Message.error({
              content: this.$t('phoneFormatWrong'),
            })
          } else {
            this.handleidentify('1')
          }
        } else if (type === '2') {
          if (this.datas.piccode2 === '') {
            return this.$Message.error({
              content: this.$t('pleaseEnterTheGraphicVerificationCode'),
            })
          } else {
            this.handleidentify('2')
          }
        } else {
          if (this.datas.checkPasswordPiccode === '') {
            return this.$Message.error({
              content: this.$t('pleaseEnterTheGraphicVerificationCode'),
            })
          } else if (this.datas.newcheckphone === '') {
            return this.$Message.error({
              content: this.$t('inputPhoneTip'),
            })
          } else if (!this.telnum.test(this.datas.newcheckphone)) {
            return this.$Message.error({
              content: this.$t('phoneFormatWrong'),
            })
          } else {
            this.handleidentify('3')
          }
        }
      },

      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            updateStaffInfo({
              realName: this.datas.realName,
              loginName: this.datas.accont,
              mobile: this.datas.phoneNumber,
              email: this.datas.mail,
              telephone: this.datas.fixPhone + this.datas.lastPhone,
              iconUrl: this.url,
            }).then(res => {
              if (res.success) {
                this.$Message.success(this.$t('infoUpdateSuccess'))
                store.commit('realName', this.datas.realName)
              } else {
                if (res.message) {
                  this.$Message.error({
                    content: res.message,
                  })
                } else {
                  this.$Message.error({
                    content: this.$t('unknown'),
                  })
                }
              }
            })
          } else {
            this.$Message.error(this.$t('pleaseInputRightFormat'))
          }
        })
      },
      updatePassword() {
        this.passwordDisabled = true
      },
      updatePass() {
        const encry = new JSEncrypt()

        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          let newpassword = encry.encrypt(this.datas.nwePsw)
          let oldpassword = encry.encrypt(this.datas.oldPsw)
          let params = { oriPwd: oldpassword, newPwd: newpassword, encB64: true }
          this.handlechgpsw(params)
        })
      },

      handlechgpsw(params) {
        chgPwd(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: res.message,
            })
            this.passwordDisabled = false
          } else if (res.code === '-1') {
          } else {
            if (res.message) {
              this.$Message.error({
                content: res.message,
              })
            } else {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          }
        })
      },
      handlePassword() {
        findStaffInfo()
          .then(res => {
            if (res.success) {
              this.url = res.data.iconUrl
              this.datas = {
                accont: res.data.loginName,
                realName: res.data.realName,
                phoneNumber: res.data.mobile,
                fixPhone: res.data.telephone.substr(0, 4),
                lastPhone: res.data.telephone.substr(4),
                mail: res.data.email,
                qqnum: res.data.isBindQQ ? res.data.qq_nickname : this.$t('noBind'),
                wxnum: res.data.isBindWx ? res.data.wx_nickname : this.$t('noBind'),
                isBindQQ: res.data.isBindQQ,
                isBindWx: res.data.isBindWx,
              }
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
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
  }
  .pwds-base-tip {
    font-size: 14px;
    padding: 5px;
    margin-bottom: 20px;
    border: 1px solid;
    background: #1a202e;
    color: #999999;
  }
  .right-position-text {
    margin-right: 15px;
    text-align: right;
    width: 130px;
    padding-top: 5px;
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
  .thirdParty {
    input {
      color: #f59a23 !important;
    }
  }
  .forgetpwds {
    color: #007eff;
    text-align: right;
    margin-right: 50px;
  }
  .warn-inputs {
    color: #f7a352;
    input {
      color: #f7a352 !important;
    }
  }
  .settingBind {
    .ivu-modal-footer {
      border-color: transparent !important;
      padding: 0px 18px 12px 18px;
    }
    .ivu-modal-body {
      padding: 16px 16px 0px 16px;
    }
  }
  .setting-account-info {
    &-avatar {
      width: 90px;
      height: 90px;
    }
  }
</style>
