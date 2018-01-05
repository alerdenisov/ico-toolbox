import axios from 'axios'
let instance

class ApiService {
  constructor () {
    this.apiDomain = process.env.API_URL || '/api'
    console.log(`Api Domain is ${this.apiDomain}`)
    instance = instance || this
    return instance
  }

  _call (ctx, url, method, payload) {
    axios.defaults.headers.common['Authorization'] = `${ctx.$store.state.session.tokenType} ${ctx.$store.state.session.accessToken}`
    return axios[method.toLowerCase()](this.apiDomain + url)
  }

  me (ctx) {
    return this._call(ctx, '/user/me', 'GET', {})
  }

  wallet (ctx, currency) {
    return this._call(ctx, `/payments/wallet/${currency}`, 'GET', {})
  }
}

export default new ApiService()