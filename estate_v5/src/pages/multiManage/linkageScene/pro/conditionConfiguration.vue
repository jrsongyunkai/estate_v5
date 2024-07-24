<template>
  <div class="conditionConfiguration">
    <template v-if="linkageMode === 'marginal'">
      <Collapse v-for="(parentItem, parentIndex) in marginalObj" :key="parentIndex" v-model="parentItem.marginalValue" style="margin-bottom: 20px">
        <Panel name="1">
          <Row style="justify-content: space-between; width: 100%">
            <Col class="left">
              <div>{{ parentItem.groupLetter }}</div>
            </Col>
            <Col class="right action">
              <Button class="ml-10 b-blue" @click.stop.prevent="handleAddparentItemAction(parentIndex, parentItem, 'copy')">
                <Icon type="md-copy" class="font-20" />
              </Button>
              <Button class="b-dger" @click.stop.prevent="handleDeleteparentItem(parentIndex)">
                <Icon custom="icon-v5 icon-v5-lajitong" class="font-20"></Icon>
              </Button>
            </Col>
          </Row>
          <div slot="content" class="parentsItem">
            <div class="childItem" v-for="(childItem, childIndex) in parentItem.conditionList" :key="childIndex">
              <div class="header">
                <div>
                  <span>{{ $t('conditionType') }}：</span>
                  <Select v-model="childItem.conditionType" style="width: 180px" class="ml-10" :placeholder="$t('pleaseSelectCondition')" @on-select="getChangeTip($event, childItem)">
                    <Option v-for="item in conditionTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </div>
                <div class="action">
                  <Button class="ml-10 b-blue" @click.stop.prevent="handleAddchildItem(parentIndex, childItem, 'copy')">
                    <Icon type="md-copy" class="font-20" />
                  </Button>
                  <Button class="b-dger" @click.stop.prevent="handleChildItemDelete(childIndex, parentIndex)">
                    <Icon custom="icon-v5 icon-v5-lajitong" class="font-20"></Icon>
                  </Button>
                </div>
              </div>
              <!-- 线路列表 -->
              <template>
                <Row class="childList" v-for="(grandsonItem, grandsonIndex) in childItem.children" :key="grandsonIndex">
                  <div class="childletter">{{ grandsonItem.conditionLetter }}</div>
                  <Row style="width: 97%; justify-content: space-between; align-items: center">
                    <div class="arrange pd-16">
                      <Col class="marl-10">
                        <span>{{ $t('line') }}：</span>
                        <Select v-model="grandsonItem.conditionAddr" style="width: 200px" class="ml-10" :placeholder="$t('pleaseSelectConditionLine')" @on-change="getPortChange($event, grandsonItem, childItem)">
                          <!--实参 grandsonIndex,childIndex,parentIndex -->
                          <Option v-for="item in conditionAddrList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                      </Col>
                      <Col class="ml-20" v-if="grandsonItem.conditionPortList">
                        <span>{{ $t('port') }}：</span>
                        <Select v-model="grandsonItem.conditionPort" style="width: 150px" class="ml-10" :placeholder="$t('pleaseSelectPort')" @on-change="getSatusTypeList($event, grandsonItem, childItem)">
                          <Option v-for="item in grandsonItem.conditionPortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                      </Col>
                      <Col class="ml-20" v-if="childItem.conditionType === '1'">
                        <span>{{ $t('stateType') }}：</span>
                        <Select v-model="grandsonItem.conditionStatusType" style="width: 150px" class="ml-10" :placeholder="$t('pleaseSelectStateType')">
                          <Option v-for="item in grandsonItem.conditionStatusTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                      </Col>
                      <template v-if="childItem.conditionType === '2'">
                        <Col class="ml-20">
                          <span>{{ $t('valueType') }}：</span>
                          <Select v-model="grandsonItem.conditionValueType" style="width: 150px" class="ml-10" :placeholder="$t('pleaseSelectValueType')">
                            <Option v-for="(item, index) in grandsonItem.conditionValueTypeList" :value="item.value" :key="`ValueType${index}`">{{ item.label }}</Option>
                          </Select>
                        </Col>
                        <Col class="ml-20">
                          <span>{{ $t('correctionFactor') }}：</span>
                          <Select v-model="grandsonItem.conditionFactor" style="width: 50px" class="ml-10" placeholder="">
                            <Option v-for="item in conditionFactorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                          </Select>
                          <InputNumber :max="650" :min="-600" v-decimalTwo v-model="grandsonItem.factorValue" @on-blur="getToFixed(grandsonItem, grandsonItem.factorValue, 'marginal')"></InputNumber>
                        </Col>
                      </template>
                    </div>
                    <div class="action">
                      <Button class="ml-10 b-blue">
                        <Icon type="md-copy" class="font-20" @click="handleGrandsonItemAction(grandsonIndex, childIndex, parentIndex, grandsonItem, 'copy')" />
                      </Button>
                      <Button class="b-dger">
                        <Icon custom="icon-v5 icon-v5-lajitong" class="font-20" @click="handleGrandsonItemDelete(grandsonIndex, childIndex, parentIndex, grandsonItem)"></Icon>
                      </Button>
                    </div>
                  </Row>
                </Row>
                <Button class="addchildBtn" @click="handleGrandsonItemAction('', childIndex, parentIndex, '', 'add')">{{ $t('add') }}</Button>
                <Row class="aItem mt-10" v-if="childItem.conditionType === '1'">
                  <span>{{ $t('conditionJudgment') }}：</span>
                  <!-- parentItem.conditionType -->
                  <Select v-model="childItem.conditional" style="width: 180px" class="ml-10" :placeholder="$t('pleaseSelect')">
                    <Option v-for="item in conditionalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <Select v-model="childItem.conditionalType" style="width: 180px" class="ml-10" :placeholder="$t('pleaseSelect')">
                    <Option v-for="item in conditionalTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </Row>
                <div v-if="childItem.conditionType === '2'">
                  <Row class="aItem mt-10">
                    <span>{{ $t('conditionJudgment') }}：</span>
                    <Select v-model="childItem.conditional" style="width: 180px" class="ml-10" :placeholder="$t('pleaseSelect')">
                      <Option v-for="item in conditionalNumBerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="childItem.conditionalType" style="width: 180px" class="ml-10" :placeholder="$t('pleaseSelect')">
                      <Option v-for="item in conditionalNumBerTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </Row>
                  <Row class="aItem mt-10">
                    <span>{{ $t('conditionJudgmentValue') }}：</span>
                    <InputNumber v-model="childItem.conditonDetermineValue"></InputNumber>
                  </Row>
                </div>
              </template>
            </div>
            <Button class="addchildBtn" @click="handleAddchildItem(parentIndex, '', 'add')">{{ $t('addCondition') }}</Button>
          </div>
        </Panel>
      </Collapse>
      <Button class="addrGroup" @click="handleAddparentItemAction('', '', 'add')">{{ $t('addConditionGroup') }}</Button>
    </template>
    <template v-else>
      <Collapse v-for="(parentItem, parentIndex) in cloudsObj" :key="parentIndex" v-model="parentItem.cloudsValue" style="margin-bottom: 20px">
        <Panel name="1">
          <Row style="justify-content: space-between; width: 100%">
            <Col class="left">
              <div>{{ parentItem.groupLetter }}</div>
              <div @click.stop.prevent="() => {}">
                <Poptip :transfer="true" v-model="parentItem.visible">
                  <Icon class="ml-10" custom="icon icon-v5 icon-v5-xiugai"></Icon>
                  <div slot="content">
                    <Input maxlength="15" show-word-limit clearable v-model.trim="parentItem.titleVal" :placeholder="$t('pleaseEnter')"></Input>
                    <div class="tr" style="margin: 5px 0 0">
                      <Button type="primary" size="small" @click="changeConditionName(parentItem)">{{ $t('confirm') }}</Button>
                      <Button class="ml-10" size="small" @click="parentItem.visible = false">{{ $t('cancel') }}</Button>
                    </div>
                  </div>
                </Poptip>
              </div>
            </Col>
            <Col class="right action">
              <Button class="ml-10 b-blue">
                <Icon type="md-copy" class="font-20" @click.stop.prevent="handleAddcloudsparentItemAction(parentIndex, parentItem, 'copy')" />
              </Button>
              <Button class="b-dger" @click.stop.prevent="deleteCloudsItemAction(parentIndex)">
                <Icon custom="icon-v5 icon-v5-lajitong" class="font-20"></Icon>
              </Button>
            </Col>
          </Row>
          <div slot="content" class="parentsItem">
            <div class="childItem" v-for="(childItem, childIndex) in parentItem.conditionList" :key="childIndex">
              <div class="header">
                <div>
                  <span>{{ $t('conditionType') }}：</span>
                  <Select v-model="childItem.conditionType" style="width: 180px" class="ml-10" :placeholder="$t('pleaseSelectCondition')" @on-change="changeCloudsConditionType($event, childItem)">
                    <Option v-for="item in conditionTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </div>
                <div class="action">
                  <Button class="ml-10 b-blue" @click="handleAddcloudsObjchildItem(childItem, childIndex, parentIndex, 'copy')">
                    <Icon type="md-copy" class="font-20" />
                  </Button>
                  <Button class="b-dger" @click="deleteConditionType(parentIndex, childIndex)">
                    <Icon custom="icon-v5 icon-v5-lajitong" class="font-20"></Icon>
                  </Button>
                </div>
              </div>
              <!-- 条件对象 -->
              <template>
                <div class="border-obj space-betw" v-for="(grandsonItem, grandsonIndex) in childItem.children" :key="`grandsonIndex${grandsonIndex}`">
                  <div class="arrange">
                    <div class="lft-box">{{ grandsonItem.conditionLetter }}</div>
                    <div>
                      <div class="arrange mar">
                        <div class="arrange">
                          <div class="arrange">
                            <div class="pd-t">{{ $t('conditionObject') }}：</div>
                            <div class="inputDeviceStyle" v-textRoll>{{ grandsonItem.conditionObject }}</div>
                            <!-- <Input v-model="grandsonItem.conditionObject" readonly class="flex-1 w200" placeholder="请选择对象"></Input> -->
                            <Button class="b-blue ml-10" @click="getDeviceAll(parentIndex, childIndex, grandsonIndex, childItem)">{{ $t('selectObject') }}</Button>
                          </div>
                          <div class="arrange mar-lr w300" v-if="grandsonItem.conditionLineList.length > 0">
                            <div class="pd-t">{{ $t('line') }}：</div>
                            <Select v-model="grandsonItem.conditionAddr" class="flex-1 w200" :placeholder="$t('pleaseSelectConditionLine')" @on-change="getPostClouds($event, grandsonItem, childItem)">
                              <Option v-for="item in grandsonItem.conditionLineList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </div>
                          <div class="arrange marl-10" v-if="grandsonItem.conditionLinePortList && grandsonItem.conditionLinePortList.length > 0">
                            <div class="pd-t">{{ $t('port') }}：</div>
                            <Select v-model="grandsonItem.conditionPort" class="flex-1 w180" :placeholder="$t('pleaseSelectPort')">
                              <Option v-for="(item, idx) in grandsonItem.conditionLinePortList" :value="item.value" :key="idx">{{ item.label }}</Option>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="arrange mar pd-t" v-if="childItem.conditionType === '1'">
                          <div class="pd-t marL-20">{{ $t('state') }}：</div>
                          <Select v-model="grandsonItem.conditionStatusType" class="w180" :placeholder="$t('pleaseSelect')" @on-change="getStatusChange($event, grandsonItem)">
                            <Option v-for="item in grandsonItem.conditionLineStatusTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                          </Select>
                          <Select v-model="grandsonItem.conditionStatusValue" class="ml-10" style="width: 250px" :placeholder="$t('pleaseSelect')" v-if="grandsonItem.conditionStatusValueList.length > 0">
                            <Option v-for="item in grandsonItem.conditionStatusValueList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                          </Select>
                          <Cascader class="ml-10 w180" v-if="grandsonItem.conditionStatusType === 'alarmStatus' && grandsonItem.conditionStatusValueList.length === 0" v-model="grandsonItem.alarmValue" clearable :data="alarmsList" :show-all-levels="false" style="width: 200px"></Cascader>
                        </div>
                        <div class="arrange mar pd-t" v-if="childItem.conditionType === '2'">
                          <div class="pd-t marl-15">{{ $t('valueType') }}：</div>
                          <Select v-model="grandsonItem.conditionNumType" class="w180" :placeholder="$t('pleaseSelect')" @on-change="getNumChange($event, grandsonItem)">
                            <Option v-for="(item, idt) in grandsonItem.conditionLineNumTypeList" :value="item.value" :key="`LineNumTypeList${idt}`">{{ item.label }}</Option>
                          </Select>
                          <div class="ml-20">
                            <span>{{ $t('correctionFactor') }}：</span>
                            <Select v-model="grandsonItem.conditionCloudsFactor" style="width: 50px" class="ml-10" placeholder="">
                              <Option v-for="item in conditionFactorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <InputNumber :max="1000000" :min="-1000000" v-decimalTwo v-model="grandsonItem.factorCloudsValue" @on-blur="getToFixed(grandsonItem, grandsonItem.factorCloudsValue, 'clouds')"></InputNumber>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="action text-right">
                    <Button class="ml-10 b-blue" @click="handlecloudsItemAction(grandsonIndex, childIndex, parentIndex, grandsonItem, 'copy')">
                      <Icon type="md-copy" class="font-20" />
                    </Button>
                    <Button class="b-dger" @click="handleCloudsItemDelete(grandsonIndex, childIndex, parentIndex)">
                      <Icon custom="icon-v5 icon-v5-lajitong" class="font-20"></Icon>
                    </Button>
                  </div>
                </div>
                <Button class="addchildBtn" @click="handlecloudsItemAction('', childIndex, parentIndex, '', 'add')">{{ $t('add') }}</Button>
                <Row class="aItem mt-10" v-if="childItem.conditionType === '1'">
                  <span>{{ $t('conditionJudgment') }}：</span>
                  <Select v-model="childItem.conditional" style="width: 180px" class="ml-10" :placeholder="$t('pleaseSelect')">
                    <Option v-for="item in conditionalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <Select v-model="childItem.conditionalType" style="width: 180px" class="ml-10" :placeholder="$t('pleaseSelect')">
                    <Option v-for="item in conditionalTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </Row>
                <div v-if="childItem.conditionType === '2'">
                  <Row class="aItem mt-10">
                    <span>{{ $t('conditionJudgment') }}：</span>
                    <Select v-model="childItem.conditional" style="width: 180px" class="ml-10" :placeholder="$t('pleaseSelect')">
                      <Option v-for="item in conditionalNumBerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="childItem.conditionalType" style="width: 180px" class="ml-10" :placeholder="$t('pleaseSelect')">
                      <Option v-for="item in conditionalNumBerTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </Row>
                  <Row class="aItem mt-10">
                    <span>{{ $t('conditionJudgmentValue') }}：</span>
                    <InputNumber v-model="childItem.conditonDetermineValue"></InputNumber>
                  </Row>
                </div>
              </template>
            </div>
            <Button class="addchildBtn" @click="handleAddcloudsObjchildItem('', '', parentIndex, 'add')">{{ $t('addCondition') }}</Button>
          </div>
        </Panel>
      </Collapse>
      <Button class="addrGroup" @click="handleAddcloudsparentItemAction('', '', 'add')">{{ $t('addConditionGroup') }}</Button>
    </template>
    <Modal v-model="selectObjects.modalStatus" :title="$t('selectDevice')" width="900" class-name="selectObjects">
      <Row>
        <Input v-model="selectObjects.name" style="width: 200px" :placeholder="$t('topologyPlaceholder2')"></Input>
        <Select v-model="selectObjects.deivceType" style="width: 200px" class="ml-10" :placeholder="$t('deviceType')">
          <Option v-for="item in selectObjects.deivceTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="selectObjects.deivceState" style="width: 200px" class="ml-10" :placeholder="$t('equipmentStatus')">
          <Option v-for="item in selectObjects.deivceStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="primary" class="ml-10" @click="queryList">{{ $t('query') }}</Button>
        <Button class="ml-10" @click="resetSelect">{{ $t('reset') }}</Button>
      </Row>
      <Table :columns="selectObjects.columns" :data="selectObjects.data" style="margin-top: 10px">
        <template #info="{ row }">{{ `${row.name}(${row.mac})` }}</template>
        <template #state="{ row }">
          <span :class="row.onlineStats === 0 ? 'b-danger' : row.onlineStats === -1 ? 'grays-box' : 'b-success'">
            {{ row.onlineStats === 0 ? $t('offline') : row.onlineStats === -1 ? $t('disconnected') : $t('online') }}
          </span>
        </template>
        <template #action="{ row }">
          <Button type="text" @click="getDeviceValue(row)">{{ $t('select') }}</Button>
        </template>
      </Table>
      <Page :current="pageNo" @on-change="changePage" :total="totalDevice" show-elevator />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import { copyCloudsObj, copyConditionObj, copyChildern, copyMarginalObj, conditionalList, conditionalTypeList, getLineId, regexMac } from './constants'
  import { getStatusConditonOptionList, getDeviceList, getNumberConditonOptionList, getEdgePortValTypeList, getEdgePortTypeList } from '@api/multiManage/linkagePro'
  // import { queryAlarmForConfig } from '@/api/multiManage/builtlnTimer'
  import _ from 'lodash'
  export default {
    props: {
      rowEditData: {
        type: Object,
        default: () => {},
      },
      alarmsList: {
        type: Array,
        default: () => [],
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
        totalDevice: 0,
        deviceRows: {},
        seconedLevelIndex: '',
        firstLevelIndex: '',
        thirdLevelIndex: '',
        reciveData: {},
        conditionalNumBerList: conditionalList,
        conditionalNumBerTypeList: conditionalTypeList,
        linkageMode: this.$store.state.linkageMode,
        conditionalList: [
          {
            value: 'any',
            label: this.$t('anyCondition'),
          },
          {
            value: 'all',
            label: this.$t('allCondition'),
          },
        ],
        conditionalTypeList: [
          {
            value: 'true',
            label: this.$t('isTrue'),
          },
          {
            value: 'false',
            label: this.$t('isFalse'),
          },
        ],
        conditionTypeList: [
          {
            value: '1',
            label: this.$t('stateCondition'),
          },
          {
            value: '2',
            label: this.$t('valueCondition'),
          },
        ],
        conditionAddrList: [],
        conditionPortList: [],
        conditionLineList: [],
        conditionLinePortList: [],
        conditionStatusValueList: [],
        conditionStatusTypeList: [],
        conditionValueTypeList: [],
        conditionFactorList: [
          { value: '1', label: this.$t('plus') },
          { value: '2', label: this.$t('subtract') },
          { value: '3', label: this.$t('multiply') },
          { value: '4', label: this.$t('divide') },
        ],
        marginalObjgroupLetter: 'A',
        marginalObjletter: 0,
        marginalObj: [
          {
            marginalValue: '1',
            titleVal: '',
            groupLetter: this.$t('conditionGroup') + String.fromCharCode(65),
            conditionList: [
              {
                conditionType: '1',
                letter: 0,
                grandsonItemButtonShow: true,
                conditional: '',
                conditonDetermineValue: 0,
                conditionalType: '',
                children: [
                  {
                    conditionLetter: 'A',
                    conditionAddr: '',
                    conditionFactor: '1',
                    conditionPortList: [],
                    conditionStatusTypeList: [],
                    conditionValueTypeList: [],
                    conditionPort: '',
                    conditionStatusType: '',
                    conditionValueType: '',
                  },
                ],
              },
            ],
          },
        ],
        cloudsObj: [
          {
            cloudsValue: '1',
            titleVal: '',
            groupLetter: this.$t('conditionGroup') + String.fromCharCode(65),
            visible: false,
            conditionList: [
              {
                letter: 0,
                grandsonItemButtonShow: true,
                conditionType: '1',
                conditional: '',
                conditionalType: '',
                conditonDetermineValue: 0,
                children: [
                  {
                    equipmentType: null,
                    conditionObject: '',
                    resId: '',
                    conditionLetter: 'A',
                    conditionLineList: [],
                    conditionLinePortList: [],
                    conditionLineStatusTypeList: [],
                    conditionStatusValueList: [],
                    conditionLineNumTypeList: [],
                    conditionCloudsFactor: '1',
                    factorCloudsValue: 0,
                    conditionNumType: '',
                    alarmValue: [],
                    conditionAddr: '',
                    conditionPort: '',
                    conditionStatusType: '',
                    conditionStatusValue: '',
                  },
                ],
              },
            ],
          },
        ],
        selectObjects: {
          modalStatus: false,
          name: '',
          deivceType: '',
          deivceTypeList: [],
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
        pageNo: 1,
        newChildItem: {},
      }
    },
    mounted() {
      if (this.rowEditData.isEdit) {
        if (this.rowEditData.linkageMode === 2) {
          this.linkageMode = 'clouds'
        }
        this.getDetailConditon()
      }
    },
    methods: {
      changeConditionName(parentItem) {
        parentItem.groupLetter = parentItem.titleVal
        parentItem.visible = false
      },
      deleConfig() {
        // 父组件有调用此方法，勿删
        this.marginalObj = copyMarginalObj()
      },
      async getDetailConditon() {
        const { conditionGroupList, baseInfo } = this.editData
        const isEditMarginal = baseInfo.linkageMode === 1
        // 需要后端返回相应选项 回显
        if (isEditMarginal) {
          // 边缘端回显
          this.reciveData.mac = baseInfo.mac
          this.marginalObj = conditionGroupList.map(v => {
            const conditionList = v.subGroupList.map(j => {
              const isNumberType = j.itemType === 'number'
              const isNumConfigList = isNumberType ? j.numberConfList : j.statusConfList
              // 边缘端获取线路选项
              const lineMarginalList = this.allMacLineport.find(val => val.resId === isNumConfigList[0].resId)
              let addrListArr = lineMarginalList && lineMarginalList.addrs.map(item => ({ ...item, value: item.addr, label: item.title + getLineId(lineMarginalList.mac, item.addr) }))
              this.conditionAddrList = lineMarginalList ? addrListArr : []
              const numberLists =
                isNumConfigList &&
                isNumConfigList.map((its, ids) => {
                  const addrPortList = its.addrPort.includes('^') ? +its.addrPort.split('^')[0] : +its.addrPort
                  // 边缘端 获取端口选项
                  const conditionPortList = its.edgePortOptionList.map(t => ({ ...t, value: t.type, label: t.typeName }))
                  // 边缘端获取状态类型选项
                  const conditionStatusTypeList = its.optionList.map(h => ({ ...h, value: h.type, label: `${h.typeName + (h.unit ? '(' + h.unit + ')' : '')}` }))
                  const conditionValueTypeList = its.optionList.map(h => ({ ...h, value: h.type, label: `${h.typeName + (h.unit ? '(' + h.unit + ')' : '')}` }))
                  return {
                    // 边缘端不需要mac
                    equipmentType: its.equipmentType || '',
                    resId: its.resId, // 预存ID，可能需要用到
                    conditionAddr: addrPortList,
                    conditionPort: its.portList.join(','),
                    conditionPortList,
                    conditionStatusTypeList, // 状态类型选项
                    conditionValueTypeList, // 值类型选项
                    conditionStatusType: isNumberType ? '' : its.type,
                    conditionValueType: isNumberType ? its.type : '',
                    conditionFactor: isNumberType ? `${its.correctType}` : '',
                    factorValue: isNumberType ? its.correctFactor : 0,
                    conditionLetter: String.fromCharCode(65 + ids),
                  }
                })
              return {
                conditionType: isNumberType ? '2' : '1',
                conditional: j.logicType, // 条件判断
                conditionalType: isNumberType ? j.logicCompare : j.logicValue, // 条件判断第二个框
                conditonDetermineValue: isNumberType ? +j.logicValue : null, // 条件判断值
                children: numberLists,
              }
            })
            return {
              conditionList,
              marginalValue: '1',
              titleVal: v.name,
              groupLetter: v.name,
            }
          })
        } else {
          // 云端回显
          this.cloudsObj = conditionGroupList.map((v, ids) => {
            const conditionList = v.subGroupList.map(j => {
              const isNumberType = j.itemType === 'number'
              const isNumConfigList = isNumberType ? j.numberConfList : j.statusConfList
              const numberLists =
                isNumConfigList &&
                isNumConfigList.map((its, ids) => {
                  const addrPortList = its.addrPort.includes('^') ? +its.addrPort.split('^')[0] : +its.addrPort
                  const portValue = its.portList.join(',') || ''
                  const macItem = this.allMacLineport.find(v => v.resId === its.resId)
                  // console.log('🚀 ~ file: conditionConfiguration.vue:577 ~ isNumConfigList.map ~ macItem:', macItem)
                  let conditionLineList
                  const isNotnumList = macItem && macItem.addrs ? macItem.addrs.map(item => ({ ...item, value: item.addr, label: item.title + getLineId(macItem.mac, item.addr) })) : []
                  if (isNumberType) {
                    conditionLineList = isNotnumList.filter(item => `${item.value}` !== '101')
                  } else {
                    conditionLineList = isNotnumList
                  }

                  // 端口
                  const conditionLinePortList = its.cloudPortOptionList.map(v => ({ value: v.type, label: v.typeName })) || []
                  // 状态 conditionStatusValueList subTypeListconditionLineNumTypeList
                  const conditionLineStatusTypeList = its.optionList.map(h => ({ ...h, value: h.type, label: `${h.typeName + (h.unit ? '(' + h.unit + ')' : '')}` }))

                  const valueArr = conditionLineStatusTypeList.find(h => h.type === its.type)
                  const isValueArr = !!valueArr && valueArr.subTypeList && !!valueArr.subTypeList.length
                  const conditionStatusValue = isNumberType ? '' : its.type !== 'alarmStatus' ? its.value : its.type === 'alarmStatus' && isValueArr ? its.value : ''
                  const conditionStatusValueList = isValueArr ? valueArr.subTypeList.map(j => ({ ...j, value: j.type, label: j.typeName })) : []
                  // console.log('🚀 ~ file: conditionConfiguration.vue:594 ~ isNumConfigList.map ~ conditionStatusValueList:', conditionStatusValue, conditionStatusValueList)

                  let alarmFindValue
                  let alarmType
                  if (its.type === 'alarmStatus') {
                    if (its.value.includes('1015-')) {
                      alarmFindValue = 'customs'
                      alarmType = its.value.split('-')[1]
                    } else {
                      const result = _.find(this.alarmsList[0].children, { value: `${its.value}` })
                      alarmFindValue = result ? 'alarms' : 'warns'
                      alarmType = its.value
                    }
                  }
                  const alarmValue = its.type === 'alarmStatus' ? (its.value ? [alarmFindValue, `${alarmType}`] : []) : []
                  // console.log('🚀 ~ file: conditionConfiguration.vue:587 ~ isNumConfigList.map ~ macItem:', this.alarmsList, alarmValue)
                  return {
                    equipmentType: its.equipmentType || '',
                    resId: its.resId,
                    conditionObject: `${macItem.name}(${macItem.mac})`,
                    conditionLineList,
                    conditionLinePortList,
                    conditionAddr: addrPortList,
                    conditionPort: portValue,
                    conditionLineStatusTypeList,
                    conditionStatusValueList,
                    conditionLineNumTypeList: conditionLineStatusTypeList,
                    conditionStatusType: isNumberType ? '' : its.type,
                    conditionStatusValue,
                    alarmValue,
                    conditionNumType: isNumberType ? its.type : '',
                    conditionCloudsFactor: isNumberType ? `${its.correctType}` : '',
                    factorCloudsValue: isNumberType ? its.correctFactor : '',
                    conditionLetter: String.fromCharCode(65 + ids),
                  }
                })
              return {
                conditionType: isNumberType ? '2' : '1',
                conditional: j.logicType,
                conditionalType: isNumberType ? j.logicCompare : j.logicValue,
                conditonDetermineValue: isNumberType ? +j.logicValue : null,
                children: numberLists,
              }
            })
            return {
              conditionList,
              cloudsValue: '1',
              titleVal: v.name,
              groupLetter: v.name,
              visible: false,
            }
          })
        }
      },
      getToFixed(item, val, type) {
        const inputValue = parseFloat(val)
        if (!isNaN(inputValue)) {
          const isInteger = inputValue % 1 === 0
          const fixedValue = Math.floor(inputValue * 100) / 100
          if (type === 'marginal') {
            item.factorValue = isInteger ? inputValue.toFixed(0) : fixedValue.toFixed(2)
          } else {
            item.factorCloudsValue = isInteger ? inputValue.toFixed(0) : fixedValue.toFixed(2)
          }
        }
      },
      getChangeTip(val, item) {
        const isAddrNullList = item.children.filter(v => !!v.conditionAddr).length
        if (!item.conditional && !item.conditionalType && !isAddrNullList) {
          return
        }
        item.conditonDetermineValue = 0
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmChangeConditionType'),
          onOk: () => {
            item.children.forEach(v => {
              v.conditionAddr = ''
              v.conditionPort = ''
            })
          },
          onCancel: () => {
            item.conditionType = val === '1' ? '2' : '1'
          },
        })
      },
      getNumChange() {},

      getStatusChange(val, item) {
        item.conditionStatusValueList = []
        item.conditionLineStatusTypeList.forEach(v => {
          if (v.type === val && v.subTypeList && v.subTypeList.length) {
            item.conditionStatusValueList = v.subTypeList.map(j => ({ ...j, value: j.type, label: j.typeName }))
          }
        })
      },
      async getSatusTypeList(val, item, childIten) {
        item.conditionStatusType = ''
        item.conditionValueType = ''
        item.conditionFactor = '1'
        item.factorValue = 0
        const params = {
          mac: this.reciveData.mac,
          addrs: item.conditionAddr,
          portType: val,
          optionType: childIten.conditionType === '1' ? 'statusType' : 'valueType',
        }
        if (!val) {
          return
        }
        const { success, data, message } = await getEdgePortValTypeList(params)
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }
        const typeListArr = data.map(v => ({ ...v, value: v.type, label: v.typeName + (v.unit ? `(${v.unit})` : '') }))
        if (childIten.conditionType === '1') {
          item.conditionStatusTypeList = typeListArr
        } else {
          item.conditionValueTypeList = typeListArr
        }
      },
      async getPostClouds(val, item, childItem) {
        item.conditionLineList.forEach(v => {
          if (v.addr === val && v.isIoLine) {
            if (childItem.conditionType === '1') {
              const outsArr = v.digitalOuts && v.digitalOuts.map(t => ({ ...t, value: `digitalOut${t.index}`, label: t.name }))
              const insArr = v.digitalIns && v.digitalIns.map(t => ({ ...t, value: `digitalIns${t.index}`, label: t.name }))
              item.conditionLinePortList = outsArr.concat(insArr)
            } else {
              item.conditionLinePortList = (v.analogIns && v.analogIns.map(j => ({ ...j, value: j.index, label: j.name }))) || []
            }
          }
        })
        const params = {
          mac: regexMac(item.conditionObject),
          addr: val,
        }
        if (!val) {
          return
        }
        if (childItem.conditionType === '1') {
          const { success, data, message } = await getStatusConditonOptionList(params)
          if (!success) {
            return this.$Message.error({
              content: message,
            })
          }
          item.conditionLineStatusTypeList = data.map(v => ({ ...v, label: v.typeName, value: v.type }))
        } else {
          const { success, data, message } = await getNumberConditonOptionList(params)
          if (!success) {
            return this.$Message.error({
              content: message,
            })
          }
          item.conditionLineNumTypeList = data.map(v => ({ ...v, label: `${v.typeName}${v.unit ? '(' + v.unit + ')' : ''}`, value: v.type }))
        }
      },
      getPortChange(val, item, childItem) {
        item.conditionPort = ''
        item.conditionStatusType = ''
        item.conditionValueType = ''
        item.conditionFactor = '1'
        item.factorValue = 0
        if (!val) {
          return
        }
        if (childItem.conditionType === '1') {
          this.getStatusType(val, item)
        } else {
          this.getNumberType(val, item)
        }
      },
      getDeviceAll(parentIndex, childIndex, index, chilldItem) {
        this.firstLevelIndex = parentIndex
        this.seconedLevelIndex = childIndex
        this.thirdLevelIndex = index
        this.newChildItem = chilldItem
        if (this.rowEditData.isEdit) {
          this.$Modal.confirm({
            title: this.$t('tip'),
            content: this.$t('confirmChangeConfigObject'),
            onOk: () => {
              this.selectObjects.modalStatus = true
              this.selectObjects.deivceType = ''
              this.selectObjects.deivceState = ''
              this.selectObjects.name = ''
              this.getAllDeviceLists(chilldItem)
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
          this.getAllDeviceLists(chilldItem)
        }
        // 1 状态条件
        const arr = [
          { label: this.$t('intelligentAirSwitch'), value: '1' },
          { label: this.$t('electricalFire'), value: '2,3' },
          { label: this.$t('smartPanel'), value: '19' },
          { label: this.$t('manualAlarm'), value: '38' },
          { label: this.$t('intelligentModule'), value: '40' },
          { label: this.$t('industrialGas'), value: '26' },
          { label: this.$t('userTransmissionDdevice'), value: '27' },
          { label: this.$t('waterImmersionWaterLevelAndPressure'), value: '18,23' },
          { label: this.$t('smokeAndCombustibleGases'), value: '6,7,10,13,25,29,39,41,42,45' },
          { label: this.$t('temperatureHumidityLightingInfraredRemoteControl'), value: '11,22' },
          { label: this.$t('camera'), value: '20' },
          { label: this.$t('airDisinfector'), value: '33' },
        ]
        // 2 数值条件
        const arr2 = [
          { label: this.$t('intelligentAirSwitch'), value: '1' },
          { label: this.$t('electricalFire'), value: '2,3' },
          { label: this.$t('smartPanel'), value: '19' },
          { label: this.$t('manualAlarm'), value: '38' },
          { label: this.$t('industrialGas'), value: '26' },
          { label: this.$t('waterImmersionWaterLevelAndPressure'), value: '4,5,23,24' },
          { label: this.$t('smokeAndCombustibleGases'), value: '25,29,39,41,42,45' },
          { label: this.$t('temperatureHumidityLightingInfraredRemoteControl'), value: '11,14' },
          { label: this.$t('airDisinfector'), value: '33' },
        ]
        this.selectObjects.deivceTypeList = chilldItem.conditionType === '1' ? arr : arr2
      },
      changePage(e) {
        this.pageNo = e
        this.getAllDeviceLists(this.newChildItem)
      },
      queryList() {
        this.pageNo = 1
        this.getAllDeviceLists(this.newChildItem)
      },
      resetSelect() {
        this.selectObjects.deivceType = ''
        this.selectObjects.deivceState = ''
        this.selectObjects.name = ''
      },
      async getAllDeviceLists(chilldItem) {
        const { name, deivceType, deivceState } = this.selectObjects
        const statusDeviceType = '1,2,3,6,7,10,11,13,25,26,29,19,27,18,23,20,22,33,38,39,40,41,42,45' // 状态条件下所有设备类型
        const numDeviceType = '1,2,3,19,26,4,5,23,24,25,11,14,29,33,38,39,41,42,45' // 数值条件下所有设备类型
        const params = {
          projectCode: this.$store.state.projectCode,
          equipmentTypes: deivceType || (chilldItem.conditionType === '1' ? statusDeviceType : numDeviceType),
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
      async getNumberType(val, item) {
        const params = {
          mac: this.reciveData.mac,
          addrs: val,
        }
        const { success, data, message } = await getEdgePortTypeList(params)
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }
        item.conditionPortList = data.map(v => ({ ...v, label: v.typeName, value: v.type }))
      },
      changeCloudsConditionType(val, childItem) {
        const isAddrNullList = childItem.children.filter(v => !!v.conditionAddr || !!v.conditionObject).length
        if (!childItem.conditional && !childItem.conditionalType && !isAddrNullList) {
          return
        }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmChangeConditionType'),
          onOk: () => {
            childItem.children.forEach(v => {
              v.conditionObject = ''
              v.conditionAddr = ''
              v.conditionPort = ''
              v.conditionLineList = []
              v.conditionLinePortList = []
            })
          },
          onCancel: () => {
            childItem.conditionType = val === '1' ? '2' : '1'
          },
        })
      },
      async getDeviceValue(row) {
        this.deviceRows = row
        // this.cloudsObj[this.firstLevelIndex].conditionList[this.seconedLevelIndex].children[this.thirdLevelIndex].conditionObject = row.mac  this.newChildItem
        this.selectObjects.modalStatus = false
        let statusList = []
        const isStatusType = this.newChildItem.conditionType === '1'
        if (!row.addrs) {
          const params = {
            mac: row.mac,
            addr: 0,
          }
          const { success, data, message } = isStatusType ? await getStatusConditonOptionList(params) : await getNumberConditonOptionList(params)
          if (!success) {
            return this.$Message.error({
              content: message,
            })
          }
          statusList = data.map(v => ({ ...v, label: `${v.typeName}${v.unit ? '(' + v.unit + ')' : ''}`, value: v.type }))
        }
        this.cloudsObj.forEach((v, i) => {
          if (v.conditionList && i === this.firstLevelIndex) {
            v.conditionList.forEach((val, idx) => {
              if (val.children && idx === this.seconedLevelIndex) {
                val.children[this.thirdLevelIndex].conditionObject = `${row.name}(${row.mac})`
                val.children[this.thirdLevelIndex].equipmentType = row.equipmentType
                val.children[this.thirdLevelIndex].resId = row.resId
                val.children.forEach((itm, indxs) => {
                  if (indxs === this.thirdLevelIndex) {
                    itm.conditionAddr = ''
                    itm.conditionPort = ''
                    itm.conditionStatusType = ''
                    itm.conditionNumType = ''
                    itm.conditionStatusValue = ''
                    itm.conditionCloudsFactor = '1'
                    itm.factorCloudsValue = 0
                  }
                })
                if (row.addrs) {
                  const numTypeList = row.addrs.map(j => ({ ...j, value: j.addr, label: j.title + getLineId(row.mac, j.addr) }))
                  let newConditionLineList
                  if (isStatusType) {
                    newConditionLineList = numTypeList
                  } else {
                    newConditionLineList = numTypeList.filter(v => `${v.value}` !== '101')
                  }
                  val.children[this.thirdLevelIndex].conditionLineList = newConditionLineList
                } else {
                  val.children[this.thirdLevelIndex].conditionLineList = []
                  isStatusType ? (val.children[this.thirdLevelIndex].conditionLineStatusTypeList = statusList) : (val.children[this.thirdLevelIndex].conditionLineNumTypeList = statusList)
                }
              }
            })
          }
        })
      },
      async getStatusType(val, item) {
        const params = {
          mac: this.reciveData.mac,
          addrs: val,
        }
        const { success, data, message } = await getEdgePortTypeList(params)
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }
        item.conditionPortList = data.map(v => ({ ...v, label: v.typeName, value: v.type }))
      },
      getLinePortLists(val) {
        // 父组件有调用勿删
        const copyfun = () => val
        this.reciveData = copyfun()
        const addrsList = val.addrs
        this.conditionAddrList = addrsList.map(item => ({ ...item, value: item.addr, label: item.title + getLineId(val.mac, item.addr) }))
      },
      handleDeleteparentItem(parentIndex) {
        this.marginalObj.splice(parentIndex, '1')
      },
      deleteCloudsItemAction(index) {
        this.cloudsObj.splice(index, '1')
      },
      deleteConditionType(parentIndex, index) {
        if (this.cloudsObj[parentIndex].conditionList.length === 1) {
          return this.$Message.error({
            content: this.$t('leastOneConditionType'),
          })
        }
        this.cloudsObj[parentIndex].conditionList.splice(index, 1)
      },
      handleAddcloudsparentItemAction(parentIndex, parentItem, actiontype) {
        let conditonLen = this.cloudsObj.map(item => item.conditionList).flat(1)
        let addLen = conditonLen.length + (actiontype === 'copy' ? this.cloudsObj[parentIndex].conditionList.length : 1)
        if (addLen > 9) {
          return this.$Message.error({
            content: this.$t('max9conditionType'),
          })
        }
        if (actiontype === 'add') {
          const copyObj = copyCloudsObj()
          this.cloudsObj.push({ ...copyObj })
          const len = this.cloudsObj.length - 1
          this.cloudsObj[len].groupLetter = this.$t('conditionGroup') + String.fromCharCode(65 + len)
        } else {
          const copyItem = () => parentItem
          const iTemObj = copyItem()
          this.cloudsObj.push({ ...iTemObj })
        }
      },
      handleAddparentItemAction(parentIndex, parentItem, actiontype) {
        // 限制条件类型不超过9个-----------------------------------
        let conditonLen = this.marginalObj.map(item => item.conditionList).flat(1)
        let addLen = conditonLen.length + (actiontype === 'copy' ? this.marginalObj[parentIndex].conditionList.length : 1)
        if (addLen > 9) {
          return this.$Message.error({
            content: this.$t('max9conditionType'),
          })
        }
        // ----------------------------------------
        const randomAbc = this.setDesc().splice(65 + 1)
        if (actiontype === 'add') {
          this.marginalObj.push({
            groupLetter: this.$t('conditionGroup') + randomAbc[this.marginalObjletter],
            marginalValue: '1',
            titleVal: '',
            conditionList: [
              {
                conditionType: '1',
                letter: 0,
                grandsonItemButtonShow: true,
                conditonDetermineValue: 0,
                conditional: '',
                conditionalType: '',
                children: [
                  {
                    conditionLetter: 'A',
                    conditionAddr: '',
                    conditionPortList: [],
                    conditionStatusTypeList: [],
                    conditionValueTypeList: [],
                    conditionPort: '',
                    conditionFactor: '1',
                    conditionStatusType: '',
                    conditionValueType: '',
                  },
                ],
              },
            ],
          })
        } else {
          let item = {
            marginalValue: parentItem.marginalValue,
            titleVal: parentItem.titleVal,
            groupLetter: parentItem.groupLetter,
            conditionList: [],
          }
          parentItem.conditionList.map(val => {
            item.conditionList.push({
              conditionType: val.conditionType,
              letter: val.letter,
              grandsonItemButtonShow: val.grandsonItemButtonShow,
              children: [...val.children],
              conditional: val.conditional,
              conditionalType: val.conditionalType,
              conditonDetermineValue: val.conditonDetermineValue,
            })
          })
          this.marginalObj.push(item)
        }
        this.marginalObjletter++
      },
      handleAddcloudsObjchildItem(item, index, parentIndex, type) {
        const lenClouds = this.cloudsObj.map(v => v.conditionList).flat(1)
        if (lenClouds.length + 1 > 9) {
          return this.$Message.error({
            content: this.$t('max9conditionType'),
          })
        }
        if (type === 'add') {
          const conDiton = copyConditionObj()
          this.cloudsObj[parentIndex].conditionList.push({ ...conDiton })
        } else {
          const copyItems = () => item
          const newTem = copyItems()
          this.cloudsObj[parentIndex].conditionList.push({ ...newTem })
        }
      },
      handleAddchildItem(parentIndex, childItem, actiontype) {
        // 限制条件类型不超过9个--------------------------------------------------
        let conditonLen
        conditonLen = this.marginalObj.map(item => item.conditionList).flat(1)
        if (conditonLen.length + 1 > 9) {
          return this.$Message.error({
            content: this.$t('conditionTypeExceed'),
          })
        }
        // ----------------------------------------
        if (actiontype === 'add') {
          this.marginalObj[parentIndex].conditionList.push({
            conditionType: '1',
            letter: 0,
            grandsonItemButtonShow: true,
            children: [
              {
                conditionLetter: 'A',
                conditionAddr: '',
                conditionFactor: '1',
                conditionPortList: [],
                conditionStatusTypeList: [],
                conditionValueTypeList: [],
                conditionPort: '',
                conditionStatusType: '',
              },
            ],
          })
        } else {
          let item = {
            conditionType: childItem.conditionType,
            letter: childItem.letter,
            children: childItem.children,
          }
          this.marginalObj[parentIndex].conditionList.push(item)
        }
      },
      handleChildItemDelete(childIndex, parentIndex) {
        if (this.marginalObj[parentIndex].conditionList.length === 1) {
          return this.$Message.error({
            content: this.$t('leastOneConditionType'),
          })
        }
        this.marginalObj[parentIndex].conditionList.splice(childIndex, '1')
      },
      handlecloudsItemAction(grandsonIndex, childIndex, parentIndex, Item, type) {
        const lenChild = this.cloudsObj[parentIndex].conditionList[childIndex].children
        if (lenChild.length + 1 > 16) {
          return this.$Message.error({
            content: this.$t('conditionObjectExceed'),
          })
        }
        const letter = String.fromCharCode(65 + lenChild.length)
        if (type === 'copy') {
          const copyChild = () => Item
          const childObj = copyChild()
          this.cloudsObj[parentIndex].conditionList[childIndex].children.push({ ...childObj, conditionLetter: letter })
        } else {
          const childrens = copyChildern()
          this.cloudsObj[parentIndex].conditionList[childIndex].children.push({ ...childrens, conditionLetter: letter })
        }
      },
      handleGrandsonItemAction(grandsonIndex, childIndex, parentIndex, grandsonItem, actiontype) {
        // 线路不能超过16条----------------------
        const lineLen = this.marginalObj[parentIndex].conditionList[childIndex].children
        if (lineLen.length + 1 > 16) {
          return this.$Message.error({
            content: this.$t('conditionLineExceed'),
          })
        }
        // ----------------------------
        const randomAbc = this.setDesc().splice(65 + 1)
        let letter = randomAbc[this.marginalObj[parentIndex].conditionList[childIndex].letter]
        if (actiontype === 'add') {
          this.marginalObj[parentIndex].conditionList[childIndex].children.push({
            conditionLetter: !letter ? 'A' : letter,
            conditionAddr: '',
            conditionFactor: '1',
            conditionPortList: [],
            conditionStatusTypeList: [],
            conditionValueTypeList: [],
            conditionPort: '',
            conditionStatusType: '',
          })
        } else {
          let item = {
            conditionAddr: grandsonItem.conditionAddr,
            conditionPortList: grandsonItem.conditionPortList,
            conditionStatusTypeList: grandsonItem.conditionStatusTypeList,
            conditionValueTypeList: grandsonItem.conditionValueTypeList,
            conditionLetter: randomAbc[this.marginalObj[parentIndex].conditionList[childIndex].letter],
            conditionPort: grandsonItem.conditionPort,
            conditionStatusType: grandsonItem.conditionStatusType,
            conditionFactor: grandsonItem.conditionFactor,
          }
          let arr = [...this.marginalObj[parentIndex].conditionList[childIndex].children, item]
          this.marginalObj[parentIndex].conditionList[childIndex].children = arr
        }
        this.marginalObj[parentIndex].conditionList[childIndex].letter++
        this.marginalObj[parentIndex].conditionList[childIndex].grandsonItemButtonShow = this.marginalObj[parentIndex].conditionList[childIndex].children.length < 16
      },
      handleCloudsItemDelete(grandsonIndex, childIndex, parentIndex) {
        if (this.cloudsObj[parentIndex].conditionList[childIndex].children.length === 1) {
          return this.$Message.error({
            content: this.$t('leastOneConditionObject'),
          })
        }
        this.cloudsObj[parentIndex].conditionList[childIndex].children.splice(grandsonIndex, 1)
      },
      handleGrandsonItemDelete(grandsonIndex, childIndex, parentIndex, grandsonItem) {
        if (this.marginalObj[parentIndex].conditionList[childIndex].children.length === 1) {
          return this.$Message.error({
            content: this.$t('leastOneLine'),
          })
        }
        const randomAbc = this.setDesc().splice(65)
        this.marginalObj[parentIndex].conditionList[childIndex].children.splice(grandsonIndex, '1')
        this.marginalObj[parentIndex].conditionList[childIndex].letter--
        this.marginalObj[parentIndex].conditionList[childIndex].children.forEach((val, ind) => {
          randomAbc.map((ranval, ranInd) => {
            if (ind === ranInd) {
              val.conditionLetter = ranval
            }
          })
        })
      },
      setDesc() {
        const letterArr = []
        // 字母A的code值是65
        for (let i = 65; i < 91; i++) {
          letterArr[i] = String.fromCharCode(i)
        }
        return letterArr
      },
    },
    watch: {
      '$store.state.linkageMode': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.linkageMode = newVal
          }
        },
      },
    },
  }
