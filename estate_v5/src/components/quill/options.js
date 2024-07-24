const titleConfig = {
  'ql-bold': window.$t('bold'),
  'ql-font': window.$t('font'),
  'ql-code': window.$t('insertCode'),
  'ql-italic': window.$t('italic'),
  'ql-link': window.$t('addLink'),
  'ql-color': window.$t('fontColor'),
  'ql-background': window.$t('backgroundColor'),
  'ql-size': window.$t('fontSize'),
  'ql-strike': window.$t('deleteLine'),
  'ql-script': window.$t('Superscript-Subscript'),
  'ql-underline': window.$t('underline'),
  'ql-blockquote': window.$t('quote'),
  'ql-header': window.$t('title'),
  'ql-indent': window.$t('indent'),
  'ql-list': window.$t('list'),
  'ql-align': window.$t('alignText'),
  'ql-direction': window.$t('textDirection'),
  'ql-code-block': window.$t('codeBlock'),
  'ql-formula': window.$t('formula'),
  'ql-image': window.$t('img'),
  'ql-video': window.$t('video'),
  'ql-clean': window.$t('clearFontStyle'),
}

export function addQuillTitle() {
  const oToolBar = document.querySelector('.ql-toolbar')
  const aButton = oToolBar.querySelectorAll('button')
  const aSelect = oToolBar.querySelectorAll('select')
  aButton.forEach(function (item) {
    if (item.className === 'ql-script') {
      item.value === 'sub' ? (item.title = window.$t('subscript')) : (item.title = window.$t('superscript'))
    } else if (item.className === 'ql-indent') {
      item.value === '+1' ? (item.title = window.$t('indentRight')) : (item.title = window.$t('indentLeft'))
    } else {
      item.title = titleConfig[item.className]
    }
  })
  // 字体颜色和字体背景特殊处理，两个在相同的盒子
  aSelect.forEach(function (item) {
    if (item.className.indexOf('ql-background') > -1) {
      item.previousSibling.title = titleConfig['ql-background']
    } else if (item.className.indexOf('ql-color') > -1) {
      item.previousSibling.title = titleConfig['ql-color']
    } else {
      item.parentNode.title = titleConfig[item.className]
    }
  })
}
