import { addOrReplace, removeFrom, } from '../../services/functions'
import {
  RESET,
  ADD_COPY, REMOVE_COPY
} from '../types'

const initialState = {
  copies: {},
  _copies: []
}

export default (state = initialState, action) => {
  let copies
  switch (action.type) {
    case ADD_COPY:
      copies = addOrReplace(state.copies, action.payload)
      return {
        ...state,
        copies,
        _copies: Object.values(copies)
      }

    case REMOVE_COPY:
      copies = removeFrom(state.copies, action.payload)
      return {
        ...state,
        copies,
        _copies: Object.values(copies)
      }

    case RESET:
      return initialState

    default:
      return state
  }
}