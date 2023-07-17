
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
import {
    getCerts, getConnexions, getCopies,
    getCustomers, getFormations, getPayments, getIncomes, getPrograms, getSubs, getUsers
} from '../../redux/actions'

export const triggerEvent = (evName) => {
    document.dispatchEvent(new CustomEvent(evName))
}
const recoil_getter_from_listener = (eventName, listener) => {
    document.addEventListener(eventName, listener)
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

    async function update_recoil(model) {
        switch (model) {
            case 'cert':
                setCert(await iDB[model].get(model));
                break;
            case 'connexion':
                setConnection(await iDB[model].get(model));
                break;
            case 'copy':
                setCopy(await iDB[model].get(model));
                break;
            case 'customer':
                setCustomer(await iDB[model].get(model));
                break;
            case 'formation':
                setFormation(await iDB[model].get(model));
                break;
            case 'icomes':
                setIcomes(await iDB[model].get(model));
                break;
            case 'payment':
                setPayement(await iDB[model].get(model));
                break;
            case 'program':
                setProgram(await iDB[model].get(model));
                break;
            case 'sub':
                setSub(await iDB[model].get(model));
                break;
            case 'user':
                setUser(await iDB[model].get(model));
                break;
        }
    }

    useEffect(() => {

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

        DB.dbTables().then(async models => {
            for (const model of models) {

                update_recoil(model)

                document.addEventListener(model, async (e) => {
                    // setters[`set${model}`](await iDB[model].get(model))
                    update_recoil(model)
                })
                console.log(model + 'listeners called')
            }

        })
    }, [])

    return (
        <div>
            <div onClick={() => console.log('clg from recoil')}></div>
        </div>
    )
}
