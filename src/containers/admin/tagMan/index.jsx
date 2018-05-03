import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import Header from '@/src/components/header'
import Footer from '@/src/components/footer'
import AdminSideBar from '@/src/containers/admin/sidebar'
import Loading from '@/src/components/loading'
import { Tag, Input, Icon, Modal } from 'antd'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '@/src/actions/user'
import * as sidebarActions from '@/src/actions/sidebar'

import './index.scss'

class Publish extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      inputVisible: false,
      inputValue: '',
      // 本用户创建的标签
      myTags: [],
      // 其他用户创建的标签
      otherTags: [],
      modal: {
        text: '',
        visible: false,
        type: '',
        data: {}
      }
    }
    this.showInput = this.showInput.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputConfirm = this.handleInputConfirm.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }
  componentWillMount () {
    // 判断是否登录
    this.props.userActions.isLogin()
      .then(() => {
        if (this.props.user.isLogin) {
          this.props.sidebarActions.getTags()
        }
        this.setState({
          isLoading: false
        })
      })
  }
  componentWillReceiveProps (nextProps) {
    let tags = nextProps.sidebar.tags
    let userId = this.props.user ? (this.props.user.info ? this.props.user.info._id : '') : ''
    if (tags.length !== (this.state.myTags.length + this.state.otherTags.length) && userId) {
      let myTags = []
      let otherTags = []
      tags.forEach(tag => {
        if (tag.userId === userId) {
          myTags.push(tag)
        } else {
          otherTags.push(tag)
        }
      })
      this.setState({
        myTags: myTags,
        otherTags: otherTags
      })
    }
  }
  handleClose (removedTag) {
    const tags = this.state.myTags.filter(tag => tag !== removedTag)
    this.setState({ myTags: tags })
    this.props.sidebarActions.delTag({_id: removedTag._id})
  }

  showInput () {
    this.setState({ inputVisible: true }, () => this.refs.saveInputRef.focus())
  }

  handleInputChange (e) {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm () {
    let inputValue = this.state.inputValue
    let myTags = this.state.myTags
    if (inputValue && this.props.sidebar.tags.indexOf(inputValue) === -1) {
      this.props.sidebarActions.addTag({ name: inputValue })
        .then(data => {
          if (data && data._id) {
            myTags = [...myTags, data]
            this.setState({
              myTags: myTags
            })
          }
        })
    }
    this.setState({
      inputVisible: false,
      inputValue: ''
    })
  }
  /**
   * 显示modal
   * @param {*类型} type 
   */
  showModal (type, data, e) {
    e && e.preventDefault()
    this.setState({
      modal: {
        visible: true,
        type: type,
        text: String(type) === 'create' ? '您确定创建该标签吗？' : '您确定删除该标签吗？',
        data: data
      }
    })
  }
  /**
   * 确定提交
   */
  handleOk () {
    let type = this.state.modal.type
    if (type === 'create') {
      this.handleInputConfirm()
    } else if (type === 'del') {
      this.handleClose(this.state.modal.data.tag)
    }
    this.setState({
      modal: {
        visible: false,
        type: '',
        data: {}
      }
    })
  }
  /**
   * 取消提交
   */
  handleCancel () {
    let type = this.state.modal.type
    this.setState({
      modal: {
        visible: false,
        type: '',
        data: {}
      }
    })
    if (type === 'create') {
      this.refs.saveInputRef.focus()
    }
  }
  render () {
    const { inputVisible, inputValue, myTags, otherTags, modal } = this.state
    if (this.state.isLoading) {
      return <Loading></Loading>
    }
    if(!this.props.user.isLogin) {
      return (
        <Redirect to={`/login?returnUrl=${encodeURIComponent(window.location.href)}`}/>
      )
    }
    return (
      <div className="wrapper">
        <div className="wrapper-header">
          <Header user={this.props.user} actions={this.props.userActions} dispatch={this.props.dispatch}></Header>
        </div>
        <section className="wrapper-container">
          <div className="main tag-man">
            {
              otherTags.length > 0 && otherTags.map((tag, index) => {
                return (
                  <Tag key={tag._id}>
                    { tag.name }
                  </Tag>
                )
              })
            }
            {
              myTags.length > 0 && myTags.map((tag, index) => {
                return (
                  <Tag key={tag._id} closable={true} onClose={(e) => this.showModal('del', {tag: tag}, e)}>
                    { tag.name }
                  </Tag>
                )
              })
            }
          {
            inputVisible && (
              <Input
                ref="saveInputRef"
                type="text"
                size="small"
                style={{ width: 78 }}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.showModal.bind(this, 'create')}
              />
            )
          }
          {!inputVisible && (
            <Tag
              onClick={this.showInput}
              style={{ background: '#fff', borderStyle: 'dashed' }}
            >
              <Icon type="plus" /> 添加
            </Tag>
          )}
          </div>
          <AdminSideBar {...this.props}></AdminSideBar>
        </section>
        <div className="wrapper-footer">
          <Footer className="wrapper-footer"></Footer>
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

function mapStateToProps (state) {
  return {
    user: state.user,
    sidebar: state.sidebar
  }
}

function mapDispatchToProps (dispatch) {
  return { 
    userActions: bindActionCreators(userActions, dispatch),
    sidebarActions: bindActionCreators(sidebarActions, dispatch),
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Publish)
