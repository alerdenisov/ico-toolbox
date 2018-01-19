<template lang="pug">
  div(:class="b()")
    a(:href='`mailto:${email}`' :class='b("label", { type: "email" })') {{ name }}
    span(:class='b("label", { type: "roles" })') {{ roles }}
    //- generic-cell(:event='event')
    //- pre(:class="b('output')" :style='{ "max-height": `${maxHeight}px` }') {{ event }}
</template>

<script>
import { GenericCell } from './index'

export default {
  name: 'login-event',
  props: ['event'],

  data () {
    return {
      maxHeight: 200
    }
  },

  components: {
    GenericCell
  },

  computed: {
    email () {
      return this.event.args.profile.email
    },
    name () {
      return this.event.args.profile.name || this.email
    },
    roles () {
      if (this.event.args.profile.roles) {
        return this.event.args.profile.roles.join(', ')
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss">
  .login-event {
    display: flex;

    &__label {
      margin-right: 5px;

      &--type-roles {
        margin-left: auto;
        margin-right: 0;
      }
    }
  }
</style>

