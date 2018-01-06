<i18n>
en:
  hello: "Hello, {name}."
  excange-title: "Contribute to Musereum with {0}"
</i18n>

<template lang="pug">
  el-row(:gutter='40')
    el-col(:span='8')
      h2 {{ $t('hello', profile )}}
      
    el-col(:span='16')
      el-tabs(v-model='activeCurrency')        
        el-tab-pane(v-for='currency in currencies' :key='currency' :label='coinName(currency)', :name='currency') 
          span {{ $t('excange-title', [currency]) }}
      div(v-if='currencySelected')
        h2 How much ETM do you need?
        conversion-calculator(
          :leftCurrency='activeCurrency'
          rightCurrency='ETM'
          :rate='coinRate(activeCurrency)'
        )
      div
        pre {{ rates }}
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
import { CURRENCIES, ACCEPTED_CURRENCIES } from '@/constants'
import ConversionCalculator from '@/components/ConversionCalculator'

export default {
  name: 'dashboard',
  dependencies: ['$api'],

  components: {
    'conversion-calculator': ConversionCalculator
  },

  data () {
    return {
      wallet: null,
      activeCurrency: null,
      receiveAmount: 0,
      sendAmount: 0
    }
  },

  computed: {
    currencies () {
      return Object.keys(this.coins)
    },
    currencySelected () {
      return !!this.coins && !!this.coins[this.activeCurrency]
    },
    ...mapState(['session', 'profile', 'coins'])
  },

  asyncComputed: {
    async rates () {
      return (await this.$api.rates(this.session)).data
    }
  },

  methods: {
    // async me () {
    //   this.profile = (await this.$api.me(this.session)).data
    // },

    async getWallet (currency) {
      this.wallet = JSON.stringify((await this.$api.wallet(this.session, currency)).data)
    },

    coinName (currency) {
      return this.coins[currency].name
    },
    coinRate (currency) {
      return 50000 * parseFloat(this.coins[currency].rate_btc)
    }
  }
}
</script>
<style>
</style>
