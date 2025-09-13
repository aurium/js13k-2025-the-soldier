/**
 * @return {HTMLElement}
 */
export function mkEl(tag, attrs, parent) {
  if (!globalThis.document) return;
  const el = Object.assign(
    document.createElement(tag),
    attrs
  )
  el.textContent = attrs.txt
  if (parent) parent.appendChild(el)
  return el
}

export function dist(a, b) {
  return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2)
}

export const mkId = (prefix)=> prefix + String(Math.random()).split('.')[1]

export const calcZIdx = (y)=> Math.round(2000-y*10)
