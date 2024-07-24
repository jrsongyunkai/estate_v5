const calendarMonthdata = [
  { title: window.$t('ns_lunarDate.JuniorOne'), value: '1', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.Juniortwo'), value: '2', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.Thirdday'), value: '3', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.fourthday'), value: '4', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.fifthday'), value: '5', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.Sixthday'), value: '6', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.seventhday'), value: '7', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.eighthday'), value: '8', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.ninthday'), value: '9', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.tenthday'), value: '10', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.eleven'), value: '11', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.twelve'), value: '12', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.thirteen'), value: '13', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.fourteen'), value: '14', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.fifteen'), value: '15', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.sixteen'), value: '16', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.seventeen'), value: '17', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.eighteen'), value: '18', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.nineteen'), value: '19', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.twenty'), value: '20', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.twentyone'), value: '21', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.twentytwo'), value: '22', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.twentythree'), value: '23', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.twentyfours'), value: '24', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.twentyfive'), value: '25', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.twentysix'), value: '26', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.twentyseven'), value: '27', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.twentyeight'), value: '28', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.twentynine'), value: '29', selected: false, checked: false },
  { title: window.$t('ns_lunarDate.thirty'), value: '30', selected: false, checked: false },
]

const cascaderList = [
  { label: window.$t('ns_lunarDate.JuniorOne'), value: '01' },
  { label: window.$t('ns_lunarDate.Juniortwo'), value: '02' },
  { label: window.$t('ns_lunarDate.Thirdday'), value: '03' },
  { label: window.$t('ns_lunarDate.fourthday'), value: '04' },
  { label: window.$t('ns_lunarDate.fifthday'), value: '05' },
  { label: window.$t('ns_lunarDate.Sixthday'), value: '06' },
  { label: window.$t('ns_lunarDate.seventhday'), value: '07' },
  { label: window.$t('ns_lunarDate.eighthday'), value: '08' },
  { label: window.$t('ns_lunarDate.ninthday'), value: '09' },
  { label: window.$t('ns_lunarDate.tenthday'), value: '10' },
  { label: window.$t('ns_lunarDate.eleven'), value: '11' },
  { label: window.$t('ns_lunarDate.twelve'), value: '12' },
  { label: window.$t('ns_lunarDate.thirteen'), value: '13' },
  { label: window.$t('ns_lunarDate.fourteen'), value: '14' },
  { label: window.$t('ns_lunarDate.fifteen'), value: '15' },
  { label: window.$t('ns_lunarDate.sixteen'), value: '16' },
  { label: window.$t('ns_lunarDate.seventeen'), value: '17' },
  { label: window.$t('ns_lunarDate.eighteen'), value: '18' },
  { label: window.$t('ns_lunarDate.nineteen'), value: '19' },
  { label: window.$t('ns_lunarDate.twenty'), value: '20' },
  { label: window.$t('ns_lunarDate.twentyone'), value: '21' },
  { label: window.$t('ns_lunarDate.twentytwo'), value: '22' },
  { label: window.$t('ns_lunarDate.twentythree'), value: '23' },
  { label: window.$t('ns_lunarDate.twentyfours'), value: '24' },
  { label: window.$t('ns_lunarDate.twentyfive'), value: '25' },
  { label: window.$t('ns_lunarDate.twentysix'), value: '26' },
  { label: window.$t('ns_lunarDate.twentyseven'), value: '27' },
  { label: window.$t('ns_lunarDate.twentyeight'), value: '28' },
  { label: window.$t('ns_lunarDate.twentynine'), value: '29' },
  { label: window.$t('ns_lunarDate.thirty'), value: '30' },
]
const calendarYearCascader = [
  { value: '01', label: window.$t('ns_lunarMonth.January'), children: cascaderList },
  { value: '02', label: window.$t('ns_lunarMonth.February'), children: cascaderList },
  { value: '03', label: window.$t('ns_lunarMonth.March'), children: cascaderList },
  { value: '04', label: window.$t('ns_lunarMonth.April'), children: cascaderList },
  { value: '05', label: window.$t('ns_lunarMonth.May'), children: cascaderList },
  { value: '06', label: window.$t('ns_lunarMonth.June'), children: cascaderList },
  { value: '07', label: window.$t('ns_lunarMonth.July'), children: cascaderList },
  { value: '08', label: window.$t('ns_lunarMonth.August'), children: cascaderList },
  { value: '09', label: window.$t('ns_lunarMonth.September'), children: cascaderList },
  { value: '10', label: window.$t('ns_lunarMonth.October'), children: cascaderList },
  { value: '11', label: window.$t('ns_lunarMonth.November'), children: cascaderList },
  { value: '12', label: window.$t('ns_lunarMonth.December'), children: cascaderList },
]

// $t('numberThValue',{num:index })

const dataDay = new Array(31).fill(undefined).map((it, index) => ({ label: window.$t('numberThValue', { num: index + 1 }), value: `${(index + 1).toString().padStart(2, '0')}` }))

const timeSpan = new Array(24).fill(undefined).map((it, index) => ({ label: window.$t('periodOfTime', { num: index }), value: `${index.toString().padStart(2, '0')}` }))

export const monthDateday = () => {
  return dataDay
}

export { calendarMonthdata, calendarYearCascader, dataDay, timeSpan }
