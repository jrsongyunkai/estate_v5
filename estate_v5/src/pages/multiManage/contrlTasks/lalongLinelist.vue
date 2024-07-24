<template>
  <Row class="row">
    <div class="checkbox-group">
      <Checkbox :indeterminate="isIndeterminates" v-model="checkAll" @on-change="handleCheckAllChange">{{ $t('selectAll') }}</Checkbox>
      <div style="margin: 15px 0"></div>
      <Checkbox v-for="(item, index) in lines" v-model="item.checked" :key="index" :disabled="item.disabled" @on-change="handleCheckedChange($event, item)">{{ item.title }}</Checkbox>
    </div>
    <Row class="mt-20" v-if="source === 'BuiltInTiming'">
      <Col :span="22" v-show="false">
        <Button style="float: right" class="mr-20" @click="handleBuiltInTimingBack">{{ $t('back') }}</Button>
      </Col>
      <Col :span="24" class="tr">
        <Button class="fr" :disabled="checkdisAble" type="primary" @click="handleBuiltInTimingSave">{{ $t('save') }}</Button>
      </Col>
    </Row>
    <Row class="mt-20" v-if="source === 'DetectionRules'">
      <Col :span="22" style="text-align: right">
        <Button style="float: right" class="mr-20" @click="handleBack">{{ $t('back') }}</Button>
      </Col>
      <Col :span="22">
        <Button :disabled="checkdisAble" type="primary" @click="handleSave">{{ $t('save') }}</Button>
      </Col>
    </Row>
  </Row>
</template>
<script>
  import { queryChannels, saveDeStatuscanConfDetail } from '@/api/common'
  export default {
    props: {
      mac: {
        type: String,
        default() {
          return ''
        },
      },
      source: {
        type: String,
        default() {
          return ''
        },
      },
      tags: {
        type: [Object, Array],
      },
      lineShowTags: {
        type: [Array],
      },
    },
    data() {
      return {
        checkAll: false,
        isIndeterminate: true,
        lines: [],
      }
    },
    mounted() {
      this.init()
    },
    computed: {
      isIndeterminates() {
        return this.lines.filter(item => item.checked).length !== 0 && this.lines.filter(item => item.checked).length !== this.lines.length
      },
      checkdisAble() {
        return this.lines.filter(item => item.checked).length === 0
      },
    },
    methods: {
      init() {
        if (this.mac) {
          this.queryList()
        } else {
          const lineLists = [...Array(29).keys()].map(item => {
            return { addr: item + 1, title: item === 0 ? this.$t('mainRoad') : this.$t('line') + item, checked: false, disabled: false }
          })
          this.lines = lineLists
        }
      },
      queryList() {
        queryChannels({ mac: this.mac }).then(res => {
          if (res.success) {
            let newAddr = Array.isArray(this.tags) && this.tags.length && this.tags.map(item => +item.addr)
            this.lines = res.datas.map(item => ({ addr: item.addr, lineType: item.lineType, title: item.title, checked: Array.isArray(newAddr) && newAddr.length && newAddr.includes(item.addr), disabled: false, digitalOuts: item.lineType === 'IO' ? item.digitalOuts : '' }))
          } else if (res.code === '-1') {
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleCheckedChange(val, item) {
        if (val) {
          this.lines.forEach(v => {
            if (v.addr !== item.addr && item.lineType === 'IO') {
              v.checked = false
              v.disabled = true
            }
            if (item.lineType !== 'IO' && v.lineType === 'IO') {
              v.disabled = true
              v.checked = false
            }
          })
        } else {
          if (this.lines.filter(item => item.checked).length === 0) {
            this.lines.forEach(v => {
              v.disabled = false
            })
          }
        }

        this.checkAll = this.lines.filter(item => item.checked).length === this.lines.length
      },
      handleCheckAllChange(val) {
        this.lines.forEach(item => {
          if (val && item.lineType === 'IO') {
            item.disabled = true
            item.checked = false
          } else {
            item.disabled = false
            item.checked = val
          }
          if (!val) {
            item.disabled = false
          }
        })
        // let datas = []
        // if (val) this.lines.map((item) => { datas.push(item.addr + '-' + item.title) })
        // this.checkedLines = val ? datas : []
        // this.isIndeterminate = false
      },
      handleSave() {
        let chnls = []
        let chnlNames = []
        this.lines
          .filter(item => item.checked)
          .map(item => {
            chnls.push(item.addr)
            chnlNames.push(item.title)
          })
        let params = {
          mac: this.mac ? this.mac : 'all',
          ruleId: this.$store.state.ruleId,
          chnls: chnls.join(','),
          chnlNames: chnlNames.join('，'),
        }
        saveDeStatuscanConfDetail(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: this.$t('savedSuccessfully'),
            })
            this.$parent.$parent.handleLineClose()
            this.$parent.$parent.handleLineListClose()
          } else if (res.code === '-1') {
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleBack() {
        this.$parent.$parent.handleLineClose()
      },
      handleBuiltInTimingSave() {
        let channel = []
        this.lines
          .filter(item => item.checked)
          .map(item => {
            channel.push(item)
          })
        this.$emit('sendChannels', channel)
      },
      handleBuiltInTimingBack() {
        let channel = []
        this.$emit('sendChannels', channel)
      },
    },
  }
</script>
<style lang="less" scoped>
  .row {
    display: flex;
    flex-direction: column;
  }
  .checkbox-group {
    .CheckboxGroup {
      label {
        width: calc(17.4% - 30px);
        margin-left: 0;
        &:nth-child(6n) {
          width: auto;
        }
      }
    }
  }
  .tr {
    Button {
      margin: 5px;
    }
  }
</style>
