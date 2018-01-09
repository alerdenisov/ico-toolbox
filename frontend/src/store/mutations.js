import { MUTATION_TYPES } from '@/constants'

export default {
  [MUTATION_TYPES.Authentication] (state, session) {
    state.session = session
  },
  [MUTATION_TYPES.ReceiveProfile] (state, profile) {
    state.profile = profile
  },
  [MUTATION_TYPES.Logout] (state) {
    state.session = null
    state.profile = null
  },
  [MUTATION_TYPES.ReceiveCoins] (state, coins) {
    state.coins = coins
    state.coinsUpdate = Math.floor(new Date().getTime() / 1000)
  },
  [MUTATION_TYPES.SaleInfo] (state, info) {
    state.saleInfo = info
  },
  [MUTATION_TYPES.SaleProgress] (state, progress) {
    state.saleProgress = progress
  }
}
