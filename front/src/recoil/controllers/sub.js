import * as Service from '../../services/backends/sub'
import iDB from '../../services/iDB'

export const getSubs = async (subs = []) => {
  subs = await Service.getSubs(subs)
  return subs
}

export const saveSub = async sub => {
  sub = await iDB.sub.save(sub)
  return sub
}

export const removeSub = async sub => {
  sub = await Service.removeSub(sub)
  return sub
}
