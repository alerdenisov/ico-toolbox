<i18n>
en:
  auth: Sign In
ru:
  auth: Вход
</i18n>
<template lang="pug">
  div(:class="b(mods())")
    el-button(:class="b('button', mods('button'))" type="primary" @click="() => authOpen = true") {{ $t('auth') }}
    auth-passwordless(:show='authOpen' @close='authOpen = false')
</template>

<script>
import AuthPasswordless from '@/components/AuthPasswordless'
export default {
  name: 'auth-box',
  dependencies: ['$auth'],
  components: {
    AuthPasswordless
  },
  data () {
    return {
      authOpen: false
    }
  },
  methods: {
    mods (element) {
      return {}
    }
  },

  mounted () {
    this.$auth.on('authenticated', session => {
      setTimeout(() => {
        this.$auth.hide()
        this.$emit('session', session)
      }, 1350)
    })
  }
}
</script>

