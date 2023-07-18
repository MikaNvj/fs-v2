import * as Service from '../../services/backends/customer'
import iDB from '../../services/iDB'

export const getCustomers = async (customers = []) => {
  customers = await Service.getCustomers(customers)
  return customers
}

export const saveCustomer = async customer => {
  customer = await iDB.customer.save(customer)
  return customer
}

export const removeCustomer = async customer =>{
  customer = await Service.removeCustomer(customer)
  return customer
}
