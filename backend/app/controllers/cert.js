import {
  saveEntity, removeEntity, getEntity
} from "../../services/utils"
import db from '../../data'

const duplicataProps = ['formationId']

export const get = async ({ data, auth, files }) => {
  return await getEntity({ model: db.cert,  ...data  })
}

export const save = async ({ data, auth, files }) => {
  return await saveEntity({ model: db.cert, data, duplicataProps })
}

export const remove = async ({ data, auth, files }) => {
  return await removeEntity({model: db.cert, id: data.id})
}