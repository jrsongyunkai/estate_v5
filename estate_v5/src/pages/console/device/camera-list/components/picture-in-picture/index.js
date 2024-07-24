import PIP from './index.vue'
import Vue from 'vue'

const PIPConstructor = Vue.extend(PIP)
const pool = new Map()
let seed = 1

const generateId = () => `PIP-${seed++}`

export const openPIP = config => {
  const id = generateId()
  const ins = new PIPConstructor({
    data: {
      ...config,
      onClose: () => {
        config.onClose && config.onClose(ins)
        pool.delete(id)
      },
    },
  })
  ins.id = id
  if (config.x === undefined) {
    ins.x = document.documentElement.clientWidth - ins.w
  }
  if (config.y === undefined) {
    ins.y = document.documentElement.clientHeight - ins.h
  }
  ins.$mount()
  document.body.appendChild(ins.$el)
  pool.set(id, ins)

  return ins
}

export const closePIP = insOrId => {
  const ins = typeof insOrId === 'string' ? pool.get(insOrId) : insOrId
  if (ins) {
    ins.close()
  }
}

export const closeAllPIP = insOrId => {
  pool.forEach(ins => {
    ins.close()
  })
}
