import { MUTATION_TYPES } from '@/constants'
import Vue from 'vue'

export default {
  [MUTATION_TYPES.Authentication] (state, session) {
    state.session = session
  },
  [MUTATION_TYPES.ReceiveProfile] (state, profile) {
    state.profile = profile
  },
  [MUTATION_TYPES.UsedMail] (state, mail) {
    if (typeof mail !== 'string' || mail.length < 4) {
      return
    }

    const sanitazedMail = mail.toLowerCase()
    if (state.usedMails.indexOf(sanitazedMail) !== -1) {
      return
    }

    Vue.set(state.usedMails, state.usedMails.length, sanitazedMail)
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
