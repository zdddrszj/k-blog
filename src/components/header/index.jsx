import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { Avatar, Icon } from 'antd'
import * as types from '@/src/constants/actionTypes'

import './index.scss'

class Header extends PureComponent {
  logout () {
    this.props.actions.logout()
  }
  toggleMenu (path) {
    this.props.dispatch({ type: types.TOGGLE_MENU, data: { isShow: false } })
    this.props.history.push(path)
  }
  render () {
    const user = this.props.user
    return (
      <header className="header">
        <div className="header-l">
          <a className="header-l__logo" href="javascript:void(0)" onClick={this.toggleMenu.bind(this, '/')}>博客</a>
          <a href="javascript:void(0)" className="header-l__menu" onClick={() => {this.props.dispatch({ type: types.TOGGLE_MENU, data: '' })}}>
            <i className="iconfont icon-caidan"></i>
          </a>
        </div>
        <div className="header-r">
          {
            user.isLogin 
              ? <div>
                  <span className="header-r__name">亲爱的 {user.info.name}，您好！&nbsp; </span>
                  <a href="javascript:void(0)" className="header-r__logout" onClick={this.logout.bind(this)}>退出</a>
                </div>
              : (
                <div>
                  <Link className="header-r__login" to="/register">注册</Link>
                  <Link className="header-r__login" to={`/login?returnUrl=${encodeURIComponent(window.location.href)}`}>登录</Link>
                </div>
              )
          }
          <a className="header-r__write" href="javascript:void(0)" onClick={this.toggleMenu.bind(this, '/admin/write')}><Icon type="edit"/> 写文章</a>
          <Avatar className="header-r__avatar" onClick={this.toggleMenu.bind(this, '/admin/online')} size="large" icon="user" />
        </div>
      </header>
    )
  }
}

Header.propTypes = {
  user: PropTypes.object,
  actions: PropTypes.object,
  dispatch: PropTypes.func
}

export default withRouter(Header)