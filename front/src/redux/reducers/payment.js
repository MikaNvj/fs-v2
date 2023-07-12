import { addOrReplace, removeFrom, } from '../../services/functions'
import {
  RESET,
  ADD_PAYMENT, REMOVE_PAYMENT,
} from '../types'

const initialState = {
  payments: {},
  _payments: []
}

export default (state = initialState, action) => {
  let payments
  switch (action.type) {
    case ADD_PAYMENT:
      payments = addOrReplace(state.payments, action.payload)
      return {
        ...state,
        payments, _payments: Object.values(payments)
      }

    case REMOVE_PAYMENT:
      payments = removeFrom(state.payments, action.payload)
      return {
        ...state,
        payments, _payments: Object.values(payments)
      }

    case RESET:
      return initialState

    default:
      return state
  }
}