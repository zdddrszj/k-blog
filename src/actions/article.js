import * as types from '@/src/constants/actionTypes'
import { apis, fetchGet, fetchPost } from '@/src/utils/apis'
import { message } from 'antd'

// 获取文章
export function getArticles (data) {
  return dispatch => {
    dispatch({ type: types.BEGIN_GET_ARTICLES })
    return fetchGet(apis.getArticles, data)
      .then(res => {
        if (res.success && res.code === 10000) {
          dispatch({ type: types.GET_ARTICLES, data: res.data })
        } else {
          message.error(res.msg)
        }
      })
  }
}

// 查看文章详情
export function getArticleDetail (data) {
  return dispatch => {
    dispatch({ type: types.BEGIN_GET_ARTICLE_DETAIL })
    return fetchGet(apis.getArticleDetail, data)
      .then(res => {
        if (res.success && res.code === 10000) {
          dispatch({ type: types.GET_ARTICLE_DETAIL, data: res.data })
        } else {
          message.error(res.msg)
        }
      })
  }
}

// 修改文章状态
export function modifyArticleStatus (data) {
  return dispatch => {
    return fetchPost(apis.modifyArticleStatus, data)
      .then(res => {
        if (res.success && res.code === 10000) {
          dispatch({ type: types.MODIFY_ARTICLE_STATUS, data: res.data })
        } else {
          message.error(res.msg)
        }
      })
  }
}

// 删除文章
export function deleteArticleById (data) {
  return dispatch => {
    return fetchPost(apis.deleteArticleById, data)
      .then(res => {
        if (res.success && res.code === 10000) {
          dispatch({ type: types.DELETE_ARTICLE, data: res.data })
        } else {
          message.error(res.msg)
        }
      })
  }
}

// 图片上传
export function uploadPicture (data) {
  return dispatch => {
    return fetchPost(apis.uploadPicture, data)
      .then(res => {
        if (res.success && res.code === 10000) {
          message.info(res.msg)
        } else {
          message.error(res.msg)
        }
      })
  }
}