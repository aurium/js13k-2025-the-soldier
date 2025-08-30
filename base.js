import { mkEl } from './util.js'

window.camX=0
window.camY=0
export const centerX = 50, centerY = 18
let gunTargetX, gunTargetY=99

export const body = document.body

export const canvas = mkEl(
  'div',
  { id: 'canvas' },
  mkEl('div', { id: 'canvas-box' }, body)
)

export function updateCam(objTarget) {
  const m = 40
  moveCam(
    (window.camX*m + objTarget.x)/(m+1) + player.vx*2,
    (window.camY*m + objTarget.y)/(m+1) + player.vy*1.2
  )
}

function moveCam(x, y) {
  window.camX = x
  window.camY = y
  canvas.style.left = (centerX-window.camX)+'em'
  canvas.style.bottom = (centerY-window.camY)+'em'
  updateTarget()
}

const gunTarget = mkEl('div', { id: 'target' }, canvas)

function updateTarget() {
  gunTargetX = (mousePageX / em) - centerX + window.camX
  gunTargetY = -((mousePageY - canvasTop - canvasH) / em) - centerY + window.camY
  gunTarget.style.left = gunTargetX+'em'
  gunTarget.style.bottom = gunTargetY+'em'
}

export function getGunTarget() { return { x:gunTargetX, y:gunTargetY } }

body.addEventListener('pointermove', ev => {
  mousePageX = ev.pageX
  mousePageY = ev.pageY
  updateTarget()
})
