import { MUTATION_TYPES } from '@/constants'

export default {
  [MUTATION_TYPES.Authentication] (state, session) {
    state.session = session
  }
}
