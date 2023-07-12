import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
import { useMemo } from 'react'
import { connect } from '../../../redux/store'
import { Server } from '../../../services/api'
import { addZero, computeAge, toPhone } from '../../../services/functions'
import './Customer.scss'

const Customer = function (props: any) {
  const {
    customer, setIncomer, onSelect,
    edit, payment:{_payments: payments}
  } = props

  const debt = useMemo(() => {
    return !!payments.find(({ customerId, rest }: any) => customerId === customer.id && rest)
  }, [customer.id, payments])

  return (
    <div
      className={clsx('Customer')}
      draggable="true"
      onDragStart={e => e.dataTransfer.setData("Text", JSON.stringify(customer))}
      onDragOver={e => e.preventDefault()}
      onClick={_ => onSelect && onSelect(customer)}
    >
      <div
        className={clsx("c-pdp", customer.sex)}
        style={customer.photo ? { backgroundImage: `url(${Server.imageUrl(customer.photo)})` } : {}}
        onDoubleClick={edit}
      />
      <div className="c-detail">
        <div className="c-name">
          <span className='lastname'>{customer.lastname} </span>
          <span>{customer.firstname} </span>
        </div>
        <div className="c-mail">{toPhone(customer.phone)}</div>
        <div className="c-mail">{addZero(computeAge(customer.birthdate))} ans</div>
        <div
          className={clsx("activity", debt && 'debt')}
          onClick={e => {
            e.stopPropagation()
            setIncomer && setIncomer(customer)
          }}
        >Payements</div>
      </div>
    </div>
  )
}

// export default connect(Customer, ['payment'])
export default Customer
