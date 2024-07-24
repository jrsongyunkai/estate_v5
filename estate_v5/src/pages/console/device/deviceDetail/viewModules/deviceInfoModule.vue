<template>
  <div class="device-info" v-if="deviceInfo">
    <!-- 基本信息 -->
    <div v-if="deviceInfo.equipmentType !== 12" :class="{ break: baseInfoHalfList.includes(deviceInfo.equipmentType) }">
      <BaseInfo
        class="mo-item"
        :class="baseInfoHalfList.includes(deviceInfo.equipmentType) ? 'half  marR-10' : ''"
        :isHalf="baseInfoHalfList.includes(deviceInfo.equipmentType)"
        ref="hanleInfo"
        :mac="deviceInfo.mac"
        :infoData="{ ...dualPowerInfo, equipmentType: deviceInfo.equipmentType }"></BaseInfo>
      <!-- 电气火灾监测设备 -->
      <Stralsund class="half mo-item" v-if="deviceInfo.equipmentType === 3" :param="deviceInfo"></Stralsund>
      <!-- 液位探测设备 -->
      <LevelInfo class="half mo-item" style="padding-bottom: 20px" v-if="deviceInfo.equipmentType === 4" :mac="deviceInfo.mac"></LevelInfo>
      <!-- 压力 -->
      <PressureModule class="half mo-item" :mac="deviceInfo.mac" v-if="[5, 31].includes(deviceInfo.equipmentType)"></PressureModule>
      <!-- 烟感/感烟报警设备 -->
      <SmokeInfo class="half mo-item" :mac="deviceInfo.mac" v-if="deviceInfo.equipmentType === 6"></SmokeInfo>

      <!-- 可燃气体/燃气报警设备 -->
      <FlammableGas class="half mo-item" v-if="deviceInfo.equipmentType === 7" :mac="deviceInfo.mac"></FlammableGas>

      <!-- 烟感、 可燃气体探测设备 -->
      <SmokeAlarm class="half mo-item" v-if="[10, 13].includes(deviceInfo.equipmentType)" :mac="deviceInfo.mac"></SmokeAlarm>
      <!-- 温湿度 -->
      <TemperatureHumiditySensor class="half mo-item" v-if="deviceInfo.equipmentType === 11" :param="deviceInfo" :online="deviceInfo.others.online"></TemperatureHumiditySensor>

      <!-- 光照采集器 -->
      <IlluminanceSensing class="half mo-item" v-if="deviceInfo.equipmentType === 14" :param="deviceInfo" :online="deviceInfo.others.online"></IlluminanceSensing>

      <!-- 智能水表 -->
      <div class="half mo-item" v-if="deviceInfo.equipmentType === 15">
        <IntelligentWaterMeter :param="deviceInfo"></IntelligentWaterMeter>
      </div>
      <!-- 空调控制器 -->
      <div class="half mo-item" v-if="deviceInfo.equipmentType === 21">
        <Airinfomation ref="airinfo" :param="deviceInfo" :online="deviceInfo.others.online" @refresh="refreshInit"></Airinfomation>
      </div>
      <!-- 灯光控制器 -->
      <LightingController class="half mo-item" v-if="deviceInfo.equipmentType === 22" :param="deviceInfo"></LightingController>
      <!-- 金华水压和液位设备 -->
      <JhWaterlevelInfo class="half mo-item" v-if="[23, 24].includes(deviceInfo.equipmentType)" :equipmentType="deviceInfo.equipmentType" :mac="deviceInfo.mac"></JhWaterlevelInfo>

      <!-- 金华水压和液位设备 -->
      <JhGas class="half mo-item" v-if="deviceInfo.equipmentType === 25" :equipmentType="deviceInfo.equipmentType" :mac="deviceInfo.mac"></JhGas>

      <!-- 报警主机 -->
      <Alarmhost class="half mo-item" v-if="deviceInfo.equipmentType === 26" :mac="deviceInfo.mac"></Alarmhost>

      <!-- 用户信息传输装置 -->
      <InformationTransmission class="half mo-item" v-if="deviceInfo.equipmentType === 27" :mac="deviceInfo.mac" @propQueryInfo="propQueryInfo"></InformationTransmission>

      <!-- 华东水表 -->
      <EastWaterMeter class="half mo-item" v-if="deviceInfo.equipmentType === 28" :equipmentType="deviceInfo.equipmentType" :mac="deviceInfo.mac"></EastWaterMeter>

      <!-- 万霖烟感 -->
      <WanlinSmoke class="half mo-item" v-if="deviceInfo.equipmentType === 29" :equipmentType="deviceInfo.equipmentType" :mac="deviceInfo.mac"></WanlinSmoke>

      <!-- 拓强水表 -->
      <TqwaterMeter class="half mo-item" v-if="deviceInfo.equipmentType === 30" :equipmentType="deviceInfo.equipmentType" :mac="deviceInfo.mac"></TqwaterMeter>
      <!--  鼎智达流量计 -->
      <WaterPressure class="half mo-item" v-if="deviceInfo.equipmentType === 32" :param="deviceInfo" />
      <!-- 空气消杀机 -->
      <AirDisinfector class="half mo-item" v-if="deviceInfo.equipmentType === 33" :mac="deviceInfo.mac"></AirDisinfector>
      <!-- 万霖手动报警器-->
      <ManualAlarm class="half mo-item" v-if="deviceInfo.equipmentType === 38" :mac="deviceInfo.mac"></ManualAlarm>
      <!-- 万霖温感 -->
      <TemperatureSensation class="half mo-item" v-if="deviceInfo.equipmentType === 39" :mac="deviceInfo.mac"></TemperatureSensation>
      <!-- 4G模块 -->
      <Module4G class="half mo-item" v-if="deviceInfo.equipmentType === 40" :mac="deviceInfo.mac"></Module4G>
      <!-- 朗鑫烟感 -->
      <LXSmokePerception class="half mo-item" v-if="deviceInfo.equipmentType === 41" :mac="deviceInfo.mac"></LXSmokePerception>
      <!-- 海曼烟感 -->
      <HamanSmokePerception class="half mo-item" v-if="deviceInfo.equipmentType === 42" :mac="deviceInfo.mac"></HamanSmokePerception>
      <!-- 双电源设备 -->
      <DualPowerSupply class="half mo-item" v-if="deviceInfo.equipmentType === 43" @updateDeviceData="updateDeviceData" :mac="deviceInfo.mac"></DualPowerSupply>
      <!-- 海曼燃气 -->
      <HMGas class="half mo-item" v-if="deviceInfo.equipmentType === 45" :mac="deviceInfo.mac"></HMGas>
      <!-- 接地电阻  -->
      <GroundingResistance class="half mo-item" v-if="deviceInfo.equipmentType === 44" :mac="deviceInfo.mac"></GroundingResistance>
    </div>
    <!-- 电表info -->
    <div class="mo-item" v-if="deviceInfo.equipmentType === 12">
      <InfoElectricitys :mac="deviceInfo.mac" :model="deviceInfo.model" :online="deviceInfo.others.online"></InfoElectricitys>
    </div>

    <!-- 智能水表 -->
    <div class="mo-item" v-if="deviceInfo.equipmentType === 16">
      <MeterReadingCat :param="deviceInfo"></MeterReadingCat>
    </div>

    <div class="mo-item" v-if="deviceInfo.equipmentType === 22">
      <UseElecStatistics :mac="deviceInfo.mac"></UseElecStatistics>
    </div>

    <div class="tb-item" v-if="deviceInfo.equipmentType === 27 && transmissionDevice">
      <InfomationTransTble :mac="deviceInfo.mac" :transmissionDevice="transmissionDevice"></InfomationTransTble>
    </div>
    <!-- 数据趋势 -->
    <div class="mo-item" v-if="!dataTrendList.includes(deviceInfo.equipmentType)" :style="{ width: `100%` }">
      <TrendDataForDeviceInfo ref="trendDataForDeviceInfo"></TrendDataForDeviceInfo>
    </div>
    <!-- 智能双备份电源 -->
    <div class="mo-item" v-if="[43].includes(deviceInfo.equipmentType)" :style="{ width: `100%` }">
      <PortDataInfo :mac="deviceInfo.mac" ref="PortDataInfo" :infoData="dualPowerInfo"></PortDataInfo>
    </div>
    <!-- 用电报表 -->
    <div class="mo-item" v-if="deviceInfo.equipmentType === 12">
      <ElecTable :mac="deviceInfo.mac"></ElecTable>
    </div>

    <!-- 操作日志 -->
    <div class="mo-item" v-if="deviceInfo.equipmentType === 22">
      <OperateRecord :mac="deviceInfo.mac"></OperateRecord>
    </div>

    <!-- 报警记录 -->
    <div class="mo-item" :class="alarmClassList.includes(deviceInfo.equipmentType) ? 'bg-none' : ''" v-if="!alarmHistoryList.includes(deviceInfo.equipmentType)">
      <JhEventList v-if="eventList.includes(deviceInfo.equipmentType)" :mac="deviceInfo.mac" :equipmentType="deviceInfo.equipmentType"></JhEventList>
      <AlarmRecordList v-else :mac="deviceInfo.mac" :equipmentType="deviceInfo.equipmentType"></AlarmRecordList>
    </div>
    <!-- 维保记录 -->
    <div class="mo-item" v-if="!maintenanceList.includes(deviceInfo.equipmentType)">
      <MaintenanceRecords :mac="deviceInfo.mac" :equipmentType="deviceInfo.equipmentType"></MaintenanceRecords>
    </div>
  </div>
