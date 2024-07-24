/* eslint-disable no-template-curly-in-string */
import { parseSvg } from '@meta2d/svg'
import { httpRequest } from './http'

/**
 * 获取文件名字
 * @param name
 * @returns
 */
const getFileName = name => {
  const n = name.lastIndexOf('.')
  if (n !== -1) {
    return name.substring(0, n)
  }
  return name
}

/**
 * svg绘图
 * @param f 获取的文件信息
 * @param dName
 * @returns
 */
export const svg2Pens = async (f, tag) => {
  const name = getFileName(f.name)
  if (tag.includes('2.5D') || tag.includes('IoT') || tag.includes('Room（房间）') || tag.includes('Weather(天气)') || tag.includes('大屏可视化') || tag.includes('轨道交通线路') || tag.includes('太阳能光伏发电') || tag.includes('City（城市）')) {
    return {
      name,
      image: f.fullUrl,
      data: { name: 'image', tag, width: 100, height: 100, image: f.fullUrl },
    }
  }
  return { name, image: f.fullUrl, data: parseSvg(await httpRequest.getSvg(f.fullUrl)).map(v => ({ ...v, tag })), component: true }
}

export const svg2PensForLowPressure = (svgList, tag) => {
  const configs = svgList.map((v, index) => ({
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    id: `S${index}`,
    name: v.fullUrl.endsWith('.gif') ? 'gif' : 'image',
    image: v.fullUrl,
    imageRatio: true,
    children: [],
    lineWidth: 1,
    fontSize: 12,
    lineHeight: 1.5,
    rotate: 0,
    ex: 1,
    ey: 1,
    locked: 2,
    tag,
  }))
  return [
    {
      name: 'combine',
      x: 0,
      y: 0,
      ex: 1,
      ey: 0,
      width: 100,
      height: 100,
      center: {
        x: 0,
        y: 0,
      },
      children: configs.map(v => v.id),
      lineWidth: 1,
      fontSize: 12,
      lineHeight: 1.5,
      anchors: [],
      rotate: 0,
      tag,
      showChild: 0,
    },
    ...configs,
  ]
}

/**
 * png绘图数据
 * @param f 获取的文件信息
 * @param dName
 * @returns
 */
export const png2Pens = (f, tag) => {
  const name = getFileName(f.name)
  return {
    name,
    image: f.fullUrl,
    data: {
      tag,
      width: 100,
      height: 100,
      image: f.fullUrl,
      name: f.fullUrl.includes('gif') ? 'gif' : 'image',
    },
  }
}

export const EditorActiveType = {
  CanvasActive: 0,
  PenActive: 1,
  CombineActive: 2,
}

export const lowPressureGifs = [
  '1p_off.gif',
  '1p_on.gif',
  '2p_off.gif',
  '2p_on.gif',
  '3p_off.gif',
  '3p_on.gif',
  '4p_off.gif',
  '4p_on.gif',
  '网关.gif',
  '125S_off.gif',
  '125S_on.gif',
  '250S_off.gif',
  '250S_on.gif',
  '400S_off.gif',
  '400S_on.gif',
  '630S_off.gif',
  '630S_on.gif',
  'K63_Off.gif',
  'K63_ON.gif',
  'D8_电源.gif',
  'D8_电源带屏.gif',
  'D8_网关.gif',
  'L10.gif',
  'M5_A5.gif',
  'T3系列.gif',
  'TP_20.gif',
]

export const lowPressureObj = lowPressureGifs.map(v => ({
  name: `${v}`,
  fullUrl: `/低压电器/${v}`,
}))

