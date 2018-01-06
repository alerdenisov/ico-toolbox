export const ACTION_TYPES = {
  Authentication: 'AUTH_SET_SESSION',
  ReceiveProfile: 'AUTH_RECEIVE_PROFILE',

  ReceiveCoins: 'PAYMENTS_RECEIVE_COINS'
}

export const MUTATION_TYPES = Object.assign({

}, ACTION_TYPES)

export const ACCEPTED_CURRENCIES = [
  'BTC',
  'ETH',
  'ETC',
  'LTC',
  'BCH'
]