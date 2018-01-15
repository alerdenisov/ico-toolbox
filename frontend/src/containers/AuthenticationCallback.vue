<template lang="pug">
  div(:class="b()")
    h1 callback
</template>

<script>
import { ACTION_TYPES } from '@/constants'
export default {
  name: 'auth-callback',
  dependencies: ['$auth', '$api'],
  async mounted () {
    const session = await this.$auth.callback(window.location.hash)
    console.log(session)
    const profile = (await this.$api.login(session)).data
    this.$store.dispatch(ACTION_TYPES.Authentication, session)
    this.$store.dispatch(ACTION_TYPES.ReceiveProfile, profile)
    this.$router.push('/dashboard')
  }
}
</script>