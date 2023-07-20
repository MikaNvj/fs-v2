import {atom, selector} from "recoil";
import { Income } from "../../types";

export const icomeState = atom<Income[]>({
    key: 'icome',
    default: []
});

export const selectedicome = selector({
    key: 'detail-icome-selected',
    get: ({ get }) => ({id}: {id: string}) => {
        const objectArray = get(icomeState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)