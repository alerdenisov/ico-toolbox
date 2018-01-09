module.exports = function (redisClient, method, args) {
  return new Promise(function (resolve, reject) {
    args = args.map(arg => typeof arg === 'string' ? arg : arg.toString())
    
    args.push(function (err, result) {
      if (err) return reject(err)
      resolve(result)
    })
    redisClient[method].apply(redisClient, args)
  })
}
