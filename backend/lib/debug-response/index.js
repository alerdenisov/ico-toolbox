module.exports = function (module) {
  return function (req, res, next) {
    console.log(`-----${module} request-----`)
    if (req.url)     console.log('Url: ', req.url)
    if (req.method)  console.log('Method: ', req.method)
    if (req.headers) console.log('Headers: ', req.headers)
    if (req.params)  console.log('Params: ', req.params)
    if (req.query)   console.log('Query: ', req.query)
    if (req.body)    console.log('Body: ', req.body)
    // console.log('Raw:', req)
    next()
  }
}