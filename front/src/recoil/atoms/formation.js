import {atom, selector} from "recoil";

export const formationState = atom({
    key: 'formation',
    default: []
});

export const _formationState = atom({
    key: '_formation',
    default: []
})
export const selecteformation = selector({
    key: 'detailformation-selected',
    get: ({ get }) => ({id}) => {
        const objectArray = get(formationState);
        return objectArray.find(obj => obj.id === id) || null;
      },
    }
)