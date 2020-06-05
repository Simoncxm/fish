'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  IMG_URL: '"http://localhost:8081"',
  SOCKETIO: '"http://localhost:9090/"'
});
