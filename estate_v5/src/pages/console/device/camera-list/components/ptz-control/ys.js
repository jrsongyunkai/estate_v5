import axios from 'axios'
import qs from 'qs'

const PTZ_CONTROL_START_URL = 'https://open.ys7.com/api/lapp/device/ptz/start'
const PTZ_CONTROL_STOP_URL = 'https://open.ys7.com/api/lapp/device/ptz/stop'

const DIRECTION_MAP = {
  up: 0,
  down: 1,
  left: 2,
  right: 3,
  zoomIn: 8,
  zoomOut: 9,
}

export const ysPTZControl = ({ cmd, mac, channelNo, accessToken }) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const commonParams = {
    accessToken,
    deviceSerial: mac,
    channelNo,
  }
  const url = cmd === 'stop' ? PTZ_CONTROL_STOP_URL : PTZ_CONTROL_START_URL
  const params = cmd === 'stop' ? commonParams : { ...commonParams, direction: DIRECTION_MAP[cmd], speed: 1 }

  return axios({
    method: 'post',
    url,
    headers,
    data: qs.stringify(params),
  })
}
