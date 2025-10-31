export default class ThTableExcel {
  constructor (el, isCtr) {
    this.el = el
    this.el.style.position = 'relative'
    this.mousedownFlag = false
    // 复制
    this.canvasDom = document.createElement('canvas')
    this.canvasDom.style.position = 'absolute'
    this.canvasDom.style.pointerEvents = 'none'
    this.canvasDom.style.zIndex = 1
    this.canvasDom.style.top = 0
    this.canvasDom.style.left = 0
    this.offset = 0.0
    this.startX = 0.0
    this.startY = 0.0
    this.drawW = 0.0
    this.drawH = 0.0
    this.downDom = null
    this.enterDom = null
    this.tbodyDom = null
    this.isCopy = false
    if (isCtr) {
      this.openSwitch()
    }
  }

  openSwitch = () => {
    let positionX = 0
    let positionY = 0
    setTimeout(() => {
      this.tbodyDom = this.el.querySelector('tbody')
      this.tbodyDom.appendChild(this.canvasDom)
      const trList = this.tbodyDom.querySelectorAll('tr')
      for (let r = 0; r < trList.length; r++) {
        const tdList = trList[r].querySelectorAll('td')
        positionY = positionY + trList[r].clientHeight * 1
        positionX = 0
        for (let d = 0; d < tdList.length; d++) {
          tdList[d].dataset.rowIndex = r
          tdList[d].dataset.cellIndex = d

          tdList[d].dataset.y0 = positionY - trList[r].clientHeight * 1
          tdList[d].dataset.x0 = positionX
          positionX = positionX + tdList[d].clientWidth * 1
          tdList[d].dataset.y = positionY
          tdList[d].dataset.x = positionX

          tdList[d].addEventListener('mousedown', this.mousedownHandler)
          tdList[d].addEventListener('mouseup', this.mouseupHandler)
          tdList[d].addEventListener('mouseenter', this.mouseenterHandler)
        }
      }
      const rect = this.tbodyDom.getBoundingClientRect()
      this.canvasDom.width = rect.width
      this.canvasDom.height = rect.height
      this.tbodyDom.style.userSelect = 'none'
    })
    document.addEventListener('keydown', this.keydownHandler)
  }

  closeSwitch = () => {
    this.tbodyDom = this.el.querySelector('tbody')
    const trList = this.tbodyDom.querySelectorAll('tr')
    for (let r = 0; r < trList.length; r++) {
      const tdList = trList[r].querySelectorAll('td')
      for (let d = 0; d < tdList.length; d++) {
        tdList[d].removeEventListener('mousedown', this.mousedownHandler)
        tdList[d].removeEventListener('mouseup', this.mouseupHandler)
        tdList[d].removeEventListener('mouseenter', this.mouseenterHandler)
      }
    }
    this.clearCanvas()
    this.canvasDom.remove()
  }

  mouseupHandler = (el) => {
    this.mousedownFlag = false
  }

  mousedownHandler = (el) => {
    this.clearCanvas()
    this.mousedownFlag = true
    this.downDom = el.currentTarget
    this.enterDom = el.currentTarget
    this.calculationDraw()
  }

  mouseenterHandler = (el) => {
    if (this.mousedownFlag) {
      this.clearCanvas()
      this.enterDom = el.currentTarget
      this.calculationDraw()
    }
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
    // 右下
    if (startPointer.x <= endPointer.x && startPointer.y <= endPointer.y) {
      this.startX = this.downDom.dataset.x0 * 1
      this.startY = this.downDom.dataset.y0 * 1
      this.drawW = this.enterDom.dataset.x * 1 - this.downDom.dataset.x0 * 1
      this.drawH = this.enterDom.dataset.y * 1 - this.downDom.dataset.y0 * 1
    }

    // 右上
    if (startPointer.x <= endPointer.x && startPointer.y > endPointer.y) {
      this.startX = this.downDom.dataset.x0 * 1
      this.startY = this.enterDom.dataset.y0 * 1
      this.drawW = this.enterDom.dataset.x * 1 - this.downDom.dataset.x0 * 1
      this.drawH = this.downDom.dataset.y * 1 - this.startY
    }

    // 左下
    if (startPointer.x > endPointer.x && startPointer.y <= endPointer.y) {
      this.startX = this.enterDom.dataset.x0 * 1
      this.startY = this.downDom.dataset.y0 * 1
      this.drawW = this.downDom.dataset.x * 1 - this.startX
      this.drawH = this.enterDom.dataset.y * 1 - this.startY
    }

    // 左上
    if (startPointer.x > endPointer.x && startPointer.y > endPointer.y) {
      this.startX = this.enterDom.dataset.x0 * 1
      this.startY = this.enterDom.dataset.y0 * 1
      this.drawW = this.downDom.dataset.x * 1 - this.startX
      this.drawH = this.downDom.dataset.y * 1 - this.startY
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

  keydownHandler = (event) => {
    const isModifierPressed = event.ctrlKey || event.metaKey
    if (!isModifierPressed) return
    const key = event.key.toLowerCase()
    switch (key) {
      case 'c':
        setInterval(this.antLineChange, 200)
        this.isCopy = true
        break
      case 'v':
        console.log('复粘贴')
        break
    }
  }
}
