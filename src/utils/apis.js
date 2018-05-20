import 'whatwg-fetch'

let urlPrefix = `${window.location.protocol}//${window.location.hostname}/api/v1`
let apis = {
  register: urlPrefix + '/register',
  login: urlPrefix + '/login',
  getUser: urlPrefix + '/getUser',
  isLogin: urlPrefix + '/isLogin',
  logout: urlPrefix + '/logout',
  getCategorys: urlPrefix + '/getCategorys',
  getTags: urlPrefix + '/getTags',
  addTag: urlPrefix + '/addTag',
  delTag: urlPrefix + '/delTag',
  addArticle: urlPrefix + '/addArticle',
  getArticles: urlPrefix + '/getArticles',
  getArticleDetail: urlPrefix + '/getArticleDetail',
  modifyArticleStatus: urlPrefix + '/modifyArticleStatus',
  deleteArticleById: urlPrefix + '/deleteArticleById',
  uploadPicture: urlPrefix + '/uploadPicture'
}

/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
function obj2String(obj) {
  let ret = ''
  for (let it in obj) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(obj[it]) + '&'
  }
  return ret && ret.substring(0, ret.length - 1)
}

function fetchGet (url, data) {
  let urlTmp = url
  if (data) {
    urlTmp += '?'
    Object.keys(data).forEach(key => {
      urlTmp += `${key}=${data[key]}&`
    })
    urlTmp = urlTmp.substring(0, urlTmp.length - 1)
  }
  return fetch(urlTmp, {
    credentials: 'include' // 总是允许发送cookie
  })
  .then(response => {
    return response.json()
  })
}

function fetchPost (url, data) {
  return fetch(url, {
    method: 'POST',
    credentials: 'include', // 总是允许发送cookie
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: obj2String(data)
  }).then(response => {
    return response.json()
  })
}

function fetchPostForm (url, data, options = {}) {
  return fetch(url, {
    method: 'POST',
    credentials: 'include', // 总是允许发送cookie
    headers: {
      'Accept': 'application/json'
    },
    body: data
  }).then(response => {
    return response.json()
  })
}

export {
  apis,
  fetchGet,
  fetchPost,
  fetchPostForm
}