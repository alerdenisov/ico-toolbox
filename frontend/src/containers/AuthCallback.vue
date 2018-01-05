<template lang="pug">
  div#authcallback
    h1 callback
</template>

<script>
import AuthService from '@/lib/AuthService'

export default {
  name: 'authcallback',

  mounted () {
    console.log('test')
    AuthService.callback(this)
  }
}
</script>
