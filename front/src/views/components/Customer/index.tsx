import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
import { useMemo } from 'react'
// import { connect } from '../../../redux/store'
import { Server } from '../../../services/api'
import { addZero, computeAge, toPhone } from '../../../services/functions'
import './Customer.scss'
import { useRecoilState } from 'recoil'
import { payementState } from '../../../recoil/atoms/payement'
import { CustomerTypes, IncomeTypes } from '../../../types'

interface propsCustomer{
  customer: CustomerTypes,
  setIncomer: (a: CustomerTypes | IncomeTypes) => void,
  onSelect: (a: CustomerTypes) => void,
  edit: () => void, 

}

const Customer = function (props: propsCustomer) {
  const [payments, _setpaymentrecoil] = useRecoilState(payementState)
  // const {
  //   customer, setIncomer, onSelect,
  //   edit, 
  //   // payment:{_payments: payments}
  // } = props

  const debt = useMemo(() => {
    return !!payments.find(({ customerId, rest }) => customerId === props.customer.id && rest)
  }, [props.customer.id, payments])

  return (
    <div
      className={clsx('Customer')}
      draggable="true"
      onDragStart={e => e.dataTransfer.setData("Text", JSON.stringify(props.customer))}
      onDragOver={e => e.preventDefault()}
      onClick={_ => props.onSelect && props.onSelect(props.customer)}
    >
      <div
        className={clsx("c-pdp", props.customer.sex)}
        style={props.customer.photo ? { backgroundImage: `url(${Server.imageUrl(props.customer.photo)})` } : {}}
        onDoubleClick={props.edit}
      />
      <div className="c-detail">
        <div className="c-name">
          <span className='lastname'>{props.customer.lastname} </span>
          <span>{props.customer.firstname} </span>
        </div>
        <div className="c-mail">{toPhone(props.customer.phone)}</div>
        <div className="c-mail">{addZero(computeAge(props.customer.birthdate))} ans</div>
        <div
          className={clsx("activity", debt && 'debt')}
          onClick={e => {
            e.stopPropagation()
            props.setIncomer && props.setIncomer(props.customer)
          }}
        >Payements</div>
      </div>
    </div>
  )
}

// export default connect(Customer, ['payment'])
export default Customer