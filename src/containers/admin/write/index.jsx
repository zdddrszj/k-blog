import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import Header from '@/src/components/header'
import Footer from '@/src/components/footer'
import AdminSideBar from '@/src/containers/admin/sidebar'
import Editor from '@/src/components/admin/editor'
import Loading from '@/src/components/loading'
import { Form, Input, Select, Button, Modal } from 'antd'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as sidebarActions from '@/src/actions/sidebar'
import * as userActions from '@/src/actions/user'
import * as articleActions from '@/src/actions/article'
import { apis, fetchPostForm } from '@/src/utils/apis'
import { getParams } from '@/src/utils'
import * as types from '@/src/constants/actionTypes'

import './index.scss'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};

class WriteRule extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      formData: {
        _id: '',
        title: '',
        content: '',
        categoryId: '',
        tagIds: []
      },
      msg: '',
      isLoading: true,
      modal: {
        text: '',
        visible: false,
        // 文章状态：1 已发布 2 草稿 3 删除 4 已审核通过
        status: ''
      }
    }
    this.contentChangeCB = this.contentChangeCB.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.tagJustify = this.tagJustify.bind(this)
  }
  componentWillMount () {
    // 判断是否登录
    this.props.userActions.isLogin()
      .then(() => {
        if (this.props.user.isLogin) {
            this.props.sidebarActions.getCategorys()
            this.props.sidebarActions.getTags()
          // 文章编辑时获取详情
          let articleId = getParams(this.props.location.search).articleId
          if (articleId) {
            this.props.articleActions.getArticleDetail({
              _id: articleId
            })
          } else {
            // 文章新加时清空state文章详情内容
            this.props.dispatch({ type: types.GET_ARTICLE_DETAIL, data: [] })
          }
        }
        this.setState({
          isLoading: false
        })
      })
  }
  componentWillReceiveProps (nextProps) {
    let detailData = nextProps.article.detail
    if (detailData && detailData._id) {
      let tagIds = []
      detailData.tagIds.forEach(tag => {
        tagIds.push(tag._id)
      })
      this.setState({
        formData: {
          _id: detailData._id,
          title: detailData.title,
          content: detailData.content,
          categoryId: detailData.categoryId._id,
          tagIds: tagIds
        }
      })
    } else {
      this.setState({
        formData: {
          _id: '',
          title: '',
          content: '',
          categoryId: '',
          tagIds: []
        }
      })
    }
  }
  /**
   * 表单提交
   * @param {*状态} status 1 已发布 2 草稿 3 删除 4 已审核,
   */
  handleSubmit (status) {
    // console.log(this.props.form.getFieldValue('title'))
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.tagJustify(values.tagIds).then(tagIds => {
          let data = new FormData()
          data.append('status', status)
          if (this.state.formData._id) {
            data.append('_id', this.state.formData._id)
          }
          data.append('title', values.title)
          data.append('content', values.content)
          data.append('categoryId', values.categoryId)
          data.append('tagIds', tagIds)
          fetchPostForm(apis.addArticle, data, { type: 'form-data' })
            .then(res => {
              this.setState({
                msg: res.msg
              })
            })
        })
      }
    })
  }
  /**
   * 显示modal
   * @param {*状态} status 
   */
  showModal (status) {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          modal: {
            visible: true,
            status: status,
            text: String(status) === '2' ? '您确定将该文章存储为草稿吗？' : '您确定发布该文章吗？'
          }
        })
      }
    })
  }
  /**
   * 确定提交
   */
  handleOk () {
    let status = this.state.modal.status
    status && this.handleSubmit(status)
    this.setState({
      modal: {
        visible: false,
        status: ''
      }
    })
  }
  /**
   * 取消提交
   */
  handleCancel () {
    this.setState({
      modal: {
        visible: false,
        status: ''
      }
    })
  }
  /**
   * Editor组件回调事件
   * @param {*文章内容} content 
   */
  contentChangeCB (content) {
    this.props.form.setFieldsValue({
      'content': content
    })
    this.setState({
      formData: {
        content: content
      }
    })
  }
  /**
   * 没有添加的标签进行添加
   * @param {*选择的标签} values 
   */
  tagJustify (values) {
    let _this = this
    let notExist = []
    values.forEach((v, i) => {
      let flag =  _this.props.sidebar.tags.filter(tag => {
        return tag._id === v
      })
      if (flag.length === 0) {
        notExist.push(new Promise(resolve => {
          _this.props.sidebarActions.addTag({name: v}).then(data => {
            if (data && data._id) {
              resolve(data._id)
            }
          })
        }))
      } else {
        notExist.push(new Promise(resolve => {
          resolve(v)
        }))
      }
    })
    return Promise.all(notExist)
  }
  render () {
    if (this.state.isLoading) {
      return <Loading></Loading>
    }
    if(!this.props.user.isLogin) {
      return (
        <Redirect to={`/login?returnUrl=${encodeURIComponent(window.location.href)}`}/>
      )
    }
    const { getFieldDecorator } = this.props.form
    let formData = this.state.formData
    let modal = this.state.modal
    return (
      <div className="wrapper">
        <div className="wrapper-header">
          <Header user={this.props.user} actions={this.props.userActions} dispatch={this.props.dispatch}></Header>
        </div>
        <section className="wrapper-container">
          <div className="main write">
            {
              this.state.msg 
              ? <div>
                { this.state.msg }  &nbsp;&nbsp;&nbsp;&nbsp;<a className="ant-tag ant-tag-blue" href="javascript:location.reload()">继续写文章</a>
              </div>
              : <Form className="write-form" ref="form">
                  <FormItem
                    {...formItemLayout}
                    label="文章标题"
                  >
                    {getFieldDecorator('title', {
                      initialValue: formData.title,
                      rules: [{
                        required: true,
                        message: '请输入文章标题',
                      }]
                    })(
                      <Input placeholder="请输入文章标题" />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="文章内容"
                    className="write-form__content"
                  >
                    {getFieldDecorator('content', {
                      initialValue: formData.content,
                      rules: [{
                        required: true,
                        message: '请输入文章内容',
                      }]
                    })(
                      <Editor content={formData.content} contentChangeCB={this.contentChangeCB}></Editor>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="文章分类"
                  >
                    {
                      formData.categoryId
                      ? getFieldDecorator('categoryId', {
                          initialValue: formData.categoryId,
                          rules: [{
                            required: true,
                            message: '请选择文章分类',
                          }]
                        })(
                          <Select placeholder="请选择文章分类">
                            {
                              this.props.sidebar.categorys.map((category, index) => {
                                return <Option key={index} value={category._id}>{category.name}</Option>
                              })
                            }
                          </Select>
                        )
                      : getFieldDecorator('categoryId', {
                          rules: [{
                            required: true,
                            message: '请选择文章分类',
                          }]
                        })(
                          <Select placeholder="请选择文章分类">
                            {
                              this.props.sidebar.categorys.map((category, index) => {
                                return <Option key={index} value={category._id}>{category.name}</Option>
                              })
                            }
                          </Select>
                        )
                    }
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="文章标签"
                  >
                    {getFieldDecorator('tagIds', {
                      initialValue: formData.tagIds,
                      rules: [{
                        required: true,
                        message: '请选择文章标签',
                      }]
                    })(
                      <Select mode="tags" placeholder="请选择文章标签">
                        {
                          this.props.sidebar.tags.map((tag, index) => {
                            return <Option key={index} value={tag._id}>{tag.name}</Option>
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} className="write-form__btn">
                    <Button onClick={this.showModal.bind(this, 2)}> 存草稿 </Button> &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={this.showModal.bind(this, 1)}> 发布 </Button> 
                  </FormItem>
                </Form>
            }
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
const Write = Form.create()(WriteRule)

function mapStateToProps (state) {
  return {
    sidebar: state.sidebar,
    user: state.user,
    article: state.article
  }
}

function mapDispatchToProps (dispatch) {
  return { 
    sidebarActions: bindActionCreators(sidebarActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    articleActions: bindActionCreators(articleActions, dispatch),
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Write)
