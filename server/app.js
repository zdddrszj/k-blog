
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

mongoose.Promise = require('promise')

const { dbConfig, cookieConfig } = require('./config')
/**
 * 连接数据库
 */
mongoose.connect(`mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`)

const db = mongoose.connection;
db.on('error', (err) => {
  console.log('connection error:' + err)
});
db.once('open', () => {
  console.log('connection successful')
});

/**
 * 获取数据库表对应的model对象所在的路径
 */
const models_path = path.join(__dirname, '/models')

/**
 * 用递归的方式读取models文件夹下的模型文件，并require进来
 */
const walk = (modelPath) => {
  fs
    .readdirSync(modelPath)
    .forEach(file => {
      let filePath = path.join(modelPath, '/', file)
      let stat = fs.statSync(filePath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(filePath)
        }
      } else if (stat.isDirectory()) {
        walk(filePath)
      }
    })
}
walk(models_path)

const Koa = require('koa')
const logger = require('koa-logger')
const session = require('./session/index.js')
const koaBody = require('koa-body')
const cors = require('@koa/cors')
const app = new Koa()

app.use(require('koa-static')(__dirname + '/uploads'))

app.keys = ['kblog']
app.use(logger())
app.use(session({
  key: 'SESSIONID',
  cookieConfig: cookieConfig
}))
app.use(koaBody())
app.use(cors())

// 设置response参数中间件
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin)
  ctx.set('Access-Control-Allow-Credentials', true)
  ctx.set('Access-Control-Max-Age', 0)
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DEconstE')
  ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type')
  await next()
})

const router = require('./routers')()

app
  .use(router.routes())
  .use(router.allowedMethods())

app.on('error', (err,ctx) => {
  console.log(err)
})
app.listen(11234)
console.log('server started at port 11234...')