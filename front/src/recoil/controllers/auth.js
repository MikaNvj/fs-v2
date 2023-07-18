// import * as Service from '../../services/backends/auth'
// import LocalData from '../../services/LocalData'
// import bcrypt from "bcryptjs"
// import Store from '../store'
// import { RESET, SET_TOKEN, SET_USER } from '../types'
// import sync from '../../services/iDB/sync'

// export const logout = () => async dispatch => {
//   dispatch({ type: SET_TOKEN, payload: null })
//   //dispatch({ type: RESET })
// }

// export const signin = (creds) => async dispatch => {
//   const {user: {email, username}, token} = Store.getCurrentState('auth')
//   const {login, password} = creds
//   if(!token || ![email, username].includes(creds.login)){
//     const { user, token } = await Service.signin(creds)
//     dispatch({ type: SET_USER, payload: user })
//     dispatch({ type: SET_TOKEN, payload: token })
//     LocalData.passdata = bcrypt.hashSync(JSON.stringify({login, password}))
//     LocalData.passlength = password.length
//     sync.reconnect()
//     return { user, token }
//   }
//   else{
//     if([email, username].find(login => {
//       return bcrypt.compareSync(JSON.stringify({login, password}), LocalData.passdata)
//     })) return Store.getCurrentState('auth')
//     else throw "Not connected"
//   }
// }

// export const check = () => async dispatch => {
//   try{
//     const { user } = await Service.check()
//     dispatch({ type: SET_USER, payload: user })
//     return { user }
//   } catch(err){
//     dispatch(logout())
//   }
// }

console.log('auth vide')