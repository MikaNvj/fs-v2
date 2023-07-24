import React, { useMemo, useState, useCallback, useEffect } from 'react'
import clsx from 'clsx'
import './Connexion.scss'
import ConnexionItem from '../../components/ConnexionItem/index'
import Store, { connect } from '../../../redux/store'
import Button from '../../components/Button'
import ScrollBar from 'react-perfect-scrollbar'
import UserList from '../../components/UserList'
import { bulkSetter } from '../../../services/functions'
import { CONNEXION } from '../../../services/constants'
import Modal from '../../portals/Modal'
import UserComponent from '../../components/UserComponent'
import PaidConnexion from '../../components/PaidConnexion'
import { useRecoilState, useRecoilValue } from 'recoil'
import { connexionState } from '../../../recoil/atoms/connexion'
import { payementState } from '../../../recoil/atoms/payement'
import { customerState, _customerState } from '../../../recoil/atoms/customer'

import { saveConnexion, savePayment, saveIncome } from '../../../recoil/controllers'
import { authObject } from '../../../services/iDB/Recoil'
import { authState } from '../../../recoil/atoms/auth'
import { CustomerTypes } from '../../../types'

const states = {
  chosenPayment: null, activity: false,
  curUser: null, showPaid: false
}

const Connexion = () => {
  const auth = useRecoilValue(authState)
  const [connexions, _setconnex] = useRecoilState(connexionState)
  const [_paymentrecoil, _setpayment] = useRecoilState(payementState)
  const [customers, setCustomer] = useRecoilState(customerState)
  const [_customers, _setCustomer] = useRecoilState(_customerState)

  // const {
  //   payment: { _payments },
  //   connexion: { connexions },
  //   customer: { customers },
  //   saveConnexion, savePayment, saveIncome
  // } = props

  const {
    chosenPayment, setChosenPayment, curUser,
    showPaid, setShowPaid, activity, setActivity, ...State
  } = bulkSetter(...useState({ ...states }))

  // const allConnexions = useMemo(_ => {
  //   return _payments.filter(({ type, rest = null, targetId, inactive }) => {
  //     return !inactive && type === CONNEXION && connexions[targetId] && rest === null
  //   })
  // }, [_payments])
  const allConnexions = useMemo(() => {
    return _paymentrecoil.filter(({ type, rest = null, targetId, inactive }) => {
      return !inactive && type === CONNEXION && connexions[targetId] && rest === null
    })
  }, [_paymentrecoil])

  const showCustomer = useCallback((activity?: boolean, customer?: CustomerTypes ) => {
    State.set({
      curUser: customer, activity
    })
  },[])
  
  const _allConnexion = useMemo(()=> {

    console.log('all connexion', connexions)
    return _paymentrecoil.filter(({ type, rest = null, targetId, inactive }) => {
      return !inactive && type === CONNEXION 
    })

  }, [_paymentrecoil])

  return (
    <div className={clsx('Connexion')}>
      <div className='c-options'>
        <Button
          rounded
          className="validated"
          onClick={() => setShowPaid(true)}>Validés</Button>
        <Button
          rounded
          onClick={async () => {
            const { id } = await saveConnexion({})
            await savePayment({
              targetId: id,
              customerId: null,
              type: CONNEXION,
              // userId: Store.getCurrentState('auth.user.id')
              userId: auth.user.id || undefined
            })
          }}>Nouvelle connexion</Button>
      </div>
      <ScrollBar className="connexions">
        {
          _allConnexion.filter(payment => connexions[payment.targetId]).map((payment) => {
            return <ConnexionItem
              key={payment.id}
              value={connexions[payment.targetId]}
              customer={_customers[payment.customerId]}
              paymnt={payment}
              setChosenPayment={setChosenPayment}
              showUser={() => showCustomer(false, customers[payment.customerId as any])}
              saveConnexion={saveConnexion}
              savePayment={savePayment}
              saveIncome={saveIncome}
            />
          })
        }
      </ScrollBar>
      {
        <Modal
          active={!!chosenPayment}
          parentSelector='.AppBody'
        >
          <div className="customer-choose">
            <div onClick={_ => setChosenPayment(null)} className="close-chooser" />
            <UserList
              onSelect={async (customer: CustomerTypes) => {
                savePayment({
                  ...chosenPayment,
                  customerId: customer.id
                })
                setChosenPayment(null)
              }}
            />
          </div>
        </Modal>
      }
      {
        <Modal
          active={showPaid}
          parentSelector='.AppBody'
        >
          <div onClick={_ => setShowPaid(false)} className="close-paid" />
          <PaidConnexion showCustomer={showCustomer} />
        </Modal>
      }
      {
        <UserComponent
          close={() => showCustomer(false)}
          edited={curUser}
          activity={activity}
          setActivity={setActivity}
        />
      }
    </div>
  )
}

// export default connect(Connexion, ["connexion", 'payment', 'customer'])
export default Connexion;
