import { addOrReplace, removeFrom, } from '../../services/functions'
import {
  RESET,
  ADD_FORMATION, REMOVE_FORMATION,
} from '../types'

const initialState = {
  formations: {},
  _formations: []
}

export default (state = initialState, action) => {
  let formations
  switch (action.type) {
    case ADD_FORMATION:
      formations = addOrReplace(state.formations, action.payload)
      return {
        ...state,
        formations,
        _formations: Object.values(formations)
      }

    case REMOVE_FORMATION:
      formations = removeFrom(state.formations, action.payload)
      return {
        ...state,
        formations,
        _formations: Object.values(formations)
      }

    case RESET:
      return initialState

    default:
      return state
  }
}