import * as types from '@/src/constants/actionTypes'
import { apis, fetchGet, fetchPost } from '@/src/utils/apis'
import { message } from 'antd'

// 获取分类
export function getCategorys (data) {
  return dispatch => {
    dispatch({ type: types.BEGIN_GET_CATEGORYS })
    return fetchGet(apis.getCategorys, data)
      .then(res => {
        if (res.success && res.code === 10000) {
          dispatch({ type: types.GET_CATEGORYS, data: res.data })
        } else {
          message.error(res.msg)
        }
      })
  }
}

// 获取标签
export function getTags (data) {
  return dispatch => {
    dispatch({ type: types.BEGIN_GET_TAGS })
    return fetchGet(apis.getTags, data)
      .then(res => {
        if (res.success && res.code === 10000) {
          dispatch({ type: types.GET_TAGS, data: res.data })
        } else {
          message.error(res.msg)
        }
      })
  }
}

// 添加标签
export function addTag (data) {
  return dispatch => {
    return fetchPost(apis.addTag, data)
      .then(res => {
        if (res.success && res.code === 10000) {
          message.info(res.msg)
          return res.data
        } else {
          message.error(res.msg)
        }
      })
  }
}

// 删除标签
export function delTag (data) {
  return dispatch => {
    return fetchPost(apis.delTag, data)
      .then(res => {
        if (res.success && res.code === 10000) {
          message.info(res.msg)
        } else {
          message.error(res.msg)
        }
      })
  }
}