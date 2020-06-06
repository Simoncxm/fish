'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  IMG_URL: '"http://123.57.203.185:8088"',
  SOCKETIO: '"http://localhost:9090/"'
});
