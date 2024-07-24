import func from '@/untils/func'
import { cloneDeep } from 'lodash'
export const addMarkPoint = (arr = []) => {
  const commonLabel = { fontSize: 11, align: 'center', padding: [0, 5, 33, 5] }
  const isSame = func.isSameArray(arr)
  const maxPoint = [
    {
      type: 'max',
      symbol: isSame ? func.echartsSymbolOverlap : func.echartsSymbolMax,
      symbolOffset: [0, -30],
      symbolSize: isSame ? 50 : [65, 50],
      label: {
        color: isSame ? '#007eff' : '#ff4f4f',
        ...commonLabel,
      },
    },
  ]
  const minPoint = [
    {
      type: 'min',
      symbolOffset: [0, -30],
      symbol: func.echartsSymbolMin,
      label: {
        color: '#00ba8a',
        ...commonLabel,
      },
    },
  ]
  const pointData = isSame ? maxPoint : maxPoint.concat(minPoint)
  return pointData
}

export const getDeviceImg = (type, status) => {
  return { img: `/static/img/deviceStatusVisualScreen/${type}-${status}.png` }
}
export const deviceInfoContent = item => {
  return `<div class="${item.status}-device-bgc  ${item.status}-device-titleColor device-Height">
  <div  style="text-align:center">
  <img src="${item.imgUrl}" style="width:50px;height:50px" />
  </div>
  <div style="margin-left:20px">
  <span>${window.$t('deviceAliases')}： </span>
  <span class="info-text-content">${item.projectName} </span>
  </div>
  <div class="mart-10">
  <span>${window.$t('equipmentStatus')}： </span>
  <span class="info-text-content">${item.statusName} </span>
  </div>
  <div class="mart-10">
  <span>${window.$t('electricityMonth')}： </span>
  <span class="info-text-content">${item.projectName} </span>
  </div>
  ${
    item.noProcessAlarm
      ? `<div class="mart-10">
  <span>${window.$t('todayNumberOfUnprocessedAlarmsAndAlerts')}： </span>
  <span class="info-text-content">${item.projectName} </span>
  </div>`
      : ''
  }
  <div class="mart-10">
  <span>${window.$t('equipmentLocation')}： </span>
  <span class="info-text-content">${item.address} </span>
  </div>
  <div style="text-align:center">
  <button class="${item.status}-button checkDetails-button">
  <a href="javascript:;"  class="${item.status}-device-titleColor" onclick="openPrjAction('${item.projectName}','${item.projectCode}')">${window.$t('viewDetails')}</a></button></div></div>`
}

export const projectInfoContent = item => {
  return `<div class="${item.projectStatus}-bgc  ${item.projectStatus}-titleColor  project-Height">
  <div  style="text-align:center">
  <span style="margin-left:115px">${window.$t('projectInfo')}</span>  <span><i class="ivu-icon ivu-icon-ios-close closeWindowInfo" ></i></span> 
  </div>
  <div class="mart-10">
  <span>${window.$t('projectName')}： </span>
  <span class="info-text-content">${item.projectName} </span>
  </div>
  <div class="mart-10">
  <span>${window.$t('numberOfDevices')}： </span>
  <span class="info-text-content">${item.totalMac} </span>
  </div>
  <div class="mart-10">
  <span>${window.$t('electricityMonth')}： </span>
  <span class="info-text-content">${item.curMonthPower}kW·h </span>
  </div>
  ${
    item.totalAlarmNoProcessToday === 0 || item.totalAlarmNoProcessToday
      ? `<div class="mart-10">
  <span>${window.$t('numberOfUnprocessedAlarms')}： </span>
  <span class="info-text-content">${item.totalAlarmNoProcessToday} </span>
  </div>`
      : ''
  }
  <div style="text-align:center" class="mart-10">
  <button class="${item.projectStatus}-button checkDetails-button">
  <a href="javascript:;" class="${item.projectStatus}-titleColor" onclick="openPrjAction('${item.projectName}','${item.projectCode}')">${window.$t('viewDetails')}</a></button></div></div>`
}

