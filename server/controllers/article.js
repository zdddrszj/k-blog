


let xss = require('xss')
let utils = require('../utils/index.js')
let mongoose = require('mongoose')
let Article = mongoose.model('Article')
let Category = mongoose.model('Category')
let Tag = mongoose.model('Tag')
let User = mongoose.model('User')
let db = require('../utils/db.js')
let { fileUpload }  = require('../utils')

let path = require('path')
let fs = require('fs')

/**
 * 查询所有文章
 */
exports.getArticles = async (ctx) => {
  try {
    let obj = utils.getParams(ctx.request.url)
    let currentPage = parseInt(obj.currentPage, 10)
    let pageSize = parseInt(obj.pageSize, 10)
    delete obj.currentPage
    delete obj.pageSize

    // 后台查询条件需要登录用户id
    let referer = ctx.request.header.referer
    // 管理员查看未审核文章
    if (referer.indexOf('/admin') > -1 && referer.indexOf('/admin/audit') === -1) {
      let SESSIONID = ctx.cookies.get('SESSIONID') || ctx.request.header.referer.cookie.SESSIONID
      if (SESSIONID && ctx.session.key && ctx.session.key === SESSIONID) {
        obj.userId = ctx.session.info._id
      }
    }
    let tagId = obj.tagId
    if (tagId) {
      delete obj.tagId
    }
    // .skip((currentPage - 1) * pageSize).limit(2).
    let query = Article.find(obj).sort({'meta.updateAt': 'desc'})

    if (tagId) {
      query.find({'tagIds': tagId})
    }
    query.populate({
      path: 'categoryId',
      select: 'id name',
      model: Category
    }).populate({
      path: 'tagIds',
      select: 'id name',
      model: Tag
    }).populate({
      path: 'userId',
      select: 'id name',
      model: User
    })
    let ret = await query.exec()
    let ret1 = ret.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    ctx.body = {
      code: 10000,
      success: true,
      data: {
        lists: ret1,
        currentPage: currentPage,
        total: ret.length
      }
    }
  } catch (err) {
    ctx.body = {
      code: -1,
      success: false,
      msg: '查询文章失败'
    }
  }
}

/**
 * 添加文章 & 编辑文章
 * 文章状态：1 已发布 2 草稿 3 删除 4 已审核
 */
exports.addArticle = async (ctx) => {
  let fields = ctx.request.body ? ctx.request.body.fields : {}
  let article
  let articleId
  if (fields._id) {
    article = await Article.findOne({_id: fields._id}).exec()
    for (let key in fields) {
      if (key === 'content') {
        article[key] = xss(fields[key])
      } else if (key === 'tagIds') {
        article[key] = fields[key].split(',')
      } else {
        article[key] = fields[key]
      }
    }
    // 默认已发布文章审批通过
    // if (parseInt(article.status, 10) === 1) {
    //   article.status = 4
    // }
    article.meta.updateAt = new Date()
  } else {
    articleId = await db.getNextSequenceValue('articleId')
    article = new Article({
      id: articleId,
      title: fields.title,
      content: xss(fields.content),
      categoryId: fields.categoryId,
      tagIds: fields.tagIds.split(','),
      // status: parseInt(fields.status, 10) === 1 ? 4 : fields.status, // 默认已发布文章审批通过
      status: fields.status,
      userId: ctx.session.info._id
    })
  }
  let ret = await article.save()
  if (ret && ret._id) {
    if (ret.status === 2) {
      ctx.body = {
        code: 10000,
        success: true,
        data: ret,
        msg: '文章提交成功，已存入草稿。'
      }
    } else {
      ctx.body = {
        code: 10000,
        success: true,
        data: ret,
        msg: '文章提交成功，请耐心等待审核。'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      success: false,
      msg: '添加文章失败。'
    }
  }
}

/**
 * 文章详情
 */
exports.getArticleDetail = async (ctx) => {
  try {
    let obj = utils.getParams(ctx.request.url)
    let query = Article.findOne(obj).populate({
      path: 'categoryId',
      select: 'id name',
      model: Category
    }).populate({
      path: 'tagIds',
      select: 'id name',
      model: Tag
    })
    let ret = await query.exec()
    ctx.body = {
      code: 10000,
      success: true,
      data: ret
    }
  } catch (err) {
    ctx.body = {
      code: -1,
      success: false,
      msg: '查询文章详情失败'
    }
  }
}

/**
 * 修改文章状态
 */
exports.modifyArticleStatus = async (ctx) => {
  try {
    let body = ctx.request.body ? ctx.request.body : {}
    let article = await Article.findOne({_id: body._id}).exec()
    for (let key in body) {
      article[key] = body[key]
    }
    // 默认已发布文章审批通过
    // if (parseInt(article.status, 10) === 1) {
    //   article.status = 4
    // }
    article.meta.updateAt = new Date()
    let ret = await article.save()
    ctx.body = {
      code: 10000,
      success: true,
      data: ret
    }
  } catch (err) {
    ctx.body = {
      code: -1,
      success: false,
      msg: '操作失败'
    }
  }
}

/**
 * 文章永久删除
 */
exports.deleteArticleById = async (ctx) => {
  try {
    let body = ctx.request.body ? ctx.request.body : {}
    let ret = await Article.findByIdAndRemove(body._id).exec()
    ctx.body = {
      code: 10000,
      success: true,
      data: ret,
      msg: '删除成功'
    }
  } catch (err) {
    ctx.body = {
      code: -1,
      success: false,
      msg: '操作失败'
    }
  }
}

/**
 * 图片上传
 */
exports.uploadPicture = async (ctx) => {
  try {
    let body = ctx.request.body ? ctx.request.body.files : {}
    let files = body.image
    if (!(/.jpg|.jpeg|.png|.gif/g).test(path.extname(files.name).toLowerCase())) {  
      ctx.body = {
        code: -1,
        success: false,
        msg: '此文件类型不允许上传'
      }
      return
    }
    let dir = `${path.sep}uploads${path.sep}images`
    let fileName = `${files.name.split('.')[0]}_${(+new Date())}${path.extname(files.name)}`
    let targetDir = path.join(__dirname, '..', dir)
    fileUpload(files, targetDir, fileName)
    ctx.body = {
      code: 10000,
      success: true,
      data: {
        name: files.name,
        url: `${ctx.request.header.origin.split('//')[0]}//${ctx.request.header.host}/images/${fileName}`
      },
      msg: '上传成功'
    }
  } catch (err) {
    ctx.body = {
      code: -1,
      success: false,
      msg: '上传失败'
    }
  }
}