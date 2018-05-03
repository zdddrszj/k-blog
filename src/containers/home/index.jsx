import React, { PureComponent  } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '@/src/actions/user'
import * as articleActions from '@/src/actions/article'
import * as types from '@/src/constants/actionTypes'
import Header from '@/src/components/header'
import Footer from '@/src/components/footer'
import SideBar from '@/src/containers/sidebar'
import List from '@/src/components/list'
import { Pagination } from 'antd'

class Home extends PureComponent  {
  constructor (props) {
    super(props)
    this.state = {
      categoryId: '',
      tagId: '',
      currentPage: 1,
      pageSize: 2
    }
    this.changePage = this.changePage.bind(this)
  }
  componentWillMount () {
    this.props.dispatch({ type: types.TOGGLE_MENU, data: { isShow: false } })
    this.props.userActions.isLogin()
    let categoryId = this.props.match.params.categoryId
    let tagId = this.props.match.params.tagId
    if (categoryId) {
      this.setState({
        categoryId: categoryId
      }, () => {
        this.updateData()
      })
    } else if (tagId) {
      this.setState({
        tagId: tagId
      }, () => {
        this.updateData()
      })
    } else {
      this.updateData()
    }
  }
  componentWillReceiveProps (nextProps) {
    let currentPage = nextProps.article.currentPage
    if (currentPage && currentPage !== this.state.currentPage) {
      this.setState({
        currentPage: currentPage
      })
    }
    let categoryId = nextProps.match.params.categoryId
    let tagId = nextProps.match.params.tagId
    if (categoryId) {
      if (categoryId !== this.state.categoryId) {
        this.setState({
          categoryId: categoryId,
          tagId: ''
        }, () => {
          this.updateData()
        })
      }
    } else if (tagId) {
      if (tagId !== this.state.tagId) {
        this.setState({
          tagId: tagId,
          categoryId: ''
        }, () => {
          this.updateData()
        })
      }
    } else {
      if (this.state.categoryId || this.state.tagId) {
        this.setState({
          categoryId: '',
          tagId: ''
        }, () => {
          this.updateData()
        })
      }
    }
  }
  updateData (changePage) {
    let categoryId = this.state.categoryId
    let tagId = this.state.tagId
    if (categoryId) {
      this.props.articleActions.getArticles({
        status: 4,
        categoryId: categoryId,
        currentPage: changePage ? this.state.currentPage : 1,
        pageSize: this.state.pageSize
      })
    } else if (tagId) {
      this.props.articleActions.getArticles({
        status: 4,
        tagId: tagId,
        currentPage: changePage ? this.state.currentPage : 1,
        pageSize: this.state.pageSize
      })
    } else {
      this.props.articleActions.getArticles({
        status: 4,
        currentPage: changePage ? this.state.currentPage : 1,
        pageSize: this.state.pageSize
      })
    }
  }
  changePage (currentPage, pageSize) {
    this.setState({
      currentPage: currentPage
    }, () => {
      this.updateData(true)
    })
  }
  render () {
    let data = this.props.article
    return (
      <div className="wrapper">
        <div className="wrapper-header">
          <Header user={this.props.user} actions={this.props.userActions} dispatch={this.props.dispatch}></Header>
        </div>
        <section className="wrapper-container">
          <article className="main home">
          {
            data.lists && data.lists.length > 0
              ? data.lists.map((list, index) => {
                  return (
                    <List list={list} key={index}></List>
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
          <SideBar {...this.props}></SideBar>
        </section>
        <div className="wrapper-footer">
          <Footer></Footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)