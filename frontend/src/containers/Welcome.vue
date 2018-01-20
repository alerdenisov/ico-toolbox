<i18n>
en:
  title: Welcome
  subtitle: Token Sale App v.{0}
  auth: Authenticate
  disclaimer: "Please use same email as you used for waitlist"
ru:
  title: Добро пожаловать 
</i18n>

<template lang="pug">
  div(:class='b(mods)')
    h1(:class='b("title", mods)') {{ $t('title') }}
    p(:class='b("subtitle", mods)') {{ $t('subtitle', ['0.0.1']) }}
    //- el-button(:class='b("auth-button", mods)' @click='showAuth') {{ $t('auth') }}
    auth-box(@session='gotSession')
    p(:class='b("disclaimer", mods)') {{ $t('disclaimer') }}
</template>

<script>
import { ACTION_TYPES } from '@/constants'
import AuthBox from '@/components/AuthBox'

export default {
  name: 'welcome',
  dependencies: ['$api'],
  props: [],
  components: {
    AuthBox
  },
  computed: {
    mods () {
      return {

      }
    }
  },
  methods: {
    async gotSession (session) {
      const profile = (await this.$api.login(session)).data
      this.$store.dispatch(ACTION_TYPES.Authentication, session)
      this.$store.dispatch(ACTION_TYPES.ReceiveProfile, profile)
      this.$router.push('/dashboard')
    }
  }
}
</script>

<style lang="scss">
.welcome {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &__title {
    text-align: center;
    font-size: 56px;
    margin-bottom: 0.2em;
    color: #6B809C;
    margin-top: auto;
  }

  &__subtitle {
    text-align: center;
    margin-bottom: 30px;
    color: #8EABC4;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
  }

  &__disclaimer {
    margin-top: auto;
  }
}
</style>