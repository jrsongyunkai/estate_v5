<template>
  <div class="threAdd">
    <Row class="step">
      <Col :span="15">
        <Steps :current="currents" v-if="formItem.model === '1'">
          <Step :title="$t('basicInformation')"></Step>
          <Step :title="$t('configDeviceLine')" :class="{ 'no-complete': currents < 1 }"></Step>
          <Step :title="$t('configureThreshold')" :class="{ 'no-complete': currents < 2 }"></Step>
          <Step :title="$t('complete')" :class="{ 'no-complete': currents < 3 }"></Step>
        </Steps>
        <Steps :current="current" v-if="formItem.model === '2'">
          <Step :title="$t('basicInformation')"></Step>
          <Step :title="$t('configDeviceLine')" :class="{ 'no-complete': current < 1 }"></Step>
          <Step :title="$t('configureCycle')" :class="{ 'no-complete': current < 2 }"></Step>
          <Step :title="$t('configureThresholdPeriod')" :class="{ 'no-complete': current < 3 }"></Step>
          <Step :title="$t('complete')" :class="{ 'no-complete': current < 4 }"></Step>
        </Steps>
      </Col>
      <Col v-if="(formItem.model === '1' && show1Arr.includes(currents)) || (formItem.model === '2' && show2Arr.includes(current))">
        <Button type="primary" @click="handleSave">{{ $t('save') }}</Button>
        <Button class="ml-10" @click="toback">{{ $t('cancel') }}</Button>
      </Col>
    </Row>
    <div v-if="current === 1 || currents === 1" class="cannotTc">
      <i class="icon-v5 icon-v5-huifu" />
      {{ $t('t3808Tip2') }}
    </div>
    <template>
      <div class="threAddContent">
        <template v-if="current === 0 && currents === 0">
          <Col :span="5">
            <div class="head">{{ $t('basicInformation') }}</div>
            <Form ref="formValidate" :model="formItem" :rules="ruleValidate" @keydown.native.enter.prevent="() => {}">
              <FormItem :label="$t('name')" prop="name">
                <Input v-model="formItem.name" :placeholder="$t('pleaseEnter')"></Input>
              </FormItem>
              <FormItem :label="$t('description')" prop="describe">
                <Input v-model="formItem.describe" type="textarea" :rows="4" :placeholder="$t('pleaseEnter')"></Input>
              </FormItem>
              <FormItem :label="$t('mode')">
                <Select v-model="formItem.model" class="w200" :disabled="rowData.edit === true">
                  <Option v-for="item in modeData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem :label="$t('state')">
                <Switch v-model="formItem.state" />
              </FormItem>
            </Form>
          </Col>
        </template>
        <template v-if="current === 1 || currents === 1">
          <div class="list">
            <Row class="threAddContent-tableHead">
              <div>{{ $t('equipmentline') }}</div>
              <Button type="primary" @click="handlePageQueryAddr">{{ $t('deviceCircuit') }}</Button>
            </Row>
            <Table :columns="macLineColumns" :data="macLineData" class="threAddContent-tableContent">
              <template slot-scope="{ row }" slot="line">
                <Tag v-for="(item, index) in row.addrs" :key="index" :name="item" closable @on-close="handleDeviceAddrDel(row, item)">{{ row.title ? row.title.split(',')[index] : '' }}</Tag>
              </template>
              <template slot-scope="{ row }" slot="action">
                <Button size="small" type="text" style="margin-right: 5px" class="danger-pra" @click="handleEditThresholdDevice(row)">{{ $t('edit') }}</Button>
                <Button size="small" type="text" class="danger-text" @click="handleDeviceAddrDel(row)">{{ $t('delete') }}</Button>
              </template>
            </Table>
            <Page show-total :current="currentPage" @on-change="changePage" @on-page-size-change="changesize" :total="total" show-elevator />
          </div>
        </template>
        <template v-if="currents === 2">
          <threList ref="child" :title="title" :edit="rowData.edit" :thresholdTypeList="thresholdTypeList" :thresholdTypeListNew="thresholdTypeListNew" :lineType="lineType" />
        </template>
        <template v-if="current === 2">
          <h3>{{ $t('cyclePeriod') }}</h3>
          <Row style="margin-top: 20px">
            <Col :span="6" class="cycleTime">
              <Form>
                <FormItem :label="$t('cyclePeriod')">
                  <Select v-model="cycle" class="w400">
                    <Option v-for="item in cycleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem :label="$t('selectCycle')" v-if="cycle === '2'">
                  <Select v-model="loopValue" filterable multiple allow-create class="w400" :max-tag-count="4">
                    <Option v-for="item in weekList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <template v-if="cycle === '3'">
                  <FormItem :label="$t('calendar')">
                    <Select v-model="calendar" class="w400">
                      <Option v-for="item in calendarData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <template v-if="calendar === '1'">
                    <FormItem :label="$t('loopMode')">
                      <Select v-model="month" class="w400">
                        <Option v-for="item in mode" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <Row v-if="month === '1'" class="timeSelect w400">
                      <div>{{ $t('selectDate') }}</div>
                      <Select :value="model11" multiple style="width: 400px" :max-tag-count="4" @on-change="handleSelect($event, '1')" class="selectDropdown">
                        <Option v-for="item in model11" :value="item" :key="item">{{ item }}</Option>
                      </Select>
                      <DatePicker :value="model11" :editable="false" id="datePicker" :clearable="false" ref="datePickerRef" type="date" multiple format="d" @on-change="datePickerQurey($event, '1')" style="width: 400px" class="datePicker"></DatePicker>
                    </Row>
                    <Row v-if="month === '2'">
                      <FormItem :label="$t('rule')" style="width: 400px">
                        <Select v-model="rule">
                          <Option v-for="item in ruleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                      </FormItem>
                      <div v-if="rule === '1'">
                        <div>{{ $t('ordinalSelection') }}</div>
                        <Row style="display: flex; width: 400px">
                          <i18n path="weekOfNumWeeksOfEachMonth">
                            <Select place="inputIndex" v-model="ordinal" style="width: 145px">
                              <Option v-for="item in ordinalIndex" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select place="selectWeek" v-model="ordinalWeek" style="width: 150px">
                              <template v-if="ordinal !== '6'">
                                <Option v-for="item in ordinalWeekList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </template>
                              <template v-if="ordinal === '6' && $store.state.mondaySelect === true">
                                <Option v-for="item in ordinalWeekListFiter" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </template>
                              <template v-if="ordinal === '6' && $store.state.mondaySelect === false">
                                <Option v-for="item in ordinalWeekListFiter2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </template>
                            </Select>
                          </i18n>
                        </Row>
                      </div>
                      <div v-if="rule === '2'">
                        <div>{{ $t('ordinalSelection') }}</div>
                        <Row style="display: flex; width: 400px">
                          <i18n path="onNumDaysOfEachMonth">
                            <Select path="selectInput" v-model="ordinal" style="width: 145px">
                              <Option v-for="item in ordinalWeekDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </i18n>
                        </Row>
                      </div>
                      <div v-if="rule === '5'">
                        <div>{{ $t('ordinalSelection') }}</div>
                        <Row style="display: flex; width: 400px">
                          <i18n path="weekOfLastNumWeeksOfEachMonth">
                            <Select place="inputIndex" v-model="ordinal" style="width: 100px">
                              <Option v-for="item in ordinalWeekAll" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select place="selectWeek" v-model="ordinalWeek" style="width: 100px">
                              <template v-if="ordinal !== '6'">
                                <Option v-for="item in ordinalWeekList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </template>
                              <template v-if="ordinal === '6'">
                                <Option v-for="item in ordinalWeekListFiter" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </template>
                            </Select>
                          </i18n>
                        </Row>
                      </div>
                      <div v-if="rule === '6'">
                        <div>{{ $t('ordinalSelection') }}</div>
                        <Row style="display: flex; width: 400px">
                          <i18n path="onLastNumDaysOfEachMonth">
                            <Select place="selectInput" v-model="ordinal" style="width: 145px">
                              <Option v-for="item in ordinalWeekDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </i18n>
                        </Row>
                      </div>
                    </Row>
                  </template>
                  <template v-if="calendar === '2'">
                    <FormItem :label="$t('loopMode')">
                      <Select v-model="month" class="w400">
                        <Option v-for="item in mode" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem :label="$t('selectDate1-30')" v-if="month === '1'">
                      <TreeSelect v-model="calendarMonthvalue" multiple show-checkbox :max-tag-count="4" :data="calendarMonthdata" class="w400" />
                    </FormItem>
                    <div v-if="month === '2'">
                      <FormItem :label="$t('rule')">
                        <Select v-model="calendarMonthRule" style="width: 352px">
                          <Option v-for="item in calendarMonthRuleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                      </FormItem>
                      <div v-if="calendarMonthRule === '2'">
                        <div>{{ $t('ordinalSelection') }}</div>
                        <Row class="ordinalSelection">
                          <i18n path="onNumDaysOfEachMonth">
                            <Select place="selectInput" v-model="calendarMonthRuleDay" style="width: 145px">
                              <Option v-for="item in dateLists" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </i18n>
                        </Row>
                      </div>
                      <div v-if="calendarMonthRule === '6'">
                        <div>{{ $t('ordinalSelection') }}</div>
                        <Row class="ordinalSelection">
                          <i18n path="onLastNumDaysOfEachMonth">
                            <Select place="selectInput" v-model="calendarMonthRuleReciprocalDay" style="width: 145px">
                              <Option v-for="item in dateLists" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </i18n>
                        </Row>
                      </div>
                    </div>
                  </template>
                </template>

                <template v-if="cycle === '4'">
                  <FormItem :label="$t('calendar')">
                    <Select v-model="calendar" class="w400">
                      <Option v-for="item in calendaryData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                  <template v-if="calendar === '1'">
                    <FormItem :label="$t('loopMode')">
                      <Select v-model="year" class="w400">
                        <Option v-for="item in mode" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <Row v-if="year === '1'" class="w400 timeSelect2">
                      <div>{{ $t('selectDate') }}</div>
                      <Select :value="model12" multiple :max-tag-count="2" @on-change="handleSelect($event, '1')" class="selectDropdown w400">
                        <Option v-for="item in model12" :value="item" :key="item">{{ item }}</Option>
                      </Select>
                      <DatePicker :value="model12" :editable="false" id="datePicker" :clearable="false" ref="datePickerRef" type="date" multiple format="MM-dd" @on-change="datePickerQurey($event, '2')" style="width: 400px" class="datePicker"></DatePicker>
                    </Row>
                    <Row v-if="year === '2'">
                      <FormItem :label="$t('rule')">
                        <Select v-model="ruleYear" style="width: 352px">
                          <Option v-for="item in ruleYearList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                      </FormItem>
                      <div v-if="ruleYear === '3'">
                        <div>{{ $t('ordinalSelection') }}</div>
                        <Row style="display: flex; width: 400px; margin-top: 20px">
                          <i18n path="inNumWeeksOfEachYear">
                            <Select place="selectInput" v-model="ordinalYear" style="width: 145px">
                              <Option v-for="item in ordinalYearWeek" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </i18n>
                        </Row>
                      </div>
                      <div v-if="ruleYear === '4'">
                        <div>{{ $t('ordinalSelection') }}</div>
                        <Row style="display: flex; width: 400px; margin-top: 20px">
                          <i18n path="onNumDaysOfEachYear">
                            <Select place="selectInput" v-model="ordinalYear" style="width: 145px">
                              <Option v-for="item in ordinalYearDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </i18n>
                          <span v-show="ordinalYear === '366'" style="color: red; font-size: 12px">{{ $t('leapYearAndLeapMonthTips1') }}</span>
                        </Row>
                      </div>
                      <div v-if="ruleYear === '7'">
                        <div>{{ $t('ordinalSelection') }}</div>
                        <Row style="display: flex; width: 400px; margin-top: 20px">
                          <i18n path="inLastNumWeeksOfEachYear">
                            <Select place="selectInput" v-model="ordinalYear" style="width: 145px">
                              <Option v-for="item in ordinalYearWeek" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </i18n>
                        </Row>
                      </div>
                      <div v-if="ruleYear === '8'">
                        <div>{{ $t('ordinalSelection') }}</div>
                        <Row style="display: flex; width: 400px; margin-top: 20px">
                          <i18n path="onLastNumDaysOfEachYear">
                            <Select place="selectInput" v-model="ordinalYear" style="width: 145px">
                              <Option v-for="item in ordinalYearDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </i18n>
                          <span v-show="ordinalYear === '366'" style="color: red; font-size: 12px">{{ $t('leapYearAndLeapMonthTips1') }}</span>
                        </Row>
                      </div>
                    </Row>
                  </template>
                  <template v-if="calendar === '2'">
                    <FormItem :label="$t('loopMode')">
                      <Select v-model="year" class="w400">
                        <Option v-for="item in mode" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem :label="$t('startDate')" v-if="year === '1'">
                      <el-cascader :options="calendarYearCascader" :props="props" collapse-tags clearable @change="Querycascader" v-model="cascaderModel" separator="" :placeholder="$t('pleaseEnterTheStartDate')" style="background: transparent; width: 346px"></el-cascader>
                    </FormItem>
                    <template v-if="year === '2'">
                      <FormItem :label="$t('rule')">
                        <Select v-model="calendarYearRule" style="width: 352px">
                          <Option v-for="item in calendarYearRuleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                      </FormItem>
                      <div v-if="calendarYearRule === '4'">
                        <div>{{ $t('ordinalSelection') }}</div>
                        <Row class="ordinalSelection">
                          <i18n path="onNumDaysOfEachYear">
                            <Select place="selectInput" v-model="calendarYearRuleDay" style="width: 145px">
                              <Option v-for="item in calendarYearDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </i18n>
                          <span class="tips" v-if="calendarYearRuleDay > 354">{{ $t('leapYearAndLeapMonthTips2') }}</span>
                        </Row>
                      </div>
                      <div v-if="calendarYearRule === '8'">
                        <div>{{ $t('ordinalSelection') }}</div>
                        <Row class="ordinalSelection">
                          <i18n path="onLastNumDaysOfEachYear">
                            <Select place="selectInput" v-model="calendarYearRuleReciprocalDay" style="width: 145px">
                              <Option v-for="item in calendarYearDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </i18n>
                          <span class="tips" v-if="calendarYearRuleReciprocalDay > 354">{{ $t('leapYearAndLeapMonthTips2') }}</span>
                        </Row>
                      </div>
                    </template>
                  </template>
                </template>
              </Form>
            </Col>
          </Row>
        </template>
        <template v-if="current === 3">
          <threDynamic ref="dynamicSaverefs" @formDynamic="formDynamic" :configId="configId" @timeNull="timeNull" :flagEdit="rowData" @DuplicateType="duplicateType" @duplicateTypeNull="duplicateTypeNull" :lineType="lineType"></threDynamic>
        </template>
        <template v-if="currents === 3 || current === 4">
          <div class="complete" v-if="comflict">
            <div class="wm320 iconSize">
              <Icon type="md-checkmark-circle" />
            </div>
            <div class="wm320" v-if="!temNoConflict">{{ temNoConContent }}</div>
            <div class="wm320" v-if="temNoConflict">{{ temNoB }}</div>
            <div class="wm320">
              <Button type="primary" @click="backAainadd">{{ $t('goOnAdd') }}</Button>
              <Button type="primary" class="ml-10" @click="backThreShold">{{ $t('backList') }}</Button>
            </div>
            <div class="comflict" v-if="temNoConflict">
              <div class="head">
                <Icon custom="icon-v5 icon-v5-weiwancheng"></Icon>
                <span class="ml-10">{{ temNoA }}</span>
              </div>
              <Table :columns="comflictColumn" :data="comflictData">
                <template slot-scope="{ row }" slot="addrName">
                  <Tag>{{ row.addrName }}</Tag>
                </template>
                <template slot-scope="{ row }" slot="timer">
                  <span>{{ `${row.startTime}-${row.endTime}` }}</span>
                </template>
                <template slot-scope="{ row }" slot="HasConlict">
                  <span>{{ `${row.alarmValueHasConlict ? $t('alarmValueConflict') : ''}  ${row.actionHasConlict ? $t('alarmActionConflict') : ''}` }}</span>
                </template>
              </Table>
            </div>
          </div>
        </template>
      </div>
    </template>
    <template v-if="formItem.model === '2'">
      <div style="margin-top: 20px" v-if="current !== 4">
        <Button type="primary" @click="previous(formItem.model)" v-if="current !== 0">{{ $t('previous') }}</Button>
        <Button type="primary" @click="next(formItem.model)" class="ml-10">{{ $t('nextStep') }}</Button>
      </div>
    </template>
    <template v-else>
      <div style="margin-top: 20px" v-if="currents !== 3">
        <Button type="primary" @click="previous(formItem.model)" v-if="currents !== 0">{{ $t('previous') }}</Button>
        <Button type="primary" @click="next(formItem.model)" class="ml-10">{{ $t('nextStep') }}</Button>
      </div>
    </template>
    <Modal :title="editMacLine === false ? $t('addCircuit') : $t('editcircuit')" v-model="addDevice" width="1200" class="addDevice">
      <div class="content">
        <Row :gutter="10" style="width: 100%" v-if="editMacLine === false">
          <Form style="width: 100%; display: flex">
            <FormItem class="w180">
              <Input v-model="addDeviceItem.name" :placeholder="$t('EnterDevice')"></Input>
            </FormItem>
            <FormItem :label-width="20">
              <Select v-model="addDeviceItem.type" @on-change="handleTypes" class="w180" :placeholder="$t('selectGroupingType')">
                <Option v-for="item in packetList" :value="item.id" :key="item.id">{{ item.type }}</Option>
              </Select>
            </FormItem>
            <FormItem :label-width="20">
              <TreeSelect :placeholder="$t('selectGroup')" multiple show-checkbox v-model="addDeviceItem.typeName" transfer :data="packetFilterList" class="w180" />
            </FormItem>
            <FormItem :label-width="20" class="w180">
              <Input v-model="addDeviceItem.position" :placeholder="$t('enterPosition')"></Input>
            </FormItem>
            <FormItem :label-width="20">
              <Select class="w180" v-model="onlinStatus" :placeholder="$t('plsEmacStatus')">
                <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" class="ml-10" @click="handlePageQueryAddr">{{ $t('query') }}</Button>
              <Button class="ml-10" @click="reset">{{ $t('reset') }}</Button>
            </FormItem>
          </Form>
        </Row>
        <Row style="margin-top: 20px">
          <Col :span="12" class="border">
            <div style="padding: 10px; background: #283140">
              <Checkbox :value="airSwitch" :indeterminate="indeterMac" @click.prevent.native="getAllDeviceValue(deviceLIstOne)">{{ $t('selectDevice') }}</Checkbox>
            </div>
            <div style="padding: 10px; height: 500px; overflow: auto">
              <Checkbox class="checkboxlist" v-for="item in deviceLIstOne" :label="item.mac" :key="item.mac" :value="item.ischeck" :indeterminate="item.indeter" :disabled="item.disable" ref="macRef" @on-change="checkSelectQuery(item.mac, item)">
                <span style="width: calc(100% - 24px); margin-left: 10px" @click.stop.prevent="clickLable(item.mac)">
                  <span :style="{ color: item.mac === curClickedNode ? '#0c70dd' : '#fff' }">{{ item.name + '(' + item.mac + ')' }}</span>
                </span>
              </Checkbox>
            </div>
          </Col>

          <Col :span="12" class="borderLeft">
            <div style="padding: 10px; background: #283140">
              <Checkbox
                v-if="curLines.length"
                :value="checkAllList"
                @click.prevent.native="
                  () => {
                    lineCheckAll(curLines)
                  }
                "
                :indeterminate="indeterList">
                {{ $t('selectLine') }}
              </Checkbox>
              <span v-else>{{ $t('selectLine') }}</span>
            </div>
            <div style="padding: 10px; height: 500px; overflow: auto">
              <div>
                <Input :placeholder="$t('linenameTosearch')" v-model="lineKeyword" />
              </div>
              <CheckboxGroup v-model="curSelectedLines" @on-change="linesChange">
                <Checkbox style="padding: 5px; display: block" v-for="item in curLines" :key="item.title" :label="item.addr" :disabled="item.disabled" v-show="item.title.includes(lineKeyword)" ref="lineRef">
                  <span @click.stop="handleMessage(item.disabled)">{{ item.title }}</span>
                </Checkbox>
              </CheckboxGroup>
            </div>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleThresholdDeviceAdd">{{ $t('save') }}</Button>
        <Button @click="confirm">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal v-model="openSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSeconedPwd" :isfoucs="false" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <Button type="default" @click="openSeconedPwd = false">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal v-model="openSaveSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSaveSeconedPwd" @close="closeTwoPwdModal" @getnewPwds="getTwoPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <Button type="default" @click="openSaveSeconedPwd = false">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="checkTwoSecondePwds">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import threDynamic from './threDynamic.vue'
  import threList from './threList.vue'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import {
    thresholdBaseInfoSave,
    getQueryBoxes,
    threTypleListSave,
    thresholdTypeList4Simple,
    thresholdDeviceAdd,
    deviceAddrDel,
    thresholdCycleSave,
    thresholdDeviceList,
    thresholdSave,
    checkSecondPwd,
    thresholdCancel,
    getGroupType,
    getGroupTree,
    getMacAddrConflictList,
    deviceSelect,
    thresholdGetBaseInfo,
  } from '@/api/public'
  import { calendarMonthdata, calendarYearCascader } from './data'
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  export default {
    components: { threDynamic, PwsSeconedCheckVue, threList },
    props: {
      threSholdList: { type: Function, default: null },
      rowData: { type: Object, default: () => {} },
      devicesObj: { default: null },
    },
    data() {
      return {
        fromType: '',
        saveSconedPws: '',
        openSaveSeconedPwd: false,
        bpk: null,
        formTypes: '',
        openSeconedPwd: false,
        formMadolDatas: '',
        newPwdsSeconed: '',
        props: { multiple: true },
        calendarMonth: '',
        calendarMonthvalue: [],
        calendarMonthdata: calendarMonthdata,
        cascader: [],
        cascaderModel: '',
        calendarMonthRuleList: [
          { value: '2', label: this.$t('everyMouthOneOfDay') },
          { value: '6', label: this.$t('countdownEveryMonthOneOfDay') },
        ],
        calendarMonthRule: '',
        calendarMonthRuleDay: '',
        calendarMonthRuleReciprocalDay: '',
        calendarYearRule: '',
        calendarYearRuleList: [
          { value: '4', label: this.$t('annually1') },
          { value: '8', label: this.$t('countdownEveryYearsday') },
        ],
        calendarYearvalue: '',
        calendarYearCascader: calendarYearCascader,
        calendarYearRuleDay: '',
        calendarYearRuleReciprocalDay: '',
        packetFilterList: [],
        title: this.$t('thresholdList'),
        current: 0,
        currents: 0,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pattern: 'simple',
        state: '',
        formItem: { id: '', name: '', describe: '', model: '', state: '' },
        show1Arr: [0, 1, 2],
        show2Arr: [0, 1, 2, 3],
        ruleValidate: {
          name: [
            { required: true, message: this.$t('pleaseInputName'), trigger: 'change' },
            { max: 20, message: this.$t('enterCharactersLengthLimitTip', { size: 20 }), trigger: 'change' },
          ],
          describe: [{ max: 50, message: this.$t('enterCharactersLengthLimitTip', { size: 50 }), trigger: 'change' }],
        },
        modeData: [
          { value: '1', label: this.$t('simpleMode') },
          { value: '2', label: this.$t('timeSlotMode') },
        ],
        packetList: [],
        addDeviceItem: { type: '', name: '', typeName: '', position: '' },
        configId: '',
        macLineColumns: [
          { title: this.$t('configDevice'), key: 'name' },
          { title: this.$t('equipmentNo'), key: 'mac' },
          { title: this.$t('line'), slot: 'line' },
          { title: this.$t('operation'), slot: 'action', width: 200, align: 'center' },
        ],
        startTime: '',
        endTime: '',
        macLineData: [],
        editMacLine: false,
        count: [0, 1, 2],
        addDevice: false,
        indeterminate: false,
        checkAll: false,
        lineKeyword: '',
        airSwitch: false,
        checkSwitch: false,
        checkAllGroups: [],
        deviceLIstOne: [],
        allAddrsMap: {},
        submitNode: {},
        curSelectedLines: [],
        curLines: [],
        cycle: '',
        cycleList: [
          { value: '1', label: this.$t('everyDay') },
          { value: '2', label: this.$t('weekly') },
          { value: '3', label: this.$t('monthlyCycle') },
          { value: '4', label: this.$t('yearlyCycle') },
        ],
        loopValue: '',
        weekList: [],
        calendar: '',
        calendarData: [
          { value: '1', label: this.$t('gregorianCalendar') },
          { value: '2', label: this.$t('lunarCalendar') },
        ],
        calendaryData: [
          { value: '1', label: this.$t('gregorianCalendar') },
          { value: '2', label: this.$t('lunarCalendar') },
        ],
        mode: [
          { value: '1', label: this.$t('cycleByDate') },
          { value: '2', label: this.$t('cycleByOrdinalNumber') },
        ],
        month: '',
        rule: '',
        ruleList: [
          { value: '1', label: this.$t('weekEverymonth') },
          { value: '2', label: this.$t('monthday') },
          { value: '5', label: this.$t('countdownEveryMonthRule5') },
          { value: '6', label: this.$t('countdownEveryMonthOneOfDay') },
        ],
        ordinal: '',
        ordinalIndex: [
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4' },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
        ],
        ordinalWeekAll: [
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4' },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
        ],
        calendarYearDay: [],
        ordinalWeek: '',
        ordinalWeekListFiter: [
          { value: '1', label: this.$t('monday') },
          { value: '2', label: this.$t('tuesday') },
        ],
        ordinalWeekListFiter2: [
          { value: '7', label: this.$t('sunday') },
          { value: '1', label: this.$t('monday') },
        ],
        ordinalWeekList: [
          { value: '7', label: this.$t('sunday') },
          { value: '1', label: this.$t('monday') },
          { value: '2', label: this.$t('tuesday') },
          { value: '3', label: this.$t('wednesday') },
          { value: '4', label: this.$t('thursday') },
          { value: '5', label: this.$t('friday') },
          { value: '6', label: this.$t('saturday') },
        ],
        lineType: 1,
        ordinalWeekDay: [],
        year: '',
        ruleYear: '',
        ruleYearList: [
          { value: '3', label: this.$t('everyYearweek') },
          { value: '4', label: this.$t('everyYearday') },
          { value: '7', label: this.$t('countdownEveryYearsWeek') },
          { value: '8', label: this.$t('countdownEveryYearsday') },
        ],
        ordinalYear: '',
        ordinalYearWeek: [],
        ordinalYearDay: [],
        startTimer: '',
        endTimer: '',
        macLineLength: '',
        thresholdTypeList: [],
        dateLists: [],
        taras: [],
        threformDynamicData: '',
        timeNullValue: '',
        cycleData: '',
        duplicate: false,
        duplicateTypeNullData: false,
        devicesObjData: '',
        comflict: false,
        valiAction: false,
        valiAction2: false,
        comflictData: [],
        comflictColumn: [
          { type: 'index', title: this.$t('index'), align: 'center' },
          { title: this.$t('thresholdName'), key: 'conlictConfigName' },
          { title: this.$t('deviceName'), key: 'macName', width: 200 },
          { title: this.$t('equipmentNo'), key: 'mac' },
          { title: this.$t('line'), slot: 'addrName' },
          { title: this.$t('thresholdType'), key: 'thresholdTypeName' },
        ],
        threformAlertAction: false,
        threformWarningAction: false,
        threformalertValue: false,
        threformwarningValue: false,
        stateList: [
          { value: '-1', label: this.$t('disconnected') },
          { value: '0', label: this.$t('offline') },
          { value: '1', label: this.$t('online') },
        ],
        onlinStatus: '',
        optionsDate: {
          disabledDate(date) {
            let dateTime = new Date()
            let currentYear = dateTime.getFullYear()
            let currentMonth = dateTime.getMonth()
            let monthFirstDay = new Date(currentYear, currentMonth, 1)
            let newMonth = ++currentMonth
            let newYear = currentYear
            if (newMonth >= 12) {
              newMonth -= 12
              newYear++
            }
            let nextMonthFirst = new Date(newYear, newMonth, 1)
            let nonthLastDay = new Date(nextMonthFirst.getTime() - 24 * 60 * 60 * 1000)
            return date.valueOf() < new Date(monthFirstDay).getTime() || date.valueOf() > new Date(nonthLastDay).getTime()
          },
        },
        list2: [],
        model11: [],
        thresholdTypeListNew: [],
        model12: [],
        displayShow: false,
        curClickedNode: '',
        checkMacData: [],
        checkStatus: false,
        indeterList: true,
        checkAllList: false,
        checkedList: [],
        LineTitle: [],
        LineAddrs: [],
        indeterMac: true,
        macData: [],
        abc: '',
        TypeTagAll: [],
        currentStatus: false,
        indeterMacLs: false,
        macLineList: '',
        indeterMacData: false,
        airSwitchMax: false,
        temNoConflict: false,
        temNoConContent: '',
        temNoA: '',
        temNoB: '',
        customName: [],
      }
    },
    mounted() {
      this.untilFuntionTime()
      this.mondaySelect()
      this.dataValue()
    },
    methods: {
      openTwoPwdModal() {},
      closeTwoPwdModal() {
        this.openSaveSeconedPwd = false
      },
      getTwoPwdsVal(val) {
        this.saveSconedPws = val
      },
      checkTwoSecondePwds(val) {
        if (this.saveSconedPws.length < 6) {
          this.saveSconedPws = ''
          return this.$Message.error({ content: this.$t('pleaseEnterComplateSubPassword') })
        }
        const encry = new JSEncrypt()
        getBpk().then(res => {
          this.bpk = res.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          checkSecondPwd({ secondPwd: encry.encrypt(this.saveSconedPws), encB64: true }).then(res => {
            if (res.success) {
              if (res.code === '0') {
                if (this.fromType === 1) {
                  if (this.lineType === 2) {
                    this.listValiAction()
                    this.listValiAction2()
                    if (this.valiAction || this.valiAction2) {
                      this.$Message.error({ content: this.$t('pleaseSelectWarningOrAlarmType') })
                    } else {
                      this.handleGetTypeSave()
                      this.handleThresholdSave()
                      this.$emit('threShow', 'threIndex')
                      setTimeout(() => {
                        this.threSholdList()
                      }, 1000)
                    }
                  } else {
                    const validateResult = this.listValidate(this.thresholdTypeList)
                    const validateRequire = this.listRequireValidate(this.thresholdTypeList)
                    if (validateResult.length) {
                      return this.$Message.error(this.$t('pleaseEnterPositiveInteger'))
                    }
                    if (validateRequire.length) {
                      const { limitType } = validateRequire[0]
                      return this.$Message.error(`${limitType === 1 ? this.$t('pleaseEnterVoltageUpAlarmValue') : limitType === 2 ? this.$t('pleaseEnterVoltageLowAlarmValue') : '-'}`)
                    }
                    this.handleGetTypeSave()
                    this.handleThresholdSave()
                    this.$emit('threShow', 'threIndex')
                    setTimeout(() => {
                      this.threSholdList()
                    }, 1000)
                  }
                } else if (this.fromType === 2) {
                  this.dynamicDuplic()
                  this.$nextTick(() => {
                    this.duplicateType()
                    this.duplicateTypeNull()
                  })
                  if (this.lineType === 1) {
                    if (this.duplicateTypeNullData === true) {
                      this.$Message.error(this.$t('pleaseSelectThresholdType'))
                    } else if (this.duplicate === true) {
                      this.$Message.error(this.$t('duplicateSelectionType'))
                    } else if (this.threformalertValue === true) {
                      this.$Message.error(this.$t('pleaseEnterWarningValueOrAlarmValue'))
                    } else if (this.defaultAlarmVal === '' && this.defaultWarningVal === '') {
                      this.$Message.error(this.$t('pleaseEnterWarningValueOrAlarmValue'))
                    } else {
                      this.dynamicSave()
                      this.handleThresholdSave()
                      setTimeout(() => {
                        this.threSholdList()
                      }, 1000)
                      this.$emit('threShow', 'threIndex')
                    }
                  } else {
                    if (this.thresholType) {
                      this.$Message.error({ content: this.$t('pleaseSelectAlarmType') })
                    } else {
                      this.dynamicSave()
                      this.handleThresholdSave()
                      setTimeout(() => {
                        this.threSholdList()
                      }, 1000)
                      this.$emit('threShow', 'threIndex')
                    }
                  }
                }
                this.openSaveSeconedPwd = false
              }
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        })
      },
      Querycascader(val) {
        this.cascader = []
        val.map(item => {
          this.cascader.push(`${item[0]}${item[1]}`)
        })
      },
      datePickerQurey(val, type) {
        this.model11 = []
        this.model12 = []
        this.data = val.split(',')
        this.list2 = this.data.map((v, i) => ({ value: `time${i}`, label: v }))
        if (type === '1') {
          this.model11 = this.list2.map(item => item.label)
          this.startTime = `${this.data}`
        } else {
          this.model12 = this.list2.map(item => item.label)
          this.startTime = `${this.data.map(item => item.replace(/-/, ''))}`
        }
      },
      handleSelect(val, type) {
        if (type === '1') {
          const temp = this.model11.concat(val).filter(item => !val.includes(item))
          const index = this.model11.indexOf(temp[0])
          if (index !== -1) {
            const internalValue = this.$refs.datePickerRef.internalValue
            internalValue.splice(index, 1)
            this.$refs.datePickerRef.internalValue = [...internalValue]
          }
          this.model11 = val
        } else {
          const temp = this.model12.concat(val).filter(item => !val.includes(item))
          const index = this.model12.indexOf(temp[0])
          if (index !== -1) {
            const internalValue = this.$refs.datePickerRef.internalValue
            internalValue.splice(index, 1)
            this.$refs.datePickerRef.internalValue = [...internalValue]
          }
          this.model12 = val
        }
      },
      CanstoDimension(arr1, arr2) {
        let arr = []
        for (let i = 0; i < arr1.length; i++) {
          arr.push([arr1[i], arr2[i]])
        }
        return arr
      },
      dataValue() {
        this.formItem = {
          id: this.rowData === {} ? '' : this.rowData.configId,
          name: this.rowData === {} ? '' : this.rowData.name,
          describe: this.rowData === {} ? '' : this.rowData.remark === undefined ? '' : this.rowData.remark,
          model: this.rowData.model === undefined ? '1' : String(this.rowData.model),
          state: this.rowData === {} ? '' : this.rowData.status !== 1,
        }
        let arrmodel = this.rowData.edit === true ? this.rowData.value.split(',') : ''
        this.model11 = arrmodel.map(item => `${item}`)
        this.model12 = arrmodel.map(item => item.slice(0, 2) + '-' + item.slice(2, 4))
        if (this.rowData.loopType === 3) {
          this.startTime = this.model11
        }
        if (this.rowData.loopType === 4 && this.rowData.calendarType === 1) {
          this.startTime = this.model12.map(item => item.replace(/-/, ''))
        }
        let casList = []
        let arr1 = []
        let arr2 = []
        this.rowData.value.split(',').map(val => {
          this.cascader.push(val)
          arr1.push(val.substring(0, 2))
          arr2.push(val.substring(2, 4))
        })
        casList = this.CanstoDimension(arr1, arr2)
        let reg = /\d+/g

        this.calendarYearRuleReciprocalDay = this.rowData.edit ? this.rowData.value.toString() : ''
        this.calendarYearRuleDay = this.rowData.edit ? this.rowData.value.toString() : ''

        this.calendarYearRule = this.rowData.edit ? this.rowData.loopRule.toString() : ''
        this.cascaderModel = this.rowData.edit ? casList : ''
        this.calendarMonthRule = this.rowData.edit ? this.rowData.loopRule.toString() : ''
        if (this.rowData.value !== '') {
          this.calendarMonthRuleDay = this.rowData.edit ? this.rowData.value.match(reg)[0] : ''
          this.calendarMonthRuleReciprocalDay = this.rowData.edit ? this.rowData.value.match(reg)[0] : ''
        }
        this.calendar = this.rowData.edit ? this.rowData.calendarType.toString() : ''
        this.calendarMonthvalue = this.rowData.edit ? this.rowData.value.split(',') : ''
        this.cycle = this.rowData.edit ? this.rowData.loopType.toString() : ''
        this.loopValue = this.rowData.edit ? this.rowData.value.match(reg) : ''
        this.month = this.rowData.edit ? this.rowData.loopMode.toString() : ''
        this.year = this.rowData.edit ? this.rowData.loopMode.toString() : ''
        this.endTime = this.rowData.edit ? this.rowData.value.match(reg)[1] : ''
        this.rule = this.rowData.edit ? this.rowData.loopRule.toString() : ''
        this.ordinal = this.rowData.edit ? this.rowData.value.match(reg)[0] : ''
        this.ordinalWeek = this.rowData.edit ? this.rowData.value.match(reg)[1] : ''
        this.ruleYear = this.rowData.edit ? this.rowData.loopRule.toString() : ''
        this.ordinalYear = this.rowData.edit ? this.rowData.value.match(reg)[0] : ''
      },
      mondaySelect() {
        if (this.$store.state.mondaySelect === true) {
          this.weekList = [
            { value: '1', label: this.$t('monday') },
            { value: '2', label: this.$t('tuesday') },
            { value: '3', label: this.$t('wednesday') },
            { value: '4', label: this.$t('thursday') },
            { value: '5', label: this.$t('friday') },
            { value: '6', label: this.$t('saturday') },
            { value: '7', label: this.$t('sunday') },
          ]
        } else {
          this.weekList = [
            { value: '7', label: this.$t('sunday') },
            { value: '1', label: this.$t('monday') },
            { value: '2', label: this.$t('tuesday') },
            { value: '3', label: this.$t('wednesday') },
            { value: '4', label: this.$t('thursday') },
            { value: '5', label: this.$t('friday') },
            { value: '6', label: this.$t('saturday') },
          ]
        }
      },
      lineCheckAll(val) {
        // 线路编号
        let LineAddrs = []
        val.map(v => {
          if (v.isIoLine !== true) {
            LineAddrs.push(v.addr)
          }
        })
        this.curSelectedLines = LineAddrs
        this.curSelectedLength = val.length
        if (this.indeterList) {
          this.checkAllList = false
        } else {
          this.checkAllList = !this.checkAllList
        }
        this.indeterList = false
        if (this.checkAllList) {
          this.curSelectedLines = this.curSelectedLines
        } else {
          this.curSelectedLines = []
        }
      },
      handleMessage(val) {
        if (val) {
          this.$Message.warning({ content: this.$t('thisDeviceNotSupportThresholdConfiguration') })
        }
      },
      linesChange(checked) {
        this.curSelectedLines = checked
        let disabled = ''
        this.curLines.map(val => {
          if (checked[0] === val.addr) {
            if (val.isIoLine === true) {
              disabled = true
              this.deviceLIstOne.forEach(vals => {
                if (vals.lineType === 'IO') {
                  vals.disable = false
                }
              })
            } else {
              disabled = false
              this.deviceLIstOne.map(val => {
                if (val.lineType === 'IO') {
                  val.disable = false
                }
              })
            }
          }
          if (val.canSelect === false && val.isSupport === false) {
            val.disable = true
          }
        })

        this.curLines.map(val => {
          if (disabled) {
            if (val.canSelect && val.isSupport) {
              val.isIoLine === true ? (val.disabled = false) : (val.disabled = true)
            } else {
              val.disabled = true
            }
          } else {
            if (val.canSelect && val.isSupport) {
              val.isIoLine === true ? (val.disabled = true) : (val.disabled = false)
            } else {
              val.disabled = true
            }
          }

          if (checked.length === 0) {
            if (!val.canSelect && !val.isSupport) {
              val.disabled = true
            } else {
              val.disabled = false
              this.deviceLIstOne.map(val => {
                val.disable = false
              })
            }
          }
        })
        this.deviceLIstOne.map(val => {
          if (val.mac === this.checkMacData) {
            if (checked.length === this.curLines.length) {
              val.indeter = false
              val.ischeck = true
            }
            if (this.curSelectedLines.length < this.curLines.length) {
              val.indeter = true
              val.ischeck = false
            }

            if (this.curSelectedLines.length === 0) {
              val.indeter = false
              val.ischeck = false
            }
          }
        })
        this.checkAllGroups.push(this.checkMacData)
        if (checked.length === this.curLines.length) {
          this.indeterList = false
          this.checkAllList = true
          this.indeterMacLs = false
        }
        if (this.curSelectedLines.length < this.curLines.length) {
          this.indeterList = true
          this.checkAllList = false
          this.indeterMacLs = true
        }
        if (this.curSelectedLines.length === 0) {
          this.indeterList = false
          this.checkAllList = false
          this.indeterMacLs = false
        }
        if (this.curClickedNode) this.submitNode[this.curClickedNode] = checked
      },

      handleConfigurethreShold() {
        let params = { configId: this.rowData.edit === true ? this.formItem.id : this.configId }
        return new Promise((resolve, reject) => {
          thresholdTypeList4Simple(params).then(res => {
            if (res.success) {
              this.thresholdTypeListNew = res.data.map(v => ({ ...v, warningError: false, alarmError: false }))
              this.thresholdTypeList = res.data.map(v => ({ ...v, warningError: false, alarmError: false }))
              resolve()
            } else {
              this.$Message.error(this.$t('unknown'))
              reject(new Error(this.$t('unknown')))
            }
          })
        })
      },
      listValidate(data) {
        let result = []
        data.forEach(v => {
          const reg = /^[0-9]+$/
          if ((v.alarmThreshol && !reg.test(v.alarmThreshol)) || (v.warnThreshol && !reg.test(v.warnThreshol))) {
            result.push(v)
          }
        })
        return result
      },
      listValiAction() {
        this.thresholdTypeListNew.map(val => {
          if (val.warnThresholList[0] !== '' && val.warnThresholList[1] !== '') {
            if (val.warnCustomId === undefined || val.warnCustomId === 0) {
              this.valiAction = true
            } else {
              this.valiAction = false
            }
          }
        })
      },
      listValiAction2() {
        this.thresholdTypeListNew.map(val => {
          if (val.alarmThresholList[0] !== '' && val.alarmThresholList[1] !== '') {
            if (val.alarmCustomId === undefined || val.alarmCustomId === 0) {
              this.valiAction2 = true
            } else {
              this.valiAction2 = false
            }
          }
        })
      },
      listRequireValidate(data) {
        let result = []
        const arr = data.filter(v => Number(v.type) === 2)
        if (arr.map(v => v.alarmThreshol).filter(Boolean).length === 1) {
          result.push(...arr.filter(v => !v.alarmThreshol))
        }
        return result
      },
      handleGetTypeSave() {
        let params = { configId: this.configId }
        if (this.lineType === 1) {
          let newArrVal = []
          this.thresholdTypeList.map(val => {
            if (val.alarmThreshol !== '' || val.warnThreshol !== '') {
              newArrVal.push(val)
            }
          })
          newArrVal.map(e => {
            delete e.canSetTypes
            delete e.limitType
            delete e.typeName
            delete e.unit
            delete e._index
            delete e._rowKey
            delete e.alarmError
            delete e.warningError
          })
          params.list = JSON.stringify(newArrVal)
        } else {
          this.thresholdTypeListNew.map(v => {
            v.warnAction = 3
            v.alarmAction = 3
          })
          let newArrVal = this.thresholdTypeListNew.map(v => ({ ...v, id: v.id ? v.id : '' }))
          newArrVal.map(v => {
            delete v.canSetTypes
            delete v.limitType
            delete v.typeName
            delete v.unit
            delete v._index
            delete v._rowKey
            delete v.alarmError
            delete v.warningError
            delete v.alarmCanSetList
            delete v.warnCanSetList
          })
          params.newList = JSON.stringify(newArrVal)
        }
        return new Promise((resolve, reject) => {
          threTypleListSave(params).then(res => {
            if (res.success) {
              resolve()
            } else {
              this.$Message.error({ content: res.message })
              reject(new Error(this.$t('unknown')))
            }
          })
        })
      },
      handleThresholdBaseInfoSave(cb) {
        let params = {
          configId: this.formItem.id,
          projectCode: this.$store.state.projectCode,
          name: this.formItem.name,
          remark: this.formItem.describe,
          model: this.formItem.model,
          status: this.formItem.state === true ? '2' : '1',
        }
        thresholdBaseInfoSave(params).then(res => {
          const { success, data, message } = res
          if (success) {
            const { configId } = data
            this.configId = `${configId}`
            if (this.rowData.edit === true) {
              this.handleThresholdDeviceList(this.configId)
            } else if (this.devicesObjData !== '') {
              this.ThresholdDevice(this.configId)
            }
            if (cb) this.cbthreIndex()
          } else {
            this.$Message.error({ content: message })
          }
        })
      },
      cbthreIndex() {
        this.$emit('threShow', 'threIndex')
        this.threSholdList()
      },
      handleThresholdDeviceAdd() {
        const selectedNodes = [...new Set([...this.checkAllGroups])]
        let devices = selectedNodes.map(v => ({
          addrs: this.submitNode[v] ? [...new Set([...this.submitNode[v].map(item => Number(item))])].toString() : '',
          mac: v,
        }))
        let params = { configId: this.configId, deviceData: JSON.stringify(devices) }
        if (!devices.length) {
          return this.$Message.error(this.$t('pleaseSelectADevice'))
        }
        thresholdDeviceAdd(params).then(res => {
          if (res.success) {
            this.$Message.success(this.$t('successfullyAddedDeviceCircuit'))
            this.handleThresholdDeviceList(this.configId)
            this.addDevice = false
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      conflictDetection() {
        let params = { projectCode: this.$store.state.projectCode, configId: this.configId }
        getMacAddrConflictList(params).then(res => {
          if (res.success) {
            this.comflict = true
            this.comflictData = res.data.conlictList
            let arrayStatus = Array.isArray(this.comflictData) && this.comflictData.length > 0
            if (res.data.temNoConflict) {
              this.temNoConContent = `“${this.formItem.name}”` + this.$t('configurationsTip')
              this.temNoConflict = false
            }
            if (!res.data.temNoConflict && !arrayStatus) {
              this.temNoConContent = `“${this.formItem.name}”` + this.$t('configurationsTip2')
              this.temNoConflict = false
            }
            if (!res.data.temNoConflict && arrayStatus) {
              this.temNoA = this.$t('configurationsTip3')
              this.temNoB = `“${this.formItem.name}”` + this.$t('configurationsTip4')
              this.temNoConContent = `“${this.formItem.name}”` + this.$t('configurationsTip4')
              this.temNoConflict = true
            }
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      ThresholdDevice(id) {
        let arr = JSON.parse(JSON.stringify(this.devicesObjData.addrs))
        let obj = [{ addrs: arr.join(','), mac: this.devicesObjData.mac }]
        let params = { configId: id, deviceData: JSON.stringify(obj) }
        thresholdDeviceAdd(params).then(res => {
          if (res.success) {
            this.handleThresholdDeviceList(this.configId)
            this.addDevice = false
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleThresholdDeviceList(id) {
        let params = { configId: id, pageNo: this.currentPage, pageSize: this.pageSize }
        thresholdDeviceList(params).then(res => {
          if (res.success) {
            this.total = res.total
            let arr = res.datas
            arr.map(val => {
              val.addrs = val.addrs ? val.addrs.split(',') : []
            })
            this.macLineData = arr
            this.checkAllGroups = this.macLineData.map(item => item.mac)
            this.curSelectedLines = []
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      deviceListData() {
        let params = { configId: this.rowData.edit === true ? this.formItem.id : this.configId, pageNo: '1', pageSize: '10000' }
        thresholdDeviceList(params).then(res => {
          if (res.success) {
            this.macLineList = res.datas
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleEditThresholdDevice(row) {
        this.checkMacData = row.mac
        this.addDevice = true
        this.editMacLine = true
        this.deviceLIstOne = []
        let obj = { addrs: row.addrs, mac: row.mac, name: row.name }
        this.deviceLIstOne.push(obj)
        this.curSelectedLines = []
        this.clickLable(row.mac, 'edit')
        row.addrs.map(item => {
          this.curSelectedLines.push(item++)
        })
        this.getLines(row.mac, row.addrs)
        setTimeout(() => {
          this.checkAllGroups = [row.mac]
          this.submitNode = {}
          this.submitNode[row.mac] = [...row.addrs]
          this.submitNode[row.mac] = row.addrs
          if (this.curSelectedLines.length < this.curLines.length) {
            this.indeterMacData = true
            this.airSwitchMax = false
          }
        }, 500)
      },

      handleThresholdCycleSave() {
        let cycleData = ''
        let cycleMode = ''
        let cycleRule = ''
        switch (this.cycle) {
          case '2':
            cycleData = `${this.loopValue.map(Number)}`
            break
          case '3':
            cycleMode = this.month
            if (this.calendar === '1') {
              if (cycleMode === '1') {
                cycleData = `${this.startTime}`
              } else {
                cycleRule = this.rule
                if (cycleRule === '1' || cycleRule === '3' || cycleRule === '5') {
                  cycleData = `${this.ordinal}_${this.ordinalWeek}`
                } else {
                  cycleData = this.ordinal
                }
              }
            }
            if (this.calendar === '2') {
              if (cycleMode === '1') {
                cycleData = `${this.calendarMonthvalue}`
              } else {
                cycleRule = this.calendarMonthRule
                if (cycleRule === '2') {
                  cycleData = `${this.calendarMonthRuleDay}`
                }
                if (cycleRule === '6') {
                  cycleData = `${this.calendarMonthRuleReciprocalDay}`
                }
              }
            }
            break
          case '4':
            cycleMode = this.year
            if (this.calendar === '1') {
              if (cycleMode === '1') {
                cycleData = `${this.startTime}`
              } else {
                cycleRule = this.ruleYear
                if (cycleRule === '1') {
                  cycleData = this.ordinalYear
                } else {
                  cycleData = this.ordinalYear
                }
              }
            }
            if (this.calendar === '2') {
              cycleRule = this.calendarYearRule
              if (cycleMode === '1') {
                cycleData = `${this.cascader}`
              } else {
                if (cycleRule === '4') {
                  cycleData = `${this.calendarYearRuleDay}`
                }
                if (cycleRule === '8') {
                  cycleData = `${this.calendarYearRuleReciprocalDay}`
                }
              }
            }
            break
        }
        this.cycleData = { loopType: this.cycle, loopMode: cycleMode, loopRule: cycleRule, value: cycleData }
        let params = { configId: this.configId, calendarType: this.calendar, loopType: this.cycle, loopMode: cycleMode, loopRule: cycleRule, value: cycleData }
        thresholdCycleSave(params).then(res => {
          if (res.success) {
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleDeviceAddrDel(row, item) {
        let params = { id: row.id, addrs: item === undefined ? '' : item }
        deviceAddrDel(params).then(res => {
          if (res.success) {
            this.handleThresholdDeviceList(this.configId)
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      getAllDeviceValue(list) {
        setTimeout(() => {
          this.$refs.macRef.map(val => {
            if (this.checkMacData === val.label) {
              if (val.currentValue) {
                this.curSelectedLines = this.curLines.map(val => val.addr)
                this.submitNode[this.curClickedNode] = this.curSelectedLines
              }
            }
          })
        }, 500)

        if (this.indeterMac) {
          this.airSwitch = false
        } else {
          this.airSwitch = !this.airSwitch
        }
        this.indeterMac = false
        if (this.airSwitch) {
          this.checkAllGroups = list.map(item => item.mac)
          this.$refs.macRef.map(val => {
            val.currentValue = true
          })
        } else {
          this.checkAllGroups = []
          this.$refs.macRef.map(val => {
            val.currentValue = false
          })
        }
      },

      handleQueryBoxes() {
        // 所有设备列表
        let arr = []
        this.curSelectedLines = []
        let param = {
          projectCode: this.$store.state.projectCode,
          key: this.addDeviceItem.name,
          equipmentTypes: '1,2,19',
          location: this.addDeviceItem.position,
          nodeIds: this.addDeviceItem.typeName ? this.addDeviceItem.typeName.join() : this.addDeviceItem.typeName,
        }
        getQueryBoxes(param).then(res => {
          if (res.success) {
            let key = 'ischeck'
            let indeter = 'indeter'
            this.deviceLIstOne = Array.from(new Set(res.data))
            this.deviceLIstOne.map(val => {
              val[key] = false
              val[indeter] = false
            })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
        this.macLineData.map(item => {
          arr = item.addrs
        })
        arr.map(item => {
          this.curSelectedLines.push(item++)
        })
      },
      handleCutoms() {
        this.$refs.child.handleCustom()
      },
      checkSelectQuery(mac, item) {
        this.checkMacData = mac
        this.clickLable(mac)
        this.curSelectedLines = []
        this.$refs.macRef.map(val => {
          if (val.label === mac) {
            setTimeout(() => {
              if (val.currentValue) {
                this.curSelectedLines = []
                this.curLines.forEach(vals => {
                  if (!vals.isIoLine) {
                    this.curSelectedLines.push(vals.addr)
                  } else {
                    vals.disabled = true
                  }
                })
                this.checkAllGroups.push(mac)
              } else {
                this.curLines.forEach(vals => {
                  vals.disabled = false
                })
                this.curSelectedLines = []
                for (var i = 0; i < this.checkAllGroups.length; i++) {
                  if (this.checkAllGroups[i] === mac) {
                    this.checkAllGroups.splice(i, 1)
                  }
                }
              }
              if (this.curClickedNode) this.submitNode[this.curClickedNode] = this.curSelectedLines
            }, 500)
          }
        })

        let arr = []
        this.$refs.macRef.map(val => {
          arr.push(val.currentValue)
        })
        let equal = this.$func.isAllEqual(arr)
        if (equal) {
          this.airSwitch = true
          this.indeterMac = false
        } else {
          this.airSwitch = false
          this.indeterMac = true
        }
      },
      handlePageQueryAddr() {
        let params = {
          configId: this.configId,
          projectCode: this.$store.state.projectCode,
          pageSize: '1000',
          pageNo: '1',
          onlineStatus: this.onlinStatus,
          mac: this.addDeviceItem.name,
          equipmentTypes: '1,2,19',
          location: this.addDeviceItem.position,
          nodeIds: this.addDeviceItem.typeName ? this.addDeviceItem.typeName.join() : this.addDeviceItem.typeName,
        }
        deviceSelect(params).then(res => {
          let arrMac = []
          if (res.success) {
            this.addDevice = true
            let key = 'ischeck'
            let indeter = 'indeter'
            this.deviceLIstOne = Array.from(new Set(res.datas))
            this.deviceLIstOne.map(val => {
              val[key] = false
              val[indeter] = false
              val['disable'] = false
              val.addrs.find(item => {
                if (item.isIoLine === true) {
                  val.lineType = 'IO'
                } else {
                  val.lineType = 'unIO'
                }
                if (item.canSelect === false && item.isSupport === false) {
                  item['disabled'] = true
                } else {
                  item['disabled'] = false
                }
              })
            })
            this.submitNode = {}
            this.macLineData.forEach(v => {
              this.submitNode[v.mac] = [...v.addrs]
            })
            setTimeout(() => {
              this.$refs.macRef.map(val => {
                if (this.macLineData.length === 0) {
                  val.currentValue = false
                }
                this.macLineData.map(item => {
                  if (val.label === item.mac) {
                    arrMac.push(item.mac)
                    this.clickLable(arrMac[0], 'Addr')
                    if (this.macLineData.length !== 0) {
                      val.currentValue = true
                    }
                  }
                })
              })
            }, 500)
          }
        })
      },
      clickLable(mac, type) {
        this.checkMacData = mac
        if (type === 'edit') {
          setTimeout(() => {
            this.$refs.macRef.map(val => {
              val.currentValue = true
            })
          }, 500)
        }

        if (type !== 'Addr' && type !== 'edit') {
          setTimeout(() => {
            this.$refs.macRef.map(val => {
              if (mac === val.label) {
                if (val.currentValue) {
                  this.curSelectedLines = this.curLines.map(val => val.addr)
                  this.submitNode[this.curClickedNode] = this.curSelectedLines
                }
              }
            })
          }, 500)
        }
        this.deviceLIstOne.map(item => {
          if (item.mac === mac) {
            this.curLines = item.addrs.map(vals => ({ addr: vals.addr, title: vals.title, isIoLine: vals.isIoLine, disabled: vals.disabled, canSelect: vals.canSelect, isSupport: vals.isSupport }))
          }
        })
        const result = this.submitNode[mac] && this.submitNode[mac].length ? this.submitNode[mac] : this.allAddrsMap[mac] && this.allAddrsMap[mac].length ? this.allAddrsMap[mac] : []
        this.curSelectedLines = result.map(v => Number(v))
        this.curLines.forEach(val => {
          if (val.addr === Number(this.curSelectedLines[0])) {
            if (val.isIoLine) {
              this.curLines.forEach(item => {
                item.disabled = !item.isIoLine
              })
            } else {
              this.curLines.forEach(item => {
                item.disabled = !!item.isIoLine
              })
            }
          }
        })
        this.curClickedNode = mac
      },

      getLines(mac, addrs) {
        let params = {
          configId: this.configId,
          projectCode: this.$store.state.projectCode,
          pageSize: '1000',
          pageNo: '1',
          onlineStatus: this.onlinStatus,
          mac: mac,
          equipmentTypes: '1,2,19',
          location: this.addDeviceItem.position,
          nodeIds: this.addDeviceItem.typeName ? this.addDeviceItem.typeName.join() : this.addDeviceItem.typeName,
        }
        deviceSelect(params).then(res => {
          this.curLines = []
          res.datas.map(item => {
            item.addrs.map(val => {
              if (val.canSelect === false && val.isSupport === false) {
                val['disabled'] = true
              } else {
                val['disabled'] = false
              }
              this.curLines.push({ addr: val.addr, title: val.title, disabled: val.disabled, canSelect: val.canSelect, isIoLine: val.isIoLine, isSupport: val.isSupport })
            })
          })
          this.curLines.forEach(val => {
            if (val.addr === Number(addrs[0])) {
              if (val.isIoLine) {
                this.curLines.forEach(item => {
                  if (item.isIoLine) {
                    item.disabled = false
                  } else {
                    item.disabled = true
                  }
                })
              } else {
                this.curLines.forEach(item => {
                  item.disabled = !!item.isIoLine
                })
              }
            }
          })
        })
      },
      confirm() {
        this.$Modal.confirm({
          title: this.$t('savedAfterCancellation'),
          content: this.$t('wantCancel') + '?',
          onOk: () => {
            this.addDevice = false
            this.$Message.info(this.$t('cancelSuccessful'))
          },
        })
      },
      allGroupSelect() {
        if (this.deviceLIstOne.length === this.checkAllGroups.length && this.deviceLIstOne) {
          this.airSwitch = true
        } else {
          this.airSwitch = false
        }
      },
      handleThresholdSave(cb) {
        let params = { configId: this.configId }
        let that = this
        return new Promise((resolve, reject) => {
          thresholdSave(params).then(res => {
            if (res.success) {
              that.$Message.success(that.$t('savedSuccessfully'))
              that.conflictDetection()
              cb && cb()
              resolve()
            } else {
              that.$Message.error({ content: res.message })
              reject(new Error(that.$t('unknown')))
            }
          })
        })
      },
      formDynamic(val) {
        let arr1 = []
        if (this.lineType === 1) {
          val.items.some(item => {
            this.defaultAlarmVal = item.defaultAlarmVal
            this.defaultWarningVal = item.defaultWarningVal
            if (this.defaultAlarmVal === '' && this.defaultWarningVal === '') {
              arr2.push(true)
            }
            item.chilren.itemc.some(vals => {
              this.threformTimer = vals.timer[0] === '' || vals.timer[1] === ''
              this.threformAlertAction = vals.alertAction === ''
              this.threformWarningAction = vals.warningAction === ''
              arr1.push([vals.alertValue === undefined ? '' : vals.alertValue, vals.warningValue === undefined ? '' : vals.warningValue])
            })
          })
          let arr2 = []
          arr1.some(val => {
            if (val[0] === '' && val[1] === '') {
              arr2.push(true)
            }
          })
          if (arr2.includes(true)) {
            this.threformalertValue = true
          } else {
            this.threformalertValue = false
          }
        } else {
          val.items.some(item => {
            if (item.defaultalarmThresholList[0] !== '' && item.defaultalarmThresholList[1] !== '') {
              if (item.defaultalarmThresholType === '') {
                this.thresholType = true
              } else {
                this.thresholType = false
              }
            }
            if (item.defaultwarnThresholList[0] !== '' && item.defaultwarnThresholList[1] !== '') {
              if (item.defaultwarnThresholType === '') {
                this.thresholType = true
              } else {
                this.thresholType = false
              }
            }

            item.chilren.itemc.some(vals => {
              if (vals.alarmThresholList[0] !== '' && vals.alarmThresholList[1] !== '') {
                if (vals.alarmThresholType === '') {
                  this.thresholType = true
                } else {
                  this.thresholType = false
                }
              }
              if (vals.warnThresholList[0] !== '' && vals.warnThresholList[1] !== '') {
                if (vals.warnThresholType === '') {
                  this.thresholType = true
                } else {
                  this.thresholType = false
                }
              }
            })
          })
        }
      },
      timeNull(val) {
        this.timeNullValue = val
      },
      // 旧的列表请求接口
      handleMacline() {
        this.addDevice = true
        this.handleQueryBoxes()
        this.submitNode = {}
        this.macLineData.forEach(v => {
          this.submitNode[v.mac] = [...v.addrs]
        })
        this.handleQueryBoxes()
        this.getGroupTypes()
        this.macLineData.forEach(v => {
          this.submitNode[v.mac] = v.addrs
        })
      },
      async current1() {
        let params = {
          configId: this.formItem.id,
          projectCode: this.$store.state.projectCode,
          name: this.formItem.name,
          remark: this.formItem.describe,
          model: this.formItem.model,
          status: this.formItem.state === true ? '2' : '1',
        }
        await thresholdBaseInfoSave(params).then(res => {
          const { success, data, message } = res
          if (success) {
            const { configId } = data
            this.configId = `${configId}`
            if (this.rowData.edit === true) {
              this.handleThresholdDeviceList(this.configId)
            }
          } else {
            this.$Message.error({ content: message })
          }
        })
      },
      duplicateType(val) {
        this.duplicate = val
      },
      duplicateTypeNull(val) {
        this.duplicateTypeNullData = val
      },
      async handleSave() {
        if (this.formItem.model === '1') {
          if (this.currents === 0) {
            this.$refs.formValidate.validate(valid => {
              if (valid) {
                if (this.formItem.name === undefined) {
                  this.$Message.error(this.$t('pleaseEnterRequirement'))
                } else {
                  this.handleThresholdBaseInfoSave(this.handleThresholdSave)
                }
              }
            })
          } else if (this.currents === 1) {
            if (this.macLineData.length === 0) {
              this.$Message.error(this.$t('pleaseSelectDeviceLine'))
            } else {
              this.handleThresholdSave()
              this.$emit('threShow', 'threIndex')
              setTimeout(() => {
                this.threSholdList()
              }, 1000)
            }
          } else if (this.currents === 2) {
            this.fromType = 1
            let data = this.$store.state.setSecondPwds
            if (data) {
              this.openSaveSeconedPwd = true
              this.saveSconedPws = ''
            } else {
              if (this.lineType === 2) {
                this.listValiAction()
                this.listValiAction2()
                if (this.valiAction || this.valiAction2) {
                  this.$Message.error({ content: this.$t('pleaseSelectWarningOrAlarmType') })
                } else {
                  await this.handleGetTypeSave()
                  this.handleThresholdSave()
                  this.$emit('threShow', 'threIndex')
                  setTimeout(() => {
                    this.threSholdList()
                  }, 1000)
                }
              } else {
                const validateResult = this.listValidate(this.thresholdTypeList)
                const validateRequire = this.listRequireValidate(this.thresholdTypeList)

                if (validateResult.length) {
                  return this.$Message.error(this.$t('pleaseEnterPositiveInteger'))
                }
                if (validateRequire.length) {
                  const { limitType } = validateRequire[0]
                  return this.$Message.error(`${limitType === 1 ? this.$t('pleaseEnterVoltageUpAlarmValue') : limitType === 2 ? this.$t('pleaseEnterVoltageLowAlarmValue') : '-'}`)
                }
                await this.handleGetTypeSave()
                this.handleThresholdSave()
                this.$emit('threShow', 'threIndex')
                setTimeout(() => {
                  this.threSholdList()
                }, 1000)
              }
            }
          }
        } else if (this.formItem.model === '2') {
          if (this.current === 0) {
            this.$refs.formValidate.validate(valid => {
              if (valid) {
                if (this.formItem.name === undefined) {
                  this.$Message.error(this.$t('pleaseEnterRequirement'))
                } else {
                  this.handleThresholdBaseInfoSave(this.handleThresholdSave)
                }
              }
            })
          } else if (this.current === 1) {
            if (this.macLineData.length === 0) {
              this.$Message.error(this.$t('pleaseSelectDeviceLine'))
            } else {
              this.handleThresholdSave()

              setTimeout(() => {
                this.threSholdList()
              }, 1000)
              this.$emit('threShow', 'threIndex')
            }
          } else if (this.current === 2) {
            this.handleThresholdCycleSave()
            if (this.cycleData.loopType === '') {
              this.$Message.error(this.$t('pleaseSelectCyclePeriod'))
            } else if (this.cycleData.loopType === '2' && this.cycleData.value === '') {
              this.$Message.error(this.$t('pleaseSelectCycle'))
            } else if (this.cycleData.loopType === '3' && this.cycleData.value === '') {
              this.$Message.error(this.$t('pleaseSelectStartTimeAndEndTime'))
            } else if (this.cycleData.loopType === '4' && this.cycleData.value === '') {
              this.$Message.error(this.$t('pleaseSelectStartTimeAndEndTime'))
            } else {
              this.handleThresholdSave()
              setTimeout(() => {
                this.threSholdList()
              }, 1000)
              this.$emit('threShow', 'threIndex')
            }
          } else if (this.current === 3) {
            this.fromType = 2
            let data = this.$store.state.setSecondPwds
            if (data) {
              this.openSaveSeconedPwd = true
              this.saveSconedPws = ''
            } else {
              this.dynamicDuplic()
              this.$nextTick(() => {
                this.duplicateType()
                this.duplicateTypeNull()
              })
              if (this.lineType === 1) {
                if (this.duplicateTypeNullData === true) {
                  this.$Message.error(this.$t('pleaseSelectThresholdType'))
                } else if (this.duplicate === true) {
                  this.$Message.error(this.$t('duplicateSelectionType'))
                } else if (this.threformalertValue === true) {
                  this.$Message.error(this.$t('pleaseEnterWarningValueOrAlarmValue'))
                } else if (this.defaultAlarmVal === '' && this.defaultWarningVal === '') {
                  this.$Message.error(this.$t('pleaseEnterWarningValueOrAlarmValue'))
                } else {
                  this.dynamicSave()
                  this.handleThresholdSave()
                  setTimeout(() => {
                    this.threSholdList()
                  }, 1000)
                  this.$emit('threShow', 'threIndex')
                }
              } else {
                if (this.thresholType) {
                  this.$Message.error({ content: this.$t('pleaseSelectAlarmType') })
                } else {
                  this.dynamicSave()
                  this.handleThresholdSave()
                  setTimeout(() => {
                    this.threSholdList()
                  }, 1000)
                  this.$emit('threShow', 'threIndex')
                }
              }
            }
          }
        }
      },
      handleCancle() {
        if (this.configId) {
          let params = { configId: this.configId }
          return thresholdCancel(params).then(res => {
            if (res.success) {
              this.$emit('toback', 'threIndex')
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        }
        this.$emit('toback', 'threIndex')
      },
      handlethresholdGetBaseInfo() {
        let params = { configId: this.configId }
        thresholdGetBaseInfo(params).then(res => {
          this.lineType = res.data.lineType
          if (this.current === 2) {
            this.handleCutoms()
          }
        })
      },
      async next(val) {
        if (this.current === 0 && this.currents === 0) {
          this.$refs.formValidate.validate(valid => {
            if (valid) {
              var flag = new RegExp('[`@#$^&=|{}\\[\\]<>￥]')
              if (this.formItem.name === '' || this.formItem.name === undefined) {
                this.$Message.error(this.$t('pleaseInputName'))
              } else if (flag.test(this.formItem.describe) === true) {
                return this.$Message.error(this.$t('specialSymbolsTip'))
              } else if (this.formItem.describe.length > 50) {
                this.$Message.error(this.$t('descriptionWordsSizeLimit', { size: 50 }))
              } else {
                this.devicesObjData = this.devicesObj
                this.handleThresholdBaseInfoSave()
                setTimeout(() => {
                  this.deviceListData()
                }, 500)
                if (this.formItem.model === '1') {
                  this.currents += 1
                } else {
                  this.current += 1
                }
              }
            }
          })
        } else if (this.current === 1 || this.currents === 1) {
          if (this.macLineData.length === 0) {
            this.$Message.error(this.$t('pleaseSelectDeviceLine'))
          } else {
            if (this.formItem.model === '1') {
              await this.handleConfigurethreShold()
              this.handlethresholdGetBaseInfo()
              this.currents += 1
            } else {
              this.current += 1
            }
          }
        } else if (this.currents === 2) {
          this.openPwdsModal(val, 2)
        } else if (this.current === 2) {
          this.handleThresholdCycleSave()
          this.handlethresholdGetBaseInfo()
          if (this.cycleData.loopType === '') {
            this.$Message.error(this.$t('pleaseSelectCyclePeriod'))
          } else if (this.cycleData.loopType === '2' && this.cycleData.value === '') {
            this.$Message.error(this.$t('pleaseSelectCycle'))
          } else if ((this.cycleData.loopType === '3' || this.cycleData.loopType === '4') && this.cycleData.value === '') {
            this.$Message.error(this.$t('pleaseSelectStartTimeAndEndTime'))
          } else {
            this.current += 1
          }
        } else if (this.current === 3) {
          this.openPwdsModal(val, 3)
        }
      },
      openPwdsModal(row, type) {
        this.newPwdsSeconed = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
          this.formMadolDatas = row
          this.formTypes = type
        } else {
          if (type === 2) {
            if (this.lineType === 2) {
              this.listValiAction()
              this.listValiAction2()
              if (this.valiAction || this.valiAction2) {
                this.$Message.error({ content: this.$t('pleaseSelectWarningOrAlarmType') })
              } else {
                this.handleGetTypeSave()
                this.handleThresholdSave()
                this.currents += 1
              }
            } else {
              const validateResult = this.listValidate(this.thresholdTypeList)
              const validateRequire = this.listRequireValidate(this.thresholdTypeList)
              if (validateResult.length) {
                return this.$Message.error(this.$t('pleaseEnterPositiveInteger'))
              }
              if (validateRequire.length) {
                const { limitType } = validateRequire[0]
                return this.$Message.error(`${limitType === 1 ? this.$t('pleaseEnterVoltageUpAlarmValue') : limitType === 2 ? this.$t('pleaseEnterVoltageLowAlarmValue') : '-'}`)
              }
              this.handleGetTypeSave()
              this.handleThresholdSave()
              this.currents += 1
            }
          } else if (type === 3) {
            this.dynamicDuplic()
            this.$nextTick(() => {
              this.duplicateType()
              this.duplicateTypeNull()
            })
            if (this.lineType === 1) {
              if (this.duplicateTypeNullData === true) {
                this.$Message.error(this.$t('pleaseSelectThresholdType'))
              } else if (this.duplicate === true) {
                this.$Message.error(this.$t('duplicateSelectionType'))
              } else if (this.threformalertValue === true) {
                this.$Message.error(this.$t('pleaseEnterWarningValueOrAlarmValue'))
              } else if (this.defaultAlarmVal === '' && this.defaultWarningVal === '') {
                this.$Message.error(this.$t('pleaseEnterWarningValueOrAlarmValue'))
              } else {
                this.dynamicSave()
                this.handleThresholdSave()
                this.current += 1
              }
            } else {
              if (this.thresholType) {
                this.$Message.error({ content: this.$t('pleaseSelectAlarmType') })
              } else {
                this.dynamicSave()
                this.handleThresholdSave()
                this.current += 1
              }
            }
          }
        }
      },
      closePwdModal() {
        this.openSeconedPwd = false
      },
      getnewPwdsVal(val) {
        this.newPwdsSeconed = val
      },
      checkSecondePwds() {
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
                this.openSeconedPwd = false
                if (this.formTypes === 2) {
                  if (this.lineType === 2) {
                    this.listValiAction()
                    this.listValiAction2()
                    if (this.valiAction || this.valiAction2) {
                      this.$Message.error({ content: this.$t('pleaseSelectWarningOrAlarmType') })
                    } else {
                      this.handleGetTypeSave()
                      this.handleThresholdSave()
                      this.currents += 1
                    }
                  } else {
                    const validateResult = this.listValidate(this.thresholdTypeList)
                    const validateRequire = this.listRequireValidate(this.thresholdTypeList)
                    if (validateResult.length) {
                      return this.$Message.error(this.$t('pleaseEnterPositiveInteger'))
                    }
                    if (validateRequire.length) {
                      const { limitType } = validateRequire[0]
                      return this.$Message.error(`${limitType === 1 ? this.$t('pleaseEnterVoltageUpAlarmValue') : limitType === 2 ? this.$t('pleaseEnterVoltageLowAlarmValue') : '-'}}`)
                    }
                    this.handleGetTypeSave()
                    this.handleThresholdSave()
                    this.currents += 1
                  }
                } else if (this.formTypes === 3) {
                  this.dynamicDuplic()

                  this.$nextTick(() => {
                    this.duplicateType()
                    this.duplicateTypeNull()
                  })
                  if (this.lineType === 1) {
                    if (this.duplicateTypeNullData === true) {
                      this.$Message.error(this.$t('pleaseSelectThresholdType'))
                    } else if (this.duplicate === true) {
                      this.$Message.error(this.$t('duplicateSelectionType'))
                    } else if (this.threformalertValue === true) {
                      this.$Message.error(this.$t('pleaseEnterWarningValueOrAlarmValue'))
                    } else if (this.defaultAlarmVal === '' && this.defaultWarningVal === '') {
                      this.$Message.error(this.$t('pleaseEnterWarningValueOrAlarmValue'))
                    } else {
                      this.dynamicSave()
                      this.handleThresholdSave()
                      this.current += 1
                    }
                  } else {
                    if (this.thresholType) {
                      this.$Message.error({ content: this.$t('pleaseSelectAlarmType') })
                    } else {
                      this.dynamicSave()
                      this.handleThresholdSave()
                      this.current += 1
                    }
                  }
                }
              }
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        })
      },
      previous(val) {
        if (this.current === 0 || this.currents === 0) {
          this.macLineLength = ''
        }
        if (val === '2') {
          this.current -= 1
        } else {
          this.currents -= 1
        }
      },
      untilFuntionTime() {
        for (var i = 1; i <= 30; i++) {
          this.dateLists.push({ value: `${i}`, label: `${i}` })
        }
        for (var o = 1; o <= 31; o++) {
          this.ordinalWeekDay.push({ value: `${o}`, label: `${o}` })
        }
        for (var j = 1; j <= 54; j++) {
          this.ordinalYearWeek.push({ value: `${j}`, label: `${j}` })
        }
        for (var k = 1; k <= 366; k++) {
          this.ordinalYearDay.push({ value: `${k}`, label: `${k}` })
        }
        for (var l = 1; l <= 384; l++) {
          this.calendarYearDay.push({ value: `${l}`, label: `${l}` })
        }
      },
      dynamicSave() {
        this.$refs.dynamicSaverefs.thresholdSave()
      },
      dynamicDuplic() {
        this.$refs.dynamicSaverefs.typeduplice()
      },
      backThreShold() {
        this.threSholdList()
        this.$emit('toback', 'threIndex')
      },
      backAainadd() {
        this.current = 0
        this.currents = 0
        this.formItem = { name: '', describe: '', model: '1', state: '' }
        this.macLineData = []
        this.cycle = ''
        this.loopValue = ''
        this.startTime = ''
        this.endTime = ''
        this.rule = ''
        this.ordinal = ''
        this.ordinalWeek = ''
      },
      toback() {
        this.$Modal.confirm({
          title: this.$t('savedAfterCancellation'),
          content: this.$t('wantCancel') + '?',
          onOk: () => {},
          onCancel: () => {
            this.handleCancle()
            this.devicesObj = ''
            this.devicesObjData = ''
            this.$emit('devicesValue', this.devicesObj)
            this.$Message.info(this.$t('editCanceled'))
          },
          okText: this.$t('wrong'),
          cancelText: this.$t('cancel'),
        })
      },
      changePage(e) {
        this.currentPage = e
        this.handleThresholdDeviceList(this.rowData.edit === true ? this.formItem.id : this.configId)
      },
      changesize(e) {
        this.pageSize = e
        this.handleThresholdDeviceList(this.rowData.edit === true ? this.formItem.id : this.configId)
      },
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      reset() {
        this.addDeviceItem = { type: '', name: '', typeName: '', position: '' }
        this.onlinStatus = ''
      },
      async getGroupTypes() {
        let params = { projectCode: this.$store.state.projectCode }
        const res = await getGroupType(params)
        if (res.success) {
          this.packetList = res && res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      getGroupTrees() {
        getGroupTree({ groupId: this.packetTypes })
          .then(res => {
            if (res.code === '0') {
              this.packNewlist = res.data
              let resData = this.getTree(res.data)
              this.packetFilterList = this.cloneTree(resData)
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({ content: this.$t('unknown') })
            }
          })
      },
      cloneTree(score, parentId = 0) {
        let tree = []
        score.map(item => {
          if (item.parentId === parentId) {
            // 递归寻找
            item.children = this.cloneTree(score, item.id)
            tree.push(item)
          }
        })

        return tree
      },
      // 递归遍历数组为树状结构
      getTree(tree = []) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.value = item.id
            obj.parentId = item.parentId
            obj.title = item.name
            obj.expand = true
            obj.selected = false
            obj.checked = false
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },
      getListid(val) {
        val.map(itm => {
          this.packNewlist.map(item => {
            if (JSON.stringify(item).toLowerCase().indexOf(itm) > -1) {
              this.newArr.push(item.id)
            }
            return this.newArr
          })
        })
        this.addDeviceItem.typeName = this.unique(this.newArr)
      },
    },
    computed: {
      allLineChecked() {
        return this.curLines && this.curSelectedLines ? this.curSelectedLines.length === this.curLines.length : false
      },
    },
    watch: {
      curLines: {
        handler(newVal) {
          this.curLines = newVal
        },
      },
      '$store.state.mondaySelect': {
        handler(newVal, oldVal) {
          if (newVal === true) {
            this.weekList = [
              { value: '1', label: this.$t('monday') },
              { value: '2', label: this.$t('tuesday') },
              { value: '3', label: this.$t('wednesday') },
              { value: '4', label: this.$t('thursday') },
              { value: '5', label: this.$t('friday') },
              { value: '6', label: this.$t('saturday') },
              { value: '7', label: this.$t('sunday') },
            ]
          } else {
            this.weekList = [
              { value: '7', label: this.$t('sunday') },
              { value: '1', label: this.$t('monday') },
              { value: '2', label: this.$t('tuesday') },
              { value: '3', label: this.$t('wednesday') },
              { value: '4', label: this.$t('thursday') },
              { value: '5', label: this.$t('friday') },
              { value: '6', label: this.$t('saturday') },
            ]
          }
        },
      },
    },
  }
</script>
<style lang="less">
  .cannotTc {
    margin-top: 10px;
    padding: 5px;
    background: rgba(153, 153, 153, 0.05);
    border: 1px solid #999999;
    color: #999999;
  }
  .el-input__suffix {
    line-height: 30px;
    font-size: 12px;
  }
  .el-input--suffix .el-input__inner {
    padding: 0 10px;
  }
  .el-checkbox__inner {
    background-color: transparent;
    border: 1px solid #3d3d41;
  }
  .el-input__inner {
    background-color: #1a202e;
    border-color: #3d3d41;
    height: 30px !important;
    line-height: 30px;
  }
  .el-input__inner:hover {
    border-color: #5a5a5e;
  }
  .el-cascader__dropdown {
    background: #1a202e;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
    border: transparent;
    line-height: 30px;
  }
  .el-input {
    input::placeholder {
      font-weight: 400;
      color: #fff;
    }
  }
  .el-input.is-focus .el-input__inner {
    border-color: #57a3f3;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  }
  .el-cascader-menu {
    border-right: solid 1px #3d3d41;
  }
  .el-cascader-node.in-active-path {
    color: #2d8cf0;
  }
  .el-cascader:not(.is-disabled):hover .el-input__inner {
    border-color: #5a5a5e;
  }
  .popper__arrow,
  .popper__arrow::after {
    border-bottom-color: transparent !important;
  }
  .el-cascader-node:not(.is-disabled):focus,
  .el-cascader-node:not(.is-disabled):hover {
    background: #2c2c2e !important;
  }
  .el-cascader-menu {
    color: #fff !important;
  }
  .el-cascader__tags .el-tag {
    color: #fff;
    background: transparent;
    border-color: #3d3d41 !important;
    border-radius: 0px;
  }
  .el-tag .el-icon-close {
    line-height: 20px;
    background-color: transparent !important;
  }
  .el-cascader-menu {
    min-width: 128px;
  }
  .addDevice {
    .ivu-checkbox-disabled .ivu-checkbox-inner {
      border-color: #999;
      background-color: #999;
    }
    .checkboxlist {
      display: block;
      margin: 0 0 20px 0;
    }
    .ivu-form-item {
      margin-bottom: 0px !important;
    }
    .w200 {
      width: 200px;
    }
    .w180 {
      width: 180px;
    }
    .w400 {
      width: 400px;
    }
    .ivu-checkbox-group-item {
      display: block;
      margin: 10px 0px 20px 0px;
    }
    .border {
      border: 1px solid #353948;
    }
    .borderLeft {
      border-left: 0;
      border-top: 1px solid #353948;
      border-bottom: 1px solid #353948;
      border-right: 1px solid #353948;
    }
  }
  .cycleTime {
    .tips {
      font-size: 12px;
      color: #e03c3a;
    }
    .ordinalSelection {
      width: 400px;
      margin-top: 20px;
    }
    .ivu-select-dropdown {
      min-width: 130px !important;
    }
    .ivu-tree-arrow {
      width: 0px;
    }
    .timeSelect {
      position: relative;
      .selectDropdown {
        margin-top: 10px;
        .ivu-select-dropdown {
          display: none;
        }
        .ivu-tag {
          z-index: 99;
        }
      }
      .datePicker {
        position: absolute;
        top: 30px;
        .ivu-input,
        .ivu-input-suffix {
          opacity: 0;
        }
        .ivu-date-picker-header,
        .ivu-picker-confirm {
          display: none;
        }
      }
    }
    .timeSelect2 {
      position: relative;
      .selectDropdown {
        margin-top: 10px;
        .ivu-select-dropdown {
          display: none;
        }
        .ivu-tag {
          z-index: 99;
        }
      }
      .datePicker {
        position: absolute;
        top: 30px;
        .ivu-input,
        .ivu-input-suffix {
          opacity: 0;
        }
        .ivu-picker-confirm {
          display: none;
        }
      }
    }
  }
  .threAdd {
    .ivu-steps .ivu-steps-main {
      margin-top: 2.5px;
      display: inline;
      white-space: nowrap;
    }
    .step {
      background: #1a202e;
      display: flex;
      justify-content: space-between;
      padding: 20px;
    }
    .threAddContent {
      background: #1a202e;
      margin-top: 10px;
      padding: 20px;
      .head {
        font-size: 20px;
      }
      .threAddContent-tableHead {
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 10px;
      }
      .threAddContent-tableContent {
        .ivu-tag {
          height: 32px;
          line-height: 32px;
        }
      }
    }
    .no-complete {
      .ivu-steps-title {
        color: #999 !important;
      }
    }

    .complete {
      margin: 250px auto;
      .wm320 {
        margin: 30px auto;
        //   width: 320px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .iconSize {
        font-size: 68px;
        color: #0dd667;
      }
    }
    .comflict {
      .head {
        display: flex;
        align-items: center;
        font-size: 14px;
        padding: 10px;
        color: #e03c3a;
        background: rgba(224, 60, 58, 0.05);
        border: 1px solid #e03c3a;
        margin-bottom: 20px;
      }
    }
    .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner {
      background: transparent;
    }
    .ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner {
      background: transparent;
    }
    .ivu-steps .ivu-steps-title {
      font-size: 16px;
      margin-bottom: 0;
      color: #017bfe;
    }
    .ivu-steps .ivu-steps-head-inner {
      display: block;
      width: 32px;
      height: 32px;
      line-height: 32px;
    }
    .ivu-steps-item {
      display: flex;
      align-items: center;
      &:first-child {
        min-width: 220px;
      }
      &:nth-child(2) {
        min-width: 250px;
      }
      &:nth-child(3) {
        min-width: 250px;
      }
      &:nth-child(4) {
        min-width: 300px;
      }
    }
    .ivu-steps .ivu-steps-tail {
      top: 16px;
    }
    .ivu-date-picker-prev-btn-arrow-double,
    .ivu-date-picker-next-btn-arrow-double,
    .ivu-date-picker-header-label:first-child {
      display: none;
    }
  }
</style>
