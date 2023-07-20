import {atom, selector} from "recoil";
import { Obj, Sub } from "../../types";

export const subState = atom<Sub[]>({
    key: 'sub',
    default: []
});

export const _subState = atom<Obj<Sub>>({
    key: '_sub',
    default: {}
});

export const selectedsub = selector({
    key: 'detail-sub-selected',
    get: ({ get }) => ({id}: {id: string}) => {
        const objectArray = get(subState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)