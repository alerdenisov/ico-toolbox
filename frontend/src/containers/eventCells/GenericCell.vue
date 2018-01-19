<template lang="pug">
  div(:class="b()")
    pre(:class="b('output')" :style='{ "max-height": `${maxHeight}px` }') {{ event }}
</template>

<script>
export default {
  name: 'generic-cell',
  props: ['event'],

  data () {
    return {
      maxHeight: 200
    }
  }
}
</script>

<style lang="scss">
  .generic-cell {
    &__output {
      overflow: auto;
    }
  }
</style>

