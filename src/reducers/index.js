import { combineReducers } from 'redux'
import user from './user'
import sidebar from './sidebar'
import article from './article'

const rootReducer = combineReducers({
  user,
  sidebar,
  article
})

export default rootReducer