import React, { useState, useMemo } from 'react'
import clsx from 'clsx'
import './Formation.scss'
import Editor, { Validator } from '../../components/Editor'
import { bulkSetter, formatDate, fuzzyFilter, get, toAmount } from '../../../services/functions'
import Store, { connect } from '../../../redux/store'
import HeaderProgramm from '../../components/HeaderProgramm';
import ScrollBar from 'react-perfect-scrollbar'
import ModalConfirm from '../../components/ModalConfirm'
import ModalWarning from '../../components/ModalWarning'
import UserList from '../../components/UserList'
import { FORMATION } from '../../../services/constants/index'
import PrintList from '../../components/PrintList'
import Diploma from '../../components/Diploma'

const states = {
  edited: null, newProgram: false, showList: false,
  activeFormation: null, activeProgram: null, draggedTo: 0, searchFormation: '',
  modalConfirm: 0, modalWarning: 0, showDiploma: false,  openedCustomer: null
}

const Formation = (props: any) => {
  const {
    saveFormation, saveProgram, savePayment,
    formation: { _formations, formations }, program: { _programs },
    payment: { _payments }
  } = props

  // States
  const {
    edited, setEdited, searchFormation, input: __input,
    newProgram, setNewProgram,
    modalConfirm, setModalConfirm, showList, showDiploma, setShowDiploma,
    modalWarning, setModalWarning, setShowList, openedCustomer, setOpenedCustomer,
    activeFormation, setActiveFormation,
    activeProgram, setActiveProgram
  } = bulkSetter(...useState({...states}))

  // Memos
  const allPrograms = useMemo(() => {
    return 
  }, [_programs])

  const allFormations = useMemo(() => {
    const allPrograms = _programs.sort((a: any, b: any) => new Date(a.date) < new Date(b.date) ? 1 : -1)
    return _formations.map((formation: any) => {
      const programs = allPrograms.filter(({formationId: fid}: any) => fid === formation.id)
      const filter = programs.length ? programs[0].date : formation.createdAt
      return {
        ...formation,
        programs, filter
      }
    }).sort(({filter: fa}: any, {filter: fb}: any) => fa > fb ? -1 : 1)
  }, [_formations, _programs])

  
  const customers = useMemo(() => {
    if(!activeProgram) return null
    return _payments.filter(({type, targetId}: any) => type === FORMATION && targetId === activeProgram.id )
      .map(({customerId}: any) => customerId)
  }, [get(activeProgram, 'id'), _payments])

  return (
    <div className={clsx('Formation')}>
      <div className="formations-container">
        <div className="formations-container-header">
          <div className="add-formation-button" onClick={_ => setEdited({})} />
          <div className="text-header">{'Formations'}</div>
        </div>
        <div className="formation-search">
          <input {...__input('searchFormation')} type="text" />
        </div>
        <div className="formations">
          <ScrollBar className='formations-content'>
            {
              fuzzyFilter(allFormations, searchFormation, ({ name }) => name || '')
              .map(({id, filter, programs: myprograms}: any) => {
                const formation = formations[id]
                const { name } = formation
                return (
                  <div key={id} className={clsx("formation", get(activeFormation, 'id') === id && "active")}>
                    <div className={"formation-name"} onClick={_ => {
                      
                    }}>
                      <div onClick={_ => setEdited(formation)} className="menu" />
                      <div
                        className='name'
                        onClick={_ => setActiveFormation(get(activeFormation, 'id') === id ? null : formation)}
                      >{name}</div>
                      <div
                        onClick={_ => setNewProgram({ formationId: id, certprice: 5000, date: new Date(), place: 0 })}
                        className="menu add"
                      />
                      
                    </div>
                    <div
                      className={clsx("programs", get(activeFormation, 'id') === id && "active")}
                    >
                      <ScrollBar>
                        {
                          id === get(activeFormation, 'id') && myprograms.map((program: any) => {
                              const { date, price, detail, id } = program
                              return (
                                <div
                                  key={program.id}
                                  data-position={id}
                                  onDragOver={e => e.preventDefault()}
                                  onDrop={e => {
                                    const customer = JSON.parse(e.dataTransfer.getData("Text"))
                                    const np = {
                                      customerId: customer.id, targetId: id, type: FORMATION,
                                      userId: Store.getCurrentState('auth.user.id'),
                                      amount: program.price,
                                      rest: program.price
                                    }
                                    const op = _payments.find((({ customerId, targetId, type }: any) => {
                                      return customerId === customer.id && targetId === id && type === FORMATION
                                    }))
                                    setModalConfirm(
                                      op ?
                                        {
                                          title: `Déjà inscrit${customer.sex === 'F' ? 'e' : ''}  `,
                                          text: `${customer.firstname} est déjà inscrit${customer.sex === 'F' ? 'e' : ''} à la formation "${name}" du ${formatDate(date)}`,
                                          error: true
                                        } :
                                        {
                                          handler: () => {
                                            savePayment(np)
                                            setActiveProgram(program)
                                            setOpenedCustomer(Store.getCurrentState('customer.customers.' + customer.id))
                                          },
                                          title: 'Inscription',
                                          text: `Inscrire ${customer.firstname} à la formation "${name}" du ${formatDate(date)}`
                                        }
                                    )
                                  }}
                                  className={clsx("program", activeProgram?.id === program.id && 'active')}
                                >
                                  <div
                                    className="program-edit"
                                    onClick={_ => setNewProgram(program)}
                                  />
                                  <div
                                    className='program-detail'
                                    onClick={_ => setActiveProgram({ ...program, formation: activeFormation })}
                                  >
                                    <span className="date">{formatDate(new Date(date))}</span>
                                    <div className="down-one">
                                      <span className="detail">{detail}</span>
                                      <span className="price">{toAmount(price)}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                        }
                      </ScrollBar>
                    </div>
                  </div>
                )
              })
            }
          </ScrollBar>
        </div>
      </div>
      <div className="right-container">
        <HeaderProgramm
          close={() => setActiveProgram(null)}
          curProgram={activeProgram}
          showList={setShowList}
          showDiploma={setShowDiploma}
        />
        <UserList
          setOpenedCustomer={setOpenedCustomer as any}
          openedCustomer={openedCustomer}
          programm={activeProgram && activeProgram.programmId}
          selected={customers}
        />
      </div>
      <Editor
        close={() => setEdited(null)}
        active={!!edited}
        value={edited}
        title={(edited?.id ? "Modifier" : 'Nouvelle') + " Formation"}
        fields={[
          { label: 'Appelation', name: "name", validator: Validator().required() },
          { label: 'Appelation Complète', name: "fullname" },
        ]}
        save={saveFormation}
        position='left'
      />
      <Editor
        close={() => setNewProgram(null)}
        active={!!newProgram}
        title={(newProgram?.id ? "Modifier" : 'Nouvelle') + " Date de Formation"}
        value={newProgram || {}}
        fields={[
          { label: 'Frais de formation', type: 'number', name: "price", suffix: 'Ar', validator: Validator().required() },
          { label: 'Date de debut', type: 'date', maxOption: 4, name: "date", validator: Validator().required() },
          { label: 'Déscriptif', name: "detail"},
          { label: 'Frais de Certificat', name: "certprice"},
          { label: 'Nombre de place', type: 'number', name: "place" },
        ]}
        save={async ({ formation, ...data }: any) => {
          await saveProgram(data)
          setActiveFormation(formations[data.formationId])
        }}
        position='left'
      />
      <ModalConfirm
        active={!!modalConfirm}
        close={() => setModalConfirm(null)}
        {...(modalConfirm || {})}
      />
      <ModalWarning
        active={modalWarning}
        close={() => setModalWarning(false)}
      />
      <Editor
        title="Nouveau client"
        fields={
          [
            { label: "firstname", name: "firstname", type: "text", validator: Validator().required },
            { label: "secondname", name: "secondname", type: "text", validator: Validator().required },
            { label: "birthday", name: "birthday", type: "date", validator: Validator().required },
            { label: "email", name: "email", type: "text", validator: Validator().required },
            { label: "facebook", name: "facebook", type: "text", validator: Validator().required },
            { label: "adress", name: "adress", type: "text", validator: Validator().required },
            { lable: "phone", name: "phone", type: "text", validator: Validator().required }
          ]
        }
      />
      {
        showList && <PrintList
        selected={customers}
        active={true}
          formation={activeFormation}
          program={activeProgram}
          close={() => setShowList(false)}
        />
      }
      {
        showDiploma && <Diploma
          active={true}
          actFormation={activeFormation}
          actProgram={activeProgram}
          close={() => setShowDiploma(false)}
        />
      }
    </div>
  )
}
export default connect(Formation, ["formation", "program", 'payment'])