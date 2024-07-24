export const timeList = [
  { type: '00:00-03:00', value: 1, color: '#87f0f8' },
  { type: '03:00-06:00', value: 2, color: '#4c8bea' },
  { type: '06:00-09:00', value: 3, color: '#c42f4a' },
  { type: '09:00-12:00', value: 4, color: '#f5c346' },
  { type: '12:00-15:00', value: 5, color: '#5aba89' },
  { type: '15:00-18:00', value: 6, color: '#e07863' },
  { type: '18:00-21:00', value: 7, color: '#d0f0f7' },
  { type: '21:00-24:00', value: 8, color: '#e27f3a' },
]
export const monthList = [
  '03-01',
  '03-02',
  '03-03',
  '03-04',
  '03-05',
  '03-06',
  '03-07',
  '03-08',
  '03-09',
  '03-10',
  '03-11',
  '03-12',
  '03-13',
  '03-14',
  '03-15',
  '03-16',
  '03-17',
  '03-18',
  '03-19',
  '03-20',
  '03-21',
  '03-22',
  '03-23',
  '03-24',
  '03-25',
  '03-26',
  '03-27',
  '03-28',
  '03-29',
  '03-30',
  '03-31',
]
export const disableFunc = val => {
  if (+val >= 0 && +val < 3) return 0
  if (+val >= 3 && +val < 6) return 1
  if (+val >= 6 && +val < 9) return 2
  if (+val >= 9 && +val < 12) return 3
  if (+val >= 12 && +val < 15) return 4
  if (+val >= 15 && +val < 18) return 5
  if (+val >= 18 && +val < 21) return 6
  if (+val >= 21 && +val < 24) return 7
}
