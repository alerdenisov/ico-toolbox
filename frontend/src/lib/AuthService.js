import Auth0Lock from 'auth0-lock'
import Auth0LockPasswordless from 'auth0-lock-passwordless'
import eventEmitter from 'event-emitter'

export default class AuthService {
  constructor () {
    this.auth0passwordless = new Auth0LockPasswordless(
      'fSCBGh15rlKaKyhzkrfq1w2tROQibzrE',
      'aofg.eu.auth0.com',
      {
        auth: {
          params: {
            scope: 'openid profile name email picture'
          }
        }
      }
    )

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
    // this.auth0passwordless.emailcode((err, profile, idToken, state) => {
    //   console.log(err, profile, idToken, state)
    // })

    // this.auth0passwordless.magiclink((err, profile, id_token) => {
    //   console.log(err, profile, id_token)
    //   // Passwordless Authentication handler
    // });
    this.auth0passwordless.emailcode({
      callbackURL: 'http://localhost:8080/',
      authParams: {
        scope: 'openid profile name email picture'  // Learn about scopes: https://auth0.com/docs/scopes
      }
    })
    // this.auth0.show()
  }

  hide () {
    this.auth0.hide()
  }
}