import {atom, selector} from "recoil";
import { CopyTypes } from "../../types";

export const copyState = atom<CopyTypes[]>({
    key: 'copy',
    default: []
});

export const _copyState = atom<{[id: string]: CopyTypes}>({
    key: '_copy',
    default: {}
});

export const selectedcopy = selector({
    key: 'detail-copy-selected',
    get: ({ get }) => ({id}: {id: string}) => {
        const objectArray = get(copyState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)