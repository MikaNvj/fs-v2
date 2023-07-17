
import React, { useEffect } from 'react'
// import * as Atoms from "../../recoil/atoms"
import { useRecoilState } from 'recoil'
import { authState } from '../../recoil/atoms'
import { certState } from '../../recoil/atoms/cert'
import { connexionState } from '../../recoil/atoms/connexion'
import { copyState } from '../../recoil/atoms/copy'
import { customerState } from '../../recoil/atoms/customer'
import { formationState } from '../../recoil/atoms/formation'
import { icomeState } from '../../recoil/atoms/income'
import { payementState } from '../../recoil/atoms/payement'
import { programState } from '../../recoil/atoms/program'
import { subState } from '../../recoil/atoms/sub'
import { userState } from '../../recoil/atoms/user'
import DB from './db'
import iDB from '.'
import { getCerts, getConnexions, getCopies, 
    getCustomers, getFormations, getPayments, getIncomes, getPrograms, getSubs, getUsers } from '../../redux/actions'

export const triggerEvent = (evName) => {
    document.dispatchEvent(new CustomEvent(evName))
}

export default function Recoil() {

    // const [auth, setAuth] = useRecoilState(authState)
    const [cert, setCert] = useRecoilState(certState)
    const [connexion, setConnection] = useRecoilState(connexionState)
    const [copy, setCopy] = useRecoilState(copyState)
    const [customer, setCustomer] = useRecoilState(customerState)
    const [formation, setFormation] = useRecoilState(formationState)
    const [icomes, setIcomes] = useRecoilState(icomeState)
    const [payement, setPayement] = useRecoilState(payementState)
    const [program, setProgram] = useRecoilState(programState)
    const [sub, setSub] = useRecoilState(subState)
    const [user, setUser] = useRecoilState(userState)

    // "setauth": setAuth,
    const setters = {
        "setcert": setCert,
        "setconnection": setConnection,
        "setcopy": setCopy,
        "setcustomer": setCustomer,
        "setformation": setFormation,
        "seticomes": setIcomes,
        "setpayment": setPayement,
        "setProgram": setProgram,
        "setsub": setSub,
        "setuser": setUser
    }

    useEffect( async () => {

        // setAuth(au())  
        setCert((await DB.dbTables()).includes('cert') ? getCerts() : [])   
        setConnection((await DB.dbTables()).includes('connection') ? getConnexions() : [])
        setCopy((await DB.dbTables()).includes('copy') ? getCopies() : [])   
        setPayement((await DB.dbTables()).includes('payment') ? getPayments() : [])
        setCustomer((await DB.dbTables()).includes('customer') ? getCustomers() : [])   
        setFormation((await DB.dbTables()).includes('formation') ? getFormations() : [])
        setIcomes((await DB.dbTables()).includes('icomes') ? getIncomes() : [])
        setProgram((await DB.dbTables()).includes('program') ? getPrograms() : [])
        setSub((await DB.dbTables()).includes('sub') ? getSubs() : [])
        setUser((await DB.dbTables()).includes('user') ? getUsers() : [])

        DB.dbTables().then(models => {
            for (const model of models) {
                document.addEventListener(model, async (e) => {
                    setters[`set${model}`](await iDB[model].get(model))
                })
            }
        })
    }, [])

    return (
        <div>
            <div onClick={() => console.lo}></div>
        </div>
    )
}

