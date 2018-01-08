<template lang="pug">
  div(:class="b()")  
    el-table(:data='transactions', style='width: 100%', height='250')
      el-table-column(prop='txId', label='Transaction ID')
      el-table-column(prop='currency', label='Currency')
      el-table-column(prop='address', label='Address')
      el-table-column(prop='status', label='Status')
      el-table-column(prop='amount', label='Amount')
      el-table-column(prop='btcAmount', label='In BTC')
</template>

<script>
export default {
  name: 'transaction-table',
  props: ['transactions']
}
</script>

