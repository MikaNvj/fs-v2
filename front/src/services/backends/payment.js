import Api from '../api'
import { reduceToId } from '../functions'

export const getPayments = async payments => {
  const res = await Api.get({
    url: '/payment/get',
    params: {ids: payments.map(reduceToId).join(',')},
  })
  return res.data
}

export const savePayment = async payment => {
  const res = await Api.post({
    url: '/payment/create_or_update',
    data: payment,
  })
  return res.data
}

export const removePayment = async payment => {
  const res = await Api.delete({
    url: '/payment/remove',
    params: {id: reduceToId(payment)},
  })
  return res.data
}
