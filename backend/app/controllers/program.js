import {
  saveEntity, removeEntity, getEntity
} from "../../services/utils"
import db from '../../data'

export const get = async ({ data, auth, files }) => {
  return await getEntity({ model: db.program,  ...data  })
}

export const save = async ({ data, auth, files }) => {
  if(!data.place) data.place = 0
  return await saveEntity({ model: db.program, data })
}

export const remove = async ({ data, auth, files }) => {
  return await removeEntity({model: db.program, id: data.id})
}