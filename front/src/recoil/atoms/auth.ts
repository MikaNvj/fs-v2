import {atom} from "recoil";
import { Auth } from "../../types";

export const authState = atom({
    key: 'auth',
    default: []
});