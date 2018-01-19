<template lang="pug">
  div(:class="b()")
    span(:class="b('label', { type: 'ticker' })") {{ ticker }}
    span(:class="b('label', { type: 'address' })") {{ address }}
    currency-label(
      :class="b('label', { type: 'rate' })"
      ticker="ETM"
      :value='rate'
      :precision="2")
    //- span(:class='b("label", { type: "roles" })') {{ roles }}
    //- generic-cell(:event='event')
    //- pre(:class="b('output')" :style='{ "max-height": `${maxHeight}px` }') {{ event }}
</template>

<script>
import CurrencyLabel from '@/components/CurrencyLabel'
export default {
  name: 'create-wallet',
  props: ['event'],

  data () {
    return {
      maxHeight: 200
    }
  },

  components: {
    CurrencyLabel
  },

  computed: {
    address () {
      return this.event.args.wallet.address
    },
    ticker () {
      return this.event.args.wallet.currency
    },
    rate () {
      return this.event.args.wallet.rate_btc * 50000
    },
    email () {
      return this.event.args.user.email
    },
    name () {
      return this.event.args.user.name
    },
    roles () {
      if (this.event.args.user.roles) {
        return this.event.args.user.roles.join(', ')
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss">
  .create-wallet {
    display: flex;

    &__label {
      margin-right: 5px;

      &--type-roles {
        margin-left: auto;
        margin-right: 0;
      }

      &--type-rate {
        margin-left: auto;
      }
    }
  }
</style>

