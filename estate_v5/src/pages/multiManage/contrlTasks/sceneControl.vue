<template>
  <div id="control">
    <Modal :title="title" :close-on-click-modal="false" v-model="sceneFlag" @close="detailsFlag = false" width="25%" top="30vh" id="scenes-form">
      <Form :model="scenes">
        <FormItem v-show="false" :label="$t('sceneId')" :label-width="120">
          <Input v-model="scenes.id" autocomplete="off"></Input>
        </FormItem>
        <FormItem :label="$t('sceneName')" :label-width="80">
          <Input v-model="scenes.name" autocomplete="off"></Input>
        </FormItem>
        <FormItem :label="$t('sceneRemarks')" :label-width="80">
          <Input v-model="scenes.remark" type="textarea" :rows="4" autocomplete="off"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button v-if="detailsFlag" class="b-blue detail" @click="handleDetails">{{ $t('sceneConfigure') }}</Button>
        <div class="btn">
          <Button class="b-blue" @click="handleSceneSave">{{ $t('save') }}</Button>
          <Button @click="handleSceneCancel" style="border-color: #fff">{{ $t('cancel') }}</Button>
        </div>
      </div>
    </Modal>
    <Modal :title="$t('lineSelected')" v-model="lineSelectionFlag" top="30vh" id="line-selection" @close="handleCloseLineSelection">
      <Form :model="lineSelection">
        <FormItem>
          <Row :gutter="8">
            <Col :span="7">
              <Select v-model="lineSelection.builds" :placeholder="$t('building')" @on-change="handleLineBuilding">
                <Option v-for="(item, index) in lineBuilding" :key="index" :value="item.name">
                  {{ item.name }}
                </Option>
              </Select>
            </Col>
            <Col :span="7">
              <Select v-model="lineSelection.unit" :placeholder="$t('unit1')" @on-change="handleLineUnit">
                <Option v-for="itm in lineUnit" :key="itm.name" :value="itm.name">
                  {{ itm.name }}
                </Option>
              </Select>
            </Col>
            <Col :span="7">
              <Select v-model="lineSelection.room" :placeholder="$t('room')">
                <Option v-for="item in lineRoom" :key="item.mac" :value="item.name + ' [' + item.mac + ']'">
                  {{ item.name + ' [' + item.mac + ']' }}
                </Option>
              </Select>
            </Col>
            <Col :span="3">
              <Button type="primary" @click="queryDeviceLines">{{ $t('query') }}</Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <Table :data="lineSelectionData" :columns="linecolumns">
        <template slot-scope="{ row }" slot="status">
          <span v-if="row.others.online === -1" class="b-info">{{ $t('disconnected') }}</span>
          <span v-else-if="!row.others.online || row.others.online === 0" class="b-danger">{{ $t('offline') }}</span>
          <span v-else-if="row.others.online === 1" class="b-success">{{ $t('online') }}</span>
        </template>

        <template slot-scope="{ row }" slot="action">
          <Tooltip :content="$t('addDeviceLine')" placement="top">
            <Button :class="row.others.assign ? 'b-primary' : 'b-info'" style="margin-right: 10px" :disabled="row.others.assign && row.others.assign === 'Y'" @click="handleAssign(row.mac, row.addr, 'add')"><i class="icon-v5 icon-v5-xiangyou"></i></Button>
          </Tooltip>
          <Tooltip :content="$t('deleteDeviceLine')" placement="top">
            <Button :class="!row.others.assign ? 'b-primary' : 'b-info'" :disabled="!row.others.assign && row.others.assign !== 'Y'" @click="handleAssign(row.mac, row.addr, 'del')"><i class="icon-v5 icon-v5-xiangzuo"></i></Button>
          </Tooltip>
        </template>
      </Table>
      <div slot="footer"></div>
    </Modal>
    <Modal :title="$t('addEditTiming')" v-model="timerFlag" width="45%" top="30vh" id="scene-timer">
      <Form :model="sceneTimer">
        <FormItem :label="$t('timingType') + ':'" :label-width="120">
          <Select :clearable="true" v-model="sceneTimer.timerType" :placeholder="$t('pleaseSelect')" @on-change="handleTimerType">
            <Option v-for="(item, index) in timerType" :key="index" :label="item.name" :value="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('time') + ':'" :label-width="120">
          <DatePicker v-if="sceneTimer.timerType === '1'" v-model="sceneTimer.time" format="yyyy-MM-dd HH:mm" :clearable="false" value-format="yyyy-MM-dd HH:mm" type="datetime" :editable="false"></DatePicker>
          <TimePicker v-if="sceneTimer.timerType === '2'" v-model="sceneTimer.time" format="HH:mm" value-format="HH:mm"></TimePicker>
        </FormItem>
        <FormItem :label="$t('state') + ':'" :label-width="120">
          <Select :clearable="true" v-model="sceneTimer.timerStatus">
            <Option v-for="(item, index) in timerStatus" :key="index" :label="item.name" :value="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('repeat') + ':'" :label-width="120" v-if="sceneTimer.timerType === '2'">
          <CheckboxGroup v-model="sceneTimer.week" @on-change="handleCheckedWeekChange">
            <Checkbox v-for="week in weekList" :label="week" :key="week" :disabled="sceneTimer.timerType === '1'">{{ week }}</Checkbox>
          </CheckboxGroup>
          <Checkbox :indeterminate="isIndeterminate" v-model="checkAll" :disabled="sceneTimer.timerType === '1'" @on-change="handleCheckAllChange">{{ $t('selectAll') }}</Checkbox>
        </FormItem>
      </Form>
      <div class="dialog-footer" style="display: flex; justify-content: flex-end">
        <Button @click="handleSceneTimerCancel" style="margin-right: 10px">{{ $t('cancel') }}</Button>
        <Button class="b-blue" @click="handleSceneTimerSave">{{ $t('confirm') }}</Button>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal :title="$t('sceneDetails')" :close-on-click-modal="false" v-model="sceneViewFlag" width="35%" top="30vh" id="scene-view">
      <div>
        <div class="clearfix">
          <span style="margin-bottom: 10px; padding-bottom: 10px">{{ $t('addedTiming') }}</span>
          <Button type="primary" @click="handleSceneTimer(sceneId)">{{ $t('addTimer') }}</Button>
        </div>
        <Table :columns="timerColumns" :data="timerList">
          <template slot-scope="{ row }" slot="weekday">
            <span>{{ row.weekday ? $t('weekly') + row.weekday : $t('single') }}</span>
          </template>
          <template slot-scope="{ row }" slot="status">
            <span :class="row.status === 'true' ? 'c-success' : 'c-danger'">{{ row.status === 'true' ? $t('closing') : $t('opening') }}</span>
          </template>
          <template slot-scope="{ row }" slot="operation">
            <span class="c-primary" @click="handleSceneTimer(sceneId, row)" style="margin-right: 10px">{{ $t('edit') }}</span>
            <span class="c-danger" @click="handleDelSceneTimer(row.timeId)">{{ $t('delete') }}</span>
          </template>
        </Table>
      </div>
      <div style="margin-top: 20px">
        <div class="clearfix">
          <span>{{ $t('addedLine') }}</span>
          <Button type="primary" @click="handleLine(sceneId)">{{ $t('addCircuit') }}</Button>
        </div>
        <Table :columns="addrListColumns" :data="addrList" style="margin-top: 10px">
          <template slot-scope="{ row }" slot="addrs">
            <div v-for="(v, i) in row.addrs" :key="i">
              <span>{{ v.title ? v.title : $t('line') + ':' + v.addr }}</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="build">
            {{ row.build + row.unit + row.room + '(' + row.mac + ')' }}
          </template>
          <template slot-scope="{ row }" slot="operation">
            <div v-for="(v, i) in row.addrs" :key="i">
              <span class="c-danger" @click="handleAssign(row.mac, v.addr, 'del')">{{ $t('delete') }}</span>
            </div>
          </template>
        </Table>
      </div>
    </Modal>
    <Modal :title="$t('equipmentParameterAdjustment')" :close-on-click-modal="false" :modal="false" :visible.sync="adjustmentFlag" top="30vh" width="120%" id="adjustment-view">
      <Form :model="adjustment">
        <Row>
          <Col :span="24">
            <Col :span="12">
              <FormItem :label="$t('equipmentNo') + ':'" :label-width="100" class="adjustment-mac">
                <Input v-model="adjustment.mac" autocomplete="off" readonly></Input>
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="$t('deviceAliases') + ':'" :label-width="100">
                <Input v-if="aliasFlag" v-model="adjustment.name" @blur="handleAlias(adjustment.mac, adjustment.name)" @keyup.enter.native="$event.target.blur" autocomplete="off"></Input>
                <span v-else class="adjustment-alias" @mouseover="aliasIndex = adjustment.mac" @mouseout="aliasIndex = -1">
                  {{ adjustment.name }}
                  <transition name="fades"><i class="icon-v5 icon-v5 icon-v5-bianji" v-show="aliasIndex === adjustment.mac" @click="aliasFlag = !aliasFlag"></i></transition>
                </span>
              </FormItem>
            </Col>
          </Col>
          <Col :span="24">
            <FormItem>
              {{ $t('alarmThresholdSetting') + '：' }}
              <Button type="text" :style="{ fontSize: '18px' }" :disabled="disabledFlag" @click="handleAdjustment(adjustment.mac, adjustment.name)"><i class="icon-v5 icon-v5-shuaxin"></i></Button>
            </FormItem>
          </Col>
          <Col :span="24">
            <FormItem v-for="(item, index) in adjustments" :key="index">
              <Input v-if="nodeFlag === index" class="adjustment-title" @blur="handleNodeTitle(adjustment.mac, item.nodeNo, item.title)" @keyup.enter.native="$event.target.blur" v-model="item.title" autocomplete="off"></Input>
              <span v-else @mouseover="adjustmentLineIndex = item.nodeNo" @mouseout="adjustmentLineIndex = -1" class="adjustment-name">
                <transition name="fades"><i class="icon-v5 icon-v5 icon-v5-bianji" v-show="adjustmentLineIndex === item.nodeNo" @click="nodeFlag = index"></i></transition>
                {{ item.title }}:
              </span>
              <Row class="adjustment-content">
                <Col :span="4" v-show="item.curL || item.curL === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'curL')" @mouseout.stop="adjustmentIndex = -1">
                    {{ $t('currentLowerLimit') }}:
                    <Input v-model="item.curL" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.curL, item.curH, '0xC8')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-curL'" autocomplete="off"></Input>
                    <span v-else>{{ item.curL }}</span>
                    A
                    <transition name="fades"><i class="icon-v5 icon-v5-bianji" v-show="adjustmentIndex === index + '-curL'" @click="handleModel(index, 'curL')"></i></transition>
                  </span>
                </Col>
                <Col :span="4" v-show="item.curH || item.curH === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'curH')" @mouseout.stop="adjustmentIndex = -1">
                    {{ $t('currentLimit') }}:
                    <Input v-model="item.curH" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.curL, item.curH, '0xC8')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-curH'" autocomplete="off"></Input>
                    <span v-else>{{ item.curH }}</span>
                    A
                    <transition name="fades"><i class="icon-v5 icon-v5-bianji" v-show="adjustmentIndex === index + '-curH'" @click="handleModel(index, 'curH')"></i></transition>
                  </span>
                </Col>
                <Col :span="4" v-show="item.volL || item.volL === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'volL')" @mouseout.stop="adjustmentIndex = -1">
                    {{ $t('voltageLowerLimit') }}:
                    <Input v-model="item.volL" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.volL, item.volH, '0xC7')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-volL'" autocomplete="off"></Input>
                    <span v-else>{{ item.volL }}</span>
                    V
                    <transition name="fades"><i class="icon-v5 icon-v5-bianji" v-show="adjustmentIndex === index + '-volL'" @click="handleModel(index, 'volL')"></i></transition>
                  </span>
                </Col>
                <Col :span="4" v-show="item.volH || item.volH === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'volH')" @mouseout.stop="adjustmentIndex = -1">
                    {{ $t('voltageLimit') }}:
                    <Input v-model="item.volH" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.volL, item.volH, '0xC7')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-volH'" autocomplete="off"></Input>
                    <span v-else>{{ item.volH }}</span>
                    V
                    <transition name="fades"><i class="icon-v5 icon-v5-bianji" v-show="adjustmentIndex === index + '-volH'" @click="handleModel(index, 'volH')"></i></transition>
                  </span>
                </Col>
                <Col :span="4" v-show="item.pwrL || item.pwrL === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'pwrL')" @mouseout.stop="adjustmentIndex = -1">
                    {{ $t('powerLowerLimit') }}:
                    <Input v-model="item.pwrL" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.pwrL, item.pwrH, '0xC6')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-pwrL'" autocomplete="off"></Input>
                    <span v-else>{{ item.pwrL }}</span>
                    W
                    <transition name="fades"><i class="icon-v5 icon-v5-bianji" v-show="adjustmentIndex === index + '-pwrL'" @click="handleModel(index, 'pwrL')"></i></transition>
                  </span>
                </Col>
                <Col :span="4" v-show="item.pwrH || item.pwrH === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'pwrH')" @mouseout.stop="adjustmentIndex = -1">
                    {{ $t('powerLimit') }}
                    <Input v-model="item.pwrH" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.pwrL, item.pwrH, '0xC6')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-pwrH'" autocomplete="off"></Input>
                    <span v-else>{{ item.pwrH }}</span>
                    W
                    <transition name="fades"><i class="icon-v5 icon-v5-bianji" v-show="adjustmentIndex === index + '-pwrH'" @click="handleModel(index, 'pwrH')"></i></transition>
                  </span>
                </Col>
                <Col :span="4" v-show="item.lkiL || item.lkiL === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'lkiL')" @mouseout.stop="adjustmentIndex = -1">
                    {{ $t('leakageLowerLimit') }}:
                    <Input v-model="item.lkiL" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.lkiL, item.lkiH, '0xC9')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-lkiL'" autocomplete="off"></Input>
                    <span v-else>{{ item.lkiL }}</span>
                    mA
                    <transition name="fades"><i class="icon-v5 icon-v5-bianji" v-show="adjustmentIndex === index + '-lkiL'" @click="handleModel(index, 'lkiL')"></i></transition>
                  </span>
                </Col>
                <Col :span="4" v-show="item.lkiH || item.lkiH === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'lkiH')" @mouseout.stop="adjustmentIndex = -1">
                    {{ $t('leakageLimit') }}:
                    <Input v-model="item.lkiH" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.lkiL, item.lkiH, '0xC9')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-lkiH'" autocomplete="off"></Input>
                    <span v-else>{{ item.lkiH }}</span>
                    mA
                    <transition name="fades"><i class="icon-v5 icon-v5-bianji" v-show="adjustmentIndex === index + '-lkiH'" @click="handleModel(index, 'lkiH')"></i></transition>
                  </span>
                </Col>
                <Col :span="4" v-show="item.tmpL || item.tmpL === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'tmpL')" @mouseout.stop="adjustmentIndex = -1">
                    {{ $t('lowerTemperatureLimit') }}:
                    <Input v-model="item.tmpL" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.tmpL, item.tmpH, '0xCA')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-tmpL'" autocomplete="off"></Input>
                    <span v-else>{{ item.tmpL }}</span>
                    ℃
                    <transition name="fades"><i class="icon-v5 icon-v5-bianji" v-show="adjustmentIndex === index + '-tmpL'" @click="handleModel(index, 'tmpL')"></i></transition>
                  </span>
                </Col>
                <Col :span="4" v-show="item.tmpH || item.tmpH === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'tmpH')" @mouseout.stop="adjustmentIndex = -1">
                    {{ $t('temperatureLimit') }}:
                    <Input v-model="item.tmpH" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.tmpL, item.tmpH, '0xCA')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-tmpH'" autocomplete="off"></Input>
                    <span v-else>{{ item.tmpH }}</span>
                    ℃
                    <transition name="fades"><i class="icon-v5 icon-v5-bianji" v-show="adjustmentIndex === index + '-tmpH'" @click="handleModel(index, 'tmpH')"></i></transition>
                  </span>
                </Col>
              </Row>
              <div class="divider-gray"></div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import { getBuildings, syncScene, queryChannels, scenesLock, scenesUpdate, scenesDel, scenesCtlOc, addrMod, timerMod, sceneInfo, queryChnlAttr, macAlias, updateNodeTitle, updateChnlAttr } from '@/api/multiManage/sceneControl'
  import CommandFeedback from '../../Common/CommandFeedback'
  import Synchronize from '../../Control/Synchronize.vue'
  export default {
    data() {
      return {
        form: {},
        sceneFlag: false,
        scenesData: [],
        scenes: {
          id: '',
          name: '',
          remark: '',
        },
        scenelds: '',
        lineSelectionFlag: false,
        lineSelectionData: [],
        lineBuilding: [],
        lineUnit: [],
        lineRoom: [],
        lineSelection: {
          builds: '',
          unit: '',
          room: '',
        },
        extParam: '',
        timerFlag: false,
        timerId: '',
        timerType: [
          {
            name: this.$t('singleTiming'),
            value: '1',
          },
          {
            name: this.$t('cycleTiming'),
            value: '2',
          },
        ],
        timerStatus: [
          {
            name: this.$t('closing'),
            value: 'true',
          },
          {
            name: this.$t('opening'),
            value: 'false',
          },
        ],
        weekList: [this.$t('sunday'), this.$t('monday'), this.$t('tuesday'), this.$t('wednesday'), this.$t('thursday'), this.$t('friday'), this.$t('saturday')],
        checkAll: false,
        isIndeterminate: true,
        instructionsFlag: false,
        instructionsData: {},
        sceneTimer: {
          timerType: '1',
          timerStatus: 'true',
          time: this.$func.getNowFormatDateTime(),
          week: [],
        },
        sceneViewFlag: false,
        sceneName: '',
        sceneId: '',
        timerList: [],
        addrList: [],
        checkBuildIndex: 0,
        adjustmentFlag: false,
        adjustments: [],
        adjustment: {
          mac: '',
          name: '',
        },
        adjustmentIndex: -1,
        adjustmentModelIndex: -1,
        adjustmentLineIndex: -1,
        nodeFlag: -1,
        aliasIndex: -1,
        aliasFlag: false,
        title: '',
        loading: false,
        disabledFlag: false,
        syncFlag: false,
        detailsFlag: false,
        tableComponentHeight: this.$store.state.channelsTableHeight,
        feedbackTime: [''],
        scenescolumns: [
          {
            title: this.$t('sceneName'),
            slot: 'sceneName',
          },
          {
            title: this.$t('state'),
            slot: 'status',
            width: 200,
            align: 'center',
          },
          {
            title: this.$t('sceneDescription'),
            key: 'remark',
            align: 'center',
          },
          {
            title: this.$t('operation'),
            slot: 'operating',
            width: 400,
            align: 'center',
          },
        ],
        linecolumns: [
          {
            title: this.$t('lineName'),
            key: 'title',
            align: 'center',
            width: 200,
          },
          {
            title: this.$t('state'),
            slot: 'status',
            align: 'center',
          },
          {
            title: this.$t('operation'),
            slot: 'action',
            align: 'center',
          },
        ],
        timerColumns: [
          {
            title: this.$t('time'),
            key: 'time',
          },
          {
            title: this.$t('timingType'),
            slot: 'weekday',
          },
          {
            title: this.$t('state'),
            slot: 'status',
          },
          {
            title: this.$t('operation'),
            slot: 'operation',
          },
        ],
        addrListColumns: [
          {
            title: this.$t('line'),
            slot: 'addrs',
          },
          {
            title: this.$t('owningDevice'),
            slot: 'build',
          },
          {
            title: this.$t('operation'),
            slot: 'operation',
          },
        ],
      }
    },
    mounted() {},
    methods: {
      reset() {
        this.instructionsData.mac = ''
      },

      queryFeedbackList() {
        this.$refs.CommandFeedback.handleFeedBackList()
      },
      handleViewScene() {
        this.$nextTick(function () {
          let params = {
            projectCode: this.$store.state.projectCode,
            sceneId: this.id,
          }
          sceneInfo(params)
            .then(res => {
              if (res.success) {
                this.timerList = res.data.timers
                this.addrList = res.data.devices
                this.sceneName = res.data.sceneName
                this.sceneId = this.id
                this.sceneViewFlag = true
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
                  content: this.$t('unknown'),
                })
              }
            })
        })
      },
      handleSceneStatus(ele) {
        let params = {
          projectCode: this.$store.state.projectCode,
          sceneId: ele,
        }
        scenesLock(params)
          .then(res => {
            if (res.success) {
              this.queryScenes()
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
                content: this.$t('unknown'),
              })
            }
          })
      },
      handleSceneEdit(obj, val) {
        if (val === 'edit') {
          this.title = this.$t('editScene')
          this.detailsFlag = true
        } else {
          this.title = this.$t('addScene')
          this.detailsFlag = false
        }
        this.scenes.id = ''
        this.scenes.name = ''
        this.scenes.remark = ''
        this.sceneFlag = true
        if (obj.sceneId) {
          this.scenes.id = obj.sceneId
          this.scenes.name = obj.sceneName
          this.scenes.remark = obj.remark
        }
      },
      handleDetails() {
        this.sceneFlag = false
        this.detailsFlag = false
        this.handleViewScene(this.scenes.id)
      },
      handleSceneCancel() {
        this.sceneFlag = false
        this.detailsFlag = false
        this.scenes.id = ''
        this.scenes.name = ''
        this.scenes.remark = ''
      },
      handleSceneSave() {
        if (this.scenes.name === '') {
          this.$Message.error({
            content: this.$t('pleaseEnterSceneName'),
          })
          return false
        }
        let params = {
          projectCode: this.$store.state.projectCode,
          sceneId: this.scenes.id,
          sceneName: this.scenes.name,
          remark: this.scenes.remark,
        }
        scenesUpdate(params)
          .then(res => {
            if (res.success) {
              this.handleSceneCancel()
              this.queryScenes()
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
                content: this.$t('unknown'),
              })
            }
          })
      },
      handleSceneDel(ele) {
        let params = {
          projectCode: this.$store.state.projectCode,
          sceneId: ele,
        }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmDeleteScene'),
          onOk: () => {
            scenesDel(params)
              .then(res => {
                if (res.success) {
                  this.queryScenes()
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
                    content: this.$t('unknown'),
                  })
                }
              })
          },
          onCancel: () => {
            this.$Message.info({
              content: this.$t('cancelDelete'),
            })
          },
        })
      },
      handleSceneOc(ele, oc) {
        let params = {
          projectCode: this.$store.state.projectCode,
          sceneId: ele,
          openClose: oc,
          _operate_at: '3' + ':' + ele,
        }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: oc ? this.$t('whetherAKeyOpenThisScene') : this.$t('whetherAKeyCloseThisScene'),
          onOk: () => {
            scenesCtlOc(params)
              .then(res => {
                if (res.success) {
                  this.$Message.success({
                    content: this.$t('submitCommand'),
                  })
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
                    content: this.$t('unknown'),
                  })
                }
              })
          },
          onCancel: () => {
            this.$Message.info({
              content: oc ? this.$t('oneButtonCanceledOpenScene') : this.$t('oneButtonCanceledCloseScene'),
            })
          },
        })
      },
      handleInstructions(row) {
        this.instructionsFlag = true
        this.instructionsData = row
        this.feedbackTime = [this.$func.formatDate('yyyy-MM-dd HH:mm:ss', new Date() - 86400000 * 7), this.$func.getNowFormatDateTime()]
      },
      handleBack() {
        this.instructionsFlag = false
        this.syncFlag = false
      },
      handleLine(ele) {
        this.lineSelectionFlag = true
        this.extParam = ele
        this.sceneId = ele
        this.handleGetBuildings()
      },
      handleGetBuildings() {
        let params = {
          projectCode: this.$store.state.projectCode,
          all: true,
        }
        getBuildings(params)
          .then(res => {
            this.lineBuilding = res.data

            this.lineSelection.builds = this.lineBuilding[0].name
            this.lineUnit = this.lineBuilding[0].childs
            this.lineSelection.unit = this.lineUnit[0].name

            this.lineRoom = this.lineUnit[0].childs

            this.lineSelection.room = this.lineUnit[0].childs[0].name + ' [' + this.lineUnit[0].childs[0].mac + ']'
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      getAllBuilding() {
        let params = {
          projectCode: this.$store.state.projectCode,
          all: true,
        }
        getBuildings(params)
          .then(res => {
            this.lineBuilding = res.data
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      handleLineBuilding(val) {
        //
        this.lineSelection.builds = val
        let newlineUnit = []
        this.lineSelection.room = ''
        this.lineRoom = []
        this.lineUnit = []
        this.lineBuilding.map(item => {
          if (item.name === val) {
            item.childs.map(itm => {
              newlineUnit.push(itm)
            })
          }
        })
        this.lineUnit = newlineUnit
      },
      handleLineUnit(val) {
        if (val && val.length > 0) {
          let newRoom = []
          this.lineUnit.map(item => {
            if (item.name === val) {
              newRoom.push(...item.childs)
            }
          })
          this.lineRoom = newRoom
        } else {
        }
      },
      handleCloseLineSelection() {
        this.lineSelection.builds = ''
        this.lineSelection.units = ''
        this.lineSelection.room = ''
        this.lineSelectionData = []
      },
      queryDeviceLines() {
        let params = {
          pageNo: 1,
          pageSize: 10,
          projectCode: this.$store.state.projectCode,
          build: this.lineSelection.builds,
          unit: this.lineSelection.unit,
          room: this.lineSelection.room !== '' ? this.lineSelection.room.split('[')[1].split(']')[0] : '',
          mac: this.lineSelection.room !== '' ? this.lineSelection.room.split('[')[1].split(']')[0] : '',
          forwhat: 'SCENE_DETAIL',
          extParam: this.extParam,
        }

        queryChannels(params)
          .then(res => {
            if (res.success) {
              this.lineSelectionData = res.datas
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
                content: this.$t('unknown'),
              })
            }
          })
      },
      handleAssign(mac, addr, oper) {
        let params = {
          projectCode: this.$store.state.projectCode,
          sceneId: this.sceneId,
          mac: mac,
          addr: addr,
          oper: oper,
        }
        addrMod(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: this.$t('scene') + this.$t('line') + (oper === 'add' ? this.$t('add') : this.$t('delete')) + this.$t('success') + '！',
            })
            this.queryDeviceLines()
            this.queryScenes()
            if (this.sceneViewFlag === true) {
              this.handleViewScene(this.sceneId)
            }
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
      },
      handleSceneTimer(ele, obj) {
        this.extParam = ele
        this.timerFlag = true
        if (obj) {
          if (obj.weekday) {
            this.sceneTimer.timerType = '2'
            this.sceneTimer.week = obj.weekday.split(',')
            if (this.sceneTimer.week.length === 7) {
              this.isIndeterminate = false
              this.checkAll = true
            } else {
              this.isIndeterminate = true
              this.checkAll = false
            }
          } else {
            this.sceneTimer.timerType = '1'
            this.isIndeterminate = false
            this.checkAll = false
          }
          this.sceneTimer.time = obj.time
          this.sceneTimer.timerStatus = obj.status
          this.timerId = obj.timerId
        }
      },
      handleCheckAllChange(val) {
        this.sceneTimer.week = val ? this.weekList : []
        this.isIndeterminate = false
      },
      handleCheckedWeekChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.weekList.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.weekList.length
      },
      handleSceneTimerSave() {
        if (this.sceneTimer.timerType === '2' && this.sceneTimer.week.length === 0) {
          this.$Message.error({
            content: this.$t('selectDuplicate'),
          })
          return false
        }
        let selectTime = ''
        if (this.sceneTimer.time.length === 5 || this.sceneTimer.time.length === 16) {
          selectTime = this.sceneTimer.time + ':00'
        } else {
          selectTime = this.sceneTimer.time.substring(0, this.sceneTimer.time.length - 2) + '00'
        }
        let params = {
          sceneId: this.extParam,
          timerId: this.timerId,
          weekday: this.sceneTimer.week.join(','),
          timerType: this.sceneTimer.timerType,
          time: selectTime,
          status: this.sceneTimer.timerStatus,
          projectCode: this.$store.state.projectCode,
          oper: 'add',
        }
        timerMod(params)
          .then(res => {
            if (res.success) {
              this.timerFlag = false
              this.sceneTimer.week = []
              this.sceneTimer.timerType = '1'
              this.sceneTimer.timerStatus = 'true'
              this.sceneTimer.time = this.$func.getNowFormatDateTime()
              this.$Message.success({
                content: res.message,
              })
              if (this.sceneViewFlag === true) {
                this.handleViewScene(this.sceneId)
                this.timerId = ''
              }
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
                content: this.$t('unknown'),
              })
            }
          })
      },
      handleSceneTimerCancel() {
        this.extParam = ''
        this.timerFlag = false
        this.sceneTimer.week = []
        this.sceneTimer.timerType = '1'
        this.sceneTimer.timerStatus = 'true'
        this.sceneTimer.time = this.$func.getNowFormatDateTime()
      },
      handleTimerType(val) {
        if (val === '2') {
          this.sceneTimer.time = this.$func.getNowFormatDateTime('time')
        } else if (val === '1') {
          this.sceneTimer.time = this.$func.getNowFormatDateTime()
          this.sceneTimer.week = []
        }
      },

      handleDelSceneTimer(ele) {
        let params = {
          projectCode: this.$store.state.projectCode,
          sceneId: this.sceneId,
          timerId: ele,
          oper: 'del',
        }
        timerMod(params)
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: res.message,
              })
              if (this.sceneViewFlag === true) {
                this.handleViewScene(this.sceneId)
              }
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
                content: this.$t('unknown'),
              })
            }
          })
      },
      renderCheckbox() {
        this.lineCheckedUnit = this.lineBuilding[0]['childs']
        this.lineCheckedRoom = this.lineCheckedUnit[0]['childs']
      },
      handleAdjustment(mac, name) {
        this.adjustmentFlag = true
        this.aliasFlag = false
        this.aliasIndex = -1
        this.nodeFlag = -1
        this.adjustmentLineIndex = -1
        this.adjustmentModelIndex = -1
        this.adjustment.mac = mac
        this.adjustment.name = name

        let ele = document.querySelector('.alarm-threshold-refresh')
        if (ele) {
          this.disabledFlag = true
          setTimeout(() => {
            this.disabledFlag = false
          }, 1000)
        }
        queryChnlAttr({ mac: mac })
          .then(res => {
            if (res.success) {
              this.adjustments = res.data
              this.$Message.success({
                content: res.message,
              })
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
                content: this.$t('unknown'),
              })
            }
          })
          .finally(res => {
            this.disabledFlag = false
          })
      },
      adjustmentOver(index, name) {
        this.adjustmentIndex = index + '-' + name
      },
      handleModel(index, name) {
        this.adjustmentModelIndex = index + '-' + name
      },
      handleAlias(mac, name) {
        macAlias({ mac: mac, name: name })
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: this.$t('deviceAliases') + this.$t('modifySuccess') + '！',
              })
              this.queryList()
              this.aliasFlag = false
              this.aliasIndex = -1
              this.adjustment.name = name
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
                content: this.$t('unknown'),
              })
            }
          })
      },
      handleNodeTitle(mac, nodeNo, title) {
        updateNodeTitle({ mac: mac, nodeNo: nodeNo, title: title })
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: this.$t('unknown'),
              })
              this.handleAdjustment(mac, this.adjustment.name)
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
            this.nodeFlag = -1
            this.adjustmentLineIndex = -1
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      handleNodeAttr(mac, nodeNo, lower, upper, type) {
        let params = {
          mac: mac,
          nodeNo: nodeNo,
          lower: lower,
          upper: upper,
          type: type,
        }
        updateChnlAttr(params)
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: this.$t('submitCommand'),
              })
              this.handleAdjustment(mac, this.adjustment.name)
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
            this.adjustmentModelIndex = -1
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      handleSceneSync(row) {
        this.scenelds = row.sceneId
        syncScene({ sceneId: this.scenelds })
          .then(res => {
            if (res.success) {
              this.syncFlag = true
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
                content: this.$t('unknown'),
              })
            }
          })
      },
      handleBatchBack() {
        this.syncFlag = false
      },
      handlelinkageScene() {
        this.linkageFlag = true
      },
    },
    watch: {
      '$store.state.channelsTableHeight': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.tableComponentHeight = newVal
          }
        },
        '$store.state.projectCode': {
          handler(newVal, oldVal) {
            if (newVal) {
              this.init()
            }
          },
        },
      },
    },
    props: {
      id: {
        type: String,
        default() {
          return {}
        },
      },
    },
    components: {
      Synchronize,
      CommandFeedback,
    },
  }
