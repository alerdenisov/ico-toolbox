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
    const authResult = await this.$auth.callback(window.location.hash)
    this.$store.dispatch(ACTION_TYPES.Authentication, authResult)
    this.$router.push('/dashboard')
  }
}
</script>