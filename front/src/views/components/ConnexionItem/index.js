import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  bulkSetter, determinerPrix, extractNews,
  toPhone, toSimpleDate, toSQLDate
} from '../../../services/functions'

import clsx from 'clsx'
import './ConnexionItem.scss'
import Hour from '../Hour'
import { Server } from '../../../services/api'
import {toAmount} from '../../../services/functions/index'
import {connect} from '../../../redux/store/index'

import {useRecoilState} from "recoil";
import { payementState } from '../../../recoil/atoms/payement';

const Times = {
  add: (date, min) => {
    const d = new Date(date)
    d.setTime(d.getTime() + 1000 * 60 * min)
    return d
  },
  reduce: (date, min) => {
    const d = new Date(date)
    d.setTime(d.getTime() - 1000 * 60 * min)
    return d
  },
  duration: (d1, d2) => {
    if (!d1 || !d2) return 0
    return Math.abs(new Date(d1).getTime() - new Date(d2).getTime()) / (1000 * 60)
  }
}


const ConnexionItem = (props) => {

  const durRef = useRef('')
  const {
    value, customer, paymnt, saveIncome, showUser,
    saveConnexion, savePayment, setChosenPayment,
    payment:{_payments: payments}
  } = props
  
  const {
    facebook, lastname, firstname,
    sex, photo, phone, id
  } = customer || {}


  const state = bulkSetter(...useState({
      start: value.start && new Date(value.start),
      stop: paymnt.amount ? value.stop && new Date(value.stop) : null
  }))
  const [rest, setRest] = useState(null)
  const [canceled, setCanceled] = useState(false)

  useEffect(() => {
    let {start, stop} = value
    state.set({
      start: start && new Date(start),
      stop: stop && new Date(stop)
    })
  }, [toSQLDate(value.start), toSQLDate(value.stop)])

  useEffect(() => {
    const {start, stop} = state
    let price = paymnt.amount
    if (start && stop) {
      let prixExact = determinerPrix(new Date(start), new Date(stop))
      price = Math.round(prixExact / 100) * 100
    }
    else price = 0

    if((start && !value.start) || (stop && !value.stop) || (stop && start)){
      const extra = extractNews({ start, stop }, value)
      if (extra) {
        saveConnexion({
          ...value,
          start: start && start.toISOString(),
          stop: stop && stop.toISOString()
        })
      }
    }
    if (paymnt.amount !== price) {
      savePayment({ ...paymnt, amount: price })
    }
  }, [state.start, state.stop])

  useEffect(_ => {
    let tmt
    if (canceled) tmt = setTimeout(_ => setCanceled(false), 3500)
    return _ => clearTimeout(tmt)
  }, [canceled])

  const debt = useMemo(() => {
    return customer ? !!payments.find(({ customerId, rest }) => customerId === customer.id && rest) : false
  }, [customer, payments])

  return (
    <div onClick={_ => console.log(paymnt)} className={clsx('ConnexionItem')}>
      
      <div className={clsx("cx-customer", sex)}
        style={photo ? { backgroundImage: `url(${Server.imageUrl(photo)})` } : {}}
      >
        <div
          className={clsx("canceler", !customer && 'set-customer', canceled && 'active white')}
          onClick={_ => {
            if(!paymnt.customerId) setChosenPayment(paymnt)
            else if (!canceled) setCanceled(true)
            else savePayment({ ...paymnt, inactive: true })
          }}
        />
      </div>
      {
          customer ? <div onDoubleClick={showUser} className={clsx("customer-name", debt && 'debt')}>
              <span className='lastname'>{lastname}</span>
              <span>{firstname}</span>
              <span className='phone'>{toPhone(phone)}</span>
          </div> : <div onClick={e => {
            const cl = e.target.closest('.customer-name').classList
            if(cl.contains('act')){
              savePayment({ ...paymnt, inactive: true })
            }
            else {
              cl.add('act')
              setTimeout(_ => cl.remove('act'), 2500)
            }
          }} className="customer-name">
            <span className='cancel'>Supprimer</span>
          </div>
      }
      <Hour className='start' value={state.start} onChange={state.setStart} />
      <Hour value={state.stop} onChange={state.setStop} />
      <input
        className="duration"
        readOnly={!(state.start || state.stop)}
        type="text"
        placeholder="durée"
        value={Times.duration(state.start, state.stop) || ''}
        onFocus={_ => {
          durRef.current = state.start ? 'stop' : 'start'
        }}
        onChange={e => {
          const duration = parseInt(e.target.value) || 0
          const { set, start, stop } = state
          if (durRef.current === 'start') set({ start: duration ? Times.reduce(stop, duration) : null })
          else set({ stop: duration ? Times.add(start, duration) : null })
        }}
      />
      <input
        className="price"
        type="text"
        readOnly
        value={paymnt.amount || ''}
        onChange={e => state.setPrice(parseInt(e.target.value) || 0)}
        placeholder="prix"
      />
      <div className='rest-parent'>
      {!!rest && <span className='rest-message'>
        {
          rest > 0 ? "Il nous doit" : "On lui doit"
        }
        { " " + toAmount(Math.abs(rest)) }
      </span>}
      {
        (!!paymnt.amount && rest !== null) && <input
          className="rest"
          onDoubleClick={_ => setRest(null)}
          type="text"
          value={rest || ''}
          onChange={e => {
            const val = parseInt(e.target.value) || 0
            setRest(e.target.value.lastIndexOf('-') > 0 ? -val : val)
          }}
          placeholder="reste"
        />
      }
      </div>
      {!!paymnt.amount && <div onClick={_ => {
        if (rest === null) setRest(0)
        else {
          saveIncome({ paymentId: paymnt.id, amount: paymnt.amount - rest, date: toSimpleDate(new Date()) })
          savePayment({ ...paymnt, rest })
        }
      }} className={clsx("validate", !customer && 'anonym', rest !== null && 'ready')} />}
    </div>
  )
}

export default connect(ConnexionItem, ['payment'])