export const projectGoogleInfoContent = item => {
  return `<div class="${item.projectStatus}-bgc  ${item.projectStatus}-titleColor  project-Height">
   <div  style="text-align:center">${window.$t('projectInfo')}</div>
  <div class="mart-10">
  <span>${window.$t('projectName')}： </span>
  <span class="info-text-content">${item.projectName} </span>
  </div>
  <div class="mart-10">
  <span>${window.$t('numberOfDevices')}： </span>
  <span class="info-text-content">${item.totalMac} </span>
  </div>
  <div class="mart-10">
  <span>${window.$t('electricityMonth')}： </span>
  <span class="info-text-content">${item.curMonthPower}kW·h </span>
  </div>
  ${
    item.totalAlarmNoProcessToday === 0 || item.totalAlarmNoProcessToday
      ? `<div class="mart-10">
  <span>${window.$t('numberOfUnprocessedAlarms')}： </span>
  <span class="info-text-content">${item.totalAlarmNoProcessToday} </span>
  </div>`
      : ''
  }
  <div style="text-align:center" class="mart-10">
  <button class="${item.projectStatus}-button checkDetails-button">
  <a href="javascript:;" class="${item.projectStatus}-titleColor" onclick="openPrjAction('${item.projectName}','${item.projectCode}')">${window.$t('viewDetails')}</a></button></div></div>`
}

export const allDeviceTypeList = [
  { label: window.$t('intelligentAirSwitch'), value: '1' },
  { label: window.$t('electricalFire'), value: '2,3' },
  { label: window.$t('smartPanel'), value: '19' },
  { label: window.$t('userTransmissionDdevice'), value: '27' },
  { label: window.$t('industrialGas'), value: '26' },
  { label: window.$t('waterImmersionWaterLevelAndPressure'), value: '18,23,24' },
  { label: window.$t('smokeAndCombustibleGases'), value: '25,6,7,10,13,,29' },
  { label: window.$t('temperatureHumidityLightingInfraredRemoteControl'), value: '22' },
  { label: window.$t('airDisinfector'), value: '33' },
]
export const factoryData = item => {
  return {
    icon: item.isProject ? `/static/img/deviceStatusVisualScreen/${item.projectStatus}-Pro@2x.png` : `/static/img/deviceStatusVisualScreen/${item.type}-${item.status}.png`,
    height: item.isProject ? 60 : 40,
    width: item.isProject ? 60 : 35,
    content: item.isProject ? projectInfoContent(item) : deviceInfoContent(item),
    info: item,
  }
}

export const factoryGoogleData = item => {
  return {
    icon: item.isProject ? `/static/img/deviceStatusVisualScreen/${item.projectStatus}-Pro@2x.png` : `/static/img/deviceStatusVisualScreen/${item.type}-${item.status}.png`,
    scaledSize: { width: item.isProject ? 60 : 35, height: item.isProject ? 60 : 40 },
    content: item.isProject ? projectGoogleInfoContent(item) : deviceInfoContent(item),
    info: item,
  }
}