</script>
<style lang="less">
  .inputDeviceStyle {
    padding: 5px 0 5px 5px;
    display: inline-block;
    width: 200px;
    height: 32px;
    border: 1px solid #3d3d41;
    border-radius: 4px;
  }
  .inputDeviceStyle:hover {
    border-color: #57a3f3;
  }
  .font-20 {
    font-size: 20px;
  }
  .w200 {
    width: 200px;
  }
  .grays-box {
    color: #909399;
    background: rgba(144, 147, 153, 0.15);
    height: 22px;
    width: 25px;
    padding: 1px 6px;
  }
  .conditionConfiguration {
    .ivu-select-dropdown {
      overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    margin-top: 10px;
    .pd-16 {
      padding: 16px;
    }

    .lft-box {
      background: #363d4d;
      width: 30px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .w180 {
      width: 180px;
    }
    .text-right {
      padding: 10px;
      margin-left: 70px;
      width: 20%;
      text-align: right;
    }
    .marL-20 {
      margin-left: 25px;
    }
    .marl-10 {
      margin-left: 5px;
    }
    .marl-15 {
      margin-left: 10px;
    }
    .mar-lr {
      margin: 0 30px;
    }
    .flex-1 {
      flex: 1;
    }
    .mar {
      margin: 10px;
    }
    .space-betw {
      display: flex;
      justify-content: space-between;
    }

    .action {
      Button {
        padding: 5px;
        margin-right: 10px;
      }
      // .ivu-icon {
      //   font-size: 20px;
      // }
    }
    .pd-t {
      padding-top: 5px;
    }
    .w300 {
      width: 300px;
    }
    .left {
      display: flex;
    }
    .right {
    }
    .arrange {
      display: flex;
    }
    .border-obj {
      border: 1px solid #55575c;
      border-radius: 5px;
      margin-bottom: 15px;
    }
    .parentsItem {
      .addchildBtn {
        margin-top: 10px;
        background: rgba(2, 167, 240, 0.1);
        border: 1px dotted #02a7f0;
        color: #02a7f0;
      }
      .childItem {
        border: 1px solid #55575c;
        border-radius: 5px;
        padding: 16px;
        margin-top: 10px;
        .header {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
        }
        .childList {
          border: 1px solid #55575c;
          border-radius: 5px;
          // padding: 10px;
          margin-bottom: 10px;
          .ivu-form-item {
            margin-bottom: 0px !important;
          }

          .childletter {
            background: #363d4d;
            width: 3%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
    .addrGroup {
      width: 100%;
      margin-top: 10px;
      background: rgba(2, 167, 240, 0.1);
      border: 1px dotted #02a7f0;
      color: #02a7f0;
    }
    .ivu-collapse-header {
      height: 50px !important;
      display: flex;
      align-items: center;
      background: #363d4d;
      border-color: #797979 !important;
      padding: 5px 0px;
    }
    .ivu-collapse-content-box {
      padding-top: 6px;
    }
    .ivu-collapse {
      border: 1px solid #797979;
    }

    .ivu-icon-ios-arrow-forward:before {
      content: '\e6d0';
      font-family: 'icon-v5';
    }
    // .icon {
    //   z-index: 999;
    // }
  }
</style>
