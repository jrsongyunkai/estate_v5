export const energyTypeMap = [
  { label: window.$t('electricityConsumption'), prop: 'elec', unit: 'kW·h', value: 1, name: window.$t('powerConsumption'), tip: window.$t('electricityConsumption1'), column: window.$t('electricQuantity'), isSupport: true },
  { label: window.$t('waterConsumption'), prop: 'water', unit: 'm³', value: 2, name: window.$t('waterConsumption1'), tip: window.$t('useWater'), column: window.$t('waterQuantity'), isSupport: true },
  { label: window.$t('gasEnergyConsumption'), prop: 'gas', unit: '-', value: 3, name: window.$t('gasConsumption'), tip: window.$t('gasConsumption1'), column: window.$t('gasConsumption1'), isSupport: false },
  { label: window.$t('heatingEnergyConsumption'), prop: 'heating', unit: '-', value: 4, name: window.$t('usingHeating'), tip: window.$t('usingWarmth'), column: window.$t('usingWarmth'), isSupport: false },
]

export const MONTHS = [window.$t('January'), window.$t('February'), window.$t('March'), window.$t('April'), window.$t('May'), window.$t('June'), window.$t('July'), window.$t('August'), window.$t('September'), window.$t('October'), window.$t('November'), window.$t('December')]

export const WEEKS = [window.$t('monday'), window.$t('tuesday'), window.$t('wednesday'), window.$t('thursday'), window.$t('friday'), window.$t('saturday'), window.$t('sunday')]

export const googleLangMap = { 'zh-CN': 'zh-CN', 'en-US': 'en', 'ru-RU': 'ru', 'fr-FR': 'fr', 'es-ES': 'es', 'ja-JP': 'ja', 'ko-KR': 'ko', 'ar-SA': 'ar' }
