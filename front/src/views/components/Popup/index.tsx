import React, {useState, useEffect} from 'react'
import clsx from 'clsx'
import './Popup.scss'
import { useAppContext } from '../../../services/provider'
interface propsPopup{
  message: string,
  duration: 4000,
  type: 'info'
}
const Popup: any = (props: propsPopup) => {
  const {setPopup} = useAppContext()
  // const {message, duration = 4000, type = 'info'} = props
  const [text, setText] = useState("")
  const [active, setActive] = useState(false)
  useEffect(() => {
    clearTimeout(Popup.tmt)
    if(props.message) {
      setText(props.message)
      setActive(true)
      Popup.tmt = setTimeout(() => {
        setPopup({message: ''})
      }, props.duration)
    }
    else setActive(false)
  }, [props.message])
  return (
    <div className={clsx('Popup', active && 'active', props.type)}>
      <span>{text}</span>
    </div>
  )
}
export default Popup