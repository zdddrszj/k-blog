import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd'
import * as types from '@/src/constants/actionTypes'

class Category extends PureComponent {
  componentWillMount () {
    this.props.actions.getCategorys()
  }
  toggleMenu (path) {
    this.props.dispatch({ type: types.TOGGLE_MENU, data: { isShow: false } })
    this.props.history.push(path)
  }
  render () {
    const categorys = this.props.categorys
    let categoryId = this.props.match.params.categoryId ? this.props.match.params.categoryId : '0'
    return (
      this.props.isFetching
        ? ''
        : <Menu defaultSelectedKeys={[String(categoryId)]}>
            <Menu.Item key='0'><span onClick={this.toggleMenu.bind(this, '/')}>全部</span></Menu.Item>
            {
              categorys.map((category, index) => {
                return <Menu.Item key={category._id}><a href="javascript:void(0)" onClick={this.toggleMenu.bind(this, `/category/${category._id}`)}>{category.name}</a></Menu.Item>
              })
            }
          </Menu>
    )
  }
}

Category.propTypes = {
  categorys: PropTypes.array,
  actions: PropTypes.object,
  dispatch: PropTypes.func
}

export default Category