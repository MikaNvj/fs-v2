import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import './ModalSuccess.scss'
import Input from '../Input'
import { bulkSetter } from '../../../services/functions'
import { FiUserCheck } from "react-icons/fi"
export const Validator = Input.validator



const states = {
  show: false
}



const ModalSuccess = (props) => {
  // Props & states
  const { active, close } = props
  const S = bulkSetter(...useState(states))

  // Save

  // Effects
  useEffect(() => active ? S.setShow(true) : setTimeout(_ => S.setShow(false), 300), [active])

  return (
    <div className={clsx('ModalSuccess on-center', active && 'active', S.show && 'show')}>
      <div className="e-content">
        <div onClick={close} className="e-close" />
        <div className="e-contenu">
          <div className="e-success">
            <FiUserCheck size="4em" />
          </div>
          <h1>bon travail!</h1>
          <p>bon travail, ajout de l'utilisateur réussi</p>
        </div>
        <div className="e-btn">
          <button onClick={() => S.setShow(false)} >Ok</button>
        </div>
      </div>
    </div>
  )
}

export default ModalSuccess
