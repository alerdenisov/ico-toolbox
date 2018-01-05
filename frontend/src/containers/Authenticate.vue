<template lang="pug">
  div#auth0  
</template>

<script>
import AuthService from '@/lib/AuthService'

export default {
  name: 'authenticate',

  created () {
    AuthService.login()
  }
}
</script>
