let mongoose = require('mongoose')
let Schema = mongoose.Schema
let Category = require('./category')
let Tag = require('./tag')
let User = require('./user')

/**
 * 定义一个模式，每个模式映射MongoDb的一个集合
 */
let ArticleSchema = new Schema({
  id: {
    unique: true,
    required: true,
    type: Number,
    get: v => parseInt(v),
    set: v => parseInt(v),
    index: true
  },
  title: {
    type: String, 
    required: true
  },
  status: {
    type: Number,
    default: 1, // 1 已发布 2 草稿 3 删除 4 已审核通过,
    get: v => parseInt(v),
    set: v => parseInt(v)
  },
  readNum:  {
    type: Number,
    default: 0, // 1 已发布 2 草稿 3 删除,
    get: v => parseInt(v),
    set: v => parseInt(v)
  },
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: Category
  },
  tagIds: [{
    type: mongoose.Schema.ObjectId,
    ref: Tag
  }],
  content: {
    type: String,
    required: true
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
 * 定义模型Category
 * 
 * 模型用来实现我们定义的模式，调用mongoose.model来编译Schema得到Model
 * 参数三category对应数据库中的集合名称，不存在会创建
 */
let Article = mongoose.model('Article', ArticleSchema, 'article')

module.exports = Article