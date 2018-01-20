<template lang="pug">
  div(:class='b()' ref='container')
    el-card(:class="b('card')")
      el-button(@click='createVisible = !createVisible') Create new

      el-table(:data='users' style='width: 100%; margin-top: 30px' :max-height="maxHeight" :class='b("table")' ref='table')
        el-table-column(prop='_id' label='ID')
        el-table-column(prop='nickname' label='Display')
        el-table-column(prop='email' label='Email')
        el-table-column(prop='refId' label='Ref ID')
        el-table-column(prop='roles' label='Roles')
        el-table-column(prop='referrer' label='Referrer')

      el-dialog(
        title="Tips"
        :visible.sync="createVisible"
        width="30%"
        :before-close="handleClose")
        span This is a message
        span.dialog-footer(slot='footer')
          el-button(@click='createVisible = false') Cancel
          el-button(type='primary', @click='createVisible = false') Confirm

</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'users',
  dependencies: ['$api'],
  components: {
  },
  data () {
    return {
      createVisible: false,
      showType: 'your',
      maxHeight: 200,
      resizeTimeout: null
    }
  },
  computed: {
    isAdmin () {
      return this.profile.roles && this.profile.roles.indexOf('admin') !== -1
    },
    ...mapState([
      'session', 'profile'
    ])
  },
  asyncComputed: {
    async users () {
      return (await this.$api.users(this.session)).data
    }
  },
  mounted () {
    this.resize()
    this.resizeTimeout = setTimeout(() => this.resize(), 1000)
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