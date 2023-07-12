import * as Service from '../../services/backends/customer'
import iDB from '../../services/iDB'
import {
  ADD_CUSTOMER, REMOVE_CUSTOMER,
} from '../types'

export const getCustomers = (customers = []) => async dispatch => {
  customers = await Service.getCustomers(customers)
  dispatch({type: ADD_CUSTOMER, payload: customers})
  return customers
}

export const saveCustomer = customer => async dispatch => {
  customer = await iDB.customer.save(customer)
  dispatch({type: ADD_CUSTOMER, payload: [customer]})
  return customer
}

export const removeCustomer = customer => async dispatch => {
  customer = await Service.removeCustomer(customer)
  dispatch({type: REMOVE_CUSTOMER, payload: [customer]})
  return customer
}
