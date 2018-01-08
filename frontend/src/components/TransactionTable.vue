<template lang="pug">
  div(:class="b()")  
    el-table(:data='transactions' style='width: 100%' max-height="650" :class='b("table")')
      el-table-column(prop='txId' label='Transaction ID')
      el-table-column(prop='currency' label='Currency' width="100")
      el-table-column(prop='address' label='Address')
      el-table-column(prop='status' label='Status' width="100")
      el-table-column(label='Amount' width="250")
        template(slot-scope='scope')
          currency-label(:value='scope.row.amount' :ticker='scope.row.currency')
      el-table-column(label='In BTC' width="250")
        template(slot-scope='scope')
          currency-label(:value='scope.row.btcAmount' ticker='BTC')
</template>

<script>
import CurrencyLabel from '@/components/CurrencyLabel'

export default {
  name: 'transaction-table',
  props: ['transactions'],
  components: {
    CurrencyLabel
  }
}
</script>

<style lang="scss">
.transaction-table {
  &__table {
    .cell {
      word-break: keep-all;
      white-space: nowrap;
    }
  }
}
</style>


