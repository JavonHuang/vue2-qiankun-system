class tableCanvas {
  constructor () {
    this.canvasDom = document.createElement('canvas')
    this.canvasDom.style.position = 'absolute'
    this.canvasDom.style.pointerEvents = 'none'
    this.canvasDom.style.zIndex = 1
    this.canvasDom.style.top = 0
    this.canvasDom.style.left = 0
  }
}