'use strict'

const fp = require('fastify-plugin')
const ws = require('ws')

class FastifyWebsoket {
  constructor (fastify, opts) {
    this.options = Object.assign({
      updateRate: 100,
      port: 4000
    }, opts)

    this.fastify = fastify
    this.server = new ws.Server({
      port: this.options.port
      // server: this.fastify.server
    })

    this.server.on('message', (msg) => {
      if (msg.path && this.messageHandles[msg.path]) {
        this.messageHandles[msg.path](msg.data)
      } else {
        console.log('WS ERROR UNKNOWN MESSAGE')
        console.log(msg)
      }
    })

    this.server.on('connection', connection => {
    })

    this.paused = false
    this.ticks = []
    this.tickInterval = setInterval(this.internalTick.bind(this), this.options.updateRate)
  }

  internalTick () {
    if (!this.paused) {
      this.ticks.forEach(tick => {
        tick(this.fastify, this.server)
      })
    }
  }

  tick(handler) {
    this.ticks.push(handler)
  }

  message (path, handler) {
    this.messageHandles[path] = handler
  }

  connect (url, config) {
    config(new ws(url.replace(/(http)(s)?\:\/\//, "ws$2://")), this.fastify)
  }

  broadcast (path, data) {
    console.log('broadcast message: ' + path)
    this.server.clients.forEach(client => {
      if (client.readyState === ws.OPEN) {
        client.send({
          path,
          data
        })
      }
    })
  }
}

module.exports = fp(async function (fastify, opts) {
  fastify.decorate('ws', new FastifyWebsoket(fastify, opts))
}, '>=0.0.1')
