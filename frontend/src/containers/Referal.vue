<template lang="pug">
  div(:class="b()")
</template>

<script>
import { ACTION_TYPES } from '@/constants'
export default {
  name: 'referal-container',
  props: ['ref'],
  mounted () {
    this.$store.dispatch(ACTION_TYPES.Refferer, this.ref)
    this.$router.push('/')
  }
}
</script>