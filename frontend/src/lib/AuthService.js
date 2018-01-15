import Auth0 from 'auth0-js'
// import Auth0Lock from 'auth0-lock'
// import Auth0LockPasswordless from 'auth0-lock-passwordless'
import eventEmitter from 'event-emitter'

export default class AuthService {
  constructor () {
    this.auth0 = new Auth0.WebAuth({
      clientID: 'fSCBGh15rlKaKyhzkrfq1w2tROQibzrE',
      domain: 'aofg.eu.auth0.com',
      redirectUri: window.location.origin + '/auth/callback',
      responseType: 'token id_token'
    })
    // this.auth0passwordless = new Auth0LockPasswordless(
    //   'fSCBGh15rlKaKyhzkrfq1w2tROQibzrE',
    //   'aofg.eu.auth0.com'
    // )

    // this.auth0 = new Auth0Lock(
    //   'fSCBGh15rlKaKyhzkrfq1w2tROQibzrE',
    //   'aofg.eu.auth0.com',
    //   {
    //     auth: {
    //       responseType: 'token id_token',
    //       redirect: false,
    //       redirectUrl: window.location.origin + '/auth/callback',
    //       params: {
    //         scope: 'openid profile name email picture'
    //       }
    //     }
    //   }
    // )

    // this.auth0.on('authenticated', authResult => {
    //   this.emit('authenticated', authResult)
    // })

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
      callbackURL: window.location.origin + '/auth/callback',
      responseType: 'token id_token'
    })
    // this.auth0passwordless.emailcode({
    //   callbackURL: 'http://localhost:8080/auth/callback',
    //   responseType: 'token',
    //   authParams: {
    //     scope: 'openid profile name email picture'  // Learn about scopes: https://auth0.com/docs/scopes
    //   }
    // })
    // this.auth0.show()
  }

  async sendEmail (email) {
    return new Promise((resolve, reject) => {
      this.auth0.passwordlessStart({
        connection: 'email',
        send: 'code',
        email: email
      }, (err, res) => {
        if (err) {
          return reject(err)
        }

        return resolve(res)
      })
    })
  }

  async verifyEmailCode (mail, code) {
    return new Promise((resolve, reject) => {
      this.auth0.passwordlessVerify({
        connection: 'email',
        email: mail,
        verificationCode: code
      }, (err, res) => {
        if (err) {
          return reject(err)
        }

        return resolve(res)
      })
    })
  }

  async callback (hash) {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash(hash, (err, authResult) => {
        if (err) {
          return reject(err)
        } else if (authResult) {
          resolve(authResult)
        }

        reject(new Error('unxpected result'))
      })
    })
  }

  hide () {
    this.auth0.hide()
  }
}