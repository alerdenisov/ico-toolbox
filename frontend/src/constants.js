export const ACTION_TYPES = {
  Referrer: 'AUTH_REFERRER',
  Authentication: 'AUTH_SET_SESSION',
  ReceiveProfile: 'AUTH_RECEIVE_PROFILE',
  UsedMail: 'AUTH_USED_MAIL',
  Logout: 'AUTH_LOGOUT',

  ReceiveCoins: 'PAYMENTS_RECEIVE_COINS',

  SaleInfo: 'SALE_INFO',
  SaleProgress: 'SALE_PROGRESS'
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