<i18n>
en:
  NotSigned: You should to authenticate first
</i18n>
<template lang="pug">
  div(:class='b()' v-if='!loading')
    div(:class='b("wrapper")' v-if='session && profile')
      el-header(:class='b("header-wrapper")')
        img(src="/assets/logo_white.png")
        img(src="/logo_white.png")
        div(:class='b("toggle-mobile")' @click='showMenu = !showMenu')
          awesome-icon(name='align-justify')
      el-container(:class='b("screen-wrapper")')
        el-aside(:class='b("sidebar", { active: showMenu })' width='280px')
          user-badge(:profile='profile' :balance='balance')
          el-menu(
            :class='b("menu")'
            :router='true'
            mode='vertical')
            el-menu-item(index='dashboard' route='/dashboard') Sale
            el-menu-item(index='contribute' route='/contribute') Contribute
            //- el-menu-item(index='affilate' route='/affilate') Affilate
            el-menu-item(index='transactions' route='/transactions') Transactions
            el-menu-item(index='events' route='/events' v-if='isAdmin') Events Log
            //- el-menu-item(index='contributors' route='/contributors' v-if='isAdmin') Contributors
        el-main(:class='b("screen")')
          div(:class='b("content")')
            router-view(:class='b("view")')
    div(:class='b()' v-else)
      el-main(:class='b("screen", { full: true })')
          div(:class='b("content", { full: true })')
            router-view(:class='b("view", { full: true })')
  div(:class='b()' v-else v-loading='true')
</template>

<script>
import { mapState } from 'vuex'
import { ACTION_TYPES } from '@/constants'

import UserBadge from '@/components/UserBadge'

export default {
  name: 'app',
  dependencies: ['$api', '$error'],

  components: {
    UserBadge
  },

  asyncComputed: {
    async balance () {
      if (this.session && this.profile) {
        return (await this.$api.getBalance(this.session, 'all')).data
      } else {
        return 0
      }
    }
  },

  data () {
    return {
      loading: true,
      authOpen: false,
      showMenu: false
    }
  },

  computed: {
    isAdmin () {
      return this.profile.roles && this.profile.roles.indexOf('admin') !== -1
    },
    ...mapState([
      'session',
      'profile',
      'coins',
      'coinsUpdate'
    ])
  },

  methods: {
    async checkState () {
      try {
        console.log('start check')
        this.loading = true
        await this.checkErrors()
        await this.checkCoins()
        await this.checkProfile()
        this.loading = false
        console.log('end check')
      } catch (e) {
        this.loading = false
        this.$error(e, true)
      }
    },
    async checkErrors () {
      const error = this.$route.query.error
      if (error) {
        this.$notify.error({
          title: 'Error',
          message: this.$route.query.error
        })
      }
    },
    async checkCoins () {
      const now = Math.floor(new Date().getTime() / 1000)
      if (!this.coins || now > this.coinsUpdate + 30) {
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

    async checkProfile () {
      if (this.session) {
        const profile = (await this.$api.login(this.session)).data
        this.$store.dispatch(ACTION_TYPES.ReceiveProfile, profile)
      }
    }
  },

  mounted () {
    this.checkState()
  },

  watch: {
    '$route': function () {
      this.showMenu = false
      this.checkState()
    }
  }
}
</script>

<style lang="scss">
@import url(https://fonts.googleapis.com/css?family=Roboto:400,700&amp;subset=cyrillic);

html, body {
  // overflow: hidden;
}

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
  display: flex;
  flex-direction: column;
  flex: 1;
  // position: fixed;
  // left: 0;
  // right: 0;
  // top: 0;
  // bottom: 0;

  background-color: #ECF5FD;
  // display: flex;
  // justify-content: center;

  min-height: 100vh;
  
  &__wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__menu {
    border: 0;
  }

  &__header-wrapper {
    height: 60px;
    background-color: #0079C4;
    color: white;
  }

  &__screen {
    display: flex;
    @media screen and (max-width: 480px){
      padding: 20px 10px;
    }
  }

  &__content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    // justify-content: center;
  }

  &__view {
    max-width: calc(100vw - 40px - 280px);
    @media screen and (max-width: 920px){
      max-width: calc(100vw - 40px);
    }
    @media screen and (max-width: 480px){
      max-width: calc(100vw - 20px);
    }

    &--full {
      max-width: none;
    }
  }

  &__sidebar {
    background-color: white;
    border-right: 1px solid #ebeef5;

    @media screen and (max-width: 920px) {
      position: absolute;
      width: 100% !important;
      height: 100%;
      border: 0;
      display: none;
      z-index: 1;
    }

    &--active {
      display: block;
    }
    // padding: 20px
  }

  &__header-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  &__toggle-mobile {
    padding: 10px;
    margin-left: auto;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    border-radius: 4px;
    border: 1px solid transparent;
    display: flex;
    justify-content: center;
    align-items: center;

    display: none;

    @media screen and (max-width: 920px) {
      display: block;
    }

    &:hover {
      opacity: 1;
      border-color: rgba(255,255,255,0.5);
      box-shadow: 0 0 3px rgba(255,255,255,0.3);
    }
  }
}
</style>
