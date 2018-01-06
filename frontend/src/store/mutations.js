import { MUTATION_TYPES } from '@/constants'

export default {
  [MUTATION_TYPES.Authentication] (state, session) {
    state.session = session
  },
  [MUTATION_TYPES.ReceiveProfile] (state, profile) {
    state.profile = profile
  }
}
