// import React, { useState, useEffect } from 'react'
import React, { useState, useEffect } from 'react';
import { bulkSetter, extractNews, get, toPhone, toSimpleDate, toSQLDate } from '../../../services/functions'

import clsx from 'clsx'
import './SubscriptionItem.scss'
import Hour from '../Hour'
import { baseUrl, Server } from '../../../services/api'
import Input from '../Input'
const subs = [
  {label: 'Jour 1 Mois', amount: 40000, dd: 31, value: 1},
  {label: 'Soir 1 Mois', amount: 50000, dd: 31, value: 2},
  {label: 'Spécial ENI', amount: 35000, dd: 31, value: 3}
]

const states = {
  offer: 1,
  start: new Date(),
  end: null,
  price: 0
}

const SubscriptionItem = (props: any) => {
  // const {
  //   value, setSelectedPayment, customer: {
  //     facebook, lastname, firstname,
  //     sex, photo, phone
  //   } = {}, customer, payment, saveIncome,
  //   savePayment, saveSub
  // } = props
    const {
    value, setSelectedPayment, customer: {
      facebook, lastname, firstname,
      sex, photo, phone
    } = {
      facebook, lastname, firstname,
      sex, photo, phone
    }, customer, payment, saveIncome,
    savePayment, saveSub
  } = props

  const state = bulkSetter(...useState({...states}))
  const [rest, setRest] = useState< number | null>(null)
  const [canceled, setCanceled] = useState(false)
  
  useEffect(() => {
    state.set({
      offer: value.sub,
      start: value.start || states.start,
      stop: value.stop, end: value.end
    })
  }, [value])

  useEffect(() => {
    const sub = subs.find(({value}) => value === state.offer)
    state.setPrice(sub ? sub.amount : 0)
  }, [state.offer])

  useEffect(() => {
    if(state.price !== payment.amount){
      savePayment({ ...payment, amount: state.price })
    }
  }, [state.price])

  useEffect(() => {
    const sub: any = subs.find(({value}) => value === state.offer)
    if(state.start && sub){
      const date = new Date(state.start)
      date.setMonth(date.getMonth() + (sub.dm || 0))
      date.setDate(date.getDate() + (sub.dd || 0))
      state.setEnd(date)

      const news = extractNews({
        sub: state.offer,
        start: toSimpleDate(state.start),
        end: toSimpleDate(date)
      }, value)
      if(news) saveSub({ ...value, ...news })
    }
  }, [state.offer, state.start])

  useEffect(()=> {
    let tmt:any;
    if(canceled) tmt = setTimeout(() => setCanceled(false), 3500)
    return () => clearTimeout(tmt)
  }, [canceled])
  
  return (
    <div className={clsx('SubscriptionItem')}  >
      <div className={clsx("cx-customer", sex)}
        style={photo ? { backgroundImage: `url(${Server.imageUrl(photo)})` } : {}}
      >
        <div
          className={clsx("canceler", !payment.customerId && 'set-customer', canceled && 'active')}
          onClick={_ => {
            if(!payment.customerId) setSelectedPayment(payment)
            else if (!canceled) setCanceled(true)
            else savePayment({...payment, inactive: true})
          }}
        />
        {
          !!customer && <div className="cx-detail">
          {
            (() => {
              const id = get(JSON.parse(facebook), 'id')
              return id ? <div className="cx-facebook">{ }</div> : null
            })()
          }
          <div className="cx-name">
            <span className='lastname'>{lastname} </span>
            <span className='firstname'>{firstname} </span>
          </div>
          <div className="cx-phone">{toPhone(phone)}</div>
        </div>
        }
      </div>
      <Input
        outline='none'
        className="offer"
        placeholder="Abonnement"
        value={state.offer}
        onChange={(val: any) => state.setOffer(val)}
        options= {subs}
      />
      {rest === null && <div className="date-sep">Du</div>}
      {rest === null && <Hour className='start' time={false} value={state.start} onChange={(val: any) => state.setStart(val)} />}
      <div className="date-sep">{rest == null ? 'au' : 'Prendra fin le'}</div>
      <Hour className='stop' time={false} value={state.end} onChange={(val: any) => val}/>
      <input className="price"
        type="text"
        readOnly
        value={state.price || ''}
        onChange={e => state.setPrice(parseInt(e.target.value) || 0)}
        placeholder="price"
      />
      {
        (!!state.price && rest !== null) && <input
          className="rest"
          onDoubleClick={_ => setRest(null)}
          type="text"
          value={rest || ''}
          onChange={e => setRest(parseInt(e.target.value) || 0)}
          placeholder="reste"
        />
      }
      {!!state.price && <div onClick={_ => {
        if (rest === null) setRest(0)
        else {
          saveIncome({ paymentId: payment.id, amount: payment.amount - rest, date: toSimpleDate(new Date()) })
          savePayment({ ...payment, rest })
        }
      }} className={clsx("validate", !customer && 'anonym', rest !== null && 'ready')} />}
    </div>
  )
}

export default SubscriptionItem