export const weatherConfig = [
  {
    text: window.$t('ns_weatherConfig.sunny'),
    imgUrl: '/static/img/weatherIcon/SunnyDay.png',
    type: 'day',
    key: '晴',
  },
  {
    text: window.$t('ns_weatherConfig.sunny'),
    imgUrl: '/static/img/weatherIcon/SunnyNight.png',
    type: 'night',
    key: '晴',
  },
  {
    text: window.$t('ns_weatherConfig.cloudy'),
    imgUrl: '/static/img/weatherIcon/Cloudy.png',
    key: '多云',
  },
  {
    text: window.$t('ns_weatherConfig.overcast'),
    imgUrl: '/static/img/weatherIcon/OvercastDay.png',
    type: 'day',
    key: '阴',
  },
  {
    text: window.$t('ns_weatherConfig.overcast'),
    imgUrl: '/static/img/weatherIcon/OvercastNight.png',
    type: 'night',
    key: '阴',
  },
  {
    text: window.$t('ns_weatherConfig.shower'),
    imgUrl: '/static/img/weatherIcon/ShowerDay.png',
    type: 'day',
    key: '阵雨',
  },
  {
    text: window.$t('ns_weatherConfig.shower'),
    imgUrl: '/static/img/weatherIcon/ShowerNight.png',
    type: 'night',
    key: '阵雨',
  },
  {
    text: window.$t('ns_weatherConfig.thunderstorm'),
    imgUrl: '/static/img/weatherIcon/Thundershower.png',
    key: '雷阵雨',
  },
  {
    text: window.$t('ns_weatherConfig.thunderstormAccompaniedByHail'),
    imgUrl: '/static/img/weatherIcon/ThundershowerWithHail.png',
    key: '雷阵雨伴有冰雹',
  },
  {
    text: window.$t('ns_weatherConfig.sleet'),
    imgUrl: '/static/img/weatherIcon/ThundershowerWithHail.png',
    key: '雨夹雪',
  },
  {
    text: window.$t('ns_weatherConfig.lightRain'),
    imgUrl: '/static/img/weatherIcon/LightRain.png',
    key: '小雨',
  },
  {
    text: window.$t('ns_weatherConfig.moderateRain'),
    imgUrl: '/static/img/weatherIcon/ModerateRain.png',
    key: '中雨',
  },
  {
    text: window.$t('ns_weatherConfig.heavyRain'),
    imgUrl: '/static/img/weatherIcon/OvercHeavyRainastDay.png',
    type: 'day',
    key: '大雨',
  },
  {
    text: window.$t('ns_weatherConfig.rainstorm'),
    imgUrl: '/static/img/weatherIcon/Storm.png',
    key: '暴雨',
  },
  {
    text: window.$t('ns_weatherConfig.heavyRainstorm'),
    imgUrl: '/static/img/weatherIcon/HeavyStorm.png',
    key: '大暴雨',
  },
  {
    text: window.$t('ns_weatherConfig.extremelyHeavyRainstorm'),
    imgUrl: '/static/img/weatherIcon/SevereStorm.png',
    key: '特大暴雨',
  },
  {
    text: window.$t('ns_weatherConfig.snowShower'),
    imgUrl: '/static/img/weatherIcon/SnowFlurryDay.png',
    key: '阵雪',
  },
  {
    text: window.$t('ns_weatherConfig.snowShower'),
    imgUrl: '/static/img/weatherIcon/SnowFlurryNight.png',
    type: 'night',
    key: '阵雪',
  },
  {
    text: window.$t('ns_weatherConfig.snowFlurries'),
    imgUrl: '/static/img/weatherIcon/LightSnow.png',
    key: '小雪',
  },
  {
    text: window.$t('ns_weatherConfig.moderateSnow'),
    imgUrl: '/static/img/weatherIcon/ModerateSnow.png',
    key: '中雪',
  },
  {
    text: window.$t('ns_weatherConfig.majorSnow'),
    imgUrl: '/static/img/weatherIcon/HeavySnow.png',
    key: '大雪',
  },
  {
    text: window.$t('ns_weatherConfig.snowstorms'),
    imgUrl: '/static/img/weatherIcon/Snowstorm.png',
    key: '暴雪',
  },
  {
    text: window.$t('ns_weatherConfig.fog'),
    imgUrl: '/static/img/weatherIcon/Fog.png',
    key: '雾',
  },
  {
    text: window.$t('ns_weatherConfig.freezingRain'),
    imgUrl: '/static/img/weatherIcon/IceRain.png',
    key: '冻雨',
  },
  {
    text: window.$t('ns_weatherConfig.sandstorm'),
    imgUrl: '/static/img/weatherIcon/Duststorm.png',
    key: '沙尘暴',
  },
  {
    text: window.$t('ns_weatherConfig.lightToModerateRain'),
    imgUrl: '/static/img/weatherIcon/LightRain.png',
    key: '小到中雨',
  },
  {
    text: window.$t('ns_weatherConfig.moderateToHeavyRain'),
    imgUrl: '/static/img/weatherIcon/ModerateRain.png',
    key: '中到大雨',
  },
  {
    text: window.$t('ns_weatherConfig.heavyRainToRainstorm'),
    imgUrl: '/static/img/weatherIcon/Storm.png',
    key: '大到暴雨',
  },
  {
    text: window.$t('ns_weatherConfig.rainstormToHeavyRainstorm'),
    imgUrl: '/static/img/weatherIcon/HeavyStorm.png',
    key: '暴雨到大暴雨',
  },
  {
    text: window.$t('ns_weatherConfig.heavyRainstormToExtremelyHeavyRainstorm'),
    imgUrl: '/static/img/weatherIcon/SevereStorm.png',
    key: '大暴雨到特大暴雨',
  },
  {
    text: window.$t('ns_weatherConfig.lightToModerateSnow'),
    imgUrl: '/static/img/weatherIcon/ModerateSnow.png',
    key: '小到中雪',
  },
  {
    text: window.$t('ns_weatherConfig.moderateToHeavySnow'),
    imgUrl: '/static/img/weatherIcon/HeavySnow.png',
    key: '中到大雪',
  },
  {
    text: window.$t('ns_weatherConfig.bigToBlizzard'),
    imgUrl: '/static/img/weatherIcon/Snowstorm.png',
    key: '大到暴雪',
  },
  {
    text: window.$t('ns_weatherConfig.Dust'),
    imgUrl: '/static/img/weatherIcon/Dust.png',
    key: '浮尘',
  },
  {
    text: window.$t('ns_weatherConfig.Sand'),
    imgUrl: '/static/img/weatherIcon/Sand.png',
    key: '扬沙',
  },
  {
    text: window.$t('ns_weatherConfig.StrongSandstorm'),
    imgUrl: '/static/img/weatherIcon/Sandstorm.png',
    key: '强沙尘暴',
  },
  {
    text: window.$t('ns_weatherConfig.thickFog'),
    imgUrl: '/static/img/weatherIcon/Fog.png',
    key: '浓雾',
  },
  {
    text: window.$t('ns_weatherConfig.tornado'),
    imgUrl: '/static/img/weatherIcon/Tornado.png',
    key: '龙卷风',
  },
  {
    text: window.$t('ns_weatherConfig.WeakHighBlownSnow'),
    imgUrl: '/static/img/weatherIcon/LightSnow.png',
    key: '弱高吹雪',
  },
  {
    text: window.$t('ns_weatherConfig.mist'),
    imgUrl: '/static/img/weatherIcon/Fog.png',
    key: '轻雾',
  },
  {
    text: window.$t('ns_weatherConfig.strongDenseFog'),
    imgUrl: '/static/img/weatherIcon/Fog.png',
    key: '强浓雾',
  },
  {
    text: window.$t('ns_weatherConfig.haze'),
    imgUrl: '/static/img/weatherIcon/Haze.png',
    key: '霾',
  },
  {
    text: window.$t('ns_weatherConfig.moderateHaze'),
    imgUrl: '/static/img/weatherIcon/Haze.png',
    key: '中度霾',
  },
  {
    text: window.$t('ns_weatherConfig.severeHaze'),
    imgUrl: '/static/img/weatherIcon/Haze.png',
    key: '重度霾',
  },
  {
    text: window.$t('ns_weatherConfig.seriousHaze'),
    imgUrl: '/static/img/weatherIcon/Haze.png',
    key: '严重霾',
  },
  {
    text: window.$t('ns_weatherConfig.denseFog'),
    imgUrl: '/static/img/weatherIcon/Fog.png',
    key: '大雾',
  },
  {
    text: window.$t('ns_weatherConfig.extremelyDenseFog'),
    imgUrl: '/static/img/weatherIcon/Fog.png',
    key: '特强浓雾',
  },
  {
    text: window.$t('ns_weatherConfig.rain'),
    imgUrl: '/static/img/weatherIcon/LightRain.png',
    key: '雨',
  },
  {
    text: window.$t('ns_weatherConfig.snow'),
    imgUrl: '/static/img/weatherIcon/LightSnow.png',
    key: '雪',
  },
]
export const powerMenuConfig = [
  { value: 'todayPower', label: window.$t('today') },
  { value: 'yesterdayPower', label: window.$t('yesterday') },
  { value: 'last24hPower', label: window.$t('last24hours') },
]
export const getProjectListContent = data => {
  const cloneData = cloneDeep(data)
  const sum = cloneData.reduce(
    (sum, cur, index) => {
      const buttonContent = `<div><button class="${index}-button project-Button-baidu-info pd-Button ${index === 0 ? 'active-Button' : ''} "  >${cur.properties.info.projectName}</button> </div>`
      // onclick="getProjectInfoShow('${cur.properties.info.projectName}','${cur.properties.info.totalMac}','${cur.properties.info.curMonthPower}','${index}')"
      sum[0] += buttonContent
      const rightContent = `<div class="contentPro-${index} default-div  ${index === 0 ? 'active' : ''}">
      <div> <span style="font-size:18px;margin-right:20px;">${window.$t('projectInfo')}</span>  <span style=""><i class="ivu-icon ivu-icon-ios-close closeWindowInfo" ></i></span></div>
      <div class="margin-top-10"> <span> ${window.$t('projectName')}：</span> <span class="info-text-content">${cur.properties.info.projectName}</span></div>
      <div class="margin-top-10"><span> ${window.$t('numberOfDevices')}：</span> <span class="info-text-content">${cur.properties.info.totalMac}</span></div>
      <div class="margin-top-10"><span> ${window.$t('electricityMonth')}：</span> <span class="info-text-content">${cur.properties.info.curMonthPower}</span></div>
      <div class="margin-top-10"><button class="online-button checkDetails-button">
      <a href="javascript:;" class="normal-titleColor" onclick="openPrjAction('${cur.properties.info.projectName}','${cur.properties.info.projectCode}')">${window.$t('viewDetails')}</a></button></div>
      </div>`
      sum[1] += rightContent
      return sum
    },
    ['', '']
  )
  return divContent(sum[0], sum[1])
}
const divContent = (leftContent, rightContent) =>
  `<div class="proList-bgc" style="display:flex;height:100%"> <div style="flex-shrink:0;width:40%;overflow-y:auto;" > <div style="margin-left:20px;padding:20px 10px 10px 10px;">${leftContent}</div> <div style=""></div>  </div> <div class="online-device-titleColor pd-rightContent">${rightContent}</div> </div>`
