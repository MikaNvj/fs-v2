import * as Service from '../../services/backends/copy'
import iDB from '../../services/iDB'
import { CopyTypes, Data } from '../../types'

export const getCopies = async (copies = []) => {
  copies = await Service.getCopies(copies)
  return copies
}

export const saveCopy = async (copy: any) => {
  copy = await iDB.copy.save(copy)
  return copy
}

export const removeCopy = async (copy: any) => {
  copy = await Service.removeCopy(copy)
  return copy
}
