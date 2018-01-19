<template lang="pug">
  div(:class="b()")
    el-card(:class="b('card')")
      h1 Events
      el-table(:data='logs' style='width: 100%' :class='b("table")' ref='table')
        el-table-column(prop='date' label='Date' width="155")
          template(slot-scope='scope')
            el-tooltip(class="item" effect="dark" :content="scope.row.date.format('MMMM Do YYYY, h:mm:ss a')" placement="top-start")
              span {{ scope.row.date.fromNow() }}
        el-table-column(prop='sender' label='Sender' width="120")
        el-table-column(prop='message' label='Type' width="150")
        el-table-column(prop='data' label='Message')
          template(slot-scope='scope')
            component(:is='getTemplate(scope.row.message)' :event='scope.row')
            //- generic-cell(:event='scope.row')
            //- currency-label(:value='scope.row.data.' ticker='BTC')
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import { IpnEvent, GenericCell, LoginEvent, TotalRecalculation, CreateWallet, Transaction } from './eventCells'

export default {
  name: 'events',
  dependencies: ['$api'],
  computed: {
    ...mapState(['session'])
  },

  components: {
    GenericCell
  },

  methods: {
    getTemplate (type) {
      switch (type) {
        case 'login':
          return LoginEvent
        case 'total-recalculation':
          return TotalRecalculation
        case 'create-wallet':
          return CreateWallet
        case 'ipn':
          return IpnEvent
        case 'transaction':
          return Transaction
        default:
          return GenericCell
      }
    }
  },

  asyncComputed: {
    logs: {
      async get () {
        const raw = (await this.$api.logs(this.session)).data
        return raw.map(log => {
          const mod = { ...log }
          mod.date = moment(log.date)
          mod.data = JSON.stringify(log.args)
          return mod
        })
      },
      default: []
    }
  }
}
</script>