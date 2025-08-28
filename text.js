import { mkEl } from './util.js'
import { canvas } from './base.js'

export function speak(obj, txt, opts={}) {
  const ballom = mkEl('b', { className: 'speak' }, canvas)
  const content = mkEl('p', { txt }, ballom)
  ballom.style.left = (obj.x - 2) + 'em'
  ballom.style.bottom = (obj.y + 6) + 'em'
}
