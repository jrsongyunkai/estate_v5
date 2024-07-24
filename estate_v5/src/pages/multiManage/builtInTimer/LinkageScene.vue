<template>
  <div id="linkageScene">
    <div class="Scene">
      <Row class="header">
        <h4>{{ $t('linkageConfig') }}</h4>
        <div>
          <Button class="b-blue" @click="setVersion('pro')">
            <Icon type="ios-undo" />
            {{ $t('switchToDunsys1Verson') }}
          </Button>
          <Button class="b-blue mlt" @click="handleLinkageScene">{{ $t('linkage') + $t('add1') }}</Button>
        </div>
      </Row>
      <Col>
        <Table :data="linkageData" :columns="linkagecolumns" :height="520" :max-height="620">
          <template slot-scope="{ row }" slot="name">
            <span class="pointer c-default" @click="handleViewScene(row)">{{ row.name }}</span>
          </template>
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status === 2" class="b-danger">{{ $t('disabled') }}</span>
            <span v-else class="b-success">{{ $t('enabled') }}</span>
          </template>
          <template slot-scope="{ row }" slot="operating">
            <Button class="top-padding-bottom left-padding-right c-primary" type="text" @click="handleLinkageScene(row, 'edit')">{{ $t('edit') }}</Button>
            <Button class="top-padding-bottom left-padding-right c-primary" type="text" @click="handleLinkagedeLock(row)">{{ $t('stopOrStart') }}</Button>
            <Button class="top-padding-bottom left-padding-right c-danger" type="text" @click="openPwdsModal(row.id)">{{ $t('delete') }}</Button>
          </template>
        </Table>
        <Page show-total :current.sync="pageNum" @on-change="changePages" :total="totals" show-elevator />
      </Col>
    </div>

    <Modal :title="$t('add') + '、' + $t('edit') + $t('linkage') + $t('name')" :close-on-click-modal="false" v-model="linkageFlag" width="30%" top="30vh" id="scenes-form">
      <Form :model="scenes">
        <FormItem v-show="false" label="ID" :label-width="$store.state.locale !== 'zh-CN' ? 100 : 80">
          <Input v-model="scenes.id" autocomplete="off"></Input>
        </FormItem>
        <FormItem :label="$t('linkage') + $t('name')" :label-width="$store.state.locale !== 'zh-CN' ? 100 : 80">
          <Input v-model="scenes.name" autocomplete="off"></Input>
        </FormItem>
        <FormItem :label="$t('linkage') + $t('remark')" :label-width="$store.state.locale !== 'zh-CN' ? 100 : 80">
          <Input v-model="scenes.remark" type="textarea" :rows="4" />
        </FormItem>
      </Form>
      <div slot="footer" class="threeBtn">
        <Button class="b-blue" v-show="detailsFlag" @click="handleLinkageSceneDetails">{{ $t('linkageConfig') }}</Button>
        <div style="text-align: right; width: 100%">
          <Button class="b-blue" @click="handleLinkageSceneSave">{{ $t('save') }}</Button>
          <Button @click="handleLinkageSceneClose">{{ $t('cancel') }}</Button>
        </div>
      </div>
    </Modal>

    <Modal :title="$t('linkageConfig')" :close-on-click-modal="false" v-model="dialogDetails" width="40%" top="20vh" id="scene-view" @close="dialogDetails = false">
      <Row>
        <Col :span="24">
          <Form class="scene-form" label-position="right">
            <FormItem :label-width="50" required>
              <div class="dis_f">
                <div class="slot-label pointer">
                  {{ $t('linkageName') }}
                </div>
                <Input v-model="scenes.name" readonly autocomplete="off" style="width: 300px"></Input>
              </div>
            </FormItem>
            <FormItem :label="$t('effectiveTimePeriodCycleMode')" :label-width="150" class="auto-complete">
              <Select v-model="infinityMode" class="selet-mode" placement="bottom" transfer @on-change="changeInfinityValue">
                <Option v-for="(item, index) in infinityList" :key="index" :label="item.label" :value="item.value"></Option>
              </Select>
              <Select v-if="infinityMode === 2" v-model="infinityWeek" class="selet-mode" multiple :max-tag-count="2" placement="bottom" transfer>
                <Option v-for="(item, index) in weekList" :key="index" :label="item.label" :value="item.value"></Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('effectiveTimePeriod')" :label-width="150" class="auto-complete">
              <DatePicker class="mlt" v-if="infinityMode === 0" style="width: 300px" v-model="value1" type="datetimerange" :range-separator="$t('to')" format="yyyy-MM-dd HH:mm" :clearable="false" value-format="yyyy-MM-dd HH:mm" @on-change="changeValue"></DatePicker>
              <div v-if="infinityMode && infinityMode !== 0">
                <div v-for="(item, index) in timeLists" :key="index" class="mrt mlt">
                  <TimePicker format="HH:mm" type="timerange" v-model="infinityTime[index]" placement="bottom-end" :placeholder="$t('pleaseSelectTime')" style="width: 168px" @on-change="getinfinityTime"></TimePicker>
                  <span class="span-icon" v-if="index > 0"><Icon type="ios-trash-outline" size="22" color="#E03C3A" @click="editList(index)" /></span>
                </div>
                <div>
                  <Button class="buttons mrt mlt" ghost long type="primary" @click="editList('add')">{{ '+' + $t('addEffectiveTimePeriod') }}</Button>
                </div>
              </div>
            </FormItem>
            <FormItem :label="$t('if')" style="text-align: center" :label-width="150" required>
              <template>
                <Row>
                  <span class="mlt"></span>
                  <Col :span="17" style="display: flex">
                    <Select v-model="equipmentrValue" :disabled="equipmentFlag" style="width: 155px; margin-right: 20px" :placeholder="$t('pleaseSelect')">
                      <Option v-for="item in equipmentTypeAttr" :key="item.value" :label="item.label" :value="item.value"></Option>
                    </Select>
                    <Select v-model="ifValue" style="width: 125px" :placeholder="$t('pleaseSelect')">
                      <Option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></Option>
                    </Select>
                  </Col>
                </Row>
              </template>
            </FormItem>
            <!-- 条件列表 -->
            <FormItem>
              <div class="header">
                <span>{{ $t('condition') + $t('list') }}</span>
                <Button class="b-blue" @click="handleIfAdd">{{ $t('addCondition') }}</Button>
              </div>
              <Col :span="24" class="tc">
                <Table class="mt-10 device-wrap" style="width: 100%" :data="preList" :columns="preListcolumns" border>
                  <template slot-scope="{ row }" slot="name">
                    <span>{{ row.others.macName + '(' + row.others.mac + ')' }}</span>
                  </template>

                  <template slot-scope="{ row }" slot="mac">
                    <span>{{ row.others.title }}</span>
                  </template>
                  <!-- <template slot-scope="{ row }" slot="phase">
                    <span v-for="item in row.tmpTypeList" :key="item.type">{{item.typeName}}/</span>
                  </template> -->
                  <template slot-scope="{ row }" slot="equipmentrValue">
                    <span v-if="row.subTypeNumber">
                      {{ row.subTypeName || '' }}
                    </span>
                    <span v-if="row.equipmentrValue === 4 || row.others.equipmentType === 4">{{ (row.elecType === 4 ? $t('temperature') : $t('liquidLevel')) + (row.compType === 1 ? $t('above') : $t('below')) + '\xa0\xa0' + row.compValue }}</span>
                    <span v-if="row.equipmentrValue === 5 || row.others.equipmentType === 5">{{ (row.elecType === 4 ? $t('temperature') : $t('pressure')) + (row.compType === 1 ? $t('above') : $t('below')) + '\xa0\xa0' + row.compValue }}</span>
                    <span v-if="row.equipmentrValue === 11 || row.others.equipmentType === 11">{{ (row.elecType === 4 ? $t('temperature') : $t('humidity')) + (row.compType === 1 ? $t('above') : $t('below')) + '\xa0\xa0' + row.compValue }}</span>
                    <span v-if="row.equipmentrValue === 14 || row.others.equipmentType === 14">{{ $t('illuminationCelsius') + (row.compType === 1 ? $t('above') : $t('below')) + '\xa0\xa0' + row.compValue }}</span>
                    <span
                      v-if="
                        row.equipmentrValue !== '1,2' &&
                        row.others.equipmentType !== 1 &&
                        row.others.equipmentType !== 2 &&
                        row.equipmentrValue !== 11 &&
                        row.others.equipmentType !== 11 &&
                        row.equipmentrValue !== 4 &&
                        row.others.equipmentType !== 4 &&
                        row.equipmentrValue !== 5 &&
                        row.others.equipmentType !== 5 &&
                        row.equipmentrValue !== 14 &&
                        row.others.equipmentType !== 14 &&
                        !row.subTypeNumber &&
                        row.equipmentrValue !== 22 &&
                        row.others.equipmentType !== 22
                      ">
                      {{ row.typeNumber === 2002 ? $t('smokecallThePolice') : row.typeNumber === 2006 ? $t('gascallThePolice') : row.typeNumber === 2007 ? $t('floodingcallThePolice') : $t('devicemalfunctioncallThePolice') }}
                    </span>
                    <span v-if="(row.equipmentrValue === '1,2' || row.others.equipmentType === 1 || row.others.equipmentType === 2) && row.switchAnalog === ''">
                      {{ row.elecType === 1 ? $t('watt1') : row.elecType === 2 ? $t('current') : row.elecType === 3 ? $t('leakage') : row.elecType === 4 ? $t('temperature') : row.elecType === 5 ? $t('voltage') : $t('switchStatus') }}
                    </span>
                    <span v-if="(row.equipmentrValue === '1,2' || row.others.equipmentType === 1 || row.others.equipmentType === 2) && row.switchAnalog !== ''">
                      <span v-if="row.switchAnalog === 1">
                        {{ row.elecType === 18 ? $t('switchStatus') : '' }}
                      </span>
                      <span v-if="row.switchAnalog === 2">
                        {{ row.elecType === 16 ? $t('acquisition') : $t('displayValue') }}
                      </span>
                    </span>
                    <span v-if="(row.equipmentrValue === '1,2' || row.others.equipmentType === 1 || row.others.equipmentType === 2) && row.switchAnalog === ''">
                      {{ row.calcType === 1 ? $t('sumValue') : row.calcType === 2 ? $t('differenceValue') : row.calcType === 3 ? $t('maxValue') : row.calcType === 4 ? $t('minValue') : row.calcType === 5 ? $t('averageValue') : row.calcType === 6 ? $t('allLine') : $t('anyLine') }}
                    </span>
                    <span v-if="(row.equipmentrValue === '1,2' || row.others.equipmentType === 1 || row.others.equipmentType === 2) && row.switchAnalog !== ''">
                      <span v-if="row.switchAnalog === 1">
                        {{ row.calcType === 6 ? $t('allPorts') : $t('anyPort') }}
                      </span>
                      <span v-if="row.switchAnalog === 2">
                        {{ row.calcType === 1 ? $t('sumValue') : row.calcType === 2 ? $t('differenceValue') : row.calcType === 3 ? $t('maxValue') : row.calcType === 4 ? $t('minValue') : row.calcType === 5 ? $t('averageValue') : row.calcType === 6 ? $t('allLine') : $t('anyLine') }}
                      </span>
                    </span>

                    <span v-if="(row.equipmentrValue === '1,2' || row.others.equipmentType === 1 || row.others.equipmentType === 2) && row.switchAnalog === ''">{{ row.compType === 1 ? $t('above') : row.compType === 2 ? $t('below') : $t('equal') }}</span>
                    <span v-else>
                      <span v-if="row.switchAnalog === 1">
                        {{ row.compType === 3 ? $t('equal') : '' }}
                      </span>
                      <span v-if="row.switchAnalog === 2">
                        {{ row.compType === 1 ? $t('above') : row.compType === 2 ? $t('below') : $t('equal') }}
                      </span>
                    </span>

                    <span v-if="row.equipmentrValue === '1,2' || row.others.equipmentType === 1 || row.others.equipmentType === 2">
                      {{ row.compValue === 'false' ? $t('opening') : row.compValue === 'true' ? $t('closing') : row.switchAnalog === 1 ? (row.compValue === '1' ? 'ON' : row.compValue === '0' ? 'OFF' : row.compValue) : row.compValue }}
                    </span>
                    <span v-if="row.equipmentrValue === 22 || row.others.equipmentType === 22">{{ row.elecType === 13 ? $t('switchStatus') : '' }}&nbsp; {{ row.compValue === 'true' ? $t('lightControlOn') : $t('lightControlOff') }}</span>
                  </template>

                  <template slot-scope="{ row, index }" slot="operating">
                    <Button class="c-blue" type="text" @click="handlelinkageScenePre(row, index)">{{ $t('edit') }}</Button>
                    <Button class="c-danger" type="text" @click="handleSceneDelPre(index)">{{ $t('delete') }}</Button>
                  </template>
                </Table>
              </Col>
            </FormItem>
            <FormItem style="margin: 0">
              <Col :span="24" class="header">
                <span>{{ $t('executelist') }}</span>
                <Button class="b-blue" @click="handleAddAction">{{ $t('addexecute') }}</Button>
              </Col>
            </FormItem>
            <!-- 动作列表 -->
            <FormItem>
              <Col :span="24">
                <Table class="mt-10 device-wrap" style="width: 100%" :data="actionsList" :columns="actionsListcolumns" border>
                  <template slot-scope="{ row }" slot="name">
                    <span>{{ row.others.macName + '(' + row.others.mac + ')' }}</span>
                  </template>

                  <template slot-scope="{ row }" slot="others.title">
                    <span>{{ row.others.title }}</span>
                  </template>

                  <template slot-scope="{ row }" slot="actionType">
                    <span>
                      {{
                        row.actionType === '1,3'
                          ? $t('opening')
                          : row.actionType === '2,3'
                          ? $t('closing')
                          : row.actionType === '1'
                          ? $t('opening')
                          : row.actionType === '2'
                          ? $t('closing')
                          : row.actionType === '4'
                          ? 'ON'
                          : row.actionType === '5'
                          ? 'OFF'
                          : row.actionType === '7'
                          ? $t('inching')
                          : row.actionType === '4,3'
                          ? 'ON'
                          : row.actionType === '5,3'
                          ? 'OFF'
                          : row.actionType === '7,3'
                          ? $t('inching')
                          : row.actionType === '8,3'
                          ? $t('lightControlOff')
                          : row.actionType === '9,3'
                          ? $t('lightControlOn')
                          : row.actionType === '10,3'
                          ? $t('adjustingBrightness') + row.lighteness
                          : ''
                      }}
                    </span>
                    <span>{{ row.alarmTypeNo === 1015 ? $t('customAlarm') : row.alarmTypeNo }}</span>
                  </template>

                  <template slot-scope="{ row, index }" slot="operating">
                    <Button class="c-blue" type="text" @click="handlelinkageSceneAction(row, index)">{{ $t('edit') }}</Button>
                    <Button class="c-danger" type="text" @click="handleSceneDelAction(index)">{{ $t('delete') }}</Button>
                  </template>
                </Table>
              </Col>
            </FormItem>
            <FormItem :label="$t('reticentperiod')" required>
              <InputNumber v-model="reticentperiod" :max="86400" :min="0" style="width: 300px" @on-blur="getRule(reticentperiod)"></InputNumber>
              &nbsp;{{ $t('sec') }}
            </FormItem>
          </Form>
        </Col>
      </Row>
      <div slot="footer" class="dialog-footer">
        <Button class="b-blue" @click="handleLinkageDetailsSave">{{ $t('confirm') }}</Button>
        <Button @click="handleLinkageDetailsClose">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <!-- 添加前置条件 -->
    <Modal :title="$t('addprecondition')" :close-on-click-modal="false" v-model="preconditionFlag" :before-close="handlePreClose" width="38%" top="30vh" id="scenes-form">
      <Form :model="preData" :label-width="60">
        <FormItem required label-position="left">
          <div class="dis_f">
            <div slot="label" class="slot-label pointer">
              {{ $t('selectDevice') }}
            </div>
            <Button class="btn" @click="handlePreAdd('pre')">{{ $t('selectDevice') }}</Button>
            <Input v-model="preData.mac" :placeholder="$t('pleaseSelect')" style="width: 200px" readonly></Input>
          </div>
        </FormItem>
        <FormItem v-show="equipmentrValue === '1,2' && preData.mac">
          <div class="dis_f">
            <div slot="label" class="slot-label pointer">
              {{ $t('selectLine') }}
            </div>

            <Select v-model="selectlIne" :multiple="linechangeIo === '' ? true : false" style="width: 280px" :max-tag-count="2" placement="bottom" :clearable="true" transfer @on-change="getLineChange" @on-clear="onclear">
              <Option v-for="(item, index) in selecTLine" :value="`${item.addr};${item.lineType}`" :key="`selecTLine${index}`" :disabled="item.disabled">{{ item.title }}</Option>
            </Select>
            <template v-if="linechangeIo === '' ? false : true">
              <Select v-model="switchAnalog" style="width: 90px; margin-left: 10px" placement="bottom" transfer @on-change="switchAnalogType">
                <Option v-for="(item, index) in switchingAnalogData" :value="item.value" :key="index">{{ item.label }}</Option>
              </Select>
            </template>
          </div>
          <span class="linechangeIo" v-if="linechangeIo === '' ? false : true">{{ $t('device808Tip') }}</span>
        </FormItem>
        <FormItem v-if="linechangeIo === '' ? false : true">
          <div class="dis_f">
            <div slot="label" class="slot-label pointer">
              {{ $t('plsEport') }}
            </div>
            <Select v-model="sqmodel" multiple style="width: 270px" placement="bottom" :max-tag-count="2" transfer @on-change="handleSqmodel">
              <Option v-for="(item, index) in switchingQuantity" :value="item.InsId" :key="index" :tag="item.name">{{ item.name }}</Option>
            </Select>
          </div>
        </FormItem>
        <FormItem required v-if="equipmentrValue === 4 || equipmentrValue === 5 || equipmentrValue === 11 || equipmentrValue === 14 || equipmentrValue === '1,2' || equipmentrValue === 22">
          <Row class="dis_f">
            <div class="slot-label pointer" style="margin-right: 20px">
              {{ $t('conditionType') }}
            </div>
            <Col :span="6" style="margin-right: 10px" v-if="equipmentrValue === 11">
              <Select style="width: 100%" v-model="attrValue" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in conditionsAttr" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
            <Col :span="6" style="margin-right: 10px" v-if="equipmentrValue === 5">
              <Select style="width: 100%; margin-right: 10px" v-model="pressureValue" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in pressureType" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
            <Col :span="6" style="margin-right: 10px" v-if="equipmentrValue === 4">
              <Select style="width: 100%; margin-right: 10px" v-model="levelValue" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in leveltionsType" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
            <Col :span="6" style="margin-right: 10px" v-if="equipmentrValue === 22">
              <Select style="width: 100%; margin-right: 10px" v-model="linghtValue" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in lightTionsType" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
            <Col :span="6" style="margin-right: 10px" v-if="equipmentrValue === 14">
              <Select style="width: 120px; margin-right: 10px" v-model="attrValue" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in illuminanceAttr" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
            <Col :span="6" style="padding-right: 0" v-if="equipmentrValue === 11 || equipmentrValue === 14 || equipmentrValue === 4 || equipmentrValue === 5">
              <Select style="width: 100%; margin-right: 5px" v-model="typeValue" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in conditionsType" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>

            <Col :span="6" style="margin-right: 5px" v-if="equipmentrValue === '1,2'">
              <Select style="width: 100%; margin-right: 10px" v-model="microBreakValue" @on-change="handlemicroBreak" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in microBreakAttr" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>

            <Col :span="6" style="width: 100%; margin-right: 5px" v-if="equipmentrValue === '1,2' && microBreakValue !== 13">
              <Select style="width: 100%; margin-right: 10px" v-model="evaluateValue" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in evaluateAttr" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
            <Col :span="6" style="width: 100%; margin-right: 10px" v-if="equipmentrValue === '1,2' && microBreakValue === 13">
              <Select style="width: 100%; margin-right: 10px" v-model="lineValue" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in lineAttr" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
            <Col :span="6" style="padding-right: 0; margin-right: 5px" v-if="equipmentrValue === '1,2'">
              <!-- <Select
                style="width: 100%; margin-right: 10px"
                v-if="microBreakValue === 13"
                v-model="comparisonValue"
                :placeholder="$t('pleaseSelect')"
              >
                <Option key="3" :label="$t('equal')" value="3">
                </Option>
              </Select> -->
              <Select style="width: 100%; margin-right: 10px" v-model="comparisonValue" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in comparisonAttr" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <!-- 灯控动作 -->
        <FormItem v-if="equipmentrValue === 22">
          <div class="dis_f">
            <div slot="label" class="slot-label pointer">{{ $t('action') }}</div>
            <Select style="width: 200px; margin-right: 10px" v-model="actionValue" :placeholder="$t('pleaseSelect')">
              <Option v-for="item in lightAction" :key="item.value" :label="item.label" :value="item.value"></Option>
            </Select>
          </div>
        </FormItem>
        <FormItem v-show="(equipmentrValue === '1,2' || equipmentrValue === 19) && preData.mac && microBreakValue === 4">
          <Row>
            <div class="slot-label pointer">
              {{ $t('selectphaselineTerminal') }}
            </div>
            <Col>
              <Select v-model="selectTem" multiple style="width: 290px" :max-tag-count="2" placement="bottom" transfer @on-change="changeTemEchart" @on-open-change="getMesageTip">
                <Option v-for="item in selecTemList" :value="item.type" :key="item.type">{{ item.typeName }}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem :label="$t('alarmType')" style="margin-left: 65px" :label-width="100" required v-if="equipmentrValue !== 11 && (equipmentrValue === 6 || equipmentrValue === 10)">
          <Select style="width: 150px; margin-left: 10px" :clearable="true" v-model="smokeValue" :placeholder="$t('pleaseSelect')">
            <Option v-for="item in smokeType" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </FormItem>
        <!-- 摄像头类型 -->
        <FormItem :label="$t('alarmType')" required style="margin-left: 65px" :label-width="100" v-if="controlCameraDis && equipmentrValue === 20">
          <Select style="width: 150px; margin-right: 10px" :clearable="true" v-model="cameraValue" :placeholder="$t('pleaseSelect')">
            <Option v-for="item in cameraType" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('alarmType')" required style="margin-left: 65px" :label-width="100" v-if="equipmentrValue !== 11 && equipmentrValue === 18">
          <Select style="width: 150px; margin-right: 10px" :clearable="true" v-model="waterValue" :placeholder="$t('pleaseSelect')">
            <Option v-for="item in waterType" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('alarmType')" :label-width="100" style="margin-left: 65px" required v-if="equipmentrValue !== 11 && (equipmentrValue === 7 || equipmentrValue === 13)">
          <Select style="width: 150px; margin-right: 10px" :clearable="true" v-model="gasValue" :placeholder="$t('pleaseSelect')">
            <Option v-for="item in gasType" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem required v-if="equipmentrValue === 4 || equipmentrValue === 5 || equipmentrValue === 11 || equipmentrValue === 14 || equipmentrValue === '1,2'">
          <div class="dis_f" v-if="switchAnalog === 1">
            <div class="slot-label pointer">
              {{ microBreakValue === 13 || microBreakValue === 18 ? $t('action') : $t('numValue') }}
            </div>
            <Col style="padding-left: 0" v-if="microBreakValue === 13 || microBreakValue === 18">
              <Select style="width: 150px; margin-right: 10px" :clearable="true" v-model="openCloseValue" @on-change="handleOpenStatus" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in openClose" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
            <Input
              v-if="microBreakValue !== 13 && microBreakValue !== 18"
              style="width: 150px"
              v-model="preData.num"
              :onkeyup="
                (preData.num = preData.num
                  .replace(/[^\d.]/g, '')
                  .replace(/\.{2,}/g, '.')
                  .replace('.', '$#$')
                  .replace(/\./g, '')
                  .replace('$#$', '.')
                  .replace(/^(\-)*(\d+)\.(\d)$/, '$1$2.$3')
                  .replace(/^[^0-9.]*(\d*[\.]?\d{0,2})\w*$/, '$1'))
              "
              :placeholder="$t('pleaseEnter')"
              autocomplete="off"></Input>
          </div>

          <div class="dis_f" v-if="switchAnalog === 2 || switchAnalog === ''">
            <div class="slot-label pointer">
              {{ microBreakValue === 13 ? $t('action') : $t('numValue') }}
            </div>

            <Col style="padding-left: 0" v-show="microBreakValue === 13">
              <Select style="width: 150px; margin-right: 10px" :clearable="true" v-model="openCloseValue" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in openClose" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
            <Input
              v-show="microBreakValue !== 13"
              style="width: 150px"
              v-model="preData.num"
              :onkeyup="
                (preData.num = preData.num
                  .replace(/[^\d.]/g, '')
                  .replace(/\.{2,}/g, '.')
                  .replace('.', '$#$')
                  .replace(/\./g, '')
                  .replace('$#$', '.')
                  .replace(/^(\-)*(\d+)\.(\d)$/, '$1$2.$3')
                  .replace(/^[^0-9.]*(\d*[\.]?\d{0,2})\w*$/, '$1'))
              "
              :placeholder="$t('pleaseEnter')"
              autocomplete="off"></Input>
          </div>
          <div class="dis_f" v-if="switchAnalog === undefined">
            <div class="slot-label pointer">
              {{ $t('numValue') }}
            </div>
            <Input
              v-show="microBreakValue !== 13"
              style="width: 150px"
              v-model="preData.num"
              :onkeyup="
                (preData.num = preData.num
                  .replace(/[^\d.]/g, '')
                  .replace(/\.{2,}/g, '.')
                  .replace('.', '$#$')
                  .replace(/\./g, '')
                  .replace('$#$', '.')
                  .replace(/^(\-)*(\d+)\.(\d)$/, '$1$2.$3')
                  .replace(/^[^0-9.]*(\d*[\.]?\d{0,2})\w*$/, '$1'))
              "
              :placeholder="$t('pleaseEnter')"
              autocomplete="off"></Input>
          </div>
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="handlePreClose">{{ $t('cancel') }}</Button>
        <Button class="b-blue" @click="handlePreSave">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <!-- 添加执行动作 -->
    <Modal :title="$t('addperformAction')" :close-on-click-modal="false" v-model="actionFlag" :before-close="handleActionClose" width="35%" top="30vh" id="scenes-form">
      <Form :model="actionData" :label-width="30">
        <FormItem required>
          <div class="dis_f">
            <label slot="label" class="slot-label pointer">{{ $t('selectDevice') }}</label>
            <Button class="btn" @click="handlePreAdd('action')">{{ $t('clickSelect') }}</Button>
            <Input v-model="actionData.mac" readonly style="width: 200px"></Input>
          </div>
        </FormItem>
        <FormItem v-show="actionData.mac" v-if="lightType !== 22">
          <div class="dis_f">
            <div slot="label" class="slot-label pointer">
              {{ $t('selectLine') }}
            </div>
            <Select v-model="actionData.tags" :multiple="isMoreSelect" style="width: 280px" :max-tag-count="linechangeIo === '' ? 2 : 1" placement="bottom" transfer :clearable="true" @on-change="getLineChange2" @on-clear="onclear2">
              <Option v-for="(item, index) in selecTLineAction" :value="`${item.addr};${item.lineType}`" :key="`selecTLine${index}`" :disabled="item.disabled">{{ item.title }}</Option>
            </Select>
          </div>
        </FormItem>
        <FormItem v-if="linechangeIo">
          <div class="dis_f">
            <div slot="label" class="slot-label pointer">
              {{ $t('switchOutput') }}
            </div>
            <Select v-model="actionData.sqmodel" multiple style="width: 270px" placement="bottom" :max-tag-count="2" transfer>
              <Option v-for="(item, index) in actionQuantity" :value="item.InsId" :key="index">{{ item.name }}</Option>
            </Select>
          </div>
        </FormItem>
        <FormItem>
          <div class="dis_f">
            <label slot="label" class="slot-label pointer">{{ $t('action') }}</label>
            <RadioGroup v-if="lightType !== 22" v-model="actionData.openCloseValue" type="button">
              <Radio v-for="(item, index) in openCloseAction" :key="index" :label="item.value">
                <span>{{ item.label }}</span>
              </Radio>
            </RadioGroup>

            <!-- <Select v-if="lightType !== 22" :clearable="true" v-model="actionData.openCloseValue" style="width: 150px; margin-right: 10px" :placeholder="$t('pleaseSelect')">
              <Option v-for="item in openClose" :key="item.value" :label="item.label" :value="item.value"> </Option>
            </Select> -->
            <Select v-if="lightType === 22" :clearable="true" v-model="actionData.openCloseValue" style="width: 150px; margin-right: 10px" :placeholder="$t('pleaseSelect')" @on-change="getLightChange">
              <Option v-for="item in linghtAction" :key="item.value" :label="item.label" :value="item.value"></Option>
            </Select>
          </div>
        </FormItem>
        <FormItem v-if="adBrightShow">
          <div class="dis_f">
            <label slot="label" class="slot-label pointer">{{ $t('brightness') }}</label>
            <InputNumber :max="100" :min="0" v-model="lightValue" style="width: 200px" :placeholder="$t('pleaseEnter0to100Brightness')"></InputNumber>
          </div>
        </FormItem>
        <FormItem v-if="equipmentrValue === '1,2' || equipmentrValue === 22">
          <div class="dis_f">
            <label slot="label" class="slot-label pointer">{{ $t('generatecallThePolice') }}</label>
            <Cascader v-model="actionData.alarm" clearable :data="alarms" :show-all-levels="false" style="width: 200px"></Cascader>
          </div>
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="handleActionClose">{{ $t('cancel') }}</Button>
        <Button class="b-blue" @click="handleActionSave">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <!-- 选择设备框 -->
    <Modal :title="$t('addDeviceLine')" :close-on-click-modal="false" v-model="deviceVisible" custom-class="custom-device-dialog" width="75%">
      <div>
        <Form :model="ruleForm" ref="ruleForm" class="rule-form">
          <FormItem>
            <Row>
              <Col :span="5" class="left-padding-right">
                <Input v-model="ruleForm.mac" :placeholder="$t('equipmentNo')"></Input>
              </Col>
              <Col :span="4" style="margin-left: 20px">
                <Button class="b-blue" @click="handleSearch">{{ $t('query') }}</Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
        <Table class="mt-20 device-wrap" :data="data" :columns="datacolumns">
          <template slot-scope="{ row }" slot="macname">
            {{ row.name }}
          </template>
          <template slot-scope="{ row }" slot="operating">
            <Button type="text" @click="handleMac(row)">{{ $t('selectDevice') }}</Button>
          </template>
        </Table>
        <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current.sync="currentPage" :page-size-opts="[20, 50, 100, 500]" :page-size="20" layout="sizes, prev, pager, next" :total="total" style="margin-top: 20px" show-elevator show-total></Page>
      </div>
    </Modal>
    <Modal :title="$t('channelList')" v-model="lineVisible" width="60%" append-to-body>
      <LineList :mac="lineMac" :tags="lineTags" @sendChannels="receiveChannels" source="BuiltInTiming" v-if="lineVisible"></LineList>
      <div slot="footer" />
    </Modal>
    <!-- 摄像头条件列表前置条件编辑弹窗，新加 -->
    <Modal :title="$t('addprecondition')" :close-on-click-modal="false" v-model="cameraVisible" custom-class="custom-device-dialog" width="38%">
      <Form :model="preData" :label-width="60">
        <FormItem required label-position="left">
          <div class="dis_f">
            <div slot="label" class="slot-label pointer">
              {{ $t('selectDevice') }}
            </div>
            <Button class="btn" @click="handlePreAdd('pre')">{{ $t('selectDevice') }}</Button>
            <Input v-model="preData.mac" :placeholder="$t('pleaseSelect')" style="width: 200px" readonly></Input>
          </div>
        </FormItem>
        <FormItem :label="$t('alarmType')" required style="margin-left: 65px" :label-width="100" v-if="cameraEditType.length > 0">
          <Select style="width: 150px; margin-right: 10px" :clearable="true" v-model="cameraEditValue" :placeholder="$t('pleaseSelect')">
            <Option v-for="item in cameraEditType" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="handlecameraClose">{{ $t('cancel') }}</Button>
        <Button class="b-blue" @click="handleCameraSave">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal v-model="openSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSeconedPwd" :isfoucs="false" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <div>
          <Button type="default" @click="openSeconedPwd = false">{{ $t('cancel') }}</Button>
          <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Device from '../../DetectionRules/Device'
  import LineList from '../../Common/LineList'
  import dayjs from 'dayjs'
  import { mapMutations } from 'vuex'
  import { linkageSceneList, linkageSceneSave, linkageSceneDel, linkageDetail, linkagedeLock, getTmpTypeList, queryBoxes, queryAlarmForConfig } from '@/api/multiManage/builtlnTimer'
  import { alarmPageCustom, cameraQueryAlarmType, checkSecondPwd } from '@/api/public'
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  import { queryChannels } from '@/api/common'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'

  export default {
    data() {
      return {
        selecTLineAction: [],
        isMoreSelect: false,
        openCloseAction: [],
        bpk: null,
        newPwdsSeconed: '',
        openSeconedPwd: false,
        rowDatas: '',
        lightType: 0,
        lightValue: 0,
        adBrightShow: false,
        linghtAction: [
          {
            value: 'openLight',
            label: this.$t('lightControlOn'),
          },
          {
            value: 'closeLight',
            label: this.$t('lightControlOff'),
          },
          {
            value: 'adjustBrightness',
            label: this.$t('adjustingBrightness'),
          },
          {
            value: '0',
            label: this.$t('noAction'),
          },
        ],
        lightTionsType: [
          {
            value: 13,
            label: this.$t('switchStatus'),
          },
        ],
        lightAction: [
          {
            value: 1,
            label: this.$t('lightControlOn'),
          },
          {
            value: 0,
            label: this.$t('lightControlOff'),
          },
        ],
        actionValue: '',
        linghtValue: '',
        cameraEditValue: '',
        cameraEditType: [],
        cameraVisible: false,
        controlCameraDis: false,
        cameraValue: '',
        cameraType: [],
        actionQuantity: [],
        digitalIns: [],
        analogIns: [],
        digitalOuts: [],
        editSave: 0,
        infinityTime: [],
        timeLists: [{ value: 555, showSpan: false }],
        reticentperiod: 180,
        lineSelect: [],
        selecTLine: [],
        swmodel: '',
        switchingAnalogData: [
          {
            value: 1,
            label: this.$t('switching'),
          },
          {
            value: 2,
            label: this.$t('unitConversion'),
          },
        ],
        sqmodel: '',
        switchingQuantityObj: [],
        switchingQuantity: [],
        analogInsObj: [],
        selectTem: [],
        selecTemList: [],
        levelValue: '',
        leveltionsType: [
          { value: 4, label: this.$t('temperature') },
          { value: 7, label: this.$t('liquidLevel') },
        ],
        pressureValue: '',
        pressureType: [
          { value: 4, label: this.$t('temperature') },
          { value: 6, label: this.$t('pressure') },
        ],
        waterValue: '',
        waterType: [
          {
            value: 2007,
            label: this.$t('floodingcallThePolice'),
          },
        ],
        linkageFlag: false,
        detailsFlag: false,
        totals: 0,
        dialogDetails: false,
        preconditionFlag: false,
        actionFlag: false,
        deviceVisible: false,
        lineVisible: false,
        linkageData: [],
        formLabelWidth: 80,
        equipmentTypesNum: '',
        lineMac: '',
        lineTags: [],
        form: {},
        scenes: {
          id: '',
          name: '',
          remark: '',
          status: '',
          timeRanges: '',
          exeFrequency: '',
        },
        preData: {
          mac: '',
          line: '',
          name: '',
          num: '',
          tags: [],
        },
        preList: [],
        actionData: {
          mac: '',
          macName: '',
          openCloseValue: '',
          tags: [],
          alarm: [],
          sqmodel: [],
        },
        actionsList: [],
        value1: [],
        linechangeIo: '',
        selectlIne: '',
        switchAnalog: 1,
        tableComponentHeight: this.$store.state.channelsTableHeight,
        options: [
          {
            value: 1,
            label: this.$t('satisfyAll'),
          },
          {
            value: 2,
            label: this.$t('satisfySingle'),
          },
        ],
        equipmentTypeAttr: [
          {
            value: '1,2',
            label: this.$t('microBreaker') + '(Md)',
          },
          {
            value: 11,
            label: this.$t('temperatureAndHumidityDetection') + '(Renke)',
          },
          {
            value: 14,
            label: this.$t('illuminanceCollector') + '(Renke)',
          },
          {
            value: 18,
            label: this.$t('waterimmersionEquipment') + '(Renke)',
          },
          {
            value: 4,
            label: this.$t('liquidlevelEquipment') + '(TLink)',
          },
          {
            value: 5,
            label: this.$t('pressureEquipment') + '(TLink)',
          },
          {
            value: 6,
            label: this.$t('smokeFireDetection') + '(Fs)',
          },
          {
            value: 7,
            label: this.$t('combustibleGasDetection') + '(Fs)',
          },
          {
            value: 10,
            label: this.$t('smokeFireDetection') + '(Zac)',
          },
          {
            value: 13,
            label: this.$t('combustibleGasDetection') + '(Zac)',
          },
          {
            value: 20,
            label: this.$t('camera'),
          },
          {
            value: 22,
            label: this.$t('lampControlEquipment'),
          },
        ],
        microBreakAttr: [
          {
            value: 1,
            label: this.$t('watt1'),
          },
          {
            value: 2,
            label: this.$t('ampere'),
          },
          {
            value: 3,
            label: this.$t('leakageCurrentmA'),
          },
          {
            value: 4,
            label: this.$t('temperature1'),
          },
          {
            value: 5,
            label: this.$t('volt'),
          },
          {
            value: 13,
            label: this.$t('switchStatus'),
          },
        ],
        evaluateAttr: [
          {
            value: 1,
            label: this.$t('sumValue'),
          },
          {
            value: 2,
            label: this.$t('differenceValue'),
          },
          {
            value: 3,
            label: this.$t('maxValue'),
          },
          {
            value: 4,
            label: this.$t('minValue'),
          },
          {
            value: 5,
            label: this.$t('averageValue'),
          },
        ],
        lineAttr: [
          {
            value: 6,
            label: this.$t('allLine'),
          },
          {
            value: 7,
            label: this.$t('anyLine'),
          },
        ],
        comparisonAttr: [
          {
            value: 1,
            label: this.$t('greaterThan'),
          },
          {
            value: 2,
            label: this.$t('lessThan'),
          },
          {
            value: 3,
            label: this.$t('equal'),
          },
        ],
        conditionsAttr: [
          {
            value: 4,
            label: this.$t('temperature'),
          },
          {
            value: 10,
            label: this.$t('humidity'),
          },
        ],
        illuminanceAttr: [
          {
            value: 12,
            label: this.$t('illuminationCelsius'),
          },
        ],
        conditionsType: [
          {
            value: 1,
            label: this.$t('above'),
          },
          {
            value: 2,
            label: this.$t('below'),
          },
        ],
        smokeType: [
          {
            value: 2002,
            label: this.$t('smokecallThePolice'),
          },
          {
            value: 9000,
            label: this.$t('devicemalfunctioncallThePolice'),
          },
        ],
        gasType: [
          {
            value: 2006,
            label: this.$t('gascallThePolice'),
          },
          {
            value: 9000,
            label: this.$t('devicemalfunctioncallThePolice'),
          },
        ],
        openClose: [],
        alarms: [
          {
            value: 'alarms',
            label: this.$t('alarm'),
            children: [],
          },
          {
            value: 'warns',
            label: this.$t('earlyWarning'),
            children: [],
          },
          // 自定义报警
          {
            value: 'custom',
            label: this.$t('customAlarm'),
            children: [],
          },
        ],
        ifValue: '',
        infinityMode: '',
        weekList: [
          { value: '一', label: this.$t('monday') },
          { value: '二', label: this.$t('tuesday') },
          { value: '三', label: this.$t('wednesday') },
          { value: '四', label: this.$t('thursday') },
          { value: '五', label: this.$t('friday') },
          { value: '六', label: this.$t('saturday') },
          { value: '日', label: this.$t('sunday') },
        ],
        infinityWeek: [],
        infinityList: [
          { value: 0, label: this.$t('noInfinity') },
          { value: 1, label: this.$t('everyDay') },
          { value: 2, label: this.$t('weekly') },
        ],
        equipmentrValue: '1,2',
        attrValue: '',
        microBreakValue: '',
        evaluateValue: '',
        lineValue: '',
        openCloseValue: '',
        comparisonValue: '',
        typeValue: '',
        smokeValue: '',
        gasValue: '',
        edit: false,
        actionEdit: false,
        tags: [],
        index: 0,
        actionIndex: 0,
        ruleForm: {
          mac: '',
        },
        mac: '',
        data: [],
        timeRange: '',
        pageNum: 1,
        currentPage: 1,
        pageSize: 20,
        total: 0,
        equipmentFlag: false,
        linkagecolumns: [
          {
            type: 'index',
            title: this.$t('index'),
            width: 120,
            align: 'left',
          },
          {
            title: this.$t('linkageName'),
            slot: 'name',
            align: 'left',
          },
          {
            title: this.$t('state'),
            slot: 'status',
            align: 'left',
          },
          {
            title: this.$t('remark'),
            key: 'remark',
            align: 'left',
          },
          {
            title: this.$t('operation'),
            slot: 'operating',
            align: 'center',
          },
        ],
        preListcolumns: [
          {
            title: this.$t('deviceName'),
            slot: 'name',
            align: 'left',
          },
          {
            title: this.$t('line'),
            slot: 'mac',
            align: 'left',
          },
          {
            title: this.$t('condition'),
            slot: 'equipmentrValue',
            width: '200px',
            align: 'left',
          },
          {
            title: this.$t('operation'),
            slot: 'operating',
            align: 'center',
          },
        ],
        actionsListcolumns: [
          {
            title: this.$t('deviceName'),
            slot: 'name',
            width: '200px',
            align: 'left',
          },
          {
            title: this.$t('line'),
            slot: 'others.title',
            width: '150px',
            align: 'left',
          },
          {
            title: this.$t('actionType'),
            slot: 'actionType',
            align: 'left',
          },
          {
            title: this.$t('operation'),
            slot: 'operating',
            align: 'center',
          },
        ],
        actionLine: [],
        evaluateType: false,
        datacolumns: [
          {
            title: this.$t('equipmentNo'),
            key: 'mac',
            align: 'left',
          },
          {
            title: this.$t('deviceAliases'),
            slot: 'macname',
            align: 'left',
          },
          {
            title: this.$t('position'),
            key: 'build',
            align: 'left',
          },
          {
            title: this.$t('unit1'),
            key: 'unit',
            align: 'left',
          },
          {
            title: this.$t('room'),
            key: 'room',
            align: 'left',
          },
          {
            title: this.$t('operation'),
            slot: 'operating',
            align: 'center',
          },
        ],
      }
    },
    created() {},
    mounted() {
      this.init()
      setTimeout(() => {
        this.handleObjData()
      }, 1000)
      // console.log(this.$route.params.executeConfigId, 'executeConfigId222');
      if (this.$route.params.executeConfigId) {
        this.scenes.id = this.$route.params.executeConfigId
        this.handleLinkageSceneDetails()
      }
    },
    methods: {
      ...mapMutations('linkage', ['setVersion']),
      openPwdsModal(id) {
        this.newPwdsSeconed = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
          this.rowDatas = id
        } else {
          this.handleSceneDels(id)
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
          return this.$Message.error({
            content: this.$t('pleaseEnterComplateSubPassword'),
          })
        }
        const encry = new JSEncrypt()
        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          checkSecondPwd({ secondPwd: encry.encrypt(this.newPwdsSeconed), encB64: true }).then(res => {
            if (res.success) {
              if (res.code === '0') {
                // this.$Message.success({
                //     content: '校验成功'
                // })
                this.openSeconedPwd = false
                this.handleSceneDel(this.rowDatas)
              }
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        })
      },
      closePwds() {
        this.openSeconedPwd = false
        this.$Message.info({
          content: this.$t('cancelDelete'),
        })
      },
      handleSceneDels(id) {
        let params = {
          sceneId: id,
          projectCode: this.$store.state.projectCode,
        }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmDeleteconfig'),
          onOk: () => {
            linkageSceneDel(params)
              .then(res => {
                if (res.success) {
                  this.$Message.success({
                    content: res.message,
                  })
                  this.pageNum = 1
                  this.queryLinkageSceneList(this.pageNum)
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
      getLightChange(val) {
        if (val === 'adjustBrightness') {
          this.adBrightShow = true
        } else {
          this.adBrightShow = false
        }
      },
      handleCameraSave() {
        if (this.cameraEditType.length === 0) {
          this.$Message.error({
            content: this.$t('pleaseSelectHasAlarmTypeDevice'),
          })
          return false
        }
        if (this.preData.mac === '' || !this.cameraEditValue) {
          this.$Message.error({
            content: this.$t('uninformation'),
          })
          return false
        }

        this.cameraVisible = false
        this.dialogDetails = true
        let newType = this.cameraEditType.filter(item => this.cameraEditValue === item.value)
        this.preList.forEach((item, index) => {
          if (index === this.index) {
            item.others = { mac: this.preData.mac, macName: this.preData.name }
            item.typeNumber = newType[0].typeNumber
            item.logicType = this.ifValue
            item.subTypeNumber = newType[0].value
            item.subTypeName = newType[0].label
          }
        })
      },
      handlecameraClose() {
        this.cameraVisible = false
        this.dialogDetails = true
      },
      getRule(val) {
        if (!val) {
          this.$Message.error({
            content: this.$t('silencePeriod'),
          })
        }
        if (val < 3) {
          this.reticentperiod = 3
        }
      },
      changePages(e) {
        this.pageNum = e
        this.queryLinkageSceneList(e)
      },
      init() {
        this.queryLinkageSceneList(1)
        this.handleAlarmFocus()
      },
      getMesageTip(val) {
        if (val) {
          if (this.selecTemList.length < 1) {
            if (this.preData.tags.length < 1 || this.lineSelect < 1) {
              this.$Message.error({
                content: this.$t('pleaseSelectLine1'),
              })
            }
            if (!this.microBreakValue || !this.comparisonValue) {
              this.$Message.error({
                content: this.$t('pleaseSelectConditionType1'),
              })
            }
          }
        }
      },
      getTypeLists(val, list) {
        let arr = this.lineSelect

        let params
        if (this.edit) {
          params = {
            projectCode: this.$store.state.projectCode,
            mac: this.preList[val].others.mac,
            addrs: Array.isArray(arr) && arr.length > 1 ? arr.join() : arr.toString(),
          }
        } else {
          params = {
            projectCode: this.$store.state.projectCode,
            mac: this.preData.mac || this.preList.others.mac,
            addrs: arr.join() || arr.toString(),
          }
        }

        getTmpTypeList(params).then(res => {
          if (res.success) {
            this.selecTemList = res.data
            if (list) {
              this.selectTem = list.map(item => +item)
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
      changeInfinityValue(val) {
        if (val !== 2) {
          this.infinityWeek = []
        }

        this.infinityTime = []
        this.timeLists = [{ value: Math.random() * 100 + 'inifinty', showSpan: false }]
      },
      editList(val) {
        if (val === 'add') {
          if (this.timeLists.length > 9) {
            this.$Message.error({ content: this.$t('cantAdd') })
            return false
          }
          this.timeLists.push({
            value: Math.random() * 100 + 'inifinty',
            showSpan: false,
          })
        } else {
          if (this.timeLists.length <= 0) {
            this.infinityTime = []
            this.timeLists = []
          }
          this.timeLists.splice(val, 1)
          this.infinityTime.splice(val, 1)
        }
      },
      changeTemEchart(val) {},
      queryLinkageSceneList(pageNo) {
        let params = {
          projectCode: this.$store.state.projectCode,
          pageSize: 10,
          pageNo,
        }

        linkageSceneList(params).then(res => {
          if (res.success) {
            this.linkageData = res.datas
            this.totals = res.total
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
      handleSqmodel(val) {
        this.sqmodel = val
      },
      changeValue(val) {
        this.value1 = val
      },
      handleLinkageSceneSave() {
        if (!this.scenes.name) {
          this.$Message.error({
            content: this.$t('pleaseEnter') + this.$t('linkage') + this.$t('name'),
          })
          return false
        }
        let params

        if (this.editSave === 2) {
          params = {
            extValue: this.$store.state.projectCode,
            name: this.scenes.name,
            remark: this.scenes.remark,
            status: this.scenes.status,
          }
        } else {
          if (this.infinityMode && this.infinityMode === 0) {
            this.timeRange = this.value1[0].length
              ? dayjs(this.value1[0]).format('YYYY-MM-DD HH:mm') + '~' + dayjs(this.value1[1]).format('YYYY-MM-DD HH:mm')
              : this.$func.formatDate('yyyy-MM-dd HH:mm', this.value1[0]).slice(0, 16) + '~' + this.$func.formatDate('yyyy-MM-dd HH:mm', this.value1[1]).slice(0, 16)
          } else if (this.infinityMode && this.infinityMode !== 0) {
            let newInfiityArr = Array.isArray(this.infinityTime) && this.infinityTime.length && this.infinityTime.map(item => item.join('~'))
            this.timeRange = newInfiityArr.join(',')
          }

          let newWeek = this.infinityMode === 0 ? '' : this.infinityMode === 1 ? '日,一,二,三,四,五,六' : this.infinityWeek.join()

          params = {
            name: this.scenes.name,
            status: this.scenes.status,
            remark: this.scenes.remark,
            id: this.scenes.id,
            timeRanges: this.timeRange.length > 0 ? this.timeRange : this.scenes.timeRanges,
            extValue: this.$store.state.projectCode,
            exeFrequency: this.scenes.exeFrequency,
            weekday: newWeek || this.scenes.weekday,
          }
        }

        linkageSceneSave(params).then(res => {
          if (res.success) {
            this.handleLinkageSceneClose()
            this.queryLinkageSceneList(1)
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
      handleLinkageSceneClose() {
        this.linkageFlag = false
        this.scenes = {
          id: '',
          name: '',
          remark: '',
        }
      },
      handleObjData() {
        this.selecTLine.forEach(v => {
          if (v.lineType === 'IO') {
            v.disabled = false
          } else {
            v.disabled = true
          }
          this.lineSelect.map(s => {
            if (v.addr === Number(s)) {
              v.digitalIns.map((d, u) => {
                d.InsId = `InsId${u + 1}`
              })
              v.digitalOuts.map((d, u) => {
                d.InsId = `Outs${u + 1}`
              })
              v.analogIns.map((d, u) => {
                d.InsId = `AnalogIns${u + 1}`
              })
              this.switchingQuantityObj = [...v.digitalIns, ...v.digitalOuts]
              this.analogInsObj = [...v.analogIns]
              this.actionQuantity = [...v.digitalOuts]
            }
          })
        })
        this.switchingQuantity = this.switchingQuantityObj
      },
      handleLinkageDetailsClose() {
        this.dialogDetails = false
        this.linkageFlag = true
      },
      getinfinityTime(val) {},
      handleLinkageDetailsSave() {
        if (this.value1 === null || this.ifValue === '' || !this.reticentperiod || (this.infinityMode !== 0 && this.infinityTime.length < 1)) {
          this.$Message.error({
            content: this.$t('uninformation'),
          })
          return false
        }
        let alarmsArr = this.alarms[0].children.concat(this.alarms[1].children, this.alarms[2] ? this.alarms[2].children : [])
        let actonsArr = []
        let preArr = []
        let obj
        let arr = []
        let addrOuts = ''
        // console.log(this.actionsList, 'this.actionsList')
        // debugger
        this.actionsList.forEach(item => {
          let alarmTypeNo = alarmsArr.filter(val => val.label === item.alarmTypeNo)

          if (Array.isArray(item.sqmodel) && item.sqmodel.length) {
            item.sqmodel.forEach(val => {
              arr.push(val.split('s')[1])
            })
            addrOuts = `^${arr.join(',')}`
          } else {
            addrOuts = ''
          }
          const newActonType = item.actionType.includes(',3') && !item.alarmCustomId && !alarmTypeNo.length ? item.actionType.slice(0, 1) : item.actionType
          if (['8,3', '9,3', '10,3'].includes(item.actionType)) {
            obj = {
              mac: item.others.mac,
              actionType: newActonType,
              alarmTypeNo: item.alarmCustomId === 0 ? (alarmTypeNo.length > 0 ? alarmTypeNo[0].value : 0) : '1015',
              addrs: '1',
              actionParam: { lighteness: item.actionType === '8,3' ? '0' : item.actionType === '9,3' ? '0' : item.lighteness },
              alarmCustomId: item.alarmCustomId === 0 ? 0 : item.alarmCustomId,
            }
          } else {
            obj = {
              mac: item.others.mac,
              actionType: newActonType,
              alarmTypeNo: item.alarmCustomId === 0 ? (alarmTypeNo.length > 0 ? alarmTypeNo[0].value : 0) : '1015',
              addrs: `${item.addrs + (item.addrs.includes('^') ? '' : addrOuts)}`,
              alarmCustomId: item.alarmCustomId === 0 ? 0 : item.alarmCustomId,
            }
          }

          actonsArr.push(obj)
        })
        if (this.equipmentrValue === 20) {
          if (Array.isArray(this.preList) && this.preList.length) {
            preArr = this.preList.map(item => ({ mac: item.others.mac, logicType: this.ifValue, typeNumber: item.typeNumber, subTypeName: item.subTypeName, subTypeNumber: item.subTypeNumber }))
          }
        } else if (this.equipmentrValue === 22) {
          if (Array.isArray(this.preList) && this.preList.length) {
            preArr = this.preList.map(item => ({ mac: item.others.mac, compType: item.compType, elecType: item.elecType, calcType: item.calcType, compValue: item.compValue, logicType: this.ifValue }))
          }
        } else {
          this.preList.forEach(item => {
            let obj = {
              switchAnalog: item.switchAnalog,
              mac: item.others.mac,
              addrs: item.addrs,

              elecType: item.elecType,
              calcType: item.calcType,
              compType: item.compType,
              compValue: `${item.compValue}`,
              logicType: this.ifValue,
              typeNumber: item.typeNumber,
              tmpTypeList: item.tmpTypeList,
            }
            if (item.digitalOuts !== undefined) {
              obj.digitalOuts = `${item.digitalOuts}`
            }
            if (item.digitalIns !== undefined) {
              obj.digitalIns = `${item.digitalIns}`
            }
            if (item.analogIns !== undefined) {
              obj.analogIns = `${item.analogIns}`
            }

            preArr.push(obj)
          })
        }
        if (this.infinityMode === 2 && this.infinityWeek.length < 1) {
          this.$Message.error({
            content: this.$t('uninformation'),
          })
          return
        }

        if (this.infinityMode === 0) {
          this.timeRange = this.value1[0].length
            ? dayjs(this.value1[0]).format('YYYY-MM-DD HH:mm') + '~' + dayjs(this.value1[1]).format('YYYY-MM-DD HH:mm')
            : this.$func.formatDate('yyyy-MM-dd HH:mm:ss', this.value1[0]).slice(0, 16) + '~' + this.$func.formatDate('yyyy-MM-dd HH:mm:ss', this.value1[1]).slice(0, 16)
        } else {
          let newInfiityArr = Array.isArray(this.infinityTime) && this.infinityTime.length && this.infinityTime.map(item => item.join('~'))
          this.timeRange = newInfiityArr.join(',')
        }
        let params = {
          name: this.scenes.name,
          status: this.scenes.status,
          timeRanges: this.timeRange,
          weekday: this.infinityMode === 0 ? '' : this.infinityMode === 1 ? '日,一,二,三,四,五,六' : this.infinityWeek.join(),
          extValue: this.$store.state.projectCode,
          id: this.scenes.id,
          remark: this.scenes.remark,
          conditions: JSON.stringify(preArr),
          actions: JSON.stringify(actonsArr),
          exeFrequency: this.reticentperiod,
        }
        this.scenes.exeFrequency = this.reticentperiod
        linkageSceneSave(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: res.message,
            })
            this.handleLinkageDetailsClose()
            this.queryLinkageSceneList(1)
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
      handleLinkageSceneDetails() {
        this.linkageFlag = false
        this.preconditionFlag = false
        this.actionFlag = false
        this.dialogDetails = true
        this.handleViewScene(this.scenes)
      },
      handleSceneDel(id) {
        let params = {
          sceneId: id,
          projectCode: this.$store.state.projectCode,
        }
        linkageSceneDel(params)
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: res.message,
              })
              this.pageNum = 1
              this.queryLinkageSceneList(this.pageNum)
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
      handleLinkageScene(obj, val) {
        this.linkageFlag = true
        this.ifValue = this.options[0].value
        if (val) {
          this.editSave = 1
          this.detailsFlag = true
          this.scenes.exeFrequency = obj.exeFrequency
          this.scenes = {
            id: obj.id,
            name: obj.name,
            remark: obj.remark,
            status: obj.status,
            timeRanges: obj.timeRanges,
            exeFrequency: obj.exeFrequency ? obj.exeFrequency : '',
            weekday: obj.weekday,
          }
        } else {
          this.editSave = 2
          this.detailsFlag = false
          this.scenes = {
            id: '',
            name: '',
            remark: '',
            status: '',
            timeRanges: '',
            exeFrequency: '',
            weekday: '',
          }
        }
      },
      handleLinkagedeLock(row) {
        let params = {
          sceneId: row.id,
          projectCode: this.$store.state.projectCode,
          oper: row.status === 2 ? 'unlock' : 'lock',
        }
        linkagedeLock(params).then(res => {
          if (res.success) {
            this.pageNum = this.pageNum
            this.queryLinkageSceneList(this.pageNum)
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
      handleOpenStatus(val) {
        this.preData.num = ''
      },
      handleIfAdd() {
        this.actionValue = ''
        this.linghtValue = ''
        this.cameraValue = ''
        this.digitalIns = []
        this.digitalOuts = []
        this.analogInsObj = []
        this.analogIns = []
        this.switchingQuantityObj = []

        this.sqmodel = ''
        this.linechangeIo = ''
        this.dialogDetails = false
        this.edit = false
        this.preconditionFlag = true
        this.selectTem = []
        this.preData = {
          mac: '',
          name: '',
          num: '',
          tags: [],
        }
        this.lineValue = this.comparisonValue = this.openCloseValue = this.evaluateValue = this.microBreakValue = this.smokeValue = this.gasValue = this.attrValue = this.typeValue = ''
      },
      handleAddAction() {
        this.linechangeIo = ''
        this.actionEdit = false
        this.dialogDetails = false
        this.actionFlag = true
        this.adBrightShow = false
        this.actionData = {
          mac: '',
          macName: '',
          openCloseValue: '',
          tags: [],
          alarm: [],
          sqmodel: [],
        }
      },
      handleViewScene(row) {
        this.scenes.id = row.id
        // this.scenes.status = row.status;
        this.value1 = []
        let params = {
          projectCode: this.$store.state.projectCode,
          sceneId: row.id,
        }
        linkageDetail(params).then(res => {
          if (res.success) {
            if (res.data.scene.weekday.length === 13) {
              this.infinityMode = 1
              let arr = res.data.scene.timeRanges.split(',')
              let newArr = arr.map(item => item.split('~'))
              this.timeLists = arr.map(item => ({ value: Math.random() + 'time', showSpan: false }))
              this.infinityTime = newArr
            } else if (res.data.scene.weekday.length > 0 && res.data.scene.weekday.length < 13) {
              this.infinityMode = 2
              this.infinityWeek = res.data.scene.weekday.split(',')
              let arr = res.data.scene.timeRanges.split(',')
              let newArr = arr.map(item => item.split('~'))
              this.timeLists = arr.map(item => ({ value: Math.random() + 'time', showSpan: false }))
              this.infinityTime = newArr
            } else {
              this.infinityMode = 0
              this.infinityTime = []
              this.timeLists = [{ value: Math.random() + 'time', showSpan: false }]
              let arr = res.data.scene.timeRanges.split('~')

              this.value1 = arr
            }
            this.scenes.name = res.data.scene.name
            this.reticentperiod = res.data.scene.exeFrequency ? res.data.scene.exeFrequency : 180
            let resDatas = res.data
            if (res.data.actions !== []) {
              resDatas.actions.forEach(item => {
                if (item.alarmTypeNo && item.alarmTypeNo !== 1015) {
                  this.alarms[0].children.concat(this.alarms[1].children).forEach(element => {
                    if (element.value === item.alarmTypeNo + '') {
                      item.alarmTypeNo = element.label
                    }
                  })
                }
                if (item.alarmCustomId && item.alarmTypeNo === 1015) {
                  this.alarms[2] &&
                    this.alarms[2].children.forEach(itm => {
                      if (itm.value === item.alarmCustomId) {
                        item.alarmTypeNo = itm.label
                      }
                    })
                }
                if (item.alarmTypeNo === 0) item.alarmTypeNo = ''
              })
            }
            this.ifValue = res.data.conditions.length > 0 ? res.data.conditions[0].logicType : this.options[0].value
            this.equipmentrValue = res.data.conditions.length > 0 ? (res.data.conditions[0].others.equipmentType === 1 || res.data.conditions[0].others.equipmentType === 2 ? '1,2' : res.data.conditions[0].others.equipmentType) : '1,2'

            if (this.equipmentrValue === 20) {
              this.preList = res.data.conditions.map(item => ({ ...item, subTypeName: JSON.parse(item.data).subTypeName, subTypeNumber: JSON.parse(item.data).subTypeNumber }))
            } else {
              this.preList = res.data.conditions
              this.preList.map(val => {
                if (val.analogIns === '' && (val.digitalIns !== '' || val.digitalOuts !== '')) {
                  val.switchAnalog = 1
                } else if (val.analogIns !== '' && (val.digitalIns === '' || val.digitalOuts === '')) {
                  val.switchAnalog = 2
                } else {
                  val.switchAnalog = ''
                }
              })
            }
            let acationData = resDatas.actions.map(item => ({ ...item, lighteness: Object.keys(JSON.parse(item.actionParam)).length > 0 ? item.actionParam : '' }))
            this.scenes.status = res.data.scene.status
            this.$nextTick(() => {
              acationData.forEach(v => {
                v.lighteness = JSON.parse(v.actionParam).lighteness || ''
              })

              this.actionsList = acationData
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
      },
      handlePreClose() {
        this.preconditionFlag = false
        // this.linkageFlag = true
        this.dialogDetails = true
      },
      handleActionClose() {
        this.actionFlag = false
        this.dialogDetails = true
      },
      handlePreAdd(val) {
        this.equipmentTypesNum = ''
        if (val === 'pre') {
          this.equipmentTypesNum = this.equipmentrValue
        } else {
          this.equipmentTypesNum = '1,22'
        }
        this.deviceVisible = true
        this.ruleForm.mac = ''
        this.queryList(this.ruleForm.mac)
      },
      handleSearch() {
        this.currentPage = 1
        this.queryList(this.ruleForm.mac)
      },
      handleLine(val) {
        if (val === 'pre') {
          this.lineMac = this.preData.mac
          // this.lineTags = this.preData.tags;
        } else {
          this.lineMac = this.actionData.mac
          this.lineTags = this.actionData.tags
        }
        this.lineVisible = true
      },
      receiveChannels(val) {
        if (this.preconditionFlag) {
        } else if (this.actionFlag) {
          this.actionData.tags = val
        }
        this.lineVisible = false
      },
      handleCloseTag(val, tag) {
        if (val === 'pre') {
        } else if (val === 'action') {
          this.actionData.tags.splice(this.actionData.tags.indexOf(tag), 1)
        }
      },
      handlemicroBreak(val) {
        if (val === 4) {
          this.getTypeLists()
        }
        this.preData.num = ''
        if (val === 13 || val === 18) {
          this.comparisonAttr = [
            {
              value: 3,
              label: this.$t('equal'),
            },
          ]
        } else {
          this.comparisonAttr = [
            {
              value: 1,
              label: this.$t('greaterThan'),
            },
            {
              value: 2,
              label: this.$t('lessThan'),
            },
            {
              value: 3,
              label: this.$t('equal'),
            },
          ]
        }
        // if (val === 13 && !this.evaluateType) {

        // }
      },
      switchAnalogType(val) {
        this.handleObjData()
        this.sqmodel = []
        this.attrValue = ''
        this.comparisonValue = ''
        this.evaluateValue = ''
        this.openCloseValue = ''
        this.preData.num = ''
        this.switchingQuantity = []
        if (this.linechangeIo !== '') {
          if (val === 1) {
            this.switchingQuantity = this.switchingQuantityObj

            this.microBreakAttr = [
              {
                value: 18,
                label: this.$t('switchStatus'),
              },
            ]
            this.evaluateAttr = [
              {
                value: 6,
                label: this.$t('allPorts'),
              },
              {
                value: 7,
                label: this.$t('anyPort'),
              },
            ]
            this.comparisonAttr = [
              {
                value: 3,
                label: this.$t('equal'),
              },
            ]
          } else {
            this.switchingQuantity = this.analogInsObj
            this.microBreakAttr = [
              {
                value: 16,
                label: this.$t('acquisition'),
              },
              {
                value: 17,
                label: this.$t('displayValue'),
              },
            ]
            this.evaluateAttr = [
              {
                value: 1,
                label: this.$t('sumValue'),
              },
              {
                value: 2,
                label: this.$t('differenceValue'),
              },
              {
                value: 3,
                label: this.$t('maxValue'),
              },
              {
                value: 4,
                label: this.$t('minValue'),
              },
              {
                value: 5,
                label: this.$t('averageValue'),
              },
            ]
            this.comparisonAttr = [
              {
                value: 1,
                label: this.$t('greaterThan'),
              },
              {
                value: 2,
                label: this.$t('lessThan'),
              },
              {
                value: 3,
                label: this.$t('equal'),
              },
            ]
          }
        }
      },
      getLineChange2(val) {
        // console.log(Array.isArray(val), !val.length, 'Array.isArray(val)')
        if (Array.isArray(val) && !val.length) {
          this.selecTLineAction.forEach(val => {
            val.disabled = false
          })
        }
        this.openCloseAction = []
        if (!!val && ((val.includes(';') && val.split(';')[1] === 'IO') || (Array.isArray(val) && val.length && val[0].split(';')[1] === 'IO'))) {
          this.openCloseAction = [
            {
              value: '4',
              label: 'ON',
            },
            {
              value: '5',
              label: 'OFF',
            },
            {
              value: '7',
              label: this.$t('inching'),
            },
            {
              value: '0',
              label: this.$t('noAction'),
            },
          ]
          this.isMoreSelect = false
          this.linechangeIo = 'IO'
          let isIoLine = !Array.isArray(val) && val.split(';')[1] === 'IO'
          this.lineSelect = isIoLine ? val.split(';')[0] : val[0].split(';')[0]
          // console.log(this.lineSelect, this.selecTLineAction, 'this.lineSelect')
          this.selecTLineAction.forEach(v => {
            v.disabled = v.lineType !== 'IO'
            if (v.addr === +this.lineSelect) {
              v.digitalIns.forEach((d, u) => {
                d.InsId = `InsId${u + 1}`
              })
              v.digitalOuts.forEach((d, u) => {
                d.InsId = `Outs${u + 1}`
              })
              v.analogIns.forEach((d, u) => {
                d.InsId = `AnalogIns${u + 1}`
              })
              this.actionQuantity = [...v.digitalOuts]
            }
          })
        }
        if ((!!val && val.includes(';') && val.split(';')[1] !== 'IO') || (Array.isArray(val) && val.length && val[0].split(';')[1] !== 'IO')) {
          // 2
          this.isMoreSelect = true

          this.openCloseAction = [
            {
              value: '1',
              label: this.$t('opening'),
            },
            {
              value: '2',
              label: this.$t('closing'),
            },
            {
              value: '0',
              label: this.$t('noAction'),
            },
          ]
          this.selecTLineAction.forEach(val => {
            val.disabled = val.lineType === 'IO'
          })
        }
      },
      getLineChange(val) {
        let linechangeData = []
        let str = ''
        this.microBreakValue = ''
        this.evaluateValue = ''
        this.comparisonValue = ''
        if (Array.isArray(val)) {
          val.map(item => {
            linechangeData.push(Number(item.split(';')[0]))

            if (item && item.includes(';') && item.split(';')[1] === 'IO') {
              this.evaluateType = true
              this.lineSelect = []
              this.actionLine = []
              this.linechangeIo = item.split(';')[1]
              this.lineSelect.push(item.split(';')[0])
              this.actionLine.push(item.split(';')[0])
              this.handleObjData()
              this.microBreakAttr = [
                {
                  value: 18,
                  label: this.$t('switchStatus'),
                },
              ]
              this.evaluateAttr = [
                {
                  value: 6,
                  label: this.$t('allPorts'),
                },
                {
                  value: 7,
                  label: this.$t('anyPort'),
                },
              ]
              this.comparisonAttr = [
                {
                  value: 3,
                  label: this.$t('equal'),
                },
              ]
              // 4-ON;5-OFF;6-PWM;7-点动
              if (this.actionFlag) {
                // 1
                this.openClose = [
                  {
                    value: '4',
                    label: 'ON',
                  },
                  {
                    value: '5',
                    label: 'OFF',
                  },
                  {
                    value: '7',
                    label: this.$t('inching'),
                  },
                ]
              } else {
                // 1
                this.openClose = [
                  {
                    value: '1',
                    label: 'ON',
                  },
                  {
                    value: '0',
                    label: 'OFF',
                  },
                ]
              }
            } else {
              this.evaluateType = false
              this.selecTLine.map(v => {
                if (v.lineType === 'IO') {
                  this.$set(this.selecTLine, v.disabled, true)
                  v.disabled = true
                  str = `${v.title}(T3-808)`
                  if (v.title.includes('808')) {
                    v.title = v.title
                  } else {
                    v.title = str
                  }
                } else {
                  v.disabled = false
                }
              })

              this.switchAnalog = ''
              this.linechangeIo = ''
              this.lineSelect = linechangeData
              this.actionLine = linechangeData
              // 1
              this.openClose = [
                {
                  value: '1',
                  label: this.$t('opening'),
                },
                {
                  value: '2',
                  label: this.$t('closing'),
                },
              ]
              this.microBreakAttr = [
                {
                  value: 1,
                  label: this.$t('watt1'),
                },
                {
                  value: 2,
                  label: this.$t('ampere'),
                },
                {
                  value: 3,
                  label: this.$t('leakageCurrentmA'),
                },
                {
                  value: 4,
                  label: this.$t('temperature1'),
                },
                {
                  value: 5,
                  label: this.$t('volt'),
                },
                {
                  value: 13,
                  label: this.$t('switchStatus'),
                },
              ]
              this.evaluateAttr = [
                {
                  value: 1,
                  label: this.$t('sumValue'),
                },
                {
                  value: 2,
                  label: this.$t('differenceValue'),
                },
                {
                  value: 3,
                  label: this.$t('maxValue'),
                },
                {
                  value: 4,
                  label: this.$t('minValue'),
                },
                {
                  value: 5,
                  label: this.$t('averageValue'),
                },
              ]

              this.comparisonAttr = [
                {
                  value: 1,
                  label: this.$t('greaterThan'),
                },
                {
                  value: 2,
                  label: this.$t('lessThan'),
                },
                {
                  value: 3,
                  label: this.$t('equal'),
                },
              ]
            }
          })
        } else {
          if (val && val.includes(';') && val.split(';')[1] === 'IO') {
            this.lineSelect = []
            this.actionLine = []
            this.linechangeIo = val.split(';')[1]
            this.lineSelect.push(val.split(';')[0])
            this.actionLine.push(val.split(';')[0])
            this.handleObjData()
            // 4-ON;5-OFF;6-PWM;7-点动
            if (this.actionFlag) {
              // 1
              this.openClose = [
                {
                  value: '4',
                  label: 'ON',
                },
                {
                  value: '5',
                  label: 'OFF',
                },
                {
                  value: '7',
                  label: this.$t('inching'),
                },
              ]
            } else {
              // 1
              this.openClose = [
                {
                  value: '1',
                  label: 'ON',
                },
                {
                  value: '0',
                  label: 'OFF',
                },
              ]
            }
          } else {
            this.switchAnalog = ''
            this.linechangeIo = ''
            this.lineSelect = linechangeData
            this.actionLine = linechangeData
            // 1
            this.openClose = [
              {
                value: '1',
                label: this.$t('opening'),
              },
              {
                value: '2',
                label: this.$t('closing'),
              },
            ]
            this.microBreakAttr = [
              {
                value: 1,
                label: this.$t('watt1'),
              },
              {
                value: 2,
                label: this.$t('ampere'),
              },
              {
                value: 3,
                label: this.$t('leakageCurrentmA'),
              },
              {
                value: 4,
                label: this.$t('temperature1'),
              },
              {
                value: 5,
                label: this.$t('volt'),
              },
              {
                value: 13,
                label: this.$t('switchStatus'),
              },
            ]
            this.evaluateAttr = [
              {
                value: 1,
                label: this.$t('sumValue'),
              },
              {
                value: 2,
                label: this.$t('differenceValue'),
              },
              {
                value: 3,
                label: this.$t('maxValue'),
              },
              {
                value: 4,
                label: this.$t('minValue'),
              },
              {
                value: 5,
                label: this.$t('averageValue'),
              },
            ]
            this.comparisonAttr = [
              {
                value: 1,
                label: this.$t('greaterThan'),
              },
              {
                value: 2,
                label: this.$t('lessThan'),
              },
              {
                value: 3,
                label: this.$t('equal'),
              },
            ]
          }
        }

        if (this.analogInsObj.length === 0) {
          this.switchingAnalogData = [
            {
              value: 1,
              label: this.$t('switching'),
            },
          ]
        } else {
          this.switchingAnalogData = [
            {
              value: 1,
              label: this.$t('switching'),
            },
            {
              value: 2,
              label: this.$t('unitConversion'),
            },
          ]
        }

        this.$forceUpdate()
      },
      onclear() {
        this.selecTLine.forEach(val => {
          val.disabled = false
        })
      },
      onclear2() {
        this.linechangeIo = ''
        this.selecTLineAction.forEach(val => {
          val.disabled = false
        })
      },
      handlePreSave() {
        if (this.equipmentrValue === 11 || this.equipmentrValue === 14) {
          if (this.preData.mac === '' || this.typeValue === '' || this.attrValue === '' || this.preData.num === '') {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
        } else if (this.equipmentrValue === 6 || this.equipmentrValue === 10) {
          if (this.preData.mac === '' || this.smokeValue === '') {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
        } else if (this.equipmentrValue === 5) {
          if (this.preData.mac === '' || this.pressureValue === '' || this.typeValue === '' || this.preData.num === '' || (this.preData.num.indexOf('.') !== -1 && this.preData.num.toString().split('.')[1].length === 0)) {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
        } else if (this.equipmentrValue === 4) {
          if (this.preData.mac === '' || this.levelValue === '' || this.typeValue === '' || this.preData.num === '' || (this.preData.num.indexOf('.') !== -1 && this.preData.num.toString().split('.')[1].length === 0)) {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
        } else if (this.equipmentrValue === 18) {
          if (this.preData.mac === '' || this.waterValue === '') {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
        } else if (this.equipmentrValue === '1,2') {
          if (this.microBreakValue === 4) {
            if (this.selectTem.length < 1) {
              this.$Message.error({
                content: this.$t('uninformation'),
              })
              return false
            }
          }
          if (this.microBreakValue === 13) {
            if (
              this.preData.mac === '' ||
              // this.preData.tags.length === 0 ||
              this.lineSelect.length === 0 ||
              this.lineValue === '' ||
              this.comparisonValue === '' ||
              this.openCloseValue === ''
            ) {
              this.$Message.error({
                content: this.$t('uninformation'),
              })
              return false
            }
          } else {
            if (
              this.preData.mac === '' ||
              // this.preData.tags.length === 0 ||
              this.lineSelect.length === 0 ||
              this.microBreakValue === '' ||
              this.evaluateValue === '' ||
              this.comparisonValue === ''
            ) {
              this.$Message.error({
                content: this.$t('uninformation'),
              })
              return false
            }
          }

          if (!Array.isArray(this.selectlIne)) {
            if (this.selectlIne.split(';')[1] === 'IO') {
              if (this.switchAnalog === '' || this.sqmodel === '' || this.microBreakValue === '' || this.evaluateValue === '' || this.comparisonValue === '') {
                this.$Message.error({
                  content: this.$t('uninformation'),
                })
                return false
              }
              if (this.sqmodel.length === 0) {
                this.$Message.error({
                  content: this.$t('uninformation'),
                })
                return false
              }
            }
          } else {
            if (this.selectlIne[0].split(';')[1] === 'IO') {
              if (this.switchAnalog === '' || this.sqmodel === '' || this.microBreakValue === '' || this.evaluateValue === '' || this.comparisonValue === '') {
                this.$Message.error({
                  content: this.$t('uninformation'),
                })
                return false
              }
              if (this.sqmodel.length === 0) {
                this.$Message.error({
                  content: this.$t('uninformation'),
                })
                return false
              }
            } else {
              if (this.microBreakValue === '') {
                if (this.microBreakValue === 13) {
                  if (this.lineValue === '' || this.comparisonValue === '') {
                    this.$Message.error({
                      content: this.$t('uninformation'),
                    })
                    return false
                  }
                } else {
                  if (this.evaluateValue === '' || this.comparisonValue === '') {
                    this.$Message.error({
                      content: this.$t('uninformation'),
                    })
                    return false
                  }
                }
              }
            }
          }
        } else if (this.equipmentrValue === 20) {
          if (this.cameraValue === '' && !this.controlCameraDis) {
            this.$Message.error({
              content: this.$t('pleaseSelectHasAlarmTypeDevice'),
            })
            return false
          }
          if (this.preData.mac === '' || this.cameraValue === '') {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
        } else if (this.equipmentrValue === 22) {
          if (this.preData.mac === '' || this.actionValue === '' || this.linghtValue === '') {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
        } else {
          if (this.preData.mac === '' || this.gasValue === '') {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
        }
        if (this.edit) {
          if (this.equipmentrValue === 11 || this.equipmentrValue === 14) {
            this.preList[this.index].others.mac = this.preData.mac
            this.preList[this.index].compType = this.typeValue
            this.preList[this.index].others.macName = this.preData.name
            this.preList[this.index].elecType = this.attrValue
            this.preList[this.index].compValue = this.preData.num

            if (this.preList.length >= 1) {
              let i = 0
              this.preList.forEach(element => {
                if (
                  element.compType === this.preList[this.index].compType &&
                  element.others.mac === this.preList[this.index].others.mac &&
                  element.others.macName === this.preList[this.index].others.macName &&
                  element.compValue === this.preList[this.index].compValue &&
                  element.elecType === this.preList[this.index].elecType
                ) {
                  i++
                }
              })
              if (i > 1) {
                this.preList.splice(this.index, 1)
              }
            }
          } else if (this.equipmentrValue === 4) {
            this.preList[this.index].others.mac = this.preData.mac
            this.preList[this.index].others.macName = this.preData.name
            this.preList[this.index].compType = this.typeValue
            this.preList[this.index].compValue = this.preData.num
            this.preList[this.index].elecType = this.levelValue
          } else if (this.equipmentrValue === 5) {
            this.preList[this.index].others.mac = this.preData.mac
            this.preList[this.index].others.macName = this.preData.name
            this.preList[this.index].compType = this.typeValue
            this.preList[this.index].compValue = this.preData.num
            this.preList[this.index].elecType = this.pressureValue
          } else if (this.equipmentrValue === 18) {
            this.preList[this.index].others.macName = this.preData.name
            this.preList[this.index].others.mac = this.preData.mac
            this.preList[this.index].typeNumber = this.waterValue
          } else if (this.equipmentrValue === '1,2') {
            let titleArr = []
            let addrArr = []
            let titles = []
            this.digitalIns = []
            this.digitalOuts = []
            this.analogIns = []
            if (this.lineSelect.length > 0) {
              this.selecTLine.forEach(item => {
                this.lineSelect.forEach(itm => {
                  if (+item.addr === +itm) {
                    titleArr.push(item.title)
                    addrArr.push(item.addr)
                  }
                })
              })
            }
            let arr = []
            if (this.sqmodel !== '') {
              this.sqmodel.map(val => {
                if (this.switchAnalog === 1) {
                  if (val.indexOf('InsId') !== -1) {
                    this.digitalIns.push(val)
                  } else {
                    this.digitalOuts.push(val)
                  }
                  this.switchingQuantityObj.map(item => {
                    if (val === item.InsId) {
                      arr.push(item.name)
                    }
                  })
                }
                if (this.switchAnalog === 2) {
                  this.analogIns.push(val)

                  this.analogInsObj.forEach(item => {
                    if (val === item.InsId) {
                      arr.push(item.name)
                    }
                  })
                }
              })
            }

            this.digitalIns = this.digitalIns === [] ? '' : `${this.digitalIns}`
            this.digitalOuts = this.digitalOuts === [] ? '' : `${this.digitalOuts}`
            this.analogIns = this.analogIns === [] ? '' : `${this.analogIns}`
            this.digitalIns = this.digitalIns === '' ? '' : this.digitalIns.match(/\d+(.\d+)?/g)
            this.digitalOuts = this.digitalOuts === '' ? '' : this.digitalOuts.match(/\d+(.\d+)?/g)
            this.analogIns = this.analogIns === '' ? '' : this.analogIns.match(/\d+(.\d+)?/g)
            if (this.switchAnalog !== '') {
              titles = `${titleArr.join(',')}^${arr}`
            } else {
              titles = titleArr.join(',')
            }

            this.preList[this.index].tmpTypeList = this.selectTem.length > 1 ? this.selectTem.join(',') : String(this.selectTem)
            this.preList[this.index].others.mac = this.preData.mac
            this.preList[this.index].compType = this.comparisonValue
            this.preList[this.index].others.macName = this.preData.name
            this.preList[this.index].elecType = this.microBreakValue
            this.preList[this.index].switchAnalog = this.switchAnalog

            let str = ''

            if (this.preList[this.index].analogIns === '' && this.preList[this.index].digitalIns === '' && this.preList[this.index].digitalOuts === '') {
              if (this.openCloseValue === '1') {
                str = 'false'
              } else if (this.openCloseValue === '2') {
                str = 'true'
              } else {
                str = this.openCloseValue
              }
            } else {
              str = this.openCloseValue
            }
            console.log('🚀 ~ handlePreSave ~ str:', str, this.preData.num)
            this.preList[this.index].compValue = this.preData.num ? this.preData.num : str
            if (this.microBreakValue === 13 && this.switchAnalog === '') {
              this.preList[this.index].calcType = this.lineValue
            } else {
              this.preList[this.index].calcType = this.evaluateValue ? this.evaluateValue : this.lineValue
            }

            this.preList[this.index].others.title = titles

            this.preList[this.index].addrs = addrArr.join(',')
            this.preList[this.index].digitalIns = this.digitalIns
            this.preList[this.index].digitalOuts = this.digitalOuts
            this.preList[this.index].analogIns = this.analogIns

            if (this.preList.length >= 1) {
              let i = 0
              this.preList.forEach(element => {
                if (
                  element.compType === this.preList[this.index].compType &&
                  element.others.mac === this.preList[this.index].others.mac &&
                  element.others.macName === this.preList[this.index].others.macName &&
                  element.compValue === this.preList[this.index].compValue &&
                  element.elecType === this.preList[this.index].elecType &&
                  element.calcType === this.preList[this.index].calcType &&
                  element.addrs === this.preList[this.index].addrs &&
                  element.digitalIns === this.preList[this.index].digitalIns &&
                  element.digitalOuts === this.preList[this.index].digitalOuts &&
                  element.analogIns === this.preList[this.index].analogIns
                ) {
                  i++
                }
              })
              if (i > 1) {
                this.preList.splice(this.index, 1)
              }
            }
          } else if (this.equipmentrValue === 22) {
            this.preList[this.index].others.mac = this.preData.mac
            this.preList[this.index].others.macName = this.preData.name
            this.preList[this.index].compValue = String(this.actionValue === 1)
            this.preList[this.index].elecType = this.linghtValue
            this.preList[this.index].compType = 3
            this.preList[this.index].calcType = 7
            this.preList[this.index].equipmentrValue = this.equipmentrValue
          } else {
            if (this.equipmentrValue === 6 || this.equipmentrValue === 10) {
              this.preList[this.index].typeNumber = this.smokeValue
            } else {
              this.preList[this.index].typeNumber = this.gasValue
            }
            if (this.preList.length >= 1) {
              let i = 0
              this.preList.forEach(element => {
                if (element.typeNumber === this.preList[this.index].typeNumber && element.others.mac === this.preList[this.index].others.mac && element.others.macName === this.preList[this.index].others.macName) {
                  i++
                }
              })
              if (i > 1) {
                this.preList.splice(this.index, 1)
              }
            }
          }
        } else {
          let params
          if (this.equipmentrValue === 11 || this.equipmentrValue === 14) {
            params = {
              others: {
                mac: this.preData.mac,
                macName: this.preData.name,
              },
              addrs: '1',
              elecType: this.attrValue,
              calcType: '1',
              compType: this.typeValue,
              compValue: `${this.preData.num}`,
              logicType: this.ifValue,
              equipmentrValue: this.equipmentrValue,
            }
          } else if (this.equipmentrValue === '1,2') {
            let addr = ''
            let titles = ''

            if (this.lineSelect.length > 0) {
              addr = this.lineSelect.toString()
              let titleArr = []
              this.selecTLine.forEach(item => {
                this.lineSelect.forEach(itm => {
                  if (+item.addr === +itm) {
                    titleArr.push(item.title)
                  }
                })
              })
              let arr = []

              if (this.sqmodel !== '') {
                this.sqmodel.map(val => {
                  if (this.switchAnalog === 1) {
                    if (val.indexOf('InsId') !== -1) {
                      this.digitalIns.push(val)
                    } else {
                      this.digitalOuts.push(val)
                    }
                    this.switchingQuantityObj.map(item => {
                      if (val === item.InsId) {
                        arr.push(item.name)
                      }
                    })
                  }
                  if (this.switchAnalog === 2) {
                    this.analogIns.push(val)

                    this.analogInsObj.map(item => {
                      if (val === item.InsId) {
                        arr.push(item.name)
                      }
                    })
                  }
                })
              }
              this.digitalIns = this.digitalIns === [] ? '' : `${this.digitalIns}`
              this.digitalOuts = this.digitalOuts === [] ? '' : `${this.digitalOuts}`
              this.analogIns = this.analogIns === [] ? '' : `${this.analogIns}`

              this.digitalIns = this.digitalIns === '' ? '' : this.digitalIns.match(/\d+(.\d+)?/g)
              this.digitalOuts = this.digitalOuts === '' ? '' : this.digitalOuts.match(/\d+(.\d+)?/g)
              this.analogIns = this.analogIns === '' ? '' : this.analogIns.match(/\d+(.\d+)?/g)

              if (this.switchAnalog !== '') {
                titles = `${titleArr.join(',')}^${arr}`
              } else {
                titles = titleArr.join(',')
              }
            }
            let compValue = ''
            if (this.analogIns === '' && this.digitalIns === '' && this.digitalOuts === '') {
              if (this.openCloseValue === '1') {
                compValue = 'false'
              } else if (this.openCloseValue === '2') {
                compValue = 'true'
              } else {
                compValue = this.openCloseValue
              }
            } else {
              compValue = this.openCloseValue
            }

            params = {
              others: {
                mac: this.preData.mac,
                macName: this.preData.name,
                title: titles,
              },
              digitalIns: `${this.digitalIns}`,
              digitalOuts: `${this.digitalOuts}`,
              analogIns: `${this.analogIns}`,
              switchAnalog: this.switchAnalog,
              addrs: addr instanceof Array ? addr.toString() : addr,
              elecType: this.microBreakValue,
              calcType: this.evaluateValue ? this.evaluateValue : this.lineValue,
              compType: this.comparisonValue,
              compValue: this.preData.num ? `${this.preData.num}` : compValue,
              logicType: this.ifValue,
              tmpTypeList: this.selectTem.length > 1 ? this.selectTem.join(',') : this.selectTem.toString(),
              equipmentrValue: this.equipmentrValue,
            }
          } else if (this.equipmentrValue === 4) {
            params = {
              others: {
                mac: this.preData.mac,
                macName: this.preData.name,
              },
              addrs: '1',
              calcType: '1',
              elecType: this.levelValue,
              compType: this.typeValue,
              compValue: this.preData.num,
              logicType: this.ifValue,
              equipmentrValue: this.equipmentrValue,
            }
          } else if (this.equipmentrValue === 5) {
            params = {
              others: {
                mac: this.preData.mac,
                macName: this.preData.name,
              },
              addrs: '1',
              calcType: '1',
              elecType: this.pressureValue,
              compType: this.typeValue,
              compValue: this.preData.num,
              logicType: this.ifValue,
              equipmentrValue: this.equipmentrValue,
            }
          } else if (this.equipmentrValue === 18) {
            params = {
              others: {
                mac: this.preData.mac,
                macName: this.preData.name,
              },
              typeNumber: this.waterValue ? this.waterValue : this.gasValue,
              logicType: this.ifValue,
              gasValue: this.gasValue,
              equipmentrValue: this.equipmentrValue,
            }
          } else if (this.equipmentrValue === 20) {
            let newType = this.cameraType.filter(item => this.cameraValue === item.value)

            params = {
              others: {
                mac: this.preData.mac,
                macName: this.preData.name,
              },
              typeNumber: newType[0].typeNumber,
              logicType: this.ifValue,
              subTypeNumber: newType[0].value,
              subTypeName: newType[0].label,
            }
            this.preList.push(params)
          } else if (this.equipmentrValue === 22) {
            params = {
              others: {
                mac: this.preData.mac,
                macName: this.preData.name,
              },
              equipmentrValue: this.equipmentrValue,
              elecType: this.linghtValue,
              calcType: 7,
              compType: 3,
              compValue: String(this.actionValue === 1),
            }
          } else {
            params = {
              others: {
                mac: this.preData.mac,
                macName: this.preData.name,
              },
              typeNumber: this.smokeValue ? this.smokeValue : this.gasValue,
              smokeValue: this.smokeValue,
              gasValue: this.gasValue,
              logicType: this.ifValue,
              equipmentrValue: this.equipmentrValue,
            }
          }

          if (this.preList.length >= 1) {
            let i = 0
            if (this.equipmentrValue === 11 || this.equipmentrValue === 14) {
              this.preList.forEach(element => {
                if (element.compType === params.compType && element.others.mac === params.others.mac && element.others.macName === params.others.macName && element.compValue === params.compValue && element.elecType === params.elecType) {
                  i++
                }
              })
            } else if (this.equipmentrValue === '1,2') {
              this.preList.forEach(element => {
                if (
                  element.compType === params.compType &&
                  element.others.mac === params.others.mac &&
                  element.others.macName === params.others.macName &&
                  element.addrs === params.addrs &&
                  element.compValue === params.compValue &&
                  element.elecType === params.elecType &&
                  element.calcType === params.calcType &&
                  element.digitalIns === params.digitalIns &&
                  element.digitalOuts === params.digitalOuts &&
                  element.analogIns === params.analogIns
                ) {
                  i++
                }
              })
            } else {
              this.preList.forEach(element => {
                if (element.typeNumber === params.typeNumber && element.others.mac === params.others.mac && element.others.macName === params.others.macName) {
                  i++
                }
              })
            }
            if (i === 0) {
              this.preList.push(params)
            }
          } else {
            this.preList.push(params)
          }
        }
        this.preconditionFlag = false
        this.dialogDetails = true
        this.switchAnalog = 1
      },
      handleActionSave() {
        if (this.equipmentrValue === '1,2' && this.lightType !== 22) {
          if (this.actionData.openCloseValue === '' || this.actionData.openCloseValue === undefined) {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
          if (this.actionData.alarm.length === 0) {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
          if (this.actionData.alarm === '' && this.actionData.openCloseValue === '') {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
          if (this.actionData.mac === '' || this.actionData.tags.length === 0) {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }

          if (!Array.isArray(this.actionData.tags)) {
            if (this.actionData.sqmodel.length === 0 && this.linechangeIo) {
              this.$Message.error({
                content: this.$t('uninformation'),
              })
              return false
            }
          }
        } else if (this.lightType === 22) {
          if (
            this.lightValue === '' ||
            this.actionData.openCloseValue === '' ||
            ((this.equipmentrValue === '1,2' || this.equipmentrValue === 22) && this.actionData.alarm.length === 0) ||
            this.actionData.mac === '' ||
            (this.actionData.openCloseValue === 'adjustBrightness' && this.lightValue === '')
          ) {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
        } else {
          if (this.actionData.mac === '' || this.actionData.openCloseValue === '') {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return false
          }
        }
        if (this.actionEdit) {
          if (this.lightType === 22) {
            let filterArr = []
            let alarmData = []
            let isCustom = []
            if (this.equipmentrValue === '1,2' || this.equipmentrValue === 22) {
              filterArr = this.alarms[0].children.concat(this.alarms[1].children)
              alarmData = filterArr.filter(v => v.value === this.actionData.alarm[1])
              isCustom = this.alarms[2] && this.alarms[2].children.find(v => v.value === this.actionData.alarm[1])
            }
            // (alarmData, 'alarmData')
            this.actionsList[this.actionIndex].others.mac = this.actionData.mac
            this.actionsList[this.actionIndex].others.macName = this.actionData.macName
            this.actionsList[this.actionIndex].actionType = this.actionData.openCloseValue === 'openLight' ? '9,3' : this.actionData.openCloseValue === 'closeLight' ? '8,3' : '10,3'
            this.actionsList[this.actionIndex].lighteness = this.actionData.openCloseValue === 'adjustBrightness' ? this.lightValue : ''
            this.actionsList[this.actionIndex].alarmCustomId = isCustom ? isCustom.value : 0
            this.actionsList[this.actionIndex].alarmTypeNo = isCustom ? isCustom.label : alarmData[0].label
          } else {
            let titleArr = []
            let addrArr = []
            let newlineType = []
            let name = []
            if (!Array.isArray(this.actionData.tags)) {
              this.actionData.tags = [this.actionData.tags]
            }
            if (this.actionData.tags.length > 0) {
              this.actionData.tags.forEach(item => {
                addrArr.push(item.split(';')[0])
              })
              this.lineSelect = this.actionData.tags
              this.selecTLineAction.map(val => {
                // this.lineSelect.map(s => {
                //   if (val.addr === Number(s)) {
                //     if (val.digitalOuts !== undefined) {
                //       val.digitalOuts.map((d, u) => {
                //         d.InsId = `Outs${u + 1}`
                //       })
                //       this.actionQuantity = [...val.digitalOuts]
                //     }
                //   }
                // })

                addrArr.map(v => {
                  if (Number(v) === val.addr) {
                    newlineType.push(val.lineType)
                    if (val.digitalOuts !== undefined) {
                      val.digitalOuts.forEach(item => {
                        this.actionData.sqmodel.map(vas => {
                          if (vas === item.InsId) {
                            name.push(item.name)
                          }
                        })
                      })
                      titleArr = `${val.title}^${name}`
                    } else {
                      titleArr.push(`${val.title}`)
                    }
                  }
                })
              })
            }

            if (newlineType.indexOf('IO') > -1) {
              this.actionsList[this.actionIndex].newlineType = 'IO'
            } else {
              this.actionsList[this.actionIndex].newlineType = ''
            }
            // console.log(addrArr.join(','), 'addrArr.join(', ')')
            this.actionsList[this.actionIndex].addrs = addrArr.join(',')
            this.actionsList[this.actionIndex].sqmodel = this.actionData.sqmodel
            this.actionsList[this.actionIndex].others.mac = this.actionData.mac
            this.actionsList[this.actionIndex].others.macName = this.actionData.macName
            this.actionsList[this.actionIndex].actionType = this.actionData.openCloseValue
            this.actionsList[this.actionIndex].others.title = `${titleArr}`

            if ((this.equipmentrValue === '1,2' || this.equipmentrValue === 22) && this.actionData.alarm.length > 0) {
              let Alarms = ''
              if (this.actionData.alarm[0] === 'alarms') {
                Alarms = this.alarms[0].children.filter(keyItem => {
                  if (keyItem.value === this.actionData.alarm[1]) return keyItem
                })
                this.actionsList[this.actionIndex].alarmCustomId = 0
              } else if (this.actionData.alarm[0] === 'warns') {
                Alarms = this.alarms[1].children.filter(keyItem => {
                  if (keyItem.value === this.actionData.alarm[1]) return keyItem
                })
                this.actionsList[this.actionIndex].alarmCustomId = 0
              } else if (this.actionData.alarm[0] === 'custom') {
                Alarms = this.alarms[2].children.filter(keyItem => {
                  if (keyItem.value === this.actionData.alarm[1]) return keyItem
                })
                this.actionsList[this.actionIndex].alarmCustomId = Alarms[0].value
              }

              this.actionsList[this.actionIndex].actionType = this.actionData.openCloseValue ? this.actionData.openCloseValue + ',3' : this.actionData.alarm !== '' ? '3' : ''

              this.actionsList[this.actionIndex].alarmTypeNo = Alarms[0].label
            } else {
              this.actionsList[this.actionIndex].actionType = this.actionData.openCloseValue ? this.actionData.openCloseValue + ',3' : this.actionData.alarm !== '' ? '3' : ''

              this.actionsList[this.actionIndex].alarmTypeNo = ''
            }
          }
        } else {
          if (this.lightType === 22) {
            let filterArr = []
            let alarmData = []
            if (this.equipmentrValue === '1,2' || this.equipmentrValue === 22) {
              // console.log(this.alarms, 'this.alarms')
              filterArr = this.alarms[0].children.concat(this.alarms[1].children, this.alarms[2] ? this.alarms[2].children : [])
              alarmData = filterArr.filter(v => v.value === this.actionData.alarm[1])
            }
            let params = {
              others: {
                mac: this.actionData.mac,
                macName: this.actionData.macName,
                // title: `${titleArr}`
              },
              actionType: this.actionData.openCloseValue === 'openLight' ? '9,3' : this.actionData.openCloseValue === 'closeLight' ? '8,3' : '10,3',
              lighteness: this.actionData.openCloseValue === 'adjustBrightness' ? this.lightValue : undefined,
              alarmCustomId: alarmData.length > 0 ? alarmData[0].value : 0,
              alarmTypeNo: alarmData.length > 0 ? alarmData[0].label : '',
            }
            this.actionsList.push(params)
          } else {
            let titleArr = []
            let addrArr = []
            let newActionData = []
            let newlineType = []
            if (!Array.isArray(this.actionData.tags)) {
            } else {
            }
            this.actionLine = !Array.isArray(this.actionData.tags) ? [this.actionData.tags] : this.actionData.tags
            // console.log(this.actionData.tags, ' this.actionData.tags')
            this.selecTLineAction.forEach(val => {
              this.actionLine.forEach(item => {
                if (val.addr === (item.includes(';') ? +item.split(';')[0] : +item)) {
                  newActionData.push(val)
                }
              })
            })
            let arr = []
            let sqmodelValue = []
            this.digitalOuts = []
            // console.log(this.actionData.sqmodel, 'this.actionData.sqmodel111')

            if (Array.isArray(this.actionData.sqmodel)) {
              // console.log(this.actionData.sqmodel, 'this.actionData.sqmodel')
              this.actionData.sqmodel.forEach(val => {
                this.digitalOuts.push(val)
                this.actionQuantity.forEach(item => {
                  if (val === item.InsId) {
                    sqmodelValue.push(item.InsId)
                    arr.push(item.name)
                  }
                })
              })
            }

            // console.log(newActionData, sqmodelValue, this.digitalOuts, 'newActionData')
            newActionData.map(item => {
              titleArr.push(item.title)
              newlineType.push(item.lineType)
              if (item.lineType === 'IO') {
                sqmodelValue = sqmodelValue === [] ? '' : `${sqmodelValue}`
                sqmodelValue = sqmodelValue === '' ? '' : sqmodelValue.match(/\d+(.\d+)?/g)
                addrArr.push(`${item.addr}^${sqmodelValue}`)
              } else {
                addrArr.push(item.addr)
              }
            })
            setTimeout(() => {
              newlineType.forEach(val => {
                if (val === 'IO') {
                  titleArr = `${titleArr.join(',')}^${arr}`
                } else {
                  titleArr = `${titleArr}`
                }
              })
              let params = {
                addrs: `${addrArr}`,
                others: {
                  mac: this.actionData.mac,
                  macName: this.actionData.macName,
                  title: `${titleArr}`,
                },
                actionType: this.actionData.openCloseValue,
                sqmodel: this.actionData.sqmodel,
              }
              params.newlineType = newlineType.indexOf('IO') > -1 ? 'IO' : ''
              if ((this.equipmentrValue === '1,2' || this.equipmentrValue === 22) && this.actionData.alarm.length > 0) {
                let Alarms = ''
                if (this.actionData.alarm[0] === 'alarms') {
                  Alarms = this.alarms[0].children.filter(keyItem => {
                    if (keyItem.value === this.actionData.alarm[1]) return keyItem
                  })
                  params.alarmCustomId = 0
                } else if (this.actionData.alarm[0] === 'warns') {
                  Alarms = this.alarms[1].children.filter(keyItem => {
                    if (keyItem.value === this.actionData.alarm[1]) return keyItem
                  })
                  params.alarmCustomId = 0
                } else if (this.actionData.alarm[0] === 'custom') {
                  Alarms = this.alarms[2].children.filter(keyItem => {
                    if (keyItem.value === this.actionData.alarm[1]) return keyItem
                  })
                  params.alarmCustomId = Alarms[0].value
                } else {
                  params.alarmCustomId = 0
                }
                params.actionType = this.actionData.openCloseValue ? this.actionData.openCloseValue + ',3' : this.actionData.alarm !== '' ? '3' : ''
                params.alarmTypeNo = Alarms[0].label
              } else {
                params.actionType = this.actionData.openCloseValue ? this.actionData.openCloseValue + ',3' : this.actionData.alarm !== '' ? '3' : ''
                params.alarmTypeNo = ''
                params.alarmCustomId = 0
              }
              this.actionsList.push(params)
              // console.log(params, 'params')
            }, 400)
          }
        }

        this.actionFlag = false
        this.dialogDetails = true
        this.switchAnalog = 1
      },
      handlelinkageScenePre(row, index) {
        if (row.subTypeNumber) {
          // 摄像头情况编辑 cameraEditType
          this.index = index
          this.edit = true
          cameraQueryAlarmType({ mac: row.others.mac }).then(res => {
            if (res.success) {
              this.preData.mac = row.others.mac
              if (Array.isArray(res.data) && res.data.length) {
                this.cameraEditType = res.data.map(item => ({ value: item.subTypeNumber, typeNumber: item.typeNumber, label: item.subTypeName }))

                this.cameraEditValue = row.subTypeNumber
              }
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
          this.cameraVisible = true
          this.dialogDetails = false
        } else {
          // 非摄像头情况编辑
          if (row.equipmentrValue === 22 || row.others.equipmentType === 22) {
            this.index = index
            this.edit = true
            this.actionValue = row.compValue === 'true' ? 1 : 0
            this.linghtValue = row.elecType || 13
            this.preData = {
              mac: row.others.mac,
              // num: row.compValue,
              name: row.others.macName,
            }
            this.preconditionFlag = true
          } else {
            let titles = []
            let tags = []
            this.edit = true
            this.dialogDetails = false
            this.preconditionFlag = true
            this.index = index
            this.switchingAnalogData = [
              {
                value: 1,
                label: this.$t('switching'),
              },
              {
                value: 2,
                label: this.$t('unitConversion'),
              },
            ]
            if (row.switchAnalog !== '') {
              // 1
              this.openClose = [
                {
                  value: '1',
                  label: 'ON',
                },
                {
                  value: '0',
                  label: 'OFF',
                },
              ]
            }

            queryChannels({ mac: row.others.mac }).then(res => {
              if (res.success) {
                this.sqmodel = []
                this.lineSelect.push(Number(row.addrs))
                res.datas.map(val => {
                  if (val.lineType === 'IO') {
                    val.disabled = false
                    this.linechangeIo = 'IO'
                    this.lineSelect.map(s => {
                      if (val.addr === s) {
                        if (val.digitalIns !== undefined) {
                          val.digitalIns.map((d, u) => {
                            d.InsId = `InsId${u + 1}`
                          })
                        }
                        if (val.digitalOuts !== undefined) {
                          val.digitalOuts.map((d, u) => {
                            d.InsId = `Outs${u + 1}`
                          })
                        }
                        if (val.analogIns !== undefined) {
                          val.analogIns.map((d, u) => {
                            d.InsId = `AnalogIns${u + 1}`
                          })
                        }

                        this.switchingQuantityObj = [...val.digitalIns, ...val.digitalOuts]
                        this.analogInsObj = [...val.analogIns]
                      }
                    })
                  } else {
                    this.linechangeIo = ''
                    val.disabled = true
                  }

                  if (row.analogIns === '' && row.digitalIns === '' && row.digitalOuts === '') {
                    if (val.lineType !== 'IO') {
                      val.disabled = false
                    } else {
                      val.disabled = true
                    }

                    this.linechangeIo = ''
                  }
                })

                this.selecTLine = res.datas
                this.selecTLineAction = res.datas.map(v => ({ ...v, disabled: false }))
                let arr = []
                this.selecTLine.map(val => {
                  row.addrs.split(',').map(v => {
                    if (Number(v) === val.addr) {
                      arr.push(`${val.addr};${val.lineType}`)
                    }
                  })
                })

                this.selectlIne = arr

                if (row.others.title) {
                  this.lineSelect = row.addrs && row.addrs.split(',').map(item => +item)
                }
                setTimeout(() => {
                  if (this.microBreakValue === 4) {
                    if (row.tmpTypeList !== undefined) {
                      this.getTypeLists(index, row.tmpTypeList.split(','))
                    }
                  }
                }, 500)
              }
            })

            if (row.others.title) {
              titles = this.preList[index].others.title.split(',')
              this.preList[index].addrs.split(',').map((item, index) => {
                tags.push({ addr: item, title: titles[index] })
              })
            }
            this.preData = {
              mac: row.others.mac,
              num: row.compValue,
              name: row.others.macName,
            }

            setTimeout(() => {
              this.pressureValue = row.elecType
              this.openCloseValue = row.compValue
              this.levelValue = row.elecType
              this.attrValue = row.elecType
              this.typeValue = row.compType
              this.equipmentrValue = row.equipmentrValue ? row.equipmentrValue : row.others.equipmentType === 1 || row.others.equipmentType === 2 ? '1,2' : row.others.equipmentType
              this.smokeValue = row.smokeValue ? row.smokeValue : row.typeNumber
              this.gasValue = row.gasValue ? row.gasValue : row.typeNumber
              this.microBreakValue = row.elecType
              this.evaluateValue = row.calcType
              this.comparisonValue = row.compType
              this.switchAnalog = row.switchAnalog
              if (row.switchAnalog === 1) {
                this.switchingQuantity = this.switchingQuantityObj
                this.microBreakAttr = [
                  {
                    value: 18,
                    label: this.$t('switchStatus'),
                  },
                ]
                this.evaluateAttr = [
                  {
                    value: 6,
                    label: this.$t('allPorts'),
                  },
                  {
                    value: 7,
                    label: this.$t('anyPort'),
                  },
                ]
                this.comparisonAttr = [
                  {
                    value: 3,
                    label: this.$t('equal'),
                  },
                ]
              }
              if (row.switchAnalog === 2) {
                this.switchingQuantity = this.analogInsObj

                this.microBreakAttr = [
                  {
                    value: 16,
                    label: this.$t('acquisition'),
                  },
                  {
                    value: 17,
                    label: this.$t('displayValue'),
                  },
                ]

                this.evaluateAttr = [
                  {
                    value: 1,
                    label: this.$t('sumValue'),
                  },
                  {
                    value: 2,
                    label: this.$t('differenceValue'),
                  },
                  {
                    value: 3,
                    label: this.$t('maxValue'),
                  },
                  {
                    value: 4,
                    label: this.$t('minValue'),
                  },
                  {
                    value: 5,
                    label: this.$t('averageValue'),
                  },
                ]
                if (this.microBreakValue === 13) {
                  this.comparisonAttr = [
                    {
                      value: 3,
                      label: this.$t('equal'),
                    },
                  ]
                } else {
                  this.comparisonAttr = [
                    {
                      value: 1,
                      label: this.$t('greaterThan'),
                    },
                    {
                      value: 2,
                      label: this.$t('lessThan'),
                    },
                    {
                      value: 3,
                      label: this.$t('equal'),
                    },
                  ]
                }
              }

              if (row.analogIns !== undefined) {
                if (row.analogIns !== '') {
                  if (Array.isArray(row.analogIns)) {
                    row.analogIns.map(val => {
                      this.sqmodel.push(`AnalogIns${val}`)
                    })
                  } else {
                    row.analogIns.split(',').map(val => {
                      this.sqmodel.push(`AnalogIns${val}`)
                    })
                  }
                }
              }
              if (row.digitalIns !== undefined) {
                if (row.digitalIns !== '') {
                  if (Array.isArray(row.digitalIns)) {
                    row.digitalIns.map(val => {
                      // (`InsID${val}`)
                      this.sqmodel.push(`InsId${val}`)
                    })
                  } else {
                    row.digitalIns.split(',').map(val => {
                      this.sqmodel.push(`InsId${val}`)
                    })
                  }
                }
              }
              if (row.digitalOuts !== undefined) {
                if (row.digitalOuts !== '') {
                  if (Array.isArray(row.digitalOuts)) {
                    row.digitalOuts.map(val => {
                      this.sqmodel.push(`Outs${val}`)
                    })
                  } else {
                    row.digitalOuts.split(',').map(val => {
                      this.sqmodel.push(`Outs${val}`)
                    })
                  }
                }
              }

              if (row.elecType === 13) {
                // this.preData.num = this.evaluateValue = null;
                this.lineValue = row.calcType

                this.openCloseValue = row.compValue === 'false' ? '1' : '2'
              }
            }, 500)
          }
        }
      },
      async handlelinkageSceneAction(row, index) {
        // console.log(row, this.actionsList, 'rjow')
        // debugger
        if (['8,3', '9,3', '10,3', '8', '9', '10'].includes(row.actionType)) {
          this.linechangeIo = ''
          this.actionData.mac = row.others.mac
          this.actionData.macName = row.others.macName
          this.actionIndex = index
          this.lightType = 22
          this.actionData.openCloseValue = row.actionType === '8,3' ? 'closeLight' : row.actionType === '9,3' ? 'openLight' : 'adjustBrightness'
          if ((row.lighteness && row.actionType === '10,3') || (row.actionParam && JSON.parse(row.actionParam).lighteness && row.actionType === '10,3')) {
            this.lightValue = row.lighteness ? +row.lighteness : +JSON.parse(row.actionParam).lighteness
            this.adBrightShow = true
          } else {
            this.adBrightShow = false
          }
          if (this.equipmentrValue === '1,2' || this.equipmentrValue === 22) {
            let filterArr = this.alarms[0].children.concat(this.alarms[1].children, this.alarms[2] ? this.alarms[2].children : [])
            // console.log(filterArr, 'filterArr', this.alarms[2].children, row);
            let alarmVal
            if (row.alarmTypeNo === 1015) {
              alarmVal = this.alarms[2] && this.alarms[2].children.filter(v => +v.value === +row.alarmCustomId)
            } else {
              alarmVal = filterArr.filter(v => v.label === row.alarmTypeNo)
            }

            if (Array.isArray(alarmVal) && alarmVal.length) {
              this.actionData.alarm = [alarmVal[0].__value.split(',')[0], alarmVal[0].value]
            } else {
              this.actionData.alarm = []
            }
          } else {
            this.actionData.alarm = []
          }
        } else {
          this.lightType = 0
          let Alarms = ''

          let detailsq = []

          let detailaddr = []
          this.actionQuantity = []
          // this.actionsList.forEach(val => {
          //   if (row.id === val.id) {
          //     row.addrs = val.addrs
          //   }
          // })
          // sqmodel
          const res = await queryChannels({ mac: row.others.mac })
          this.selecTLine = []
          this.selecTLine = res.datas
          this.selecTLineAction = res.datas.map(v => ({ ...v, disabled: false }))
          this.actionData.tags = []

          if (row.addrs.includes('^')) {
            this.linechangeIo = 'IO'
            detailaddr.push(row.addrs.split('^')[0])
            let detailsqmodel = []
            detailsqmodel.push(row.addrs.split('^')[1])
            // console.log(this.selecTLine, this.lineSelect, 'this.lineSelect')
            this.selecTLineAction.map(val => {
              detailaddr.map(v => {
                if (Number(v) === val.addr) {
                  this.actionData.tags.push(`${Number(v)};${val.lineType}`)
                }
              })
              if (val.digitalOuts !== undefined) {
                if (val.addr === Number(row.addrs.split('^')[0])) {
                  val.digitalOuts.map((d, u) => {
                    d.InsId = `Outs${u + 1}`
                  })

                  this.actionQuantity = [...val.digitalOuts]
                }
              }
            })

            detailsqmodel.map(v => {
              v.split(',').forEach(item => {
                detailsq.push(`Outs${item}`)
              })
            })
          } else {
            detailaddr = row.addrs.includes(',') ? row.addrs.split(',') : [row.addrs]
            this.selecTLineAction.forEach(val => {
              detailaddr.forEach(v => {
                if (v && Number(v) === val.addr) {
                  this.actionData.tags.push(`${v};${val.lineType}`)
                }
              })
              if (val.digitalOuts) {
                this.lineSelect = Array.isArray(this.lineSelect) ? this.lineSelect : [this.lineSelect]
                this.lineSelect.map(s => {
                  if (val.addr === (!!s && `${s}`.includes(';') ? +s.split(';')[0] : +s)) {
                    val.digitalOuts.map((d, u) => {
                      d.InsId = `Outs${u + 1}`
                    })

                    this.actionQuantity = [...val.digitalOuts]
                  }
                })
              }
            })
          }
          setTimeout(() => {
            if (row.sqmodel) {
              this.selecTLineAction.forEach(val => {
                val.disabled = val.lineType !== 'IO'
              })
              this.actionData.sqmodel = row.sqmodel
            }
            if (row.addrs && row.addrs.includes('^')) {
              this.selecTLineAction.forEach(val => {
                val.disabled = val.lineType !== 'IO'
              })
              let newModel = row.addrs.split('^')[1]

              let modelValue = newModel.includes(',') ? newModel.split(',') : [newModel]
              this.actionData.sqmodel = modelValue.map(v => `Outs${v}`)
            }

            if (!row.addrs.includes('^') && (!row.sqmodel || !row.sqmodel.length)) {
              this.selecTLineAction.forEach(val => {
                val.disabled = false
              })
              this.actionData.sqmodel = []
              this.linechangeIo = ''
              // 2
            }
            if (row.alarmTypeNo !== '' && row.alarmTypeNo.length > 0 && row.alarmCustomId === 0) {
              Alarms = this.alarms[0].children.filter(keyItem => {
                if (keyItem.label === row.alarmTypeNo) return keyItem
              })
              if (Alarms.length > 0) {
                this.actionData.alarm = ['alarms', Alarms[0].value]
              } else {
                Alarms = this.alarms[1].children.filter(keyItem => {
                  if (keyItem.label === row.alarmTypeNo) return keyItem
                })
                this.actionData.alarm = ['warns', Alarms[0].value]
              }
            } else if (row.alarmCustomId && row.alarmCustomId !== 0) {
              let newarr = Array.isArray(this.alarms[2].children) && this.alarms[2].children.length && this.alarms[2].children.filter(item => item.label === row.alarmTypeNo)
              this.actionData.alarm = ['custom', newarr[0].value]
            } else {
              this.actionData.alarm = []
            }
          }, 300)
          this.actionIndex = index
          this.actionData.mac = row.others.mac
          this.actionData.macName = row.others.macName
          if (!row.addrs.includes('^') && (!row.sqmodel || !row.sqmodel.length)) {
            this.openCloseAction = [
              {
                value: '1',
                label: this.$t('opening'),
              },
              {
                value: '2',
                label: this.$t('closing'),
              },
              {
                value: '0',
                label: this.$t('noAction'),
              },
            ]
          }
          this.actionData.openCloseValue = row.actionType === '3' ? '' : row.actionType.split(',')[0]
        }

        this.actionEdit = true
        this.dialogDetails = false
        this.actionFlag = true
      },
      handleSceneDelPre(index) {
        this.preList.splice(index, 1)
      },
      handleSceneDelAction(index) {
        this.actionsList.splice(index, 1)
      },
      queryList(mac) {
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          projectCode: this.$store.state.projectCode,
          equipmentTypes: this.equipmentTypesNum,
        }
        if (mac) params.key = mac
        queryBoxes(params).then(res => {
          if (res.success) {
            this.total = res.total
            this.data = res.datas
          } else if (res.code === '-1') {
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.queryList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.queryList()
      },
      handleMac(row) {
        // ------选择摄像头进入
        if (this.equipmentrValue === 20) {
          cameraQueryAlarmType({ mac: row.mac }).then(res => {
            if (res.success) {
              if (Array.isArray(res.data) && res.data.length) {
                if (this.cameraVisible && !this.preconditionFlag) {
                  // -----摄像头编辑状态
                  this.cameraEditType = res.data.map(item => ({ value: item.subTypeNumber, typeNumber: item.typeNumber, label: item.subTypeName }))
                  this.cameraEditValue = ''
                  this.preData.mac = row.mac
                  this.preData.name = row.name
                } else {
                  // -----摄像头新增状态
                  this.cameraType = res.data.map(item => ({ value: item.subTypeNumber, label: item.subTypeName, typeNumber: item.typeNumber }))
                  this.cameraValue = ''
                  this.controlCameraDis = true
                }
              } else {
                if (this.preconditionFlag) {
                  this.controlCameraDis = false
                  this.cameraType = []
                  this.$Message.warning({
                    content: this.$t('thisCameraNotHasAlarmType'),
                  })
                }
                if (this.cameraVisible && !this.preconditionFlag) {
                  this.cameraEditValue = ''
                  this.cameraEditType = []
                  this.$Message.warning({
                    content: this.$t('thisCameraNotHasAlarmType'),
                  })
                }
              }
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        }
        // ---------------------------
        if (row.equipmentType === 22) {
          if (!this.preconditionFlag) {
            this.lightType = 22
          }
        } else {
          this.lightType = 0
          this.linechangeIo = ''
          this.lineSelect = []
          this.selecTLine = []
          this.selectlIne = []
          this.actionData.tags = []
          queryChannels({ mac: row.mac })
            .then(res => {
              if (res.success) {
                this.selecTLine = res.datas
                this.selecTLineAction = res.datas.map(v => ({ ...v, disabled: false }))
                if (this.equipmentrValue === '1,2') {
                  if (res.datas.length === 0) {
                    this.$Message.error(this.$t('thisDeviceNotHasLine'))
                  }
                  if (this.microBreakValue === 4 && Array.isArray(this.lineSelect) && this.lineSelect.length) {
                    this.getTypeLists(this.index)
                    this.selectTem = []
                  }
                }
              } else if (res.code === '-1') {
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
            .catch(err => {
              if (err) {
                this.$Message.error({
                  content: this.$t('unknown'),
                })
              }
            })
        }
        if (this.preconditionFlag) {
          this.preData.mac = row.mac
          this.preData.name = row.name
          // this.preData.tags = [];
          this.lineSelect = []
        } else {
          this.actionData.mac = row.mac
          this.actionData.macName = row.name
          this.actionData.tags = []
        }
        this.deviceVisible = false
      },
      handleAlarmFocus() {
        queryAlarmForConfig({ projectCodes: this.$store.state.projectCode }).then(res => {
          res.data.alarms
            .filter(itm => itm.typeNumber !== '1015')
            .map(item => {
              return this.alarms[0].children.push({
                value: item.typeNumber,
                label: item.info,
              })
            })
          res.data.warns.map(item => {
            return this.alarms[1].children.push({
              value: item.typeNumber,
              label: item.info,
            })
          })
        })
        let params = {
          params: {
            projectCode: this.$store.state.projectCode,
            status: 1,
          },
          pageNo: 1,
          pageSize: 9999,
        }
        alarmPageCustom(params).then(res => {
          if (res.success) {
            if (res.datas.length > 0) {
              res.datas.forEach(item => {
                this.alarms[2].children.push({
                  value: item.id,
                  label: item.name,
                })
              })
            } else {
              this.alarms.splice(2, 1)
            }
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
    },
    watch: {
      selectlIne: {
        handler(newVal) {
          if (newVal && newVal.length === 0) {
            this.selecTLine.map(val => {
              val.disabled = false
              val.title = val.title.split('(')[0]
            })
          }
        },
        deep: true,
      },
      '$store.state.projectCode': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.init()
          }
        },
      },
      '$store.state.channelsTableHeight': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.tableComponentHeight = newVal
          }
        },
      },
      preList: {
        handler(newVal, oldVal) {
          this.preList = newVal
          if (this.preList.length > 0) {
            this.equipmentFlag = true
          } else {
            this.equipmentFlag = false
          }
        },
      },
    },
    components: {
      Device,
      PwsSeconedCheckVue,
      LineList,
    },
  }
</script>
<style lang="less" scoped>
  .Scene {
    background: #1a202e;
    padding: 0 20px 20px 20px;
    height: 800px;
  }
  .selet-mode {
    width: 210px;
    margin-left: 10px;
  }
  .mlt {
    margin-left: 10px;
  }
  .span-icon {
    margin-left: 5px;
    background: rgba(224, 60, 58, 0.1);
    padding: 4px;
    border: 1px solid #e03c3a;
    border-radius: 3px;
  }
  .buttons {
    margin-top: 5px;
    width: 168px;
    background: rgba(0, 126, 255, 0.2);
    border: 1px dashed rgba(0, 126, 255, 1);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 20px 0;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
  .threeBtn {
    display: flex;
    justify-content: space-between;
  }
  .slot-label {
    width: 90px;
    margin-right: 20px;
    text-align: right;
  }
  .mrt {
    margin-top: 5px;
  }
  .btn {
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007eff;
    border-radius: 5px;
    color: #007eff;
    margin-right: 10px;
  }
  .ivu-tag {
    height: 32px;
    line-height: 32px;
  }
  .dis_f {
    display: flex;
  }
  /deep/.ivu-input {
    border: 1px solid #535b6c;
  }
  /deep/.ivu-modal-footer {
    border: none;
    text-align: right;
  }
  .linechangeIo {
    color: #0596d8;
    margin-left: 110px;
  }
</style>