</template>

<script>
  export default {
    components: {
      Module4G: () => import('./modulesSubView/Module4G.vue'),
      TemperatureSensation: () => import('./modulesSubView/TemperatureSensation.vue'),
      ManualAlarm: () => import('./modulesSubView/ManualAlarm.vue'),
      BaseInfo: () => import('./modulesSubView/BaseInfo.vue'),
      PressureModule: () => import('./modulesSubView/PressureModule.vue'),
      SmokeInfo: () => import('./modulesSubView/SmokeInfo.vue'),
      FlammableGas: () => import('./modulesSubView/FlammableGas.vue'),
      Alarmhost: () => import('./modulesSubView/Alarmhost.vue'),
      InformationTransmission: () => import('./component/InformationTransmission.vue'),
      LevelInfo: () => import('./modulesSubView/LevelInfo.vue'),
      JhWaterlevelInfo: () => import('./modulesSubView/JhWaterlevelinfo.vue'),
      JhGas: () => import('./modulesSubView/Jhgas.vue'),
      EastWaterMeter: () => import('./modulesSubView/EastWaterMeter.vue'),
      WanlinSmoke: () => import('./modulesSubView/WanlinSmoke.vue'),
      TqwaterMeter: () => import('./modulesSubView/TqwaterMeter.vue'),
      SmokeAlarm: () => import('./modulesSubView/SmokeAlarm.vue'),
      TemperatureHumiditySensor: () => import('./modulesSubView/TemperatureHumiditySensor.vue'),
      Airinfomation: () => import('./modulesSubView/Airinfomation.vue'),
      LightingController: () => import('./modulesSubView/lightingController.vue'),
      InfoElectricitys: () => import('./modulesSubView/InfoElectricitys.vue'),
      IlluminanceSensing: () => import('./modulesSubView/IlluminanceSensing.vue'),
      IntelligentWaterMeter: () => import('./modulesSubView/IntelligentWaterMeter.vue'),
      MeterReadingCat: () => import('./modulesSubView/MeterReadingCat.vue'),
      UseElecStatistics: () => import('./component/useElecStatistics.vue'),
      InfomationTransTble: () => import('./component/InfomationTransTble.vue'),
      OperateRecord: () => import('./component/OperateRecord.vue'),
      ElecTable: () => import('./modulesSubView/elecTable.vue'),
      JhEventList: () => import('./modulesSubView/JhEventList.vue'),
      Stralsund: () => import('./modulesSubView/Stralsund.vue'),
      TrendDataForDeviceInfo: () => import('./modulesSubView/TrendDataForDeviceInfo.vue'),
      MaintenanceRecords: () => import('./modulesSubView/MaintenanceRecords.vue'),
      AlarmRecordList: () => import('./modulesSubView/AlarmRecordList.vue'),
      AirDisinfector: () => import('./modulesSubView/AirDisinfector.vue'),
      WaterPressure: () => import('./modulesSubView/WaterPressure.vue'), //
      LXSmokePerception: () => import('./modulesSubView/LXSmokePerception.vue'),
      HamanSmokePerception: () => import('./modulesSubView/HamanSmokePerception.vue'),
      DualPowerSupply: () => import('./modulesSubView/DualPowerSupply.vue'),
      PortDataInfo: () => import('./modulesSubView/PortDataInfo.vue'),
      GroundingResistance: () => import('./modulesSubView/GroundingResistance.vue'),
      HMGas: () => import('./modulesSubView/HMGas.vue'),
    },
    inject: ['rowDeviceInfo'],
    data() {
      return {
        deviceInfo: this.rowDeviceInfo,
        baseInfoHalfList: [3, 4, 5, 6, 7, 10, 11, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 31, 33, 38, 39, 40, 41, 42, 43, 44], // 控制设备基本信息是否展示占一行 的设备equipmentType
        eventList: [23, 24, 25, 28, 29, 30, 33, 40, 41, 42, 44], // 是否展示事件列表的设备equipmentType List
        dataTrendList: [1, 2, 8, 19, 20, 16, 26, 27, 33, 38, 39, 40, 43, 44], // 不展示数据趋势的设备equipmentType List
        maintenanceList: [12, 16, 20], // 不展示维保记录的设备equipmentType List
        alarmHistoryList: [12, 16], // 不展示报警记录的设备equipmentType List
        alarmClassList: [23, 24], // 需要 背景样式bg-none的设备equipmentType List
        transmissionDevice: null,
        dualPowerInfo: null,
      }
    },
    methods: {
      hanleInfo() {
        this.$refs.hanleInfo.queryInfo()
      },
      propQueryInfo(data) {
        this.transmissionDevice = data
      },
      updateDeviceData(data) {
        this.dualPowerInfo = data
      },
      refreshInit() {
        this.$refs.trendDataForDeviceInfo.refreshInit()
      },
    },
  }
