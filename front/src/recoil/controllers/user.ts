import * as Service from '../../services/backends/user'
import iDB from '../../services/iDB'
import { UserTypes } from '../../types'

export const getUsers = async (users = []) => {
  users = await iDB.users.get()
  return users
}

export const saveUser = async (user: any) => {
  user = await iDB.user.create(user)
  return user
}

export const removeUser = async (user: any) => {
  user = await iDB.user.delete(user)
  return user
}
