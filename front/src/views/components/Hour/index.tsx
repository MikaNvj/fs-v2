import './Hour.scss'
import clsx from 'clsx'
import Input from '../Input'
import React, { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react'
import { addZero, basicFormatDate, bulkSetter, toSQLDate } from '../../../services/functions'

interface propstoObjet{
  date: number,
  month: number,
  year: number,
  hour: number | undefined,
  minute: number | undefined,
}
function toObject(date: Date, autoHour?: boolean): propstoObjet{
  date = date ? new Date(date) : new Date()
  let ok = true
  if (!date.getTime()) {
    date = new Date()
    ok = false
  }
  return {
    date: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    hour: ok ? date.getHours() : (autoHour ? undefined : 0),
    minute: ok ? date.getMinutes() : (autoHour ? undefined : 0)
  }
}

const toHour = (date: Date) => {
  date = new Date(date)
  return date.getTime() ? `${addZero(date.getHours())}:${addZero(date.getMinutes())}` : ''
}

const hourFormat = (str: string, simple?: boolean) => {
  str = str.replace(/[^0-9]/g, '')
  if (str.length >= 2) {
    if (parseInt(str.substr(0, 2)) > 23) str = '0' + str
    if (str.length > 4) str = str.substr(0, 4)
    if (str.length === 4 && parseInt(str.substr(-2)) > 59) str = str.substr(0, 2) + '0'
  }
  if (simple) return str
  return str ? `${str[0] || '-'}${str[1] || '-'}:${str[2] || '-'}${str[3] || '-'}` : ''
}

const dateLines = (y: number, m = new Date().getMonth()) => {
  const date = new Date()
  date.setDate(1)
  y && date.setFullYear(y)
  if(m || m === 0) date.setMonth(m)
  const from = date.getDay() ? date.getDay() - 1 : 6
  const prevMax = new Date(new Date(date).setMonth(m, 0)).getDate()
  const max = new Date(new Date(date).setMonth(m + 1, 0)).getDate()
  let count = Math.ceil((from + max) / 7) * 7
  return {
    values: Array.from(new Array(count).keys()).map(i => {
      let val = prevMax - from + i + 1
      if(val > prevMax){
        val -= prevMax
        if(val > max) val -= max
      }
      return { label: addZero(val), value: i - from + 1 }
    }), max, prevMax, month: m, year: y
  }
}

interface propsHour{
  time?: boolean,
  alwaysOn?: boolean,
  value: Date,
  onChange?: (e: any) => void,
  className?: string,
}

const Hour = (props: propsHour) => {
  // props.time = true
  // const {
  //   time = true, alwaysOn,
  //   value, onChange, className
  // } = props

  //States
  const hRef: any = useRef()
  const state = bulkSetter(...useState(toObject(props.value, props.time)))
  const [hourStr, setHourStr] = useState(props.time ? toHour(props.value) : '00:00')
  const { date, month, year, hour, minute } = state

  // Effects
  useEffect(()=> {
    const d = new Date(`${year}-${month + 1}-${addZero(date)}` + (props.time ? ` ${hour}:${minute}:00` : ' 00:00:00'))
    if (`${year}`.length === 4 && d.getTime()) {
      if (toSQLDate(d) !== toSQLDate(props.value)) {
        props.onChange && props.onChange(d)
      }
    } else {
      props.onChange && props.onChange(null)
    }
  }, props.time ? [date, month, year, hour, minute] : [date, month, year])

  useEffect(()=> {
    if (hourStr && hourStr.indexOf('-') < 0) {
      state.set({ hour: parseInt(hourStr.substring(0, 2)), minute: parseInt(hourStr.substring(3, 5)) })
    }
    else state.set({ hour: undefined, minute: undefined })
  }, [hourStr])

  useEffect(()=> {
    if (props.value) {
      if(`${year}`.length === 4) state.set(toObject(props.value))
      setHourStr(toHour(props.value))
    }
  }, [toSQLDate(props.value)])

  useEffect(() => {
    let val: number | NodeJS.Timer = 0
    const update = async () => {
      const { current  = {} } = hRef
      if (current && !current.value) current.placeholder = toHour(new Date())
    }
    update()
    setTimeout(() => {
      update()
      val = setInterval(update, 1000 * 60)
    }, (60 - new Date().getSeconds()) * 1000)
    return () => clearInterval(val)
  }, [])

  const dates = useMemo(() => dateLines(state.year, state.month), [state.month, state.year])

  return (
    <div className={clsx('Hour', props.className, (props.alwaysOn || !props.time) && 'always-on')}>
      {
        props.time && <input ref={hRef}
          onChange={({ target, target: { value } }) => {
            const p = (p => p > 2 ? ++p : p)(hourFormat(value, true).length)
            setTimeout(() => target.setSelectionRange(p, p))
            setHourStr(hourFormat(value))
          }}
          value={hourStr || ''} type="text" className='hour'
          onDoubleClick={({ target }: any) => !target.value && setHourStr(target.placeholder)}
        />
      }
      <div ref={props.time ? null : hRef} className="dates">
        <Input
          onChange={(val: number) => {
            let {month, year, prevMax} = dates
            month = val > dates.max ? month + 1 : val <= 0 ? month - 1 : month
            if(month < 0){
              month = 11
              year--
            }
            else if(month > 11){
              month = month % 11; year++
            }
            state.set({
              date: val > dates.max ? val - dates.max : val <= 0 ? prevMax + val : val,
              month, year
            })
            setTimeout(() => {
              const dates = hRef.current.parentNode.querySelector('.dates')
              dates.querySelectorAll('input')[1].select()
            }, 0)
          }}
          value={state.date}
          colored
          className='date' outline='none'
          perline={7} centered
          maxOption={5}
          options={dates.values}
        />
        <Input
          perline={3} centered
          options={[
            ...basicFormatDate.monthNames.frc.map((label, value) => ({ label, value }))
          ]}
          outline='none' className='month'
          value={state.month}
          onChange={(v: ChangeEvent) => {
            state.set('month', v)
            setTimeout(() => {
              const dates = hRef.current.parentNode.querySelector('.dates')
              dates.querySelectorAll('input')[2].select()
            }, 0)
          }}
        />
        <input
          onChange={({ target: { value } }) => state.setYear(value.substring(0, 4))}
          value={state.year || ''}
          className='year' type="text"
        />
      </div>
    </div>
  )
}



export default Hour