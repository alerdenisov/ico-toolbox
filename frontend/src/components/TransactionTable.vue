<template lang="pug">
  el-table(:data='transactions' style='width: 100%' :max-height="maxHeight" :class='b("table")' ref='table')
    el-table-column(prop='txId' label='Transaction ID')
    el-table-column(prop='currency' label='Currency' width="100")
      template(slot-scope='scope')
        div(:class="b('currency')")
          img(:src='coinIcon(scope.row.currency)' :class='b("currency-icon")')
          span(:class="b('currency-name')") {{ scope.row.currency }}
    el-table-column(prop='address' label='Address')
    el-table-column(prop='status' label='Status' width="140")
      template(slot-scope='scope')
        el-tag(:type='txStatusType(scope.row.status)' :class="b('status')") 
          i(:class='txStatusIcon(scope.row.status)')
          span(:class="b('status-label')") {{ txStatusLabel(scope.row.status) }}
        //- <el-tag type="success">Tag Two</el-tag>
        //- <el-tag type="info">Tag Three</el-tag>
        //- <el-tag type="warning">Tag Four</el-tag>
        //- <el-tag type="danger">Tag Five</el-tag>
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
  props: ['transactions', 'maxHeight'],
  components: {
    CurrencyLabel
  },

  methods: {
    coinIcon (currency) {
      return `https://www.coinpayments.net/images/coins/${currency}.png`
    },

    txStatusIcon (status) {
      if (status < 0) {
        return 'transaction-table__status-icon el-icon-circle-close-outline'
      }

      if (status < 100) {
        return 'transaction-table__status-icon el-icon-time'
      }

      return 'transaction-table__status-icon el-icon-check'
    },

    txStatusType (status) {
      if (status < 0) {
        return 'danger'
      }

      if (status < 100) {
        return 'info'
      }

      return 'success'
    },

    txStatusLabel (status) {
      if (status < 0) {
        return 'Refected'
      }

      if (status < 100) {
        return 'Pending'
      }

      return 'Complete'
    }
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

  &__currency {
    display: flex
  }

  &__currency-icon {
    display: block;
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }

  &__currency-name {

  }

  &__status-icon {
    margin-right: 6px;
  }
}
</style>


