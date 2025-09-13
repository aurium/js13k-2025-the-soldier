import { speak } from '../text.js'
import { mkNews } from '../journal.js'
import { mkPerson } from '../people.js'
import { hWall, vWall, dWall, mkBox } from '../buildings.js'
import { sceneChange } from '../base.js'

export function loader01() {
  let histStep = 0, ignoreClick = 0, sargent, ballon
  const clickHandler = ()=> ignoreClick || nextStep()
  sceneChange(build, ()=> body.addEventListener('click', clickHandler))

  function build() {
    canvas.className = 'want'

    mkEl('gr', {}, canvas)
    mkEl('rv', {}, canvas)
    mkEl('fl', {}, canvas)

    hWall(-50, 200, 30, { c:'tree' })
    hWall(-50, 200, -35, { c:'tree' })

    vWall(-50, -20, 15)
    vWall(-25, -20,-10)
    vWall(-25,   5, 15)
    vWall(100, -20, 15)
    hWall(-50, 100, 15)
    hWall(-50, 100,-20)

    mkBox(-40,-5,5,10,3)

    globalThis.camTo = player
    player.v = player.vx = 0
    player.x = -45
    player.dest = null
    ballon = speak(player, 'I want to fight.')

    sargent = mkPerson(-30, -5, {
      we:1, s:1, a:2, bless:1
    })
  }

  function nextStep() {
    histStep++
    console.log('Want to fight:', histStep)
    if (histStep == 1) {
      ballon.remove()
      ballon = speak(sargent,
        'Good.\nMove to the next room.' +
        '\n\nUse W S A D or arrow keys.' +
        '\n\nThere you will receive your\nuniform and weapon.'
      )
    }
    if (histStep == 2) {
      ballon.remove()
      ignoreClick = enableCtrl = 1
      const followInterval = setInterval(()=> {
        if (player.x > -24) {
          clearInterval(followInterval)
          nextStep()
        }
      }, 50)
    }
    if (histStep == 3) {
      player.act = null
      player.s = 1
      player.className += ' s'
      ballon = speak(player, 'Wow!\nMagick?')
      setTimeout(nextStep, 2000)
    }
    if (histStep == 4) {
      ignoreClick = 0
      ballon.remove()
      ballon = speak(sargent,
        'Now, you point and click.\n\nCaution! You can kill a brother.'
      )
    }
    if (histStep == 5) {
      ignoreClick = 1
      setTimeout(()=> ballon.remove(), 1000)
      setTimeout(nextStep, 4000)
    }
    if (histStep == 6) {
      ignoreClick = 0
      ballon = speak(sargent,
        'Ok. We are sending you with a retaliation group.'
      )
    }
    if (histStep == 7) {
      body.removeEventListener('click', clickHandler)
      //firstFight()
      setTimeout(firstFight, 1000)
    }
  }

}
