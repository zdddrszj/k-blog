let mongoose = require('mongoose')
let Schema = mongoose.Schema
let User = require('./user')

/**
 * 定义一个模式，每个模式映射MongoDb的一个集合
 */
let TagSchema = new Schema({
  id: {
    unique: true,
    required: true,
    type: Number,
    get: v => parseInt(v),
    set: v => parseInt(v)
  },
  name: {
    type: String, 
    required: true
  },
  status: {
    type: Number,
    default: 1, // 1 可用 2 删除,
    get: v => parseInt(v),
    set: v => parseInt(v)
  },
  meta: {
    updateAt: {
      type: Date,
      default: Date.now()
    },
    createAt: {
      type: Date,
      default: Date.now()
    }
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: User
  }
},
{
  versionKey: false
})

/**
 * 定义模型Tag
 * 
 * 模型用来实现我们定义的模式，调用mongoose.model来编译Schema得到Model
 * 参数tag对应数据库中的集合名称，不存在会创建
 */
let Tag = mongoose.model('Tag', TagSchema, 'tag')

module.exports = Tag



