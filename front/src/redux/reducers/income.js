import { addOrReplace, removeFrom, } from '../../services/functions'
import {
  RESET,
  ADD_INCOME, REMOVE_INCOME,
} from '../types'

const initialState = {
  incomes: {},
  _incomes: []
}

export default (state = initialState, action) => {
  let incomes
  switch (action.type) {
    case ADD_INCOME:
      incomes = addOrReplace(state.incomes, action.payload)
      return {
        ...state,
        incomes, _incomes: Object.values(incomes)
      }

    case REMOVE_INCOME:
      incomes = removeFrom(state.incomes, action.payload)
      return {
        ...state,
        incomes, _incomes: Object.values(incomes)
      }

    case RESET:
      return initialState

    default:
      return state
  }
}