<template>
  <div class="batch">
    <div class="batchTable">
      <Row class="header">
        <Col :span="12">
          <h3>{{ $t('configDeviceList') }}</h3>
        </Col>
        <Col :span="12" style="text-align: right">
          <Button type="primary" @click.native.prevent="handleSelectDevice">{{ $t('selectDevice') }}</Button>
          <Button type="text" class="b-dger" @click.native.prevent="handleEmpty">{{ $t('clearAll') }}</Button>
        </Col>
      </Row>

      <div class="scroll" :style="innerComponentHeight">
        <Table :data="devices" :columns="devicesColumn" style="width: 100%">
          <template slot-scope="{ row }" slot="macname">
            <div>{{ row.name }}</div>
          </template>
          <template slot-scope="{ row, index }" slot="line">
            <template v-if="row.equipmentType !== 22">
              <Button class="btn" @click="handleLine(row, index)">{{ $t('lineSelected') }}</Button>
              <Tag v-for="(tag, index) in devices[index].tags" :key="index" closable @on-close="handleCloseTag(tag, index)">
                {{ tag.title }}
              </Tag>
            </template>
            <template v-else>-</template>
          </template>
          <template slot-scope="{ row }" slot="position">
            <div>{{ row.build + '\xa0\xa0\xa0' + row.unit + '\xa0\xa0\xa0' + row.room }}</div>
          </template>

          <template slot-scope="{ row }" slot="status">
            <span v-show="row.others.online === -1" class="b-info">{{ $t('disconnected') }}</span>
            <span v-show="row.others.online === 0" class="b-danger">{{ $t('offline') }}</span>
            <span v-show="row.others.online === 1" class="b-success">{{ $t('online') }}</span>
          </template>

          <template slot-scope="{ index }" slot="operating">
            <Button @click.native="deleteRow(devices, index)" class="top-padding-bottom" type="text">
              {{ $t('remove') }}
            </Button>
          </template>
        </Table>
      </div>
    </div>
    <Row class="descriptionTitle">
      <Col>
        <div class="description-title">{{ $t('explanation') + '：' }}</div>
        <div class="description">{{ '1. ' + $t('description1') }}</div>
        <div class="description">{{ '2. ' + $t('description2') }}</div>
      </Col>
    </Row>
    <Row class="select-wrap" v-if="dashedIndex === -1">
      <Form ref="form" :model="cmd" class="form-wrap" :label-width="120" @submit.native.prevent>
        <FormItem :label="$t('operationType') + '：'">
          <Select v-model="cmd.value" :placeholder="$t('pleaseSelect')" style="width: 200px">
            <Option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </FormItem>
      </Form>
      <Col v-show="cmd.value === 'SET_TITLE'">
        <Form ref="titleForm" :model="titleForm" @submit.native.prevent :rules="titleRules" class="form-wrap" :label-width="120">
          <FormItem :label="$t('lineName') + '：'" prop="name">
            <Input v-model="titleForm.name"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('titleForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>
      <Col v-show="cmd.value === 'LIMIT_POWER'">
        <Form ref="powerForm" :model="powerForm" @submit.native.prevent class="form-wrap" :label-width="120">
          <!-- :rules="powerRules" -->
          <FormItem :label="$t('powerAlarmUpperLimit')" prop="limit">
            <div class="formt">
              <Input v-model="powerForm.limit"></Input>
              <span class="power-unit">W</span>
            </div>
          </FormItem>
          <FormItem :label="$t('powerWarnUpperLimit')" prop="warnLimit">
            <div class="formt">
              <Input v-model="powerForm.warnLimit"></Input>
              <span class="power-unit">W</span>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('powerForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>
      <Col v-show="cmd.value === 'LIMIT_CURRENT'">
        <Form ref="currentForm" :model="currentForm" @submit.native.prevent class="form-wrap" :label-width="120">
          <!-- :rules="currentRules" -->
          <FormItem :label="$t('ampereAlarmUpperLimit')" prop="limit">
            <div class="formt">
              <Input v-model="currentForm.limit"></Input>
              <span class="power-unit">A</span>
            </div>
          </FormItem>
          <FormItem :label="$t('ampereWarnUpperLimit')" prop="warnLimit">
            <div class="formt">
              <Input v-model="currentForm.warnLimit"></Input>
              <span class="power-unit">A</span>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('currentForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>
      <Col v-show="cmd.value === 'LIMIT_LEAKAGE_CURRENT'">
        <Form ref="leakagecurrentForm" :model="leakagecurrentForm" @submit.native.prevent class="form-wrap" :label-width="170">
          <!-- :rules="leakageCurrentRules" -->
          <FormItem :label="$t('leakageCurrentAlarmUpperLimit')" prop="limit">
            <div class="formt">
              <Input v-model="leakagecurrentForm.limit"></Input>
              <span class="power-unit">mA</span>
            </div>
          </FormItem>
          <FormItem :label="$t('leakageCurrentWarnUpperLimit')" prop="warnLimit">
            <div class="formt">
              <Input v-model="leakagecurrentForm.warnLimit"></Input>
              <span class="power-unit">mA</span>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('leakagecurrentForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>
      <Col v-show="cmd.value === 'LIMIT_TEMPERATURE'">
        <Form ref="temperatureForm" :model="temperatureForm" @submit.native.prevent class="form-wrap" :label-width="150">
          <!-- :rules="temperatureRules" -->
          <FormItem :label="$t('temperatureAlarmUpperLimit')" prop="limit">
            <div class="formt">
              <Input v-model="temperatureForm.limit"></Input>
              <span class="power-unit">℃</span>
            </div>
          </FormItem>
          <FormItem :label="$t('temperatureWarnUpperLimit')" prop="warnLimit">
            <div class="formt">
              <Input v-model="temperatureForm.warnLimit"></Input>
              <span class="power-unit">℃</span>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('temperatureForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>
      <Col v-show="cmd.value === 'THRESHOLD'" :span="17">
        <ThresholdList ref="ThresholdListRef" @saveThresholdList="saveThresholdList"></ThresholdList>
      </Col>
      <Col v-show="cmd.value === 'LIMIT_VOLTAGE'">
        <Form ref="voltageForm" :model="voltageForm" @submit.native.prevent class="form-wrap" :label-width="120">
          <!-- :rules="voltageRules" -->
          <FormItem :label="$t('voltAlarmUpperLimit')" prop="voltageH">
            <div class="formt">
              <Input v-model="voltageForm.voltageH"></Input>
              <span class="power-unit">V</span>
            </div>
          </FormItem>
          <FormItem :label="$t('voltWarnUpperLimit')" prop="voltageHWarn">
            <div class="formt">
              <Input v-model="voltageForm.voltageHWarn"></Input>
              <span class="power-unit">V</span>
            </div>
          </FormItem>
          <FormItem :label="$t('voltAlarmDownLimit')" prop="voltageL">
            <div class="formt">
              <Input v-model="voltageForm.voltageL"></Input>
              <span class="power-unit">V</span>
            </div>
          </FormItem>
          <FormItem :label="$t('voltWarnDownLimit')" prop="voltageLWarn">
            <div class="formt">
              <Input v-model="voltageForm.voltageLWarn"></Input>
              <span class="power-unit">V</span>
            </div>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('voltageForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>
      <Col v-show="cmd.value === 'SETWIRING'">
        <Form ref="setwiringForm" :model="setwiringForm" @submit.native.prevent :rules="wiringRules" class="form-wrap" :label-width="120">
          <FormItem :label="$t('wiringMethod')" prop="wiring">
            <Select v-model="setwiringForm.wiring" :placeholder="$t('pleaseSelect')" class="w200">
              <Option key="-1" :label="$t('directInputLine')" value="-1" class="w200"></Option>
              <Option v-for="n in 29" :key="n" :label="n - 1 === 0 ? $t('mainRoad') : $t('line') + (n - 1)" :value="n"></Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('setwiringForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>
      <Col v-show="cmd.value === 'SETLOGINPWD'">
        <Form ref="setloginpwdForm" :model="setloginpwdForm" @submit.native.prevent :rules="passwordRules" class="form-wrap" :label-width="120">
          <FormItem :label="$t('newPassword')" prop="newPassword">
            <Input v-model="setloginpwdForm.newPassword" type="password"></Input>
          </FormItem>
          <FormItem :label="$t('confirmNewPassword')" prop="confirmNewPassword">
            <Input v-model="setloginpwdForm.confirmNewPassword" type="password"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('setloginpwdForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>
      <Col v-show="cmd.value === 'SETWIRELESS'">
        <Form ref="setwirelessForm" :model="setwirelessForm" @submit.native.prevent :rules="wirelessRules" class="form-wrap" :label-width="120">
          <FormItem label="SSID" prop="ssid">
            <Input v-model="setwirelessForm.ssid" type="password"></Input>
          </FormItem>
          <FormItem :label="$t('password')" prop="password">
            <Input v-model="setwirelessForm.password" type="password"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('setwirelessForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>
      <Col v-show="cmd.value === 'UPDATETIMER'">
        <Form ref="upadatetimerForm" :model="upadatetimerForm" @submit.native.prevent :rules="timerRules" :label-width="120">
          <!-- <FormItem :label="$t('line') + '：'" prop="checkedLines" style="width:100%">
              <label slot="label" class="slot-label pointer" @click="handleTimerLines">{{$t('lineSelected')}}</label>
              <Tag
                :key="tag"
                v-for="tag in upadatetimerForm.checkedLines"
                closable
                :disable-transitions="false"
                @on-close="handleTimerClose(tag)">
                {{(tag === 1) ? $t('mainRoad') : $t('line') + (tag - 1) }}
              </Tag>
            </FormItem> -->
          <FormItem :label="$t('type') + '：'">
            <Select v-model="upadatetimerForm.type" @on-change="handleTypeChange">
              <Option v-for="item in types" :key="item.value" :value="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('time') + '：'">
            <Col :span="24" v-show="upadatetimerForm.type === 'single'">
              <DatePicker @on-change="handleUpadate" v-model="upadatetimerForm.time" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" :editable="false" :clearable="false" :placeholder="$t('pleaseSelectDateTime')"></DatePicker>
            </Col>
            <Col :span="24" v-if="upadatetimerForm.type === 'cycle'">
              <TimePicker @on-change="handleUpadate" v-model="upadatetimerForm.time" format="HH:mm" value-format="HH:mm" :editable="false" :clearable="false" :placeholder="$t('pleaseSelectDateTime')"></TimePicker>
            </Col>
          </FormItem>
          <FormItem v-if="upadatetimerForm.type === 'cycle'">
            <label slot="label" class="slot-label pointer" @click="handleRepeat">{{ '+' + $t('selectRepeat') }}</label>
            <Tag :key="tag" v-for="tag in upadatetimerForm.week" closable :disable-transitions="false" @on-close="handleRepeatClose(tag)">
              <!-- <span >{{ $t('dialog.week') + tag }}</span> -->
              <span v-show="tag === '日'">{{ $t('day') }}</span>
              <span v-show="tag === '一'">{{ $t('monday') }}</span>
              <span v-show="tag === '二'">{{ $t('tuesday') }}</span>
              <span v-show="tag === '三'">{{ $t('wednesday') }}</span>
              <span v-show="tag === '四'">{{ $t('thursday') }}</span>
              <span v-show="tag === '五'">{{ $t('friday') }}</span>
              <span v-show="tag === '六'">{{ $t('saturday') }}</span>
            </Tag>
          </FormItem>
          <FormItem :label="$t('action') + '：'" prop="action">
            <Select v-model="upadatetimerForm.action" @on-change="handleAction">
              <Option v-for="item in actions" :key="item.value" :value="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('upadatetimerForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>
      <Col v-if="cmd.value === 'SET_ENABLE_ALARM'">
        <Form ref="enableAlarmForm" :model="enableAlarmForm" :rules="enableAlarmRules" class="" :label-width="120">
          <FormItem :label="$t('enableBitSetting') + '：'">
            <CheckboxGroup v-model="enableAlarmForm.enableBits" @on-change="handleCheckedBitsChange">
              <Checkbox v-for="(bit, index) in bits" :label="bit" :key="index" :disabled="bit === $t('reserved')">{{ bit }}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('enableAlarmForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>
      <Col v-if="cmd.value === 'SET_ENABLE_TRIP'">
        <Form ref="enableTripForm" :model="enableTripForm" :label-width="120">
          <FormItem :label="$t('enableBitSetting') + '：'">
            <CheckboxGroup v-model="enableTripForm.enableBits" @on-change="handleCheckedTripsChange">
              <Checkbox v-for="(bit, index) in trips" :label="bit" :key="index" :disabled="bit === $t('reserved')">{{ bit }}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('enableTripForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>

      <Col v-if="cmd.value === 'POWER'" style="margin-left: 10px">
        <Form ref="powerKwHForm" :model="powerKwHForm" @submit.native.prevent :rules="powerKwHRules" class="powerform" :label-width="120">
          <FormItem :label="$t('detectionPeriod')" :label-width="126">
            <div style="display: flex">
              <Select v-model="powerKwH" style="width: 200px">
                <Option v-for="item in datePickerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <template v-if="powerKwH === 2">
                <div class="timer">
                  <Select v-model="StartMonth" style="width: 100px" class="startMonth">
                    <Option v-for="item in monthData" :value="item.value" :key="item">{{ item.label }}</Option>
                  </Select>
                  {{ $t('to') }}
                  <Select v-model="EndMonth" style="width: 100px" class="endMonth">
                    <Option v-for="item in monthData" :value="item.value" :key="item">{{ item.label }}</Option>
                  </Select>
                </div>
              </template>
              <template v-if="powerKwH === 3">
                <div class="timer">
                  <DatePicker type="date" :placeholder="$t('pleaseSelect')" format="MM-dd" style="width: 100px" @on-change="startDay"></DatePicker>
                  {{ $t('to') }}
                  <DatePicker type="date" :placeholder="$t('pleaseSelect')" format="MM-dd" style="width: 100px" @on-change="endDay"></DatePicker>
                </div>
              </template>
            </div>
          </FormItem>
          <FormItem :label="$t('warningValue') + '（kW·h）'" prop="alert" :label-width="126">
            <Input :placeholder="$t('pleaseEnter')" v-model="powerKwHForm.alert" style="width: 200px" />
          </FormItem>
          <FormItem :label="$t('alarmValue') + '（kW·h）'" prop="alarm" :label-width="126">
            <Input :placeholder="$t('pleaseEnter')" v-model="powerKwHForm.alarm" style="width: 200px" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('powerKwHForm')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>

      <Col v-if="cmd.value === 'EFEES'" style="margin-left: 10px">
        <Form ref="powerEfeesFrom" :model="powerEfeesFrom" @submit.native.prevent :rules="powerEfeesRules" class="powerform" :label-width="120">
          <FormItem :label="$t('detectionPeriod')" :label-width="126">
            <div style="display: flex">
              <Select v-model="powerKwH" style="width: 200px">
                <Option v-for="item in datePickerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <template v-if="powerKwH === 2">
                <div class="timer">
                  <Select v-model="StartMonth" style="width: 100px" class="startMonth">
                    <Option v-for="item in monthData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  {{ $t('to') }}
                  <Select v-model="EndMonth" style="width: 100px" class="endMonth">
                    <Option v-for="item in monthData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </div>
              </template>
              <template v-if="powerKwH === 3">
                <div class="timer">
                  <DatePicker type="date" :placeholder="$t('pleaseSelect')" format="MM-dd" style="width: 100px" @on-change="startDay"></DatePicker>
                  {{ $t('to') }}
                  <DatePicker type="date" :placeholder="$t('pleaseSelect')" format="MM-dd" style="width: 100px" @on-change="endDay"></DatePicker>
                </div>
              </template>
            </div>
          </FormItem>
          <FormItem :label="$t('warningValue1')" prop="alert" :label-width="126">
            <Input :placeholder="$t('pleaseEnter')" v-model="powerEfeesFrom.alert" style="width: 200px" />
          </FormItem>
          <FormItem :label="$t('alarmValue1')" prop="alarm" :label-width="126">
            <Input :placeholder="$t('pleaseEnter')" v-model="powerEfeesFrom.alarm" style="width: 200px" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm('powerEfeesFrom')">{{ $t('save') }}</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <Row class="select-wrap" v-else>
      <Form ref="form" :model="cmd" class="form-wrap" :label-width="120" @submit.native.prevent>
        <FormItem :label="$t('operationType') + '：'">
          <Select v-model="cmd.value" :placeholder="$t('pleaseSelect')" style="width: 200px">
            <Option v-for="item in yzsoptions" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </FormItem>
      </Form>
      <Col v-show="cmd.value === 'SET_OPEN'" class="ml-20">
        <Button type="primary" @click="handleOpendzy('open')">{{ $t('save') }}</Button>
      </Col>
      <Col v-show="cmd.value === 'SET_OFF'" class="ml-20">
        <Button type="primary" @click="handleOpendzy('off')">{{ $t('save') }}</Button>
      </Col>
      <Col v-show="cmd.value === 'SET_RESET'" class="ml-20">
        <Button type="primary" @click="handleOpendzy('reset')">{{ $t('save') }}</Button>
      </Col>
      <Col v-show="cmd.value === 'SET_RESTART'" class="ml-20">
        <Button type="primary" @click="handleOpendzy('restart')">{{ $t('save') }}</Button>
      </Col>
    </Row>
    <Modal id="equipment" :title="$t('selectDevice')" :close-on-click-modal="false" custom-class="custom-select-dialog" :before-close="handleCancel" v-model="selectFlag" width="75%">
      <div>
        <Form :model="ruleForm" ref="ruleForm" class="rule-form">
          <FormItem>
            <Row :gutter="16">
              <Col :span="4" class="left-padding-right">
                <Input v-model="ruleForm.build" :placeholder="$t('building')"></Input>
              </Col>
              <Col :span="4" class="left-padding-right ml-5">
                <Input v-model="ruleForm.unit" :placeholder="$t('unit1')"></Input>
              </Col>
              <Col :span="4" class="left-padding-right ml-5">
                <Input v-model="ruleForm.mac" :placeholder="$t('equipmentNo')"></Input>
              </Col>
              <Col :span="8">
                <Button type="primary" @click="handleSearch">{{ $t('query') }}</Button>
              </Col>
              <Col :span="3" class="tr" style="padding-right: 0">
                <Button type="primary" :disabled="selectionFalg" @click="handleOk">{{ $t('saveSelect') }}</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
        <Table class="mt-20 device-wrap" :data="boxesData" :columns="boxesColumn" ref="boxtable" @on-selection-change="handleSelectionChange">
          <template slot-scope="{ row }" slot="macname">
            <div>{{ row.name }}</div>
          </template>
          <template slot-scope="{ row, index }" slot="line">
            <Button class="btn" @click="handleLine(row, index)">{{ $t('select1') }}</Button>
            <Tag v-for="(tag, index) in boxesData[index].tags" :key="index" :closable="true" @on-close="handleCloseTag(tag, index)">
              {{ tag.title }}
            </Tag>
          </template>
          <template slot-scope="{ row }" slot="position">
            <div>{{ row.build + '\xa0\xa0\xa0' + row.unit + '\xa0\xa0\xa0' + row.room }}</div>
          </template>

          <template slot-scope="{ row }" slot="status">
            <span v-show="row.others.online === -1" class="c-info">{{ $t('disconnected') }}</span>
            <span v-show="row.others.online === 0" class="c-danger">{{ $t('offline') }}</span>
            <span v-show="row.others.online === 1" class="c-success">{{ $t('online') }}</span>
          </template>

          <template slot-scope="{ row }" slot="operating">
            <Button style="color: #409eff" type="text" @click="handleMac(row)" :disabled="row._disabled">{{ $t('selectDevice') }}</Button>
          </template>
        </Table>
      </div>
      <span slot="footer" style="height: 60px">
        <Row style="padding: 10px">
          <Col :span="24" class="tc">
            <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current="currentPage" :page-size="20" layout="sizes, prev, pager, next" :total="total" show-elevator show-total></Page>
          </Col>
        </Row>
      </span>
    </Modal>
    <Modal id="equipment" :title="$t('channelList')" v-model="linesFlag" custom-class="channel-list">
      <Checkbox :indeterminate="isIndeterminate" v-model="checkAllLines" @change="handleCheckAllLinesChange">{{ $t('selectAll') }}</Checkbox>
      <div style="margin: 15px 0"></div>
      <CheckboxGroup v-model="enableAlarmForm.checkedLines" @change="handleCheckedLinesChange">
        <Checkbox v-for="o in 29" :label="o" :key="o">{{ o - 1 === 0 ? $t('mainRoad') : $t('line') + (o - 1) }}</Checkbox>
      </CheckboxGroup>
      <div slot="footer" class="dialog-footer">
        <Button type="primary" @click="linesFlag = false">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal id="equipment" :title="$t('channelList')" v-model="tripLinesFlag" custom-class="channel-list">
      <Checkbox :indeterminate="tripIsIndeterminate" v-model="checkAllTripLines" @change="handleCheckAllTripLinesChange">{{ $t('selectAll') }}</Checkbox>
      <div style="margin: 15px 0"></div>
      <CheckboxGroup v-model="enableTripForm.checkedLines" @change="handleCheckedTripLinesChange">
        <Checkbox v-for="o in 29" :label="o" :key="o">{{ o - 1 === 0 ? $t('mainRoad') : $t('line') + (o - 1) }}</Checkbox>
      </CheckboxGroup>
      <div slot="footer" class="dialog-footer">
        <Button type="primary" @click="tripLinesFlag = false">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal id="equipment" :title="$t('channelList')" v-model="timerLinesFlag" custom-class="channel-list">
      <Checkbox :indeterminate="timerIsIndeterminate" v-model="checkAllTimerLines" @on-change="handleCheckAllTimerLinesChange">{{ $t('selectAll') }}</Checkbox>
      <div style="margin: 15px 0"></div>
      <CheckboxGroup v-model="upadatetimerForm.checkedLines" @on-change="handleCheckedTimerLinesChange">
        <Checkbox v-for="o in 29" :label="o" :key="o">{{ o - 1 === 0 ? $t('mainRoad') : $t('line') + (o - 1) }}</Checkbox>
      </CheckboxGroup>
      <div slot="footer" class="dialog-footer">
        <Button type="primary" @click="timerLinesFlag = false">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal id="equipment" :title="$t('selectRepeat')" v-model="repeatFlag">
      <Checkbox :indeterminate="repeatIsIndeterminate" v-model="checkAllRepeat" @on-change="handleCheckAllRepeatChange">{{ $t('selectAll') }}</Checkbox>
      <div style="margin: 15px 0"></div>
      <CheckboxGroup v-model="upadatetimerForm.week" @on-change="handleCheckedWeekChange">
        <Checkbox v-for="item in week" :label="item.value" :key="item.value">{{ item.label }}</Checkbox>
      </CheckboxGroup>
      <div slot="footer" class="dialog-footer">
        <Button type="primary" @click="repeatFlag = false">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal id="equipments" :title="$t('channelList')" v-model="lineVisible" width="60%" append-to-body>
      <LineList :lineShowTags="lineShowTags" :mac="mac" :tags="tags" @sendChannels="receiveChannels" source="BuiltInTiming" v-if="lineVisible"></LineList>
      <div slot="footer"></div>
    </Modal>
    <Modal class-name="dyzModal" v-model="opendyz" :title="$t('actionTip')">
      <p class="ml20">{{ $t('confirmOpenLight') }}</p>
      <div slot="footer">
        <Button @click="yzssubmitForm('open')" type="primary">{{ $t('yes') }}</Button>
        <Button @click="opendyz = false">{{ $t('no') }}</Button>
      </div>
    </Modal>
    <Modal class-name="dyzModal" v-model="offdyz" :title="$t('actionTip')">
      <p class="ml20">{{ $t('confirmCloseLight') }}</p>
      <div slot="footer">
        <Button @click="yzssubmitForm('off')" type="primary">{{ $t('yes') }}</Button>
        <Button @click="offdyz = false">{{ $t('no') }}</Button>
      </div>
    </Modal>
    <Modal class-name="dyzModal" v-model="resetdyz" :title="$t('actionTip')">
      <p class="ml20">
        <Icon type="ios-information-circle" class="icon" />
        {{ $t('operationTip1') }}
      </p>
      <div slot="footer">
        <Button @click="yzssubmitForm('reset')" type="primary">{{ $t('yes') }}</Button>
        <Button @click="resetdyz = false">{{ $t('no') }}</Button>
      </div>
    </Modal>
    <Modal class-name="dyzModal" v-model="restartdyz" :title="$t('actionTip')">
      <p class="ml20">
        <Icon type="ios-information-circle" class="icon" />
        {{ $t('confirmRestartDevice') }}
      </p>
      <div slot="footer">
        <Button @click="yzssubmitForm('restart')" type="primary">{{ $t('yes') }}</Button>
        <Button @click="restartdyz = false">{{ $t('no') }}</Button>
      </div>
    </Modal>
    <!-- reset -->
  </div>
</template>
<script>
  import LineList from '../../Common/LineList.vue'
  import ThresholdList from './ThreeThreshold.vue'
  import {
    queryBoxes,
    modifyBoxsChnlTitle,
    modifyBoxsChnlPower,
    modifyBoxsChnlCurrent,
    modifyBoxsChnlLeakageCurrent,
    modifyBoxsChnlTemperature,
    modifyBoxsChnlVoltage,
    modifyBoxsChnlWiring,
    modifyBoxsWireless,
    modifyBoxsLoginPasswrod,
    modifyBoxsChnlAlarmEbable,
    modifyBoxsChnlTripEnable,
    modifyBoxsChnlTimer,
    modifyBoxsPowerFeeThreshold,
    modifyBoxsChnlThreeLevelAlarm,
  } from '@/api/multiManage/batchConfig'
  import { dataDay } from '../threShold/data'
  import { resetBatch, dimming, rebootBatch } from '@/api/public'
  export default {
    name: 'multiManage-batchConfig',
    components: {
      LineList,
      ThresholdList,
    },
    data() {
      return {
        offdyz: false,
        opendyz: false,
        devices: [],
        selectData: [],
        selectFlag: false,
        selectionFalg: true,
        macs: [],
        linesFlag: false,
        tripLinesFlag: false,
        timerLinesFlag: false,
        repeatFlag: false,
        isIndeterminate: false,
        tripIsIndeterminate: false,
        timerIsIndeterminate: false,
        repeatIsIndeterminate: false,
        checkAllLines: '',
        checkAllTripLines: '',
        checkAllTimerLines: '',
        actionVal: '',
        checkAllRepeat: '',
        devicesColumn: [
          { title: this.$t('equipmentNo'), key: 'mac', align: 'center' },
          { title: this.$t('deviceAliases'), slot: 'macname', align: 'center' },
          { title: this.$t('line'), slot: 'line', align: 'center' },
          { title: this.$t('position'), slot: 'position', align: 'center' },
          { title: this.$t('state'), slot: 'status', align: 'center' },
          { title: this.$t('operation'), slot: 'operating', align: 'center' },
        ],
        boxesColumn: [
          { type: 'selection', width: 60, align: 'center' },
          { title: this.$t('equipmentNo'), key: 'mac', align: 'center' },
          { title: this.$t('deviceAliases'), slot: 'macname', align: 'center' },
          { title: this.$t('position'), slot: 'position', align: 'center' },
          { title: this.$t('state'), slot: 'status', align: 'center' },
          { title: this.$t('operation'), slot: 'operating', align: 'center' },
        ],
        datetime: '',
        time: '',
        enableAlarmForm: { checkedLines: [], enableBits: [], platAlarmEnable: [0, 0, 0, 0].reverse().join(''), enableBitsObj: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse().join('') },
        enableTripForm: { checkedLines: [], enableBits: [], platAlarmEnable: [0, 0].reverse().join(''), enableBitsObj: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse().join('') },
        upadatetimerForm: { checkedLines: [], week: [], action: '', type: 'single', time: '' },
        boxesData: [],
        ruleForm: { mac: '', build: '', unit: '' },
        currentPage: 1,
        pageSize: 20,
        total: 0,
        bits: [
          this.$t('shortCircuitAlarm'),
          this.$t('surgeAlarm'),
          this.$t('overloadA'),
          this.$t('temperatureW'),
          this.$t('leakageAlarm'),
          this.$t('overCurrentAlarm'),
          this.$t('overVoltageAlarm'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('missingPhaseA'),
          this.$t('arcAlarm'),
          this.$t('underVoltageAlarm'),
          this.$t('overVoltageWarning'),
          this.$t('underVoltageWarning'),
          this.$t('leakageW'),
          this.$t('currentWarning'),
          this.$t('openingprotection'),
          this.$t('localMaintenance'),
          this.$t('malignantLoad'),
          this.$t('remoteLock'),
          this.$t('reserved'),
          this.$t('temperatureAlarm'),
          this.$t('unbalancedAlarm'),
          this.$t('wrongPhaseAlarm'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('electricVehiclePowerExceedingUpperLimitAlarm'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('powerAlarm'),
          this.$t('electricityWarning'),
          this.$t('electricityRateAlarm'),
          this.$t('earlyWarningCharge'),
        ],
        trips: [
          this.$t('shortCircuitAlarm') + this.$t('trip'),
          this.$t('surgeAlarm') + this.$t('trip'),
          this.$t('overloadA') + this.$t('trip'),
          this.$t('temperatureW') + this.$t('trip'),
          this.$t('leakageAlarm') + this.$t('trip'),
          this.$t('overCurrentAlarm') + this.$t('trip'),
          this.$t('overVoltageAlarm') + this.$t('trip'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('missingPhaseA') + this.$t('trip'),
          this.$t('arcAlarm') + this.$t('trip'),
          this.$t('underVoltageAlarm') + this.$t('trip'),
          this.$t('overVoltageWarning') + this.$t('trip'),
          this.$t('underVoltageWarning') + this.$t('trip'),
          this.$t('leakageW') + this.$t('trip'),
          this.$t('currentWarning') + this.$t('trip'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('malignantLoad') + this.$t('trip'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('temperatureAlarm') + this.$t('trip'),
          this.$t('unbalancedAlarm') + this.$t('trip'),
          this.$t('wrongPhaseTrip'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('electricVehiclePowerExceedingUpperLimitTrip'),
          this.$t('reserved'),
          this.$t('reserved'),
          this.$t('powerAlarmTripping'),
          this.$t('electricChargeAlarmTripping'),
        ],
        actions: [
          { value: '', label: this.$t('pleaseSelect') },
          { value: '1', label: this.$t('closing') },
          { value: '2', label: this.$t('opening') },
        ],
        types: [
          { value: 'single', label: this.$t('singleTiming') },
          { value: 'cycle', label: this.$t('cycleTiming') },
        ],
        cmd: { value: '' },
        yzsoptions: [
          { value: '', label: this.$t('pleaseSelect') },
          { value: 'SET_OPEN', label: this.$t('turnONLights') },
          { value: 'SET_OFF', label: this.$t('turnOffLights') },
          { value: 'SET_RESET', label: this.$t('reset1') },
          { value: 'SET_RESTART', label: this.$t('restart') },
        ],
        options: [
          { value: '', label: this.$t('pleaseSelect') },
          { value: 'SET_TITLE', label: this.$t('rename') },
          { value: 'LIMIT_POWER', label: this.$t('powerLimit') + this.$t('setting') },
          { value: 'LIMIT_CURRENT', label: this.$t('currentLimit') + this.$t('setting') },
          { value: 'LIMIT_LEAKAGE_CURRENT', label: this.$t('leakageLimit') + this.$t('setting') },
          { value: 'LIMIT_TEMPERATURE', label: this.$t('temperatureLimit') + this.$t('setting') },
          { value: 'LIMIT_VOLTAGE', label: this.$t('voltageUpperLowerLimits') + this.$t('setting') },
          { value: 'SETWIRING', label: this.$t('wiringMethod') + this.$t('setting') },
          { value: 'SETLOGINPWD', label: this.$t('device') + this.$t('password') + this.$t('setting') },
          { value: 'SETWIRELESS', label: this.$t('device') + this.$t('network') + this.$t('setting') },
          { value: 'UPDATETIMER', label: this.$t('device') + this.$t('timing') + this.$t('setting') },
          { value: 'SET_ENABLE_ALARM', label: this.$t('enableAlarm') + this.$t('setting') },
          { value: 'SET_ENABLE_TRIP', label: this.$t('releaseEnable') + this.$t('setting') },
          { value: 'POWER', label: this.$t('leakageKwh') },
          { value: 'EFEES', label: this.$t('efee') },
        ],
        week: [
          { value: '日', label: this.$t('day') },
          { value: '一', label: this.$t('monday') },
          { value: '二', label: this.$t('tuesday') },
          { value: '三', label: this.$t('wednesday') },
          { value: '四', label: this.$t('thursday') },
          { value: '五', label: this.$t('friday') },
          { value: '六', label: this.$t('saturday') },
        ],
        titleForm: { line: '', name: '' },
        titleRules: {
          line: [{ required: true, message: this.$t('pleaseSelect') + this.$t('line') + '!', trigger: 'change', type: 'number' }],
          name: [{ required: true, message: this.$t('pleaseEnter') + this.$t('lineName') + '!', trigger: 'blur' }],
        },
        powerForm: { line: '', limit: '', warnLimit: '' },
        // powerRules: {
        //   line: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('page.table.line') + '!', trigger: 'change', type: 'number' }],
        //   limit: [{ required: true, message: '请输入功率报警上限!', trigger: 'blur' }],
        //   warnLimit: [{ required: true, message: '请输入功率预警上限!', trigger: 'blur' }],
        // },
        currentForm: { line: '', limit: '', warnLimit: '' },
        // currentRules: {
        //   line: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('page.table.line') + '!', trigger: 'change', type: 'number' }],
        //   limit: [{ required: true, message: '请输入电流报警警上限!', trigger: 'blur' }],
        //   warnLimit: [{ required: true, message: '请输入电流预警上限!', trigger: 'blur' }],
        // },
        leakagecurrentForm: { line: '', limit: '', warnLimit: '' },
        // leakageCurrentRules: {
        //   line: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('page.table.line') + '!', trigger: 'change', type: 'number' }],
        //   limit: [{ required: true, message: '请输入漏电流报警上限!', trigger: 'blur' }],
        //   warnLimit: [{ required: true, message: '请输入漏电流预警上限!', trigger: 'blur' }],
        // },
        temperatureForm: { line: '', limit: '', warnLimit: '' },
        // temperatureRules: {
        //   line: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('page.table.line') + '!', trigger: 'change', type: 'number' }],
        //   limit: [{ required: true, message: '请输入温度报警上限!', trigger: 'blur' }],
        //   warnLimit: [{ required: true, message: '请输入温度预警上限!', trigger: 'blur' }],
        // },
        voltageForm: {
          line: '',
          voltageH: '',
          voltageL: '',
          voltageHWarn: '',
          voltageLWarn: '',
        },
        // voltageRules: {
        //   line: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('page.table.line') + '!', trigger: 'change', type: 'number' }],
        //   voltageH: [{ required: true, message: '请输入电压报警上限!', trigger: 'blur' }],
        //   voltageL: [{ required: true, message: '请输入电压报警下限!', trigger: 'blur' }],
        //   voltageHWarn: [{ required: true, message: '请输入电压预警上限!', trigger: 'blur' }],
        //   voltageLWarn: [{ required: true, message: '请输入电压预警下限!', trigger: 'blur' }],
        // },

        setwiringForm: {
          wiring: '',
        },
        wiringRules: {
          wiring: [{ required: true, message: this.$t('pleaseSelect') + this.$t('wiringMethod') + '!', trigger: 'blur' }],
        },
        setloginpwdForm: {
          newPassword: '',
          confirmNewPassword: '',
        },
        passwordRules: {
          newPassword: [{ required: true, message: this.$t('enterElectricBoxPassword'), trigger: 'blur' }],
          confirmNewPassword: [{ required: true, message: this.$t('newPasswordValidate') + '!', trigger: 'blur' }],
        },
        setwirelessForm: {
          ssid: '',
          password: '',
        },
        wirelessRules: {
          ssid: [{ required: true, message: this.$t('enterSSID'), trigger: 'blur' }],
          password: [{ required: true, message: this.$t('pleaseInputPwd') + '!', trigger: 'blur' }],
        },
        enableAlarmRules: {
          checkedLines: [{ type: 'array', required: true, message: this.$t('pleaseSelect') + this.$t('line'), trigger: 'change' }],
        },
        enableTripRules: {
          checkedLines: [{ type: 'array', required: true, message: this.$t('pleaseSelect') + this.$t('line'), trigger: 'change' }],
        },
        timerRules: {
          checkedLines: [{ type: 'array', required: true, message: this.$t('pleaseSelect') + this.$t('line'), trigger: 'change' }],
          action: [{ required: true, message: this.$t('pleaseSelect') + this.$t('action'), trigger: 'change' }],
          time: [{ required: true, message: this.$t('pleaseSelect') + this.$t('time'), trigger: 'change' }],
          week: [{ required: true, message: this.$t('pleaseSelect') + this.$t('repeat') + this.$t('time'), trigger: 'change' }],
        },
        powerKwHForm: {
          alert: '',
          alarm: '',
        },
        powerKwHRules: {
          alert: [{ required: true, message: this.$t('warnValueNotNull'), trigger: 'blur' }],
          alarm: [{ required: true, message: this.$t('alarmValueNotNull'), trigger: 'blur' }],
        },
        powerEfeesFrom: {
          alert: '',
          alarm: '',
        },
        powerEfeesRules: {
          alert: [{ required: true, message: this.$t('warningFeeCannotEmpty'), trigger: 'blur' }],
          alarm: [{ required: true, message: this.$t('alarmingFeeCannotEmpty'), trigger: 'blur' }],
        },
        powerKwH: '',
        datePickerList: [
          { value: 1, label: this.$t('everyday') },
          { value: 2, label: this.$t('monthly') },
          { value: 3, label: this.$t('annually') },
        ],
        StartMonth: '',
        EndMonth: '',
        monthData: dataDay,
        batchHeight: { position: 'relative', height: this.$store.state.batchHeight },
        innerComponentHeight: { position: 'relative', height: this.$store.state.innerComponentHeight },
        lineVisible: false,
        mac: '',
        tagsList: [],
        tags: [],
        ts: '',
        index: '',
        lineShowTags: [],
        startDayValue: '',
        endDayValue: '',
        dashedIndex: -1,
        resetdyz: false,
        restartdyz: false,
      }
    },
    mounted() {
      this.cmd.value = this.$route.params.value ? this.$route.params.value : ''
      const isFuTian = window.sessionStorage.getItem('isFuTian')
      if (isFuTian) {
        this.options.splice(7, 0, { value: 'THRESHOLD', label: this.$t('thirdLevelAlarmThresholdConfiguration') })
      }
    },
    methods: {
      handleOpendzy(type) {
        if (type === 'open') {
          this.opendyz = true
        } else if (type === 'off') {
          this.offdyz = true
        } else if (type === 'reset') {
          this.resetdyz = true
        } else if (type === 'restart') {
          this.restartdyz = true
        }
      },
      yzssubmitForm(formName) {
        this.macs = []
        this.address = []
        this.tagsList = []
        this.devices.map(item => {
          this.macs.push(item.mac)
          this.address.push(`${item.build}${item.unit}${item.room}`)
        })
        if (formName === 'open') {
          let params = { mac: `${this.macs}`, light: '60', adjustment: '0', address: `${this.address}` }
          dimming(params).then(res => {
            if (res.success) {
              this.opendyz = false
              this.$Message.success({ content: this.$t('submitCommand') })
            } else if (res.code === '1') {
              this.$Message.error({ content: res.data })
            }
          })
        } else if (formName === 'off') {
          let params = { mac: `${this.macs}`, light: '0', adjustment: '0', address: `${this.address}` }
          dimming(params).then(res => {
            if (res.success) {
              this.offdyz = false
              this.$Message.success({ content: this.$t('submitCommand') })
            } else if (res.code === '1') {
              this.$Message.error({ content: res.data })
            }
          })
        } else if (formName === 'reset') {
          let params = { mac: `${this.macs}`, address: `${this.address}` }
          resetBatch(params).then(res => {
            if (res.success) {
              this.resetdyz = false
              this.$Message.success({ content: this.$t('submitCommand') })
            } else if (res.code === '1') {
              this.$Message.error({ content: res.data })
            }
          })
        } else if (formName === 'restart') {
          let params = { mac: `${this.macs}`, address: `${this.address}` }
          rebootBatch(params).then(res => {
            if (res.success) {
              this.restartdyz = false
              this.$Message.success({ content: this.$t('submitCommand') })
            } else if (res.code === '1') {
              this.$Message.error({ content: res.data })
            }
          })
        }
      },
      startDay(val) {
        this.startDayValue = `${val.split('-')[0]}${val.split('-')[1]}`
      },
      endDay(val) {
        this.endDayValue = `${val.split('-')[0]}${val.split('-')[1]}`
      },
      handleLine(row, index) {
        this.lineShowTags = []
        row.tags.forEach(item => {
          this.lineShowTags.push(item.addr + '-' + item.title)
        })
        this.index = index
        this.mac = row.mac
        this.lineVisible = true
      },
      receiveChannels(val) {
        this.devices[this.index].tags = val
        this.lineVisible = false
      },
      handleSelectDevice() {
        this.dashedIndex = this.devices.findIndex(item => item.equipmentType === 22)
        this.queryList()
        this.selectFlag = true
      },
      handleSearch() {
        this.currentPage = 1
        this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
      },
      queryList(build, unit, mac) {
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          projectCode: this.$store.state.projectCode,
        }
        if (build) params.build = build
        if (unit) params.unit = unit
        if (mac) params.key = mac
        queryBoxes(params)
          .then(res => {
            if (res.success) {
              this.selectData = []
              this.total = res.total
              let newArr = res.datas
              let newdisabled = this.devices.findIndex(item => item.equipmentType === 22)
              newArr.forEach(val => {
                this.devices.map(item => {
                  if (val.mac === item.mac) {
                    val._checked = true
                  }
                })
                if (newdisabled === 0) {
                  if (val.equipmentType === 22) {
                    val._disabled = false
                  } else {
                    val._disabled = true
                  }
                }

                if (newdisabled === -1 && this.devices.length > 0) {
                  if (val.equipmentType === 22) {
                    val._disabled = true
                  } else {
                    val._disabled = false
                  }
                }
                val.tags = []
              })
              this.boxesData = newArr
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({ content: res.message })
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
      handleSizeChange(val) {
        this.pageSize = val
        this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
      },
      handleCurrentChange(val) {
        if (this.selectData.length > 0) {
          this.$Modal.warning({
            title: this.$t('tip'),
            content: this.$t('confirmSaveCurrentSelectedDeivce'),
            onOk: () => {
              if (this.devices.length > 0) {
                this.devices.forEach(item => {
                  this.selectData = this.selectData.filter(keyItem => keyItem.mac !== item.mac)
                })
                this.devices = this.devices.concat(this.selectData)
              } else {
                this.devices = this.selectData
              }
              this.$Message.success({
                content: this.$t('save') + this.$t('success') + '！',
              })
              this.currentPage = val
              this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
            },
            onCancel: () => {
              this.$Message.info({
                coontent: this.$t('canceled') + this.$t('save'),
              })
              this.currentPage = val
              this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
            },
          })
        } else {
          this.currentPage = val
          this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
        }
      },
      handleSelectionChange(val, row) {
        let index = ''
        index = val.findIndex(item => item.equipmentType === 22)
        if (val.length === 0) {
          this.selectionFalg = true
        } else {
          this.selectionFalg = false
        }
        if (val.length === 20) {
          val.map((item, index) => {
            if (item.equipmentType === 22) {
              val.splice(index, 1)
            }
          })
        }
        this.selectData = val
        let data01 = JSON.parse(JSON.stringify(this.$refs.boxtable.objData))
        for (let i = 0; i <= 19; i++) {
          if (index !== 0 && val.length > 0) {
            data01[i]._isDisabled = data01[i].equipmentType === 22
          } else if (index === 0 && val.length > 0) {
            data01[i]._isDisabled = data01[i].equipmentType !== 22
          } else {
            data01[i]._isDisabled = false
          }
        }
        this.$refs.boxtable.objData = data01
      },
      handleCloseTag(tag, index) {
        this.devices[this.index].tags.splice(index, 1)
      },
      handleMac(row) {
        if (this.devices.length > 0) {
          this.devices = this.devices.filter(item => item.mac !== row.mac)
          this.devices.push(row)
        } else {
          this.devices.push(row)
        }
        this.dashedIndex = this.devices.findIndex(item => item.equipmentType === 22)
        this.selectFlag = false
      },
      handleOk() {
        if (this.devices.length > 0) {
          this.devices.forEach(item => {
            this.selectData = this.selectData.filter(keyItem => keyItem.mac !== item.mac)
          })
          this.devices = this.devices.concat(this.selectData)
        } else {
          this.devices = this.selectData
        }
        this.dashedIndex = this.devices.findIndex(item => item.equipmentType === 22)
        this.selectFlag = false
      },
      handleEmpty() {
        this.devices = []
      },
      handleCancel() {
        this.ruleForm = { mac: '', build: '', unit: '' }
        this.currentPage = 1
        this.selectFlag = false
      },
      deleteRow(rows, index) {
        this.devices.splice(index, 1)
      },
      async saveThresholdList(val) {
        if (!this.devices.length) {
          return this.$Message.error(this.$t('pleaseTickRoom'))
        }
        const config = val.reduce((sum, item) => {
          sum[item.type] = item.value
          return sum
        }, {})
        let params = {
          macAddrs: this.devices.map(v => {
            return {
              mac: v.mac,
              addrs: v.tags.map(item => item.addr),
            }
          }),
          config,
        }
        const res = await modifyBoxsChnlThreeLevelAlarm(params)
        if (!res.success) {
          const findData = res.data && res.data.find(v => !!v)
          let message = findData ? `<div class="c-danger tl">${findData.mac}:${findData.errorMsg}</div>` : ''
          if (findData.errorMsg === '0') {
            message = `<div class="c-success tl">${findData.mac}：${this.$t('inEffect')}</div>`
          }
          return this.$Modal.confirm({
            title: ' ',
            content: message,
          })
        }
        this.$Message.success({
          content: this.$t('submitCommand'),
        })
      },
      submitForm(formName) {
        let that = this
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.devices.length === 0) {
              this.$Message.error({ content: this.$t('pleaseTickRoom') })
              return false
            }
            this.macs = []
            this.tagsList = []
            this.macs = this.devices.map(item => ({
              mac: item.mac,
              newAddrs: item.tags.length > 0 ? JSON.parse(JSON.stringify(item.tags)) : '',
              addrs: [],
            }))
            this.macs.forEach(item => {
              if (item.newAddrs.length > 0) {
                item.newAddrs.map(itm => {
                  delete itm.title
                  item.addrs.push(itm.addr)
                })
              }
              return delete item.newAddrs
            })
            let timer = ''
            switch (this.powerKwH) {
              case 1:
                timer = '00~23'
                break
              case 2:
                timer = `${this.StartMonth}~${this.EndMonth}`
                break
              default:
                timer = `${this.startDayValue}~${this.endDayValue}`
                break
            }
            this.$nextTick(function () {
              if (formName === 'titleForm') {
                let params = { macAddrs: this.macs, cmd: this.cmd.value }
                params.title = this.titleForm.name
                modifyBoxsChnlTitle(params)
                  .then(res => {
                    if (res.success) {
                      that.$Message.success({
                        content: this.$t('submitCommand'),
                      })
                    } else {
                      let message = ''
                      if (res.data) {
                        for (let elem of res.data) {
                          if (elem.errorMsg === '0') {
                            message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('processing') + '</div>'
                          } else {
                            message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                          }
                        }
                      } else {
                        message = res.message
                      }
                      that.$Modal.confirm({
                        title: '',
                        content: message,
                      })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      that.$Message.error({
                        content: this.$t('unknown'),
                      })
                    }
                  })
              } else if (formName === 'powerForm') {
                let params = {
                  macAddrs: this.macs,
                  cmd: this.cmd.value,
                  warnPower: this.powerForm.warnLimit,
                }
                params.power = this.powerForm.limit
                modifyBoxsChnlPower(params)
                  .then(res => {
                    if (res.success) {
                      that.$Message.success({
                        content: this.$t('submitCommand'),
                      })
                    } else {
                      let message = ''
                      if (res.data) {
                        for (let elem of res.data) {
                          if (elem.errorMsg === '0') {
                            message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('processing') + '</div>'
                          } else {
                            message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                          }
                        }
                      } else {
                        message = res.message
                      }
                      that.$Modal.confirm({
                        title: '',
                        content: message,
                      })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      that.$Message.error({
                        content: this.$t('unknown'),
                      })
                    }
                  })
              } else if (formName === 'currentForm') {
                let params = {
                  macAddrs: this.macs,
                  cmd: this.cmd.value,
                  warnCurrent: this.currentForm.warnLimit,
                }
                params.current = this.currentForm.limit
                modifyBoxsChnlCurrent(params)
                  .then(res => {
                    if (res.success) {
                      that.$Message.success({
                        content: this.$t('submitCommand'),
                      })
                    } else {
                      let message = ''
                      if (res.data) {
                        for (let elem of res.data) {
                          if (elem.errorMsg === '0') {
                            message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('processing') + '</div>'
                          } else {
                            message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                          }
                        }
                      } else {
                        message = res.message
                      }
                      that.$Modal.confirm({
                        title: '',
                        content: message,
                      })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      that.$Message.error({
                        content: this.$t('unknown'),
                      })
                    }
                  })
              } else if (formName === 'leakagecurrentForm') {
                let params = {
                  macAddrs: this.macs,
                  cmd: this.cmd.value,
                  warnLeakageCurrent: this.leakagecurrentForm.warnLimit,
                }
                params.leakageCurrent = this.leakagecurrentForm.limit
                modifyBoxsChnlLeakageCurrent(params)
                  .then(res => {
                    if (res.success) {
                      that.$Message.success({
                        content: this.$t('submitCommand'),
                      })
                    } else {
                      let message = ''
                      if (res.data) {
                        for (let elem of res.data) {
                          if (elem.errorMsg === '0') {
                            message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('processing') + '</div>'
                          } else {
                            message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                          }
                        }
                      } else {
                        message = res.message
                      }
                      that.$Modal.confirm({
                        title: '',
                        content: message,
                      })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      that.$Message.error({
                        content: this.$t('unknown'),
                      })
                    }
                  })
              } else if (formName === 'temperatureForm') {
                let params = {
                  macAddrs: this.macs,
                  cmd: this.cmd.value,
                  warnTemperature: this.temperatureForm.warnLimit,
                }
                params.temperature = this.temperatureForm.limit
                modifyBoxsChnlTemperature(params)
                  .then(res => {
                    if (res.success) {
                      that.$Message.success({
                        content: this.$t('submitCommand'),
                      })
                    } else {
                      let message = ''
                      if (res.data) {
                        for (let elem of res.data) {
                          if (elem.errorMsg === '0') {
                            message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('processing') + '</div>'
                          } else {
                            message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                          }
                        }
                      } else {
                        message = res.message
                      }
                      that.$Modal.confirm({
                        title: '',
                        content: message,
                      })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      that.$Message.error({
                        content: this.$t('unknown'),
                      })
                    }
                  })
              } else if (formName === 'voltageForm') {
                let params = {
                  macAddrs: this.macs,
                  cmd: this.cmd.value,
                  warnVoltageH: this.voltageForm.voltageHWarn,
                  warnVoltageL: this.voltageForm.voltageLWarn,
                }
                params.voltageH = this.voltageForm.voltageH
                params.voltageL = this.voltageForm.voltageL
                modifyBoxsChnlVoltage(params)
                  .then(res => {
                    if (res.success) {
                      that.$Message.success({
                        content: this.$t('submitCommand'),
                      })
                    } else {
                      let message = ''
                      if (res.data) {
                        for (let elem of res.data) {
                          if (elem.errorMsg === '0') {
                            message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('processing') + '</div>'
                          } else {
                            message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                          }
                        }
                      } else {
                        message = res.message
                      }
                      that.$Modal.confirm({
                        title: '',
                        content: message,
                      })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      that.$Message.error({
                        content: this.$t('unknown'),
                      })
                    }
                  })
              } else if (formName === 'setwiringForm') {
                let params = {
                  macAddrs: this.macs,
                  cmd: this.cmd.value,
                }
                params.wiring = this.setwiringForm.wiring
                modifyBoxsChnlWiring(params)
                  .then(res => {
                    if (res.success) {
                      that.$Message.success({
                        content: this.$t('submitCommand'),
                      })
                    } else {
                      let message = ''
                      if (res.data) {
                        for (let elem of res.data) {
                          if (elem.errorMsg === '0') {
                            message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('processing') + '</div>'
                          } else {
                            message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                          }
                        }
                      } else {
                        message = res.message
                      }
                      that.$Modal.confirm({
                        title: '',
                        content: message,
                      })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      that.$Message.error({
                        content: this.$t('unknown'),
                      })
                    }
                  })
              } else if (formName === 'setloginpwdForm') {
                this.macs = []
                for (let elem of this.devices) {
                  this.macs.push(elem.mac)
                }
                let params = {
                  macs: this.macs.join(','),
                  cmd: this.cmd.value,
                }
                params.password = this.setloginpwdForm.newPassword
                if (this.setloginpwdForm.confirmNewPassword === '' || this.setloginpwdForm.newPassword !== this.setloginpwdForm.confirmNewPassword) {
                  this.$Message.error({
                    content: this.$t('newPasswordValidate'),
                  })
                  return false
                }
                modifyBoxsLoginPasswrod(params)
                  .then(res => {
                    if (res.success) {
                      that.$Message.success({
                        content: this.$t('submitCommand'),
                      })
                    } else {
                      let message = ''
                      if (res.data) {
                        for (let elem of res.data) {
                          if (elem.errorMsg === '0') {
                            message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('processing') + '</div>'
                          } else {
                            message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                          }
                        }
                      } else {
                        message = res.message
                      }
                      that.$Modal.confirm({
                        title: '',
                        content: message,
                      })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      that.$Message.error({
                        content: this.$t('unknown'),
                      })
                    }
                  })
              } else if (formName === 'setwirelessForm') {
                this.macs = []
                for (let elem of this.devices) {
                  this.macs.push(elem.mac)
                }
                let params = {
                  macs: this.macs.join(','),
                  cmd: this.cmd.value,
                }
                params.ssid = this.setwirelessForm.ssid
                params.password = this.setwirelessForm.password
                modifyBoxsWireless(params)
                  .then(res => {
                    if (res.success) {
                      that.$Message.success({
                        content: this.$t('submitCommand'),
                      })
                    } else {
                      let message = ''
                      if (res.data) {
                        for (let elem of res.data) {
                          if (elem.errorMsg === '0') {
                            message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('processing') + '</div>'
                          } else {
                            message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                          }
                        }
                      } else {
                        message = res.message
                      }
                      that.$Modal.confirm({
                        title: '',
                        content: message,
                      })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      that.$Message.error({
                        content: this.$t('unknown'),
                      })
                    }
                  })
              } else if (formName === 'upadatetimerForm') {
                let obj = {
                  autoid: 0,
                  status: this.actionVal === '1' ? (this.actionVal = true) : (this.actionVal = false),
                  time: this.upadatetimerForm.time + ':00',
                  weekday: this.upadatetimerForm.week.join(''),
                }
                let params = { macAddrs: this.macs, cmd: this.cmd.value, timer: obj }
                modifyBoxsChnlTimer(params)
                  .then(res => {
                    if (res.success) {
                      that.$Message.success({ content: this.$t('submitCommand') })
                    } else {
                      let message = ''
                      if (res.data) {
                        for (let elem of res.data) {
                          if (elem.errorMsg === '0') {
                            message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('processing') + '</div>'
                          } else {
                            message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                          }
                        }
                      } else {
                        message = res.message
                      }
                      that.$Modal.confirm({ title: '', content: message })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      that.$Message.error({ content: this.$t('unknown') })
                    }
                  })
              } else if (formName === 'enableAlarmForm') {
                let params = { macAddrs: this.macs, cmd: this.cmd.value }
                params.alarmEnable = this.enableAlarmForm.enableBitsObj
                params.platAlarmEnable = this.enableAlarmForm.platAlarmEnable
                modifyBoxsChnlAlarmEbable(params)
                  .then(res => {
                    if (res.success) {
                      that.$Message.success({
                        content: this.$t('submitCommand'),
                      })
                    } else {
                      let message = ''
                      if (res.data) {
                        for (let elem of res.data) {
                          if (elem.errorMsg === '0') {
                            message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('processing') + '</div>'
                          } else {
                            message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                          }
                        }
                      } else {
                        message = res.message
                      }
                      that.$Modal.confirm({
                        title: '',
                        content: message,
                      })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      that.$Message.error({
                        content: this.$t('unknown'),
                      })
                    }
                  })
              } else if (formName === 'enableTripForm') {
                let params = { macAddrs: this.macs, cmd: this.cmd.value }
                params.tripEnable = this.enableTripForm.enableBitsObj
                params.platTripEnable = this.enableTripForm.platAlarmEnable
                modifyBoxsChnlTripEnable(params)
                  .then(res => {
                    if (res.success) {
                      that.$Message.success({ content: this.$t('submitCommand') })
                    } else {
                      let message = ''
                      if (res.data) {
                        for (let elem of res.data) {
                          if (elem.errorMsg === '0') {
                            message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('processing') + '</div>'
                          } else {
                            message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                          }
                        }
                      } else {
                        message = res.message
                      }
                      that.$Modal.confirm({ title: '', content: message })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      that.$Message.error({ content: this.$t('unknown') })
                    }
                  })
              } else if (formName === 'powerKwHForm') {
                let params = { macAddrs: this.macs, subType: 701, warnThreshold: this.powerKwHForm.alert, alarmThreshold: this.powerKwHForm.alarm, rangeType: this.powerKwH, range: timer }
                modifyBoxsPowerFeeThreshold(params).then(res => {
                  if (res.success) {
                    this.$Message.success({ content: this.$t('modifySuccess') })
                  } else {
                    this.$Message.error({ content: res.message })
                  }
                })
              } else if (formName === 'powerEfeesFrom') {
                let params = { macAddrs: this.macs, subType: 702, warnThreshold: this.powerEfeesFrom.alert, alarmThreshold: this.powerEfeesFrom.alarm, rangeType: this.powerKwH, range: timer }
                modifyBoxsPowerFeeThreshold(params).then(res => {
                  if (res.success) {
                    this.$Message.success({
                      content: this.$t('modifySuccess'),
                    })
                  } else {
                    this.$Message.error({
                      content: res.message,
                    })
                  }
                })
              }
            })
          } else {
            return false
          }
        })
      },
      handleLines() {
        this.linesFlag = true
      },
      handleTripLines() {
        this.tripLinesFlag = true
      },
      handleTimerLines() {
        this.timerLinesFlag = true
      },
      handleRepeat() {
        this.repeatFlag = true
      },
      handleCheckAllLinesChange(val) {
        this.enableAlarmForm.checkedLines = val ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] : []
        this.isIndeterminate = false
      },
      handleUpadate(val) {
        this.upadatetimerForm.time = val
      },
      handleCheckAllTripLinesChange(val) {
        this.enableTripForm.checkedLines = val ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] : []
        this.tripIsIndeterminate = false
      },
      handleCheckAllTimerLinesChange(val) {
        this.upadatetimerForm.checkedLines = val ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] : []
        this.timerIsIndeterminate = false
      },
      handleCheckAllRepeatChange(val) {
        this.upadatetimerForm.week = val ? [this.$t('day'), this.$t('one'), this.$t('two'), this.$t('three'), this.$t('four'), this.$t('five'), this.$t('six')] : []
        this.repeatIsIndeterminate = false
      },
      handleCheckedLinesChange(value) {
        let checkedCount = value.length
        this.checkAllLines = checkedCount === 29
        this.isIndeterminate = checkedCount > 0 && checkedCount < 29
      },
      handleCheckedTripLinesChange(value) {
        let checkedCount = value.length
        this.checkAllTripLines = checkedCount === 29
        this.tripIsIndeterminate = checkedCount > 0 && checkedCount < 29
      },
      handleCheckedTimerLinesChange(value) {
        let checkedCount = value.length
        this.checkAllTimerLines = checkedCount === 29
        this.timerIsIndeterminate = checkedCount > 0 && checkedCount < 29
      },
      handleCheckedWeekChange(value) {
        let checkedCount = value.length
        this.checkAllRepeat = checkedCount === this.week.length
        this.repeatIsIndeterminate = checkedCount > 0 && checkedCount < this.week.length
      },
      handleClose(tag) {
        this.enableAlarmForm.checkedLines.splice(this.enableAlarmForm.checkedLines.indexOf(tag), 1)
      },
      handleTripClose(tag) {
        this.enableTripForm.checkedLines.splice(this.enableTripForm.checkedLines.indexOf(tag), 1)
      },
      handleTimerClose(tag) {
        this.upadatetimerForm.checkedLines.splice(this.upadatetimerForm.checkedLines.indexOf(tag), 1)
      },
      handleRepeatClose(tag) {
        this.upadatetimerForm.week.splice(this.upadatetimerForm.week.indexOf(tag), 1)
      },
      handleTypeChange(val) {
        this.upadatetimerForm.time = ''
      },
      handleAction(val) {
        this.actionVal = val
      },
      handleCheckedBitsChange(value) {
        let arr = []
        let arr2 = []
        arr = [
          value.indexOf(this.$t('shortCircuitAlarm')) > -1 ? 1 : 0,
          value.indexOf(this.$t('surgeAlarm')) > -1 ? 1 : 0,
          value.indexOf(this.$t('overloadA')) > -1 ? 1 : 0,
          value.indexOf(this.$t('temperatureW')) > -1 ? 1 : 0,
          value.indexOf(this.$t('leakageAlarm')) > -1 ? 1 : 0,
          value.indexOf(this.$t('overCurrentAlarm')) > -1 ? 1 : 0,
          value.indexOf(this.$t('overVoltageAlarm')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('missingPhaseA')) > -1 ? 1 : 0,
          value.indexOf(this.$t('arcAlarm')) > -1 ? 1 : 0,
          value.indexOf(this.$t('underVoltageAlarm')) > -1 ? 1 : 0,
          value.indexOf(this.$t('overVoltageWarning')) > -1 ? 1 : 0,
          value.indexOf(this.$t('underVoltageWarning')) > -1 ? 1 : 0,
          value.indexOf(this.$t('leakageW')) > -1 ? 1 : 0,
          value.indexOf(this.$t('currentWarning')) > -1 ? 1 : 0,
          value.indexOf(this.$t('openingprotection')) > -1 ? 1 : 0,
          value.indexOf(this.$t('localMaintenance')) > -1 ? 1 : 0,
          value.indexOf(this.$t('malignantLoad')) > -1 ? 1 : 0,
          value.indexOf(this.$t('remoteLock')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('temperatureAlarm')) > -1 ? 1 : 0,
          value.indexOf(this.$t('unbalancedAlarm')) > -1 ? 1 : 0,
          value.indexOf(this.$t('wrongPhaseAlarm')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('electricVehiclePowerExceedingUpperLimitAlarm')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
        ]
        arr2 = [value.indexOf(this.$t('powerAlarm')) > -1 ? 1 : 0, value.indexOf(this.$t('electricityWarning')) > -1 ? 1 : 0, value.indexOf(this.$t('electricityRateAlarm')) > -1 ? 1 : 0, value.indexOf(this.$t('earlyWarningCharge')) > -1 ? 1 : 0]
        this.enableAlarmForm.enableBitsObj = arr.reverse().join('')
        this.enableAlarmForm.platAlarmEnable = arr2.reverse().join('')
      },
      handleCheckedTripsChange(value) {
        let arr = []
        let arr2 = []
        arr = [
          value.indexOf(this.$t('shortCircuitAlarm') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('surgeAlarm') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('overloadA') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('temperatureW') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('leakageAlarm') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('overCurrentAlarm') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('overVoltageAlarm') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('missingPhaseA') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('arcAlarm') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('underVoltageAlarm') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('overVoltageWarning') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('underVoltageWarning') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('leakageW') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('currentWarning') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('malignantLoad') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('temperatureAlarm') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('unbalancedAlarm') + this.$t('trip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('wrongPhaseTrip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('electricVehiclePowerExceedingUpperLimitTrip')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
          value.indexOf(this.$t('reserved')) > -1 ? 1 : 0,
        ]
        arr2 = [value.indexOf(this.$t('powerAlarmTripping')) > -1 ? 1 : 0, value.indexOf(this.$t('electricChargeAlarmTripping')) > -1 ? 1 : 0]
        this.enableTripForm.enableBitsObj = arr.reverse().join('')
        this.enableTripForm.platAlarmEnable = arr2.reverse().join('')
      },
    },
    watch: {
      '$store.state.batchHeight': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.batchHeight.height = newVal
          }
        },
      },
      '$store.state.innerComponentHeight': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.innerComponentHeight.height = newVal
          }
        },
      },
    },
  }
</script>
<style lang="less">
  .dyzModal {
    .ivu-modal-footer {
      border-color: transparent !important;
    }
    .ivu-modal-body {
      padding: 42px;
      p {
        display: flex;
        align-items: center;
      }
    }
    .ivu-btn {
      padding: 0 20px;
    }
    .icon {
      font-size: 28px;
      color: #ffc400;
      margin-right: 10px;
    }
  }
  #equipments {
    .ivu-modal-footer {
      padding: 0;
    }
  }
  .batch {
    .ivu-select-dropdown {
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .batchTable {
      background: #1a202e;
      padding: 20px;
      .header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        justify-content: space-between;
        span {
          font-size: 16px;
        }
        Button {
          margin: 0 5px;
        }
      }
    }
    .powerform {
      .timer {
        border: 1px solid #3d3d41;
        border-radius: 5px;
        display: flex;
        margin-left: 10px;
        .ivu-input {
          border: transparent;
          box-shadow: 0 0 0 0;
          text-align: center;
          padding: 0;
        }
        .ivu-date-picker-header-label:first-child,
        .ivu-date-picker-prev-btn-arrow-double,
        .ivu-date-picker-next-btn-arrow-double {
          display: none;
        }
        .ivu-icon-ios-calendar-outline:before {
          content: '';
        }
      }
      .startMonth,
      .endMonth {
        .ivu-select-selection {
          border: transparent;
          box-shadow: 0 0 0 0;
          .ivu-icon-ios-arrow-down:before {
            content: '';
          }
        }
        .ivu-select-dropdown {
          scrollbar-width: none;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        .ivu-select-placeholder,
        .ivu-select-selected-value {
          text-align: center;
          padding: 0;
        }
      }
    }
    .divided {
      height: 1px;
      background: #fff;
      margin-top: 10px;
    }
    .select-wrap {
      padding: 20px 0;
      background: #1a202e;
    }
    .scroll {
      overflow-y: scroll;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .descriptionTitle {
      margin: 20px 0;
    }
    .ivu-tag {
      height: 32px;
      line-height: 32px;
    }
    .formt {
      display: flex;
      span {
        margin-left: 5px;
      }
    }
    .btn {
      background: rgba(0, 126, 255, 0.1);
      border: 1px solid #007eff;
      border-radius: 5px;
      color: #007eff;
      margin-right: 10px;
    }
    .ivu-modal-footer {
      padding: 0;
    }
  }
</style>
