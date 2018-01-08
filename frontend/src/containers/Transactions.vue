<template lang="pug">
  div(:class='b()' ref='container')
    el-card(:class="b('card')")
      el-tabs(v-model='showType')
        el-tab-pane(label='Your', name='your')
          transaction-table(:transactions='myTransactions')
        el-tab-pane(label='100 latest' name='latest')
          transaction-table(:transactions='transactions')

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
      showType: 'your'
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
    }
  },
  mounted () {
    this.resize()
    window.addEventListener('resize', () => this.resize())
  },
  methods: {
    resize () {
      const el = this.$refs.container
      const viewportOffset = el.getBoundingClientRect()
      // these are relative to the viewport, i.e. the window
      const top = viewportOffset.top
      const left = viewportOffset.left
      console.log(top, left, el)
    }
  }
}
</script>

<style lang="scss">
.transactions {

}
</style>