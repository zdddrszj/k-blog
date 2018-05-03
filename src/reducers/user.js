import * as types from '@/src/constants/actionTypes'

export default function (state = {}, action = {}) {
  switch (action.type) {
    case types.REGISTER:
    case types.LOGIN:
      return {
        ...state,
        info: { ...action.data },
        isLogin: true
      }
    case types.LOGIN_ERROR:
      return {
        ...state,
        isLogin: false
      }
    case types.LOGOUT:
      return {
        ...state,
        info: {},
        isLogin: false
      }
    default: 
      return state
  }
}