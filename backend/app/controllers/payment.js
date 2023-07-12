import {
  saveEntity, removeEntity, getEntity
} from "../../services/utils"
import db from '../../data'

const duplicataProps = ['type', 'targetId', 'customerId']

export const get = async ({ data, auth, files }) => {
  return await getEntity({ model: db.payment,  ...data  })
}

export const save = async ({ data, auth, files }) => {
  return await saveEntity({ model: db.payment, data, duplicataProps })
}

export const remove = async ({ data, auth, files }) => {
  return await removeEntity({model: db.payment, id: data.id})
}