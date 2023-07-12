import Api from '../api'
import { reduceToId } from '../functions'
import iDB from '../iDB'

export const getUsers = async users => {
  const res = await Api.get({
    url: '/user/get',
    params: {ids: users.map(reduceToId).join(',')},
  })
  return res.data
}

export const saveUser = async user => {
  const res = await Api.post({
    url: '/user/create_or_update',
    data: user,
  })
  return res.data
}

export const removeUser = async user => {
  const res = await Api.delete({
    url: '/user/remove',
    params: {id: reduceToId(user)},
  })
  return res.data
}
