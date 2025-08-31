import { mkEl } from './util.js'

export const objects = []

globalThis.camX=0
globalThis.camY=0
export const centerX = 50, centerY = 18
let gunTargetX, gunTargetY=99

export const body = globalThis.document?.body

export const canvas = mkEl(
  'div',
  { id: 'canvas' },
  mkEl('div', { id: 'canvas-box' }, body)
)

export function updateCam(objTarget) {
  const m = 40
  moveCam(
    (globalThis.camX*m + objTarget.x)/(m+1) + player.vx*2,
    (globalThis.camY*m + objTarget.y)/(m+1) + player.vy*1.2
  )
}

function moveCam(x, y) {
  globalThis.camX = x
  globalThis.camY = y
  canvas.style.left = (centerX-globalThis.camX)+'em'
  canvas.style.bottom = (centerY-globalThis.camY)+'em'
  updateTarget()
}

const gunTarget = mkEl('div', { id: 'target' }, canvas)

function updateTarget() {
  gunTargetX = (mousePageX / em) - centerX + globalThis.camX
  gunTargetY = -((mousePageY - canvasTop - canvasH) / em) - centerY + globalThis.camY
  gunTarget.style.left = gunTargetX+'em'
  gunTarget.style.bottom = gunTargetY+'em'
}

export function getGunTarget() { return { x:gunTargetX, y:gunTargetY } }

body?.addEventListener('pointermove', ev => {
  mousePageX = ev.pageX
  mousePageY = ev.pageY
  updateTarget()
})
