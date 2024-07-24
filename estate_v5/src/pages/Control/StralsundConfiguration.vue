<template>
  <div id="stralsundConfiguration">
    <i class="v5-icon-loading adjustment-modal" v-if="refreshLoading"></i>
    <Row :gutter="20" style="margin: 0; padding: 20px">
      <Col :span="5">
        <div class="ellipsis">
          <span class="label">{{ $t('equipmentNo') }}:</span>
          <span :title="adjustment.mac">{{ adjustment.mac }}</span>
        </div>
      </Col>
      <Col :span="8">
        <div>
          <Poptip placement="top" width="250" trigger="click" :append-to-body="false" v-model="aliasFlag" @hide="adjustment.name = $store.state.aliasName" :transfer="true">
            <span class="label">{{ $t('deviceAliases') + ':' }}</span>
            <span>{{ adjustment.name }}</span>
            <div style="text-align: right; margin: 5px 0 0" slot="content">
              <Button @click="handleAlias(adjustment.mac, adjustment.name)">{{ $t('confirm') }}</Button>
              <Button
                @click="
                  adjustment.name = $store.state.aliasName
                  aliasFlag = false
                ">
                {{ $t('cancel') }}
              </Button>
            </div>
            <div slot="title" @mouseover="aliasIndex = adjustment.mac" @mouseout="aliasIndex = -1" class="pointer pRelative">
              <div class="ellipsis" :class="aliasFlag ? 'dashed' : ''" :title="adjustment.name">
                <Input class="input" maxlength="20" show-word-limit v-model.trim="adjustment.name" :placeholder="$t('enterDeviceAlias')"></Input>
              </div>
              <i slot="title" v-if="aliasIndex === adjustment.mac" class="v5-icon-edit pointer"></i>
            </div>
          </Poptip>
        </div>
      </Col>
      <Col :span="11" style="display: flex">
        <!-- <Col :span="12">
          <div>
            <Poptip
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="buildFlag"
              :transfer="true"
              @hide="adjustment.build = $store.state.sortBUR.build">
                 <span class="label">楼层信息:</span>
                    <span>{{ adjustment.build }}</span>
                <div style="text-align: right; margin: 5px 0 0"  slot="content">
                  <Button  @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, 'build')">{{$t('btns.ok')}}</Button>
                  <Button  @click="adjustment.build = $store.state.sortBUR.build;buildFlag = false">{{$t('btns.cancel')}}</Button>
                </div>
                <div slot="title" @mouseover="buildIndex = adjustment.build" @mouseout="buildIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :title="adjustment.build">
                     <Input class="input" maxlength="20" show-word-limit v-model.trim="adjustment.build" placeholder="请输入楼栋"></Input>
                  </div>
                  <i slot="title" v-if="buildIndex === adjustment.build || $func.checkDataType(adjustment.build)" class="v5-icon-edit pointer"></i>
                </div>
            </Poptip >
          </div>
        </Col> -->
        <!-- <Col :span="6">
          <div>
            <Poptip
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="unitFlag"
              :transfer="true"
              @hide="adjustment.unit = $store.state.sortBUR.unit">
                 <span>{{ adjustment.unit }}</span>

                <div style="text-align: right; margin: 5px 0 0" slot="content">
                  <Button  @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, 'unit')">{{$t('btns.ok')}}</Button>
                  <Button  @click="adjustment.unit = $store.state.sortBUR.unit;unitFlag = false">{{$t('btns.cancel')}}</Button>
                </div>
                <div slot="title" @mouseover="unitIndex = adjustment.unit" @mouseout="unitIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="unitFlag ? 'dashed' : ''" :title="adjustment.unit">
                  <Input class="input" maxlength="20" show-word-limit v-model.trim="adjustment.unit" placeholder="请输入单位"></Input>
                  </div>
                  <i slot="title" v-if="unitIndex === adjustment.unit || $func.checkDataType(adjustment.unit)" class="v5-icon-edit pointer unit-icon"></i>
                </div>
            </Poptip >
          </div>
        </Col> -->
        <!-- <Col :span="6">
          <div>
            <Poptip
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="roomFlag"
              :transfer="true"
              @hide="adjustment.room = $store.state.sortBUR.room">
               <span>{{ adjustment.room }}</span>
                <div style="text-align: right; margin: 5px 0 0" slot="content">
                  <Button @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, 'room')">{{$t('btns.ok')}}</Button>
                  <Button @click="adjustment.room = $store.state.sortBUR.room;roomFlag = false">{{$t('btns.cancel')}}</Button>
                </div>
                <div slot="title" @mouseover="roomIndex = adjustment.room" @mouseout="roomIndex = -1" class="pointer pRelative">

                  <div class="ellipsis" :class="roomFlag ? 'dashed' : ''" :title="adjustment.room">
                     <Input class="input" maxlength="20" show-word-limit v-model.trim="adjustment.room" placeholder="请输入房号"></Input>

                  </div>
                  <i slot="title" v-if="roomIndex === adjustment.room || $func.checkDataType(adjustment.room)" class="v5-icon-edit pointer unit-icon"></i>
                </div>
            </Poptip >
          </div>
        </Col> -->
      </Col>
      <Col :span="24">
        <Form :model="adjustment" :inline="true" class="mt-20">
          <Row>
            <Col :span="24">
              <Col :span="24">
                <div>
                  {{ $t('alarmValueParamsSetting') }}:
                  <Button style="border-color: transparent" :style="{ fontSize: '18px', color: '#fff' }" @click="handleRefresh"><i class="icon-v5 icon-v5-shuaxin"></i></Button>
                </div>
              </Col>
              <Col v-show="true">
                <Col v-for="(item, index) in datas" :key="index" v-show="item.loopType !== 32">
                  <div class="title">
                    <span v-if="item.loopType === 0">{{ $t('smokeSensation') + $t('loop') + item.loopAddr + '：' }}</span>
                    <span v-else-if="item.loopType === 1">{{ $t('voltage') + $t('loop') + item.loopAddr + '：' }}</span>
                    <span v-else-if="item.loopType === 2">{{ $t('leakage1') + $t('loop') + item.loopAddr + '：' }}</span>
                    <span v-else-if="item.loopType === 4">{{ $t('temperature') + $t('loop') + item.loopAddr + '：' }}</span>
                    <span v-else-if="item.loopType === 8">{{ $t('current') + $t('loop') + item.loopAddr + '：' }}</span>
                  </div>
                  <div>
                    <CheckboxGroup v-model="adjustment.loopStatus[index]">
                      <Checkbox :label="$t('loop') + $t('open3')" :checked="adjustment.loopStatus[index]"></Checkbox>
                    </CheckboxGroup>
                  </div>
                  <div>
                    <CheckboxGroup v-model="adjustment.tripStatus[index]">
                      <Checkbox :label="$t('trip') + $t('open3')" name=""></Checkbox>
                    </CheckboxGroup>
                  </div>
                  <div v-if="item.loopType !== 0 && item.dataCategory === 112" :label="$t('alarmValue') + $t('upperLimit') + ':'">
                    <Input v-model.number="adjustment.alarmUpperLimt[index]"></Input>
                    <span class="unit" v-if="item.loopType === 2">{{ item.others.unit + '(300~500mA)' }}</span>
                    <span class="unit" v-else-if="item.loopType === 4">{{ item.others.unit + '(70~90℃)' }}</span>
                    <span class="unit" v-else-if="item.loopType === 8">{{ '% ' + $t('ratedCurrent') }}</span>
                    <span class="unit" v-else>{{ '% ' + $t('ratedVoltage') }}</span>
                  </div>
                  <div v-else-if="item.dataCategory === 104" :label="$t('alarmValue') + ':'">
                    <Input v-model.number="adjustment.alarmUpperLimt[index]" @input="handleInput(index, adjustment.alarmUpperLimt[index], item.alarmUpperLimt)"></Input>
                    <span class="unit">{{ item.others.unit }}</span>
                  </div>
                  <div v-if="item.loopType === 1" :label="$t('alarmValue') + $t('lowerLimit') + ':'">
                    <Input v-model.number="adjustment.alarmLowerLimit[index]"></Input>
                    <span class="unit">{{ '% ' + $t('ratedVoltage') }}</span>
                  </div>
                  <div v-if="item.dataCategory === 104" :label="$t('tripValue') + ':'">
                    <Input v-model="adjustment.tripUpperLimit[index]" readonly></Input>
                    <span class="unit">{{ item.others.unit }}</span>
                  </div>
                </Col>
              </Col>
              <Col>
                <Divider></Divider>
              </Col>
              <Col :span="5" v-if="$store.state.stralsundObj.dataCategory === 112">
                <div :label="`${$t('ratedCurrent')}:`" label-width="143px" class="ratedCurrent-title">
                  <Input v-model="adjustment.ratedCurrent" readonly></Input>
                  <span class="unit">A</span>
                </div>
              </Col>
              <Col class="tc">
                <div>
                  <Button type="primary" @click="onSubmit" :disabled="orderFlag">{{ $t('save') }}</Button>
                </div>
              </Col>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  </div>
