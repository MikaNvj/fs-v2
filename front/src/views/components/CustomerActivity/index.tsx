import React, { useState, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import './CustomerActivity.scss'
import { bulkSetter, formatDate, get, toAmount, toPhone, toSimpleDate } from '../../../services/functions'
// import Store, { connect } from '../../../redux/store'
import ScrollBar from 'react-perfect-scrollbar'
import { CONNEXION, FORMATION, CERT } from '../../../services/constants/index'
import { Server } from '../../../services/api'
import { useRecoilState, useRecoilValue } from 'recoil'
import { payementState, selectedpayment } from '../../../recoil/atoms/payement'
import { icomeState } from '../../../recoil/atoms/income'
import { formationState, selecteformation } from '../../../recoil/atoms/formation'
import { programState, selectedprogram } from '../../../recoil/atoms/program'
import { savePayment, saveIncome } from '../../../recoil/controllers'
import { selectedcert } from '../../../recoil/atoms/cert'
import { ConnexionTypes, Data, FormationTypes, IncomeTypes, PaymentTypes, ProgramTypes } from '../../../types'
const states = {
  customer: {},
  restEdited: null,
  openedPayment: null,
  restValue: 0
}
interface propsCustomerActivity{
  close: () => void,
  incomer: IncomeTypes,
  setActivity: (e: boolean) => void,
  activity: boolean
}

const CustomerActivity = (props: propsCustomerActivity) => {

  const [_paymentrecoil, setpaymentrecoil] = useRecoilState(payementState);
  const [incomerecoil,setincomerecoil] = useRecoilState(icomeState);
  const [formationrecoil, setformationrecoil] = useRecoilState(formationState);
  const [programrecoil, setprogramrecoil] = useRecoilState(programState);
  
  const {
    close, incomer, 
   
    // income: { _incomes }, payment: { _payments },
    setActivity, activity
  } = props

  const {
    customer, restEdited, ...State
  } = bulkSetter(...useState({ ...states }))

  useEffect(() => {
    incomer && State.setCustomer(incomer)
  }, [incomer])

  useEffect(() => {
    !restEdited && State.setRestValue(0)
  }, [restEdited])

  const allPayments = useMemo(()=> {
    return _paymentrecoil.filter(({ customerId, inactive, rest }) => !inactive && customerId === get(incomer, 'id') && rest != null)
      .sort(({ updatedAt: a }: any, { updatedAt: b }: any) => a < b ? 1 : -1)
  }, [_paymentrecoil, incomer.id])


  return (
    <div className="CustomerActivity">
      <div className="e-left">
        <div onClick={_ => {
          setActivity && setActivity(!activity)
        }} className='e-details'>Détails</div>
        <div
          className={clsx("e-avatar", customer.sex)}
          style={customer.photo ? { backgroundImage: `url(${Server.imageUrl(customer.photo)})` } : {}}
        />
        <div className="e-name">
          {`${customer.lastname && customer.lastname.toUpperCase()} ${customer.firstname}`}
        </div>
        <div className="e-phone">
          {`${toPhone(customer.phone)}`}
        </div>
      </div>
      <div onClick={close} className="e-close" />
      <div className="e-right">
        <ScrollBar className='payments'>
          {
            !!incomer && allPayments.map((payment: PaymentTypes) => {
              return (
                <React.Fragment key={payment.id}>
                  {
                    restEdited === payment.id && State.restValue != 0 && <div className='payment-message'>
                      {`${State.restValue > 0 ? (customer.sex === 'F' ? 'Elle' : 'Il') + " nous donne" : "On lui donne"} `}
                      <span>{toAmount(Math.abs(State.restValue))}</span>
                      {(_ => {
                        const rst = payment.rest - State.restValue
                        const doit = rst > 0 ? (customer.sex === 'F' ? 'Elle' : 'Il') + " nous doit" : "On lui doit"
                        if (rst) return <>
                          {` (${doit} encore `}
                          <span>{toAmount(Math.abs(rst))}</span>
                          {' )'}
                        </>
                      })()}
                    </div>
                  }
                  <div
                    className={clsx('payment', State.openedPayment === payment.id && 'opened', !payment.rest && 'rest')}
                  >
                    <div
                      className="p-name"
                      onClick={_ => {
                        State.setOpenedPayment(State.openedPayment === payment.id ? null : payment.id)
                      }}
                    >
                      {format(payment)}
                    </div>
                    <div className="p-data p-price">{toAmount(payment.amount || 0)}</div>
                    {!!payment.rest && <div className="p-data p-rest">{toAmount(payment.rest)}</div>}
                    {
                      restEdited !== payment.id ?
                        <div onClick={_ => State.setRestEdited(payment.id)} className="pay">Payement</div> :
                        <input
                          autoFocus
                          onBlur={_ => State.setRestEdited(null)}
                          onChange={({ target: { value } }) => {
                            let val = parseInt(value)
                            if (value.lastIndexOf('-') > 0) val *= -1
                            State.setRestValue(val || 0)
                          }}
                          value={State.restValue || ''}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              const today = toSimpleDate()
                              const income = incomerecoil.find(({ date, paymentId }) => date === today && paymentId === payment.id) || {
                                date: today,
                                paymentId: payment.id,
                                amount: 0
                              }
                              income.amount += State.restValue
                              payment.rest -= State.restValue
                              savePayment(payment)
                              saveIncome(income)
                              State.setRestEdited(null)
                            }
                          }}
                        />
                    }
                  </div>
                  {
                    State.openedPayment === payment.id && <div className={'incomes'}>
                      {
                        incomerecoil.filter(({ paymentId }) => paymentId === payment.id)
                          .map(({ date, amount, id }) => {
                            return (
                              <div key={id} className="income">
                                <div className="in-date">{formatDate(new Date(date))}</div>
                                <div className="in-amount">{toAmount(amount)}</div>
                              </div>
                            )
                          })
                      }
                    </div>
                  }
                </React.Fragment>
              )
            })
          }
        </ScrollBar>
      </div>
    </div>
  )
}

