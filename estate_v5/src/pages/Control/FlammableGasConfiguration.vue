<template>
  <div id="flammableGasConfiguration">
    <Row style="margin: 0; padding: 20px">
      <Col :span="24">
        <div class="ellipsis">
          <span class="normal-label">{{ $t('equipmentNo') }}：{{ adjustment.mac }}</span>
        </div>
      </Col>
      <Col :span="24">
        <div>
          <Poptip placement="top" transfer v-model="aliasFlag" @on-popper-hide="adjustment.name = $store.state.aliasName">
            <div class="pointer pRelative">
              <div class="ellipsis" :class="aliasFlag ? 'dashed' : ''">
                <span class="normal-label">
                  {{ $t('deviceAliases') }}：{{ adjustment.name }}
                  <i class="el-icon-edit pointer normal-icon"></i>
                </span>
              </div>
            </div>
            <div slot="content">
              <Input class="input" size="small" maxlength="20" show-word-limit v-model.trim="adjustment.name" :placeholder="$t('enterDeviceAlias')"></Input>
              <div style="text-align: right; margin: 5px 0 0; padding: 5px">
                <Button type="primary" size="small" @click="handleAlias(adjustment.mac, adjustment.name)">{{ $t('confirm') }}</Button>
                <Button
                  size="small"
                  type="default"
                  style="margin-left: 5px"
                  @click="
                    adjustment.name = $store.state.aliasName
                    aliasFlag = false
                  ">
                  {{ $t('cancel') }}
                </Button>
              </div>
            </div>
          </Poptip>
        </div>
      </Col>
    </Row>
    <Row>
      <Form :model="adjustment" inline :label-width="90">
        <FormItem :label="`${$t('reportingCycle')}:`" style="width: 200px">
          <Select v-model="adjustment.reportingCycle" :clearable="true" :placeholder="$t('pleaseSelect')">
            <Option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </FormItem>
      </Form>
    </Row>
    <Row style="text-align: right; display: flex; justify-content: end">
      <Button style="margin: 20px" type="primary" @click="onSubmit" :disabled="orderFlag">{{ $t('save') }}</Button>
    </Row>
  </div>
</template>
<script>
  import store from '@/store'
  import { macAlias, forsafeDeviceCommand, queryForsafeMsgTypeConfig } from '@/api/public'
  export default {
    data() {
      return {
        adjustment: {
          mac: this.$store.state.mac,
          name: this.$store.state.aliasName,
          reportingCycle: 24,
          build: this.$store.state.sortBUR.build,
          unit: this.$store.state.sortBUR.unit,
          room: this.$store.state.sortBUR.room,
        },
        aliasFlag: false,
        aliasIndex: -1,
        datas: [],
        orderFlag: false,
        timer: null,
        buildFlag: false,
        unitFlag: false,
        roomFlag: false,
        buildIndex: -1,
        unitIndex: -1,
        roomIndex: -1,
        options: [
          { value: 1, label: this.$t('hour1') },
          { value: 8, label: this.$t('hour8') },
          { value: 12, label: this.$t('hour12') },
          { value: 24, label: this.$t('hour24') },
          { value: 48, label: this.$t('hour48') },
        ],
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.queryConfig()
      },
      queryConfig() {
        let params = {
          mac: this.$store.state.flammableGasObj.mac,
          msgType: 'DevInfo',
          devType: this.$store.state.flammableGasObj.devType,
        }
        queryForsafeMsgTypeConfig(params)
          .then(res => {
            if (res.success) {
              this.adjustment.reportingCycle = res.data.period
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
      onSubmit() {
        let params = {
          mac: this.adjustment.mac,
          cmd: 'FORSAFE_SET_PERIOD',
          equipmentType: 7,
          data: this.adjustment.reportingCycle,
        }
        forsafeDeviceCommand(params)
          .then(res => {
            if (res.success) {
              this.$Message.success({
                message: this.$t('submitCommand'),
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
      },
      liftRestrictions() {
        this.timer = setTimeout(() => {
          this.orderFlag = false
        }, 3e3)
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

  #flammableGasConfiguration {
    margin: 0 auto;
    width: 100%;
    .el-form-item__label {
      color: #fff;
    }
  }
  .adjustment-mac .el-input .el-input__inner {
    color: #fff;
    width: 200px;
    padding-left: 0;
    border: none;
    background-color: transparent;
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

  #position .el-input {
    width: 150px;
  }

  span {
    margin-right: 15px;
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
    .normal-icon {
      left: 200px;
      display: none;
    }
    .unusual-icon {
      left: 120px;
    }
    .unit-icon {
      left: -12px;
    }
  }
  .pRelative:hover {
    .normal-icon {
      display: inline-block;
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
