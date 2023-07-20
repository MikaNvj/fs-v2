// import React, { useState, useEffect } from 'react'
import React, { useState, useEffect } from 'react';
import { bulkSetter, extractNews, get, toPhone, toSimpleDate } from '../../../services/functions'
import clsx from 'clsx'
import './CopyItem.scss'
import { baseUrl, Server } from '../../../services/api'

const states = {
  black: 0,
  colored: 0,
  wasted: 0,
  amount: 0
}

const CopyItem = (props: any) => {
  const {
    value, setSelectedPayment,
    customer: {
      facebook, lastname, firstname,
      sex, photo, phone, id
    } = {} as any, customer, payment, saveIncome,
    savePayment, saveCopy
  } = props

  const {
    black, colored, wasted, amount,
    ...state
  } = bulkSetter(...useState({
    black: value.black, colored: value.colored,
    wasted: value.wasted, amount: payment.amount
  }))
  
  const [rest, setRest] = useState< any>(null)
  const [canceled, setCanceled] = useState(false)

  useEffect(() => {
    state.set({
      black: value.black || 0,
      colored: value.colored || 0,
      wasted: value.wasted || 0
    })
  }, [value])

  useEffect(() => {
    const news = extractNews({ black, colored, wasted }, value)
    if (news) {
      const amount = black * (black >= 10 ? 50 : 100) + colored * 200
      state.setAmount(amount)
      saveCopy({ ...value, ...news })
      if (payment.amount !== amount) savePayment({ ...payment, amount })
    }
  }, [black, colored, wasted])


  useEffect(()=> {
    let tmt: any
    if (canceled) tmt = setTimeout(() => setCanceled(false), 3500)
    return ()=> clearTimeout(tmt)
  }, [canceled])

  return (
    <div className={clsx('CopyItem')}  >
      <div className={clsx("cx-customer", sex)}
        style={photo ? { backgroundImage: `url(${Server.imageUrl(photo)})` } : {}}
      >
        <div
          className={clsx("canceler", !payment.customerId && 'set-customer', canceled && 'active')}
          onClick={_ => {
            if(!payment.customerId) setSelectedPayment(payment)
            else if (!canceled) setCanceled(true)
            else savePayment({ ...payment, inactive: true })
          }}
        />
        {
          customer && <div className="cx-detail">
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
      <input className="black"
        value={black || ''}
        onChange={e => state.setBlack(parseInt(e.target.value) || 0)}
        placeholder="Noir"
      />
      <input className="colored"
        value={colored || ''}
        onChange={e => state.setColored(parseInt(e.target.value) || 0)}
        placeholder="Couleur"
      />
      <input className="wasted"
        value={wasted || ''}
        onChange={e => state.setWasted(parseInt(e.target.value) || 0)}
        placeholder="perdu"
      />
      <input className="amount"
        readOnly
        value={amount || ''}
        onChange={e => state.setAmount(parseInt(e.target.value) || 0)}
        placeholder="prix"
      />
      {
        (!!amount && rest !== null) && <input
          className="rest"
          onDoubleClick={_ => setRest(null)}
          type="text"
          value={rest || ''}
          onChange={e => setRest(parseInt(e.target.value) || 0)}
          placeholder="reste"
        />
      }
      {!!amount && <div onClick={_ => {
        if (rest === null) setRest(0)
        else {
          saveIncome({ paymentId: payment.id, amount: payment.amount - rest, date: toSimpleDate(new Date()) })
          savePayment({ ...payment, rest })
        }
      }} className={clsx("validate", !customer && 'anonym', rest !== null && 'ready')} />}
    </div>
  )
}

export default CopyItem
