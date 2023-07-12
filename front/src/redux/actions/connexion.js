import * as Service from '../../services/backends/connexion'
import iDB from '../../services/iDB'
import {
  ADD_CONNEXION, REMOVE_CONNEXION,
} from '../types'

export const getConnexions = (connexions = []) => async dispatch => {
  connexions = await iDB.connexion.get()
  dispatch({ type: ADD_CONNEXION, payload: connexions })
  return connexions
}

export const saveConnexion = connexion => async dispatch => {
  connexion = await iDB.connexion.save(connexion)
  dispatch({ type: ADD_CONNEXION, payload: [connexion] })
  console.log({connexion})
  return connexion
}

export const removeConnexion = connexion => async dispatch => {
  connexion = await iDB.connexion.delete(connexion)
  dispatch({ type: REMOVE_CONNEXION, payload: [connexion] })
  return connexion
}
