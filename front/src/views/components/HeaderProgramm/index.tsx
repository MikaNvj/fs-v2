import React, { useState, useMemo } from 'react'
import clsx from 'clsx'
import './HeaderProgramm.scss'
import { connect } from '../../../redux/store'
import { addZero, formatDate, get, toAmount } from '../../../services/functions'
import { FORMATION } from '../../../services/constants'
import { useRecoilState } from 'recoil'
import { payementState } from '../../../recoil/atoms/payement'
import { ProgramTypes } from '../../../types'


interface propsHeaderProgram{
  curProgram: ProgramTypes,
  close: ()=>void,
  showList: (e:boolean) => void,
  showDiploma: (e: boolean) => void,
}
const HeaderProgramm = (props: propsHeaderProgram) => {

  const [_payments, setPayments] = useRecoilState(payementState)
  // const {
  //   curProgram, close, showList, showDiploma,
  //   // payment: {_payments}
  // } = props

  const count = useMemo(() => {
    return props.curProgram ? _payments.filter(({type, targetId}) => type === FORMATION && targetId === props.curProgram.id ).length : 0
  }, [get(props.curProgram, 'id'), _payments])

  return (
    <div className={clsx('HeaderProgramm', props.curProgram && 'active')}>
      <div className='hp-left'>
        <div tabIndex={1} className="hp-menu">
          <div className="menu-items">
            <div onClick={_ => props.showList(true)} className="menu-item">Liste de présence</div>
            <div onClick={_ => props.showDiploma(true)} className="menu-item">Certificats</div>
          </div>
        </div>
        <div className="f-name">
          {get(props.curProgram, 'formation.name')}
        </div>
      </div>
      <div className="program-details">
        <div className="img-box count">
          <span className="count">{addZero(count)} </span>
        </div>
        <div className="img-box date">
          {props.curProgram && formatDate(props.curProgram.date)}
        </div>
        <div className="img-box price">
          {props.curProgram && toAmount(props.curProgram.price)}
        </div>
        <div onClick={props.close} className="close-hp white"/>
      </div >
    </div>
  )
}
// export default connect(HeaderProgramm, ["payment"])
export default HeaderProgramm