<template>
  <div class="bill-payment">
    <template v-if="paymentType === 'index'">
      <div class="amount-container">
        <Row class="amout-row">
          <Row class="amout-rowchiren" v-if="codeType === 'within'">
            <div class="amount-title">缴费对象</div>
            <div>
              <div class="amout-macAddr">{{ name.split('/')[0] }}</div>
              <div class="amout-macAddr">/{{ name.split('/')[1] }}</div>
            </div>
          </Row>
          <div class="amout-rowchiren" v-if="codeType === 'project'" @click="handlePaymentRecipient">
            <div class="amount-title">缴费对象</div>
            <template v-if="billingTarget === '2'">
              <div>
                <div class="amout-macAddr">{{ deviceTitle }}</div>
                <div class="amout-macAddr">{{ addrTitle ? '/' + addrTitle : '' }}</div>
              </div>
              <i class="icon-v5 icon-v5-xiangyou"></i>
            </template>
            <template v-if="billingTarget === '3'">
              <div class="amout-macAddr">{{ groupTypeTitle }}/{{ groupNodeTitle }}</div>
            </template>
          </div>
        </Row>
        <Row class="amout-row">
          <Row style="width: 100%" class="amout-rowchiren">
            <div class="amount-title">时段结算余额</div>
            <span class="amout-value">¥{{ balance }}</span>
          </Row>
        </Row>
        <Row class="amout-rowPro">
          <Row class="amout-rowchiren">
            <div style="color: #a1a1a1">充值金额</div>
          </Row>
          <div class="amount-box">
            <span class="amount-sign">¥</span>
            <input :type="inputType" :pattern="inputPattern" v-model="inputValue" class="amount-input" placeholder="请输入金额" />
          </div>
        </Row>
      </div>

      <Row class="money-button">
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between">
          <Button v-for="(item, index) in amoutMoneyArray" :key="index" class="amout-moneyBtn" :disabled="item.disabled" @click="handleAmoutMoney(item.key, index)">{{ item.value }}</Button>
        </div>
        <div class="submit-box">
          <Button long class="submit-btn" style="margin-bottom: 10px" @click="handlePaymentmethod('wePay')">微信支付</Button>
          <Button long class="submit-btn" @click="handlePaymentmethod('aliPay')">支付宝支付</Button>
        </div>
      </Row>
    </template>
    <template v-else>
      <div class="paymentObj">
        <Row class="paymentHeader">
          <Col :span="10" class="back"><span @click="back">返回</span></Col>
          <Col :span="14" class="title">缴费对象</Col>
        </Row>
        <div class="paymentContent">
          <div class="paymentCollapse">
            <template v-if="billingTarget === '2'">
              <Collapse v-model="panelModel" simple v-for="(item, index) in macList" :key="index">
                <Panel name="1">
                  {{ `${item.label}  (${item.mac})` }}
                  <div slot="content" class="panelContent">
                    <Row class="panelContentHeader">
                      <div>线路</div>
                      <div>选择</div>
                    </Row>
                    <div class="device">
                      <Row v-for="(val, ind) in item.children" :key="ind" style="justify-content: space-between; margin: 10px 0px">
                        <div>{{ val.label }}</div>
                        <div style="color: #4674ff; font-weight: 700" @click="handleSelectdevice(val)">选择</div>
                      </Row>
                    </div>
                  </div>
                </Panel>
              </Collapse>
            </template>
            <template v-if="billingTarget === '3'">
              <Collapse v-model="panelModelGroup" simple v-for="(item, index) in packetList" :key="index" @on-change="handlepanelGroup(item, index)">
                <Panel name="1">
                  {{ item.type }}
                  <div slot="content" class="panelContent">
                    <Row class="panelContentHeader">
                      <div>分组</div>
                      <div>选择</div>
                    </Row>
                    <div class="device">
                      <Row v-for="(val, ind) in item.children" :key="ind" style="justify-content: space-between; margin: 10px 0px">
                        <div>{{ val.title }}</div>
                        <div style="color: #4674ff; font-weight: 700" @click="handleSelectdevice(val)">选择</div>
                      </Row>
                    </div>
                  </div>
                </Panel>
              </Collapse>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script src="http://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
