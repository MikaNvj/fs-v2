export default async (channel, ...params) => {
  if(window.ipcRenderer) return await window.ipcRenderer.invoke(channel, ...params)
}

export const attach = (channel, listener) => {
  if(window.ipcRenderer) window.ipcRenderer.on(channel, listener)
}

export const detach = (channel, listener) => {
  if(listener){
    if(window.ipcRenderer) window.ipcRenderer.removeListener(channel, listener)
  }
  else if(window.ipcRenderer) window.ipcRenderer.removeAllListeners(channel)
}