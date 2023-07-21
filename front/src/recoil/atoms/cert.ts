import {atom, selector} from "recoil";
import { CertTypes } from "../../types";

export const certState = atom<CertTypes[]>({
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