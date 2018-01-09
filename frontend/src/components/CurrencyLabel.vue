<template lang="pug">
  span(:class="b(mods)")
    span(v-if='ticker && left'  :class="b('prefix', mods)") {{ ticker }}
    span(:class="b('value', mods)") {{ formated }}
    span(v-if='ticker && !left' :class="b('suffix', mods)") {{ ticker }}
</template>

<script>
import accounting from 'accounting-js'

export default {
  name: 'currency-label',
  props: {
    'ticker': {
      type: String
    },
    'left': {
      type: Boolean,
      default: false
    },
    'value': {
      type: Number,
      default: 0
    },
    'precision': {
      type: Number,
      default: 4
    },
    'separator': {
      type: String,
      default: ' '
    },
    'decimals': {
      type: String,
      default: '.'
    }
  },
  computed: {
    mods () {
      return {}
    },
    symbolPosition () {
      return this.left ? 'left' : 'right'
    },

    formated () {
      return accounting.formatNumber(this.value, {
        precision: Number(this.precision),
        decimal: this.decimals,
        thousand: this.separator
      })
    }
  }
}
</script>

<style lang="scss">
.currency-label {
  margin: 0;
  &__prefix {
    &:after { 
      content: " "
    }
  }
  &__suffix {
    &:before {
      content: " "
    }
  }
}
</style>
