import React, {useState, useEffect} from 'react'
import clsx from 'clsx'
import './Popup.scss'
import { useAppContext } from '../../../services/provider'
const Popup = (props) => {
  const {setPopup} = useAppContext()
  const {message, duration = 4000, type = 'info'} = props
  const [text, setText] = useState("")
  const [active, setActive] = useState(false)
  useEffect(() => {
    clearTimeout(Popup.tmt)
    if(message) {
      setText(message)
      setActive(true)
      Popup.tmt = setTimeout(_ => {
        setPopup({message: ''})
      }, duration)
    }
    else setActive(false)
  }, [message])
  return (
    <div className={clsx('Popup', active && 'active', type)}>
      <span>{text}</span>
    </div>
  )
}
export default Popup