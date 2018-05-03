import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'
import marked from 'marked'
import highlight from 'highlight.js'
import { apis, fetchPostForm } from '@/src/utils/apis'

import './index.scss'
import '@/node_modules/highlight.js/styles/github.css'

class Editor extends PureComponent {
constructor (props) {
    super(props)
    this.state = {
      // 编辑器左右分栏宽度
      editWrapWidth: 50,
      previewWrapWidth: 50,
      // 编辑器是否全屏
      fullScreen: false
    }
    this.cacheValue()
    this.onContentChange = this.onContentChange.bind(this)
    this.containerScroll = this.containerScroll.bind(this)
    this.preProText = this.preProText.bind(this)

    // 定义最后光标对象
    this.lastEditRange = null
  }
  componentDidMount () {
    highlight.initHighlightingOnLoad()
    marked.setOptions({
      breaks: true,
      highlight (code) {
        return highlight.highlightAuto(code).value
      }
    })
    this.editWrap.ondragenter = (e) => {
      e.stopPropagation() 
      e.preventDefault()
    }
    this.editWrap.ondragover = (e) => {
      e.stopPropagation() 
      e.preventDefault()
    }
    this.editWrap.ondrop = (e) => {
      e.stopPropagation() 
      e.preventDefault()
      let dt = e.dataTransfer
      let files = dt.files
      let data = new FormData()
      data.append('image', files[0])
      fetchPostForm(apis.uploadPicture, data, { type: 'form-data' })
        .then(res => {
          message.info(res.msg)
          if (res.success) {
            this.preProText(`![${res.data.name}](${res.data.url})`, 2, 2)
          }
        })
    }
    
  }
  componentWillReceiveProps (nextProps) {
    this.editContainer.value = nextProps.value
    this.previewContainer.innerHTML = marked(nextProps.value)
    !this.hasContentChanged && (this.hasContentChanged = true)
  }
  /**
   * 内容修改
   * @param {*当前对象} e 
   */
  onContentChange (e) {
    let content = e.target ? e.target.value : e.value
    this.props.contentChangeCB(content)
  }
  /**
   * 设置当前编辑器鼠标经过区域
   * @param {*顺序} index 
   */
  setCurrentIndex(index) {
    this.currentTabIndex = index
  }
  /**
   * 编辑器滚动条滚动时事件
   */
  containerScroll () {
    this.hasContentChanged && this.setScrollValue()
    if (this.currentTabIndex === 1) {
      this.previewContainer.scrollTop = this.editContainer.scrollTop * this.scale
    } else {
      this.editContainer.scrollTop = this.previewContainer.scrollTop / this.scale
    }
  }
  /**
   * 设置初始值
   */
  cacheValue () {
    this.currentTabIndex = 1
    this.hasContentChanged = false
    this.scale = 1
  }
  /**
   * 设置滚动比例
   */
  setScrollValue () {
    this.scale = this.previewContainer.scrollHeight / this.editContainer.scrollHeight
    this.hasContentChanged = false
  }
  // 加粗
	boldText () {
		this.preProText('****', 2, 2)
  }
  // 斜体
  italicText () {
    this.preProText('**', 1, 1)
  }
  // 引用
  blockquoteText () {
    this.preProText('> ', 2, 2)
  }
  h1Text () {
    this.preProText('# ', 2, 2)
  }
  h2Text () {
    this.preProText('## ', 3, 3)
  }
  listUlText () {
    this.preProText('- ', 2, 2)
  }
  listOlText () {
    this.preProText('1. ', 3, 3)
  }
  linkText () {
    this.preProText('[](url)', 1, 1)
  }
  pictureText () {
    this.preProText('![alt](url)', 2, 5)
  }
  codeText () {
    this.preProText('``', 1, 1)
  }
  // 文字预处理
  preProText (text, preStart, preEnd) {
    this.editContainer.focus()
		let start = this.editContainer.selectionStart
		let end = this.editContainer.selectionEnd
		let origin = this.editContainer.value
		if (start !== end) {
			let select = origin.slice(start, end)
			text = text.slice(0, preStart) + select + text.slice(preEnd)
			preEnd = preStart + select.length
		}
		this.editContainer.value = origin.slice(0, start) + text + origin.slice(end)
    this.editContainer.setSelectionRange(start + preStart, start + preEnd)
    this.onContentChange(this.editContainer)
  }
  // 分栏
  columnOperation () {
    if (this.state.editWrapWidth === 50) {
      this.setState({
        editWrapWidth: 100,
        previewWrapWidth: 0
      })
    } else {
      this.setState({
        editWrapWidth: 50,
        previewWrapWidth: 50
      })
    }
  }
  // 全屏
  fullScreenOperation () {
    if (this.state.fullScreen) {
      this.setState({
        fullScreen: false
      })
    } else {
      this.setState({
        fullScreen: true
      })
    }
  }
  render () {
    return (
      <div className={`editor ${this.state.fullScreen ? 'editor-full-screen' : ''}`}>
        <div className="editor-menu">
          <div className="editor-menu__l">
            <i className="iconfont icon-cuti" onClick={this.boldText.bind(this)}></i>
            <i className="iconfont icon-xieti" onClick={this.italicText.bind(this)}></i>
            <i className="iconfont icon-yinyongkuai" onClick={this.blockquoteText.bind(this)}></i>
            <i className="iconfont icon-H1" onClick={this.h1Text.bind(this)}></i>
            <i className="iconfont icon-H2" onClick={this.h2Text.bind(this)}></i>
            <i className="iconfont icon-H3" onClick={this.boldText.bind(this)}></i>
            <i className="iconfont icon-order-out" onClick={this.listUlText.bind(this)}></i>
            <i className="iconfont icon-order" onClick={this.listOlText.bind(this)}></i>
            <i className="iconfont icon-lianjie" onClick={this.linkText.bind(this)}></i>
            <i className="iconfont icon-tupian" onClick={this.pictureText.bind(this)}></i>
            <i className="iconfont icon-daimakuai" onClick={this.codeText.bind(this)}></i>
          </div>
          <div className="editor-menu__r">
            <i className="iconfont icon-fenlan" onClick={this.columnOperation.bind(this)}></i>
            <i className="iconfont icon-quanping" onClick={this.fullScreenOperation.bind(this)}></i>
          </div>
        </div>
        <div className="editor-area" style={{height: this.state.fullScreen ? '94%' : '500px'}}>
          <div className="editor-area__l" ref={node => this.editWrap = node} style={{width: this.state.editWrapWidth + '%'}}>
            {/* <div 
              className="editor-l__child" 
              contentEditable="true" 
              dangerouslySetInnerHTML={{__html: this.props.content.replace(/\n/g,'<br />') }} 
              onInput={this.onContentChange}
              ref={node => this.editContainer = node}>
            </div> */}
            <textarea
              className="editor-area-l__child" 
              onMouseOver={this.setCurrentIndex.bind(this, 1)}
              onChange={this.onContentChange}
              onScroll={this.containerScroll}
              ref={node => this.editContainer = node}
              placeholder="图片可直接拖拽进来哦~"
            ></textarea>
          </div>
          <div className="editor-area__r" ref={node => this.previewWrap = node} style={{width: this.state.previewWrapWidth + '%'}}>
            <div 
              className="editor-area-r__child"
              onMouseOver={this.setCurrentIndex.bind(this, 2)}
              onScroll={this.containerScroll}
              ref={node => this.previewContainer = node}>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Editor.props = {
  content: PropTypes.string
}

export default Editor
