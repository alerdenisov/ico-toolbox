import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/containers/Welcome'
import store from '@/store'

import Dashboard from '@/containers/Dashboard'
import Contribute from '@/containers/Contribute'
import Affilate from '@/containers/Affilate'
import Transactions from '@/containers/Transactions'
import Contributors from '@/containers/Contributors'
import Referal from '@/containers/Referal'
import Events from '@/containers/Events'
import AuthenticationCallback from '@/containers/AuthenticationCallback'

const nestedView = {
  render (c) { return c('router-view') }
}

function authentication () {
  return function (to, from, next) {
    if (!store.state.session) {
      return next({
        path: '/',
        query: { error: 'NotSigned' }
      })
    } else {
      return next()
    }
  }
}

function nonAuthentication () {
  return function (to, from, next) {
    if (store.state.session) {
      return next({
        path: '/app/dashboard'
      })
    } else {
      return next()
    }
  }
}

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      component: nestedView,
      beforeEnter: nonAuthentication(),
      // NonAuth
      children: [
        {
          path: '/',
          name: 'Welcome',
          component: Welcome,
          props: true
        },
        {
          path: '/:referrer',
          name: 'Referal',
          component: Referal,
          props: true
        },
        {
          path: '/auth/callback',
          name: 'AuthenticationCallback',
          component: AuthenticationCallback
        }
      ]
    },
    {
      path: '/app',
      component: nestedView,
      beforeEnter: authentication(),
      // AuthOnly
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'contribute',
          name: 'Contribute',
          component: Contribute
        },
        {
          path: 'affilate',
          name: 'Affilate',
          component: Affilate
        },
        {
          path: 'transactions',
          name: 'Transactions',
          component: Transactions
        },
        {
          path: 'contributors',
          name: 'Contributors',
          component: Contributors
        },
        {
          path: 'events',
          name: 'Events',
          component: Events
        }
      ]
    }
  ]
})

// router.beforeEach(async (to, from, next) => {
//   if (!store.state.session) {
//     if (['/', '/auth/callback'].includes(to.path)) {
//       return next()
//     } else {
//       return next({
//         path: '/',
//         query: { error: 'NotSigned' }
//       })
//     }
//   } else {
//     return next()
//   }
// })

router.onError(error => {
  console.log(this, this.$store, error)
})

export default router