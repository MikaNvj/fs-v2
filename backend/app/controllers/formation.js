import {
  saveEntity, removeEntity, getEntity
} from "../../services/utils"
import db from '../../data'

export const get = async ({ data, auth, files }) => {
  return await getEntity({ model: db.formation,  ...data  })
}

export const save = async ({ data, auth, files }) => {
  return await saveEntity({ model: db.formation, data })
}

export const remove = async ({ data, auth, files }) => {
  return await removeEntity({model: db.formation, id: data.id})
}