<script>
  import { onlineAccountCharge, balanceAndDeviceInfo, getAppId, getMacChnQueryCondition, getGroupTypeQueryCondition, getGroupNodeQueryCondition } from '@/api/public'
  export default {
    data() {
      return {
        packetList: [],
        panelModelGroup: '',
        deviceTitle: '',
        addrTitle: '',
        groupTypeTitle: '',
        groupNodeTitle: '',
        panelModel: '1',
        inputType: 'number',
        inputPattern: '[0-9.]*',
        inputValue: '',
        amoutMoneyArray: [
          { value: '50元', key: '50', disabled: false },
          { value: '100元', key: '100', disabled: false },
          { value: '200元', key: '200', disabled: false },
          { value: '1000元', key: '1000', disabled: false },
          { value: '2000元', key: '2000', disabled: false },
          { value: '5000元', key: '5000', disabled: false },
          { value: '10000元', key: '10000', disabled: false },
          { value: '50000元', key: '50000', disabled: false },
        ],
        params: '',
        projectCode: this.$route.query.state ? this.$route.query.state.split(',')[4] : this.$route.query.project,
        appid: '',
        balance: '',
        name: '',
        codeType: this.$route.query.state ? this.$route.query.state.split(',')[6] : this.$route.query.codeType,
        billingTarget: this.$route.query.state ? this.$route.query.state.split(',')[5] : this.$route.query.billingTarget,
        billCycle: '',
        paymentType: 'index',
        macList: [],
        targetValue: '',
        packetFilterList: [],
      }
    },
    created() {
      switch (this.getDeviceType()) {
        case 'android':
          this.inputType = 'number'
          this.inputPattern = '[0-9.]*'
          break
        case 'ios':
        default:
          this.inputType = 'number'
          this.inputPattern = '[0-9.]*'
          break
      }
    },
    mounted() {
      this.handleGetAppId()
      if (this.codeType === 'within') {
        this.projectCode = this.$route.query.project
        this.targetValue = this.$route.query.targetValue
        this.billingTarget = this.$route.query.billingTarget
        this.billCycle = this.$route.query.billCycle
        if (this.$route.query.code === undefined) {
          this.handleBalanceAndDeviceInfo()
        }
      }
      if (this.$route.query.code !== undefined && this.$route.query.state) {
        const infoList = this.$route.query.state.split(',')
        this.inputValue = infoList[0]
        this.balance = infoList[1]
        this.name = infoList[2]
        this.targetValue = infoList[3]
        this.projectCode = infoList[4]
        this.billingTarget = infoList[5]
        this.codeType = infoList[6]
        if (this.billingTarget === '2') {
          this.deviceTitle = this.name.split('/')[0]
          this.addrTitle = this.name.split('/')[1]
        } else if (this.billingTarget === '3') {
          this.groupTypeTitle = this.name.split('/')[0]
          this.groupNodeTitle = this.name.split('/')[1]
        }
        this.handleonlineAccountCharge('wePay')
      }
    },
    methods: {
      handlepanelGroup(item, index) {
        if (!item.children) {
          this.getGroupTrees(item, index)
        }
      },
      getGroupTrees(item, index) {
        getGroupNodeQueryCondition({ projectCode: this.projectCode, groupId: item.id }).then(res => {
          if (res.success) {
            let resData = res.data
            resData.forEach(val => {
              val['parentLabel'] = item.type
            })
            this.packetList.splice(index, 1, { ...this.packetList[index], children: this.getTree(resData) })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      getGroupTypes() {
        getGroupTypeQueryCondition({ projectCode: this.projectCode }).then(res => {
          if (res.success) {
            this.panelModelGroup = ''
            this.packetList = res && res.data
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      getTree(tree = []) {
        let arr = []
        tree.forEach(item => {
          let obj = { id: item.id, value: item.id, parentId: item.groupId, title: item.name, expand: false, selected: false, checked: false, parentLabel: item.parentLabel }
          if (item.children && item.children.length !== 0) {
            let obj = { id: item.id, value: item.id, parentId: item.groupId, title: item.name, expand: false, selected: false, checked: false, parentLabel: item.parentLabel }
            arr.push(obj)
          }
          obj.children = this.getTree(item.children) // 递归调用
          arr.push(obj)
        })
        return arr
      },
      handleSelectdevice(item) {
        this.paymentType = 'index'
        if (this.billingTarget === '2') {
          this.deviceTitle = `${item.parentLabel}(${item.parent})`
          this.addrTitle = `${item.label}(${item.parent}-${item.value < 10 ? '0' + item.value : item.value})`
          this.handleBalanceAndDeviceInfo(item)
        } else if (this.billingTarget === '3') {
          this.groupTypeTitle = item.parentLabel
          this.groupNodeTitle = item.title
          this.handleBalanceAndDeviceInfo(item)
        }
      },
      back() {
        this.paymentType = 'index'
      },
      handlePaymentRecipient() {
        this.paymentType = 'payment'
        if (this.billingTarget === '2') {
          this.handleGetMacChnQueryCondition()
        } else if (this.billingTarget === '3') {
          this.getGroupTypes()
        }
      },
      handleGetMacChnQueryCondition() {
        getMacChnQueryCondition({ projectCode: this.projectCode }).then(res => {
          this.macList = res.data.map(item => {
            let res = { value: item.resId, label: item.name, mac: item.mac }
            if (item.addrs) {
              res.children = item.addrs.map(data => {
                return { value: data.addr, label: data.title, parent: item.mac, parentLabel: item.name, parentResId: item.resId }
              })
            }
            return res
          })
        })
      },
      handleBalanceAndDeviceInfo(item) {
        if (item) {
          if (this.billingTarget === '2') {
            this.targetValue = `${item.parentResId}:${item.value}`
          }
          if (this.billingTarget === '3') {
            this.targetValue = item.value
          }
        }
        let params = { projectCode: this.projectCode, targetValue: this.targetValue, billingTarget: this.billingTarget, billCycle: this.billCycle }
        balanceAndDeviceInfo(params).then(res => {
          if (res.success) {
            this.balance = res.data.balance
            this.name = res.data.name
          }
        })
      },
      handleGetAppId() {
        getAppId({}).then(res => {
          this.appid = res.data.appid
        })
      },
      handleonlineAccountCharge(type) {
        let params = { payMethod: type, code: this.$route.query.code, projectCode: this.projectCode, billingTarget: this.billingTarget, targetValue: this.targetValue, amt: this.inputValue }
        onlineAccountCharge(params).then(res => {
          if (type === 'wePay') {
            this.onBridgeReady(res.data)
          } else if (type === 'aliPay') {
            window.location.href = res.data.body
          }
        })
      },
      handlePaymentmethod(type) {
        let str = `${this.inputValue},${this.balance},${this.name},${this.targetValue},${this.projectCode},${this.billingTarget},${this.codeType}`
        if (type === 'wePay') {
          let domain = this.$func.ctxPaths()
          let domainStatus = domain.includes('sndtest') || domain.includes('localhost')
          let redirectUri = domainStatus ? 'https%3A%2F%2Fv5.sndtest.com%2FbillPayment' : 'https%3A%2F%2Fv5.snd02.com%2FbillPayment'
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=${str}#wechat_redirect`
        } else {
          this.handleonlineAccountCharge('aliPay')
        }
      },
      onBridgeReady(item) {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          {
            appId: item.appId, // 公众号名称，由商户传入
            timeStamp: item.timestamp, // 时间戳，自1970年以来的秒数
            nonceStr: item.nonceStr, // 随机串
            package: item.packageVal,
            signType: item.signType, // 微信签名方式：
            paySign: item.paySign, // 微信签名
          },
          function (res) {
            // 支付成功
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
            }
            // 支付过程中用户取消
            if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            }
            // 支付失败
            if (res.err_msg === 'get_brand_wcpay_request:fail') {
            }
            if (res.err_msg === '调用支付JSAPI缺少参数：total_fee') {
            }
          }
        )
      },
      handleAmoutMoney(value, index) {
        this.inputValue = value
      },
      getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase()
        return userAgent.indexOf('android') > -1 || userAgent.indexOf('Android') > -1 ? 'android' : 'ios'
      },
    },
  }
</script>

<style lang="less" scoped>
  .bill-payment {
    width: 100%;
    height: 100%;
    background-color: #f3f4f5 !important;
    color: #000;
    .paymentObj {
      .paymentHeader {
        align-items: center;
        padding: 12px;
        .back {
          font-size: 16px;
        }
        .title {
          font-size: 18px;
          font-weight: 700;
        }
      }
      .paymentContent {
        background: #f3f4f6;
        .paymentCollapse {
          padding: 10px;
          .panelContent {
            margin-top: 10px;
            .panelContentHeader {
              font-size: 12px;
              justify-content: space-between;
            }
            .device {
              justify-content: space-between;
              font-size: 14px;
            }
          }
          .ivu-collapse {
            background-color: #fff;
            border-color: #fff;
            border-radius: 5px;
          }
          /deep/.ivu-collapse-header {
            background: #ffffff;
            color: #000;
            font-weight: 700;
            border-color: #dee2ea;
            margin: 0px 16px;
            padding: 0;
            position: relative;
            display: flex;
            align-items: center;
            height: 50px;
            .ivu-icon {
              position: absolute;
              right: -16px;
              top: 50%;
              margin-top: -7px;
            }
          }
          /deep/.ivu-collapse-content {
            background-color: #fff;
            color: #717171;
          }
        }
      }
    }
    .amout-moneyBtn {
      width: 22%;
      height: 42px;
      text-align: center;
      background: #f3f4f6;
      color: #1b57fe;
      padding: 0;
      border-color: #1b57fe;
      margin-top: 10px;
    }
    .amount-container {
      .amout-macAddr {
        color: #000;
        font-size: 14px;
      }
      .amout-row {
        align-items: center;
        padding-top: 16px;
        .border {
          background: #f3f4f6;
          height: 15px;
          width: 100%;
        }
        .amout-rowchiren {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 16px;
          background: #fff;
        }
      }
      .amout-rowPro {
        background: #fff;
        align-items: center;
        margin-top: 16px;
        padding-bottom: 16px;
        .border {
          background: #f3f4f6;
          height: 15px;
          width: 100%;
        }
        .amout-rowchiren {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 16px 16px 0 16px;
          background: #fff;
        }
      }
      .amout-value {
        margin-left: 20px;
        font-size: 16px;
        color: #e24a48;
      }
      .amount-money {
        color: #a1a1a1;
      }
      .amount-title,
      .amount-money {
        font-size: 16px;
        font-weight: 700;
      }
      .amount-box {
        color: #333;
        display: flex;
        align-items: flex-end;
        margin-left: 16px;
        margin-top: 5px;
        .amount-sign {
          font-size: 16px;
          flex: none;
          margin-right: 10px;
          position: relative;
          top: -4px;
        }

        .amount-input {
          font-size: 30px;
          border: 0;
          outline: none;
          -webkit-appearance: none; /*去除系统默认的样式*/
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /* 点击高亮的颜色*/
          font-weight: 700;
        }
        .amount-input:focus-visible {
          outline: none;
        }
        .amount-input::placeholder {
          color: #ddd;
        }
      }
    }
    .money-button {
      background: #f3f4f6;
      height: 60vh;
      padding: 16px;
      flex-direction: column;
      justify-content: space-between;
    }
    .submit-box {
      width: 100%;
      z-index: 12;
      border: 0;
      color: #fff;
      .submit-btn {
        color: #fff;
        background: #1c57ff;
        border: 0;
        height: 40px;
        line-height: 40px;
      }
      .submit-btn:active {
        color: #fff;
        background: rgba(45, 140, 240, 0.6);
      }
    }
  }
</style>
