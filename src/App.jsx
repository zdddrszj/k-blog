import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '@/src/store'
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

import asyncComponent from './async-component'

import './App.scss'

// 获取到异步组件
const Home = asyncComponent(() => import('./containers/home'))
const Detail = asyncComponent(() => import('./containers/detail'))
const Write = asyncComponent(() => import('./containers/admin/write'))
const Online = asyncComponent(() => import('./containers/admin/online'))
const Publish = asyncComponent(() => import('./containers/admin/publish'))
const Draft = asyncComponent(() => import('./containers/admin/draft'))
const Delete = asyncComponent(() => import('./containers/admin/delete'))
const TagMan = asyncComponent(() => import('./containers/admin/tagMan'))
const Audit = asyncComponent(() => import('./containers/admin/audit'))
const Login = asyncComponent(() => import('./containers/login'))
const DevTool = asyncComponent(() => import('./containers/devTools'))

let devTool = ''
if (process.env.NODE_ENV === 'development') {
  devTool = <DevTool/>
}
class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        {/* <div> */}
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Home}></Route>
              <Route exact path="/category/:categoryId" component={Home} ></Route>
              <Route exact path="/tag/:tagId" component={Home} ></Route>
              <Route exact path="/detail/:articleId" component={Detail}></Route>

              <Route exact path="/admin/write" component={Write}></Route>
              <Route exact path="/admin/online" component={Online} ></Route>
              <Route exact path="/admin/publish" component={Publish}></Route>
              <Route exact path="/admin/draft" component={Draft} ></Route>
              <Route exact path="/admin/delete" component={Delete} ></Route>
              <Route exact path="/admin/tag" component={TagMan} ></Route>
              <Route exact path="/admin/audit" component={Audit} ></Route>
              <Route exact path="/login" component={Login}></Route>
              <Route exact path="/register" component={Login}></Route>
              <Redirect to='/' />
            </Switch>
          </BrowserRouter>
          {/* {devTool} */}
        {/* </div> */}
      </Provider>
    )
  }
}

export default App
