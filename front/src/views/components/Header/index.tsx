import React, { useState } from 'react'
import { useHistory, useLocation } from "react-router-dom"
import clsx from 'clsx'
import './Header.scss'
import TitleBarActions from '../TitleBarActions'
import { bulkSetter } from '../../../services/functions'
import PopupMoney from '../PopupMoney'
import { connect } from '../../../redux/store'
import bridge from '../../../services/bridge/index'
import UserSetting from '../UserSetting'
import { useAppContext } from '../../../services/provider'

const states = {
  active: 'connexion',
  money: false
}

const Header = (props: any) => {
  const state = bulkSetter(...useState({ ...states }))
  const { money, setMoney } = state
  const location = useLocation()
  const history = useHistory()
  const {connected} = useAppContext()

  return (
    <div className={clsx('Header')}>
      <img tabIndex={1} onDoubleClick={_ => bridge('dev-panel')} className="logo" src={require('../../../assets/images/fihary.png').default} alt="" />
      {
        connected && <div className={clsx("buttons")}>
          <div
            className={clsx("button", (location.pathname === '/' || !location.pathname) && 'active')}
            onClick={_ => history.push('/')}
          >
            <div className="hb-icon connexion" />
            <div className="hb-text">Connexion</div>
          </div>
          <div
            className={clsx("button", location.pathname === '/payments' && 'active')}
            onClick={_ => history.push('/payments')}
          >
            <div className="hb-icon others" />
            <div className="hb-text">
              <span className='mini'>Autres</span>
              <span>Payements</span>
            </div>
          </div>
          <div
            className={clsx("button", location.pathname === '/formations' && 'active')}
            onClick={_ => history.push('/formations')}
          >
            <div className="hb-icon formation" />
            <div className="hb-text">Formations</div>
          </div>
          {/* <div
            className={clsx("button", location.pathname === '/test' && 'active')}
            onClick={_ => history.push('/test')}
          >
            <div className="hb-icon dash" />
            <div className="hb-text">Dashboard</div>
          </div> */}
          <div className={clsx("button")} onClick={_ => setMoney(true)}>
            <div className="hb-icon money" />
            <div className="hb-text">Recettes</div>
          </div>
        </div>
      }

      <PopupMoney active={money} close={() => setMoney(false)}/>
      <div className='rightest-one'>
        { connected && <UserSetting/> }
        <TitleBarActions />
      </div>
    </div>
  )
}

// export default connect(Header)
export default Header