import {atom, selector} from "recoil";
import { FormationTypes, Obj } from "../../types";

export const formationState = atom<FormationTypes[]>({
    key: 'formation',
    default: []
});

export const _formationState = atom<Obj<FormationTypes>>({
    key: '_formation',
    default: {}
})

export const selecteformation = selector({
    key: 'detailformation-selected',
    get: ({ get }) => ({id}: {id: string}) => {
        const objectArray = get(formationState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)