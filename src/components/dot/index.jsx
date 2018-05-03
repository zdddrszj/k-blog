import React, { PureComponent } from 'react'
import Dot from '@/src/utils/dot'

import './index.scss'

class DotCanvas extends PureComponent {
  componentDidMount () {
    let dotsArr = [],
      canvas = document.getElementById('dotCanvas'),
      ctx = canvas.getContext('2d'),
      width = document.documentElement.offsetWidth || document.body.offsetWidth,
      height = document.documentElement.offsetHeight || document.documentElement.offsetHeight,
      dotsNum = parseInt(width * height / 8000, 10),
      dotsDistance = 100,
      maxDotsNum = Math.floor(dotsNum * 1.5),
      overDotsNum = 0

    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)

    for (var i = 0; i < dotsNum; i ++) {
        var dot = new Dot()
        dot.id = i + 1
        dotsArr.push(dot)
        dot.init(canvas)
    }

    var lastTime = 0
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || setTimeout((callback) => {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime))
      var id = window.setTimeout(function() {
          callback(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    })
    requestAnimationFrame(updateCanvas)

    function updateCanvas () {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // 点的个数为 dotsNum ~ dotsNum，即 0 ~ dotsNum 或者 (dotsNum - maxDotsNum) ~ dotsNum
      if (dotsNum > maxDotsNum) {
        overDotsNum = dotsNum - maxDotsNum
      }
      for (let j = overDotsNum; j < dotsNum; j ++) {
        dotsArr[j].update()
      }
      // 画线
      for (let m = overDotsNum; m < dotsNum; m ++) {
        for (let n = m + 1; n < dotsNum; n ++) {
          let dx = dotsArr[m].x - dotsArr[n].x
          let dy = dotsArr[m].y - dotsArr[n].y
          let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
          if (d < dotsDistance) {
            ctx.beginPath()
            ctx.moveTo(dotsArr[m].x, dotsArr[m].y)
            ctx.lineTo(dotsArr[n].x, dotsArr[n].y)
            ctx.strokeStyle = 'rgba(200, 200, 200, ' + (dotsDistance - d) / dotsDistance + ')'
            ctx.strokeWidth = 1
            ctx.stroke()
            ctx.closePath()
          }
        }
      }
      requestAnimationFrame(updateCanvas)
    }
    // 鼠标点击事件
    let loginWrapper = document.getElementsByClassName('login-wrapper')[0]
    loginWrapper.addEventListener('click', handleClick, false)
    function handleClick (e) {
      let x = e.pageX
      let y = e.pageY
      for (let j = 0; j < 5; j ++) {
        dotsNum ++
        var dot = new Dot()
        dot.id = dotsNum
        dotsArr.push(dot)
        dot.init(canvas, x, y)
      }
    }
    // 鼠标移动事件
    loginWrapper.addEventListener('mousemove', handleMousemove, false)
    function handleMousemove (e) {
      let x = e.pageX,
        y = e.pageY
      if ((x > 0 && x < width) && (y > 0 && y < height)) {
        // dot为画布上最后画的最后一个点，鼠标跟随即更新最后这个点的位置坐标
        dot.followMouse(x, y)
      }
    }
  }
  render () {
    return (
      <canvas id="dotCanvas"></canvas>
    )
  }
}

export default DotCanvas