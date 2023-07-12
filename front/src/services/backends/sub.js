import Api from '../api'
import { reduceToId } from '../functions'

export const getSubs = async subs => {
  const res = await Api.get({
    url: '/sub/get',
    params: {ids: subs.map(reduceToId).join(',')},
  })
  return res.data
}

export const saveSub = async sub => {
  const res = await Api.post({
    url: '/sub/create_or_update',
    data: sub,
  })
  return res.data
}

export const removeSub = async sub => {
  const res = await Api.delete({
    url: '/sub/remove',
    params: {id: reduceToId(sub)},
  })
  return res.data
}
