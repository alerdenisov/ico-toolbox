<template lang="pug">
  div(:class="b()")
</template>

<script>
import { ACTION_TYPES } from '@/constants'
export default {
  name: 'referrer-container',
  dependencies: ['$api'],
  props: ['referrer'],
  async mounted () {
    const validRef = (await this.$api.checkRefId(this.referrer)).data
    console.log('valid ref', validRef, this.referrer)
    if (validRef) {
      this.$store.dispatch(ACTION_TYPES.Referrer, this.referrer)
    }

    this.$router.push('/')
  }
}
</script>