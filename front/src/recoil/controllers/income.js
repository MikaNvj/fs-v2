import iDB from '../../services/iDB'

export const getIncomes = async (incomes = []) => {
  incomes = await iDB.income.get()
  return incomes
}

export const saveIncome = async income => {
  income = await iDB.income.save(income)
  return income
}

export const removeIncome = async income => {
  income = await iDB.income.delete(income)
  return income
}
