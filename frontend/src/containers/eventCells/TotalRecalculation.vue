<template lang="pug">
  div(:class="b()")
    span(:class='b("label", { type: "btc" })') BTC: {{ btc }}
    span(:class='b("label", { type: "tokens" })') Tokens: {{ tokens }}
</template>

<script>
import { GenericCell } from './index'

export default {
  name: 'total-recalculation',
  props: ['event'],

  data () {
    return {
      maxHeight: 200
    }
  },

  components: {
    GenericCell
  },

  computed: {
    btc () {
      return this.event.args.btcAmount
    },
    tokens () {
      return this.event.args.tokensAmount
    }
  }
}
</script>

<style lang="scss">
  .total-recalculation {
    display: flex;

    &__label {
      margin-right: 5px;
    }
  }
</style>

