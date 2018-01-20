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
    //- h1 Affilated contributor list will be available soon as possible
    div(:class="b('top-row')" style='margin-bottom: 20px;')
      el-card(:class="b('referal')")
        h3 Your referral link
        el-input(:value='origin + myReferralUrl')
          //- template(slot="prepend") {{ origin }} 
      el-card(:class="b('referal')")
        h3 Total referrals contribution
        h2
          currency-label(:value='myReferralsTotal' ticker='BTC')
      el-card(:class="b('referal')")
        h3 Referrer rank
        h2(v-if='referrals && referrals.length') {{ myReferrerRank + 1 }}
        span(v-else) Invite friends to join bounty program
    el-card(:class="b('refferer')")
      h2 Referrals
      el-table(:data='referrals' :max-height="maxHeight" width="100%" :class='b("table")' ref='table')
        el-table-column(prop='_id' label='User ID' width="400")
        el-table-column(prop='name' label='Name' width="250")
          //- el-table-column(prop='currency' label='Currency' width="100")
          //- el-table-column(prop='address' label='Address')
          //- el-table-column(prop='status' label='Status' width="100")
        el-table-column(label='Contribution')
          template(slot-scope='scope')
            currency-label(:value='parseFloat(scope.row.contributed) || 0' ticker='BTC')
      //- pre {{ referrals }}
      //- affilated-table(:users='affilated' ref='table' :maxHeight='maxHeight')
</template>

<script>
import CurrencyLabel from '@/components/CurrencyLabel'
import { mapState } from 'vuex'

export default {
  name: 'affilated',
  dependencies: ['$api'],
  components: {
    CurrencyLabel
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    },
    ...mapState(['session'])
  },
  data () {
    return {
      maxHeight: 0
    }
  },
  mounted () {
    this.resize()
    this.resizeTimeout = setTimeout(() => this.resize(), 1000)
  },
  beforeRouteLeave (to, from, next) {
    // console.log('leave')
    // clearTimeout(this.resizeTimeout)
    next()
  },
  methods: {
    resize () {
      console.log(this.$refs)
      const el = this.$refs.table.$el
      const top = el.getBoundingClientRect().top
      const windowHeight = window.innerHeight
      this.maxHeight = windowHeight - top - 45
    }
  },

  asyncComputed: {
    async myReferralsTotal () {
      return (await this.$api.myReferralsTotal(this.session)).data
    },
    async myReferrerRank () {
      return (await this.$api.myReferrerRank(this.session)).data
    },
    async myReferralUrl () {
      return (await this.$api.myRefId(this.session)).data
    },

    async myReferrer () {
      return (await this.$api.myReferrer(this.session)).data
    },

    async referrals () {
      return (await this.$api.myReferrals(this.session)).data
    }
  }
}
</script>

<style lang="scss">
.affilated {
  flex-grow: 1;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  flex-direction: column;

  &__top-row {
    display: flex;
    align-items: stretch;

    .el-card { margin-left: 20px; flex-grow: 1 }
    .el-card:first-child { margin-left: 0 }

    h2 { margin-bottom: 0 }
  }
}
</style>