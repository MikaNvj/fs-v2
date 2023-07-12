import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import './ModalConfirme.scss'
import Input from '../Input'
import { bulkSetter } from '../../../services/functions'
import Button from '../Button'
export const Validator = Input.validator

const states = {
  text: '',
  title: '',
  error: undefined
}

const ModalConfirm = (props) => {
  const {  active, close, text, handler, error, title } = props
  const S = bulkSetter(...useState(states))
  
  useEffect(() => {
    S.set({ text, error, title })
  }, [text, error, title, handler])

  return (
    <div className={clsx('ModalConfirme on-center', active && 'active')}>
      <div className={clsx("e-content", S.error && 'error')}>
        <div onClick={close} className="e-close"/>
        <div className="e-title">{S.title}</div>
        <div className="e-contenu">{S.text}</div>
        <div className="e-btn">
          <Button rounded className="e-btn-annuler" onClick={close}>{error ? 'OK' : 'Annuler'}</Button>
          {
            !error && <Button className="e-btn-save" onClick={async _ => {
              await handler()
              close()
            }} rounded text="Confirmer" />
          }
        </div>
      </div>
    </div>
  )
}

export default ModalConfirm
