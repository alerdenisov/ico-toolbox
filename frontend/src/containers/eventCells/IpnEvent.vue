<template lang="pug">
  div(:class="b()")
    a(:href='txUrl' target="blank" :class="b('transaction')") {{ transaction }}
    currency-label(
      :class="b('amount')"
      :ticker="ticker"
      :value='amount'
      :precision="2")
    //- span(:class='b("label", { type: "roles" })') {{ roles }}
    //- generic-cell(:event='event')
    //- pre(:class="b('output')" :style='{ "max-height": `${maxHeight}px` }') {{ event }}
</template>

<script>
import CurrencyLabel from '@/components/CurrencyLabel'
export default {
  name: 'ipn-event',
  props: ['event'],

  components: {
    CurrencyLabel
  },

  computed: {
    transaction () {
      return this.event.args.txId
    },
    ticker () {
      return this.event.args.currency
    },
    amount () {
      return this.event.args.amount
    },
    txUrl () {
      switch (this.ticker) {
        case 'BTC':
          return `https://blockchain.info/ru/tx/${this.transaction}`
        case 'LTC':
          return `http://explorer.litecoin.net/tx/${this.transaction}`
        case 'BCH':
          return `https://blockdozer.com/insight/tx/${this.transaction}`
        case 'ETC':
          return `http://gastracker.io/tx/${this.transaction}`
        case 'ETH':
          return `https://etherscan.io/tx/${this.transaction}`
        default:
          return `/${this.transaction}`
      }
    }
  }
}
</script>

<style lang="scss">
  .ipn-event {
    display: flex;
    overflow: hidden;

    &__transaction {
      word-break: keep-all;
      text-overflow: ellipsis;
      overflow: hidden;
      flex-shrink: 1;
    }

    &__amount {
      margin-left: auto;
      word-break: keep-all;
      flex-shrink: 0;
    }
  }
</style>

