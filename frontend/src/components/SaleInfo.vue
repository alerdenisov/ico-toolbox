<i18n>
en:
  auth: Sign In
ru:
  auth: Вход
</i18n>
<template lang="pug">
  div(:class='b()' v-loading='loading')
    div(:class='b("cell")')
      p(:class='b("title")') Round Ends
      p(:class='b("content")') {{ endTime }}
      p(:class='b("help")') days hours minutes seconds
    div(:class='b("cell")')
      p(:class='b("title")') Round Sold
      p(:class='b("content")') {{ sold }} ETM
      p(:class='b("help")') {{ left }} ETM left
    div(:class='b("cell")')
      p(:class='b("title")') Round Raised
      p(:class='b("content")') {{ raised }} BTC
      p(:class='b("help")') from 513 transitions
    //- pre {{ saleProgress }}
    //- pre {{ saleInfo }}
</template>

<script>
import { mapState } from 'vuex'
import { ACTION_TYPES } from '@/constants'

export default {
  name: 'sale-info',
  dependencies: ['$api'],
  data () {
    return {
      loading: true
    }
  },
  computed: {
    endTime () {
      return this.saleInfo.endTime
    },
    sold () {
      return this.saleProgress.sold
    },
    raised () {
      return this.saleProgress.raised
    },
    left () {
      return this.saleInfo.hardCap - this.sold
    },
    ...mapState([
      'saleInfo',
      'saleProgress'
    ])
  },

  mounted () {
    this.updateState()
  },

  methods: {
    async updateState () {
      this.loading = true
      const info = (await this.$api.info()).data
      const progress = (await this.$api.progress()).data

      await this.$store.dispatch(ACTION_TYPES.SaleInfo, info)
      await this.$store.dispatch(ACTION_TYPES.SaleProgress, progress)

      this.loading = false
    }
  }
}
</script>

<style lang="scss">
.sale-info {
  display: flex;

  &__cell {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__help, &__title, &__content {
    margin: 0;
  }

  &__help,
  &__title {
    text-align: center;
    color: #8EABC4;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
  }

  &__content {
    font-size: 170%;
    font-weight: bold;
    margin: 20px 0;
  }
}
</style>
