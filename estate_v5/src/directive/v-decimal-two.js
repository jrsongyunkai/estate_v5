const handleInput = (e, binding) => {
  const input = e.target
  const value = input.value
  const decimalLimit = binding.value || 2 // 默认小数位数为2
  const regex = new RegExp(`^\\d+(\\.\\d{0,${decimalLimit}})?$`)

  if (!regex.test(value)) {
    input.value = value.slice(0, -1) // 删除最后一位非法输入
  }
}
const decimalTwo = {
  bind(el, binding) {
    el.addEventListener('input', e => handleInput(e, binding))
    el.addEventListener('keyup', e => handleInput(e, binding))
  },
  unbind(el) {
    // eslint-disable-next-line no-undef
    el.removeEventListener('input', handleInput)
    // eslint-disable-next-line no-undef
    el.removeEventListener('keyup', handleInput)
  },
}
export default decimalTwo
