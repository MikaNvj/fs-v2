import { addOrReplace, removeFrom, } from '../../services/functions'
import {
  RESET,
  ADD_SUB, REMOVE_SUB
} from '../types'

const initialState = {
  subs: {},
  _subs: []
}

export default (state = initialState, action) => {
  let subs
  switch (action.type) {
    case ADD_SUB:
      subs = addOrReplace(state.subs, action.payload)
      return {
        ...state,
        subs, _subs: Object.values(subs)
      }

    case REMOVE_SUB:
      subs = removeFrom(state.subs, action.payload)
      return {
        ...state,
        subs, _subs: Object.values(subs)
      }

    case RESET:
      return initialState

    default:
      return state
  }
}