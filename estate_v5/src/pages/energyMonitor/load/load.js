import func from '@/untils/func'
import dayjs from 'dayjs'

export const sameMarkPoint = {
  data: [
    {
      type: 'max',
      symbol: func.echartsSymbolOverlap,
      symbolOffset: [0, -30],

      label: {
        fontSize: 11,
        align: 'center',
        padding: [0, 5, 33, 5],
        color: '#007eff',
      },
    },
  ],
  normal: {
    show: true,
  },
}
export const differenceMarkPoint = {
  data: [
    {
      type: 'max',
      symbol: func.echartsSymbolMax,
      symbolOffset: [0, -30],

      label: {
        fontSize: 11,
        align: 'center',
        padding: [0, 5, 33, 5],

        color: '#ff4f4f',
      },
    },
    {
      type: 'min',
      symbolOffset: [0, -30],
      symbol: func.echartsSymbolMin,
      label: {
        color: '#00ba8a',
        fontSize: 11,
        align: 'center',

        padding: [0, 5, 33, 5],
      },
    },
  ],
  label: {
    normal: {
      show: true,
    },
  },
}
const weekConfig = {
  0: '7',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
}
export const typeAxis = {
  HoursOptions: v => v.split(' ')[1],
  WeekOptions: v => weekConfig[dayjs(v.split(' ')[0]).day()],
  YearsOptions: v => dayjs(v).format('MM'),
  setMonthOptions: v => dayjs(v).format('DD'),
}

export const timeType = {
  HoursOptions: v => '',
  WeekOptions: v => dayjs(v).format(`HH[${window.$t('hour')}]`),
  YearsOptions: v => dayjs(v).format(`DD[${window.$t('day')}]`),
  setMonthOptions: v => dayjs(v).format(`HH[${window.$t('hour')}]`),
}
