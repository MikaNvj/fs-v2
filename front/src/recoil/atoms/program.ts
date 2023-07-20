import {atom, selector} from "recoil";
import { Program } from "../../types";

export const programState = atom<Program[]>({
    key: 'program',
    default: []
});
export const selectedprogram = selector({
    key: 'detail-program-selected',
    get: ({ get }) => ({id}: {id: string}) => {
        const objectArray = get(programState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)