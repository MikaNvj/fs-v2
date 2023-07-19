import clsx from 'clsx'
import React, {useState, useRef, useMemo} from 'react'
import ScrollBar from 'react-perfect-scrollbar'
import Store, { connect } from '../../../redux/store'
import { Server } from '../../../services/api'
import bridge from '../../../services/bridge'
import { CERT, FORMATION } from '../../../services/constants'
import { bulkSetter, formatDate, toAmount } from '../../../services/functions/index'
import Modal from '../../portals/Modal'
import Input from '../Input'
import { saveCert, savePayment } from '../../../recoil/controllers'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './Diploma.scss'
import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { customerState } from '../../../recoil/atoms/customer'
import { certState } from '../../../recoil/atoms/cert'
import { formationState } from '../../../recoil/atoms/formation'
import { payementState } from '../../../recoil/atoms/payement'
import { programState } from '../../../recoil/atoms/program'
import { authObject } from '../../../services/iDB/Recoil'

const mentions = { AB: 'Assez bien', B: 'Bien', TB: 'Très bien' }
const notes = { AB: 13.5, B: 15.5, TB: 17.5 }

const states = { certificate: '', cdate: new Date() }

const getMention = note => {
  if(!note) note = 17
  else if(note < 14) return 'AB'
  else if(note < 16) return 'B'
  else if(note >= 16) return 'TB'
}

