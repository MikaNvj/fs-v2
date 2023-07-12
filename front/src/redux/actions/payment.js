import * as Service from '../../services/backends/payment'
import iDB from '../../services/iDB'

import {
  ADD_PAYMENT, REMOVE_PAYMENT,
} from '../types'

export const getPayments = (payments = []) => async dispatch => {
  payments = await Service.getPayments(payments)
  dispatch({type: ADD_PAYMENT, payload: payments})
  return payments
}

export const savePayment = payment => async dispatch => {
  payment = await iDB.payment.save(payment)
  dispatch({type: ADD_PAYMENT, payload: [payment]})
  console.log({payment})

  return payment
}

export const removePayment = payment => async dispatch => {
  payment = await Service.removePayment(payment)
  dispatch({type: REMOVE_PAYMENT, payload: [payment]})
  return payment
}
