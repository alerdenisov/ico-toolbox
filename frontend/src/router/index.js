import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/containers/Home'
import Authenticate from '@/containers/Authenticate'
import AuthCallback from '@/containers/AuthCallback'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/auth',
      name: 'Authenticate',
      component: Authenticate
    },
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: AuthCallback,
      beforeEnter: (to, from, next) => {
        console.log(arguments)
        next()
      }
    }
  ]
})
