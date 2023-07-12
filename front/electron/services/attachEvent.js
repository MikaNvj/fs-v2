import { ipcMain } from "electron"

export default (channel, handler, data) => {
  ipcMain.handle(channel, async (_, opts = {}) => {
    return await handler({...opts, ...data})
  })
}