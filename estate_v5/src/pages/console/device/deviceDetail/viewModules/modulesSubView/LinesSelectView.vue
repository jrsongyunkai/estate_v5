<template>
  <div class="select-lines">
    <div class="top">
      <div class="title">{{ $t('channelList') }}</div>
      <div class="op-btn">
        <Button type="success" :disabled="operateLines.length === 0" ghost @click.stop="handleChannelsOC(false)">{{ $t('oneButtonOff') }}</Button>
        <Button type="error" :disabled="operateLines.length === 0" ghost class="ml-5" @click.stop="handleChannelsOC(true)">{{ $t('oneButtonOn') }}</Button>
      </div>
    </div>
    <div class="content">
      <div class="all-check">
        <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">{{ $t('selectAll') }}</Checkbox>
      </div>
      <CheckboxGroup v-model="checkAllGroup">
        <div v-for="op in lines" :key="op.addr" class="label-item" :class="{ active: currentAddr === op.addr }">
          <Checkbox :label="op.addr" :disabled="!op.isSupportOc"><span></span></Checkbox>
          <div class="label-item-content" @click.stop.prevent="setCurrentAddr(op)">
            <div class="title-label" v-textRoll>{{ `${op.title}(${op.mac}- ${op.addr.toString().padStart(2, '0')} )` }}</div>
            <div class="status-label" v-if="op.isSupportOc">
              <span class="status" :class="op.oc ? 'close' : 'open'">{{ op.oc ? $t('closing') : $t('opening') }}</span>
            </div>
            <div class="edit-label" @click.stop.prevent="editAddrRow(op)">
              <span class="edit-icon"><Icon custom="icon-v5 icon-v5-xiugai" size="14"></Icon></span>
            </div>
          </div>
        </div>
      </CheckboxGroup>
    </div>
    <BatchOcAlarmTips ref="batchOcAlarmTips" @commitOK="handleChannelsOcPost" />
  </div>
</template>

