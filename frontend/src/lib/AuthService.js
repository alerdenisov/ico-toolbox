import auth0 from 'auth0-js'
import { ACTION_TYPES } from '@/constants'

let instance

class AuthService {
  constructor () {
    this.auth0 = new auth0.WebAuth({
      domain: 'aofg.eu.auth0.com',
      clientID: 'fSCBGh15rlKaKyhzkrfq1w2tROQibzrE',
      redirectUri: window.location.origin + '/auth/callback',
      audience: 'https://aofg.eu.auth0.com/userinfo',
      responseType: 'token id_token',
      scope: 'openid email profile'
    })

    instance = instance || this
    return instance
  }

  login () {
    this.auth0.authorize()
  }

  callback (ctx) {
    const { $router } = ctx
    this.auth0.parseHash((err, authResult) => {
      if (err) {
        return console.log(err)
      }
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(ctx, authResult)
        $router.push({ path: '/' })
      }
    })
  }

  setSession ({ $store }, session) {
    $store.dispatch(ACTION_TYPES.Authentication, session)
  }
}

instance = new AuthService()
export default instance
