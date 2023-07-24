import React, { useState, useMemo } from 'react'
import clsx from 'clsx'
import './PaidConnexion.scss'
import Hour from '../Hour'
import { bulkSetter, fullFormatDate, toAmount, toPhone, toSimpleDate, toSQLDate } from '../../../services/functions'
import ScrollBar from 'react-perfect-scrollbar'
// import { connect } from '../../../redux/store'
import { CONNEXION } from '../../../services/constants'
import { payementState } from '../../../recoil/atoms/payement'
import { useRecoilState } from 'recoil'
import { connexionState } from '../../../recoil/atoms/connexion'
import { customerState } from '../../../recoil/atoms/customer'
import { CustomerTypes } from '../../../types'

const states = {
  curDay: new Date()
}
interface propsPaidconnexion{
  // showCustomer: (e: CustomerTypes) => void;
  showCustomer: (activity?: boolean, customer?: CustomerTypes) => void
}

const PaidConnexion = (props: propsPaidconnexion) => {
  const [_paymentrecoil, _setpaymentrecoil] = useRecoilState(payementState)
  const [_connexionrecoil, _setconnexionrecoil] = useRecoilState(connexionState)
  const [_customer, _setcustomerrecoil] = useRecoilState(customerState)
  // const {
  //   // payment: { _payments }, connexion: { connexions },
  //   // customer: { customers }, 
  //   showCustomer
  // } = props

  const {
    curDay, setCurDay
  } = bulkSetter(...useState({ ...states }))

  const allPaids = useMemo(() => {
    const today: string | undefined = toSimpleDate(curDay)
    return _paymentrecoil.filter(({ type, rest = null, targetId, inactive }) => {
      const start = _connexionrecoil[targetId] ? toSimpleDate(_connexionrecoil[targetId].start) : ""
      return !inactive && type === CONNEXION && start && start.startsWith(today as string) && rest !== null
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
              allPaids.map((payment) => {
                const { targetId, customerId, amount, rest, id } = payment
                const { start, stop } = _connexionrecoil[targetId]
                const { facebook, lastname, firstname, sex, photo, phone } = _customer[parseInt(customerId)]

                return <div className="connexion" key={id}>
                  <div onDoubleClick={_ => props.showCustomer(undefined,_customer[parseInt(customerId)])} className="customer-name">
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

// export default connect(PaidConnexion, ["connexion", 'payment', 'customer'])
export default PaidConnexion