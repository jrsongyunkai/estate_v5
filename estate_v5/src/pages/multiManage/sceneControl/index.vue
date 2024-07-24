<template>
  <div id="dece-control">
    <div style="padding: 15px 10px; background: #1a202e">
      <Row :gutter="10">
        <Col>
          <Select v-model="seceneListValue" clearable :placeholder="$t('pleaseChooseSecenseModel')" style="width: 200px">
            <Option v-for="item in sceneModelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col>
          <Select v-model="groupSeceneValue" clearable :placeholder="$t('pleaseChooseSecenseGroup')" style="width: 200px">
            <Option v-for="item in sceneGroups.filter(item => item.label)" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col>
          <Select v-model="groupStatusValue" clearable :placeholder="$t('pleaseSelectState')" style="width: 200px">
            <Option v-for="item in sceneStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col><Input v-model="nameWord" :placeholder="$t('pleaseEnterSceneNameToSearch')" style="width: 210px" /></Col>
        <Col>
          <Button type="primary" @click="queryScenceList">{{ $t('query') }}</Button>
          &nbsp;&nbsp;
          <Button type="default" @click="resetCheckValue">{{ $t('reset') }}</Button>
        </Col>
      </Row>
    </div>
    <Col>
      <Col class="mt-10" v-if="!addEditControlFlag && !seeDetailsFlag" id="control">
        <Row class="header">
          <h4>{{ $t('sceneControl') }}</h4>
          <div>
            <Button type="primary" ghost :style="colorStyle" :disabled="disabeldValue" @click="batchActionlist(1)">{{ $t('batchActivation') }}</Button>
            <Button type="primary" ghost style="margin: 0 5px" :style="colorStyle" :disabled="disabeldValue" @click="batchActionlist(0)">{{ $t('batchDeactivation') }}</Button>
            <Button class="c-default but-ton" @click="addScenePage">{{ $t('scenarioAddition') }}</Button>
          </div>
        </Row>
        <Table :data="scenesData" :columns="scenescolumns" :height="520" :max-height="tableComponentHeight" @on-select="selectSingleData" @on-select-cancel="cancelScenenData" @on-select-all="selectAllData" @on-select-all-cancel="cancelSelectAllData">
          <template slot-scope="{ row }" slot="pattern">
            <span>{{ row.type === 1 ? $t('automatic') : $t('manual') }}</span>
          </template>
          <template slot-scope="{ row }" slot="groups">{{ row.type === 2 ? '-' : row.groupName || '-' }}</template>
          <template slot-scope="{ row }" slot="sceneName">
            <span>{{ row.sceneName }}</span>
          </template>
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status === 0" class="b-danger">{{ $t('disabled') }}</span>
            <span v-else class="b-success">{{ $t('enabled') }}</span>
            <span>&nbsp;</span>
            <span v-if="row.others.chnlOcStatus === 1" class="b-success">{{ $t('lineFullyOpen') }}</span>
            <span v-else-if="row.others.chnlOcStatus === 0" class="b-danger">{{ $t('lineFullyClosed') }}</span>
            <span v-else-if="row.others.chnlOcStatus === -1" class="b-danger">{{ $t('hasOpenAndHasClose') }}</span>
            <span v-else-if="row.others.chnlOcStatus === -2" class="b-info">{{ $t('noAddLine') }}</span>
          </template>
          <template slot-scope="{ row }" slot="operating">
            <Button class="btn c-default" type="text" @click="handleNewView(row)">{{ $t('view') }}</Button>
            <Button class="btn c-default" type="text" @click="handleSceneEdit(row, 'edit')">{{ $t('edit') }}</Button>
            <Dropdown :transfer="true">
              <a href="javascript:void(0)" class="btn">
                {{ $t('more') }}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem v-show="row.type === 1 && !row.others.is808">
                  <Button class="btn c-default" type="text" @click="handleSceneOc(row.sceneId, '2')" :disabled="row.status === 0">{{ $t('oneClickOn') }}</Button>
                </DropdownItem>
                <DropdownItem v-show="row.type === 1 && !row.others.is808">
                  <Button class="btn c-default" type="text" @click="handleSceneOc(row.sceneId, '1')" :disabled="row.status === 0">{{ $t('oneClickOff') }}</Button>
                </DropdownItem>
                <DropdownItem v-show="row.type === 1">
                  <Button class="btn c-default" type="text" @click="handleSceneStatus(row.sceneId)">{{ $t('stopOrStart') }}</Button>
                </DropdownItem>
                <DropdownItem>
                  <Button class="btn c-default" type="text" @click="openPwdsModal(row.sceneId)">{{ $t('delete') }}</Button>
                </DropdownItem>
                <DropdownItem v-show="row.type === 2">
                  <Button class="btn c-default" type="text" @click="handleSceneOc(row.sceneId)">{{ $t('exe') }}</Button>
                </DropdownItem>
                <DropdownItem v-show="row.type === 1">
                  <Tooltip :content="$t('pushBuiltinTiming')" open-delay="1000" placement="bottom" transfer effect="light">
                    <Button class="btn c-default" type="text" @click="handleSceneSync(row)">{{ $t('push') }}</Button>
                  </Tooltip>
                </DropdownItem>
                <DropdownItem>
                  <Button class="btn c-default" type="text" @click="handleInstructions(row)">{{ $t('commandHistory') }}</Button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </template>
        </Table>
        <Page show-total :current="1" @on-change="changePages" :total="total" show-elevator />
      </Col>
      <Col v-if="seeDetailsFlag">
        <div @click="backLists" class="pointer" style="padding: 10px">
          <Icon type="ios-arrow-back" />
          {{ $t('back') }}
        </div>
        <div style="position: relative">
          <div style="height: 60px; width: 100%; background: #1a202e; position: absolute"></div>
        </div>
        <Tabs v-model="tabName" style="margin-top: 15px" :animated="false" @on-click="getTabChange">
          <TabPane :label="$t('sceneDetails')" name="name1">
            <Scroll :height="650">
              <div style="margin-top: 15px; background: #1a202e; padding: 20px">
                <div>
                  <Row type="flex" justify="space-between">
                    <Col>
                      <h4 class="es-info">{{ $t('basicInformation') }}</h4>
                    </Col>
                    <Col>
                      <Button type="primary" style="margin-right: 10px" @click="handleSceneEdit(listDetailes, 'tabdetails')">{{ $t('edit') }}</Button>
                      <Button type="error" ghost @click="openPwdsModal(listDetailes.sceneId, 'del')">{{ $t('delete') }}</Button>
                    </Col>
                  </Row>
                  <div style="padding-left: 60px">
                    <div class="es-info-title">
                      {{ $t('sceneName') }}:
                      <span class="es-info-txt">{{ listDetailes.sceneName }}</span>
                    </div>
                    <div class="es-info-title">
                      {{ $t('sceneDescription') }}:
                      <span class="es-info-txt">{{ listDetailes.remark }}</span>
                    </div>
                    <div class="es-info-title">
                      {{ $t('sceneMode') }}:
                      <span class="es-info-txt">{{ listDetailes.type === 1 ? $t('automatic') : $t('manual') }}</span>
                    </div>
                    <div class="es-info-title" v-if="listDetailes.type === 1">
                      {{ $t('sceneGroup') }}:
                      <span class="es-info-txt">{{ listDetailes.groupName }}</span>
                    </div>
                    <div class="es-info-title">
                      {{ $t('sceneStatus') }}：
                      <Switch v-model="listDetailes.status" :true-value="1" :false-value="0" :disabled="true" />
                    </div>
                  </div>
                </div>
              </div>
              <div style="margin-top: 15px; background: #1a202e; padding: 20px">
                <h4 class="execu-list-title">{{ $t('executionObjectList') }}</h4>
                <Table :columns="actionColumns" :data="actionTableList">
                  <template slot-scope="{ row }" slot="lines">
                    <div>
                      <Tag v-for="(item, index) in row.configs" :key="index" :value="item.addr" style="width: 80px; display: block; text-align: center">
                        <span>{{ item.title }}</span>
                      </Tag>
                    </div>
                  </template>
                  <template slot-scope="{ row }" slot="ports">
                    <div v-if="row.configs.length > 0">
                      <div v-for="(itm, idx) in row.configs" :key="idx + 'addr' + itm.addr" style="width: 120px; text-align: center">
                        <Tag v-for="(its, ides) in itm.digitalOuts" :key="ides + 'ports' + itm.addr" :value="its.digitalOut">
                          <span>{{ its.name }}</span>
                        </Tag>
                      </div>
                    </div>
                  </template>
                  <template slot-scope="{ row }" slot="actiones">
                    <div v-if="row.configs.length > 0">
                      <div v-for="(itm, idx) in row.configs" :key="idx + 'addr' + itm.addr">
                        <div v-if="itm.lineType === 'IO'">
                          <Tag v-for="(its, ides) in itm.digitalOuts" :key="ides + 'ports' + itm.addr" :value="its.digitalOut" style="width: 80px; display: block; text-align: center">
                            <span v-if="its.actionType === '1'">{{ $t('opening') }}</span>
                            <span v-if="its.actionType === '2'">{{ $t('closing') }}</span>
                            <span v-if="its.actionType === '4'">ON</span>
                            <span v-if="its.actionType === '5'">OFF</span>
                            <span v-if="its.actionType === '7'">{{ $t('inching') }}</span>
                          </Tag>
                        </div>
                        <div v-if="itm.lineType !== 'IO'">
                          <Tag style="width: 80px; text-align: center">
                            <span>{{ itm.actionType === '1' ? $t('opening') : $t('closing') }}</span>
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </template>
                </Table>
                <Page show-total :current="actionPage" @on-change="changeactionPage" :total="actionTotal" show-elevator />
              </div>
              <div style="margin-top: 15px; background: #1a202e; padding: 20px" v-if="listDetailes.type === 1">
                <h4 class="execu-list-title">{{ $t('timingList') }}</h4>
                <Table :columns="timerColumn" :data="timerTableList">
                  <template slot-scope="{ row }" slot="timeTypes">
                    <span>{{ row.type === 1 ? $t('singleTiming') : row.type === 2 ? $t('cycleTiming') : '' }}</span>
                  </template>
                  <template slot-scope="{ row }" slot="weekdays">
                    <span>
                      {{
                        row.weekday
                          ? $t('every') +
                            row.weekday
                              .split(',')
                              .map(v => weekConfig[v])
                              .join()
                          : $t('single')
                      }}
                    </span>
                  </template>
                  <template slot-scope="{ row }" slot="status">
                    <div v-if="row.status === 'false'">{{ $t('opening') }}</div>
                    <div v-if="row.status === 'true'">{{ $t('closing') }}</div>
                    <div v-if="row.status === 4">ON</div>
                    <div v-if="row.status === 5">OFF</div>
                    <div v-if="row.status === 7">{{ $t('inching') }}</div>
                  </template>
                </Table>
              </div>
            </Scroll>
          </TabPane>
          <TabPane :label="$t('commandHistory')" name="name2">
            <div style="padding-top: 10px; background: #1a202e">
              <Row class="header" style="margin-top: 10px">
                <div style="margin-left: 12px">
                  <Form ref="form" @submit.native.prevent :inline="true" :model="form" class="tr">
                    <FormItem>
                      <DatePicker v-model="feedbackTime" type="daterange" transfer range-separator="-" :editable="false" :clearable="false" style="width: 235px"></DatePicker>
                    </FormItem>
                    <FormItem>
                      <Input v-model="instructionsData.mac" :placeholder="$t('enterDeviceNo')"></Input>
                    </FormItem>
                    <FormItem>
                      <Button class="b-blue" @click="queryFeedbackList">{{ $t('query') }}</Button>
                      <Button style="margin-left: 10px" @click="reset">{{ $t('reset') }}</Button>
                    </FormItem>
                  </Form>
                </div>
              </Row>
            </div>
            <Col :span="5" style="padding-bottom: 6px"></Col>
            <Col class="table">
              <div class="content" style="padding: 15px">
                <Row class="header" style="margin-top: 10px">
                  <Col :span="5" style="padding-bottom: 22px">
                    <span>{{ $t('commandHistory') }}</span>
                  </Col>
                  <CommandFeedback ref="CommandFeedback" :classFlag="false" :instructionsData="instructionsData" :operateAt="3" :feedbackTime="feedbackTime"></CommandFeedback>
                </Row>
              </div>
            </Col>
          </TabPane>
          <TabPane :label="$t('push')" name="name3" v-if="listDetailes.type === 1">
            <Synchronize :paramsId="scenelds"></Synchronize>
          </TabPane>
        </Tabs>
      </Col>
      <Col v-if="addEditControlFlag">
        <Row class="head-Conts" type="flex" justify="space-between">
          <Col :span="15" v-if="cencesType === 1">
            <!-- 自动 -->
            <Steps :current="currentControl" class="step-control">
              <Step :title="$t('basicInformation')"></Step>
              <Step :title="$t('selectDevice')" :class="{ 'no-complete': currentControl < 1 }"></Step>
              <Step :title="$t('timingSetting')"></Step>
              <Step :title="$t('complete')"></Step>
            </Steps>
          </Col>
          <Col :span="15" v-if="cencesType === 2">
            <!-- 手动步骤条 -->
            <Steps :current="currentmanual" class="step-control">
              <Step :title="$t('basicInformation')"></Step>
              <Step :title="$t('selectDevice')" :class="{ 'no-complete': currentmanual < 1 }"></Step>
              <Step :title="$t('complete')"></Step>
            </Steps>
          </Col>
          <Col :span="3" offset="4" v-if="currentControl < 3">
            <div style="text-align: right" v-if="currentmanual < 2">
              <Button type="primary" style="margin-right: 10px" @click="handleSceneSave">{{ $t('save') }}</Button>
              <Button type="default" @click="toBack">{{ $t('cancel') }}</Button>
            </div>
          </Col>
        </Row>
        <div v-show="stepOne">
          <div class="first-Contents">
            <div class="first-Contents-title">{{ $t('basicInformationOfTheScene') }}</div>
            <Form :model="scenes" ref="secensCon" style="width: 40%; margin-top: 20px" :rules="ruleValidate">
              <FormItem v-show="false" :label="$t('sceneId')" :label-width="120">
                <Input v-model="scenes.id" autocomplete="off"></Input>
              </FormItem>
              <FormItem prop="name" :label="$t('sceneName')" :label-width="85">
                <Input v-model="scenes.name" autocomplete="off" :maxlength="79"></Input>
              </FormItem>
              <FormItem :label="$t('remark')" :label-width="85">
                <Input v-model="scenes.remark" type="textarea" :rows="4" :maxlength="200" show-word-limit autocomplete="off"></Input>
              </FormItem>
              <FormItem :label="$t('sceneType')" :label-width="85" v-if="Object.keys(isEdit).length > 0">
                <span>{{ isEdit.type === 1 ? $t('automatic') : $t('manual') }}</span>
              </FormItem>
              <FormItem :label="$t('sceneType')" :label-width="85" v-if="Object.keys(isEdit).length === 0">
                <RadioGroup v-model="cencesType">
                  <Radio v-for="item in scenTypeList" :key="item.value" :label="item.value" :disabled="item.isTwo">{{ item.label }}</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem :label="$t('sceneGroup')" :label-width="85" v-if="cencesType === 1 || isEdit.type === 1">
                <ButtonGroup>
                  <Button type="primary" ghost :style="isCustom ? 'color:#999999;border:1px solid #999;' : 'color:#258cf0'" @click="getCutsomGroup(true)">{{ $t('default') }}</Button>
                  <Button type="primary" ghost :style="isCustom ? 'color:#258cf0' : 'color:#999;border:1px solid #999;'" @click="getCutsomGroup(false)">{{ $t('custom') }}</Button>
                </ButtonGroup>
                <span style="margin-left: 15px"></span>
                <Dropdown @on-click="getValueGroup" trigger="click">
                  <Input v-show="isCustom" v-model="customName" :placeholder="$t('pleaseEnter')" />
                  <DropdownMenu slot="list" style="width: 180px">
                    <DropdownItem v-for="(item, index) in seconedSceneGroups" :key="index" :name="item.value" :title="item.value">{{ item.label }}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </FormItem>
              <FormItem :label="$t('sceneStatus')" :label-width="85">
                <Switch v-model="switchStatus" />
              </FormItem>
            </Form>
          </div>
          <div style="margin: 15px 30px">
            <Button type="primary" @click="nextStep">{{ $t('nextStep') }}</Button>
          </div>
        </div>
        <div v-show="stepTwo">
          <!-- 自动 -->
          <div v-if="cencesType === 1">
            <div class="TC-deviceboxs">{{ $t('t3808Tip2') }}</div>
            <div class="steps-Twos">
              <div class="cons-titles">
                <div class="cons-titles-txt">{{ $t('equipmentline') }}</div>
                <div>
                  <Button type="primary" @click="openDeviceLineFlag">{{ $t('deviceCircuit') }}</Button>
                </div>
              </div>
              <div style="padding: 10px">
                <Table :columns="deveiceColumns" :data="deviceTableList">
                  <template slot-scope="{ row, index }" slot="lines">
                    <div>
                      <div v-for="(item, indx) in row.configs" :key="indx" :style="{ width: '80px', 'text-align': 'center', 'paddign-bottom': '5px' }">
                        <Tag closable @on-close="getCloseLine(item.addr, index, indx, row)">
                          <span>{{ item.title }}</span>
                        </Tag>
                      </div>
                    </div>
                  </template>
                  <template slot-scope="{ row, index }" slot="Inetmouth">
                    <div v-if="row.configs[0].digitalOuts">
                      <div v-for="(item, indexs) in row.configs" :key="indexs" style="display: flex; flex-wrap: wrap; padding-bottom: 5px">
                        <span v-for="(itm, idx) in item.digitalOuts" :key="Math.random() + idx">
                          <Tag closable @on-close="getClosePort(index, idx, indexs)" v-if="itm.digitalOut">
                            <span>{{ itm.name }}</span>
                          </Tag>
                        </span>
                      </div>
                    </div>
                  </template>
                  <template slot-scope="{ row }" slot="action">
                    <div>
                      <Button type="text" style="color: #0664c6" @click="editSelectLine(row)">{{ $t('edit') }}</Button>
                      <Button type="text" style="color: #f56c6c" @click="getDelDevices(row)">{{ $t('delete') }}</Button>
                    </div>
                  </template>
                </Table>
                <Page show-total :current="autoCurrentPage" :page-size="20" @on-change="changePage" :total="autoTotal" show-elevator />
              </div>
            </div>
            <div>
              <Button type="primary" style="margin: 10px" @click="backStepToOne">{{ $t('previous') }}</Button>
              <Button type="primary" style="margin: 10px" @click="nextStepThreeAuto">{{ $t('nextStep') }}</Button>
            </div>
          </div>
          <!-- 手动 -->
          <div v-if="cencesType === 2">
            <div class="steps-Twos">
              <div class="cons-titles">
                <div class="cons-titles-txt">{{ $t('equipmentline') }}</div>
                <div>
                  <Button type="primary" @click="openDeviceLineFlag">{{ $t('deviceCircuit') }}</Button>
                </div>
              </div>
              <div style="padding: 10px">
                <Table :columns="handderColumns" :data="deviceTableList">
                  <template slot-scope="{ row }" slot="lines">
                    <div>
                      <div v-for="(item, index) in row.configs" :key="index">
                        <Tag>
                          <span>{{ item.title }}</span>
                        </Tag>
                      </div>
                    </div>
                  </template>
                  <template slot-scope="{ row }" slot="Inetmouth">
                    <div v-if="row.configs[0].lineType === 'IO'">
                      <div v-for="(item, index) in row.configs" :key="index" style="border-bottom: 2px solid #999999">
                        <div v-for="(itm, idx) in item.digitalOuts" :key="itm.name + idx" style="border-bottom: 1px solid #999999; padding: 5px">
                          <Tag style="height: 28px; padding-top: 3px">
                            <span>{{ itm.name }}</span>
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template slot-scope="{ row, index }" slot="action">
                    <div v-if="row.configs[0].digitalOuts">
                      <div v-for="(item, indes) in row.configs" :key="indes">
                        <div v-for="(itm, idx) in item.digitalOuts" :key="itm.name + (idx * 2 + 1)" style="border-bottom: 1px solid #999999; padding: 5px">
                          <Select v-model="itm.actionType" transfer @on-change="getIoaCions($event, indes, idx, index)">
                            <Option v-for="itm in digitalList" :value="itm.value" :key="itm.value">{{ itm.label }}</Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div v-for="(item, inde) in row.configs" :key="inde" style="margin-bottom: 5px">
                        <Select v-model="item.actionType" transfer @on-change="getnoIoAction($event, inde, index)">
                          <Option v-for="itm in openCloseLists" :key="itm.value" :value="itm.value">{{ itm.label }}</Option>
                        </Select>
                      </div>
                    </div>
                  </template>
                  <template slot-scope="{ row }" slot="operation">
                    <div v-if="row.configs[0].digitalOuts">
                      <div v-for="(item, index) in row.configs" :key="index">
                        <div v-for="(itm, idx) in item.digitalOuts" :key="Math.random() + idx" style="margin: 12px 2px">
                          <Button class="pointer" type="text" style="color: #f56c6c" @click="delIOxlinePort(itm.digitalOut, item.addr, row.mac, itm.actionType, row.id)">{{ $t('delete') }}</Button>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div v-for="(item, index) in row.configs" :key="index">
                        <Button type="text" style="color: #f56c6c" @click="getDelnotIo(item.addr, row.mac, item.actionType, row.id)">{{ $t('delete') }}</Button>
                      </div>
                    </div>
                  </template>
                </Table>
                <Page show-total :current="handerCurrentPage" @on-change="changeHanderPage" :page-size="20" :total="autoTotal" show-elevator />
              </div>
            </div>
            <div>
              <Button type="primary" style="margin: 10px" @click="backStepToOne">{{ $t('previous') }}</Button>
              <Button type="primary" style="margin: 10px" @click="nextStepThree">{{ $t('nextStep') }}</Button>
            </div>
          </div>
        </div>
        <div v-show="stepThrees">
          <!-- 自动第三步定时列表 -->
          <div v-if="cencesType === 1">
            <div class="cons-titles steps-Twos">
              <div class="cons-titles-txt">{{ $t('timingList') }}</div>
              <div>
                <Button type="primary" @click="editTimerAction">{{ $t('addTimer') }}</Button>
              </div>
            </div>
            <div style="margin-top: 10px"></div>
            <Table :columns="timerColumns" :data="timerList">
              <template slot-scope="{ row }" slot="timTyps">
                <span>{{ row.type === 1 ? $t('singleTiming') : row.type === 2 ? $t('cycleTiming') : '' }}</span>
              </template>
              <template slot-scope="{ row }" slot="wekdys">
                <span>{{ row.weekday ? $t('every') +
                            row.weekday
                              .split(',')
                              .map(v => weekConfig[v])
                              .join() : $t('single') }}</span>
              </template>
              <template slot-scope="{ row }" slot="statsu">
                <div v-if="row.status === 'false'">{{ $t('opening') }}</div>
                <div v-if="row.status === 'true'">{{ $t('closing') }}</div>
                <div v-if="row.status === 4">ON</div>
                <div v-if="row.status === 5">OFF</div>
                <div v-if="row.status === 7">{{ $t('inching') }}</div>
              </template>
              <template slot-scope="{ row }" slot="actiones">
                <span class="c-primary pointer marl" style="margin-right: 10px" @click="editTimerAction(row)">{{ $t('edit') }}</span>
                <span class="c-danger pointer" @click="delTimerquery(row)">{{ $t('delete') }}</span>
              </template>
            </Table>
            <div style="padding: 10px">
              <Button type="primary" @click="backToTwo">{{ $t('previous') }}</Button>
              <Button type="primary" style="margin-left: 10px" @click="nextGoToFour">{{ $t('nextStep') }}</Button>
            </div>
          </div>
          <!-- 手动场景第三步结束页面 -->
          <div v-if="cencesType === 2">
            <div style="height: 100%; padding: 280px 40%; background: #1a202e">
              <div class="wm320" style="padding: 10px 30%; color: #0cd667; font-size: 68px">
                <Icon type="md-checkmark-circle" size="45" />
              </div>
              <div class="wm320" style="padding: 10px 15%">{{ scenes.name }}{{ $t('sceneControlCompleted') }}</div>
              <div class="wm320">
                <Button type="primary" @click="backGoToOne">{{ $t('goOnAdd') }}</Button>
                <Button @click="backGoList" style="margin-left: 10px" type="primary">{{ $t('backList') }}</Button>
              </div>
            </div>
          </div>
        </div>
        <div v-show="stepFour">
          <div style="height: 100%; padding: 280px 40%; background: #1a202e">
            <div class="wm320" style="color: #0dd667; font-size: 68px">
              <Icon type="md-checkmark-circle" />
            </div>
            <div class="wm320" style="padding: 10px 15%">{{ scenes.name }}{{ $t('sceneControlCompleted') }}</div>
            <div class="wm320" style="padding: 10px 8%">
              <Button type="primary" @click="backGoToOne">{{ $t('goOnAdd') }}</Button>
              <Button @click="backFourGoList" style="margin-left: 10px" type="primary">{{ $t('backList') }}</Button>
            </div>
          </div>
        </div>
      </Col>
    </Col>

    <!-- 添加设备和线路 -->
    <Modal v-model="editcircuitFlag" width="1200" :title="Object.keys(isEdit).length > 0 ? $t('editcircuit') : $t('addCircuit')" @on-visible-change="getCloseEdit">
      <!-- 查询 -->
      <Row :gutter="10" style="width: 100%" v-if="isQueryForm">
        <Form style="width: 100%; display: flex">
          <FormItem class="w180">
            <Input v-model="addDeviceItem.name" :placeholder="$t('EnterDevice')"></Input>
          </FormItem>
          <FormItem :label-width="20">
            <Select v-model="addDeviceItem.type" @on-change="handleTypes" style="width: 150px" :placeholder="$t('selectGroupingType')">
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
        <Col :span="cur808 ? 8 : 12" class="border" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41">
          <div style="padding: 10px; background: #283140">
            <Checkbox
              v-if="deviceLIstOne.length"
              :value="deviceLIstOne.filter(v => !!v.checked).length === deviceLIstOne.length"
              :indeterminate="deviceLIstOne.filter(v => !!v.checked).length !== 0 && deviceLIstOne.filter(v => !!v.checked).length !== deviceLIstOne.length"
              @on-change="getAllDeviceValue"
              :disabled="!!cur808">
              {{ $t('selectDevice') }}
            </Checkbox>
          </div>
          <div style="padding: 10px; height: 500px; overflow: auto">
            <Checkbox
              class="checkboxlist"
              v-for="item in deviceLIstOne"
              :key="item.mac"
              v-model="item.checked"
              :indeterminate="getDeviceIndeterminate(item.addrs)"
              :disabled="(cur808 !== null && !item.isAllNot808 && item.is808 !== cur808) || (Array.isArray(item.addrs) && item.addrs.length > 0 && !!(item.addrs.filter(its => cur808 !== null && its.is808 === !cur808).length === item.addrs.length))"
              ref="macRef"
              @on-change="checkSelectQuery($event, item)">
              <span style="width: calc(100% - 24px); margin-left: 10px" @click.stop.prevent="clickLable(item.mac, cur808 !== null && !item.isAllNot808 && item.is808 !== cur808)">
                <span :style="{ color: item.mac === curClickedNode ? '#0c70dd' : '#fff' }">{{ item.name }}</span>
              </span>
            </Checkbox>
          </div>
        </Col>

        <Col :span="cur808 ? 8 : 12" class="borderLeft" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41; border-right: 1px solid #3d3d41">
          <div style="padding: 10px; background: #283140">
            <Checkbox v-if="curLines.length" :value="curLines.filter(v => !!v.checked).length === curLines.length" @on-change="lineCheckAll" :indeterminate="curLines.filter(v => !!v.checked).length !== 0 && curLines.filter(v => !!v.checked).length !== curLines.length">
              {{ $t('selectLine') }}
            </Checkbox>
            <span v-else>{{ $t('selectLine') }}</span>
          </div>
          <div style="padding: 10px; height: 500px; overflow: auto">
            <div><Input :placeholder="$t('linenameTosearch')" v-model="lineKeyword" /></div>
            <Checkbox
              style="padding: 5px; display: block"
              v-for="(item, index) in curLines"
              :key="item.title"
              :value="item.checked"
              :disabled="(cur808 !== null && item.is808 === !cur808) || (!item.isSupportOc && item.lineType !== 'IO')"
              v-show="item.title.includes(lineKeyword)"
              @on-change="linesChange($event, item, index)"
              ref="lineRef"
              :indeterminate="Array.isArray(item.digitalOuts) && item.digitalOuts.filter(v => v.checked).length !== 0 && item.digitalOuts.filter(v => v.checked).length !== item.digitalOuts.length">
              <span @click.stop.prevent="getSelectedAddrs(item.addr, cur808 !== null && item.is808 === !cur808, item.digitalOuts)">
                <span :style="{ color: item.addr === curPortesNodes ? '#0c70dd' : '#fff' }">{{ item.title }}</span>
              </span>
            </Checkbox>
          </div>
        </Col>
        <Col :span="8" v-if="cur808" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41; border-right: 1px solid #3d3d41">
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
    <!-- 添加定时 -->
    <Modal :title="$t('addEditTiming')" v-model="timerFlag" width="45%" top="30vh" id="scene-timer">
      <Form :model="sceneTimer">
        <FormItem :label="$t('timingType')" :label-width="120">
          <Select :clearable="true" v-model="sceneTimer.timerType" :placeholder="$t('pleaseSelect')" @on-change="handleTimerType">
            <Option v-for="(item, index) in timerType" :key="index" :label="item.name" :value="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('time')" :label-width="120">
          <DatePicker v-if="sceneTimer.timerType === '1'" v-model="timer" @on-change="handleTimer" format="yyyy-MM-dd HH:mm" :clearable="false" value-format="yyyy-MM-dd HH:mm" type="datetime" :editable="false"></DatePicker>
          <TimePicker v-else @on-change="handleTimer" :editable="false" :clearable="false" format="HH:mm:ss" v-model="nowTime" value-format="HH:mm:ss"></TimePicker>
        </FormItem>
        <!-- 非808设备线路 -->
        <FormItem :label="$t('actionMode')" :label-width="120">
          <Select :clearable="true" v-model="sceneTimer.timerStatus">
            <Option v-for="(item, index) in cur808 ? devIoStatus : timerStatus" :key="index" :label="item.name" :value="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('recurrencePeriod')" :label-width="120" v-if="sceneTimer.timerType === '2'">
          <CheckboxGroup v-model="sceneTimer.week" @on-change="handleCheckedWeekChange">
            <Checkbox v-for="week in weekList" :label="week" :key="week" :disabled="sceneTimer.timerType === '1'">{{ weekConfig[week] }}</Checkbox>
          </CheckboxGroup>
          <Checkbox :indeterminate="isIndeterminate" v-model="checkAll" :disabled="sceneTimer.timerType === '1'" @on-change="handleCheckAllChange">{{ $t('selectAll') }}</Checkbox>
        </FormItem>
        <FormItem :label="$t('generatecallThePolice')" :label-width="120">
          <div class="dis_f">
            <Cascader v-model="alarmValue" clearable :data="alarms" :show-all-levels="false" style="width: 200px"></Cascader>
          </div>
        </FormItem>
      </Form>
      <div class="dialog-footer" style="display: flex; justify-content: flex-end">
        <Button @click="handleSceneTimerCancel" style="margin-right: 10px">{{ $t('cancel') }}</Button>
        <Button class="b-blue" @click="handleSceneTimerSave">{{ $t('confirm') }}</Button>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 设备编辑弹窗 -->
    <Modal :title="$t('editMacLine')" v-model="editDeviecAndLine" :width="cur808 ? '70%' : '40%'">
      <Row style="margin-top: 20px" :gutter="10">
        <Col :span="8" class="border" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41; border-right: 1px solid #3d3d41">
          <div style="padding: 10px; background: #283140">{{ $t('selectDevice') }}</div>
          <div style="padding: 10px; height: 500px; overflow: auto">
            <span>{{ editMac.name + '(' + editMac.mac + ')' }}</span>
          </div>
        </Col>
        <Col :span="cur808 ? 8 : 16" class="borderLeft" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41; border-right: 1px solid #3d3d41">
          <div style="padding: 10px; background: #283140">
            <Checkbox v-if="allLineWithDig.length" v-model="getAllLine" @on-change="lineselectAll">{{ $t('selectLine') }}</Checkbox>
            <span v-else>{{ $t('selectLine') }}</span>
          </div>
          <div style="padding: 10px; height: 500px; overflow: auto">
            <div><Input :placeholder="$t('linenameTosearch')" v-model="lineKeys" /></div>
            <Checkbox
              style="padding: 5px; display: block"
              v-for="item in allLineWithDig"
              :key="item.title"
              v-model="item.ischeckes"
              :indeterminate="item.minates"
              :disabled="item.islineDisable || (!item.isSupportOc && item.lineType !== 'IO')"
              v-show="item.title.includes(lineKeys)"
              ref="lineRef"
              @on-change="changeLines($event, item)">
              <span @click.stop.prevent="changgeColor(item.addr, item.digitalOuts)">
                <span :style="{ color: item.addr === curNodes ? '#0c70dd' : '#fff' }">{{ item.title }}</span>
              </span>
            </Checkbox>
          </div>
        </Col>
        <Col v-if="cur808" :span="8" style="border-left: 1px solid #3d3d41; border-bottom: 1px solid #3d3d41; border-right: 1px solid #3d3d41">
          <div style="padding: 10px; background: #283140">
            <Checkbox :value="linePortSingleDevice.length && linePortSingleDevice.filter(itd => itd.ischecked).length === linePortSingleDevice.length" @on-change="selectAllPorts($event, curNodes)">{{ $t('plsEport') }}</Checkbox>
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
        <Button type="default" @click="closePwds">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <BatchOcAlarmTips ref="batchOcAlarmTips" @commitOK="handleChannelsOcPost" isScene />
  </div>
