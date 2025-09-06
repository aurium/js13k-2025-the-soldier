import { speak } from './text.js'
import { mkNews } from './journal.js'
import { mkPerson } from './people.js'
import { vWall } from '../buildings.js'

vWall(-30,-10, -15,15)
vWall(30,-10, 15,15)

globalThis.p.bless = 1 // Makes the player imortal.

const testP = mkPerson(15, 0, {
  we: 1, turn: -1,
  rnd: [.5,.1,.2,.3,.4,.5,.6, .6], // rnd[7] > .6 means White Hair
  rndC: [1,1,5], // rndC[2] == 5 means Old Person
  act(p) {
    p.vx = .1
  }
})

speak(testP, 'This is a test.\nDid you like that?', {s:1})

for (let x = -37; x <= 38; x+=5) for (let y = -10; y <= 14; y+=7) {
  mkPerson(x, y, {
    we: x<0, s:y%2==0,
    fem: (x+y)%2==0,
    c: y<0,
  })
}

globalThis.scene = ()=> {

}

()=>
mkNews(player, 'Some hard strong title', `
  This is the news body. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vitae ante consequat, cursus tellus ac, ultrices nibh.

  Suspendisse vel semper est, in mattis nibh. Ut in augue ante. Duis eleifend pellentesque purus. Integer aliquam faucibus magna, id suscipit ligula elementum quis. Proin tristique dictum quam, ac porttitor nibh lobortis id. Nullam vitae facilisis sem, id rutrum metus. Curabitur vel turpis non quam pharetra vehicula.
`)
