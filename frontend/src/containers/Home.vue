<template lang="pug">
  div
    div
      a(href="/auth") Auth
    el-button(@click='me') Get my profile
    el-button(@click='() => getWallet("BTC")') Get BTC Wallet
    el-button(@click='() => getWallet("LTC")') Get LTC Wallet
    el-button(@click='() => getWallet("ETH")') Get ETH Wallet
    el-button(@click='() => getWallet("ETC")') Get ETC Wallet
    el-button(@click='() => getWallet("LTCT")') Get LTCT Wallet
    el-input(:value='wallet' v-if='wallet')
    div(v-if='profile')
      table
        tr
          td Id:
          td {{ profile.userId }}
        tr
          td Email:
          td 
            span {{ profile.email }}
        tr
          td Name:
          td {{ profile.name }}
        tr
          td Nickname:
          td {{ profile.nickname }}
        tr
          td Picture:
          td 
            img(:src='profile.picture_large || profile.picture')
        tr
          td Gender:
          td {{ profile.gender }}
</template>

<script>
import ApiService from '@/lib/ApiService'

export default {
  name: 'Home',

  data () {
    return {
      profile: null,
      wallet: null
    }
  },

  methods: {
    async me () {
      this.profile = (await ApiService.me(this)).data
    },
    async getWallet (currency) {
      this.wallet = JSON.stringify((await ApiService.wallet(this, currency)).data)
    }
  }
}
</script>
<style>
</style>
