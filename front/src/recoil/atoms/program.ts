import {atom, selector} from "recoil";
import { ProgramTypes } from "../../types";

export const programState = atom<ProgramTypes[]>({
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