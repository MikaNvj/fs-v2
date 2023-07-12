import Api from '../api'
import { reduceToId } from '../functions'

export const getFormations = async formations => {
  const res = await Api.get({
    url: '/formation/get',
    params: {ids: formations.map(reduceToId).join(',')},
  })
  return res.data
}

export const createOrUpdateFormation = async formation => {
  const res = await Api.post({
    url: '/formation/create_or_update',
    data: formation,
  })
  return res.data
}

export const removeFormation = async formation => {
  const res = await Api.delete({
    url: '/formation/remove',
    params: {id: reduceToId(formation)},
  })
  return res.data
}
