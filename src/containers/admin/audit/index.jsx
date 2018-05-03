import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import Header from '@/src/components/header'
import Footer from '@/src/components/footer'
import AdminSideBar from '@/src/containers/admin/sidebar'
import Loading from '@/src/components/loading'
import List from '@/src/components/list'
import { Pagination } from 'antd'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '@/src/actions/user'
import * as articleActions from '@/src/actions/article'

class Draft extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      currentPage: 1,
      pageSize: 2
    }
    this.changePage = this.changePage.bind(this)
    this.getArticles = this.getArticles.bind(this)
  }
  componentWillMount () {
    // 判断是否登录
    this.props.userActions.isLogin()
      .then(() => {
        if (this.props.user.isLogin) {
          this.getArticles()
        }
        this.setState({
          isLoading: false
        })
      })
  }
  changePage (currentPage, pageSize) {
    this.setState({
      currentPage: currentPage
    }, () => {
      this.getArticles()
    })
  }
  getArticles () {
    // 1 已发布 2 草稿 3 删除 4 已审核,
    this.props.articleActions.getArticles({
      status: 1,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize
    })
  }
  render () {
    // console.log('home:' + this.props.match.params)
    if (this.state.isLoading) {
      return <Loading></Loading>
    }
    if(!this.props.user.isLogin) {
      return (
        <Redirect to={`/login?returnUrl=${encodeURIComponent(window.location.href)}`}/>
      )
    }
    let data = this.props.article
    return (
      <div className="wrapper">
        <div className="wrapper-header">
          <Header user={this.props.user} actions={this.props.userActions} dispatch={this.props.dispatch}></Header>
        </div>
        <section className="wrapper-container">
          <article className="main publish">
          {
            data.lists && data.lists.length > 0
              ? data.lists.map(list => {
                  return (
                    <List list={list} key={list._id} {...this.props} actions={this.props.articleActions}></List>
                  )
                })
              : '暂无数据'
          }
          {
            data.lists && data.lists.length > 0 
              ? <Pagination className="page" current={data.currentPage} total={data.total} defaultPageSize={this.state.pageSize} onChange={this.changePage} />
              : null
          }
          </article>
          <AdminSideBar {...this.props}></AdminSideBar>
        </section>
        <div className="wrapper-footer">
          <Footer className="wrapper-footer"></Footer>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user,
    article: state.article
  }
}

function mapDispatchToProps (dispatch) {
  return { 
    userActions: bindActionCreators(userActions, dispatch),
    articleActions: bindActionCreators(articleActions, dispatch),
    dispatch: dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Draft)
