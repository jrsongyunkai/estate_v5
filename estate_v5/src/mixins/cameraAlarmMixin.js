import { openPIP } from '@/pages/console/device/camera-list/components/picture-in-picture'

export default {
  mounted() {
    window.addEventListener('onmessageWS', this.onCameraAlarmMessage)
  },
  beforeDestroy() {
    window.removeEventListener('onmessageWS', this.onCameraAlarmMessage)
  },
  methods: {
    onCameraAlarmMessage(e) {
      if (!e.detail.data) return
      const res = JSON.parse(e.detail.data)
      if (!res.data) return
      const { msgType, dataList } = res.data
      if (msgType !== 1) return
      dataList.forEach(async item => {
        const { mac, node, info, valueDescribe } = item
        if (!valueDescribe || valueDescribe.channelNo === undefined) return
        const currentChannelNo = valueDescribe.channelNo
        const channelInfo = {
          mac,
          channel: currentChannelNo,
        }
        const sizeFactor = 0.6
        const locationFactor = (1 - sizeFactor) / 2
        const w = window.innerWidth * sizeFactor
        const h = (w / 16) * 9
        const x = window.innerWidth * locationFactor
        const y = (window.innerHeight - h) / 2
        openPIP({
          w,
          h,
          x,
          y,
          data: {
            accessType: 'ys',
            name: `${mac}-${node}发生${info}`,
            channels: [channelInfo],
            currentChannelNo,
          },
        })
      })
    },
  },
}
