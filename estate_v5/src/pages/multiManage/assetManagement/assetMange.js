export const assetColumns = [
  {
    type: 'selection',
    width: 60,
    align: 'center',
    fixed: 'left',
  },
  {
    title: window.$t('index'),
    slot: 'indexNum',
    width: 80,
  },
  {
    title: window.$t('assetName'),
    key: 'assetName',
    width: 110,
  },
  {
    title: window.$t('assetType'),
    slot: 'assetType',
    width: 110,
  },
  {
    title: window.$t('assetCategory'),
    key: 'assetCategoryDesc',
    width: 110,
  },
  {
    title: window.$t('area1'),
    key: 'region',
    width: 110,
  },
  {
    title: window.$t('position'),
    key: 'assetAddress',
    width: 110,
  },
  {
    title: window.$t('state'),
    slot: 'status',
    width: 110,
  },
  {
    title: window.$t('administrator'),
    key: 'manager',
    width: 110,
  },
  {
    title: window.$t('assetNum'),
    key: 'assetNo',
    width: 110,
  },
  {
    title: window.$t('dateOfManufacture'),
    key: 'productionDate',
    sortable: true,
    width: 110,
  },
  {
    title: window.$t('useYear'),
    key: 'lifeSpan',
    width: 110,
  },

  {
    title: window.$t('productSpecifications'),
    key: 'productStandard',
    width: 110,
  },
  {
    title: window.$t('manufacturer1'),
    key: 'manufacturer',
    width: 110,
  },
  {
    title: window.$t('addTime'),
    key: 'createTime',
    width: 110,
  },
  {
    title: window.$t('operation'),
    slot: 'action',
    fixed: 'right',
    width: 220,
  },
]
export const flatDeep = data => {
  let arr = []
  const deepArr = data => {
    data.forEach(item => {
      arr.push(item)
      if (Array.isArray(item.children) && item.children.length > 0) {
        return deepArr(item.children)
      }
    })
  }
  deepArr(data)
  return arr.filter(v => v.id !== 'all').map(item => ({ value: item.id, label: item.label }))
}
