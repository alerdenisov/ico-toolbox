'use strict'
const axios = require('axios')
const fp = require('fastify-plugin')

async function getAuth0ApiToken (tokenURL, clientId, clientSecret, apiUrl) {
  const tokenRequestResponse = await axios.post(tokenURL, {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    audience: apiUrl
  }, {
    json: true,
    headers: { 'content-type': 'application/json' }
  })
  .then(r => r.data)
  .catch(e => e.response.data)

  if (tokenRequestResponse.error) {
    throw new Error(tokenRequestResponse.error, tokenRequestResponse.error_description)
  }

  tokenRequestResponse.scopes = tokenRequestResponse.scope.split(' ')
  return tokenRequestResponse
}

module.exports = fp(async function (fastify, opts) {
  const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET } = opts
  const authorizationURL = `https://${AUTH0_DOMAIN}/authorize`
  const tokenURL = `https://${AUTH0_DOMAIN}/oauth/token`
  const userInfoURL = `https://${AUTH0_DOMAIN}/userinfo`
  const apiUrl = `https://${AUTH0_DOMAIN}/api/v2/`
  const { access_token, scopes } = await getAuth0ApiToken(tokenURL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, apiUrl)


  function profile(accessToken) {
    const instance = axios.create({
      timeout: 3000,
      headers: {
        'Authorization': accessToken
      }
    })

    return axios.get(userInfoURL, {
      timeout: 3000,
      headers: {
        'Authorization': accessToken
      }
    }).then(r => r.data)
  }

  fastify.register(fp(async function (fastify, opts) {
    fastify.decorate('auth0', {
      profile: profile
    })
  }))

  fastify.register(async function (fastify, opts) {
    console.log(fastify.auth0)
  })
})
