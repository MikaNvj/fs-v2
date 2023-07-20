import clsx from 'clsx'
import React, { useMemo, useEffect } from 'react'
import './Input.scss'
import { addZero, fuzzyFilter } from '../../../services/functions'
import ScrollBar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import Hour from '../Hour'

export default function Input(props: any) {
  //Props
  let {
    type = "text", label = '', onChange: _onChange, readOnly,
    autofill, suffix, prefix, full, value, options, time, alwaysActive,
    multiple, required, square, error, outline = 'normal', className, ...rest
  } = props

  if (['switch', 'sex'].includes(type)) {
    const labs = label.split('|')
    prefix = prefix || labs[0] || (type === 'sex' ? 'Masculin' : 'Inactive')
    suffix = suffix || labs[1] || (type === 'sex' ? 'Féminin' : 'Active')
    label = ''
    outline = 'none'
  }

  //Props & states
  const [active, setActive] = React.useState(false)
  const [search, setSearch] = React.useState('')

  // Effects
  useEffect(() => setActive(value !== undefined && (multiple ? value.length : value !== '')), [value])
  if (error) label = `${label} (${error})`

  return (
    <div className={clsx(
      'Input', className, (active || alwaysActive || ['date', 'file', 'image'].includes(props.type)) && 'active', full && 'full',
      options && 'list', required && 'required', error && 'error', `input-${type}`, `outline-${outline}`
    )}>
      <span className="bi-label"> {prefix && <div className="fake-prefix">{prefix}</div>}{label} </span>
      {props.type === 'date' && <IDate {...props} />}
      {props.type === 'datetime' && <IDateTime {...props} />}
      {props.type === 'image' && <IImage {...props} />}
      {prefix && <div className="prefix">{prefix}</div>}
      {['switch', 'sex'].includes(type) && <ISwitch {...props} />}
      {type === 'file' && <IFile {...props} />}
      {['text', 'number', 'password'].includes(type) && <IInput {...props} {...{ search, setSearch }} />}
      {suffix && <div className="suffix">{suffix}</div>}
      {Array.isArray(options) && <IOptions {...props} setActive={setActive}  {...{ search, setSearch }} />}
    </div>
  )
}

Input.validator  = () => {
  const V: any = []
  const meths = {
    min: (min = 0) => V.push((val: any) => (val || '').length >= min) && V,
    max: (max = Number.MAX_SAFE_INTEGER) => V.push((val: any) => (val || '').length <= max) && V,
    mail: () => V.push((val: any) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(val)) && V,
    regex: (regex: any) => V.push((val: any) => regex.test(val)) && V,
    ignore: () => V.push(() => true) && V,
    func: (fnc: any) => V.push((val: any, vals: any) => fnc(val, vals)) && V,
    notIn: (arr: any) => V.push((val: any) => !arr.includes(val)) && V,
    in: (arr: any) => V.push((val: any) => arr.includes(val)) && V,
    required: (rq = true) => (rq && V.push((val: any) => !!(Array.isArray(val) ? val.length : val)) && Object.assign(V, { rq: !!rq }) && V) || V,
    validate: (val: any, vals = {}) => ((!val || (Array.isArray(val) && val.length === 0)) && !V.rq) || V.reduce((ok: any, valid: any) => ok && valid(val || '', vals), true)
  }
  Object.assign(V, meths)
  return V
}

const prevent = (e: any) => {
  e.preventDefault()
  e.stopPropagation()
  return true
}

const ISwitch = (props: any) => {
  let { value, values = [false, true], onChange } = props
  useEffect(() => {
    if (!values.includes(props.value)) {
      onChange && onChange(values[0])
    }
  }, [value])
  if (!values.includes(value)) value = values[0]
  return (
    <div onClick={_ => onChange(value === values[0] ? values[1] : values[0])} className={clsx('switch', value === values[1] && 'active')} />
  )
}

const IDate = (props: any) => {
  const { onChange, value } = props
  return (
    <Hour
      value={value}
      onChange={onChange}
      time={false}
    />
  )
}

const IDateTime = (props: any) => {
  const { onChange, value } = props
  return (
    <Hour
      value={value}
      onChange={onChange}
      time={true}
    />
  )
}

