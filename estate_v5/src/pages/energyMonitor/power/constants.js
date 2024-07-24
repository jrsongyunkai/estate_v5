import dayjs from 'dayjs'

export const STATS_TYPE_RADIOS = [
  {
    value: 1,
    label: window.$t('last30days'),
  },
  {
    value: 2,
    label: window.$t('thisMonth'),
  },
]
export const STATS_TYPE_MAP = STATS_TYPE_RADIOS.reduce((map, stats) => {
  map[stats.value] = stats.label
  return map
}, {})

export const defaultTimeValue = () => ({
  levelRange: 'month',
  timeType: 3,
  dateValue: dayjs().format('YYYY-MM-01'),
  dataRange: [dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
})
