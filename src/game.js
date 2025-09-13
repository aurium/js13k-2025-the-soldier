import { mkEl } from './util.js'
import { body, canvasBox, updateCam, getGunTarget, getObjsArr, getBulletsArr, removeBullet } from './base.js'
import { mkPerson } from './people.js'
import { prologue } from './scenes/00-prologue.js'

let winW, winH, canvasTop, canvasH

const fpsEl = mkEl('code', { style: 'position:absolute; bottom:.5em' }, body)

function updateWinSize() {
  winW = body.clientWidth
  winH = body.clientHeight
  canvasH = winW * .4
  canvasTop = (winH - canvasH) / 2
  globalThis.em = winW / 100
}
globalThis.addEventListener('resize', updateWinSize)
updateWinSize()

const player = globalThis.p = mkPerson(0,0, {
  id: 'player',
  we: 1,
  //c: 1,
  s: 0, // 1 means soldier
  rnd:[.8, .85, .35, 0, 0, 0],
  rndC: Array(9).fill(0)
})

const playerVelocity = .5

let keyLeft=0, keyRight=0, keyUp=0, keyDown=0

/* * * UPDATE LOOP * * * * * * * * * * * * * * * * * * * * * * */
let loopTic = 0, lastTicCheckpoint = Date.now()
setInterval(()=> {
  loopTic++
  if (loopTic%10 === 0) {
    fpsEl.textContent = 'FPS: '+(10000 / (Date.now() - lastTicCheckpoint)).toFixed(1)
    lastTicCheckpoint = Date.now()
  }
  //globalThis.scene()
  for (const bullet of getBulletsArr()) { // Update Bullets
    bullet.x += bullet.vx*2
    bullet.y += bullet.vy*2
    bullet.style.left = bullet.x+'em'
    bullet.style.bottom = bullet.y+'em'
    if (Date.now()-bullet.t > 3000) removeBullet(bullet)
  }
  if (enableCtrl) {
    player.turn = (getGunTarget().x < (player.x+1.5)) ? -1 : 1
    updatePlayerGun()
    player.vx = (keyLeft ? -1 : keyRight ? 1 : 0) * playerVelocity
    player.vy = (keyDown ? -1 : keyUp ? 1 : 0) * playerVelocity
    if (player.vx && player.vy) {
      player.vx *= .707
      player.vy *= .707
    }
  }
  for (const obj of getObjsArr()) {
    obj.update()
  }
  updateCam(globalThis.camTo)
}, 20)

function updatePlayerGun() {
  const target = getGunTarget()
  const gunY = player.y + player.h/2
  let angle = Math.atan2(gunY-target.y, target.x-player.x)
  player.gun.a = angle
}

function updateKeypressed(key, toggle) {
  key = key.toLowerCase()
  if (key == 'arrowleft'  || key == 'a')  keyLeft = toggle
  if (key == 'arrowright' || key == 'd') keyRight = toggle
  if (key == 'arrowup'    || key == 'w')    keyUp = toggle
  if (key == 'arrowdown'  || key == 's')  keyDown = toggle
}

body.addEventListener('keydown', ev => updateKeypressed(ev.key, 1))

body.addEventListener('keyup', ev => updateKeypressed(ev.key, 0))

canvasBox.addEventListener('pointerdown', ev => {
  if (ev.button == 0) player.gun.t = 1 // Triggered
})
body.addEventListener('pointerup', ev => {
  if (ev.button == 0) player.gun.t = 0 // Untriggered
})

globalThis.pDeadCb = ()=> { // Can be overridden in a scene and send to a hospital.
  globalThis.pDeadCb = delta
  player.classList.add('die')
  player.act = delta
  player.v = player.vx = player.vy = 0
  enableCtrl = 0
  setTimeout(()=> {
    mkNews(player,
      `A Hero Dies`,
      `Maybe he was not that great...`,
    ).show()
  }, 1500)
}

//// THE GAME STARTER ////////////////////////////////////////////
prologue()
//loader01()
