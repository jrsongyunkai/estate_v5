<template>
  <div class="marginal">
    <div class="pointer mar-bot" @click="backLinkage">{{ '<' }}{{ $t('back') }}</div>
    <Row :gutter="16" style="margin-top: 10px">
      <!-- <Col :span="4">
        <Anchor show-ink container=".newAddcontent">
          <div class="bgColor ruleAnchor">
            <AnchorLink href="#information" title="基本信息" />
            <AnchorLink href="#configuration" title="条件配置" />
            <AnchorLink href="#cycleperiod" title="执行配置" />
          </div>
        </Anchor>
      </Col> -->
      <Col flex="260px" class="porelation">
        <navigationVue ref="naviGationRefs" @customScroll="customScroll" class="posiFixds" :stepArr="stepArrMargnal"></navigationVue>
      </Col>
      <Col flex="auto">
        <div v-if="!isShowPage" class="discenter"><Icon custom="icon-v5 icon-v5-loading-full" class="ivu-anim-loop" size="50" /></div>
        <div class="newAddcontent" v-if="isShowPage">
          <template>
            <div class="inform bgColor" id="information" @click="getStepClick('one')">
              <a href="#information"></a>
              <h3>{{ $t('baseInfo') }}</h3>
              <MarginalInfo ref="marginalInfoRef" :rowEditData="rowEditData" :allMacLineport="allMacLineport" @deleteConfig="deleteConfig" @getLineList="getLineList" :editData="propsDetailsData" />
            </div>
          </template>
          <template>
            <div class="inform bgColor" id="configuration" @click="getStepClick('two')">
              <h3>{{ $t('conditionConfig') }}</h3>
              <div class="tips">
                <Icon color="#02a7f0" size="24" type="ios-information-circle" class="ml-10" />
                <span class="ml-10">{{ $t('conditionGroupTips') }}</span>
              </div>
              <ConditionConfiguration ref="conditonConfig" :rowEditData="rowEditData" :alarmsList="alarmsList" :allMacLineport="allMacLineport" :editData="propsDetailsData" />
            </div>
          </template>
          <template>
            <div class="inform bgColor" id="cycleperiod" @click="getStepClick('three')">
              <h3>{{ $t('executeConfiguration') }}</h3>
              <ExecutionConfiguration ref="excutionConfig" :rowEditData="rowEditData" :allMacLineport="allMacLineport" :alarmsList="alarmsList" :editData="propsDetailsData" />
            </div>
          </template>
        </div>
      </Col>
    </Row>
    <div class="pd-l50" v-if="isShowPage">
      <Button type="primary" ghost @click="saveAllConfig">{{ $t('save') }}</Button>
      <Button @click="backLinkage" class="marl-10">{{ $t('cancel') }}</Button>
    </div>
  </div>
