import * as Service from '../../services/backends/copy'
import iDB from '../../services/iDB'
import { ADD_COPY, REMOVE_COPY } from '../types'

export const getCopies = (copies = []) => async dispatch => {
  copies = await Service.getCopies(copies)
  dispatch({type: ADD_COPY, payload: copies})
  return copies
}

export const saveCopy = copy => async dispatch => {
  copy = await iDB.copy.save(copy)
  dispatch({type: ADD_COPY, payload: [copy]})
  return copy
}

export const removeCopy = copy => async dispatch => {
  copy = await Service.removeCopy(copy)
  dispatch({type: REMOVE_COPY, payload: [copy]})
  return copy
}
