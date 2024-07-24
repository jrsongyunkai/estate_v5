<template>
  <div id="AssociatedAccount">
    <Row class="alarm-sound-tip">
      <Col :span="22">
        <span class="ml-20">
          <i class="icon-v5 icon-v5-xiaoxi"></i>
          {{ $t('associatedAccountTips') }}
        </span>
      </Col>
    </Row>
    <Row style="margin-top: 20px">
      <Col :span="5">
        <Form ref="formInline" :model="formInline" inline class="account-form">
          <FormItem prop="user">
            <Input type="text" v-model="formInline.user" :placeholder="$t('enterAssociatedAccount')"></Input>
          </FormItem>
          <Button type="primary" @click="handleSubmit('formInline')">{{ $t('query') }}</Button>
        </Form>
      </Col>
      <Col offset="18">
        <Button type="primary" size="small" ghost @click="handleAdd">
          {{ $t('add') }}.
          <!-- <Icon type="md-add" /> {{$t('system.add')}}. -->
        </Button>
      </Col>
    </Row>
    <Col :span="24">
      <div>
        <Table :data="tableData" :columns="columnTable">
          <template slot-scope="{ row }" slot="name">
            <span>{{ row.loginName + row.nickName }}</span>
          </template>
          <template slot-scope="{ row, index }" slot="operations">
            <Poptip transfer :ref="`popover-${index}`" @on-cancel="close(index)">
              <Button type="primary" size="small" ghost class="tag-add pointer">{{ $t('add') }}.</Button>
              <div slot="content">
                <Input size="small" maxlength="10" show-word-limit v-model.trim="form.label" :placeholder="$t('pleaseEnter') + $t('add')"></Input>
                <div class="tr" style="margin: 5px 0 0">
                  <Button type="primary" @click="handleAddLabel(form.label, index)">{{ $t('confirm') }}</Button>
                  <Button @click="close(index)">{{ $t('cancel') }}</Button>
                </div>
              </div>
            </Poptip>
            <span v-if="row.holdingLabels !== ''">
              <Tag v-for="(tag, idx) in row.holdingLabels.split(',')" :key="idx" :name="tag" closable @on-close="handleClosePushlabel(tag, idx, index)">
                <span>{{ tag }}</span>
              </Tag>
            </span>
          </template>
          <template slot-scope="{ row, index }" slot="open">
            <Button type="text" size="small" @click="handleSave(row, index)">
              <span style="color: #007eff">{{ $t('save') }}</span>
            </Button>
            <Button type="text" size="small" @click="handleDel(row, index)">
              <span style="color: #ff5b59">{{ $t('remove') }}</span>
            </Button>
          </template>
        </Table>
      </div>
    </Col>
    <!-- 添加弹窗 -->
    <Modal :mask="false" :title="$t('rempersonalAccountovesecle')" v-model="dialogVisible" width="650px" footer-hide>
      <div class="dialopVisible">
        <Row>
          <Col :span="24" class="mt-10">
            <Form ref="form" inline size="small" :model="accountForm">
              <FormItem prop="account">
                <Input type="text" v-model="accountForm.account" :placeholder="$t('account')"></Input>
              </FormItem>
              <FormItem prop="password">
                <Input type="password" v-model="accountForm.password" :placeholder="$t('password')"></Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="handleCheck('accountForm')">{{ $t('query') }}</Button>
              </FormItem>
            </Form>
          </Col>
          <Col :span="24" class="mt-10">
            <Table border :columns="columns5" :data="newsData" @on-selection-change="handleClick"></Table>
          </Col>
        </Row>
      </div>
    </Modal>
    <Modal v-model="modalnotice" :title="$t('tip')" @on-ok="removeOk" @on-cancel="removeCancel">
      <p>{{ $t('confirmDeleteLabel') }}</p>
    </Modal>
  </div>
</template>

