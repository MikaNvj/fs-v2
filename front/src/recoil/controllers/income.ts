import iDB from '../../services/iDB'
import { Data, IncomeTypes } from '../../types'

export const getIncomes = async (incomes = []) => {
  incomes = await iDB.income.get()
  return incomes
}

export const saveIncome = async (income: any) => {
  income = await iDB.income.save(income)
  return income
}

export const removeIncome = async (income: any) => {
  income = await iDB.income.delete(income)
  return income
}