export const getLowPressureConfigurations = () => {
  return {
    name: window.$t('ns_iconGroups.lowVoltageApparatus'),
    show: true,
    list: [
      {
        name: '1p',
        image: lowPressureObj[0].fullUrl,
        data: svg2PensForLowPressure([lowPressureObj[0], lowPressureObj[1]], window.$t('ns_iconGroups.lowVoltageApparatus')),
      },
      {
        name: '2p',
        image: lowPressureObj[2].fullUrl,
        data: svg2PensForLowPressure([lowPressureObj[2], lowPressureObj[3]], window.$t('ns_iconGroups.lowVoltageApparatus')),
      },
      {
        name: '3p',
        image: lowPressureObj[4].fullUrl,
        data: svg2PensForLowPressure([lowPressureObj[4], lowPressureObj[5]], window.$t('ns_iconGroups.lowVoltageApparatus')),
      },
      {
        name: '4p',
        image: lowPressureObj[6].fullUrl,
        data: svg2PensForLowPressure([lowPressureObj[6], lowPressureObj[7]], window.$t('ns_iconGroups.lowVoltageApparatus')),
      },

      {
        name: '125S',
        image: lowPressureObj[9].fullUrl,
        data: svg2PensForLowPressure([lowPressureObj[9], lowPressureObj[10]], window.$t('ns_iconGroups.lowVoltageApparatus')),
      },
      {
        name: '250S',
        image: lowPressureObj[11].fullUrl,
        data: svg2PensForLowPressure([lowPressureObj[11], lowPressureObj[12]], window.$t('ns_iconGroups.lowVoltageApparatus')),
      },
      {
        name: '400S',
        image: lowPressureObj[13].fullUrl,
        data: svg2PensForLowPressure([lowPressureObj[13], lowPressureObj[14]], window.$t('ns_iconGroups.lowVoltageApparatus')),
      },
      {
        name: '630S',
        image: lowPressureObj[15].fullUrl,
        data: svg2PensForLowPressure([lowPressureObj[15], lowPressureObj[16]], window.$t('ns_iconGroups.lowVoltageApparatus')),
      },
      {
        name: 'k63',
        image: lowPressureObj[17].fullUrl,
        data: svg2PensForLowPressure([lowPressureObj[17], lowPressureObj[18]], window.$t('ns_iconGroups.lowVoltageApparatus')),
      },
      {
        name: window.$t('ns_iconGroups.gateway'),
        image: lowPressureObj[8].fullUrl,
        data: { tag: window.$t('ns_iconGroups.lowVoltageApparatus'), width: 100, height: 100, image: lowPressureObj[8].fullUrl, name: 'gif' },
      },
      {
        name: window.$t('ns_iconGroups.D8_Power'),
        image: lowPressureObj[19].fullUrl,
        data: { tag: window.$t('ns_iconGroups.lowVoltageApparatus'), width: 100, height: 100, image: lowPressureObj[19].fullUrl, name: 'gif' },
      },
      {
        name: window.$t('ns_iconGroups.D8_PowerWithScreen'),
        image: lowPressureObj[20].fullUrl,
        data: { tag: window.$t('ns_iconGroups.lowVoltageApparatus'), width: 100, height: 100, image: lowPressureObj[20].fullUrl, name: 'gif' },
      },
      {
        name: window.$t('ns_iconGroups.D8_Gateway'),
        image: lowPressureObj[21].fullUrl,
        data: { tag: window.$t('ns_iconGroups.lowVoltageApparatus'), width: 100, height: 100, image: lowPressureObj[21].fullUrl, name: 'gif' },
      },
      {
        name: 'L10',
        image: lowPressureObj[22].fullUrl,
        data: { tag: window.$t('ns_iconGroups.lowVoltageApparatus'), width: 100, height: 100, image: lowPressureObj[22].fullUrl, name: 'gif' },
      },
      {
        name: 'M5_A5',
        image: lowPressureObj[23].fullUrl,
        data: { tag: window.$t('ns_iconGroups.lowVoltageApparatus'), width: 100, height: 100, image: lowPressureObj[23].fullUrl, name: 'gif' },
      },
      {
        name: window.$t('ns_iconGroups.T3Series'),
        image: lowPressureObj[24].fullUrl,
        data: { tag: window.$t('ns_iconGroups.lowVoltageApparatus'), width: 100, height: 100, image: lowPressureObj[24].fullUrl, name: 'gif' },
      },
      {
        name: 'TP_20',
        image: lowPressureObj[25].fullUrl,
        data: { tag: window.$t('ns_iconGroups.lowVoltageApparatus'), width: 100, height: 100, image: lowPressureObj[25].fullUrl, name: 'gif' },
      },
    ],
  }
}
/**
 * icons工具栏配置文件
 */
