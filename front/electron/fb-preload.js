window.ipcRenderer = require('electron').ipcRenderer
window.remote = require('electron').remote
const DOM = require('./domMaker').default


const putFsPane = async (moredata = {}) => {
  const data = await window.ipcRenderer.invoke("setFbData", moredata)

  let fsPane = document.querySelector('.fs-pane')
  if(!fsPane){
    fsPane = DOM.create('.fs-pane').append(
      DOM.create('.fs-pane-right').append(
        DOM.create('span.id'),
        DOM.create('span.name'),
        DOM.create('.options').append(
          DOM.create('button.cancel').append('Annuler'),
          DOM.create('button.next')
        )
      )
    )
    document.body.appendChild(fsPane)
    document.head.appendChild(DOM.create('style').append(css))
    document.querySelector('.fs-pane .cancel').onclick = e => {
      putFsPane({canceled: true})
    }
  }
  document.querySelector('.fs-pane .id').innerHTML = data.id || ''
  document.querySelector('.fs-pane .name').innerHTML = data.name || ''
  document.querySelector('.fs-pane .next').innerHTML = !data.image ? "Séléctionner une photo" : "Terminer"
  fsPane.style.setProperty('--image', `url(${data.image})`)
  document.querySelector('.fs-pane .next').onclick = e => {
    if(!data.image) window.location.href = window.location.href.replace('//m.', '//www.')
    else putFsPane({finished: true})
  }
}

const getIDAndName = async () => {
  const url = window.location.href
  if(url.startsWith('https://m.facebook.com')){
    let found = undefined
    while(!found){
      await new Promise(ok => setTimeout(ok, 1000))
      found = document.querySelector("[data-sigil='cover-photo'] [href^='/photo.php?fbid=']")
    }
    putFsPane({
      id: Object.fromEntries(new URLSearchParams(found.href).entries()).id,
      name: document.querySelector('h3').firstChild.data,
      image: false
    })
  }
}

const getImage = () => {
  const href = window.location.href
  const isToph = href.indexOf('.com/photo/') > 0
  if(isToph || href.indexOf('.com/stories/') > 0){
    setTimeout(_ => {
      const found = document.querySelector(isToph ? 'img[data-visualcompletion]' : 'img[draggable="false"]')
      putFsPane({ image: found.src })
    }, 700)
  }
}

window.checkUrl = () => {
  console.log('wowo')
  putFsPane()
  getIDAndName()
  getImage()
  document.body.ondblclick = e => {
    console.log("Mais putain", e.target.tagName)
    if(['IMG', 'IMAGE'].includes(e.target.tagName.toUpperCase())){
      putFsPane({ image: e.target.src || e.target.getAttribute('xlink:href') })
    }
  }
  
}

const css = `
  .fs-pane{
    z-index: 10000000000;
    min-width: 230px;
    position: fixed;
    bottom: 1em;
    left: 1em;
    padding: 1em;
    border-radius: .5em;
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, .5);
    transition: .1s linear;
    opacity: .2;
    display: flex;
    gap: 1em;
  }
  .fs-pane-right{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }
  .fs-pane .options{
    display: flex;
    justify-content: flex-end;
    gap: .5em;
  }
  .fs-pane-right .next, .fs-pane-right .cancel{
    background: dodgerblue;
    border-radius: 5px;
    padding: .5em 1em;
    color: #fff;
    border: none;
    cursor: pointer;
    transform: scale(.95);
    transform-origin: 100% 50%;
    margin-top: .5em;
  }
  .fs-pane-right .cancel{
    background-color: #ff7575;
  }
  .fs-pane-right button:active{
    transform: scale(1);
  }
  .fs-pane:hover{
    opacity: 1;
  }
  .fs-pane:before{
    content: '';
    width: 5em;
    height: 5em;
    border-radius: .3em;
    background-color: #777;
    background-position: center;
    background-size: cover;
    background-image: var(--image);
  }
  .fs-pane .id{
    font-size: .7em;
  }
  .fs-pane span:empty:before{
    content: "Encore Indéfini";
  }
`