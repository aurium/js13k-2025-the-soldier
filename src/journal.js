import { mkEl } from './util.js'
import { canvas, body, centerX, centerY } from './base.js'

export function mkNews(objTarget, title, txt, opts={}) {
  const news = mkEl('div', { className: 'news new '+opts.c }, body)
  news.show = ()=> {
    setTimeout(()=> news.classList.remove('new'), 50)
    return news
  }
  mkEl('h2', { txt: title }, news)
  const pic = mkEl('header', {}, mkEl('header', {}, news))
  const c = canvas.cloneNode(true)
  c.style.left = (-objTarget.x * 1.4 + 26) + 'em'
  c.style.bottom = (-objTarget.y * 1.4 + 13) + 'em'
  pic.appendChild(c)
  txt = txt.trim().split('\n').map(l=>l.trim()).join('\n')
  for (let p = 0; p < 2; p++) {
    txt += '\n\nBla'
    for (let c = 0; c < 30+p*10; c++) {
      if (Math.random()<.7) txt += Math.random()<.2 ? ['. Bla', '! Bla', ', '].rnd() : ' '
      txt += 'bla'
    }
    txt += '.'
  }
  mkEl('p', { txt }, news)
  return news
}
