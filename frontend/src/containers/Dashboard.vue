<i18n>
en:
  hello: "Hello, {name}."

  BTC: Bitcoin
  BTC-title: Buy with Bitcoin
  LTC: Litecoin
  LTC-title: Buy with Litecoin
  ETH: Ethereum
  ETH-title: Buy with Ethereum
  ETC: Ethereum Classic
  ETC-title: Buy with Ethereum Classic
  BCH: Bitcoin Cash
  BCH-title: Buy with Bitcoin Cash
</i18n>

<template lang="pug">
  el-row(:gutter='40')
    el-col(:span='8')
      h2 {{ $t('hello', profile )}}
      
    el-col(:span='16')
      el-tabs(v-model='activeCurrency')        
        el-tab-pane(v-for='currency in currencies' :key='currency' :label='$t(currency)', :name='currency') {{ $t(`${currency}-title`) }}
      div(v-if='currencySelected')
        h2 How much ETM do you need?
        conversion-calculator(
          :leftCurrency='activeCurrency'
          rightCurrency='ETM'
          :rate='50000'
        )
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
      return ACCEPTED_CURRENCIES
    },
    currencySelected () {
      return !!CURRENCIES[this.activeCurrency]
    },
    ...mapState(['session', 'profile'])
  },

  methods: {
    // async me () {
    //   this.profile = (await this.$api.me(this.session)).data
    // },

    async getWallet (currency) {
      this.wallet = JSON.stringify((await this.$api.wallet(this.session, currency)).data)
    },

    currencyIcon (currency) {
      return {
        icon: CURRENCIES[currency].icon
      }
    }
  }
}
</script>
<style>
</style>
