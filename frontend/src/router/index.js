import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/containers/Welcome'
import store from '@/store'

import Dashboard from '@/containers/Dashboard'
import Contribute from '@/containers/Contribute'
import Affilate from '@/containers/Affilate'
import Transactions from '@/containers/Transactions'

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
    },
    {
      path: '/contribute',
      name: 'Contribute',
      component: Contribute
    },
    {
      path: '/affilate',
      name: 'Affilate',
      component: Affilate
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: Transactions
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