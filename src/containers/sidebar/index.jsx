import React, { PureComponent } from 'react'
import { Icon } from 'antd'
import Category from '@/src/components/category'
import Tags from '@/src/components/tag'
import { connect } from 'react-redux'
import * as sidebarActions from '@/src/actions/sidebar'
import { bindActionCreators } from 'redux'
import { isMobile } from '@/src/utils'
import * as types from '@/src/constants/actionTypes'

import './index.scss'

class SideBar extends PureComponent {
  render () {
    return (
      <div>
        <aside className="sidebar" style={{transform: isMobile() ? (this.props.isShow ? 'translateY(0%)' : 'translateY(-100%)') : ''}}>
          <h4 className="sidebar-title"><Icon type="appstore" />分类</h4>
          <div className="sidebar-items category-items">
            <Category {...this.props}></Category>
          </div>
          <h4 className="sidebar-title"><Icon type="tag" />标签</h4>
          <div className="sidebar-items tag-items">
            <Tags {...this.props}></Tags>
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
    categorys: state.sidebar.categorys,
    tags: state.sidebar.tags,
    isShow: state.sidebar.isShow
  }
}

function mapDispatchToProps (dispatch) {
  return { 
    actions: bindActionCreators(sidebarActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)