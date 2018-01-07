<template lang="pug">
  div(:class="b()" v-loading="loading")
    span(:class="b('address')") {{ address }}
    el-alert(title="Send cryptocurrencies only on address shown above! Don't try to send on any address received from non-official sources!" type="warning")
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
        return this.ticker === 'BTC' ? this.wallet.pubkey : this.wallet.address
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
    async updateWallet () {
      this.wallet = null
      this.loading = true
      this.wallet = (await this.$api.wallet(this.session, this.ticker)).data
      this.loading = false
    }
  }
}
</script>
