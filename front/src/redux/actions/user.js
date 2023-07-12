import * as Service from '../../services/backends/user'
import iDB from '../../services/iDB'
import {
  ADD_USER, REMOVE_USER,
} from '../types'

export const getUsers = (users = []) => async dispatch => {
  users = await iDB.users.get()
  dispatch({type: ADD_USER, payload: users})
  return users
}

export const saveUser = user => async dispatch => {
  user = await iDB.user.create(user)
  dispatch({type: ADD_USER, payload: [user]})
  return user
}

export const removeUser = user => async dispatch => {
  user = await iDB.user.delete(user)
  dispatch({type: REMOVE_USER, payload: [user]})
  return user
}
