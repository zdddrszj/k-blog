import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '@/src/actions/user'
import * as articleActions from '@/src/actions/article'
import * as types from '@/src/constants/actionTypes'
import Header from '@/src/components/header'
import Footer from '@/src/components/footer'
import Details from '@/src/components/details'
import SideBar from '@/src/containers/sidebar'

class Detail extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount () {
    this.props.userActions.isLogin()
    this.props.dispatch({ type: types.TOGGLE_MENU, data: { isShow: false } })
    this.props.articleActions.getArticleDetail({
      _id: this.props.match.params.articleId
    })
  }
  render () {
    return (
      <div className="wrapper">
        <div className="wrapper-header">
          <Header user={this.props.user} actions={this.props.userActions} dispatch={this.props.dispatch}></Header>
        </div>
        <section className="wrapper-container">
          <article className="main detail">
            {
              this.props.article.detail && this.props.article.detail.id 
                ? <Details detail={this.props.article.detail}></Details>
                : null
            }
          </article>
          <SideBar {...this.props}></SideBar>
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

export default connect(mapStateToProps, mapDispatchToProps)(Detail)