import * as Service from '../../services/backends/payment'
import iDB from '../../services/iDB'

export const getPayments = async (payments = []) => {
  payments = await Service.getPayments(payments)
  return payments
}

export const savePayment = async payment => {
  payment = await iDB.payment.save(payment)
  return payment
}

export const removePayment = async payment => {
  payment = await Service.removePayment(payment)
  return payment
}