export const IconGroups = [
  {
    name: window.$t('ns_iconGroups.basicShape'),
    show: true,
    list: [
      {
        name: window.$t('ns_iconGroups.square'),
        icon: 'icon-v5-zhengfangxing',
        data: { graphicID: '1', tag: window.$t('ns_iconGroups.basicShape'), text: window.$t('ns_iconGroups.square'), width: 100, height: 100, name: 'square', form: [{ key: 'text', type: 'text', name: window.$t('ns_iconGroups.text') }] },
      },
      {
        name: window.$t('ns_iconGroups.rectangle'),
        icon: 'icon-v5-changfangxing',
        data: { graphicID: '2', tag: window.$t('ns_iconGroups.basicShape'), text: window.$t('ns_iconGroups.rectangle'), width: 200, height: 50, name: 'rectangle' },
      },
      {
        name: window.$t('ns_iconGroups.circle'),
        icon: 'icon-v5-yuan',
        data: { graphicID: '3', tag: window.$t('ns_iconGroups.basicShape'), text: window.$t('ns_iconGroups.circle'), width: 100, height: 100, name: 'circle' },
      },
      {
        name: window.$t('ns_iconGroups.triangle'),
        icon: 'icon-v5-sanjiaoxing',
        data: { graphicID: '4', tag: window.$t('ns_iconGroups.basicShape'), text: window.$t('ns_iconGroups.triangle'), width: 100, height: 100, name: 'triangle' },
      },
      {
        name: window.$t('ns_iconGroups.rhombus'),
        icon: 'icon-v5-lingxing1',
        data: { graphicID: '5', tag: window.$t('ns_iconGroups.basicShape'), text: window.$t('ns_iconGroups.rhombus'), width: 100, height: 100, name: 'diamond' },
      },
      {
        name: window.$t('ns_iconGroups.pentagon'),
        icon: 'icon-v5-wubianxing',
        data: { graphicID: '6', tag: window.$t('ns_iconGroups.basicShape'), text: window.$t('ns_iconGroups.pentagon'), width: 100, height: 100, name: 'pentagon' },
      },
      {
        name: window.$t('ns_iconGroups.hexagon'),
        icon: 'icon-v5-liubianxing',
        data: { graphicID: '7', tag: window.$t('ns_iconGroups.basicShape'), text: window.$t('ns_iconGroups.hexagon'), width: 100, height: 100, name: 'hexagon' },
      },
      {
        name: window.$t('ns_iconGroups.fivePointedStar'),
        icon: 'icon-v5-wujiaoxing',
        data: { graphicID: '8', tag: window.$t('ns_iconGroups.basicShape'), text: window.$t('ns_iconGroups.fivePointedStar'), width: 100, height: 100, name: 'pentagram' },
      },
      {
        name: window.$t('ns_iconGroups.leftArrow'),
        icon: 'icon-v5-zuojiantou',
        data: { graphicID: '9', tag: window.$t('ns_iconGroups.basicShape'), text: window.$t('ns_iconGroups.leftArrow'), width: 120, height: 60, name: 'leftArrow' },
      },
      {
        name: window.$t('ns_iconGroups.rightArrow'),
        icon: 'icon-v5-youjiantou',
        data: { graphicID: '10', tag: window.$t('ns_iconGroups.basicShape'), text: window.$t('ns_iconGroups.rightArrow'), width: 120, height: 60, name: 'rightArrow' },
      },
      {
        name: window.$t('ns_iconGroups.doubleDirectionalArrow'),
        icon: 'icon-v5-shuangxiangjiantou',
        data: { graphicID: '11', tag: window.$t('ns_iconGroups.basicShape'), text: window.$t('ns_iconGroups.doubleDirectionalArrow'), width: 150, height: 60, name: 'twowayArrow' },
      },
      {
        name: window.$t('ns_iconGroups.line'),
        icon: 'icon-v5-xian',
        data: {
          tag: window.$t('ns_iconGroups.basicShape'),
          anchors: [
            { x: 0, y: 0.5, id: '0' },
            { x: 1, y: 0.5, id: '1' },
          ],
          graphicID: '12',
          width: 200,
          height: 5,
          name: 'rectangle',
          lineWidth: 0,
          background: '#222222',
        },
      },
      {
        name: window.$t('ns_iconGroups.cloud'),
        icon: 'icon-v5-yunduo',
        data: { tag: window.$t('ns_iconGroups.basicShape'), graphicID: '13', text: window.$t('ns_iconGroups.cloud'), width: 100, height: 100, name: 'cloud' },
      },
      {
        name: window.$t('ns_iconGroups.messageBox'),
        icon: 'icon-v5-duihuakuang',
        data: { tag: window.$t('ns_iconGroups.basicShape'), graphicID: '14', textTop: -0.1, text: window.$t('ns_iconGroups.messageBox'), width: 100, height: 100, name: 'message' },
      },
      {
        name: window.$t('ns_iconGroups.file'),
        icon: 'icon-v5-wenjian',
        data: { tag: window.$t('ns_iconGroups.basicShape'), graphicID: '15', text: window.$t('ns_iconGroups.file'), width: 80, height: 100, name: 'file' },
      },
      {
        name: window.$t('ns_iconGroups.text'),
        icon: 'icon-v5-wenben',
        data: { tag: window.$t('ns_iconGroups.basicShape'), graphicID: '16', width: 136, height: 50, name: 'text', fontSize: 24, text: window.$t('pleaseEnter') },
      },
      {
        name: window.$t('ns_iconGroups.picture'),
        icon: 'icon-v5-tupian',
        data: { tag: window.$t('ns_iconGroups.basicShape'), graphicID: '17', width: 100, height: 100, name: 'image', image: '/3d-demo/1p.jpg' },
      },
      {
        name: window.$t('ns_iconGroups.cube'),
        icon: 'icon-v5-lifangti',
        data: {
          tag: window.$t('ns_iconGroups.basicShape'),
          graphicID: '18',
          width: 60,
          height: 100,
          name: 'cube',
          z: 0.25,
          form: [
            { key: 'z', name: 'z', type: 'number', min: 0, step: 0.1, placeholder: window.$t('proportionOfWidthTip') },
            { key: 'backgroundFront', name: window.$t('frontBackgroundColor'), type: 'color' },
            { key: 'backgroundUp', name: window.$t('topBackgroundColor'), type: 'color' },
            { key: 'backgroundRight', name: window.$t('rightBackgroundColor'), type: 'color' },
          ],
        },
      },
      {
        name: window.$t('ns_iconGroups.people'),
        icon: 'icon-v5-ren',
        data: { tag: window.$t('ns_iconGroups.basicShape'), graphicID: '19', width: 70, height: 100, name: 'people' },
      },
      {
        name: window.$t('ns_iconGroups.video'),
        icon: 'icon-v5-shipin',
        data: { tag: window.$t('ns_iconGroups.basicShape'), graphicID: '20', width: 200, height: 200, externElement: true, name: 'video', video: 'https://video.699pic.com/videos/17/69/11/a_aa3jeKZ0D63g1556176911_10s.mp4' },
      },
      {
        name: window.$t('ns_iconGroups.webPage'),
        icon: 'icon-v5-wangye',
        data: { tag: window.$t('ns_iconGroups.basicShape'), graphicID: '21', name: 'iframe', width: 100, height: 100, externElement: true, iframe: 'http://www.baidu.com' },
      },
      {
        name: window.$t('ns_iconGroups.icon'),
        icon: 'icon-v5-icon',
        data: { tag: window.$t('ns_iconGroups.basicShape'), graphicID: '22', name: 'image', width: 80, height: 80, icon: '\ue704', iconFamily: 'icon-v5', lineWidth: 1, fontSize: 12, lineHeight: 1.5, rotate: 0 },
      },
      {
        name: window.$t('ns_iconGroups.archBridge'),
        icon: 'icon-v5-gongqiao',
        data: { tag: window.$t('ns_iconGroups.basicShape'), graphicID: '221', text: '', width: 100, height: 100, icon: '\ue77c', iconFamily: 'icon-v5', name: 'bridge' },
      },
    ],
  },
  getLowPressureConfigurations(),
  {
    name: window.$t('ns_iconGroups.form'),
    show: true,
    list: [
      {
        name: window.$t('ns_iconGroups.table'),
        icon: 'icon-v5-biaoge',
        data: {
          graphicID: '23',
          tag: window.$t('ns_iconGroups.form'),
          name: 'table2',
          width: 0,
          height: 0,
          form: [
            { key: 'data', name: window.$t('tableData'), tag: window.$t('ns_iconGroups.form'), type: 'code', language: 'json', isNotString: true },
            { key: 'styles', name: window.$t('tableStyle'), tag: window.$t('ns_iconGroups.form'), type: 'code', language: 'json', isNotString: true },
          ],
          disableAnchor: true,
          colWidth: 150,
          rowHeight: 40,
          data: [
            [window.$t('deviceId'), window.$t('deviceName'), window.$t('dataProtocol'), window.$t('state'), window.$t('operation')],
            ['1', '200', 'MQTT', window.$t('running'), {}],
            ['2', window.$t('humiditySensor'), 'MQTT', window.$t('running'), {}],
            ['3', window.$t('IoT_Devices'), 'MQTT', window.$t('running'), {}],
            ['4', window.$t('IoT_Devices_SmartHome'), 'MQTT', window.$t('running'), {}],
          ],
          styles: [
            {
              row: 1,
              col: 1,
              color: '#ff0000',
              background: '#ffff00',
              wheres: [
                // 触发条件 成立后才允许配置样式
                { comparison: '<=', value: '123' },
              ],
            },
            { row: 0, height: 60 },
            {
              col: 4,
              width: 200, // 为该列设置额外的节点
              pens: [
                {
                  name: 'rectangle',
                  width: 50,
                  height: 20,
                  text: window.$t('edit'),
                  fontSize: 0.6,
                  disableAnchor: true,
                  activeBackground: '#40a9ff',
                  activeColor: '#40a9ff',
                  background: '#1890ff',
                  color: '#1890ff',
                  hoverBackground: '#40a9ff',
                  hoverColor: '#40a9ff',
                  textColor: '#ffffff',
                  hoverTextColor: '#ffffff',
                  activeTextColor: '#ffffff',
                  events: [{ action: 5, name: 'click', value: 'alert("edit")' }],
                },
                {
                  name: 'rectangle',
                  width: 80,
                  height: 20,
                  text: window.$t('realTimeData'),
                  fontSize: 0.6,
                  disableAnchor: true,
                  activeBackground: '#40a9ff',
                  activeColor: '#40a9ff',
                  background: '#1890ff',
                  color: '#1890ff',
                  hoverBackground: '#40a9ff',
                  hoverColor: '#40a9ff',
                  textColor: '#ffffff',
                  hoverTextColor: '#ffffff',
                  activeTextColor: '#ffffff',
                  events: [{ action: 5, name: 'click', value: 'alert("realTimeData")' }],
                },
              ],
            },
          ],
        },
      },
      {
        name: window.$t('checkBox'),
        icon: 'icon-v5-duoxuankuang',
        data: {
          tag: window.$t('ns_iconGroups.form'),
          graphicID: '24',
          name: 'checkbox',
          width: 100,
          height: 30,
          fontSize: 16,
          disableAnchor: true,
          direction: 'vertical',
          checked: true,
          // isForbidden: true,
          value: window.$t('option1'),
          form: [
            { key: 'checked', name: window.$t('ns_eventType.active'), type: 'switch' },
            { key: 'isForbidden', name: window.$t('isItDisabled'), type: 'switch' },
            { key: 'value', name: window.$t('optionValue'), type: 'text' },
          ],
        },
      },
      {
        name: window.$t('radio'),
        icon: 'icon-v5-danxuankuang',
        data: {
          tag: window.$t('ns_iconGroups.form'),
          graphicID: '25',
          name: 'radio',
          width: 150,
          height: 30,
          disableAnchor: true,
          direction: 'horizontal', // 'vertical', //'horizontal',
          form: [
            { key: 'options', name: window.$t('option'), type: 'code', language: 'json', isNotString: true },
            {
              key: 'direction',
              name: window.$t('direction'),
              type: 'select',
              options: [
                { label: window.$t('horizontal'), value: 'horizontal' },
                { label: window.$t('vertical'), value: 'vertical' },
              ],
            },
            { key: 'checked', name: window.$t('options'), type: 'text' },
          ],
          options: [{ text: 'option1', isForbidden: true }, { text: 'option2' }, { text: 'option3' }],
          checked: 'option2',
        },
      },
      {
        name: window.$t('ns_iconGroups.switch'),
        icon: 'icon-v5-kaiguan',
        data: {
          tag: window.$t('ns_iconGroups.form'),
          graphicID: '26',
          name: 'switch',
          disableAnchor: true,
          height: 30,
          width: 60,
          checked: true,
          offColor: '#BFBFBF',
          onColor: '#1890ff',
          disableOffColor: '#E5E5E5',
          disableOnColor: '#A3D3FF',
          hoverBackground: '#40a9ff',
          form: [{ key: 'checked', name: window.$t('switchStatus'), type: 'switch' }],
        },
      },
      {
        name: window.$t('ns_iconGroups.progressBar'),
        icon: 'icon-v5-jindutiao',
        data: {
          tag: window.$t('ns_iconGroups.form'),
          graphicID: '27',
          anchors: [],
          disableAnchor: true,
          name: 'slider',
          x: 400,
          y: 400,
          width: 300,
          height: 20,
          value: 10,
          textWidth: 50,
          barHeight: 4, // 修改无效
          min: 0,
          max: 100,
          color: '#1890ff',
          background: '#D4D6D9',
          textColor: '#222222',
          unit: '%',
          form: [
            // TODO 添加最大最小
            { key: 'value', name: window.$t('currentProgressValue'), type: 'number', min: 0, max: 100 },
            { key: 'unit', name: window.$t('displayUnit'), type: 'text' },
            { key: 'textColor', name: window.$t('textColor'), type: 'color' },
          ],
        },
      },
      {
        name: window.$t('ns_iconGroups.button'),
        icon: 'icon-v5-anniu',
        data: {
          tag: window.$t('ns_iconGroups.form'),
          graphicID: '28',
          name: 'rectangle',
          x: 300,
          y: 200,
          width: 80,
          height: 30,
          disableAnchor: true,
          borderRadius: 2,
          text: window.$t('ns_iconGroups.button'),
          activeBackground: '#40a9ff',
          activeColor: '#40a9ff',
          background: '#1890ff',
          color: '#1890ff',
          hoverBackground: '#40a9ff',
          hoverColor: '#40a9ff',
          textColor: '#ffffff',
          hoverTextColor: '#ffffff',
          activeTextColor: '#ffffff',
        },
      },
      {
        name: window.$t('inputBox'),
        icon: 'icon-v5-shurukuang',
        data: {
          tag: window.$t('ns_iconGroups.form'),
          graphicID: '29',
          x: 100,
          y: 100,
          height: 40,
          width: 200,
          disableAnchor: true,
          name: 'rectangle',
          borderRadius: 0.05,
          input: true,
          ellipsis: true,
          text: window.$t('enterData'),
          textAlign: 'left',
          color: '#ffffff',
          textColor: '#ffffff',
          hoverTextColor: '#ffffff',
          activeTextColor: '#ffffff',
          textLeft: 10,
        },
      },
      {
        name: window.$t('ns_iconGroups.selector'),
        icon: 'icon-v5-xialakuang',
        data: {
          tag: window.$t('ns_iconGroups.form'),
          graphicID: '30',
          x: 100,
          y: 100,
          height: 50,
          width: 200,
          name: 'rectangle',
          borderRadius: 0.05,
          ellipsis: true,
          text: 'option1',
          textAlign: 'left',
          color: '#ffffff',
          textColor: '#ffffff',
          hoverTextColor: '#ffffff',
          activeTextColor: '#ffffff',
          textLeft: 10,
          dropdownList: [
            { text: 'option1', background: '#ff0000' },
            { text: 'option2', background: '#00ff00' },
            { text: 'option3', background: '#0000ff' },
          ],
        },
      },
      {
        name: window.$t('time'),
        icon: 'icon-v5-shijian',
        data: {
          tag: window.$t('ns_iconGroups.form'),
          graphicID: '31',
          name: 'time',
          x: 100,
          y: 100,
          width: 300,
          height: 40,
          text: window.$t('currentTime'),
          lineWidth: 0,
          fillZero: true,
          timeFormat: '`${year}-${month}-${day} ${hours}:${minutes}:${seconds} 星期${week}`',
        },
      },
    ],
  },
  {
    name: window.$t('ns_iconGroups.BrainMap'),
    show: true,
    list: [
      {
        name: window.$t('theme'),
        icon: 'icon-v5-zhuti',
        data: { tag: window.$t('ns_iconGroups.BrainMap'), graphicID: '32', text: window.$t('theme'), width: 200, height: 50, name: 'mindNode', borderRadius: 0.5 },
      },
      {
        name: window.$t('subtopic'),
        icon: 'icon-v5-zizhuti',
        data: { tag: window.$t('ns_iconGroups.BrainMap'), graphicID: '33', text: window.$t('subtopic'), width: 160, height: 40, name: 'mindLine' },
      },
    ],
  },
  {
    name: window.$t('ns_iconGroups.flowChart'),
    show: true,
    list: [
      {
        name: window.$t('startOrEnd'),
        icon: 'icon-v5-kaishi1',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '34', text: window.$t('startOrEnd'), width: 120, height: 40, borderRadius: 0.5, name: 'rectangle' },
      },
      {
        name: window.$t('ns_iconGroups.flow'),
        icon: 'icon-v5-liucheng',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '35', text: window.$t('ns_iconGroups.flow'), width: 120, height: 40, name: 'rectangle' },
      },
      {
        name: window.$t('ns_iconGroups.judge'),
        icon: 'icon-v5-panding',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '36', text: window.$t('ns_iconGroups.judge'), width: 120, height: 60, name: 'diamond' },
      },
      {
        name: window.$t('data'),
        icon: 'icon-v5-shuju',
        data: {
          tag: window.$t('ns_iconGroups.flowChart'),
          graphicID: '37',
          text: window.$t('data'),
          width: 120,
          height: 50,
          name: 'flowData',
          offsetX: 0.14,
          form: [{ key: 'offsetX', name: window.$t('slope'), type: 'number', min: 0, step: 0.1, placeholder: window.$t('proportionOfWidthTip') }],
        },
      },
      {
        name: window.$t('ns_iconGroups.prepare'),
        icon: 'icon-v5-zhunbei',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '38', text: window.$t('ns_iconGroups.prepare'), width: 120, height: 50, name: 'hexagon' },
      },
      {
        name: window.$t('ns_iconGroups.subProcess'),
        icon: 'icon-v5-ziliucheng',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '39', text: window.$t('ns_iconGroups.subProcess'), width: 120, height: 50, name: 'flowSubprocess' },
      },
      {
        name: window.$t('ns_iconGroups.database'),
        icon: 'icon-v5-shujuku',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '40', text: window.$t('ns_iconGroups.database'), width: 80, height: 120, name: 'flowDb' },
      },
      {
        name: window.$t('ns_iconGroups.document'),
        icon: 'icon-v5-wendang',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '41', text: window.$t('ns_iconGroups.document'), width: 120, height: 100, name: 'flowDocument' },
      },
      {
        name: window.$t('ns_iconGroups.internalStorage'),
        icon: 'icon-v5-neibuchucun',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '42', text: window.$t('ns_iconGroups.internalStorage'), width: 120, height: 80, name: 'flowInternalStorage' },
      },
      {
        name: window.$t('ns_iconGroups.externalStorage'),
        icon: 'icon-v5-waibuchucun',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '43', text: window.$t('ns_iconGroups.externalStorage'), width: 120, height: 80, name: 'flowExternStorage' },
      },
      {
        name: window.$t('ns_iconGroups.queue'),
        icon: 'icon-v5-duilie',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '44', text: window.$t('ns_iconGroups.queue'), width: 100, height: 100, name: 'flowQueue' },
      },
      {
        name: window.$t('ns_iconGroups.ManualInput'),
        icon: 'icon-v5-shoudongshuru',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '45', text: window.$t('ns_iconGroups.ManualInput'), width: 120, height: 80, name: 'flowManually' },
      },
      {
        name: window.$t('ns_iconGroups.display'),
        icon: 'icon-v5-zhanshi',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '46', text: window.$t('ns_iconGroups.display'), width: 120, height: 80, name: 'flowDisplay' },
      },
      {
        name: window.$t('ns_iconGroups.flowParallel'),
        icon: 'icon-v5-binghangmoshi',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '47', text: window.$t('ns_iconGroups.flowParallel'), width: 120, height: 50, name: 'flowParallel' },
      },
      {
        name: window.$t('ns_iconGroups.flowComment'),
        icon: 'icon-v5-zhushi',
        data: { tag: window.$t('ns_iconGroups.flowChart'), graphicID: '48', text: window.$t('ns_iconGroups.flowComment'), width: 100, height: 100, name: 'flowComment' },
      },
    ],
  },
  {
    name: window.$t('ns_iconGroups.activityDiagram'),
    show: true,
    list: [
      {
        name: window.$t('begin'),
        icon: 'icon-v5-kaishi',
        data: { tag: window.$t('ns_iconGroups.activityDiagram'), graphicID: '49', text: '', width: 30, height: 30, name: 'circle', background: '#fff', lineWidth: 0 },
      },
      {
        name: window.$t('finish'),
        icon: 'icon-v5-jieshu',
        data: { tag: window.$t('ns_iconGroups.activityDiagram'), graphicID: '50', width: 30, height: 30, name: 'activityFinal' },
      },
      {
        name: window.$t('activity'),
        icon: 'icon-v5-huodong',
        data: { tag: window.$t('ns_iconGroups.activityDiagram'), graphicID: '51', text: window.$t('activity'), width: 120, height: 50, borderRadius: 0.25, name: 'rectangle' },
      },
      {
        name: window.$t('ns_iconGroups.diamond'),
        icon: 'icon-v5-juecehebing',
        data: { tag: window.$t('ns_iconGroups.activityDiagram'), graphicID: '52', text: window.$t('ns_iconGroups.diamond'), width: 120, height: 50, name: 'diamond' },
      },
      {
        name: window.$t('ns_iconGroups.swimlaneV'),
        icon: 'icon-v5-chuizhiyongdao',
        data: { tag: window.$t('ns_iconGroups.activityDiagram'), graphicID: '53', text: window.$t('ns_iconGroups.swimlaneV'), width: 200, height: 500, name: 'swimlaneV', textBaseline: 'top', textTop: 20, lineTop: 0.08 },
      },
      {
        name: window.$t('ns_iconGroups.swimlaneH'),
        icon: 'icon-v5-shuipingyongdao',
        data: { tag: window.$t('ns_iconGroups.activityDiagram'), graphicID: '54', text: window.$t('ns_iconGroups.swimlaneH'), width: 500, height: 200, name: 'swimlaneH', textWidth: 0.01, textLeft: 0.04, textAlign: 'left', lineLeft: 0.08 },
      },
      {
        name: window.$t('ns_iconGroups.forkV'),
        icon: 'icon-v5-chuizhifencha',
        data: { tag: window.$t('ns_iconGroups.activityDiagram'), graphicID: '55', text: window.$t('ns_iconGroups.forkV'), width: 10, height: 150, name: 'forkV', fillStyle: '#555', strokeStyle: 'transparent' },
      },
      {
        name: window.$t('ns_iconGroups.forkH'),
        icon: 'icon-v5-shuipingfencha',
        data: { tag: window.$t('ns_iconGroups.activityDiagram'), graphicID: '56', text: window.$t('ns_iconGroups.forkH'), width: 150, height: 10, name: 'forkH', fillStyle: '#555', strokeStyle: 'transparent' },
      },
    ],
  },
  {
    name: window.$t('ns_iconGroups.sequenceAndClassDiagram'),
    show: true,
    list: [
      {
        name: window.$t('ns_iconGroups.lifeline'),
        icon: 'icon-v5-shengmingxian',
        data: { tag: window.$t('ns_iconGroups.sequenceAndClassDiagram'), graphicID: '57', text: window.$t('ns_iconGroups.lifeline'), width: 150, height: 400, textHeight: 50, name: 'lifeline' },
      },
      {
        name: window.$t('ns_iconGroups.sequenceFocus'),
        icon: 'icon-v5-jihuo',
        data: { tag: window.$t('ns_iconGroups.sequenceAndClassDiagram'), graphicID: '58', text: window.$t('ns_iconGroups.sequenceFocus'), width: 12, height: 200, name: 'sequenceFocus' },
      },
      {
        name: window.$t('ns_iconGroups.simpleClass'),
        icon: 'icon-v5-jiandanlei',
        data: {
          tag: window.$t('ns_iconGroups.sequenceAndClassDiagram'),
          graphicID: '59',
          text: 'Topolgoy',
          width: 270,
          height: 200,
          textHeight: 200,
          name: 'simpleClass',
          textAlign: 'center',
          textBaseline: 'top',
          textTop: 10,
          list: [{ text: '- name: string\n+ setName(name: string): void' }],
        },
      },
      {
        name: window.$t('ns_iconGroups.class'),
        icon: 'icon-v5-lei',
        data: {
          tag: window.$t('ns_iconGroups.sequenceAndClassDiagram'),
          graphicID: '60',
          text: 'Topolgoy',
          width: 270,
          height: 200,
          textHeight: 200,
          name: 'interfaceClass',
          textAlign: 'center',
          textBaseline: 'top',
          textTop: 10,
          list: [{ text: '- name: string' }, { text: '+ setName(name: string): void' }],
        },
      },
    ],
  },
  {
    name: window.$t('ns_iconGroups.specialElements'),
    show: true,
    list: [
      {
        name: window.$t('ns_iconGroups.thermometer'),
        icon: 'icon-v5-wenduji--copy',
        data: {
          tag: window.$t('ns_iconGroups.specialElements'),
          name: 'thermometer',
          width: 100,
          height: 300,
          disableAnchor: !0,
          color: '#4583FF',
          textColor: '#fff',
          background: '#FF5D3C33',
          activeBackground: '#FF5D3C',
          value: 10,
          min: -20,
          max: 20,
          form: [
            { key: 'value', name: window.$t('temperature'), type: 'number' },
            { key: 'min', name: window.$t('minValue'), type: 'number' },
            { key: 'max', name: window.$t('maxValue'), type: 'number' },
          ],
        },
      },
      {
        name: window.$t('ns_iconGroups.thermometer') + '1',
        icon: 'icon-v5-wenduji-',
        data: {
          tag: window.$t('ns_iconGroups.specialElements'),
          name: 'thermometer1',
          width: 200,
          height: 300,
          disableAnchor: !0,
          backgroundColor: '#666',
          value: 0,
          min: -20,
          max: 20,
          markColor: '#fff',
          barrelColor: '#624',
          barrelShowColor: '#d26',
          fontColor: '#fff',
          sub: 5,
          barrel: { x: 0.3, y: 0.2, width: 0.2, height: 7 / 9 },
          form: [
            { key: 'value', name: window.$t('temperature'), type: 'number' },
            { key: 'min', name: window.$t('minValue'), type: 'number' },
            { key: 'max', name: window.$t('maxValue'), type: 'number' },
            { key: 'backgroundColor', name: window.$t('backgroundColor'), type: 'color' },
            { key: 'markColor', name: window.$t('scaleColor'), type: 'color' },
            { key: 'barrelColor', name: window.$t('temperatureColumnBackgroundColor'), type: 'color' },
            { key: 'barrelShowColor', name: window.$t('temperatureColumnHighlightColor'), type: 'color' },
            { key: 'fontColor', name: window.$t('fontColor'), type: 'color' },
            { key: 'sub', name: window.$t('minInterval'), type: 'number' },
          ],
        },
      },
      {
        name: window.$t('ns_iconGroups.waterLevel'),
        icon: 'icon-v5-shuiwei',
        data: {
          tag: window.$t('ns_iconGroups.specialElements'),
          name: 'waterTank',
          width: 100,
          height: 100,
          disableAnchor: !0,
          color: '#FFFFFF00',
          progress: 0.5,
          progressColor: '#00a9e6',
          form: [
            { key: 'progress', name: window.$t('progress'), type: 'number', step: 0.1, max: 1, min: 0 },
            { key: 'progressColor', name: window.$t('progressColor'), type: 'color' },
          ],
        },
      },
      {
        name: window.$t('ns_iconGroups.waterFlowDetector'),
        icon: 'icon-v5-shuiliujianceqi',
        data: {
          tag: window.$t('ns_iconGroups.specialElements'),
          name: 'watermeter',
          width: 100,
          height: 100,
          disableAnchor: !0,
          background: '#faad14',
          value: 50,
          max: 70,
          min: 20,
          maxBackground: '#f5222d',
          minBackground: '#52c41a',
          scaleShow: !1,
          form: [
            { key: 'value', name: window.$t('flowValue'), type: 'number' },
            { key: 'max', name: window.$t('maxValue'), type: 'number' },
            { key: 'min', name: window.$t('minValue'), type: 'number' },
            { key: 'maxBackground', name: window.$t('maxBackground'), type: 'color' },
            { key: 'minBackground', name: window.$t('minBackground'), type: 'color' },
            { key: 'scaleShow', name: window.$t('scaleShow'), type: 'switch' },
            { key: 'maxText', name: window.$t('maxText'), type: 'text' },
            { key: 'minText', name: window.$t('minText'), type: 'text' },
          ],
        },
      },
      {
        name: window.$t('ns_iconGroups.pilotlamp'),
        icon: 'icon-v5-gongyezujian-zhishideng',
        data: {
          tag: window.$t('ns_iconGroups.specialElements'),
          name: 'indicatorLight',
          width: 100,
          height: 100,
          displayStatus: 0,
          background: '#5ac8f7',
          color: '#5ac8f7',
          hiddenText: !0,
          onColor: '#00FF7F',
          form: [
            {
              key: 'displayStatus',
              name: window.$t('displayStatus'),
              type: 'select',
              options: [
                { label: window.$t('default'), value: 0 },
                { label: window.$t('square'), value: 1 },
                { label: window.$t('round'), value: 2 },
              ],
            },
          ],
          frames: [
            { background: '#f53e6c', color: '#f53e6c', bkType: 0, duration: 200, strokeType: 0, visible: !0 },
            { background: '#5ac8f7', color: '#5ac8f7', bkType: 0, duration: 200, strokeType: 0, visible: !0 },
          ],
          animateType: 'custom',
        },
      },
      {
        name: window.$t('ns_iconGroups.KnifeSwitch'),
        icon: 'icon-v5-zhadao',
        data: {
          tag: window.$t('ns_iconGroups.specialElements'),
          name: 'knifeSwitch',
          width: 100,
          height: 100,
          switch: !1,
          color: '#0AECA140',
          background: '#748E9140',
          form: [{ key: 'switch', name: window.$t('ns_iconGroups.switch'), type: 'switch' }],
          events: [{ action: 5, name: 'click', value: 'window.meta2d.setValue({id:pen.id,switch:!pen.switch});' }],
        },
      },
      {
        name: window.$t('ns_iconGroups.ToggleSwitch'),
        icon: 'icon-v5-bodongkaiguan',
        data: {
          tag: window.$t('ns_iconGroups.specialElements'),
          name: 'toggleSwitch',
          width: 100,
          height: 100,
          switch: !1,
          color: '#0AECA140',
          background: '#748E9140',
          form: [{ key: 'switch', name: window.$t('ns_iconGroups.switch'), type: 'switch' }],
          events: [{ action: 5, name: 'click', value: 'window.meta2d.setValue({id:pen.id,switch:!pen.switch});window.meta2d.render()' }],
        },
      },
      {
        name: window.$t('ns_iconGroups.AirSwitch'),
        icon: 'icon-v5-kongkai',
        data: {
          tag: window.$t('ns_iconGroups.specialElements'),
          name: 'airSwitch',
          width: 180,
          height: 240,
          switch: !0,
          color: '#748E9173',
          background: '#748E9140',
          form: [{ key: 'switch', name: window.$t('ns_iconGroups.switch'), type: 'switch' }],
        },
      },
    ],
  },
]

