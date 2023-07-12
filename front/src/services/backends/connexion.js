import Api from '../api'
import { reduceToId } from '../functions'

export const getConnexions = async connexions => {
  const res = await Api.get({
    url: '/connexion/get',
    params: {ids: connexions.map(reduceToId).join(',')},
  })
  return res.data
}

export const createOrUpdateConnexion = async connexion => {
  const res = await Api.post({
    url: '/connexion/create_or_update',
    data: connexion,
  })
  return res.data
}

export const removeConnexion = async connexion => {
  const res = await Api.delete({
    url: '/connexion/remove',
    params: {id: reduceToId(connexion)},
  })
  return res.data
}
