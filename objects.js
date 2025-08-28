export const objects = []

export function mkPerson(x, y, opts={}) {
  opts.rnd ??= []
  opts.rndC ??= []
  const p = mkEl('p', {
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
      if (rebound = testColision(this)) {
        this.x += rebound.x
        this.y += rebound.y
      }
      p.style.left = this.x+'em'
      p.style.bottom = this.y+'em'
      const child = opts.child ? `translate(-.6em,1.2em) scale(.666,.5)` : ''
      p.style.transform = `${child} scaleX(${this.turn})`
      p.style.zIndex = Math.round(1000-this.y)
    },
    get isOld() { return opts.rndC[2] == 5 && opts.rnd[7] > .6 }
  }, opts)
  objects.push(obj)
  return obj
}

function testColision(obj) {
  for (let other of objects) {

  }
}
