import { mkEl } from './util.js'
import { objects, mkPerson } from './objects.js'

const body = document.body

let mousePageX, mousePageY
let winW, winH, canvasTop, canvasH, em
let camX=0, camY=0, targetX, targetY=99
let centerX = 50, centerY = 18

const fpsEl = mkEl('code', { style: 'position:absolute; bottom:.5em' }, body)

function updateWinSize() {
  winW = body.clientWidth
  winH = body.clientHeight
  canvasH = winW * .4
  canvasTop = (winH - canvasH) / 2
  em = winW / 100
}
window.addEventListener('resize', updateWinSize)
updateWinSize()

const canvas = mkEl(
  'div',
  { id: 'canvas' },
  mkEl('div', { id: 'canvas-box' }, body)
)
const target = mkEl('div', { id: 'target' }, canvas)

const player = mkPerson(0,0, {
  we: 1, //child: 1,
  rnd:[.8, .85, .35, 0, 0, 0],
  rndC: Array(9).fill(0)
})
mkPerson(0,0, {
  we: 1, child: 1,
  rnd:[.8, .85, .35, 0, 0, 0],
  rndC: Array(9).fill(0)
})

mkPerson(5,0, {
  we: 1,
  rnd:[.5,.1,.2,.3,.4,.5,.6, .6], // rnd[7] > .6 means White Hair
  rndC: [1,1,5] // rndC[2] == 5 means Old Person
})

for (let x = -37; x <= 38; x+=5) for (let y = -10; y <= 14; y+=7) {
  mkPerson(x, y, {
    we: x<0,
    fem: (x+y)%2==0,
    //kind: (x<0 ? 'we' : 'they') +' '+ ((x+y)%2==0 ? 'mas' : 'fem'),
    child: y<0,
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
  player.vx = (keyLeft ? -1 : keyRight ? 1 : 0) * playerVelocity
  player.vy = (keyDown ? -1 : keyUp ? 1 : 0) * playerVelocity
  if (player.vx && player.vy) {
    player.vx *= .707
    player.vy *= .707
  }
  if (player.vx || player.vy) player.classList.add('walk')
  else player.classList.remove('walk')
  for(const obj of objects) {
    obj.update()
  }
  updateCam()
}, 33)

function updateCam() {
  const m = 40
  moveCam(
    (camX*m + player.x)/(m+1) + player.vx*2,
    (camY*m + player.y)/(m+1) + player.vy*1.2
  )
}

function moveCam(x, y) {
  camX = x
  camY = y
  canvas.style.left = (centerX-camX)+'em'
  canvas.style.bottom = (centerY-camY)+'em'
  updateTarget()
}

function updateTarget() {
  targetX = (mousePageX / em) - centerX + camX
  targetY = -((mousePageY - canvasTop - canvasH) / em) - centerY + camY
  target.style.left = targetX+'em'
  target.style.bottom = targetY+'em'
  player.turn = (targetX < (player.x+1.5)) ? -1 : 1
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

body.addEventListener('pointermove', ev => {
  mousePageX = ev.pageX
  mousePageY = ev.pageY
  updateTarget()
})
