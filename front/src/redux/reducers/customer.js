import { addOrReplace, removeFrom, } from '../../services/functions'
import {
  RESET,
  ADD_CUSTOMER, REMOVE_CUSTOMER,
} from '../types'

const initialState = {
  customers: {},
  _customers: []
}

export default (state = initialState, action) => {
  let customers
  switch (action.type) {
    case ADD_CUSTOMER:
      customers = addOrReplace(state.customers, action.payload)
      return {
        ...state,
        customers,
        _customers: Object.values(customers)
      }

    case REMOVE_CUSTOMER:
      customers = removeFrom(state.customers, action.payload)
      return {
        ...state,
        customers,
        _customers: Object.values(customers)
      }

    case RESET:
      return initialState

    default:
      return state
  }
}