export const SIGNAL_TYPE = {
  UNKNOWN: 0,
  ETHERNET: 1,
  NETWORK_4G: 2,
  WIFI: 3,
}

export const SIGNAL_TYPE_NAME = {
  [SIGNAL_TYPE.UNKNOWN]: window.$t('unknown2'),
  [SIGNAL_TYPE.ETHERNET]: window.$t('ethernetPort'),
  [SIGNAL_TYPE.NETWORK_4G]: '4G',
  [SIGNAL_TYPE.WIFI]: 'WIFI',
}

export const SIGNAL_TYPE_ICON = {
  [SIGNAL_TYPE.UNKNOWN]: 'unknown',
  [SIGNAL_TYPE.ETHERNET]: 'ethernet',
  [SIGNAL_TYPE.NETWORK_4G]: '4G',
  [SIGNAL_TYPE.WIFI]: 'wifi',
}

export const SIGNAL_LEVEL = {
  NONE: 0,
  POOR: 1,
  MODERATE: 2,
  GOOD: 3,
  GREAT: 4,
}

export const SIGNAL_LEVEL_NAME = {
  [SIGNAL_LEVEL.NONE]: window.$t('nothing'),
  [SIGNAL_LEVEL.POOR]: window.$t('Poor'),
  [SIGNAL_LEVEL.MODERATE]: window.$t('commonly'),
  [SIGNAL_LEVEL.GOOD]: window.$t('good'),
  [SIGNAL_LEVEL.GREAT]: window.$t('verygood'),
}

export const SIGNAL_LEVEL_COLOR = {
  [SIGNAL_LEVEL.NONE]: '#FF4F4F',
  [SIGNAL_LEVEL.POOR]: '#FF4F4F',
  [SIGNAL_LEVEL.MODERATE]: '#FFA854',
  [SIGNAL_LEVEL.GOOD]: '#0DD667',
  [SIGNAL_LEVEL.GREAT]: '#0DD667',
}
