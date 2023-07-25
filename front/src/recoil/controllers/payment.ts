import * as Service from '../../services/backends/payment'
import iDB from '../../services/iDB'
import { PaymentTypes } from '../../types'


export const getPayments = async (payments = []) => {
  payments = await Service.getPayments(payments)
  return payments
}

export const savePayment = async (payment: any) => {
  payment = await iDB.payment.save(payment)
  return payment
}

export const removePayment = async (payment: any) => {
  payment = await Service.removePayment(payment)
  return payment
}