const IInput = (props: any) => {
  const sep = "  "
  let {
    onChange, error, centered, multiple, value = multiple ? [] : '', options,
    autofill, prefix, type, search, setSearch, iref, alwaysActive, maxOption, colored, ...rest
  } = props
  useEffect(() => props.value === undefined && onChange && onChange(value), [props.value])

  const getValues = useMemo(() => () => {
    const vals = options.filter(({ value: v }: any) => {
      return multiple ? value.includes(v) : value === v
    }).map(({ label }: any) => label).join(', ')
    return `${vals}${vals && search && ','}${vals && sep}${search}`
  }, [multiple, value, search])

  const change = useMemo(()=> (e: any) => {
    const { target: { value: val } } = e
    if (!options) onChange && onChange(val, e)
    else if (multiple ? value.length : value !== undefined) setSearch(val.split(sep)[1] || '')
    else setSearch(val)
  }, [onChange, value])

  return (
    <input
      {...{
        onChange: change, autoComplete: autofill ? autofill : 'off',
        value: (options ? getValues() : value) || "", ...rest
      }}
      className={clsx(prefix && 'prefixed', options && 'optioned')}
      type={type}
      ref={iref}
    />
  )
}

const IOptions = (props: any) => {
  const { options, onChange, centered, perline = 1, value = [], setActive, maxOption = 4, multiple, search, colored, setSearch } = props
  const changeList = (val: any) => {
    if (multiple) {
      const value = props.value || []
      if (value.includes(val)) val = value.filter((v: any) => v != val)
      else val = [...value, val]
      setActive(!!val.length)
    }
    else setActive(!!val)
    setSearch('')
    onChange && onChange(val)
  }
  return (
    <React.Fragment>
      <ScrollBar style={maxOption ? { maxHeight: 31 * maxOption } : {}} className={clsx("bi-options", colored && 'colored', centered && 'centered')}>
        {
          (search ? fuzzyFilter(options, search, ({ label: _ }) => _) : options).map(({ label, value: val }: any, key: any) => {
            const active = multiple ? value.includes(val) : value === val
            const Type = multiple ? 'button' : 'div'
            return (
              <Type
                key={key}
                style={{ width: `${100 / perline}%` }}
                className={clsx('bi-option', active && 'active')}
                onMouseDown={_ => changeList(val)}
              >{label}</Type>
            )
          })
        }
      </ScrollBar>
    </React.Fragment>
  )
}

const IFile = (props: any) => {
  let { onChange, value = [], multiple, ...rest } = props
  useEffect(() => props.value === undefined && onChange && onChange(value), [props.value])
  return (
    <div className={clsx('file')}>
      {
        value.length >= 1 && <div onClick={e => prevent(e)} className={clsx("filename", value.length > 1 && 'ltr')}>
          <span>{value.length === 1 ? value[0].name : `${addZero(value.length)} fichiers séléctionnés`}</span>
          {
            value.length === 1 && <div
              onClick={e => onChange && onChange(value.filter((o: any) => o !== value[0]), e)}
              className="remove-image"
            />
          }
        </div>
      }
      <label className={clsx('empty', value.length > 0 && 'empty-more')}>
        {value.length === 0 && 'Ajouter un fichier...'}
        <input onChange={(e: any) => {
          if (e.target.files.length) {
            const files = props.multiple ? [...value, ...Array.from(e.target.files)] : Array.from(e.target.files)
            onChange && onChange(files, e)
            e.target.value = ""
          }
        }} multiple={multiple} type="file" />
      </label>
      {value.length > 1 && <div tabIndex={1} onClick={e => prevent(e)} className="more" />}
      {
        value.length > 1 && <ScrollBar tabIndex={1} className="file-list">
          <div onClick={e => prevent(e)} className="file-list-content">
            {
              value.map((file: any, key: any) => {
                return <div className="filename" key={key}>
                  <span>{file.name}</span>
                  <div
                    onClick={e => onChange && onChange(value.filter((o: any) => o !== file), e)}
                    className="remove-image"
                  />
                </div>
              })
            }
          </div>
        </ScrollBar>
      }
    </div>
  )
}

const IImage = (props: any) => {
  const { value = [], onChange, square } = props
  useEffect(()=> props.value === undefined && onChange && onChange(value), [props.value])
  const firstImage = React.useMemo(() => value[0] && URL.createObjectURL(value[0]), [value[0]])

  return (
    <label
      style={value.length ? { backgroundImage: `url(${firstImage})` } : {}}
      className={clsx("image-container", value.length && 'filled', square && 'square')}
    >
      <input
        onChange={(e: any) => {
          if (e.target.files.length) {
            onChange && onChange(Array.from(e.target.files), e)
            e.target.value = ""
          }
        }}
        accept='image/*'
        type="file"
      />
    </label>
  )
}
