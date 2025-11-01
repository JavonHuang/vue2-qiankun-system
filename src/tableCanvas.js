export default class TableCanvas {
  constructor (tbodyDom) {
    this.tbodyDom = tbodyDom
    const rect = this.tbodyDom.getBoundingClientRect()
    this.canvasDom = document.createElement('canvas')
    this.canvasDom.style.position = 'absolute'
    this.canvasDom.style.pointerEvents = 'none'
    this.canvasDom.style.zIndex = 1
    this.canvasDom.style.top = 0
    this.canvasDom.style.left = 0
    this.canvasDom.width = rect.width
    this.canvasDom.height = rect.height
    this.downDom = null
    this.enterDom = null
    this.offset = 0.0
    this.startX = 0.0
    this.startY = 0.0
    this.drawW = 0.0
    this.drawH = 0.0
    this.range = []
    this.timer = null
  }

  setDownDom = (downDom) => {
    this.downDom = downDom
  }

  setEnterDom = (enterDom) => {
    this.enterDom = enterDom
  }

  calculationDraw = () => {
    // 根据按下节点和最终节点的坐标，判断鼠标走向，进二重新定义🕖
    const startPointer = {
      x: this.downDom.dataset.x0 * 1,
      y: this.downDom.dataset.y0 * 1
    }
    const endPointer = {
      x: this.enterDom.dataset.x0 * 1,
      y: this.enterDom.dataset.y0 * 1
    }
    this.range = []

    // 右下
    if (startPointer.x <= endPointer.x && startPointer.y <= endPointer.y) {
      this.startX = this.downDom.dataset.x0 * 1
      this.startY = this.downDom.dataset.y0 * 1
      this.drawW = this.enterDom.dataset.x * 1 - this.downDom.dataset.x0 * 1
      this.drawH = this.enterDom.dataset.y * 1 - this.downDom.dataset.y0 * 1
      this.range = [
        { rowIndex: this.downDom.dataset.rowIndex, cellIndex: this.downDom.dataset.cellIndex },
        { rowIndex: this.enterDom.dataset.rowIndex, cellIndex: this.enterDom.dataset.cellIndex }
      ]
    }

    // 右上
    if (startPointer.x <= endPointer.x && startPointer.y > endPointer.y) {
      this.startX = this.downDom.dataset.x0 * 1
      this.startY = this.enterDom.dataset.y0 * 1
      this.drawW = this.enterDom.dataset.x * 1 - this.downDom.dataset.x0 * 1
      this.drawH = this.downDom.dataset.y * 1 - this.startY
      this.range = [
        { rowIndex: this.enterDom.dataset.rowIndex, cellIndex: this.downDom.dataset.cellIndex },
        { rowIndex: this.downDom.dataset.rowIndex, cellIndex: this.enterDom.dataset.cellIndex }
      ]
    }

    // 左下
    if (startPointer.x > endPointer.x && startPointer.y <= endPointer.y) {
      this.startX = this.enterDom.dataset.x0 * 1
      this.startY = this.downDom.dataset.y0 * 1
      this.drawW = this.downDom.dataset.x * 1 - this.startX
      this.drawH = this.enterDom.dataset.y * 1 - this.startY
      this.range = [
        { rowIndex: this.downDom.dataset.rowIndex, cellIndex: this.enterDom.dataset.cellIndex },
        { rowIndex: this.enterDom.dataset.rowIndex, cellIndex: this.downDom.dataset.cellIndex }
      ]
    }

    // 左上
    if (startPointer.x > endPointer.x && startPointer.y > endPointer.y) {
      this.startX = this.enterDom.dataset.x0 * 1
      this.startY = this.enterDom.dataset.y0 * 1
      this.drawW = this.downDom.dataset.x * 1 - this.startX
      this.drawH = this.downDom.dataset.y * 1 - this.startY
      this.range = [
        { rowIndex: this.enterDom.dataset.rowIndex, cellIndex: this.enterDom.dataset.cellIndex },
        { rowIndex: this.downDom.dataset.rowIndex, cellIndex: this.downDom.dataset.cellIndex }
      ]
    }
    this.drawFill(this.startX, this.startY, this.drawW, this.drawH)
  }

  drawFill = (x, y, w, h) => {
    const context = this.canvasDom.getContext('2d')
    context.beginPath()
    context.rect(x, y, w, h)
    context.stroke()
  }

  clearCanvas = () => {
    const context = this.canvasDom.getContext('2d')
    context.setLineDash([])
    context.clearRect(0, 0, this.canvasDom.width, this.canvasDom.height)
  }

  drawAntLine = () => {
    const context = this.canvasDom.getContext('2d')
    this.offset += 3.0
    context.setLineDash([5, 5])
    context.lineDashOffset = this.offset
    this.calculationDraw()
  }

  antLineChange = () => {
    this.clearCanvas()
    this.drawAntLine()
  }

  clearTimer = () => {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  remove = () => {
    this.clearTimer()
    this.canvasDom.remove()
  }

  startAntLine = () => {
    if (this.timer) {
      return
    }
    this.timer = setInterval(this.antLineChange, 200)
  }
}
