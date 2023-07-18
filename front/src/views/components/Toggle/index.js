import React, { useState, useEffect, useContext } from 'react'
import clsx from 'clsx'
import {ContextDisabled} from "../AutreAbonnement/index"
import './Toggle.scss'
import { connect } from '../../../redux/store'
import { savePayment } from '../../../recoil/controllers'

const Toggle = (props) => {
  const [isToggled, setIsToggled] = useState(false);
  const onToggle = () => setIsToggled(!isToggled);
  const {disabled, setDisabled, mount, type} = useContext(ContextDisabled)

  // const {
  //   //savePayment
  // } = props

  const setPayment = () => {
    if (!isToggled) {
      savePayment({
        customerId: 1,
        targetId: null,
        type: type,
        userId: 1,
        summer: mount
      })
      setDisabled(!disabled)
    }
    return;
  }
  
  return (
    <div className={clsx('Toggle')}>
      <input id="chck" type="checkbox" checked={isToggled} onClick={setPayment} onChange={onToggle} disabled={disabled}/>
      <label for="chck" class="check-trail">
        <span class="check-handler"></span>
      </label>
      {/* <p>IsToglle {isToggled ? "on" : "off"}</p> */}
    </div>
  )
}
// export default connect(Toggle, ["payment"])
export default Toggle;