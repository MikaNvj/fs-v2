import React, { useEffect, useState } from 'react'
import { BrowserRouter } from "react-router-dom"
import { bulkSetter } from './services/functions'
import { AppContext } from './services/provider'
// import { connect } from './redux/store'
import Popup from './views/components/Popup'
import Router from './Router'
import './App.scss'
import Header from './views/components/Header'
import { useRecoilState, useRecoilValue } from 'recoil'
import { formationState } from './recoil/atoms/formation'
import { programState } from './recoil/atoms/program'
import Recoil from './services/iDB/Recoil'
import { payementState } from './recoil/atoms/payement'

import { customerState, selectedCustomer } from './recoil/atoms/customer'
import { authState } from './recoil/atoms/auth'

const states = {
  popup: { message: "" },
  connected: true
}

// function App(props) {
export default function App(){
  const global = bulkSetter(...useState(states))
  const [_f,_setf] = useRecoilState(payementState);
  const [_programrecoil, _setprogramrecoil] = useRecoilState(customerState);
  const [auth, setAuth] = useRecoilState(authState)
  
  useEffect(()=>{
    console.log('customerselected',_programrecoil)
  }, [_programrecoil])

  return (
    <AppContext.Provider value={global}>
      <BrowserRouter>
        <div className="App">
          <Recoil/>
          {/* <Header connected={global.connected} /> */}
          <Header />
          <Popup {...global.popup} />
          <div className="AppBody">
            {/* <Router connected={global.connected && props.auth.token} /> */}
            <Router connected={global.connected && auth.token} />
          </div>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

// export default connect(App, ['auth'])
// export default App
