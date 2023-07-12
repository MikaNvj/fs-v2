const toSnakeCase = (str, sep = '-') => str.replace(/[A-Z]/g, letter => `${sep}${letter.toLowerCase()}`)
const toCamelCase = (str, lowFirst = false) => {
  str = str.replace(/[-_]([a-z])/gi, (_, found) => found.toUpperCase())
  const first = lowFirst ? str[0].toLowerCase() : str[0].toUpperCase()
  return first + str.substr(1)
}
const DOM = {
  create: (elt = "", attr) => {
    elt = elt.split(' ')[0] 
    let clsrx = RegExp('\\.[A-Z0-9_-]+', 'gi')
    let idsrx = RegExp('#[A-Z0-9_-]+', 'gi')
    let typerx = RegExp('^[^.# ]+', 'gi')
    let element, matches
  
    if ((matches = typerx.exec(elt)) !== null) {
      element = document.createElement(matches[0])
    }
    else element = document.createElement('div')
    if((matches = idsrx.exec(elt)) !== null) element.setAttribute('id', matches[0].replace('#', ''))
    while ((matches = clsrx.exec(elt)) !== null) element.classList.add(matches[0].replace('.', ''))
    // attributes
    attr && DOM.attr(element, attr)

    // DOM methods
    element.append = (...obj) => DOM.append(element, ...obj)
    element.css = (obj) => DOM.css(element, obj)
    element.attr = (obj) => DOM.attr(element, obj)

    return element
  },
  attr: (elt, obj) => {
    Object.keys(obj).forEach(key => {
      elt.setAttribute(toSnakeCase(key), obj[key])
    })
    return elt
  },
  append: (elt, ...children) => {
    children.forEach(child => {
      if(child){
        if(typeof child === 'string') child = document.createTextNode(child)
        elt.appendChild(child)
      }
    })
    return elt
  },
  css: (elt, cssObj) => {
    Object.keys(cssObj).forEach(key => {
      elt.style[key] = cssObj[key]
    })
    return elt
  }
}
exports.default = DOM

/**

Exemple 01
const parent = create('div.isParent#parent', {'data-type': 'parent'})
<div id="parent" class="isParent" data-type="parent"></div>

Exemple 02
const checkbox = create('input.female', {type: 'checkbox', checked: true})
<input class="female" type="checkbox" checked="true">

Exemple 03
const parentWithChild = append(create('div.par', {tabIndex: 1}), create('span.child'), "un peu de texte", create('span.span2'))
<div class="par" tab-index="1">
  <span class="child"></span>
  un peu de texte
  <span class="span2"></span>
</div>

Exemple 04
const parentWithChild = append(create('.par.mar#ici', {superMarkZebra: 1}))
<div id="ici" class="par mar" super-mark-zebra="1"></div>

 */