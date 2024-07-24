<template>
  <div class="stealingElectricitydetail">
    <div class="back" @click="back">
      <Icon custom="icon-v5 icon-v5-xiangzuo" class="go-back" />
      {{ $t('back') }}
    </div>
    <div class="information bgcolor mt-10">
      <header>
        <h3>{{ $t('baseInfo') }}</h3>
        <div class="btn">
          <Button type="primary" style="width: 80px" @click="handleeditPage">{{ $t('edit') }}</Button>
          <Button class="ml-10 b-dger" style="width: 80px" @click="openPwdsModal">{{ $t('delete') }}</Button>
        </div>
      </header>
      <Form label-position="right" :label-width="80" style="margin-top: 20px">
        <FormItem :label="`${$t('configName')}:`">
          <span>{{ infoForm.name }}</span>
        </FormItem>
        <FormItem :label="$t('configDescription')">
          <span>{{ infoForm.remark }}</span>
        </FormItem>
        <FormItem :label="$t('state') + ':'">
          <Switch :disabled="disabled" v-model="infoForm.status" />
        </FormItem>
      </Form>
    </div>
    <div class="devices bgcolor mt-10">
      <h3>{{ $t('configDevice') }}</h3>
      <Table :columns="macLinecolumns" :data="macLinedata" class="mt-20">
        <template slot-scope="{ row }" slot="addr">
          <Tag v-for="(item, index) in row.addrTitleList" :key="index" :name="item.addr">{{ item.title }}</Tag>
        </template>
      </Table>
      <Page :total="DevicedataTotal" @on-change="handleDevicePage" show-total />
    </div>

    <div class="monitortimer bgcolor mt-10">
      <h3>{{ $t('detectionPeriod') }}</h3>
      <Table :columns="monitorTimercolumns" :data="monitorTimerdata" class="mt-20">
        <template slot-scope="{ row }" slot="upLimit">
          {{ (row.upLimit * 100).toFixed(1) + '%' }}
        </template>
        <template slot-scope="{ row }" slot="actionTypeName">
          <span :class="row.actionType === 1 ? 'c-success' : row.actionType === 2 ? 'c-danger' : row.actionType === 3 ? 'c-success' : 'c-info'">
            {{ row.actionTypeName }}
          </span>
        </template>
      </Table>
    </div>
    <Modal v-model="openSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSeconedPwd" :isfoucs="false" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <Button type="default" @click="openSeconedPwd = false">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import { snapshotbaseInfodetail, checkSecondPwd, snapshotdevicelist, elecStealingtimelist, elecStealingconfigdel } from '@/api/public'
  export default {
    components: {
      PwsSeconedCheckVue,
    },
    props: {
      confId: [Number, String],
    },
    data() {
      return {
        bpk: null,
        newPwdsSeconed: '',
        openSeconedPwd: false,
        pageNo: '1',
        DevicedataTotal: 0,
        infoForm: '',
        disabled: true,
        detailSwitch: true,
        macLinecolumns: [
          {
            title: this.$t('configDevice'),
            key: 'name',
          },
          {
            title: this.$t('equipmentNo'),
            key: 'mac',
          },
          {
            title: this.$t('line'),
            slot: 'addr',
          },
        ],
        macLinedata: [],
        monitorTimercolumns: [
          {
            title: this.$t('configureTimePeriods'),
            key: 'timeRangeTypeName',
          },
          {
            title: this.$t('floatingCap'),
            slot: 'upLimit',
          },
          {
            title: this.$t('alarmTriggeringMechanism'),
            key: 'triggerTypeName',
          },
          {
            title: this.$t('performAction'),
            slot: 'actionTypeName',
          },
          {
            title: this.$t('alarm'),
            key: 'alarmableName',
          },
          {
            title: this.$t('enabled'),
            key: 'statusName',
          },
        ],
        monitorTimerdata: [],
      }
    },
    mounted() {
      this.handlesnapshotbaseInfodetail()
      this.handlesnapshotdevicelist('1')
      this.handleElecStealingtimelist()
    },
    methods: {
      openPwdsModal() {
        this.newPwdsSeconed = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
        } else {
          this.handledelDetails()
        }
      },
      closePwdModal() {
        this.openSeconedPwd = false
      },
      getnewPwdsVal(val) {
        this.newPwdsSeconed = val
      },
      checkSecondePwds() {
        if (this.newPwdsSeconed.length < 6) {
          this.newPwdsSeconed = ''
          return this.$Message.error({
            content: this.$t('pleaseEnterComplateSubPassword'),
          })
        }
        const encry = new JSEncrypt()
        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          checkSecondPwd({ secondPwd: encry.encrypt(this.newPwdsSeconed), encB64: true }).then(res => {
            if (res.success) {
              if (res.code === '0') {
                // this.$Message.success({
                //     content: '校验成功'
                // })
                this.openSeconedPwd = false
                this.handledelDetails()
              }
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        })
        checkSecondPwd({ secondPwd: encry.encrypt(this.newPwdsSeconed), encB64: true }).then(res => {
          if (res.success) {
            if (res.code === '0') {
              // this.$Message.success({
              //     content: '校验成功'
              // })
              this.openSeconedPwd = false
              this.handledelDetails()
            }
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleDevicePage(val) {
        this.pageNo = val
        this.handlesnapshotdevicelist(this.pageNo)
      },
      handleElecStealingtimelist() {
        let params = {
          projectCode: this.$store.state.projectCode,
          confId: this.confId,
        }
        elecStealingtimelist(params).then(res => {
          if (res.success) {
            this.monitorTimerdata = res.data
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handlesnapshotbaseInfodetail() {
        let params = {
          projectCode: this.$store.state.projectCode,
          confId: this.confId,
        }
        snapshotbaseInfodetail(params).then(res => {
          if (res.success) {
            res.data.status = res.data.status === 1
            this.infoForm = res.data
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handlesnapshotdevicelist(pageNo) {
        let params = {
          projectCode: this.$store.state.projectCode,
          confId: this.confId,
          pageNo: pageNo,
          pageSize: '10',
        }
        snapshotdevicelist(params).then(res => {
          if (res.success) {
            this.macLinedata = res.datas
            this.DevicedataTotal = res.total
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      back() {
        this.$emit('back', 'index')
      },
      handleeditPage() {
        this.$emit('back', 'addNew')
        this.$parent.queryClickType('addNew', 'edit', this.confId)
      },
      handledelDetails() {
        let params = {
          projectCode: this.$store.state.projectCode,
          confId: this.confId,
        }
        elecStealingconfigdel(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: this.$t('deleteSuccessful'),
            })
            this.$emit('back', 'index')
            this.$parent.handleElecStealingconfiglist()
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
    },
  }
</script>
<style lang="less">
  .stealingElectricitydetail {
    .ivu-form-item-label {
      color: #999999 !important;
    }
    .back {
      cursor: pointer;
      color: #999999;
    }
    .information {
      header {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
