import axios from 'axios'
let instance

export default class ApiService {
  constructor () {
    this.apiDomain = process.env.API_URL || '/api'
    console.log(`Api Domain is ${this.apiDomain}`)
    instance = instance || this
    return instance
  }

  _call (session, url, method, payload) {
    axios.defaults.headers.common['Authorization'] = `${session.tokenType} ${session.accessToken}`

    if (typeof payload === 'undefined') {
      return axios[method.toLowerCase()](this.apiDomain + url)
    } else {
      return axios[method.toLowerCase()](this.apiDomain + url, payload)
    }
  }

  login (session) {
    return this._call(session, '/user/login', 'GET')
  }

  me (session) {
    return this._call(session, '/user/me', 'GET')
  }

  wallet (session, currency) {
    return this._call(session, `/payments/wallet/${currency}`, 'GET')
  }
}