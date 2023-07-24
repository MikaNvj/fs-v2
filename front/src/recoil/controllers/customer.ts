import * as Service from '../../services/backends/customer'
import iDB from '../../services/iDB'
import { CustomerTypes, Data } from '../../types'

export const getCustomers = async (customers = []) => {
  customers = await Service.getCustomers(customers)
  return customers
}

export const saveCustomer = async (customer: any) => {
  customer = await iDB.customer.save(customer)
  return customer
}

export const removeCustomer = async (customer: any) =>{
  customer = await Service.removeCustomer(customer)
  return customer
}
