import db from '../../data'
import {
  saveEntity, removeEntity, getEntity
} from "../../services/utils"

export const get = async ({ data, auth, files }) => {
  return await getEntity({ model: db.connexion, ...data })
}

export const save = async ({ data, auth, files }) => {
  return await saveEntity({ model: db.connexion, data })
}

export const remove = async ({ data, auth, files }) => {
  return await removeEntity({ model: db.connexion, id: data.id })
}