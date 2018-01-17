<i18n>
en:
  attention: "Convertion rate {0} to ETM isn't fixed and depend on conversion rate {0} to BTC"
  rate: "1 {0} is {1} ETM"
</i18n>
<template lang="pug">
  div(:class='b(mods())')
    div(:class='b("side", mods("left"))')
      currency-input(:class="b('input', mods('left'))" :suffix='currentData(leftCurrency)' @input='leftInput' :value='left')
    div(:class='b("side", mods("right"))')
      currency-input(:class="b('input', mods('right'))" :suffix='currentData(rightCurrency)' @input='rightInput' :value='right')
    
    div(:class="b('rate', mods())")
      p(style='margin-top: 15px;')
        currency-label(:ticker='leftCurrency' :value='1' :precision='2')
        | 
        span is
        | 
        currency-label(ticker='ETM' :value='rate' :precision='4')
    //- el-alert(v-if='rate !== 50000' :title="$t('attention', [leftCurrency])" type="warning")
</template>

<script>
import CurrencyInput from '@/components/CurrencyInput'
import CurrencyLabel from '@/components/CurrencyLabel'

export default {
  name: 'conversion-calculator',
  props: ['leftCurrency', 'rightCurrency', 'rate'],
  components: {
    CurrencyInput,
    CurrencyLabel
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

<style lang="scss">
.conversion-calculator {
  &__input {
    &--left {
      .el-input__inner {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: 0;
      }
    }
    &--right {
      .el-input__inner {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
  }
}
</style>
