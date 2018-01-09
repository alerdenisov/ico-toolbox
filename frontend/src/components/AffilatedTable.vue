<template lang="pug">
  //- div(:class="b()")
  //- h4 Hello  
  el-table(:data='users' :max-height="maxHeight" width="100%" :class='b("table")' ref='table')
    el-table-column(prop='_id' label='User ID' width="400")
    el-table-column(prop='name' label='Name')
      //- el-table-column(prop='currency' label='Currency' width="100")
      //- el-table-column(prop='address' label='Address')
      //- el-table-column(prop='status' label='Status' width="100")
      //- el-table-column(label='Amount' width="250")
      //-   template(slot-scope='scope')
      //-     currency-label(:value='scope.row.amount' :ticker='scope.row.currency')
      //- el-table-column(label='In BTC' width="250")
      //-   template(slot-scope='scope')
      //-     currency-label(:value='scope.row.btcAmount' ticker='BTC')
</template>

<script>
import CurrencyLabel from '@/components/CurrencyLabel'

export default {
  name: 'affilated-table',
  props: ['users', 'maxHeight'],
  components: {
    CurrencyLabel
  }
}
</script>

<style lang="scss">
.affilated-table {
  width: 100%;
  &__table {
    width: 100%;
    .cell {
      word-break: keep-all;
      white-space: nowrap;
    }
  }
}
</style>


