import {atom, selector} from "recoil";
import { ConnexionTypes, Obj } from "../../types";

export const connexionState = atom<Obj<ConnexionTypes>>({
    key: 'connextion',
    default: {}
});

// export const selectedconnexion = selector({
//     key: 'detail-connexion-selected',
//     get: ({ get }) => ({id} : {id: string}) => {
//         const objectArray = get(connexionState);
//         return objectArray.find(obj => obj.id === id) || null;
//       },
//     }
// )