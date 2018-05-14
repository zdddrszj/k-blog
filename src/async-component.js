/**
 * 用于react router4 code splitting
 */
import React, {Component} from 'react'

/**
 * @param {Function} loadComponent e.g: () => import('./component')
 * @param {ReactNode} placeholder  未加载前的占位
 */
export default (loadComponent, placeholder = null) => {
  class AsyncComponent extends Component {
    unmount = false

    constructor() {
      super()

      this.state = {
        component: null
      }
    }

    componentWillUnmount() {
      this.unmount = true
    }

    async componentDidMount() {
      const {default: component} = await loadComponent()

      if(this.unmount) return

      this.setState({
        component: component
      })
    }

    render() {
      const C = this.state.component

      return (
        C ? <C {...this.props}></C> : placeholder
      )
    }
  }

  return AsyncComponent
}