const qs = require('querystring')
const crypto = require('crypto')
const got = require('got')
const config = process.argv.slice(2)

const currency = config[0]
const address = config[1]
const amount = parseFloat(config[2])
const amounti = Math.floor(amount * 1e8)
const status = config[3] === 'error' ? -2 : parseInt(config[3])
const fee = status >= 100 ? amount * 0.005 : 0
const feei = Math.floor(fee * 1e8)

const message = {
  ipn_version: '1.0',
  ipn_type:	'deposit',
  ipn_mode: 'hmac',
  ipn_id: crypto.createHash('sha256').update(Math.random().toString()).digest('hex'),
  merchant: process.env.COINPAYMENTS_MERCHANT_ID,
  txn_id: crypto.createHash('sha256').update(Math.random().toString()).digest('hex'),
  status_text: 'Test transaction',
  confirms: 0,
  address,
  status,
  currency,
  amount,
  amounti,
  fee,
  feei,
}


async function sendMessage (message) {

  function getPrivateHeadersIPN (parameters) {
    const paramString = qs.stringify(parameters).replace(/%20/g, '+')
    const signature = crypto.createHmac('sha512', process.env.COINPAYMENTS_IPN_SECRET).update(paramString).digest('hex')
    return signature
  }
  
  const hmac = getPrivateHeadersIPN(message)

  const rates = await got.get('http://localhost:3000/api/payments/rates')
  console.log(rates.data)
  
  const response = await got.post('http://localhost:3000/api/payments/ipn', {
    body: message,
    json: true,
    headers: {
      hmac
    }
  })

  console.log(response)
}

sendMessage(message)