const format = (payment: PaymentTypes) => {
  return <React.Fragment>
    {payment.type === CONNEXION && formatConnexion(payment)}
    {payment.type === FORMATION && FormatFormation(payment)}
    {payment.type === CERT && FormatCert(payment)}
  </React.Fragment>
}

const FormatCert =( payment: PaymentTypes) => {
  
  const paymentselected = useRecoilValue(selectedpayment)
  
  const certdetails = useRecoilValue(selectedcert)
  // const {formationId: fpid} = Store.getCurrentState(`cert.certs.${payment.targetId}`) || {}
  const {formationId: fpid} = certdetails({id: `${payment.targetId}`})  || {}
  // const fpayment = Store.getCurrentState(`payment.payments.${fpid}`) || {}
  const fpayment: PaymentTypes | any = paymentselected({id: `${fpid}`}) || {}
  return (
    <span>
      <span className='pn-type'>Certificat -</span>
      {FormatFormation(fpayment, false)}
    </span>
  )
}

const FormatFormation = (payment: PaymentTypes, ftion = true) => {
  const formationdetails = useRecoilValue(selecteformation)
  const programdetails = useRecoilValue(selectedprogram)
  // const all = Store.getCurrentState(`program.programs.${payment.targetId}`) || {}
  const all = programdetails({id: `${payment.targetId}`}) || {}
  const { date, formationId }: any= all
  // const fname = Store.getCurrentState(`formation.formations.${formationId}.name`)
  const fname = (formationdetails(({id: `${formationId}`})) as FormationTypes).name

  return (
    <span>
      <span className='pn-type'>{ftion && "Formation - "}{fname}</span>
      <span className='pn-date'>{formatDate(date, { du: true })}</span>
    </span>
  )
}

const formatConnexion = (payment: PaymentTypes) => {
  return (
    <span>
      <span className='pn-type'>Connexion</span>
      <span className='pn-date'>{formatDate(new Date(payment.createdAt), { du: true })}</span>
    </span>
  )
}

// export default connect(CustomerActivity, ["payment", 'income', 'formation', 'program'])
export default CustomerActivity
