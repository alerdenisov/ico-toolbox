<template lang="pug">
  div(:class="b()")
</template>

<script>
import { ACTION_TYPES } from '@/constants'
import { mapState } from 'vuex'
export default {
  name: 'auth-callback',
  dependencies: ['$auth', '$api', '$error'],
  computed: {
    ...mapState(['refferer'])
  },
  async mounted () {
    try {
      const session = await this.$auth.callback(window.location.hash)
      console.log(session)
      const profile = (await this.$api.login(session, this.refferer)).data
      this.$store.dispatch(ACTION_TYPES.Authentication, session)
      this.$store.dispatch(ACTION_TYPES.ReceiveProfile, profile)
      this.$router.push('/dashboard')
    } catch (e) {
      if (e.errorDescription) {
        this.$error(e.errorDescription, true)
      } else {
        this.$error(e, true)
      }
    }
  }
}
</script>