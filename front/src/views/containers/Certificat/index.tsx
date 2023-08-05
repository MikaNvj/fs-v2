import React, { useEffect, useState } from "react";
import clsx from "clsx";
import './certificat.scss';
import LocalData from "../../../services/LocalData";
import Modele from "../../components/Modele";

const stateCordonee = {
  x: 0,
  y: 0
}



const Certificat = () => {
  const [imageDropped, setImageDropped] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [idModele, setIdModele] = useState(0)

  const openNewModele = () => {
    setIsOpen(true)
    setIdModele(1)
  }
  
  return (
    <div>
      <div className="outils">
        <button onClick={openNewModele}>New modele</button>
        <Modele id={idModele.toString()} open={isOpen} />
      </div>
    </div>

  )
}

export default Certificat;