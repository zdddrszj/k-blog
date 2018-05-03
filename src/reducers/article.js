import * as types from '@/src/constants/actionTypes'

export default function (state = { detail: {}, lists: [] }, action = {}) {
  switch (action.type) {
    case types.BEGIN_GET_ARTICLES: 
    case types.BEGIN_GET_ARTICLE_DETAIL: 
      return Object.assign({}, state, { isFetching: true })
    // 获取文章列表
    case types.GET_ARTICLES: 
      return {
        ...state,
        lists: action.data.lists ? action.data.lists : {},
        currentPage: action.data.currentPage ? action.data.currentPage : 1,
        total: action.data.total ? action.data.total : 1,
        isFetching: false
      }
    // 获取文章详情
    case types.GET_ARTICLE_DETAIL:
      return {
        ...state,
        detail: action.data,
        isFetching: false
      }
    // 修改文章状态
    case types.MODIFY_ARTICLE_STATUS:
      // 修改store中文章状态
      // let data = action.data
      // state.lists.some(list => {
      //   if (list.id === data.id) {
      //     list.status = data.status
      //     return true
      //   }
      //   return false
      // })
      // 直接删除stone中文章
      if (state.lists.length > 0) {
        let index = ''
        state.lists.some((list, i) => {
          if (list._id === action.data._id) {
            index = i
            return true
          }
          return false
        })
        if (index !== '') {
          state.lists.splice(index, 1)
        }
      }
      return {
        ...state,
        isFetching: false
      }
    // 删除文章
    case types.DELETE_ARTICLE:
      if (state.lists.length > 0) {
        let index = ''
        state.lists.some((list, i) => {
          if (list._id === action.data._id) {
            index = i
            return true
          }
          return false
        })
        if (index !== '') {
          state.lists.splice(index, 1)
        }
      }
      return {
        ...state
      }
    default: 
      return state
  }
}