</script>

<style lang="less" scoped>
  .device-info {
    .flex {
      display: flex;
    }
    .marR-10 {
      margin-right: 10px;
    }
    .mo-item {
      background: #1a202e;
      margin-bottom: 10px;
      padding: 0px 15px;
      padding-bottom: 10px;
      /deep/.theader {
        padding: 0 0px;
        padding-bottom: 0px !important;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #5e626c;
        .left {
          display: flex;
          align-items: center;
          font-size: 14px;
        }
      }
      /deep/.header,
      /deep/ #stralsund .header {
        height: 50px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #5e626c;
        margin-top: 0 !important;
      }
      /deep/.aircondition .airconditionHeader {
        height: 50px;
        display: flex;
        align-items: center;
        padding-bottom: 0px;
        justify-content: space-between;
        border-bottom: 1px solid #5e626c;
        margin-top: 0 !important;
        .title {
          font-size: 14px;
        }
        .left {
          display: flex;
          align-items: center;
        }
        .right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
    .mo-item.bg-none {
      background: none !important;
      padding: 0px;
    }
    .tb-item {
      margin-bottom: 10px;
      /deep/.inform-heads {
        background: #1a202e;
        height: 50px;
        align-items: center;
        padding-bottom: 0px;
      }
      /deep/.mr-ts:not(.inform-heads) {
        margin-top: 0px;
        background: #1a202e;
        padding: 20px 15px;
      }
    }
    .break {
      display: flex;
      //padding: 0px 5px;
      .half {
        width: 50%;
        padding: 0 10px;
        /deep/.Temperature-header {
          height: 50px !important;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #5e626c;
          margin-top: 0 !important;
          justify-content: space-between;
        }
        /deep/#IntelligentWaterMeter {
          margin-top: 0;
        }
        /deep/.linght-head {
          display: flex;
          align-items: center;
          height: 50px;
        }
        /deep/.alarm-heads,
        /deep/.inform-heads {
          height: 50px;
          align-items: center;
          padding-top: 2px;
        }
      }
    }
  }
</style>
