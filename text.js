import { mkEl } from './util.js'
import { canvas, centerX } from './base.js'

export function speak(obj, txt, opts={}) {
  const ballom = mkEl('b', { className: 'speak' }, canvas)
  const content = mkEl('p', { txt }, ballom)
  const arrow = mkEl('i', {}, ballom)
  const ballomLeft = ()=> (obj.x - 2) * window.em
  ballom.style.left = ballomLeft() + 'px'
  ballom.style.bottom = (obj.y + 6) + 'em'
  setInterval(()=> {
    const canvasR = (100 + window.camX) * window.em
    const limBallomR = canvasR - ballom.clientWidth - 51*window.em
    const deltaR = -limBallomR + ballomLeft()
    ballom.style.left = ballomLeft()+'px'
    arrow.style.transform = ''
    arrow.className = ''
    if (deltaR > 0) {
      const ballomW = ballom.clientWidth
      ballom.style.left = limBallomR+'px'
      const offScreenR = (deltaR + 3*em) > ballomW
      arrow.style.transform = offScreenR
                            ? `rotate(-90deg)`
                            : `translateX(${deltaR}px)`
      if (offScreenR) arrow.className = 'offR'
    } else {
      const screenL = (window.camX - centerX + 1) * window.em
      const deltaL = screenL - ballomLeft()
      if (deltaL > 0) {
        ballom.style.left = screenL+'px'
        const offScreenL = deltaL > 4*window.em
        arrow.style.transform = offScreenL
                              ? `rotate(90deg)`
                              : `translateX(${-deltaL}px)`
        if (offScreenL) arrow.className = 'offL'
      }
    }
  }, 200)
  return Object.assign(ballom, {
    rm() {

    }
  })
}