</template>
<script>
  import navigationVue from '../../latlongTimer/navigationVue.vue'
  import MarginalInfo from './marginalInfo.vue'
  import ConditionConfiguration from './conditionConfiguration'
  import ExecutionConfiguration from './executionConfiguration'
  import { queryAlarmForConfig } from '@/api/multiManage/builtlnTimer'
  import get from 'lodash/get'
  import { saveBaseInfo, saveConditon, saveAction, getDetail, getDeviceList } from '@api/multiManage/linkagePro'
  import dayjs from 'dayjs'
  export default {
    components: {
      MarginalInfo,
      ConditionConfiguration,
      ExecutionConfiguration,
      navigationVue,
    },
    props: {
      rowEditData: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        stepArrMargnal: [
          { title: this.$t('baseInfo'), step: 'one' },
          { title: this.$t('conditionConfig'), step: 'two' },
          { title: this.$t('executeConfiguration'), step: 'three' },
        ],
        isShowPage: false,
        alarmsList: [],
        resIds: '',
        propsDetailsData: {},
        allMacLineport: [],
      }
    },
    created() {
      this.getAllAlarmConfig()
      if (this.rowEditData.isEdit) {
        this.getEditDetails()
      } else {
        this.isShowPage = true
        this.getAllMacLinePort()
      }
    },
    mounted() {
      // document.getElementsByClassName('ivu-anchor-ink-ball')[0].style.top = '30px'
    },
    methods: {
      getStepClick(item) {
        this.$refs.naviGationRefs.isClick = item
      },
      customScroll(val) {
        if (['one', 'two'].includes(val)) {
          window.scrollTo({
            top: val === 'one' ? 0 : val === 'two' ? 200 : 400,
            behavior: 'smooth',
          })
        } else {
          document.getElementsByClassName('marginal')[0].scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      },
      async getEditDetails() {
        const param = {
          projectCode: this.$store.state.projectCode,
          sceneId: this.rowEditData.sceneId,
        }
        const { message, success, data } = await getDetail(param)
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }
        this.propsDetailsData = data
        // 获取所有设备
        this.getAllMacLinePort()

        // console.log('🚀 ~ file: marginal.vue:115 ~ getEditDetails ~ this.propsDetailsData:', this.propsDetailsData)
      },
      async getAllMacLinePort() {
        const params = {
          projectCode: this.$store.state.projectCode,
          equipmentTypes: 'all',
          pageSize: 9999,
          pageNo: 1,
        }
        const res = await getDeviceList(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        if (!this.isShowPage) {
          this.isShowPage = true
        }
        this.allMacLineport = res.datas
      },
      backLinkage() {
        this.$emit('changePageMode', 'index')
      },
      deleteConfig() {
        this.$refs.conditonConfig.deleteConfig()
      },
      getLineList(val) {
        this.$refs.conditonConfig.getLinePortLists(val)
        this.$refs.excutionConfig.getLineType(val)
        this.resIds = val.resId
      },
      async getAllAlarmConfig() {
        const { data, success, message } = await queryAlarmForConfig({ projectCodes: this.$store.state.projectCode })
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }
        const alarmsList = get(data.customs[0], 'alarms', [])
        const customList = alarmsList.map(v => ({ value: `${v.id}`, label: v.name }))
        this.alarmsList = [
          {
            value: 'alarms',
            label: this.$t('alarm'),
            children: data.alarms.map(v => ({ value: v.typeNumber, label: v.info })).filter(v => v.value !== '1015'),
          },
          {
            value: 'warns',
            label: this.$t('earlyWarning'),
            children: data.warns.map(v => ({ value: v.typeNumber, label: v.info })),
          },
          {
            value: 'customs',
            label: this.$t('customAlarm'),
            children: customList,
          },
        ]
      },
      async saveAllConfig() {
        // 基本信息操作
        const { name, describe, linkageMode, triggerMode, status, takeEffectMode, timer, daysList, takeEffectTimer, linkResId, infinityTime } = this.$refs.marginalInfoRef.formValidate
        const isMarginalType = linkageMode === 'marginal' // 是否为边缘端
        const sceneId = this.rowEditData.isEdit ? this.rowEditData.sceneId : 0
        const resCode = this.$store.state.projectCode
        const newTimeList = infinityTime.filter(v => !!v.length).map(v => `${v[0]}~${v[1]}`)
        // console.log('🚀 ~ file: marginal.vue:121 ~ saveAllConfig ~ newTimeList:', newTimeList)
        const filterDay = daysList
          .filter(v => v.checked)
          .map(v => v && v.label)
          .join(',')
        const timeRanges = isMarginalType ? `${takeEffectTimer[0]}~${takeEffectTimer[1]}` : newTimeList.join(',')
        if ((takeEffectMode === '3' && !filterDay.length) || !name || (isMarginalType && !takeEffectTimer.length) || (takeEffectMode === '1' && !timer)) {
          return this.$Message.error({
            content: this.$t('pleaseCompleteBasicInfo'),
          })
        }
        const { delayExecSecond, exeFrequency, repeatExecIntervalSecond, repeatNum, statusExcute } = this.$refs.excutionConfig.dalayTimeObj
        const baseParams = {
          sceneId,
          resCode,
          name,
          linkResId: isMarginalType ? linkResId || this.resIds : 0,
          remark: describe,
          linkageMode: isMarginalType ? 1 : 2,
          triggerMode,
          status: status ? 1 : 2,
          loopMode: takeEffectMode,
          loopCycle: takeEffectMode === '2' ? '' : takeEffectMode === '1' ? dayjs(timer).format('YYYY-MM-DD') : filterDay,
          timeRanges,
          delayExecSecond: statusExcute ? delayExecSecond : 0,
          repeatExecTimes: repeatNum,
          repeatExecIntervalSecond,
          exeFrequency: isMarginalType ? 0 : exeFrequency,
        }
        let conditionList
        let condiArr = []
        if (isMarginalType) {
          // 边缘端情况
          conditionList = this.$refs.conditonConfig.marginalObj
          if (!linkResId) {
            return this.$Message.error({
              content: this.$t('pleaseSelectConfigObjectFirst'),
            })
          }
        } else {
          // 云端
          conditionList = this.$refs.conditonConfig.cloudsObj
        }
        conditionList.forEach(v => {
          let itemData = {}
          itemData.name = v.groupLetter
          itemData.subGroupList = v.conditionList.map(j => {
            const type = j.conditionType === '1' // 是否为状态条件
            const logicCompare = type ? '' : j.conditionalType
            let statusConfList = j.children.map(itms => {
              let port
              if (type) {
                port = (itms.conditionPort && `${itms.conditionPort}`.includes('dig') ? itms.conditionPort.substr(10) : itms.conditionPort) || ''
              } else {
                port = itms.conditionPort
              }
              const addrPort = `${itms.conditionAddr || 0}${itms.conditionPort ? '^' + port : ''}`
              const isAlarmStatus = itms.conditionStatusType === 'alarmStatus' && itms.conditionStatusValueList.length === 0
              let newAlarmValue
              if (isAlarmStatus) {
                newAlarmValue = itms.alarmValue.includes('customs') ? `1015-${itms.alarmValue[1]}` : itms.alarmValue[1]
              }
              const typeValueClouds = isAlarmStatus ? newAlarmValue : itms.conditionStatusValue
              // console.log('🚀 ~ file: marginal.vue:252 ~ statusConfList ~ itms.alarmValue:', newAlarmValue)
              return {
                resId: isMarginalType ? linkResId || this.resIds : itms.resId,
                addrPort,
                type: type ? itms.conditionStatusType : isMarginalType ? itms.conditionValueType : itms.conditionNumType,
                value: isMarginalType ? '' : type ? typeValueClouds : '',
                correctType: type ? '' : isMarginalType ? itms.conditionFactor : itms.conditionCloudsFactor,
                correctFactor: type ? '' : isMarginalType ? itms.factorValue : itms.factorCloudsValue,
              }
            })

            return {
              itemType: type ? 'status' : 'number',
              logicType: j.conditional,
              logicValue: type ? j.conditionalType : j.conditonDetermineValue,
              logicCompare,
              statusConfList: type ? statusConfList : [],
              numberConfList: type ? [] : statusConfList,
            }
          })
          condiArr.push({ ...itemData })
        })
        let actionList
        let newActionPa = []
        let margnalActionpa = []
        if (isMarginalType) {
          // 边缘端
          actionList = this.$refs.excutionConfig.formValidate
          const excuteDevice = this.$refs.excutionConfig.excuteDeviceObj
          //
          margnalActionpa = actionList.map(v => {
            return {
              resId: linkResId,
              // Todo 待添加
              addrPort: excuteDevice.excuteLine.join('-') + '^' + v.conditionPort,
              type: v.conditionStatusType,
              subType: v.conditionEvent,
              value: v.modifyValue,
              deviceType: excuteDevice.deviceType,
            }
          })
        } else {
          // 云端
          actionList = this.$refs.excutionConfig.actionList
          newActionPa = actionList.map(v => {
            // 如果支持多选v.conditionStatusType则为数组需改为循环subtr
            // const port = v.portValue ? v.conditionStatusType.substr(v.conditionStatusType.length - 1) : ''
            const isModify = v.conditionEvenType === 'modifyParam'
            const eventCloudValue = v.conditionEvenType === 'generateAlarm' ? (v.eventValue[0] === 'customs' ? `1015-${v.eventValue[1] || '0'}` : v.eventValue[1]) : ''
            return {
              resType: v.resType, // 此参数为多传，为下面校验判断用，后端无用
              equipmentType: v.equipmentType,
              resId: v.resId,
              addrPort: `${v.lineValue || 0}${v.portValue ? '^' + v.portValue : ''}`,
              type: v.conditionEvenType,
              subType: ['downCmd', 'modifyParam'].includes(v.conditionEvenType) ? v.actionValue : '',
              value: isModify || (v.equipmentType === 33 && v.conditionEvenType !== 'generateAlarm') ? v.modifyValue : v.conditionEvenType === 'generateAlarm' ? eventCloudValue : '',
            }
          })
          console.log(newActionPa, 'newActionPa')
        }
        let actionSting = isMarginalType ? margnalActionpa : newActionPa
        // 执行动作非空校验
        // let isNull = actionSting.some(v => !v.type || !v.resId || (isMarginalType && !v.addrPort.split('^')[1]) || (v.type !== 'cancelAlarm' && (!v.subType || !v.value) && v.equipmentType === 33) || !v.addrPort || (v.type === 'modifyParam' && !v.value))
        const objMap1 = {
          hasResId: v => !v.resId,
          hasPort: v => !v.addrPort.split('^')[1],
          hasAddr: v => !v.addrPort,
        }
        const typeMap = {
          downCmd: v => (v.equipmentType === 33 ? !v.subType || !v.value : !v.subType),
          modifyParam: v => !v.subType || !v.value,
          generateAlarm: v => (isMarginalType ? !v.subType : !v.value),
          cancelAlarm: v => !v.type,
        }
        let isNull = actionSting.some(v => {
          let objType = isMarginalType ? 'hasPort' : v.resType
          return objMap1[objType](v) || typeMap[v.type](v)
        })
        if (isNull) {
          return this.$Message.error({
            content: this.$t('pleaseCompleteTheActionSequence'),
          })
        }
        // -------------------------
        const infoData = await saveBaseInfo(baseParams)
        if (!infoData.success) {
          return this.$Message.error({
            content: infoData.message,
          })
        }
        const addNewsceneId = infoData.data.sceneId
        // 条件参数
        const conditionParms = {
          projectCode: resCode,
          sceneId: this.rowEditData.isEdit ? this.rowEditData.sceneId : addNewsceneId,
          conditionGroupStr: JSON.stringify(condiArr),
        }
        const conditionData = await saveConditon(conditionParms)
        if (!conditionData.success) {
          return this.$Message.error({
            content: conditionData.message,
          })
        }
        // 动作参数
        const actionParams = {
          projectCode: resCode,
          sceneId: this.rowEditData.isEdit ? this.rowEditData.sceneId : addNewsceneId,
          actionStr: JSON.stringify(actionSting),
        }
        const actionData = await saveAction(actionParams)
        if (!actionData.success) {
          return this.$Message.error({
            content: actionData.message,
          })
        }
        // 失败情况

        this.$Message.success({
          content: this.$t('savedSuccessfully'),
        })
        this.backLinkage()
      },
    },
  }
