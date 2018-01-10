<template lang="pug">
  div(:class="b(mods)" @click='$emit("click")') 
    img(:src='coinIcon' :class="b('icon', mods)")
    span(:class="b('name', mods)") {{ coinName }}
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'currency-button',
  props: ['ticker', 'selected'],
  computed: {
    coinData () {
      if (this.ticker !== 'ETM') {
        return {
          ticker: this.ticker,
          name: this.coins[this.ticker].name,
          icon: `https://www.coinpayments.net/images/coins/${this.ticker}.png`
        }
      } else {
        return {
          ticker: this.ticker,
          name: 'Musereum',
          icon: 'https://www.coinpayments.net/images/coins/ETH.png'
        }
      }
    },
    coinName () {
      return this.coinData.name
    },
    coinIcon () {
      return this.coinData.icon
    },
    mods () {
      const { selected } = this
      return {
        selected
      }
    },
    ...mapState([
      'coins'
    ])
  }
}
</script>

<style lang="scss">
.currency-button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #ECF5FD;
  margin: 5px 10px;
  margin-left: 0 !important;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  cursor: pointer;

  &__icon {
    width: 38px;
    height: 38px;
    margin-bottom: 10px;
  }
  &__name {
    font-size: 1.1em;
    font-weight: bold;
  }

  &:hover {
    border-color: #a8deff;
  }

  &--selected {
    border-color: #0079C4;
    box-shadow: 0 0 2px #0079C4;

    cursor: default;

    &:hover {
      border-color: #0079C4;
    }
  }
}
</style>
