import * as Service from '../../services/backends/sub'
import iDB from '../../services/iDB'
import { ADD_SUB, REMOVE_SUB } from '../types'

export const getSubs = (subs = []) => async dispatch => {
  subs = await Service.getSubs(subs)
  dispatch({type: ADD_SUB, payload: subs})
  return subs
}

export const saveSub = sub => async dispatch => {
  sub = await iDB.sub.save(sub)
  dispatch({type: ADD_SUB, payload: [sub]})
  return sub
}

export const removeSub = sub => async dispatch => {
  sub = await Service.removeSub(sub)
  dispatch({type: REMOVE_SUB, payload: [sub]})
  return sub
}
