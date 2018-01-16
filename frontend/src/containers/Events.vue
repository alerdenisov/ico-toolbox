<template lang="pug">
  div(:class="b()")
    el-card(:class="b('card')")
      h1 Events
      el-table(:data='logs' style='width: 100%' :class='b("table")' ref='table')
        el-table-column(prop='date' label='Date' width="155")
        el-table-column(prop='sender' label='Sender' width="120")
        el-table-column(prop='message' label='Type' width="150")
        el-table-column(prop='data' label='Message')
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'events',
  dependencies: ['$api'],
  computed: {
    ...mapState(['session'])
  },

  asyncComputed: {
    logs: {
      async get () {
        const raw = (await this.$api.logs(this.session)).data
        return raw.map(log => {
          const mod = { ...log }
          mod.date = new Date(log.date).toTimeString()
          mod.data = JSON.stringify(log.args)
          return mod
        })
      },
      default: []
    }
  }
}
</script>