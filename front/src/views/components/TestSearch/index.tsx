import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import Store, { connect } from '../../../redux/store'

import './index.scss'
import { save } from '../../../services/iDB/db'
import { savePayment } from '../../../recoil/controllers'


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

interface propsTestSearch{
  hide: any,
  active: boolean,
  data: any
}

const TestSearch = (props: propsTestSearch) => {
  const [show, setShow] = useState(false)
  const { 
    hide,
    active,
    data
    // savePayment,
   } = props
  useEffect(() => setShow(active === true))
  return (

    <div className="container">
      {/* <button  onClick={savePayment({...data})} 
      onClick={_ => showModal(_)}
      >Show me</button> */}
      <div className={clsx("modal", show && "show")}>
        <div className="modal-content">
          <span 
          className="close-btn"
          onClick={hide}
          >&times;</span>
          <div id="id-1" className="message">
            <h6>Voulez-vous ajouter le client n° {data.customerId} dans le programme n° {Number(data.targetId)} ?</h6>
            <button className="btn-annuler">Annuler</button>
            <button className="btn-save" onClick={() => savePayment(data)}>Oui, je l'ajouterai</button>
          </div>
        </div>
      </div>
      
    </div>

  )
}

// export default connect(TestSearch, ["payment"])
export default TestSearch