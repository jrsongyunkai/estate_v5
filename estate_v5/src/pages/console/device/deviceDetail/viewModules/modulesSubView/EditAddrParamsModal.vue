<template>
  <Modal :title="$t('parameterConfiguration')" width="75%" class-name="dialog-conversion-content" :close-on-click-modal="false" :modal="false" v-model="editNameUnitFlag">
    <div>
      <h4 class="title-nameEdit" style="margin-bottom: 15px">
        <span class="boder-blue"></span>
        {{ $t('config808') }}
      </h4>
      <Row style="padding: 15px">
        <Col :span="6">
          {{ $t('delayJudgment') }}（S）：
          <span style="position: relative">
            <InputNumber style="width: 140px" size="small" :min="0" v-model="modelFormData.timeTrig" :placeholder="$t('pleaseEnter')"></InputNumber>
          </span>
          <Tooltip placement="top" max-width="300" transfer>
            <Icon color="#007EFF" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
            <div slot="content" style="white-space: normal">{{ $t('normalTips1') }}</div>
          </Tooltip>
        </Col>
        <Col :span="6">
          {{ $t('communicationDelay') }}（S）：
          <span style="position: relative">
            <InputNumber style="width: 140px" size="small" :min="0" v-model="modelFormData.timeDly" :placeholder="$t('pleaseEnter')"></InputNumber>
          </span>
          <Tooltip placement="top" max-width="300" transfer>
            <Icon color="#007EFF" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
            <div slot="content" style="white-space: normal">{{ $t('autoDelayTips') }}</div>
          </Tooltip>
        </Col>
        <Col :span="6">
          {{ $t('jogDelay') }}（S）：
          <span style="position: relative">
            <InputNumber style="width: 140px" size="small" :min="0" v-model="modelFormData.timeJog" :placeholder="$t('pleaseEnter')"></InputNumber>
          </span>
          <Tooltip placement="top" max-width="300" transfer>
            <Icon color="#007EFF" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
            <div slot="content" style="white-space: normal">{{ $t('stayDelay') }}</div>
          </Tooltip>
        </Col>
        <Col :span="6">
          {{ $t('analogSmoothing') }}（S）：
          <InputNumber :min="0" v-model="modelFormData.filterCnt" size="small" style="width: 140px"></InputNumber>
          <Tooltip placement="top" max-width="300" transfer>
            <Icon color="#007EFF" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
            <div slot="content" style="white-space: normal">{{ $t('monitorTips1') }}</div>
          </Tooltip>
        </Col>
      </Row>
      <h4 class="title-nameEdit" style="margin-top: 15px">
        <span class="boder-blue"></span>
        {{ $t('switchQuantityName') }}
      </h4>
      <Row style="padding: 15px">
        <Col :span="12">
          <Row v-for="(item, index) in digitalInsList" :key="index" class="mr-20">
            <Col :span="12">
              <span>{{ $t('inputQuantity') }}{{ index + 1 }}</span>
              <Input v-model="item.name" size="small" class="wd-150" :placeholder="$t('pleaseEnter')"></Input>
            </Col>
          </Row>
        </Col>
        <Col :span="12">
          <Row v-for="(item, index) in digitalOutsList" :key="index" class="mr-20">
            <Col :span="12">
              <span>{{ $t('output') }}{{ index + 1 }}</span>
              <Input v-model="item.name" size="small" class="wd-150" :placeholder="$t('pleaseEnter')"></Input>
            </Col>
          </Row>
        </Col>
      </Row>
      <h4 v-if="analoginsList.length > 0" class="title-nameEdit">
        <span class="boder-blue"></span>
        {{ $t('unitConversion') }}
      </h4>
      <Row>
        <Col v-for="(item, index) in analoginsList" :key="`analogIns-${index}`" :span="6">
          <Row>
            <div class="moni-enter">{{ $t('analogInput') }}{{ index + 1 }}</div>
            <Col :span="24" class="moni-en">
              {{ $t('analogName') }}：
              <Input v-model="item.name" size="small" class="wd-190" :placeholder="$t('pleaseEnter')"></Input>
            </Col>
            <Col :span="24" class="moni-en disflex">
              {{ $t('acquisitionType') }}：
              <Select v-model="item.mode" class="wd-200" size="small" :placeholder="$t('selectAcquisitionType')" @on-change="changeModeUnit($event, item)">
                <Option v-for="item in acquisitionTypeList" :value="item.value" :key="item.value" :label="item.label"></Option>
              </Select>
            </Col>
            <Col :span="24" class="moni-en disflex">
              {{ $t('acquisitionUnit') }}：
              <Input :disabled="item.mode !== 0" class="wd-200" size="small" :placeholder="$t('pleaseEnter')" v-model="item.unit"></Input>
            </Col>
            <Col :span="24" class="moni-en">
              {{ $t('displayConversion') }}：
              <span style="margin-left: 5px">
                <InputNumber v-model="item.factorX" class="wd-60" size="small" :placeholder="$t('correctionFactor')"></InputNumber>
              </span>
              <span>
                <Icon type="md-close" size="14" style="margin-left: 7px" />
                {{ $t('acquisition') }}
                <Icon type="md-add" size="14" />
              </span>
              <span>
                <InputNumber v-model="item.factorY" class="wd-60" size="small" :placeholder="$t('correctionFactor')"></InputNumber>
              </span>
            </Col>
            <Col :span="24" class="moni-en">
              <span>{{ $t('displayValueUnit') }}:</span>
              <span style="margin-left: 15px">
                <Input v-model="item.convertUnit" size="small" class="wd-190" :placeholder="$t('pleaseEnter')"></Input>
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
    <div slot="footer">
      <Row type="flex" justify="end" :gutter="5">
        <Col>
          <Button type="default" size="small" @click="editNameUnitFlag = false">{{ $t('cancel') }}</Button>
        </Col>
        <Col>
          <Button type="primary" size="small" @click="addEditNameUnits">{{ $t('save') }}</Button>
        </Col>
      </Row>
    </div>
  </Modal>
