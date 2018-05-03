import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon, Modal } from 'antd'
import { dateFormat, readTime } from '@/src/utils'

import './index.scss'

class List extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      modal: {
        text: '',
        visible: false,
        _id: '',
        status: ''
      }
    }
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }
  // 编辑文章
  modifyArticleStatus (_id, status) {
    // 1 已发布 2 草稿 3 删除 4 已审核 5 永久删除
    this.props.actions.modifyArticleStatus({
      _id: _id,
      status: status
    })
  }
  // 编辑文章
  goToWrite (_id) {
    this.props.history.push(`/admin/write?articleId=${_id}`)
  }
  /**
   * 显示modal
   * @param {*文章id} _id 
   * @param {*状态} status 
   */
  showModal (_id, status, tip) {
    let text = `您确定${tip}该文章吗？`
    this.setState({
      modal: {
        visible: true,
        _id: _id,
        status: status,
        text: text
      }
    })
  }
  /**
   * 确定
   */
  handleOk () {
    let status = this.state.modal.status
    let _id = this.state.modal._id
    switch (String(status)) {
      case '1':
      case '2':
      case '3':
      case '4':
        this.modifyArticleStatus(_id, status)
        this.setState({
          modal: {
            visible: false,
            _id: '',
            status: ''
          }
        })
        break
      case '-1':
        this.goToWrite(_id)
        break
      case '-2':
        this.props.actions.deleteArticleById({_id: _id})
        this.setState({
          modal: {
            visible: false,
            _id: '',
            status: ''
          }
        })
        break
      default: 
        break
    }
    
  }
  /**
   * 取消提交
   */
  handleCancel () {
    this.setState({
      modal: {
        visible: false,
        _id: '',
        status: ''
      }
    })
  }
  render () {
    let list = this.props.list
    let match = this.props.match ? this.props.match : {}
    let modal = this.state.modal
    return (
      <div className="list">
        <h2 className="list-title">
          <Link to={`/detail/${list._id}`}>{list.title}</Link>
        </h2>
        <div className="list-desc">
          <span className="list-desc__span"><Icon type="calendar" /> {dateFormat(list.meta.createAt)}</span> 
          <span className="list-desc__span"><Icon type="folder" /> <Link to={`/category/${list.categoryId._id}`}>{list.categoryId.name}</Link></span> 
          <span className="list-desc__span"><Icon type="form" /> 字数统计{list.content.length}</span>
          <span className="list-desc__span"><Icon type="laptop" /> 阅读时长{readTime((list.content.length / 300) * 60)}</span> 
        </div>
        <div className="list-intro" dangerouslySetInnerHTML={{__html: list.content.substring(0, 150) + '...'}}>
        </div>
        <div className="list-desc">
          <span className="list-desc__span"><Icon type="calendar" /> {dateFormat(list.meta.updateAt)}</span>
          <span className="list-desc__span"><Icon type="tag-o" />
            {
              list.tagIds.map(tag => {
                return <Link className="list-desc__link" key={tag.id} to={`/tag/${tag._id}`}>{tag.name}</Link>
              })
            }
          </span>
        </div>
        <div>
          {
            match.path && match.path.indexOf('admin') > -1
              ? (
                list.status === 4
                  ? '状态：审核通过' 
                  : list.status === 2
                    ? '状态：草稿'
                    : list.status === 3
                      ? '状态：已删除'
                      : list.status === 1
                        ? '状态：已发布'
                        : ''
              )
              : ''
          }
          {
            match.path && match.path === '/admin/online'
              ? <span className="list-btn">
                  <Button size="small"  onClick={this.showModal.bind(this, list._id, 2, '下线')}>下线</Button>
              </span>
              : null
          }
          {
            match.path && match.path === '/admin/publish'
              ? <span className="list-btn">
                  <Button size="small" onClick={this.showModal.bind(this, list._id, 2, '存稿')}>存稿</Button>
                  <Button size="small" type="danger" onClick={this.showModal.bind(this, list._id, 3, '删除')}>删除</Button>
              </span>
              : null
          }
          {
            match.path && match.path === '/admin/draft'
              ? <span className="list-btn">
                  <Button size="small" type="primary" onClick={this.showModal.bind(this, list._id, -1, '编辑')}>编辑</Button>
                  <Button size="small"  onClick={this.showModal.bind(this, list._id, 1, '发布')}>发布</Button>
                  <Button size="small" type="danger" onClick={this.showModal.bind(this, list._id, 3, '删除')}>删除</Button>
              </span>
              : null
          }
          {
            match.path && match.path === '/admin/delete'
              ? <span className="list-btn">
                  <Button size="small" type="primary" onClick={this.showModal.bind(this, list._id, -1, '编辑')}>编辑</Button>
                  <Button size="small" onClick={this.showModal.bind(this, list._id, 2, '存稿')}>存稿</Button>
                  <Button size="small"  onClick={this.showModal.bind(this, list._id, 1, '发布')}>发布</Button>
                  <Button size="small" type="danger" onClick={this.showModal.bind(this, list._id, -2, '永久删除')}>永久删除</Button>
              </span>
              : null
          }
          {
            match.path && match.path === '/admin/audit'
              ? <span className="list-btn">
                  <Button size="small" onClick={this.showModal.bind(this, list._id, 4, '通过')}>通过</Button>
                  <Button size="small" type="danger" onClick={this.showModal.bind(this, list._id, 2, '拒绝')}>拒绝</Button>
              </span>
              : null
          }
        </div>
        <Modal title="提示"
          visible={modal.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确定"
        >
          <p>{modal.text}</p>
        </Modal>
      </div>
    )
  }
}

List.propTypes = {
  list: PropTypes.object,
  props: PropTypes.object,
  actions: PropTypes.object
}

export default List