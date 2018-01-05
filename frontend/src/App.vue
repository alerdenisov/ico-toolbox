<template lang="pug">
  #app
    session-state
    router-view
</template>

<script>
import SessionState from '@/components/SessionState'
export default {
  name: 'app',
  components: {
    SessionState
  }
}
</script>

<style>
body * {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
