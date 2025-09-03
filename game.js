import { mkEl } from './util.js'
import { body, canvasBox, updateCam, getGunTarget, objects, bullets } from './base.js'
import { mkPerson } from './people.js'
import { speak } from './text.js'
import { mkNews } from './journal.js'

let mousePageX, mousePageY
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

const player = mkPerson(0,0, {
  we: 1,
  //c: 1,
  s: 1, // is a soldier
  rnd:[.8, .85, .35, 0, 0, 0],
  rndC: Array(9).fill(0)
})
// mkPerson(0,0, {
//   we: 1, child: 1,
//   rnd:[.8, .85, .35, 0, 0, 0],
//   rndC: Array(9).fill(0)
// })

const testP = mkPerson(15, 0, {
  we: 1, turn: -1,
  rnd: [.5,.1,.2,.3,.4,.5,.6, .6], // rnd[7] > .6 means White Hair
  rndC: [1,1,5] // rndC[2] == 5 means Old Person
})

speak(testP, 'This is a test.\nDid you like that?')

for (let x = -37; x <= 38; x+=5) for (let y = -10; y <= 14; y+=7) {
  mkPerson(x, y, {
    we: x<0,
    fem: (x+y)%2==0,
    c: y<0,
  })
}

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
  for (const bullet of bullets) { // Update Bullets
    bullet.x += bullet.vx*2
    bullet.y += bullet.vy*2
    bullet.style.left = bullet.x+'em'
    bullet.style.bottom = bullet.y+'em'
  }
  player.turn = (getGunTarget().x < (player.x+1.5)) ? -1 : 1
  updatePlayerGun()
  player.vx = (keyLeft ? -1 : keyRight ? 1 : 0) * playerVelocity
  player.vy = (keyDown ? -1 : keyUp ? 1 : 0) * playerVelocity
  if (player.vx && player.vy) {
    player.vx *= .707
    player.vy *= .707
  }
  if (player.vx || player.vy) player.classList.add('walk')
  else player.classList.remove('walk')
  for (const obj of objects) {
    obj.update()
  }
  updateCam(player)
}, 33)

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
  console.log(key==' ')
  if (toggle && key == ' ') mkNews(player, 'Some hard strong title', `
    This is the news body. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vitae ante consequat, cursus tellus ac, ultrices nibh.

    Suspendisse vel semper est, in mattis nibh. Ut in augue ante. Duis eleifend pellentesque purus. Integer aliquam faucibus magna, id suscipit ligula elementum quis. Proin tristique dictum quam, ac porttitor nibh lobortis id. Nullam vitae facilisis sem, id rutrum metus. Curabitur vel turpis non quam pharetra vehicula.
  `)
}

body.addEventListener('keydown', ev => updateKeypressed(ev.key, 1))

body.addEventListener('keyup', ev => updateKeypressed(ev.key, 0))

canvasBox.addEventListener('pointerdown', ev => {
  if (ev.button == 0) player.gun.t = 1 // Triggered
})
body.addEventListener('pointerup', ev => {
  if (ev.button == 0) player.gun.t = 0 // Untriggered
})
