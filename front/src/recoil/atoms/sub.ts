import {atom, selector} from "recoil";
import { Obj, SubTypes } from "../../types";

export const subState = atom<SubTypes[]>({
    key: 'sub',
    default: []
});

export const _subState = atom<Obj<SubTypes>>({
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