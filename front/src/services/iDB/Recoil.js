
import React, { useEffect, useState } from 'react'
// import * as Atoms from "../../recoil/atoms"
import { useRecoilState } from 'recoil'
import { authState } from '../../recoil/atoms'
import { certState } from '../../recoil/atoms/cert'
import { connexionState } from '../../recoil/atoms/connexion'
import { _copyState, copyState } from '../../recoil/atoms/copy'
import { customerState, _customerState } from '../../recoil/atoms/customer'
import { formationState, _formationState } from '../../recoil/atoms/formation'
import { icomeState } from '../../recoil/atoms/income'
import { payementState } from '../../recoil/atoms/payement'
import { programState } from '../../recoil/atoms/program'
import { _subState, subState } from '../../recoil/atoms/sub'
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
    const [dbTablesHadlers, setHendler] = useState(1)
    const [_customer, _setCustomer] = useRecoilState(_customerState)
    const [_copy, _setCopy] = useRecoilState(_copyState)
    const [_sub, _setSub] = useRecoilState(_subState)
    const [_formation, _setformation] = useRecoilState(_formationState)

    const models = ['cert', 'connexion', 'copy', 'customer', 'formation', 
    'icomes', 'payment', 'program', 'sub', 'user']

    async function update_recoil(model) {

        switch (model) {
            case 'cert':

                setCert(await get_into_local_storage(model));
                break;
            case 'connexion':

                setConnection(transform_to_object(await get_into_local_storage(model)))
                break;
            case 'copy':

                _setCopy(transform_to_object(await get_into_local_storage(model)))
                setCopy(await get_into_local_storage(model));
                break;
            case 'customer':

                _setCustomer(transform_to_object(await get_into_local_storage(model)))
                setCustomer(await get_into_local_storage(model))
                break;
            case 'formation':

                _setformation(transform_to_object(await get_into_local_storage(model)))
                setFormation(await get_into_local_storage(model));
                break;
            case 'icomes':

                setIcomes(await get_into_local_storage(model));
                break;
            case 'payment':

                setPayement(await get_into_local_storage(model));
                break;
            case 'program':

                setProgram(await get_into_local_storage(model));
                break;
            case 'sub':

                _setSub(transform_to_object(await get_into_local_storage(model)))
                setSub(await get_into_local_storage(model));
                break;
            case 'user':

                setUser(await get_into_local_storage(model));
                break;
        }
    }
    async function get_into_local_storage(model){
        return await iDB[model].get(model)
    }
    function transform_to_object(data){
        let result= {}

        for(const datum of data){
            result[datum.id] = {...datum}
        }

        return result
    }

    useEffect(() => {

        DB.dbTables().then(async models => {
            for (const model of models) {

                update_recoil(model)

                document.addEventListener(model, (e) => {
                    update_recoil(model)
                })
            }

        })
        
    }, [])
    // }, [dbTablesHadlers])

    return (
        <div>
            <div onClick={() => console.log('clg from recoil')}></div>
        </div>
    )
}
