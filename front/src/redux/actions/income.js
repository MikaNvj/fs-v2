import iDB from '../../services/iDB'
import {
  ADD_INCOME, REMOVE_INCOME,
} from '../types'

export const getIncomes = (incomes = []) => async dispatch => {
  incomes = await iDB.income.get()
  dispatch({ type: ADD_INCOME, payload: incomes })
  return incomes
}

export const saveIncome = income => async dispatch => {
  income = await iDB.income.save(income)
  dispatch({ type: ADD_INCOME, payload: [income] })
  return income
}

export const removeIncome = income => async dispatch => {
  income = await iDB.income.delete(income)
  dispatch({ type: REMOVE_INCOME, payload: [income] })
  return income
}
