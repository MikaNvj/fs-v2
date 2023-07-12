import fbSearch from "./fbSearch"
import fileServer from './fileServer'
import * as win from './win'

export default {
  fbSearch,
  'fileServer:start':  fileServer.start,
  'fileServer:stop': fileServer.stop,
  'server:port': async () => fileServer.server.port,
  ...win
}