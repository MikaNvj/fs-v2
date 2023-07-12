import React, { useState, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import './Login.scss'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { bulkSetter } from '../../../services/functions'
import Store, { connect } from '../../../redux/store'
import { useAppContext } from '../../../services/provider/index'
import { useMemo } from 'react'
import LocalData from '../../../services/LocalData'

const defState = {
  login: '',
  password: '',
  wait: false,
  error: ''
}

const Login = ({ signin }) => {
  const State = bulkSetter(...useState({ ...defState, login: Store.getCurrentState('auth.user.username') || '' }))
  const { setConnected } = useAppContext()
  const {
    input, password, login, setWait, wait,
    error, setError
  } = State

  // Effects
  useEffect(() => setError(''), [login, password])
  // setConnected(true)
  // Methods
  const logIn = React.useMemo(() => async () => {
    setWait(true)
    try {
      await signin({ password, login })
      setConnected(true)
    } catch (e) {
      setError("Verifiez vos credentials")
      setWait(false)
    }
  }, [State])

  const connectOnFly = useCallback(password => {
    if(LocalData.passlength === password.length){
      const { user: { email, username }, token } = Store.getCurrentState('auth')
      if (token && [email, username].includes(login)) {
        try {
          signin({ password, login }).then(_ => setConnected(true))
        } catch (e) { }
      }
    }
  })

  return (
    <div className={clsx('Login')}>
      <div className="container">
        <div className="title">Connexion</div>
        <Input
          autoComplete='off'
          {...input('login')}
          label="Identifiant"
          autoFocus = {!login}
        />
        <Input
          onKeyPress={e => e.code === 'Enter' && logIn()}
          onKeyUp={e => connectOnFly(e.target.value)}
          {...input('password')}
          type='password'
          label="Mot de passe"
          autoFocus = {!!login}
        />
        <Button onClick={logIn} waiting={wait} text="Se connecter" />
        <div className="error">
          {error}
        </div>
      </div>
      <div className="message">
        Ensemble pour tout innovations
      </div>
    </div>
  )
}
export default connect(Login, ['auth'])