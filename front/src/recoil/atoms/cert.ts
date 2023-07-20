import {atom, selector} from "recoil";
import { Cert } from "../../types";

export const certState = atom<Cert[]>({
    key: 'cert',
    default: []
});

export const selectedcert = selector({
    key: 'detail-cert-selected',
    get: ({ get }) => ({id} : {id: string}) => {
        const objectArray = get(certState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)