<template lang="pug">
  div(:class='b()')
    div(:class="b('image-wrapper')")
      img(:class="b('image')" :src='userpic')
    div(:class="b('content')")
      p(:class="b('nickname')") {{ nickname }}
      p(:class="b('balance')") 
        currency-label(
          ticker="ETM"
          :value='balance'
          :precision='2'
        )
        //- span(:class="b('balance-amount')") 0
        //- span(:class="b('balance-ticker')") ETM
    div(:class="b('logout')")
      el-button(@click='logout' :class="b('logout-button')")
        i.el-icon-circle-close-outline
    //- pre {{ saleProgress }}
    //- pre {{ saleInfo }}
</template>

<script>
import CurrencyLabel from '@/components/CurrencyLabel'
import { ACTION_TYPES } from '@/constants'

export default {
  name: 'user-badge',
  props: ['profile', 'balance'],
  components: {
    CurrencyLabel
  },
  computed: {
    userpic () {
      return this.profile ? this.profile.picture : null
    },
    nickname () {
      return this.profile ? this.profile.nickname : null
    }
  },
  methods: {
    logout () {
      this.$store.dispatch(ACTION_TYPES.Logout)
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
.user-badge {
  display: flex;
  padding: 20px;

  background-color: #2c404c;
  color: white;

  &__image-wrapper {
    margin-right: 10px;
  }

  &__image {
    width: 65px;
    height: 65px;
    display: block;
    border-radius: 999px;
    // border: 3px solid white;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__nickname {
    margin: 0;
    margin-bottom: 10px;
    font-size: 120%;
    font-weight: bold;
  }

  &__balance {
    margin: 0;

    &-ticker {
      margin-left: 4px;
    }
  }
}
</style>
