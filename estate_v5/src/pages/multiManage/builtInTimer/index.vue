<template>
  <div id="BuiltInTiming">
    <div v-if="builtIndexFlag">
      <Row class="BuiltInTiming-head">
        <Form :inline="true" :model="formInline" ref="formInline" class="form-wrap" @submit.native.prevent>
          <FormItem>
            <Select style="width: 200px" @on-change="handleActionTypes" v-model="formInline.status" :clearable="true" class="w-100" :placeholder="$t('action')">
              <Option v-for="item in actionTypes" :key="item.value" :label="item.label" :value="item.value"></Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select style="width: 200px" @on-change="handleActionTypes" v-model="formInline.execute" :clearable="true" class="w-100" :placeholder="$t('executionMode')">
              <Option v-for="item in executeTypes" :key="item.value" :label="item.label" :value="item.value"></Option>
            </Select>
          </FormItem>
          <FormItem>
            <Input v-model="formInline.mac" :placeholder="$t('enterDeviceNo')" style="width: 200px"></Input>
          </FormItem>
          <FormItem>
            <Select style="width: 200px" v-model="formInline.modelStatus" :clearable="true" class="w-100" :placeholder="$t('timedState')">
              <Option v-for="item in modelStatusList" :key="item.value" :label="item.label" :value="item.value"></Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button class="b-blue" @click="onSubmit('formInline')">{{ $t('query') }}</Button>
          </FormItem>
          <FormItem>
            <Button @click="empty">{{ $t('reset') }}</Button>
          </FormItem>
          <FormItem>
            <Dropdown trigger="click" @on-click="handleDevicePull" transfer>
              <Button class="export">
                <Icon custom="icon-v5 icon-v5-tiqumingxi" />
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="all">{{ $t('extractFromDevice') }}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </FormItem>
        </Form>
      </Row>
      <div class="table">
        <Col :span="24" class="tableHeader">
          <h3>{{ $t('builtIntimingList') }}</h3>
          <div>
            <Button type="text" class="pointer b-primary" @click="viewAllInstruction">
              <i class="el-icon-plus"></i>
              {{ $t('viewAllinstructionhistory') }}
            </Button>
            <Button type="text" class="pointer b-primary" @click="newAddBuiltln">
              <i class="el-icon-plus"></i>
              {{ $t('addTimer') }}
            </Button>
            <Button type="text" class="pointer b-dger" @click="openPwdsModal(false)" v-if="curSelect.length">
              <i class="el-icon-close"></i>
              {{ $t('batchDelete') }}
            </Button>
            <Button type="text" class="b-olg" v-if="curSelect.length" @click="openBatchModal">
              <i class="el-icon-edit-outline"></i>
              {{ $t('batchEdit') }}
            </Button>
          </div>
        </Col>
        <Col :span="24">
          <Pro808Table @updateCurSelect="updateCurSelect" :selectedAllApi="selectedAllApi" :source="source" :selectedAllParams="{ filterFields: 'configId,lineType' }" :searchBarValues="searchBarValues" :columns="columnses" autoInit idField="configId" ref="selection" style="width: 100%">
            <template slot-scope="{ row }" slot="namees">
              {{ row.name || '-' }}
            </template>
            <template slot-scope="{ row }" slot="configes">
              <div>{{ row.totalMac === 0 ? '' : `${$t('manyDevice', { totalMac: row.totalMac })}` }} {{ row.totalMac === 0 ? '' : `${$t('manyLine', { totalAddr: row.totalAddr })}` }}</div>
            </template>
            <template slot-scope="{ row }" slot="weekdayType">
              <div>{{ row.weekday ? $t('cycleTiming') : $t('singleTiming') }}</div>
            </template>
            <template slot-scope="{ row }" slot="weekdays">
              <div v-if="row.weekday && row.weekday.split('').length === 7">{{ $t('everyDay') }}</div>
              <div v-else>
                <div v-if="row.weekday">
                  <span v-for="(item, index) in row.weekday.split('')" :key="item">{{ $t('week') + item + (index === row.weekday.split('').length - 1 ? '' : '、') }}</span>
                </div>
                <div v-if="!row.weekday">{{ '-' }}</div>
              </div>
            </template>
            <template slot-scope="{ row }" slot="associateAction">
              {{ row.actionName }}
            </template>
            <template slot-scope="{ row }" slot="statuses">
              <Switch v-model="row.status" :true-value="1" :false-value="0" @on-change="chagneCurStatus($event, row.configId)" />
            </template>
            <template slot-scope="{ row }" slot="operating">
              <Button class="text-btn-primary" type="text" @click="queryDetailsBuiltn(row)">{{ $t('view') }}</Button>
              <Button class="text-btn-primary" type="text" @click="editBuiltInDevice(row)">{{ $t('edit') }}</Button>
              <Button class="c-danger" @click="openPwdsModal(row)" type="text">{{ $t('delete') }}</Button>
              <Dropdown :transfer="true">
                <Button class="text-btn-primary" type="text">
                  <a href="javascript:void(0)" class="btn">
                    {{ $t('more') }}
                    <Icon type="ios-arrow-down"></Icon>
                  </a>
                </Button>

                <DropdownMenu slot="list" transfer="true">
                  <DropdownItem>
                    <Button class="c-default" @click="handleExecute(row.configId)" type="text">{{ $t('exe') }}</Button>
                  </DropdownItem>
                  <DropdownItem>
                    <Button class="c-default" @click="handleInstructions(row)" type="text">{{ $t('commandHistory') }}</Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </template>
          </Pro808Table>
        </Col>
      </div>
    </div>
    <div v-if="builtInDetailsFlag">
      <div @click="backBuiltIndex" class="pointer" style="padding: 10px">
        <Icon type="ios-arrow-back" />
        {{ $t('back') }}
      </div>
      <div style="position: relative">
        <div style="height: 60px; width: 100%; background: #1a202e; position: absolute"></div>
      </div>
      <Tabs v-model="tabName" style="margin-top: 15px" :animated="false" @on-click="getTabChange">
        <TabPane :label="$t('builtIntimerDetails')" name="name1">
          <div style="margin-top: 15px; background: #1a202e; padding: 20px">
            <Row type="flex" justify="space-between">
              <Col>
                <h4 class="es-info">
                  {{ $t('builtInBasicInformation') }}
                </h4>
              </Col>
              <Col>
                <Button type="primary" style="margin-right: 10px" @click="editBuiltInDevice(editRow)">{{ $t('edit') }}</Button>
                <Button type="error" ghost style="margin-right: 10px" @click="openPwdsModal(editRow, 'edit')">{{ $t('delete') }}</Button>
                <Button type="primary" ghost @click="handleExecute(editRow.configId)">{{ $t('exe') }}</Button>
              </Col>
            </Row>
            <Row style="margin-top: 20px" :gutter="10">
              <Col :span="3">
                <div class="end-flexs">{{ $t('timerName') }}：</div>
              </Col>
              <Col :span="8">{{ editRow.name }}</Col>
            </Row>
            <Row style="margin-top: 20px" :gutter="10">
              <Col :span="3">
                <div class="end-flexs">{{ $t('executionMode') }}：</div>
              </Col>
              <Col :span="8">{{ editRow.modelName }}</Col>
            </Row>
            <Row style="margin-top: 20px" :gutter="10">
              <Col :span="3">
                <div class="end-flexs">{{ $t('timingType') }}：</div>
              </Col>
              <Col :span="8">{{ editRow.weekday ? $t('cycleTiming') : $t('singleTiming') }}</Col>
            </Row>
            <Row style="margin-top: 20px" :gutter="10">
              <Col :span="3">
                <div class="end-flexs">{{ $t('time') }}：</div>
              </Col>
              <Col :span="8">
                <span v-if="editRow.weekday">
                  <div v-if="editRow.weekday.length === 7">{{ $t('everyDay') }} &nbsp;{{ editRow.time }}</div>
                  <span v-else>
                    <span v-for="(item, index) in editRow.weekday.split('')" :key="item">{{ $t('week') + item + (index === editRow.weekday.split('').length - 1 ? '' : '、') }}</span>
                    &nbsp;&nbsp; {{ editRow.time }}
                  </span>
                </span>
                <span v-else>&nbsp;{{ editRow.time }}</span>
              </Col>
            </Row>
            <Row style="margin-top: 20px" :gutter="10">
              <Col :span="3">
                <div class="end-flexs">{{ $t('action') }}：</div>
              </Col>
              <Col v-if="editRow.actionName.includes($t('closeing'))">
                <div>{{ $t('openAndLock') }}</div>
                <div>{{ $t('unlockClose') }}：{{ `${'&nbsp;' + '&nbsp;'}` + editRow.associateTime }}</div>
              </Col>
              <Col v-if="!editRow.actionName.includes($t('closeing'))" :span="8">{{ editRow.actionName }}</Col>
            </Row>
            <Row style="margin-top: 20px" :gutter="10">
              <Col :span="3">
                <div class="end-flexs">{{ $t('timedState') }}：</div>
              </Col>
              <Col :span="8">{{ editRow.statusName }}</Col>
            </Row>
          </div>
          <div style="margin-top: 10px; padding: 20px; background: #1a202e">
            <h4 class="execu-list-title">
              {{ $t('executionObjectList') }}
            </h4>
            <Table :columns="execuCloumn" :data="execuTableList">
              <template slot-scope="{ row }" slot="line">
                <div>
                  <span v-for="(item, index) in row.addrs" :key="index">
                    <Tag>{{ item.title }}</Tag>
                  </span>
                </div>
              </template>
              <template slot-scope="{ row }" slot="port">
                <div>
                  <span v-for="(item, index) in row.addrs" :key="index">
                    <span v-for="itm in item.digitalOuts" :key="itm.index">
                      <Tag>{{ itm.name }}</Tag>
                    </span>
                  </span>
                </div>
              </template>
            </Table>
            <Page @on-change="handlePageNo" show-elevator show-total :current="excuePageNo" :total="excueTotal"></Page>
          </div>
        </TabPane>
        <TabPane :label="$t('commandHistory')" name="name2">
          <div>
            <command-feedback :classFlag="true" :instructionsData="instructionsData" :operateAt="6" :allInstructions="allInstructions"></command-feedback>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <div v-if="builtInEditsFlag">
      <Row class="head-Conts" type="flex" justify="space-between">
        <Col :span="15">
          <!-- 自动 -->
          <Steps :current="currentEditBuinIns" class="step-control">
            <Step :title="$t('selectDevice')"></Step>
            <Step :title="$t('timingSetting')" :class="{ 'no-complete': currentEditBuinIns < 1 }"></Step>
            <Step :title="$t('complete')"></Step>
          </Steps>
        </Col>
        <Col :span="3" offset="4" v-if="currentEditBuinIns < 2">
          <div style="text-align: right">
            <Button type="primary" style="margin-right: 10px" @click="handleSceneSave">{{ $t('save') }}</Button>
            <Button type="default" @click="toBack">{{ $t('cancel') }}</Button>
          </div>
        </Col>
      </Row>
      <div v-show="stepOnes">
        <div class="TC-deviceboxs">
          {{ $t('t3808Tip2') }}
        </div>
        <div style="margin-top: 10px; background: #1a202e">
          <div class="cons-titles">
            <div>{{ $t('equipmentline') }}</div>
            <div>
              <Button type="primary" @click="openDeviceLineFlag">{{ $t('deviceCircuit') }}</Button>
            </div>
          </div>
          <div>
            <Table :columns="deveiceColumns" :data="deviceTableList" style="height: 100%">
              <template slot-scope="{ row }" slot="lines">
                <div>
                  <div v-for="(item, indx) in row.addrs" :key="indx" style="width: 80px; text-align: center" :class="row.addrs[0].digitalOuts.length > 0 && row.addrs.length > 1 ? 'pd-bottom' : ''">
                    <Tag closable @on-close="getCloseLine(item.addr, row.id)">
                      <span>{{ item.title }}</span>
                    </Tag>
                    <!--   -->
                  </div>
                </div>
              </template>
              <template slot-scope="{ row }" slot="Inetmouth">
                <div v-if="row.addrs[0].digitalOuts">
                  <div v-for="(item, indexs) in row.addrs" :key="indexs" style="display: flex; flex-wrap: wrap" :class="row.addrs.length > 1 ? 'pd-bottom' : ''">
                    <span v-for="(itm, idx) in item.digitalOuts" :key="Math.random() + idx">
                      <Tag closable @on-close="getClosePort(`${item.addr}_${itm.index}`, row.id)">
                        <span>{{ itm.name }}</span>
                      </Tag>
                    </span>
                    <!-- -->
                  </div>
                </div>
              </template>
              <template slot-scope="{ row }" slot="action">
                <div>
                  <Button type="text" style="color: #0664c6" @click="editSelectLine(row)">{{ $t('edit') }}</Button>
                  <Button type="text" style="color: #f56c6c" @click="getDelDevices(row.id)">{{ $t('delete') }}</Button>
                </div>
              </template>
            </Table>
            <Page @on-change="editChangePageNo" show-elevator show-total :current="editPageNo" :total="editTotal"></Page>
          </div>
        </div>
        <div style="margin: 15px 30px">
          <Button type="primary" @click="nextStep">{{ $t('nextStep') }}</Button>
        </div>
      </div>
      <div v-show="stepTwos">
        <div style="margin-top: 10px; background: #1a202e; padding: 20px">
          <h4 class="es-info">{{ $t('timingSetting') }}</h4>
          <div style="padding-left: 20px">
            <Form :model="formBuiltlns" ref="secensCon" style="width: 40%; margin-top: 20px" :rules="ruleValidate" :label-width="110">
              <FormItem prop="name" :label="$t('timerName') + ':'" style="margin: 15px">
                <Input v-model="formBuiltlns.name" autocomplete="off" style="width: 210px" size="small" :maxlength="79"></Input>
              </FormItem>
              <FormItem :label="`${$t('executionMode')}:`" prop="execute" style="margin: 15px" v-if="!isEdits">
                <RadioGroup v-model="formBuiltlns.execute" style="display: flex">
                  <Radio label="bordEcute">
                    {{ $t('executeAtEdge') }}
                    <TooltipVue style="display: inline-block; margin-left: -5px" :tooltipText="tooltipTextone"></TooltipVue>
                  </Radio>
                  <Radio label="crodexEcute" style="margin-left: 25px">
                    {{ $t('executeInCloud') }}
                    <TooltipVue style="display: inline-block; margin-left: -5px" :tooltipText="tooltipTexttwo"></TooltipVue>
                  </Radio>
                </RadioGroup>
              </FormItem>

              <FormItem :label="`${$t('executionMode')}:`" prop="execute" style="margin: 15px" v-if="isEdits">
                <div style="display: flex">
                  <span>{{ formBuiltlns.execute === 'bordEcute' ? $t('executeAtEdge') : $t('executeInCloud') }}</span>
                  <TooltipVue :tooltipText="formBuiltlns.execute === 'bordEcute' ? tooltipTextone : tooltipTexttwo"></TooltipVue>
                </div>
              </FormItem>
              <FormItem :label="`${$t('timingType')}:`" prop="gender" style="margin: 15px">
                <RadioGroup v-model="formBuiltlns.gender" @on-change="formBuiltlnsGenderChange">
                  <Radio label="single">{{ $t('singleTiming') }}</Radio>
                  <Radio label="finityle" style="margin-left: 25px">{{ $t('cycleTiming') }}</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem :label="$t('executionTime') + '：'" style="margin: 20px 0">
                <DatePicker v-if="formBuiltlns.gender === 'single'" v-model="formBuiltlns.time" style="width: 199px" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" :clearable="false" type="datetime" :placeholder="$t('pleaseSelectDateTime')"></DatePicker>
                <TimePicker v-if="formBuiltlns.gender === 'finityle'" style="width: 199px" v-model="formBuiltlns.time" format="HH:mm:ss" value-format="HH:mm:ss" :editable="false" :clearable="false" :placeholder="$t('anyTime')"></TimePicker>
              </FormItem>
              <FormItem :label="`${$t('recurrencePeriod')}:`" v-if="formBuiltlns.gender === 'finityle'">
                <Select multiple style="width: 240px" v-model="formBuiltlns.selectWeek">
                  <Option v-for="item in weekDay" :key="item.value" :label="item.label" :value="item.value"></Option>
                </Select>
              </FormItem>
              <FormItem :label="`${$t('action')}:`" style="margin: 15px 0">
                <RadioGroup v-if="!isCurrentEdit808" v-model="formBuiltlns.action">
                  <!-- @on-change="getGenderChange"  -->
                  <Radio label="open">{{ $t('opening') }}</Radio>
                  <Radio label="close" style="margin: 0 15px">{{ $t('closing') }}</Radio>
                  <Radio label="openAndLock">{{ $t('openAndLock') }}</Radio>
                  <Radio label="unlockAndOpen" v-if="isUnlockAndOpen">{{ $t('unlockClose') }}</Radio>
                </RadioGroup>
                <RadioGroup v-if="isCurrentEdit808" v-model="formBuiltlns.action">
                  <Radio label="1">ON</Radio>
                  <Radio label="2" style="margin: 0 15px">OFF</Radio>
                  <Radio label="4">{{ $t('inching') }}</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem v-if="formBuiltlns.action === 'openAndLock'" :label="$t('unlockClose') + '：'">
                <div>
                  <Switch :before-change="editBeforeChange" v-model="switchSeting" style="margin-right: 10px" />
                  <template v-if="switchSeting">
                    <DatePicker
                      @on-change="editTimeChange"
                      style="width: 200px"
                      v-if="formBuiltlns.gender === 'single'"
                      v-model="formBuiltlns.beforetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :editable="false"
                      :clearable="false"
                      type="datetime"
                      :placeholder="$t('pleaseSelectDateTime')"></DatePicker>
                    <TimePicker @on-change="editTimeChange" v-if="formBuiltlns.gender === 'finityle'" v-model="formBuiltlns.beforetime" format="HH:mm:ss" value-format="HH:mm:ss" :editable="false" :clearable="false" :placeholder="$t('anyTime')"></TimePicker>
                  </template>
                </div>

                <span v-if="lockEditStatus" style="color: #f24e4c; margin-left: 80px">{{ $t('lockingTime') }}</span>
              </FormItem>
              <FormItem :label="`${$t('timedState')}:`" style="margin-top: 15px">
                <Switch v-model="builnStatusEdit" />
              </FormItem>
            </Form>
          </div>
        </div>
        <div style="padding: 10px">
          <Button type="primary" @click="backToOnes">{{ $t('previous') }}</Button>
          <Button type="primary" style="margin-left: 10px" @click="nextAlright">{{ $t('nextStep') }}</Button>
        </div>
      </div>
      <div v-show="stepThrees">
        <div style="height: 100%; padding: 280px 40%; background: #1a202e">
          <div class="wm320" style="color: #0dd667; font-size: 68px"><Icon type="md-checkmark-circle" /></div>
          <div class="wm320" style="padding: 10px 15%">{{ formBuiltlns.name }}{{ $t('builtlnCompleted') }}</div>
          <div class="wm320" style="padding: 10px 8%">
            <Button type="primary" @click="backGoToOnes">{{ $t('goOnAdd') }}</Button>
            <Button @click="backList" style="margin-left: 10px" type="primary">{{ $t('backList') }}</Button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="viewAllHistoryFlag">
      <div @click="backBuiltIndex" class="pointer" style="padding: 10px">
        <Icon type="ios-arrow-back" />
        {{ $t('back') }}
      </div>
      <command-feedback :classFlag="true" :instructionsData="instructionsData" :operateAt="6" :allInstructions="allInstructions"></command-feedback>
    </div>

    <Modal :title="$t('tip')" v-model="delVisible" width="420px" top="45vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <Row>
        <Col :span="24" class="ml-20">
          <div class="el-message-box__status el-icon-warning"></div>
        </Col>
        <Col :span="24" style="margin-left: 50px">
          <div class="el-message-box__message">
            {{ $t('confirmDeleteTimer') }}
          </div>
        </Col>
      </Row>
      <div slot="footer" class="dialog-footer">
        <Col :span="12" class="tl mt-10">
          <Checkbox v-model="deletePlat">{{ this.$t('forceDeletePlatformRecord') }}</Checkbox>
        </Col>
        <Col :span="12" class="fr">
          <Button @click="handleCancel">{{ $t('cancel') }}</Button>
          <Button class="b-blue" @click="handleOk">{{ $t('confirm') }}</Button>
        </Col>
      </div>
    </Modal>
    <Modal :title="$t('remind')" v-model="toolTipsFlag">
      <div class="tool-Tips">
        <Icon type="md-text" class="mesg-tip" style="margin-top: 5px" />
        <span>{{ noSupportList.length > 0 ? $t('configurationTip') : $t('wonSupportMessage') }}</span>
      </div>
      <div>
        <div v-if="noSupportList.length > 0" style="color: #888991">{{ `${$t('notEnabledOrNotSupportedForEnablingConfiguration')}:` }}</div>
        <span v-else style="color: #888991">{{ $t('notOpen') }}：</span>
        <span>
          <Checkbox :style="{ 'margin-left': noSupportList.length > 0 ? '55px' : '' }" v-model="singleAll" :indeterminate="indeterminate" @on-change="getAddrAll">{{ $t('selectAll') }}</Checkbox>
        </span>
      </div>
      <div v-if="noOpenList.length > 0" style="margin-left: 55px; margin-top: 10px">
        <div v-for="(item, index) in noOpenList" :key="index">
          <Checkbox
            v-model="item.macChecked"
            :indeterminate="Array.isArray(item.addrTitleList) && item.addrTitleList.length && item.addrTitleList.filter(v => v.checked).length > 0 && item.addrTitleList.filter(v => v.checked).length !== item.addrTitleList.length"
            @on-change="getAlladdrs($event, item)">
            {{ item.name + '(' + item.mac + ')：' }}
          </Checkbox>
          <span v-for="(itm, idx) in item.addrTitleList" :key="idx">
            <Checkbox v-model="itm.checked" @on-change="getChangeAddrs($event, item.addrTitleList, item.mac)">{{ itm.title }}</Checkbox>
          </span>
        </div>
      </div>
      <div v-if="noSupportList.length > 0" style="display: flex; margin-top: 20px">
        <span style="color: #888991">{{ $t('wonSupport') }}:</span>
        <div v-for="(item, index) in noSupportList" :key="index">
          <div style="display: flex">
            <div>{{ item.name + '(' + item.mac + ')：' }}</div>
            <div v-for="(itm, idx) in item.addrTitleList" :key="idx" style="display: flex">
              <div style="width: 6px; height: 6px; background-color: #007eff; color: #007eff; border-radius: 50%; margin-top: 7px; margin-right: 6px; margin-left: 6px"></div>
              <span>{{ itm.title }}</span>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" style="padding: 10px">
        <Button type="primary" @click="openLocked">{{ $t('open') }}</Button>
        <Button
          type="default"
          @click="
            toolTipsFlag = false
            closeCheck = true
          ">
          {{ $t('cancel') }}
        </Button>
      </div>
    </Modal>
    <Modal v-model="threeModal" :title="$t('remind')">
      <div class="tool-Tips">
        <Icon type="md-text" class="mesg-tip" style="margin-top: 5px" />
        <span>{{ $t('wonSupportLine') }}</span>
      </div>
      <div style="display: flex; padding-left: 10px">
        <span style="margin-left:15px ；color:#888991">{{ $t('wonSupport') }}:</span>
        <div v-for="(item, index) in noSupportList" :key="index">
          <div style="display: flex">
            <div>{{ item.name + '(' + item.mac + ')' }}:</div>
            <div v-for="(itm, idx) in item.addrTitleList" :key="idx">
              <div style="display: flex">
                <div style="width: 6px; height: 6px; background-color: #007eff; color: #007eff; border-radius: 50%; margin-top: 7px; margin-right: 6px; margin-left: 6px"></div>
                <span>{{ itm.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer" style="padding: 10px">
        <Button
          type="primary"
          @click="
            threeModal = false
            closeCheck = true
          ">
          {{ $t('cancel') }}
        </Button>
        <Button type="primary" @click="continueNext">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <!-- 新批量编辑弹窗 -->
    <Modal v-model="batchEditModal" :title="$t('batcheditbuiltIntiming')">
      <Form :model="formValidate" :label-width="110">
        <FormItem :label="`${$t('timingType')}:`" prop="gender">
          <RadioGroup v-model="formValidate.gender" @on-change="getGenderChange">
            <Radio label="single">{{ $t('singleTiming') }}</Radio>
            <Radio label="finityle" style="margin-left: 15px">{{ $t('cycleTiming') }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="$t('executionTime') + '：'" style="margin: 20px 0">
          <DatePicker v-if="formValidate.gender === 'single'" v-model="formValidate.time" style="width: 199px" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" :clearable="false" type="datetime" :placeholder="$t('pleaseSelectDateTime')"></DatePicker>
          <TimePicker v-if="formValidate.gender === 'finityle'" style="width: 199px" v-model="formValidate.time" format="HH:mm:ss" value-format="HH:mm:ss" :editable="false" :clearable="false" :placeholder="$t('anyTime')"></TimePicker>
        </FormItem>
        <FormItem :label="`${$t('recurrencePeriod')}:`" v-if="formValidate.gender === 'finityle'">
          <Select multiple style="width: 240px" v-model="formValidate.selectWeek">
            <Option v-for="item in weekDay" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem :label="`${$t('action')}:`" style="margin: 15px 0">
          <RadioGroup v-if="!isCurBatch808" v-model="formValidate.action" @on-change="getGenderChange">
            <Radio label="true">{{ $t('closing') }}</Radio>
            <Radio label="false" style="margin: 0 15px">{{ $t('opening') }}</Radio>
            <Radio label="closeAndLock">{{ $t('openAndLock') }}</Radio>
            <Radio label="unlockAndOpen" v-if="isUnlockAndOpen">{{ $t('unlockClose') }}</Radio>
          </RadioGroup>
          <RadioGroup v-if="isCurBatch808" v-model="formValidate.action" @on-change="getGenderChange">
            <Radio label="1">ON</Radio>
            <Radio label="2" style="margin: 0 15px">OFF</Radio>
            <Radio label="4">{{ $t('inching') }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="formValidate.action === 'closeAndLock'" :label="$t('unlockClose') + '：'">
          <div>
            <Switch :before-change="handleBeforeChange" v-model="switchBefore" style="margin-right: 10px" />
            <template v-if="switchBefore">
              <DatePicker
                @on-change="BeforestartTimeChange"
                style="width: 200px"
                v-if="formValidate.gender === 'single'"
                v-model="formValidate.beforetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :editable="false"
                :clearable="false"
                type="datetime"
                :placeholder="$t('pleaseSelectDateTime')"></DatePicker>

              <TimePicker @on-change="BeforestartTimeChange" v-if="formValidate.gender === 'finityle'" v-model="formValidate.beforetime" format="HH:mm:ss" :editable="false" :clearable="false" :placeholder="$t('anyTime')"></TimePicker>
            </template>
          </div>

          <span v-if="timeStatus" style="color: #f24e4c; margin-left: 80px">{{ $t('lockingTime') }}</span>
        </FormItem>
        <FormItem :label="`${$t('timedState')}:`" style="margin-top: 15px">
          <Switch v-model="builtlnStatus" />
        </FormItem>
      </Form>
      <div slot="footer">
        <div style="margin-bottom: 15px">
          <Button @click="batchEditModal = false">{{ $t('cancel') }}</Button>
          <Button type="primary" style="margin-right: 10px" @click="saveBatchModal">{{ $t('save') }}</Button>
        </div>
      </div>
    </Modal>
    <!-- 添加设备和线路 -->
    <Modal v-model="editcircuitFlag" width="1200" :title="isEdits ? $t('editcircuit') : $t('addCircuit')">
      <!-- 查询 -->
      <Row :gutter="10" style="width: 100%">
        <Form style="width: 100%; display: flex">
          <FormItem class="w180">
            <Input v-model="addDeviceItem.name" :placeholder="$t('EnterDevice')"></Input>
          </FormItem>
          <FormItem :label-width="20">
            <Select v-model="addDeviceItem.type" @on-change="handleTypes" style="width: 150px" :placeholder="$t('selectGroupingType')">
              <Option v-for="item in packetList" :value="item.id" :key="item.id">
                {{ item.type }}
              </Option>
            </Select>
          </FormItem>
          <FormItem :label-width="20">
            <TreeSelect :placeholder="$t('selectGroup')" multiple show-checkbox v-model="addDeviceItem.typeName" transfer :data="packetFilterList" class="w180" />
          </FormItem>
          <FormItem :label-width="20" class="w180">
            <Input v-model="addDeviceItem.position" :placeholder="$t('enterPosition')"></Input>
          </FormItem>
          <FormItem :label-width="20">
            <Select v-model="onlinStatus" :placeholder="$t('plsEmacStatus')" style="width: 132px">
              <Option v-for="item in stateList" :value="item.value" :key="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" class="ml-10" @click="handlePageQueryAddr">{{ $t('query') }}</Button>
            <Button class="ml-10" @click="resetButton">{{ $t('reset') }}</Button>
          </FormItem>
        </Form>
      </Row>
      <Row style="margin-top: 20px">
        <Col :span="isCurrentEdit808 ? 8 : 12" class="border" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41">
          <div style="padding: 10px; background: #283140">
            <Checkbox
              v-if="deviceLIstOne.length"
              :value="deviceLIstOne.filter(v => !!v.checked).length === deviceLIstOne.length"
              :indeterminate="deviceLIstOne.filter(v => !!v.checked).length !== 0 && deviceLIstOne.filter(v => !!v.checked).length !== deviceLIstOne.length"
              @on-change="getAllDeviceValue"
              :disabled="!!isCurrentEdit808">
              {{ $t('selectDevice') }}
            </Checkbox>
            <!--  -->
          </div>
          <div style="padding: 10px; height: 500px; overflow: auto">
            <Checkbox
              class="checkboxlist"
              v-for="item in deviceLIstOne"
              :key="item.mac"
              v-model="item.checked"
              :indeterminate="getDeviceIndeterminate(item.addrs)"
              :disabled="(isCurrentEdit808 !== null && !item.isAllNot808 && item.is808 !== isCurrentEdit808) || (Array.isArray(item.addrs) && item.addrs.length > 0 && !!(item.addrs.filter(its => isCurrentEdit808 !== null && its.is808 === !isCurrentEdit808).length === item.addrs.length))"
              ref="macRef"
              @on-change="checkSelectQuery($event, item)">
              <!--    -->
              <span style="width: calc(100% - 24px); margin-left: 10px" @click.stop.prevent="clickLable(item.mac, isCurrentEdit808 !== null && !item.isAllNot808 && item.is808 !== isCurrentEdit808)">
                <!--   -->
                <span
                  :style="{
                    color: item.mac === curClickedNode ? '#0c70dd' : '#fff',
                  }">
                  {{ item.name }}
                </span>
              </span>
            </Checkbox>
          </div>
        </Col>

        <Col :span="isCurrentEdit808 ? 8 : 12" class="borderLeft" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41; border-right: 1px solid #3d3d41">
          <div style="padding: 10px; background: #283140">
            <Checkbox v-if="curLines.length" :value="curLines.filter(v => !!v.checked).length === curLines.length" @on-change="lineCheckAll" :indeterminate="curLines.filter(v => !!v.checked).length !== 0 && curLines.filter(v => !!v.checked).length !== curLines.length">
              {{ $t('selectLine') }}
            </Checkbox>
            <span v-else>{{ $t('selectLine') }}</span>
          </div>
          <div style="padding: 10px; height: 500px; overflow: auto">
            <div>
              <Input :placeholder="$t('linenameTosearch')" v-model="lineKeyword" />
            </div>
            <Checkbox
              style="padding: 5px; display: block"
              v-for="(item, index) in curLines"
              :key="item.title"
              :value="item.checked"
              :disabled="(isCurrentEdit808 !== null && item.is808 === !isCurrentEdit808) || (item.lineType !== 'IO' && !item.isSupportOc)"
              v-show="item.title.includes(lineKeyword)"
              @on-change="linesChange($event, item, index)"
              ref="lineRef"
              :indeterminate="Array.isArray(item.digitalOuts) && item.digitalOuts.filter(v => v.checked).length !== 0 && item.digitalOuts.filter(v => v.checked).length !== item.digitalOuts.length">
              <span @click.stop.prevent="getSelectedAddrs(item.addr, isCurrentEdit808 !== null && item.is808 === !isCurrentEdit808, item.digitalOuts)">
                <span
                  :style="{
                    color: item.addr === curPortesNodes ? '#0c70dd' : '#fff',
                  }">
                  {{ item.title }}
                </span>
              </span>
            </Checkbox>
          </div>
        </Col>
        <Col :span="8" v-if="isCurrentEdit808" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41; border-right: 1px solid #3d3d41">
          <div v-if="!Array.isArray(linePortSelect) || !linePortSelect.length" style="padding: 10px; background: #283140">{{ $t('plsEport') }}</div>
          <div style="padding: 10px; background: #283140" v-if="Array.isArray(linePortSelect) && linePortSelect.length">
            <Checkbox
              :value="linePortSelect.length && linePortSelect.filter(v => v.checked).length === linePortSelect.length"
              :indeterminate="Array.isArray(linePortSelect) && linePortSelect.filter(v => v.checked).length !== 0 && linePortSelect.filter(v => v.checked).length !== linePortSelect.length"
              @on-change="val => lineCheckAllChange(val, linePortSelect)">
              {{ $t('plsEport') }}
            </Checkbox>
          </div>
          <div v-for="(item, index) in linePortSelect" :key="index" style="padding-left: 10px">
            <Checkbox v-model="item.checked">
              <span>{{ item.name }}</span>
            </Checkbox>
          </div>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" @click="handleThresholdDeviceAdd">{{ $t('save') }}</Button>
        <Button @click="confirmFlag">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <!-- 设备编辑弹窗 -->
    <Modal :title="$t('editMacLine')" v-model="editDeviecAndLine" :width="isCurrentEdit808 ? '70%' : '40%'">
      <Row>
        <Col :span="8" class="border" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41; border-right: 1px solid #3d3d41">
          <div style="padding: 10px; background: #283140">
            {{ $t('selectDevice') }}
          </div>
          <div style="padding: 10px; height: 500px; overflow: auto">
            <span>{{ editMac.name + '(' + editMac.mac + ')' }}</span>
          </div>
        </Col>
        <Col :span="isCurrentEdit808 ? 8 : 16" class="borderLeft" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41; border-right: 1px solid #3d3d41">
          <div style="padding: 10px; background: #283140">
            <Checkbox v-if="allLineWithDig.length" v-model="getAllLine" @on-change="lineselectAll">
              {{ $t('selectLine') }}
            </Checkbox>
            <span v-else>{{ $t('selectLine') }}</span>
          </div>
          <div style="padding: 10px; height: 500px; overflow: auto">
            <div>
              <Input :placeholder="$t('linenameTosearch')" v-model="lineKeys" />
            </div>
            <Checkbox
              style="padding: 5px; display: block"
              v-for="item in allLineWithDig"
              :key="item.title"
              v-model="item.ischeckes"
              :indeterminate="item.minates"
              :disabled="item.islineDisable || (item.lineType !== 'IO' && !item.isSupportOc)"
              v-show="item.title.includes(lineKeys)"
              ref="lineRef"
              @on-change="changeLines($event, item)">
              <span @click.stop.prevent="changgeColor(item.addr, item.digitalOuts)">
                <span :style="{ color: item.addr === curNodes ? '#0c70dd' : '#fff' }">{{ item.title }}</span>
              </span>
            </Checkbox>
          </div>
        </Col>
        <Col v-if="isCurrentEdit808" :span="8" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41; border-right: 1px solid #3d3d41">
          <div style="padding: 10px; background: #283140">
            <Checkbox :value="linePortSingleDevice.length && linePortSingleDevice.filter(itd => itd.ischecked).length === linePortSingleDevice.length" @on-change="selectAllPorts($event, curNodes)">
              {{ $t('plsEport') }}
            </Checkbox>
          </div>
          <div v-for="(item, index) in linePortSingleDevice" :key="index" style="padding: 5px">
            <Checkbox v-model="item.ischecked" @on-change="getportChange">
              <span>{{ item.name }}</span>
            </Checkbox>
          </div>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" @click="saveEditSingle">{{ $t('save') }}</Button>
        <Button @click="cancelFlag">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal v-model="openSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSeconedPwd" :isfoucs="false" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <div style="padding: 10px 20px; border-top: 1px solid #3d3d41">
          <Button type="default" @click="openSeconedPwd = false">{{ $t('cancel') }}</Button>
          <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {
    getGroupType,
    getGroupTree,
    openRemoteLock,
    createTimerConfigCnapshot, // 快照接口
    timerConfigBatchModify,
    saveTimerConfig, // 点击保存或者完成页释放快照
    batchDelTimerConfig, //  批量删除
    execTimerConfig, // 执行
    rollbackTimerConfig,
    delTimerConfigDevice, // 删除已选列表线路端口
    queryTimerConfigDevice, //
    detailTimerConfigDevice,
    modifyTimerConfigDevice,
    addTimerConfigDevice,
    detailTimerConfigTimer,
    saveTimerConfigTimer,
    modifyStatusTimerConfig,
    checkSecondPwd,
    deviceTimerConfigList, // 已有设备列表
    timerConfigList, // 内置定时首页列表新接口
    timerConfigAllList, // 全量列表接口
  } from '@/api/public'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import { processDeviceLineToArray, processDeviceLineToObj, processDeviceLineToObj808, processDeviceLineToArray808, getDeviceIndeterminate } from '../sceneControl/deviceProcess'
  import { queryChannels } from '@/api/multiManage/sceneControl'
  import Edit from './Edit.vue'
  import dayjs from 'dayjs'
  import { downGetTime } from '@/api/multiManage/builtlnTimer'
  import BatchEdit from './BatchEdit.vue'
  import CommandFeedback from './CommandBuiltIn.vue'
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  export default {
    name: 'multiManage-builtInTimer',
    data() {
      return {
        isUnlockAndOpen: null,
        bpk: null,
        newPwdsSeconed: '',
        openSeconedPwd: false,
        rowDatas: {},
        stepAdd: 0,
        tooltipTextone: this.$t('edgeTooltip'),
        tooltipTexttwo: this.$t('cloudTooltip'),
        modelStatusList: [
          { value: -1, label: this.$t('all') },
          { value: 1, label: this.$t('enabled') },
          { value: 0, label: this.$t('disabled') },
        ],
        closeCheck: false,
        isBatchEdits: false,
        nextOrbackType: '',
        macIndeter: false,
        deletePlat: false,
        rowEdites: {},
        allPorts: false,
        linePortSingleDevice: [],
        curNodes: '',
        lineKeys: '',
        getAllLine: false,
        allLineWithDig: [],
        editMac: {},
        editDeviecAndLine: false,
        editTotal: 0,
        editPageNo: 1,
        excuePageNo: 1,
        excueTotal: 0,
        selectIs808: '', // 勾选时判断是否为808
        deviceAllData: {},
        curPortesNodes: '',
        linePortSelect: [],
        lineKeyword: '',
        curLines: [],
        deviceLIstOne: [],
        curClickedNode: [],
        stateList: [
          { value: '-1', label: this.$t('disconnected') },
          { value: '0', label: this.$t('offline') },
          { value: '1', label: this.$t('online') },
        ],
        onlinStatus: '',
        addDeviceItem: { type: '', name: '', typeName: '', position: '' },
        editcircuitFlag: false,
        stepThrees: false,
        stepTwos: false,
        stepOnes: false,
        switchSeting: false,
        isEdits: false, // 是否为编辑状态
        editsObj: {}, // 编辑时的row
        lockEditStatus: false,
        builnStatusEdit: true,
        formBuiltlns: { name: '', gender: '', execute: '', time: '', selectWeek: '', action: '', beforetime: '' },
        ruleValidate: {
          name: [{ required: true, message: this.$t('timedNameCannotBeEmpty'), trigger: 'blur' }],
        },
        deviceTableList: [],

        currentEditBuinIns: 0,
        viewAllHistoryFlag: false,
        editRow: {},
        tabName: 'name1',
        builtInDetailsFlag: false,
        builtInEditsFlag: false,
        builtIndexFlag: true,
        builtlnStatus: true,
        timeStatus: false,
        switchBefore: false,
        isCurBatch808: null, // 当前批量编辑是否为808
        isCurrentEdit808: null, // 当前 编辑 是否为808
        formValidate: { gender: 'finityle', time: '', selectWeek: '', action: 'true', beforetime: '' },
        weekDay: [
          { value: '一', label: this.$t('monday') },
          { value: '二', label: this.$t('tuesday') },
          { value: '三', label: this.$t('wednesday') },
          { value: '四', label: this.$t('thursday') },
          { value: '五', label: this.$t('friday') },
          { value: '六', label: this.$t('saturday') },
          { value: '日', label: this.$t('sunday') },
        ],
        batchEditModal: false,
        executeTypes: [
          { value: 0, label: this.$t('all') },
          { value: 1, label: this.$t('executeAtEdge') },
          { value: 2, label: this.$t('executeInCloud') },
        ],
        execuTableList: [],
        threeModal: false,
        lockMac: '',
        singleAll: true,
        noOpenList: [],
        noSupportList: [],
        toolTipsFlag: false,
        indeterminate: false,
        formInline: { mac: '', action: '', packetTypes: '', packetFilter: [], status: '', modelStatus: '', execute: '' },
        packetList: [],
        packetFilterList: [],
        formNum: '',
        timingFlag: false,
        timingTitle: '',
        timing: null,
        allInstructions: false,
        instructionsData: [],
        multipleSelection: [],
        selectionData: [],
        forceDelData: [],
        msgboxFlag: false,
        delVisible: false,
        checked: false,
        batchEditFlag: false,
        batchEditData: [],
        rowData: {},
        actionTypes: [
          { label: 'ON', value: 1 },
          { label: 'OFF', value: 2 },
          { label: this.$t('inching'), value: 4 },
          { label: this.$t('closing'), value: 'true' },
          { label: this.$t('opening'), value: 'false' },
          { label: this.$t('openAndLock'), value: 'closeAndLock' },
          { label: this.$t('unlockClose'), value: 'unlockAndOpen' },
        ],
        columnses: [
          { type: 'selection', width: 60, align: 'left' },
          { type: 'index', width: 65, title: this.$t('index') },
          { title: this.$t('timerName'), slot: 'namees', align: 'left' },
          { title: this.$t('configurationSituation'), slot: 'configes', align: 'left' },
          { title: this.$t('timingType'), slot: 'weekdayType', align: 'left' },
          { title: this.$t('cyclePeriod'), slot: 'weekdays', align: 'left' },
          { title: this.$t('time'), key: 'time', align: 'left' },
          { title: this.$t('executionMode'), key: 'modelName', align: 'left' },
          { title: this.$t('action'), slot: 'associateAction', align: 'left', width: 120 },
          { title: this.$t('timedState'), slot: 'statuses', align: 'left', width: 120 },
          { title: this.$t('operation'), slot: 'operating', align: 'center', width: 300 },
        ],
        selection: {
          length: 0, // 选中的总条数
          ids: [], // 所有被选择行的id
        },
        digitalOutsData: [],
        tableChocek: [],
        saveLinesObj: {},
        deviceAllData808: {},
        addConfigIds: '',
        curSelect: [],
        source: timerConfigList,
        selectedAllApi: timerConfigAllList,
      }
    },
    mounted() {
      this.init()
      var array = [0, 1, 2, 3, 4, 5, 6]
      array.splice()
      if (this.$route.params.executeConfigId) {
        detailTimerConfigTimer({ configId: this.$route.params.executeConfigId }).then(res => {
          if (res.success) {
            this.builtIndexFlag = false
            this.builtInDetailsFlag = true
            this.editRow = res.data
            this.rowData = res.data
            this.tabName = 'name1'
            this.instructionsData = res.data
            this.instructionsData.projectCode = this.$store.state.projectCode
            this.getExecuDeviceList(this.$route.params.executeConfigId, 20, 1)
          }
        })
      }
      this.isUnlockAndOpen = window.sessionStorage.getItem('isUnlockAndOpen')
    },
    computed: {
      searchBarValues() {
        return {
          projectCode: this.$store.state.projectCode,
          action: this.formInline.status,
          mac: this.formInline.mac,
          status: this.formInline.modelStatus,
          model: this.formInline.execute ? this.formInline.execute : 0,
          types: '1,4',
        }
      },
      isSingleCancel() {
        return Object.keys(this.rowData).length > 0
      },
      execuCloumn() {
        return this.rowData.lineType === 5
          ? [
              { title: this.$t('configDevice'), key: 'title' },
              { title: this.$t('equipmentNo'), key: 'mac' },
              { title: this.$t('line'), slot: 'line' },
              { title: this.$t('port'), slot: 'port' },
            ]
          : [
              { title: this.$t('configDevice'), key: 'title' },
              { title: this.$t('equipmentNo'), key: 'mac' },
              { title: this.$t('line'), slot: 'line' },
            ]
      },
      deveiceColumns() {
        return this.isCurrentEdit808
          ? [
              { title: this.$t('configDevice'), key: 'title' },
              { title: this.$t('equipmentNo'), key: 'mac' },
              { title: this.$t('line'), slot: 'lines' },
              { title: this.$t('port'), slot: 'Inetmouth' },
              { title: this.$t('operation'), slot: 'action' },
            ]
          : [
              { title: this.$t('configDevice'), key: 'title' },
              { title: this.$t('equipmentNo'), key: 'mac' },
              { title: this.$t('line'), slot: 'lines' },
              { title: this.$t('operation'), slot: 'action' },
            ]
      },
    },
    methods: {
      updateCurSelect(curSelect) {
        this.curSelect = curSelect
      },
      init() {
        if (this.$route.params.mac) {
          this.formInline.mac = this.$route.params.mac
        }
        this.isBatchEdits = false
        this.queryList()
        this.getGroupTypes()
      },
      getDeviceIndeterminate: getDeviceIndeterminate,
      formBuiltlnsGenderChange(val) {
        this.formBuiltlns.time = ''
      },
      openPwdsModal(row) {
        this.newPwdsSeconed = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
          this.rowDatas = row || ''
        } else {
          if (row) {
            this.handleDelete(row)
          } else {
            this.handleforceDel()
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
                if (this.rowDatas !== '') {
                  this.handleDelete(this.rowDatas)
                } else {
                  this.handleforceDel()
                }
              }
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        })
      },
      closePwds() {
        this.openSeconedPwd = false
        this.$Message.info({ content: this.$t('cancelDelete') })
      },
      handlePageNo(e) {
        this.excuePageNo = e
        this.getExecuDeviceList(this.rowData.configId, 20, this.excuePageNo)
      },
      editChangePageNo(e) {
        this.editPageNo = e
        this.getEditDeviceList(this.isEdits ? this.editsObj.configId : this.addConfigIds, 20, this.editPageNo)
        // 调用请求接口，待完善
      },
      async creatCnapshot(configId) {
        // 快照方法
        let params = { configId, projectCode: this.$store.state.projectCode }
        const res = await createTimerConfigCnapshot(params)
        if (res.success) {
          if (!this.isEdits && configId === 0) {
            this.addConfigIds = res.data.configId
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleDevicePull(commmand) {
        if (!this.formInline.mac) {
          return this.$Message.error({ content: this.$t('enterDeviceNo') })
        }
        const res = await downGetTime({ mac: this.formInline.mac })
        if (!res.success) {
          return this.$Message.error({ content: res.message })
        }
        this.$Message.success({ content: this.$t('submitCommand') })
      },
      changgeColor(val, row) {
        this.curNodes = val
        this.linePortSingleDevice = row
      },
      async saveCnapshot(configId) {
        const res = await saveTimerConfig({ configId })
        if (res.success) {
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getExecuDeviceList(configId, pageSize, pageNo) {
        let parmars = { configId, pageSize, pageNo }
        const res = await deviceTimerConfigList(parmars)
        if (res.success) {
          this.execuTableList = res.datas
          this.excueTotal = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      lineselectAll(val) {
        this.allLineWithDig.forEach(item => {
          if (!item.islineDisable) {
            item.ischeckes = val
            item.digitalOuts = item.digitalOuts.map(itm => ({ ...itm, ischecked: !!itm.ischeckes }))
          }
        })
      },
      changeLines(val, item) {
        if (!val) {
          item.digitalOuts.forEach(its => {
            its.ischecked = false
          })
          if (this.deviceTableList.length === 1) {
            if (this.allLineWithDig.filter(its => !its.ischeckes).length === this.allLineWithDig.length) {
              this.allLineWithDig.forEach(ites => {
                ites.islineDisable = false
              })
            }
          }
        } else {
          item.digitalOuts.forEach(its => {
            its.ischecked = true
          })
          if (this.deviceTableList.length === 1) {
            if (this.allLineWithDig.filter(its => its.ischeckes).length === 1) {
              if (item.lineType === 'IO') {
                this.allLineWithDig.forEach(ites => {
                  if (ites.lineType !== 'IO') {
                    ites.islineDisable = true
                  }
                })
              } else {
                this.allLineWithDig.forEach(ites => {
                  if (ites.lineType === 'IO') {
                    ites.islineDisable = true
                  }
                })
              }
            }
          }
        }
        this.linePortSingleDevice = item.digitalOuts
      },
      async getCloseLine(addr, id) {
        let parmars = {
          configId: this.isEdits ? this.editsObj.configId : this.addConfigIds,
          id,
          addrsDigitalOuts: addr,
        }
        const res = await delTimerConfigDevice(parmars)
        if (res.success) {
          this.getEditDeviceList(parmars.configId, 20, this.editPageNo)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getClosePort(addrsDigitalOuts, id) {
        let parmars = {
          configId: this.isEdits ? this.editsObj.configId : this.addConfigIds,
          id,
          addrsDigitalOuts,
        }
        const res = await delTimerConfigDevice(parmars)
        if (res.success) {
          this.getEditDeviceList(parmars.configId, 20, this.editPageNo)
        } else {
          this.$Message.error({
            content: res.message,
          })
        }
      },
      selectAllPorts(val, addr) {
        if (val) {
          this.allLineWithDig.forEach(item => {
            if (item.addr === addr) {
              item.digitalOuts.forEach(its => {
                its.ischecked = true
              })
              this.linePortSingleDevice = item.digitalOuts
            }
          })
        } else {
          this.allLineWithDig.forEach(item => {
            if (item.addr === addr) {
              item.digitalOuts.forEach(its => {
                its.ischecked = false
              })
              this.linePortSingleDevice = item.digitalOuts
            }
          })
        }
      },
      cancelFlag() {
        this.editDeviecAndLine = false
      },
      async saveEditSingle() {
        let detailsArr = this.allLineWithDig.filter(item => !item.islineDisable && !!item.ischeckes)
        let parmars = {
          configId: this.isEdits ? this.editsObj.configId : this.addConfigIds,
          id: this.rowEdites.id,
          addrsDigitalOuts: '',
        }
        if (detailsArr.length === 0) {
          this.editDeviecAndLine = false
          this.getDelDevices(this.rowEdites.id)
        } else {
          if (this.isCurrentEdit808) {
            parmars.addrsDigitalOuts = detailsArr
              .map(
                item =>
                  item.addr +
                  (Array.isArray(item.digitalOuts) && item.digitalOuts.length
                    ? '_' +
                      item.digitalOuts
                        .filter(itm => itm.ischecked)
                        .map(v => v.index)
                        .join('-')
                    : '')
              )
              .join(',')
          } else {
            parmars.addrsDigitalOuts = detailsArr.map(item => item.addr).join(',')
          }
        }
        const res = await modifyTimerConfigDevice(parmars)
        if (res.success) {
          this.getEditDeviceList(parmars.configId, 20, 1)
          this.$Message.success({ content: res.message })
          this.editDeviecAndLine = false
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      confirmFlag() {
        this.editcircuitFlag = false
      },
      async handleThresholdDeviceAdd() {
        let dataArr = this.deviceLIstOne.filter(item => item.checked)
        if (dataArr.length === 0) {
          return this.$Message.error({
            content: this.$t('pleaseSelectDeviceLine'),
          })
        }
        let arr = []
        dataArr.forEach(item => {
          if (Array.isArray(item.addrs) && item.addrs.length) {
            item['addrsDigitalOuts'] = item.addrs
              .filter(itm => itm.checked)
              .map(
                its =>
                  its.addr +
                  (Array.isArray(its.digitalOuts) && its.digitalOuts.length && its.digitalOuts.filter(itms => itms.checked).length > 0
                    ? '_' +
                      its.digitalOuts
                        .filter(itms => itms.checked)
                        .map(v => v.index)
                        .join('-')
                    : '')
              )
              .join(',')
          }
        })
        dataArr.forEach(item => {
          arr.push({ mac: item.mac, addrsDigitalOuts: item.addrsDigitalOuts })
        })
        let parmars = {
          configId: this.isEdits ? this.editsObj.configId : this.addConfigIds,
          deviceData: JSON.stringify(arr),
        }
        const res = await addTimerConfigDevice(parmars)
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.editcircuitFlag = false
          this.getEditDeviceList(parmars.configId, 20, 1)
        }
        // 设备没有选择提示
      },
      getportChange(val) {
        if (val) {
          if (this.linePortSingleDevice.filter(itm => itm.ischecked).length === this.linePortSingleDevice.length) {
            this.allPorts = true
          }
        } else {
          this.allPorts = false
        }
      },
      handleSceneSave() {
        // 分在 编辑第一步或者第二步，编辑情况下或者是新增情况入参configId不一样 编辑： this.addConfigIds，新增：this. this.editsObj.configId
        // 保存释放快照
        if (this.deviceTableList.length === 0 && this.currentEditBuinIns === 0) {
          return this.$Message.error({ content: this.$t('pleaseAddTheCircuitBeforeSaving') })
        }
        let configNewIds
        this.isEdits ? (configNewIds = this.editsObj.configId) : (configNewIds = this.addConfigIds)
        if (this.currentEditBuinIns === 0) {
          this.saveCnapshot(configNewIds)
          this.builtInEditsFlag = false
          this.builtIndexFlag = true
          this.init()
        }
        if (this.currentEditBuinIns === 1) {
          if (
            !this.formBuiltlns.name ||
            !this.formBuiltlns.execute ||
            !this.formBuiltlns.gender ||
            !this.formBuiltlns.action ||
            this.formBuiltlns.time === 'Invalid Date' ||
            (this.formBuiltlns.gender === 'finityle' && !this.formBuiltlns.selectWeek) ||
            (this.formBuiltlns.action === 'openAndLock' && this.switchSeting && this.formBuiltlns.beforetime === 'Invalid Date')
          ) {
            return this.$Message.error({ content: this.$t('pleaseConfigureTheTtimingSettingsCompletely') })
          }
          this.saveTimerConfigApi(configNewIds, this.$t('save'), configNewIds)
          // this.init() 待接口释放
        }
      },
      async saveTimerConfigApi(configId, type, ids) {
        this.nextOrbackType = type
        let param = {
          configId,
          name: this.formBuiltlns.name,
          model: this.formBuiltlns.execute === 'bordEcute' ? 1 : 2,
          weekday: this.formBuiltlns.gender === 'single' ? '' : this.formBuiltlns.selectWeek.join(''),
          time: this.formBuiltlns.gender === 'single' ? dayjs(this.formBuiltlns.time).format('YYYY-MM-DD HH:mm:ss') : this.formBuiltlns.time,
          action: this.isCurrentEdit808 ? this.formBuiltlns.action : this.formBuiltlns.action === 'open' ? 'false' : this.formBuiltlns.action === 'close' ? 'true' : this.formBuiltlns.action === 'unlockAndOpen' ? 'unlockAndOpen' : 'closeAndLock',
          status: this.builnStatusEdit ? 1 : 0,
          associateAction: this.formBuiltlns.action === 'openAndLock' && this.switchSeting ? 'unlockAndOpen' : '',
          associateTime: !(this.formBuiltlns.action === 'openAndLock' && this.switchSeting) ? '' : this.formBuiltlns.gender === 'single' ? dayjs(this.formBuiltlns.beforetime).format('YYYY-MM-DD HH:mm:ss') : this.formBuiltlns.beforetime,
          skipCloseLockCheck: this.closeCheck,
        }
        const res = await saveTimerConfigTimer(param)
        if (res.success) {
          if (res.data.allOK) {
            if (type === this.$t('save')) {
              this.saveCnapshot(ids)
              this.builtInEditsFlag = false
              this.builtIndexFlag = true
              this.init()
            } else if (type === this.$t('nextStep')) {
              this.saveCnapshot(ids)
              this.stepTwos = false
              this.stepThrees = true
              this.currentEditBuinIns = 2
            }
          }
          if (res.data.allNoSupport) {
            this.$Modal.warning({
              title: this.$t('remind'),
              content: this.$t('selectAllLineNotSupporttimmingTip'),
              onOk: () => {
                this.stepTwos = false
                this.stepOnes = true
                this.currentEditBuinIns = 0
              },
            })
          } else {
            if (Array.isArray(res.data.noOpenList) && res.data.noOpenList.length) {
              this.toolTipsFlag = true
              this.noSupportList = res.data.noSupportList
              this.noOpenList = res.data.noOpenList.map(item => ({
                ...item,
                macChecked: true,
                macIndeter: false,
                addrTitleList: item.addrTitleList.map(v => ({ ...v, checked: true })),
              }))
            } else if ((res.data.noOpenList.length === 0 || !res.data.noOpenList) && Array.isArray(res.data.noSupportList) && res.data.noSupportList.length) {
              this.threeModal = true
              this.noSupportList = res.data.noSupportList
            }
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async chagneCurStatus(status, configId) {
        let params = { status, configId }
        const res = await modifyStatusTimerConfig(params)
        if (res.success) {
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
          this.init()
        }
      },
      openBatchModal() {
        this.batchEditModal = true
        this.isBatchEdits = true
        this.builtlnStatus = true
        this.isCurBatch808 = this.$refs.selection.curSelectType === 1
        this.formValidate = {
          gender: 'single',
          time: '',
          selectWeek: '',
          action: this.isCurBatch808 ? '1' : 'true',
          beforetime: '',
        }
      },
      backToOnes() {
        this.stepOnes = true
        this.stepTwos = false
        this.currentEditBuinIns = 0
        this.stepAdd = 2
      },
      nextAlright() {
        if (
          !this.formBuiltlns.name ||
          !this.formBuiltlns.execute ||
          !this.formBuiltlns.gender ||
          !this.formBuiltlns.action ||
          this.formBuiltlns.time === 'Invalid Date' ||
          (this.formBuiltlns.gender === 'finityle' && !this.formBuiltlns.selectWeek) ||
          (this.formBuiltlns.action === 'openAndLock' && this.switchSeting && this.formBuiltlns.beforetime === 'Invalid Date')
        ) {
          return this.$Message.error({ content: this.$t('pleaseConfigureTheTtimingSettingsCompletely') })
        }
        let newIds = this.isEdits ? this.editsObj.configId : this.addConfigIds
        this.saveTimerConfigApi(newIds, this.$t('nextStep'), newIds)
      },
      continueNext() {
        if (this.builtIndexFlag && this.isBatchEdits) {
          let configIds = this.curSelect.join(',')
          let params = {
            configIds,
            weekday: this.formValidate.gender === 'single' ? '' : this.formValidate.selectWeek.join(''),
            time: this.formValidate.gender === 'single' ? dayjs(this.formValidate.time).format('YYYY-MM-DD HH:mm:ss') : this.formValidate.time,
            action: this.formValidate.action,
            associateAction: this.formValidate.action === 'closeAndLock' && this.switchBefore ? 'unlockAndOpen' : '',
            associateTime: !(this.formValidate.action === 'closeAndLock' && this.switchBefore) ? '' : this.formValidate.gender === 'single' ? dayjs(this.formValidate.beforetime).format('YYYY-MM-DD HH:mm:ss') : this.formValidate.beforetime,
            status: this.builtlnStatus ? 1 : 0,
            skipCloseLockCheck: true,
          }
          timerConfigBatchModify(params).then(res => {
            if (res.success) {
              this.$Message.success({ content: res.message })
              this.threeModal = false
              this.init()
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        } else if (this.builtInEditsFlag && !this.isBatchEdits) {
          let param = {
            configId: this.isEdits ? this.editsObj.configId : this.addConfigIds,
            name: this.formBuiltlns.name,
            model: this.formBuiltlns.execute === 'bordEcute' ? 1 : 2,
            weekday: this.formBuiltlns.gender === 'single' ? '' : this.formBuiltlns.selectWeek.join(''),
            time: this.formBuiltlns.gender === 'single' ? dayjs(this.formBuiltlns.time).format('YYYY-MM-DD HH:mm:ss') : this.formBuiltlns.time,
            action: this.isCurrentEdit808 ? this.formBuiltlns.action : this.formBuiltlns.action === 'open' ? 'false' : this.formBuiltlns.action === 'close' ? 'true' : this.formBuiltlns.action === 'unlockAndOpen' ? 'unlockAndOpen' : 'closeAndLock',
            status: this.builnStatusEdit ? 1 : 0,
            associateAction: this.formBuiltlns.action === 'openAndLock' && this.switchSeting ? 'unlockAndOpen' : '',
            associateTime: !(this.formBuiltlns.action === 'openAndLock' && this.switchSeting) ? '' : this.formBuiltlns.gender === 'single' ? dayjs(this.formBuiltlns.beforetime).format('YYYY-MM-DD HH:mm:ss') : this.formBuiltlns.beforetime,
            skipCloseLockCheck: true,
          }
          saveTimerConfigTimer(param).then(res => {
            if (res.success) {
              if (this.nextOrbackType === this.$t('save')) {
                this.saveCnapshot(this.isEdits ? this.editsObj.configId : this.addConfigIds)
                this.builtInEditsFlag = false
                this.builtIndexFlag = true
                this.init()
              }
              if (this.nextOrbackType === this.$t('nextStep')) {
                this.saveCnapshot(this.isEdits ? this.editsObj.configId : this.addConfigIds)
                this.stepTwos = false
                this.stepThrees = true
                this.currentEditBuinIns = 2
              }
              this.threeModal = false
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        }
      },
      backGoToOnes() {
        this.stepOnes = true
        this.stepThrees = false
        this.currentEditBuinIns = 0
        this.isEdits = false
        this.isCurrentEdit808 = null
        this.creatCnapshot(0)
      },
      backList() {
        this.stepThrees = false
        this.currentEditBuinIns = 0
        this.builtInEditsFlag = false
        this.builtIndexFlag = true
        this.isEdits = false
        this.isCurrentEdit808 = null
        this.init()
      },
      editTimeChange(e) {},
      editBeforeChange() {
        if (!this.switchSeting) {
          return new Promise(resolve => {
            this.$Modal.confirm({
              title: '',
              content: this.$t('caution'),
              onOk: () => {
                resolve()
              },
              okText: this.$t('confirm'),
            })
          })
        } else {
          this.switchSeting = false
        }
      },
      openDeviceLineFlag(val) {
        if (!val) {
          this.getGroupTypes() // 获取设备查询条件中的分组，编辑进来不需要
        }
        this.addDeviceItem = {
          type: '',
          name: '',
          typeName: '',
          position: '',
        }
        this.onlinStatus = ''
        this.curLines = []
        this.linePortSelect = []
        if (!this.isEdits && this.deviceTableList.length === 0) {
          this.isCurrentEdit808 = null
        }
        //  else if (!this.isEdits && (this.deviceTableList.length > 0)) {
        //     // 如果此时新增已有设备，再次添加，此时再遍历表格对 isCurrentEdit808进行赋值控制
        // }

        if (this.isCurrentEdit808) {
          this.isCurrentEdit808 = true
          // 表格为808线路设备，此时需要增加lineType为IO来获取808设备列表
          let params = {
            projectCode: this.$store.state.projectCode,
            configId: this.isEdits ? this.editsObj.configId : this.addConfigIds,
          }
          queryTimerConfigDevice(params).then(res => {
            if (res.success) {
              // 获取所有808设备
              let newArr = res.datas
              newArr.forEach(item => {
                if (item.addrs.length === 0) {
                  delete item.addrs
                }
              })
              this.deviceLIstOne = processDeviceLineToArray(newArr)
              this.deviceAllData = processDeviceLineToObj(newArr)
              this.editcircuitFlag = true
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        } else if (!this.isCurrentEdit808) {
          this.editcircuitFlag = true
          // this.isCurrentEdit808 = false
          let params = {
            projectCode: this.$store.state.projectCode,
            configId: this.isEdits ? this.editsObj.configId : this.addConfigIds,
          }
          queryTimerConfigDevice(params).then(res => {
            if (res.success) {
              let newArr = res.datas
              newArr.forEach(item => {
                if (item.addrs.length === 0) {
                  delete item.addrs
                }
              })
              this.deviceLIstOne = processDeviceLineToArray(newArr)
              this.deviceAllData = processDeviceLineToObj(newArr)
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        }

        // if (this.isFristFlag) {

        // } else {
        //     if (this.deviceTableList.length === 0) {
        //         this.isCurrentEdit808 = null
        //     }
        // }
      },
      resetButton() {
        // 重置按钮
        this.addDeviceItem = {
          type: '',
          name: '',
          typeName: '',
          position: '',
        }
        this.onlinStatus = ''
      },
      handlePageQueryAddr() {
        // 查询按钮
        let params = {
          projectCode: this.$store.state.projectCode,
          // pageSize: '1000',
          // pageNo: '1',
          configId: this.isEdits ? this.editsObj.configId : this.addConfigIds,
          onlineStatus: this.onlinStatus,
          mac: this.addDeviceItem.name,
          //  equipmentTypes: '1,2,19',
          location: this.addDeviceItem.position,
          nodeIds: this.addDeviceItem.typeName ? this.addDeviceItem.typeName.join() : this.addDeviceItem.typeName,
        }
        queryTimerConfigDevice(params).then(res => {
          if (res.success) {
            let newArr = res.datas
            newArr.forEach(item => {
              if (item.addrs.length === 0) {
                delete item.addrs
              }
            })
            if (!this.isCurrentEdit808) {
              this.deviceLIstOne = processDeviceLineToArray(newArr)
              this.deviceAllData = processDeviceLineToObj(newArr)
            } else {
              this.deviceLIstOne = processDeviceLineToArray808(newArr)
              this.deviceAllData808 = processDeviceLineToObj808(newArr)
              // this.deviceLIstOne = this.yesIoDeviceList
            }
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      getAllDeviceValue(val) {
        if (val) {
          if (!this.curLines.filter(item => item.checked).length) {
            const isAll808 = this.deviceLIstOne.filter(v => v.isAll808).length === this.deviceLIstOne.length
            this.isCurrentEdit808 = isAll808
          }
          this.deviceLIstOne.forEach(v => {
            v.checked = v.isAll808 === this.isCurrentEdit808
            Array.isArray(v.addrs) &&
              v.addrs.length &&
              v.addrs.forEach(item => {
                item.checked = item.is808 === this.isCurrentEdit808
                item.checked &&
                  Array.isArray(item.digitalOuts) &&
                  item.digitalOuts.length &&
                  item.digitalOuts.forEach(j => {
                    j.checked = true
                  })
              })
          })
          this.$forceUpdate()
          // 判断cur808  全部的设备都是808 才能算808
        } else {
          if (!this.isEdits && this.deviceTableList.length === 0) {
            this.isCurrentEdit808 = null
          }

          this.deviceLIstOne.forEach(v => {
            v.checked = false
            Array.isArray(v.addrs) &&
              v.addrs.length &&
              v.addrs.forEach(item => {
                item.checked = false
                Array.isArray(item.digitalOuts) &&
                  item.digitalOuts.length &&
                  item.digitalOuts.forEach(j => {
                    j.checked = false
                  })
              })
          })

          this.$forceUpdate()
        }
      },
      checkSelectQuery(val, row) {
        this.deviceLIstOne.forEach(item => {
          if (item.mac === row.mac) {
            this.curLines = item.addrs
          }
        })

        if (val) {
          this.curClickedNode = row.mac
          this.saveLinesObj[row.mac] = this.curLines.filter(item => item.checked && !item.disableAddr)
          if (row.addrs.length) {
            if (this.isCurrentEdit808 !== null) {
              this.curLines.forEach(item => {
                item.checked = this.isCurrentEdit808 === item.is808 && item.isSupportOc
                item.checked &&
                  Array.isArray(item.digitalOuts) &&
                  item.digitalOuts.length &&
                  item.digitalOuts.forEach(j => {
                    j.checked = item.checked
                  })
              })
            } else {
              if (row.isAll808) {
                this.isCurrentEdit808 = true
                this.curLines.forEach(item => {
                  item.checked = !!item.is808 && item.isSupportOc
                  item.checked &&
                    Array.isArray(item.digitalOuts) &&
                    item.digitalOuts.length &&
                    item.digitalOuts.forEach(j => {
                      j.checked = item.checked
                    })
                })
              } else {
                this.isCurrentEdit808 = false
                this.curLines.forEach(item => {
                  item.checked = !item.is808 && item.isSupportOc
                  item.checked &&
                    Array.isArray(item.digitalOuts) &&
                    item.digitalOuts.length &&
                    item.digitalOuts.forEach(j => {
                      j.checked = item.checked
                    })
                })
              }
            }
            // 单选全部是808
          }
        } else {
          this.curLines.forEach(item => {
            item.checked = false
            Array.isArray(item.digitalOuts) &&
              item.digitalOuts.length &&
              item.digitalOuts.forEach(j => {
                item.checked = false
              })
          })
          setTimeout(() => {
            const curChecks = this.curLines.filter(item => item.checked)
            if (!curChecks.length) {
              this.deviceLIstOne.forEach(v => {
                if (v.mac === row.mac) {
                  v.checked = false
                }
              })
            }
            let filterArr = this.deviceLIstOne
              .map(v => v.addrs)
              .flat(Infinity)
              .filter(item => item.checked)
            if (!filterArr.length) {
              if (this.isCurrentEdit808) {
              } else {
                this.isCurrentEdit808 = false
              }
              if (!this.isEdits) {
                if (this.deviceTableList.length === 0) {
                  this.isCurrentEdit808 = null
                }
              }
            }
          })
        }
      },
      clickLable(mac, disabled) {
        if (disabled) {
          return
        }

        this.deviceLIstOne.forEach(item => {
          if (item.mac === mac) {
            if (!this.isEdits) {
              this.curLines = item.addrs
            } else {
              this.curLines = item.addrs
            }
          }
        })

        this.curClickedNode = mac
        if (!this.isEdits) {
          if (this.deviceTableList.length === 0) {
            this.isCurrentEdit808 = null
          }
        }
      },
      lineCheckAll(val) {
        if (val) {
          // this.curLines.forEach(item => {
          //     item.checked = true
          // })
          // 如果存在不是808的情况，全部选中全部非808线路
          // 如果全是808情况，就选中全部808

          // this.curClickedNode

          if (!this.curLines.filter(item => item.checked).length) {
            const curNode = this.deviceAllData[this.curClickedNode]
            const { isAll808 } = curNode
            if (isAll808) {
              this.isCurrentEdit808 = true
            } else {
              this.isCurrentEdit808 = false
            }
          }
          this.curLines = this.curLines.map(item => ({
            ...item,
            checked: item.is808 === this.isCurrentEdit808,
            digitalOuts: item.digitalOuts.map(v => ({
              ...v,
              checked: item.is808 === this.isCurrentEdit808,
            })),
          }))
          this.deviceLIstOne.forEach(v => {
            if (v.mac === this.curClickedNode) {
              v.addrs = this.curLines
              v.checked = true
            }
          })
        } else {
          this.curLines.forEach(item => {
            item.checked = false
            Array.isArray(item.digitalOuts) &&
              item.digitalOuts.length &&
              item.digitalOuts.forEach(v => {
                v.checked = false
              })
          })
          this.deviceLIstOne.forEach(v => {
            if (v.mac === this.curClickedNode) {
              v.addrs = this.curLines
            }
          })
          setTimeout(() => {
            const curChecks = this.curLines.filter(item => item.checked)
            if (!curChecks.length) {
              this.deviceLIstOne.forEach(v => {
                if (v.mac === this.curClickedNode) {
                  v.checked = false
                }
              })
            }
            let filterArr = this.deviceLIstOne
              .map(v => v.addrs)
              .flat(Infinity)
              .filter(item => item.checked)
            if (!filterArr.length) {
              this.isCurrentEdit808 = null
            }
          })
        }
      },
      linesChange(val, row, index) {
        this.linePortSelect = row.digitalOuts
        this.curPortesNodes = row.addr

        if (val) {
          this.isCurrentEdit808 = row.is808
          this.deviceLIstOne.forEach(v => {
            if (v.mac === row.mac) {
              v.checked = true
            }
          })
          row.digitalOuts.forEach(v => {
            v.checked = true
          })
        } else {
          row.digitalOuts.forEach(v => {
            v.checked = false
          })
          setTimeout(() => {
            const curChecks = this.curLines.filter(item => item.checked)
            if (!curChecks.length) {
              this.deviceLIstOne.forEach(v => {
                if (v.mac === row.mac) {
                  v.checked = false
                }
              })
            }
            let filterArr = this.deviceLIstOne
              .map(v => v.addrs)
              .flat(Infinity)
              .filter(item => item.checked)
            if (!filterArr.length) {
              if (this.isCurrentEdit808) {
              } else if (this.isCurrentEdit808 === false) {
              } else {
                this.isCurrentEdit808 = null
              }
              if (!this.isEdits) {
                if (this.deviceTableList.length === 0) {
                  this.isCurrentEdit808 = null
                }
              }
            }
          })
        }
        this.curLines[index] = { ...this.curLines[index], checked: val }
        this.$forceUpdate()
      },
      lineCheckAllChange(val, digitalOuts) {
        Array.isArray(digitalOuts) &&
          digitalOuts.length &&
          digitalOuts.forEach(v => {
            v.checked = val
          })
        this.$forceUpdate()
      },
      getSelectedAddrs(addr, disabeld, digitalOuts) {
        if (disabeld) return
        this.curPortesNodes = addr
        this.linePortSelect = digitalOuts
      },
      newAddBuiltln() {
        this.builtIndexFlag = false
        this.builtInEditsFlag = true
        this.isBatchEdits = false
        this.stepOnes = true
        this.isEdits = false
        this.isCurrentEdit808 = null
        this.editsObj = {}
        this.deviceTableList = []
        this.stepAdd = 1
        this.creatCnapshot(0)
      },
      toBack() {
        this.$Modal.confirm({
          title: this.$t('savedAfterCancellation'),
          content: this.$t('wantCancel') + '?',
          onOk: () => {},
          onCancel: () => {
            // 快照
            let params = {
              configId: this.isEdits ? this.editsObj.configId : this.addConfigIds,
            }
            rollbackTimerConfig(params).then(res => {
              if (res.success) {
                this.$Message.info(this.$t('editCanceled'))
                this.init()
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })

            this.builtInEditsFlag = false
            this.builtIndexFlag = true
            this.currentEditBuinIns = 0
            this.stepOnes = false
            this.stepTwos = false
            this.stepThrees = false
            this.deviceTableList = []
            this.curClickedNode = ''
            this.isEdits = false
            // let params
          },
          okText: this.$t('wrong'),
          cancelText: this.$t('cancel'),
        })
      },
      nextStep() {
        if (!this.deviceTableList.length) {
          this.$Message.error({
            content: this.$t('pleaseSelectDeviceLine'),
          })
          return
        }
        this.currentEditBuinIns = 1
        this.stepOnes = false
        this.stepTwos = true
        this.closeCheck = false
        if (this.isEdits) {
          // 编辑模式 this.editsObj是row
          let param = {
            configId: this.editsObj.configId,
          }
          detailTimerConfigTimer(param).then(res => {
            if (res.success) {
              if (res.data.lineType === 5) {
                this.isCurrentEdit808 = true
              } else {
                this.isCurrentEdit808 = false
              }
              this.formBuiltlns.name = res.data.name
              this.formBuiltlns.gender = res.data.weekday.length > 0 ? 'finityle' : 'single'
              this.formBuiltlns.execute = res.data.model === 1 ? 'bordEcute' : 'crodexEcute'
              this.formBuiltlns.time = res.data.weekday.length > 0 ? res.data.time : dayjs(res.data.time).format('YYYY-MM-DD HH:mm:ss')
              this.formBuiltlns.selectWeek = res.data.weekday.length > 0 ? res.data.weekday.split('') : []
              this.formBuiltlns.action = res.data.action === 'true' ? 'close' : res.data.action === 'false' ? 'open' : res.data.action === 'closeAndLock' ? 'openAndLock' : res.data.action
              this.formBuiltlns.beforetime = res.data.action === 'closeAndLock' && res.data.weekday.length > 0 ? res.data.associateTime : dayjs(res.data.associateTime).format('YYYY-MM-DD HH:mm:ss')

              this.switchSeting = res.data.associateAction === 'unlockAndOpen'
              this.builnStatusEdit = res.data.status === 1
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        } else {
          // 新增模式
          let digCount = 0
          this.deviceTableList.forEach(item => {
            if (Array.isArray(item.addrs) && item.addrs.length) {
              item.addrs.forEach(itm => {
                if (Array.isArray(itm.digitalOuts) && itm.digitalOuts.length > 0 && itm.digitalOuts[0].index) {
                  digCount = 1
                }
              })
            }
          })

          if (digCount === 1) {
            this.isCurrentEdit808 = true
          } else {
            this.isCurrentEdit808 = false
          }
          if (this.stepAdd === 1) {
            this.formBuiltlns = {
              name: '',
              gender: '',
              execute: '',
              time: '',
              selectWeek: '',
              action: '',
              beforetime: '',
            }
          }

          this.switchSeting = false
        }
      },
      editSelectLine(row) {
        this.rowEdites = row
        this.editDeviecAndLine = true
        this.editMac = {
          name: row.title,
          mac: row.mac,
        }
        queryChannels({ mac: row.mac }).then(res => {
          if (res.success) {
            this.allLineWithDig = res.datas.map(item => ({
              isSupportOc: item.isSupportOc,
              addr: item.addr,
              title: item.title,
              lineType: item.lineType,
              ischeckes: false,
              minates: false,
              islineDisable: false,
              digitalOuts: item.lineType === 'IO' ? item.digitalOuts.map(itm => ({ ...itm, ischecked: false })) : [],
            }))
            let param = {
              configId: this.isEdits ? this.editsObj.configId : this.addConfigIds,
              id: row.id,
            }
            detailTimerConfigDevice(param).then(res => {
              if (res.success) {
                if (Array.isArray(res.data.addrs) && res.data.addrs.length) {
                  let arrConfig = res.data.addrs
                  arrConfig.forEach(item => {
                    this.allLineWithDig.forEach(itm => {
                      if (itm.addr === item.addr) {
                        itm.ischeckes = true

                        if (this.isCurrentEdit808) {
                          this.curNodes = itm.addr
                          itm.digitalOuts.forEach(v => {
                            v.ischecked = true
                          })
                          this.linePortSingleDevice = itm.digitalOuts
                          this.allPorts = true
                        }
                      }
                      if (!this.isCurrentEdit808) {
                        if (Array.isArray(itm.digitalOuts) && itm.digitalOuts.length) {
                          itm.islineDisable = true
                        } else {
                          itm.islineDisable = false
                        }
                      } else {
                        if (itm.digitalOuts.length === 0) {
                          itm.islineDisable = true
                        } else {
                          itm.islineDisable = false
                        }
                      }
                    })
                  })
                }
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      getDelDevices(id) {
        let parmars = {
          configId: this.isEdits ? this.editsObj.configId : this.addConfigIds,
          id,
          addrsDigitalOuts: '',
        }
        delTimerConfigDevice(parmars).then(res => {
          if (res.success) {
            this.getEditDeviceList(parmars.configId, 20, this.editPageNo)
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      getGenderChange(val) {},
      editBuiltInDevice(row) {
        //   编辑时判断是否为808 ||false ;
        if (row.lineType === 5) {
          this.isCurrentEdit808 = true
        } else {
          this.isCurrentEdit808 = false
        }
        if (this.builtInDetailsFlag) {
          this.builtInDetailsFlag = false
        }
        this.isBatchEdits = false
        this.builtInEditsFlag = true
        this.builtIndexFlag = false
        this.currentEditBuinIns = 0
        this.stepOnes = true
        this.stepTwos = false
        this.isEdits = true
        this.editsObj = row
        this.creatCnapshot(row.configId)
        this.getEditDeviceList(row.configId, 20, 1)
      },
      getEditDeviceList(configId, pageSize, pageNo) {
        let parmars = { configId, pageSize, pageNo }
        deviceTimerConfigList(parmars).then(res => {
          if (res.success) {
            this.deviceTableList = res.datas
            this.editTotal = res.total
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      getTabChange(val) {
        if (val === 'name2') {
          this.handleInstructions(this.editRow)
        }
      },
      backBuiltIndex() {
        this.builtIndexFlag = true
        this.builtInDetailsFlag = false
        if (this.viewAllHistoryFlag) {
          this.viewAllHistoryFlag = false
        }
      },
      queryDetailsBuiltn(row) {
        this.builtIndexFlag = false
        this.builtInDetailsFlag = true
        this.editRow = row
        this.rowData = row
        this.tabName = 'name1'
        this.instructionsData = row
        this.instructionsData.projectCode = this.$store.state.projectCode
        this.getExecuDeviceList(row.configId, 20, 1)
      },
      async saveBatchModal() {
        let configIds = this.curSelect.join(',')
        let params = {
          configIds,
          weekday: this.formValidate.gender === 'single' ? '' : this.formValidate.selectWeek.join(''),
          time: this.formValidate.gender === 'single' ? dayjs(this.formValidate.time).format('YYYY-MM-DD HH:mm:ss') : this.formValidate.time,
          action: this.formValidate.action,
          associateAction: this.formValidate.action === 'closeAndLock' && this.switchBefore ? 'unlockAndOpen' : '',
          associateTime: !(this.formValidate.action === 'closeAndLock' && this.switchBefore) ? '' : this.formValidate.gender === 'single' ? dayjs(this.formValidate.beforetime).format('YYYY-MM-DD HH:mm:ss') : this.formValidate.beforetime,
          status: this.builtlnStatus ? 1 : 0,
          skipCloseLockCheck: false,
        }
        const res = await timerConfigBatchModify(params)
        if (res.success) {
          if (res.data.allOK) {
            this.$Message.success({
              content: res.message,
            })
            this.batchEditModal = false
            this.init()
          } else {
            // 批量编辑点击保存也有弹窗
            if (res.data.allNoSupport) {
              this.$Modal.warning({
                title: this.$t('remind'),
                content: this.$t('reselectLinesAdvancedTimingTip'),
                onOk: () => {},
              })
            } else {
              if (Array.isArray(res.data.noOpenList) && res.data.noOpenList.length) {
                this.toolTipsFlag = true
                this.noSupportList = res.data.noSupportList
                this.noOpenList = res.data.noOpenList.map(item => ({
                  ...item,
                  macChecked: false,
                  macIndeter: false,
                  addrTitleList: item.addrTitleList.map(v => ({ ...v, checked: false })),
                }))
              } else if ((res.data.noOpenList.length === 0 || !res.data.noOpenList) && Array.isArray(res.data.noSupportList) && res.data.noSupportList.length) {
                this.threeModal = true
                this.noSupportList = res.data.noSupportList
              }
              this.batchEditModal = false
            }
          }
        } else {
          this.$Message.error({ content: res.message })
        }
        // 批量编辑待完善
      },
      BeforestartTimeChange(val) {
        this.formValidate.beforetime = val
        let olddata = new Date(this.form.time)
        let oldtime = olddata.getTime()
        let newdata = new Date(val)
        let newtime = newdata.getTime()
        this.timeStatus = oldtime >= newtime
      },
      handleBeforeChange() {
        if (!this.switchBefore) {
          return new Promise(resolve => {
            this.$Modal.confirm({
              title: '',
              content: this.$t('caution'),
              onOk: () => {
                resolve()
              },
            })
          })
        } else {
          this.switchBefore = false
        }
      },
      handleActionTypes(item) {
        if (item === 1) {
          this.formNum = true
        } else if (item === 2) {
          this.formNum = false
        } else if (item === 'closeAndLock') {
          this.formNum = 'closeAndLock'
        } else if (item === undefined) {
          this.formNum = ''
        }
      },
      handleTypes(val) {
        this.formInline.packetTypes = val
        this.getGroupTrees()
      },
      closeEdit() {
        this.timingFlag = false
      },
      getAddrAll(val) {
        this.noOpenList.forEach(item => {
          item.macChecked = val
          if (Array.isArray(item.addrTitleList) && item.addrTitleList.length) {
            item.addrTitleList.forEach(v => {
              v.checked = val
            })
          }
        })
      },
      async openLocked() {
        let macAddrsList = this.noOpenList.map(item => ({
          mac: item.addrTitleList.filter(v => v.checked).length > 0 ? item.mac : '',
          addrs: item.addrTitleList
            .filter(v => v.checked)
            .map(j => j.addr)
            .join(),
        }))
        let params = {
          macAddrsList: JSON.stringify(macAddrsList),
        }
        const res = await openRemoteLock(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('submitCommand') })
          this.continueNext()
          this.toolTipsFlag = false
        } else {
          this.$Message.error({
            content: res.message,
          })
        }
      },
      getAlladdrs(val, item) {
        item.addrTitleList.forEach(v => {
          v.checked = val
        })
        if (this.noOpenList.filter(item => item.macChecked).length === 0) {
          this.singleAll = false
        } else if (this.noOpenList.filter(item => item.macChecked).length > 0 && this.noOpenList.filter(item => item.macChecked).length < this.noOpenList.length) {
          this.indeterminate = true
        } else {
          this.singleAll = true
          this.indeterminate = false
        }
      },
      getChangeAddrs(val, items, mac) {
        this.noOpenList.forEach(item => {
          if (item.mac === mac) {
            item.macChecked = items.filter(v => v.checked).length === items.length
          }
        })
        if (this.noOpenList.filter(v => v.macChecked).length === this.noOpenList.length) {
          this.singleAll = true
        } else {
          if (val && items.filter(v => v.checked).length !== items.length) {
            this.indeterminate = true
          } else if (!val) {
            if (this.noOpenList.filter(v => v.macChecked).length === 0 && items.filter(v => v.checked).length === 0) {
              this.indeterminate = false
              this.singleAll = false
            }
          }
        }
      },
      async getGroupTypes() {
        let params = {
          projectCode: this.$store.state.projectCode,
        }
        const res = await getGroupType(params)
        if (res.success) {
          this.packetList = res && res.data
        } else if (res.code === '-1') {
        } else {
          this.$Message.error({
            content: res.message,
          })
        }
      },
      async getGroupTrees() {
        const res = await getGroupTree({ groupId: this.formInline.packetTypes })
        if (res.code === '0') {
          let resData = this.getTree(res.data)
          this.packetFilterList = this.cloneTree(resData)
        } else {
          this.$Message.error({ content: res.message })
        }
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
            // 其他你想要添加的属性
            obj.expand = true
            obj.selected = false
            obj.checked = false
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },
      queryList() {
        this.$refs.selection.getData()
      },
      onSubmit(formName) {
        if (this.formInline.packetTypes && this.formInline.packetFilter.length === 0) {
          this.$Message.error({ content: this.$t('selectGroup') })
          return false
        } else {
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.currentPage = 1
              this.queryList()
            } else {
              return false
            }
          })
        }
      },
      handleDelete(row) {
        this.rowData = row
        this.delVisible = true
      },
      handleforceDel() {
        this.msgboxFlag = this.delVisible = true
        this.rowData = {}
      },

      handleCancel() {
        this.$Message.info({ content: this.$t('cancelDelete') })
        this.deletePlat = this.delVisible = false
      },
      async handleOk() {
        // 新改版单个删除和批量除
        let paramsNew
        let configIds
        if (this.isSingleCancel) {
          // 单个删除
          configIds = this.rowData.configId
        } else {
          // 批量删除
          configIds = this.curSelect.join(',')
        }
        paramsNew = { configIds, forceDel: this.deletePlat }
        const res = await batchDelTimerConfig(paramsNew)
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.deletePlat = this.delVisible = false
          this.$refs.selection.deleteItems(configIds.toString().split(','))
          this.init()
        } else {
          this.$Message.error({ content: res.message })
        }
        if (this.builtInDetailsFlag) {
          this.builtInDetailsFlag = false
          this.builtIndexFlag = true
        }
      },
      handleExecute(configId) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('executeTiming'),
          onOk: async () => {
            let param = { configId }
            const res = await execTimerConfig(param)
            if (res.success) {
              if (res.code === '0') {
                this.$Message.success({ content: this.$t('submitCommand') })
              }
              if (this.builtInDetailsFlag) {
                this.builtInDetailsFlag = false
                this.builtIndexFlag = true
              }
              setTimeout(() => {
                this.init()
              }, 2000)
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({ content: res.message })
            }
          },
          onCancel: () => {},
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
        })
      },
      handleInstructions(row) {
        this.allInstructions = true
        this.builtInDetailsFlag = true
        this.builtIndexFlag = false
        this.tabName = 'name2'
        this.rowData = row
        this.editRow = row
        this.instructionsData = row
        this.instructionsData.projectCode = this.$store.state.projectCode
        this.getExecuDeviceList(row.configId, 20, 1)
      },
      viewAllInstruction() {
        this.builtIndexFlag = false
        this.viewAllHistoryFlag = true
        this.allInstructions = true
        this.instructionsData = {
          projectCode: this.$store.state.projectCode,
        }
      },
      empty() {
        this.formInline.status = ''
        this.formInline.execute = ''
        this.formInline.modelStatus = ''
        this.formInline.mac = ''
        this.$nextTick(() => {
          this.$refs.selection.reset()
        })
      },
    },
    watch: {
      '$store.state.projectCode': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.init()
          }
        },
      },
    },
    components: {
      Edit,
      BatchEdit,
      PwsSeconedCheckVue,
      CommandFeedback,
    },
  }
</script>
<style lang="less" scoped>
  .pd-bottom {
    // border-bottom:1px solid #999999;
    padding-bottom: 5px;
  }
  .checkboxlist {
    display: block;
    margin: 0 0 20px 0;
  }
  .wm320 {
    margin: 15px auto;
    //   width: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cons-titles {
    display: flex;
    justify-content: space-between;
    padding: 20px 10px;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 40px;
  }
  .TC-deviceboxs {
    padding: 10px;
    background: rgba(92, 92, 92, 0.5);
    border: 1px solid #999999;
    color: #999999;
  }
  .no-complete {
    .ivu-steps-title {
      color: #999 !important;
    }
  }
  .step-control {
    /deep/ .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner {
      background-color: transparent !important;
    }
    /deep/.ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner {
      background-color: transparent !important;
    }
    /deep/.ivu-steps-status-process .ivu-steps-main .ivu-steps-title {
      padding-top: 3px !important;
    }
    /deep/.ivu-steps-item.ivu-steps-status-finish .ivu-steps-title {
      padding-top: 3px !important;
    }
    /deep/.ivu-steps-item.ivu-steps-status-wait .ivu-steps-title {
      padding-top: 3px !important;
    }
  }
  .head-Conts {
    background: #1a202e;
    border-radius: 5px;
    margin: 10px 0;
    padding: 20px 10px 15px 10px;
  }
  .end-flexs {
    text-align: right;
  }
  .execu-list-title {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    padding-bottom: 30px;
  }
  .es-info {
    margin-left: 20px;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 400;
  }
  .tool-Tips {
    display: flex;
    margin: 15px;
    background: rgba(153, 153, 153, 0.05);
    color: #999999;
    border: 1px solid #888b92;
    padding: 10px 10px;
  }
  #BuiltInTiming {
    .BuiltInTiming-head {
      display: flex;
      padding: 10px;
      background: #1a202e;
    }
    .fr {
      text-align: right;
    }

    .table {
      background: #1a202e;
      padding: 20px;
      margin-top: 10px;
    }
    .tableHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      h3 {
        font-size: 16px;
      }
      span {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
      }
      Button {
        margin: 0 5px;
      }
    }
  }
  .titles {
    background: #1a202e;
    border: 1px solid #535b6c;
    border-radius: 4px;
  }
  .ivu-form-item {
    margin-bottom: 0;
  }
  .ivu-btn-text:hover {
    color: #fff !important;
  }
  /deep/.ivu-table-body {
    // height: 600px;
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .dialog-footer {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  /deep/.ivu-modal-footer {
    padding: 0 0 0 0 !important;
    border: none;
  }
</style>
