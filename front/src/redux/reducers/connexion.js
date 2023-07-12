import { addOrReplace, removeFrom, } from '../../services/functions'
import {
  RESET,
  ADD_CONNEXION, REMOVE_CONNEXION,
} from '../types'

const initialState = {
  connexions: {},
  _connexions: []
}

export default (state = initialState, action) => {
  let connexions
  switch (action.type) {
    case ADD_CONNEXION:
      connexions = addOrReplace(state.connexions, action.payload)
      return {
        ...state,
        connexions,
        _connexions: Object.values(connexions)
      }

    case REMOVE_CONNEXION:
      connexions = removeFrom(state.connexions, action.payload)
      return {
        ...state,
        connexions,
        _connexions: Object.values(connexions)
      }

    case RESET:
      return initialState

    default:
      return state
  }
}