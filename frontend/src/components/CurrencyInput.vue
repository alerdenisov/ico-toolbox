<template lang="pug">
  div(:class='b(mods)')    
    vue-numeric(:currency='currency' currency-symbol-position='suffix' separator=',' :value='value' :min='0' :precision='precision' :class="b('inner', mods)" @input='(value) => this.$emit("input", value)')
    //- input(v-model='value' @input='oninput' :class='b("inner", mods)')
    //- money(v-model='value' v-bind='money' :class='b("inner", mods)')
    span(:class="b('prefix', mods)" v-if="prefix") 
      span(:class="b('prefix-inner', mods)" v-html='prefix')
    span(:class="b('suffix', mods)" v-if="suffix")
      span(:class="b('suffix-inner', mods)" v-if="typeof suffix === 'string'") {{ suffix}}
      div(:class="b('suffix-inner', mods)" v-else)
        img(:class="b('suffix-icon', mods)" :src='suffix.icon' v-if='suffix.icon')
    </span>
    //- span {{ value }}
</template>

<script>
import VueNumeric from 'vue-numeric'
// import { Money } from 'v-money'

export default {
  name: 'el-input',
  props: {
    value: {
      type: Number
    },
    decimals: {
      type: String,
      default: '.'
    },
    thousands: {
      type: String,
      default: ' '
    },
    prefix: {
      type: String | Object,
      default: ''
    },
    suffix: {
      type: String | Object,
      default: ''
    },
    precision: {
      type: Number,
      default: 6
    }
  },

  components: {
    VueNumeric
  },

  data () {
    return {
      internalValue: this.value
    }
  },

  computed: {
    money () {
      return {
        decimal: this.decimals,
        thousands: this.thousands,
        // prefix: this.prefix,
        // suffix: this.suffix,
        precision: this.precision,
        masked: false
      }
    },
    currency () {
      if (this.prefix) {
        return typeof this.prefix === 'object' ? this.prefix.ticker : this.prefix
      } else if (this.suffix) {
        return typeof this.suffix === 'object' ? this.suffix.ticker : this.suffix
      }
      return null
    },
    mods () {
      return {
        prefix: !!this.prefix,
        suffix: !!this.suffix
      }
    }
  },

  methods: {
    oninput (event) {
      console.log('oninput', event)
    }
  }
}
</script>

<style lang="scss">
.el-input {
  &__prefix-inner,
  &__suffix-inner {
    line-height: 28px;
    height: 28px;
    margin: 6px;
    display: inline-block;
  }

  &__suffix-icon {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
