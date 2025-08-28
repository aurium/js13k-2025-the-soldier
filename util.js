export function mkEl(tag, attrs, parent) {
  const el = Object.assign(
    document.createElement(tag),
    attrs
  )
  if (parent) parent.appendChild(el)
  return el
}
