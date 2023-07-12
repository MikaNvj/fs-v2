// Socket.IO
import http from 'http'
import socket from 'socket.io'
import * as Controllers from '../app/controllers'
import models from '../data/models'
import { uploadSaver, verifyTokenAsync } from '../services/utils'

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
const isUuid = str => typeof str === 'string' && str.match(uuidRegex)

export default (app) => {
  const server = http.createServer(app)
  const io = socket(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  // socket.io connection
  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      verifyTokenAsync(socket.handshake.query.token).then(data => {
        if (data) {
          Object.assign(socket, { auth: data })
          next()
        }
        else return next(new Error('Authentication error'))
      }).catch(err => next(new Error('Authentication error')))
    }
    else next(new Error('Authentication error'))
  }).on('connection', (socket) => {
    const ALIASES = {}
    let occupied = false
    socket.on('updates', async ({ data, from = new Date(), models: updateModels, sentFrom, aliases = {} }) => {
      while(occupied) await new Promise(ok => setTimeout(ok, 200))
      occupied = true
      Object.assign(ALIASES, aliases, { TIME: (aliases.TIME || 0) + (data.length ? 1 : 0) })
      const concernedModels = [], blacklist = ['user']

      // Models - List of Models to give BACK
      if (!updateModels || updateModels.length === 0) updateModels = Object.keys(models).filter(m => !blacklist.includes(m))
      else updateModels = Object.keys(models).filter(m => updateModels.includes(m))

      // Inserting NEWS in ALIASES
      data.forEach(content => {
        if (isUuid(content.id) && !ALIASES[content.id]) {
          ALIASES[content.id] = content
        }
      })

      // Function to UPDATE or INSERT
      const insert = async (entity) => {
        entity._inserted_ = true
        // Replacing UUIDs
        for (const key in entity) {
          const val = entity[key]
          if (isUuid(val) && ALIASES[val]) {
            if (!ALIASES[val]._time && key !== 'id') await insert(ALIASES[val])
            entity[key] = ALIASES[val].id
          }
        }

        const { id: __id, model, ...content } = entity

        // Saving DATA
        if (!isUuid(__id)) content.id = __id
        else if(!isUuid(ALIASES[__id].id)) content.id = ALIASES[__id].id
        try{
          if('birthdate' in content && !content.birthdate){
            content.birthdate = new Date()
          }
          let val = await Controllers[model].save({
            files: uploadSaver[model] && uploadSaver[model](content),
            data: content, auth: socket.auth
          })
  
          // Adding to ALIASES
          if (isUuid(__id)) {
            ALIASES[__id] = {
              id: val.id, model, __id,
              _time: ALIASES.TIME
            }
          }
        }
        catch(error){
          console.log({
            content, model,
            error
          })
        }
      }

      // INSERTING ALL DATA
      for (const key in data) {
        if (!concernedModels.includes(data[key].model)) concernedModels.push(data[key].model)
        if (!data[key]._inserted_) await insert(data[key])
      }

      // Full update
      const news = {}
      await Promise.all(updateModels.map(async key => {
        const data = await Controllers[key].get({ data: { from: new Date(from) } })
        news[key] = []
        Object.keys(data).forEach(key => news[key].push(...data[key]))
      }))

      // Remove oldest aliases
      Object.keys(ALIASES).forEach(id => {
        if(id !== 'TIME' && ALIASES[id]._time < ALIASES.TIME - 50) delete ALIASES[id]
      })

      socket.emit('updates', {
        aliases: ALIASES,
        news,
        from: Object.keys(news).reduce((max, key) => {
          const last = news[key].slice(-1)[0]
          return (last && max < last.updatedAt) ? last.updatedAt : max
        }, ''),
        sentFrom
      })
      if (concernedModels.length) socket.broadcast.emit('launch-updates', { models: concernedModels })
      occupied = false
    })
  })
  return server
}