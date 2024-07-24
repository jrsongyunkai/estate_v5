export const tableColumns = [
  {
    title: window.$t('index'),
    slot: 'indexNum',
    width: 80,
  },

  { title: window.$t('workOrderNum'), slot: 'orderNum', width: 220 },
  {
    title: window.$t('creater'),
    slot: 'createPerson',
    width: 200,
  },
  {
    title: window.$t('maintenanceDetails'),
    slot: 'content',
    width: 250,
  },
  {
    title: window.$t('state'),
    slot: 'status',
    width: 110,
  },
  {
    title: window.$t('isOverdue'),
    slot: 'isOverdue',
    width: 110,
  },
  {
    title: window.$t('launchTime'),
    key: 'createTime',
    width: 200,
    sortable: true,
  },
  {
    title: window.$t('expectedCompletionTime'),
    key: 'expectedTime',
    width: 200,
    sortable: true,
  },
  {
    title: window.$t('realCompleteTime'),
    slot: 'finishTime',
    width: 200,
    sortable: true,
  },
  {
    title: window.$t('operation'),
    slot: 'action',
    fixed: 'right',
    width: 200,
  },
]
export const fileTypeList = [
  {
    type: 'mp3',
    fileType: 2,
    img: '/static/img/fileType/yinping.png',
  },
  {
    type: 'wav',
    fileType: 2,
    img: '/static/img/fileType/yinping.png',
  },
  {
    type: 'xls',
    fileType: 4,
    img: '/static/img/fileType/xls.png',
  },
  {
    type: 'xlsx',
    fileType: 4,
    img: '/static/img/fileType/xls.png',
  },
  {
    type: 'zip',
    fileType: 5,
    img: '/static/img/fileType/yasuobao.png',
  },
  {
    type: 'rar',
    fileType: 5,
    img: '/static/img/fileType/yasuobao.png',
  },
  {
    type: '7z',
    fileType: 5,
    img: '/static/img/fileType/yasuobao.png',
  },
  {
    type: 'txt',
    fileType: 6,
    img: '/static/img/fileType/yinping.png',
  },
  {
    type: 'doc',
    fileType: 6,
    img: '/static/img/fileType/word.png',
  },
  {
    type: 'docx',
    fileType: 6,
    img: '/static/img/fileType/word.png',
  },
  {
    type: 'pdf',
    fileType: 6,
    img: '/static/img/fileType/pdf_file.png',
  },
  {
    type: 'ppt',
    fileType: 7,
    img: '/static/img/fileType/PPT.png',
  },
  {
    type: 'pptx',
    fileType: 7,
    img: '/static/img/fileType/PPT.png',
  },
]
