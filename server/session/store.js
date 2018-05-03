let Redis = require('ioredis')
const { redisConfig } = require('../config') 

class RedisStore {
  constructor () {
    this.redis = new Redis(redisConfig)
  }

  async get (sid, ctx) {
    let data = await this.redis.get(`SESSION:${sid}`)
    return JSON.parse(data)
  }

  async set (session, { sid = session.key, maxAge }, ctx) {
    try {
      await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000)
      return sid
    } catch (e) {}
  }

  async destory (sid, ctx) {
    return await this.redis.del(`SESSION:${sid}`)
  }
}

module.exports = RedisStore