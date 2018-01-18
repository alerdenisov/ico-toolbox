<i18n>
en:
  hello: "Hello, {name}."
  excange-title: "Contribute to Musereum with {0}"
</i18n>

<template lang="pug">
  div(:class="b()")
    p(:class="b('subline')")
      span(:class="b('gray')") CRYPTOCURRENCY FOR MUSIC INDUSTRY
    h2(:class="b('header')") Private Pre-Sale of Musereum Tokens

    div(:class="b('center')")
      el-button() White Paper
      el-button() One Pager
      el-button() FAQ

    el-card(:class="b('box', 'dashboard-box--deadline')")
      span(:class="b('box-title')") Round ends
      countdown(:class="b('deadline-countdown')" :expireAt='expireAt')

    el-card(:class="b('box', 'dashboard-box--deadline')")
      span(:class="b('box-title')") Token sold
      div(:class="b('box-content')") 
        currency-label(
          ticker="ETM"
          :value='tokensAmount'
          :precision="2")
      div(:class="b('box-help')") 
        span Remaining 
        currency-label(
            ticker="ETM"
            :value="leftEtm"
            :precision="2")


    el-card(:class="b('box', 'dashboard-box--deadline')")
      span(:class="b('box-title')") Raised
      div(:class="b('box-content')") 
        currency-label(
          ticker="BTC"
          :value="btcAmount"
          :precision="4")
      div(:class="b('box-help')") 
        span From
        | 
        currency-label(
          ticker="BTC"
          :value="200"
          :precision="0")

    el-button(type="primary" @click='() => $router.push("/contribute")' href='/contribute') Contribute Now
</template>

<script>
import { mapState } from 'vuex'
import { ACTION_TYPES } from '@/constants'
import Countdown from '@/components/Countdown'
import CurrencyLabel from '@/components/CurrencyLabel'
export default {
  name: 'dashboard',
  dependencies: ['$api'],
  components: {
    CurrencyLabel,
    Countdown
  },
  computed: {
    endTime () {
      return new Date(this.saleInfo.endTime)
    },
    expireAt () {
      return Math.trunc(this.endTime.getTime() / 1000)
    },

    tokensAmount () {
      return this.saleProgress.tokensAmount
    },

    leftEtm () {
      return (10 * 1e6) - this.tokensAmount
    },

    btcAmount () {
      return this.saleProgress.btcAmount
    },

    leftBtc () {
      return 200 - this.saleProgress.btcAmount
    },

    ...mapState([
      'saleInfo',
      'saleProgress'
    ])
  },

  mounted () {
    this.updateState()
  },

  methods: {
    async updateState () {
      this.loading = true
      const info = (await this.$api.info()).data
      const progress = (await this.$api.progress()).data

      await this.$store.dispatch(ACTION_TYPES.SaleInfo, info)
      await this.$store.dispatch(ACTION_TYPES.SaleProgress, progress)

      this.loading = false
    }
  }
}
</script>

<style lang="scss">
.dashboard {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__box-help,
  &__box-title {
    display: block;
    text-align: center;
    color: #8EABC4;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
  }

  &__box {
    max-width: 400px;
    width: 100%;
    margin-bottom: 30px; 
  }

  &__box-content {
    font-size: 150%;
    font-weight: bold;
    margin: 10px;
    text-align: center;

    @media screen and (max-width: 480px) {
      font-size: 125%;
    }
  }

  &__deadline-countdown {
    display: flex;
    justify-content: center;

    .countdown__part {
      display: flex;
      flex-direction: column;
      align-items: center;

      margin: 0 20px;

      @media screen and (max-width: 920px) {
        margin: 0 10px;
      }

      @media screen and (max-width: 480px) {
        margin: 0 5px;
      }

      &-value {
        font-size: 150%;
        font-weight: bold;
        margin: 10px;
        @media screen and (max-width: 480px) {
          font-size: 125%;
        }
      }

      &-help {
        text-align: center;
        color: #8EABC4;
        text-transform: uppercase;
        font-size: 12px;
        font-weight: bold;
      }
    }
  }
}
</style>
