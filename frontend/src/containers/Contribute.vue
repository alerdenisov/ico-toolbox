<i18n>
en:
  title: Welcome
  subtitle: Token Sale App v.{0}
  auth: Authenticate
  disclaimer: "If you don't receive your own invite code feel free to contact us!"
ru:
  title: Добро пожаловать 
</i18n>

<template lang="pug">
  div(:class="b()")
    el-card(:class="b('step')")
      h2 Select contribution currency
      div(style='display: flex; flex-wrap: wrap')
        currency-button(
          :class="b('currency')"
          v-for='currency in currencies'
          :key='currency'
          :ticker='currency'
          @click='activeCurrency = currency'
          :selected='activeCurrency === currency')
    el-card(:class="b('step')" v-if='currencySelected')
      h2 How much ETM do you need?
      conversion-calculator(
        :leftCurrency='activeCurrency'
        rightCurrency='ETM'
        :rate='coinRate(activeCurrency)'
      )
      el-alert(title="Attention! It can take up to an hour until your transaction is added to the system" type='warning')
    el-card(:class="b('step')" v-if='currencySelected')
      h4 Send your {{ activeCurrency }} to address:
      deposit-wallet(:ticker='activeCurrency')
</template>

<script>
import { mapState } from 'vuex'
import ConversionCalculator from '@/components/ConversionCalculator'
import DepositWallet from '@/components/DepositWallet'
import CurrencyButton from '@/components/CurrencyButton'
import CurrencyLabel from '@/components/CurrencyLabel'

export default {
  name: 'contribute',
  dependencies: ['$api'],
  components: {
    ConversionCalculator,
    DepositWallet,
    CurrencyButton,
    CurrencyLabel
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
.contribute {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__step {
    max-width: 650px;
    width: 100%;
    margin-bottom: 30px; 
  }

  &__currency {
    flex: 1;
  }
}
</style>