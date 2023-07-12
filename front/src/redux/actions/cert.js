import * as Service from '../../services/backends/cert'
import iDB from '../../services/iDB'
import { ADD_CERT, REMOVE_CERT } from '../types'

export const getCerts = (certs = []) => async dispatch => {
  certs = await iDB.cert.get()
  dispatch({type: ADD_CERT, payload: certs})
  return certs
}

export const saveCert = cert => async dispatch => {
  cert = await iDB.cert.save(cert)
  dispatch({type: ADD_CERT, payload: [cert]})
  return cert
}

export const removeCert = cert => async dispatch => {
  cert = await Service.removeCert(cert)
  dispatch({type: REMOVE_CERT, payload: [cert]})
  return cert
}
