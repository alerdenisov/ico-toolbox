import Auth0Lock from 'auth0-lock'
import eventEmitter from 'event-emitter'

export default class AuthService {
  constructor () {
    this.auth0 = new Auth0Lock(
      'fSCBGh15rlKaKyhzkrfq1w2tROQibzrE',
      'aofg.eu.auth0.com',
      {
        auth: {
          responseType: 'token id_token',
          redirect: false,
          redirectUrl: window.location.origin + '/auth/callback',
          params: {
            scope: 'openid profile name email picture'
          }
        }
      }
    )

    this.auth0.on('authenticated', authResult => {
      this.emit('authenticated', authResult)
    })

    // this.auth0 = new auth0.WebAuth({
    //   domain: 'aofg.eu.auth0.com',
    //   clientID: 'fSCBGh15rlKaKyhzkrfq1w2tROQibzrE',
    //   redirectUri: window.location.origin + '/auth/callback',
    //   audience: 'https://aofg.eu.auth0.com/userinfo',
    //   responseType: 'token id_token',
    //   scope: 'openid email profile'
    // })

    eventEmitter(this)
  }

  show () {
    this.auth0.show()
  }

  hide () {
    this.auth0.hide()
  }
}