/**
 *  icons工具栏配置文件所有图形的文本和icon映射
 */
export const iconMap = IconGroups.reduce((pre, cur) => {
  const obj = cur.list.reduce((p, c) => {
    if (Array.isArray(c.data) && c.data.graphicId) {
      const title = c.data.graphicId
      p[title] = {
        title: title,
        icon: 'icon-v5-pic-down',
      }
    } else {
      if (c && c.data && c.data.graphicID) {
        p[c.data.graphicID] = { title: c.name, icon: c.icon }
      }
    }
    return p
  }, {})
  pre = { ...pre, ...obj }
  return pre
}, {})

// 根据name来取title和icon， 为上面的graphicID的兜底
export const nameIconMap = IconGroups.reduce((pre, cur) => {
  const obj = cur.list.reduce((p, c) => {
    if (c.data.name === 'image' || c.data.name === 'gif') {
      p[c.data.name] = { title: window.$t('ns_iconGroups.picture'), icon: 'icon-v5-tupian' }
    } else {
      if (c.data.name) {
        p[c.data.name] = { title: c.name, icon: c.icon }
      }
    }
    return p
  }, {})
  pre = { ...pre, ...obj }
  return pre
}, {})

/**
 * 连线类型
 */
export const LineType = {
  polyline: { text: window.$t('ns_lineType.polyline'), icon: 'icon-v5-line2' },
  curve: { text: window.$t('ns_lineType.curve'), icon: 'icon-v5-clue' },
  line: { text: window.$t('ns_lineType.line'), icon: 'icon-v5-line' },
  mind: { text: window.$t('ns_lineType.mind'), icon: 'icon-v5-curve' },
}

