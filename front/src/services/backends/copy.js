import Api from '../api'
import { reduceToId } from '../functions'

export const getCopies = async copies => {
  const res = await Api.get({
    url: '/copy/get',
    params: {ids: copies.map(reduceToId).join(',')},
  })
  return res.data
}

export const saveCopy = async copy => {
  const res = await Api.post({
    url: '/copy/create_or_update',
    data: copy,
  })
  return res.data
}

export const removeCopy = async copy => {
  const res = await Api.delete({
    url: '/copy/remove',
    params: {id: reduceToId(copy)},
  })
  return res.data
}
