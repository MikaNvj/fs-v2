import React, { useState, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import './AutrePayement.scss'
import SubscriptionItem from '../../components/SubscriptionItem'
// import Store, { connect } from '../../../redux/store'
import { COPY, EMAIL, PRINT, REPAIR, SCAN, SUB } from '../../../services/constants'
import ScrollBar from 'react-perfect-scrollbar'
import UserList from '../../components/UserList'
import { bulkSetter } from '../../../services/functions'
import CopyItem from '../../components/CopyItem'
import { useRecoilState } from 'recoil'

import { _subState } from '../../../recoil/atoms/sub'
import { payementState } from '../../../recoil/atoms/payement'
import  { _customerState } from '../../../recoil/atoms/customer'
import { _copyState } from '../../../recoil/atoms/copy'

import { authObject } from '../../../services/iDB/Recoil'

import {savePayment, saveSub, saveIncome, saveCopy} from '../../../recoil/controllers'
import { CustomerTypes } from '../../../types'

const others = [COPY, EMAIL, PRINT, REPAIR, SCAN, SUB]

const states = {
  selectedPayment: null
}

const AutrePayement = () => {
  const [_paymentrecoil, _setpaymentrecoil ] = useRecoilState(payementState)
  const [subs, setSubs] = useRecoilState(_subState)
  const [customers, setCustomers] = useRecoilState(_customerState)
  const [copies, setCopies] = useRecoilState< any>(_copyState)

  // const {
  //   savePayment, saveSub, saveIncome, saveCopy,
  //   payment: { _payments }, sub: {subs},
  //   customer: { customers }, copy: {copies}
  // } = props

  useEffect(() => {

    console.log('payement recoil', _paymentrecoil)

  }, [_paymentrecoil])
  const create = useMemo(() => async (type: string) => {
    let id, creator: any
    if(type === SUB) creator = saveSub
    else if([COPY, PRINT].includes(type)) creator = saveCopy
    id = (await creator({})).id
    await savePayment({
      targetId: id, type,
      // customerId: customer.id,
      // userId: Store.getCurrentState('auth.user.id')
      userId: authObject.user.id
    })
  }, [])

  const {
    selectedPayment, setSelectedPayment, ...State
  } = bulkSetter(...useState({...states}))
  return (
    <div className={clsx('AutrePayement')}>
      <div className="ap-header">
        <div onClick={_ => create(COPY)} className="creator copy"><span>photocopie</span></div>
        <div onClick={_ => create(PRINT)} className="creator print"><span>impression</span></div>
        <div onClick={_ => create(SUB)} className="creator subscribe"><span>abonnement</span></div>
        {/*
          <div onClick={_ => setType(SCAN)} className="creator scan"><span>scan</span></div>
          <div onClick={_ => setType(REPAIR)} className="creator repair"><span>reparation</span></div>
          <div onClick={_ => setType(EMAIL)} className="creator email"><span>email</span></div>
        */}
      </div>
      <div className="ap-content">
        <ScrollBar className="ap-list">
          <div className="aps">
            {
              // _payments.filter(({ type, rest = null, inactive }) => !inactive && others.includes(type) && rest === null)
              _paymentrecoil.filter(({ type, rest = null, inactive }) => !inactive && others.includes(type) && rest === null)
                .map((payment) => {
                  let Comp, objList, opts = {
                    value: '',
                    key: payment.id,
                    customer: customers[payment.customerId],
                    saveIncome, savePayment,
                  }

                  if(payment.type === SUB){
                    objList = subs
                    Comp = SubscriptionItem
                    opts = {
                      ...opts, value: subs[payment.targetId],
                      saveSub
                    } as any
                  }
                  else if([COPY, PRINT].includes(payment.type)){
                    objList = copies
                    Comp = CopyItem
                    opts = {
                      ...opts, value: copies[payment.targetId],
                      saveCopy
                    } as any
                  } 

                  return Comp && opts.value ? <Comp
                    value = {objList && objList[payment.targetId]} 
                    key={payment.id}
                    customer={ customers[payment.customerId]}
                    payment={payment}
                    saveIncome={saveIncome}
                    savePayment={savePayment}
                    saveSub={saveSub}
                    saveCopy={saveCopy}
                    setSelectedPayment={setSelectedPayment}
                  /> : null
                })
            }
          </div>
        </ScrollBar>
      </div>
      {
        !!selectedPayment && <div className="customer-choose">
          <div onClick={_ => setSelectedPayment(false)} className="close-chooser"/>
          <UserList
            onSelect={async (customer: CustomerTypes) => {
              savePayment({
                ...selectedPayment,
                customerId: customer.id
              })
              setSelectedPayment(null)
            }}
          />
        </div>
      }
    </div>
  )
}

// export default connect(AutrePayement, ['payment', 'sub', 'customer', 'copy'])
export default AutrePayement