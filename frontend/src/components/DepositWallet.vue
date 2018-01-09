<i18n>
en:
  warning: "Send cryptocurrencies only on address shown above! 
  Don't try to send on any address received from non-official sources!"
</i18n>
<template lang="pug">
  div(:class="b()" v-loading="loading")
    span(:class="b('address')") {{ address }}
    el-button(@click='createWallet' v-if='wallet') Regenerate
    el-alert(:title='$t("warning")' type="warning" v-if='wallet')
</template>
<script>
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
  computed: {
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
