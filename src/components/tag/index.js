import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Tag } from 'antd'
import * as types from '@/src/constants/actionTypes'

class Tags extends PureComponent {
  componentWillMount () {
    this.props.actions.getTags()
  }
  toggleMenu (path) {
    this.props.dispatch({ type: types.TOGGLE_MENU, data: { isShow: false } })
    this.props.history.push(path)
  }
  render () {
    let color = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']
    return (
      this.props.isFetching
        ? ''
        : <div>
            <Tag key='0' color={color[parseInt(Math.random(11) * 10, 10)]}>
              <a href="javascript:void(0)" onClick={this.toggleMenu.bind(this, '/')}>全部</a>
            </Tag>
            {
              this.props.tags.map((tag, index) => {
                return <Tag key={tag.id} color={color[parseInt(Math.random(11) * 10, 10)]}>
                  <a href="javascript:void(0)" onClick={this.toggleMenu.bind(this, `/tag/${tag._id}`)}>{ tag.name }</a>
                </Tag>
              })
            }
        </div>
    )
  }
}

Tags.propTypes = {
  tags: PropTypes.array,
  actions: PropTypes.object
}

export default Tags