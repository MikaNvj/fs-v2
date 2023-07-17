import React, { useEffect, useState } from 'react'
import { BrowserRouter } from "react-router-dom"
import { bulkSetter } from './services/functions'
import { AppContext } from './services/provider'
import { connect } from './redux/store'
import Popup from './views/components/Popup'
import Router from './Router'
import './App.scss'
import Header from './views/components/Header'
import Recoil from './services/iDB/Recoil'
import { useRecoilState } from 'recoil'
import { formationState } from './recoil/atoms/formation'
import { programState } from './recoil/atoms/program'
const states = {
  popup: { message: "" },
  connected: true
}

function App(props) {
  const global = bulkSetter(...useState(states))
  const [_f,_setf] = useRecoilState(formationState);
  const [_programrecoil, _setprogramrecoil] = useRecoilState(programState);
  useEffect(()=>{
    console.log(_f)
  }, [_f])
  return (
    <AppContext.Provider value={global}>
      <BrowserRouter>
        <div className="App">
          <Header connected={global.connected} />
          {/* <Recoil/> */}
          <Popup {...global.popup} />
          <div className="AppBody">
            <Router connected={global.connected && props.auth.token} />
          </div>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default connect(App, ['auth'])
