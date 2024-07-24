<template>
  <div class="project">
    <Row class="project_list mt">
      <Col span="24" style="padding: 0">
        <Row class="sw" style="">
          <Col span="24" class="df content">
            <Col span="24">
              <div class="content">
                <div class="project_map" style="padding-bottom: 1px">
                  <div class="line" style="margin-left: -20px; margin-top: -30px"></div>
                  <div class="title" style="margin-left: 0px; margin-top: -30px">
                    {{ $t('shortcuts') }}
                  </div>
                </div>
              </div>
              <div class="edit">
                <Button type="primary" style="background: #1a202e; color: #e03c3a; border: 1px solid #1a202e" v-show="flag" @click="cancel">{{ $t('cancel') }}</Button>
                <Button type="primary" style="background: #1a202e; color: #007eff; border: 1px solid #1a202e" @click="joinin">{{ flag ? $t('save') : $t('edit') }}</Button>
              </div>
              <Row :gutter="10">
                <Col :span="4" v-for="(item, index) in dataArr" :key="item.title" @mouseenter="enter(index)" @mouseleave="leave">
                  <div class="item" @click="go(item)">
                    <i :class="item.icon" class="icon-v5" :style="isHover === index ? 'color:#007EFF' : ''"></i>
                    <span :style="isHover === index ? 'color:#007EFF' : ''">{{ item.name }}</span>
                    <span type="text" style="position: absolute; right: 8px; top: 0px" @click.stop="deletes(item, index)" v-show="flag" class="icon-v5 icon-v5-shanchu2"></span>
                  </div>
                </Col>
                <div class="item" style="background: rgba(0, 126, 255, 0.1); position: relative; border: 1px dashed #007eff; padding: 0 80px; margin-left: 5px" @click="add" v-show="flag">
                  <i class="ivu-icon ivu-icon-md-add" style="font-size: 20px; color: #007eff"></i>
                  <span type="text" style="top: 0px; color: #007eff">{{ $t('add') }}</span>
                </div>
              </Row>
            </Col>
          </Col>
        </Row>
      </Col>
    </Row>

    <div class="map">
      <Tabs :animated="false" v-model="tabsMap">
        <TabPane :label="$t('deviceOverview')" name="name1">
          <template v-if="tabsMap === 'name1'">
            <projectmap2 v-show="single === 0" />
          </template>
          <div class="mapArea" v-show="single === 1" style="width: 100%; display: flex; justify-content: center">
            <div class="mapBigArea" :style="value" ref="maskBoxs" @mousedown="onmousedown($event)" @mouseup="onmouseup($event)" @mousemove="onmousemove" @mouseout="onmouseout" @drop="drop($event)" @dragover="allowDrop($event)">
              <template v-for="item in list">
                <vue-drag-resize :h="60" :x="item.offsetX" :y="item.offsetY" :parentLimitation="true" :isActive="true" :isDraggable="true" :aspectRatio="true" :isResizable="false" v-on:dragstop="resize($event, item)" :key="item.id">
                  <div class="custom_node_initial" @mouseenter.stop.prevent>
                    <span>{{ item.text }}</span>
                    <i class="close" @click.stop="handledelNode(item.mac)">x</i>
                  </div>
                </vue-drag-resize>
              </template>
            </div>
          </div>
        </TabPane>
        <TabPane :label="$t('projectOverview')" name="name2">
          <projectmap v-if="tabsMap === 'name2'" ref="projectmap" />
        </TabPane>
      </Tabs>
    </div>

    <Row class="project_list mt" :gutter="10">
      <Col span="8">
        <div class="df content proj-boxes overflows">
          <div class="bx-left">
            <div class="bx lb">
              <i><img src="../../../assets/svg/icon-v5-shebeixinxi.svg" alt="" /></i>
            </div>
          </div>
          <div class="bx-right">
            <div class="tx" style="width: 33.33%; padding-left: 10px">
              <div class="tl" style="width: 100%" @click="changeUrl('/deviceList', '')">
                <span class="value">{{ option.totalMac }}</span>
                <div v-textRoll>{{ $t('totalDevice') }}</div>
              </div>
            </div>
            <div class="tx" style="width: 33.33%; padding-left: 10px">
              <div class="tl" style="width: 100%" @click="changeUrl('/deviceList', '1')">
                <span style="color: #21f27f" class="value">{{ option.totalOnlineMac }}</span>
                <div v-textRoll>{{ $t('numOfOnlineDevice') }}</div>
              </div>
            </div>
            <div class="tx" style="width: 33.33%; padding-left: 10px">
              <div class="tl" style="width: 100%" @click="changeUrl('/deviceList', ['-1', '0'])">
                <span style="color: #999" class="value">{{ option.totalOfflineMac }}</span>
                <div v-textRoll>{{ $t('numOfOfflineDevice') }}</div>
              </div>
            </div>
          </div>
        </div>
      </Col>
      <Col span="8">
        <div class="df content proj-boxes overflows">
          <div class="bx-left">
            <div class="bx la">
              <i><img src="../../../assets/svg/icon-v5-xianlu1.svg" alt="" /></i>
            </div>
          </div>
          <div class="bx-right">
            <div class="tx" style="width: 33.33%; padding-left: 10px">
              <div class="tl" style="width: 100%">
                <span class="value">{{ option.totalLine }}</span>
                <div v-textRoll>{{ $t('totalNumberOfLines') }}</div>
              </div>
            </div>
            <div class="tx" style="width: 33.33%; padding-left: 10px">
              <div class="tl" style="width: 100%">
                <span style="color: #21f27f" class="value">{{ option.totalOnlineLine }}</span>
                <div v-textRoll>{{ $t('numberOfOnlineLines') }}</div>
              </div>
            </div>
            <div class="tx" style="width: 33.33%; padding-left: 10px">
              <div class="tl" style="width: 100%">
                <span style="color: #999" class="value">{{ option.totalOfflineLine }}</span>
                <div v-textRoll>{{ $t('numberOfOfflineLines') }}</div>
              </div>
            </div>
          </div>
        </div>
      </Col>

      <Col span="4">
        <div class="df content proj-boxes overflows">
          <div class="bx-left">
            <div class="bx lr">
              <i><img src="../../../assets/svg/icon-v5-baojingjingbaoyujing.svg" alt="" /></i>
            </div>
          </div>
          <div class="bx-right">
            <div class="tx" style="width: 100%">
              <div class="tl" style="width: 100%" @click="changeUrl('/Alarm', '-100')">
                <span class="value">{{ option.totalAlarmThisMonth }}</span>
                <div v-textRoll>{{ $t('totalAlarms') }}</div>
              </div>
            </div>
          </div>
        </div>
      </Col>
      <Col span="4">
        <div class="df content proj-boxes overflows">
          <div class="bx-left">
            <div class="bx ly">
              <i><img src="../../../assets/svg/icon-v5-guzhang.svg" alt="" /></i>
            </div>
          </div>
          <div class="bx-right">
            <div class="tx" style="width: 100%">
              <div class="tl" style="width: 100%" @click="changeUrl('/Alarm', '-200')">
                <span class="value">{{ option.totalWarnThisMonth }}</span>
                <div v-textRoll>{{ $t('totalWarnings') }}</div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>

    <Row class="project_list mt" :gutter="10">
      <Col span="4">
        <div class="df content proj-boxes overflows">
          <div class="bx-left">
            <div class="bx lrs">
              <i><img src="../../../assets/svg/icon-v5-notice.svg" alt="" /></i>
            </div>
          </div>
          <div class="bx-right">
            <div class="tx" style="width: 100%">
              <div class="tl" style="width: 100%" @click="$router.push('/safetyMonitor/allWarn')">
                <span class="value">{{ option.totalAlarmBoxToday }}</span>
                <div v-textRoll>{{ $t('alarmDevicesToday') }}</div>
              </div>
            </div>
          </div>
        </div>
      </Col>

      <Col span="7">
        <div class="df content proj-boxes overflows">
          <div class="bx-left">
            <div class="bx lr">
              <i><img src="../../../assets/svg/icon-v5-baojingjingbaoyujing.svg" alt="" /></i>
            </div>
          </div>
          <div class="bx-right">
            <div class="tx" style="width: 50%; padding-left: 10px">
              <div class="tl" style="width: 100%" @click="changeUrls('1', [''])">
                <span class="value">{{ option.totalAlarmToday }}</span>
                <div v-textRoll>{{ $t('totalAlarmsToday') }}</div>
              </div>
            </div>
            <div class="tx" style="width: 50%; padding-left: 10px">
              <div class="tl" style="width: 100%" @click="changeUrls('-1', [''])">
                <span class="value">{{ option.totalAlarmYesterday }}</span>
                <div v-textRoll>{{ $t('totalAlarmsYesterday') }}</div>
              </div>
            </div>
          </div>
        </div>
      </Col>

      <Col span="7">
        <div class="df content proj-boxes overflows">
          <div class="bx-left">
            <div class="bx lg">
              <i><img src="../../../assets/svg/icon-v5-yichuli.svg" alt="" /></i>
            </div>
          </div>
          <div class="bx-right">
            <div class="tx flex-1" style="width: calc(100% - 66px)">
              <div class="tl" style="width: 100%" @click="changeUrls('2', ['2'])">
                <span class="value">{{ option.totalAlarmProcessedThisMonth }}</span>
                <div v-textRoll>{{ $t('processedAlarmsMonth') }}</div>
              </div>
            </div>
            <div class="tx flex-1">
              <Circle :percent="Process" :size="60" trail-color="#eaeef2">
                <span class="demo-Circle-inner" style="font-size: 14px">{{ Process + '%' }}</span>
              </Circle>
            </div>
          </div>
        </div>
      </Col>
      <Col span="6">
        <div class="df content proj-boxes overflows">
          <div class="bx-left">
            <div class="bx lrs">
              <i><img src="../../../assets/svg/icon-v5-weichuli.svg" alt="" /></i>
            </div>
          </div>
          <div style="display: flex; width: calc(100% - 66px)">
            <div class="tx flex" style="width: calc(100% - 66px)">
              <div class="tl" style="width: 100%" @click="changeUrls('2', ['0', '1'])">
                <span class="value">{{ option.totalAlarmNoProcessThisMonth }}</span>
                <div v-textRoll>{{ $t('processedNotAlarmsMonth') }}</div>
              </div>
            </div>
            <div class="tx flex" style="width: 66px">
              <Circle :percent="NoProcess" :size="60" stroke-color="#ff5500">
                <span class="demo-Circle-inner" style="font-size: 14px">{{ NoProcess + '%' }}</span>
              </Circle>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <div class="project_table pd mt16 content">
      <div class="project_map" style="padding: 0">
        <div class="line"></div>
        <div class="title">{{ $t('alarmList') }}</div>
      </div>
      <Tabs value="name1" @on-click="handletabCount" v-model="active">
        <TabPane v-for="item in tabsList" :key="item.equipClassify" :label="item.desc" :name="item.equipClassify">
          <Table height="300" :columns="shortcolumns" :data="shortdata" :key="Math.random()">
            <template slot-scope="{ row }" slot="valueDescribe">
              <span class="c-danger">{{ row.valueDescribe && row.valueDescribe.value }}</span>
              /
              <span class="c-primary">{{ row.valueDescribe.threshold }}</span>
            </template>
            <template slot-scope="{ row }" slot="progress">
              <Progress :percent="row.progress" hide-info />
            </template>
            <template slot-scope="{ row }" slot="stage">
              <!-- 0未处理 1处理中 2已处理 -->
              <span v-if="row.stage === 0" class="b-danger">{{ $t('notProcessed') }}</span>
              <span v-if="row.stage === 1" class="b-info">{{ $t('processing') }}</span>
              <span v-if="row.stage === 2" class="b-success">{{ $t('processed') }}</span>
            </template>
            <template slot-scope="{ row }" slot="action">
              <span class="pointer" style="margin-right: 5px; color: #f56c6c" @click="handleUrge(row.id)" v-if="row.stage === 0">{{ $t('urge') }}</span>
              <template>
                <span class="pointer" style="color: #007eff" @click="handleMaintenance(row)">{{ $t('handle') }}</span>
              </template>
            </template>
          </Table>
        </TabPane>
      </Tabs>
    </div>
    <div class="project_chart pd mt16 content">
      <div class="project_map" style="padding: 0">
        <div class="line"></div>
        <div class="title">{{ $t('trendRate') }}</div>
      </div>
      <Processing :options="trendOptions"></Processing>
    </div>
    <Row :gutter="10" class="project_list mt16">
      <Col :span="6">
        <div class="content df">
          <Col class="tb">
            <div>{{ $t('year') }}</div>
          </Col>
          <Col flex="auto" class="tx">
            <div class="tl">
              <span class="value">{{ Statistics.curYearPower }}</span>
              <div v-textRoll>{{ $t('electricityYear') }}</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="6">
        <div class="content df">
          <Col class="tb">
            <div>{{ $t('month') }}</div>
          </Col>
          <Col flex="auto" class="tx">
            <div class="tl">
              <span class="value">{{ Statistics.curMonthPower }}</span>
              <div v-textRoll>{{ $t('electricityMonth') }}</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="6">
        <div class="content df">
          <Col class="tb">
            <div>{{ $t('week') }}</div>
          </Col>
          <Col flex="auto" class="tx">
            <div class="tl">
              <span class="value">{{ Statistics.curWeekPower }}</span>
              <div v-textRoll>{{ $t('electricityWeek') }}</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="6">
        <div class="content df">
          <Col class="tb">
            <div>{{ $t('day') }}</div>
          </Col>
          <Col flex="auto" class="tx">
            <div class="tl">
              <span class="value">{{ Statistics.yesterdayPower }}</span>
              <div v-textRoll>{{ $t('electricityYesterday') }}</div>
            </div>
          </Col>
        </div>
      </Col>
    </Row>
    <Row :gutter="10" class="project_trend mt">
      <Col span="12">
        <div class="pd content">
          <div class="project_map" style="padding: 0">
            <div class="line"></div>
            <div class="title">{{ $t('loadPowerTd') }}</div>
          </div>
          <line-area-chart :options="HoursOptions"></line-area-chart>
        </div>
      </Col>
      <Col span="12">
        <div class="pd content">
          <div class="project_map" style="padding: 0">
            <div class="line"></div>
            <div class="title">{{ $t('loadPowerTw') }}</div>
          </div>
          <line-area-chart :options="WeekOptions"></line-area-chart>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="24" class="mt">
        <div class="pd content">
          <div class="project_map" style="padding: 0">
            <div class="line"></div>
            <div class="title">{{ $t('loadPowerTy') }}</div>
          </div>
          <line-area-chart :options="YearsOptions"></line-area-chart>
        </div>
      </Col>
    </Row>
    <div class="df content" style="margin-top: 10px; padding: 10px" v-if="targetBillingType">
      <div class="project_map mb" style="padding: 0; margin-left: 10px">
        <div class="line"></div>
        <div class="title" style="">{{ $t('billingOverview') }}</div>
        <div v-if="targetBillingType === 1" style="margin-left: 85%">
          <Button type="text" style="color: #2d8cf0" @click="goToFeePage({}, 1)">{{ $t('viewDetails') }}</Button>
        </div>
      </div>
      <div v-if="targetBillingType === 1">
        <div class="proj-boxes">
          <div class="proj-boxes felx-box">
            <div class="img-style"><img src="../../../assets/images/yueMoney.png" alt="" /></div>
            <div style="flex: 5">
              <div class="mr-10">
                {{ $t('balance') }}
                <span v-if="+balanceMoney < 0" class="pointer" @click="proCallBilling">
                  <u style="color: red">{{ $t('callForPayment') }}</u>
                </span>
              </div>
              <div class="weight-text" :style="+balanceMoney < 0 ? 'color:red' : ''">{{ balanceMoney }}</div>
            </div>
          </div>
          <div class="proj-boxes felx-box">
            <div class="img-style"><img src="../../../assets/images/elecPower.png" alt="" /></div>
            <div style="flex: 5">
              <div class="mr-10">{{ $t('periodPower') }}</div>
              <div class="weight-text">{{ cyclePower }}</div>
            </div>
          </div>
          <div class="proj-boxes felx-box">
            <div class="img-style"><img src="../../../assets/images/elecFee.png" alt="" /></div>
            <div style="flex: 5">
              <div class="mr-10">{{ $t('timeElectricityBill') }}</div>
              <div class="weight-text">{{ cycleFee }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="targetBillingType === 2">
        <Table :columns="infoColuns" :data="deveiceGroupData.list">
          <template slot-scope="{ row }" slot="macNum">
            <div>{{ `${row.targetName1 || ''}(${row.mac || '-'})` }}</div>
          </template>
          <template slot-scope="{ row }" slot="balance">
            <span :style="+row.balance < 0 ? 'color:red' : ''">{{ row.balance }}</span>
          </template>
          <template slot-scope="{ row }" slot="targetName2">
            <span>{{ row.targetName2 ? row.targetName2 + `(${row.mac + '-' + String(row.addrId).padStart(2, '0')})` : '-' }}</span>
          </template>
          <template slot-scope="{ row }" slot="operate">
            <Button type="text" class="text-btn-primary" @click="goToFeePage(row, 2)">{{ $t('billingOverview') }}</Button>
            <Button v-if="+row.balance < 0" class="text-btn-error" type="text" @click="handlepaymentCollection('single', row)">{{ $t('callForPayment') }}</Button>
          </template>
        </Table>
      </div>
      <div v-if="targetBillingType === 3">
        <Table :columns="infoColuns" :data="deveiceGroupData.list">
          <template slot-scope="{ row }" slot="balance">
            <span :style="+row.balance < 0 ? 'color:red' : ''">{{ row.balance }}</span>
          </template>
          <template slot-scope="{ row }" slot="targetName1">
            <span :class="row.targetRemain === 'true' ? '' : 'c-danger'">
              {{ row.targetName2 ? row.targetName2 : '-' }}
              <i v-if="row.targetRemain === 'false'">({{ $t('removed') }})</i>
            </span>
          </template>
          <template slot-scope="{ row }" slot="targetName2">
            <span>{{ row.targetName1 ? row.targetName1 : '-' }}</span>
          </template>
          <template slot-scope="{ row }" slot="operate">
            <Button type="text" class="text-btn-primary" size="small" @click="goToFeePage(row, 3)">{{ $t('billingOverview') }}</Button>
            <Button v-if="+row.balance < 0" class="text-btn-error" size="small" type="text" @click="handlepaymentCollection('single', row)">{{ $t('callForPayment') }}</Button>
          </template>
        </Table>
      </div>
      <Page v-if="[2, 3].includes(targetBillingType)" show-total :current="deveiceGroupData.pageNo" @on-change="changePage" :total="deveiceGroupData.total" show-elevator />
    </div>
    <Row :gutter="10" class="project_list mt16">
      <Col :span="4">
        <div class="pd df content">
          <Col flex="70px">
            <div class="bx lb">
              <img src="../../../assets/svg/icon-v5-yonghu.svg" alt="" />
            </div>
          </Col>
          <Col flex="auto" class="tx">
            <div class="tl">
              <span class="value">{{ StatData.totalUser }}</span>
              <div v-textRoll>{{ $t('totalUser') }}</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="5">
        <div class="pd df content">
          <Col flex="70px">
            <div class="bx lb"><img src="../../../assets/svg/icon-v5-job.svg" alt="" /></div>
          </Col>
          <Col flex="auto" class="tx">
            <div class="tl">
              <span class="value">{{ StatData.totalTask }}</span>
              <div v-textRoll>{{ $t('totalTask') }}</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="5">
        <div class="pd df content">
          <Col flex="70px">
            <div class="bx ly">
              <img src="../../../assets/svg/icon-v5-shalou.svg" alt="" />
            </div>
          </Col>
          <Col flex="auto" class="tx">
            <div class="tl">
              <span class="value">{{ StatData.totalTaskWaitExec }}</span>
              <div v-textRoll>{{ $t('totalTaskWaitExec') }}</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="5">
        <div class="pd df content">
          <Col flex="70px">
            <div class="bx lb">
              <img src="../../../assets/svg/icon-v5-xunjian.svg" alt="" />
            </div>
          </Col>
          <Col flex="auto" class="tx">
            <div class="tl">
              <span class="value">{{ StatData.totalInspection }}</span>
              <div v-textRoll>{{ $t('totalInspection') }}</div>
            </div>
          </Col>
        </div>
      </Col>
      <Col :span="5">
        <div class="pd df content">
          <Col flex="70px">
            <div class="bx lb">
              <img src="../../../assets/svg/icon-v5-routine.svg" alt="" />
            </div>
          </Col>
          <Col flex="auto" class="tx">
            <div class="tl">
              <span class="value">{{ StatData.totalMaintenance }}</span>
              <div v-textRoll>{{ $t('totalMaintenance') }}</div>
            </div>
          </Col>
        </div>
      </Col>
    </Row>
    <div class="project_table pd mt content">
      <div class="project_map mb" style="padding: 0">
        <div class="line"></div>
        <div class="title">{{ $t('controlTaskList') }}</div>
      </div>
      <Table height="300" :data="taskData" :columns="taskcolumns">
        <template slot-scope="{ row }" slot="totalMac">
          <span class="pointer c-primary" @click="handleMac(row)">
            {{ row.totalMac }}
          </span>
        </template>
        <template slot-scope="{ row }" slot="actionTypeName">
          <!-- 1合闸 2分闸 -->
          <template v-if="row.actionType === 1">
            <span class="c-danger c-d">{{ row.action }}</span>
          </template>
          <template v-if="row.actionType === 0">
            <span class="c-success c-s">{{ row.action }}</span>
          </template>
        </template>

        <template slot-scope="{ row }" slot="statusValue">
          <!-- 0无效 1有效 -->
          <span v-if="row.statusValue === 0" class="c-danger c-d">{{ $t('invalid') }}</span>
          <span v-if="row.statusValue === 1" class="c-success c-s">{{ $t('valid') }}</span>
        </template>
      </Table>
    </div>
    <div class="project_chart pd mt content">
      <div class="project_map" style="padding: 0">
        <div class="line"></div>
        <div class="title">{{ $t('maintenanceTrend') }}</div>
      </div>
      <line-area-chart :options="MainOptions"></line-area-chart>
    </div>

    <Modal :title="$t('addShortcut')" v-model="modal" class-name="mt" :mask="false" width="320" @on-ok="ok" @on-cancel="cancel">
      <Tree :data="AddEditData" show-checkbox class="treePut"></Tree>
    </Modal>
    <Modal :title="$t('numberControlDevices')" v-model="macDialog">
      <Table :data="macData" :columns="macColumns"></Table>
      <div slot="footer">
        <Button type="primary" @click="macDialog = false">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <!-- 维保编辑 -->
    <Modal v-model="dialogVisible" :title="$t('editMaintenance')" @on-cancel="closeMaintenance" id="modal">
      <maintenance-editor v-if="dialogVisible" :maintenanceObj="maintenanceObj" @close-maintenance="closeMaintenance" />
      <div slot="footer"></div>
    </Modal>
    <!-- 催缴方式 -->
    <Modal v-model="paymentCollection" :title="$t('callForPayment')" class-name="tripping" width="500">
      <Form>
        <FormItem :label="`${$t('reminders')}:`">
          <CheckboxGroup v-model="billingCallType">
            <Checkbox label="3">{{ $t('systemNotification') }}</Checkbox>
            <Checkbox label="0">{{ $t('phone') }}</Checkbox>
            <Checkbox label="1">{{ $t('sms') }}</Checkbox>
            <Checkbox label="2">{{ $t('email') }}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="saveCallType">{{ $t('confirm') }}</Button>
        <Button type="default" @click="paymentCollection = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import store from '@/store/index'
  import projectmap from './projectMap.vue'
  import projectmap2 from './projectMap2.vue'
  import LineAreaChart from '../../Common/LineArea.vue'
  import Processing from '../../Common/processing.vue'
  import MaintenanceEditor from '../../safetyMonitor/allWarn/MaintenanceEditor.vue'
  import preventBack from 'vue-prevent-browser-back'
  import VueDragResize from 'vue-drag-resize'
  import {
    getSaveFastMenus, // 保存
    getQueryFastMenus, // 获取
    getfindMaintenance,
    alarmUrgePush,
    getEquipClassifys,
    getByEquipClassify,
    indexStatData,
    getMaintenanceTrand,
    getTrendAndProcessRate,
    getStatistics,
    getLoadHour,
    getLoadDay,
    getLoadYears,
    getTaskColStatData,
    getControlTaskList,
  } from '@/api/console/project'
  import { getConfigInfo, getMapData, batchCall, setMapData, accountBalanceList, getPowerCycle } from '@/api/public'
  import { timeSeason, timeMonths } from './timeCycle'
  import { retry } from '@utils/common'
  export default {
    name: 'console-project',
    components: {
      projectmap2,
      projectmap,
      LineAreaChart,
      Processing,
      MaintenanceEditor,
      VueDragResize,
    },
    mixins: [preventBack],
    data() {
      return {
        billingRow: {},
        cycleFee: '',
        billingCallType: [''],
        paymentCollection: false,
        deveiceGroupData: { list: [], total: 0, pageNo: 1, pageSize: 10 },
        cyclePower: '',
        balanceMoney: '',
        targetBillingType: '1',
        list: [],
        canvasNodes: {},
        imaData: '',
        shortdata: [],
        single: 0,
        isActive: 0,
        shortcolumns: [
          {
            type: 'index',
            title: this.$t('index'),
            width: 80,
            align: 'left',
          },
          {
            title: this.$t('eventId'),
            key: 'id',
            width: 100,
            align: 'left',
          },
          {
            title: this.$t('deviceAliases'),
            key: 'macName',
            width: 200,
            align: 'left',
          },
          {
            title: this.$t('equipmentNo'),
            key: 'mac',
            width: 200,
            align: 'left',
          },
          {
            title: this.$t('line'),
            key: 'channelTitle',
            align: 'left',
            width: 80,
          },
          {
            title: this.$t('alarmOrwarningType'),
            key: 'info',
            align: 'left',
            width: 200,
          },
          {
            title: this.$t('alarmOrWarningValue'),
            slot: 'valueDescribe',
            align: 'left',
            width: 300,
          },
          {
            title: this.$t('progress'),
            slot: 'progress',
            align: 'left',
          },
          {
            title: this.$t('spentTime'),
            key: 'passTime',
            align: 'left',
            width: 80,
          },
          {
            title: this.$t('state'),
            slot: 'stage',
            align: 'left',
            minWidth: 200,
          },
          {
            title: this.$t('alarmOrWarningData'),
            key: 'time',
            align: 'left',
            width: 200,
          },
          {
            title: this.$t('action'),
            slot: 'action',
            width: 150,
            align: 'left',
          },
        ],
        editText: this.$t('edit'),
        edit: false,
        AddEdit: false,
        Querylist: '',
        tabsList: [],
        active: '',
        option: {},
        addProcessed: '',
        newRatio: [],
        NoProcess: 0,
        Process: 0,
        trendOptions: {
          title: {
            show: false,
          },
          xAxis: [],
          series: [],
          yAxis: [],
        },
        alarm: [],
        time: [],
        processedRatio: [],
        Statistics: '',
        HoursOptions: {
          title: {
            show: false,
          },
          xAxis: [],
          series: [],
          yAxis: [],
        },
        afterPower: [],
        prePower: [],
        hourstime: [],
        WeekOptions: {
          title: {
            show: false,
          },
          xAxis: [],
          series: [],
          yAxis: [],
        },

        value: '',
        wafterPower: [],
        wprePower: [],
        weekstime: [],
        YearsOptions: {
          title: {
            show: false,
          },
          xAxis: [],
          series: [],
          yAxis: [],
        },
        yafterPower: [],
        yprePower: [],
        yeekstime: [],
        StatData: '',
        taskData: [],
        taskcolumns: [
          { title: this.$t('index'), type: 'index', width: 80, align: 'left' },
          { title: this.$t('taskName'), key: 'taskName', align: 'left' },
          { title: this.$t('taskType'), key: 'taskTypeDesc', align: 'left' },
          { title: this.$t('numberControlDevices'), slot: 'totalMac', align: 'left' },
          { title: this.$t('action'), slot: 'actionTypeName', align: 'left' },
          { title: this.$t('state'), slot: 'statusValue', align: 'left' },
          { title: this.$t('nextExecutionTime'), key: 'nextExecTime', align: 'left' },
        ],
        MainOptions: { title: { show: false }, xAxis: [], series: [], yAxis: [] },
        mainNumber: [],
        mainTime: [],
        modal: false,
        accountId: '',
        AddEditData: [],
        dataArr: [],
        flag: false,
        flags: false,
        dialogVisible: false,
        macDialog: false,
        macData: [],
        macColumns: [
          { title: this.$t('eventId'), key: 'mac', align: 'center' },
          { title: this.$t('deviceAliases'), key: 'name', align: 'center' },
        ],
        arr: [],
        isHover: false,
        canvasWidth: '',
        animation: { x: 100, y: 100, scale: 1, duration: 0 },
        tabsMap: 'name1',
        // mapElem: document.getElementsByClassName('map')[0],
      }
    },
    created() {},
    computed: {
      infoColuns() {
        const cloluns = [
          { slot: 'balance', title: this.$t('balance') },
          { key: 'cyclePower', title: this.$t('periodPower') },
          { key: 'cycleFee', title: this.$t('timeElectricityBill') },
          { slot: 'operate', title: this.$t('operation'), with: 160, fixed: 'right', align: 'center' },
        ]
        if (this.targetBillingType === 2) {
          return [
            { slot: 'macNum', title: this.$t('device') },
            { slot: 'targetName2', title: this.$t('line') },
          ].concat(cloluns)
        } else if (this.targetBillingType === 3) {
          return [
            { slot: 'targetName1', title: this.$t('groupType') },
            { slot: 'targetName2', title: this.$t('groupName') },
          ].concat(cloluns)
        } else {
          return []
        }
      },
      currentPeriodCpt() {
        let currntTim = new Date().getMonth()
        if (this.billingCycle === 1) {
          const arrList = timeMonths()

          return arrList
            .filter(v => v.value === currntTim)
            .map(item => item.startTime)
            .join(',')
        } else if (this.billingCycle === 2) {
          const seasonList = timeSeason()
          return seasonList
            .filter(v => v.value.includes(currntTim))
            .map(j => j.startTime + '~' + j.endTime)
            .join(',')
        } else if (this.billingCycle === 3) {
          return new Date().getFullYear() + '-01-01~' + new Date().getFullYear() + '-12-31'
        } else {
          return ''
        }
      },
      projectCode() {
        return this.$store.state.projectCode
      },
    },
    mounted() {
      this.handletabCount('AIR_SWITCH')
      this.handlegetConfigInfo()
      this.handlegetNode()
      // 接口请求太多，接口返回后触发vue组件更新，会阻塞百度地图后续执行，暂时先对其他请求做岩石处理
      this.setTimer = setTimeout(() => {
        this.init()
      }, 2000)
      // this.mousewheelevt = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel'
      this.symbolImg = 'image://' + require('@/assets/images/max.png')
      this.symbolImg2 = 'image://' + require('@/assets/images/min.png')
      this.$refs.maskBoxs.addEventListener('wheel', this.onwheel)
    },
    beforeDestroy() {
      // 取消监听
      this.setTimer && clearTimeout(this.setTimer)
      this.$refs.maskBoxs.removeEventListener('wheel', this.onwheel)
    },
    methods: {
      changePage(e) {
        this.deveiceGroupData.pageNo = e
        this.getBillTableList(this.targetBillingType)
      },
      init() {
        getQueryFastMenus({ projectCode: this.projectCode }).then(res => {
          this.dataArr = res.data
          this.treeDate()
        })
        this.EquipClass()
        retry(this.getStatData, 3, 2000)
        this.queryAlarmTrend()
        this.queryGetStatistics()
        this.queryGetLoadHour()
        this.queryGetLoadWeek()
        this.queryGetLoadYears()
        this.handleStatData()
        this.queryTaskData()
        this.queryMaintenanceTrand()
        this.getBillingList()
      },
      getBillingList() {
        getPowerCycle({ projectCode: this.projectCode, isCurr: true }).then(res => {
          if (res.success) {
            if (res.data.billingTarget) {
              this.targetBillingType = res.data.billingTarget
              this.billingCycle = res.data.billingCycle
              this.getBillTableList(this.targetBillingType)
            } else {
              this.targetBillingType = null
            }
          } else {
            this.targetBillingType = null
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      goToFeePage(row, type) {
        this.$router.push({
          name: 'billingSystem-electric-charging',
          params: {
            isFee: true,
            targetValue: row.targetValue,
            mac: type === 2 ? row.mac : '',
            line: type === 2 ? row.addrId : '',
            name: type === 3 ? row.targetName2 : '',
            nodeId: type === 3 ? row.targetValue : '',
          },
        })
      },
      handlepaymentCollection(type, row) {
        if (type === 'single') {
          this.paymentCollection = true
        }
        this.billingRow = row
      },
      saveCallType() {
        if (!this.billingCallType.join(',')) {
          return this.$Message.error({
            content: this.$t('selectReminder'),
          })
        }
        let accountIdList
        if (this.accountId) {
          accountIdList = this.accountId
        } else {
          accountIdList = this.billingRow.accountId
        }
        let parmas = {
          projectCode: this.projectCode,
          accountIdList,
          noticeTypeList: this.billingCallType.filter(v => v).join(',') || '',
        }
        this.getBatchCall(parmas)
      },
      proCallBilling() {
        this.paymentCollection = true
      },
      getBatchCall(parmas) {
        batchCall(parmas).then(res => {
          if (res.success) {
            this.paymentCollection = false
            this.$Message.success({
              content: this.$t('callSuccess'),
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      async getBillTableList(val) {
        let param = {
          projectCode: this.projectCode,
          period: this.currentPeriodCpt,
          billingTarget: val,
          pageSize: this.deveiceGroupData.pageSize,
          pageNo: this.deveiceGroupData.pageNo,
        }
        const res = await accountBalanceList(param)
        if (res.success && res.data) {
          if (val !== 1) {
            this.accountId = ''
            this.deveiceGroupData.list = res.data.datas
            this.deveiceGroupData.total = res.data.total
          } else if (val === 1) {
            this.balanceMoney = res.data.datas[0].balance
            this.cyclePower = res.data.datas[0].cyclePower
            this.cycleFee = res.data.datas[0].cycleFee
            this.accountId = res.data.datas[0].accountId
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      // 图区代码
      // 允许放下拖拽
      allowDrop(ev) {
        ev.preventDefault()
      },
      // 拖拽
      drag(ev, id) {
        this.id = id
        this.dom = ev.currentTarget.cloneNode(true)
      },
      // 放下事件
      drop(ev) {
        ev.preventDefault()
        this.list.push({
          mac: this.dom.id,
          text: this.dom.innerText,
          offsetX: 150,
          offsetY: 150,
        })
        let item = {
          mac: this.dom.id,
          offsetX: 150,
          offsetY: 150,
        }
        this.handlesetNode(item)
        setTimeout(() => {
          this.handlegetNode()
        }, 500)
      },
      handlegetConfigInfo() {
        let params = {
          projectCode: this.projectCode,
        }
        getConfigInfo(params).then(res => {
          if (res.success) {
            this.infoImage = res.data.imgUrl
            this.value = {
              background: `url(${res.data.imgUrl})`,
            }
            this.single = res.data.status
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      // 拖拽时事件
      resize(newRect, item) {
        this.newRect = newRect
        if (this.time !== null) {
          clearTimeout(this.time)
        }

        this.time = setTimeout(() => {
          if (!this.rectState) {
            this.handlesetNode(item)
          }
        }, 500)
        this.list.forEach(val => {
          if (item.mac === val.mac) {
            val.offsetX = newRect.left
            val.offsetY = newRect.top
          }
        })
      },
      // 上传拖拽时节点坐标
      handlesetNode(item) {
        let params = {
          projectCode: this.projectCode,
          macs: item.mac,
          offsetX: item.offsetX,
          offsetY: item.offsetY,
        }
        setMapData(params).then(res => {})
      },
      setStyle(elem, obj) {
        this.value = obj
      },
      handlegetNode() {
        let params = {
          projectCode: this.projectCode,
        }
        getMapData(params).then(res => {
          this.list = []
          res.data.map(val => {
            this.list.push({
              mac: val.mac,
              text: val.name,
              offsetX: val.offsetX,
              offsetY: val.offsetY,
            })
          })
        })
      },
      // 获取元素相对于目标元素的 offsetTop offsetLeft
      getElementTopLeft(elem, target) {
        if (elem === target) {
          return {
            top: 0,
            left: 0,
          }
        }

        target || (target = null)
        let elemTop = elem.offsetTop
        let elemLeft = elem.offsetLeft

        elem = elem.offsetParent
        if (elem !== target) {
          elemTop += elem.offsetTop
          elemLeft += elem.offsetLeft

          elem = elem.offsetParent
        }

        return {
          top: elemTop,
          left: elemLeft,
        }
      },

      setMapStyle(obj) {
        let x = obj.x
        let y = obj.y
        let scale = obj.scale
        let duration = obj.duration

        this.setStyle(this.$refs.maskBoxs, {
          'transform-origin': '0px 0px',
          transition: `all ${duration / 1000}s ease-out 0s`,
          transform: `translate3d(${x}px, ${y}px, 0px) scale3d(${scale}, ${scale}, 1)`,
          background: `url(${this.infoImage})`,
        })
      },

      // 鼠标按钮被按下
      onmousedown(event) {
        // 0 为鼠标左键
        if (event.button === 0) {
          this.flags = true

          // clientX 鼠标指针相对于浏览器页面左边的水平坐标
          this.moveDistance = {
            x: event.clientX - this.animation.x,
            y: event.clientY - this.animation.y,
          }
        }
      },

      // 鼠标按键被松开
      onmouseup(event) {
        // 0 为鼠标左键
        if (event.button === 0) {
          this.flags = false
        }
      },

      // 鼠标被移动
      onmousemove(event) {
        if (this.flags) {
          let left = event.clientX - this.moveDistance.x
          let top = event.clientY - this.moveDistance.y

          this.animation = {
            x: left,
            y: top,
            scale: this.animation.scale,
            duration: 0,
          }

          this.setMapStyle(this.animation)
        }
      },

      // 鼠标移出
      onmouseout(event) {
        if (event.path) {
          let mapIndex = event.path.findIndex(f => f === this.$refs.maskBoxs)
          let targetIndex = event.path.findIndex(f => f === event.relatedTarget)
          if (targetIndex > mapIndex) {
            this.flags = false
          }
        }
      },

      // 鼠标滚轮
      onwheel(event) {
        let oldScale = this.animation.scale
        let scale = this.animation.scale

        if (event.wheelDelta > 0) {
          // 上滑放大
          let maxScale = 3
          if (scale === maxScale) return
          scale = (scale + 0.1).toFixed(1) * 1
          if (scale >= maxScale) scale = maxScale
        } else {
          // 下滑缩小
          let minScale = 0.1
          if (scale === 1) return
          scale = (scale - 0.1).toFixed(1) * 1
          if (scale <= minScale) scale = minScale
        }
        let ret = this.getElementTopLeft(event.target, this.$refs.maskBoxs)
        let left = this.animation.x + (event.offsetX + ret.left + 4) * (oldScale - scale)
        let top = this.animation.y + (event.offsetY + ret.top + 4) * (oldScale - scale)

        this.animation = {
          x: left,
          y: top,
          scale: scale,
          duration: 300,
        }

        this.setMapStyle(this.animation)
      },
      handleMac(item) {
        this.macDialog = true
        this.macData = item.macInfos
      },
      change(index) {
        this.isActive = index // 重要处

        if (index === 1) {
          this.handlegetNode()

          this.$refs.maskBoxs.addEventListener(this.mousewheelevt, this.onwheel)
        }
      },
      treeDate() {
        this.AddEditData = [
          {
            title: this.$t('projectHomepage'),
            checked: false,
            children: [
              {
                title: this.$t('deviceOverview'),
                checked: false,
                value: '/console/device',
                icon: 'icon-v5-shebeigaikuang1',
                nodeKey: 1,
                findIndexs: [0, 0],
              },
              {
                title: this.$t('topology'),
                value: '/console/topology',
                checked: false,
                icon: 'icon-v5-tuoputu1',
                nodeKey: 2,
                findIndexs: [0, 1],
              },
            ],
            nodeKey: 0,
          },
          {
            title: this.$t('safetyMonitor'),
            checked: false,
            children: [
              {
                title: this.$t('monitoringReport'),
                checked: false,
                value: '/safetyMonitor/monitoringReport',
                icon: 'icon-v5-menu_lrtx',
                nodeKey: 34,
                indeterminate: false,
              },
              {
                title: this.$t('allAlarm'),
                checked: false,
                value: '/safetyMonitor/allWarn',
                icon: 'icon-v5-quanbubaojing1',
                nodeKey: 4,
                indeterminate: false,
              },
              {
                title: this.$t('leakage'),
                checked: false,
                value: '/safetyMonitor/leakage',
                icon: 'icon-v5-loudianliu1',
                nodeKey: 5,
                indeterminate: false,
              },
              {
                title: this.$t('temperature'),
                checked: false,
                value: '/safetyMonitor/temperature',
                icon: 'icon-v5-wendu2',
                nodeKey: 6,
                indeterminate: false,
              },
              {
                title: this.$t('leakageAlarm'),
                checked: false,
                value: '/safetyMonitor/leakageWarm',
                icon: 'icon-v5-loudianbaojing1',
                nodeKey: 7,
                indeterminate: false,
              },
              {
                title: this.$t('temperatureAlarm'),
                checked: false,
                value: '/safetyMonitor/temperatureWarn',
                icon: 'icon-v5-wendubaojing1',
                nodeKey: 8,
                indeterminate: false,
              },
              {
                title: this.$t('electricityTheftAlarm'),
                checked: false,
                value: '/safetyMonitor/stealingElectricity',
                icon: 'icon-v5-qiedian',
                nodeKey: 35,
                indeterminate: false,
              },
              {
                title: this.$t('leakageSelfCheck'),
                checked: false,
                value: '/safetyMonitor/leakageSelfChecking',
                icon: 'icon-v5-loubaozijian1',
                nodeKey: 9,
                indeterminate: false,
              },
              {
                title: this.$t('shortCircuitAlarm'),
                checked: false,
                value: '/safetyMonitor/shortCircuitWarn',
                icon: 'icon-v5-duanlubaojing1',
                nodeKey: 10,
                indeterminate: false,
              },
              {
                title: this.$t('overUnderVoltage'),
                checked: false,
                value: '/safetyMonitor/abnormalVoltage',
                icon: 'icon-v5-guoqianya1',
                nodeKey: 11,
                indeterminate: false,
              },
              {
                title: this.$t('overCurrentOverload'),
                checked: false,
                value: '/safetyMonitor/abnormalCurrent',
                icon: 'icon-v5-guoliuguozai1',
                nodeKey: 12,
                indeterminate: false,
              },
              {
                title: this.$t('arcAlarm'),
                checked: false,
                value: '/safetyMonitor/SparkWarn',
                icon: 'icon-v5-dianhubaojing1',
                nodeKey: 13,
                indeterminate: false,
              },
              {
                title: this.$t('threePhaseAlarm'),
                checked: false,
                value: '/safetyMonitor/phaseWarn',
                icon: 'icon-v5-sanxiangbaojing1',
                nodeKey: 14,
                indeterminate: false,
              },
              {
                title: this.$t('abnormalState'),
                checked: false,
                value: '/safetyMonitor/abnormalState',
                icon: 'icon-v5-yichangzhuangtai1',
                nodeKey: 15,
                indeterminate: false,
              },
              {
                title: this.$t('ocWarn'),
                checked: false,
                value: '/safetyMonitor/ocWarn',
                icon: 'icon-v5-fenhezha',
                nodeKey: 16,
                indeterminate: false,
              },
            ],
            nodeKey: 3,
            selected: true,
            expand: false,
            indeterminate: false,
          },
          {
            title: this.$t('energyMonitor'),
            checked: false,
            children: [
              {
                checked: false,
                title: this.$t('electricQuantity'),
                value: '/energyMonitor/power',
                icon: 'icon-v5-dianliang1',
                nodeKey: 18,
                indeterminate: false,
                findIndexs: [2, 0],
              },
              {
                checked: false,
                title: this.$t('load'),
                value: '/energyMonitor/load',
                icon: 'icon-v5-fuzai1',
                nodeKey: 19,
                indeterminate: false,
                findIndexs: [2, 1],
              },
              {
                checked: false,
                title: this.$t('electricityBillStatistics'),
                value: '/billingSystem/electric-period',
                icon: 'icon-v5-fenshiduandianliang1',
                nodeKey: 32,
                indeterminate: false,
                findIndexs: [2, 2],
              },
              {
                checked: false,
                title: this.$t('electricityStatistics'),
                value: '/energyMonitor/report',
                icon: 'icon-v5-dianliangbaobiao',
                nodeKey: 33,
                indeterminate: false,
                findIndexs: [2, 3],
              },
              {
                checked: false,
                title: this.$t('unitPriceConfig'),
                value: '/billingSystem/electric-price',
                icon: 'icon-v5-dianjiapeizhi',
                nodeKey: 34,
                indeterminate: false,
                findIndexs: [2, 4],
              },
            ],
            nodeKey: 17,
            expand: true,
            indeterminate: false,
          },
          {
            title: this.$t('multiManage'),
            checked: false,
            children: [
              {
                title: this.$t('smartThresholdConfig'),
                checked: false,
                value: '/multiManage/threShold',
                icon: 'icon-v5-yuzhizhinengpeizhi',
                nodeKey: 21,
                indeterminate: false,
              },
              {
                title: this.$t('sceneControl'),
                checked: false,
                value: '/multiManage/sceneControl',
                icon: 'icon-v5-changjingkongzhi',
                nodeKey: 21,
                indeterminate: false,
              },
              {
                title: this.$t('builtInTimerConfig'),
                checked: false,
                value: '/multiManage/builtInTimer',
                icon: 'icon-v5-dingshipeizhi1',
                nodeKey: 22,
                indeterminate: false,
              },
              {
                title: this.$t('lnglatTimerConfig'),
                checked: false,
                value: '/multiManage/latlongTimer',
                icon: 'icon-v5-jingweidingshi1',
                nodeKey: 23,
                indeterminate: false,
              },
              {
                title: this.$t('batchConfig'),
                checked: false,
                value: '/multiManage/batchConfig',
                icon: 'icon-v5-piliangpeizhi1',
                nodeKey: 24,
                indeterminate: false,
              },
              {
                title: this.$t('contrlTaskList'),
                checked: false,
                value: '/multiManage/contrlTasks',
                icon: 'icon-v5-kongzhiqingdan',
                nodeKey: 25,
                indeterminate: false,
              },
              {
                title: this.$t('groupManage'),
                checked: false,
                value: '/multiManage/groupConfig',
                icon: 'icon-v5-fenzukongzhi',
                nodeKey: 26,
                indeterminate: false,
              },
              {
                title: this.$t('loadManage'),
                checked: false,
                value: '/multiManage/loadManagement',
                icon: 'icon-v5-fenzukongzhi',
                nodeKey: 35,
                indeterminate: false,
              },
              {
                title: this.$t('deviceListControl'),
                checked: false,
                value: '/multiManage/deviceListControl',
                icon: 'icon-v5-shebeiliebiaoyukongzhi1',
                nodeKey: 27,
                indeterminate: false,
              },
              {
                title: this.$t('abnormalStateConfig'),
                checked: false,
                value: '/multiManage/abnormalStateConfig',
                icon: 'icon-v5-yichangzhuangtaijiancepeizhi1',
                nodeKey: 28,
                indeterminate: false,
              },
              {
                title: this.$t('linkageConfig'),
                checked: false,
                value: '/multiManage/linkageScene',
                icon: 'icon-v5-liandongkongzhi',
                nodeKey: 29,
                indeterminate: false,
              },
              {
                title: this.$t('workOrderManagement'),
                checked: false,
                value: '/multiManage/workOrder',
                icon: 'icon-v5-gongdanguanli1',
                nodeKey: 30,
                indeterminate: false,
              },
              {
                title: this.$t('statisticalReport'),
                checked: false,
                value: '/multiManage/report',
                icon: 'icon-v5-tongjibaogao',
                nodeKey: 31,
                indeterminate: false,
              },
            ],
            nodeKey: 20,
            selected: true,
            expand: false,
            indeterminate: false,
          },
        ]
        if (this.dataArr.length === 0) {
          this.AddEditData.forEach(item => {
            item.checked = false
            item.children.forEach(items => {
              items.checked = false
            })
          })
        } else {
          this.dataArr.forEach(item1 => {
            this.AddEditData.forEach(item2 => {
              item2.checked = false
              let arr = item2.children.filter(item3 => {
                // item3.checked = false
                return item1.name === item3.title
              })

              if (arr.length !== 0) {
                arr[0].checked = true
              }
            })
          })
        }
      },
      add() {
        this.modal = true
      },
      deletes(item, index) {
        this.dataArr.splice(index, 1)
        this.treeDate()
      },
      go(item) {
        this.$router.push(item.url)
      },
      ok() {
        let arr = []
        this.AddEditData.forEach(item => {
          this.arr = item.children.filter(items => {
            return items.checked
          })
          this.arr.forEach(items => {
            arr.push(items)
            let flag = this.dataArr.some(itemd => {
              return itemd.title === items.title
            })
            if (!flag) {
              // 添加，没有的就加在后面 那如果是减少怎么办呢， 减了一部分，加了一部分怎么说呢
              this.dataArr.push(items)
            }
            // 先把添加的写了，现在的状态就是添加了新的数组，但是不知道旧的数组有没有删除，所以这一步就应该是删掉。这一步不能写在这个循环里面，因为还没有变成最终的形态
          })
        })

        for (let i = 0; i < 10; i++) {
          this.dataArr.forEach((items, index) => {
            // 判断arr里面没有的，但是dataArr里有的，这些就是被删除的 arr里面有的，dataArr已经全部都有了
            let flag = arr.some(itemd => {
              return itemd.title === items.title
            })

            //
            if (!flag) {
              this.dataArr.splice(index, 1)
            }
          })

          if (this.dataArr.length === arr.length) break // 中断循环
        }
        //  直接对此对象进行修改
        this.dataArr.forEach(item => {
          item.name = item.title
          item.url = item.value
          // delete item.title
          // delete item.value
          // delete item.checked
          // delete item.nodeKey
        })
      },
      retry(handle, times, interval, changeInterval = n => 2 * n) {
        let count = 0
        const run = async () => {
          try {
            await handle()
          } catch (e) {}
          if (count >= times) {
            return
          }
          setTimeout(run, interval)
          interval = changeInterval(interval)
          count++
        }
        run()
      },
      getStatData() {
        let params = {
          projectCodes: this.projectCode,
          hasQueryLineDataAuth: true,
        }
        indexStatData(params).then(res => {
          if (res.success) {
            this.option = res.data

            this.NoProcess = this.toPercent(this.option.totalAlarmNoProcessThisMonth, this.option.totalAlarmThisMonth)
            this.Process = this.toPercent(this.option.totalAlarmProcessedThisMonth, this.option.totalAlarmThisMonth)
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      toPercent(num, total) {
        num = parseFloat(num)
        total = parseFloat(total)
        if (isNaN(num) || isNaN(total)) {
          return '-'
        }
        return total <= 0 ? 0 : Math.round((num / total) * 10000) / 100.0
      },
      EquipClass() {
        let params = {
          projectCode: this.projectCode,
        }
        getEquipClassifys(params).then(res => {
          if (res.success) {
            this.tabsList = res.data
            this.active = res.data.length === 0 ? '' : res.data[0].equipClassify
          } else if (res.code === '-1') {
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handletabCount(data) {
        let params = {
          projectCode: this.projectCode,
          equipClassify: data,
        }
        getByEquipClassify(params).then(res => {
          this.shortdata = res.data
        })
      },
      queryAlarmTrend() {
        let params = {
          projectCode: this.projectCode,
        }
        getTrendAndProcessRate(params).then(res => {
          if (res.success) {
            var alarmTrend = res.data
            let arr = []
            let alarmArr = []
            for (let i in alarmTrend) {
              alarmArr.push(alarmTrend[i].alarm)

              this.time.push(alarmTrend[i].time)
              arr.push(alarmTrend[i].processedRatio)
            }
            const today = this.$Date().format('DD')

            for (let j = 0; j < today; j++) {
              this.processedRatio.push(arr[j])
              this.alarm.push(alarmArr[j])
            }
            this.trendOptions.xAxis = []
            this.trendOptions.series = []
            this.trendOptions.xAxis = this.time
            this.trendOptions.yAxis.name = this.$t('numberOfAlarm') + `(${this.$t('times')})`
            this.trendOptions.yAxis.name2 = this.$t('processRate') + '（%）'
            this.trendOptions.series[0] = {
              name: this.$t('processRate'),
              type: 'line',
              data: this.processedRatio,
              itemStyle: {
                color: '#0fb45c',
              },
              yAxisIndex: 1, // 选用那个坐标轴显示，默认为0
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(15, 180, 92, 0.2)' },
                    { offset: 1, color: 'rgba(15, 180, 92, 0.3)' },
                  ],
                  global: false,
                },
              },
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 4,
              smooth: true,
            }
            this.trendOptions.series[1] = {
              name: this.$t('numberOfAlarm'),
              type: 'line',
              data: this.alarm,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(224, 74, 73, 0.2)' },
                    { offset: 1, color: 'rgba(224, 74, 73, 0.3)' },
                  ],
                  global: false,
                },
              },
              itemStyle: { color: '#ab3f42' },
              showSymbol: true,
              symbol: 'emptyCircle',
              symbolSize: 4,
              smooth: true,
            }

            if (this.$func.isSameArray(this.processedRatio)) {
              this.trendOptions.series[0].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolOverlap,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#007eff',
                    },
                  },
                ],
                normal: {
                  show: true,
                },
              }
            } else {
              this.trendOptions.series[0].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolMax,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#ff4f4f',
                    },
                  },
                  {
                    type: 'min',
                    symbolOffset: [0, -30],
                    symbol: this.$func.echartsSymbolMin,
                    label: {
                      color: '#00ba8a',
                      fontSize: 11,
                      align: 'center',

                      padding: [0, 5, 33, 5],
                    },
                  },
                ],
                label: {
                  normal: {
                    show: true,
                  },
                },
              }
            }
            if (this.$func.isSameArray(this.alarm)) {
              this.trendOptions.series[1].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolOverlap,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#007eff',
                    },
                  },
                ],
                normal: {
                  show: true,
                },
              }
            } else {
              this.trendOptions.series[1].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolMax,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#ff4f4f',
                    },
                  },
                  {
                    type: 'min',
                    symbolOffset: [0, -30],
                    symbol: this.$func.echartsSymbolMin,
                    label: {
                      color: '#00ba8a',
                      fontSize: 11,
                      align: 'center',

                      padding: [0, 5, 33, 5],
                    },
                  },
                ],
                label: {
                  normal: {
                    show: true,
                  },
                },
              }
            }
          } else if (res.code === '-1') {
          } else {
            this.trendOptions.xAxis = []
            this.trendOptions.series = []
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      queryGetStatistics() {
        let params = {
          projectCode: this.projectCode,
        }
        getStatistics(params).then(res => {
          if (res.success) {
            this.Statistics = res.data
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      queryGetLoadHour() {
        let params = {
          projectCode: this.projectCode,
        }
        getLoadHour(params).then(res => {
          if (res.success) {
            var hourList = res.data
            for (let i in hourList) {
              this.afterPower.push(hourList[i].afterPower)
              this.prePower.push(hourList[i].prePower)
              this.hourstime.push(hourList[i].time)
            }
            this.HoursOptions.xAxis = []
            this.HoursOptions.series = []
            this.HoursOptions.xAxis = this.hourstime
            this.HoursOptions.yAxis.name = this.$t('electricQuantity') + '(kW·h)'
            this.HoursOptions.series[0] = {
              name: this.$t('dayBeforeYesterday'),
              type: 'line',
              data: this.prePower,
              itemStyle: {
                color: '#0DD667',
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(13, 214, 103, 0.2)' },
                    { offset: 1, color: 'rgba(13, 214, 103, 0.3)' },
                  ],
                  global: false,
                },
              },
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 4,
              smooth: true,
            }
            this.HoursOptions.series[1] = {
              name: this.$t('yesterday'),
              type: 'line',
              data: this.afterPower,
              itemStyle: {
                color: '#0373e6',
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                    { offset: 1, color: 'rgba(3, 115, 230, 0.3)' },
                  ],
                  global: false,
                },
              },
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 4,
              smooth: true,
            }

            if (this.$func.isSameArray(this.prePower)) {
              this.HoursOptions.series[0].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolOverlap,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#007eff',
                    },
                  },
                ],
                normal: {
                  show: true,
                },
              }
            } else {
              this.HoursOptions.series[0].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolMax,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#ff4f4f',
                    },
                  },
                  {
                    type: 'min',
                    symbolOffset: [0, -30],
                    symbol: this.$func.echartsSymbolMin,
                    label: {
                      color: '#00ba8a',
                      fontSize: 11,
                      align: 'center',

                      padding: [0, 5, 33, 5],
                    },
                  },
                ],
                label: {
                  normal: {
                    show: true,
                  },
                },
              }
            }
            if (this.$func.isSameArray(this.afterPower)) {
              this.HoursOptions.series[1].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolOverlap,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#007eff',
                    },
                  },
                ],
                normal: {
                  show: true,
                },
              }
            } else {
              this.HoursOptions.series[1].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolMax,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#ff4f4f',
                    },
                  },
                  {
                    type: 'min',
                    symbolOffset: [0, -30],
                    symbol: this.$func.echartsSymbolMin,
                    label: {
                      color: '#00ba8a',
                      fontSize: 11,
                      align: 'center',

                      padding: [0, 5, 33, 5],
                    },
                  },
                ],
                label: {
                  normal: {
                    show: true,
                  },
                },
              }
            }
          } else if (res.code === '-1') {
          } else {
            this.HoursOptions.xAxis = []
            this.HoursOptions.series = []
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      queryGetLoadWeek() {
        let params = {
          projectCode: this.projectCode,
        }
        getLoadDay(params).then(res => {
          if (res.success) {
            var weekList = res.data
            for (let i in weekList) {
              this.wafterPower.push(weekList[i].afterPower)
              this.wprePower.push(weekList[i].prePower)
              this.weekstime.push(weekList[i].time)
            }

            this.WeekOptions.xAxis = []
            this.WeekOptions.series = []
            this.WeekOptions.xAxis = this.weekstime
            this.WeekOptions.yAxis.name = this.$t('electricQuantity') + '(kW·h)'
            this.WeekOptions.series[0] = {
              name: this.$t('lastWeek'),
              type: 'line',
              data: this.wprePower,
              itemStyle: { color: '#0DD667' },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(13, 214, 103, 0.2)' },
                    { offset: 1, color: 'rgba(13, 214, 103, 0.3)' },
                  ],
                  global: false,
                },
              },
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 4,
              smooth: true,
            }
            this.WeekOptions.series[1] = {
              name: this.$t('thisWeek'),
              type: 'line',
              data: this.wafterPower,
              itemStyle: { color: '#0373e6' },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                    { offset: 1, color: 'rgba(3, 115, 230, 0.3)' },
                  ],
                  global: false,
                },
              },
              showSymbol: true,
              symbol: 'emptyCircle',
              symbolSize: 4,
              smooth: true,
            }
            if (this.$func.isSameArray(this.wprePower)) {
              this.WeekOptions.series[0].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolOverlap,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#007eff',
                    },
                  },
                ],
                normal: {
                  show: true,
                },
              }
            } else {
              this.WeekOptions.series[0].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolMax,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#ff4f4f',
                    },
                  },
                  {
                    type: 'min',
                    symbolOffset: [0, -30],
                    symbol: this.$func.echartsSymbolMin,
                    label: {
                      color: '#00ba8a',
                      fontSize: 11,
                      align: 'center',

                      padding: [0, 5, 33, 5],
                    },
                  },
                ],
                label: {
                  normal: {
                    show: true,
                  },
                },
              }
            }
            if (this.$func.isSameArray(this.wafterPower)) {
              this.WeekOptions.series[1].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolOverlap,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#007eff',
                    },
                  },
                ],
                normal: {
                  show: true,
                },
              }
            } else {
              this.WeekOptions.series[1].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolMax,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#ff4f4f',
                    },
                  },
                  {
                    type: 'min',
                    symbolOffset: [0, -30],
                    symbol: this.$func.echartsSymbolMin,
                    label: {
                      color: '#00ba8a',
                      fontSize: 11,
                      align: 'center',

                      padding: [0, 5, 33, 5],
                    },
                  },
                ],
                label: {
                  normal: {
                    show: true,
                  },
                },
              }
            }
          } else if (res.code === '-1') {
          } else {
            this.WeekOptions.xAxis = []
            this.WeekOptions.series = []
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      queryGetLoadYears() {
        let params = {
          projectCode: this.projectCode,
        }
        getLoadYears(params).then(res => {
          if (res.success) {
            var yearsList = res.data
            for (let i in yearsList) {
              this.yafterPower.push(yearsList[i].afterPower)
              this.yprePower.push(yearsList[i].prePower)
              this.yeekstime.push(yearsList[i].time)
            }
            this.YearsOptions.xAxis = []
            this.YearsOptions.series = []
            this.YearsOptions.xAxis = this.yeekstime
            this.YearsOptions.yAxis.name = this.$t('electricQuantity') + '(kW·h)'
            this.YearsOptions.series[0] = {
              name: this.$t('lastYear'),
              type: 'line',
              data: this.yprePower,
              itemStyle: { color: '#0DD667' },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(13, 214, 103, 0.2)' },
                    { offset: 1, color: 'rgba(13, 214, 103, 0.3)' },
                  ],
                  global: false,
                },
              },
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 4,
              smooth: true,
            }
            this.YearsOptions.series[1] = {
              name: this.$t('thisYear'),
              type: 'line',
              data: this.yafterPower,
              itemStyle: { color: '#0373e6' },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                    { offset: 1, color: 'rgba(3, 115, 230, 0.3)' },
                  ],
                  global: false,
                },
              },
              showSymbol: true,
              symbol: 'emptyCircle',
              symbolSize: 4,
              smooth: true,
            }

            if (this.$func.isSameArray(this.yprePower)) {
              this.YearsOptions.series[0].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolOverlap,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#007eff',
                    },
                  },
                ],
                normal: {
                  show: true,
                },
              }
            } else {
              this.YearsOptions.series[0].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolMax,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#ff4f4f',
                    },
                  },
                  {
                    type: 'min',
                    symbolOffset: [0, -30],
                    symbol: this.$func.echartsSymbolMin,
                    label: {
                      color: '#00ba8a',
                      fontSize: 11,
                      align: 'center',

                      padding: [0, 5, 33, 5],
                    },
                  },
                ],
                label: {
                  normal: {
                    show: true,
                  },
                },
              }
            }
            if (this.$func.isSameArray(this.yafterPower)) {
              this.YearsOptions.series[1].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolOverlap,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#007eff',
                    },
                  },
                ],
                normal: {
                  show: true,
                },
              }
            } else {
              this.YearsOptions.series[1].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolMax,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#ff4f4f',
                    },
                  },
                  {
                    type: 'min',
                    symbolOffset: [0, -30],
                    symbol: this.$func.echartsSymbolMin,
                    label: {
                      color: '#00ba8a',
                      fontSize: 11,
                      align: 'center',

                      padding: [0, 5, 33, 5],
                    },
                  },
                ],
                label: {
                  normal: {
                    show: true,
                  },
                },
              }
            }
          } else if (res.code === '-1') {
          } else {
            this.YearsOptions.xAxis = []
            this.YearsOptions.series = []
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleStatData() {
        let params = {
          projectCode: this.projectCode,
        }
        getTaskColStatData(params).then(res => {
          if (res.success) {
            this.StatData = res.data
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      queryTaskData() {
        let params = {
          projectCode: this.projectCode,
        }
        getControlTaskList(params).then(res => {
          if (res.success) {
            this.taskData = res.data
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      queryMaintenanceTrand() {
        let params = {
          projectCode: this.projectCode,
        }
        getMaintenanceTrand(params).then(res => {
          if (res.success) {
            var mainTrand = res.data

            for (let i in mainTrand) {
              this.mainNumber.push(mainTrand[i].number)
              this.mainTime.push(mainTrand[i].time)
            }

            this.MainOptions.xAxis = []
            this.MainOptions.series = []
            this.MainOptions.xAxis = this.time
            this.MainOptions.yAxis.name = this.$t('numberOfTimes') + `(${this.$t('times')})`
            this.MainOptions.series[0] = {
              name: this.$t('numberOfMaintenance'),
              type: 'line',
              data: this.mainNumber,
              itemStyle: {
                color: '#007EFF',
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(3, 115, 230, 0.2)' },
                    { offset: 1, color: 'rgba(3, 115, 230, 0.3)' },
                  ],
                  global: false,
                },
              },
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 4,
              smooth: true,
            }
            if (this.$func.isSameArray(this.mainNumber)) {
              this.MainOptions.series[0].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolOverlap,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#007eff',
                    },
                  },
                ],
                normal: {
                  show: true,
                },
              }
            } else {
              this.MainOptions.series[0].markPoint = {
                data: [
                  {
                    type: 'max',
                    symbol: this.$func.echartsSymbolMax,
                    symbolOffset: [0, -30],

                    label: {
                      fontSize: 11,
                      align: 'center',
                      padding: [0, 5, 33, 5],

                      color: '#ff4f4f',
                    },
                  },
                  {
                    type: 'min',
                    symbolOffset: [0, -30],
                    symbol: this.$func.echartsSymbolMin,
                    label: {
                      color: '#00ba8a',
                      fontSize: 11,
                      align: 'center',

                      padding: [0, 5, 33, 5],
                    },
                  },
                ],
                label: {
                  normal: {
                    show: true,
                  },
                },
              }
            }
          } else if (res.code === '-1') {
          } else {
            this.MainOptions.xAxis = []
            this.MainOptions.series = []
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleMaintenance(obj) {
        let params = {
          mac: obj.mac,
          alarmId: obj.id,
          id: '',
        }
        getfindMaintenance(params).then(res => {
          if (res.success) {
            store.commit('maintenanceObj', res.data)
            store.commit('alarmId', obj.id)
            this.maintenanceObj = obj
            this.dialogVisible = true
          } else if (res.code === '-1') {
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      closeMaintenance() {
        store.dispatch('resetMaintenanceObj')
        this.dialogVisible = false
      },
      handleUrge(id) {
        alarmUrgePush({ id: id }).then(res => {
          if (res.code === '0') {
            this.$Message.success({
              content: res.message,
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      cancel() {
        // 取消
        this.flag = !this.flag
        //
        //

        getQueryFastMenus({ projectCode: this.projectCode }).then(res => {
          this.dataArr = res.data
          //

          this.treeDate()
        })
      },
      joinin() {
        // 保存
        this.flag = !this.flag
        if (this.flag) return false
        let arr = []
        this.dataArr.forEach(item => {
          arr.push({
            name: item.name,
            url: item.url,
            icon: item.icon,
          })
        })
        //
        arr = JSON.stringify(arr)

        getSaveFastMenus({
          fastMenus: arr,
          projectCode: this.projectCode,
        }).then(res => {
          if (res.success) this.$Message.success(res.message)
          else this.$Message.error(res.message)
        })
      },
      enter(index) {
        this.isHover = index
      },
      leave() {
        this.isHover = false
      },
      changeUrl(url, params) {
        this.$router.push({
          path: url,
          query: { projectCode: this.projectCode, status: params },
        })
      },
      changeUrls(dateType, status) {
        this.$router.push({
          name: 'Alarm',
          params: {
            projectCode: this.projectCode,
            typeNumber: '-100',
            status,
            oqp2: '',
            type: dateType,
          },
        })
      },
    },

    destroyed() {
      store.commit('AddEditData', this.AddEditData)
      store.commit('dataArr', this.dataArr)
    },
    watch: {
      AddEditData: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.AddEditData = newVal
          }
        },
        deep: true,
      },
      dataArr: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.dataArr = newVal
            // store.commit('dataArr', this.dataArr);
          }
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less">
  .overflows {
    overflow: hidden;
  }
  .proj-boxes {
    display: flex;
  }
  .flex-1 {
    flex: 1;
  }
  .weight-text {
    font-size: 20px;
    font-weight: 600;
    margin: 10px;
  }
  .img-style {
    flex: 1;
    margin-top: 10px;
    margin-left: 10px;
  }
  .mr-10 {
    margin: 10px;
  }
  .felx-box {
    flex: 1;
    height: 90px;
    background: #242937;
    padding-top: 5px;
    padding-left: 10px;
    border-radius: 5px;
    margin: 5px;
  }
  .project {
    // margin-top: 80px;
    .ivu-tabs-bar {
      border-bottom: transparent !important;
    }
    .mapArea {
      overflow: auto;
      width: 1000px;
      height: 720px;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .map {
      width: 100%;
    }
    .mapBigArea {
      width: 100%;
      height: 720px;
      overflow: hidden;
      position: relative;
      background-size: 100% 100% !important;
      img {
        width: 100%;
        cursor: move;
        position: absolute;
      }
    }
    .custom_node_initial {
      width: 100%;
      padding-top: 19px;
      padding-left: 53px;
      height: 60px;
      display: flex;
      border-radius: 3px;
      background: url('../../../assets/images//macNos.png') no-repeat;
      flex-direction: column;
      background-size: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      position: relative;
      color: #fff;
      border-bottom: transparent;
      .close {
        position: absolute;
        right: 0px;
        top: 5px;
        z-index: 99;
      }
    }
    .vdr {
      cursor: pointer;
    }
    .vdr.active:before {
      outline: none;
    }
    .edit {
      display: flex;
      justify-content: flex-end;
    }
    .line {
      width: 3px;
      height: 16px;
      background: #007eff;
      margin-right: 20px;
    }
    .title {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #fff;
    }
    .mt16 {
      margin-top: 16px;
    }
    .mt {
      margin-top: 10px;
    }
    .mb {
      margin-bottom: 20px;
    }
    .pd {
      padding: 20px;
    }
    .map {
      padding: 10px;
      background: #1a202e;
      margin-top: 10px;

      .actives {
        color: #007eff;
        border-bottom: 2px solid #007eff;
      }
      .tabs {
        display: flex;
        margin-bottom: 10px;
        .tabpane {
          padding: 10px 20px 10px 20px;
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }
    .project_map {
      display: flex;
      align-items: center;
      padding: 20px;
    }
    .project_detailsList {
      width: 100%;
      padding: 20px;
      ul {
        list-style: none;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        li {
          width: 214px;
          height: 100px;
          background: #000000;
          margin-top: 10px;
          padding: 24px;
          .title {
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #fff;
            margin-bottom: 10px;
          }
          .num {
            margin-top: 10px;
          }
        }
      }
    }
    .project_list {
      .sw {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .item {
        background-color: #28313f;
        cursor: pointer;
        line-height: 44px;
        position: relative;
        margin-top: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        :hover {
          color: #007eff;
        }
        i {
          font-size: 28px;
          margin-left: 10px;
        }
        span {
          font-size: 14px;
          margin-left: 20px;
          position: relative;
          top: -5px;
        }
        .btn {
          font-size: 14px;
          margin-left: 50px;
          position: relative;
          top: -5px;
        }
      }
      .bx-left {
        width: 66px;
      }
      .bx-right {
        width: calc(~'100% - 66px');
        display: flex;
      }
      .items {
        width: 253px;
        height: 52px;
        background-color: #28313f;
        float: left;
        margin: 20px;
        line-height: 52px;
        text-align: center;
        i {
          font-size: 28px;
        }
        position: relative;

        .btn {
          font-size: 14px;
          margin-left: 10px;
          position: absolute;
          top: -5px;
        }
      }
      .df {
        display: flex;
        justify-content: center;
        padding: 20px 15px;
      }
      .tb {
        padding: 8px;
        color: #2d91f8;
        font-size: 28px;
        font-weight: 700;
        background: rgba(46, 149, 255, 0.2);
        border-radius: 10px;
        text-align: center;
        min-width: 100px;
        margin-right: 10px;
      }
      .tl {
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        max-width: 100%;
      }
      .tx {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        span.value {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
        }
        div {
          color: #dddddd;
        }
      }
      .bx {
        width: 60px;
        border-radius: 10px;
        img {
          width: 100%;
        }
      }
      .lb {
        background: rgba(46, 149, 255, 0.2);
        padding: 15px;
      }
      .la {
        background: rgba(68, 92, 219, 0.2);
        padding: 10px;
      }
      .lr {
        background: rgba(242, 78, 76, 0.2);
        padding: 10px;
      }
      .lrs {
        background: rgba(242, 78, 76, 0.2);
        padding: 13px;
      }
      .lg {
        background: rgba(33, 242, 127, 0.2);
        padding: 15px;
      }
      .ly {
        background: rgba(255, 168, 84, 0.2);
        padding: 8px;
        height: 66px;
      }
    }
    /deep/.ivu-progress-inner {
      background: #5c606a;
    }
    /deep/.ivu-table-cell {
      white-space: nowrap;
    }
    /deep/::-webkit-scrollbar {
      width: 6px; //竖轴宽度
      height: 6px; //横轴宽度
      // background-color: rgba(99, 110, 246, 0.5);
    } /* 滚动槽 */
    /deep/::-webkit-scrollbar-track {
      border-radius: 10px;
    }

    /deep/::-webkit-scrollbar-thumb {
      background-color: rgb(9, 15, 25);
    }
    .c-s {
      background: rgba(0, 186, 138, 0.15);
      border-radius: 5px;
      padding: 5px;
    }

    .c-d {
      background: rgba(255, 79, 79, 0.15);
      border-radius: 5px;
      padding: 5px;
    }
    /deep/.ivu-tabs {
      color: #999;
    }
    /deep/.ivu-tabs-bar {
      border-color: rgba(255, 255, 255, 0.6);
    }
    /deep/.ivu-tabs-ink-bar {
      position: absolute;
      left: 0;
      bottom: 0px;
      height: 3px;
    }
  }
  .treePut {
    height: 400px;
    overflow: auto;
  }

  .ivu-tree .ivu-checkbox-wrapper {
    // margin-right: 4px;
    margin-left: 7px;
  }

  /deep/.ivu-modal-footer {
    border: none;
  }
  /deep/::-webkit-scrollbar {
    width: 6px; //竖轴宽度
    height: 6px; //横轴宽度
    // background-color: rgba(99, 110, 246, 0.5);
  }

  /* 滚动槽 */
  /deep/::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  /deep/::-webkit-scrollbar-thumb {
    background-color: #1a202e;
    // #1A202E
  }
</style>
