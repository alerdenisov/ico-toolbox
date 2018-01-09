<template lang="pug">
  div(:class='b()' ref='container')
    el-card(:class="b('card')")
      el-tabs(v-model='showType')
        el-tab-pane(label='Your', name='your')
          transaction-table(:transactions='myTransactions' ref='table' :maxHeight='maxHeight')
        el-tab-pane(label='100 latest' name='latest')
          transaction-table(:transactions='transactions' :maxHeight='maxHeight')

      pre {{ test }}

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
      maxHeight: 200
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
    setTimeout(() => this.resize(), 200)
    window.addEventListener('resize', () => this.resize())
  },
  methods: {
    resize () {
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