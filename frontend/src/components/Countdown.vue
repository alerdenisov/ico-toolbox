<template lang="pug">
  div(:class='b()')
    div(v-if='days' :class="b('part', { days })")
      div(:class="b('part-value', { days })") {{ daysValue }}
      div(v-if='help' :class="b('part-help', { days })") days
    div(v-if='hours' :class="b('part', { hours })")
      div(:class="b('part-value', { hours })") {{ hoursValue }}
      div(v-if='help' :class="b('part-help', { hours })") hours
    div(v-if='minutes' :class="b('part', { minutes })")
      div(:class="b('part-value', { minutes })") {{ minutesValue }}
      div(v-if='help' :class="b('part-help', { minutes })") minutes
    div(v-if='seconds' :class="b('part', { seconds })")
      div(:class="b('part-value', { seconds })") {{ secondsValue }}
      div(v-if='help' :class="b('part-help', { seconds })") seconds
</template>

<script>
export default {
  name: 'countdown',
  props: {
    expireAt: {
      type: Number
    },
    days: {
      type: Boolean,
      default: true
    },
    hours: {
      type: Boolean,
      default: true
    },
    minutes: {
      type: Boolean,
      default: true
    },
    seconds: {
      type: Boolean,
      default: true
    },
    help: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      now: 0
    }
  },
  mounted () {
    this.now = Math.trunc(new Date().getTime() / 1000)
    window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000)
    }, 1000)
  },
  computed: {
    distance () {
      return this.expireAt - this.now
    },

    secondsValue () {
      return this.distance % 60
    },

    minutesValue () {
      return Math.trunc(this.distance / 60) % 60
    },

    hoursValue () {
      return Math.trunc(this.distance / 60 / 60) % 24
    },

    daysValue () {
      return Math.trunc(this.distance / 60 / 60 / 24)
    }
  }
}
</script>

<style lang="scss">
.countdown {

}
</style>
