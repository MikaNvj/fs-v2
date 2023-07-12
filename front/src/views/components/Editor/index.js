import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import './Editor.scss'
import Input from '../Input'
import { bulkSetter } from '../../../services/functions'
import Button from '../Button'
import ScrollBar from 'react-perfect-scrollbar'
export const Validator = Input.validator

const states = {
  show: false,
  error: false,
  wait: false
}


const empty = {}

const defields = [
  { label: 'Photo de profil', name: "pdp", type: 'image' },
  { label: 'Pseudo', name: "pseudo", validator: Validator().min(3) },
  { label: 'Files', name: "files", type: 'file', multiple: true, validator: Validator().required() }
]

const Editor = (props) => {
  // Props & states
  const { active, close, fields = defields, position = 'center', title = 'Offre' } = props
  const value = props.value || empty
  const S = bulkSetter(...useState({...states}))
  const I = bulkSetter(...useState(transformFields(fields)))

  // Save
  const save = React.useMemo(() => {
    return async () => {
      const valid = validateFields(fields, I)
      if (valid) {
        S.setWait(true)
        try {
          await props.save({
            ...value,
            ...I.get()
          })
        } catch (err) {
          console.warn(
            "Error during saving. values:",
            { ...value, ...I.get() },
            err
          )
        }
        S.setWait(false)
        close()
      }
      else S.setError(true)
    }
  }, [I])


  // Effects
  useEffect(() => active ? S.setShow(true) : setTimeout(_ => S.setShow(false), 300), [active])
  useEffect(() => I.set(transformFields(fields, value)), [fields, value, active])
  useEffect(() => S.error && S.setError(false), [I])

  return (
    <div className={clsx('Editor', `on-${position}`, active && 'active')}>
      <div className="e-content">
        <div onClick={close} className="e-close" />
        <div className="e-title">{title}</div>
        <ScrollBar className="e-fields">
          {
            fields.filter(({ name }) => name in I).map((field, key) => {
              const { name, errorMessage = `invalide`, validator = Validator().ignore(), ...rest } = field
              return <React.Fragment key={key}>
                <Input {...rest}
                  required={validator.rq}
                  value={I[name]}
                  error={S.error && !validator.validate(I[name], I) && errorMessage}
                  onChange={val => I.set(name, val)}
                />
              </React.Fragment>
            })
          }
        </ScrollBar>
        <Button onClick={save} waiting={S.wait} rounded text="Sauvegarder" />
      </div>
    </div>
  )
}

export default Editor
const transformFields = (fields, value = {}) => fields.reduce((obj, { name, type }) => {
  return name ? ({ ...obj, [name]: value[name] || ('file' === type ? [] : '') }) : obj
}, {})
const validateFields = (fields, I) => fields.filter(({ validator }) => !!validator)
  .reduce((ok, { validator, name }) => ok && validator.validate(I[name], I), true)