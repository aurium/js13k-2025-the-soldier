import { mkEl } from './util.js'

let enableCtrl = false
const twoPI = 6.283
export const body = globalThis.document?.body

export const objects = {}
export const getObjsArr = ()=> Object.values(objects)
export const removeObj = (obj, fromDOM)=> {
  delete objects[obj.id]
  if (fromDOM) obj.remove()
}

/** @type {Object.<string, bullet>} */
const bullets = {}
export const getBulletsArr = ()=> Object.values(bullets)
export const removeBullet = (b)=> {
  b.remove()
  delete bullets[b.id]
}

export const deaths = [
  // Total: ///////////////
  // From We:
  { m:0, f:0, c:0, s:0 },
  // From They:
  { m:0, f:0, c:0, s:0 },

  // By myself: ///////////
  // From We:
  { m:0, f:0, c:0, s:0 },
  // From They:
  { m:0, f:0, c:0, s:0 }
]
const deathInfoBox = document.querySelectorAll('header li p')
export function countDeath(bullet, person) {
  const kind = person.s ? 's' : person.c ? 'c' : person.fem ? 'f' : 'm'
  deaths[person.we ? 0 : 1][kind]++
  document.querySelector('header').className = ''
  if (bullet.p == globalThis.p) {
    deaths[person.we ? 2 : 3][kind]++
    document.querySelector('header li.me').className = 'me'
  }

  for (let i = 0; i < 4; i++) {
    deathInfoBox[i].textContent = `soldiers:${deaths[i].s} man:${deaths[i].m} woman:${deaths[i].f} children:${deaths[i].c}`
  }
}

export const sunDeaths = (from)=> Object.values(deaths[from]).reduce((mem,n)=>mem+n)

export const delta = (a, b)=> Math.abs(a-b)

Array.prototype.rnd = function () {
  return this[~~(Math.random() * this.length)]
}

globalThis.camX=0
globalThis.camY=0
export const centerX = 50, centerY = 18
let gunTargetX=99, gunTargetY=0
let mousePageX=0, mousePageY=0

export const canvasBox = mkEl('div', { id: 'canvas-box' }, body)
export const canvas = mkEl('div', { id: 'canvas' }, canvasBox)

globalThis.camTo = { x:0, y:0 }

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

export function sceneChange(builder, interact) {
  sceneOut()
  setTimeout(()=> {
    canvas.className = ''
    getObjsArr().filter(o => o != globalThis.p).forEach(removeObj)
    for (let el of [...canvas.childNodes]) {
      if (el != globalThis.p && el != gunTarget) el.remove()
    }
    builder()
    setTimeout(sceneIn, 500, interact)
  }, 2000)
}

function sceneOut() {
  body.className = 'sOut'
}

function sceneIn(fn = delta) {
  body.className = 'sIn'
  setTimeout(() => { body.className = ''; fn() }, 2000)
}
