


let utils = require('../utils/index.js')
let mongoose = require('mongoose')
let Category = mongoose.model('Category')
let db = require('../utils/db.js')

/**
 * 查询所有分类
 */
exports.getCategorys = async (ctx) => {
  let obj = utils.getParams(ctx.request.url)
  ctx.body = {
    code: -1,
    success: false,
    msg: '查询分类失败'
  }
  // 存在参数
  if (!utils.isEmptyObj(obj)) {
    let query = Category.findOne(obj)
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
    let query = Category.find({'status': 1}).sort({'id': 1})
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
exports.addCategory = async (ctx) => {
  try {
    let body = ctx.request.body ? ctx.request.body : {}
    let name = body.name
    let ret = await Category.findOne({name: name}).exec()
    if (ret && ret._id) {
      ctx.body = {
        code: -1,
        success: false,
        msg: '分类名称重复，添加失败'
      }
      return
    }
    let id = await db.getNextSequenceValue('categoryId')
    let category = new Category({
      id: id,
      name: name
    })
    let ret1 = await category.save()
    ctx.body = {
      code: 10000,
      data: ret1,
      success: true,
      msg: '添加分类成功'
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      success: false,
      msg: '添加分类失败'
    }
  }
}

/**
 * 更新分类
 */
exports.updateCategory = async (ctx) => {
  let body = ctx.request.body ? ctx.request.body : {}
  let category = await Category.findOne({id: body.id}).exec()
  for (let key in body) {
    category[key] = body[key]
  }
  category.meta.updateAt = new Date()
  let ret = await category.save()
  if (ret) {
    ctx.body = {
      code: 10000,
      success: true
    }
  } else {
    ctx.body = {
      code: -1,
      success: false,
      msg: '添加分类失败'
    }
  }
}