export const connectLineOptions = [
  { label: window.$t('ns_iconGroups.line'), value: 'line' },
  { label: window.$t('ns_iconGroups.triangle'), value: 'triangle' },
  { label: window.$t('ns_iconGroups.rhombus'), value: 'diamond' },
  { label: window.$t('ns_iconGroups.circle'), value: 'circle' },
  { label: window.$t('ns_iconGroups.triangleSolid'), value: 'triangleSolid' },
  { label: window.$t('ns_iconGroups.diamondSolid'), value: 'diamondSolid' },
  { label: window.$t('ns_iconGroups.circleSolid'), value: 'circleSolid' },
  { label: window.$t('ns_iconGroups.lineUp'), value: 'lineUp' },
  { label: window.$t('ns_iconGroups.lineDown'), value: 'lineDown' },
]

export const lineDashOptions = [
  { value: '', label: '________' },
  { value: '5, 5', label: '-------------' },
  { value: '10, 10', label: '—— —— ' },
  { value: '10, 10, 2, 10', label: '—— . —— .' },
]

// 文件下载
export const downloadFile = (fileUrl, fileName = new Date().valueOf().toString()) => {
  fetch(fileUrl).then(res =>
    res.blob().then(blob => {
      let a = document.createElement('a')
      let url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    })
  )
}

