


let utils = require('../utils/index.js')
let mongoose = require('mongoose')
let Tag = mongoose.model('Tag')
let db = require('../utils/db.js')

/**
 * 查询所有分类
 */
exports.getTags = async (ctx) => {
  let obj = utils.getParams(ctx.request.url)
  ctx.body = {
    code: -1,
    success: false,
    msg: '查询标签失败'
  }
  // 存在参数
  if (!utils.isEmptyObj(obj)) {
    let query = Tag.findOne(obj)
    let ret = await query.exec()
    if (ret) {
      ctx.body = {
        code: 10000,
        success: true,
        data: ret
      }
    }
  } else {
    // 否则查询全部
    let query = Tag.find({status: 1}).sort({'meta.updateAt': 'desc'})
    let ret = await query.exec()
    if (ret) {
      ctx.body = {
        code: 10000,
        success: true,
        data: ret
      }
    }
  }
}

/**
 * 添加分类
 */
exports.addTag = async (ctx) => {
  try {
    let body = ctx.request.body ? ctx.request.body : {}
    let name = body.name
    let ret = await Tag.findOne({name: name}).exec()
    if (ret && ret._id) {
      ctx.body = {
        code: -1,
        success: false,
        msg: '标签名称重复，添加失败'
      }
      return
    }
    let id = await db.getNextSequenceValue('tagId')
    let tag = new Tag({
      id: id,
      name: name,
      userId: ctx.session.info._id
    })
    let ret1 = await tag.save()
    ctx.body = {
      code: 10000,
      success: true,
      data: ret1,
      msg: '添加标签成功'
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      success: false,
      msg: '添加标签失败'
    }
  }
}

/**
 * 更新分类
 */
exports.updateTag = async (ctx) => {
  let body = ctx.request.body ? ctx.request.body : {}
  let tag = await Tag.findOne({id: body.id}).exec()
  for (let key in body) {
    tag[key] = body[key]
  }
  tag.meta.updateAt = new Date()
  let ret = await tag.save()
  if (ret) {
    ctx.body = {
      code: 10000,
      success: true,
      data: ret,
      msg: '更新标签成功'
    }
  } else {
    ctx.body = {
      code: -1,
      success: false,
      msg: '更新分类失败'
    }
  }
}

/**
 * 删除分类
 */
exports.delTag = async (ctx) => {
  try {
    let body = ctx.request.body ? ctx.request.body : {}
    let ret = await Tag.findByIdAndRemove(body._id).exec()
    ctx.body = {
      code: 10000,
      success: true,
      data: ret,
      msg: '删除分类成功'
    }
  } catch (err) {
    ctx.body = {
      code: -1,
      success: false,
      msg: '删除分类失败'
    }
  }
}
