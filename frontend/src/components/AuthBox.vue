<i18n>
en:
  auth: Sign In
ru:
  auth: Вход
</i18n>
<template lang="pug">
  div(:class="b(mods())")
    el-button(:class="b('button', mods('button'))" type="primary" @click="() => $auth.show()") {{ $t('auth') }}
</template>

<script>
export default {
  name: 'auth-box',
  dependencies: ['$auth'],
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

