

let Router = require('koa-router')
let koaBody = require('koa-body')

let User = require('../controllers/user')
let Category = require('../controllers/category')
let Tag = require('../controllers/tag')
let Article = require('../controllers/article')


module.exports = function () {
  let router = new Router({
    prefix: '/api/v1'
  })
  // 注册
  router.post('/register', User.register)
  router.post('/login', User.login)
  router.get('/getUser', User.getUser)
  router.post('/isLogin', User.isLogin)
  router.post('/logout', User.logout)
  
  // 分类相关路由
  router.get('/getCategorys', Category.getCategorys)
  router.post('/addCategory', User.isLoginInterface, Category.addCategory)
  router.post('/updateCategory', User.isLoginInterface, Category.updateCategory)

  // 标签相关路由
  router.get('/getTags', Tag.getTags)
  router.post('/addTag', User.isLoginInterface, Tag.addTag)
  router.post('/updateTag', User.isLoginInterface, Tag.updateTag)
  router.post('/delTag', User.isLoginInterface, Tag.delTag)

  // 文章相关
  router.get('/getArticles', Article.getArticles)
  router.post('/addArticle', User.isLoginInterface, koaBody({multipart: true}), Article.addArticle)
  router.get('/getArticleDetail', Article.getArticleDetail)
  router.post('/modifyArticleStatus', User.isLoginInterface, Article.modifyArticleStatus)
  router.post('/deleteArticleById', User.isLoginInterface, Article.deleteArticleById)

  // 图片上传
  router.post('/uploadPicture', User.isLoginInterface, koaBody({multipart: true}), Article.uploadPicture)

  return router
}
