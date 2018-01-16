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
    div(:class="b('logout')" @click='logout')
      awesome-icon(name='sign-out' :class="b('logout-icon')")
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
  align-items: center;
  padding: 20px;
  padding-right: 10px;

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
    overflow: hidden;
  }

  &__nickname {
    margin: 0;
    margin-bottom: 10px;
    font-size: 120%;
    font-weight: bold;

    white-space: nowrap;
    word-break: keep-all;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__balance {
    margin: 0;

    &-ticker {
      margin-left: 4px;
    }
  }

  &__logout {
    padding: 10px;
    margin-left: auto;
    opacity: 0.3;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;
    border: 1px solid transparent;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      opacity: 1;
      border-color: rgba(255,255,255,0.5);
      box-shadow: 0 0 3px rgba(255,255,255,0.3);
    }
  }
}
</style>