</script>
<style lang="less" scoped>
  #control {
    background: #1a202e;
    padding: 20px;
    .header {
      padding: 0px 0px 10px 0;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      Button {
        background: #007eff;
        font-size: 14px;
        &:hover {
          color: #fff !important;
        }
      }
    }
  }
  .fw {
    font-weight: 700;
    font-size: 18px;
  }
  .b-primary {
    background: rgba(6, 102, 203, 0.2);
    border: 1px solid #0666cb;
    color: #0666cb;
    padding: 0 8px;
  }
  .btn {
    color: #0666cb;
    padding: 5px;
  }
  .b-info {
    color: #909399;
    background: rgba(144, 147, 153, 0.15);
    border-radius: 5px;
    padding: 0 8px;
  }
  /deep/.ivu-input {
    border: 1px solid #535b6c;
  }
  /deep/.ivu-modal-footer {
    border: transparent;
  }
  .dialog-footer {
    display: flex;
    width: 100%;
    .btn {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
  .instructions {
    .header {
      background: #1a202e;
      display: flex;
      align-items: center;
      padding: 20px;
      .ivu-form-item {
        margin-bottom: 0;
      }
    }
    .table {
      margin-top: 10px;
      padding: 20px;
      background: #1a202e;
      span {
        font-size: 16px;
        font-weight: 400;
      }
      .content {
        margin-top: 10px;
      }
    }
  }
  .clearfix {
    display: flex;
    justify-content: space-between;
  }
</style>