<script>
  import { JSEncrypt } from 'jsencrypt'
  import { queryAssociatedUsers, saveFollowerForAssign, queryStaffByAccount } from '@/api/public'
  import { getBpk } from '@/api/account'
  export default {
    name: 'account',
    data() {
      return {
        columnTable: [
          { title: this.$t('concatAccount'), slot: 'name' },
          { title: this.$t('holdLabels'), slot: 'operations' },
          {
            title: this.$t('operation'),
            slot: 'open',
          },
        ],
        visible: undefined,
        rowMsge: '',
        rowIndex: '',
        modalnotice: false,
        tableData: [],
        newsData: [],
        columns5: [
          {
            width: '60px',
            type: 'selection',
          },
          {
            title: this.$t('account'),
            key: 'loginName',
          },
          {
            title: this.$t('nickName'),
            key: 'nickName',
          },
        ],
        accountForm: {
          account: '',
          password: '',
        },
        formInline: {
          user: '',
        },
        form: {
          label: '',
        },
        length: 0,
        dialogVisible: false,
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.initBpk()
        this.queryAssociatedtableData()
      },
      queryAssociatedtableData() {
        queryAssociatedUsers()
          .then(res => {
            if (res.success) {
              this.tableData = res.data
              this.length = res.data.length
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
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
      handleClosePushlabel(tag, index, idxs) {
        let label = this.tableData[idxs].holdingLabels.split(',')
        label.splice(label.indexOf(tag), 1)
        this.tableData[idxs].holdingLabels = label.join(',')
      },
      handleAdd() {
        if (this.length === this.tableData.length - 1) return false
        this.dialogVisible = true
      },
      initBpk() {
        getBpk().then(r => {
          this.bpk = r.data
        })
      },
      handleCheck() {
        const encry = new JSEncrypt()
        encry.setPublicKey(this.bpk.pubkey)
        if (this.accountForm.account.length < 1 || this.accountForm.password.length < 1) {
          this.$Message.error({
            content: this.$t('unfilled'),
          })
          return false
        }

        let pass = encry.encrypt(this.accountForm.password)
        let params = {
          loginName: this.accountForm.account,
          password: pass,
        }
        queryStaffByAccount(params)
          .then(res => {
            if (res.success) {
              this.newsData = res.data
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
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
      handleSubmit(name) {
        let params = {
          loginName: this.formInline.user,
        }
        queryAssociatedUsers(params).then(res => {
          if (res.success) {
            this.tableData = res.data
          } else if (res.code === '-1') {
          } else {
            this.$Message
              .error({
                content: res.message,
              })
              .catch(err => {
                if (err) {
                  this.$Message.error({
                    content: this.$t('unknown'),
                  })
                }
              })
          }
        })
      },
      handleClick(row) {
        row.forEach(item => {
          let obj = {
            loginName: item.loginName,
            nickName: '(' + item.nickName + ')',
            holdingLabels: '',
            followerId: item.staffId,
            associatedId: 0,
          }
          this.tableData.unshift(obj)
        })

        this.dialogVisible = false
        this.accountForm.account = ''
        this.accountForm.password = ''
        this.newsData = []
      },
      handleAddLabel(label, index) {
        let reg = /^[0-9a-zA-Z]*$/g
        if (!reg.test(label) || label.length < 1) {
          this.$Message.error({
            content: this.$t('lableFormat'),
          })
          return false
        }
        if (this.tableData[index].holdingLabels.split(',').indexOf(label) > -1) {
          this.$Message.error({
            content: this.$t('labelExists'),
          })
          return false
        }
        this.$refs['popover-' + index].visible = false
        this.form.label = ''
        this.tableData[index].holdingLabels = this.tableData[index].holdingLabels !== '' ? this.tableData[index].holdingLabels.concat(',' + label) : label
      },
      handleSave(row) {
        let arr = row.holdingLabels.split(',')
        if (arr.length > 18) {
          this.$Message.error({
            content: this.$t('moreLabel'),
          })
          return false
        }
        let params = {
          oper: 'associate',
          followerId: row.followerId,
          classifyLabels: row.holdingLabels,
          associatedId: row.associatedId,
        }
        saveFollowerForAssign(params)
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: res.message,
              })
              this.queryAssociatedtableData()
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'), // this.$t('message.unknown')
              })
            }
          })
      },
      removeOk() {
        if (this.rowMsge.associatedId === 0) {
          this.tableData.splice(this.rowIndex, 1)
          return false
        }
        saveFollowerForAssign({
          oper: 'disassociate',
          followerId: this.rowMsge.followerId,
          associatedId: this.rowMsge.associatedId,
        })
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: res.message,
              })
              this.queryAssociatedtableData()
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
          .catch(err => {
            if (err) {
              this.$Message.error({
                message: this.$t('unknown'),
              })
            }
          })
      },
      removeCancel() {
        this.$Message.info({
          content: this.$t('cancelDelete'),
        })
      },
      handleDel(row, index) {
        this.rowMsge = row
        this.rowIndex = index
        this.modalnotice = true
        if (row.associatedId === 0) {
          this.tableData.splice(index, 1)
          return false
        }
      },
      open(index) {
        // this.$refs['popover-' + index].
      },
      close(index) {
        this.form.label = ''
        this.$refs['popover-' + index].visible = false
      },
    },
  }
</script>

<style lang="less" scoped>
  .my-table {
    background-color: #282c34;
  }
  .alarm-sound-tip {
    font-size: 14px;
    padding: 5px;
    border: 1px solid;
    background: #1a202e;
    color: #999999;
  }
  .tag-add {
    margin-right: 10px;
  }
</style>
