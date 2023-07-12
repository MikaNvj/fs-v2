import React, { useMemo, useState, useCallback } from 'react'
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

const states = {
  chosenPayment: null, activity: false,
  curUser: null, showPaid: false
}

const Connexion = (props) => {
  const {
    payment: { _payments }, connexion: { connexions },
    customer: { customers },
    saveConnexion, savePayment, saveIncome
  } = props

  const {
    chosenPayment, setChosenPayment, curUser,
    showPaid, setShowPaid, activity, setActivity, ...State
  } = bulkSetter(...useState({ ...states }))

  const allConnexions = useMemo(_ => {
    return _payments.filter(({ type, rest = null, targetId, inactive }) => {
      return !inactive && type === CONNEXION && connexions[targetId] && rest === null
    })
  }, [_payments])

  const showCustomer = useCallback((customer, activity) => {
    State.set({
      curUser: customer, activity
    })
  })

  return (
    <div className={clsx('Connexion')}>
      <div className='c-options'>
        <Button
          rounded
          className="validated"
          onClick={_ => setShowPaid(true)}>Validés</Button>
        <Button
          rounded
          onClick={async _ => {
            const { id } = await saveConnexion({})
            await savePayment({
              targetId: id,
              customerId: null,
              type: CONNEXION,
              userId: Store.getCurrentState('auth.user.id')
            })
          }}>Nouvelle connexion</Button>
      </div>
      <ScrollBar className="connexions">
        {
          allConnexions.filter(payment => connexions[payment.targetId]).map((payment) => {
            return <ConnexionItem
              key={payment.id}
              value={connexions[payment.targetId]}
              customer={customers[payment.customerId]}
              paymnt={payment}
              setChosenPayment={setChosenPayment}
              showUser={_ => showCustomer(customers[payment.customerId], false)}
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
              onSelect={async customer => {
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

export default connect(Connexion, ["connexion", 'payment', 'customer'])

