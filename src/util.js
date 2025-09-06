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

export const mkId = (prefix)=> prefix + String(Math.random()).split('.')[1]

export const calcZIdx = (y)=> Math.round(2000-y*10)
