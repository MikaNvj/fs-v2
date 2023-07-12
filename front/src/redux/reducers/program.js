import { addOrReplace, removeFrom, } from '../../services/functions'
import {
  RESET,
  ADD_PROGRAM, REMOVE_PROGRAM,
} from '../types'

const initialState = {
  programs: {},
  _programs: []
}

export default (state = initialState, action) => {
  let programs
  switch (action.type) {
    case ADD_PROGRAM:
      programs = addOrReplace(state.programs, action.payload)
      return {
        ...state,
        programs, _programs: Object.values(programs)
      }

    case REMOVE_PROGRAM:
      programs = removeFrom(state.programs, action.payload)
      return {
        ...state,
        programs, _programs: Object.values(programs)
      }

    case RESET:
      return initialState

    default:
      return state
  }
}