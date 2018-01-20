<template lang="pug">
  div(:class='b()' ref='container')
    el-card(:class="b('card')")
      el-table(:data='users' style='width: 100%' :max-height="maxHeight" :class='b("table")' ref='table')
        el-table-column(prop='_id' label='ID')
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