import { mkEl, mkId } from './util.js'
import { canvas } from './base.js'

export function vWall(x1,y1, x2,y2, opts={}) {
  const skew = x1 < x2 ? -1 : 1
  const width = Math.abs(x2 - x1)
  opts.id ??= mkId('w')
  const wall = mkEl('wall', {
    update() { },
    style: `left:${skew==-1?x1:x2}em;bottom:${(y1+y2)/2}em;`
         + `width:${width}em;`
         + `height:14em;`
         + `z-index:${Math.round(2000-y2)};`
         + `transform:skewY(${skew * Math.atan((y2-y1)/width)}rad)`,
    ...opts,
    x1,y1, x2,y2, skew
  }, canvas)
  objects[wall.id] = wall
}
