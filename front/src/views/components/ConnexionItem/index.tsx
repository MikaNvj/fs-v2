import React, { useState, useEffect, useRef, useMemo, MouseEvent, ChangeEvent } from 'react';
import {
  bulkSetter, determinerPrix, extractNews,
  toPhone, toSimpleDate, toSQLDate
} from '../../../services/functions'

import clsx from 'clsx'
import './ConnexionItem.scss'
import Hour from '../Hour'
import { Server } from '../../../services/api'
import {toAmount} from '../../../services/functions/index'
// import {connect} from '../../../redux/store/index'

import {useRecoilState} from "recoil";
import { payementState } from '../../../recoil/atoms/payement';
import { customerState } from '../../../recoil/atoms/customer';
import { connexionState } from '../../../recoil/atoms/connexion';
import { saveIncome } from '../../../recoil/controllers';
import { savePayment } from '../../../recoil/controllers';
import { saveConnexion } from '../../../recoil/controllers';
import { CustomerTypes, PaymentTypes } from '../../../types';

const Times = {
  add: (date: Date, min: number) => {
    const d = new Date(date)
    d.setTime(d.getTime() + 1000 * 60 * min)
    return d
  },
  reduce: (date: Date, min: number) => {
    const d = new Date(date)
    d.setTime(d.getTime() - 1000 * 60 * min)
    return d
  },
  duration: (d1: Date, d2: Date) => {
    if (!d1 || !d2) return 0
    return Math.abs(new Date(d1).getTime() - new Date(d2).getTime()) / (1000 * 60)
  }
}
interface propsConnexionItem{
  value: {start: string, stop: string},
  customer: CustomerTypes,
  paymnt: PaymentTypes,
  showUser: () => void,
  setChosenPayment: (a: PaymentTypes) => void
  saveConnexion?: () => void,
  savePayment?: () => void,
  saveIncome?: () => void,
}
const ConnexionItem = (props: propsConnexionItem) => {

  const [payments, _setCustomers] = useRecoilState(payementState)

  const durRef = useRef('')
  // const {
  //   value, customer, paymnt, 
  //   // saveIncome,
  //    showUser,
  //   // saveConnexion, savePayment,
  //    setChosenPayment,
  //   // payment:{_payments: payments}
  // } = props

  const {
    facebook, lastname, firstname,
    sex, photo, phone, id
  } = props.customer || {}

  const state = bulkSetter(...useState({
      start: props.value.start && new Date(props.value.start),
      stop: props.paymnt.amount ? props.value.stop && new Date(props.value.stop) : null
  }))
  const [rest, setRest] = useState< number | null>(null)
  const [canceled, setCanceled] = useState(false)

  useEffect(() => {
    let {start, stop} = props.value
    state.set({
      start: start && new Date(start),
      stop: stop && new Date(stop)
    })
  }, [toSQLDate(props.value.start), toSQLDate(props.value.stop)])

  useEffect(() => {
    const {start, stop} = state
    let price = props.paymnt.amount
    if (start && stop) {
      let prixExact = determinerPrix(new Date(start), new Date(stop))
      price = Math.round(prixExact / 100) * 100
    }
    else price = 0

    if((start && !props.value.start) || (stop && !props.value.stop) || (stop && start)){
      const extra = extractNews({ start, stop }, props.value)
      if (extra) {
        saveConnexion({
          ...props.value,
          start: start && start.toISOString(),
          stop: stop && stop.toISOString()
        })
      }
    }
    if (props.paymnt.amount !== price) {
      savePayment({ ...props.paymnt, amount: price })
    }
  }, [state.start, state.stop])

  useEffect( () => {
    let tmt: NodeJS.Timeout ;
    if (canceled) tmt = setTimeout(() => setCanceled(false), 3500)
    return ()=> clearTimeout(tmt)
  }, [canceled])

  const debt = useMemo(() => {
    return props.customer ? !!payments.find(({ customerId, rest }) => customerId === props.customer.id && rest) : false
  }, [props.customer, payments])

  return (
    <div onClick={_ => console.log(props.paymnt)} className={clsx('ConnexionItem')}>
      
      <div className={clsx("cx-customer", sex)}
        style={photo ? { backgroundImage: `url(${Server.imageUrl(photo)})` } : {}}
      >
        <div
          className={clsx("canceler", !props.customer && 'set-customer', canceled && 'active white')}
          onClick={_ => {
            if(!props.paymnt.customerId) props.setChosenPayment(props.paymnt)
            else if (!canceled) setCanceled(true)
            else savePayment({ ...props.paymnt, inactive: true })
          }}
        />
      </div>
      {
          props.customer ? <div onDoubleClick={props.showUser} className={clsx("customer-name", debt && 'debt')}>
              <span className='lastname'>{lastname}</span>
              <span>{firstname}</span>
              <span className='phone'>{toPhone(phone)}</span>
          </div> : <div onClick={(event: MouseEvent<HTMLDivElement>) => {
            const cl = (event.target as typeof event.target & {closest: (e: string) => any}).closest('.customer-name').classList
            if(cl.contains('act')){
              savePayment({ ...props.paymnt, inactive: true })
            }
            else {
              cl.add('act')
              setTimeout(()=> cl.remove('act'), 2500)
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
        value={props.paymnt.amount || ''}
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
        (!!props.paymnt.amount && rest !== null) && <input
          className="rest"
          onDoubleClick={_ => setRest(null)}
          type="text"
          value={rest || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>)=> {
            const val = parseInt((e.target as HTMLInputElement).value) || 0
            setRest((e.target as HTMLInputElement).value.lastIndexOf('-') > 0 ? -val : val)
          }}
          placeholder="reste"
        />
      }
      </div>
      {!!props.paymnt.amount && <div onClick={_ => {
        if (rest === null) setRest(0)
        else {
          saveIncome({ paymentId: props.paymnt.id, amount: props.paymnt.amount - rest, date: toSimpleDate(new Date()) })
          savePayment({ ...props.paymnt, rest })
        }
      }} className={clsx("validate", !props.customer && 'anonym', rest !== null && 'ready')} />}
    </div>
  )
}

// export default connect(ConnexionItem, ['payment'])
export default ConnexionItem
