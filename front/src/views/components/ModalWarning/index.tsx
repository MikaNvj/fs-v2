import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import './ModalWarning.scss'
import Input from '../Input'
import { bulkSetter } from '../../../services/functions'
import { FiAlertOctagon } from "react-icons/fi"
export const Validator = Input.validator



const states = {
  show: false
}

interface propsModalWarning{
  active: boolean,
  close: () =>void
}


const ModalWarning = (props: propsModalWarning) => {
  // Props & states
  // const { active, close } = props
  const S = bulkSetter(...useState(states))

  // Save

  // Effects
  useEffect(() => props.active ? S.setShow(true) : setTimeout(() => S.setShow(false), 300), [props.active])

  return (
    <div className={clsx('ModalWarning on-center', props.active && 'active', S.show && 'show')}>
      <div className="e-content">
        <div onClick={props.close} className="e-close" />
        <div className="e-contenu">
          <div className="e-warning">
            <FiAlertOctagon size="4em" />
          </div>
          <h1>Information!</h1>
          <p>Le client déjà existé, veuillez essaiyer un autre </p>
        </div>
        <div className="e-btn">
          <button className="e-btn-annuler" onClick={() => S.setShow(false)} >Fermer</button>
          {/* <Button className="e-btn-save" text="Oui, j'ajouter" /> */}
        </div>
      </div>
    </div>
  )
}

export default ModalWarning
