import * as Service from '../../services/backends/sub'
import iDB from '../../services/iDB'
import { SubTypes } from '../../types'

export const getSubs = async (subs = []) => {
  subs = await Service.getSubs(subs)
  return subs
}

export const saveSub = async (sub: any) => {
  sub = await iDB.sub.save(sub)
  return sub
}

export const removeSub = async (sub: any) => {
  sub = await Service.removeSub(sub)
  return sub
}
