import * as types from '@/src/constants/actionTypes'
import { apis, fetchGet, fetchPost } from '@/src/utils/apis'

// 注册
// export function register (data) {
//   return dispatch => {
//     return fetchPost(apis.register, data)
//       .then(res => {
//         if (res.success && res.code === 10000) {
//           dispatch({ type: types.REGISTER, data: res.data})
//         } else {
//           message.error(res.msg)
//         }
//       })
//   }
// }

// 登录
// export function login (data) {
//   return dispatch => {
//     return fetchPost(apis.login, data)
//       .then(res => {
//         if (res.success && res.code === 10000) {
//           dispatch({ type: types.LOGIN, data: res.data})
//         } else {
//           message.error(res.msg)
//         }
//       })
//   }
// }

// 是否登录
export function isLogin () {
  return dispatch => {
    return fetchPost(apis.isLogin)
      .then(res => {
        if (res.success && res.code === 10000) {
          dispatch({ type: types.LOGIN, data: res.data})
        } else {
          dispatch({ type: types.LOGIN_ERROR, data: res.msg})
        }
      })
  }
}

// 登出
export function logout () {
  return dispatch => {
    return fetchPost(apis.logout)
      .then(res => {
        if (res.success && res.code === 10000) {
          dispatch({ type: types.LOGOUT })
        }
      })
  }
}