<script>
  import { updateNodeTitle, queryChannels, changeStatus2 } from '@/api/public'
  import BatchOcAlarmTips from '../common/BatchOcAlarmTips.vue'
  import { isAlarmStatus } from '@/api/control'
  import { retry } from '@utils/common'
  import { mapMutations } from 'vuex'
  export default {
    name: 'LinesSelectView',
    components: { BatchOcAlarmTips },
    inject: ['rowDeviceInfo'],
    data() {
      return {
        deviceInfo: this.rowDeviceInfo,
        lines: [],
        checkAll: false,
        checkAllGroup: [],
        currentAddr: null,
        editValue: '',
        editAddrInfo: null,
        cancelRetry: null,
      }
    },
    computed: {
      indeterminate() {
        return this.checkAllGroup.length > 0 && this.checkAllGroup.length < this.lines.length
      },
      operateLines() {
        return this.checkAllGroup.length ? this.lines.filter(it => this.checkAllGroup.includes(it.addr) && it.others.online === 1 && (it.lineType === '220' || it.lineType === '380')) : []
      },
    },
    methods: {
      ...mapMutations('device', ['setDeviceAddr']),
      async getAddrs() {
        let params = { mac: this.deviceInfo.mac, pageNo: 1, pageSize: 99999 }
        let res = await queryChannels(params)
        if (res.success) {
          this.lines = res.datas
          if (this.lines.length > 0) {
            if (this.currentAddr) {
              let index = this.lines.findIndex(item => item.addr === this.currentAddr)
              if (index > -1) {
                this.setCurrentAddr(this.lines[index])
              } else {
                this.setCurrentAddr(this.lines[0])
              }
            } else {
              this.setCurrentAddr(this.lines[0])
            }
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleCheckAll() {
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false
        this.checkAllGroup = this.checkAll ? this.lines.filter(op => op.isSupportOc).map(it => it.addr) : []
      },
      setCurrentAddr(info) {
        this.currentAddr = info.addr
        this.setDeviceAddr(info.addr)
        this.$emit('nodeClick', info)
      },
      editAddrRow(op) {
        this.editValue = op.title
        this.editAddrInfo = op
        this.$Modal.confirm({
          title: this.$t('editName'),
          icon: false,
          render: h => {
            return h('Input', {
              props: { value: this.editValue, autofocus: true, placeholder: this.$t('enterLineName') },
              on: {
                input: val => {
                  this.editValue = val
                },
              },
            })
          },
          onOk: async () => {
            if (!this.editValue) {
              this.$Message.error({ content: this.$t('enterLineName') })
              return false
            } else {
              let res = await updateNodeTitle({ mac: this.deviceInfo.mac, nodeNo: this.editAddrInfo.addr, title: this.editValue })
              if (res.success) {
                this.cancelRetry && this.cancelRetry()
                this.cancelRetry = retry(this.getAddrs, 0, 3000, false)
                this.$Message.success({ content: this.$t('submitCommand') })
              } else {
                this.$Message.error({ content: res.message })
              }
            }
          },
          onCancel: () => {
            this.editValue = ''
            this.editAddrInfo = null
          },
        })
      },
      async handleChannelsOC(type) {
        const params = [{ mac: this.deviceInfo.mac, addrOptInfos: [{ onOrOff: type, addrs: this.operateLines.map(item => item.addr) }] }]
        const res = await isAlarmStatus(params)
        if (res.success) {
          if (res.data.length > 0) {
            this.$refs.batchOcAlarmTips.openModal(res.data, type, params)
          } else {
            this.$Modal.confirm({
              title: this.$t('tip'),
              content: type ? this.$t('sureOneButtonOn') : this.$t('sureOneButtonOff'),
              onOk: () => {
                this.handleChannelsOcPost(params)
              },
              onCancel: () => {
                this.$Message.info({ content: this.$t('canceled') })
              },
            })
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleChannelsOcPost(params) {
        const res = await changeStatus2(JSON.stringify(params))
        if (res.code === '0') {
          this.cancelRetry && this.cancelRetry()
          this.cancelRetry = retry(this.getAddrs, 2, 2000, false)
          this.$Message.success(this.$t('submitCommand'))
        } else {
          this.$Message.error(res.message)
        }
        this.checkAllGroup = []
      },
    },
    mounted() {
      this.currentAddr = this.$store.state.device.currentAddr
      this.getAddrs()
    },
    watch: {
      checkAllGroup: {
        handler(val) {
          this.checkAll = val.length === this.lines.length
        },
        deep: true,
      },
    },
    beforeDestroy() {
      this.cancelRetry && this.cancelRetry()
    },
  }
</script>

<style lang="less" scoped>
  .select-lines {
    width: 100%;
    height: 100%;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      .title {
        font-size: 16px;
        color: #fff;
        font-weight: 600;
      }
      .op-btn {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        /deep/ .ivu-btn-ghost[disabled] {
          color: #999;
        }
        .ml-5 {
          margin-left: 5px;
        }
      }
    }
    .content {
      height: calc(~'100% - 38px');
      overflow: auto;
      .all-check {
        padding-left: 10px;
        padding-bottom: 10px;
      }
      .label-item {
        width: 100%;
        height: 40px;
        padding-left: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .label-item-content {
          display: flex;
          align-items: center;
          height: 40px;
          width: calc(~'100% - 30px');
          cursor: pointer;
          .title-label {
            width: 100%;
            height: 40px;
            line-height: 40px;
          }
          .status-label {
            flex-shrink: 0;
            margin-left: 5px;
            .status {
              width: 60px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              border-radius: 2px;
              color: #fff;
              padding: 2px 4px;
              font-size: 12px;
              &.open {
                background: rgba(0, 200, 83, 0.3);
                color: #00c853;
              }
              &.close {
                background: rgba(255, 61, 0, 0.3);
                color: rgb(255, 61, 0);
              }
            }
          }
          .edit-label {
            flex-shrink: 0;
            margin-left: 5px;
            width: 15px;
            span {
              display: none;
              cursor: pointer;
              color: #007eff;
              font-size: 14px;
            }
          }
        }
        &:hover,
        &:active {
          background: rgba(2, 167, 240, 0.2);
          color: rgb(2, 167, 240);
        }
        &:hover {
          .edit-label {
            span {
              display: inline-block;
            }
          }
        }
      }
      .label-item.active {
        background: rgba(2, 167, 240, 0.2);
        color: rgb(2, 167, 240);
      }
    }
  }
</style>
