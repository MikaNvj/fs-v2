import {
  saveEntity, removeEntity, getEntity
} from "../../services/utils"
import db from '../../data'
const cfiles = {
  photo: {
    folder: 'images'
  }
}

export const files = cfiles

export const get = async ({ data, auth, files }) => {
  return await getEntity({ model: db.customer, ...data })
}

export const save = async ({ data, auth, files }) => {
  return await saveEntity({ model: db.customer, data, files, auth, cfiles })
}

export const remove = async ({ data, auth, files }) => {
  return await removeEntity({model: db.customer, id: data.id})
}