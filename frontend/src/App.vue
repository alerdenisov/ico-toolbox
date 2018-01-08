<i18n>
en:
  NotSigned: You should to authenticate first
</i18n>
<template lang="pug">
  el-container(:class='b()' v-loading='loading')
    el-header(:class='b("header-wrapper")') Header
    el-container(:class='b("screen-wrapper")')
      //- el-aside(width='200px') Aside
      el-main(:class='b("screen")')
        div(:class='b("content")')
          router-view(:class='b("view")')
</template>

<script>
import { mapState } from 'vuex'
import { ACTION_TYPES } from '@/constants'

export default {
  name: 'app',
  dependencies: ['$api'],

  data () {
    return {
      loading: true
    }
  },

  computed: {
    ...mapState([
      'session',
      'profile'
    ])
  },

  methods: {
    async checkState () {
      this.loading = true
      await this.checkErrors()
      await this.checkCoins()
      this.loading = false
    },
    async checkErrors () {
      const error = this.$route.query.error
      if (error) {
        this.$notify.error({
          title: 'Error',
          message: this.$t(this.$route.query.error)
        })
      }
    },
    async checkCoins () {
      const allCoins = (await this.$api.rates()).data
      const coins = Object.keys(allCoins).reduce((acc, ticker) => {
        if (allCoins[ticker].accepted && allCoins[ticker].status === 'online') {
          acc[ticker] = allCoins[ticker]
        }

        return acc
      }, {})
      this.$store.dispatch(ACTION_TYPES.ReceiveCoins, coins)
    }
  },

  mounted () {
    this.checkState()
  },

  watch: {
    '$route': 'checkState'
  }
}
</script>

<style lang="scss">
@import url(https://fonts.googleapis.com/css?family=Roboto:400,700&amp;subset=cyrillic);

.auth0-lock.auth0-lock,
body {
  font-family: "Roboto" !important; //"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6, p {
  margin-top: 0.3em;
  margin-bottom: 1.2em;
}

.auth0-lock-header { height: 80px !important; }
// .auth0-lock-header-welcome,
.auth0-lock-firstname,
.auth0-lock-name,
.auth0-lock-badge-bottom {
    display: none;
}

.el-card {
  box-shadow: none;
  transition: box-shadow 0.5s ease;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
}

.app {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  background-color: #ECF5FD;
  display: flex;
  justify-content: center;

  &__header-wrapper {
    height: 60px;
    background-color: #0079C4;
    color: white;
  }

  &__screen {
    display: flex;
  }

  &__content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    // justify-content: center;
  }
}
</style>
