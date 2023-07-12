import Api from '../api'
import { reduceToId } from '../functions'

export const getCerts = async certs => {
  const res = await Api.get({
    url: '/cert/get',
    params: {ids: certs.map(reduceToId).join(',')},
  })
  return res.data
}

export const saveCert = async cert => {
  const res = await Api.post({
    url: '/cert/create_or_update',
    data: cert,
  })
  return res.data
}

export const removeCert = async cert => {
  const res = await Api.delete({
    url: '/cert/remove',
    params: {id: reduceToId(cert)},
  })
  return res.data
}