</script>
<style lang="less">
  .mar-bot {
    position: fixed;
    z-index: 19;
  }
  .marginal {
    .posiFixds {
      position: fixed;
      width: 240px;
      top: 160px;
    }
    .discenter {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .pd-l50 {
      padding-left: 260px;
    }
    .marl-10 {
      margin-left: 10px;
    }
    .mart-10 {
      margin: 10px;
    }
    .ivu-anchor-ink {
      position: absolute;
      height: 100%;
      left: 20px;
      top: 0;
      padding: 28px 0px 40px 0px;
    }
    .ivu-radio-checked .ivu-radio-inner:after {
      opacity: 1;
      transform: scale(1);
      transition: all 0.2s ease-in-out;
    }
    .ivu-radio-disabled .ivu-radio-inner:after {
      background-color: #cccccc !important;
    }
    .ivu-anchor-link {
      font-size: 16px;
      padding: 8px 0 18px 16px;
    }
    .bgColor {
      background: #1a202e;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 10px;
      color: #c7c9cc;
      .tips {
        border: 1px solid #02a7f0;
        background: rgba(2, 167, 240, 0.1);
        padding: 8px;
        color: #02a7f0;
        border-radius: 5px;
        display: flex;
        align-items: center;
      }
      h3 {
        margin-bottom: 10px;
      }
      .ivu-steps .ivu-steps-head-inner {
        width: 38px;
        height: 38px;
        line-height: 38px;
      }
      .ivu-steps-status-process {
        line-height: 48px;
      }
      .ivu-steps-item {
        height: 100px;
      }
      .ivu-steps-tail {
        left: 19px;
        top: 18px;
        height: 80%;
        i {
          width: 2px;
          background: #195896;
        }
      }
      .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
        border-color: #02a7f0;
        background-color: #02a7f0;
      }
    }
  }
</style>
