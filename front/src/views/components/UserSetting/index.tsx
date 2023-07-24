import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import './UserSetting.scss'
import {connect} from '../../../redux/store/index'
import { get } from '../../../services/functions'
import { useAppContext } from '../../../services/provider'

const UserSetting = (props: any) => {
  const { logout } = props
  const {setConnected} = useAppContext()
  return (
    <div tabIndex={1} className={clsx('UserSetting')}>
      <div className="us-button"></div>
      <div className="us-content">
        <div className="us-item user">{ get(props, 'auth.user.username') }</div>
        <div onClick={_ => setConnected(false)} className="us-item">Se deconnecter</div>
      </div>
    </div>
  )
}

// export default connect(UserSetting, ['auth'])
export default UserSetting