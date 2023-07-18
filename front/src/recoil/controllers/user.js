import * as Service from '../../services/backends/user'
import iDB from '../../services/iDB'

export const getUsers = async (users = []) => {
  users = await iDB.users.get()
  return users
}

export const saveUser = async user => {
  user = await iDB.user.create(user)
  return user
}

export const removeUser = async user => {
  user = await iDB.user.delete(user)
  return user
}
