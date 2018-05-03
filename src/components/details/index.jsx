import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'
import marked from 'marked'
import highlight from 'highlight.js'
import { dateFormat, readTime } from '@/src/utils'

import './index.scss'

class Details extends PureComponent {
  componentDidMount () {
    highlight.initHighlightingOnLoad()
    marked.setOptions({
      breaks: true,
      highlight (code) {
        return highlight.highlightAuto(code).value
      }
    }) 
  }
  render () {
    let detail = this.props.detail
    return (
      <div className="details">
        <h2 className="details-title">
          {detail.title}
        </h2>
        <div className="details-desc">
          <span className="details-desc__span"><Icon type="calendar" /> {dateFormat(detail.meta.createAt)}</span> 
          <span className="details-desc__span"><Icon type="folder" /> <Link to={`/category/${detail.categoryId._id}`}>{detail.categoryId.name}</Link></span> 
          <span className="details-desc__span"><Icon type="form" /> 字数统计{detail.content.length}</span>
          <span className="details-desc__span"><Icon type="laptop" /> 阅读时长{readTime((detail.content.length / 300) * 60)}</span> 
        </div>
        <div className="details-intro" dangerouslySetInnerHTML={{__html: marked(detail.content)}}>
        </div>
        <div className="details-desc">
          <span className="details-desc__span"><Icon type="calendar" /> {dateFormat(detail.meta.updateAt)}</span>
          <span className="details-desc__span"><Icon type="tag-o" />
            {
              detail.tagIds.map(tag => {
                return <Link className="details-desc__link" key={tag._id} to={`/tag/${tag._id}`}>{tag.name}</Link>
              })
            }
          </span>
        </div>
      </div>
    )
  }
}

Details.propTypes = {
  detail: PropTypes.object
}

export default Details