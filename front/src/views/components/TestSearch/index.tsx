import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import Store, { connect } from '../../../redux/store'

import './index.scss'
import { save } from '../../../services/iDB/db'


const payement = [
  {
    id: 1,
    targetId: 1,
    customerId: 1,
    userId: 2,
    type: "FORMATION"
  },
  {
    id: 2,
    targetId: 2,
    customerId: 2,
    userId: 2,
    type: "FORMATION"
  },
  {
    id: 3,
    targetId: 2,
    customerId: 1,
    userId: 2,
    type: "FORMATION"
  },
  {
    id: 3,
    targetId: 3,
    customerId: 2,
    userId: 2,
    type: "FORMATION"
  }
]


const customer = [
  {
    id: 1,
    name: "TOLONJANAHARY",
    prenom: "Nandrasanaela Daniel Aimé",
    email: "rastaitrbeatz320@gmail.com",
    phone: "0342957919",
    facebook: "Daniel Aimé"
  },
  {
    id: 2,
    name: "ANJARATIANA",
    prenom: "Nambininjanahary Stéphan",
    email: "malahiniavo@gmail.com",
    phone: "0343249943",
    facebook: "Anjaratiana Stéphan"
  },
]



const TestSearch = (props: any) => {
  const [show, setShow] = useState(false)
  const { 
    hide,
    savePayment,
   } = props
  useEffect(() => setShow(props.active === true))
  return (

    <div className="container">
      {/* <button  onClick={savePayment({...props.data})} 
      onClick={_ => showModal(_)}
      >Show me</button> */}
      <div className={clsx("modal", show && "show")}>
        <div className="modal-content">
          <span 
          className="close-btn"
          onClick={hide}
          >&times;</span>
          <div id="id-1" className="message">
            <h6>Voulez-vous ajouter le client n° {props.data.customerId} dans le programme n° {Number(props.data.targetId)} ?</h6>
            <button className="btn-annuler">Annuler</button>
            <button className="btn-save" onClick={() => savePayment(props.data)}>Oui, je l'ajouterai</button>
          </div>
        </div>
      </div>
      
    </div>

  )
}

// export default connect(TestSearch, ["payment"])
export default TestSearch