const Diploma = (props) => {
  const [customers, setcustomers] = useRecoilState(customerState);
  const [_certs, setcerts] = useRecoilState(certState);
  const [formations, setformation] = useRecoilState(formationState)
  const [_payments, setpayments] = useRecoilState(payementState);
  const [program, setprogram] = useRecoilState(programState)

  const {
    active = true, close, actFormation, actProgram,
    // formation: {formations}, customer: {customers},
    // cert: {_certs}, payment: {_payments},
    // saveCert, savePayment
  } = props
   program = actProgram
  const { formation, students} = useMemo(_ => {
    return {
      formation: actFormation || formations[program.formationId],
      students: _payments.filter(({type, targetId}) => {
        return type === FORMATION && targetId === program.id
      }).map(p => {
        return {
          ...p,
          customer: customers[p.customerId],
          cert: _certs.find(c => c.formationId === p.id)
        }
      })
    }
  }, [program, _certs])


  // STATES
  const {
    certificate, setCertificate, cur, setCur, cdate, setCdate
  } = bulkSetter(...useState({...states, cur: students[0]?.id}))

  const ref = useRef(null)

  // MEMOS
  const printable = useMemo(() => { return !students.find(({cert}) => !cert) }, [students])
  const curCert = useMemo(() => {
    const curStud = students.find(({id}) => id === cur)
    return curStud?.cert
  }, [students, cur])

  // PRINT HANDLERS
  const printAll = useMemo(_ => async e => {
    e.target.closest('.Diploma').classList.remove('single')
    await bridge('print', {opts: {
      printBackground: true, color: false,
      marginsType: 1, landscape: true,
      pageSize: 'A4', pdf: {
        folder: "Certificats",
        name: `${formation.name} - Rentrée(${formatDate(program.date, {precise: true})})`
      }, margins: {
        marginType : 'printableArea'
      }
    }})
  }, [program])
  const printCurrent = useMemo(_ => async e => {
    e.target.closest('.Diploma').classList.add('single')
    const {firstname, lastname} = students.find(({id}) => id === cur).customer
    await bridge('print', {opts: {
      printBackground: true, color: false,
      marginsType: 1, landscape: true, pageSize: 'A4',
      pdf: {
        folder: "Certificats",
        name: `[${new Date().getTime()}] ${formation.name}` +
          ` - Rentrée(${formatDate(program.date, {precise: true})}) - ${lastname.toUpperCase()} ${firstname}`
      },
      margins: { marginType : 'printableArea' }
    }})
  })
  const prepareCertificates = useCallback(_ => {
    students.forEach(async ({id: formationId, customer, cert}) => {
      if(!cert){
        const {id} = await saveCert({ mention: 15, formationId })
        savePayment({
          targetId: id, type: CERT,
          customerId: customer.id,
          amount: program.certprice || 0, rest: program.certprice || 0,
          // userId: Store.getCurrentState('auth.user.id')
          userId: authObject.user.id
        })
      }
    })
  }, [students])

  return (
    <Modal className='DiplomaParent' active={active} parentSelector="#root" >
      <div className='Diploma' ref={ref}>
        <div className="close-button button white inside" onClick={close}/>
        <div className="student-list">
          <div className="tp-header">
            <div className='title'>Liste des étudiants</div>
            <div className='subtitle'>{formation.name}</div>
            <div className='title'>{formatDate(program.date)}</div>
            <div className="d-buttons">
              {
                printable ? (
                  <React.Fragment>
                    <div className="print-button button" onClick={printAll}>Imprimer tout</div>
                    <div className="print-button button" onClick={printCurrent}>Imprimer l'aperçu</div>
                  </React.Fragment>
                ): (
                  <div className="print-button button" onClick={prepareCertificates}>Préparer les certificats</div>
                )
              }
            </div>
          </div>
          <div className="list">
            <ScrollBar className='list-stud-parent'>
              <div className="list-stud">
                {
                  students.map(({rest, amount, id, customer, cert}) => {
                    const cp = cert && _payments.find(({type, targetId}) => type === CERT && targetId === cert?.id)
                    return (
                      <div onClick={_ => setCur(id)} className={clsx("student", id === cur && 'current', rest && "invalid")} key={id}>
                        <div
                          className={clsx("photo", customer.sex)}
                          style={customer.photo ? { backgroundImage: `url(${Server.imageUrl(customer.photo)})` } : {}}
                        />
                        <div className="name">
                          <span>{customer.lastname}</span>
                          <span>{customer.firstname}</span>
                          {!!cp?.rest && <span className="rest">Certificat - {`${toAmount(cp?.rest, '')} / ${toAmount(cp?.amount)}`}</span>}
                          {!!rest && <span className="rest">Formation - {`${toAmount(rest, '')} / ${toAmount(amount)}`}</span>}
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </ScrollBar>
          </div>
        </div>
        <div className="right-print-side">
          <div className="customize">
            <Input value={certificate} onChange={setCertificate} label="Certificat"/>
            <Input value={cdate} onChange={setCdate} type="date" label="Date de délivrance"/>
            <div className="mentions">
              {
                Object.keys(mentions).map((key, i) => {
                  return (
                    <div
                      key={i}
                      className={clsx(key === getMention(curCert?.mention) && 'active', "mention")}
                      onClick={_ => {
                        if(curCert) saveCert({...curCert, mention: notes[key]})
                      }}
                    >
                      {mentions[key]}
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="to-print">
            {
              students.map(({customer, cert = {}, id}) => {
                return (
                  <div className={clsx("diploma", id === cur && "show")} key={id} >
                    <div className="certificate-type">{certificate}</div>
                    <div className="content">
                      <div className="part1">
                        <div className="present">Le présent document atteste que</div>
                        <div className="name">
                          <div className="val">
                            {customer.lastname} {customer.firstname}
                          </div>
                        </div>
                        <div className="birth">Né{customer.sex === 'F' && 'e'} le {formatDate(customer.birthdate)} à {customer.birthplace}</div>
                        <div className="finish">a terminé avec succès la formation</div>
                        <div className="formation">
                          <span className="val">{(formation.fullname || formation.name).toUpperCase()}</span>
                        </div>
                        <div className="mention">
                          <span>Mention : </span>
                          <span className="val">{(mentions[getMention(cert?.mention)] || "").toUpperCase()}</span>
                        </div>
                        <div className="date">{formatDate(cdate, {precise: true, preciseYear: true})}</div> 
                      </div>
                      <div className="part2">
                        <div className="signatures">
                          <div className="student">
                            <span>L'apprenant</span>
                          </div>
                          <div className="resp">
                            <span>Le responsable</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </Modal>
  )
}

// export default connect(Diploma, ['customer', 'program', 'formation', 'payment', 'cert'])
export default Diploma;