import React, { useEffect } from 'react'
import * as Atoms from "../../recoil/atoms"
import { useRecoilState } from 'recoil'
import controllers from './index'

export const setData = (model, datum) => {
    model(data => [...data, {...datum}])
}

export default function Recoil() {
    
    const [auth, setAuth] = useRecoilState(Atoms.authState)
    const [cert, setCert] = useRecoilState(Atoms.certState)
    const [connexion, setConnection] = useRecoilState(Atoms.connexionState)
    const [copy, setCopy] = useRecoilState(Atoms.copyState)
    const [customer, setCustomer] = useRecoilState(Atoms.customerState)
    const [formation, setFormation] = useRecoilState(Atoms.formationState)
    const [icomes, setIcomes] = useRecoilState(Atoms.icomeState)
    const [payement, setPayement] = useRecoilState(Atoms.payementState)
    const [program, setProgram] = useRecoilState(Atoms.programState)
    const [sub, setSub] = useRecoilState(Atoms.subState)
    const [user, setUser] = useRecoilState(Atoms.userState)

    useEffect(async () => {
        setAuth(await controllers.get('auth'))  
        setCert(await controllers.get('cert'))   
        setConnection(await controllers.get('connection'))
        setCopy(await controllers.get('copy'))   
        setCustomer(await controllers.get('customer'))   
        setFormation(await controllers.get('formation'))
        setIcomes(await controllers.get('icomes'))
        setPayement(await controllers.get('payment'))
        setProgram(await controllers.get('program'))
        setSub(await controllers.get('sub'))
        setUser(await controllers.get('user'))
    })

    return (
    <div>
      <div onClick={() => console.lo}></div>
    </div>
  )
}
