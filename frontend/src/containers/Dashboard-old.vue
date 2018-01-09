<i18n>
en:
  hello: "Hello, {name}."
  excange-title: "Contribute to Musereum with {0}"
</i18n>

<template lang="pug">
  div
    el-card(style='margin-bottom: 20px')
      sale-info
    el-row(:gutter='20' :class="b()")
      el-col(:span='24')
      el-col(:span='8')
        el-card
          h2 Sale Info
          table
            tr
              td
                span Deadline
              td
                span 10.02.2018
            tr
              td
                span Hard cap
              td(style='font-family: monospace')
                currency-label(
                  ticker="ETM"
                  :precision='2'
                  :value='10 * 1e6')
                span (
                currency-label(
                  ticker="BTC"
                  :precision='2'
                  :value='200')
                span )
            tr
              td(colspan='2')
                h4 Prices
            tr(v-for='currency in currencies')
              td
                currency-label(
                  :ticker='currency'
                  :precision='1'
                  :value='1'
                  style='font-family: monospace')
              td
                span(style='font-family: monospace; padding: 0 10px') =
                currency-label(
                  ticker='ETM'
                  :value='coinRate(currency)'
                  style='font-family: monospace')
          el-progress(:text-inside="true" :stroke-width="18" :percentage="2" status="exception")
      el-col(:span='16')
        el-card
          h2 Select contribution currency
          div(style='display: flex; flex-wrap: wrap')
            currency-button(
              v-for='currency in currencies'
              :key='currency'
              :ticker='currency'
              @click='activeCurrency = currency'
              :selected='activeCurrency === currency')
        el-card(v-if='currencySelected')
          h2 How much ETM do you need?
          conversion-calculator(
            :leftCurrency='activeCurrency'
            rightCurrency='ETM'
            :rate='coinRate(activeCurrency)'
          )
        el-card(v-if='currencySelected')
          h4 Send your {{ activeCurrency }} to address:
          deposit-wallet(:ticker='activeCurrency')

        el-card(style='margin-top: 20px')
          h2 Transactions
          
          el-tabs(v-model='activeCurrency')        
            el-tab-pane(label='Your', name='your')
              transaction-table(:transactions='myTransactions')
            el-tab-pane(label='100 latest', name='latest')
              transaction-table(:transactions='transactions')
</template>

<script>
import { mapState } from 'vuex'

import VueNumeric from 'vue-numeric'
import ConversionCalculator from '@/components/ConversionCalculator'
import DepositWallet from '@/components/DepositWallet'
import CurrencyButton from '@/components/CurrencyButton'
import TransactionTable from '@/components/TransactionTable'
import SaleInfo from '@/components/SaleInfo'
import CurrencyLabel from '@/components/CurrencyLabel'

export default {
  name: 'dashboard',
  dependencies: ['$api'],

  components: {
    'conversion-calculator': ConversionCalculator,
    DepositWallet,
    TransactionTable,
    CurrencyButton,
    CurrencyLabel,
    SaleInfo,
    VueNumeric
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
    },

    async transactions () {
      return (await this.$api.transactions(this.session)).data
    },

    async myTransactions () {
      return (await this.$api.myTransactions(this.session)).data
    }
  },

  methods: {
    coinData (currency) {
      if (currency !== 'ETM') {
        return {
          ticker: currency,
          name: this.$store.state.coins[currency].name,
          icon: `https://www.coinpayments.net/images/coins/${currency}.png`
        }
      } else {
        return {
          ticker: currency,
          name: 'Musereum',
          icon: 'https://www.coinpayments.net/images/coins/ETH.png'
        }
      }
    },
    coinRate (currency) {
      return 50000 * parseFloat(this.coins[currency].rate_btc)
    }
  }
}
</script>
<style lang="scss">
.dashboard {
}
</style>
