import {atom} from "recoil";

import { AuthTypes } from '../../types'

export const authState = atom< AuthTypes>({
    key: 'auth',
    default: {
        user: {
            id: '',
        },
        token: ''
    }
})