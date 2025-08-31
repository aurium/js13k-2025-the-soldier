import { mkEl } from './util.js'
import { canvas, centerX } from './base.js'

// TODO: follow obj y
export function speak(obj, txt, opts={}) {
  const ballom = mkEl('b', { className: 'speak' }, canvas)
  const content = mkEl('p', { txt }, ballom)
  const arrow = mkEl('i', { style: `--x:${obj.w/2 + 1.5}em` }, ballom)
  const ballomLeft = ()=> (obj.x - 2) * globalThis.em
  ballom.style.left = ballomLeft() + 'px'
  ballom.style.bottom = (obj.y + obj.h + 1) + 'em'
  setInterval(()=> {
    const canvasR = (100 + globalThis.camX) * globalThis.em
    const limBallomR = canvasR - ballom.clientWidth - 51*globalThis.em
    const deltaR = -limBallomR + ballomLeft()
    ballom.style.left = ballomLeft()+'px'
    arrow.style.transform = ''
    arrow.className = ''
    if (deltaR > 0) {
      const ballomW = ballom.clientWidth
      ballom.style.left = limBallomR+'px'
      const offScreenR = (deltaR + (obj.w+1)*em) > ballomW
      arrow.style.transform = offScreenR
                            ? `rotate(-90deg)`
                            : `translateX(${deltaR}px)`
      if (offScreenR) arrow.className = 'offR'
    } else {
      const screenL = (globalThis.camX - centerX + 1) * globalThis.em
      const deltaL = screenL - ballomLeft()
      if (deltaL > 0) {
        ballom.style.left = screenL+'px'
        //const offScreenL = deltaL > obj.w*1.5*globalThis.em
        const offScreenL = deltaL > obj.w*globalThis.em
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
