import {
  saveEntity, removeEntity, getEntity
} from "../../services/utils"
import db from '../../data'

export const get = async ({ data, auth, files }) => {
  if('password' in data) data.password = encryptPassword(data.password)
  return await getEntity({ model: db.user,  ...data  })
}

export const save = async ({ data, auth, files }) => {
  return await saveEntity({ model: db.user, data })
}

export const remove = async ({ data, auth, files }) => {
  return await removeEntity({model: db.user, id: data.id})
}