<template lang="pug">
  div(:class='b(mods())')
    div(:class='b("side", mods("left"))')
      currency-input(:suffix='currentData(leftCurrency)' @input='leftInput' :value='left')
    div(:class='b("side", mods("right"))')
      currency-input(:suffix='currentData(rightCurrency)' @input='rightInput' :value='right')
</template>

<script>
import { CURRENCIES } from '@/constants'
import CurrencyInput from '@/components/CurrencyInput'

export default {
  name: 'conversion-calculator',
  props: ['leftCurrency', 'rightCurrency', 'rate'],
  components: {
    CurrencyInput
  },

  data () {
    return {
      left: 0,
      right: 0
    }
  },

  methods: {
    mods (element) {
      return {
        [element]: true
      }
    },
    currentData (currency) {
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

    leftInput (value) {
      this.left = value
      this.right = value * this.rate
      console.log('left', value)
    },
    rightInput (value) {
      this.right = value
      this.left = value / this.rate
      console.log('right', value)
    }
  }
}
</script>
