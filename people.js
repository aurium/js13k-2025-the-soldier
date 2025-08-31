import { objects } from './base.js'

export function mkPerson(x, y, opts={}) {
  opts.rnd ??= []
  opts.rndC ??= []
  opts.id ??= 'o' + String(Math.random()).split('.')[1]
  const p = mkEl('p', {
    id: opts.id,
    p: 1, // is person
    className:
      `person ${opts.we?'we':'they'} ${opts.fem&&'fem'} ${opts.child&&'child'} ` +
      Array(9).fill(0).map((_,i)=>`rnd${i}-` + (opts.rndC[i] ?? Math.floor(Math.random()*6))).join(' '),
    style:
      //`--child:${opts.child?1:0}; ` +
      Array(9).fill(0).map((_,i)=>`--rnd${i}:` + (opts.rnd[i] ?? Math.random())).join(';')
  }, canvas)
  mkEl('b', 0, p) // body
  const head = mkEl('h', 0, p)
  const wig = mkEl('w', 0, head)
  mkEl('a', 0, p) // arm
  mkEl('f', 0, p) // foot
  const obj = Object.assign(p, {
    type: 'person',
    w: opts.child?2:3, h: opts.child?2.5:5, d:1, // Colision data width(x), height(y), deepness(z).
    x, y, vx: 0, vy: 0, turn: 1,
    update() {
      this.x += this.vx
      this.y += this.vy
      let rebound;
      if (rebound = testColisionAgainstAllOtherObjects(this)) {
        this.x += rebound.x*1.5
        this.y += rebound.y*1.5
      }
      if (testBulletHit(this)) {
        // Bad thing must happen
      }
      p.style.left = this.x+'em'
      p.style.bottom = this.y+'em'
      const child = opts.child ? `translate(-.6em,1.2em) scale(.666,.5)` : ''
      p.style.transform = `${child} scaleX(${this.turn})`
      p.style.zIndex = Math.round(2000-this.y)
    },
    get isOld() { return opts.rndC[2] == 5 && opts.rnd[7] > .6 }
  }, opts)
  objects.push(obj)
  return obj
}

function testColisionAgainstAllOtherObjects(obj) {
  for (const other of objects) {
    if (other !== obj) {
      const rebound = testObjsColision(obj, other)
      if (rebound && other.p) return { x: rebound.x/2, y: rebound.y/2 }
    }
  }
}

export function testObjsColision(obj, other) {
  const aW = obj.x, aE = obj.x + obj.w
  const aS = obj.y, aN = obj.y + obj.d
  const bW = other.x, bE = other.x + other.w
  const bS = other.y, bN = other.y + other.d

  const aHorzOverlapFromRigth = aW >= bW && aW < bE
  const aHorzOverlapFromLeft  = aE <= bE && aE > bW
  const aHorzFullOverlapOther = aW <= bW && aE >= bE
  const aHorzFullOverlaped    = bW <= aW && bE >= aE
  const aVertOverlapFromTop   = aS >= bS && aS < bN
  const aVertOverlapFromBelow = aN <= bN && aN > bS
  const aVertFullOverlapOther = aS <= bS && aN >= bN
  const aVertFullOverlaped    = bS <= aS && bN >= aN

  if (aHorzOverlapFromRigth || aHorzOverlapFromLeft || aHorzFullOverlapOther || aHorzFullOverlaped) {
    // We get Some horizontal overlap, but not a hit yet

    if (aVertFullOverlapOther || aVertFullOverlaped) { // pure horizontal hit
      if (aHorzOverlapFromRigth) return { x: bE-aW, y:0 }
      else return { x: bW-aE, y:0 }
    }

    if (aVertOverlapFromTop || aVertOverlapFromBelow) { // has vertical hit
      const rebound = { x:0 }
      if (aVertOverlapFromTop) rebound.y = bN - aS
      else rebound.y = bS - aN
      if (aHorzFullOverlapOther || aHorzFullOverlaped) return rebound
      if (aHorzOverlapFromLeft) rebound.x = bW - aE
      else rebound.x = bE - aW
      return rebound
    }
  }
}

function testBulletHit(obj) {
}