</template>
<script>
  import { queryAlarmForConfig } from '@/api/multiManage/builtlnTimer'
  import { alarmPageCustom, sceneQueryTimer, getGroupType, getGroupTree, sceneDetailPage, sceneDetailDel, sceneDetailQuerys, sceneDetailSaves, macAndAddrs, saveSnapshot, rollbackSnapshot, sceneGroupList, statusBatchModify, checkSecondPwd, getBaseInfo, sceneDetailConfigDel } from '@/api/public'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import ControlTable from './controlLineTbale.vue'
  import { syncScene, queryChannels, queryScenes, scenesLock, scenesUpdate, scenesDel, remoteCtrl, addrMod, timerMod, checkRemoteCtrlAlm } from '@/api/multiManage/sceneControl'
  import CommandFeedback from '../../Common/CommandFeedback'
  import Synchronize from '../../Control/Synchronize.vue'
  import dayjs from 'dayjs'
  import { processDeviceLineToArray, processDeviceLineToObj, processDeviceLineToObj808, processDeviceLineToArray808, getDeviceIndeterminate } from './deviceProcess'
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  import BatchOcAlarmTips from '@/pages/console/device/deviceDetail/viewModules/common/BatchOcAlarmTips.vue'
  import { weekConfig } from '@/untils/weekMap'
  export default {
    name: 'multiManage-sceneControl',
    data() {
      return {
        weekConfig,
        bpk: null,
        delType: '',
        newPwdsSeconed: '',
        rowDatas: '',
        openSeconedPwd: false,
        isCustom: false,
        seconedSceneGroups: [],
        customName: '',
        nameWord: '',
        groupStatusValue: '',
        sceneStatusList: [
          { value: '-1', label: this.$t('all2') },
          { value: '1', label: this.$t('enabled') },
          { value: '0', label: this.$t('disabled') },
        ],
        groupSeceneValue: '',
        sceneGroups: [],
        seceneListValue: '',
        sceneModelList: [
          { value: 0, label: this.$t('all2') },
          { value: 1, label: this.$t('automatic') },
          { value: 2, label: this.$t('manual') },
        ],
        tableCount: 0,
        allPorts: false,
        linePortSingleDevice: [],
        curPortesNodes: '',
        linePortSelect: [],
        cur808: null,
        deviceAllData: {},
        deviceAllData808: {},
        curLineIo: '',
        savePortNodes: {},
        curPortNodes: {},
        portSelectList: [],
        saveIOesObj: {},
        lineIOlist: [],
        lineIOword: '',
        curIoNodes: '',
        yesIoDeviceList: [],
        deveiceIoePorts: false,
        deveiceIoeLines: false,
        getAllIoPorts: false,
        getAllIoDevice: false,
        getAllIoLines: false,
        deveiceIoeSnate: false,
        ioModalFlag: false,
        lineInterMin: '',
        saveLinesObj: {},
        editRows: '',
        getAllLine: false,
        curNodes: '',
        lineKeys: '',
        allLineWithDig: [],
        editMac: { mac: '', name: '', ischeks: false, indeter: false, curClicked: '' },
        editDeviecAndLine: false,
        openCloseLists: [
          { value: '2', label: this.$t('closing') },
          { value: '1', label: this.$t('opening') },
        ],
        digitalsValue: '',
        digitalList: [
          { value: '4', label: 'ON' },
          { value: '5', label: 'OFF' },
          { value: '7', label: this.$t('inching') },
        ],
        stepFour: false,
        isDeviceIo: false,
        alarmValue: [],
        weekList: ['日', '一', '二', '三', '四', '五', '六'],
        timer: '',
        nowTime: this.$Date().format('HH:mm:ss'),
        controlIds: '',
        stepThrees: false,
        tabName: 'name1',
        timerTableList: [],
        timerColumn: [
          { type: 'index', title: this.$t('sort') },
          { title: this.$t('timingType'), slot: 'timeTypes' },
          { title: this.$t('cyclePeriod'), slot: 'weekdays' },
          { title: this.$t('timingTime'), key: 'time' },
          { title: this.$t('performAction'), slot: 'status' },
        ],
        actionPage: 1,
        actionTotal: 0,
        actionTableList: [],
        actionColumns: [
          { title: this.$t('configDevice'), key: 'title' },
          { title: this.$t('equipmentNo'), key: 'mac' },
          { title: this.$t('line'), slot: 'lines' },
        ],
        listDetailes: {},
        seeDetailsFlag: false,
        isQueryForm: true,
        checkAllGroups: [],
        indeterList: true,
        checkAllList: false,
        submitNode: {},
        allAddrsMap: {},
        lineKeyword: '',
        curLines: [],
        curClickedNode: '',
        deviceLIstOne: [],
        indeterMac: false,
        airSwitch: false,
        handerCurrentPage: 1,
        autoTotal: 0,
        autoCurrentPage: 1,
        stateList: [
          { value: '-1', label: this.$t('disconnected') },
          { value: '0', label: this.$t('offline') },
          { value: '1', label: this.$t('online') },
        ],
        onlinStatus: '',
        packetFilterList: [],
        packetList: [],
        addDeviceItem: { type: '', name: '', typeName: '', position: '' },
        editcircuitFlag: false,
        isEdit: {},
        deviceTableList: [],
        deveiceColumns: [
          { title: this.$t('configDevice'), key: 'title' },
          { title: this.$t('equipmentNo'), key: 'mac' },
          { title: this.$t('line'), slot: 'lines' },
          // { title: this.$t('port'), slot: 'Inetmouth' },
          { title: this.$t('operation'), slot: 'action' },
        ],
        handderColumns: [
          { title: this.$t('configDevice'), key: 'title' },
          { title: this.$t('equipmentNo'), key: 'mac' },
          { title: this.$t('line'), slot: 'lines' },
          { title: this.$t('port'), slot: 'Inetmouth' },
          { title: this.$t('action'), slot: 'action' },
          { title: this.$t('operation'), slot: 'operation' },
        ],
        stepOne: true,
        stepTwo: false,
        switchStatus: true,
        currentmanual: 0,
        currentControl: 0,
        addEditControlFlag: false,
        lineCurrentPage: 1,
        lineTotal: 0,
        linePagesize: 10,
        lineListTable: [],
        checkAlles: false,
        checkValue: false,
        alarms: [
          { value: 'alarms', label: this.$t('alarm'), children: [] },
          { value: 'warns', label: this.$t('earlyWarning'), children: [] },
          { value: 'custom', label: this.$t('customAlarm'), children: [] },
        ],
        centerType: '',
        cencesType: 1,
        scenTypeList: [
          { value: 2, label: this.$t('manual'), isTwo: false },
          { value: 1, label: this.$t('automatic'), isTwo: false },
        ],
        form: {},
        scenesData: [],
        scenes: { id: '', name: '', remark: '' },
        ruleValidate: {
          name: [{ required: true, message: this.$t('sceneNameCannotBeEmpty'), trigger: 'change' }],
        },
        scenelds: '',
        lineSelectionData: [],
        lineSelection: { builds: '', unit: '', room: '' },
        extParam: '',
        timerFlag: false,
        timerId: '',
        timerType: [
          { name: this.$t('singleTiming'), value: '1' },
          { name: this.$t('cycleTiming'), value: '2' },
        ],
        timerStatus: [
          { name: this.$t('closing'), value: 'true' },
          { name: this.$t('opening'), value: 'false' },
        ],
        devIoStatus: [
          { name: 'ON', value: 4 },
          { name: 'OFF', value: 5 },
          { name: this.$t('inching'), value: 7 },
        ],
        checkAll: false,
        isIndeterminate: true,
        instructionsData: {},
        sceneTimer: { timerType: '1', timerStatus: 'true', time: this.$func.getNowFormatDateTime(), week: [] },
        sceneViewFlag: false,
        sceneName: '',
        sceneId: '',
        timerList: [],
        addrList: [],
        tableComponentHeight: this.$store.state.channelsTableHeight,
        feedbackTime: [''],
        title: '',
        newSenec: '',
        scenescolumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: this.$t('sceneName'), slot: 'sceneName' },
          { title: this.$t('sceneMode'), slot: 'pattern' },
          { title: this.$t('sceneGroup'), slot: 'groups' },
          { title: this.$t('state'), slot: 'status', align: 'center' },
          { title: this.$t('sceneDescription'), key: 'remark', align: 'center' },
          { title: this.$t('operation'), slot: 'operating', width: 400, align: 'center' },
        ],
        linecolumns: [
          { title: this.$t('lineName'), key: 'title', align: 'center', width: 200 },
          { title: this.$t('state'), slot: 'status', align: 'center' },
          { title: this.$t('operation'), slot: 'action', align: 'center' },
        ],
        timerColumns: [
          { title: this.$t('sort'), type: 'index' },
          { title: this.$t('timingType'), slot: 'timTyps' },
          { title: this.$t('cyclePeriod'), slot: 'wekdys' },
          { title: this.$t('timingTime'), key: 'time' },
          { title: this.$t('performAction'), slot: 'statsu' },
          { title: this.$t('operation'), slot: 'actiones' },
        ],
        addrListColumns: [],
        total: 0,
        newAddFlag: false,
        firstCount: 0,
        isFristFlag: false,
      }
    },
    mounted() {
      this.init()
      this.getGroupList(true)
      if (this.$route.params.executeConfigId) {
        let obj = { projectCode: this.$store.state.projectCode, sceneId: this.$route.params.executeConfigId }
        getBaseInfo(obj).then(res => {
          if (res.success) {
            let datas = res.data
            this.handleNewView(datas)
          }
        })
      }
    },
    activated() {
      // 如果keep-alive为true，走这里
      if (this.$route.params.executeConfigId) {
        let obj = { projectCode: this.$store.state.projectCode, sceneId: this.$route.params.executeConfigId }
        getBaseInfo(obj).then(res => {
          if (res.success) {
            let datas = res.data
            this.handleNewView(datas)
          }
        })
      }
    },
    computed: {
      disabeldValue() {
        let disabeldValue = this.scenesData.filter(item => item._checked).length === 0
        return disabeldValue
      },
      colorStyle() {
        let colorStyle = this.scenesData.filter(item => item._checked).length === 0 ? { color: '#999999' } : { color: '#258cf0' }
        return colorStyle
      },
    },
    methods: {
      openPwdsModal(id, type) {
        this.newPwdsSeconed = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
          this.rowDatas = id
          this.delType = type || ''
        } else {
          this.handleSceneDels(id, type)
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
                this.handleSceneDel(this.rowDatas, this.delType)
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
      handleSceneDels(ele, type) {
        let params = { projectCode: this.$store.state.projectCode, sceneId: ele }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmDeleteScene'),
          onOk: async () => {
            const res = await scenesDel(params)
            if (res.success) {
              if (type) {
                this.seeDetailsFlag = false
              }
              this.queryScenes(1)
            } else if (res.code === '-1') {
            } else {
              if (res.message) {
                this.$Message.error({ content: res.message })
              } else {
                this.$Message.error({ content: this.$t('unknown') })
              }
            }
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('cancelDelete') })
          },
        })
      },
      getCutsomGroup(val) {
        if (val) {
          this.isCustom = false
        } else {
          this.isCustom = true
        }
      },
      getValueGroup(val) {
        this.customName = val
      },
      async batchActionlist(val) {
        let newIds = this.scenesData
          .filter(item => item._checked)
          .map(itm => itm.sceneId)
          .join()
        let parmars = { projectCode: this.$store.state.projectCode, status: val, sceneIds: newIds }
        const res = await statusBatchModify(parmars)
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.queryScenes(1)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getGroupList(val) {
        const res = await sceneGroupList({ projectCode: this.$store.state.projectCode, includeDefalut: val })
        if (res.success) {
          if (!val) {
            this.seconedSceneGroups = res.data.map(item => ({ value: item, label: item }))
          } else {
            this.sceneGroups = res.data.map(item => ({ value: item, label: item }))
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      cancelSelectAllData() {
        this.scenesData.forEach(item => {
          item._checked = false
        })
      },
      selectAllData() {
        this.scenesData.forEach(item => {
          item._checked = true
        })
      },
      cancelScenenData(selection, row) {
        this.scenesData.forEach(item => {
          if (row.id === item.id) {
            item._checked = false
          }
        })
      },
      selectSingleData(selection, row) {
        // row.checked = true
        this.scenesData.forEach(item => {
          if (row.id === item.id) {
            item._checked = true
          }
        })
      },
      getTabChange(val) {
        if (val === 'name1') {
          this.handleNewView(this.listDetailes)
        }
      },
      async getGroupTypes() {
        let params = { projectCode: this.$store.state.projectCode }
        const res = await getGroupType(params)
        if (res.success) {
          this.packetList = res && res.data
        } else if (res.code === '-1') {
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      getCloseEdit(val) {
        if (!val) {
          this.deviceLIstOne = []
          this.curLines = []
          this.linePortSelect = []
          this.addDeviceItem = { type: '', name: '', typeName: '', position: '' }
          this.onlinStatus = ''
        }
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
      lineCheckAllChange(val, digitalOuts) {
        Array.isArray(digitalOuts) &&
          digitalOuts.length &&
          digitalOuts.forEach(v => {
            v.checked = val
          })
        this.$forceUpdate()
      },
      getDeviceIndeterminate: getDeviceIndeterminate,
      getSelectedAddrs(addr, disabeld, digitalOuts) {
        if (disabeld) return
        this.curPortesNodes = addr
        this.linePortSelect = digitalOuts
      },
      cacncelSave() {
        this.ioModalFlag = false
      },
      async saveisIoAdd() {
        let dataArr = this.yesIoDeviceList.filter(item => item.checked)
        let arr = []
        dataArr.forEach(item => {
          arr.push({ mac: item.mac, configs: item.addrs.filter(v => v.checked).map(itm => ({ addr: itm.addr, digitalOuts: itm.digitalOuts.filter(m => m.checked).map(j => ({ digitalOut: j.value })) })) })
        })
        let parmars = {
          details: arr,
          projectCode: this.$store.state.projectCode,
          sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds,
        }
        const res = await sceneDetailSaves(parmars)
        if (res.success) {
          this.ioModalFlag = false
          this.tablerefresh()
          this.$Message.success({ content: res.message })
        }
      },
      selectIoLines(row, disabled) {
        if (disabled) return
        this.curPortNodes = row.digitalOuts
        this.curLineIo = row.addr
      },
      selectIosAll(val) {
        this.yesIoDeviceList.forEach(v => {
          if (!v.isAllNot808) {
            v.checked = val
            Array.isArray(v.addrs) &&
              v.addrs.length &&
              v.addrs.forEach(j => {
                if (j.is808) {
                  j.checked = val
                  Array.isArray(j.digitalOuts) &&
                    j.digitalOuts.length &&
                    j.digitalOuts.forEach(m => {
                      m.checked = val
                    })
                }
              })
          }
        })
        this.$forceUpdate()
      },
      selectIosAllLines(val, lineIOlist) {
        lineIOlist.forEach(j => {
          if (j.is808) {
            j.checked = val
            Array.isArray(j.digitalOuts) &&
              j.digitalOuts.length &&
              j.digitalOuts.forEach(m => {
                m.checked = val
              })
          }
        })
        this.$forceUpdate()
      },
      selectIosAllLinePorts(val, curPortNodes) {
        curPortNodes.forEach(m => {
          m.checked = val
        })
        this.$forceUpdate()
      },
      getIOsPortSelect(val, digitalOuts) {
        if (val) {
          this.curPortNodes = digitalOuts
          digitalOuts.forEach(v => {
            v.checked = true
          })
        } else {
          digitalOuts.forEach(v => {
            v.checked = false
          })
        }
        this.$forceUpdate()
      },
      getIOslineSelect(val, addrs) {
        if (val) {
          this.curPortNodes = []
          this.lineIOlist = addrs
          this.curLineIo = ''
          addrs.forEach(v => {
            if (v.is808) {
              v.checked = true
              v.digitalOuts.forEach(item => {
                item.checked = true
              })
            }
          })
        } else {
          addrs.forEach(v => {
            if (v.is808) {
              v.checked = false
              v.digitalOuts.forEach(item => {
                item.checked = false
              })
            }
          })
        }
        this.$forceUpdate()
      },
      getIodeVices(mac, disabled) {
        if (disabled) return
        this.curPortNodes = []
        this.curIoNodes = mac
        this.curLineIo = ''
        this.yesIoDeviceList.forEach(item => {
          if (item.mac === mac) {
            this.lineIOlist = item.addrs
          }
        })

        if (this.saveIOesObj[mac]) {
          let lineArr = this.saveIOesObj[mac].map(item => item.addr).join()
          this.lineIOlist.forEach(itm => {
            if (lineArr.indexOf(itm.addr) > -1) {
              itm.islineIOcheck = true
            } else {
              itm.islineIOcheck = false
            }
          })
        }
      },
      async getClosePort(index, ids, indexs) {
        this.deviceTableList.forEach((item, idx) => {
          if (idx === index) {
            if (Array.isArray(item.configs) && item.configs.length) {
              item.configs.forEach((v, i) => {
                if (i === indexs) {
                  if (Array.isArray(v.digitalOuts) && v.digitalOuts.length) {
                    v.digitalOuts.forEach((j, is) => {
                      if (is === ids) {
                        v.digitalOuts.splice(is, 1)
                      }
                    })
                  }
                }
              })
            }
          }
        })
        let params = { details: this.deviceTableList, projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
        const res = await sceneDetailSaves(params)
        if (res.success) {
          setTimeout(() => {
            this.tablerefresh()
          }, 200)
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getCloseLine(addr, index, idx, val) {
        let params = { details: [{ configs: [{ addr }], mac: val.mac, id: val.id }], projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
        const res = await sceneDetailConfigDel(params)
        if (res.success) {
          setTimeout(() => {
            this.tablerefresh()
          }, 100)
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async delIOxlinePort(val, addr, mac, actionType, id) {
        let parmars = { details: [{ configs: [{ addr, digitalOuts: [{ digitalOut: val, actionType }] }], mac, id }], projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
        const res = await sceneDetailConfigDel(parmars)
        if (res.success) {
          setTimeout(() => {
            this.tablerefresh()
          }, 100)
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getDelnotIo(addr, mac, actionType, id) {
        let parmars = {
          details: [{ configs: [{ addr, actionType: actionType || undefined }], mac, id }],
          projectCode: this.$store.state.projectCode,
          sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds,
        }
        const res = await sceneDetailConfigDel(parmars)
        if (res.success) {
          setTimeout(() => {
            this.tablerefresh()
          }, 100)
          this.$Message.success({ content: res.message })
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
      changgeColor(val, row) {
        this.curNodes = val
        this.linePortSingleDevice = row
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
      cancelFlag() {
        this.editDeviecAndLine = false
      },
      async saveEditSingle() {
        if (!this.cur808) {
          // 非808编辑完成
          let detailsArr = this.allLineWithDig.filter(item => !item.islineDisable && !!item.ischeckes)
          if (detailsArr.length === 0) {
            this.editDeviecAndLine = false
            this.getDelDevices(this.editRows)
          } else {
            let parmars = {
              details: [{ mac: this.editMac.mac, configs: [{ addr: detailsArr.map(item => item.addr).join() }] }],
              projectCode: this.$store.state.projectCode,
              sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds,
            }
            const res = await sceneDetailSaves(parmars)
            if (res.success) {
              this.editDeviecAndLine = false
              this.tablerefresh()
              this.$Message.success({ content: res.message })
            } else {
              this.$Message.error({ content: res.message })
            }
          }
        } else {
          // 808编辑allLineWithDig
          let dataArr = this.allLineWithDig.filter(item => !item.islineDisable && !!item.ischeckes)
          let arr = []
          arr.push({
            mac: this.editMac.mac,
            configs: dataArr.map(item => ({ addr: item.addr, digitalOuts: item.digitalOuts.filter(its => its.ischecked).map(v => ({ digitalOut: v.index })) })),
          })
          let parmars = { details: arr, projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
          const res = await sceneDetailSaves(parmars)
          if (res.success) {
            this.tablerefresh()
            this.$Message.success({ content: res.message })
          } else {
            this.$Message.error({ content: res.message })
          }
        }
        this.editDeviecAndLine = false
      },
      editSelectlines() {},
      async getIoaCions(val, indes, idx, index) {
        this.deviceTableList.forEach((item, iddx) => {
          if (iddx === index) {
            if (Array.isArray(item.configs) && item.configs.length) {
              item.configs.forEach((its, vindex) => {
                if (vindex === indes) {
                  if (Array.isArray(its.digitalOuts) && its.digitalOuts.length) {
                    its.digitalOuts.forEach((vales, valindex) => {
                      if (valindex === idx) {
                        vales.actionType = val
                      }
                    })
                  }
                }
              })
            }
          }
        })
        let params = { details: this.deviceTableList, projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
        const res = await sceneDetailSaves(params)
        if (res.success) {
          this.tablerefresh()
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getnoIoAction(val, idx, ids) {
        this.deviceTableList.forEach((item, index) => {
          if (ids === index) {
            if (Array.isArray(item.configs) && item.configs.length) {
              item.configs.forEach((vals, ides) => {
                if (ides === idx) {
                  vals.actionType = val
                }
              })
            }
          }
        })
        let params = {
          details: this.deviceTableList,
          projectCode: this.$store.state.projectCode,
          sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds,
        }
        const res = await sceneDetailSaves(params)
        if (res.success) {
          this.tablerefresh()
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getDelDevices(val) {
        let parmars = {
          projectCode: this.$store.state.projectCode,
          sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds,
          id: val.id,
        }
        const res = await sceneDetailDel(parmars)
        if (res.success) {
          this.tablerefresh()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      nextGoToFour() {
        this.stepThrees = false
        this.stepFour = true
        this.currentControl = 3
      },
      backGoList() {
        this.stepThrees = false
        this.addEditControlFlag = false
        this.init()
      },
      backFourGoList() {
        this.stepFour = false
        this.currentmanual = 0
        this.currentControl = 0
        this.addEditControlFlag = false
        this.init()
      },
      backGoToOne() {
        this.firstCount = 2
        this.currentControl = 0
        this.currentmanual = 0
        this.stepFour = false
        this.stepThrees = false
        this.scenes.remark = ''
        this.scenes.name = ''
        this.isEdit = {}
        this.controlIds = ''
        this.isFristFlag = false
        this.deviceTableList = []
        this.addScenePage()
      },
      backToTwo() {
        this.stepThrees = false
        this.stepTwo = true
        this.currentControl = 1
      },
      async delTimerquery(row) {
        let parmars = {
          projectCode: this.$store.state.projectCode,
          sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds,
          timerId: row.timerId,
          oper: 'del',
        }
        const res = await timerMod(parmars)
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.handleViewScene(Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleSceneTimerSave() {
        if (this.sceneTimer.timerType === '2' && this.sceneTimer.week.length === 0) {
          this.$Message.error({ content: this.$t('selectDuplicate') })
          return false
        }
        let selectTime = ''
        if (this.sceneTimer.timerType === '2') {
          selectTime = this.nowTime
        } else {
          if (this.timer.length > 25) {
            selectTime = dayjs(this.timer).format('YYYY-MM-DD HH:mm:ss')
          } else {
            if (this.timer.length === 5 || this.timer.length === 16) {
              selectTime = this.timer + ':00'
            } else {
              selectTime = this.timer.toString().substring(0, this.timer.length - 2) + '00'
            }
          }
        }
        let alarmTypes = []
        this.alarmValue[0] === 'custom' ? (alarmTypes = { alarmTypeNo: '1015', alarmCustomId: this.alarmValue[1] }) : (alarmTypes = { alarmTypeNo: this.alarmValue[1] || 0, alarmCustomId: 0 })
        let params = {
          sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds,
          timerId: this.timerId,
          weekday: this.sceneTimer.week.join(','),
          timerType: this.sceneTimer.timerType,
          time: selectTime,
          status: this.sceneTimer.timerStatus,
          projectCode: this.$store.state.projectCode,
          oper: 'add',
          ...alarmTypes,
        }
        const res = await timerMod(params)
        if (res.success) {
          this.timerFlag = false
          this.sceneTimer.week = []
          this.sceneTimer.timerType = '1'
          this.timer = this.$func.getNowFormatDateTime()
          this.$Message.success({ content: res.message })
          this.handleViewScene(Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds)
          if (this.sceneViewFlag === true) {
            this.timerId = ''
          }
        } else {
          if (res.message) {
            this.$Message.error({ content: res.message })
          } else {
            this.$Message.error({ content: this.$t('unknown') })
          }
        }
      },
      handleSceneTimerCancel() {
        this.extParam = ''
        this.timerFlag = false
        this.sceneTimer.week = []
        this.sceneTimer.timerType = '1'
        this.sceneTimer.timerStatus = 'true'
        this.timer = this.$func.getNowFormatDateTime()
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
      handleTimer(val) {
        this.timer = val
      },
      handleTimerType(val) {
        if (val === '2') {
          this.timer = this.$func.getNowFormatDateTime()
        } else if (val === '1') {
          this.timer = this.$func.getNowFormatDateTime()
          this.sceneTimer.week = []
        }
      },
      editTimerAction(obj) {
        if (obj) {
          // 编辑定时弹窗处理
          this.timerId = obj.timerId
          this.extParam = this.isEdit.sceneId
          if (obj.alarmTypeNo === 0) {
          } else {
            if (obj.alarmTypeNo === 1015 && obj.alarmCustomId !== 0) {
              this.alarmValue = ['custom', obj.alarmCustomId]
            } else if (obj.alarmCustomId === 0 && obj.alarmTypeNo !== 1015) {
              let typeArr = this.alarms[0].children.filter(item => +item.value === obj.alarmTypeNo)
              if (typeArr.length > 0) {
                this.alarmValue = ['alarms', typeArr[0].value]
              } else {
                let typeArr = this.alarms[1].children.filter(item => +item.value === obj.alarmTypeNo)
                this.alarmValue = ['warns', typeArr[0].value]
              }
            }
          }
          if (obj.weekday) {
            this.sceneTimer.timerType = '2'
            this.sceneTimer.week = obj.weekday.split(',')
            this.nowTime = obj.time
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
            this.timer = obj.time
          }
          if (obj.status === 'true' || obj.status === 'false') {
            this.isDeviceIo = false
          } else {
            this.isDeviceIo = true
          }
          this.sceneTimer.timerStatus = obj.status
          this.timerFlag = true
        } else {
          this.alarmValue = []
          this.sceneTimer = {}
          this.extParam = this.controlIds
        }
      },
      confirmFlag() {
        this.editcircuitFlag = false
      },
      backLists() {
        this.seeDetailsFlag = false
      },
      async changeactionPage(e) {
        this.actionPage = e
        const res = await sceneDetailPage({ projectCode: this.$store.state.projectCode, sceneId: this.listDetailes.sceneId, pageSize: 20, pageNo: this.actionPage })
        if (res.success) {
          this.actionTableList = res.datas
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleNewView(row) {
        this.tabName = 'name1'
        this.listDetailes = row
        this.seeDetailsFlag = true
        this.instructionsData = row
        this.feedbackTime = [this.$func.formatDate('yyyy-MM-dd HH:mm:ss', new Date() - 86400000 * 7), this.$func.getNowFormatDateTime()]
        const res = await sceneDetailPage({ projectCode: this.$store.state.projectCode, sceneId: row.sceneId, pageSize: 20, pageNo: this.actionPage })
        if (res.success) {
          this.tableCount = 0
          res.datas.map(item => {
            if (Array.isArray(item.configs) && item.configs.length) {
              item.configs.forEach(itm => {
                if (itm.lineType === 'IO' && Array.isArray(itm.digitalOuts) && itm.digitalOuts.length) {
                  this.tableCount += 1
                  if (this.listDetailes.type === 1) {
                    this.actionColumns = [
                      { title: this.$t('configDevice'), key: 'title' },
                      { title: this.$t('equipmentNo'), key: 'mac' },
                      { title: this.$t('line'), slot: 'lines' },
                      { title: this.$t('port'), slot: 'ports' },
                    ]
                  } else {
                    this.actionColumns = [
                      { title: this.$t('configDevice'), key: 'title' },
                      { title: this.$t('equipmentNo'), key: 'mac' },
                      { title: this.$t('line'), slot: 'lines' },
                      { title: this.$t('port'), slot: 'ports' },
                      { title: this.$t('action'), slot: 'actiones' },
                    ]
                  }
                }
              })
            }
          })
          if (this.tableCount === 0) {
            if (this.listDetailes.type === 1) {
              this.actionColumns = [
                { title: this.$t('configDevice'), key: 'title' },
                { title: this.$t('equipmentNo'), key: 'mac' },
                { title: this.$t('line'), slot: 'lines' },
              ]
            } else {
              this.actionColumns = [
                { title: this.$t('configDevice'), key: 'title' },
                { title: this.$t('equipmentNo'), key: 'mac' },
                { title: this.$t('line'), slot: 'lines' },
                { title: this.$t('action'), slot: 'actiones' },
              ]
            }
          }
          this.actionTableList = res.datas
          this.actionTotal = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
        if (row.type === 1) {
          let params = { projectCode: this.$store.state.projectCode, sceneId: row.sceneId }
          sceneQueryTimer(params).then(res => {
            if (res.success) {
              this.timerTableList = res.data.timers
            } else {
              this.$Message.error({ content: res.message })
            }
          })
          this.handleSceneSync(row, '1')
        }
      },
      async handleThresholdDeviceAdd() {
        // 正常线路添加
        let dataArr = this.deviceLIstOne.filter(item => item.checked)
        if (dataArr.length === 0) {
          return this.$Message.error({ content: this.$t('pleaseSelectDeviceLine') })
        }
        let arr = []
        dataArr.forEach(item => {
          arr.push({
            mac: item.mac,
            configs: item.addrs
              .filter(v => v.checked)
              .map(itm => ({ addr: itm.addr, digitalOuts: this.cur808 ? Array.isArray(itm.digitalOuts) && itm.digitalOuts.length && itm.digitalOuts.filter(m => m.checked).map(j => ({ digitalOut: j.index, actionType: this.cencesType === 1 ? undefined : this.cur808 ? 4 : 1 })) : undefined })),
          })
        })
        // 设备没有选择提示
        if (arr.length === 0) {
          this.$Message.error({ content: this.$t('pleaseSelectDeviceLine') })
          return false
        }
        let parmars = { details: arr, projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
        const res = await sceneDetailSaves(parmars)
        if (res.success) {
          this.editcircuitFlag = false
          this.tablerefresh()
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      checkSelectQuery(val, row) {
        let newFilterArr = this.deviceLIstOne.filter(item => item.checked)
        if (newFilterArr.length === this.deviceLIstOne.length) {
          this.indeterMac = false
          this.airSwitch = true
        } else if (newFilterArr.length > 0 && newFilterArr.length < this.deviceLIstOne.length) {
          this.indeterMac = true
          this.airSwitch = false
        } else if (newFilterArr.length === 0) {
          this.indeterMac = false
          this.airSwitch = false
        }
        this.deviceLIstOne.forEach(item => {
          if (item.mac === row.mac) {
            this.curLines = item.addrs
          }
        })
        if (val) {
          this.curClickedNode = row.mac
          this.saveLinesObj[row.mac] = this.curLines.filter(item => item.checked && !item.disableAddr)
          if (row.addrs.length) {
            if (this.cur808 !== null) {
              this.curLines.forEach(item => {
                item.checked = this.cur808 === item.is808 && item.isSupportOc
                item.checked &&
                  Array.isArray(item.digitalOuts) &&
                  item.digitalOuts.length &&
                  item.digitalOuts.forEach(j => {
                    j.checked = item.checked
                  })
              })
            } else {
              if (row.isAll808) {
                this.cur808 = true
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
                this.cur808 = false
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
              if (this.cur808) {
              } else {
                this.cur808 = false
              }
              if (Object.keys(this.isEdit).length === 0) {
                if (this.deviceTableList.length === 0) {
                  this.cur808 = null
                }
              }
            }
          })
        }
      },
      editSelectLine(row) {
        // 表格编辑按钮
        this.editRows = row
        this.editDeviecAndLine = true
        let sceids
        if (Object.keys(this.isEdit).length > 0) {
          sceids = this.isEdit.sceneId
        } else {
          sceids = this.controlIds
        }
        this.editMac = { mac: row.mac, name: '', ischeks: false, indeter: true, curClicked: '' }
        let parmars = { projectCode: this.$store.state.projectCode, sceneId: sceids, id: row.id }
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
            sceneDetailQuerys(parmars).then(res => {
              if (res.success) {
                if (Array.isArray(res.data.configs) && res.data.configs.length) {
                  let arrConfig = res.data.configs.map(itms => ({ ...itms, addr: +itms.addr }))
                  arrConfig.forEach(item => {
                    this.allLineWithDig.forEach(itm => {
                      if (itm.addr === item.addr) {
                        itm.ischeckes = true
                        if (this.cur808) {
                          this.curNodes = itm.addr
                          itm.digitalOuts.forEach(v => {
                            v.ischecked = true
                          })
                          this.linePortSingleDevice = itm.digitalOuts
                          this.allPorts = true
                        }
                      }
                      // 808线路禁用规则
                      if (!this.cur808) {
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
                this.$Message.error({ content: res.message })
              }
            })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
        this.isQueryForm = false
      },
      getAllDeviceValue(val) {
        if (val) {
          if (!this.curLines.filter(item => item.checked).length) {
            const isAll808 = this.deviceLIstOne.filter(v => v.isAll808).length === this.deviceLIstOne.length
            this.cur808 = isAll808
          }
          this.deviceLIstOne.forEach(v => {
            v.checked = v.isAll808 === this.cur808
            Array.isArray(v.addrs) &&
              v.addrs.length &&
              v.addrs.forEach(item => {
                item.checked = item.is808 === this.cur808
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
          this.cur808 = null
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
      lineCheckAll(val) {
        if (val) {
          if (!this.curLines.filter(item => item.checked).length) {
            const curNode = this.deviceAllData[this.curClickedNode]
            const { isAll808 } = curNode
            if (isAll808) {
              this.cur808 = true
            } else {
              this.cur808 = false
            }
          }
          this.curLines = this.curLines.map(item => ({ ...item, checked: item.is808 === this.cur808, digitalOuts: item.digitalOuts.map(v => ({ ...v, checked: item.is808 === this.cur808 })) }))
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
              this.cur808 = null
            }
          })
        }
      },
      linesChange(val, row, index) {
        this.linePortSelect = row.digitalOuts
        this.curPortesNodes = row.addr
        if (val) {
          this.cur808 = row.is808
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
              if (this.cur808) {
              } else if (this.cur808 === false) {
              } else {
                this.cur808 = null
              }
              if (Object.keys(this.isEdit).length === 0) {
                if (this.deviceTableList.length === 0) {
                  this.cur808 = null
                }
              }
            }
          })
        }
        this.curLines[index] = { ...this.curLines[index], checked: val }
        this.$forceUpdate()
      },
      clickLable(mac, disabled) {
        if (disabled) {
          return
        }
        this.deviceLIstOne.forEach(item => {
          if (item.mac === mac) {
            if (this.deviceTableList.length === 0) {
              this.curLines = item.addrs
            } else {
              this.curLines = item.addrs
            }
          }
        })
        this.curClickedNode = mac
        if (Object.keys(this.isEdit).length === 0) {
          if (this.deviceTableList.length === 0) {
            this.cur808 = null
          }
        }
      },
      changeHanderPage(e) {
        this.handerCurrentPage = e
        this.changeTablePage(e)
      },
      changePage(e) {
        this.autoCurrentPage = e
        this.changeTablePage(e)
      },
      async changeTablePage(e) {
        const res = await sceneDetailPage({ projectCode: this.$store.state.projectCode, sceneId: this.isEdit.sceneId || this.controlIds, pageSize: 20, pageNo: e })
        if (res.success) {
          if (this.cencesType === 1) {
            if (this.cur808) {
              this.deviceTableList = res.datas.map(item => ({ ...item, configs: item.configs.map(itm => ({ ...itm, checked: true, disableAddr: false })) }))
            } else {
              this.deviceTableList = res.datas.map(item => ({ ...item, configs: item.configs.map(itm => ({ ...itm, checked: true, disableAddr: false })) }))
            }
          } else if (this.cencesType === 2) {
            if (this.cur808) {
              this.deviceTableList = res.datas.map(item => ({ ...item, configs: item.configs.map(itm => ({ ...itm, checked: true, disableAddr: false, digitalOuts: itm.digitalOuts.map(itms => ({ ...itms })) })) }))
            } else {
              this.deviceTableList = res.datas.map(item => ({ ...item, configs: item.configs.map(itm => ({ ...itm, checked: true, disableAddr: false })) }))
            }
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getGroupTrees() {
        const res = await getGroupTree({ groupId: this.packetTypes })
        if (res.code === '0') {
          let resData = this.getTree(res.data)
          this.packetFilterList = this.cloneTree(resData)
        }
      },
      cloneTree(score, parentId = 0) {
        let tree = []
        score.map(item => {
          if (item.parentId === parentId) {
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
      resetButton() {
        this.addDeviceItem = { type: '', name: '', typeName: '', position: '' }
        this.onlinStatus = ''
      },
      async cliclkflag() {
        // this.ioModalFlag = true
        // 表格为808线路设备，此时需要增加lineType为IO来获取808设备列表
        // 此处需要需要进行已选808回显，并禁用所有的非808线路
        let params = { projectCode: this.$store.state.projectCode }
        const res = await macAndAddrs(params)
        if (res.success) {
          this.yesIoDeviceList = processDeviceLineToArray808(res.datas)
          this.deviceAllData808 = processDeviceLineToObj808(res.datas)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlePageQueryAddr() {
        // 查询按钮
        let params = {
          projectCode: this.$store.state.projectCode,
          sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : '',
          online: this.onlinStatus,
          mac: this.addDeviceItem.name,
          location: this.addDeviceItem.position,
          nodeIds: this.addDeviceItem.typeName ? this.addDeviceItem.typeName.join() : this.addDeviceItem.typeName,
        }
        const res = await macAndAddrs(params)
        if (res.success) {
          if (!this.cur808) {
            this.deviceLIstOne = processDeviceLineToArray(res.datas)
            this.deviceAllData = processDeviceLineToObj(res.datas)
          } else {
            this.deviceLIstOne = processDeviceLineToArray808(res.datas)
            this.deviceAllData808 = processDeviceLineToObj808(res.datas)
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      async openDeviceLineFlag() {
        this.getGroupTypes()
        this.curLines = []
        if (this.cur808) {
          this.cur808 = true
          let params = { projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
          const res = await macAndAddrs(params)
          if (res.success) {
            this.deviceLIstOne = processDeviceLineToArray(res.datas)
            this.deviceAllData = processDeviceLineToObj(res.datas)
            this.editcircuitFlag = true
            this.isQueryForm = true
          } else {
            this.$Message.error({ content: res.message })
          }
        } else if (!this.cur808) {
          this.editcircuitFlag = true
          this.isQueryForm = true
          this.cur808 = false
          let params = { projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
          const res = await macAndAddrs(params)
          if (res.success) {
            this.deviceLIstOne = processDeviceLineToArray(res.datas)
            this.deviceAllData = processDeviceLineToObj(res.datas)
          } else {
            this.$Message.error({ content: res.message })
          }
        }
        if (this.isFristFlag) {
        } else {
          if (this.deviceTableList.length === 0) {
            this.cur808 = null
          }
        }
      },
      backStepToOne() {
        this.firstCount = 2
        this.stepTwo = false
        this.stepOne = true
        if (this.cur808) {
          this.cur808 = true
        }
        if (this.cencesType === 2) {
          this.currentmanual = 0
        } else if (this.cencesType === 1) {
          this.currentControl = 0
        }
      },
      async nextStepThreeAuto() {
        if (!this.deviceTableList.length) {
          this.$Message.error({ content: this.$t('pleaseSelectDeviceLine') })
          return
        }
        this.firstCount = 2
        this.stepTwo = false
        this.stepThrees = true
        this.currentControl = 2
        if (Object.keys(this.isEdit).length) {
          this.handleViewScene(this.isEdit.sceneId)
        } else {
          this.timerList = []
        }
        let params = { details: this.deviceTableList, projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
        const res = await sceneDetailSaves(params)
        if (res.success) {
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async nextStepThree() {
        if (!this.deviceTableList.length) {
          this.$Message.error({ content: this.$t('pleaseSelectDeviceLine') })
          return
        }
        this.firstCount = 2
        this.stepTwo = false
        this.stepThrees = true
        this.currentmanual = 2
        let params = { details: this.deviceTableList, projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
        const res = await sceneDetailSaves(params)
        if (res.success) {
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      nextStep() {
        this.$refs.secensCon.validate(valid => {
          if (valid) {
            if (Object.keys(this.isEdit).length) {
              let params = {
                projectCode: this.$store.state.projectCode,
                sceneId: Object.keys(this.isEdit).length > 0 ? this.scenes.id : '',
                sceneName: this.scenes.name,
                remark: this.scenes.remark,
                type: Object.keys(this.isEdit).length > 0 ? this.isEdit.type : this.cencesType,
                status: this.switchStatus ? 1 : 0,
                groupName: this.isCustom ? this.customName : this.$t('default'),
              }
              scenesUpdate(params).then(res => {
                if (res.success) {
                } else {
                  this.$Message.error({ content: res.message })
                }
              })
              sceneDetailPage({ projectCode: this.$store.state.projectCode, sceneId: this.isEdit.sceneId, pageSize: 20, pageNo: 1 }).then(res => {
                if (res.success) {
                  let newFlag = false
                  if (this.firstCount === 1) {
                    let dataArrs = res.datas
                    let counts = 0
                    dataArrs.forEach(item => {
                      if (Array.isArray(item.configs) && item.configs.length) {
                        item.configs.forEach(its => {
                          if (its.lineType === 'IO') {
                            counts++
                            this.isDeviceIo = true
                            this.cur808 = true
                            newFlag = true
                          }
                        })
                      }
                    })
                    if (dataArrs.length > 0) {
                      this.isFristFlag = true
                    }
                    if (counts === 0 && res.datas.length > 0) {
                      this.cur808 = false
                    } else if (res.datas.length === 0) {
                      this.cur808 = null
                      this.isFristFlag = false
                    }
                  }
                  if (this.cencesType === 1) {
                    // 自动
                    this.stepOne = false
                    this.stepTwo = true
                    if (this.cur808) {
                      this.isDeviceIo = true
                      this.deviceTableList = res.datas.map(item => ({ ...item, configs: item.configs.map(itm => ({ ...itm, checked: true, disableAddr: false, digitalOuts: itm.digitalOuts.map(itms => ({ ...itms, isDigcheck: true })) })) }))
                    } else {
                      this.isDeviceIo = false
                      this.deviceTableList = res.datas.map(item => ({ ...item, configs: item.configs.map(itm => ({ ...itm, checked: true, disableAddr: false })) }))
                    }
                  } else if (this.cencesType === 2) {
                    // 手动
                    this.stepOne = false
                    this.stepTwo = true
                    if (this.cur808) {
                      this.isDeviceIo = true
                    } else {
                      this.isDeviceIo = false
                    }

                    if (this.isDeviceIo) {
                      this.deviceTableList = res.datas.map(item => ({ ...item, configs: item.configs && item.configs.map(itm => ({ ...itm, checked: true, disableAddr: false, digitalOuts: itm.digitalOuts.map(itms => ({ ...itms, isDigcheck: true })) })) })) || []
                    } else {
                      this.deviceTableList = res.datas.map(item => ({ ...item, configs: item.configs && item.configs.map(itm => ({ ...itm, checked: true, disableAddr: false })) })) || []
                    }
                  }

                  if (this.cur808) {
                    if (this.deviceTableList.length === 0) {
                      this.deveiceColumns = [
                        { title: this.$t('configDevice'), key: 'title' },
                        { title: this.$t('equipmentNo'), key: 'mac' },
                        { title: this.$t('line'), slot: 'lines' },
                        { title: this.$t('operation'), slot: 'action' },
                      ]
                      this.handderColumns = [
                        { title: this.$t('configDevice'), key: 'title' },
                        { title: this.$t('equipmentNo'), key: 'mac' },
                        { title: this.$t('line'), slot: 'lines' },
                        { title: this.$t('action'), slot: 'action' },
                        { title: this.$t('operation'), slot: 'operation' },
                      ]
                    } else {
                      this.deveiceColumns = [
                        { title: this.$t('configDevice'), key: 'title' },
                        { title: this.$t('equipmentNo'), key: 'mac' },
                        { title: this.$t('line'), slot: 'lines' },
                        { title: this.$t('port'), slot: 'Inetmouth' },
                        { title: this.$t('operation'), slot: 'action' },
                      ]
                      this.handderColumns = [
                        { title: this.$t('configDevice'), key: 'title' },
                        { title: this.$t('equipmentNo'), key: 'mac' },
                        { title: this.$t('line'), slot: 'lines' },
                        { title: this.$t('port'), slot: 'Inetmouth' },
                        { title: this.$t('action'), slot: 'action' },
                        { title: this.$t('operation'), slot: 'operation' },
                      ]
                    }
                  } else {
                    this.deveiceColumns = [
                      { title: this.$t('configDevice'), key: 'title' },
                      { title: this.$t('equipmentNo'), key: 'mac' },
                      { title: this.$t('line'), slot: 'lines' },
                      { title: this.$t('operation'), slot: 'action' },
                    ]
                    this.handderColumns = [
                      { title: this.$t('configDevice'), key: 'title' },
                      { title: this.$t('equipmentNo'), key: 'mac' },
                      { title: this.$t('line'), slot: 'lines' },
                      { title: this.$t('action'), slot: 'action' },
                      { title: this.$t('operation'), slot: 'operation' },
                    ]
                  }
                  if (!newFlag) {
                    this.isDeviceIo = false
                  }
                  this.autoTotal = res.total
                  if (this.cencesType === 2) {
                    this.currentmanual = 1
                  } else if (this.cencesType === 1) {
                    this.currentControl = 1
                  }
                } else {
                  this.$Message.error({ content: res.message })
                }
              })
            } else if (!Object.keys(this.isEdit).length) {
              this.cur808 = null
              // 新增状态
              let params = {
                projectCode: this.$store.state.projectCode,
                sceneId: this.controlIds ? this.controlIds : '',
                sceneName: this.scenes.name,
                remark: this.scenes.remark,
                type: this.cencesType,
                status: this.switchStatus ? 1 : 0,
                groupName: this.isCustom ? this.customName : this.$t('default'),
              }
              scenesUpdate(params).then(res => {
                if (res.success) {
                  if (this.controlIds.length > 0) {
                  } else {
                    this.controlIds = res.data
                  }
                  // 拿到场景id在第三步使用
                  this.stepOne = false
                  this.stepTwo = true
                  this.scenTypeList.forEach(item => {
                    if (item.value === this.cencesType) {
                      item.isTwo = false
                    } else {
                      item.isTwo = true
                    }
                  })
                  if (this.cencesType === 2) {
                    this.currentmanual = 1
                  } else if (this.cencesType === 1) {
                    this.currentControl = 1
                  }
                  let dataPrams = { projectCode: this.$store.state.projectCode, sceneId: this.controlIds, operate: 'add' }
                  saveSnapshot(dataPrams).then(res => {
                    if (res.success) {
                    } else {
                      this.$Message.error({ content: res.message })
                    }
                  })
                } else {
                  this.$Message.error({ content: res.message })
                  if (this.cencesType === 2) {
                    this.currentmanual = 0
                  } else if (this.cencesType === 1) {
                    this.currentControl = 0
                  }
                }
              })
              if (this.cur808) {
                if (this.deviceTableList.length === 0) {
                  this.deveiceColumns = [
                    { title: this.$t('configDevice'), key: 'title' },
                    { title: this.$t('equipmentNo'), key: 'mac' },
                    { title: this.$t('line'), slot: 'lines' },
                    { title: this.$t('operation'), slot: 'action' },
                  ]
                  this.handderColumns = [
                    { title: this.$t('configDevice'), key: 'title' },
                    { title: this.$t('equipmentNo'), key: 'mac' },
                    { title: this.$t('line'), slot: 'lines' },
                    { title: this.$t('action'), slot: 'action' },
                    { title: this.$t('operation'), slot: 'operation' },
                  ]
                } else {
                  this.deveiceColumns = [
                    { title: this.$t('configDevice'), key: 'title' },
                    { title: this.$t('equipmentNo'), key: 'mac' },
                    { title: this.$t('line'), slot: 'lines' },
                    { title: this.$t('port'), slot: 'Inetmouth' },
                    { title: this.$t('operation'), slot: 'action' },
                  ]
                  this.handderColumns = [
                    { title: this.$t('configDevice'), key: 'title' },
                    { title: this.$t('equipmentNo'), key: 'mac' },
                    { title: this.$t('line'), slot: 'lines' },
                    { title: this.$t('port'), slot: 'Inetmouth' },
                    { title: this.$t('action'), slot: 'action' },
                    { title: this.$t('operation'), slot: 'operation' },
                  ]
                }
              } else {
                this.deveiceColumns = [
                  { title: this.$t('configDevice'), key: 'title' },
                  { title: this.$t('equipmentNo'), key: 'mac' },
                  { title: this.$t('line'), slot: 'lines' },
                  { title: this.$t('operation'), slot: 'action' },
                ]
                this.handderColumns = [
                  { title: this.$t('configDevice'), key: 'title' },
                  { title: this.$t('equipmentNo'), key: 'mac' },
                  { title: this.$t('line'), slot: 'lines' },
                  { title: this.$t('action'), slot: 'action' },
                  { title: this.$t('operation'), slot: 'operation' },
                ]
              }
            }
          }
        })
      },
      tablerefresh() {
        sceneDetailPage({
          projectCode: this.$store.state.projectCode,
          sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds,
          pageSize: 20,
          pageNo: 1,
        }).then(res => {
          if (res.success) {
            if (this.cencesType === 1) {
              if (this.cur808) {
                this.deviceTableList = res.datas.map(item => ({ ...item, configs: item.configs.map(itm => ({ ...itm, checked: true, disableAddr: false, digitalOuts: itm.digitalOuts.map(itms => ({ ...itms, isDigcheck: true })) })) }))
              } else {
                this.deviceTableList = res.datas.map(item => ({ ...item, configs: item.configs.map(itm => ({ ...itm, checked: true, disableAddr: false })) }))
              }
            } else if (this.cencesType === 2) {
              if (this.cur808) {
                this.deviceTableList = res.datas.map(item => ({ ...item, configs: Array.isArray(item.configs) && item.configs.length && item.configs.map(itm => ({ ...itm, checked: true, disableAddr: false, digitalOuts: itm.digitalOuts.map(itms => ({ ...itms, isDigcheck: true })) })) })) || []
              } else {
                this.deviceTableList = res.datas.map(item => ({ ...item, configs: Array.isArray(item.configs) && item.configs.length && item.configs.map(itm => ({ ...itm, checked: true, disableAddr: false })) })) || []
              }
            }
            if (!this.isFristFlag) {
              let newFlag = false
              let dataArrs = res.datas
              dataArrs.forEach(item => {
                if (Array.isArray(item.configs) && item.configs.length) {
                  item.configs.forEach(its => {
                    if (its.lineType === 'IO') {
                      this.cur808 = true
                      newFlag = true
                    }
                  })
                }
              })
              if (!newFlag) {
                if (dataArrs.length === 0) {
                  this.cur808 = null
                } else if (dataArrs.length > 0) {
                  this.cur808 = false
                }
              }
            }

            if (this.cur808) {
              if (this.cencesType === 1) {
                this.deveiceColumns = [
                  { title: this.$t('configDevice'), key: 'title' },
                  { title: this.$t('equipmentNo'), key: 'mac' },
                  { title: this.$t('line'), slot: 'lines' },
                  { title: this.$t('port'), slot: 'Inetmouth' },
                  { title: this.$t('operation'), slot: 'action' },
                ]
              }
              this.handderColumns = [
                { title: this.$t('configDevice'), key: 'title' },
                { title: this.$t('equipmentNo'), key: 'mac' },
                { title: this.$t('line'), slot: 'lines' },
                { title: this.$t('port'), slot: 'Inetmouth' },
                { title: this.$t('action'), slot: 'action' },
                { title: this.$t('operation'), slot: 'operation' },
              ]
            } else {
              this.deveiceColumns = [
                { title: this.$t('configDevice'), key: 'title' },
                { title: this.$t('equipmentNo'), key: 'mac' },
                { title: this.$t('line'), slot: 'lines' },
                { title: this.$t('operation'), slot: 'action' },
              ]
              this.handderColumns = [
                { title: this.$t('configDevice'), key: 'title' },
                { title: this.$t('equipmentNo'), key: 'mac' },
                { title: this.$t('line'), slot: 'lines' },
                { title: this.$t('action'), slot: 'action' },
                { title: this.$t('operation'), slot: 'operation' },
              ]
            }
            this.autoTotal = res.total
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      toBack() {
        this.$Modal.confirm({
          title: this.$t('savedAfterCancellation'),
          content: this.$t('wantCancel') + '?',
          onOk: () => {},
          onCancel: () => {
            if ((this.cencesType === 2 && this.currentmanual === 0) || (this.cencesType === 1 && this.currentControl === 0)) {
            } else {
              let params = { projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
              rollbackSnapshot(params).then(res => {
                if (res.success) {
                  this.$Message.info(this.$t('editCanceled'))
                  this.init()
                } else {
                  this.$Message.error({ content: res.message })
                }
              })
            }
            this.addEditControlFlag = false
            this.scenes.remark = ''
            this.scenes.name = ''
            this.currentmanual = 0
            this.currentControl = 0
            this.stepOne = false
            this.stepTwo = false
            this.stepThrees = false
            this.deviceTableList = []
            this.curClickedNode = ''
            this.scenTypeList.forEach(item => {
              item.isTwo = false
            })
            if (Object.keys(this.isEdit).length > 0) {
              this.isEdit = {}
            } else {
              this.controlIds = ''
            }
          },
          okText: this.$t('wrong'),
          cancelText: this.$t('cancel'),
        })
      },
      addScenePage() {
        this.isCustom = false
        this.isFristFlag = false
        this.addEditControlFlag = true
        this.scenTypeList.forEach(item => {
          item.isTwo = false
        })
        this.stepOne = true
        this.isEdit = {}
        this.scenes.name = ''
        this.scenes.remark = ''
        this.isDeviceIo = false
        this.switchStatus = true
        this.cencesType = 1
        this.currentmanual = 0
        this.currentControl = 0
        this.stepFour = false
        this.stepThrees = false
        this.controlIds = ''
        this.deviceTableList = []
        this.getGroupList(false)
      },
      changePages(e) {
        this.queryScenes(e)
      },
      init() {
        this.queryScenes(1)
        this.handleAlarmFocus()
      },
      reset() {
        this.instructionsData.mac = ''
        this.feedbackTime = [this.$func.formatDate('yyyy-MM-dd HH:mm:ss', new Date() - 86400000 * 7), this.$func.getNowFormatDateTime()]
      },
      queryScenceList() {
        this.queryScenes(1)
      },
      resetCheckValue() {
        this.seceneListValue = ''
        this.groupStatusValue = ''
        this.groupSeceneValue = ''
        this.nameWord = ''
      },
      queryScenes(pageNo) {
        let params = { projectCode: this.$store.state.projectCode, type: this.seceneListValue || 0, pageNo, pageSize: 10, status: this.groupStatusValue || -1, groupName: this.groupSeceneValue || '', sceneName: this.nameWord }
        this.$nextTick(function () {
          queryScenes(params)
            .then(res => {
              if (res.success) {
                this.scenesData = res.datas.map(item => ({ ...item, _checked: false }))
                this.total = res.total
                this.controlIds = ''
                this.cur808 = null
              } else if (res.code === '-1') {
              } else {
                this.$Message.error({ content: res.message })
              }
            })
            .catch(err => {
              if (err) {
                this.$Message.error({ content: this.$t('unknown') })
              }
            })
        })
      },
      queryFeedbackList() {
        this.$refs.CommandFeedback.handleFeedBackList()
      },
      async handleSceneStatus(ele) {
        let params = { projectCode: this.$store.state.projectCode, sceneId: ele }
        const res = await scenesLock(params)
        if (res.success) {
          this.queryScenes(1)
        } else if (res.code === '-1') {
        } else {
          if (res.message) {
            this.$Message.error({ content: res.message })
          } else {
            this.$Message.error({ content: this.$t('unknown') })
          }
        }
      },
      handleSceneEdit(obj, val) {
        if (val === 'tabdetails') {
          this.seeDetailsFlag = false
        }
        this.addEditControlFlag = true
        this.isEdit = obj

        if (obj.groupName === this.$t('default')) {
          this.isCustom = false
        } else {
          this.isCustom = true
          this.customName = obj.groupName
        }
        if (obj.type === 1) {
          this.currentControl = 0
          this.currentmanual = 0
        } else {
          this.currentmanual = 0
          this.currentControl = 0
        }
        this.stepOne = true
        if (obj.sceneId) {
          this.cencesType = obj.type
          this.switchStatus = obj.status === 1
          this.scenes.id = obj.sceneId
          this.scenes.name = obj.sceneName
          this.scenes.remark = obj.remark
        }
        this.firstCount = 1
        this.isFristFlag = false
        let dataPrams = { projectCode: this.$store.state.projectCode, sceneId: obj.sceneId, operate: 'mod' }
        saveSnapshot(dataPrams).then(res => {
          if (res.success) {
          } else {
            this.$Message.error({ content: res.message })
          }
        })
        this.getGroupList(false)
      },

      handleSceneCancel() {
        this.addEditControlFlag = false
        this.scenes.id = ''
        this.scenes.name = ''
        this.scenes.remark = ''
        this.controlIds = ''
      },
      handleSceneSave() {
        //  this.deviceTableList = []  记得加上
        if ((this.currentControl === 0 && this.cencesType === 1) || (this.currentmanual === 0 && this.cencesType === 2)) {
          if (this.scenes.name === '') {
            this.$Message.error({ content: this.$t('pleaseEnterSceneName') })
            return false
          }
          let params = {
            projectCode: this.$store.state.projectCode,
            sceneId: Object.keys(this.isEdit).length > 0 ? this.scenes.id : '',
            sceneName: this.scenes.name,
            remark: this.scenes.remark,
            type: Object.keys(this.isEdit).length > 0 ? this.isEdit.type : this.cencesType,
            status: this.switchStatus ? 1 : 0,
            groupName: this.isCustom ? this.customName : this.$t('default'),
          }
          scenesUpdate(params)
            .then(res => {
              if (res.success) {
                this.handleSceneCancel()
                this.queryScenes(1)
              } else if (res.code === '-1') {
              } else {
                if (res.message) {
                  this.$Message.error({ content: res.message })
                } else {
                  this.$Message.error({ content: this.$t('unknown') })
                }
              }
            })
            .catch(err => {
              if (err) {
                this.$Message.error({ content: this.$t('unknown') })
              }
            })
        }

        if (this.currentControl === 1 || this.currentmanual === 1) {
          if (this.deviceTableList.length === 0) {
            this.$Message.error({ content: this.$t('pleaseAddDevice') })
          }
          let params
          if (this.cencesType === 1) {
            params = { details: this.deviceTableList, projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
          } else if (this.cencesType === 2) {
            params = { details: this.deviceTableList, projectCode: this.$store.state.projectCode, sceneId: Object.keys(this.isEdit).length > 0 ? this.isEdit.sceneId : this.controlIds }
          }
          sceneDetailSaves(params).then(res => {
            if (res.success) {
              this.editcircuitFlag = false
              this.$Message.success({ content: res.message })
              this.addEditControlFlag = false
              this.scenes.remark = ''
              this.scenes.name = ''
              this.currentmanual = 0
              this.currentControl = 0
              this.stepOne = false
              this.stepTwo = false
              this.isEdit = {}
              this.deviceTableList = []
              this.curClickedNode = ''
              this.scenTypeList.forEach(item => {
                item.isTwo = false
              })
              this.queryScenes(1)
            }
          })
        }
        if (this.currentControl === 2) {
          this.$Message.success({ content: this.$t('savedSuccessfully') })
          this.stepThrees = false
          this.addEditControlFlag = false
          this.scenes.remark = ''
          this.scenes.name = ''
          this.currentmanual = 0
          this.currentControl = 0
          this.stepOne = false
          this.stepTwo = false
          this.isEdit = {}
          this.deviceTableList = []
          this.curClickedNode = ''
          this.scenTypeList.forEach(item => {
            item.isTwo = false
          })
        }
      },
      async handleSceneDel(ele, type) {
        let params = { projectCode: this.$store.state.projectCode, sceneId: ele }
        const res = await scenesDel(params)
        if (res.success) {
          if (type) {
            this.seeDetailsFlag = false
          }
          this.$Message.success({ content: this.$t('deleteSuccessful') })
          this.queryScenes(1)
        } else {
          if (res.message) {
            this.$Message.error({ content: res.message })
          } else {
            this.$Message.error({ content: this.$t('unknown') })
          }
        }
      },
      async handleSceneOc(ele, oc) {
        let params = { projectCode: this.$store.state.projectCode, sceneId: ele, actionType: oc, _operate_at: '3' + ':' + ele }
        const res = await checkRemoteCtrlAlm(params)
        if (res.success) {
          if (res.data.length > 0) {
            this.$refs.batchOcAlarmTips.openModal(res.data, oc === '2', params)
          } else {
            this.$Modal.confirm({
              title: this.$t('tip'),
              content: oc === 'open' ? this.$t('IsitOneClickToOpen') : this.$t('IsitOneClickToOperateThisScene'),
              onOk: () => {
                this.handleChannelsOcPost(params)
              },
              onCancel: () => {
                this.$Message.info({ content: oc === 'open' ? this.$t('oneButtonCanceledOpenScene') : this.$t('oneButtonCanceledCloseScene') })
              },
            })
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleChannelsOcPost(params) {
        const res = await remoteCtrl(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('submitCommand') })
        } else {
          if (res.message) {
            this.$Message.error({ content: res.message })
          } else {
            this.$Message.error({ content: this.$t('unknown') })
          }
        }
      },
      handleInstructions(row) {
        this.seeDetailsFlag = true
        this.tabName = 'name2'
        this.instructionsData = row
        this.listDetailes = row
        this.feedbackTime = [this.$func.formatDate('yyyy-MM-dd HH:mm:ss', new Date() - 86400000 * 7), this.$func.getNowFormatDateTime()]
      },
      async queryDeviceLines() {
        if (!this.lineSelection.builds || !this.lineSelection.unit || !this.lineSelection.room) {
          this.$Message.error({ content: this.$t('pleaseSelectBuildingUnitRoom') })
          return false
        }
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
        const res = await queryChannels(params)
        if (res.success) {
          this.lineSelectionData = res.datas
        } else {
          if (res.message) {
            this.$Message.error({ content: res.message })
          } else {
            this.$Message.error({ content: this.$t('unknown') })
          }
        }
      },
      async handleAssign(mac, addr, oper) {
        let params = { projectCode: this.$store.state.projectCode, sceneId: this.sceneId, mac: mac, addr: addr, oper: oper }
        const res = await addrMod(params)
        if (res.success) {
          this.$Message.success({ content: oper === 'add' ? this.$t('successfullyAddedSceneLines') : this.$t('successfullyDeleteSceneLines') })
          this.queryScenes(1)
          if (this.sceneViewFlag === true) {
          }
        } else {
          if (res.message) {
            this.$Message.error({ content: res.message })
          } else {
            this.$Message.error({ content: this.$t('unknown') })
          }
        }
      },
      refresLinetable(val) {
        sceneDetailPage({ projectCode: this.$store.state.projectCode, sceneId: val, pageSize: this.linePagesize, pageNo: this.lineCurrentPage }).then(res => {
          if (res.success) {
            this.lineTotal = res.total
            if (this.centerType.type === 2) {
              this.addrList = res.datas.map(item => ({ ...item, actionType: item.addrs[0].actionType }))
            } else {
              let arrList = []
              res.datas.forEach(item => {
                if (Array.isArray(item.addrs) && item.addrs.length) {
                  arrList.push(...item.addrs.map((itm, i) => ({ ...itm, name: item.name, location: item.location, mac: item.mac, isIndeterminate: false, checked: false, linechecked: false })))
                }
              })
              const fun = (data, key) => {
                let flag = ''
                let count = 0
                let statrtIndex = 0
                const tnArr = Array.from(new Set(data.map(v => v.name)))
                const tnKeys = tnArr.reduce((pre, cur, index) => {
                  pre[cur] = index % 2 === 0
                  return pre
                }, {})
                data.forEach((v, i) => {
                  if (i === 0) {
                    flag = v[key]
                  }
                  if (v[key] !== flag) {
                    data[statrtIndex][`${key}Row`] = count
                    count = 0
                    statrtIndex = i
                    flag = v[key]
                  }
                  // 第一遍遍历完成
                  if (v.nameRow && (key === 'mac' || key === 'location')) {
                    data[statrtIndex][`${key}Row`] = count
                    count = 0
                    statrtIndex = i
                    flag = v[key]
                  }
                  // 第二遍遍历完成
                  if (v.macRow && key === 'location') {
                    data[statrtIndex][`${key}Row`] = count
                    count = 0
                    statrtIndex = i
                    flag = v[key]
                  }
                  count++
                  if (i === data.length - 1) {
                    data[statrtIndex][`${key}Row`] = count
                  }
                  // is2n
                  if (v.name) {
                    v.is2n = tnKeys[v.name]
                  }
                })
              }
              Array.isArray(arrList) && arrList.length && fun(arrList, 'name')
              Array.isArray(arrList) && arrList.length && fun(arrList, 'mac')
              Array.isArray(arrList) && arrList.length && fun(arrList, 'location')
              this.lineListTable = arrList
            }
            this.sceneViewFlag = true
            if (this.lineListTable.every(item => !item.checked && !item.linechecked)) {
              this.checkAlles = false
              this.checkValue = false
            }
          }
        })
      },
      async handleViewScene(ele) {
        let params = { projectCode: this.$store.state.projectCode, sceneId: ele }
        const res = await sceneQueryTimer(params)
        if (res.success) {
          this.timerList = res.data.timers
          this.sceneId = ele
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleSceneSync(row, type) {
        this.listDetailes = row
        if (!type) {
          this.seeDetailsFlag = true
          this.tabName = 'name3'
          this.instructionsData = row
          this.feedbackTime = [this.$func.formatDate('yyyy-MM-dd HH:mm:ss', new Date() - 86400000 * 7), this.$func.getNowFormatDateTime()]
        }
        this.scenelds = row.sceneId
        const res = await syncScene({ sceneId: this.scenelds })
        if (res.success) {
          this.syncFlag = true
        } else {
          if (res.message) {
            this.$Message.error({ content: res.message })
          } else {
            this.$Message.error({ content: this.$t('unknown') })
          }
        }
      },
      handleAlarmFocus() {
        queryAlarmForConfig({ projectCodes: this.$store.state.projectCode }).then(res => {
          res.data.alarms
            .filter(itm => itm.typeNumber !== '1015')
            .map(item => {
              return this.alarms[0].children.push({ value: item.typeNumber, label: item.info })
            })
          res.data.warns.map(item => {
            return this.alarms[1].children.push({ value: item.typeNumber, label: item.info })
          })
        })
        let params = { params: { projectCode: this.$store.state.projectCode, status: 1 }, pageNo: 1, pageSize: 9999 }
        alarmPageCustom(params).then(res => {
          if (res.success) {
            res.datas.forEach(item => {
              this.alarms[2].children.push({ value: item.id, label: item.name })
            })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
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
    components: {
      Synchronize,
      ControlTable,
      PwsSeconedCheckVue,
      CommandFeedback,
      BatchOcAlarmTips,
    },
  }
</script>
<style lang="less" scoped>
  .wm320 {
    margin: 15px auto;
    //   width: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .TC-deviceboxs {
    padding: 10px;
    background: rgba(92, 92, 92, 0.5);
    border: 1px solid #999999;
    color: #999999;
  }
  .checkboxlist {
    display: block;
    margin: 0 0 20px 0;
  }
  .steps-Twos {
    margin-top: 10px;
    background: #1a202e;
    .line-deveice {
      display: flex;
      flex-wrap: wrap;
    }
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
  #control {
    min-height: 800px;
    background: #1a202e;
    padding: 20px;

    .header {
      padding: 0px 0px 20px 0;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .but-ton {
        background: #007eff;
        font-size: 14px;
        &:hover {
          color: #fff !important;
        }
      }
    }
  }
  .no-complete {
    .ivu-steps-title {
      color: #999 !important;
    }
  }
  .head-Conts {
    background: #1a202e;
    border-radius: 5px;
    margin: 10px 0;
    padding: 20px 10px 15px 10px;
  }
  .first-Contents {
    height: 40%;
    border-radius: 5px;
    background: #1a202e;
    padding: 20px 40px;
    &-title {
      font-size: 18px;
      font-family: PingFang SC;
      color: #fff;
    }
  }
  .right-table {
    width: 100%;
    padding-left: 10px;
    /deep/ .ivu-table-cell {
      white-space: nowrap;
      padding: 0;
      height: 100%;
    }

    /deep/.ivu-table-cell-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100% !important;
    }
  }
  .pd-r {
    padding-right: 10px;
  }
  .disf {
    display: flex;
    margin-top: 20px;
  }
  .marl {
    margin-left: 10px;
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
    padding: 5px;
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

  .es-info {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 400;
    &-title {
      font-size: 14px;
      color: #999999;
      padding: 10px;
    }
    &-txt {
      font-size: 14px;
      color: #ffffff;
    }
  }
  .execu-list-title {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ffffff;
    padding-bottom: 30px;
  }
</style>
