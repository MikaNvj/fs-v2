import Api from '../api'
import { reduceToId } from '../functions'

export const getCustomers = async customers => {
  const res = await Api.get({
    url: '/customer/get',
    params: {ids: customers.map(reduceToId).join(',')},
  })
  return res.data
}

export const createOrUpdateCustomer = async customer => {
  const res = await Api.post({
    url: '/customer/create_or_update',
    data: customer,
  })
  return res.data
}

export const removeCustomer = async customer => {
  const res = await Api.delete({
    url: '/customer/remove',
    params: {id: reduceToId(customer)},
  })
  return res.data
}
