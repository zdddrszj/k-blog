
function Dot() {
}
Dot.prototype = {
  init: function (canvas, x, y) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')

    this.x = x || Math.random() * this.canvas.width
    this.y = y || Math.random() * this.canvas.height
    // 0 - 8 之间的一个随机数
    this.r = Math.random() * 2
    this.vx = Math.random() * 2 - 1
    this.vy = Math.random() * 2 - 1

    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = "rgba(200, 200, 200, .8)"
    this.ctx.fill()
    this.ctx.closePath()
  },
  // 更新点位置
  update: function () {
    this.x = this.x + this.vx
    this.y = this.y + this.vy

    // 点越界后调用init重新随机生成 因为点的个数固定，屏幕实时绘制，所以移出屏幕的点对象不用清除
    if (this.x < 0 || this.x > this.canvas.width) {
        this.init(this.canvas)
    }
    if (this.y < 0 || this.y > this.canvas.height) {
        this.init(this.canvas)
    }

    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = "rgba(200, 200, 200, .8)"
    this.ctx.fill()
    this.ctx.closePath()
},
  followMouse: function (tx, ty) {
    this.x = tx
    this.y = ty
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    this.ctx.fillStyle = "rgba(200, 200, 200, .8)"
    this.ctx.fill()
    this.ctx.closePath()
  }
}

export default Dot