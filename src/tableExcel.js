import TableCanvas from './tableCanvas'

export default class ThTableExcel {
  constructor (el, isCtr, onPaste) {
    this.el = el
    this.el.style.position = 'relative'
    this.mousedownFlag = false
    this.copyCanvaDom = null
    this.targetCanvaDom = null
    this.downDom = null
    this.enterDom = null
    this.targetDownDom = null
    this.targetEnterDom = null
    this.tbodyDom = null
    this.isCopy = false
    this.onPaste = onPaste
    if (isCtr) {
      this.openSwitch()
    }
  }

  openSwitch = () => {
    setTimeout(() => {
      this.init()
    })
    document.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('resize', this.debounce(this.windowResize, 200))
  }

  debounce = (func, delay) => {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => func.apply(this, args), delay)
    }
  }

  init = () => {
    let positionX = 0
    let positionY = 0
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
  }

  windowResize = () => {
    if (this.copyCanvaDom) {
      this.copyCanvaDom.remove()
      this.copyCanvaDom = null
    }
    if (this.targetCanvaDom) {
      this.targetCanvaDom.remove()
      this.targetCanvaDom = null
    }
    this.init()
    if (this.downDom) {
      this.copyCanvaDom.setDownDom(this.downDom)
      this.copyCanvaDom.setEnterDom(this.enterDom)
      if (this.isCopy) {
        this.copyCanvaDom.startAntLine()
      } else {
        this.copyCanvaDom.calculationDraw()
      }
    }
    if (this.targetDownDom) {
      this.targetCanvaDom = new TableCanvas(this.tbodyDom)
      this.tbodyDom.appendChild(this.targetCanvaDom.canvasDom)
      this.targetCanvaDom.setDownDom(this.targetDownDom)
      this.targetCanvaDom.setEnterDom(this.targetEnterDom)
      this.targetCanvaDom.calculationDraw()
    }
  }

  destroy = () => {
    document.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('resize', this.windowResize)
    this.closeSwitch()
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
    if (this.isCopy) {
      this.targetDownDom = el.currentTarget
      this.targetEnterDom = el.currentTarget
      this.targetCanvaDom.clearCanvas()
      this.targetCanvaDom.setDownDom(this.targetDownDom)
      this.targetCanvaDom.setEnterDom(this.targetEnterDom)
      this.targetCanvaDom.calculationDraw()
    } else {
      this.downDom = el.currentTarget
      this.enterDom = el.currentTarget
      this.copyCanvaDom.clearCanvas()
      this.copyCanvaDom.setDownDom(this.downDom)
      this.copyCanvaDom.setEnterDom(this.enterDom)
      this.copyCanvaDom.calculationDraw()
    }
  }

  mouseenterHandler = (el) => {
    if (this.mousedownFlag) {
      if (this.isCopy) {
        this.targetEnterDom = el.currentTarget
        this.targetCanvaDom.clearCanvas()
        this.targetCanvaDom.setEnterDom(this.targetEnterDom)
        this.targetCanvaDom.calculationDraw()
      } else {
        this.enterDom = el.currentTarget
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
          if (this.targetCanvaDom) {
            this.targetCanvaDom.remove()
          }
          this.targetCanvaDom = new TableCanvas(this.tbodyDom)
          this.tbodyDom.appendChild(this.targetCanvaDom.canvasDom)
        }
        this.isCopy = true
        break
      case 'v':
        if (!this.isCopy) {
          return
        }
        this.isCopy = false
        this.targetCanvaDom.clearCanvas()
        this.copyCanvaDom.clearTimer()
        this.copyCanvaDom.clearCanvas()
        this.downDom = null
        this.enterDom = null
        if (this.onPaste) {
          const result = this.copyMapping(this.copyCanvaDom.range, this.targetCanvaDom.range)
          this.onPaste(result)
        }
        break
    }
  }

  copyMapping = (copyRange, targetRange) => {
    const resultMapping = []
    const copyCells = copyRange[1].cellIndex - copyRange[0].cellIndex + 1
    const copyRows = copyRange[1].rowIndex - copyRange[0].rowIndex + 1
    const tartgetCells = targetRange[1].cellIndex - targetRange[0].cellIndex + 1
    const tartgetRows = targetRange[1].rowIndex - targetRange[0].rowIndex + 1

    for (let r = 0; r < tartgetRows; r++) {
      for (let c = 0; c < tartgetCells; c++) {
        resultMapping.push({
          sourePoint: {
            rowIndex: copyRange[0].rowIndex * 1 + r % copyRows,
            cellIndex: copyRange[0].cellIndex * 1 + c % copyCells
          },
          targetPoint: {
            rowIndex: targetRange[0].rowIndex * 1 + r,
            cellIndex: targetRange[0].cellIndex * 1 + c
          }
        })
      }
    }
    return resultMapping
  }
}
