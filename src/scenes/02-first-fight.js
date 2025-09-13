import { speak } from '../text.js'
import { mkNews } from '../journal.js'
import { mkPerson } from '../people.js'
import { hWall, vWall, dWall, mkBox } from '../buildings.js'
import { getObjsArr, sceneChange } from '../base.js'

export function firstFight() {
  let histStep = 0, ballon
  sceneChange(build, nextStep)

  function build() {
    canvas.className = 'first'

    mkEl('gr', {}, canvas)

    hWall(-200, 800,-200, { c:'tree' })
    hWall(-200, 800, 200, { c:'tree' })
    vWall(-200,-200, 200, { c:'tree' })
    vWall( 800,-200, 200, { c:'tree' })

    for (let x = -200; x < 700; x+=100) for (let y = -195; y < 195; y+=15) {
      hWall(x+Math.random()*30+(y%2)*50, x+100-Math.random()*30+(y%2)*50, y+Math.random()*5, { c:'tree' })
    }

    globalThis.camTo = player
    player.vx = player.vy = 0
    player.x = -100
    player.y = 0

    mkPerson(-100, -10, { we:1, s:1, a:2, vx:.1 })
    mkPerson(-100,  10, { we:1, s:1, a:2, vx:.1 })
  }

  let createTheyTimeout
  function createThey() {
    createTheyTimeout = setTimeout(createThey, 1100-player.x)
    if (getObjsArr().filter(o=>o.p).length > 30) return;
    mkPerson(Math.min(player.x+100, 990), Math.random()*300-150, {
      we: 0,
      s: Math.random()<.5,
      a: 2, v: .1,
      dist: player
    })
  }


  function nextStep() {
    histStep++
    console.log('First fight:', histStep)
    if (histStep == 1) {
      player.bless = 0
      createThey()
    }
    if (histStep == 2) {
    }
    if (histStep == 3) {
    }
    if (histStep == 4) {
    }
    if (histStep == 5) {
    }
    if (histStep == 6) {
    }
  }

}
