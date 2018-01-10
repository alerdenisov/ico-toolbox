<i18n>
en:
  title: Welcome
  subtitle: Token Sale App v.{0}
  auth: Authenticate
  disclaimer: "If you don't receive your own invite code feel free to contact us!"
ru:
  title: Добро пожаловать 
</i18n>

<template lang="pug">
  div(:class='b()' ref='container')
    h1 Affilated contributor list will be available soon as possible
    //- el-card(:class="b('card')")
      //- el-tabs(v-model='showType')
        el-tab-pane(label='Your', name='your')
      
      //- affilated-table(:users='affilated' ref='table' :maxHeight='maxHeight')
</template>

<script>
import AffilatedTable from '@/components/AffilatedTable'
export default {
  name: 'affilated',
  components: {
    AffilatedTable
  },
  computed: {
    affilated () {
      return [
        { _id: 11111111111112222222221, name: 'hello_world' },
        { _id: 11111111111112222222222, name: 'hello_world' },
        { _id: 11111111111112222222223, name: 'hello_world' },
        { _id: 11111111111112222222224, name: 'hello_world' },
        { _id: 11111111111112222222225, name: 'hello_world' },
        { _id: 11111111111112222222226, name: 'hello_world' },
        { _id: 11111111111112222222227, name: 'hello_world' },
        { _id: 11111111111112222222228, name: 'hello_world' },
        { _id: 11111111111112222222229, name: 'hello_world' },
        { _id: 11111111111112222222221, name: 'hello_world' },
        { _id: 11111111111112222222221, name: 'hello_world' },
        { _id: 11111111111112222222221, name: 'hello_world' },
        { _id: 11111111111112222222221, name: 'hello_world' },
        { _id: 11111111111112222222221, name: 'hello_world' },
        { _id: 11111111111112222222221, name: 'hello_world' }
      ]
    }
  },
  data () {
    return {
      maxHeight: 0
    }
  },
  mounted () {
    this.resizeTable()
    window.addEventListener('resize', () => this.resizeTable())
  },
  methods: {
    resizeTable () {
      const el = this.$refs.table.$el
      const top = el.getBoundingClientRect().top
      const windowHeight = window.innerHeight
      this.maxHeight = windowHeight - top - 45
    }
  }
}
</script>

<style lang="scss">
.affilated {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>