</template>
<script>
  import store from '@/store/index'
  import { macAlias, strlRefreshAttr, strlModifyThreshold } from '@/api/control'
  export default {
    data() {
      return {
        refreshLoading: false,
        adjustment: {
          mac: this.$store.state.mac,
          name: this.$store.state.aliasName,
          build: this.$store.state.sortBUR.build,
          unit: this.$store.state.sortBUR.unit,
          room: this.$store.state.sortBUR.room,
          loopType: [],
          loopAddr: [],
          loopStatus: [],
          tripStatus: [],
          alarmUpperLimt: [],
          alarmLowerLimit: [],
          tripUpperLimit: [],
          ratedCurrent: '',
        },
        aliasFlag: false,
        aliasIndex: -1,
        buildFlag: false,
        unitFlag: false,
        roomFlag: false,
        buildIndex: -1,
        unitIndex: -1,
        roomIndex: -1,
        datas: [],
        orderFlag: false,
        timer: null,
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.handleQuery()
      },
      handleAlias(mac, name) {
        macAlias({ mac: mac, name: name }).then(res => {
          if (res.success) {
            this.$Messag.success({
              content: this.$t('deviceAliasesModifySuccess'),
            })
            this.aliasFlag = false
            this.aliasIndex = -1
            this.adjustment.name = name
            store.commit('aliasName', name)
          } else if (res.code === '-1') {
          } else {
            if (res.message) {
              this.$Message.error({
                content: res.message,
              })
            }
          }
        })
      },
      handleSort(mac, build, unit, room, type) {
        let params = {
          mac: mac,
        }
        if (type === 'build') {
          params.build = build
        } else if (type === 'unit') {
          params.unit = unit
        } else if (type === 'room') {
          params.room = room
        }
        macAlias(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: this.$t('modifySuccess1'),
            })
            store.commit('sortBUR', { build: this.adjustment.build, unit: this.adjustment.unit, room: this.adjustment.room })
            if (type === 'build') {
              this.buildFlag = false
              this.buildIndex = -1
              this.adjustment.build = build
            } else if (type === 'unit') {
              this.unitFlag = false
              this.unitIndex = -1
              this.adjustment.unit = unit
            } else if (type === 'room') {
              this.roomFlag = false
              this.roomIndex = -1
              this.adjustment.room = room
            }
          } else if (res.code === '-1') {
          } else {
            if (res.message) {
              this.$Message.error({
                content: res.message,
              })
            }
          }
        })
      },
      handleQuery() {
        if (this.orderFlag) return false
        let params = {
          mac: this.adjustment.mac,
        }
        strlRefreshAttr(params)
          .then(res => {
            if (res.success) {
              let version = this.$store.state.stralsundObj.dataCategory
              // 112 能耗版
              // 104 基础版
              let datas = res.data.filter(item => {
                if (version === 112) {
                  return item.loopType === 0 || item.loopType === 1 || item.loopType === 2 || item.loopType === 4 || item.loopType === 8 || item.loopType === 32
                } else if (version === 104) {
                  return item.loopType === 2 || item.loopType === 4 || item.loopType === 8
                }
              })
              datas.sort((a, b) => {
                return a['loopType'] - b['loopType']
              })
              this.adjustment.loopStatus = datas.map(item => {
                return item.loopStatus === 1 ? !0 : !!0
              })
              this.adjustment.tripStatus = datas.map(item => {
                return item.tripStatus === 1 ? !0 : !!0
              })
              this.adjustment.alarmUpperLimt = datas.map(item => {
                return item.alarmUpperLimt
              })
              this.adjustment.alarmLowerLimit = datas.map(item => {
                return item.alarmLowerLimit
              })
              this.adjustment.tripUpperLimit = datas.map(item => {
                return item.tripUpperLimit
              })
              this.adjustment.loopType = datas.map(item => {
                return item.loopType
              })
              this.adjustment.loopAddr = datas.map(item => {
                return item.loopAddr
              })
              datas.map(item => {
                if (item.loopType === 32) this.adjustment.ratedCurrent = item.detectValue
              })
              this.datas = datas
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })

          .finally(() => {
            this.orderFlag = true
            this.liftRestrictions()
          })
      },
      handleInput(index, val, oldVal) {
        if (val % 5 === 0) {
          this.adjustment.tripUpperLimit[index] = val + 5
        }
      },
      onSubmit() {
        let dataCategory = this.$store.state.stralsundObj.dataCategory
        let params = {
          mac: this.adjustment.mac,
          cmd: 'STRL_THRESHOLD_SET',
          value1: '',
        }
        if (dataCategory === 112) {
          params.value2 = ''
          this.adjustment.loopType.map((item, index) => {
            if (item !== 32) {
              params.value1 += (index === 0 ? '' : ':') + item + ',' + this.adjustment.loopAddr[index] + ',' + (item === 0 ? 0 : this.adjustment.alarmUpperLimt[index]) + ',' + (this.adjustment.loopStatus[index] ? 1 : 0) + ',' + (this.adjustment.tripStatus[index] ? 1 : 0)
              if (item === 1) {
                params.value2 += (index === 1 ? '' : ':') + item + ',' + this.adjustment.loopAddr[index] + ',' + this.adjustment.alarmLowerLimit[index]
              }
            }
          })
          params.value3 = this.adjustment.ratedCurrent
          this.issueInstructions(params)
        } else if (dataCategory === 104) {
          this.adjustment.loopType.map((item, index) => {
            params.value1 += (index === 0 ? '' : ':') + item + ',' + this.adjustment.loopAddr[index] + ',' + this.adjustment.alarmUpperLimt[index] + ',' + (this.adjustment.loopStatus[index] ? 1 : 0) + ',' + (this.adjustment.tripStatus[index] ? 1 : 0)
          })
          let _flag = this.adjustment.alarmUpperLimt.every(item => {
            return item % 5 === 0
          })
          if (_flag) {
            this.issueInstructions(params)
          } else {
            this.$Message.error({
              content: this.$t('alarmValIs5times'),
            })
          }
        }
      },
      issueInstructions(params) {
        strlModifyThreshold(params)
          .then(res => {
            if (res.success) {
              if (res.code === '0') {
                this.$Message.success({
                  content: this.$t('submitCommand'),
                })
              }
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })

          .finally(() => {
            this.orderFlag = true
            this.liftRestrictions()
          })
      },
      handleRefresh() {
        this.handleQuery()
      },
      liftRestrictions() {
        this.timer = setTimeout(() => {
          this.orderFlag = false
        }, 3e3)
      },
    },
    destroyed() {
      clearTimeout(this.timer)
    },
  }
</script>
<style lang="less" scoped>
  .unit {
    margin-left: 10px;
  }
</style>
