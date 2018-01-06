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
    return axios[method.toLowerCase()](this.apiDomain + url)
  }

  me (session) {
    return this._call(session, '/user/me', 'GET', {})
  }

  wallet (session, currency) {
    return this._call(session, `/payments/wallet/${currency}`, 'GET', {})
  }
}