import React, { useState, useRef, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import './PopupMoney.scss'
import Input from '../Input'
import { addZero, bulkSetter, toAmount, toCamelCase } from '../../../services/functions'
import Store, { connect } from '../../../redux/store'

const states = {
  visible: false,
  password: '',
  isLogin: true
}

const PopupMoney = (props) => {
  const state = bulkSetter(...useState({ ...states }))
  const { input, ...State } = state
  const { active, close, income: { _incomes } } = props

  // Methods
  const pmRef = useRef(null)

  useEffect(() => {
    active && pmRef.current && pmRef.current.focus()
  }, [active])

  const total = useMemo(() => {
    const today = `${new Date().getFullYear()}-${addZero(new Date().getMonth() + 1)}-${addZero(new Date().getDate())}`
    const incs = {}
    _incomes.forEach((one) => {
      const { date = "", paymentId } = one
      if (date.startsWith(today)) {
        const { type, inactive, amount, rest } = Store.getCurrentState(`payment.payments.${paymentId}`) || {}
        if (type && !inactive) {
          if (!incs[type]) incs[type] = 0
          incs[type] += amount - rest
        }
      }
    })
    return incs
  }, [_incomes])

  useEffect(() => {
    if (state.password === 'rojo') {
      pmRef.current.closest('.PopupMoney').focus()
      state.set({
        isLogin: false,
        password: ''
      })
    }
  }, [state.password])

  return (
    <div onBlur={e => {
      setTimeout(_ => {
        if (!document.activeElement.closest('.PopupMoney')) {
          state.setIsLogin(true)
          close()
        }
      }, 250)
    }} tabIndex={1} className={clsx('PopupMoney', active && 'active')}>
      {
        state.isLogin ?
          <div>
            <Input
              type='password' outline='none' alwaysActive className="popup-form"
              {...input('password')} label="Mot de passe" iref={pmRef}
            />
          </div>
          :
          <div className="popup-money">
            <span style={{ fontSize: '.7em' }}>Recette du jour</span>
            <div className="amount">
              {
                Object.keys(total).map(key => {
                  return <div className="item" key={key}>
                    <span className="title">{toCamelCase(key.toLocaleLowerCase())}</span>
                    <span className="value">{toAmount(total[key])}</span>
                  </div>
                })
              }
            </div>
          </div>
      }
    </div>
  )
}
export default connect(PopupMoney, ['income'])