export const whiteSpaceOptions = [
  { label: window.$t('default'), value: 'nowrap' },
  { label: window.$t('nowrap'), value: 'nowrap' },
  { label: window.$t('pre_line'), value: 'pre-line' },
  { label: window.$t('break_all'), value: 'break-all' },
]

export const dashOptions = [
  { label: window.$t('ns_lineType.line'), value: 0 },
  { label: window.$t('ns_lineStyle.dash'), value: 1 },
  { label: window.$t('ns_lineStyle.dotted'), value: 2 },
]

export const lineNameOptions = [
  { label: window.$t('ns_lineType.curve'), value: 'curve' },
  { label: window.$t('ns_lineType.polyline'), value: 'polyline' },
  { label: window.$t('ns_lineType.line'), value: 'line' },
  { label: window.$t('ns_lineType.mind'), value: 'mind' },
]

export const lineCapOptions = [
  { label: window.$t('default'), value: 'butt' },
  { label: window.$t('round'), value: 'round' },
  { label: window.$t('square'), value: 'square' },
]

export const lineJoinOptions = [
  { label: window.$t('default'), value: 'miter' },
  { label: window.$t('round'), value: 'round' },
  { label: window.$t('bevel'), value: 'bevel' },
]

export const fontStyleOptions = [
  { value: 'normal', label: window.$t('normal') },
  { value: 'italic', label: window.$t('italic') },
]

export const fontWeightOptions = [
  { value: '300', label: window.$t('normal') },
  { value: '700', label: window.$t('bold') },
]

export const textAlignOptions = [
  { label: window.$t('leftAlignment'), value: 'left' },
  { label: window.$t('centerAlignment'), value: 'center' },
  { label: window.$t('rightAlignment'), value: 'right' },
]

export const textBaselineOptions = [
  { label: window.$t('topAlignment'), value: 'top' },
  { label: window.$t('centerAlignment'), value: 'center' },
  { label: window.$t('bottomAlignment'), value: 'bottom' },
]

export const fontFamilyOptions = [
  { label: window.$t('Verdana'), value: '宋体' },
  { label: window.$t('BoldFont'), value: '黑体' },
]

export const strokeTypeOptions = [
  { label: window.$t('nothing'), value: '0' },
  { label: window.$t('linearGradient'), value: '1' },
]
