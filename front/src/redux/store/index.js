import reducers from "../reducers"
import thunk from "redux-thunk"
import * as redux from 'redux'
import * as reactRedux from "react-redux"
import * as reduxPersist from 'redux-persist'
import storage from "redux-persist/lib/storage"
import { PersistGate } from "redux-persist/integration/react"
import connector from './connector'
import API from "../../services/api"
import { get } from "../../services/functions"

const Store = ((__storage__) => {
  const mystore = {}
  mystore.store = redux.createStore(
    redux.combineReducers({
      ...reducers,
      auth: reduxPersist.persistReducer({ key: "auth", storage: __storage__, blacklist: [] }, reducers.auth)
    }),
    redux.applyMiddleware(thunk)
  )
  mystore.dispatch = mystore.store.dispatch
  mystore.persistor = reduxPersist.persistStore(mystore.store)
  mystore.getCurrentState = (item) => {
    const state = mystore.store.getState();
    return get(state, item);  
  }

  API.setToken(_ => mystore.getCurrentState("auth.token"))
  
  mystore.StoreProvider = ({ children, loading: Loader }) => {
    const {store, persistor} = mystore
    return (
      <reactRedux.Provider Provider store={store}>
        <PersistGate persistor={persistor} loading={Loader ? <Loader /> : null}>
          { children }
        </PersistGate>
      </reactRedux.Provider>
    );
  }
  return mystore
})(storage)

export default Store
export const connect = connector