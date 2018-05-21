
const os = require('os')

let host = os.networkInterfaces().Ethernet && os.networkInterfaces().Ethernet[1] || os.networkInterfaces().en0 && os.networkInterfaces().en0[1]

const dbConfig = {
  host: host ? host.address : '127.0.0.1',
  port: 19999,
  database: 'kblog',
  username: 'kblogdb',
  password: 'kblogdb'
}

const redisConfig = {
  host: host ? host.address : '127.0.0.1',   // Redis host
  port: 29999,          // Redis port 默认6379
  family: 4,           // 4 (IPv4) or 6 (IPv6)
  password: '12345678',
  db: 0
}

const cookieConfig = {
  path: '/',       // 写cookie所在的路径
  maxAge: 12 * 60 * 60 * 1000,   // cookie有效时长
  httpOnly: true,  // 是否只用于http请求中获取
  overwrite: true,  // 是否允许重写
  secure: false      
}

module.exports = {
  dbConfig,
  redisConfig,
  cookieConfig
}