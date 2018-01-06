<i18n>
en:
  hello: "Hello, {name}."
</i18n>

<template lang="pug">
  el-row(:gutter='40')
    el-col(:span='8')
      h2 {{ $t('hello', profile )}}
    el-col(:span='16')
      el-card
        h2 Sale progress:
  //- div
  //-   div
  //-     a(href="/auth") Auth
  //-   el-button(@click='me') Get my profile
  //-   el-button(@click='() => getWallet("BTC")') Get BTC Wallet
  //-   el-button(@click='() => getWallet("LTC")') Get LTC Wallet
  //-   el-button(@click='() => getWallet("ETH")') Get ETH Wallet
  //-   el-button(@click='() => getWallet("ETC")') Get ETC Wallet
  //-   el-button(@click='() => getWallet("LTCT")') Get LTCT Wallet
  //-   el-input(:value='wallet' v-if='wallet')
  //-   div(v-if='profile')
  //-     table
  //-       tr
  //-         td Id:
  //-         td {{ profile.userId }}
  //-       tr
  //-         td Email:
  //-         td 
  //-           span {{ profile.email }}
  //-       tr
  //-         td Name:
  //-         td {{ profile.name }}
  //-       tr
  //-         td Nickname:
  //-         td {{ profile.nickname }}
  //-       tr
  //-         td Picture:
  //-         td 
  //-           img(:src='profile.picture_large || profile.picture')
  //-       tr
  //-         td Gender:
  //-         td {{ profile.gender }}
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'dashboard',
  dependencies: ['$api'],

  data () {
    return {
      wallet: null
    }
  },

  computed: {
    ...mapState(['session', 'profile'])
  },

  methods: {
    // async me () {
    //   this.profile = (await this.$api.me(this.session)).data
    // },

    async getWallet (currency) {
      this.wallet = JSON.stringify((await this.$api.wallet(this.session, currency)).data)
    }
  }
}
</script>
<style>
</style>
