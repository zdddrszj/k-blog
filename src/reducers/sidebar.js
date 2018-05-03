import * as types from '@/src/constants/actionTypes'

export default function (state = {isShow: false, tags: [], categorys: [] }, action = {}) {
  switch (action.type) {
    case types.BEGIN_GET_CATEGORYS: 
    case types.BEGIN_GET_TAGS:
      return Object.assign({}, state, { isFetching: true })
    case types.GET_CATEGORYS : 
      return {
        ...state,
        categorys: action.data ? action.data : {},
        isFetching: false
      }
    case types.GET_TAGS : 
      return {
        ...state,
        tags: action.data ? action.data : {},
        isFetching: false
      }
    case types.TOGGLE_MENU : 
      return {
        ...state,
        isShow: action.data.hasOwnProperty('isShow') ? action.data.isShow : !state.isShow
      }
    default: 
      return state
  }
}