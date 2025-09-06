import { mkEl } from './util.js'

export const objects = {}
export const getObjsArr = ()=> Object.values(objects)

const bullets = {}
export const getBulletsArr = ()=> Object.values(bullets)
export const removeBullet = (b)=> {
  b.remove()
  delete bullets[b.id]
}

export const body = globalThis.document?.body

globalThis.camX=0
globalThis.camY=0
export const centerX = 50, centerY = 18
let gunTargetX=99, gunTargetY=0
let mousePageX=0, mousePageY=0

export const canvasBox = mkEl('div', { id: 'canvas-box' }, body)
export const canvas = mkEl('div', { id: 'canvas' }, canvasBox)

export function updateCam(objTarget) {
  const m = 10
  if (objTarget == globalThis.p) {
    const dX = gunTargetX - objTarget.x
    const dY = gunTargetY - (objTarget.y + objTarget.h/2)
    const addX = (dX > 0 ? Math.min(dX,30) : Math.max(dX,-30)) / 2
    const addY = (dY > 0 ? Math.min(dY,20) : Math.max(dY,-20)) / 3
    objTarget = {
      x: objTarget.x + addX,
      y: objTarget.y + addY
    }
  }
  // if (isNaN(objTarget.x) || isNaN(objTarget.y)) {
  //   console.log('Bad target', objTarget)
  //   return
  // }
  moveCam(
    (globalThis.camX*m + objTarget.x)/(m+1),
    (globalThis.camY*m + objTarget.y)/(m+1)
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

export function fireBullet(p) {
  const bullet = mkEl('o', {}, canvas)
  bullet.t = Date.now()
  bullet.id = p.id + bullet.t
  bullet.p = p
  bullet.vx = Math.cos(p.gun.a)
  bullet.vy = -Math.sin(p.gun.a)
  bullet.x = p.x + p.w/2 + bullet.vx*3
  bullet.y = p.y + p.h/2 + bullet.vy*3
  bullets[bullet.id] = bullet
}
