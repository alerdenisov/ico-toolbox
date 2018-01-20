<template lang="pug">
  div(:class='b()' ref='container')
    el-card(:class="b('card')")
      el-button(@click='newAndOpen') Create new

      el-table(:data='users' style='width: 100%; margin-top: 30px' :max-height="maxHeight" :class='b("table")' ref='table')
        el-table-column(prop='_id' label='ID')
        el-table-column(prop='nickname' label='Display')
        el-table-column(prop='email' label='Email')
        el-table-column(prop='refId' label='Ref ID')
        el-table-column(prop='roles' label='Roles')
        el-table-column(prop='referrer' label='Referrer')

      el-dialog(
        title="Create user"
        :visible.sync="createVisible"
        width="30%")
        el-row(:gutter='20' v-loading='sendingUser')
          el-col(:span='12')
            el-form()
              el-form-item(label='Email')
                el-input(v-model='rawUser.email')
              el-form-item(label='Referrer')
                el-input(v-model='rawUser.referrer')
          el-col(:span='12')
            el-form
              el-form-item(label='Email')
                el-input(:value='newUser.email' disabled)
              el-form-item(label='Referrer')
                el-input(:value='newUser.referrer' disabled)
        span.dialog-footer(slot='footer')
          el-button(@click='close') Cancel
          el-button(type='primary', @click='sendAndClose' :disabled='sendingUser') Confirm

</template>

<script>
import { mapState } from 'vuex'
const md5 = require('spark-md5').hash

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
      resizeTimeout: null,
      sendingUser: false,
      rawUser: {
        email: '',
        referrer: ''
      }
    }
  },
  computed: {
    isAdmin () {
      return this.profile.roles && this.profile.roles.indexOf('admin') !== -1
    },
    newUser () {
      return {
        email: this.rawUser.email,
        referrer: this.rawUser.referrer ? md5(this.rawUser.referrer).substr(0, 5) : null
      }
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
    newAndOpen () {
      this.rawUser = {
        email: '',
        referrer: ''
      }
      this.createVisible = true
    },
    close () {
      this.createVisible = false
    },
    async sendAndClose () {
      this.sendingUser = true
      await this.$api.updateUser(this.session, this.newUser)
      this.sendingUser = false
      this.createVisible = false
    },
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