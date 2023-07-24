import React, { useState, useRef, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import './PopupMoney.scss'
import Input from '../Input'
import { addZero, bulkSetter, toAmount, toCamelCase } from '../../../services/functions'
// import Store, { connect } from '../../../redux/store'
import { useRecoilState, useRecoilValue } from 'recoil'
import { icomeState } from '../../../recoil/atoms/income'
import { selectedpayment } from '../../../recoil/atoms/payement'
import { Data, IncomeTypes } from '../../../types'

const states = {
  visible: false,
  password: '',
  isLogin: true
}
interface propsPopupMoney{
  active: boolean,
  close: () =>void,
}

const PopupMoney = (props: propsPopupMoney) => {
  const paymentselected = useRecoilValue(selectedpayment)
  // console.log('hazalah : ',customerselected({id: '21d847b4-d86c-4bbf-aad1-1876101b5571'}))
  const [_income, _setincome] = useRecoilState(icomeState)
  const state = bulkSetter(...useState({ ...states }))
  const { input, ...State } = state
  // const { active, close, income: { _incomes } } = props
  const { active, close, } = props

  // Methods
  const pmRef: any = useRef(null)

  useEffect(() => {
    active && pmRef.current && pmRef.current.focus()
  }, [active])

  const total = useMemo(() => {
    const today = `${new Date().getFullYear()}-${addZero(new Date().getMonth() + 1)}-${addZero(new Date().getDate())}`
    const incs: {[key: string]: number} = {}
    _income.forEach((one) => {
      const { date = "", paymentId } = one
      if (date.startsWith(today)) {
        // const { type, inactive, amount, rest } = Store.getCurrentState(`payment.payments.${paymentId}`) || {}
        const { type, inactive, amount, rest } = paymentselected({id: `${paymentId}`}) || {}
        if (type && !inactive) {
          if (!incs[type]) incs[type] = 0
          incs[type] += (amount as number) - rest
        }
      }
    })
    return incs
  }, [_income])

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
      setTimeout(() => {
        if (!document.activeElement?.closest('.PopupMoney')) {
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
// export default connect(PopupMoney, ['income'])
export default PopupMoney