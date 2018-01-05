import axios from 'axios'
let instance

class ApiService {
  constructor () {
    instance = instance || this
    return instance
  }

  _call (ctx, url, method, payload) {
    axios.defaults.headers.common['Authorization'] = `${ctx.$store.state.session.tokenType} ${ctx.$store.state.session.accessToken}`
    return axios[method.toLowerCase()](url)
    // return new Promise((resolve, reject) => {
    //   const url = this.apiUrl + url
    //   const xhr = new XMLHttpRequest()
    //   xhr.open('GET', url)
    //   xhr.setRequestHeader(
    //     'Authorization',
    //     'Bearer ' + ctx.$store.state.session.accessToken
    //   )

    //   xhr.onload = function () {
    //     if (xhr.status === 200) {
    //       // update message
    //       resolve(JSON.parse(xhr.responseText))
    //     } else {
    //       reject(xhr.statusText)
    //     }
    //   }

    //   xhr.send()
    // })
  }

  me (ctx) {
    return this._call(ctx, '/api/user/me', 'GET', {})
  }

  wallet (ctx, currency) {
    return this._call(ctx, `/api/payments/wallet/${currency}`, 'GET', {})
  }
}

export default new ApiService()