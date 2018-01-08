<template lang="pug">
  div(:class='b()')
    div(:class="b('image-wrapper')")
      img(:class="b('image')" :src='userpic')
    div(:class="b('content')")
      p(:class="b('nickname')") {{ nickname }}
      p(:class="b('balance')") 
        span(:class="b('balance-amount')") 0
        span(:class="b('balance-ticker')") ETM
    //- pre {{ saleProgress }}
    //- pre {{ saleInfo }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'user-badge',
  data () {
    return {
    }
  },
  computed: {
    userpic () {
      return this.profile.picture
    },
    nickname () {
      return this.profile.nickname
    },
    ...mapState([
      'profile'
    ])
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
