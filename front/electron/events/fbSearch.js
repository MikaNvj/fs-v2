const { BrowserWindow } = require('electron')
import attachEvent from '../services/attachEvent'

const FB = { fbData: {} }

export default ({win, name, id}) => new Promise((ok, ko) => {
  let child = FB.child
  FB.ok = ok
  if(!child){
    child = FB.child = new BrowserWindow({
      parent: win, modal: true, show: false,
      minimizable: false, maximizable : false,
      webPreferences: {
        preload: __dirname + '/../fb-preload.js',
        contextIsolation: false,
        nativeWindowOpen: true
      }
    })
    child.setMenuBarVisibility(false)
    child.webContents.on('did-navigate-in-page', (evt, url) => {
      child.webContents.executeJavaScript(`window.checkUrl()`)
    })
    attachEvent('setFbData', toAdd => {
      Object.assign(FB.fbData, toAdd)
      if(toAdd.canceled){
        FB.child.hide()
        FB.ok({})
      }
      if(toAdd.finished){
        FB.child.hide()
        FB.ok(FB.fbData)
      }
      else return FB.fbData
    })
    child.on('close', e => {
      e.preventDefault()
      FB.child.hide()
      FB.ok({})
    })
    child.once('ready-to-show', () => {
      child.show()
    })
  }
  else child.show()
  

  // deleting Facebook data
  for (let key in FB.fbData) delete FB.fbData[key]
  if(id) child.loadURL(`https://web.facebook.com/profile.php?id=${id}`)
  else child.loadURL(`https://m.facebook.com/search/people/?q=${name || 'client'}`)
})