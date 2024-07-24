import { cameraPTZControl } from '@api/console/device'

const getPTZCmdConfig = cmd => {
  const speed = 60
  const PTZConfig = {
    up: {
      pan: 0,
      tilt: speed,
      zoom: 0,
    },
    down: {
      pan: 0,
      tilt: -speed,
      zoom: 0,
    },
    left: {
      pan: -speed,
      tilt: 0,
      zoom: 0,
    },
    right: {
      pan: speed,
      tilt: 0,
      zoom: 0,
    },
    zoomIn: {
      pan: 0,
      tilt: 0,
      zoom: speed,
    },
    zoomOut: {
      pan: 0,
      tilt: 0,
      zoom: -speed,
    },
    stop: {
      pan: 0,
      tilt: 0,
      zoom: 0,
    },
  }

  return PTZConfig[cmd]
}

export const localPTZControl = ({ cmd, mac, channelNo }) => {
  const config = getPTZCmdConfig(cmd)
  return cameraPTZControl({
    mac,
    channelNo,
    ...config,
  })
}
