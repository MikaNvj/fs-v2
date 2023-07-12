import { addOrReplace, removeFrom } from '../../services/functions'
import {
  RESET,
  ADD_USER, REMOVE_USER,
} from '../types'

const initialState = {
  users: {},
  _users: []
}

export default (state = initialState, action) => {
  let users
  switch (action.type) {
    case ADD_USER:
      users = addOrReplace(state.users, action.payload)
      return {
        ...state,
        users, _users: Object.values(users)
      }

    case REMOVE_USER:
      users = removeFrom(state.users, action.payload)
      return {
        ...state,
        users, _users: Object.values(users)
      }

    case RESET:
      return initialState

    default:
      return state
  }
}