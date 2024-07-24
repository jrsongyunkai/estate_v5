import { getChannelData } from '@/api/multiManage/diagram'
export default {
  data() {
    return {
      macAddrs: [],
      attrMap: {},
    }
  },
  methods: {
    processAndRenderData(data) {
      if (window.meta2d && data && data.length > 0) {
        const nodeData = window.meta2d.data()
        nodeData.pens.forEach(node => {
          const attr = this.attrMap[node.id]
          const dataInfo = data.find(v => v.resId === node.resId && v.addr === node.addr)
          if (attr && dataInfo) {
            if (node.name === 'text') {
              window.meta2d.setValue({ id: node.id, text: dataInfo[attr] })
            } else if (node.tag === this.$t('ns_iconGroups.lowVoltageApparatus') && node.name === 'combine') {
              // 低压电器的组合才要做切换
              window.meta2d.setValue({ id: node.id, showChild: dataInfo.oc ? 1 : 0 })
            }
          }
        })
      }
    },
    async loop() {
      if (this.macAddrs.length > 0) {
        const res = await getChannelData({ target: this.macAddrs, projectCode: this.projectCode })
        if (res.success) {
          this.processAndRenderData(res.data)
        } else {
          this.$message.error(res.message)
        }
      }
    },
    setViewSize() {
      const contentBox = document.querySelector('.i-layout-content-with-tabs-fix .i-layout-content-main')
      if (contentBox) {
        contentBox.style.margin = '1px'
        contentBox.style.marginTop = '61px'
        document.querySelector('.i-layout-content-with-tabs-fix .i-layout-content-main .content-diagram').style.height = 'calc(100vh - 122px)'
      }
    },
    reSetViewSize() {
      const contentBox = document.querySelector('.i-layout-content-with-tabs-fix .i-layout-content-main')
      if (contentBox) {
        contentBox.style.margin = '12px'
        contentBox.style.marginTop = '70px'
        document.querySelector('.i-layout-content-with-tabs-fix .i-layout-content-main .content-diagram').style.height = 'calc(100vh - 142px)'
      }
    },
  },
}
