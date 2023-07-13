import React, { useState, useMemo } from 'react'
import clsx from 'clsx'
import './PaidConnexion.scss'
import Hour from '../Hour'
import { bulkSetter, fullFormatDate, toAmount, toPhone, toSimpleDate, toSQLDate } from '../../../services/functions'
import ScrollBar from 'react-perfect-scrollbar'
import { connect } from '../../../redux/store'
import { CONNEXION } from '../../../services/constants'

const states = {
  curDay: new Date()
}

const PaidConnexion = (props: any) => {
  const {
    payment: { _payments }, connexion: { connexions },
    customer: { customers }, showCustomer
  } = props

  const {
    curDay, setCurDay
  } = bulkSetter(...useState({ ...states }))

  const allPaids = useMemo(() => {
    const today: any = toSimpleDate(curDay)
    return _payments.filter(({ type, createdAt, rest = null, targetId, inactive }: any) => {
      const start = connexions[targetId] ? toSimpleDate(connexions[targetId].start) : ""
      return !inactive && type === CONNEXION && start && start.startsWith(today) && rest !== null
    })
  }, [])

  return (
    <div className={clsx('PaidConnexion')}>
      <div className="pc-header">
        <Hour value={curDay} onChange={setCurDay} time={false} />
      </div>
      <div className="pc-body">
        <ScrollBar className='paids'>
          <div className="paid-list">
            {
              allPaids.map((payment: any) => {
                const { targetId, customerId, amount, rest, id } = payment
                const { start, stop } = connexions[targetId]
                const { facebook, lastname, firstname, sex, photo, phone } = customers[customerId]

                return <div className="connexion" key={id}>
                  <div onDoubleClick={_ => showCustomer(customers[customerId])} className="customer-name">
                    <span className='lastname'>{lastname}</span>
                    <span>{firstname}</span>
                    <span className='phone'>{toPhone(phone)}</span>
                  </div>
                  <div className="hours">
                    <span>{fullFormatDate(start, { baseDate: curDay })}</span>
                    <span>{fullFormatDate(stop, { baseDate: curDay })}</span>
                  </div>
                  <div className="amount">{toAmount(amount)}</div>
                  {!!rest && <div className="rest">{rest > 0 ? "Il nous doit" : "On lui doit"} encore <span>{toAmount(Math.abs(rest))}</span></div>}
                </div>
              })
            }
          </div>
        </ScrollBar>
      </div>
    </div>
  )
}

export default connect(PaidConnexion, ["connexion", 'payment', 'customer'])
// export default PaidConnexion