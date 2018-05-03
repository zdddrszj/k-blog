import React, { PureComponent } from 'react'
import { Form, Icon, Input, Button, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import DotCanvas from '@/src/components/dot'
import sha1 from 'sha1'

import { connect } from 'react-redux'
import { apis, fetchGet, fetchPost } from '@/src/utils/apis'
import { isArray, getParams } from '@/src/utils'

import './index.scss'
const FormItem = Form.Item

class LoginRule extends PureComponent {
  constructor (props) {
    super(props)

    // 注册页还是登录页标识
    this.state = {
      page: '',
      msg: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.checkPassword = this.checkPassword.bind(this)
    this.checkPasswordAgain = this.checkPasswordAgain.bind(this)
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
  }
  componentWillMount () {
    if (this.props.match.path === '/register') {
      this.setState({
        page: 'R'
      })
    } else {
      this.setState({
        page: 'L'
      })
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.match.path === '/register') {
      this.setState({
        page: 'R',
        msg: ''
      })
    } else {
      this.setState({
        page: 'L',
        msg: ''
      })
    }
  }
  /**
   * 表单提交
   * @param {*鼠标对象} e 
   */
  async handleSubmit (e) {
    e.preventDefault()
    let form = this.props.form
    if (this.state.page === 'R') {
      // 注册
      let res = await this.validateName()
      if (res.success && res.code === 10000 && isArray(res.data) && res.data.length > 0) {
        form.setFields({
          name: {
            value: form.getFieldValue('name'),
            errors: [new Error('该用户名已被注册，请重新填写')]
          }
        })
      } else {
        form.validateFields((err, values) => {
          if (!err) {
            this.register(values)
          }
        })
      }
    } else {
      // 登录
      form.validateFields((err, values) => {
        if (!err) {
          this.login(values)
        }
      })
    }
  }
  /**
   * 输入密码校验再次输入密码
   * @param {*规则} rule 
   * @param {*值} value 
   * @param {*回调} callback 
   */
  checkPassword (rule, value, callback) {
    let form = this.props.form
    if (value && form.getFieldValue('passwordAgain') === value) {
      form.validateFields(['passwordAgain'], { force: true })
    }
    callback()
  }
  /**
   * 校验再次输入密码
   * @param {*规则} rule 
   * @param {*值} value 
   * @param {*回调} callback 
   */
  checkPasswordAgain (rule, value, callback) {
    let form = this.props.form
    if (value && form.getFieldValue('password') !== value) {
      callback('两次密码输入不一致')
    } else {
      callback()
    }
  }
  /**
   * 校验是否重复
   */
  validateName () {
    let form = this.props.form
    let value = form.getFieldValue('name')
    return fetchGet(apis.getUser, { name: value })
  }
  /**
   * 登录
   * @param {*参数} values 
   */
  login (values) {
    fetchPost(apis.login, {
      name: values.name,
      password: sha1(values.password)
    })
      .then(res => {
        if (res.success && res.code === 10000) {
          let returnUrl = getParams().returnUrl
          if (returnUrl) {
            window.location.href = decodeURIComponent(returnUrl)
          } else {
            this.props.history.push('/')
          }
        } else {
          this.setState({
            msg: res.msg
          })
        }
      })
  }
  /**
   * 注册
   * @param {*参数} values 
   */
  register (values) {
    fetchPost(apis.register, {
      name: values.name,
      password: sha1(values.password),
      passwordAgain: sha1(values.passwordAgain)
    })
      .then(res => {
        if (res.success && res.code === 10000) {
          let returnUrl = getParams().returnUrl
          if (returnUrl) {
            window.location.href = decodeURIComponent(returnUrl)
          } else {
            this.props.history.push('/')
          }
        } else {
          this.setState({
            msg: res.msg
          })
        }
      })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const page = this.state.page
    return (
      <div className="login-wrapper">
        <DotCanvas></DotCanvas>
        <div id="loginForm" className="login-form">
          <div className="login-form__avator"><Avatar size="large" icon="user" /></div>
          <div className="login-form__error">{this.state.msg}</div>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }, { validator: this.checkPassword }],
              })(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
              )}
            </FormItem>
            {
              page === 'R'
                ? <FormItem>
                    {getFieldDecorator('passwordAgain', {
                      rules: [{ required: true, message: '请再次输入密码' }, { validator: this.checkPasswordAgain }],
                    })(
                      <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请再次输入密码" />
                    )}
                  </FormItem>
                : null
            }
            {
              page === 'R'
                ? (
                  <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form__button">
                      注册
                    </Button>
                    <Link to="/login" className="login-form__minibutton">立即登录</Link>
                  </FormItem>
                )
                : (
                  <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form__button">
                      登录
                    </Button>
                    <Link to="/register" className="login-form__minibutton">立即注册</Link>
                  </FormItem>
                )
            }
          </Form>
        </div>
      </div>
    )
  }
}

const Login = Form.create()(LoginRule)

function mapStateToProps (state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Login)