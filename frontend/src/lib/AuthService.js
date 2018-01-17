import Auth0 from 'auth0-js'
// import Auth0Lock from 'auth0-lock'
// import Auth0LockPasswordless from 'auth0-lock-passwordless'
import eventEmitter from 'event-emitter'

export default class AuthService {
  constructor () {
    this.auth0 = new Auth0.WebAuth({
      domain: 'aofg.eu.auth0.com',
      clientID: 'fSCBGh15rlKaKyhzkrfq1w2tROQibzrE',
      redirectUri: window.location.origin + '/auth/callback',
      responseType: 'token id_token'
    })
    eventEmitter(this)
  }

  show () {
    this.auth0passwordless.emailcode({
      callbackURL: window.location.origin + '/auth/callback',
      responseType: 'token id_token'
    })
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