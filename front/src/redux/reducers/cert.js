import { addOrReplace, removeFrom, } from '../../services/functions'
import {
  RESET,
  ADD_CERT, REMOVE_CERT
} from '../types'

const initialState = {
  certs: {},
  _certs: []
}

export default (state = initialState, action) => {
  let certs
  switch (action.type) {
    case ADD_CERT:
      certs = addOrReplace(state.certs, action.payload)
      return {
        ...state,
        certs, _certs: Object.values(certs)
      }

    case REMOVE_CERT:
      certs = removeFrom(state.certs, action.payload)
      return {
        ...state,
        certs, _certs: Object.values(certs)
      }

    case RESET:
      return initialState

    default:
      return state
  }
}