</template>

<script>
  import { getChannelInOutConfig, setChannelInOutConfig } from '@/api/public'
  export default {
    props: {
      addrInfo: {
        type: Object,
        default: () => {},
      },
      deviceInfo: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        editNameUnitFlag: false,
        modelFormData: { timeTrig: null, timeDly: null, timeJog: null, filterCnt: null },
        digitalInsList: [],
        digitalOutsList: [],
        analoginsList: [],
        acquisitionTypeList: [
          { value: 0, label: this.$t('unitConversion'), units: '' },
          { value: 1, label: this.$t('temperature'), units: '℃' },
          { value: 2, label: this.$t('voltage'), units: 'V' },
          { value: 3, label: this.$t('current'), units: 'mA' },
        ],
      }
    },
    methods: {
      async openModal() {
        let params = { mac: this.deviceInfo.mac, addr: this.addrInfo.addr }
        const res = await getChannelInOutConfig(params)
        if (res.success) {
          let { digitalInNum, digitalOutNum, analogInNum, timeTrig, timeJog, filterCnt, timeDly, digitalIns, digitalOuts, analogIns, analogModes } = res.data
          this.modelFormData = { timeTrig, timeJog, filterCnt, timeDly }
          // 输入量
          if (Array.isArray(digitalIns) && digitalIns.length && digitalInNum <= digitalIns.length) {
            this.digitalInsList = digitalIns.filter((item, index) => index + 1 <= digitalInNum)
          } else {
            let newDigitalInsList = digitalIns || []
            for (let i = 0; i < digitalInNum; i++) {
              if (i > newDigitalInsList.length - 1) {
                newDigitalInsList[i] = { name: '' }
              }
            }
            this.digitalInsList = newDigitalInsList
          }
          // 输出量
          if (Array.isArray(digitalOuts) && digitalOuts.length && digitalOutNum <= digitalOuts.length) {
            this.digitalOutsList = digitalOuts.filter((item, index) => index + 1 <= digitalOutNum)
          } else {
            let newDigitalOutsList = digitalOuts || []
            for (let i = 0; i < digitalOutNum; i++) {
              if (i > newDigitalOutsList.length - 1) {
                newDigitalOutsList[i] = { name: '' }
              }
            }
            this.digitalOutsList = newDigitalOutsList
          }
          // 模拟输入量
          if (analogIns && analogInNum <= analogIns.length) {
            this.analoginsList = analogIns.filter((item, index) => index + 1 <= analogInNum)
          } else {
            let newAnaloginsList = analogIns || []
            for (let i = 0; i < analogInNum; i++) {
              if (i > newAnaloginsList.length - 1) {
                newAnaloginsList[i] = { name: '', factorX: 1, convertUnit: '', unit: '', factorY: 0, mode: '' }
              }
            }
            this.analoginsList = newAnaloginsList
          }
          this.analoginsList.forEach((v, i) => {
            v.mode = (analogModes && analogModes[i]) || 0
          })
          this.editNameUnitFlag = true
        } else {
          this.$message.error(res.message)
        }
      },
      changeModeUnit(val, item) {
        item.mode = val
        const unitValue = this.acquisitionTypeList.find(v => val === v.value)
        item.unit = unitValue ? unitValue.units : ''
      },
      async addEditNameUnits() {
        let showMessage = this.analoginsList.find(v => !v.unit)
        if (showMessage) {
          return this.$Message.error({ content: this.$t('enterCollectionValueUnit') })
        }
        let params = {
          mac: this.deviceInfo.mac,
          addr: this.addrInfo.addr,
          ...this.modelFormData,
          analogIns: this.analoginsList,
          digitalOuts: this.digitalOutsList,
          digitalIns: this.digitalInsList,
          analogModes: this.analoginsList.map(v => v.mode),
        }
        const res = await setChannelInOutConfig(params)
        if (res.success) {
          this.$parent.queryChannel()
          this.editNameUnitFlag = false
          this.$Message.success({ content: this.$t('modifySuccess') })
        } else {
          this.$Message.error({ content: res.data[0].errorMsg })
        }
      },
    },
  }
</script>

<style lang="less">
  .dialog-conversion-content {
    .title-nameEdit {
      padding: 5px;
      border-bottom: 1px solid #3d3d41;
    }
    .boder-blue {
      display: inline-block;
      border: 1px solid #007eff;
      width: 1px;
      height: 12px;
      padding-top: 3px;
      margin: 6px 8px 0 0;
    }
    .wd-150 {
      width: 160px;
      margin: 0 10px;
    }
    .moni-enter {
      color: #999999;
      padding: 15px;
    }
    .wd-200 {
      width: 195px;
    }
    .mr-20 {
      margin: 20px 0px;
    }
    .wd-190 {
      width: 190px;
    }
    .wd-60 {
      width: 50px;
    }
    .ivu-col {
      margin-bottom: 20px;
    }
  }
</style>
