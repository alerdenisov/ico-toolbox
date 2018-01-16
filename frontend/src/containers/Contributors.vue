<template lang="pug">
  div(:class='b()' ref='container')
    el-card(:class="b('card')")
      h2 Contributors
      h4 Filter:
      
</template>

<script>
export default {
  name: 'contributors',
  dependencies: ['$api'],
  async mounted () {
  }
}
</script>