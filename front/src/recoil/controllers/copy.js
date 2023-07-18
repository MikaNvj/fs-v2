import * as Service from '../../services/backends/copy'
import iDB from '../../services/iDB'

export const getCopies = async (copies = []) => {
  copies = await Service.getCopies(copies)
  return copies
}

export const saveCopy = async copy => {
  copy = await iDB.copy.save(copy)
  return copy
}

export const removeCopy = async copy => {
  copy = await Service.removeCopy(copy)
  return copy
}
