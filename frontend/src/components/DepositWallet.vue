<i18n>
en:
  warning: "Send cryptocurrencies only on address shown above! 
  Don't try to send on any address received from non-official sources!"
</i18n>
<template lang="pug">
  div(:class="b()" v-loading="loading")
    el-button(@click='createWallet' v-if='wallet' :class="b('refresh')" size="mini")
      awesome-icon(name='refresh')
    span(:class="b('address')") {{ address }}
    div(:class="b('countdown-wrapper')" v-if='wallet')
      countdown(:class="b('countdown')" :expireAt='expireAt' :days='false')
</template>
<script>
import Countdown from '@/components/Countdown'
import { mapState } from 'vuex'
export default {
  name: 'deposit-wallet',
  props: ['ticker'],
  dependencies: ['$api'],
  data () {
    return {
      wallet: null,
      loading: true
    }
  },
  components: {
    Countdown
  },
  computed: {
    expireAt () {
      if (this.wallet) {
        return this.wallet.expireAt
      }

      return 0
    },
    address () {
      if (this.wallet) {
        // return this.ticker === 'BTC' ? this.wallet.pubkey : this.wallet.address
        return this.wallet.address
      }

      return 'Generating...'
    },
    ...mapState([
      'session'
    ])
  },
  watch: {
    ticker: 'updateWallet'
  },
  mounted () {
    this.updateWallet()
  },
  methods: {
    async createWallet () {
      this.wallet = null
      this.loading = true
      this.wallet = (await this.$api.createWallet(this.session, this.ticker)).data
      this.loading = false
    },
    async getWallet () {
      this.wallet = null
      this.loading = true
      this.wallet = (await this.$api.getWallet(this.session, this.ticker)).data
      this.loading = false
    },
    async updateWallet () {
      await this.getWallet()
      if (!this.wallet || !this.wallet.expireAt || this.wallet.expireAt < new Date().getTime() / 1000) {
        await this.createWallet()
      }
    }
  }
}
</script>

<style lang="scss">
.deposit-wallet {
  height: 50px;
  display: flex;
  align-items: center;

  &__refresh {
    margin-right: 5px;
  }

  &__address {
    margin-right: auto;
  }

  &__countdown-wrapper {
    display: inline-block;
  }
  &__countdown {
    display: flex;
    justify-content: center;
    margin-left: 10px;

    .countdown__part {
      display: flex;
      flex-direction: column;
      align-items: center;

      margin: 0 5px;

      &-value {
        font-weight: bold;
        margin-bottom: 5px;
      }

      &-help {
        text-align: center;
        color: #8EABC4;
        text-transform: uppercase;
        font-size: 10px;
        font-weight: bold;
      }
    }
  }
}
</style>
