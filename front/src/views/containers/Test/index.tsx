import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import './Test.scss'
import { bulkSetter } from '../../../services/functions'

const states = {
  name: '',
  password: '',
  disabled: true
}

const Test = () => {

  const state = bulkSetter(...useState(states))
  useEffect(() => {
    state.setName((parseInt(state.password) || 0) / 2)

  }, [state.password])

  useEffect(() => {
    state.setPassword((parseInt(state.name) || 0) * 2)
  }, [state.name])
  return (
    <div className={clsx('Test')}>
      <input value={state.name} onChange={e => state.setName(e.target.value)} />
      <input value={state.password} onChange={e => state.setPassword(e.target.value)} />
      <span>{ }</span>
      <button disabled={state.disabled}>coucou</button>
    </div>
  )
}
export default Test