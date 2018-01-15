<template lang="pug">
  div(:class='b()' ref='container')
    el-card(:class="b('card')")
      el-tabs(v-model='showType')
        el-tab-pane(label='Your', name='your')
          transaction-table(:transactions='myTransactions' ref='table' :maxHeight='maxHeight')
        el-tab-pane(label='100 latest' name='latest')
          transaction-table(:transactions='transactions' :maxHeight='maxHeight')
</template>

<script>
import TransactionTable from '@/components/TransactionTable'
import { mapState } from 'vuex'

export default {
  name: 'transactions',
  dependencies: ['$api'],
  components: {
    TransactionTable
  },
  data () {
    return {
      showType: 'your',
      maxHeight: 200,
      resizeTimeout: null
    }
  },
  computed: {
    ...mapState([
      'session'
    ])
  },
  asyncComputed: {
    async transactions () {
      return (await this.$api.transactions(this.session)).data
    },

    async myTransactions () {
      return (await this.$api.myTransactions(this.session)).data
    },

    async test () {
      return (await this.$api.testtx(this.session)).data
    }
  },
  mounted () {
    // this.resizeTimeout = setTimeout(() => this.resize(), 1000)
  },
  beforeRouteLeave (to, from, next) {
    // console.log('leave')
    // clearTimeout(this.resizeTimeout)
    next()
  },
  methods: {
    resize () {
      console.log(this.$refs)
      const el = this.$refs.table.$el
      const top = el.getBoundingClientRect().top
      const windowHeight = window.innerHeight
      this.maxHeight = windowHeight - top - 45
    }
  }
}
</script>

<style lang="scss">
.transactions {

}
</style>