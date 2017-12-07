var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 'BASE_API': JSON.stringify('http://10.0.4.72:8092'), // 测试环境接口地址
  // BASE_API: 'http://10.1.5.127:8092' // 本地开发环境接口地址
  // BASE_API: 'http://172.30.19.101:8092' // 预发布环境接口地址
})
