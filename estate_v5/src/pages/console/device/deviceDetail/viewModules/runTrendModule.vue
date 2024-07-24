<template>
  <div class="run-trend-content">
    <div class="left">
      <LinesSelectView ref="LinesSelectViewRef" @nodeClick="nodeClick"></LinesSelectView>
    </div>
    <div class="right" v-if="addrInfo.addr">
      <div class="mo-item">
        <div class="header">
          <div class="left-title">
            <div class="bor"></div>
            <div>{{ $t('baseInfo') }}</div>
          </div>
          <div class="right-box">
            <template v-if="!configuruationFlag">
              <span class="TC-808">T3-808</span>
              <span class="icon-edit pointer" @click="editNameUnit"><Icon custom="icon-v5 icon-v5-xiugai"></Icon></span>
            </template>
            <template v-else>
              <template v-if="[1, 19].includes(deviceInfo.equipmentType) && details.isSupportOc">
                <AuthButton class="o-button" style="padding-left: 30px" roKey="V5_PROJECT_USE-CTL_AUTHORITY" :class="details.oc === true ? 'not-color' : 'o-danger'" :disabled="details.oc === true" @click="handleBrake(true)">
                  <Icon class="big-icon" custom="icon-v5 icon-v5-close" size="30" />
                  {{ $t('closing') }}
                </AuthButton>
                <AuthButton class="ml-5 o-button" style="padding-left: 30px" roKey="V5_PROJECT_USE-CTL_AUTHORITY" :class="details.oc === false ? 'not-color' : 'o-success'" :disabled="details.oc === false" @click="handleBrake(false)">
                  <Icon class="big-icon" custom="icon-v5 icon-v5-open1" size="30" />
                  {{ $t('opening') }}
                </AuthButton>
                <Poptip
                  transfer
                  trigger="hover"
                  placement="bottom-end"
                  v-if="
                    (details.localLockEnable && details.localLock && deviceInfo.equipmentType !== 19) ||
                    deviceInfo.equipmentType === 8 ||
                    (details.remoteLockAndUnlockEnable && deviceInfo.equipmentType !== 19) ||
                    (details.abnormalUnlockEnable && !details.enableNetCtrl && deviceInfo.equipmentType !== 19)
                  ">
                  <Button :title="$t('operation')" type="primary" class="detailsBtn ml-5">
                    <Icon style="color: #007eff" custom="icon-v5 icon-v5-mianxingdianjitubiao"></Icon>
                  </Button>
                  <div class="content" slot="title">
                    <div class="content" style="margin: 10px 0px 10px 0px" v-if="details.localLockEnable && details.localLock && deviceInfo.equipmentType !== 19">
                      <div style="margin-top: 10px; margin-bottom: 10px">{{ $t('lockedLocally') }}</div>
                      <Button @click="handleLocking('true')" class="o-success"><Icon custom="icon-v5 icon-v5-jiesuo"></Icon></Button>
                    </div>
                    <div class="content" style="margin-top: 10px" v-if="details.abnormalUnlockEnable && !details.enableNetCtrl && deviceInfo.equipmentType !== 19">
                      <div style="margin-top: 10px; margin-bottom: 10px">{{ $t('abnormalLocked') }}</div>
                      <AuthButton class="o-button pointer o-success" roKey="V5_PROJECT_USE-ABNORMAL_SWITCH_UNLOCK" @click="handleUnlock">
                        <Icon custom="icon-v5 icon-v5-jiesuo"></Icon>
                        {{ $t('unlock') }}
                      </AuthButton>
                    </div>
                    <template v-if="details.remoteLockAndUnlockEnable && deviceInfo.equipmentType !== 19">
                      <div style="margin-top: 10px; margin-bottom: 10px">{{ details.remoteLock ? $t('remotelyLocked') : $t('notRemotelyLocked') }}</div>
                      <div style="display: flex; align-items: center; margin-top: 5px">
                        <AuthButton class="o-button" roKey="V5_PROJECT_USE-CTL_AUTHORITY" :class="details && details.remoteLock ? 'o-info' : 'o-success'" :disabled="details && details.remoteLock" @click="handleLocking('true')">
                          <Icon custom="icon-v5 icon-v5-jiesuo1" />
                          {{ $t('lock') }}
                        </AuthButton>
                        <AuthButton class="ml-5 o-button" roKey="V5_PROJECT_USE-CTL_AUTHORITY" :class="details && details.remoteLock ? 'o-success' : 'o-info'" :disabled="details && !details.remoteLock" @click="handleLocking('false')">
                          <Icon custom="icon-v5 icon-v5-jiesuo" />
                          {{ $t('unlock') }}
                        </AuthButton>
                      </div>
                    </template>
                    <template v-else-if="deviceInfo.equipmentType === 8">
                      <div style="margin-top: 10px; margin-bottom: 10px">{{ $t('openingClosing') }}</div>
                      <span class="pointer" v-if="false" style="margin-right: 10px">
                        <Checkbox v-model="group">{{ $t('multicast') }}</Checkbox>
                      </span>
                      <Row class="mt-15" :gutter="20">
                        <Col :span="7">
                          <span class="pointer" style="margin-left: 1px" @click="handleBrake(true)">
                            <Icon custom="icon-v5 icon-v5-hezha" class="o-button o-success" :class="lines.length === 0 || details.oc === 1 ? 'not-allowed' : ''"></Icon>
                          </span>
                        </Col>
                        <Col :span="7">
                          <span class="pointer" @click="handleBrake(false)">
                            <Icon custom="icon-v5 icon-v5-fenzha" class="o-button o-danger" :class="lines.length === 0 || details.oc === 1 ? 'not-allowed' : ''"></Icon>
                          </span>
                        </Col>
                      </Row>
                    </template>
                  </div>
                </Poptip>
              </template>
              <template v-else-if="deviceInfo.equipmentType === 2">
                <Button custom-icon="icon-v5 icon-v5-xiaoyin" @click="handleControlAlarm('REMOTE_MUTE')">{{ $t('silencing') }}</Button>
                <Button custom-icon="icon-v5 icon-v5-zhongzhi1" class="ml-5" @click="handleControlAlarm('CLEAR_ALARM')">{{ $t('reset') }}</Button>
              </template>
            </template>
          </div>
        </div>
        <!-- 非808 -->
        <div class="content" v-if="configuruationFlag && deviceInfo.equipmentType !== 8">
          <Row>
            <Col class="info-box" :span="14">
              <div class="info-item">
                <div class="label">{{ $t('lineName') }}:</div>
                <div>
                  <span>{{ addrInfo.title }}</span>
                  <Poptip transfer trigger="click" v-model="aliasFlag" @on-popper-hide="hideAliasName">
                    <span class="op-icon" :class="{ active: aliasFlag }"><Icon type="md-create" /></span>
                    <div slot="content">
                      <div class="ellipsis" style="margin-bottom: 10px">
                        <Input class="input" maxlength="20" show-word-limit v-model.trim="aliasName" :placeholder="$t('enterLineName')"></Input>
                      </div>
                      <div style="text-align: right">
                        <Button type="primary" size="small" @click="editAddrName">{{ $t('confirm') }}</Button>
                        <Button size="small" class="ml-10" @click="hideAliasName">{{ $t('cancel') }}</Button>
                      </div>
                    </div>
                  </Poptip>
                </div>
              </div>
              <div class="info-item" v-if="details.isSupportOc">
                <div class="label">{{ $t('lineStatus') }}:</div>
                <div v-if="[1, 19].includes(deviceInfo.equipmentType) && details.oc !== undefined" :class="details.oc ? 'c-danger' : 'c-success'">{{ details.oc ? $t('closed') : $t('opened') }}</div>
                <div v-else-if="deviceInfo.equipmentType === 2 && details.alarmState !== undefined" :class="details.alarmState === 0 ? 'c-success' : details.alarmState === -100 ? 'c-danger' : 'c-warning'">
                  {{ details.alarmState === 0 ? $t('normal') : details.alarmState === -100 ? $t('alarm') : $t('earlyWarning') }}
                </div>
              </div>
              <div class="info-item">
                <div class="label">{{ $t('line') }}ID:</div>
                <div>{{ `${addrInfo.mac}-${addrInfo.addr && addrInfo.addr.toString().padStart(2, '0')}` }}</div>
              </div>
              <div class="info-item">
                <div class="label">{{ $t('addrCode') }}:</div>
                <div>{{ addrInfo.addr && addrInfo.addr.toString().padStart(2, '0') }}</div>
              </div>
              <div class="info-item">
                <div class="label">{{ $t('totalPower') }}:</div>
                <div>{{ typeof details.gwp !== 'undefined' ? details.gwp + 'W' : '' }}</div>
              </div>
              <div class="info-item">
                <div class="label">{{ $t('remaining') + '' + $t('current') }}:</div>
                <div>{{ typeof details.gld !== 'undefined' ? details.gld + 'mA' : '' }}</div>
              </div>
              <div class="info-item">
                <div class="label">{{ $t('deviceTem') }}:</div>
                <div>
                  <span v-show="details.gt > -35">{{ details.gt + (!!details.gt ? '℃' : '-') }}</span>
                  <span v-show="details.gt <= -35">{{ '--' }}</span>
                </div>
              </div>
              <div class="info-item" v-if="billingData && billingData.balance">
                <div class="label">{{ $t('timePeriodSettlementBalance') }}:</div>
                <div style="display: flex; align-items: center">
                  <span>{{ '¥' + (billingData.balance || '-') }}</span>
                  <div style="position: relative">
                    <QRCodeCell :text="createdQrCode(billingData)" :width="600" isNeedBackColor isCustomDownload @downloadPng="customDownload">
                      <div ref="QrTable2">
                        <div ref="QrTable1">
                          <div style="text-align: center" ref="QrName">{{ $t('target') }}：{{ billingData.name }}{{ billingData.targetName2 ? '/' + billingData.targetName2 : '' }}</div>
                          <div style="border-top: 1px solid #797979; margin-top: 10px">
                            <Table :columns="codejsrColumns" :data="billingData.notifier"></Table>
                          </div>
                        </div>
                        <div style="border-top: 1px solid #797979; margin-top: 10px">
                          <Table :columns="codeuserColumns" :data="billingData.user"></Table>
                        </div>
                      </div>
                    </QRCodeCell>
                  </div>
                </div>
              </div>
              <div class="info-item" v-if="billingData && billingData.costFee">
                <div class="label">
                  <span>{{ $t('consumptionAmountDuringPeriod') }}</span>
                  <Tooltip placement="top">
                    <Icon type="ios-information-circle-outline" color="#007EFF"></Icon>
                    <div slot="content">
                      <p>{{ $t('currentPeriodValue', { start: billingData.startTime.substr(0, 10), end: billingData.endTime.substr(0, 10) }) }}</p>
                    </div>
                  </Tooltip>
                  <span>:</span>
                </div>
                <div>
                  <span>{{ '¥' + (billingData.costFee || '-') }}</span>
                </div>
              </div>
              <div class="info-item">
                <div class="label">{{ $t('environmentalTemperature') }}:</div>
                <div>{{ (details.tmpE || '-') + (!!details.tmpE ? '℃' : '-') }}</div>
              </div>
              <div class="info-item">
                <div class="label">{{ $t('absolutePower') }}（kW·h）:</div>
                <div style="display: flex; align-items: center">
                  <span>{{ details.power === 0 ? details.power : details.power || '-' }}</span>
                  <AuthButton style="margin-left: 5px" grayWithFilter v-if="(isShowWrite === 0 && writeBackShow) || !writeBackShow" roKey="V5_PROJECT_USE-CTL_AUTHORITY" class="b-blue" size="small" @click="handleWriteBackpopup">{{ $t('backWrite') }}</AuthButton>
                  <AuthButton grayWithFilter roKey="V5_PROJECT_USE-CTL_AUTHORITY" class="b-blue" style="margin-left: 5px" size="small" @click="handleCorrect">{{ $t('correct') }}</AuthButton>
                </div>
              </div>
              <div class="info-item" v-if="deviceInfo.equipmentType === 1 && details.curRatio !== undefined">
                <div class="label">{{ $t('currentRatio') }}:</div>
                <div>
                  <EditableText :text="`${details.curRatio}`" :inputProps="{ inputNumberRule: 'Integer', placeholder: $t('toolTipText17') }" :onConfirm="modifyCurrentParam" />
                </div>
              </div>
              <div class="info-item">
                <div class="label">{{ $t('electricalParentNode') }}:</div>
                <div class="value" style="display: flex">
                  <div class="value-text pointer" v-textRoll @click="jumpParentDevice(caseValueData)">{{ caseValueDataText }}</div>
                  <Poptip v-model="isEditCaseValue" transfer trigger="click">
                    <span class="op-icon" :class="{ active: isEditCaseValue }"><Icon type="md-create" /></span>
                    <div class="flex-content" slot="content">
                      <div class="ellipsis">
                        <ELPCascader ref="cascader" :props="{ expandTrigger: 'hover', checkStrictly: true }" clearable :options="cascaderBoxAddr" filterable popper-class="popper" :placeholder="$t('toolTipText18')" v-model="caseValueDataEdit">
                          <template slot-scope="{ data }">
                            <div style="padding-right: 10px">
                              <div v-textRoll>{{ data.label }}</div>
                              <span v-if="data.dom === '0'" class="before">{{ $t('current2') }}</span>
                            </div>
                          </template>
                        </ELPCascader>
                      </div>
                      <div style="text-align: right">
                        <Button type="primary" @click="handleCascader" style="margin-right: 5px; margin-left: 5px">{{ $t('confirm') }}</Button>
                        <Button @click="isEditCaseValue = false">{{ $t('cancel') }}</Button>
                      </div>
                    </div>
                  </Poptip>
                </div>
              </div>
              <div class="info-item">
                <div class="label">{{ $t('missingGear') }}:</div>
                <div style="width: 150px">{{ leakageGear }}</div>
              </div>
              <div class="info-item">
                <div class="label">{{ $t('remoteControl') }}:</div>
                <div style="width: 150px">
                  <span>{{ enableControl === 1 ? $t('allow') : $t('notAllow') }}</span>
                  <Poptip v-model="isEditRemoteControl" transfer trigger="click">
                    <span class="op-icon" :class="{ active: isEditRemoteControl }"><Icon type="md-create" /></span>
                    <div class="flex-content" slot="content">
                      <div class="ellipsis">
                        <Select class="gatherAddr" transfer clearable v-model="remoteControl" :placeholder="$t('remoteControl')">
                          <Option :value="1">{{ $t('allow') }}</Option>
                          <Option :value="0">{{ $t('notAllow') }}</Option>
                        </Select>
                      </div>
                      <div style="text-align: right; margin-left: 5px">
                        <Button type="primary" @click="handleControl" style="margin-right: 5px">{{ $t('confirm') }}</Button>
                        <Button @click="isEditRemoteControl = false">{{ $t('cancel') }}</Button>
                      </div>
                    </div>
                  </Poptip>
                </div>
              </div>
              <div class="info-item" v-if="topSonList.length > 0">
                <div class="label">{{ $t('electricalSubNodes') }}：</div>
                <div>
                  <Dropdown trigger="click" transfer @on-click="jumpChildDevice">
                    <a href="javascript:void(0)">
                      {{ $t('clickExpand') }}
                      <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                      <DropdownItem v-for="(item, index) in topSonList" :key="index" :name="`${item.mac}${item.addr ? '-' + item.addr : ''}`">{{ item.macAddrName }}</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </Col>
            <Col :span="10">
              <PhaseLineTable :details="details"></PhaseLineTable>
            </Col>
          </Row>
        </div>
        <!-- 808 -->
        <div class="content" v-else-if="!configuruationFlag && deviceInfo.equipmentType !== 8">
          <Row>
            <Col class="info-box col-8" :span="8">
              <div class="info-item">
                <div class="label">{{ $t('lineName') }}:</div>
                <div>
                  <span>{{ addrInfo.title }}</span>
                  <Poptip transfer trigger="click" v-model="aliasFlag" @on-popper-hide="hideAliasName">
                    <span class="op-icon" :class="{ active: aliasFlag }"><Icon type="md-create" /></span>
                    <div slot="content">
                      <div class="ellipsis" style="margin-bottom: 10px">
                        <Input class="input" maxlength="20" show-word-limit v-model.trim="aliasName" :placeholder="$t('enterLineName')"></Input>
                      </div>
                      <div style="text-align: right">
                        <Button type="primary" size="small" @click="editAddrName">{{ $t('confirm') }}</Button>
                        <Button size="small" class="ml-10" @click="hideAliasName">{{ $t('cancel') }}</Button>
                      </div>
                    </div>
                  </Poptip>
                </div>
              </div>
              <div class="info-item">
                <div class="label">{{ $t('line') }}ID:</div>
                <div>{{ `${addrInfo.mac}-${addrInfo.addr && addrInfo.addr.toString().padStart(2, '0')}` }}</div>
              </div>
              <div class="info-item">
                <div class="label">{{ $t('addrCode') }}:</div>
                <div>{{ addrInfo.addr && addrInfo.addr.toString().padStart(2, '0') }}</div>
              </div>
            </Col>
            <Col class="info-box col-8" :span="8">
              <div class="info-item" v-for="(item, i) in arrayInPorts" :key="i">
                <div class="label">{{ item.name }}:</div>
                <div>
                  <span :class="item.value === 0 ? 'reds' : 'greens'">{{ item.value === 0 ? 'OFF' : 'ON' }}</span>
                </div>
              </div>
            </Col>
            <Col class="info-box col-8" :span="8">
              <div class="info-item" v-for="(item, index) in arrayOutPorts" :key="index">
                <div class="label">{{ item.name }}:</div>
                <div>
                  <span v-if="item.value === 0" class="reds">{{ 'OFF' }}</span>
                  <span v-if="item.value === 1" class="grays pointer" @click="openRemotectrl(2, index + 1, item)">{{ 'OFF' }}</span>
                  <span v-if="item.value === 0" class="grays pointer" @click="openRemotectrl(1, index + 1, item)">{{ 'ON' }}</span>
                  <span v-if="item.value === 1" class="greens">{{ 'ON' }}</span>
                  <span class="green-808 pointer" @click="openRemotectrl(4, index + 1, item)">{{ $t('inching') }}</span>
                </div>
              </div>
            </Col>
          </Row>
          <Row v-for="(item, index) in AnalogList" :key="index" class="ana-loglist">
            <Row style="width: 100%">
              <Col :span="6" style="color: #999999">{{ item.name }}：</Col>
              <Col :span="18">
                <Row>
                  <Col :span="12" class="flex">
                    <span class="flex">
                      <span class="cercil"></span>
                      <span>{{ $t('acquisition') + '：' + item.value }}</span>
                    </span>
                  </Col>
                  <Col :span="12" class="flex">
                    <span>{{ $t('acquisitionUnit') + '：' + item.unit }}</span>
                  </Col>
                </Row>
                <Row>
                  <Col :span="12">
                    <span class="flex">
                      <span class="cercil"></span>
                      <span>{{ $t('displayValue') + '：' + item.convertValue }}</span>
                    </span>
                  </Col>
                  <Col :span="12">
                    <span>{{ $t('displayValueUnit') + '：' + item.convertUnit }}</span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Row>
        </div>
        <div class="content" v-else-if="configuruationFlag && deviceInfo.equipmentType === 8">
          <Row v-if="details.isSupportOc">
            <Col :span="8">
              {{ $t('lineStatus') + '：' }}
              <span v-if="details.oC !== undefined" :class="details.oC ? 'c-success' : 'c-danger'">{{ details.oC ? $t('passed') : $t('broken') }}</span>
            </Col>
          </Row>
          <Row>
            <Col :span="8">{{ $t('current') + '：' + (typeof details.cur !== 'undefined' ? details.cur + 'A' : '') }}</Col>
            <Col :span="8">{{ $t('leakage') + '：' + (typeof details.lki !== 'undefined' ? details.lki + 'mA' : '') }}</Col>
            <Col :span="8">{{ $t('voltage') + '：' + (typeof details.vol !== 'undefined' ? details.vol + 'V' : '') }}</Col>
          </Row>
          <Row>
            <Col :span="8">{{ $t('watt1') + '：' + (typeof details.pwr !== 'undefined' ? details.pwr + 'W' : '') }}</Col>
            <Col :span="8">{{ $t('temperature') + '：' + (typeof details.tmp !== 'undefined' ? details.tmp + '℃' : '') }}</Col>
            <Col :span="8">{{ $t('powerConsumption') + '：' + (typeof details.energy !== 'undefined' ? details.energy + 'kW·h' : '') }}</Col>
          </Row>
        </div>
      </div>
      <div class="mo-item">
        <div class="header">
          <div class="left-title">
            <div class="bor"></div>
            <div>{{ $t('runTrend') }}</div>
          </div>
          <div class="right-box">
            <DatePicker style="width: 135px" :value="dateValue" type="date" :disabled="$store.state.dateFlag" @on-change="changeDateValue" :editable="false" format="yyyy-MM-dd" :placeholder="$t('selectDate')" :clearable="false" transfer></DatePicker>
            <Tooltip :content="$t('export')">
              <Button @click="output" class="outputs"><Icon custom="icon-v5 icon-v5-daochu2" size="18" /></Button>
            </Tooltip>
          </div>
        </div>
        <div class="content">
          <LineChartForAddrRunTrend ref="runTrendRef" :configuruationFlag="configuruationFlag" :addrInfo="addrInfo" :dateRange="dateRange"></LineChartForAddrRunTrend>
        </div>
      </div>
    </div>
    <Modal v-model="openSeconedPwd" width="700" :title="$t('batteryWriteBack')" @on-cancel="cancelSeconedPwd">
      <Form>
        <FormItem :label="$t('writeBackReportingDateBatteryLevel')">
          <DatePicker type="date" :placeholder="$t('pleaseSelect')" style="width: 200px" v-model="writeBackTimer" format="yyyy-MM-dd" @on-change="handleWriteBackTimer"></DatePicker>
        </FormItem>
        <FormItem label="">
          <div style="width: 670px">
            <WriteBackLine :options="writeBackData" ref="writeBackCharts" @timer="handleLineTimer"></WriteBackLine>
          </div>
          <span style="margin-left: 30px; color: #007eff">{{ $t('toolTipText19') }}</span>
        </FormItem>
        <FormItem :label="$t('writeBackBatteryLevel')">
          <span>{{ writeBackValue }}</span>
        </FormItem>
        <FormItem :label="$t('currentBatteryLevel')">
          <span>{{ details.power || '-' }}</span>
        </FormItem>
        <FormItem :label="$t('backWrithObj')">
          <RadioGroup v-model="wbobject" style="display: flex">
            <Radio :label="1" :disabled="true">
              <span>{{ $t('correspondingIDLine') }}</span>
            </Radio>
            <Radio :label="2" style="margin-left: 50px">
              <span>{{ $t('currentPortLine') }}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <PwsSeconedCheckVue v-if="openSeconedCheck" :isfoucs="false" @close="closePwdModal" @getnewPwds="getnewPwdsVal" :write="'write'"></PwsSeconedCheckVue>
      </Form>
      <div slot="footer">
        <Button class="b-blue" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
        <Button @click="cancelSeconedPwd">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <EditAddrParamsModal ref="editAddrParamsModal" :addrInfo="addrInfo" :deviceInfo="deviceInfo" />
    <Modal :title="$t('correctionFactor')" v-model="correctModal" :modal="false">
      <div style="display: flex">
        <div style="padding-top: 5px">{{ $t('correctionFactor') }}：</div>
        <div>
          <Select v-model="correctFormData.factor" style="width: 50px" placeholder="">
            <Option v-for="item in correctFactorOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div><Input v-model="correctFormData.arithmetic" v-decimalTwo="3"></Input></div>
      </div>
      <div slot="footer">
        <Button @click="correctModal = false">{{ $t('cancel') }}</Button>
        <Button class="b-blue" @click="openWritePwdModal">{{ $t('save') }}</Button>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="saveWriterConfig"></OperationCheckAuth>
  </div>
