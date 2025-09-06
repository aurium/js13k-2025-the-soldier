import { objects, getObjsArr, fireBullet, getBulletsArr, removeBullet } from './base.js'

/**
 * @typedef PersonOpts
 * @type {object}
 * @prop {boolean} c - Is Child?
 * @prop {boolean} s - Is Soldier?
 * @prop {number[]} rnd - Random numbers to vary styles as css vars.
 * @prop {number[]} rndC - Random numbers to vary styles as css classes.
 */

/**
 * Crates a person object.
 * @arg {number} x - horizontal position.
 * @arg {number} y - vertical position.
 * @arg {PersonOpts} opts - misc options.
 */
export function mkPerson(x, y, opts={}) {
  opts.rnd ??= []
  opts.rndC ??= []
  opts.id ??= 'o' + String(Math.random()).split('.')[1]
  const p = mkEl('p', {
    id: opts.id,
    className:
      `person ${opts.s&&'s'} ${opts.we?'we':'they'} ${opts.fem&&'fem'} ${opts.c&&'c'} ` +
      Array(9).fill(0).map((_,i)=>`rnd${i}-` + (opts.rndC[i] ?? Math.floor(Math.random()*6))).join(' '),
    style:
      Array(9).fill(0).map((_,i)=>`--rnd${i}:` + (opts.rnd[i] ?? Math.random())).join(';')
  }, canvas)
  mkEl('b', 0, p) // body
  const head = mkEl('h', 0, p)
  const wig = mkEl('w', 0, head)
  mkEl('a', 0, p) // arm
  mkEl('f', 0, p) // foot
  const bleed = mkEl('bl', {}, p)
  // const gun = globalThis.document?.createElementNS('http://www.w3.org/2000/svg', 'svg')
  // p.appendChild(gun)
  // gun.setAttribute('width', '100%')
  // gun.setAttribute('height', '100%')
  // gun.a = 0
  // gun.l = 0
  // gun.innerHTML = //'<rect width="100%" height="100%" fill="rgba(255,0,0,.4)"/>'+
  //   '<circle cx="90%" cy="48%" r="10%" fill="#F40"/>' +
  //   '<rect x="45%" y="40%" width="30%" height="30%" fill="#111"/>' +
  //   '<rect x="45%" y="40%" width="45%" height="16%" fill="#111"/>' +
  //   '<rect x="52%" y="50%" width="10%" height="50%" fill="#111"/>' +
  //   '<rect x="40%" y="60%" width="17%" height="27%" fill="var(--skin)"/>'
  // gun.f = gun.firstChild // Fire
  const gun = mkEl('g', {}, p)
  gun.a = .5
  gun.l = 0
  gun.f = mkEl('f', {}, gun)
  mkEl('g1', {}, gun)
  mkEl('g2', {}, gun)
  mkEl('g3', {}, gun)
  mkEl('a', {}, gun)
  const obj = Object.assign(p, {
    p: 1, // is person
    w: opts.c?2:3, h: opts.c?2.5:5, d:1, // Colision data width(x), height(y), deepness(z).
    x, y, vx: 0, vy: 0, turn: 1,
    gun,
    update() {
      obj.x += obj.vx
      obj.y += obj.vy
      let rebound;
      let bulletHit
      if (bulletHit = testBulletHit(obj)) {
        // Bad thing must happen
        if (obj.p) {
          //bleed(obj, bulletHit.x-obj.x, bulletHit.y-obj.y)
          bleed.style.bottom = (bulletHit.y-obj.y + obj.h/2)/2 + 'em'
          delete objects[obj.id]
          obj.die = 1
          obj.classList.add('die')
          p.style.transition = '1s'
        }
      }
      if (rebound = testColisionAgainstAllOtherObjects(obj)) {
        obj.x += rebound.x*1.5
        obj.y += rebound.y*1.5
      }
      if (obj.act) obj.act(obj)
      else {
        if (obj != globalThis.p) personAct(obj)
      }
      if (obj.s) updateGun(obj)
      if (obj.vx || obj.vy) obj.classList.add('walk')
      else obj.classList.remove('walk')
      p.style.left = obj.x+'em'
      p.style.bottom = obj.y+'em'
      const child = opts.c ? `translate(-.6em,1.2em) scale(.666,.5)` : ''
      p.style.transform = `${obj.die?'rotate(-90deg)':''}${child}scaleX(${obj.turn})`
      p.style.zIndex = Math.round(2000-obj.y)
    },
    get isOld() { return opts.rndC[2] == 5 && opts.rnd[7] > .6 }
  }, opts)
  objects[obj.id] = obj
  return obj
}

function updateGun(p) {
  const angle = (p.turn == -1) ? p.gun.a*-1 + Math.PI : p.gun.a
  p.gun.style.transform = `scale(${p.c?.9:1},${p.c?1.2:1}) rotate(${angle}rad)`
  if (p.gun.t && p.gun.l < (Date.now()-200)) {
    p.gun.l = Date.now()
    p.gun.f.style.opacity = 1
    fireBullet(p)
  } else {
    p.gun.f.style.opacity = 0
  }
}

function personAct(p) {
  if (p.s) return soldierAct(p)
}

function soldierAct(p) {
  //const FIRST = getObjsArr().filter(o=>o.s)[1].id
  if (!objects[p.targ?.id]) p.targ = null
  if (!p.targ) { // Must select a target
    p.targ = getObjsArr().filter(o => o.we != p.we).sort(()=>Math.random()<.5?-1:1)[0]
  }
  if (!p.targ) {
    p.gun.t = 0
    p.gun.a = (p.gun.a*8 + 1) / 9
  } else {
    const gunY = p.y + p.h/2
    let angle = Math.atan2(gunY-p.targ.y, p.targ.x-p.x)
    //if (p.id == FIRST) console.log(p.id, p.targ.id, angle)
    p.gun.a = (p.gun.a*8 + angle) / 9
    if ((p.gun.a - angle) ** 2 < .1) {
      p.gun.t = 1
    }
  }
  p.turn = (p.gun.a > 1.57 || p.gun.a < -1.57) ? -1 : 1
}

function testColisionAgainstAllOtherObjects(obj) {
  for (const other of getObjsArr()) {
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
  for (const b of getBulletsArr()) {
    if (
      b.x > obj.x && b.x < (obj.x+obj.w) &&
      b.y > obj.y && b.y < (obj.y+obj.h)
    ) {
      removeBullet(b)
      return b
    }
  }
}
