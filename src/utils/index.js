/**
 * 获取链接参数对象
 * @param {*链接} url 
 */
function getParams (url = window.location.href) {
  let params = {}
  if (url && url.indexOf('?') !== -1 && url.indexOf('=') !== -1) {
    url.split('?')[1].split('&').forEach((li) => {
      let param = li.split('=')
      if (param.length > 1) {
        if (param[0].length > 0 && param[1].length > 0) {
          params[param[0]] = param[1]
        }
      }
    })
  }
  return params
}

/**
 * 判断对象是否为空
 * @param {*对象} obj 
 */
function isEmptyObj (obj) {
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      return false
    }
  }
  return true
}

/**
 * 判断对象是否为数组
 * @param {*对象} o 
 */
function isArray (o) {
  return Object.prototype.toString.call(o) === '[object Array]'
}

/**
 * 时间戳格式化
 * @param {*时间戳} time 
 * @param {*格式} format 
 */
function dateFormat (time, format='YYYY/MM/DD hh:mm:ss') {
  if (time) {
    let date = new Date(time)
    let func = function (i) { return i < 10 ? ('0' + i) : i }
    return format.replace(/YYYY|MM|DD|hh|mm|ss/g, (item) => {
      switch (item) {
        case 'YYYY':
          return func(date.getFullYear())
        case 'MM':
          return func(date.getMonth() + 1)
        case 'DD':
          return func(date.getDate())
        case 'hh':
          return func(date.getHours())
        case 'mm':
          return func(date.getMinutes())
        case 'ss':
          return func(date.getSeconds())
        default:
          break
      }
    })
  } else {
    return ''
  }
}

/**
 * 获取cookie
 * @param {*键} name 
 */
function getCookie (name) {
  var reg = new RegExp('(^| )' + name + '(?:=([^;]*))?(;|$)')
  var val = document.cookie.match(reg)
  return val ? (val[2] ? unescape(val[2]) : '') : null
}

/**
 * 添加cookie
 * @param {*键} name 
 * @param {*值} v 
 * @param {*路径} path 
 * @param {*过期秒数} expire 
 * @param {*域} domain 
 */
function addCookie (name, v, path = '/', expire, domain) {
  var s = name + '=' + escape(v) + '; path=' + (path || '/') + (domain ? ('; domain=' + domain) : '')
  if (expire > 0) {
    var d = new Date()
    d.setTime(d.getTime() + expire * 1000)
    s += ';expires=' + d.toGMTString()
  }
  document.cookie = s
}

/**
 * 删除cookie
 * @param {*键} name 
 * @param {*路径} path 
 */
function delCookie(name, path = '/') {
  document.cookie = `${name}=;path=${path};expires=Thu, 01-Jan-70 00:00:01 GMT`
}

/**
 * 是否是移动端
 */
function isMobile () {
  return window.innerWidth > 768 ? false : true
}

/**
 * 时间格式化
 * @param {*秒} time 
 */
function readTime (time) {
  time = Math.round(time)
  if (time < 60) {
    return time + '秒'
  } else if (time / 60 < 60) {
    return parseInt(time / 60, 10) + '分钟' + (time % 60 ? time % 60 + '秒' : '')
  } else if (time / 3600 < 24) {
    return parseInt(time / 3600, 10) + '小时' + (parseInt(time % 3600 / 60, 10) ? parseInt(time % 3600 / 60, 10) + '分钟' : '') + (time % 60 ? time % 60 + '秒' : '')
  } else {
    return '1天'
  }
}

export {
  getParams,
  isEmptyObj,
  isArray,
  dateFormat,
  getCookie,
  addCookie,
  delCookie,
  isMobile,
  readTime
}
