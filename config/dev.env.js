'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  IMG_URL: '"http://39.107.125.161:8088"',
  // SOCKETIO: '"http://192.144.229.202:9090/"'
  SOCKETIO: '"http://39.107.125.161:9090/"'
});
