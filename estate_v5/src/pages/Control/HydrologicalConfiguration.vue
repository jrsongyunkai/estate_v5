<template>
  <div id="hydrological">
    <!-- <Row :gutter="20" style="margin: 0; padding: 20px"> -->
    <Row>
      <Col :span="5">
        <div>
          <span class="normal-label">{{ $t('equipmentNo') }}：</span>
          <span :title="adjustment.mac">{{ adjustment.mac }}</span>
        </div>
      </Col>
      <Col :span="8">
        <div>
          <Poptip placement="top" width="250" transfer v-model="aliasFlag" @on-popper-hide="adjustment.name = $store.state.aliasName">
            <div slot="content">
              <Input class="input" size="small" maxlength="20" show-word-limit v-model.trim="adjustment.name" :placeholder="$t('enterDeviceAlias')"></Input>
              <div style="text-align: right; margin: 5px 0 0">
                <Button type="primary" size="small" @click="handleAlias(adjustment.mac, adjustment.name)">{{ $t('confirm') }}</Button>
                <Button
                  size="small"
                  type="default"
                  @click="
                    adjustment.name = $store.state.aliasName
                    aliasFlag = false
                  ">
                  {{ $t('cancel') }}
                </Button>
              </div>
            </div>
            <div @mouseover="aliasIndex = adjustment.mac" @mouseout="aliasIndex = -1" class="pointer pRelative">
              <div :class="aliasFlag ? 'dashed' : ''" :title="adjustment.name">
                <span class="normal-label">{{ $t('deviceAliases') + ':' }}</span>
                <span>{{ '' + adjustment.name }}</span>
              </div>
              <i v-if="aliasIndex === adjustment.mac" class="el-icon-edit pointer normal-icon"></i>
            </div>
          </Poptip>
        </div>
      </Col>
      <!-- <Col :span="11">
        <span style="margin-right: 10px">
          <Poptip
            placement="top"
            width="250"
            transfer
            v-model="buildFlag"
            @on-popper-hide="adjustment.build = $store.state.sortBUR.build"
          >
            <div
              @mouseover="buildIndex = adjustment.build"
              @mouseout="buildIndex = -1"
              class="pointer pRelative"
            >
              <div>
                <span class="normal-label">楼层信息：</span>
                <span>{{ adjustment.build }}</span>
              </div>
            </div>
            <div slot="content">
              <Input
                class="input"
                size="small"
                maxlength="20"
                show-word-limit
                v-model.trim="adjustment.build"
                placeholder="请输入楼栋"
              ></Input>
              <div style="text-align: right; margin: 5px 0 0">
                <Button
                  type="primary"
                  size="small"
                  @click="
                    handleSort(
                      adjustment.mac,
                      adjustment.build,
                      adjustment.unit,
                      adjustment.room,
                      'build'
                    )
                  "
                  >{{$t('btns.ok')}}</Button
                >
                <Button
                  size="small"
                  type="default"
                  @click="
                    adjustment.build = $store.state.sortBUR.build;
                    buildFlag = false;
                  "
                  >{{$t('btns.cancel')}}</Button
                >
              </div>
            </div>
          </Poptip>
        </span>
        <span style="width: 200px; margin-right: 10px">
          <Poptip
            placement="top"
            width="250"
            transfer
            v-model="unitFlag"
            @on-popper-hide="adjustment.unit = $store.state.sortBUR.unit"
          >
            <div slot="content">
              <Input
                class="input"
                size="small"
                maxlength="20"
                show-word-limit
                v-model.trim="adjustment.unit"
                placeholder="请输入单位"
              ></Input>
              <div style="text-align: right; margin: 5px 0 0">
                <Button
                  type="primary"
                  size="small"
                  @click="
                    handleSort(
                      adjustment.mac,
                      adjustment.build,
                      adjustment.unit,
                      adjustment.room,
                      'unit'
                    )
                  "
                  >{{$t('btns.ok')}}</Button
                >
                <Button
                  size="small"
                  type="default"
                  @click="
                    adjustment.unit = $store.state.sortBUR.unit;
                    unitFlag = false;
                  "
                  >{{$t('btns.cancel')}}</Button
                >
              </div>
            </div>
            <div
              @mouseover="unitIndex = adjustment.unit"
              @mouseout="unitIndex = -1"
              class="pointer pRelative"
            >
              <div :class="unitFlag ? 'dashed' : ''">
                <span>{{ adjustment.unit }}</span>
              </div>
            </div>
          </Poptip>
        </span>
        <span>
          <Poptip
            placement="top"
            width="250"
            transfer
            v-model="roomFlag"
            @on-popper-hide="adjustment.room = $store.state.sortBUR.room"
          >
            <div slot="content">
              <Input
                class="input"
                size="small"
                maxlength="20"
                show-word-limit
                v-model.trim="adjustment.room"
                placeholder="请输入房号"
              ></Input>
              <div style="text-align: right; margin: 5px 0 0">
                <Button
                  type="primary"
                  size="small"
                  @click="
                    handleSort(
                      adjustment.mac,
                      adjustment.build,
                      adjustment.unit,
                      adjustment.room,
                      'room'
                    )
                  "
                  >{{$t('btns.ok')}}</Button
                >
                <Button
                  size="small"
                  type="default"
                  @click="
                    adjustment.room = $store.state.sortBUR.room;
                    roomFlag = false;
                  "
                  >{{$t('btns.cancel')}}</Button
                >
              </div>
            </div>
            <div
              @mouseover="roomIndex = adjustment.room"
              @mouseout="roomIndex = -1"
              class="pointer pRelative"
            >
              <div class="dashed" :title="adjustment.room">
                <span>{{ adjustment.room }}</span>
              </div>
            </div>
          </Poptip>
        </span>
      </Col> -->
    </Row>
    <Col>
      <Form :model="adjustment" inline :rules="rules" :label-width="100" ref="adjustment">
        <Col :span="24" style="margin-top: 10px">
          <span>{{ $t('parameterSettings') }}:</span>
        </Col>
        <Col style="margin-top: 10px">
          <FormItem :label="`${$t('pressureLiquidLevel')}:`">
            <span>{{ $t('lowerLimit') }}：</span>
            <span><Input style="width: 100px" v-model="adjustment.lower"></Input></span>
            <span class="unit">Mpa(M)</span>
            <span style="margin-left: 40px">{{ $t('upperLimit') }}:</span>
            <span>
              <Input style="width: 100px" v-model="adjustment.upper"></Input>
            </span>
            <span class="unit">Mpa(M)</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem :label="`${$t('temperature')}:`">
            <span>{{ $t('lowerLimit') }}：</span>
            <Input style="width: 100px" v-model="adjustment.tlower"></Input>
            <span class="unit">℃</span>
            <span style="margin-left: 40px">{{ $t('upperLimit') }}:</span>
            <Input style="width: 100px" v-model="adjustment.tupper"></Input>
            <span class="unit">℃</span>
          </FormItem>
        </Col>
        <Col>
          <FormItem :label="`${$t('reportingCycle')}:`" prop="reportingCycle">
            <Input style="width: 100px" v-model.number="adjustment.reportingCycle" :placeholder="$t('pleaseEnter')"></Input>
            <span class="unit">{{ $t('minute') }}</span>
          </FormItem>
        </Col>
        <!-- <Col>
          <hr />
        </Col> -->
        <Col style="margin-top: 20px">
          <FormItem>
            <Button size="small" type="primary" @click="onSubmit('adjustment')" :disabled="orderFlag">{{ $t('save') }}</Button>
          </FormItem>
        </Col>
      </Form>
    </Col>
  </div>
