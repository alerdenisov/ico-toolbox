import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/containers/Welcome'
import Dashboard from '@/containers/Dashboard'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (!store.state.session || !store.state.profile) {
    if (to.path !== '/') {
      return next({
        path: '/',
        query: { error: 'NotSigned' }
      })
    } else {
      return next()
    }
  } else {
    return next()
  }
})

router.onError(error => {
  console.log(this, this.$store, error)
})

export default router