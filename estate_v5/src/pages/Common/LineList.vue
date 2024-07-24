<template>
  <Row class="row">
    <div class="checkbox-group">
      <Checkbox :indeterminate="isIndeterminate" v-model="checkAll" @on-change="handleCheckAllChange">{{ $t('selectAll') }}</Checkbox>
      <div style="margin: 15px 0"></div>
      <CheckboxGroup v-model="checkedLines" @on-change="handleCheckedLinesChange">
        <Checkbox v-for="(item, index) in lines" :label="item.addr + '-' + item.title" :key="index" :disabled="item.disable">{{ item.title }}</Checkbox>
      </CheckboxGroup>
    </div>
    <Row class="mt-20" v-if="source === 'BuiltInTiming'">
      <Col :span="22" v-show="false">
        <Button style="float: right" class="mr-20" @click="handleBuiltInTimingBack">{{ $t('back') }}</Button>
      </Col>
      <Col :span="24" class="tr">
        <Button class="fr" :disabled="checkedLines.length === 0" type="primary" @click="handleBuiltInTimingSave">{{ $t('save') }}</Button>
      </Col>
    </Row>
    <Row class="mt-20" v-if="source === 'DetectionRules'">
      <Col :span="22" style="text-align: right">
        <Button style="float: right" class="mr-20" @click="handleBack">{{ $t('back') }}</Button>
      </Col>
      <Col :span="22">
        <Button :disabled="checkedLines.length === 0" type="primary" @click="handleSave">{{ $t('save') }}</Button>
      </Col>
    </Row>
  </Row>
</template>
<script>
  import { queryChannels, saveDeStatuscanConfDetail } from '@/api/common'
  export default {
    props: {
      mac: { type: String, default: '' },
      source: { type: String, default: '' },
      tags: { type: [Object, Array] },
      lineShowTags: { type: [Array] },
    },
    data() {
      return {
        checkedLines: [],
        checkAll: false,
        isIndeterminate: true,
        lines: [],
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        if (this.mac) {
          this.queryList()
        } else {
          const lineLists = [...Array(29).keys()].map(item => {
            return { addr: item + 1, title: item === 0 ? this.$t('mainRoad') : this.$t('line') + item }
          })
          this.lines = lineLists
        }
      },
      async queryList() {
        const res = await queryChannels({ mac: this.mac })
        if (res.success) {
          let lineStr = ''
          this.lines = res.datas
          this.checkedLines = this.tags.map(item => {
            return item.addr + '-' + item.title
          })
          lineStr = this.checkedLines[0].split('-')[0]
          res.datas.forEach(val => {
            if (val.addr === Number(lineStr)) {
              if (val.lineType === 'IO') {
                this.lines.forEach(v => {
                  if (v.lineType === 'IO') {
                    v['disable'] = false
                  } else {
                    v['disable'] = true
                  }
                })
              } else {
                this.lines.forEach(v => {
                  if (v.lineType !== 'IO') {
                    v['disable'] = false
                  } else {
                    v['disable'] = true
                  }
                })
              }
            }
          })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleCheckAllChange(val) {
        this.checkedLines = val ? this.lines.map(item => item.addr + '-' + item.title) : []
        this.isIndeterminate = false
      },
      handleCheckedLinesChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.lines.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.lines.length
      },
      async handleSave() {
        let chnls = []
        let chnlNames = []
        let val = null
        this.checkedLines.map(item => {
          val = item.split('-')
          chnls.push(val[0])
          chnlNames.push(val[1])
        })
        let params = { mac: this.mac ? this.mac : 'all', ruleId: this.$store.state.ruleId, chnls: chnls.join(','), chnlNames: chnlNames.join('，') }
        const res = await saveDeStatuscanConfDetail(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('savedSuccessfully') })
          this.$parent.$parent.handleLineClose()
          this.$parent.$parent.handleLineListClose()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleBack() {
        this.$parent.$parent.handleLineClose()
      },
      handleBuiltInTimingSave() {
        let channel = []
        let val = null
        this.checkedLines.map(item => {
          val = item.split('-')
          channel.push({ addr: val[0], title: val[1] })
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