</template>
<script>
  import store from '@/store'
  import { macAlias, tlinkDeviceCommand, queryTlinkConfig } from '@/api/public'
  export default {
    props: {
      equipmentNum: { type: Number },
    },
    data() {
      let checkCycle = (rule, value, callback) => {
        if (value < 2 || value > 1440) {
          this.orderFlag = true
          callback(new Error(`${this.$t('range')} 2 ~ 1440`))
        } else {
          this.orderFlag = false
          callback()
        }
      }
      return {
        adjustment: {
          mac: this.$store.state.mac,
          name: this.$store.state.aliasName,
          build: this.$store.state.sortBUR.build,
          unit: this.$store.state.sortBUR.unit,
          room: this.$store.state.sortBUR.room,
          reportingCycle: 120,
          lower: '',
          upper: '',
          tlower: '',
          tupper: '',
          FT: '0.5',
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
        rules: {
          reportingCycle: [{ validator: checkCycle, trigger: 'change' }],
        },
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.queryTlinkConfig()
      },
      queryTlinkConfig() {
        queryTlinkConfig({ mac: this.$store.state.mac })
          .then(res => {
            if (res.success) {
              this.adjustment.reportingCycle = res.data.AT
              this.adjustment.tupper = res.data.TH
              this.adjustment.tlower = res.data.TL
              this.adjustment.lower = res.data.FL
              this.adjustment.upper = res.data.FH
              this.adjustment.FT = res.data.FT
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
      handleAlias(mac, name) {
        macAlias({ mac: mac, name: name })
          .then(res => {
            if (res.success) {
              this.$Message.success({
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
        macAlias(params)
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: this.$t('modifySuccess1'),
              })
              store.commit('sortBUR', {
                build: this.adjustment.build,
                unit: this.adjustment.unit,
                room: this.adjustment.room,
              })
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
      onSubmit(formName) {
        let params = {
          mac: this.adjustment.mac,
          cmd: this.equipmentNum === 4 ? 'TLINK_WATER' : 'TLINK_PRESSURE',
          FH: this.adjustment.upper,
          FL: this.adjustment.lower,
          TH: this.adjustment.tupper,
          TL: this.adjustment.tlower,
          AT: this.adjustment.reportingCycle,
          FT: this.adjustment.FT,
        }
        this.$refs[formName].validate(valid => {
          if (valid) {
            tlinkDeviceCommand(params)
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
              .finally(() => {
                this.orderFlag = true
                this.liftRestrictions()
              })
          } else {
            return false
          }
        })
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
  .adjustment-modal {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -15px;
    margin-top: -15px;
    font-size: 30px;
    color: #23b48c;
    z-index: 9999;
  }

  #hydrological {
    margin: 0 auto;
    width: 1200px;
    .el-form-item__label {
      color: #fff;
    }
  }

  .adjustment-mac {
    .el-form-item__content {
      display: inline-block;
    }

    .el-input .el-input__inner {
      color: #fff;
      width: 150px;
      padding-left: 0;
      border: none;
      background-color: transparent;
    }
  }

  #adjustment-alias,
  #position .el-form-item__content {
    display: inline-block;
  }

  #position .el-input {
    width: 150px;
    span {
      margin-right: 15px;
    }
  }

  .el-form-item {
    padding-right: 20px;
  }

  .el-form-item__label {
    vertical-align: top;
  }

  .el-input {
    display: inline-block;
    width: 100px;
  }

  .alias {
    width: 200px;
  }

  .title {
    width: 143px;
    text-align: right;
  }

  .unit {
    display: inline-block;
    margin-left: 5px;
    width: 60px;
  }

  .label {
    display: inline-block;
    width: 130px;
    text-align: left;
  }

  .normal-label {
    width: 85px;
  }

  .ellipsis {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pRelative {
    position: relative;
    i {
      position: absolute;
      top: 12px;
    }

    .normal-icon {
      left: 75px;
    }

    .unusual-icon {
      left: 120px;
    }

    .unit-icon {
      left: -12px;
    }
  }

  .input {
    width: 100%;
  }

  .dashed {
    box-sizing: border-box;
    border-bottom: 1px dashed #303a5e;
  }
</style>
