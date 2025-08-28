import { mkEl } from './util.js'
import { canvas, body, centerX, centerY } from './base.js'

export function mkNews(objTarget, title, txt) {
  const news = mkEl('div', { className: 'news' }, body)
  mkEl('h2', { txt: title }, news)
  const pic = mkEl('header', {}, mkEl('header', {}, news))
  const c = canvas.cloneNode(true)
  const targetClone = c.querySelector('#'+objTarget.id)
  //console.log('>>', targetClone, objTarget.x, objTarget.y)
  c.style.left = (-objTarget.x * 1.59 + 23) + 'em'
  c.style.bottom = (-objTarget.y * 1.59 + 12) + 'em'
  pic.appendChild(c)
  mkEl('p', { txt: txt.trim().split('\n').map(l=>l.trim()).join('\n') }, news)
}
