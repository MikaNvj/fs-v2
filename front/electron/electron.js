import { app, BrowserWindow, Menu } from "electron"
import path  from 'path'
import url from 'url'
import isDev from 'electron-is-dev'
import events from "./events"
import attachEvent from './services/attachEvent'
import reload from 'electron-reload'

reload(__dirname)

const App = {
  win: null,
  app
} 

export const start = () => {
  const createWindow = () => {
    buildMenu()
    const win = new BrowserWindow({
      icon:'./public/assets/icon.png',
      title: 'FiharySoft Manager',
      show: false,
      frame: false,
      minWidth: 950,
      minHeight: 600,
      webPreferences: {
        preload: __dirname + '/preload.js',
        nodeIntegration: true,
        contextIsolation: false,
        nativeWindowOpen: true
      }
    })
    win.loadURL(isDev ? "http://localhost:7548" : url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
    win.removeMenu()
    win.setMenuBarVisibility(false)
    win.once("ready-to-show", () => {
      win.maximize()
      win.show()
      if(isDev) setTimeout(_ => win.webContents.openDevTools(), 3000)
    })
    win.on("closed", () => (App.win = null))
    App.win = win
  }

  Object.keys(events).forEach(key => attachEvent(key, events[key], App))
  attachEvent('dev-panel', () => {
    App.win.webContents.openDevTools()
  })

  app.on("ready", createWindow);
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (!App.win) {
      createWindow();
    }
  })

}

start()

const buildMenu = () => {
  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(Menu.buildFromTemplate([]));
  } else {
    Menu.setApplicationMenu(null)
  }
}

export default App