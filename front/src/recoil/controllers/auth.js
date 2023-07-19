import * as Service from '../../services/backends/auth'
import LocalData from '../../services/LocalData'
import bcrypt from "bcryptjs"
// import Store from '../store'
// import { RESET, SET_TOKEN, SET_USER } from '../types'
import sync from '../../services/iDB/sync'
import { triggerEvent } from '../../services/iDB/Recoil'
import { authObject } from '../../services/iDB/Recoil'

export const logout = () => {
  triggerEvent('logout')
}

export const signin = async (creds) => {

  const {user: {email, username}, token} = authObject

  const {login, password} = creds
  if(!token || ![email, username].includes(creds.login)){

    const { user, token } = await Service.signin(creds)
    
    triggerEvent('set-auth', {user, token})
    
    LocalData.passdata = bcrypt.hashSync(JSON.stringify({login, password}))
    LocalData.passlength = password.length
    sync.reconnect()
    return { user, token }
  }

  else{
    if([email, username].find(login => {
      return bcrypt.compareSync(JSON.stringify({login, password}), LocalData.passdata)
    // })) return Store.getCurrentState('auth')
    })) return authObject
    else throw "Not connected"
  }
}

export const check = () => async dispatch => {
  try{
    const { user } = await Service.check()
    
    // dispatch({ type: SET_USER, payload: user })
    triggerEvent('set-auth', {user, token: authObject.token})

    return { user }
  } catch(err){
    dispatch(logout())
  }
}