import sync from "./sync"
import { v4 } from 'uuid'
import DB, { getObject, getAll } from './db'

const create = (name) => ({
  get: async () => {
    return await getAll(name)
  },

  save: async (data) => {
    Object.assign(data, {
      id: data.id || v4(),
      _offline: 1,
      model: name
    })
    sync.persist(data)
    return data
  },

  remove: async (data) => {
    Object.assign(data, {
      id: data.id || v4(),
      inactive: true,
      _offline: 1, 
      model: name
    })
    sync.persist(data)
    return data
  }
})

export default new Proxy({}, {
  get(target, prop) {
    if (!(prop in target) && !prop.startsWith('$')) {
      DB.createTable(prop)
      target[prop] = create(prop)
    }
    return target[prop]
  }
})