export const ACTION_TYPES = {
  Authentication: 'AUTH_SET_SESSION',
  ReceiveProfile: 'AUTH_RECEIVE_PROFILE'
}

export const MUTATION_TYPES = Object.assign({

}, ACTION_TYPES)

export const CURRENCIES = {
  'BTC': {
    name: 'bitcoin',
    icon: 'https://files.coinmarketcap.com/static/img/coins/64x64/bitcoin.png'
  },
  'ETH': {
    name: 'ethereum',
    icon: 'https://files.coinmarketcap.com/static/img/coins/64x64/ethereum.png'
  },
  'ETC': {
    name: 'ethereum-classic',
    icon: 'https://files.coinmarketcap.com/static/img/coins/64x64/ethereum-classic.png'
  },
  'LTC': {
    name: 'litecoin',
    icon: 'https://files.coinmarketcap.com/static/img/coins/64x64/litecoin.png'
  },
  'BCH': {
    name: 'bitcoin-cash',
    icon: 'https://files.coinmarketcap.com/static/img/coins/64x64/bitcoin-cash.png'
  },
  'ETM': {
    name: 'musereum',
    icon: 'https://files.coinmarketcap.com/static/img/coins/64x64/ethereum-classic.png'
  }
}

export const ACCEPTED_CURRENCIES = [
  'BTC',
  'ETH',
  'ETC',
  'LTC',
  'BCH'
]