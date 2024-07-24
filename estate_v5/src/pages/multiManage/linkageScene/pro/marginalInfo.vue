<template>
  <div class="marginalInfo">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="160">
      <FormItem :label="`${$t('linkageName')}:`" prop="name">
        <Input v-model="formValidate.name" :placeholder="$t('pleaseEnter')" style="width: 400px"></Input>
      </FormItem>
      <FormItem :label="`${$t('linkageRemark')}:`">
        <Input v-model="formValidate.describe" :placeholder="$t('pleaseEnter')" type="textarea" style="width: 400px"></Input>
      </FormItem>
      <FormItem :label="`${$t('linkageMode')}:`">
        <RadioGroup v-model="formValidate.linkageMode" @on-change="handleSelectmode">
          <Radio label="clouds" :disabled="rowEditData.isEdit">
            <span>{{ $t('cloud') }}</span>
            <Tooltip placement="top" max-width="470">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" class="ml-10" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('cloudTooltip2') }}</div>
            </Tooltip>
          </Radio>
          <Radio label="marginal" class="ml-20" :disabled="rowEditData.isEdit">
            <span>{{ $t('edge') }}</span>
            <Tooltip placement="top" max-width="470">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" class="ml-10" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('edgeTooltip') }}</div>
            </Tooltip>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem :label="`${$t('triggerMode')}:`">
        <RadioGroup v-model="formValidate.triggerMode" @on-change="getEventModeChange">
          <Radio label="2">
            <span>{{ $t('eventMode') }}</span>
            <Tooltip placement="top" max-width="160">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" class="ml-10" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('triggerOnce') }}</div>
            </Tooltip>
          </Radio>
          <Radio label="1" class="ml-20">
            <span>{{ $t('stateMode') }}</span>
            <Tooltip placement="top" max-width="160">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" class="ml-10" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('triggerContinuously') }}</div>
            </Tooltip>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem :label="`${$t('linkageState')}:`" prop="status">
        <Switch v-model="formValidate.status" />
      </FormItem>
      <FormItem :label="`${$t('effectiveTimePeriodCycleMode')}:`">
        <RadioGroup v-model="formValidate.takeEffectMode">
          <Radio label="1">
            <span>{{ $t('single') }}</span>
          </Radio>
          <Radio label="2" class="ml-20">
            <span>{{ $t('everyDay') }}</span>
          </Radio>
          <Radio label="3" class="ml-20">
            <span>{{ $t('weekly') }}</span>
          </Radio>
        </RadioGroup>
      </FormItem>

      <FormItem :label="`${$t('date')}:`" v-if="formValidate.takeEffectMode === '1'">
        <DatePicker v-model="formValidate.timer" type="date" :placeholder="$t('pleaseEnter')" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem :label="`${$t('date')}:`" v-if="formValidate.takeEffectMode === '3'">
        <Checkbox v-for="item in formValidate.daysList" :label="item.value" :key="item.value" v-model="item.checked" class="marR-20">
          {{ weekConfig[item.label] }}
        </Checkbox>
        <!-- <Select v-model="formValidate.days" style="width: 200px" placeholder="请选择" v-if="formValidate.takeEffectMode === '3'" multiple>
          <Option v-for="item in formValidate.daysList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select> -->
      </FormItem>

      <FormItem :label="`${$t('effectiveTimePeriod')}:`">
        <TimePicker v-model="formValidate.takeEffectTimer" format="HH:mm:ss" type="timerange" placement="bottom-end" :placeholder="$t('pleaseEnter')" style="width: 200px" v-if="formValidate.linkageMode === 'marginal'"></TimePicker>
        <template v-if="formValidate.linkageMode === 'clouds'">
          <div v-for="(item, index) in formValidate.timeList" :key="index" class="mrt mlt">
            <TimePicker format="HH:mm" type="timerange" v-model="formValidate.infinityTime[index]" placement="bottom-end" :placeholder="$t('pleaseSelectTime')" style="width: 200px"></TimePicker>
            <span class="span-icon" v-if="index > 0"><Icon type="ios-trash-outline" size="22" color="#E03C3A" @click="editList(index)" /></span>
          </div>
          <Button class="buttons mrt mlt" ghost long type="primary" @click="editList('add')">{{ '+' + $t('addEffectiveTimePeriod') }}</Button>
        </template>
      </FormItem>

      <FormItem :label="`${$t('configurationObject')}:`" v-if="formValidate.linkageMode === 'marginal'">
        <Input v-model="formValidate.configurationObject" :placeholder="$t('pleaseClickButtonToSelect')" style="width: 300px" :readonly="true"></Input>
        <Button class="b-blue ml-10" @click="handleSelectObjects">{{ $t('selectObject') }}</Button>
      </FormItem>
    </Form>
    <Modal v-model="selectObjects.modalStatus" :title="$t('selectDevice')" width="900" class-name="selectObjects">
      <Row>
        <Input v-model="selectObjects.name" style="width: 200px" :placeholder="$t('topologyPlaceholder2')"></Input>
        <Select v-model="selectObjects.deivceType" style="width: 200px" class="ml-10" :placeholder="$t('deviceType')">
          <Option v-for="item in selectObjects.deivceTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="selectObjects.deivceState" style="width: 200px" class="ml-10" :placeholder="$t('equipmentStatus')">
          <Option v-for="item in selectObjects.deivceStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="primary" class="ml-10" @click="queryDeviceList">{{ $t('query') }}</Button>
        <Button class="ml-10" @click="resetSelect">{{ $t('reset') }}</Button>
      </Row>
      <Table :columns="selectObjects.columns" :data="selectObjects.data" style="margin-top: 10px">
        <template #info="{ row }">{{ `${row.name}(${row.mac})` }}</template>
        <template #state="{ row }">
          <span :class="row.onlineStats === 0 ? 'b-danger' : row.onlineStats === -1 ? 'b-grays' : 'b-success'">
            {{ row.onlineStats === 0 ? $t('offline') : row.onlineStats === -1 ? $t('disconnected') : $t('online') }}
          </span>
        </template>
        <template #action="{ row }">
          <!--  -->
          <Button type="text" @click="getMacValue(row)" v-if="row.onlineStats === 1">{{ $t('select') }}</Button>
        </template>
      </Table>
      <Page show-total :current="pageNo" @on-change="changePage" :total="totalDevice" show-elevator />
      <div slot="footer"></div>
    </Modal>
    <ToolModal :isShowCancel="false" @saveConfig="closeModal" :text="toolCloudsTipText" ref="toolInfoModal"></ToolModal>
  </div>
