import iDB from '../../services/iDB'

import {
  ADD_FORMATION, REMOVE_FORMATION,
} from '../types'

export const getFormations = (formations = []) => async dispatch => {
  formations = await iDB.formation.get()
  dispatch({type: ADD_FORMATION, payload: formations})
  return formations
}

export const saveFormation = formation => async dispatch => {
  formation = await iDB.formation.save(formation)
  dispatch({type: ADD_FORMATION, payload: [formation]})
  return formation
}

export const removeFormation = formation => async dispatch => {
  formation = await iDB.formation.delete(formation)
  dispatch({type: REMOVE_FORMATION, payload: [formation]})
  return formation
}
