import { ACTION_TYPES, MUTATION_TYPES } from '@/constants'

const autoActions = Object.keys(ACTION_TYPES).reduce((acc, key) => {
  acc[ACTION_TYPES[key]] = function ({ commit }, ...args) {
    commit(MUTATION_TYPES[key], ...args)
  }

  return acc
}, {})

export default {
  ...autoActions
}
