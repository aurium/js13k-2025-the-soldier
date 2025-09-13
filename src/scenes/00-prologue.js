import { speak } from '../text.js'
import { mkNews } from '../journal.js'
import { mkPerson } from '../people.js'
import { hWall, dWall } from '../buildings.js'
import { mkEl } from '../util.js'
import { deaths, sunDeaths } from '../base.js'
import { loader01 } from './01-want-to-fight.js'

export function prologue() {
  canvas.className = 'prologue'

  mkEl('gr', { // Grass
  }, canvas)
  mkEl('r', { // Road
  }, canvas)

  dWall(-70,-20, -35,15, { c:'bric' })

  for (let x = -35; x < 100; x+=20) {
    hWall(x,x+13, 15, { c:'bric' })
    hWall(x+13,x+20, 15, { c:'tree' })
  }

  const loverM = (p)=> {
    if (loopTic%33==0) p.a = 0 // means turn = 1 = to East
    personAct(p)
  }

  const loverF = (p)=> {
    if (loopTic%33==0) p.a = 2 // means turn = -1 = to West
    personAct(p)
  }

  globalThis.p.bless = 1 // Makes the player imortal.
  globalThis.p.v = .2
  globalThis.p.dest = { x:0, y:0 }
  globalThis.p.act = loverM

  const loveP = mkPerson(4, 0, {
    we: 1, fem: 1,
    rnd: [.6,.6,.4,.1,.1,.1,.9],
    rndC: [1,0,1],
    v: .2,
    dest: { x:4, y:0 },
    act: loverF
  })

  for (let a = .3; a < twoPI; a+=1) {
    mkPerson(Math.cos(a)*25, Math.sin(a)*15, {
      we: 1,
      v:.1,
      dest: { x:Math.cos(a)*25, y:Math.sin(a)*15 },
      act: loverM
    })
    mkPerson(Math.cos(a)*25+4, Math.sin(a)*15, {
      we: 1,
      fem: 1,
      v:.1,
      dest: { x:Math.cos(a)*25+4, y:Math.sin(a)*15 },
      act: loverF
    })
  }

  const party = []
  const gCenter = { x:-30, y:8 }
  for (let a = 0; a < twoPI; a+=.3) {
    party.push(mkPerson(Math.cos(a)*5 + gCenter.x, Math.sin(a)*5 + gCenter.y, {
      we:1,
      fem: Math.random()<.5,
      v:.1,
      dest: gCenter,
      act(p) {
        p.a += Math.random()-.5
        if (loopTic%222==0) personAct(p)
      }
    }))
  }

  let notes = ['𝆺𝅥𝅯','𝅘𝅥𝅮','𝅘𝅥𝅯','𝅘𝅥𝅰','𝅘𝅥𝅱','𝄢','𝄞','🎵','🎶','🎼']
  let music = speak(party.rnd(), notes.rnd())
  const musicInterval = setInterval(()=> {
    music.remove()
    music = speak(party.rnd(), notes.rnd(), {s:3})
  }, 1000)

  const mkChildDest = ()=> ({ x: Math.random()*60-30, y: Math.random()*30-18 })

  const children = []
  for (let i = 0; i < 12; i++) {
    children.push(mkPerson(mkChildDest().x, mkChildDest().y, {
      we:1, c:1,
      fem: Math.random()<.5,
      v:.2,
      dest: mkChildDest(),
      act(p) {
        p.a += Math.random()-.5
        if (loopTic%222==0) personAct(p)
      }
    }))
  }

  children.n = 0
  const childrenInterval = setInterval(()=> {
    children.n++
    children[children.n%12].dest = mkChildDest()
  }, 100)

  setTimeout(sceneIn, 500)

  let loveBallon = speak(loveP, 'Hey Honey,\nYou will not believe...')

  let histStep = 0, ignoreClick = 0, bad, news1, news2, tremeInterval

  function goStep() {
    histStep++
    console.log('Prologue:', histStep)
    if (histStep == 1) {
      loveBallon.remove()
      loveBallon = speak(globalThis.p, 'Tell me!')
    }
    if (histStep == 2) {
      loveBallon.remove()
      loveBallon = speak(loveP, 'The most cuuuute thing\nI ever saw!')
      news1 = mkNews({ x:-5, y:3 },
        `Valentine's Day at Ourland Park`,
        `The lovers, friens and families are having a great day!`
      ).show()
    }
    if (histStep == 3) {
      news1.remove()
      loveBallon.remove()
      loveBallon = speak(globalThis.p, 'Oh! I think I already know...')
    }
    if (histStep == 4) {
      loveBallon.remove()
      loveBallon = speak(loveP, 'A black kitten was\non my window today.')
    }
    if (histStep == 5) {
      loveBallon.remove()
      loveBallon = speak(globalThis.p, 'oOOOooowwww...')
    }
    if (histStep == 6) {
      ignoreClick = 1
      loveBallon.remove()
      bad = [
        globalThis.camTo = mkPerson(70, 0, {
          we:0, s:1, a:2, vx:-.2,
          act: (p)=> {
            //p.vx = -.1
            if (p.x < 35) {
              bad[0].vx = bad[1].vx = bad[2].vx = 0
              bad[0].act = bad[1].act = bad[2].act = delta
              goStep()
            }
          }
        }),
        mkPerson(73, 7, {
          we:0, s:1, a:2, vx:-.2,
          act: delta
        }),
        mkPerson(73, -7, {
          we:0, s:1, a:2, vx:-.2,
          act: delta
        })
      ]
      bad[0].gun.a = bad[1].gun.a = bad[2].gun.a = 2
    }
    if (histStep == 7) {
      ignoreClick = 0
      loveBallon = speak(globalThis.p, 'WTF?')
      globalThis.camTo = globalThis.p
      bad[0].targ = bad[1].targ =  bad[2].targ = loveP
      news1 = mkNews({ x:30, y:0 },
        `Terrorists from They are invading`,
        `We don't know why, but they are here with guns threatening our people.`
      )
    }
    if (histStep == 8) {
      loveBallon.remove()
      clearInterval(musicInterval)
      music.remove()
      bad[0].act = bad[1].act = bad[2].act = null
      ignoreClick = 1
      getObjsArr().forEach(p => { // Everybody in panic!
        if (p!=globalThis.p && p!=loveP && !p.s) {
          p.panic = 1
          p.act = p.dest = null
        }
      })
      const testDeathInterval = setInterval(() => {
        if (sunDeaths(0 /* from we */) > 15) {
          clearInterval(testDeathInterval)
          goStep()
        }
      }, 100)
    }
    if (histStep == 9) {
      loveBallon = speak(globalThis.p, 'Honey?')
      const callSoldiersInterval = setInterval(()=> {
        for (let i = 0; i < 3; i++) {
          mkPerson(-55+10*i+Math.random()*10, -30, {
            we:1, s:1, vy: .5 - i*.1,
            act(p) {
              if (p.y > 0-i*2) {
                p.vy = 0
                p.act = null
              }
            }
          })
        }
        if (!bad.find(p=>!p.die)) { // All bad are dead
          clearInterval(callSoldiersInterval)
          goStep()
        }
      }, 1500)
    }
    if (histStep == 10) {
      ignoreClick = 0
      loveBallon.remove()
      loveBallon = speak(globalThis.p, 'HONEY??')
      news2 = mkNews({ x:-10, y:0 },
        `Massive killing on Ourland Park`,
        `${sunDeaths(0 /* from we */)} inocent people, particularly ${deaths[0].c} children are dead. For now, the threat has been contained by our soldiers.`,
        { c: 'n2' }
      )
    }
    if (histStep == 11) {
      loveBallon.remove()
      loveBallon = speak(globalThis.p, 'HONEY????', {s: 3})
    }
    if (histStep == 12) {
      loveBallon.remove()
      loveBallon = speak(globalThis.p, 'AAAAAAAAAAA\nAAAAAAAAA!!!', {s: 4})
      globalThis.camTo = { x:-1, y:0 }
      tremeInterval = setInterval(()=> {
        globalThis.camTo.x = globalThis.camTo.x < 0 ? 1.5 : -1.5
      }, 60)
    }
    if (histStep == 13) {
      news1.show()
      news2.show()
    }
    if (histStep == 14) {
      clearInterval(tremeInterval)
      body.removeEventListener('click', clickHandler)
      news1.remove()
      news2.remove()
      loader01()
    }
  }

  const clickHandler = ()=> ignoreClick || goStep()
  body.addEventListener('click', clickHandler)

  //globalThis.scene = ()=> {}
}
