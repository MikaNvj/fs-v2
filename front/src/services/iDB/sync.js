import io from 'socket.io-client'
import { baseUrl } from '../api'
import LocalData from '../LocalData'
import DB from './db'
import * as Types from '../../redux/types/index'
import Store from '../../redux/store'

class Sync {
  constructor() {
    if (!LocalData.from) LocalData.from = new Date(0)
    this.socket = null
    this.bucket = LocalData.bucket || []
    this.aliases = LocalData.aliases || {}
    setTimeout(this.start, 1000)
  }

  start = async () => {
    this.updateRedux()
    const socket = io(baseUrl, {
      query: { token: Store.getCurrentState('auth.token') },
      timeout: 5000
    })
    this.socket = socket
    socket.on('updates', async ({ aliases, news, from }) => {
      LocalData.aliases = Object.assign(this.aliases, aliases)
      await DB.updateDatabase(news, aliases)
      await this.updateRedux(news, aliases)
      if (from) {
        LocalData.from = from
      }
    })

    socket.on('launch-updates', ({ models }) => this.updateOnline({ models, force: true }))
    socket.on("connect", _ => {
      this.updateOnline({ force: true })
    })
    socket.on("reconnect", () => this.updateOnline({ force: true }))
    socket.on("connect_error", () => socket.io.opts.query.token = Store.getCurrentState('auth.token'))
    socket.on('reconnect_attempt', () => { })
    socket.on("disconnect", () => { })
  }

  reconnect = () => {
    const { socket } = this
    socket.io.opts.query.token = Store.getCurrentState('auth.token')
    socket.disconnect()
    socket.connect()
  }

  persist = async (objs) => {
    objs = Array.isArray(objs) ? objs : [objs]
    if (objs.length) {
      await Promise.all(objs.map(async (obj) => {
        const { model, ...val } = obj
        model && await DB.save(model, val)
      }))
      this.updateOnline()
    }
  }

  updateOnline = async ({ models, force } = {}) => {
    const { socket } = this
    if(!this.updateOnline.occupied){
      this.updateOnline.occupied = true
      await new Promise(ok => setTimeout(ok, 200))
      this.updateOnline.occupied = false
      const data = await DB.getAllNews()
      console.log('data to send', data.length, data)
      if (socket && socket.connected && (force || data.length)) {
        socket.emit('updates', {
          data,
          models,
          from: LocalData.from,
          aliases: this.aliases
        })
      }
    }
  }

  updateRedux = async (news, aliases = {}) => {
    const models = news ? Object.keys(news) : await DB.dbTables()
    models.forEach(async model => {
      const type = 'ADD_' + model.toUpperCase()
      if (Types[type]) {
        const als = Object.values(aliases).filter(({ model: m }) => m === model).map(({ id, __id }) => ({ id, __id }))
        if (als.length) {
          Store.dispatch({ type, payload: als })
        }
        if (!news || (news[model] && news[model].length)) {
          Store.dispatch({ type, payload: news ? news[model] : await DB.getAll(model) })
        }
      }
    })
  }
}

export default new Sync()