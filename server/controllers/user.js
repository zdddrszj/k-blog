const utils = require('../utils/index.js')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const db = require('../utils/db.js')
const sha1 = require('sha1')

/**
 * 注册
 */
exports.register = async (ctx, next) => {
  let body = ctx.request.body ? ctx.request.body : {}
  let user = await User.findOne({ name: body.name })
  if (user && user._id) {
    ctx.body = {
      code: -1,
      success: false,
      msg: '注册失败，该用户名已经存在'
    }
  } else if (body.password !== body.passwordAgain) {
    ctx.body = {
      code: -1,
      success: false,
      msg: '注册失败，两次输入的密码不相同'
    }
  } else {
    body.id = await db.getNextSequenceValue('userId')
    let newUser = new User(body)
    let ret = await newUser.save()
    if (ret && ret._id) {
      ctx.session = {
        info: ret,
        key: sha1(ret.id)
      }
      ctx.body = {
        code: 10000,
        success: true,
        data: {_id: ret._id, name: ret.name}
      }
    } else {
      ctx.body = {
        code: -1,
        success: false,
        msg: '注册失败，请检查用户名及密码'
      }
    }
  }
}

/**
 * 登录
 */
exports.login = async (ctx, next) => {
  let body = ctx.request.body ? ctx.request.body : {}
  let ret = await User.findOne(body)
  if (ret && ret._id) {
    ctx.session = {
      info: ret,
      key: sha1(ret.id)
    }
    ctx.body = {
      code: 10000,
      success: true,
      data: {_id: ret._id, name: ret.name}
    }
  } else {
    ctx.body = {
      code: -1,
      success: false,
      msg: '登录失败，请检查用户名及密码'
    }
  }
}

/**
 * 根据条件查询用户
 */
exports.getUser = async (ctx) => {
  try {
    let obj = utils.getParams(ctx.request.url)
    let ret = await User.findOne(obj)
    if (ret && ret._id) {
      ctx.body = {
        code: 10000,
        success: true,
        data: {_id: ret._id, name: ret.name}
      }
    } else {
      ctx.body = {
        code: 10000,
        success: false,
        msg: '该用户不存在'
      }
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      success: false,
      msg: '网络出错'
    }
  }
}

/**
 * 判断用户是否登录
 */
exports.isLogin = async (ctx) => {
  if (ctx.session.key && ctx.cookies.get('SESSIONID') === ctx.session.key) {
    let ret = await User.findOne({id: ctx.session.info.id })
    ctx.body = {
      code: 10000,
      success: true,
      data: {_id: ret._id, name: ret.name}
    }
  } else {
    ctx.body = {
      code: -1,
      success: false,
      msg: '登录已过期'
    }
  }
}

/**
 * 判断用户是否登录 接口用的
 */
exports.isLoginInterface = async (ctx, next) => {
  if (ctx.session.key && ctx.cookies.get('SESSIONID') === ctx.session.key) {
    let u = await User.findOne({id: ctx.session.info.id })
    if (u && u._id) {
      await next()
    } else {
      ctx.body = {
        code: -1,
        success: false,
        msg: '登录已过期'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      success: false,
      msg: '登录已过期'
    }
  }
}

/**
 * 退出
 */
exports.logout = async (ctx) => {
  ctx.cookies.set('SESSIONID', '')
  ctx.cookies.set('SESSIONID.sig', '')
  ctx.session = {}
  ctx.body = {
    code: 10000,
    success: true
  }
}
