import TableCanvas from './tableCanvas'

export default class ThTableExcel {
  constructor (el, isCtr) {
    this.el = el
    this.el.style.position = 'relative'
    this.mousedownFlag = false
    this.copyCanvaDom = null
    this.targetCanvaDom = null
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
      this.copyCanvaDom = new TableCanvas(this.tbodyDom)
      this.tbodyDom.appendChild(this.copyCanvaDom.canvasDom)
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
    this.copyCanvaDom.clearCanvas()
    this.copyCanvaDom.remove()
  }

  mouseupHandler = (el) => {
    this.mousedownFlag = false
  }

  mousedownHandler = (el) => {
    this.mousedownFlag = true
    this.downDom = el.currentTarget
    this.enterDom = el.currentTarget
    if (this.isCopy) {
      this.targetCanvaDom.clearCanvas()
      this.targetCanvaDom.setDownDom(this.downDom)
      this.targetCanvaDom.setEnterDom(this.enterDom)
      this.targetCanvaDom.calculationDraw()
    } else {
      this.copyCanvaDom.clearCanvas()
      this.copyCanvaDom.setDownDom(this.downDom)
      this.copyCanvaDom.setEnterDom(this.enterDom)
      this.copyCanvaDom.calculationDraw()
    }
  }

  mouseenterHandler = (el) => {
    if (this.mousedownFlag) {
      this.enterDom = el.currentTarget
      if (this.isCopy) {
        this.targetCanvaDom.clearCanvas()
        this.targetCanvaDom.setEnterDom(this.enterDom)
        this.targetCanvaDom.calculationDraw()
      } else {
        this.copyCanvaDom.clearCanvas()
        this.copyCanvaDom.setEnterDom(this.enterDom)
        this.copyCanvaDom.calculationDraw()
      }
    }
  }

  keydownHandler = (event) => {
    const isModifierPressed = event.ctrlKey || event.metaKey
    if (!isModifierPressed) return
    const key = event.key.toLowerCase()
    switch (key) {
      case 'c':
        this.copyCanvaDom.startAntLine()
        if (!this.isCopy) {
          this.targetCanvaDom = new TableCanvas(this.tbodyDom)
          this.tbodyDom.appendChild(this.targetCanvaDom.canvasDom)
        }
        this.isCopy = true
        break
      case 'v':
        this.isCopy = false
        this.targetCanvaDom.clearCanvas()
        this.copyCanvaDom.clearCanvas()
        break
    }
  }
}