</template>
<script>
  import store from '@/store/index'
  import { mapMutations } from 'vuex'
  import { toolCloudsTipText, regexMac } from './constants'
  import { getDeviceList, queryLinkPush } from '@api/multiManage/linkagePro'
  import { weekConfig } from '@/untils/weekMap'
  export default {
    props: {
      rowEditData: {
        type: Object,
        default: () => {},
      },
      editData: {
        type: Object,
        default: () => {},
      },
      allMacLineport: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        weekConfig,
        toolCloudsTipText,
        pageNo: 1,
        totalDevice: 0,
        formValidate: {
          infinityTime: [],
          timeList: [{ value: 555, showSpan: false }],
          name: '',
          describe: '',
          linkageMode: 'clouds',
          triggerMode: '2',
          takeEffectMode: '1',
          timer: '',
          takeEffectTimer: ['00:00:00', '23:59:59'],
          configurationObject: '',
          linkResId: '',
          days: '',
          daysList: [
            {
              value: '1',
              label: '一',
              checked: false,
            },
            {
              value: '2',
              label: '二',
              checked: false,
            },
            {
              value: '3',
              label: '三',
              checked: false,
            },
            {
              value: '4',
              label: '四',
              checked: false,
            },
            {
              value: '5',
              label: '五',
              checked: false,
            },
            {
              value: '6',
              label: '六',
              checked: false,
            },
            {
              value: '7',
              label: '日',
              checked: false,
            },
          ],

          status: true,
        },
        ruleValidate: {
          name: [{ required: true, message: this.$t('pleaseLinkageName'), trigger: 'blur' }],
        },
        selectObjects: {
          modalStatus: false,
          name: '',
          deivceType: '',
          deivceTypeList: [
            { label: this.$t('intelligentAirSwitch'), value: '1' },
            { label: this.$t('electricalFire'), value: '2,3' },
            { label: this.$t('smartPanel'), value: '19' },
          ],
          deivceState: '',
          deivceStateList: [
            { label: this.$t('online'), value: 1 },
            { label: this.$t('offline'), value: 0 },
            { label: this.$t('disconnected'), value: -1 },
          ],
          columns: [
            {
              title: this.$t('deviceMessage'),
              slot: 'info',
            },
            {
              title: this.$t('deviceType'),
              key: 'equipmentTypeName',
            },
            {
              title: this.$t('equipmentStatus'),
              slot: 'state',
            },
            {
              title: this.$t('position'),
              key: 'location',
            },
            {
              title: this.$t('operation'),
              slot: 'action',
            },
          ],
          data: [],
        },
      }
    },
    created() {
      // console.log('🚀 ~ file: marginalInfo.vue:206 ~ created ~ this.rowEditData:', this.rowEditData)
    },
    mounted() {
      if (this.rowEditData.isEdit) {
        this.getDetailInfo()
      }
      store.commit('linkageMode', this.formValidate.linkageMode)
      this.setTriggerMode(this.formValidate.triggerMode)
      this.formValidate.infinityTime = [['00:00', '23:59']]
    },
    methods: {
      ...mapMutations('linkage', ['setTriggerMode']),
      getDetailInfo() {
        const { baseInfo } = this.editData
        this.formValidate.name = baseInfo.name
        this.formValidate.describe = baseInfo.remark || ''
        this.formValidate.linkageMode = baseInfo.linkageMode === 1 ? 'marginal' : 'clouds'
        this.formValidate.triggerMode = `${baseInfo.triggerMode}`
        this.formValidate.status = baseInfo.status === 1
        this.formValidate.takeEffectMode = `${baseInfo.loopMode}`
        const loopTypes = `${baseInfo.loopMode}`
        if (loopTypes === '1') {
          this.formValidate.timer = baseInfo.loopCycle
        } else if (loopTypes === '3') {
          this.formValidate.daysList.forEach(v => {
            if (baseInfo.loopCycle.includes(v.label)) {
              v.checked = true
            }
          })
        }

        if (this.formValidate.linkageMode === 'clouds') {
          this.formValidate.timeList = baseInfo.timeRangeList && baseInfo.timeRangeList.map(v => ({ value: Math.random() * 100 + 'inifinty', showSpan: false }))
          this.formValidate.infinityTime = baseInfo.timeRangeList && baseInfo.timeRangeList.map(v => [v.startTime, v.endTime])
        } else {
          this.formValidate.takeEffectTimer = [baseInfo.timeRangeList[0].startTime, baseInfo.timeRangeList[0].endTime]
        }

        if (this.formValidate.linkageMode === 'marginal' && baseInfo.linkResId) {
          const findItem = this.allMacLineport.find(v => v.resId === baseInfo.linkResId)
          this.formValidate.configurationObject = findItem ? `${findItem.name}(${findItem.mac})` : ''
        }
        this.formValidate.linkResId = baseInfo.linkResId
      },
      closeModal() {
        this.$refs.toolInfoModal.cancel()
      },
      async getMacValue(val) {
        if (this.rowEditData.isEdit && regexMac(this.formValidate.configurationObject) !== val.mac) {
          this.$emit('deleteConfig', val)
        }
        this.$emit('getLineList', val)
        this.formValidate.configurationObject = `${val.name}(${val.mac})`
        this.formValidate.linkResId = val.resId
        this.selectObjects.modalStatus = false
        await queryLinkPush({ mac: val.mac })
      },
      handleSelectmode(val) {
        store.commit('linkageMode', val)
      },
      changePage(e) {
        this.pageNo = e
        this.getTableDeviceList()
      },
      handleSelectObjects() {
        if (this.rowEditData.isEdit) {
          this.$Modal.confirm({
            title: this.$t('tip'),
            content: this.$t('confirmChangeConfigObject'),
            onOk: () => {
              this.selectObjects.modalStatus = true
              this.selectObjects.deivceType = ''
              this.selectObjects.deivceState = ''
              this.selectObjects.name = ''
              this.getTableDeviceList()
            },
            onCancel: () => {
              this.$Message.info(this.$t('cancelModification'))
            },
          })
        } else {
          this.selectObjects.modalStatus = true
          this.selectObjects.deivceType = ''
          this.selectObjects.deivceState = ''
          this.selectObjects.name = ''
          this.getTableDeviceList()
        }
      },
      async getTableDeviceList() {
        const { name, deivceType, deivceState } = this.selectObjects
        let params = {
          projectCode: this.$store.state.projectCode,
          equipmentTypes: deivceType,
          pageSize: 10,
          pageNo: this.pageNo,
          mac: name,
          onlineStatus: deivceState,
        }
        const { datas, success, message, total } = await getDeviceList(params)
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }
        this.totalDevice = total
        this.selectObjects.data = datas
      },
      getEventModeChange(val) {
        this.setTriggerMode(val)
        if (this.formValidate.linkageMode === 'clouds' && val === '1') {
          this.$refs.toolInfoModal.openModal()
        }
      },
      queryDeviceList() {
        this.getTableDeviceList()
      },
      resetSelect() {
        this.selectObjects.deivceType = ''
        this.selectObjects.deivceState = ''
        this.selectObjects.name = ''
      },
      editList(val) {
        if (val === 'add') {
          if (this.formValidate.timeList.length > 9) {
            this.$Message.error({ content: this.$t('cantAdd') })
            return false
          }
          this.formValidate.timeList.push({
            value: Math.random() * 100 + 'inifinty',
            showSpan: false,
          })
        } else {
          if (this.formValidate.timeList.length <= 0) {
            this.formValidate.infinityTime = []
            this.formValidate.timeList = []
          }
          this.formValidate.timeList.splice(val, 1)
          this.formValidate.infinityTime.splice(val, 1)
        }
      },
    },
  }
</script>
<style lang="less">
  .marginalInfo {
    .b-grays {
      color: #909399;
      background: rgba(144, 147, 153, 0.15);
      height: 22px;
      padding: 1px 6px;
    }
    .marR-20 {
      margin-right: 20px;
    }
    .buttons {
      margin-top: 5px;
      width: 200px;
      background: rgba(0, 126, 255, 0.2);
      border: 1px dashed rgba(0, 126, 255, 1);
    }
  }
  .selectObjects {
    .ivu-modal-footer {
      border-color: transparent !important;
    }
  }
</style>
