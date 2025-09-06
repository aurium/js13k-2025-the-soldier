import { mkEl } from './util.js'
import { body, canvasBox, updateCam, getGunTarget, getObjsArr, getBulletsArr, removeBullet } from './base.js'
import { mkPerson } from './people.js'
import './scenes/00-prologue.js'

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
  s: 1, // is a soldier
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
  globalThis.scene()
  for (const bullet of getBulletsArr()) { // Update Bullets
    bullet.x += bullet.vx*2
    bullet.y += bullet.vy*2
    bullet.style.left = bullet.x+'em'
    bullet.style.bottom = bullet.y+'em'
    if (Date.now()-bullet.t > 3000) removeBullet(bullet)
  }
  player.turn = (getGunTarget().x < (player.x+1.5)) ? -1 : 1
  updatePlayerGun()
  player.vx = (keyLeft ? -1 : keyRight ? 1 : 0) * playerVelocity
  player.vy = (keyDown ? -1 : keyUp ? 1 : 0) * playerVelocity
  if (player.vx && player.vy) {
    player.vx *= .707
    player.vy *= .707
  }
  for (const obj of getObjsArr()) {
    obj.update()
  }
  updateCam(player)
}, 20)

function updatePlayerGun() {
  const target = getGunTarget()
  const gunY = player.y + player.h/2
  let angle = Math.atan2(gunY-target.y, target.x-player.x)
  player.gun.a = angle
}


// setTimeout(()=> {
//   mkNews(player, 'Some hard strong tilte', `
//     This is the news body. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vitae ante consequat, cursus tellus ac, ultrices nibh.

//     Suspendisse vel semper est, in mattis nibh. Ut in augue ante. Duis eleifend pellentesque purus. Integer aliquam faucibus magna, id suscipit ligula elementum quis. Proin tristique dictum quam, ac porttitor nibh lobortis id. Nullam vitae facilisis sem, id rutrum metus. Curabitur vel turpis non quam pharetra vehicula.
//   `)
// }, 3000)

function updateKeypressed(key, toggle) {
  key = key.toLowerCase()
  if (key == 'arrowleft'  || key == 'a')  keyLeft = toggle
  if (key == 'arrowright' || key == 'd') keyRight = toggle
  if (key == 'arrowup'    || key == 'w')    keyUp = toggle
  if (key == 'arrowdown'  || key == 's')  keyDown = toggle
  // if (toggle && key == ' ') mkNews(player, 'Some hard strong title', `
  //   This is the news body. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vitae ante consequat, cursus tellus ac, ultrices nibh.

  //   Suspendisse vel semper est, in mattis nibh. Ut in augue ante. Duis eleifend pellentesque purus. Integer aliquam faucibus magna, id suscipit ligula elementum quis. Proin tristique dictum quam, ac porttitor nibh lobortis id. Nullam vitae facilisis sem, id rutrum metus. Curabitur vel turpis non quam pharetra vehicula.
  // `)
}

body.addEventListener('keydown', ev => updateKeypressed(ev.key, 1))

body.addEventListener('keyup', ev => updateKeypressed(ev.key, 0))

canvasBox.addEventListener('pointerdown', ev => {
  if (ev.button == 0) player.gun.t = 1 // Triggered
})
body.addEventListener('pointerup', ev => {
  if (ev.button == 0) player.gun.t = 0 // Untriggered
})
