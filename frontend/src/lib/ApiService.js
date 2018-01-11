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
    if (session && session.tokenType && session.accessToken) {
      axios.defaults.headers.common['Authorization'] = `${session.tokenType} ${session.accessToken}`
    }

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

  getBalance (session, type) {
    return this._call(session, `/sale/balance/${type}`, 'GET')
  }

  getWallet (session, currency) {
    return this._call(session, `/payments/wallet/${currency}`, 'GET')
  }

  createWallet (session, currency) {
    return this._call(session, `/payments/wallet/${currency}/create`, 'GET')
  }

  transactions (session) {
    return this._call(session, `/payments/transactions`, 'GET')
  }
  myTransactions (session) {
    return this._call(session, `/payments/transactions/my`, 'GET')
  }

  rates () {
    return this._call(null, '/payments/rates', 'GET')
  }

  info (session) {
    return this._call(session, '/sale/info', 'GET')
  }

  progress (session) {
    return this._call(session, '/sale/progress', 'GET')
  }

  testtx (session) {
    return this._call(session, '/payments/testtx', 'GET')
  }
}