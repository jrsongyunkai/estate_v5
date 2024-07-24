import InputNumberRange from './InputNumberRange.vue'
import MTrend from './MTrend'
import MImage from './MImage'
import MKindDatePick from './MKindDatePick'
import AuthButton from './AuthButton'
import DeviceTable from './DeviceTable.vue'
import DevicePickerModal from './DevicePickerModal.vue'
import YearRangePicker from './YearRangePicker.vue'
import ProTable from './ProTable.vue'
import Pro808Table from './Pro808Table.vue'
import ToolModal from './ToolModal.vue'
import OperationCheckAuth from './OperationCheckAuth.vue'
import MCountUp from './MCountUp.vue'
import MForm from './MForm/index.vue'
import GroupPick from './GroupPick.vue'
import GroupPickModal from './GroupPickModal.vue'
import TooltipVue from './ToolTip.vue'
import ScrollSpy from './ScrollSpy.vue'
import EditableText from './EditableText.vue'
import WebRTCStreamer from './WebRTCStreamer'
import ToggleIcon from './ToggleIcon.vue'
import ToggleFullscreen from './ToggleFullscreen.vue'
import YSPlayer from './YSPlayer.vue'
import DateRangePicker from './DateRangePicker.vue'
import iLink from './ILink.vue'
import iFrame from './IFrame.vue'
import dbLoading from './DbLoading.vue'
import MTable from './MTable/index.vue'
import MoneyInput from './MoneyInput.vue'
import { ELPCascader, ELPCascaderPanel } from './elp-cascader/index'
import { Form, FormItem, Poptip } from './iview-pro'
import BizModalContext from './BizModalContext.vue'

export default {
  install(Vue) {
    // 注册全局组件
    Vue.component('InputNumberRange', InputNumberRange)
    Vue.component('MTrend', MTrend)
    Vue.component('MImage', MImage)
    Vue.component('MKindDatePick', MKindDatePick)
    Vue.component('AuthButton', AuthButton)
    Vue.component('DeviceTable', DeviceTable)
    Vue.component('DevicePickerModal', DevicePickerModal)
    Vue.component('YearRangePicker', YearRangePicker)
    Vue.component('ProTable', ProTable)
    Vue.component('Pro808Table', Pro808Table)
    Vue.component('ToolModal', ToolModal)
    Vue.component('OperationCheckAuth', OperationCheckAuth)
    Vue.component('MCountUp', MCountUp)
    Vue.component('MForm', MForm)
    Vue.component('GroupPick', GroupPick)
    Vue.component('ScrollSpy', ScrollSpy)
    Vue.component('GroupPickModal', GroupPickModal)
    Vue.component('TooltipVue', TooltipVue)
    Vue.component('DateRangePicker', DateRangePicker)
    Vue.component('EditableText', EditableText)
    Vue.component('WebRTCStreamer', WebRTCStreamer)
    Vue.component('ToggleIcon', ToggleIcon)
    Vue.component('ToggleFullscreen', ToggleFullscreen)
    Vue.component('YSPlayer', YSPlayer)
    Vue.component('i-link', iLink)
    Vue.component('i-frame', iFrame)
    Vue.component('db-loading', dbLoading)
    Vue.component('Table', MTable)
    Vue.component('MoneyInput', MoneyInput)
    Vue.component('ELPCascader', ELPCascader)
    Vue.component('ELPCascaderPanel', ELPCascaderPanel)
    Vue.component('Form', Form)
    Vue.component('FormItem', FormItem)
    Vue.component('BizModalContext', BizModalContext)
    Vue.component('Poptip', Poptip)
  },
}
