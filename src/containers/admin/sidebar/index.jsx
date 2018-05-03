import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Icon, Menu } from 'antd'
import { isMobile } from '@/src/utils'
import * as types from '@/src/constants/actionTypes'

import './index.scss'

class AdminSideBar extends PureComponent {
  toggleMenu (path) {
    this.props.dispatch({ type: types.TOGGLE_MENU, data: { isShow: false } })
    this.props.history.push(path)
  }
  render () {
    let key = '1'
    switch (this.props.match.path) {
      case '/admin/write':
        key = '1'
        break
      case '/admin/online':
        key = '2'
        break
      case '/admin/publish':
        key = '3'
        break
      case '/admin/draft':
        key = '4'
        break
      case '/admin/delete':
        key = '5'
        break
      case '/admin/tag':
        key = '6'
        break
      case '/admin/audit':
        key = '7'
        break
      default:
        break
    }
    return (
      <div>
        <aside className="sidebar" style={{transform: isMobile() ? (this.props.isShow ? 'translateY(0%)' : 'translateY(-100%)') : ''}}>
        <h4 className="sidebar-title"><Icon type="appstore" />后台管理</h4>
        <div className="sidebar-items category-items">
        <Menu defaultSelectedKeys={[key]}>
          <Menu.Item key='1'><a href="javascript:void(0)" onClick={this.toggleMenu.bind(this, '/admin/write')}>写文章</a></Menu.Item>
          <Menu.Item key='2'><a href="javascript:void(0)" onClick={this.toggleMenu.bind(this, '/admin/online')}>已上线文章</a></Menu.Item>
          <Menu.Item key='3'><a href="javascript:void(0)" onClick={this.toggleMenu.bind(this, '/admin/publish')}>审核中文章</a></Menu.Item>
          <Menu.Item key='4'><a href="javascript:void(0)" onClick={this.toggleMenu.bind(this, '/admin/draft')}>未发布文章</a></Menu.Item>
          <Menu.Item key='5'><a href="javascript:void(0)" onClick={this.toggleMenu.bind(this, '/admin/delete')}>已删除文章</a></Menu.Item>
          <Menu.Item key='6'><a href="javascript:void(0)" onClick={this.toggleMenu.bind(this, '/admin/tag')}>全部标签</a></Menu.Item>
          {
            this.props.user.info && this.props.user.info.name === 'admin'
              ? <Menu.Item key='7'><a href="javascript:void(0)" onClick={this.toggleMenu.bind(this, '/admin/audit')}>待审核文章</a></Menu.Item>
              : ''
          }
        </Menu>
        </div>
        </aside>
        <div 
          onClick={(e) => {
            e.preventDefault()
            this.props.dispatch({ type: types.TOGGLE_MENU, data: { isShow: false } })}
          } 
          className="sdmask" 
          style={{display: isMobile() ? (this.props.isShow ? 'block' : 'none') : 'none'}}></div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    isShow: state.sidebar.isShow
  }
}

export default connect(mapStateToProps)(AdminSideBar)
