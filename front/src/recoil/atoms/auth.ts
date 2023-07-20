import {atom} from "recoil";
import { Auth } from '../../types'

export const authState = atom< Auth>({
    key: 'auth',
    default: {
        user: {
            id: undefined,
        },
        token: ''
    }
});