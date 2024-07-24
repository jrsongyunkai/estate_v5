import Vue from 'vue'
import XEUtils from 'xe-utils'
import { VXETable, Icon, Column, Table, Colgroup, Footer } from 'vxe-table'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'

VXETable.config({
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args),
})

// 可选组件
Vue.use(Icon).use(Column).use(Table).use(Colgroup).use(Footer)