</template>

<script>
  import LinesSelectView from './modulesSubView/LinesSelectView.vue'
  import PhaseLineTable from './modulesSubView/PhaseLineTable.vue'
  import EditAddrParamsModal from './modulesSubView/EditAddrParamsModal.vue'
  import LineChartForAddrRunTrend from './modulesSubView/LineChartForAddrRunTrend.vue'
  import QRCodeCell from '@/pages/billingSystem/component/QRCodeCell.vue'
  import { queryChannelDetailsByBoxAndAddr, winextloraCmd, remoteSwitchLock, modifyBoxRemoteControl, modifyBoxsChnlClearAlarm, modifyBoxsChnlRemoteMute, abnormalSwitchUnlock, getCorrect, CorrectConfig } from '@/api/control/index'
  import { channelMarkedPowerHistory, checkSecondPwd, setPower, digitalOutRemotectrl, pageQueryAddr, queryParams, getMainLineMode, chnlParentNodeConfig, billingBalance, billingCheck, getEffectAddr, queryPageAuth, updateNodeTitle } from '@/api/public'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import { getAutoPowerWriteBackConfig } from '@/api/setting/projectInfo'
  import WriteBackLine from './modulesSubView/WritebackLine.vue'
  import PwsSeconedCheckVue from '@/pages/Common/PwsSeconedCheck.vue'
  import { retry } from '@utils/common'
  import { isAlarmStatus } from '@/api/control'
  import { modifyCurrentParam } from '@/api/console/device'
  import { QrCode } from '@/untils/QrCode'
  import qs from 'qs'
  export default {
    inject: ['rowDeviceInfo', 'lookDeviceDetails'],
    components: { LinesSelectView, PhaseLineTable, WriteBackLine, PwsSeconedCheckVue, LineChartForAddrRunTrend, EditAddrParamsModal, QRCodeCell },
    data() {
      return {
        topSonList: [],
        newPwdsSeconed: '',
        openSeconedCheck: '',
        deviceInfo: this.rowDeviceInfo,
        lines: [],
        indeterminate: false,
        checkAll: false,
        checkAllGroup: [],
        addrInfo: {},
        details: { remoteLock: false },
        isShowWrite: null,
        writeBackShow: false,
        writeBackTimer: this.$Date().format('YYYY-MM-DD'),
        openSeconedPwd: false,
        writeBackValue: '',
        writeBackData: { xAxis: [], series: [], title: { show: true, text: '' }, grid: 40, legendDisplay: false, splitLine: true, time: true, height: '300px' },
        wbobject: '2',
        configuruationFlag: true,
        arrayInPorts: [],
        arrayOutPorts: [],
        setTimeHandle: null,
        dateValue: this.$func.getNowFormatDate(),
        AnalogList: [],
        configInfo: {},
        caseValueData: [],
        projectCodeMode: 1,
        queryBoxAddr: [],
        billingData: {},
        isCheckBilling: false,
        codejsrColumns: [
          { title: this.$t('supervisor'), key: 'name', width: 80 },
          { title: this.$t('phone'), key: 'telephone', width: 130 },
          { title: this.$t('mailbox'), key: 'email' },
        ],
        codeuserColumns: [
          { title: this.$t('electricityUser'), key: 'name', width: 80 },
          { title: this.$t('phone'), key: 'telephone', width: 130 },
          { title: this.$t('mailbox'), key: 'email' },
        ],
        group: [],
        isEditRemoteControl: false,
        remoteControl: null,
        isEditCaseValue: false,
        cascaderBoxAddr: [],
        caseValueDataEdit: [],
        correctFactorOptions: [
          { value: 1, label: this.$t('plus') },
          { value: 2, label: this.$t('subtract') },
          { value: 3, label: this.$t('multiply') },
          { value: 4, label: this.$t('divide') },
        ],
        correctModal: false,
        correctFormData: { factor: null, arithmetic: null },
        cancelRetry: null,
        aliasFlag: false,
        aliasName: '',
      }
    },
    computed: {
      dateRange() {
        return [this.dateValue, this.dateValue]
      },
      enableControl() {
        return this.configInfo && this.configInfo.enableControl ? 1 : 0
      },
      leakageGear() {
        return this.configInfo && this.configInfo.leakageGear ? this.configInfo.leakageGear : ''
      },
      caseValueDataText() {
        let opObj = this.cascaderBoxAddr.find(op => op.value === this.caseValueData[0])
        let str = (opObj && opObj.label) || ''
        if (this.caseValueData[1]) {
          let copObj = opObj.children.find(op => op.value === this.caseValueData[1])
          str += copObj && `/${copObj.label}`
        }
        return str
      },
    },
    methods: {
      nodeClick(info) {
        this.addrInfo = JSON.parse(JSON.stringify(info))
        this.aliasName = this.addrInfo.title
        this.setCascaderBoxAddr()
        this.$nextTick(() => {
          this.queryChannel()
          this.$refs.runTrendRef.queryChannelHistory()
          this.$refs.runTrendRef.getNewPowerHistoryData()
          this.handleQueryParams()
          if (this.isCheckBilling) {
            this.getMacLineBilling()
          }
        })
      },
      // 获取线路状态
      async queryChannel() {
        const res = await queryChannelDetailsByBoxAndAddr({ mac: this.deviceInfo.mac, addrs: this.addrInfo.addr })
        if (res.success) {
          if (Array.isArray(res.data) && res.data.length) {
            let details = res.data[0]
            this.details = details
            if (details.lineType && details.lineType === 'IO') {
              this.configuruationFlag = false
              this.AnalogList = details.analogIns && details.analogIns.length > 0 ? details.analogIns : []
              this.arrayOutPorts = details.digitalOuts && details.digitalOuts.length > 0 ? details.digitalOuts : []
              this.arrayInPorts = details.digitalIns && details.digitalIns.length > 0 ? details.digitalIns : []
              let newArguments = Array.isArray(this.AnalogList) && this.AnalogList.length ? this.AnalogList.map(item => item.name) : ['', '', '', '']
              this.$emit('updateData', ...newArguments, 'IO')
            } else {
              this.configuruationFlag = true
            }
          }
          // this.getIsCheckBilling()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      actionAfterWork() {
        this.queryChannel()
        this.$refs.LinesSelectViewRef.getAddrs()
      },
      // 合闸分闸操作
      async handleBrake(type) {
        if (this.lines.length === 0) {
          return this.$Message.error({ content: this.$t('nolineunderDevice') })
        }
        let params = [{ mac: this.deviceInfo.mac, addrOptInfos: [{ onOrOff: type, addrs: [this.addrInfo.addr] }] }]
        const result = await isAlarmStatus(params)
        if (result.success) {
          let tips = type ? this.$t('toolTipText20') : this.$t('toolTipText21')
          this.$Modal.confirm({
            title: this.$t('actionTip'),
            content: result.data && result.data.length ? tips : this.$t('confirmYouWant') + (type ? this.$t('closing') : this.$t('opening')) + '?',
            onOk: async () => {
              const res = await winextloraCmd(JSON.stringify(params))
              if (res.code === '0') {
                this.cancelRetry && this.cancelRetry()
                this.cancelRetry = retry(this.actionAfterWork, 2, 2000, false)
                this.$Message.success(this.$t('submitCommand'))
              } else {
                this.$Message.error(res.message)
              }
            },
          })
        } else {
          this.$Message.error({ content: result.message })
        }
      },
      //  远程锁定
      handleLocking(val) {
        let params = { cmd: 'REMOTE_SWITCH_LOCK', mac: this.deviceInfo.mac, addr: this.addrInfo.addr, lockStatus: val }
        if (val === 'false') {
          this.$Modal.confirm({
            title: this.$t('tip'),
            content: this.$t('toolTipText22'),
            onOk: () => {
              this.remoteSwitchLock(params)
            },
            onCancel: () => {
              this.$Message.info({ content: this.$t('canceled') })
            },
          })
        } else {
          this.remoteSwitchLock(params)
        }
      },
      async remoteSwitchLock(params) {
        const res = await remoteSwitchLock(params)
        if (res.success) {
          this.cancelRetry && this.cancelRetry()
          this.cancelRetry = retry(this.actionAfterWork, 2, 2000, false)
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleWriteBackpopup() {
        this.newPwdsSeconed = ''
        this.openSeconedCheck = this.$store.state.setSecondPwds
        this.$refs.writeBackCharts.init()
        this.handleChannelMarkedPowerHistory()
        this.openSeconedPwd = true
        this.writeBackValue = ''
      },
      async handleChannelMarkedPowerHistory() {
        const params = {
          mac: this.deviceInfo.mac,
          addr: this.addrInfo.addr,
          startTime: this.writeBackTimer,
          endTime: this.writeBackTimer,
        }
        const res = await channelMarkedPowerHistory(params)
        this.writeBackData.xAxis = []
        this.writeBackData.series = []
        if (res.success) {
          this.writeBackData.xAxis = res.data.xAxis
          this.writeBackData.series = [{ name: this.$t('writeBackBatteryLevel'), type: 'line', data: res.data.lstPwr, color: '#02a7f0', lineStyle: { color: '#02a7f0' }, smooth: true, itemStyle: { color: '#02a7f0' } }]
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      cancelSeconedPwd() {
        this.openSeconedPwd = false
        this.openSeconedCheck = false
      },
      handleWriteBackTimer(val) {
        this.writeBackTimer = val
        this.handleChannelMarkedPowerHistory()
      },
      handleLineTimer(v) {
        this.writeBackValue = v
      },
      checkSecondePwds() {
        if (this.openSeconedCheck) {
          if (this.newPwdsSeconed.length < 6) {
            this.newPwdsSeconed = ''
            return this.$Message.error({ content: this.$t('pleaseEnterComplateSubPassword') })
          }
          const encry = new JSEncrypt()
          getBpk().then(r => {
            this.bpk = r.data
            encry.setPublicKey(this.bpk.pubkey) // 设置公钥
            checkSecondPwd({ secondPwd: encry.encrypt(this.newPwdsSeconed), encB64: true }).then(res => {
              if (res.success) {
                if (res.code === '0') {
                  if (this.writeBackValue === '' || this.writeBackValue === '-') {
                    this.$Message.error({ content: this.$t('toolTipText23') })
                  } else {
                    this.writePwsSeconedCheckVue = true
                    this.openSeconedPwd = false
                    this.openSeconedCheck = false
                    this.handleSetPower()
                  }
                }
              } else {
                this.$Message.error({ content: res.message })
              }
            })
          })
        } else if (this.writeBackValue === '' || this.writeBackValue === '-') {
          this.$Message.error({ content: this.$t('toolTipText23') })
        } else {
          this.handleSetPower()
          this.writePwsSeconedCheckVue = true
          this.openSeconedPwd = false
        }
      },
      async handleSetPower() {
        let params = { mac: this.deviceInfo.mac, nodes: this.addrInfo.addr, power: (this.writeBackValue * 1000).toFixed(0) }
        const res = await setPower(params)
        if (res.success) {
          this.writePwsSeconedCheckVue = false
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async openRemotectrl(type, index, item) {
        const parmars = { cmd: 'DIGITALOUT_ON_OFF_JOG', mac: this.deviceInfo.mac, addr: this.addrInfo.addr, digitalOut: index, action: type }
        const res = await digitalOutRemotectrl(parmars)
        if (res.success) {
          this.cancelRetry && this.cancelRetry()
          this.cancelRetry = retry(this.queryChannel, 2, 2000, false)
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changeDateValue(value) {
        this.dateValue = value
      },
      async handleGetMainLineMode() {
        const params = { projectCode: this.$store.state.projectCode }
        const res = await getMainLineMode(params)
        if (res.success) {
          this.projectCodeMode = res.data.mode
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlePageQueryAddr() {
        const params = { projectCode: this.$store.state.projectCode, pageSize: '1000', pageNo: '1', onlineStatus: '', mac: '', equipmentTypes: '1,2,19', location: '', nodeIds: '' }
        const res = await pageQueryAddr(params)
        if (res.success) {
          this.queryBoxAddr = res.datas
          this.setCascaderBoxAddr()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      setCascaderBoxAddr() {
        let queryBoxAddr = this.queryBoxAddr.map(val => {
          const children =
            (Array.isArray(val.addrs) &&
              val.addrs.map(v => ({
                ...v,
                value: v.addr || '',
                disabled: val.mac === this.deviceInfo.mac && v.addr === this.addrInfo.addr,
                label: v.title,
              }))) ||
            []
          return { value: val.mac, label: val.name, dom: val.mac === this.deviceInfo.mac ? '0' : '1', children }
        })
        queryBoxAddr.unshift({ value: this.projectCodeMode === 1 ? this.$t('projectRoad') : this.$t('directInputLine'), dom: '1', label: this.projectCodeMode === 1 ? this.$t('projectRoad') : this.$t('directInputLine') })
        this.cascaderBoxAddr = queryBoxAddr.sort((a, b) => a.dom - b.dom)
      },
      async handleQueryParams() {
        let params = { mac: this.deviceInfo.mac, addr: this.addrInfo.addr, downCmd: true }
        let res = await queryParams(params)
        if (res.success) {
          this.configInfo = res.data
          this.remoteControl = res.data.enableControl ? 1 : 0
          if (this.configInfo) {
            this.topSonList = this.configInfo.topSonList.map(v => ({ macAddrName: `${v.others.name}(${v.others.mac})/${v.others.title}(${v.others.mac}-${v.addr.toString().padStart(2, '0')})`, mac: v.others.mac, addr: v.addr }))
            if (this.configInfo.pNodeName && (this.configInfo.pNodeName.includes(this.$t('projectRoad')) || this.configInfo.pNodeName.includes(this.$t('directInputLine')))) {
              this.caseValueData = [this.configInfo.pNodeName]
              this.caseValueDataEdit = [this.configInfo.pNodeName]
            } else {
              this.caseValueData = [this.configInfo.pNodeMac, this.configInfo.pNodeAddr]
              this.caseValueDataEdit = [this.configInfo.pNodeMac, this.configInfo.pNodeAddr]
            }
          }
        } else {
          this.$message.error(res.message)
        }
      },
      handleCascader() {
        let item = this.caseValueDataEdit
        if (item[0].includes(this.$t('projectRoad'))) {
          this.$Modal.warning({ title: this.$t('tip'), content: '<p>' + this.$t('toolTipText24') + '</p>', okText: this.$t('confirm') })
        }
        let params = {
          projectCode: this.$store.state.projectCode,
          targetMac: this.deviceInfo.mac,
          targetAddr: this.addrInfo.addr,
          parentMac: this.deviceInfo.mac,
          parentAddr: this.addrInfo.addr,
        }
        if (item[0].includes(this.$t('directInputLine')) || item[0].includes(this.$t('projectRoad'))) {
          this.handleChnlParentNodeConfig(params)
        } else if (item.length < 2) {
          return this.$Message.error({ content: this.$t('configLine') })
        } else if (item.length === 2) {
          params.parentMac = item[0]
          params.parentAddr = item[1]
          this.handleChnlParentNodeConfig(params)
        }
      },
      async handleChnlParentNodeConfig(params) {
        const res = await chnlParentNodeConfig(params)
        if (res.success) {
          this.handleQueryParams()
          this.isEditCaseValue = false
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleControl() {
        const params = { macs: this.deviceInfo.mac, cmd: 'SETCONTROL', nodeNo: this.addrInfo.addr, operType: this.remoteControl === 1 ? 1 : 0 }
        const res = await modifyBoxRemoteControl(params)
        if (res.success) {
          this.isEditRemoteControl = false
          this.handleQueryParams()
          this.$Message.success({ content: this.$t('submitCommand') })
        } else {
          let message = ''
          if (res.data !== undefined) {
            for (let elem of res.data) {
              message += elem.mac + '：' + elem.errorMsg
            }
          } else {
            message = res.message
          }
          this.$Message.error({ content: message })
        }
      },
      handleControlAlarm(cmd) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmYouWant') + (cmd === 'REMOTE_MUTE' ? this.$t('silencing') : this.$t('clearAlarm')) + '?',
          onOk: async () => {
            let params = { macs: this.deviceInfo.mac, cmd, nodeNo: this.addrInfo.addr }
            if (cmd === 'CLEAR_ALARM') {
              const res = await modifyBoxsChnlClearAlarm(params)
              if (res.success) {
                this.$Message.success({ content: this.$t('submitCommand') })
              } else {
                this.$Message.error({ content: res.data[0].errorMsg })
              }
            } else if (cmd === 'REMOTE_MUTE') {
              const res = await modifyBoxsChnlRemoteMute(params)
              if (res.success) {
                this.$Message.success({ content: this.$t('submitCommand') })
              } else {
                this.$Message.error({ content: res.data[0].errorMsg })
              }
            }
            return false
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('cancelEnter') })
          },
        })
      },
      async getIsCheckBilling() {
        const res = await billingCheck({ projectCode: this.$store.state.projectCode, isThrowError: false })
        if (res.success) {
          if (res.data) {
            this.isCheckBilling = res.data
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getMacLineBilling() {
        let params = { projectCode: this.$store.state.projectCode, mac: this.deviceInfo.mac, addr: this.addrInfo.addr }
        const res = await billingBalance(params)
        if (res.success) {
          if (res.data && Object.keys(res.data).length) {
            this.billingData = res.data
          } else {
            this.billingData.balance = false
            this.billingData.costFee = false
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      createdQrCode(row) {
        let domain = this.$func.ctxPaths()
        let domainStatus = domain.includes('sndtest') || domain.includes('localhost')
        let redirectUri = domainStatus ? 'https://v5.sndtest.com/billPayment' : 'https://v5.snd02.com/billPayment'
        return `${redirectUri}?project=${this.$store.state.projectCode}&targetValue=${row.targetValue}&billingTarget=${row.billingTarget}&billCycle=${this.$store.state.billCycle}`
      },
      async customDownload(text) {
        const doms = [
          { fileName: this.$t('conciseQRCode'), el: this.$refs.QrName },
          { fileName: this.$t('detailsQRCode'), el: this.$refs.QrTable1 },
          { fileName: this.$t('professionalQRCode'), el: this.$refs.QrTable2 },
        ]
        let imgInstances = doms.map(async item => {
          let canvas = await QrCode.createdCustomQrCodeCanvas(text, item.el)
          let file = await QrCode.canvasToBlob(canvas)
          return { fileName: item.fileName, file }
        })
        QrCode.downloadZip(await Promise.all(imgInstances), this.$t('qRCode'))
      },
      handleUnlock() {
        if (this.details.localLock) return false
        if (!this.details.enableNetCtrl && this.details.localLock) {
          this.$Message.error({ content: this.$t('toolTipText5') })
          return
        }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('toolTipText6'),
          onOk: async () => {
            let params = { cmd: 'ABNORMAL_SWITCH_UNLOCK', mac: this.deviceInfo.mac, addr: this.addrInfo.addr }
            const res = await abnormalSwitchUnlock(params)
            if (res.success) {
              this.cancelRetry && this.cancelRetry()
              this.cancelRetry = retry(this.actionAfterWork, 0, 3000, false)
              if (res.code === '0') {
                this.$Message.success({ content: res.message })
              }
            } else {
              this.$Message.error({ content: res.message })
            }
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('canceled') })
          },
        })
      },
      async getAddrs() {
        let params = { mac: this.deviceInfo.mac }
        const res = await getEffectAddr(params)
        if (res.success) {
          this.lines = res.datas
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      editNameUnit() {
        this.$refs.editAddrParamsModal.openModal()
      },
      async getWriteBackConfig() {
        const res = await getAutoPowerWriteBackConfig({ projectCode: this.$store.state.projectCode })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.isShowWrite = res.data && res.data.status
      },
      async handleQueryPageAuth() {
        let params = { resKeys: 'V5_PROJECT_USE', operKeys: 'AUTO_POWER_WRITE_BACK_CONFIG' }
        const res = await queryPageAuth(params)
        if (res.success) {
          this.writeBackShow = res.data[0].result
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleCorrect() {
        this.correctModal = true
        const res = await getCorrect({ mac: this.deviceInfo.mac, addr: this.addrInfo.addr })
        this.correctFormData.factor = res.data.factor
        this.correctFormData.arithmetic = res.data.arithmetic
      },
      openWritePwdModal() {
        this.$refs.operationCheckAuth.openModal()
      },
      async saveWriterConfig() {
        const res = await CorrectConfig({ mac: this.deviceInfo.mac, addr: this.addrInfo.addr, ...this.correctFormData })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.$Message.success(this.$t('correctionSuccessful'))
        this.correctModal = false
      },
      hideAliasName() {
        this.aliasFlag = false
        this.aliasName = this.addrInfo.title
      },
      async editAddrName() {
        let res = await updateNodeTitle({ mac: this.deviceInfo.mac, nodeNo: this.addrInfo.addr, title: this.aliasName })
        if (res.success) {
          this.aliasFlag = false
          this.cancelRetry && this.cancelRetry()
          this.cancelRetry = retry(this.actionAfterWork, 0, 3000, false)
          this.$Message.success({ content: this.$t('submitCommand') })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async modifyCurrentParam(value) {
        // 1 - 1260
        const num = Number(value)
        if (!value || value === '0' || !/^\d+$/.test(value) || num < 1 || num > 1260) {
          this.$Message.error(this.$t('toolTipText17'))
          throw new Error(this.$t('toolTipText17'))
        }
        const { success, message } = await modifyCurrentParam({
          mac: this.deviceInfo.mac,
          nodes: this.addrInfo.addr,
          echo: 1,
          value,
        })
        if (!success) {
          this.$Message.error(message)
          throw new Error(message)
        }
        this.$Message.success({ content: this.$t('submitCommand') })
        this.cancelRetry && this.cancelRetry()
        this.cancelRetry = retry(this.queryChannel, 0, 3000, false)
      },
      jumpParentDevice(val) {
        if (!val[1]) return
        if (val[0] === this.deviceInfo.mac) {
          this.refreshCurrentLine(val[1])
          return
        }
        this.lookDeviceDetails(val)
      },
      refreshCurrentLine(addr) {
        const findLine = this.$refs.LinesSelectViewRef.lines.find(v => +v.addr === +addr)
        if (findLine) {
          this.$refs.LinesSelectViewRef.setCurrentAddr(findLine)
        }
      },
      jumpChildDevice(val) {
        const hasAddr = val.includes('-')
        let splitVal
        let macValue = val
        let addr
        if (hasAddr) {
          splitVal = val.split('-')
          macValue = splitVal[0]
          addr = splitVal[1]
        }
        if (macValue === this.deviceInfo.mac) {
          this.refreshCurrentLine(addr)
          return
        }
        this.lookDeviceDetails([macValue, addr])
      },
      output() {
        let params = {
          mac: this.deviceInfo.mac,
          addr: this.addrInfo.addr,
          startTime: this.dateValue,
          endTime: this.dateValue,
        }
        this.$func.windowCountDown(`/trend/export/channelHistory.as?${qs.stringify(params)}`)
      },
    },
    created() {
      this.handleQueryPageAuth()
      this.getWriteBackConfig()
      this.handleGetMainLineMode()
      this.getIsCheckBilling()
      this.getAddrs()
    },
    mounted() {
      this.handlePageQueryAddr()
    },
    beforeDestroy() {
      this.setTimeHandle && clearTimeout(this.setTimeHandle)
      this.cancelRetry && this.cancelRetry()
    },
  }
</script>

<style lang="less" scoped>
  .outputs {
    border: 1px solid #007eff;
    padding: 3px;
    color: #007eff;
    margin-left: 10px;
    width: 36px;
    height: 32px;
    background-color: rgba(0, 126, 255, 0.1);
    border-radius: 5px;
  }
  .run-trend-content {
    height: 100%;
    display: flex;
    .left {
      width: 300px;
      height: 100%;
      padding: 15px 10px;
      background: #1a202e;
      margin-right: 10px;
    }
    .right {
      width: calc(~'100% - 310px');
      height: 100%;
      overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        height: 0px;
        width: 0px;
      }
      .mo-item {
        width: 100%;
        background: #1a202e;
        margin-bottom: 10px;
        padding: 0px 15px;
        .header {
          height: 50px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #5e626c;
          margin-top: 0 !important;
          justify-content: space-between;
          .left-title {
            display: flex;
            align-items: center;
            font-size: 14px;
          }
          .right-box {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .ml-5 {
              margin-left: 5px;
            }
            .TC-808 {
              font-size: 14px;
              background: rgba(13, 214, 103, 0.2);
              border-radius: 5px;
              color: #0dd667;
              padding: 5px;
              margin-left: 10px;
              margin-right: 10px;
            }
          }
        }
        .content {
          padding: 15px;
          .info-box {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            .info-item {
              height: 40px;
              line-height: 40px;
              width: 50%;
              min-width: 240px;
              display: flex;
              align-items: center;
              .label {
                color: #909399;
                flex-shrink: 0;
              }
              .value {
                width: 200px;
                .value-text {
                  max-width: calc(~'100% - 30px');
                }
              }
              .label + div {
                flex: 1;
                margin-left: 5px;
              }
              .op-icon {
                display: none;
                color: #007eff;
                margin-left: 5px;
              }
              .op-icon.active {
                display: inline-block;
              }
              &:hover {
                .op-icon {
                  display: inline-block;
                }
              }
            }
          }
          .info-box.col-8 {
            .info-item {
              width: 100%;
              min-width: 200px;
              .reds {
                margin-left: 5px;
                padding: 2px 6px;
                font-size: 12px;
                color: #f24e4c;
                border-radius: 4px;
                border: 1px solid #f24e4c;
                background: rgba(216, 53, 36, 0.2);
              }
              .greens {
                margin-left: -2px;
                padding: 2px 7px;
                font-size: 12px;
                border-radius: 4px;
                border: 1px solid #0dd667;
                color: #0dd667;
                background: rgba(108, 180, 131, 0.2);
              }
              .green-808 {
                margin-left: 5px;
                padding: 2px 7px;
                font-size: 12px;
                border-radius: 4px;
                color: #007eff;
                background: rgba(23, 42, 67, 0.2);
                border: 1px solid #007eff;
              }
              .grays {
                padding: 2px 6px;
                font-size: 12px;
                color: #999999;
                border: 1px solid #999999;
                border-radius: 4px;
                background: rgba(41, 44, 58, 0.2);
              }
            }
          }
          .ana-loglist {
            margin-top: 10px;
            padding: 10px 0;
          }
          .flex {
            display: flex;
          }
          .cercil {
            display: block;
            width: 6px;
            height: 6px;
            background-color: #007eff;
            color: #007eff;
            border-radius: 50%;
            margin: 5px 10px 5px 5px;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .header-pay {
    display: flex;
    justify-content: center;
    position: relative;
    font-size: 12px;
    padding: 10px 10px 0px 10px;
    .saveas {
      position: absolute;
      right: 10px;
      top: 1 0px;
      text-decoration: underline;
      color: #0698d9;
      cursor: pointer;
    }
  }
  #qrCode-POP {
    /deep/ .ivu-poptip-popper[x-placement^='right'] {
      width: 470px;
      position: absolute;
      will-change: top, left;
      top: -272px !important;
      left: 196px;
    }
  }
  .pop-content {
    border-top: 1px solid #797979;
    background: #28313f;
    padding: 10px;
    .imageCode {
      display: flex;
      justify-content: center;
      padding-top: 15px;
      padding-left: 40px;
      .jfcode {
        width: 200px;

        img {
          width: 100%;
        }
      }
    }
  }
  .o-button {
    position: relative;

    border-radius: 5px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    .big-icon {
      font-size: 30px;
      position: absolute;
      left: 5px;
      top: 0px;
    }
  }
  .o-danger {
    color: #f24e4c !important;
    border: 1px solid #f56c6c !important;
    background: rgba(245, 108, 108, 0.1) !important;
  }
  .not-color {
    color: #909399 !important;
    border: 1px solid #909399 !important;
    background: rgba(144, 147, 153, 0.1) !important;
  }
  .o-success {
    color: #21f27f !important;
    border: 1px solid #21f27f !important;
    background: rgba(33, 242, 127, 0.1) !important;
  }
  .o-info {
    color: #909399 !important;
    border: 1px solid #909399 !important;
    background: rgba(144, 147, 153, 0.1) !important;
  }
  /deep/.no-permission {
    .o-danger,
    .o-success,
    &.o-success {
      color: #909399;
      border-color: #909399;
      background: rgba(144, 147, 153, 0.1);
    }
    .c-success,
    .c-danger {
      color: #909399 !important;
    }
  }
  .flex-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .elp-cascader-node__label {
    font-weight: normal;
    padding: 0 5px;
    position: relative;
    .before {
      position: absolute;
      right: 10px;
      top: 5px;
      font-size: 12px;
      height: 22px;
      line-height: 22px;
      padding: 0 10px;
      background: #134767;
      color: #06a1eb;
    }
  }
</style>
