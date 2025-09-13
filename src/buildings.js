import { mkEl, mkId } from './util.js'
import { canvas } from './base.js'

/** Horizontal Wall */
export function hWall(x1,x2, y, opts={}) {
  const width = x2 - x1
  opts.id ??= mkId('w')
  const wall = mkEl('wall', {
    update() {
      wall.style.setProperty('--o', globalThis.p.y > y ? .4 : 1)
    },
    className: 'h '+opts.c,
    style: `left:${x1}em;bottom:${(y)}em;`
         + `width:${width}em;`
         + `z-index:${calcZIdx(y)}`,
    ...opts,
    x1,x2,y,
    wall:1, h:1
  }, canvas)
  objects[wall.id] = wall
}

/** Vertical Wall */
export function vWall(x, y1,y2, opts = {}) {
  opts.d ??= y2 - y1
  opts.w ??= 1
  opts.id ??= mkId('w')
  const wall = mkEl('wall', {
    update() { },
    className: 'v '+opts.c,
    style: `left:${x}em;bottom:${(y1)}em;`
         + `width:${opts.w}em;`
         + `height:${opts.d + 12}em;`
         + `z-index:${calcZIdx(y1)}`,
    ...opts,
    x,y1,y2,
    wall:1, v:1
  }, canvas)
  objects[wall.id] = wall
}

/** Diagonal Wall */
export function dWall(x1,y1, x2,y2, opts={}) {
  const skew = x1 < x2 ? -1 : 1
  const width = delta(x1, x2)
  opts.id ??= mkId('w')
  const wall = mkEl('wall', {
    update() { },
    className: 'd '+opts.c,
    style: `left:${skew==-1?x1:x2}em;bottom:${(y1+y2)/2}em;`
         + `width:${width}em;`
         + `z-index:${calcZIdx(y2)};`
         + `transform:skewY(${skew * Math.atan((y2-y1)/width)}rad)`,
    ...opts,
    x1,y1, x2,y2, skew,
    wall:1,
    dg:1 // diagonal
  }, canvas)
  objects[wall.id] = wall
}

export function mkBox(x, y, w, d, h, opts = {}) {
  opts.id ??= mkId('b')
  const box = mkEl('box', {
    style: `left:${x}em;bottom:${y}em;width:${w}em;height:${d+h}em`,
    update() { },
    ...opts
  }, canvas)
  mkEl('div', {
    style: `height:${h}em`
  }, box)
  return objects[box.id] = box
}
